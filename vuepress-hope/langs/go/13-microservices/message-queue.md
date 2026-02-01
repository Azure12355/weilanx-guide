---
title: 消息队列
icon: ri:queue-line
order: 7
---

# 消息队列

消息队列实现服务间的异步通信和解耦。

## RabbitMQ

### 基础连接

```go
import amqp "github.com/rabbitmq/amqp091-go"

type RabbitMQClient struct {
    conn *amqp.Connection
    channel *amqp.Channel
}

func NewRabbitMQClient(url string) (*RabbitMQClient, error) {
    conn, err := amqp.Dial(url)
    if err != nil {
        return nil, err
    }

    ch, err := conn.Channel()
    if err != nil {
        conn.Close()
        return nil, err
    }

    return &RabbitMQClient{
        conn: conn,
        channel: ch,
    }, nil
}

func (c *RabbitMQClient) Close() error {
    if err := c.channel.Close(); err != nil {
        return err
    }
    return c.conn.Close()
}
```

### 发布消息

```go
type MessagePublisher struct {
    channel *amqp.Channel
}

func NewMessagePublisher(client *RabbitMQClient) *MessagePublisher {
    return &MessagePublisher{channel: client.channel}
}

func (p *MessagePublisher) Publish(ctx context.Context, exchange, routingKey string, message interface{}) error {
    // 声明交换机
    if err := p.channel.ExchangeDeclare(
        exchange,
        "direct", // 交换机类型
        true,     // durable
        false,    // auto-deleted
        false,    // internal
        false,    // no-wait
        nil,      // arguments
    ); err != nil {
        return err
    }

    // 序列化消息
    body, err := json.Marshal(message)
    if err != nil {
        return err
    }

    // 发布消息
    return p.channel.PublishWithContext(
        ctx,
        exchange,
        routingKey,
        false, // mandatory
        false, // immediate
        amqp.Publishing{
            ContentType:  "application/json",
            Body:         body,
            DeliveryMode: amqp.Persistent,
            Timestamp:    time.Now(),
            MessageId:    uuid.New().String(),
        },
    )
}
```

### 消费消息

```go
type MessageConsumer struct {
    channel *amqp.Channel
    handlers map[string]func([]byte) error
}

func NewMessageConsumer(client *RabbitMQClient) *MessageConsumer {
    return &MessageConsumer{
        channel: client.channel,
        handlers: make(map[string]func([]byte) error),
    }
}

func (c *MessageConsumer) RegisterHandler(queue string, handler func([]byte) error) error {
    // 声明队列
    q, err := c.channel.QueueDeclare(
        queue,
        true,  // durable
        false, // auto-delete
        false, // exclusive
        false, // no-wait
        nil,   // arguments
    )
    if err != nil {
        return err
    }

    // 绑定交换机
    err = c.channel.QueueBind(
        q.Name,
        q.Name,     // routing key
        "events",   // exchange
        false,
        nil,
    )
    if err != nil {
        return err
    }

    c.handlers[q.Name] = handler
    return nil
}

func (c *MessageConsumer) Consume(ctx context.Context) error {
    for queue, handler := range c.handlers {
        msgs, err := c.channel.Consume(
            queue,
            "",    // consumer tag
            false, // auto-ack
            false, // exclusive
            false, // no-local
            false, // no-wait
            nil,   // args
        )
        if err != nil {
            return err
        }

        go c.processMessages(ctx, msgs, handler)
    }

    return nil
}

func (c *MessageConsumer) processMessages(ctx context.Context, msgs <-chan amqp.Delivery, handler func([]byte) error) {
    for {
        select {
        case <-ctx.Done():
            return
        case msg, ok := <-msgs:
            if !ok {
                return
            }

            if err := handler(msg.Body); err != nil {
                log.Printf("Message handling failed: %v", err)
                msg.Nack(false, true) // requeue
            } else {
                msg.Ack(false)
            }
        }
    }
}
```

## 消息模式

### 工作队列

```go
// 多个消费者竞争处理任务
func setupWorkQueue() error {
    client, err := NewRabbitMQClient("amqp://guest:guest@localhost:5672/")
    if err != nil {
        return err
    }
    defer client.Close()

    // 声明队列
    _, err = client.channel.QueueDeclare(
        "task_queue",
        true,  // durable
        false, // auto-delete
        false, // exclusive
        false, // no-wait
        amqp.Table{
            "x-max-priority": 10, // 优先级队列
        },
    )
    if err != nil {
        return err
    }

    // 设置 QoS
    err = client.channel.Qos(
        10,    // prefetch count
        0,     // prefetch size
        false, // global
    )
    if err != nil {
        return err
    }

    return nil
}

func publishTask(publisher *MessagePublisher, task Task) error {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    return publisher.Publish(ctx, "", "task_queue", task)
}
```

### 发布订阅

