---
title: 内存优化
icon: ri:database-2-line
order: 3
---

# 内存优化

合理使用内存是 Go 性能优化的关键，良好的内存管理可以减少 GC 压力，提高程序性能。

## 内存分配基础

### 栈 vs 堆

```go
// 栈分配：快速，自动释放
func stackAllocation() int {
    x := 42  // 栈上分配
    return x
}

// 堆分配：较慢，GC 管理
func heapAllocation() *int {
    x := 42  // 可能逃逸到堆
    return &x
}

// 逃逸分析
//go:noinline
func escape() *int {
    x := 42
    return &x  // x 逃逸到堆
}

//go:noinline
func noEscape() int {
    x := 42
    return x  // x 在栈上
}
```

### 查看逃逸分析

```bash
# 查看逃逸分析结果
go build -gcflags="-m" main.go

# 更详细的逃逸分析
go build -gcflags="-m -m" main.go

# 输出示例
# ./main.go:10:6: can inline stackAllocation
# ./main.go:14:9: &x escapes to heap
```

## 对象复用

### sync.Pool

```go
// ✅ 使用 sync.Pool 复用对象
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func processWithPool() {
    // 从池中获取
    buf := bufferPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()          // 重置
        bufferPool.Put(buf)  // 放回池中
    }()

    // 使用 buffer
    buf.WriteString("data")
    processData(buf.Bytes())
}

// ❌ 每次创建新对象
func processWithoutPool() {
    buf := new(bytes.Buffer)
    buf.WriteString("data")
    processData(buf.Bytes())
}
```

### 复杂对象池

```go
type Object struct {
    data []int
    buf  []byte
}

var objectPool = sync.Pool{
    New: func() interface{} {
        return &Object{
            data: make([]int, 0, 100),
            buf:  make([]byte, 0, 1024),
        }
    },
}

func processObject() {
    obj := objectPool.Get().(*Object)
    defer func() {
        // 重置并放回池中
        obj.data = obj.data[:0]
        obj.buf = obj.buf[:0]
        objectPool.Put(obj)
    }()

    // 使用对象
    obj.data = append(obj.data, 1, 2, 3)
    obj.buf = append(obj.buf, "data"...)
}
```

## 减少分配

### 预分配容量

```go
// ✅ 预分配容量
func growWithPrealloc(n int) []int {
    slice := make([]int, 0, n)
    for i := 0; i < n; i++ {
        slice = append(slice, i)
    }
    return slice
}

// ❌ 动态扩容
func growDynamic(n int) []int {
    slice := make([]int, 0)
    for i := 0; i < n; i++ {
        slice = append(slice, i)  // 多次分配
    }
    return slice
}
```

### map 预分配

```go
// ✅ 预分配 map 容量
func createMap(size int) map[string]int {
    return make(map[string]int, size)
}

// 使用
m := createMap(1000)
for i := 0; i < 1000; i++ {
    m[strconv.Itoa(i)] = i
}

// ❌ 不预分配
func createMapNoPrealloc(size int) map[string]int {
    return make(map[string]int)  // 多次扩容
}
```

### 字符串构建

```go
// ✅ 使用 strings.Builder
func buildWithStringBuilder(parts []string) string {
    var builder strings.Builder
    builder.Grow(len(parts) * 10)  // 预分配
    for _, p := range parts {
        builder.WriteString(p)
    }
    return builder.String()
}

// ❌ 使用 + 拼接
func buildWithPlus(parts []string) string {
    result := ""
    for _, p := range parts {
        result += p  // 每次都创建新字符串
    }
    return result
}

// ❌ 使用 fmt.Sprintf
func buildWithSprintf(parts []string) string {
    var result string
    for _, p := range parts {
        result = fmt.Sprintf("%s%s", result, p)  // 低效
    }
    return result
}
```

## 零值优化

### 使用零值

```go
// ✅ 使用零值避免分配
func zeroValueOptimization() {
    var buf bytes.Buffer  // 零值即可用
    buf.WriteString("data")

    var mu sync.Mutex  // 零值即可用
    mu.Lock()
    // ...
    mu.Unlock()
}

// ❌ 不必要的 new
func unnecessaryNew() {
    buf := new(bytes.Buffer)  // 不必要
    buf.WriteString("data")

    mu := new(sync.Mutex)  // 不必要
    mu.Lock()
    // ...
    mu.Unlock()
}
```

### 零值复制

```go
// ✅ 零值复制避免分配
type Config struct {
    Host     string
    Port     int
    Timeout  time.Duration
}

func copyConfig() {
    var zero Config  // 零值，栈分配
    cfg := zero      // 复制零值，栈分配
    cfg.Host = "localhost"
    cfg.Port = 8080
    // ...
}

// ❌ 堆分配
func newConfig() {
    cfg := new(Config)  // 可能逃逸到堆
    cfg.Host = "localhost"
    cfg.Port = 8080
    // ...
}
```

## 切片优化

### 避免切片泄漏

```go
// ❌ 可能导致内存泄漏
func leakSlice() []byte {
    data := make([]byte, 10*1024*1024)  // 10MB
    // 只需要前 100 字节
    return data[:100]  // 但整个 10MB 被引用
}

// ✅ 复制需要的数据
func noLeakSlice() []byte {
    data := make([]byte, 10*1024*1024)
    result := make([]byte, 100)
    copy(result, data[:100])  // 只复制需要的部分
    return result
}
```

### 切片重用

```go
// ✅ 重用切片
func processItems() {
    buf := make([]byte, 0, 1024)

    for i := 0; i < 1000; i++ {
        // 重用 buf
        buf = buf[:0]
        buf = append(buf, "data"...)
        process(buf)
    }
}

// ❌ 每次创建新切片
func processItemsNew() {
    for i := 0; i < 1000; i++ {
        buf := make([]byte, 0, 1024)  // 每次分配
        buf = append(buf, "data"...)
        process(buf)
    }
}
```

