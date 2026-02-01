---
title: 泛型
icon: ri:braces-line
order: 3
---

# 泛型

Go 1.18 引入了泛型支持，允许编写与类型无关的代码，同时保持类型安全。

## 泛型基础

### 类型参数

```go
// 泛型函数：T 是类型参数
func Print[T any](s []T) {
    for _, v := range s {
        fmt.Println(v)
    }
}

// 使用：类型推断
Print([]int{1, 2, 3})       // 自动推断 T 为 int
Print([]string{"a", "b"})   // 自动推断 T 为 string

// 显式指定类型
Print[int]([]int{1, 2, 3})
```

### 类型参数列表

```go
// 多个类型参数
func Pair[T, U any](first T, second U) (T, U) {
    return first, second
}

// 使用
i, s := Pair(42, "hello")
fmt.Println(i, s)  // 42 hello

// 类型参数也可以用于结构体
type Entry[K, V any] struct {
    Key   K
    Value V
}

// 使用
entry := Entry[string, int]{
    Key:   "age",
    Value: 25,
}
```

### any 约束

```go
// any 是 interface{} 的别名，表示任意类型
func First[T any](slice []T) T {
    if len(slice) == 0 {
        var zero T
        return zero
    }
    return slice[0]
}

// 使用
numbers := []int{1, 2, 3}
fmt.Println(First(numbers))  // 1

strings := []string{"a", "b"}
fmt.Println(First(strings))  // a
```

## 类型约束

### 基本约束

```go
// 定义约束接口
type Number interface {
    int | int64 | float64
}

// 使用约束
func Sum[T Number](numbers []T) T {
    var sum T
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// 使用
ints := []int{1, 2, 3, 4, 5}
fmt.Println(Sum(ints))  // 15

floats := []float64{1.1, 2.2, 3.3}
fmt.Println(Sum(floats))  // 6.6

// ❌ 编译错误：string 不在 Number 约束中
// strs := []string{"a", "b"}
// Sum(strs)
```

### 接口约束

```go
// 约束必须实现某个接口
type Stringer interface {
    String() string
}

func PrintStringer[T Stringer](values []T) {
    for _, v := range values {
        fmt.Println(v.String())
    }
}

// 使用
type Person struct {
    Name string
}

func (p Person) String() string {
    return p.Name
}

people := []Person{{Name: "Alice"}, {Name: "Bob"}}
PrintStringer(people)  // Alice Bob
```

### 组合约束

```go
// 组合多个约束
type ComparableNumber interface {
    Number  // 包含 Number 的类型集
    comparable // 内置 comparable 约束
}

func Max[T ComparableNumber](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 使用
fmt.Println(Max(3, 5))        // 5
fmt.Println(Max(1.5, 2.5))    // 2.5
```

### 约束元素

```go
// ~ 表示底层类型
type MyInt int

// 约束包含 MyInt 及其底层类型
type IntLike interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64
}

func Double[T IntLike](n T) T {
    return n * 2
}

// 使用
var x MyInt = 10
fmt.Println(Double(x))  // 20
```

## 泛型类型

### 泛型结构体

```go
// 泛型栈
type Stack[T any] struct {
    items []T
}

func NewStack[T any]() *Stack[T] {
    return &Stack[T]{
        items: make([]T, 0),
    }
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    idx := len(s.items) - 1
    item := s.items[idx]
    s.items = s.items[:idx]
    return item, true
}

func (s *Stack[T]) IsEmpty() bool {
    return len(s.items) == 0
}

// 使用
stack := NewStack[int]()
stack.Push(1)
stack.Push(2)
stack.Push(3)

for !stack.IsEmpty() {
    val, _ := stack.Pop()
    fmt.Println(val)  // 3 2 1
}
```

### 泛型映射

```go
// 泛型映射容器
type HashMap[K comparable, V any] struct {
    data map[K]V
}

func NewHashMap[K comparable, V any]() *HashMap[K, V] {
    return &HashMap[K, V]{
        data: make(map[K]V),
    }
}

func (m *HashMap[K, V]) Put(key K, value V) {
    m.data[key] = value
}

func (m *HashMap[K, V]) Get(key K) (V, bool) {
    value, ok := m.data[key]
    return value, ok
}

func (m *HashMap[K, V]) Delete(key K) {
    delete(m.data, key)
}

// 使用
map1 := NewHashMap[string, int]()
map1.Put("age", 25)
map1.Put("count", 100)

if age, ok := map1.Get("age"); ok {
    fmt.Println("Age:", age)  // Age: 25
}
```

### 泛型接口

```go
// 泛型接口
type Container[T any] interface {
    Push(item T)
    Pop() (T, bool)
    Len() int
}

// 实现泛型接口
type Queue[T any] struct {
    items []T
}

func (q *Queue[T]) Push(item T) {
    q.items = append(q.items, item)
}

func (q *Queue[T]) Pop() (T, bool) {
    if len(q.items) == 0 {
        var zero T
        return zero, false
    }
    item := q.items[0]
    q.items = q.items[1:]
    return item, true
}

func (q *Queue[T]) Len() int {
    return len(q.items)
}

// 使用泛型接口
func ProcessItems[T any](c Container[T], process func(T)) {
    for c.Len() > 0 {
        if item, ok := c.Pop(); ok {
            process(item)
        }
    }
}
```

## 内置约束

### comparable

