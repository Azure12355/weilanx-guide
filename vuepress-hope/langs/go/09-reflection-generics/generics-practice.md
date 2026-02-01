---
title: 泛型实践
icon: ri:code-s-slash-line
order: 4
---

# 泛型实践

泛型在实际开发中的应用场景和最佳实践，帮助编写更安全、更灵活的代码。

## 数据结构

### 泛型栈

```go
// 泛型栈实现
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

func (s *Stack[T]) Peek() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    return s.items[len(s.items)-1], true
}

func (s *Stack[T]) IsEmpty() bool {
    return len(s.items) == 0
}

func (s *Stack[T]) Size() int {
    return len(s.items)
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

### 泛型队列

```go
// 泛型队列实现
type Queue[T any] struct {
    items []T
}

func NewQueue[T any]() *Queue[T] {
    return &Queue[T]{
        items: make([]T, 0),
    }
}

func (q *Queue[T]) Enqueue(item T) {
    q.items = append(q.items, item)
}

func (q *Queue[T]) Dequeue() (T, bool) {
    if len(q.items) == 0 {
        var zero T
        return zero, false
    }
    item := q.items[0]
    q.items = q.items[1:]
    return item, true
}

func (q *Queue[T]) Front() (T, bool) {
    if len(q.items) == 0 {
        var zero T
        return zero, false
    }
    return q.items[0], true
}

func (q *Queue[T]) Size() int {
    return len(q.items)
}

// 使用
queue := NewQueue[string]()
queue.Enqueue("first")
queue.Enqueue("second")
queue.Enqueue("third")

for queue.Size() > 0 {
    val, _ := queue.Dequeue()
    fmt.Println(val)  // first second third
}
```

### 泛型链表

```go
// 泛型链表节点
type ListNode[T any] struct {
    Value T
    Next  *ListNode[T]
}

// 泛型链表
type LinkedList[T any] struct {
    head *ListNode[T]
    size int
}

func NewLinkedList[T any]() *LinkedList[T] {
    return &LinkedList[T]{}
}

func (ll *LinkedList[T]) Append(value T) {
    newNode := &ListNode[T]{Value: value}
    if ll.head == nil {
        ll.head = newNode
    } else {
        current := ll.head
        for current.Next != nil {
            current = current.Next
        }
        current.Next = newNode
    }
    ll.size++
}

func (ll *LinkedList[T]) Prepend(value T) {
    newNode := &ListNode[T]{Value: value, Next: ll.head}
    ll.head = newNode
    ll.size++
}

func (ll *LinkedList[T]) ToSlice() []T {
    result := make([]T, 0, ll.size)
    current := ll.head
    for current != nil {
        result = append(result, current.Value)
        current = current.Next
    }
    return result
}

// 使用
list := NewLinkedList[int]()
list.Append(1)
list.Append(2)
list.Prepend(0)

fmt.Println(list.ToSlice())  // [0 1 2]
```

## 集合操作

### Map 操作

```go
// 泛型 Map：对每个元素应用函数
func Map[T, U any](slice []T, fn func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = fn(v)
    }
    return result
}

// 使用
numbers := []int{1, 2, 3, 4, 5}
doubled := Map(numbers, func(n int) int { return n * 2 })
fmt.Println(doubled)  // [2 4 6 8 10]

strings := Map(numbers, func(n int) string {
    return fmt.Sprintf("Num:%d", n)
})
fmt.Println(strings)  // [Num:1 Num:2 Num:3 Num:4 Num:5]
```

### Filter 操作

```go
// 泛型 Filter：过滤元素
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
numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

evens := Filter(numbers, func(n int) bool {
    return n%2 == 0
})
fmt.Println(evens)  // [2 4 6 8 10]

greaterThanFive := Filter(numbers, func(n int) bool {
    return n > 5
})
fmt.Println(greaterThanFive)  // [6 7 8 9 10]
```

### Reduce 操作

```go
// 泛型 Reduce：归约操作
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

concatenated := Reduce([]string{"a", "b", "c"}, "", func(acc, s string) string {
    return acc + s
})
fmt.Println(concatenated)  // abc
```

### Any/All 操作

```go
// Any：是否有元素满足条件
func Any[T any](slice []T, predicate func(T) bool) bool {
    for _, v := range slice {
        if predicate(v) {
            return true
        }
    }
    return false
}

// All：是否所有元素满足条件
func All[T any](slice []T, predicate func(T) bool) bool {
    for _, v := range slice {
        if !predicate(v) {
            return false
        }
    }
    return true
}

// 使用
numbers := []int{1, 2, 3, 4, 5}

hasEven := Any(numbers, func(n int) bool {
    return n%2 == 0
})
fmt.Println("Has even:", hasEven)  // true

allPositive := All(numbers, func(n int) bool {
    return n > 0
})
fmt.Println("All positive:", allPositive)  // true

allLessThanTen := All(numbers, func(n int) bool {
    return n < 10
})
fmt.Println("All < 10:", allLessThanTen)  // true
```

## 搜索算法

### 二分查找

```go
// 泛型二分查找
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
fmt.Println(BinarySearch(strings, "grape"))   // -1
```

### 线性查找

```go
// 泛型线性查找
func LinearSearch[T comparable](slice []T, target T) int {
    for i, v := range slice {
        if v == target {
            return i
        }
    }
    return -1
}

// 使用
numbers := []int{5, 2, 8, 1, 9}
fmt.Println(LinearSearch(numbers, 8))  // 2
fmt.Println(LinearSearch(numbers, 3))  // -1

