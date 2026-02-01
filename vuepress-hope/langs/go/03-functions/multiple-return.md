---
title: 多返回值
icon: ri:git-branch-line
order: 3
---

# 多返回值

Go 支持函数返回多个值，这是 Go 语言处理错误的核心机制。

## 多返回值基础

### 基本语法

```go
// 返回两个值
func divide(a, b int) (int, int) {
    quotient := a / b
    remainder := a % b
    return quotient, remainder
}

q, r := divide(10, 3)
fmt.Println(q)  // 3
fmt.Println(r)  // 1

// 返回不同类型
func parseInput(input string) (int, error) {
    value, err := strconv.Atoi(input)
    if err != nil {
        return 0, fmt.Errorf("invalid input: %w", err)
    }
    return value, nil
}

result, err := parseInput("42")
if err != nil {
    fmt.Println("Error:", err)
} else {
    fmt.Println("Result:", result)
}
```

### 接收多返回值

```go
// 接收所有返回值
name, age := getUser()
fmt.Println(name, age)

// 忽略部分返回值（使用 _）
name, _ = getUser()
_, age = getUser()

// 只接收错误
_, err := doSomething()
if err != nil {
    log.Fatal(err)
}

// 接收但暂不使用
result, err := process()
if err != nil {
    return err
}
// 使用 result...
```

## 命名返回值

### 基本用法

```go
// 命名返回值
func calculate(a, b int) (sum int, product int) {
    sum = a + b       // 直接赋值
    product = a * b
    return            // 隐式返回所有命名返回值
}

s, p := calculate(5, 3)
fmt.Println(s)  // 8
fmt.Println(p)  // 15

// 命名返回值更有意义
func getUserByID(id int) (user *User, err error) {
    // defer 中可以访问命名返回值
    defer func() {
        if err != nil {
            log.Printf("get user %d failed: %v", id, err)
        }
    }()

    user, err = db.QueryUser(id)
    if err != nil {
        return nil, fmt.Errorf("query failed: %w", err)
    }

    return user, nil
}
```

### 命名返回值与 defer

```go
// defer 修改命名返回值
func example() (result int) {
    defer func() {
        result *= 2  // 延迟执行时修改返回值
    }()
    return 5  // result = 5
}

fmt.Println(example())  // 10

// 实际应用：获取执行时间
func timedOperation() (result int, duration time.Duration) {
    start := time.Now()

    defer func() {
        duration = time.Since(start)
    }()

    // 执行操作
    time.Sleep(100 * time.Millisecond)
    result = 42

    return result, duration
}

result, duration := timedOperation()
fmt.Println(result)    // 42
fmt.Println(duration)  // ~100ms
```

### 避免过度使用

```go
// ✅ 适合使用命名返回值的场景
// 1. 清晰的文档作用
func NextByte() (byte, error) {
    // 一眼就知道返回什么
}

func Write(data []byte) (n int, err error) {
    // 标准库风格的命名返回值
}

// 2. defer 中需要访问返回值
func process() (result string, err error) {
    defer func() {
        if err != nil {
            log.Println("error:", err)
        }
    }()
    // ...
    return
}

// ❌ 不适合的场景
func calculate(x, y int) (sum int, diff int, prod int, quot int) {
    // 返回值太多，难以理解
    sum = x + y
    diff = x - y
    prod = x * y
    quot = x / y
    return
}

// ✅ 更好的方式：使用结构体
type Result struct {
    Sum     int
    Diff    int
    Product int
    Quotient int
}

func calculate(x, y int) Result {
    return Result{
        Sum:     x + y,
        Diff:    x - y,
        Product: x * y,
        Quotient: x / y,
    }
}
```

## 错误处理

### 错误返回值模式

```go
// 标准 Go 错误处理模式
func readFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err
    }
    return data, nil
}

// 调用
data, err := readFile("config.json")
if err != nil {
    log.Fatalf("Failed to read file: %v", err)
}
fmt.Println(string(data))
```

### 错误包装

```go
// 错误包装（Go 1.13+）
func loadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("read config: %w", err)
    }

    var cfg Config
    if err := json.Unmarshal(data, &cfg); err != nil {
        return nil, fmt.Errorf("parse config: %w", err)
    }

    return &cfg, nil
}

// 错误解包
cfg, err := loadConfig("config.json")
if err != nil {
    // 检查特定错误
    if os.IsNotExist(err) {
        // 处理文件不存在
    } else {
        // 其他错误
    }
    log.Fatal(err)
}
```

### 自定义错误

