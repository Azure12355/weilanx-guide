---
title: 自定义错误
icon: ri:code-s-slash-line
order: 3
---

# 自定义错误

自定义错误可以提供更丰富的错误信息和更好的错误处理能力。

## 自定义错误基础

### 基本结构

```go
// 定义错误类型
type ValidationError struct {
    Field   string
    Message string
}

// 实现 Error 接口
func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed for field '%s': %s", e.Field, e.Message)
}

// 使用
func validateEmail(email string) error {
    if email == "" {
        return &ValidationError{
            Field:   "email",
            Message: "cannot be empty",
        }
    }
    return nil
}
```

### 带有代码的错误

```go
// 应用错误类型
type AppError struct {
    Code    int
    Message string
    Cause   error
}

func (e *AppError) Error() string {
    if e.Cause != nil {
        return fmt.Sprintf("[%d] %s: %v", e.Code, e.Message, e.Cause)
    }
    return fmt.Sprintf("[%d] %s", e.Code, e.Message)
}

// 错误代码常量
const (
    ErrCodeNotFound    = 1001
    ErrCodeInvalid     = 1002
    ErrCodePermission  = 1003
    ErrCodeInternal    = 1004
)

// 创建错误的辅助函数
func NotFoundError(format string, args ...interface{}) error {
    return &AppError{
        Code:    ErrCodeNotFound,
        Message: fmt.Sprintf(format, args...),
    }
}

func InvalidError(format string, args ...interface{}) error {
    return &AppError{
        Code:    ErrCodeInvalid,
        Message: fmt.Sprintf(format, args...),
    }
}

// 使用
func getUser(id int) (*User, error) {
    user, err := db.QueryUser(id)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, NotFoundError("user %d not found", id)
        }
        return nil, fmt.Errorf("query failed: %w", err)
    }
    return user, nil
}
```

## 错误接口实现

### Is 方法

```go
type TimeoutError struct {
    Operation string
    Duration  time.Duration
}

func (e *TimeoutError) Error() string {
    return fmt.Sprintf("%s timed out after %v", e.Operation, e.Duration)
}

// 实现 Is 方法支持错误比较
func (e *TimeoutError) Is(target error) bool {
    _, ok := target.(*TimeoutError)
    return ok
}

// 使用
func processWithTimeout() error {
    err := doWork()
    if errors.Is(err, &TimeoutError{}) {
        return fmt.Errorf("work timed out: %w", err)
    }
    return err
}
```

### As 方法

```go
type DBError struct {
    Query string
    Err   error
}

func (e *DBError) Error() string {
    return fmt.Sprintf("database error in query '%s': %v", e.Query, e.Err)
}

func (e *DBError) Unwrap() error {
    return e.Err
}

// 实现 As 方法支持类型转换
func (e *DBError) As(target interface{}) bool {
    err, ok := target.(**DBError)
    if !ok {
        return false
    }
    *err = e
    return true
}

// 使用
func handleError(err error) {
    var dbErr *DBError
    if errors.As(err, &dbErr) {
        fmt.Printf("Failed query: %s\n", dbErr.Query)
        logDBError(dbErr)
    }
}
```

### Unwrap 方法

```go
type WrappedError struct {
    Message string
    Err     error
}

func (e *WrappedError) Error() string {
    return e.Message
}

// 实现 Unwrap 方法支持错误链
func (e *WrappedError) Unwrap() error {
    return e.Err
}

// 使用
func process() error {
    err := doStep1()
    if err != nil {
        return &WrappedError{
            Message: "step 1 failed",
            Err:     err,
        }
    }
    return nil
}

func handleError() {
    err := process()
    if err != nil {
        // 可以解包获取原始错误
        unwrapped := errors.Unwrap(err)
        if unwrapped != nil {
            fmt.Println("Original error:", unwrapped)
        }
    }
}
```

## 错误分类

### 领域错误

