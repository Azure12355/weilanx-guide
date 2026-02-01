---
title: 垃圾回收
icon: ri:delete-bin-line
order: 3
---

# 垃圾回收

Go 使用自动垃圾回收（GC）来管理内存，理解 GC 的工作原理对于编写高性能 Go 程序至关重要。

## GC 基础

### 三色标记法

```go
// Go 的 GC 使用三色标记算法
// 对象分为三种颜色：
// - 白色：未访问（可能被回收）
// - 灰色：已访问但其引用对象未访问
// - 黑色：已访问且其引用对象也已访问

type Node struct {
    value int
    next  *Node
}

// GC 过程示例
func createList() *Node {
    // 创建链表
    head := &Node{value: 1}
    head.next = &Node{value: 2}
    head.next.next = &Node{value: 3}
    return head
}
```

### 写屏障

```go
// 写屏障保证并发 GC 的正确性
// 当应用程序修改指针时，写屏障会记录这些变化

type Graph struct {
    nodes []*Node
}

func (g *Graph) AddNode(n *Node) {
    // 写屏障会记录这个指针写入
    g.nodes = append(g.nodes, n)
}

func (g *Graph) RemoveNode(index int) {
    // 写屏障会记录这个指针删除
    if index >= 0 && index < len(g.nodes) {
        g.nodes = append(g.nodes[:index], g.nodes[index+1:]...)
    }
}
```

## GC 调优

### GOGC 环境变量

```go
// GOGC 控制 GC 触发的时机
// 默认值 100 表示：堆增长 100% 后触发 GC
// 设置为 off 表示关闭 GC（不推荐）

// 查看当前 GC 设置
func printGCStats() {
    fmt.Printf("GOGC: %s\n", os.Getenv("GOGC"))
}

// 在程序中设置
func setGCPercent() {
    // 设置 GC 触发百分比
    // 100 = 默认值
    // 200 = 更激进的 GC（减少 GC 次数）
    // 50 = 更保守的 GC（增加 GC 次数）
    debug.SetGCPercent(100)
}
```

### GC 统计

```go
// 读取 GC 统计信息
func readGCStats() {
    var memStats runtime.MemStats
    runtime.ReadMemStats(&memStats)

    fmt.Printf("HeapAlloc: %d bytes\n", memStats.HeapAlloc)
    fmt.Printf("HeapSys: %d bytes\n", memStats.HeapSys)
    fmt.Printf("HeapObjects: %d\n", memStats.HeapObjects)
    fmt.Printf("NumGC: %d\n", memStats.NumGC)
    fmt.Printf("PauseTotal: %v\n", memStats.PauseTotal)
    fmt.Printf("LastGC: %s\n", time.Unix(0, int64(memStats.LastGC)))
}
```

### 强制 GC

```go
// 强制运行垃圾回收
func forceGC() {
    runtime.GC()
}

// 在特定场景下使用
func processLargeDataset() {
    // 处理大量数据
    data := make([][]byte, 0, 100000)
    for i := 0; i < 100000; i++ {
        data = append(data, make([]byte, 1024))
    }

    // 处理完成后释放内存
    data = nil

    // 强制 GC
    runtime.GC()
}
```

## 内存分析

### 内存剖析

```go
// 启用内存剖析
func enableMemProfile() {
    // 创建内存剖析文件
    f, err := os.Create("memprofile.prof")
    if err != nil {
        log.Fatal(err)
    }
    defer f.Close()

    // 启动内存剖析
    if err := runtime.MemProfileRate(1); err != nil {
        log.Fatal(err)
    }

    // 运行程序

    // 写入内存剖析数据
    if err := pprof.WriteHeapProfile(f); err != nil {
        log.Fatal(err)
    }
}
```

### 对象分配追踪

```go
// 追踪对象分配
func trackAllocations() {
    var memStats runtime.MemStats

    // 读取初始状态
    runtime.ReadMemStats(&memStats)
    initialAlloc := memStats.TotalAlloc

    // 分配对象
    objects := make([]*Object, 1000)
    for i := 0; i < 1000; i++ {
        objects[i] = &Object{ID: i}
    }

    // 读取当前状态
    runtime.ReadMemStats(&memStats)
    currentAlloc := memStats.TotalAlloc

    fmt.Printf("Allocated: %d bytes\n", currentAlloc-initialAlloc)
}
```

### 堆栈分析

```go
// 获取堆栈信息
func printStack() {
    buf := make([]byte, 1024*1024)
    n := runtime.Stack(buf, true)
    fmt.Printf("Stack:\n%s\n", buf[:n])
}

// 获取所有 goroutine 的堆栈
func printAllGoroutines() {
    buf := make([]byte, 1024*1024)
    n := runtime.Stack(buf, true)
    fmt.Printf("All Goroutines:\n%s\n", buf[:n])
}
```

## 内存泄漏检测

### 常见泄漏模式

```go
// 1. goroutine 泄漏
func leakedGoroutine() {
    ch := make(chan int)

    // goroutine 永远阻塞
    go func() {
        val := <-ch  // 没有发送者，永远阻塞
        fmt.Println(val)
    }()
    // ch 永远不会发送数据
}

// 正确做法
func correctGoroutine() {
    ch := make(chan int)
    done := make(chan struct{})

    go func() {
        select {
        case val := <-ch:
            fmt.Println(val)
        case <-done:
            return  // 可以正常退出
        }
    }()

    // 使用完毕后关闭
    close(done)
}

// 2. 闭包泄漏
func closureLeak() {
    var funcs []func()

    for i := 0; i < 3; i++ {
        funcs = append(funcs, func() {
            fmt.Println(i)  // 闭包捕获变量
        })
    }

    for _, f := range funcs {
        f()
    }
}

// 3. 切片泄漏
func sliceLeak() {
    // 切片保持对底层数组的引用
    data := make([]byte, 1024*1024)  // 1MB
    slice := data[:100]

    // data 仍然被 slice 引用，无法释放
    // 正确做法：复制需要的部分
    dataCopy := make([]byte, len(slice))
    copy(dataCopy, slice)
    slice = dataCopy
    // 现在 data 可以被 GC 回收
}
```

