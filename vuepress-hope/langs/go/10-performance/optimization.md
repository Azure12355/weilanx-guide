---
title: 优化技巧
icon: ri:rocket-line
order: 4
---

# 优化技巧

掌握各种优化技巧可以让 Go 程序运行更快、更高效。

## 并发优化

### goroutine 池

```go
// Worker 池模式
type Worker struct {
    id       int
    taskChan chan Task
    quit     chan bool
}

type Task struct {
    // 任务数据
}

func NewWorker(id int) *Worker {
    return &Worker{
        id:       id,
        taskChan: make(chan Task, 100),
        quit:     make(chan bool),
    }
}

func (w *Worker) Start() {
    go func() {
        for {
            select {
            case task := <-w.taskChan:
                task.Execute()
            case <-w.quit:
                return
            }
        }
    }()
}

func (w *Worker) Stop() {
    w.quit <- true
}

type Pool struct {
    workers []*Worker
    wg      sync.WaitGroup
    taskChan chan Task
}

func NewPool(size int) *Pool {
    pool := &Pool{
        workers:  make([]*Worker, size),
        taskChan: make(chan Task, size*10),
    }

    for i := 0; i < size; i++ {
        worker := NewWorker(i)
        worker.Start()
        pool.workers[i] = worker
    }

    return pool
}

func (p *Pool) Submit(task Task) {
    p.taskChan <- task
}

func (p *Pool) Shutdown() {
    close(p.taskChan)
    for _, w := range p.workers {
        w.Stop()
    }
}
```

### 减少锁竞争

```go
// ✅ 使用读写锁
type SafeMap struct {
    mu   sync.RWMutex
    data map[string]interface{}
}

func (m *SafeMap) Get(key string) (interface{}, bool) {
    m.mu.RLock()
    defer m.mu.RUnlock()
    val, ok := m.data[key]
    return val, ok
}

func (m *SafeMap) Set(key string, val interface{}) {
    m.mu.Lock()
    defer m.mu.Unlock()
    m.data[key] = val
}

// ✅ 使用分片锁
type ShardedMap struct {
    shards    []*mapShard
    shardMask int
}

type mapShard struct {
    mu   sync.RWMutex
    data map[string]interface{}
}

func NewShardedMap(numShards int) *ShardedMap {
    // 确保 numShards 是 2 的幂
    size := 1
    for size < numShards {
        size <<= 1
    }

    sm := &ShardedMap{
        shards:    make([]*mapShard, size),
        shardMask: size - 1,
    }

    for i := 0; i < size; i++ {
        sm.shards[i] = &mapShard{
            data: make(map[string]interface{}),
        }
    }

    return sm
}

func (sm *ShardedMap) getShard(key string) *mapShard {
    hash := fnv.New32a()
    hash.Write([]byte(key))
    return sm.shards[int(hash.Sum32())&sm.shardMask]
}

func (sm *ShardedMap) Get(key string) (interface{}, bool) {
    shard := sm.getShard(key)
    shard.mu.RLock()
    defer shard.mu.RUnlock()
    val, ok := shard.data[key]
    return val, ok
}

func (sm *ShardedMap) Set(key string, val interface{}) {
    shard := sm.getShard(key)
    shard.mu.Lock()
    defer shard.mu.Unlock()
    shard.data[key] = val
}
```

### 无锁编程

```go
// ✅ 使用 atomic
type Counter struct {
    value int64
}

func (c *Counter) Increment() {
    atomic.AddInt64(&c.value, 1)
}

func (c *Counter) Get() int64 {
    return atomic.LoadInt64(&c.value)
}

// ✅ 使用 atomic.Value
type Config struct {
    // 配置字段
}

type ConfigHolder struct {
    value atomic.Value
}

func (h *ConfigHolder) Store(cfg *Config) {
    h.value.Store(cfg)
}

func (h *ConfigHolder) Load() *Config {
    return h.value.Load().(*Config)
}
```

## CPU 优化

### 避免类型转换