```go
// 用户错误
type UserError struct {
    UserID   int
    Action   string
    Reason   string
}

func (e *UserError) Error() string {
    return fmt.Sprintf("user %d cannot %s: %s", e.UserID, e.Action, e.Reason)
}

// 权限错误
type PermissionError struct {
    User     string
    Resource string
    Action   string
}

func (e *PermissionError) Error() string {
    return fmt.Sprintf("user '%s' not allowed to %s resource '%s'",
        e.User, e.Action, e.Resource)
}

// 业务规则错误
type BusinessRuleError struct {
    Rule    string
    Details string
}

func (e *BusinessRuleError) Error() string {
    return fmt.Sprintf("business rule '%s' violated: %s", e.Rule, e.Details)
}
```

### HTTP 错误

```go
type HTTPError struct {
    StatusCode int
    Message    string
    Err        error
}

func (e *HTTPError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%d %s: %v", e.StatusCode, e.Message, e.Err)
    }
    return fmt.Sprintf("%d %s", e.StatusCode, e.Message)
}

// HTTP 错误辅助函数
func BadRequest(msg string, err error) error {
    return &HTTPError{StatusCode: 400, Message: msg, Err: err}
}

func Unauthorized(msg string) error {
    return &HTTPError{StatusCode: 401, Message: msg}
}

func Forbidden(msg string) error {
    return &HTTPError{StatusCode: 403, Message: msg}
}

func NotFound(msg string) error {
    return &HTTPError{StatusCode: 404, Message: msg}
}

func InternalServerError(msg string, err error) error {
    return &HTTPError{StatusCode: 500, Message: msg, Err: err}
}

// 使用
func handleRequest(r *http.Request) error {
    user := getUserFromToken(r)
    if user == nil {
        return Unauthorized("invalid or missing token")
    }

    resource, err := loadResource(r)
    if err != nil {
        return InternalServerError("failed to load resource", err)
    }

    if !canAccess(user, resource) {
        return Forbidden("insufficient permissions")
    }

    return nil
}
```

## 错误收集

### 多错误收集

```go
type MultiError struct {
    Errors []error
}

func (e *MultiError) Error() string {
    var sb strings.Builder
    sb.WriteString(fmt.Sprintf("%d errors occurred:", len(e.Errors)))
    for i, err := range e.Errors {
        sb.WriteString(fmt.Sprintf("\n  %d. %v", i+1, err))
    }
    return sb.String()
}

func (e *MultiError) Add(err error) {
    e.Errors = append(e.Errors, err)
}

func (e *MultiError) HasErrors() bool {
    return len(e.Errors) > 0
}

// 使用
func validateAll() error {
    var multiErr MultiError

    if err := validateEmail(email); err != nil {
        multiErr.Add(err)
    }

    if err := validatePhone(phone); err != nil {
        multiErr.Add(err)
    }

    if err := validateAddress(address); err != nil {
        multiErr.Add(err)
    }

    if multiErr.HasErrors() {
        return &multiErr
    }

    return nil
}
```

### 验证错误

```go
type ValidationErrors struct {
    Fields map[string]string
}

func NewValidationErrors() *ValidationErrors {
    return &ValidationErrors{
        Fields: make(map[string]string),
    }
}

func (e *ValidationErrors) Add(field, message string) {
    e.Fields[field] = message
}

func (e *ValidationErrors) Error() string {
    var fields []string
    for field, msg := range e.Fields {
        fields = append(fields, fmt.Sprintf("%s: %s", field, msg))
    }
    return fmt.Sprintf("validation failed: %s", strings.Join(fields, ", "))
}

func (e *ValidationErrors) Has(field string) bool {
    _, ok := e.Fields[field]
    return ok
}

// 使用
func validateUser(user *User) error {
    errs := NewValidationErrors()

    if user.Name == "" {
        errs.Add("name", "is required")
    }

    if user.Age < 0 || user.Age > 150 {
        errs.Add("age", "must be between 0 and 150")
    }

    if !isValidEmail(user.Email) {
        errs.Add("email", "invalid format")
    }

    if len(errs.Fields) > 0 {
        return errs
    }

    return nil
}
```

