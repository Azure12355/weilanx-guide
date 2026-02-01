---
title: 弹性设计
icon: ri:shield-check-line
order: 5
---

# 弹性设计

弹性模式保护分布式系统免受级联失败影响。

## 熔断器

### 基础熔断器

```go
type CircuitState int

const (
    StateClosed CircuitState = iota
    StateHalfOpen
    StateOpen
)

type CircuitBreaker struct {
    mu               sync.Mutex
    state            CircuitState
    failureCount     int
    successCount     int
    failureThreshold int
    successThreshold int
    timeout          time.Duration
    lastFailureTime  time.Time
}

func NewCircuitBreaker(failureThreshold, successThreshold int, timeout time.Duration) *CircuitBreaker {
    return &CircuitBreaker{
        state:            StateClosed,
        failureThreshold: failureThreshold,
        successThreshold: successThreshold,
        timeout:          timeout,
    }
}

func (cb *CircuitBreaker) Execute(fn func() error) error {
    cb.mu.Lock()

    // 检查状态
    if cb.state == StateOpen {
        if time.Since(cb.lastFailureTime) > cb.timeout {
            cb.state = StateHalfOpen
            cb.successCount = 0
        } else {
            cb.mu.Unlock()
            return fmt.Errorf("circuit breaker is open")
        }
    }

    cb.mu.Unlock()

    // 执行函数
    err := fn()

    cb.mu.Lock()
    defer cb.mu.Unlock()

    if err != nil {
        cb.failureCount++
        cb.lastFailureTime = time.Now()

        if cb.failureCount >= cb.failureThreshold {
            cb.state = StateOpen
        }

        return err
    }

    cb.successCount++

    if cb.state == StateHalfOpen && cb.successCount >= cb.successThreshold {
        cb.state = StateClosed
        cb.failureCount = 0
    }

    return nil
}

func (cb *CircuitBreaker) State() CircuitState {
    cb.mu.Lock()
    defer cb.mu.Unlock()
    return cb.state
}
```

### 熔断器中间件

```go
func CircuitBreakerMiddleware(cb *CircuitBreaker) gin.HandlerFunc {
    return func(c *gin.Context) {
        err := cb.Execute(func() error {
            // 创建响应写入包装器
            w := &responseWriter{
                ResponseWriter: c.Writer,
                status:        200,
            }
            c.Writer = w

            // 执行请求
            c.Next()

            // 检查状态码
            if w.status >= 500 {
                return fmt.Errorf("server error: %d", w.status)
            }

            return nil
        })

        if err != nil {
            c.JSON(503, gin.H{
                "error": "Service unavailable",
                "state": cb.State().String(),
            })
            c.Abort()
        }
    }
}

type responseWriter struct {
    gin.ResponseWriter
    status int
}

func (w *responseWriter) WriteHeader(status int) {
    w.status = status
    w.ResponseWriter.WriteHeader(status)
}

func (s CircuitState) String() string {
    switch s {
    case StateClosed:
        return "closed"
    case StateHalfOpen:
        return "half-open"
    case StateOpen:
        return "open"
    default:
        return "unknown"
    }
}
```

## 重试机制

### 指数退避重试

```go
type RetryPolicy struct {
    MaxAttempts  int
    InitialDelay time.Duration
    MaxDelay     time.Duration
    Multiplier   float64
    MaxJitter    time.Duration
}

func DefaultRetryPolicy() *RetryPolicy {
    return &RetryPolicy{
        MaxAttempts:  3,
        InitialDelay: 100 * time.Millisecond,
        MaxDelay:     10 * time.Second,
        Multiplier:   2.0,
        MaxJitter:    100 * time.Millisecond,
    }
}

func RetryWithBackoff(policy *RetryPolicy, fn func() error) error {
    delay := policy.InitialDelay

    for attempt := 0; attempt < policy.MaxAttempts; attempt++ {
        err := fn()
        if err == nil {
            return nil
        }

        // 判断是否可重试
        if !isRetryableError(err) {
            return err
        }

        if attempt == policy.MaxAttempts-1 {
            return fmt.Errorf("max retries exceeded: %w", err)
        }

        // 计算延迟并添加随机抖动
        jitter := time.Duration(rand.Int63n(int64(policy.MaxJitter)))
        time.Sleep(delay + jitter)

        // 计算下次延迟
        delay = time.Duration(float64(delay) * policy.Multiplier)
        if delay > policy.MaxDelay {
            delay = policy.MaxDelay
        }
    }

    return fmt.Errorf("max retries exceeded")
}

func isRetryableError(err error) bool {
    // 网络错误
    if netErr, ok := err.(net.Error); ok {
        return netErr.Timeout() || netErr.Temporary()
    }

    // 特定错误码
    if strings.Contains(err.Error(), "connection refused") ||
        strings.Contains(err.Error(), "connection reset") {
        return true
    }

    return false
}
```

