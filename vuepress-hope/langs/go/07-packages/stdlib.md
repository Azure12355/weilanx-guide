---
title: 标准库
icon: ri:book-2-line
order: 3
---

# 标准库

Go 标准库提供了丰富的功能，了解常用包可以大大提高开发效率。

## 核心包

### fmt 包

```go
import "fmt"

// 格式化输出
fmt.Println("Hello, World!")
fmt.Printf("Value: %d\n", 42)
fmt.Sprintf("Name: %s, Age: %d", "Alice", 30)

// 格式化动词
// %v - 默认格式
// %+v - 带字段名的结构体
// %T - 类型
// %t - 布尔值
// %d - 十进制整数
// %f - 浮点数
// %s - 字符串
// %p - 指针地址
```

### strings 包

```go
import "strings"

// 字符串操作
strings.Contains("hello", "ell")  // true
strings.HasPrefix("hello", "he")  // true
strings.HasSuffix("hello", "lo")  // true
strings.Index("hello", "l")        // 2
strings.Join([]string{"a", "b"}, ",")  // "a, b"
strings.Split("a,b,c", ",")       // ["a", "b", "c"]
strings.ToUpper("hello")          // "HELLO"
strings.ToLower("HELLO")          // "hello"
strings.Trim("  hello  ")         // "hello"
strings.Replace("hello", "l", "L", -1)  // "HeLLo"
```

### strconv 包

```go
import "strconv"

// 字符串转换
strconv.Atoi("123")           // 123, nil
strconv.Itoa(123)             // "123"
strconv.ParseFloat("3.14", 64)  // 3.14, nil
strconv.FormatFloat(3.14, 'f', 2, 64)  // "3.14"
strconv.ParseBool("true")     // true, nil
strconv.FormatBool(true)      // "true"
```

## 容器包

### sync 包

```go
import "sync"

// 互斥锁
var mu sync.Mutex
mu.Lock()
// 临界区
mu.Unlock()

// 读写锁
var rwMu sync.RWMutex
rwMu.RLock()  // 读锁
// 读取
rwMu.RUnlock()

rwMu.Lock()   // 写锁
// 写入
rwMu.Unlock()

// 等待组
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    // 并发任务
}()
wg.Wait()
```

### context 包

```go
import "context"

// 创建 context
ctx := context.Background()
ctx := context.TODO()

// 带超时的 context
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()

// 带取消的 context
ctx, cancel := context.WithCancel(ctx)
cancel()  // 取消

// 检查取消
select {
case <-ctx.Done():
    fmt.Println("Canceled:", ctx.Err())
default:
    // 继续执行
}
```

## I/O 包

### io 包

```go
import "io"

// Reader 接口
type Reader interface {
    Read(p []byte) (n int, err error)
}

// Writer 接口
type Writer interface {
    Write(p []byte) (n int, err error)
}

// Copy 复制
io.Copy(dst, src)

// ReadAll 读取全部
data, err := io.ReadAll(reader)
```

### bufio 包

```go
import "bufio"

// 缓冲读取
scanner := bufio.NewScanner(reader)
for scanner.Scan() {
    line := scanner.Text()
    // 处理行
}

// 缓冲写入
writer := bufio.NewWriter(writer)
writer.WriteString("Hello\n")
writer.Flush()
```

### os 包

```go
import "os"

// 文件操作
file, err := os.Open("file.txt")
file, err := os.Create("file.txt")
file, err := os.OpenFile("file.txt", os.O_RDWR|os.O_CREATE, 0644)

// 读写
data := make([]byte, 1024)
n, err := file.Read(data)
n, err := file.Write(data)

// 关闭
file.Close()

// 文件信息
info, err := os.Stat("file.txt")
size := info.Size()
mode := info.Mode()
```

## 网络包

### net/http 包