### 泄漏检测工具

```go
// 使用 runtime.MemStats 检测泄漏
func detectLeak() {
    var memStats runtime.MemStats

    runtime.ReadMemStats(&memStats)
    initialHeap := memStats.HeapAlloc

    // 执行操作
    doSomething()

    runtime.ReadMemStats(&memStats)
    finalHeap := memStats.HeapAlloc

    // 强制 GC
    runtime.GC()

    runtime.ReadMemStats(&memStats)
    afterGC := memStats.HeapAlloc

    if afterGC > initialHeap*2 {
        fmt.Println("Potential memory leak detected!")
    }
}
```

## 性能优化

### 对象复用

```go
// 使用 sync.Pool 复用对象
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func getBuffer() *bytes.Buffer {
    return bufferPool.Get().(*bytes.Buffer)
}

func putBuffer(buf *bytes.Buffer) {
    buf.Reset()
    bufferPool.Put(buf)
}

// 使用
func processData(data []byte) {
    buf := getBuffer()
    defer putBuffer(buf)

    buf.Write(data)
    // 处理数据
}
```

### 减少分配

```go
// ❌ 不好的模式：频繁分配
func concatenateBad(strings []string) string {
    result := ""
    for _, s := range strings {
        result += s  // 每次都创建新字符串
    }
    return result
}

// ✅ 好的模式：使用 strings.Builder
func concatenateGood(strings []string) string {
    var builder strings.Builder
    builder.Grow(len(strings) * 10)  // 预分配
    for _, s := range strings {
        builder.WriteString(s)
    }
    return builder.String()
}

// ✅ 更好的模式：预分配切片
func preallocateSlice(n int) []int {
    // 预分配容量
    slice := make([]int, 0, n)
    for i := 0; i < n; i++ {
        slice = append(slice, i)
    }
    return slice
}
```

### 避免指针逃逸

```go
// ❌ 指针逃逸到堆
func escapeToHeap() *int {
    x := 42
    return &x  // x 分配在堆上
}

// ✅ 使用值返回
func noEscape() int {
    x := 42
    return x  // x 分配在栈上
}

// ❌ 切片重新分配导致逃逸
func sliceEscape() []int {
    var slice []int
    for i := 0; i < 1000; i++ {
        slice = append(slice, i)  // 可能逃逸到堆
    }
    return slice
}

// ✅ 预分配避免逃逸
func sliceNoEscape() []int {
    slice := make([]int, 0, 1000)
    for i := 0; i < 1000; i++ {
        slice = append(slice, i)  // 更可能留在栈上
    }
    return slice
}
```

## GC 监控

### GC 事件监听

```go
// 监听 GC 事件
func monitorGC() {
    var lastGC uint32

    for {
        var memStats runtime.MemStats
        runtime.ReadMemStats(&memStats)

        if memStats.NumGC != lastGC {
            fmt.Printf("GC #%d: %v\n", memStats.NumGC, memStats.PauseTotal)
            lastGC = memStats.NumGC
        }

        time.Sleep(time.Second)
    }
}
```

### 性能指标

```go
// 计算 GC 性能指标
func gcMetrics() {
    var memStats runtime.MemStats
    runtime.ReadMemStats(&memStats)

    // GC 次数
    numGC := memStats.NumGC

    // 总暂停时间
    totalPause := memStats.PauseTotal

    // 平均暂停时间
    avgPause := time.Duration(int64(totalPause) / int64(numGC))

    // 最近一次 GC 时间
    lastGC := time.Unix(0, int64(memStats.LastGC))

    fmt.Printf("GC Count: %d\n", numGC)
    fmt.Printf("Total Pause: %v\n", totalPause)
    fmt.Printf("Avg Pause: %v\n", avgPause)
    fmt.Printf("Last GC: %v\n", lastGC)
}
```

## 最佳实践

::: tip 使用建议

1. **减少分配** - 预分配切片容量
2. **对象复用** - 使用 sync.Pool
3. **避免逃逸** - 尽量使用值类型
4. **监控 GC** - 定期检查 GC 统计
5. **合理调优** - 根据场景调整 GOGC

:::

```go
// ✅ 好的模式：减少分配
func processGood() {
    // 预分配
    data := make([]byte, 0, 1024)

    // 复用对象
    buf := getBuffer()
    defer putBuffer(buf)

    // 使用值类型
    var result Value  // 不是指针
}

// ❌ 不好的模式：频繁分配
func processBad() {
    // 逐个追加
    var data []byte

    // 每次创建新对象
    buf := new(bytes.Buffer)

    // 使用指针
    result := new(Value)
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **三色标记** | GC 的核心算法 |
| **GOGC** | 控制 GC 触发时机 |
| **sync.Pool** | 对象复用 |
| **内存泄漏** | 常见模式和检测 |
| **逃逸分析** | 理解堆栈分配 |

::: v-pre

[性能优化](./optimization.md) → [基准测试](./benchmarks.md)

:::
