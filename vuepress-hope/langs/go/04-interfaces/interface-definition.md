---
title: 接口定义
icon: ri:interface-line
order: 2
---

# 接口定义

接口定义了一组方法签名，任何实现了这些方法的类型都隐式实现了该接口。

## 接口语法

### 基本定义

```go
// 接口定义格式
type InterfaceName interface {
    Method1(param1 Type1, param2 Type2) (return1 Type1, return2 Type2)
    Method2(param Type) Type
    // ...
}

// 示例：简单的接口
type Speaker interface {
    Speak() string
}

// 示例：多个方法
type ReadWriter interface {
    Read(p []byte) (n int, err error)
    Write(p []byte) (n int, err error)
}
```

### 方法签名

```go
// 只包含方法签名，不包含实现
type Shape interface {
    Area() float64
    Perimeter() float64
}

// 方法可以包含参数和返回值
type Processor interface {
    Process(input string) (output string, err error)
    Validate(input string) bool
    Reset()
}
```

## 接口类型

### 空接口

```go
// 空接口没有任何方法
type Empty interface {}

// 所有类型都实现了空接口
var any Empty
any = 42
any = "hello"
any = []int{1, 2, 3}

// 常用的 interface{} 就是空接口
func printAny(v interface{}) {
    fmt.Println(v)
}
```

### 单方法接口

```go
// 只有一个方法的接口
type Stringer interface {
    String() string
}

type Person struct {
    Name string
}

func (p Person) String() string {
    return fmt.Sprintf("Person{Name: %s}", p.Name)
}

func main() {
    p := Person{Name: "Alice"}
    var s Stringer = p
    fmt.Println(s.String())  // Person{Name: Alice}
}
```

### 组合接口

```go
// 定义基础接口
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

// 组合多个接口
type ReadWriter interface {
    Reader
    Writer
}

type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}

// 也可以直接嵌入
type ReadWriteCloser2 interface {
    ReadWriter
    Closer
}
```

## 标准库接口

### 常用接口

```go
// fmt.Stringer：字符串表示
type Stringer interface {
    String() string
}

// fmt.Stringer：字符串表示
type Stringer interface {
    String() string
}

// io.Reader：读取器
type Reader interface {
    Read(p []byte) (n int, err error)
}

// io.Writer：写入器
type Writer interface {
    Write(p []byte) (n int, err error)
}

// error：错误接口
type error interface {
    Error() string
}

// sort.Interface：排序接口
type Interface interface {
    Len() int
    Less(i, j int) bool
    Swap(i, j int)
}
```

### 实现标准接口

```go
// 实现 Stringer
type Point struct {
    X, Y int
}

func (p Point) String() string {
    return fmt.Sprintf("(%d, %d)", p.X, p.Y)
}

func main() {
    p := Point{X: 10, Y: 20}
    fmt.Println(p)  // (10, 20)
}
```

## 接口特性

### 隐式实现

```go
type Speaker interface {
    Speak() string
}

// 不需要显式声明 implements
type Dog struct {
    Name string
}

// 只要实现了 Speak 方法，就实现了 Speaker 接口
func (d Dog) Speak() string {
    return "Woof!"
}

func main() {
    var s Speaker = Dog{Name: "Buddy"}
    fmt.Println(s.Speak())  // Woof!
}
```

### 接口值

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

// 接口值包含两部分：类型和值
var s Speaker
fmt.Printf("%T, %v\n", s, s)  // <nil>, <nil>

s = Dog{Name: "Buddy"}
fmt.Printf("%T, %v\n", s, s)  // main.Dog, {Buddy}

// 接口值的动态类型和动态值
// 类型：main.Dog
// 值：{Name:Buddy}
```

### nil 接口值

```go
// nil 接口值
var s Speaker
fmt.Println(s == nil)  // true

// 包含 nil 指针的接口不是 nil
var d *Dog
s = d  // d 是 nil
fmt.Println(s == nil)  // false（注意！）

