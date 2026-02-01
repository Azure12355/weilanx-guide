---
title: 链路追踪
icon: ri:git-branch-line
order: 6
---

# 链路追踪

分布式追踪帮助跟踪请求在多个服务间的传播路径。

## OpenTelemetry

### 初始化追踪

```go
import (
    "context"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/jaeger"
    "go.opentelemetry.io/otel/sdk/resource"
    "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

func InitTracer(serviceName, jaegerEndpoint string) (func(context.Context) error, error) {
    // 创建 Jaeger exporter
    exp, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(jaegerEndpoint)))
    if err != nil {
        return nil, err
    }

    // 创建资源
    res, err := resource.New(context.Background(),
        resource.WithAttributes(
            semconv.ServiceNameKey.String(serviceName),
            semconv.ServiceVersionKey.String("1.0.0"),
        ),
    )
    if err != nil {
        return nil, err
    }

    // 创建 TracerProvider
    tp := trace.NewTracerProvider(
        trace.WithBatcher(exp),
        trace.WithResource(res),
        trace.WithSampler(trace.AlwaysSample()),
    )

    // 注册为全局 TracerProvider
    otel.SetTracerProvider(tp)

    return tp.Shutdown, nil
}
```

### 创建 Span

```go
type UserService struct {
    tracer trace.Tracer
    repo   UserRepository
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{
        tracer: otel.Tracer("user-service"),
        repo:   repo,
    }
}

func (s *UserService) GetUser(ctx context.Context, userID string) (*User, error) {
    // 创建 Span
    ctx, span := s.tracer.Start(ctx, "UserService.GetUser",
        trace.WithAttributes(
            attribute.String("user.id", userID),
        ),
    )
    defer span.End()

    // 调用仓储
    user, err := s.repo.FindByID(ctx, userID)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "failed to get user")
        return nil, err
    }

    // 设置属性
    span.SetAttributes(
        attribute.String("user.name", user.Name),
        attribute.String("user.email", user.Email),
    )

    span.SetStatus(codes.Ok, "user retrieved successfully")
    return user, nil
}

func (s *UserService) CreateUser(ctx context.Context, name, email string) (*User, error) {
    ctx, span := s.tracer.Start(ctx, "UserService.CreateUser")
    defer span.End()

    // 验证输入
    if err := s.validateUser(ctx, name, email); err != nil {
        span.RecordError(err)
        return nil, err
    }

    // 创建用户
    user := &User{
        ID:        uuid.New().String(),
        Name:      name,
        Email:     email,
        CreatedAt: time.Now(),
    }

    if err := s.repo.Save(ctx, user); err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "failed to save user")
        return nil, err
    }

    span.SetStatus(codes.Ok, "user created successfully")
    return user, nil
}

func (s *UserService) validateUser(ctx context.Context, name, email string) error {
    _, span := s.tracer.Start(ctx, "UserService.validateUser")
    defer span.End()

    if name == "" {
        span.SetStatus(codes.Error, "name is required")
        return fmt.Errorf("name is required")
    }

    if !isValidEmail(email) {
        span.SetStatus(codes.Error, "invalid email format")
        return fmt.Errorf("invalid email format")
    }

    span.SetStatus(codes.Ok, "validation passed")
    return nil
}
```

## 上下文传播

### HTTP 中间件

```go
import (
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

func TracingMiddleware(serviceName string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return otelhttp.NewHandler(next, serviceName,
            otelhttp.WithSpanNameFormatter(func(operation string, r *http.Request) string {
                return fmt.Sprintf("%s %s", r.Method, r.URL.Path)
            }),
        )
    }
}

// 使用
func main() {
    // 初始化 Tracer
    shutdown, err := InitTracer("user-service", "http://jaeger:14268/api/traces")
    if err != nil {
        log.Fatal(err)
    }
    defer shutdown(context.Background())

    // 创建路由
    mux := http.NewServeMux()
    mux.HandleFunc("/users/", handleGetUser)

    // 应用追踪中间件
    handler := TracingMiddleware("user-service")(mux)

    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", handler))
}
```

### gRPC 拦截器

```go
import "go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"

func NewGRPCServer(serviceName string) *grpc.Server {
    // 创建 gRPC 服务器
    server := grpc.NewServer(
        grpc.ChainUnaryInterceptor(
            otelgrpc.UnaryServerInterceptor(),
            LoggingInterceptor,
        ),
    )

    return server
}

func NewGRPCClient(serviceName string) (pb.UserServiceClient, error) {
    // 创建连接
    conn, err := grpc.Dial("user-service:50051",
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithChainUnaryInterceptor(
            otelgrpc.UnaryClientInterceptor(),
        ),
    )
    if err != nil {
        return nil, err
    }

    return pb.NewUserServiceClient(conn), nil
}
```

### 手动传播

