---
title: 空接口与类型
icon: ri:question-line
order: 7
---

# 空接口与类型

空接口 `interface{}` 可以持有任何类型的值，是 Go 实现泛型和类型系统的基础。

## 空接口基础

### 基本概念

```go
// 空接口没有任何方法
type Empty interface {}

// interface{} 是空接口的常用写法
var any interface{}

// 可以持有任何值
any = 42
any = "hello"
any = true
any = []int{1, 2, 3}
any = map[string]int{"a": 1}

// 所有类型都实现了空接口
```

### 使用场景

```go
// 1. 存储任意类型
func storeAnything(value interface{}) {
    fmt.Printf("Type: %T, Value: %v\n", value, value)
}

storeAnything(42)         // int, 42
storeAnything("hello")    // string, hello
storeAnything(true)       // bool, true

// 2. 函数参数
func printAnything(v interface{}) {
    fmt.Println(v)
}

printAnything(42)
printAnything("hello")

// 3. 容器元素
var items []interface{}
items = append(items, 1)
items = append(items, "two")
items = append(items, true)
```

## 类型查询

### 类型断言

```go
func processValue(v interface{}) {
    // 尝试断言为具体类型
    if s, ok := v.(string); ok {
        fmt.Println("String:", s)
        return
    }

    if i, ok := v.(int); ok {
        fmt.Println("Int:", i)
        return
    }

    fmt.Println("Unknown type")
}

processValue("hello")  // String: hello
processValue(42)       // Int: 42
processValue(3.14)     // Unknown type
```

### Type Switch

```go
func describeType(v interface{}) {
    switch v := v.(type) {
    case nil:
        fmt.Println("nil")
    case int:
        fmt.Println("Integer:", v)
    case string:
        fmt.Println("String:", v)
    case bool:
        fmt.Println("Boolean:", v)
    case []int:
        fmt.Println("Int slice:", v)
    case map[string]interface{}:
        fmt.Println("Map:", v)
    default:
        fmt.Printf("Unknown type: %T\n", v)
    }
}

describeType(42)           // Integer: 42
describeType("hello")      // String: hello
describeType([]int{1, 2})  // Int slice: [1 2]
```

## 反射基础

### 反射简介

```go
import "reflect"

func inspect(v interface{}) {
    // 获取类型
    t := reflect.TypeOf(v)
    fmt.Println("Type:", t)

    // 获取值的种类
    fmt.Println("Kind:", t.Kind())

    // 获取值
    val := reflect.ValueOf(v)
    fmt.Println("Value:", val)

    // 如果是结构体
    if t.Kind() == reflect.Struct {
        for i := 0; i < t.NumField(); i++ {
            field := t.Field(i)
            fieldValue := val.Field(i)
            fmt.Printf("%s: %v\n", field.Name, fieldValue.Interface())
        }
    }
}

type Person struct {
    Name string
    Age  int
}

func main() {
    p := Person{Name: "Alice", Age: 25}
    inspect(p)
    // Type: main.Person
    // Kind: struct
    // Value: {Alice 25}
    // Name: Alice
    // Age: 25
}
```

### 修改值

```go
func modifyValue(v interface{}) {
    val := reflect.ValueOf(v)

    // 检查是否可修改
    if val.CanSet() {
        // 设置新值
        if val.Kind() == reflect.Int {
            val.SetInt(100)
        }
    }
}

type Config struct {
    Value int
}

func main() {
    c := Config{Value: 10}
    fmt.Println(c.Value)  // 10

    // 需要传递指针才能修改
    modifyValue(&c)
    fmt.Println(c.Value)  // 100
}
```

## 空接口陷阱

### 类型丢失

```go
func add(a, b interface{}) interface{} {
    // 类型信息丢失
    return a.(int) + b.(int)  // 危险
}

result := add(1, 2)
fmt.Println(result)  // 3

// 但这样会 panic
// add(1, "2")  // panic
```

### 运行时错误

```go
func wrongType(v interface{}) {
    // 编译通过，运行时 panic
    n := v.(int)  // 如果 v 不是 int 会 panic
    fmt.Println(n)
}

func safeType(v interface{}) error {
    // 安全的类型检查
    if n, ok := v.(int); ok {
        fmt.Println(n)
        return nil
    }
    return fmt.Errorf("not an int")
}
```

### 性能开销

```go
// ❌ 使用空接口（有性能开销）
func processSlice(items []interface{}) {
    for _, item := range items {
        _ = item
    }
}

// ✅ 使用具体类型
func processInts(items []int) {
    for _, item := range items {
        _ = item
    }
}

// 空接口需要反射和类型断言，有额外开销
```

## 最佳实践

### 避免空接口

```go
// ❌ 不推荐：过度使用空接口
func process(data interface{}) error {
    // 需要类型断言
    str, ok := data.(string)
    if !ok {
        return fmt.Errorf("expected string")
    }
    // 处理 str
    return nil
}

// ✅ 推荐：使用具体类型
func process(data string) error {
    // 直接使用，无需类型断言
    return nil
}

// ✅ 或者使用接口
type Processor interface {
    Process() error
}

func process(p Processor) error {
    return p.Process()
}
```