```go
// ✅ 直接使用 []byte
func processBytes(data []byte) {
    hash := crc32.ChecksumIEEE(data)
    _ = hash
}

// ❌ 不必要的转换
func processBytesBad(data []byte) {
    str := string(data)      // 转换开销
    data2 := []byte(str)     // 再次转换
    hash := crc32.ChecksumIEEE(data2)
    _ = hash
}

// ✅ 使用 unsafe（谨慎）
func bytesToString(b []byte) string {
    return *(*string)(unsafe.Pointer(&b))
}

func stringToBytes(s string) []byte {
    return *(*[]byte)(unsafe.Pointer(
        &struct {
            string
            int
        }{s, len(s)},
    ))
}
```

### 位运算优化

```go
// ✅ 位运算替代数学运算
func isPowerOfTwo(n int) bool {
    return n > 0 && (n&(n-1)) == 0
}

// 取代
func isPowerOfTwoSlow(n int) bool {
    if n <= 0 {
        return false
    }
    for n%2 == 0 {
        n /= 2
    }
    return n == 1
}

// ✅ 快速取模（当除数是 2 的幂时）
func fastMod(n int) int {
    return n & 0xFF  // 等价于 n % 256
}

// ❌ 慢速取模
func slowMod(n int) int {
    return n % 256
}
```

### 循环优化

```go
// ✅ 减少循环内的计算
func optimizedLoop(data []int) {
    const threshold = 100
    for _, v := range data {
        if v > threshold {
            process(v)
        }
    }
}

// ❌ 重复计算
func unoptimizedLoop(data []int) {
    for _, v := range data {
        threshold := calculateThreshold()  // 重复计算
        if v > threshold {
            process(v)
        }
    }
}

// ✅ 循环展开（编译器通常自动做）
func unrolledLoop(data []int) {
    for i := 0; i < len(data); i += 4 {
        process(data[i])
        if i+1 < len(data) {
            process(data[i+1])
        }
        if i+2 < len(data) {
            process(data[i+2])
        }
        if i+3 < len(data) {
            process(data[i+3])
        }
    }
}
```

## 字符串优化

### 字符串拼接

```go
// ✅ 使用 strings.Builder
func buildString(parts []string) string {
    var builder strings.Builder
    builder.Grow(len(parts) * 10)
    for _, p := range parts {
        builder.WriteString(p)
    }
    return builder.String()
}

// ✅ 对于少量字符串，使用 +
func concatFewStrings(a, b, c string) string {
    return a + b + c
}

// ❌ 使用 fmt.Sprintf 拼接
func buildWithFmt(parts []string) string {
    var result string
    for _, p := range parts {
        result = fmt.Sprintf("%s%s", result, p)
    }
    return result
}
```

### 字符串比较

```go
// ✅ 直接比较
func compareStrings(a, b string) bool {
    return a == b
}

// ✅ 使用 bytes.Equal
func equalBytes(a, b []byte) bool {
    return bytes.Equal(a, b)
}

// ❌ 使用 reflect.DeepEqual
func compareDeep(a, b string) bool {
    return reflect.DeepEqual(a, b)  // 慢
}
```

### 子字符串

```go
// ✅ 子字符串不复制
func substring(s string, start, end int) string {
    return s[start:end]  // O(1) 操作
}

// ❌ 不必要的转换
func substringBad(s string, start, end int) string {
    return string([]byte(s)[start:end])  // 复制整个字符串
}
```

## 数据结构优化

### 选择合适的容器

```go
// ✅ 根据场景选择
func chooseContainer(n int) {
    // 小量固定大小：数组
    var arr [10]int

    // 动态大小：切片
    slice := make([]int, n)

    // 快速查找：map
    m := make(map[int]bool)

    // O(1) 头尾操作：链表
    list := list.New()

    _ = arr
    _ = slice
    _ = m
    _ = list
}
```

### 结构体优化

```go
// ✅ 排序字段减少填充
type Optimized struct {
    a int64  // 8 字节
    b int64  // 8 字节
    c bool   // 1 字节
    d bool   // 1 字节
}  // 共 16 字节

// ❌ 混乱的字段顺序
type Padded struct {
    a bool   // 1 字节 + 7 字节填充
    b int64  // 8 字节
    c bool   // 1 字节 + 7 字节填充
    d int64  // 8 字节
}  // 共 32 字节
```

## I/O 优化

### 缓冲 I/O

