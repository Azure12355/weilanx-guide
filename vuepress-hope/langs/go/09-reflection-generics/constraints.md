---
title: 类型约束
icon: ri:constraints-line
order: 2
---

# 类型约束

类型约束用于限制泛型可以接受的类型范围，使泛型代码更加安全和实用。

## 基本约束

### 接口约束

```go
// 定义接口约束
type Stringer interface {
    String() string
}

// 约束 T 必须实现 Stringer
func PrintStringer[T Stringer](items []T) {
    for _, item := range items {
        fmt.Println(item.String())
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

### comparable 约束

```go
// comparable: 可用 == 和 != 比较
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
```

### any 约束

```go
// any 是 interface{} 的别名，接受任意类型
func Print[T any](items []T) {
    for _, item := range items {
        fmt.Println(item)
    }
}

// 使用
Print([]int{1, 2, 3})
Print([]string{"a", "b", "c"})
```

## 联合约束

### 基本类型联合

```go
// 类型集合：多个类型用 | 连接
type Number interface {
    int | int64 | float64
}

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
```

### 底层类型联合

```go
// ~ 表示包含底层类型
type MyInt int
type MyFloat float64

// ~int 包含 int 及其所有自定义类型
type IntLike interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64
}

func Double[T IntLike](n T) T {
    return n * 2
}

// 使用
var x MyInt = 10
fmt.Println(Double(x))  // 20

var y MyFloat = 3.14
// Double(y)  // ❌ 错误：MyFloat 不在 IntLike 中
```

## constraints 包

### Integer 约束

```go
import "constraints"