## 内存对齐

### 结构体字段排序

```go
// ❌ 不好的字段顺序
type BadStruct struct {
    a bool   // 1 字节
    b int64  // 8 字节
    c bool   // 1 字节
    d int64  // 8 字节
}
// 大小: 32 字节 (因为对齐)

// ✅ 好的字段顺序
type GoodStruct struct {
    b int64  // 8 字节
    d int64  // 8 字节
    a bool   // 1 字节
    c bool   // 1 字节
}
// 大小: 16 字节

// 验证大小
func main() {
    fmt.Println(unsafe.Sizeof(BadStruct{}))   // 32
    fmt.Println(unsafe.Sizeof(GoodStruct{}))  // 16
}
```

### 检查对齐

```go
func checkAlignment() {
    type T struct {
        a bool
        b int64
    }

    t := T{}
    fmt.Printf("a offset: %d\n", unsafe.Offsetof(t.a))  // 0
    fmt.Printf("b offset: %d\n", unsafe.Offsetof(t.b))  // 8
    fmt.Printf("Size: %d\n", unsafe.Sizeof(t))          // 16
}
```

## 数组 vs 切片

### 使用数组

```go
// ✅ 小数组在栈上
func useArray() {
    var arr [4]int  // 栈分配
    arr[0] = 1
    arr[1] = 2
    process(arr)
}

// ❌ 小切片可能逃逸
func useSlice() {
    arr := make([]int, 4)  // 可能堆分配
    arr[0] = 1
    arr[1] = 2
    process(arr)
}
```

### 固定大小数组

```go
// ✅ 固定大小使用数组
type FixedBuffer [1024]byte

func useFixedBuffer() {
    var buf FixedBuffer  // 栈分配
    buf[0] = 'a'
    process(buf)
}

// ❌ 不必要使用切片
type DynamicBuffer struct {
    data []byte
}

func useDynamicBuffer() {
    buf := DynamicBuffer{
        data: make([]byte, 1024),  // 堆分配
    }
    buf.data[0] = 'a'
    process(buf)
}
```

## 内存泄漏检测

### 常见泄漏模式

```go
// ❌ 1. 子切片泄漏
func leakSubslice() {
    data := make([]byte, 10*1024*1024)
    _ = data[:100]  // 引用整个 data
}

// ✅ 复制数据
func noLeakSubslice() {
    data := make([]byte, 10*1024*1024)
    result := make([]byte, 100)
    copy(result, data[:100])  // 只复制需要的
    _ = result
}

// ❌ 2. 闭包泄漏
func leakClosure() {
    var data [1024]byte
    for i := 0; i < 1000; i++ {
        go func() {
            // 闭包捕获 data
            time.Sleep(time.Hour)
            fmt.Println(data[0])
        }()
    }
}

// ✅ 传递参数
func noLeakClosure() {
    var data [1024]byte
    for i := 0; i < 1000; i++ {
        go func(d [1024]byte) {
            time.Sleep(time.Hour)
            fmt.Println(d[0])
        }(data)
    }
}

// ❌ 3. 延迟释放
func leakDefer() {
    for i := 0; i < 1000; i++ {
        data := make([]byte, 1024*1024)
        defer func() {
            // defer 直到函数返回才执行
            // data 一直占用内存
            _ = data
        }()
    }
}

// ✅ 立即处理
func noLeakDefer() {
    for i := 0; i < 1000; i++ {
        data := make([]byte, 1024*1024)
        func() {
            _ = data
        }()  // 立即执行
    }
}
```

## GC 调优

### GC 参数

```go
func main() {
    // 设置 GC 目标百分比
    debug.SetGCPercent(100)  // 默认值 100

    // 更激进的 GC
    debug.SetGCPercent(50)  // 更频繁的 GC

    // 更保守的 GC
    debug.SetGCPercent(200)  // 更少的 GC

    // 手动触发 GC
    runtime.GC()

    // 强制 GC 并等待完成
    debug.FreeOSMemory()
}
```

### GC 统计

```go
func printGCStats() {
    var m runtime.MemStats
    runtime.ReadMemStats(&m)

    fmt.Printf("Alloc: %v MB\n", m.Alloc/1024/1024)
    fmt.Printf("TotalAlloc: %v MB\n", m.TotalAlloc/1024/1024)
    fmt.Printf("Sys: %v MB\n", m.Sys/1024/1024)
    fmt.Printf("NumGC: %v\n", m.NumGC)
    fmt.Printf("PauseTotal: %v\n", m.PauseTotalNs)
}
```

## 最佳实践

::: tip 内存优化建议

1. **预分配** - 为切片和 map 预分配容量
2. **复用对象** - 使用 sync.Pool 复用对象
3. **避免泄漏** - 注意子切片和闭包
4. **零值优化** - 使用零值而非 new
5. **检查逃逸** - 使用逃逸分析验证

:::

```go
// ✅ 好的模式
func goodPattern() {
    // 预分配
    buf := make([]byte, 0, 1024)

    // 复用
    pool := &sync.Pool{
        New: func() interface{} {
            return make([]byte, 0, 1024)
        },
    }

    // 零值
    var builder strings.Builder

    // 使用这些优化
    _ = buf
    _ = pool
    _ = builder
}
```

## 总结

| 技术 | 关键点 |
|------|--------|
| **sync.Pool** - 对象复用 |
| **预分配** - 减少扩容 |
| **零值** - 栈分配 |
| **切片** - 避免泄漏 |
| **对齐** - 优化布局 |

::: v-pre

[性能分析](./profiling.md) → [优化技巧](./optimization.md)

:::