// 因为接口值包含类型信息
// 类型是 *Dog，值是 nil
```

## 接口设计原则

### 小接口

```go
// ✅ 小接口：单一职责
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// ❌ 大接口：职责过多
type FileOperator interface {
    Read(p []byte) (n int, err error)
    Write(p []byte) (n int, err error)
    Close() error
    Seek(offset int64, whence int) (int64, error)
    Stat() (os.FileInfo, error)
    Sync() error
    // ... 太多方法
}
```

### 接口分离

```go
// 分离接口，按需组合
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer
}

// 需要只读时
func readFrom(r Reader) {
    // ...
}

// 需要读写时
func readWrite(rw ReadWriter) {
    // ...
}
```

### 接口位置

```go
// 接口定义在使用方
// ✅ 推荐：接口在消费者包中定义
package consumer

type FileReader interface {
    Read() ([]byte, error)
}

func ProcessFile(r FileReader) {
    data, _ := r.Read()
    // 处理数据
}

// ❌ 不推荐：接口在生产者包中定义
package producer

type File interface {
    Read() ([]byte, error)
}
```

## 实战示例

### 自定义接口

```go
// 定义一个日志接口
type Logger interface {
    Log(message string)
    Error(message string)
}

// 文件日志实现
type FileLogger struct {
    file *os.File
}

func (fl *FileLogger) Log(message string) {
    fmt.Fprintf(fl.file, "[LOG] %s\n", message)
}

func (fl *FileLogger) Error(message string) {
    fmt.Fprintf(fl.file, "[ERROR] %s\n", message)
}

// 控制台日志实现
type ConsoleLogger struct{}

func (cl ConsoleLogger) Log(message string) {
    fmt.Printf("[LOG] %s\n", message)
}

func (cl ConsoleLogger) Error(message string) {
    fmt.Printf("[ERROR] %s\n", message)
}

// 使用
func Process(l Logger) {
    l.Log("Processing started")
    l.Error("An error occurred")
}
```

### 可测试接口

```go
// 定义数据库接口
type Database interface {
    GetUser(id int) (*User, error)
    SaveUser(user *User) error
}

// 真实实现
type MySQLDatabase struct {
    db *sql.DB
}

func (m *MySQLDatabase) GetUser(id int) (*User, error) {
    // 实现
    return &User{}, nil
}

// 测试用模拟实现
type MockDatabase struct {
    users map[int]*User
}

func (m *MockDatabase) GetUser(id int) (*User, error) {
    user, ok := m.users[id]
    if !ok {
        return nil, fmt.Errorf("user not found")
    }
    return user, nil
}

// 测试
func TestProcessUser(t *testing.T) {
    mock := &MockDatabase{
        users: map[int]*User{
            1: {ID: 1, Name: "Alice"},
        },
    }
    ProcessUser(mock, 1)
}
```

## 最佳实践

::: tip 设计建议

1. **小而专注** - 接口应该只包含少数相关方法
2. **定义在使用方** - 接口应该在消费者包中定义
3. **避免空接口** - 除非确实需要存储任意类型
4. **接受接口返回结构体** - 函数参数用接口，返回具体类型
5. **接口不是必须的** - 只在需要时定义接口

:::

```go
// ✅ 好的设计
func ProcessData(r io.Reader) error {
    // 只需要 Read 方法
}

func SaveData(w io.Writer, data []byte) error {
    // 只需要 Write 方法
}

// ❌ 不好的设计
func Process(r interface{}) error {
    // 使用空接口失去类型安全
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **定义** | `type Name interface { methods }` |
| **隐式实现** | 无需显式声明 implements |
| **空接口** | `interface{}` 可持有任何值 |
| **组合** - 通过嵌入组合多个接口 |
| **设计原则** - 小接口，定义在使用方 |

::: v-pre

[接口与类型系统总览](./README.md) → [接口实现](./interface-implementation.md)

:::
