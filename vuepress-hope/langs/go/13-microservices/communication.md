---
title: 服务通信
icon: ri:exchange-funds-line
order: 3
---

# 服务通信

微服务之间需要高效、可靠的通信机制。

## 同步通信

### REST 客户端

```go
// 基础 REST 客户端
type RestClient struct {
    baseURL    string
    httpClient *http.Client
    logger     *zap.Logger
}

func NewRestClient(baseURL string, logger *zap.Logger) *RestClient {
    return &RestClient{
        baseURL: baseURL,
        httpClient: &http.Client{
            Timeout: 30 * time.Second,
            Transport: &http.Transport{
                MaxIdleConns:        100,
                MaxIdleConnsPerHost: 10,
                IdleConnTimeout:     90 * time.Second,
            },
        },
        logger: logger,
    }
}

func (c *RestClient) Do(ctx context.Context, method, path string, body interface{}, result interface{}) error {
    var reqBody io.Reader
    if body != nil {
        jsonBody, err := json.Marshal(body)
        if err != nil {
            return err
        }
        reqBody = bytes.NewReader(jsonBody)
    }

    url := c.baseURL + path
    req, err := http.NewRequestWithContext(ctx, method, url, reqBody)
    if err != nil {
        return err
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Accept", "application/json")

    resp, err := c.httpClient.Do(req)
    if err != nil {
        c.logger.Error("Request failed",
            zap.String("url", url),
            zap.Error(err))
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode >= 400 {
        return fmt.Errorf("request failed with status %d", resp.StatusCode)
    }

    if result != nil {
        if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
            return err
        }
    }

    return nil
}
```

### 重试客户端

```go
type RetryableClient struct {
    client     *RestClient
    maxRetries int
    backoff    BackoffStrategy
}

type BackoffStrategy interface {
    NextDelay(attempt int) time.Duration
}

type ExponentialBackoff struct {
    InitialDelay time.Duration
    MaxDelay     time.Duration
    Multiplier   float64
}

func (b *ExponentialBackoff) NextDelay(attempt int) time.Duration {
    delay := float64(b.InitialDelay) * math.Pow(b.Multiplier, float64(attempt))
    if delay > float64(b.MaxDelay) {
        return b.MaxDelay
    }
    return time.Duration(delay)
}

func (c *RetryableClient) Do(ctx context.Context, method, path string, body interface{}, result interface{}) error {
    var lastErr error

    for attempt := 0; attempt <= c.maxRetries; attempt++ {
        err := c.client.Do(ctx, method, path, body, result)
        if err == nil {
            return nil
        }

        lastErr = err

        // 判断是否可重试
        if !isRetryable(err) {
            return err
        }

        if attempt < c.maxRetries {
            delay := c.backoff.NextDelay(attempt)
            time.Sleep(delay)
        }
    }

    return fmt.Errorf("max retries exceeded: %w", lastErr)
}

func isRetryable(err error) bool {
    // 网络错误、超时可重试
    if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
        return true
    }

    // 5xx 错误可重试
    if strings.Contains(err.Error(), "5") {
        return true
    }

    return false
}
```

### 熔断客户端

```go
type CircuitBreakerClient struct {
    client *RestClient
    cb     *CircuitBreaker
}

func (c *CircuitBreakerClient) Do(ctx context.Context, method, path string, body interface{}, result interface{}) error {
    return c.cb.Execute(func() error {
        return c.client.Do(ctx, method, path, body, result)
    })
}
```

## gRPC 通信

### gRPC 客户端