// 所有整数类型
func SumInt[T constraints.Integer](numbers []T) T {
    var sum T
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// 使用
fmt.Println(SumInt([]int{1, 2, 3}))       // 6
fmt.Println(SumInt([]int64{1, 2, 3}))    // 6
fmt.Println(SumInt([]uint8{1, 2, 3}))     // 6
```

### Float 约束

```go
// 所有浮点类型
func SumFloat[T constraints.Float](numbers []T) T {
    var sum T
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// 使用
fmt.Println(SumFloat([]float32{1.1, 2.2}))  // 3.3000002
fmt.Println(SumFloat([]float64{1.1, 2.2}))  // 3.3000000000000003
```

### Signed 约束

```go
// 所有有符号整数
func Abs[T constraints.Signed](n T) T {
    if n < 0 {
        return -n
    }
    return n
}

// 使用
fmt.Println(Abs(-5))      // 5
fmt.Println(Abs(int8(-5))) // 5
```

### Unsigned 约束

```go
// 所有无符号整数
func Clamp[T constraints.Unsigned](value, max T) T {
    if value > max {
        return max
    }
    return value
}

// 使用
fmt.Println(Clamp(uint(150), uint(100)))  // 100
fmt.Println(Clamp(uint(50), uint(100)))   // 50
```

### Ordered 约束

```go
// 可排序类型：支持 <, <=, >=, >
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

// 使用
fmt.Println(Max(3, 5))          // 5
fmt.Println(Max(1.5, 2.5))      // 2.5
fmt.Println(Max("a", "b"))      // b

fmt.Println(Min(3, 5))          // 3
fmt.Println(Min("a", "b"))      // a
```

### Complex 约束

```go
// 所有复数类型
func Magnitude[T constraints.Complex](c T) float64 {
    r := real(c)
    i := imag(c)
    return math.Sqrt(r*r + i*i)
}

// 使用
c1 := complex(3, 4)
fmt.Println(Magnitude(c1))  // 5
```

## 自定义约束

### 方法约束

```go
// 定义包含方法的约束
type Counter interface {
    Increment()
    Count() int
}

// 约束 T 必须实现 Counter 接口
func Process[T Counter](counters []T) {
    for _, c := range counters {
        c.Increment()
        fmt.Println(c.Count())
    }
}

// 使用
type IntCounter struct {
    value int
}

func (ic *IntCounter) Increment() {
    ic.value++
}

func (ic IntCounter) Count() int {
    return ic.value
}

counters := []*IntCounter{{}, {}}
Process(counters)  // 1 2
```

### 结构约束

```go
// 嵌入其他约束
type Numeric interface {
    constraints.Integer | constraints.Float
}

func Average[T Numeric](numbers []T) float64 {
    if len(numbers) == 0 {
        return 0
    }
    var sum float64
    for _, n := range numbers {
        sum += float64(n)
    }
    return sum / float64(len(numbers))
}

// 使用
nums := []int{1, 2, 3, 4, 5}
fmt.Println(Average(nums))  // 3

floats := []float64{1.5, 2.5, 3.5}
fmt.Println(Average(floats))  // 2.5
```

### 组合约束

```go
// 组合多个约束
type OrderedNumber interface {
    Numeric
    constraints.Ordered
}

func Sort[T OrderedNumber](slice []T) {
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
```

## 约束元素

### 类型元素

```go
// 使用 ~ 包含底层类型
type MyString string

type StringLike interface {
    ~string
}

func ToUpper[T StringLike](s T) string {
    return strings.ToUpper(string(s))
}

// 使用
var ms MyString = "hello"
fmt.Println(ToUpper(ms))  // HELLO
fmt.Println(ToUpper("world"))  // WORLD
```

### 指针约束

```go
// 约束为指针类型
type Pointer interface {
    *int | *string | *float64
}

func Dereference[T Pointer](p T) {
    fmt.Println(*p)
}

// 使用
x := 42
Dereference(&x)  // 42

s := "hello"
Dereference(&s)  // hello
```

## 实用模式

### 可比较约束

```go
// 用于需要比较的场景
type Equaler[T any] interface {
    Equals(other T) bool
}

func Find[T comparable](slice []T, target T) int {
    for i, v := range slice {
        if v == target {
            return i
        }
    }
    return -1
}

// 使用
numbers := []int{1, 2, 3, 4, 5}
fmt.Println(Find(numbers, 3))   // 2
fmt.Println(Find(numbers, 10))  // -1
```

### 可排序约束

```go
// 用于需要排序的场景
func SortSlice[T constraints.Ordered](slice []T) {
    sort.Slice(slice, func(i, j int) bool {
        return slice[i] < slice[j]
    })
}

// 使用
numbers := []int{5, 2, 8, 1, 9}
SortSlice(numbers)
fmt.Println(numbers)  // [1 2 5 8 9]

strings := []string{"banana", "apple", "cherry"}
SortSlice(strings)
fmt.Println(strings)  // [apple banana cherry]
```

### 可哈希约束

```go
// 用于 map key 的约束
func CountOccurrences[T comparable](items []T) map[T]int {
    counts := make(map[T]int)
    for _, item := range items {
        counts[item]++
    }
    return counts
}

// 使用
words := []string{"apple", "banana", "apple", "cherry", "banana", "apple"}
counts := CountOccurrences(words)
fmt.Println(counts)  // map[apple:3 banana:2 cherry:1]
```

## 最佳实践

::: tip 使用建议

1. **精确约束** - 只暴露必要的类型操作
2. **复用约束** - 使用 constraints 包
3. **文档清晰** - 说明约束的目的
4. **组合约束** - 通过组合创建复杂约束

:::

```go
// ✅ 好的模式：精确的约束
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// ❌ 不好的模式：过于宽泛
func Max[T any](a, b T) T {
    // 无法比较，没有意义
    return a
}

// ✅ 好的模式：复用内置约束
func Sum[T constraints.Integer](nums []T) T {
    var sum T
    for _, n := range nums {
        sum += n
    }
    return sum
}

// ❌ 不好的模式：重复定义
type Number interface {
    int | int8 | int16 | int32 | int64 |
    uint | uint8 | uint16 | uint32 | uint64
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **接口约束** | 限制为接口类型 |
| **联合约束** | \| 连接多个类型 |
| **~ 约束** | 包含底层类型 |
| **comparable** | 可比较类型 |
| **constraints** | 内置约束包 |

::: v-pre

[泛型](./generics.md) → [泛型实践](./generics-practice.md)

:::
