---
title: 错误处理
icon: ri:error-warning-line
order: 5
---

# 错误处理

良好的错误处理让应用更健壮、更易调试。

## 错误包装

### 基本包装

```go
// ✅ 使用 fmt.Errorf 包装错误
func processUser(userID string) error {
    user, err := repo.FindUser(userID)
    if err != nil {
        return fmt.Errorf("failed to find user %s: %w", userID, err)
    }

    return nil
}

// ✅ 自定义错误
type ValidationError struct {
    Field   string
    Message string
    Err     error
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error on field %s: %s", e.Field, e.Message)
}

func (e *ValidationError) Unwrap() error {
    return e.Err
}

func validateUser(user User) error {
    if user.Name == "" {
        return &ValidationError{
            Field:   "name",
            Message: "name is required",
        }
    }
    return nil
}
```

### 错误链

```go
// 处理错误链
func handleError(err error) {
    // 检查特定错误类型
    var validationErr *ValidationError
    if errors.As(err, &validationErr) {
        log.Printf("Validation failed: %s", validationErr.Message)
        return
    }

    // 检查错误值
    if errors.Is(err, sql.ErrNoRows) {
        log.Println("Record not found")
        return
    }

    // 获取根本原因
    rootCause := errors.Unwrap(err)
    for rootCause != nil {
        log.Printf("Caused by: %v", rootCause)
        rootCause = errors.Unwrap(rootCause)
    }
}
```

## 错误分类

### 错误类型

```go
// 业务错误
type BusinessError struct {
    Code    string
    Message string
}

func (e *BusinessError) Error() string {
    return e.Message
}

// 使用
func processPayment(order Order) error {
    if order.Amount <= 0 {
        return &BusinessError{
            Code:    "INVALID_AMOUNT",
            Message: "Payment amount must be positive",
        }
    }

    return nil
}

// 系统错误
type SystemError struct {
    Op      string // 操作
    Err     error  // 底层错误
    Message string
}

func (e *SystemError) Error() string {
    return fmt.Sprintf("%s: %s", e.Op, e.Message)
}

func (e *SystemError) Unwrap() error {
    return e.Err
}

// 使用
func connectDB(config DBConfig) error {
    db, err := sql.Open(config.Driver, config.DSN)
    if err != nil {
        return &SystemError{
            Op:      "connect_db",
            Err:     err,
            Message: "failed to connect to database",
        }
    }
    return nil
}
```

### HTTP 错误映射

```go
type HTTPError struct {
    StatusCode int
    Code       string
    Message    string
}

func (e *HTTPError) Error() string {
    return e.Message
}

// 错误映射
func mapToHTTPError(err error) *HTTPError {
    switch e := err.(type) {
    case *ValidationError:
        return &HTTPError{
            StatusCode: http.StatusBadRequest,
            Code:       "VALIDATION_ERROR",
            Message:    e.Message,
        }
    case *BusinessError:
        return &HTTPError{
            StatusCode: http.StatusBadRequest,
            Code:       e.Code,
            Message:    e.Message,
        }
    case *SystemError:
        return &HTTPError{
            StatusCode: http.StatusInternalServerError,
            Code:       "INTERNAL_ERROR",
            Message:    "An internal error occurred",
        }
    default:
        if errors.Is(err, sql.ErrNoRows) {
            return &HTTPError{
                StatusCode: http.StatusNotFound,
                Code:       "NOT_FOUND",
                Message:    "Resource not found",
            }
        }

        return &HTTPError{
            StatusCode: http.StatusInternalServerError,
            Code:       "UNKNOWN_ERROR",
            Message:    "An unknown error occurred",
        }
    }
}
```

## 错误恢复

### panic 恢复

```go
// 全局恢复中间件
func RecoveryMiddleware(logger *zap.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        defer func() {
            if r := recover(); r != nil {
                // 记录 panic
                logger.Error("Panic recovered",
                    zap.Any("error", r),
                    zap.String("path", c.Request.URL.Path),
                    zap.Stack("stack"),
                )

                // 返回错误响应
                c.JSON(http.StatusInternalServerError, gin.H{
                    "error": "Internal server error",
                })
            }
        }()

        c.Next()
    }
}

// goroutine 恢复
func safeGo(fn func()) {
    go func() {
        defer func() {
            if r := recover(); r != nil {
                log.Printf("Recovered in goroutine: %v", r)
            }
        }()
        fn()
    }()
}

// 使用
safeGo(func() {
    // 可能 panic 的代码
})
```

### 优雅降级