```go
type UserGRPCClient struct {
    conn   *grpc.ClientConn
    client pb.UserServiceClient
    logger *zap.Logger
}

func NewUserGRPCClient(addr string, logger *zap.Logger) (*UserGRPCClient, error) {
    conn, err := grpc.Dial(addr,
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithUnaryInterceptor(interceptor),
    )
    if err != nil {
        return nil, err
    }

    return &UserGRPCClient{
        conn:   conn,
        client: pb.NewUserServiceClient(conn),
        logger: logger,
    }, nil
}

func interceptor(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
    // 记录请求
    log.Printf("Calling %s", method)

    // 调用方法
    err := invoker(ctx, method, req, reply, cc, opts...)

    // 记录响应
    if err != nil {
        log.Printf("Method %s failed: %v", method, err)
    } else {
        log.Printf("Method %s succeeded", method)
    }

    return err
}

func (c *UserGRPCClient) GetUser(ctx context.Context, userID string) (*pb.User, error) {
    req := &pb.GetUserRequest{
        UserId: userID,
    }

    resp, err := c.client.GetUser(ctx, req)
    if err != nil {
        c.logger.Error("Failed to get user",
            zap.String("user_id", userID),
            zap.Error(err))
        return nil, err
    }

    return resp.User, nil
}

func (c *UserGRPCClient) Close() error {
    return c.conn.Close()
}
```

### gRPC 流式通信

```go
type NotificationClient struct {
    client pb.NotificationServiceClient
}

func (c *NotificationClient) StreamNotifications(ctx context.Context) (<-chan *pb.Notification, error) {
    stream, err := c.client.StreamNotifications(ctx, &pb.StreamRequest{})
    if err != nil {
        return nil, err
    }

    ch := make(chan *pb.Notification)

    go func() {
        defer close(ch)

        for {
            resp, err := stream.Recv()
            if err == io.EOF {
                return
            }
            if err != nil {
                log.Printf("Stream error: %v", err)
                return
            }

            ch <- resp.Notification
        }
    }()

    return ch, nil
}

func (c *NotificationClient) SendNotifications(notifications []*pb.Notification) error {
    stream, err := c.client.SendNotifications(context.Background())
    if err != nil {
        return err
    }

    for _, notif := range notifications {
        if err := stream.Send(&pb.SendRequest{
            Notification: notif,
        }); err != nil {
            return err
        }
    }

    _, err = stream.CloseAndRecv()
    return err
}
```

## 异步通信

### 消息发布者

```go
type MessagePublisher struct {
    conn *amqp.Connection
}

func NewMessagePublisher(rabbitmqURL string) (*MessagePublisher, error) {
    conn, err := amqp.Dial(rabbitmqURL)
    if err != nil {
        return nil, err
    }

    return &MessagePublisher{conn: conn}, nil
}

func (p *MessagePublisher) Publish(ctx context.Context, exchange, routingKey string, message interface{}) error {
    ch, err := p.conn.Channel()
    if err != nil {
        return err
    }
    defer ch.Close()

    body, err := json.Marshal(message)
    if err != nil {
        return err
    }

    return ch.PublishWithContext(
        ctx,
        exchange,
        routingKey,
        false,
        false,
        amqp.Publishing{
            ContentType:  "application/json",
            Body:         body,
            DeliveryMode: amqp.Persistent,
            Timestamp:    time.Now(),
        },
    )
}

func (p *MessagePublisher) PublishEvent(ctx context.Context, event Event) error {
    envelope := MessageEnvelope{
        Type:      event.EventType(),
        ID:        uuid.New().String(),
        Timestamp: time.Now(),
        Payload:   event,
    }

    return p.Publish(ctx, "events", event.EventType(), envelope)
}

type Event interface {
    EventType() string
}

type MessageEnvelope struct {
    Type      string      `json:"type"`
    ID        string      `json:"id"`
    Timestamp time.Time   `json:"timestamp"`
    Payload   interface{} `json:"payload"`
}
```

### 消息消费者

