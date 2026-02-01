---
title: 代码规范
icon: ri:code-s-slash-line
order: 5
---

# 代码规范

遵循 Go 代码规范使代码更易读、易维护。

## 命名规范

### 包命名

```go
// ✅ 好的包名
package user        // 简洁、小写、单数
package api         // 清晰描述
package http        // 标准库风格

// ❌ 不好的包名
package users       // 复数
package userSvc     // 缩写
package myservice   // 过于通用
```

### 变量命名

```go
// ✅ 好的变量名
var userID string           // 驼峰命名、描述性
var isActive bool           // 布尔值用 is/has
var httpServer *http.Server // 缩写可接受

// ❌ 不好的变量名
var user_id string          // 下划线风格
var active bool             // 不够描述
var server *http.Server     // 太通用
```

### 函数命名

```go
// ✅ 好的函数名
func getUserByID(id string) (*User, error) {
    // 动词开头、描述性强
}

func isValidEmail(email string) bool {
    // 布尔函数用 is/has
}

// ❌ 不好的函数名
func user(id string) (*User, error) {
    // 不够描述
}

func validate(email string) bool {
    // 太通用
}
```

### 常量命名

```go
// ✅ 好的常量名
const (
    MaxConnections = 100
    DefaultTimeout = 30 * time.Second
    APIVersion     = "v1"
)

// ❌ 不好的常量名
const (
    MAX_CONNECTIONS = 100        // 全大写
    default_timeout = 30         // 下划线
)
```

### 接口命名

```go
// ✅ 好的接口名
type UserInterface interface {
    // 接口名以 Interface 结尾或仅描述行为
    GetUser(id string) (*User, error)
}

type Reader interface {
    // 单一方法接口用动作名称
    Read(p []byte) (n int, err error)
}

type UserRepository interface {
    // 仓库接口：名词 + Repository
}

// ❌ 不好的接口名
type IUser interface {
    // 不使用 I 前缀（Java 风格）
    GetUser(id string) (*User, error)
}
```

## 格式规范

### 缩进和对齐

```go
// ✅ 使用 tab 缩进
func process(user *User, data []byte) error {
    if user == nil {
        return errors.New("user is nil")
    }

    for _, b := range data {
        // 处理数据
    }

    return nil
}

// ✅ 对齐
const (
    ErrorInvalidInput = "invalid input"
    ErrorNotFound    = "not found"
    ErrorInternal    = "internal error"
)
```

### 行长度

```go
// ✅ 好的行长度
func processRequest(user *User, req *Request, ctx context.Context) (*Response, error) {
    // 函数签名可以长
}

// 长参数列表可以拆分
func process(
    user *User,
    req *Request,
    ctx context.Context,
    opts ...Option,
) (*Response, error) {
    // ...
}

// ❌ 避免过长的单行
result := someVeryLongFunctionName(withMany, parameters, that, make, the, line, too, long)
```

### 导入分组

```go
// ✅ 标准导入分组
import (
    // 标准库
    "context"
    "fmt"
    "net/http"

    // 第三方库
    "github.com/gin-gonic/gin"
    "go.uber.org/zap"

    // 本地包
    "myapp/internal/handler"
    "myapp/internal/service"
)

// ✅ 使用 gofmt 自动格式化
```

## 注释规范

### 包注释

```go
// ✅ 好的包注释
// Package user provides user management functionality.
//
// This package handles user registration, authentication,
// and profile management.
package user

// ✅ 简洁的包注释
// Package api implements HTTP API handlers.
package api

// ❌ 没有包注释
package user
```

### 函数注释

```go
// ✅ 好的函数注释
// GetUser retrieves a user by ID.
// It returns ErrUserNotFound if the user doesn't exist.
func GetUser(id string) (*User, error) {
    // ...
}

// ✅ 带示例的注释
// NewClient creates a new HTTP client with the given timeout.
//
// Example:
//   client := NewClient(30 * time.Second)
//   resp, err := client.Get("https://example.com")
func NewClient(timeout time.Duration) *http.Client {
    // ...
}

// ❌ 不好的函数注释
// GetUser gets the user
func GetUser(id string) (*User, error) {
    // 太简单，没有说明返回值和错误
}
```

### 导出的注释

```go
// ✅ 好的导出注释
// MaxConnections is the maximum number of concurrent connections.
// The default value is 100.
const MaxConnections = 100

// UserService handles user business logic.
type UserService struct {
    repo UserRepository
}

// ❌ 没有注释
const MaxConnections = 100

type UserService struct {
    repo UserRepository
}
```

### 行内注释

```go
// ✅ 好的行内注释
// 检查用户是否已存在
if exists {
    return ErrUserExists
}

// ✅ 解释"为什么"而不是"是什么"
// 使用 defer 确保文件总是被关闭
defer file.Close()

// ❌ 不好的行内注释
// 检查 exists
if exists {
    return err
}

// ❌ 重复代码的注释
// 设置 count 为 0
count := 0
```

## 错误处理

### 错误创建