```go
// 广播消息到多个消费者
func setupFanout() error {
    client, err := NewRabbitMQClient("amqp://guest:guest@localhost:5672/")
    if err != nil {
        return err
    }
    defer client.Close()

    // 声明 fanout 交换机
    err = client.channel.ExchangeDeclare(
        "logs",
        "fanout",
        true,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        return err
    }

    // 声明临时队列
    q, err := client.channel.QueueDeclare(
        "",
        false, // non-durable
        false,
        true,  // exclusive
        false,
        nil,
    )
    if err != nil {
        return err
    }

    // 绑定队列到交换机
    err = client.channel.QueueBind(
        q.Name,
        "",
        "logs",
        false,
        nil,
    )

    return err
}
```

### 路由模式

```go
// 根据路由键路由消息
func setupDirect() error {
    client, err := NewRabbitMQClient("amqp://guest:guest@localhost:5672/")
    if err != nil {
        return err
    }
    defer client.Close()

    // 声明 direct 交换机
    err = client.channel.ExchangeDeclare(
        "direct_logs",
        "direct",
        true,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        return err
    }

    // 声明队列并绑定
    severities := []string{"info", "warning", "error"}

    for _, severity := range severities {
        q, err := client.channel.QueueDeclare(
            "",
            false,
            false,
            true,
            false,
            nil,
        )
        if err != nil {
            return err
        }

        err = client.channel.QueueBind(
            q.Name,
            severity,
            "direct_logs",
            false,
            nil,
        )
        if err != nil {
            return err
        }
    }

    return nil
}
```

### 主题模式

```go
// 基于模式匹配路由
func setupTopic() error {
    client, err := NewRabbitMQClient("amqp://guest:guest@localhost:5672/")
    if err != nil {
        return err
    }
    defer client.Close()

    // 声明 topic 交换机
    err = client.channel.ExchangeDeclare(
        "topic_logs",
        "topic",
        true,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        return err
    }

    // 绑定示例
    bindings := []struct {
        queue string
        key   string
    }{
        {"Q1", "*.orange.*"},
        {"Q2", "*.*.rabbit"},
        {"Q3", "lazy.#"},
    }

    for _, binding := range bindings {
        q, err := client.channel.QueueDeclare(
            binding.queue,
            false,
            false,
            true,
            false,
            nil,
        )
        if err != nil {
            return err
        }

        err = client.channel.QueueBind(
            q.Name,
            binding.key,
            "topic_logs",
            false,
            nil,
        )
        if err != nil {
            return err
        }
    }

    return nil
}
```

## Kafka

### 生产者

```go
import "github.com/segmentio/kafka-go"

type KafkaProducer struct {
    writer *kafka.Writer
}

func NewKafkaProducer(brokers []string, topic string) *KafkaProducer {
    return &KafkaProducer{
        writer: &kafka.Writer{
            Addr:     kafka.TCP(brokers...),
            Topic:    topic,
            Balancer: &kafka.LeastBytes{},
            // 配置
            Compression:      kafka.Snappy,
            BatchSize:        100,
            BatchBytes:       1024 * 1024,
            BatchTimeout:     10 * time.Millisecond,
            ReadTimeout:      10 * time.Second,
            WriteTimeout:     10 * time.Second,
            RequiredAcks:     kafka.RequireAll,
            AllowAutoTopicCreation: true,
        },
    }
}

func (p *KafkaProducer) Produce(ctx context.Context, key string, value interface{}) error {
    // 序列化
    data, err := json.Marshal(value)
    if err != nil {
        return err
    }

    // 发送消息
    return p.writer.WriteMessages(ctx, kafka.Message{
        Key:   []byte(key),
        Value: data,
        Headers: []kafka.Header{
            {Key: "content-type", Value: []byte("application/json")},
        },
        Time: time.Now(),
    })
}

func (p *KafkaProducer) Close() error {
    return p.writer.Close()
}
```

### 消费者

```go
type KafkaConsumer struct {
    reader *kafka.Reader
    handler func([]byte) error
}

func NewKafkaConsumer(brokers []string, topic, groupID string) *KafkaConsumer {
    return &KafkaConsumer{
        reader: kafka.NewReader(kafka.ReaderConfig{
            Brokers:  brokers,
            GroupID:  groupID,
            Topic:    topic,
            MinBytes: 10e3,
            MaxBytes: 10e6,
            // 配置
            CommitInterval: time.Second,
            StartOffset:    kafka.FirstOffset,
            RetentionTime:  time.Hour * 24,
        }),
    }
}

func (c *KafkaConsumer) RegisterHandler(handler func([]byte) error) {
    c.handler = handler
}

func (c *KafkaConsumer) Consume(ctx context.Context) error {
    for {
        msg, err := c.reader.FetchMessage(ctx)
        if err != nil {
            if errors.Is(err, context.Canceled) {
                return nil
            }
            return err
        }

        // 处理消息
        if err := c.handler(msg.Value); err != nil {
            log.Printf("Message handling failed: %v", err)
            // 不提交偏移量，下次重新处理
            continue
        }

        // 提交偏移量
        if err := c.reader.CommitMessages(ctx, msg); err != nil {
            log.Printf("Failed to commit message: %v", err)
        }
    }
}

func (c *KafkaConsumer) Close() error {
    return c.reader.Close()
}
```