```go
// ✅ 使用缓冲
func bufferedWrite(filename string, data [][]byte) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    defer writer.Flush()

    for _, d := range data {
        _, err := writer.Write(d)
        if err != nil {
            return err
        }
    }

    return nil
}

// ❌ 不缓冲
func unbufferedWrite(filename string, data [][]byte) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    for _, d := range data {
        _, err := file.Write(d)
        if err != nil {
            return err
        }
    }

    return nil
}
```

### 批量操作

```go
// ✅ 批量数据库操作
func batchInsert(items []Item) error {
    const batchSize = 100

    for i := 0; i < len(items); i += batchSize {
        end := i + batchSize
        if end > len(items) {
            end = len(items)
        }

        if err := db.Insert(items[i:end]); err != nil {
            return err
        }
    }

    return nil
}

// ❌ 逐个插入
func singleInsert(items []Item) error {
    for _, item := range items {
        if err := db.Insert(item); err != nil {
            return err
        }
    }
    return nil
}
```

## 编译优化

### 内联提示

```go
//go:noinline
func NoInline() int {
    return 42
}

// 小函数自动内联
func Small() int {
    return 42
}

// 复杂函数不内联
func Complex() int {
    // 复杂逻辑
    return 42
}
```

### 编译指令

```go
//go:nosplit
func NoSplit() {
    // 不分裂栈
}

//go:norace
func NoRace() {
    // 不检测竞态
}

//go:uintptrescapes
func UintptrEscapes(ptr uintptr) {
    // 指针逃逸
}
```

### 优化级别

```bash
# 默认优化
go build

# 禁用优化（调试）
go build -gcflags="-N -l"

# 更激进的优化
go build -gcflags="-l=4"

# 去掉调试信息
go build -ldflags="-s -w"
```

## 算法优化

### 选择合适的算法

```go
// ✅ O(log n) 查找
func binarySearch(sorted []int, target int) int {
    left, right := 0, len(sorted)-1

    for left <= right {
        mid := left + (right-left)/2

        if sorted[mid] == target {
            return mid
        } else if sorted[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    return -1
}

// ❌ O(n) 查找
func linearSearch(data []int, target int) int {
    for i, v := range data {
        if v == target {
            return i
        }
    }
    return -1
}
```

### 缓存结果

```go
// ✅ 记忆化
type MemoizeFunc func(int) int

func Memoize(f MemoizeFunc) MemoizeFunc {
    cache := make(map[int]int)
    var mu sync.Mutex

    return func(n int) int {
        mu.Lock()
        defer mu.Unlock()

        if val, ok := cache[n]; ok {
            return val
        }

        val := f(n)
        cache[n] = val
        return val
    }
}

var fib = Memoize(func(n int) int {
    if n <= 1 {
        return n
    }
    return fib(n-1) + fib(n-2)
})
```

## 最佳实践

::: tip 优化建议

1. **先测量** - 使用 pprof 找到真正的瓶颈
2. **算法优先** - 优化算法比微优化更有效
3. **保持简单** - 简单代码更容易优化
4. **可读性** - 不要过度优化牺牲可读性
5. **测试验证** - 确保优化没有破坏功能

:::

```go
// ✅ 好的模式
func goodOptimization(data []int) int {
    sum := 0
    for _, v := range data {
        sum += v
    }
    return sum
}

// ❌ 不好的模式
func badOptimization(data []int) int {
    if len(data) == 0 {
        return 0
    }

    // 过度优化，难以维护
    sum := data[0] + data[1]
    for i := 2; i < len(data)-3; i += 4 {
        sum += data[i] + data[i+1] + data[i+2] + data[i+3]
    }

    // 处理剩余元素
    for i := (len(data) / 4) * 4; i < len(data); i++ {
        sum += data[i]
    }

    return sum
}
```

## 总结

| 优化 | 关键点 |
|------|--------|
| **并发** - goroutine 池、减少锁竞争 |
| **CPU** - 避免类型转换、位运算 |
| **内存** - 预分配、对象复用 |
| **I/O** - 缓冲、批量操作 |
| **算法** - 选择合适算法、缓存结果 |

::: v-pre

[内存优化](./memory.md) → [基准测试](./benchmarks.md)

:::
