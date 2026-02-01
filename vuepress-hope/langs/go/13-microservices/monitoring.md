---
title: 可观测性
icon: ri:eye-2-line
order: 6
---

# 可观测性

可观测性帮助理解分布式系统的运行状态。

## 日志聚合

### 结构化日志

```go
import "go.uber.org/zap"

type Logger struct {
    zap *zap.Logger
}

func NewLogger(serviceName string) (*Logger, error) {
    zapLogger, err := zap.NewProduction()
    if err != nil {
        return nil, err
    }

    zapLogger = zapLogger.With(
        zap.String("service", serviceName),
        zap.String("version", getVersion()),
    )

    return &Logger{zap: zapLogger}, nil
}

func (l *Logger) Info(msg string, fields ...zap.Field) {
    l.zap.Info(msg, fields...)
}

func (l *Logger) Error(msg string, fields ...zap.Field) {
    l.zap.Error(msg, fields...)
}

func (l *Logger) Debug(msg string, fields ...zap.Field) {
    l.zap.Debug(msg, fields...)
}

func (l *Logger) With(fields ...zap.Field) *Logger {
    return &Logger{zap: l.zap.With(fields...)}
}
```

### 日志中间件

```go
func LoggingMiddleware(logger *zap.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        path := c.Request.URL.Path
        query := c.Request.URL.RawQuery

        // 处理请求
        c.Next()

        // 记录日志
        latency := time.Since(start)
        status := c.Writer.Status()

        logger.Info("Request",
            zap.String("method", c.Request.Method),
            zap.String("path", path),
            zap.String("query", query),
            zap.Int("status", status),
            zap.Duration("latency", latency),
            zap.String("ip", c.ClientIP()),
            zap.String("user-agent", c.Request.UserAgent()),
        )
    }
}
```

### 上下文传播

```go
type contextKey string

const (
    TraceIDKey   contextKey = "trace_id"
    SpanIDKey    contextKey = "span_id"
    ParentSpanID contextKey = "parent_span_id"
)

func ContextMiddleware(logger *zap.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 生成或获取 Trace ID
        traceID := c.GetHeader("X-Trace-ID")
        if traceID == "" {
            traceID = uuid.New().String()
        }

        // 生成 Span ID
        spanID := uuid.New().String()

        // 存储到上下文
        ctx := context.WithValue(c.Request.Context(), TraceIDKey, traceID)
        ctx = context.WithValue(ctx, SpanIDKey, spanID)

        c.Request = c.Request.WithContext(ctx)

        // 添加到日志
        c.Set("logger", logger.With(
            zap.String("trace_id", traceID),
            zap.String("span_id", spanID),
        ))

        c.Next()
    }
}
```

## 指标监控

### Prometheus 指标

```go
import "github.com/prometheus/client_golang/prometheus"

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "path", "status"},
    )

    httpRequestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "path"},
    )

    httpInFlight = prometheus.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "http_in_flight_requests",
            Help: "Number of in-flight HTTP requests",
        },
        []string{"method", "path"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
    prometheus.MustRegister(httpRequestDuration)
    prometheus.MustRegister(httpInFlight)
}
```

### 指标中间件

```go
func MetricsMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        method := c.Request.Method
        path := c.FullPath()

        // 增加进行中计数
        httpInFlight.WithLabelValues(method, path).Inc()
        defer httpInFlight.WithLabelValues(method, path).Dec()

        // 处理请求
        c.Next()

        // 记录指标
        duration := time.Since(start).Seconds()
        status := strconv.Itoa(c.Writer.Status())

        httpRequestsTotal.WithLabelValues(method, path, status).Inc()
        httpRequestDuration.WithLabelValues(method, path).Observe(duration)
    }
}
```

### 自定义指标

```go
type BusinessMetrics struct {
    ordersCreated  *prometheus.CounterVec
    revenue        prometheus.Counter
    activeUsers    prometheus.Gauge
}

func NewBusinessMetrics() *BusinessMetrics {
    ordersCreated := prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "orders_created_total",
            Help: "Total number of orders created",
        },
        []string{"service", "status"},
    )

    revenue := prometheus.NewCounter(
        prometheus.CounterOpts{
            Name: "revenue_total",
            Help: "Total revenue",
        },
    )

    activeUsers := prometheus.NewGauge(
        prometheus.GaugeOpts{
            Name: "active_users",
            Help: "Number of active users",
        },
    )

    prometheus.MustRegister(ordersCreated, revenue, activeUsers)

    return &BusinessMetrics{
        ordersCreated: ordersCreated,
        revenue:       revenue,
        activeUsers:   activeUsers,
    }
}

func (m *BusinessMetrics) RecordOrder(service, status string, amount float64) {
    m.ordersCreated.WithLabelValues(service, status).Inc()
    m.revenue.Add(amount)
}
```