### 分区策略

```go
// 自定义分区器
type CustomPartitioner struct{}

func (p *CustomPartitioner) Partition(topic string, msg kafka.Message, numPartitions int) (int, error) {
    // 基于消息键哈希
    if len(msg.Key) > 0 {
        hash := fnv.New32a()
        hash.Write(msg.Key)
        return int(hash.Sum32()) % numPartitions, nil
    }

    // 随机分区
    return rand.Intn(numPartitions), nil
}

func (p *KafkaProducer) ProduceWithPartitioner(ctx context.Context, key string, value interface{}) error {
    data, err := json.Marshal(value)
    if err != nil {
        return err
    }

    // 使用自定义分区器
    partitioner := &CustomPartitioner{}
    partition, err := partitioner.Partition(p.writer.Topic(), kafka.Message{
        Key:   []byte(key),
        Value: data,
    }, 10) // 假设10个分区
    if err != nil {
        return err
    }

    return p.writer.WriteMessages(ctx, kafka.Message{
        Topic:    p.writer.Topic(),
        Partition: partition,
        Key:      []byte(key),
        Value:    data,
    })
}
```

## 消息重试

### 重试策略

```go
type RetryPolicy struct {
    MaxAttempts int
    InitialDelay time.Duration
    MaxDelay     time.Duration
    Multiplier   float64
}

func DefaultRetryPolicy() *RetryPolicy {
    return &RetryPolicy{
        MaxAttempts:  3,
        InitialDelay: 100 * time.Millisecond,
        MaxDelay:     10 * time.Second,
        Multiplier:   2.0,
    }
}

type RetryableMessage struct {
    Attempts int
    LastAttempt time.Time
    NextAttempt time.Time
    Payload []byte
}

func (m *RetryableMessage) ShouldRetry(policy *RetryPolicy) bool {
    if m.Attempts >= policy.MaxAttempts {
        return false
    }
    return time.Now().After(m.NextAttempt)
}

func (m *RetryableMessage) CalculateNextDelay(policy *RetryPolicy) {
    m.Attempts++
    delay := policy.InitialDelay

    for i := 1; i < m.Attempts; i++ {
        delay = time.Duration(float64(delay) * policy.Multiplier)
        if delay > policy.MaxDelay {
            delay = policy.MaxDelay
            break
        }
    }

    m.NextAttempt = time.Now().Add(delay)
}
```

### 死信队列

```go
func setupDeadLetterQueue(client *RabbitMQClient) error {
    // 死信交换机
    err := client.channel.ExchangeDeclare(
        "dlx",
        "direct",
        true,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        return err
    }

    // 死信队列
    _, err = client.channel.QueueDeclare(
        "dead_letter_queue",
        true,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        return err
    }

    // 绑定
    err = client.channel.QueueBind(
        "dead_letter_queue",
        "dead_letter",
        "dlx",
        false,
        nil,
    )
    if err != nil {
        return err
    }

    // 主队列配置死信
    _, err = client.channel.QueueDeclare(
        "main_queue",
        true,
        false,
        false,
        false,
        amqp.Table{
            "x-dead-letter-exchange":    "dlx",
            "x-dead-letter-routing-key": "dead_letter",
        },
    )

    return err
}
```

## 最佳实践

::: tip 消息队列建议

1. **确认机制** - 正确处理消息确认
2. **持久化** - 重要消息持久化存储
3. **重试策略** - 合理的重试机制
4. **死信队列** - 处理失败消息
5. **幂等性** - 消费者实现幂等处理

:::

```go
// ✅ 好的消息处理模式
func handleMessage(msg []byte) error {
    // 1. 解析消息
    var event OrderEvent
    if err := json.Unmarshal(msg, &event); err != nil {
        return err
    }

    // 2. 幂等性检查
    if isProcessed(event.ID) {
        return nil
    }

    // 3. 处理业务逻辑
    if err := processOrder(event); err != nil {
        return err
    }

    // 4. 标记已处理
    markAsProcessed(event.ID)

    return nil
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **RabbitMQ** - 传统消息队列 |
| **Kafka** - 高吞吐消息流 |
| **发布订阅** - 解耦服务 |
| **重试机制** - 处理失败 |
| **死信队列** - 容错处理 |

::: v-pre

[链路追踪](./tracing.md) → [实战项目](/langs/go/14-practice/)

:::
