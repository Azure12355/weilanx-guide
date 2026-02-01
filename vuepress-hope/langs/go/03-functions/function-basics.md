---
title: 函数基础
icon: ri:function-line
order: 2
---

# 函数基础

函数是 Go 语言的基本代码组织单元，用于封装可重用的逻辑。

## 函数定义

### 基本语法

```go
// 函数定义格式
func functionName(parameter1 type1, parameter2 type2) returnType {
    // 函数体
    return value
}

// 示例：无参数无返回值
func greet() {
    fmt.Println("Hello, Go!")
}

// 示例：有参数无返回值
func greetUser(name string) {
    fmt.Printf("Hello, %s!\n", name)
}

// 示例：有参数有返回值
func add(a, b int) int {
    return a + b
}

// 示例：多参数
func userInfo(name string, age int) string {
    return fmt.Sprintf("%s is %d years old", name, age)
}
```

### 参数列表

```go
// 连续同类型参数可以简写
func add(a, b, c int) int {
    return a + b + c
}

// 混合类型参数
func format(name string, age int, score float64) string {
    return fmt.Sprintf("%s(%d): %.2f", name, age, score)
}

// 多个参数组
func process(
    input string,
    options ...func(string) string,
) string {
    result := input
    for _, opt := range options {
        result = opt(result)
    }
    return result
}
```

### 返回值

```go
// 单个返回值
func square(x int) int {
    return x * x
}

// 多个返回值
func divide(a, b int) (int, int) {
    quotient := a / b
    remainder := a % b
    return quotient, remainder
}

q, r := divide(10, 3)
fmt.Println(q)  // 3
fmt.Println(r)  // 1

// 命名返回值
func calculate(a, b int) (sum int, product int) {
    sum = a + b       // 直接赋值，无需声明
    product = a * b
    return            // 隐式返回
}

// 空返回值（仅执行副作用）
func printMessage(msg string) {
    fmt.Println(msg)
    // 不需要 return
}
```

## 函数调用

### 基本调用

```go
// 定义函数
func add(a, b int) int {
    return a + b
}

func greet(name string) {
    fmt.Printf("Hello, %s!\n", name)
}

// 调用函数
result := add(10, 20)
fmt.Println(result)  // 30

greet("Alice")  // Hello, Alice!
```

### 多返回值调用

```go
// 函数定义
func getUser() (string, int) {
    return "Alice", 25
}

// 接收所有返回值
name, age := getUser()
fmt.Println(name, age)  // Alice 25

// 只接收部分返回值（使用 _ 忽略）
name, _ = getUser()
fmt.Println(name)  // Alice
```

### 参数传递

```go
// 值传递：复制整个值
func modifyValue(x int) {
    x = 100  // 只修改副本
}

// 指针传递：传递地址
func modifyPointer(x *int) {
    *x = 100  // 修改原变量
}

func main() {
    a := 50

    modifyValue(a)
    fmt.Println(a)  // 50（不变）

    modifyPointer(&a)
    fmt.Println(a)  // 100（被修改）
}
```

## 函数变量

### 函数作为值

```go
// 声明函数变量
var op func(int, int) int

// 赋值函数
op = func(a, b int) int {
    return a + b
}

result := op(10, 20)  // 30

// 函数类型
type MathFunc func(int, int) int

func apply(f MathFunc, a, b int) int {
    return f(a, b)
}

add := func(a, b int) int { return a + b }
multiply := func(a, b int) int { return a * b }

fmt.Println(apply(add, 10, 20))      // 30
fmt.Println(apply(multiply, 10, 20))  // 200
```

### 函数作为参数

```go
// 高阶函数
func mapInts(nums []int, f func(int) int) []int {
    result := make([]int, len(nums))
    for i, num := range nums {
        result[i] = f(num)
    }
    return result
}

// 使用
nums := []int{1, 2, 3, 4, 5}

// 平方
doubled := mapInts(nums, func(x int) int {
    return x * 2
})
fmt.Println(doubled)  // [2 4 6 8 10]

// 加 10
added := mapInts(nums, func(x int) int {
    return x + 10
})
fmt.Println(added)  // [11 12 13 14 15]
```

### 函数作为返回值

