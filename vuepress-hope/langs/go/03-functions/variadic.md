---
title: 可变参数
icon: ri:list-check
order: 4
---

# 可变参数

可变参数允许函数接受任意数量的参数，提供更灵活的函数调用方式。

## 可变参数基础

### 基本语法

```go
// 可变参数声明：...Type
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

// 调用方式
sum()                    // 0
sum(1)                   // 1
sum(1, 2, 3)            // 6
sum(1, 2, 3, 4, 5)      // 15

// 可变参数实际上是切片
func printAll(values ...string) {
    fmt.Printf("Type: %T\n", values)  // []string
    for i, v := range values {
        fmt.Printf("[%d] = %s\n", i, v)
    }
}

printAll("a", "b", "c")
// Type: []string
// [0] = a
// [1] = b
// [2] = c
```

### 混合参数

```go
// 可变参数必须在最后
func greet(greeting string, names ...string) {
    for _, name := range names {
        fmt.Printf("%s, %s!\n", greeting, name)
    }
}

greet("Hello", "Alice", "Bob", "Charlie")
// Hello, Alice!
// Hello, Bob!
// Hello, Charlie!

// 多个固定参数 + 可变参数
func format(separator string, values ...int) string {
    result := ""
    for i, v := range values {
        if i > 0 {
            result += separator
        }
        result += fmt.Sprintf("%d", v)
    }
    return result
}

fmt.Println(format("-", 1, 2, 3, 4))  // 1-2-3-4
```

## 切片展开

### 传递切片

```go
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

// 直接传值
sum(1, 2, 3)  // 6

// 传递切片（使用 ... 展开）
nums := []int{1, 2, 3, 4, 5}
sum(nums...)  // 15

// 部分切片展开
nums := []int{1, 2, 3, 4, 5}
sum(nums[:3]...)  // 6 (1+2+3)
sum(nums[2:]...)  // 12 (3+4+5)
```

### 切片追加

```go
// append 也使用可变参数
slice := []int{1, 2, 3}

// 追加单个元素
slice = append(slice, 4)
// [1 2 3 4]

// 追加多个元素
slice = append(slice, 5, 6, 7)
// [1 2 3 4 5 6 7]

// 追加另一个切片
another := []int{8, 9, 10}
slice = append(slice, another...)
// [1 2 3 4 5 6 7 8 9 10]
```

## 常见模式

### 格式化输出

```go
// fmt.Printf 使用可变参数
fmt.Printf("Name: %s, Age: %d\n", "Alice", 25)

// 自定义日志函数
func log(level string, format string, args ...interface{}) {
    timestamp := time.Now().Format("2006-01-02 15:04:05")
    msg := fmt.Sprintf(format, args...)
    fmt.Printf("[%s] %s: %s\n", timestamp, level, msg)
}

log("INFO", "User %s logged in", "Alice")
log("ERROR", "Failed to connect: %v", err)
```

### 构造函数

```go
// NewSlice 创建并初始化切片
func NewSlice(values ...int) []int {
    result := make([]int, len(values))
    copy(result, values)
    return result
}

// NewMap 创建并初始化 map
func NewMap(pairs ...interface{}) map[string]interface{} {
    m := make(map[string]interface{})
    for i := 0; i < len(pairs); i += 2 {
        if i+1 < len(pairs) {
            key := fmt.Sprintf("%v", pairs[i])
            m[key] = pairs[i+1]
        }
    }
    return m
}

// 使用
nums := NewSlice(1, 2, 3, 4, 5)
config := NewMap("host", "localhost", "port", 8080, "debug", true)
```

### 选项模式

```go
// 选项函数类型
type Option func(*Config)

// 配置选项
func WithHost(host string) Option {
    return func(c *Config) {
        c.Host = host
    }
}

func WithPort(port int) Option {
    return func(c *Config) {
        c.Port = port
    }
}

func WithDebug(debug bool) Option {
    return func(c *Config) {
        c.Debug = debug
    }
}

// 接受可变选项
func NewConfig(opts ...Option) *Config {
    cfg := &Config{
        Host: "localhost",
        Port: 8080,
        Debug: false,
    }

    for _, opt := range opts {
        opt(cfg)
    }

    return cfg
}

// 使用
config := NewConfig(
    WithHost("example.com"),
    WithPort(443),
    WithDebug(true),
)
```