## 分布式追踪

### OpenTelemetry 追踪

```go
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/trace"
)

type TracingService struct {
    tracer trace.Tracer
}

func NewTracingService(serviceName string) *TracingService {
    tracer := otel.Tracer(serviceName)
    return &TracingService{tracer: tracer}
}

func (s *TracingService) HandleRequest(ctx context.Context, req *Request) (*Response, error) {
    ctx, span := s.tracer.Start(ctx, "HandleRequest")
    defer span.End()

    // 处理请求
    result, err := s.processRequest(ctx, req)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, err.Error())
        return nil, err
    }

    span.SetAttributes(
        attribute.String("request.id", req.ID),
        attribute.Int("response.size", len(result.Data)),
    )

    return result, nil
}

func (s *TracingService) processRequest(ctx context.Context, req *Request) (*Response, error) {
    ctx, span := s.tracer.Start(ctx, "ProcessRequest")
    defer span.End()

    // 调用其他服务
    return s.callExternalService(ctx, req)
}

func (s *TracingService) callExternalService(ctx context.Context, req *Request) (*Response, error) {
    ctx, span := s.tracer.Start(ctx, "CallExternalService")
    defer span.End()

    span.SetAttributes(
        attribute.String("service.name", "external-service"),
        attribute.String("endpoint", "/api/process"),
    )

    // HTTP 调用
    resp, err := s.httpClient.Do(ctx, req)
    if err != nil {
        span.RecordError(err)
        return nil, err
    }

    return resp, nil
}
```

### HTTP 客户端追踪

```go
import (
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

func NewTracedClient() *http.Client {
    transport := otelhttp.NewTransport(http.DefaultTransport)

    return &http.Client{
        Transport: transport,
        Timeout:   30 * time.Second,
    }
}

func (c *TracedClient) Do(ctx context.Context, req *http.Request) (*http.Response, error) {
    // 添加 trace 信息
    span := trace.SpanFromContext(ctx)
    span.AddEvent("Sending request",
        trace.WithAttributes(
            attribute.String("http.method", req.Method),
            attribute.String("http.url", req.URL.String()),
        ),
    )

    return c.httpClient.Do(req)
}
```

## 性能分析

### pprof 集成

```go
import (
    _ "net/http/pprof"
    "runtime/pprof"
)

func StartPprofServer(addr string) error {
    mux := http.NewServeMux()

    // pprof 端点
    mux.HandleFunc("/debug/pprof/", pprof.Index)
    mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
    mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
    mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
    mux.HandleFunc("/debug/pprof/trace", pprof.Trace)

    mux.Handle("/debug/pprof/goroutine", pprof.Handler("goroutine"))
    mux.Handle("/debug/pprof/heap", pprof.Handler("heap"))
    mux.Handle("/debug/pprof/threadcreate", pprof.Handler("threadcreate"))
    mux.Handle("/debug/pprof/block", pprof.Handler("block"))

    server := &http.Server{
        Addr:    addr,
        Handler: mux,
    }

    return server.ListenAndServe()
}
```

### 自定义 Profile

```go
type Profiler struct {
    cpuProfile   *os.File
    memProfile   *os.File
    mutexProfile *os.File
}

func StartProfiling() (*Profiler, error) {
    p := &Profiler{}

    // CPU profile
    f, err := os.Create("cpu.prof")
    if err != nil {
        return nil, err
    }
    p.cpuProfile = f

    if err := pprof.StartCPUProfile(p.cpuProfile); err != nil {
        return nil, err
    }

    // Memory profile
    f, err = os.Create("mem.prof")
    if err != nil {
        return nil, err
    }
    p.memProfile = f

    // Mutex profile
    runtime.SetMutexProfileRate(1)

    f, err = os.Create("mutex.prof")
    if err != nil {
        return nil, err
    }
    p.mutexProfile = f

    return p, nil
}

func (p *Profiler) Stop() {
    pprof.StopCPUProfile()
    p.cpuProfile.Close()

    runtime.GC()
    pprof.WriteHeapProfile(p.memProfile)
    p.memProfile.Close()

    pprof.Lookup("mutex").WriteTo(p.mutexProfile, 0)
    p.mutexProfile.Close()
}
```