```go
// 自定义错误类型
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed for %s: %s", e.Field, e.Message)
}

func validateUser(user User) error {
    if user.Name == "" {
        return &ValidationError{
            Field:   "name",
            Message: "name cannot be empty",
        }
    }
    if user.Age < 0 {
        return &ValidationError{
            Field:   "age",
            Message: "age cannot be negative",
        }
    }
    return nil
}

// 使用
err := validateUser(User{Name: "", Age: -1})
if err != nil {
    if validationErr, ok := err.(*ValidationError); ok {
        fmt.Printf("Field: %s, Message: %s\n",
            validationErr.Field, validationErr.Message)
    }
}
```

## 常见模式

### bool, error 模式

```go
// 检查是否满足某个条件
func isValid(value string) (bool, error) {
    if value == "" {
        return false, fmt.Errorf("value is empty")
    }
    return true, nil
}

// 使用
if ok, err := isValid(input); err != nil {
    log.Println("Validation error:", err)
} else if ok {
    fmt.Println("Value is valid")
}
```

### T, ok 模式

```go
// 尝试执行某个操作
func tryParseInt(s string) (int, bool) {
    val, err := strconv.Atoi(s)
    if err != nil {
        return 0, false
    }
    return val, true
}

// 使用
if value, ok := tryParseInt(input); ok {
    fmt.Println("Parsed:", value)
} else {
    fmt.Println("Invalid integer")
}
```

### 重试模式

```go
// 返回是否应该继续重试
func attemptOperation() (success bool, shouldRetry bool, err error) {
    // 尝试操作
    if someTransientError {
        return false, true, nil
    }
    if success {
        return true, false, nil
    }
    return false, false, err
}

// 使用
for i := 0; i < maxRetries; i++ {
    success, shouldRetry, err := attemptOperation()
    if success {
        break
    }
    if !shouldRetry {
        return err
    }
    time.Sleep(backoff(i))
}
```

## 返回值优化

### 避免不必要的返回

```go
// ❌ 返回值过多
func process(data []byte) (processed []byte, count int, errors []error, warnings []string) {
    // 难以使用和理解
}

// ✅ 使用结构体
type ProcessResult struct {
    Processed []byte
    Count     int
    Errors    []error
    Warnings  []string
}

func process(data []byte) ProcessResult {
    return ProcessResult{
        Processed: data,
        Count:     len(data),
    }
}
```

### 返回指针 vs 返回值

```go
// 返回大结构体时使用指针
type LargeStruct struct {
    data [1024]int
}

// ✅ 返回指针（避免复制）
func createLarge() *LargeStruct {
    return &LargeStruct{}
}

// 小结构体返回值
type Point struct {
    X, Y int
}

// ✅ 返回值（简单且可能避免堆分配）
func makePoint(x, y int) Point {
    return Point{X: x, Y: y}
}
```

## 实战示例

### HTTP 处理器

```go
func handleRequest(w http.ResponseWriter, r *http.Request) {
    // 解析参数
    param := r.URL.Query().Get("id")

    // 调用服务
    data, err := service.GetData(param)
    if err != nil {
        // 返回错误
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // 返回成功
    json.NewEncoder(w).Encode(data)
}
```

### 数据库操作

```go
func (db *DB) CreateUser(user User) (id int64, err error) {
    ctx := context.Background()

    // 开始事务
    tx, err := db.BeginTx(ctx, nil)
    if err != nil {
        return 0, fmt.Errorf("begin transaction: %w", err)
    }

    // 确保事务处理
    defer func() {
        if err != nil {
            tx.Rollback()
            return
        }
        err = tx.Commit()
    }()

    // 执行插入
    result, err := tx.ExecContext(ctx,
        "INSERT INTO users (name, email) VALUES (?, ?)",
        user.Name, user.Email)
    if err != nil {
        return 0, fmt.Errorf("insert user: %w", err)
    }

    // 获取 ID
    id, err = result.LastInsertId()
    if err != nil {
        return 0, fmt.Errorf("get last insert id: %w", err)
    }

    return id, nil
}
```

## 最佳实践

::: tip 使用建议

1. **错误最后返回** - 错误作为最后一个返回值
2. **不要忽略错误** - 始终检查返回的错误
3. **尽早返回** - 错误时尽早返回，避免嵌套
4. **包装错误** - 添加上下文信息
5. **谨慎命名返回值** - 只在有意义时使用

:::

```go
// ✅ 好的模式
func processFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("read file: %w", err)
    }

    result, err := process(data)
    if err != nil {
        return nil, fmt.Errorf("process data: %w", err)
    }

    return result, nil
}

// ❌ 不好的模式
func processFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err == nil {
        result, err := process(data)
        if err == nil {
            return result, nil
        }
        return nil, err
    }
    return nil, err
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **多返回值** | Go 的核心特性 |
| **错误处理** | 错误作为最后一个返回值 |
| **命名返回值** | 提高可读性，支持 defer 修改 |
| **错误包装** | 使用 `%w` 包装错误 |
| **早期返回** | 避免深层嵌套 |

::: v-pre

[函数基础](./function-basics.md) → [可变参数](./variadic.md)

:::