## 实现细节

### 可变参数是切片

```go
func examine(nums ...int) {
    fmt.Printf("Length: %d\n", len(nums))
    fmt.Printf("Capacity: %d\n", cap(nums))
    fmt.Printf("Type: %T\n", nums)
}

examine(1, 2, 3)
// Length: 3
// Capacity: 3（底层可能有额外容量）
// Type: []int

// 可以进行切片操作
func firstAndLast(nums ...int) (int, int) {
    if len(nums) == 0 {
        return 0, 0
    }
    return nums[0], nums[len(nums)-1]
}

first, last := firstAndLast(1, 2, 3, 4, 5)
fmt.Println(first, last)  // 1 5
```

### 空可变参数

```go
// 空可变参数 = nil 切片
func printAll(values ...string) {
    if values == nil {
        fmt.Println("nil")
        return
    }
    fmt.Printf("%d items\n", len(values))
}

printAll()         // nil
printAll("a")      // 1 items
printAll("a", "b") // 2 items

// 区分不传和传空切片
s := []string{}
printAll(s...)     // 0 items（不是 nil）
```

## 性能考虑

### 避免不必要的复制

```go
// ❌ 每次调用都会创建新切片
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

// ✅ 对于大量数据，直接传递切片
func sumSlice(nums []int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

// 小量数据用可变参数（方便）
sum(1, 2, 3)

// 大量数据用切片（高效）
data := make([]int, 1000000)
sumSlice(data)
```

### 预分配容量

```go
// 预先知道数量时
func mergeResults(results ...[]int) []int {
    // 计算总长度
    total := 0
    for _, r := range results {
        total += len(r)
    }

    // 预分配
    merged := make([]int, 0, total)

    // 追加
    for _, r := range results {
        merged = append(merged, r...)
    }

    return merged
}
```

## 实战示例

### 日志库

```go
type Logger struct {
    prefix string
}

func (l *Logger) Log(format string, args ...interface{}) {
    msg := fmt.Sprintf(format, args...)
    fmt.Printf("[%s] %s\n", l.prefix, msg)
}

func (l *Logger) Logln(args ...interface{}) {
    msg := fmt.Sprintln(args...)
    fmt.Printf("[%s] %s", l.prefix, msg)
}

func main() {
    logger := &Logger{prefix: "APP"}
    logger.Log("User %s logged in at %v", "Alice", time.Now())
    logger.Logln("Processing", "batch", 123)
}
```

### SQL 构建

```go
func BuildQuery(table string, columns ...string) string {
    if len(columns) == 0 {
        return fmt.Sprintf("SELECT * FROM %s", table)
    }

    cols := strings.Join(columns, ", ")
    return fmt.Sprintf("SELECT %s FROM %s", cols, table)
}

BuildQuery("users")                          // SELECT * FROM users
BuildQuery("users", "id", "name", "email")   // SELECT id, name, email FROM users
```

### 配置合并

```go
func MergeConfig(base Config, updates ...func(*Config)) Config {
    result := base

    for _, update := range updates {
        update(&result)
    }

    return result
}

// 使用
base := Config{Host: "localhost", Port: 8080}

merged := MergeConfig(base,
    func(c *Config) { c.Host = "example.com" },
    func(c *Config) { c.Port = 443 },
    func(c *Config) { c.Debug = true },
)
```

## 最佳实践

::: tip 使用建议

1. **可变参数放最后** - 必须是参数列表的最后一个
2. **适度使用** - 不要滥用，保持代码清晰
3. **类型安全** - 可变参数是类型安全的
4. **性能考虑** - 大量数据时考虑直接使用切片
5. **命名清晰** - 参数名应该表明其可变性质

:::

```go
// ✅ 好的使用
func Printf(format string, args ...interface{})  // 标准库风格
func Append(slice []int, elems ...int) []int

// ❌ 避免使用
func Process(first int, second ...int, third int)  // 语法错误
func Process(all ...interface{})                  // 失去类型安全
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **语法** | `...Type` 声明，`slice...` 展开 |
| **本质** | 可变参数是切片 |
| **位置** | 必须是最后一个参数 |
| **调用** | 可以传递任意数量的参数 |
| **展开** | 切片可以用 `...` 展开传递 |

::: v-pre

[多返回值](./multiple-return.md) → [闭包](./closures.md)

:::