```go
// 返回函数
func makeAdder(x int) func(int) int {
    return func(y int) int {
        return x + y
    }
}

// 使用
add10 := makeAdder(10)
add20 := makeAdder(20)

fmt.Println(add10(5))  // 15
fmt.Println(add20(5))  // 25

// 工厂模式
func getOperation(op string) func(int, int) int {
    switch op {
    case "add":
        return func(a, b int) int { return a + b }
    case "multiply":
        return func(a, b int) int { return a * b }
    default:
        return func(a, b int) int { return 0 }
    }
}
```

## 函数作用域

### 局部作用域

```go
func example() {
    // 局部变量
    x := 10

    if true {
        // 块级作用域
        y := 20
        fmt.Println(x, y)  // 10 20
    }

    // fmt.Println(y)  // ❌ 超出作用域

    for i := 0; i < 3; i++ {
        z := i * 2
        fmt.Println(z)
    }
    // fmt.Println(z)  // ❌ 超出作用域
}
```

### 遮蔽

```go
func shadowing() {
    x := 10

    if true {
        x := 20  // 遮蔽外层 x
        fmt.Println(x)  // 20
    }

    fmt.Println(x)  // 10（外层 x）

    // 循环变量遮蔽
    for i := 0; i < 3; i++ {
        i := i * 2  // 遮蔽循环变量
        fmt.Println(i)
    }
}
```

## 函数类型

### 类型定义

```go
// 定义函数类型
type Handler func(string) error

type Processor func(int) (int, error)

// 使用函数类型
func handleRequest(h Handler, req string) error {
    return h(req)
}

func processInt(p Processor, value int) (int, error) {
    return p(value)
}
```

### 实现接口

```go
// 函数类型实现接口
type Handler func(string) error

func (h Handler) ServeHTTP(resp string) error {
    return h(resp)
}

// Handler 实现了某个接口
type HTTPHandler interface {
    ServeHTTP(string) error
}

func useHandler(h HTTPHandler, req string) error {
    return h.ServeHTTP(req)
}

func main() {
    handler := Handler(func(s string) error {
        fmt.Println("Handling:", s)
        return nil
    })

    useHandler(handler, "request")
}
```

## 实战示例

### 验证函数

```go
type Validator func(string) bool

func validateInput(input string, validators ...Validator) bool {
    for _, v := range validators {
        if !v(input) {
            return false
        }
    }
    return true
}

func main() {
    // 定义验证器
    notEmpty := func(s string) bool {
        return len(s) > 0
    }

    minLength := func(min int) Validator {
        return func(s string) bool {
            return len(s) >= min
        }
    }

    // 使用
    fmt.Println(validateInput("", notEmpty))  // false
    fmt.Println(validateInput("test", notEmpty))  // true
    fmt.Println(validateInput("hi", minLength(3)))  // false
    fmt.Println(validateInput("hello", minLength(3)))  // true
}
```

### 回调函数

```go
func processData(
    data []int,
    processor func(int) int,
    callback func(result []int),
) {
    result := make([]int, len(data))
    for i, v := range data {
        result[i] = processor(v)
    }
    callback(result)
}

func main() {
    data := []int{1, 2, 3, 4, 5}

    processData(
        data,
        func(x int) int { return x * 2 },
        func(result []int) {
            fmt.Println("Result:", result)
        },
    )
    // Result: [2 4 6 8 10]
}
```

## 最佳实践

::: tip 使用建议

1. **函数命名** - 使用清晰的动词或动词短语
2. **参数设计** - 参数列表不宜过长，考虑使用结构体
3. **返回值** - 错误应该作为最后一个返回值
4. **函数长度** - 保持函数简短，单一职责
5. **类型选择** - 值 vs 指针根据实际需求

:::

```go
// ✅ 好的命名
func calculateAge(birthYear int) int {
    return currentYear - birthYear
}

// ❌ 不好的命名
func calc(y int) int {
    return currentYear - y
}

// ✅ 参数过多时使用结构体
type Config struct {
    Host     string
    Port     int
    Timeout  time.Duration
    Debug    bool
}

func connect(cfg Config) (*Connection, error) {
    // ...
}

// ❌ 参数过多
func connect(host string, port int, timeout time.Duration, debug bool) (*Connection, error) {
    // ...
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **定义** | `func name(params) returns { body }` |
| **参数** | 值传递，连续同类型可简写 |
| **返回值** | 多返回值，命名返回值 |
| **函数类型** | 函数是一等公民 |
| **作用域** | 局部作用域，变量遮蔽 |

::: v-pre

[函数与方法总览](./README.md) → [多返回值](./multiple-return.md)

:::