### 上下文重试

```go
func RetryWithContext(ctx context.Context, policy *RetryPolicy, fn func(context.Context) error) error {
    delay := policy.InitialDelay

    for attempt := 0; attempt < policy.MaxAttempts; attempt++ {
        err := fn(ctx)
        if err == nil {
            return nil
        }

        if !isRetryableError(err) {
            return err
        }

        if attempt == policy.MaxAttempts-1 {
            return fmt.Errorf("max retries exceeded: %w", err)
        }

        // 等待或取消
        select {
        case <-time.After(delay):
        case <-ctx.Done():
            return ctx.Err()
        }

        delay = time.Duration(float64(delay) * policy.Multiplier)
        if delay > policy.MaxDelay {
            delay = policy.MaxDelay
        }
    }

    return fmt.Errorf("max retries exceeded")
}
```

## 限流

### 令牌桶

```go
import "golang.org/x/time/rate"

type RateLimiter struct {
    limiter *rate.Limiter
}

func NewRateLimiter(r rate.Limit, b int) *RateLimiter {
    return &RateLimiter{
        limiter: rate.NewLimiter(r, b),
    }
}

func (l *RateLimiter) Allow() bool {
    return l.limiter.Allow()
}

func (l *RateLimiter) Wait(ctx context.Context) error {
    return l.limiter.Wait(ctx)
}

// 中间件
func RateLimitMiddleware(limiter *RateLimiter) gin.HandlerFunc {
    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.JSON(429, gin.H{
                "error": "Rate limit exceeded",
            })
            c.Abort()
            return
        }

        c.Next()
    }
}
```

### 滑动窗口

```go
type SlidingWindowRateLimiter struct {
    requests map[string][]time.Time
    mu       sync.RWMutex
    limit    int
    window   time.Duration
}

func NewSlidingWindowRateLimiter(limit int, window time.Duration) *SlidingWindowRateLimiter {
    return &SlidingWindowRateLimiter{
        requests: make(map[string][]time.Time),
        limit:    limit,
        window:   window,
    }
}

func (l *SlidingWindowRateLimiter) Allow(key string) bool {
    l.mu.Lock()
    defer l.mu.Unlock()

    now := time.Now()
    cutoff := now.Add(-l.window)

    // 清理过期请求
    var valid []time.Time
    for _, t := range l.requests[key] {
        if t.After(cutoff) {
            valid = append(valid, t)
        }
    }

    // 检查是否超过限制
    if len(valid) >= l.limit {
        return false
    }

    // 添加当前请求
    valid = append(valid, now)
    l.requests[key] = valid

    return true
}
```

### 分布式限流

```go
type RedisRateLimiter struct {
    client *redis.Client
    limit  int
    window time.Duration
}

func NewRedisRateLimiter(client *redis.Client, limit int, window time.Duration) *RedisRateLimiter {
    return &RedisRateLimiter{
        client: client,
        limit:  limit,
        window: window,
    }
}

func (l *RedisRateLimiter) Allow(ctx context.Context, key string) (bool, error) {
    now := time.Now().Unix()
    windowStart := now - int64(l.window.Seconds())

    pipe := l.client.Pipeline()

    // 移除窗口外的记录
    pipe.ZRemRangeByScore(ctx, key, "0", fmt.Sprintf("%d", windowStart))

    // 添加当前请求
    pipe.ZAdd(ctx, key, &redis.Z{
        Score:  float64(now),
        Member: now,
    })

    // 统计窗口内请求数
    cmdCount := pipe.ZCard(ctx, key)

    // 设置过期时间
    pipe.Expire(ctx, key, l.window)

    _, err := pipe.Exec(ctx)
    if err != nil {
        return false, err
    }

    count := cmdCount.Val()
    return count <= int64(l.limit), nil
}
```

## 超时控制

### 上下文超时

```go
func WithTimeout(fn func(context.Context) error, timeout time.Duration) error {
    ctx, cancel := context.WithTimeout(context.Background(), timeout)
    defer cancel()

    return fn(ctx)
}

// 示例使用
func callServiceWithTimeout() error {
    return WithTimeout(func(ctx context.Context) error {
        req, _ := http.NewRequestWithContext(ctx, "GET", "http://service", nil)
        resp, err := http.DefaultClient.Do(req)
        if err != nil {
            return err
        }
        defer resp.Body.Close()

        return nil
    }, 5*time.Second)
}
```

