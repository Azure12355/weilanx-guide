---
title: 类型断言
icon: ri:git-branch-line
order: 4
---

# 类型断言

类型断言用于检查接口值的动态类型，或将其转换为具体类型。

## 类型断言语法

### 基本语法

```go
// 类型断言格式
value, ok := interfaceValue.(ConcreteType)

// 示例
var x interface{} = "hello"

// 断言为 string
s, ok := x.(string)
if ok {
    fmt.Println(s)  // hello
}

// 断言为 int（会失败）
i, ok := x.(int)
fmt.Println(i, ok)  // 0 false
```

### 直接断言

```go
var x interface{} = 42

// 直接断言（不推荐，会 panic）
// n := x.(int)
// fmt.Println(n)  // 42

// 如果类型不匹配会 panic
// s := x.(string)  // panic: interface conversion

// 推荐：使用 comma ok 模式
if n, ok := x.(int); ok {
    fmt.Println(n)  // 42
}
```

## Comma Ok 模式

### 安全断言

```go
// 安全的类型断言
func processValue(v interface{}) {
    // 尝试断言为 string
    if s, ok := v.(string); ok {
        fmt.Println("String:", s)
        return
    }

    // 尝试断言为 int
    if i, ok := v.(int); ok {
        fmt.Println("Int:", i)
        return
    }

    // 都不是
    fmt.Println("Unknown type")
}

processValue("hello")  // String: hello
processValue(42)       // Int: 42
processValue(3.14)      // Unknown type
```

### nil 检查

```go
type Speaker interface {
    Speak() string
}

type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return "Woof!"
}

func main() {
    var s Speaker
    fmt.Println(s == nil)  // true

    // 包含 nil 指针的接口
    var d *Dog
    s = d
    fmt.Println(s == nil)  // false

    // 检查是否为 nil 且类型为 nil
    if s == nil {
        fmt.Println("truly nil")
    } else if s.(*Dog) == nil {
        fmt.Println("Dog pointer is nil")
    }
}
```

## Type Switch

### 基本语法

```go
// type switch 语法
switch v := interfaceValue.(type) {
case Type1:
    // v 的类型是 Type1
case Type2:
    // v 的类型是 Type2
case nil:
    // v 是 nil
default:
    // v 是其他类型
}

// 示例
func printType(v interface{}) {
    switch v := v.(type) {
    case int:
        fmt.Println("Int:", v)
    case string:
        fmt.Println("String:", v)
    case bool:
        fmt.Println("Bool:", v)
    case nil:
        fmt.Println("Nil")
    default:
        fmt.Println("Unknown type")
    }
}

printType(42)       // Int: 42
printType("hello")  // String: hello
printType(true)     // Bool: true
printType(nil)      // Nil
```

### 处理多种类型

```go
func formatValue(v interface{}) string {
    switch v := v.(type) {
    case int:
        return fmt.Sprintf("Int: %d", v)
    case float64:
        return fmt.Sprintf("Float: %.2f", v)
    case string:
        return fmt.Sprintf("String: %q", v)
    case bool:
        return fmt.Sprintf("Bool: %t", v)
    case []int:
        return fmt.Sprintf("IntSlice: %v", v)
    case map[string]int:
        return fmt.Sprintf("MapStringInt: %v", v)
    default:
        return fmt.Sprintf("Unknown: %T", v)
    }
}

fmt.Println(formatValue(42))          // Int: 42
fmt.Println(formatValue(3.14))        // Float: 3.14
fmt.Println(formatValue("hello"))     // String: "hello"
fmt.Println(formatValue([]int{1,2})) // IntSlice: [1 2]
```

### 接口类型

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

func describeInterface(i interface{}) {
    switch i := i.(type) {
    case Reader:
        fmt.Println("It's a Reader")
    case Writer:
        fmt.Println("It's a Writer")
    case interface{ Read(p []byte) (n int, err error); Write(p []byte) (n int, err error) }:
        fmt.Println("It's both Reader and Writer")
    default:
        fmt.Println("Unknown interface")
    }
}
```

## 类型断言应用

### JSON 解析

```go
// JSON 数据可能是多种类型
func parseJSON(data []byte) {
    var v interface{}
    json.Unmarshal(data, &v)

    switch v := v.(type) {
    case string:
        fmt.Println("String:", v)
    case float64:
        fmt.Println("Number:", v)
    case bool:
        fmt.Println("Bool:", v)
    case []interface{}:
        fmt.Println("Array:", v)
    case map[string]interface{}:
        fmt.Println("Object:", v)
    case nil:
        fmt.Println("Null")
    }
}
```

### 错误处理

```go
// 不同类型的错误需要不同处理
func handleError(err error) {
    switch e := err.(type) {
    case *ValidationError:
        fmt.Printf("Validation error: %s\n", e.Message)
    case *TimeoutError:
        fmt.Printf("Timeout error: %v\n", e.Duration)
    case *NetworkError:
        fmt.Printf("Network error: %s\n", e.Address)
    default:
        fmt.Printf("Unknown error: %v\n", err)
    }
}
```

### 适配器模式

```go
func processAny(input interface{}) error {
    switch v := input.(type) {
    case string:
        return processString(v)
    case []byte:
        return processBytes(v)
    case io.Reader:
        return processReader(v)
    case []string:
        return processStrings(v)
    default:
        return fmt.Errorf("unsupported type: %T", input)
    }
}