strings := []string{"apple", "banana", "cherry"}
fmt.Println(LinearSearch(strings, "banana"))  // 1
```

### 最大/最小值

```go
// 泛型最大值
func Max[T constraints.Ordered](slice []T) (T, error) {
    if len(slice) == 0 {
        var zero T
        return zero, errors.New("slice is empty")
    }
    max := slice[0]
    for _, v := range slice[1:] {
        if v > max {
            max = v
        }
    }
    return max, nil
}

// 泛型最小值
func Min[T constraints.Ordered](slice []T) (T, error) {
    if len(slice) == 0 {
        var zero T
        return zero, errors.New("slice is empty")
    }
    min := slice[0]
    for _, v := range slice[1:] {
        if v < min {
            min = v
        }
    }
    return min, nil
}

// 使用
numbers := []int{5, 2, 8, 1, 9}
maxVal, _ := Max(numbers)
minVal, _ := Min(numbers)
fmt.Printf("Max: %d, Min: %d\n", maxVal, minVal)  // Max: 9, Min: 1

strings := []string{"banana", "apple", "cherry"}
maxStr, _ := Max(strings)
minStr, _ := Min(strings)
fmt.Printf("Max: %s, Min: %s\n", maxStr, minStr)  // Max: cherry, Min: apple
```

## 排序算法

### 快速排序

```go
// 泛型快速排序
func QuickSort[T constraints.Ordered](slice []T) {
    if len(slice) < 2 {
        return
    }

    left, right := 0, len(slice)-1
    pivot := len(slice) / 2

    slice[pivot], slice[right] = slice[right], slice[pivot]

    for i := range slice {
        if slice[i] < slice[right] {
            slice[i], slice[left] = slice[left], slice[i]
            left++
        }
    }

    slice[left], slice[right] = slice[right], slice[left]

    QuickSort(slice[:left])
    QuickSort(slice[left+1:])
}

// 使用
numbers := []int{5, 2, 8, 1, 9, 3, 7, 4, 6}
QuickSort(numbers)
fmt.Println(numbers)  // [1 2 3 4 5 6 7 8 9]

strings := []string{"banana", "apple", "cherry", "date"}
QuickSort(strings)
fmt.Println(strings)  // [apple banana cherry date]
```

### 归并排序

```go
// 泛型归并排序
func MergeSort[T constraints.Ordered](slice []T) []T {
    if len(slice) <= 1 {
        return slice
    }

    mid := len(slice) / 2
    left := MergeSort(slice[:mid])
    right := MergeSort(slice[mid:])

    return merge(left, right)
}

func merge[T constraints.Ordered](left, right []T) []T {
    result := make([]T, 0, len(left)+len(right))

    i, j := 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i])
            i++
        } else {
            result = append(result, right[j])
            j++
        }
    }

    result = append(result, left[i:]...)
    result = append(result, right[j:]...)

    return result
}

// 使用
numbers := []int{5, 2, 8, 1, 9, 3}
sorted := MergeSort(numbers)
fmt.Println(sorted)  // [1 2 3 5 8 9]
```

## 实用工具

### 缓存

```go
// 泛型 LRU 缓存
type Cache[K comparable, V any] struct {
    capacity int
    items    map[K]V
    order    []K
}

func NewCache[K comparable, V any](capacity int) *Cache[K, V] {
    return &Cache[K, V]{
        capacity: capacity,
        items:    make(map[K]V),
        order:    make([]K, 0, capacity),
    }
}

func (c *Cache[K, V]) Get(key K) (V, bool) {
    value, ok := c.items[key]
    return value, ok
}

func (c *Cache[K, V]) Put(key K, value V) {
    if _, exists := c.items[key]; !exists {
        if len(c.order) >= c.capacity {
            // 删除最旧的项
            oldest := c.order[0]
            delete(c.items, oldest)
            c.order = c.order[1:]
        }
        c.order = append(c.order, key)
    }
    c.items[key] = value
}

// 使用
cache := NewCache[string, int](3)
cache.Put("a", 1)
cache.Put("b", 2)
cache.Put("c", 3)

if val, ok := cache.Get("a"); ok {
    fmt.Println("a:", val)  // a: 1
}

cache.Put("d", 4)  // evicts "a"
```

### 对象池

```go
// 泛型对象池
type Pool[T any] struct {
    pool chan T
    New  func() T
}

func NewPool[T any](size int, newFunc func() T) *Pool[T] {
    p := &Pool[T]{
        pool: make(chan T, size),
        New:  newFunc,
    }

    for i := 0; i < size; i++ {
        p.pool <- newFunc()
    }

    return p
}

func (p *Pool[T]) Get() T {
    select {
    case item := <-p.pool:
        return item
    default:
        return p.New()
    }
}

func (p *Pool[T]) Put(item T) {
    select {
    case p.pool <- item:
    default:
        // 池已满，丢弃
    }
}

// 使用
pool := NewPool[*bytes.Buffer](10, func() *bytes.Buffer {
    return bytes.NewBuffer(nil)
})

buf := pool.Get()
buf.WriteString("Hello")

// 使用完后放回
pool.Put(buf)
```

## 最佳实践

::: tip 使用建议

1. **合理使用** - 不是所有函数都需要泛型
2. **清晰命名** - 类型参数名应简洁明了
3. **精确约束** - 只暴露必要的操作
4. **文档完善** - 泛型代码需要更多文档

:::

```go
// ✅ 好的模式：明确的目的
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// ❌ 不好的模式：过度使用
func Identity[T any](value T) T {
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

| 模式 | 关键点 |
|------|--------|
| **数据结构** | 栈、队列、链表泛型化 |
| **集合操作** | Map、Filter、Reduce |
| **搜索排序** | 二分查找、快速排序 |
| **实用工具** | 缓存、对象池 |

::: v-pre

[类型约束](./constraints.md) → [最佳实践](./best-practices.md)

:::
