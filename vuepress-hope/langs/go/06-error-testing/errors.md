---
title: 错误处理
icon: ri:error-warning-line
order: 2
---

# 错误处理

Go 采用显式的错误处理方式，通过返回值来传递错误，而非使用异常。

## Error 接口

### 基本概念

```go
// error 是内置接口类型
type error interface {
    Error() string
}

// 创建错误的基本方法
err := errors.New("something went wrong")
fmt.Println(err)  // something went wrong
```

### 创建错误

```go
import (
    "errors"
    "fmt"
)

// 1. errors.New - 简单错误
err1 := errors.New("file not found")

// 2. fmt.Errorf - 格式化错误
err2 := fmt.Errorf("invalid value: %d", 42)

// 3. 自定义错误类型
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed for %s: %s", e.Field, e.Message)
}

err3 := &ValidationError{Field: "email", Message: "invalid format"}
```

## 错误处理模式

### 基本模式

```go
func readFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err  // 返回错误
    }
    return data, nil
}

func main() {
    data, err := readFile("config.json")
    if err != nil {
        // 处理错误
        log.Fatal(err)
    }
    // 使用 data
    _ = data
}
```

### 错误检查

```go
// 1. 立即检查
func goodPattern() {
    data, err := fetchData()
    if err != nil {
        return err
    }
    processData(data)
}

// 2. 延迟检查（不推荐）
func badPattern() {
    data, err := fetchData()
    processData(data)  // 如果 err 不为 nil，data 可能无效
    if err != nil {
        return err
    }
}

// 3. 忽略错误（不推荐）
func ignoreError() {
    data, _ := fetchData()  // 忽略错误
    processData(data)
}
```

## 错误包装

### 基本包装

```go
// 使用 %w 包装错误，保留原始错误
func loadConfig() error {
    data, err := os.ReadFile("config.json")
    if err != nil {
        return fmt.Errorf("load config failed: %w", err)
    }
    // 解析配置
    return nil
}

// 使用 %v 格式化错误（不保留原始错误）
func processData() error {
    data, err := fetchData()
    if err != nil {
        return fmt.Errorf("process failed: %v", err)
    }
    return nil
}
```

### 错误链

```go
// errors.Is 检查错误链
func checkError() {
    err := loadConfig()
    if errors.Is(err, os.ErrNotExist) {
        fmt.Println("Config file not found")
    } else if err != nil {
        fmt.Println("Other error:", err)
    }
}

// errors.As 获取特定错误类型
func unwrapError() {
    err := someOperation()

    var pathErr *os.PathError
    if errors.As(err, &pathErr) {
        fmt.Printf("Path error: %s\n", pathErr.Path)
    }
}

// Unwrap 获取底层错误
func unwrapError() {
    err := fmt.Errorf("layer 1: %w", errors.New("layer 2"))
    wrapped := errors.Unwrap(err)
    fmt.Println(wrapped)  // layer 2
}
```

## 自定义错误

### 错误结构

```go
// 定义错误类型
type AppError struct {
    Code    int
    Message string
    Err     error
}

func (e *AppError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("[%d] %s: %v", e.Code, e.Message, e.Err)
    }
    return fmt.Sprintf("[%d] %s", e.Code, e.Message)
}

// 实现 Unwrap 方法支持错误链
func (e *AppError) Unwrap() error {
    return e.Err
}

// 使用
func processData(data string) error {
    if data == "" {
        return &AppError{
            Code:    400,
            Message: "empty data",
        }
    }
    return nil
}
```

### 错误方法

```go
type NotFoundError struct {
    Resource string
    ID       int
}

func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s with ID %d not found", e.Resource, e.ID)
}

// 实现 Is 方法
func (e *NotFoundError) Is(target error) bool {
    _, ok := target.(*NotFoundError)
    return ok
}

// 使用
func getUser(id int) error {
    user, err := db.FindUser(id)
    if err != nil {
        return &NotFoundError{Resource: "User", ID: id}
    }
    _ = user
    return nil
}

func checkUser() {
    err := getUser(123)
    if errors.Is(err, &NotFoundError{}) {
        fmt.Println("User not found")
    }
}
```

## 错误处理场景

### 文件操作