## 告警系统

### 告警规则

```go
type AlertRule struct {
    Name        string
    Metric      string
    Condition   AlertCondition
    Threshold   float64
    Duration    time.Duration
    Severity    AlertSeverity
    Annotations map[string]string
}

type AlertCondition int

const (
    ConditionGreaterThan AlertCondition = iota
    ConditionLessThan
    ConditionEqual
)

type AlertSeverity int

const (
    SeverityInfo AlertSeverity = iota
    SeverityWarning
    SeverityCritical
)

type AlertManager struct {
    rules   []*AlertRule
    channel chan *Alert
}

func NewAlertManager() *AlertManager {
    return &AlertManager{
        rules:   make([]*AlertRule, 0),
        channel: make(chan *Alert, 100),
    }
}

func (m *AlertManager) AddRule(rule *AlertRule) {
    m.rules = append(m.rules, rule)
}

func (m *AlertManager) Check(metric string, value float64) {
    for _, rule := range m.rules {
        if rule.Metric != metric {
            continue
        }

        triggered := false
        switch rule.Condition {
        case ConditionGreaterThan:
            triggered = value > rule.Threshold
        case ConditionLessThan:
            triggered = value < rule.Threshold
        }

        if triggered {
            m.channel <- &Alert{
                Rule:      rule,
                Value:     value,
                Timestamp: time.Now(),
            }
        }
    }
}
```

### 告警通知

```go
type Alert struct {
    Rule      *AlertRule
    Value     float64
    Timestamp time.Time
}

type Notifier interface {
    Send(alert *Alert) error
}

type SlackNotifier struct {
    webhookURL string
}

func (n *SlackNotifier) Send(alert *Alert) error {
    message := map[string]interface{}{
        "text": fmt.Sprintf("[%s] %s", alert.Rule.Severity, alert.Rule.Name),
        "attachments": []map[string]interface{}{
            {
                "color": n.getAlertColor(alert.Rule.Severity),
                "fields": []map[string]string{
                    {
                        "title": "Metric",
                        "value": alert.Rule.Metric,
                    },
                    {
                        "title": "Value",
                        "value": fmt.Sprintf("%.2f", alert.Value),
                    },
                    {
                        "title": "Threshold",
                        "value": fmt.Sprintf("%.2f", alert.Rule.Threshold),
                    },
                },
            },
        },
    }

    return n.sendToSlack(message)
}

type EmailNotifier struct {
    smtpHost string
    smtpPort int
    from     string
    to       []string
}

func (n *EmailNotifier) Send(alert *Alert) error {
    subject := fmt.Sprintf("[%s] %s", alert.Rule.Severity, alert.Rule.Name)
    body := fmt.Sprintf(
        "Alert: %s\nMetric: %s\nValue: %.2f\nThreshold: %.2f",
        alert.Rule.Name,
        alert.Rule.Metric,
        alert.Value,
        alert.Rule.Threshold,
    )

    return n.sendEmail(subject, body)
}
```

## 最佳实践

::: tip 可观测性建议

1. **结构化日志** - 使用 JSON 格式
2. **上下文传播** - Trace ID 传递
3. **关键指标** - RED 方法（Rate, Errors, Duration）
4. **分布式追踪** - 端到端追踪
5. **告警分级** - 区分严重程度

:::

```go
// ✅ 好的可观测性模式
func handleRequest(c *gin.Context) {
    // 1. 从上下文获取 logger
    logger := c.MustGet("logger").(*zap.Logger)

    // 2. 记录请求开始
    logger.Info("Request started",
        zap.String("path", c.Request.URL.Path),
        zap.String("method", c.Request.Method),
    )

    // 3. 处理请求
    result, err := processRequest(c)

    // 4. 记录请求完成
    if err != nil {
        logger.Error("Request failed",
            zap.Error(err),
            zap.String("error_type", fmt.Sprintf("%T", err)),
        )
    } else {
        logger.Info("Request completed",
            zap.Int("result_size", len(result)),
        )
    }
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **结构化日志** - zap/slog |
| **指标监控** - Prometheus |
| **分布式追踪** - OpenTelemetry |
| **性能分析** - pprof |
| **告警系统** - 多渠道通知 |

::: v-pre

[弹性设计](./resilience.md) → [实战项目](/langs/go/14-practice/)

:::
