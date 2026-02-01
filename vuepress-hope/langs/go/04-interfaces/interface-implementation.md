---
title: 接口实现
icon: ri:code-line
order: 3
---

# 接口实现

Go 使用隐式接口实现，只要类型实现了接口的所有方法，就自动实现了该接口。

## 隐式实现

### 基本实现

```go
type Speaker interface {
    Speak() string
}

// Dog 实现了 Speaker 接口
type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return "Woof!"
}

// Cat 也实现了 Speaker 接口
type Cat struct {
    Name string
}

func (c Cat) Speak() string {
    return "Meow!"
}

func main() {
    // 两者都可以赋值给 Speaker 接口
    var s Speaker

    s = Dog{Name: "Buddy"}
    fmt.Println(s.Speak())  // Woof!

    s = Cat{Name: "Whiskers"}
    fmt.Println(s.Speak())  // Meow!
}
```

### 部分实现

```go
type ReadWriter interface {
    Read(p []byte) (n int, err error)
    Write(p []byte) (n int, err error)
}

// 只实现 Read
type ReadOnly struct {
    data []byte
}

func (ro *ReadOnly) Read(p []byte) (n int, err error) {
    // 实现
    return 0, nil
}

// ❌ ReadOnly 没有实现 ReadWriter（缺少 Write）
// var rw ReadWriter = &ReadOnly{}  // 编译错误

// ✅ 需要实现所有方法
type ReadWrite struct {
    data []byte
}

func (rw *ReadWrite) Read(p []byte) (n int, err error) {
    // 实现
    return 0, nil
}

func (rw *ReadWrite) Write(p []byte) (n int, err error) {
    rw.data = append(rw.data, p...)
    return len(p), nil
}
```

## 值与指针

### 值接收者

```go
type Speaker interface {
    Speak() string
}

type Dog struct {
    Name string
}

// 值接收者方法
func (d Dog) Speak() string {
    return d.Name + " says Woof!"
}

func main() {
    // Dog 值可以实现接口
    d := Dog{Name: "Buddy"}
    var s Speaker = d
    fmt.Println(s.Speak())  // Buddy says Woof!

    // Dog 指针也可以实现接口
    // Go 会自动取地址
    dp := &Dog{Name: "Max"}
    s = dp
    fmt.Println(s.Speak())  // Max says Woof!
}
```

### 指针接收者

```go
type Counter interface {
    Increment()
    Value() int
}

type IntCounter struct {
    count int
}

// 指针接收者方法
func (ic *IntCounter) Increment() {
    ic.count++
}

func (ic *IntCounter) Value() int {
    return ic.count
}

func main() {
    // ✅ 使用指针
    ic := &IntCounter{}
    var c Counter = ic
    c.Increment()
    fmt.Println(c.Value())  // 1

    // ❌ 不能使用值
    // var c2 Counter = IntCounter{}  // 编译错误
}
```

### 混合接收者

```go
type Interface interface {
    Method1()
    Method2()
}

type MyType struct{}

func (m MyType) Method1() {
    // 值接收者
}

func (m *MyType) Method2() {
    // 指针接收者
}

// MyType 实现了 Method1
// *MyType 实现了 Method1 和 Method2

func main() {
    // var i Interface = MyType{}  // ❌ 缺少 Method2
    var i Interface = &MyType{}    // ✅ 拥有所有方法
}
```

## 方法集规则

### 方法集定义

```go
// 类型 T 的方法集包含所有接收者为 T 的方法
// 类型 *T 的方法集包含所有接收者为 T 和 *T 的方法

type T struct{}

func (t T) Method1() {}
func (t *T) Method2() {}

type Interface1 interface {
    Method1()
}

type Interface2 interface {
    Method2()
}

// T 实现了 Interface1
// *T 实现了 Interface1 和 Interface2
```

### 实际示例

```go
type ReadWriter interface {
    Read(p []byte) (n int, err error)
    Write(p []byte) (n int, err error)
}

type Buffer struct {
    data []byte
}

func (b *Buffer) Write(p []byte) (n int, err error) {
    b.data = append(b.data, p...)
    return len(p), nil
}

func (b Buffer) Read(p []byte) (n int, err error) {
    // 实现
    return 0, nil
}

// ✅ *Buffer 实现了 ReadWriter
// var rw ReadWriter = &Buffer{}

// ❌ Buffer 没有实现 ReadWriter（Write 是指针接收者）
// var rw ReadWriter = Buffer{}
```

## 类型实现接口

### 基本类型

```go
type Numeric interface {
    Add(other int) int
}

// 为 int 定义别名
type MyInt int

func (m MyInt) Add(other int) int {
    return int(m) + other
}

func main() {
    var n Numeric = MyInt(10)
    fmt.Println(n.Add(5))  // 15
}
```