```go
type MessageConsumer struct {
    conn       *amqp.Connection
    handlers   map[string]func([]byte) error
    middleware []func(func([]byte) error) func([]byte) error
}

func NewMessageConsumer(rabbitmqURL string) (*MessageConsumer, error) {
    conn, err := amqp.Dial(rabbitmqURL)
    if err != nil {
        return nil, err
    }

    return &MessageConsumer{
        conn:     conn,
        handlers: make(map[string]func([]byte) error),
    }, nil
}

func (c *MessageConsumer) RegisterHandler(eventType string, handler func([]byte) error) {
    c.handlers[eventType] = handler
}

func (c *MessageConsumer) Use(middleware func(func([]byte) error) func([]byte) error) {
    c.middleware = append(c.middleware, middleware)
}

func (c *MessageConsumer) Consume(queue string) error {
    ch, err := c.conn.Channel()
    if err != nil {
        return err
    }

    msgs, err := ch.Consume(
        queue,
        "",
        false,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        return err
    }

    for msg := range msgs {
        if err := c.handleMessage(msg); err != nil {
            log.Printf("Message handling failed: %v", err)
            msg.Nack(false, true)
        } else {
            msg.Ack(false)
        }
    }

    return nil
}

func (c *MessageConsumer) handleMessage(msg amqp.Delivery) error {
    var envelope MessageEnvelope
    if err := json.Unmarshal(msg.Body, &envelope); err != nil {
        return err
    }

    handler, exists := c.handlers[envelope.Type]
    if !exists {
        return fmt.Errorf("no handler for type: %s", envelope.Type)
    }

    payload, err := json.Marshal(envelope.Payload)
    if err != nil {
        return err
    }

    // 应用中间件
    next := handler
    for i := len(c.middleware) - 1; i >= 0; i-- {
        next = c.middleware[i](next)
    }

    return next(payload)
}
```

### 消费者中间件

```go
// 重试中间件
func RetryMiddleware(maxRetries int, delay time.Duration) func(func([]byte) error) func([]byte) error {
    return func(next func([]byte) error) func([]byte) error {
        return func(data []byte) error {
            var lastErr error
            for attempt := 0; attempt <= maxRetries; attempt++ {
                if err := next(data); err == nil {
                    return nil
                } else {
                    lastErr = err
                    time.Sleep(delay)
                }
            }
            return fmt.Errorf("max retries exceeded: %w", lastErr)
        }
    }
}

// 超时中间件
func TimeoutMiddleware(timeout time.Duration) func(func([]byte) error) func([]byte) error {
    return func(next func([]byte) error) func([]byte) error {
        return func(data []byte) error {
            ctx, cancel := context.WithTimeout(context.Background(), timeout)
            defer cancel()

            done := make(chan error, 1)
            go func() {
                done <- next(data)
            }()

            select {
            case err := <-done:
                return err
            case <-ctx.Done():
                return fmt.Errorf("message processing timeout")
            }
        }
    }
}

// 死信队列中间件
func DeadLetterMiddleware(exchange, queue string) func(func([]byte) error) func([]byte) error {
    return func(next func([]byte) error) func([]byte) error {
        return func(data []byte) error {
            if err := next(data); err != nil {
                // 发送到死信队列
                // TODO: 实现死信逻辑
                return err
            }
            return nil
        }
    }
}
```

## 事件驱动

### 事件定义

```go
// 领域事件接口
type DomainEvent interface {
    EventType() string
    AggregateID() string
    OccurredOn() time.Time
}

// 基础事件
type BaseEvent struct {
    eventType  string
    aggregateID string
    occurredOn  time.Time
}

func (e *BaseEvent) EventType() string {
    return e.eventType
}

func (e *BaseEvent) AggregateID() string {
    return e.aggregateID
}

func (e *BaseEvent) OccurredOn() time.Time {
    return e.occurredOn
}

// 具体事件
type OrderCreatedEvent struct {
    BaseEvent
    OrderID   string
    UserID    string
    Items     []OrderItem
    TotalAmount float64
}

func NewOrderCreatedEvent(orderID, userID string, items []OrderItem, total float64) *OrderCreatedEvent {
    return &OrderCreatedEvent{
        BaseEvent: BaseEvent{
            eventType:   "order.created",
            aggregateID: orderID,
            occurredOn:  time.Now(),
        },
        OrderID:     orderID,
        UserID:      userID,
        Items:       items,
        TotalAmount: total,
    }
}
```