```go
// ✅ 好的错误创建
var (
    ErrUserNotFound = errors.New("user not found")
    ErrInvalidInput = errors.New("invalid input")
)

func getUser(id string) (*User, error) {
    if id == "" {
        return nil, ErrInvalidInput
    }
    // ...
}

// ✅ 错误包装
if err != nil {
    return nil, fmt.Errorf("failed to get user: %w", err)
}
```

### 错误检查

```go
// ✅ 好的错误检查
user, err := getUser(id)
if err != nil {
    if errors.Is(err, ErrUserNotFound) {
        return nil, ErrUserNotFound
    }
    return nil, fmt.Errorf("unexpected error: %w", err)
}

// ❌ 忽略错误
user, _ := getUser(id)  // 不要忽略错误
```

## 并发规范

### Goroutine 命名

```go
// ✅ 好的 goroutine 命名
go processOrders()
go handleConnection(conn)

// ✅ 带上下文的 goroutine
go func() {
    // 处理逻辑
}()

// ❌ 匿名 goroutine
go func() {
    // 不清晰的用途
}()
```

### 通道使用

```go
// ✅ 好的通道命名
results := make(chan Result)    // 复数形式
done := make(chan struct{})     // 信号通道

// ✅ 通道方向
func sendResults(ch chan<- Result) {
    // 只发送
}

func receiveResults(ch <-chan Result) {
    // 只接收
}

// ✅ 关闭通道
close(results)
```

### 互斥锁

```go
// ✅ 好的互斥锁使用
var (
    mu    sync.RWMutex
    users map[string]*User
)

func getUser(id string) *User {
    mu.RLock()
    defer mu.RUnlock()
    return users[id]
}

func addUser(u *User) {
    mu.Lock()
    defer mu.Unlock()
    users[u.ID] = u
}

// ❌ 忘记解锁
mu.Lock()
users[id] = user
// 忘记 defer mu.Unlock()
```

## 测试规范

### 测试文件命名

```go
// ✅ 好的测试文件名
// user_test.go - 测试 user.go
// user_integration_test.go - 集成测试

// ❌ 不好的测试文件名
// test_user.go - 不符合约定
// UserTests.go - 不应使用大写
```

### 测试函数命名

```go
// ✅ 好的测试函数名
func TestGetUser(t *testing.T) {
    // 测试 GetUser 函数
}

func TestGetUser_NotFound(t *testing.T) {
    // 测试特定场景
}

func TestGetUser_InvalidInput(t *testing.T) {
    // 测试边界条件
}

// ❌ 不好的测试函数名
func TestGet(t *testing.T) {
    // 太通用
}
```

### 表驱动测试

```go
// ✅ 好的表驱动测试
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        want    bool
    }{
        {"valid email", "user@example.com", true},
        {"invalid format", "invalid", false},
        {"empty string", "", false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := validateEmail(tt.email)
            if got != tt.want {
                t.Errorf("validateEmail(%q) = %v, want %v", tt.email, got, tt.want)
            }
        })
    }
}
```

## 性能规范

### 避免不必要的分配

```go
// ✅ 好的模式：预分配
users := make([]User, 0, 100)  // 预分配容量

// ❌ 不好的模式：频繁分配
var users []User
for i := 0; i < 100; i++ {
    users = append(users, User{})  // 多次重新分配
}
```

### 使用 strings.Builder

```go
// ✅ 好的模式
var builder strings.Builder
builder.Grow(100)
for _, s := range strings {
    builder.WriteString(s)
}
result := builder.String()

// ❌ 不好的模式
result := ""
for _, s := range strings {
    result += s  // 每次都创建新字符串
}
```

### 缓存和复用

```go
// ✅ 使用 sync.Pool
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func process() {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufPool.Put(buf)
    }()
    // 使用 buf
}
```

## 最佳实践

::: tip 代码规范建议

1. **使用 gofmt** - 自动格式化代码
2. **使用 go vet** - 静态代码分析
3. **命名清晰** - 变量、函数名应描述性
4. **添加注释** - 导出的标识符必须有注释
5. **错误处理** - 始终检查错误

:::

```go
// ✅ 好的模式
func goodExample() error {
    // 清晰的命名
    userID := getUserID()

    // 适当的注释
    // 检查用户是否存在
    user, err := getUser(userID)
    if err != nil {
        return fmt.Errorf("failed to get user: %w", err)
    }

    return nil
}
```

## 工具推荐

### 代码检查

```bash
# 格式化代码
go fmt ./...

# 静态分析
go vet ./...

# 使用 golangci-lint
golangci-lint run

# 自动修复
goimports -w .
```

### 预提交钩子

```bash
# .git/hooks/pre-commit
#!/bin/sh
go fmt ./...
go vet ./...
golangci-lint run
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **命名** | 驼峰命名、描述性 |
| **格式** | 使用 gofmt |
| **注释** | 导出项必须有注释 |
| **错误** | 总是检查和处理错误 |
| **测试** | 表驱动测试 |

::: v-pre

[日志系统](./logging.md) → [配置管理](./config.md)

:::