### 函数类型

```go
type Handler interface {
    Handle() string
}

type HandlerFunc func() string

func (hf HandlerFunc) Handle() string {
    return hf()
}

func main() {
    // 函数实现了接口
    var h Handler = HandlerFunc(func() string {
        return "Handled"
    })
    fmt.Println(h.Handle())  // Handled
}
```

## 多接口实现

### 实现多个接口

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

// File 实现了所有三个接口
type File struct {
    name string
}

func (f *File) Read(p []byte) (n int, err error) {
    // 实现
    return 0, nil
}

func (f *File) Write(p []byte) (n int, err error) {
    // 实现
    return 0, nil
}

func (f *File) Close() error {
    // 实现
    return nil
}

func main() {
    f := &File{name: "test.txt"}

    var r Reader = f
    var w Writer = f
    var c Closer = f

    r.Read(nil)
    w.Write(nil)
    c.Close()
}
```

### 组合接口使用

```go
type ReadWriter interface {
    Reader
    Writer
}

type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}

func useReadWrite(rw ReadWriter) {
    rw.Write(nil)
    rw.Read(nil)
}

func useAll(rwc ReadWriteCloser) {
    rwc.Write(nil)
    rwc.Read(nil)
    rwc.Close()
}

func main() {
    f := &File{name: "test.txt"}

    useReadWrite(f)   // OK
    useAll(f)         // OK
}
```

## 接口相等性

### 接口值比较

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
    // 相同类型和值
    var s1, s2 Speaker = Dog{Name: "Buddy"}, Dog{Name: "Buddy"}
    fmt.Println(s1 == s2)  // true

    // 不同值
    s2 = Dog{Name: "Max"}
    fmt.Println(s1 == s2)  // false

    // 包含不可比较字段
    type Cat struct {
        Toys []string
    }

    func (c Cat) Speak() string {
        return "Meow!"
    }

    // var c1, c2 Speaker = Cat{Toys: []string{"ball"}}, Cat{Toys: []string{"ball"}}
    // fmt.Println(c1 == c2)  // panic: cannot compare
}
```

### nil 接口

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
    // nil 接口
    var s Speaker
    fmt.Println(s == nil)  // true
    fmt.Println(s)         // <nil>

    // 包含 nil 指针的接口
    var d *Dog
    s = d
    fmt.Println(s == nil)  // false！
    fmt.Println(s)         // <nil> 但类型不是 nil

    // 调用方法会 panic
    // s.Speak()  // panic: nil pointer dereference
}
```

## 实战示例

### 可排序类型

```go
type Person struct {
    Name string
    Age  int
}

// 实现 sort.Interface
type ByAge []Person

func (a ByAge) Len() int           { return len(a) }
func (a ByAge) Less(i, j int) bool { return a[i].Age < a[j].Age }
func (a ByAge) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

func main() {
    people := []Person{
        {Name: "Alice", Age: 30},
        {Name: "Bob", Age: 25},
        {Name: "Charlie", Age: 35},
    }

    sort.Sort(ByAge(people))
    // 按年龄排序
}
```

### 错误处理

```go
// 自定义错误类型
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed for %s: %s", e.Field, e.Message)
}

// 实现 error 接口
func validate(name string) error {
    if name == "" {
        return &ValidationError{
            Field:   "name",
            Message: "cannot be empty",
        }
    }
    return nil
}

func main() {
    err := validate("")
    if err != nil {
        fmt.Println(err)  // validation failed for name: cannot be empty
    }
}
```

## 最佳实践

::: tip 实现建议

1. **一致性** - 接收者类型保持一致
2. **方法集** - 理解值和指针的方法集
3. **小接口** - 接口应该小而专注
4. **文档说明** - 记录类型实现的接口
5. **测试** - 为接口实现编写测试

:::

```go
// ✅ 好的实现
type Counter struct {
    count int
}

// 所有方法使用指针接收者
func (c *Counter) Increment() { c.count++ }
func (c *Counter) Decrement() { c.count-- }
func (c *Counter) Value() int { return c.count }

// ❌ 不好的实现
type Counter2 struct {
    count int
}

// 混合使用接收者（不一致）
func (c Counter2) Value() int { return c.count }
func (c *Counter2) Increment() { c.count++ }
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **隐式实现** | 无需声明 implements |
| **值接收者** - 可用于值和指针 |
| **指针接收者** - 只能用于指针 |
| **方法集** - T 包含 T 的方法，*T 包含 T 和 *T 的方法 |
| **多接口** - 一个类型可实现多个接口 |

::: v-pre

[接口定义](./interface-definition.md) → [类型断言](./type-assertion.md)

:::