```go
// comparable 约束：类型可以用 == 和 != 比较
func Index[T comparable](slice []T, value T) int {
    for i, v := range slice {
        if v == value {
            return i
        }
    }
    return -1
}

// 使用
numbers := []int{1, 2, 3, 4, 5}
fmt.Println(Index(numbers, 3))   // 2
fmt.Println(Index(numbers, 10))  // -1

// 可用于结构体
type Point struct {
    X, Y int
}

points := []Point{{1, 2}, {3, 4}, {5, 6}}
fmt.Println(Index(points, Point{3, 4}))  // 1
```

### constraints 包

```go
import "constraints"

// constraints.Integer: 所有整数类型
func SumInt[T constraints.Integer](numbers []T) T {
    var sum T
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// constraints.Float: 所有浮点类型
func SumFloat[T constraints.Float](numbers []T) T {
    var sum T
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// constraints.Signed: 有符号整数
func Abs[T constraints.Signed](n T) T {
    if n < 0 {
        return -n
    }
    return n
}

// constraints.Unsigned: 无符号整数
func Clamp[T constraints.Unsigned](value, max T) T {
    if value > max {
        return max
    }
    return value
}

// constraints.Complex: 复数类型
func ComplexOp[T constraints.Complex](c T) T {
    return c * c
}

// constraints.Ordered: 可排序类型
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 使用
fmt.Println(SumInt([]int{1, 2, 3}))      // 6
fmt.Println(SumInt([]int64{1, 2, 3}))   // 6
fmt.Println(SumFloat([]float32{1.1, 2.2}))  // 3.3000002
fmt.Println(Max(3, 5))                  // 5
fmt.Println(Max("a", "b"))              // b
```

## 类型推断

### 函数参数推断

```go
func Map[T, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}

// 完全推断
numbers := []int{1, 2, 3}
doubled := Map(numbers, func(n int) int { return n * 2 })
fmt.Println(doubled)  // [2 4 6]

// 部分推断：指定返回类型
strings := Map[int, string](numbers, func(n int) string {
    return strconv.Itoa(n)
})
fmt.Println(strings)  // [1 2 3]
```

### 结构体推断

```go
type Pair[T any] struct {
    First, Second T
}

func MakePair[T any](a, b T) Pair[T] {
    return Pair[T]{First: a, Second: b}
}

// 推断 T 为 int
p1 := MakePair(1, 2)
fmt.Println(p1)  // {1 2}

// 推断 T 为 string
p2 := MakePair("a", "b")
fmt.Println(p2)  // {a b}
```

## 实用示例

### 通用过滤器

```go
func Filter[T any](slice []T, predicate func(T) bool) []T {
    result := make([]T, 0)
    for _, v := range slice {
        if predicate(v) {
            result = append(result, v)
        }
    }
    return result
}

// 使用
numbers := []int{1, 2, 3, 4, 5}
evens := Filter(numbers, func(n int) bool {
    return n%2 == 0
})
fmt.Println(evens)  // [2 4]

names := []string{"Alice", "Bob", "Charlie"}
short := Filter(names, func(s string) bool {
    return len(s) < 5
})
fmt.Println(short)  // [Bob]
```

### 通用归约

```go
func Reduce[T, U any](slice []T, initial U, fn func(U, T) U) U {
    result := initial
    for _, v := range slice {
        result = fn(result, v)
    }
    return result
}

// 使用
numbers := []int{1, 2, 3, 4, 5}

sum := Reduce(numbers, 0, func(acc, n int) int {
    return acc + n
})
fmt.Println("Sum:", sum)  // 15

product := Reduce(numbers, 1, func(acc, n int) int {
    return acc * n
})
fmt.Println("Product:", product)  // 120
```

### 泛型二分查找

```go
func BinarySearch[T constraints.Ordered](slice []T, target T) int {
    left, right := 0, len(slice)-1

    for left <= right {
        mid := left + (right-left)/2

        if slice[mid] == target {
            return mid
        } else if slice[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    return -1
}

// 使用
numbers := []int{1, 3, 5, 7, 9, 11, 13}
fmt.Println(BinarySearch(numbers, 7))   // 3
fmt.Println(BinarySearch(numbers, 8))   // -1

strings := []string{"apple", "banana", "cherry", "date"}
fmt.Println(BinarySearch(strings, "cherry"))  // 2
```

### 泛型排序

```go
func Sort[T constraints.Ordered](slice []T) {
    // 简单的冒泡排序
    n := len(slice)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if slice[j] > slice[j+1] {
                slice[j], slice[j+1] = slice[j+1], slice[j]
            }
        }
    }
}

// 使用
numbers := []int{5, 2, 8, 1, 9}
Sort(numbers)
fmt.Println(numbers)  // [1 2 5 8 9]

strings := []string{"banana", "apple", "cherry"}
Sort(strings)
fmt.Println(strings)  // [apple banana cherry]
```

## 最佳实践

::: tip 使用建议

1. **合理命名** - 类型参数名应简洁明了
2. **约束精确** - 只暴露必要的类型
3. **文档清晰** - 泛型代码需要更多文档
4. **避免过度** - 不是所有函数都需要泛型

:::

```go
// ✅ 好的模式：清晰的约束和命名
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// ❌ 不好的模式：过于宽泛的约束
func Anything[T any](value T) T {
    return value
}

// ✅ 好的模式：有意义的类型参数名
type Map[K comparable, V any] struct {
    data map[K]V
}

// ❌ 不好的模式：无意义的类型参数名
type Map[T1, T2 any] struct {
    data map[T1]T2
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **类型参数** - [T any] 语法定义 |
| **约束** - 限制类型参数的范围 |
| **类型推断** - 自动推断类型参数 |
| **comparable** - 可比较类型约束 |
| **constraints** - 内置约束包 |

::: v-pre

[反射](./reflection.md) → [类型推断](./type-inference.md)

:::