### 合理使用

```go
// ✅ 适合使用空接口的场景

// 1. 存储异构数据
type JSONData map[string]interface{}

// 2. 序列化/反序列化
func toJSON(v interface{}) (string, error) {
    data, err := json.Marshal(v)
    return string(data), err
}

// 3. 未知类型的函数
func fmtString(v interface{}) string {
    return fmt.Sprintf("%v", v)
}

// 4. 测试辅助
type TestHelper interface {
    AssertEqual(a, b interface{}) bool
}
```

## 泛型替代

### Go 1.18+ 泛型

```go
// 泛型比空接口更安全
// ❌ 使用空接口
func Max(a, b interface{}) interface{} {
    // 运行时检查，不安全
    return nil
}

// ✅ 使用泛型
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 使用
Max(3, 5)        // 5
Max("a", "b")     // b
// Max(3, "b")     // 编译错误
```

### 类型约束

```go
// 使用接口作为约束
type Stringer interface {
    String() string
}

func PrintString[T Stringer](v T) {
    fmt.Println(v.String())
}

type Person struct {
    Name string
}

func (p Person) String() string {
    return p.Name
}

// 使用
PrintString(Person{Name: "Alice"})  // Alice
```

## 实战示例

### JSON 数据

```go
// 处理未知结构的 JSON
func parseJSON(data []byte) (map[string]interface{}, error) {
    var result map[string]interface{}
    err := json.Unmarshal(data, &result)
    return result, err
}

// 使用
jsonStr := `{"name": "Alice", "age": 30, "active": true}`
data, _ := parseJSON([]byte(jsonStr))

for key, value := range data {
    fmt.Printf("%s: %v (%T)\n", key, value, value)
}
```

### 通用容器

```go
type AnyMap struct {
    data map[string]interface{}
    mu   sync.RWMutex
}

func NewAnyMap() *AnyMap {
    return &AnyMap{
        data: make(map[string]interface{}),
    }
}

func (m *AnyMap) Set(key string, value interface{}) {
    m.mu.Lock()
    defer m.mu.Unlock()
    m.data[key] = value
}

func (m *AnyMap) Get(key string) (interface{}, bool) {
    m.mu.RLock()
    defer m.mu.RUnlock()
    val, ok := m.data[key]
    return val, ok
}
```

### 配置解析

```go
type Config struct {
    Values map[string]interface{}
}

func (c *Config) GetString(key string) string {
    if v, ok := c.Values[key]; ok {
        if s, ok := v.(string); ok {
            return s
        }
    }
    return ""
}

func (c *Config) GetInt(key string) int {
    if v, ok := c.Values[key]; ok {
        if i, ok := v.(int); ok {
            return i
        }
    }
    return 0
}

func (c *Config) GetBool(key string) bool {
    if v, ok := c.Values[key]; ok {
        if b, ok := v.(bool); ok {
            return b
        }
    }
    return false
}
```

## 性能考虑

### 类型选择

```go
// ❌ 空接口（有性能开销）
func sumAny(items []interface{}) int {
    sum := 0
    for _, item := range items {
        sum += item.(int)  // 类型断言有开销
    }
    return sum
}

// ✅ 具体类型（更快）
func sumInt(items []int) int {
    sum := 0
    for _, item := range items {
        sum += item
    }
    return sum
}
```

### 反射开销

```go
// 反射比直接调用慢很多
func callByReflect(v interface{}) {
    val := reflect.ValueOf(v)
    method := val.MethodByName("String")
    result := method.Call(nil)
    fmt.Println(result[0])
}

func callDirect(v Stringer) {
    fmt.Println(v.String())
}

// Benchmark 显示反射慢 10-100 倍
```

## 最佳实践

::: tip 使用建议

1. **优先具体类型** - 避免不必要地使用空接口
2. **使用泛型** - Go 1.18+ 优先使用泛型
3. **类型检查** - 使用 comma ok 模式
4. **文档说明** - 说明空接口的预期类型
5. **性能敏感** - 避免在性能关键路径使用

:::

```go
// ✅ 好的用法
// 1. 序列化
func Marshal(v interface{}) ([]byte, error) {
    return json.Marshal(v)
}

// 2. 格式化
func Print(v interface{}) {
    fmt.Printf("%#v\n", v)
}

// 3. 存储异构数据
var cache = make(map[string]interface{})

// ❌ 避免的用法
// 1. 替代泛型
func Min(a, b interface{}) interface{} {}

// 2. 不必要的抽象
func Process(data interface{}) error {}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **定义** | `interface{}` 可以持有任何类型 |
| **类型查询** - 使用类型断言或 type switch |
| **反射** - 通过反射检查和修改值 |
| **性能** - 空接口有性能开销 |
| **泛型** - Go 1.18+ 优先使用泛型 |

::: v-pre

[接口组合](./interface-composition.md) → [并发编程](/langs/go/05-concurrency/) →

:::