```go
import "net/http"

// HTTP 客户端
resp, err := http.Get("https://example.com")
defer resp.Body.Close()
body, err := io.ReadAll(resp.Body)

// HTTP POST
resp, err := http.Post("https://example.com", "application/json", body)

// HTTP 服务器
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
})
http.ListenAndServe(":8080", nil)
```

### net/url 包

```go
import "net/url"

// 解析 URL
u, err := url.Parse("https://example.com/path?query=value")
fmt.Println(u.Scheme)   // "https"
fmt.Println(u.Host)     // "example.com"
fmt.Println(u.Path)     // "/path"
fmt.Println(u.Query())  // "map[query:value]"

// 构建 URL
u := &url.URL{
    Scheme: "https",
    Host:   "example.com",
    Path:   "/path",
}
fmt.Println(u.String())  // "https://example.com/path"
```

## 编码包

### encoding/json 包

```go
import "encoding/json"

// JSON 编码
data, err := json.Marshal(obj)

// JSON 解码
err := json.Unmarshal(data, &obj)

// 流式编码
encoder := json.NewEncoder(writer)
encoder.Encode(obj)

// 流式解码
decoder := json.NewDecoder(reader)
decoder.Decode(&obj)
```

### encoding/xml 包

```go
import "encoding/xml"

// XML 编码
data, err := xml.Marshal(obj)

// XML 解码
err := xml.Unmarshal(data, &obj)

// 流式操作
encoder := xml.NewEncoder(writer)
decoder := xml.NewDecoder(reader)
```

## 时间包

### time 包

```go
import "time"

// 获取当前时间
now := time.Now()

// 格式化时间
fmt.Println(now.Format("2006-01-02 15:04:05"))
fmt.Println(now.Format(time.RFC3339))

// 解析时间
t, err := time.Parse("2006-01-02", "2024-01-01")

// 时间计算
future := now.Add(24 * time.Hour)
duration := future.Sub(now)

// 定时器
timer := time.NewTimer(time.Second)
<-timer.C

// 打点
ticker := time.NewTicker(time.Second)
for range ticker.C {
    // 每秒执行
}
```

## 数据结构包

### sort 包

```go
import "sort"

// 排序切片
nums := []int{3, 1, 4, 1, 5}
sort.Ints(nums)

// 排序字符串
strs := []string{"banana", "apple", "cherry"}
sort.Strings(strs)

// 自定义排序
type Person struct {
    Name string
    Age  int
}
people := []Person{{"Alice", 30}, {"Bob", 25}}
sort.Slice(people, func(i, j int) bool {
    return people[i].Age < people[j].Age
})
```

### container/list 包

```go
import "container/list"

// 双向链表
l := list.New()
l.PushBack(1)
l.PushFront(0)

// 遍历
for e := l.Front(); e != nil; e = e.Next() {
    fmt.Println(e.Value)
}

// 删除
l.Remove(e)
```

## 数学包

### math 包

```go
import "math"

// 数学函数
math.Abs(-1)       // 1
math.Floor(3.7)     // 3
math.Ceil(3.2)      // 4
math.Round(3.5)     // 4
math.Trunc(3.7)     // 3
math.Sqrt(16)       // 4
math.Pow(2, 3)      // 8
math.Log(10)        // 2.302585
math.Log10(100)     // 2

// 常量
math.Pi             // 3.141592
math.E              // 2.718281
math.Phi            // 1.618033
```

## 总结

| 包 | 功能 |
|------|------|
| **fmt** - 格式化 I/O |
| **strings** - 字符串操作 |
| **strconv** - 字符串转换 |
| **sync** - 并发同步 |
| **context** - 上下文管理 |
| **io** - 基础 I/O |
| **bufio** - 缓冲 I/O |
| **os** - 操作系统接口 |
| **net/http** - HTTP 客户端/服务器 |
| **encoding/json** - JSON 编解码 |
| **time** - 时间日期 |
| **sort** - 排序 |
| **math** - 数学函数 |

::: v-pre

[导入导出](./import-export.md) → [依赖管理](./dependency.md)

:::