```go
type contextKey string

const (
    TraceIDKey   contextKey = "trace_id"
    SpanIDKey    contextKey = "span_id"
    TraceFlagKey contextKey = "trace_flag"
)

// 注入到 HTTP Header
func InjectTraceContext(ctx context.Context, req *http.Request) {
    span := trace.SpanFromContext(ctx)
    spanCtx := span.SpanContext()

    req.Header.Set("X-Trace-ID", spanCtx.TraceID().String())
    req.Header.Set("X-Span-ID", spanCtx.SpanID().String())
    req.Header.Set("X-Trace-Flags", strconv.FormatUint(uint64(spanCtx.TraceFlags()), 10))
}

// 从 HTTP Header 提取
func ExtractTraceContext(ctx context.Context, req *http.Request) context.Context {
    traceIDStr := req.Header.Get("X-Trace-ID")
    spanIDStr := req.Header.Get("X-Span-ID")

    var traceID trace.TraceID
    var spanID trace.SpanID

    traceID, _ = trace.TraceIDFromHex(traceIDStr)
    spanID, _ = trace.SpanIDFromHex(spanIDStr)

    spanCtx := trace.NewSpanContext(trace.SpanContextConfig{
        TraceID:    traceID,
        SpanID:     spanID,
        TraceFlags: trace.FlagsSampled,
    })

    return trace.ContextWithSpanContext(ctx, spanCtx)
}
```

## 分布式事件

### 添加事件

```go
func (s *OrderService) CreateOrder(ctx context.Context, req *CreateOrderRequest) (*Order, error) {
    ctx, span := s.tracer.Start(ctx, "OrderService.CreateOrder")
    defer span.End()

    // 创建订单
    order := &Order{
        ID:        uuid.New().String(),
        UserID:    req.UserID,
        Items:     req.Items,
        Status:    "pending",
        CreatedAt: time.Now(),
    }

    // 添加事件
    span.AddEvent("order.created",
        trace.WithAttributes(
            attribute.String("order.id", order.ID),
            attribute.String("order.user_id", order.UserID),
            attribute.Int("order.items_count", len(order.Items)),
        ),
    )

    // 保存订单
    if err := s.repo.Save(ctx, order); err != nil {
        span.RecordError(err)
        span.AddEvent("order.save_failed")
        return nil, err
    }

    span.AddEvent("order.saved")
    span.SetStatus(codes.Ok, "order created")

    return order, nil
}
```

### 异常处理

```go
func (s *PaymentService) ProcessPayment(ctx context.Context, orderID string, amount float64) error {
    ctx, span := s.tracer.Start(ctx, "PaymentService.ProcessPayment")
    defer span.End()

    // 检查余额
    balance, err := s.checkBalance(ctx, orderID)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "balance check failed")
        return err
    }

    if balance < amount {
        err := fmt.Errorf("insufficient balance")
        span.RecordError(err,
            trace.WithAttributes(
                attribute.Float64("payment.balance", balance),
                attribute.Float64("payment.amount", amount),
            ),
        )
        span.SetStatus(codes.Error, "payment declined")
        return err
    }

    // 处理支付
    if err := s.deduct(ctx, orderID, amount); err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "payment processing failed")
        return err
    }

    span.SetStatus(codes.Ok, "payment processed")
    return nil
}
```

## 集成 Jaeger

### 本地 Jaeger

```go
func InitLocalJaeger(serviceName string) (func(context.Context) error, error) {
    // 使用 All-in-One Jaeger
    exp, err := jaeger.New(jaeger.WithCollectorEndpoint(
        jaeger.WithEndpoint("http://localhost:14268/api/traces"),
    ))
    if err != nil {
        return nil, err
    }

    tp := trace.NewTracerProvider(
        trace.WithBatcher(exp),
        trace.WithResource(
            resource.NewWithAttributes(
                semconv.SchemaURL,
                semconv.ServiceNameKey.String(serviceName),
            ),
        ),
    )

    otel.SetTracerProvider(tp)

    return tp.Shutdown, nil
}
```

### Docker Compose

```yaml
version: '3.8'

services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
      - COLLECTOR_OTLP_ENABLED=true

  user-service:
    build: ./services/user
    environment:
      - JAEGER_ENDPOINT=http://jaeger:14268/api/traces
    depends_on:
      - jaeger

  order-service:
    build: ./services/order
    environment:
      - JAEGER_ENDPOINT=http://jaeger:14268/api/traces
    depends_on:
      - jaeger
      - user-service
```

## 最佳实践

::: tip 链路追踪建议

1. **统一 Trace ID** - 跨服务传播 Trace ID
2. **Span 命名** - 使用有意义的 Span 名称
3. **事件记录** - 记录关键事件和错误
4. **属性标记** - 添加有用的属性
5. **采样策略** - 合理配置采样率

:::

```go
// ✅ 好的追踪模式
func handleRequest(ctx context.Context, req *Request) (*Response, error) {
    ctx, span := tracer.Start(ctx, "handleRequest")
    defer span.End()

    // 设置属性
    span.SetAttributes(
        attribute.String("request.id", req.ID),
        attribute.String("request.type", req.Type),
    )

    // 处理请求
    result, err := processRequest(ctx, req)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, err.Error())
        return nil, err
    }

    span.SetStatus(codes.Ok, "success")
    return result, nil
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **OpenTelemetry** - 标准追踪库 |
| **上下文传播** - Trace ID 传递 |
| **Span** - 追踪单元 |
| **事件** - 记录关键事件 |
| **Jaeger** - 追踪后端 |

::: v-pre

[服务发现](./service-discovery.md) → [消息队列](./message-queue.md)

:::
