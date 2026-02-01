---
title: 类型推断
icon: ri:git-branch-line
order: 4
---

# 类型推断

Go 的泛型类型推断机制可以在大多数情况下自动推断类型参数，无需显式指定。

## 推断基础

### 函数参数推断

```go
func Print[T any](value T) {
    fmt.Println(value)
}

// 自动推断 T 为 int
Print(42)

// 自动推断 T 为 string
Print("hello")

// 显式指定（通常不需要）
Print[int](42)
```

### 多参数推断

```go
func Pair[T, U any](first T, second U) (T, U) {
    return first, second
}

// 自动推断 T 为 int，U 为 string
i, s := Pair(42, "hello")
fmt.Println(i, s)  // 42 hello

// 自动推断 T 为 string，U 为 float64
s2, f := Pair("answer", 42.0)
fmt.Println(s2, f)  // answer 42
```

## 推断规则

### 从函数参数推断

```go
func Map[T, U any](slice []T, fn func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = fn(v)
    }
    return result
}

// T 和 U 都可以从参数推断
numbers := []int{1, 2, 3}
doubled := Map(numbers, func(n int) int { return n * 2 })
fmt.Println(doubled)  // [2 4 6]

// 混合类型：T 为 int，U 为 string
strings := Map(numbers, func(n int) string { return strconv.Itoa(n) })
fmt.Println(strings)  // [1 2 3]
```

### 从返回值推断

```go
func NewMap[K comparable, V any]() map[K]V {
    return make(map[K]V)
}

// 无法从参数推断，必须显式指定
// 错误：m := NewMap()  // cannot infer K and V

// 显式指定
m := NewMap[string, int]()
m["key"] = 42
fmt.Println(m)  // map[key:42]
```

### 约束推断

```go
type Number interface {
    int | int64 | float64
}

func Sum[T Number](a, b T) T {
    return a + b
}

// T 被推断为 int（字面量类型）
result := Sum(1, 2)
fmt.Printf("%T\n", result)  // int

// T 被推断为 float64
result2 := Sum(1.5, 2.5)
fmt.Printf("%T\n", result2)  // float64

// 字面量值的默认类型
var i int = 1
var f float64 = 1.5

result3 := Sum(i, f)  // 编译错误：int 和 float64 不匹配
```

## 部分推断

### 指定部分类型参数

```go
func Convert[T, U any](value T, fn func(T) U) U {
    return fn(value)
}

// 完全推断
num := Convert(42, func(n int) string {
    return strconv.Itoa(n)
})
fmt.Println(num)  // 42

// 部分推断：只指定 U
str := Convert[int, string](42, func(n int) string {
    return strconv.Itoa(n)
})
fmt.Println(str)  // 42

// 部分推断：只指定 T
num2 := Convert[int, float64](42, func(n int) float64 {
    return float64(n)
})
fmt.Println(num2)  // 42
```

### 约束与推断

```go
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 推断 T 为 int
fmt.Println(Max(1, 2))  // 2

// 推断 T 为 float64
fmt.Println(Max(1.5, 2.5))  // 2.5

// 推断 T 为 string
fmt.Println(Max("a", "b"))  // b
```

## 复杂推断场景

### 嵌套泛型

```go
type Stack[T any] struct {
    items []T
}

func NewStack[T any]() *Stack[T] {
    return &Stack[T]{items: make([]T, 0)}
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func PushAll[T any](stack *Stack[T], items ...T) {
    for _, item := range items {
        stack.Push(item)
    }
}

// 推断 T 为 int
stack := NewStack[int]()
PushAll(stack, 1, 2, 3, 4, 5)
fmt.Println(stack.items)  // [1 2 3 4 5]
```

### 多级类型参数

```go
func Transform[T, U, V any](
    data []T,
    fn1 func(T) U,
    fn2 func(U) V,
) []V {
    result := make([]V, len(data))
    for i, v := range data {
        u := fn1(v)
        result[i] = fn2(u)
    }
    return result
}

// 完全推断
numbers := []int{1, 2, 3}
result := Transform(
    numbers,
    func(n int) string { return strconv.Itoa(n) },
    func(s string) int { return len(s) },
)
fmt.Println(result)  // [1 1 1]
```

### 接口类型推断

```go
type Closer[T any] interface {
    Close() error
    GetValue() T
}

func Process[T any, C Closer[T]](resource C) (T, error) {
    defer resource.Close()
    return resource.GetValue(), nil
}

// 实现 Closer 接口
type File struct {
    data string
}

func (f *File) Close() error {
    return nil
}

func (f *File) GetValue() string {
    return f.data
}

// 推断 T 为 string，C 为 *File
file := &File{data: "Hello, World!"}
value, err := Process(file)
if err != nil {
    log.Fatal(err)
}
fmt.Println(value)  // Hello, World!
```