```go
func readFileContent(path string) (string, error) {
    // 检查文件是否存在
    if _, err := os.Stat(path); os.IsNotExist(err) {
        return "", fmt.Errorf("file %s does not exist", path)
    }

    // 读取文件
    data, err := os.ReadFile(path)
    if err != nil {
        return "", fmt.Errorf("read file failed: %w", err)
    }

    return string(data), nil
}

func writeFileContent(path, content string) error {
    // 写入文件
    err := os.WriteFile(path, []byte(content), 0644)
    if err != nil {
        return fmt.Errorf("write file failed: %w", err)
    }
    return nil
}
```

### 网络请求

```go
func fetchURL(url string) ([]byte, error) {
    resp, err := http.Get(url)
    if err != nil {
        return nil, fmt.Errorf("http get failed: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
    }

    data, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("read body failed: %w", err)
    }

    return data, nil
}
```

### 数据库操作

```go
func queryUser(db *sql.DB, id int) (*User, error) {
    var user User
    err := db.QueryRow("SELECT id, name FROM users WHERE id = ?", id).Scan(&user.ID, &user.Name)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("user %d not found", id)
        }
        return nil, fmt.Errorf("query failed: %w", err)
    }
    return &user, nil
}
```

## 错误处理最佳实践

### 错误返回

```go
// ✅ 好的做法
func goodFunction() error {
    if err := doSomething(); err != nil {
        return fmt.Errorf("do something failed: %w", err)
    }
    return nil
}

// ❌ 不好的做法：吞掉错误
func badFunction() error {
    doSomething()
    return nil
}

// ✅ 好的做法：先处理错误
func process() error {
    data, err := fetchData()
    if err != nil {
        return err
    }
    return processData(data)
}
```

### 错误检查

```go
// ✅ 好的做法：立即检查
func checkImmediately() error {
    data, err := fetchData()
    if err != nil {
        return err
    }

    result, err := processData(data)
    if err != nil {
        return err
    }

    return saveResult(result)
}

// ❌ 不好的做法：延迟检查
func checkLater() error {
    data, err := fetchData()
    result, err2 := processData(data)
    finalErr := saveResult(result)

    // 太多错误需要处理
    if err != nil {
        return err
    }
    if err2 != nil {
        return err2
    }
    return finalErr
}
```

### 错误包装

```go
// ✅ 好的做法：使用 %w 保留错误链
func wrapGood() error {
    if err := doWork(); err != nil {
        return fmt.Errorf("work failed: %w", err)
    }
    return nil
}

// ❌ 不好的做法：使用 %v 丢失错误链
func wrapBad() error {
    if err := doWork(); err != nil {
        return fmt.Errorf("work failed: %v", err)
    }
    return nil
}
```

## 错误处理工具

### 错误判断

```go
// errors.Is - 检查错误链
if errors.Is(err, os.ErrNotExist) {
    // 文件不存在
}

// errors.As - 获取特定类型
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Printf("Path: %s\n", pathErr.Path)
}
```

### 错误信息

```go
// 获取错误信息
fmt.Println(err.Error())  // 错误字符串
errors.Unwrap(err)        // 底层错误

// 完整错误链
fmt.Println(err)  // 输出完整错误链
```

## 最佳实践

::: tip 使用建议

1. **始终检查错误** - 不要忽略返回的错误
2. **错误包装** - 使用 `%w` 保留错误链
3. **自定义错误** - 为特定场景定义错误类型
4. **错误信息** - 提供足够的上下文信息
5. **避免 Panic** - 使用错误而非异常处理

:::

```go
// ✅ 好的模式
func bestPractice() error {
    data, err := fetchData()
    if err != nil {
        return fmt.Errorf("fetch data failed: %w", err)
    }

    if err := validateData(data); err != nil {
        return fmt.Errorf("validation failed: %w", err)
    }

    return saveData(data)
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Error 接口** - `Error() string` |
| **创建错误** - `errors.New`, `fmt.Errorf` |
| **错误包装** - 使用 `%w` 保留错误链 |
| **errors.Is** - 检查错误类型 |
| **errors.As** - 获取特定错误 |
| **errors.Unwrap** - 获取底层错误 |

::: v-pre

[错误处理总览](./README.md) → [自定义错误](./custom-errors.md)

:::