### 层级超时

```go
func CallServiceWithNestedTimeout() error {
    // 外层超时
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // 内层超时
    innerCtx, innerCancel := context.WithTimeout(ctx, 3*time.Second)
    defer innerCancel()

    req, _ := http.NewRequestWithContext(innerCtx, "GET", "http://service", nil)
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    return nil
}
```

## 舱壁隔离

### 资源隔离

```go
type IsolatedExecutor struct {
    sema chan struct{}
}

func NewIsolatedExecutor(maxConcurrent int) *IsolatedExecutor {
    return &IsolatedExecutor{
        sema: make(chan struct{}, maxConcurrent),
    }
}

func (e *IsolatedExecutor) Execute(fn func() error) error {
    // 获取信号量
    select {
    case e.sema <- struct{}{}:
        defer func() { <-e.sema }()
    case <-time.After(100 * time.Millisecond):
        return fmt.Errorf("executor busy")
    }

    // 执行函数
    return fn()
}
```

### 服务隔离

```go
type ServiceIsolator struct {
    executors map[string]*IsolatedExecutor
    mu        sync.RWMutex
}

func NewServiceIsolator() *ServiceIsolator {
    return &ServiceIsolator{
        executors: make(map[string]*IsolatedExecutor),
    }
}

func (i *ServiceIsolator) Register(serviceName string, maxConcurrent int) {
    i.mu.Lock()
    defer i.mu.Unlock()

    i.executors[serviceName] = NewIsolatedExecutor(maxConcurrent)
}

func (i *ServiceIsolator) Execute(serviceName string, fn func() error) error {
    i.mu.RLock()
    executor, exists := i.executors[serviceName]
    i.mu.RUnlock()

    if !exists {
        return fmt.Errorf("service not registered: %s", serviceName)
    }

    return executor.Execute(fn)
}
```

## 降级策略

### 降级处理器

```go
type FallbackHandler struct {
    primary     Service
    fallback    Service
    breaker     *CircuitBreaker
}

type Service interface {
    Call(ctx context.Context, req interface{}) (interface{}, error)
}

func NewFallbackHandler(primary, fallback Service) *FallbackHandler {
    return &FallbackHandler{
        primary:  primary,
        fallback: fallback,
        breaker:  NewCircuitBreaker(5, 2, 30*time.Second),
    }
}

func (h *FallbackHandler) Call(ctx context.Context, req interface{}) (interface{}, error) {
    // 尝试主服务
    err := h.breaker.Execute(func() error {
        _, err := h.primary.Call(ctx, req)
        return err
    })

    if err == nil {
        return h.primary.Call(ctx, req)
    }

    // 降级到备用服务
    log.Printf("Primary service failed, using fallback: %v", err)
    return h.fallback.Call(ctx, req)
}
```

### 默认值降级

```go
func WithDefaultFallback(fn func() (interface{}, error), defaultValue interface{}) (interface{}, error) {
    result, err := fn()
    if err != nil {
        log.Printf("Function failed, using default value: %v", err)
        return defaultValue, nil
    }
    return result, nil
}

// 示例
func getUserWithFallback(userID string) (*User, error) {
    return WithDefaultFallback(
        func() (interface{}, error) {
            return userService.Get(userID)
        },
        &User{ID: userID, Name: "Unknown"},
    ).(*User), nil
}
```

## 最佳实践

::: tip 弹性设计建议

1. **熔断器** - 防止级联失败
2. **重试机制** - 处理临时故障
3. **限流保护** - 防止系统过载
4. **超时控制** - 避免资源耗尽
5. **降级策略** - 保证核心功能

:::

```go
// ✅ 好的弹性模式
func resilientCall() error {
    return RetryWithBackoff(
        DefaultRetryPolicy(),
        func() error {
            return cb.Execute(func() error {
                return WithTimeout(
                    func(ctx context.Context) error {
                        return serviceCall(ctx)
                    },
                    5*time.Second,
                )
            })
        },
    )
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **熔断器** - 快速失败保护 |
| **重试** - 处理临时故障 |
| **限流** - 防止系统过载 |
| **超时** - 避免资源耗尽 |
| **降级** - 保证可用性 |

::: v-pre

[服务发现](./discovery.md) → [可观测性](./monitoring.md)

:::