## 推断限制

### 无法推断的情况

```go
func CreateSlice[T any]() []T {
    return make([]T, 0)
}

// 必须显式指定类型
// ❌ 错误：slice := CreateSlice()

// ✅ 正确：显式指定
ints := CreateSlice[int]()
ints = append(ints, 1, 2, 3)
fmt.Println(ints)  // [1 2 3]

strings := CreateSlice[string]()
strings = append(strings, "a", "b")
fmt.Println(strings)  // [a b]
```

### 字面量推断

```go
func Add[T constraints.Integer](a, b T) T {
    return a + b
}

// 字面量默认类型
result := Add(1, 2)
fmt.Printf("%T\n", result)  // int

// 使用特定类型
var i16 int16 = 1
result2 := Add(i16, 2)
fmt.Printf("%T\n", result2)  // int16

// 混合类型会失败
// ❌ 编译错误
// result3 := Add(int16(1), int32(2))
```

### 空接口推断

```go
func Process[T any](value T) {
    fmt.Printf("Type: %T, Value: %v\n", value, value)
}

// 推断为具体类型
Process(42)       // Type: int, Value: 42
Process("hello")  // Type: string, Value: hello
Process([]int{1, 2, 3})  // Type: []int, Value: [1 2 3]

// nil 无法推断
// ❌ 编译错误
// Process(nil)

// 必须指定类型或使用非 nil 值
Process[int](0)  // Type: int, Value: 0
```

## 类型集合推断

### 联合类型推断

```go
type Numeric interface {
    int | float64
}

func Double[T Numeric](n T) T {
    return n * 2
}

// 推断为 int
fmt.Println(Double(10))  // 20

// 推断为 float64
fmt.Println(Double(3.14))  // 6.28

// 变量类型
var i int = 5
var f float64 = 2.5

fmt.Println(Double(i))  // 10
fmt.Println(Double(f))  // 5
```

### 底层类型推断

```go
type MyInt int
type MyFloat float64

type NumericLike interface {
    ~int | ~float64 | ~MyInt | ~MyFloat
}

func Process[T NumericLike](n T) string {
    return fmt.Sprintf("Value: %v, Type: %T", n, n)
}

// 推断为 MyInt
var mi MyInt = 42
fmt.Println(Process(mi))  // Value: 42, Type: main.MyInt

// 推断为 MyFloat
var mf MyFloat = 3.14
fmt.Println(Process(mf))  // Value: 3.14, Type: main.MyFloat
```

## 最佳实践

::: tip 推断建议

1. **利用推断** - 让编译器自动推断类型
2. **显式指定** - 只在必要时指定类型
3. **清晰命名** - 类型参数名要清晰
4. **文档完善** - 复杂推断需要文档说明

:::

```go
// ✅ 好的模式：利用推断
func Map[T, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}

// 使用：自动推断
numbers := []int{1, 2, 3}
doubled := Map(numbers, func(n int) int { return n * 2 })

// ❌ 不好的模式：不必要的显式指定
doubled = Map[int, int](numbers, func(n int) int { return n * 2 })
```

## 推断调试

### 查看推断类型

```go
func InspectType[T any](value T) {
    fmt.Printf("Type parameter T: %T\n", value)
    fmt.Printf("Value: %v\n", value)

    // 获取反射类型
    t := reflect.TypeOf(value)
    fmt.Printf("Reflect type: %v\n", t)
    fmt.Printf("Kind: %v\n", t.Kind())
}

// 使用
InspectType(42)        // Type parameter T: int
InspectType("hello")   // Type parameter T: string
InspectType([]int{})   // Type parameter T: []int
```

### 类型推断错误

```go
func Union[T interface{ int | string }](a, b T) T {
    if _, ok := any(a).(int); ok {
        return any(a).(int) + any(b).(int)
    }
    return a
}

// 推断成功
fmt.Println(Union(1, 2))      // 3
fmt.Println(Union("a", "b"))  // ab

// 推断失败：混合类型
// ❌ 编译错误
// Union(1, "b")
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **自动推断** - 从函数参数推断类型 |
| **部分推断** - 可指定部分类型参数 |
| **完全指定** - 在无法推断时必须指定 |
| **字面量** - 默认类型影响推断 |
| **约束推断** - 约束限制可能的类型 |

::: v-pre

[泛型](./generics.md) → [最佳实践](./best-practices.md)

:::