### 事件发布

```go
type EventDispatcher struct {
    publisher *MessagePublisher
    handlers  map[string][]EventHandler
}

type EventHandler interface {
    Handle(ctx context.Context, event DomainEvent) error
}

func NewEventDispatcher(publisher *MessagePublisher) *EventDispatcher {
    return &EventDispatcher{
        publisher: publisher,
        handlers:  make(map[string][]EventHandler),
    }
}

func (d *EventDispatcher) Register(eventType string, handler EventHandler) {
    d.handlers[eventType] = append(d.handlers[eventType], handler)
}

func (d *EventDispatcher) Dispatch(ctx context.Context, event DomainEvent) error {
    // 发布到消息队列
    if err := d.publisher.PublishEvent(ctx, event); err != nil {
        return err
    }

    // 本地处理器
    for _, handler := range d.handlers[event.EventType()] {
        if err := handler.Handle(ctx, event); err != nil {
            log.Printf("Handler error: %v", err)
        }
    }

    return nil
}
```

### 事件存储

```go
type EventStore interface {
    Save(ctx context.Context, events []DomainEvent) error
    GetEvents(ctx context.Context, aggregateID string) ([]DomainEvent, error)
}

type PostgresEventStore struct {
    db *gorm.DB
}

type EventRecord struct {
    ID          uuid.UUID `gorm:"type:uuid;primary_key"`
    AggregateID string
    EventType   string
    Payload     []byte
    Timestamp   time.Time
}

func (s *PostgresEventStore) Save(ctx context.Context, events []DomainEvent) error {
    return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        for _, event := range events {
            payload, err := json.Marshal(event)
            if err != nil {
                return err
            }

            record := EventRecord{
                ID:          uuid.New(),
                AggregateID: event.AggregateID(),
                EventType:   event.EventType(),
                Payload:     payload,
                Timestamp:   event.OccurredOn(),
            }

            if err := tx.Create(&record).Error; err != nil {
                return err
            }
        }
        return nil
    })
}

func (s *PostgresEventStore) GetEvents(ctx context.Context, aggregateID string) ([]DomainEvent, error) {
    var records []EventRecord
    if err := s.db.WithContext(ctx).
        Where("aggregate_id = ?", aggregateID).
        Order("timestamp ASC").
        Find(&records).Error; err != nil {
        return nil, err
    }

    events := make([]DomainEvent, len(records))
    for i, record := range records {
        var event OrderCreatedEvent
        if err := json.Unmarshal(record.Payload, &event); err != nil {
            return nil, err
        }
        events[i] = &event
    }

    return events, nil
}
```

## 最佳实践

::: tip 服务通信建议

1. **同步通信** - REST 用于简单查询
2. **异步通信** - 消息队列解耦服务
3. **事件驱动** - 使用事件实现最终一致性
4. **重试机制** - 处理临时故障
5. **熔断保护** - 防止级联失败

:::

```go
// ✅ 好的通信模式
// 1. 同步调用 - 简单查询
user, err := userClient.GetUser(ctx, userID)

// 2. 异步事件 - 状态变更
event := NewOrderCreatedEvent(orderID, userID, items, total)
eventDispatcher.Dispatch(ctx, event)

// 3. 消息队列 - 最终一致性
publisher.Publish(ctx, "orders", "order.created", order)
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **REST** - 简单的同步通信 |
| **gRPC** - 高性能 RPC 通信 |
| **消息队列** - 异步解耦通信 |
| **事件驱动** - 最终一致性 |
| **重试熔断** - 弹性通信 |

::: v-pre

[架构设计](./architecture.md) → [服务发现](./discovery.md)

:::