## 错误上下文

### 带上下文的错误

```go
type ContextError struct {
    Context string
    Err     error
}

func (e *ContextError) Error() string {
    return fmt.Sprintf("%s: %v", e.Context, e.Err)
}

func (e *ContextError) Unwrap() error {
    return e.Err
}

// 添加上下文的辅助函数
func WithContext(ctx string, err error) error {
    return &ContextError{Context: ctx, Err: err}
}

// 使用
func processFile(path string) error {
    data, err := os.ReadFile(path)
    if err != nil {
        return WithContext(fmt.Sprintf("reading file %s", path), err)
    }

    if err := processData(data); err != nil {
        return WithContext(fmt.Sprintf("processing file %s", path), err)
    }

    return nil
}
```

### 错误栈

```go
type StackError struct {
    Err   error
    Stack []string
}

func (e *StackError) Error() string {
    return fmt.Sprintf("%s\nStack:\n%s", e.Err, strings.Join(e.Stack, "\n"))
}

func (e *StackError) Unwrap() error {
    return e.Err
}

// 捕获调用栈
func WithStack(err error) error {
    stack := make([]string, 0, 10)

    // 获取调用栈
    pcs := make([]uintptr, 10)
    n := runtime.Callers(2, pcs)

    frames := runtime.CallersFrames(pcs[:n])
    for {
        frame, more := frames.Next()
        stack = append(stack, fmt.Sprintf("  %s:%d %s",
            filepath.Base(frame.File),
            frame.Line,
            frame.Function))

        if !more {
            break
        }
    }

    return &StackError{Err: err, Stack: stack}
}

// 使用
func riskyOperation() error {
    err := doSomething()
    if err != nil {
        return WithStack(err)
    }
    return nil
}
```

## 错误恢复

### 可恢复错误

```go
type RetryableError struct {
    Err       error
    MaxRetries int
}

func (e *RetryableError) Error() string {
    return fmt.Sprintf("retryable error: %v", e.Err)
}

func (e *RetryableError) Unwrap() error {
    return e.Err
}

func IsRetryable(err error) bool {
    var retryable *RetryableError
    return errors.As(err, &retryable)
}

// 使用
func doWithRetry(fn func() error, maxRetries int) error {
    var lastErr error
    for i := 0; i < maxRetries; i++ {
        err := fn()
        if err == nil {
            return nil
        }

        if !IsRetryable(err) {
            return err
        }

        lastErr = err
        time.Sleep(time.Second * time.Duration(i+1))
    }

    return fmt.Errorf("max retries exceeded: %w", lastErr)
}
```

## 最佳实践

::: tip 使用建议

1. **命名规范** - 错误类型以 `Error` 结尾
2. **不可变** - 错误应该是不可变的
3. **提供上下文** - 包含足够的错误信息
4. **实现接口** - 根据需要实现 Is/As/Unwrap
5. **错误分类** - 区分可恢复和不可恢复错误

:::

```go
// ✅ 好的自定义错误
type ServiceError struct {
    Code    string
    Message string
    Cause   error
}

func (e *ServiceError) Error() string {
    if e.Cause != nil {
        return fmt.Sprintf("[%s] %s: %v", e.Code, e.Message, e.Cause)
    }
    return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

func (e *ServiceError) Unwrap() error {
    return e.Cause
}

// 使用辅助函数
func NewServiceError(code, message string, cause error) error {
    return &ServiceError{
        Code:    code,
        Message: message,
        Cause:   cause,
    }
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Error()** - 实现错误接口 |
| **Is()** - 支持错误比较 |
| **As()** - 支持类型转换 |
| **Unwrap()** - 支持错误链 |
| **分类** - 按领域/场景分类错误 |
| **上下文** - 提供足够的错误信息 |

::: v-pre

[错误处理](./errors.md) → [Panic/Recover](./panic-recover.md)

:::