func processString(s string) error {
    fmt.Println("Processing string:", s)
    return nil
}

func processBytes(b []byte) error {
    fmt.Println("Processing bytes:", len(b))
    return nil
}

func processReader(r io.Reader) error {
    fmt.Println("Processing reader")
    return nil
}

func processStrings(s []string) error {
    fmt.Println("Processing strings:", s)
    return nil
}
```

## 指针断言

### 值 vs 指针

```go
type Person struct {
    Name string
}

func (p Person) String() string {
    return p.Name
}

func main() {
    p := Person{Name: "Alice"}

    // 值实现接口
    var s fmt.Stringer = p
    fmt.Println(s.(Person))  // {Alice}

    // 不能断言为指针
    // pp := s.(*Person)  // panic

    // 指针实现接口
    var s2 fmt.Stringer = &p
    fmt.Println(s2.(*Person))  // &{Alice}

    // 可以断言为指针
    if pp, ok := s2.(*Person); ok {
        fmt.Println(pp.Name)  // Alice
    }
}
```

### 接口转换

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer(p []byte) (n int, err error)
}

func convertInterface(rw ReadWriter) Reader {
    // ReadWriter 包含 Reader，可以转换
    return rw
}

func main() {
    var rw ReadWriter
    var r Reader = rw  // OK

    // 但不能反向转换
    // rw = r  // 编译错误

    // 需要类型断言
    if rw2, ok := r.(ReadWriter); ok {
        // r 实际上是 ReadWriter
        _ = rw2
    }
}
```

## 类型断言陷阱

### nil 接口值

```go
func returnsInterface() interface{} {
    var p *Person = nil
    return p  // 返回 nil 指针，但接口不是 nil
}

func main() {
    i := returnsInterface()
    fmt.Println(i == nil)  // false！

    // 正确的 nil 检查
    if v, ok := i.(*Person); ok {
        fmt.Println("Person pointer:", v)
        if v == nil {
            fmt.Println("Pointer is nil")
        }
    }
}
```

### 类型不匹配

```go
// 尝试断言为错误的类型
var i interface{} = "hello"

// ❌ 直接断言为 int 会 panic
// n := i.(int)  // panic: interface conversion

// ✅ 使用 comma ok 模式
if n, ok := i.(int); ok {
    fmt.Println(n)
} else {
    fmt.Println("Not an int")
}
```

## 实战示例

### 消息处理

```go
type Message interface {
    Type() string
}

type TextMessage struct {
    Content string
}

func (tm TextMessage) Type() string {
    return "text"
}

type ImageMessage struct {
    URL  string
    Size int
}

func (im ImageMessage) Type() string {
    return "image"
}

func handleMessage(msg Message) {
    switch m := msg.(type) {
    case TextMessage:
        fmt.Printf("Text: %s\n", m.Content)
    case ImageMessage:
        fmt.Printf("Image: %s (%d bytes)\n", m.URL, m.Size)
    default:
        fmt.Printf("Unknown message type: %s\n", m.Type())
    }
}
```

### 插件系统

```go
type Plugin interface {
    Name() string
    Execute() error
}

func loadPlugin(name string) (Plugin, error) {
    switch name {
    case "logger":
        return &LoggerPlugin{}, nil
    case "cache":
        return &CachePlugin{}, nil
    default:
        return nil, fmt.Errorf("unknown plugin: %s", name)
    }
}

func usePlugin(p Plugin) {
    fmt.Printf("Using plugin: %s\n", p.Name())
    if err := p.Execute(); err != nil {
        log.Printf("Plugin error: %v\n", err)
    }
}
```

## 最佳实践

::: tip 使用建议

1. **始终使用 comma ok** - 避免直接断言导致 panic
2. **type switch** - 处理多种类型时使用
3. **检查 nil** - 断言后检查是否为 nil
4. **错误处理** - 为类型不匹配提供清晰的处理
5. **避免过度** - 不要过度使用类型断言

:::

```go
// ✅ 好的模式
func process(v interface{}) error {
    switch x := v.(type) {
    case string:
        return processString(x)
    case int:
        return processInt(x)
    default:
        return fmt.Errorf("unsupported type: %T", v)
    }
}

// ❌ 不好的模式
func process(v interface{}) error {
    // 直接断言可能 panic
    s := v.(string)
    return processString(s)
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **基本断言** | `value.(Type)` |
| **comma ok** | `value, ok := value.(Type)` |
| **type switch** | `switch v := value.(type)` |
| **panic** - 直接断言失败会 panic |
| **安全** - 始终使用 comma ok 模式 |

::: v-pre

[接口实现](./interface-implementation.md) → [类型嵌入](./type-embedding.md)

:::