```go
// 带降级的函数调用
func callWithFallback(primary, fallback func() error) error {
    err := primary()
    if err != nil {
        log.Printf("Primary failed, using fallback: %v", err)
        return fallback()
    }
    return nil
}

// 使用示例
func fetchData() (*Data, error) {
    var data *Data

    err := callWithFallback(
        func() error {
            // 主数据源
            var err error
            data, err = fetchFromPrimary()
            return err
        },
        func() error {
            // 备用数据源
            var err error
            data, err = fetchFromCache()
            return err
        },
    )

    return data, err
}
```

## 错误日志

### 结构化错误日志

```go
func logError(logger *zap.Logger, err error, msg string, fields ...zap.Field) {
    // 获取错误链
    errList := []error{err}
    for unwrapped := errors.Unwrap(err); unwrapped != nil; unwrapped = errors.Unwrap(unwrapped) {
        errList = append(errList, unwrapped)
    }

    // 构建字段
    allFields := append([]zap.Field{
        zap.String("error", err.Error()),
        zap.Int("error_chain_depth", len(errList)),
    }, fields...)

    // 记录错误
    logger.Error(msg, allFields...)
}

// 使用
func processOrder(logger *zap.Logger, order Order) error {
    if err := validateOrder(order); err != nil {
        logError(logger, err, "Order validation failed",
            zap.String("order_id", order.ID),
        )
        return err
    }

    return nil
}
```

### 错误跟踪

```go
// 添加上下文信息
type contextErr struct {
    err     error
    context map[string]interface{}
}

func (e *contextErr) Error() string {
    return fmt.Sprintf("%s: %v", e.context, e.err)
}

func (e *contextErr) Unwrap() error {
    return e.err
}

func withContext(err error, key string, value interface{}) error {
    ctxErr := &contextErr{
        err:     err,
        context: make(map[string]interface{}),
    }
    ctxErr.context[key] = value
    return ctxErr
}

// 使用
func processUser(id string) error {
    user, err := repo.Find(id)
    if err != nil {
        return withContext(err, "user_id", id)
    }

    return process(user)
}
```

## 重试机制

### 指数退避

```go
func RetryWithBackoff(fn func() error, maxRetries int) error {
    var err error

    for attempt := 0; attempt < maxRetries; attempt++ {
        if err = fn(); err == nil {
            return nil
        }

        // 指数退避
        wait := time.Duration(1<<uint(attempt)) * time.Second
        if wait > 30*time.Second {
            wait = 30 * time.Second
        }

        log.Printf("Attempt %d failed, retrying in %v: %v", attempt+1, wait, err)
        time.Sleep(wait)
    }

    return fmt.Errorf("after %d attempts, last error: %w", maxRetries, err)
}

// 使用
err := RetryWithBackoff(func() error {
    return callExternalAPI()
}, 3)
```

### 条件重试

```go
func RetryIf(fn func() error, shouldRetry func(error) bool, maxRetries int) error {
    var err error

    for attempt := 0; attempt < maxRetries; attempt++ {
        if err = fn(); err == nil {
            return nil
        }

        if !shouldRetry(err) {
            return err
        }

        log.Printf("Attempt %d failed, retrying: %v", attempt+1, err)
        time.Sleep(time.Second)
    }

    return fmt.Errorf("after %d attempts, last error: %w", maxRetries, err)
}

// 使用
err := RetryIf(
    func() error {
        return callAPI()
    },
    func(err error) bool {
        // 只重试网络错误
        var netErr *net.Error
        return errors.As(err, &netErr) || err == io.ErrUnexpectedEOF
    },
    3,
)
```

## 最佳实践

::: tip 错误处理建议

1. **尽早返回** - 错误尽早检查并返回
2. **包装上下文** - 添加操作上下文信息
3. **处理 panic** - 使用 defer recover
4. **日志记录** - 记录完整的错误链
5. **用户友好** - 返回用户友好的错误信息

:::

```go
// ✅ 好的模式
func goodErrorHandling() error {
    data, err := fetchData()
    if err != nil {
        return fmt.Errorf("failed to fetch data: %w", err)
    }

    result, err := processData(data)
    if err != nil {
        return fmt.Errorf("failed to process data: %w", err)
    }

    return nil
}

// ❌ 不好的模式
func badErrorHandling() error {
    data, _ := fetchData()        // 忽略错误
    result, _ := processData(data) // 忽略错误
    return nil
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **包装** - 使用 fmt.Errorf 和 %w |
| **分类** - 业务错误、系统错误 |
| **恢复** - defer recover 处理 panic |
| **日志** - 结构化记录错误信息 |
| **重试** - 指数退避重试机制 |

::: v-pre

[配置管理](./configuration.md) → [测试策略](./testing.md)

:::
