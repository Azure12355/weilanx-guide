---
title: 基准测试
icon: ri:timer-line
order: 5
---

# 基准测试

基准测试（Benchmark）是验证性能优化效果的关键工具，Go 内置了强大的基准测试支持。

## 基础基准测试

### 编写基准测试

```go
// 文件名: example_test.go
package example

import "testing"

// 基本基准测试
func BenchmarkFunction(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Function()
    }
}

func Function() {
    // 被测试的代码
}
```

### 运行基准测试

```bash
# 运行所有基准测试
go test -bench=.

# 运行特定基准测试
go test -bench=BenchmarkFunction

# 运行多次提高准确性
go test -bench=. -count=5

# 指定运行时间
go test -bench=. -benchtime=5s

# 包含内存统计
go test -bench=. -benchmem

# CPU profile
go test -bench=. -cpuprofile=cpu.prof

# 内存 profile
go test -bench=. -memprofile=mem.prof
```

### 基准测试结果

```
BenchmarkFunction-8    1000000    1234 ns/op    1024 B/op    10 allocs/op

字段说明:
- BenchmarkFunction-8  函数名和使用的 CPU 核心数
- 1000000             运行次数
- 1234 ns/op         每次操作耗时（纳秒）
- 1024 B/op          每次操作分配的内存
- 10 allocs/op       每次操作的分配次数
```

## 高级基准测试

### 子测试

```go
func BenchmarkOperations(b *testing.B) {
    b.Run("Add", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _ = 1 + 1
        }
    })

    b.Run("Multiply", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _ = 2 * 3
        }
    })

    b.Run("Divide", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _ = 10 / 2
        }
    })
}
```

### 并行基准测试

```go
func BenchmarkParallel(b *testing.B) {
    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            // 并发执行的代码
            process()
        }
    })
}

func process() {
    // 模拟处理
}
```

### 设置重置

```go
func BenchmarkWithSetup(b *testing.B) {
    // 设置
    data := setupData()
    b.ResetTimer()  // 重置计时器

    for i := 0; i < b.N; i++ {
        // 被测试的代码
        process(data)
    }

    b.StopTimer()  // 停止计时
    teardown(data) // 清理
}

func setupData() []byte {
    return make([]byte, 1024)
}

func teardown(data []byte) {
    // 清理资源
}
```

### 暂停恢复

```go
func BenchmarkWithPause(b *testing.B) {
    for i := 0; i < b.N; i++ {
        b.StopTimer()
        data := prepareData()  // 不计时的准备工作
        b.StartTimer()

        process(data)  // 计时的测试代码

        b.StopTimer()
        cleanup(data)   // 不计时的清理工作
        b.StartTimer()
    }
}
```

## 比较基准测试

### 比较实现

```go
func BenchmarkCompare(b *testing.B) {
    data := generateTestData()

    b.Run("OldImplementation", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            OldImplementation(data)
        }
    })

    b.Run("NewImplementation", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            NewImplementation(data)
        }
    })
}

func generateTestData() []int {
    return make([]int, 1000)
}

func OldImplementation(data []int) int {
    sum := 0
    for _, v := range data {
        sum += v
    }
    return sum
}

func NewImplementation(data []int) int {
    var sum int
    for _, v := range data {
        sum += v
    }
    return sum
}
```

### 基准测试比较

```bash
# 使用 benchstat 比较结果
go install golang.org/x/perf/cmd/benchstat@latest

# 保存基准结果
go test -bench=. -count=10 > old.txt
# 修改代码后
go test -bench=. -count=10 > new.txt

# 比较结果
benchstat old.txt new.txt

# 输出示例:
# name          old time/op  new time/op  delta
# Process-8      123ns ± 2%   100ns ± 1%  -18.75%  (p=0.000 n=10+10)
```

## 内存基准测试

### 分配测试

```go
func BenchmarkAllocations(b *testing.B) {
    for i := 0; i < b.N; i++ {
        // 每次迭代都会分配
        data := make([]byte, 1024)
        _ = data
    }
}

func BenchmarkNoAllocations(b *testing.B) {
    for i := 0; i < b.N; i++ {
        // 复用缓冲区
        processUsingPool()
    }
}

// 报告每次迭代的分配
func BenchmarkReportAlloc(b *testing.B) {
    b.ReportAllocs()

    for i := 0; i < b.N; i++ {
        _ = make([]byte, 1024)
    }
}
```

### 内存统计

```go
func BenchmarkMemoryStats(b *testing.B) {
    var m runtime.MemStats

    b.Run("WithAlloc", func(b *testing.B) {
        runtime.ReadMemStats(&m)
        before := m.Alloc

        for i := 0; i < b.N; i++ {
            _ = make([]byte, 1024)
        }

        runtime.ReadMemStats(&m)
        after := m.Alloc

        b.ReportMetric(float64(after-before)/float64(b.N), "B/op")
    })
}
```

## 性能回归测试

### 基准测试文件

```go
package example

import (
    "testing"
    "time"
)

// 性能基线测试
func BenchmarkPerformanceBaseline(b *testing.B) {
    data := generateLargeDataset()

    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        result := ProcessData(data)
        if result == nil {
            b.Fatal("unexpected nil result")
        }
    }
}

func generateLargeDataset() []int {
    return make([]int, 100000)
}

func ProcessData(data []int) []int {
    // 处理数据
    result := make([]int, len(data))
    copy(result, data)
    return result
}
```

### 回归检测

```bash
# 保存基线
go test -bench=BenchmarkPerformanceBaseline -count=10 > baseline.txt

# 修改代码后重新测试
go test -bench=BenchmarkPerformanceBaseline -count=10 > current.txt

# 比较是否有性能回归
benchstat baseline.txt current.txt

# 如果性能下降超过阈值，CI 应该失败
```

## 实用基准测试

### 字符串拼接

```go
func BenchmarkStringConcat(b *testing.B) {
    parts := []string{"a", "b", "c", "d", "e"}

    b.Run("Plus", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            result := ""
            for _, p := range parts {
                result += p
            }
            _ = result
        }
    })

    b.Run("Builder", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var builder strings.Builder
            for _, p := range parts {
                builder.WriteString(p)
            }
            _ = builder.String()
        }
    })

    b.Run("Buffer", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var buffer bytes.Buffer
            for _, p := range parts {
                buffer.WriteString(p)
            }
            _ = buffer.String()
        }
    })
}
```

### map 操作

```go
func BenchmarkMapOperations(b *testing.B) {
    m := make(map[int]int)
    for i := 0; i < 1000; i++ {
        m[i] = i
    }

    b.Run("Lookup", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _ = m[i%1000]
        }
    })

    b.Run("Insert", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            m[i] = i
        }
    })

    b.Run("Delete", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            delete(m, i%1000)
        }
    })
}
```

### JSON 编解码

```go
type User struct {
    Name  string `json:"name"`
    Email string `json:"email"`
    Age   int    `json:"age"`
}

func BenchmarkJSON(b *testing.B) {
    user := User{Name: "Alice", Email: "alice@example.com", Age: 25}

    b.Run("Marshal", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _, err := json.Marshal(user)
            if err != nil {
                b.Fatal(err)
            }
        }
    })

    data, _ := json.Marshal(user)

    b.Run("Unmarshal", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var u User
            err := json.Unmarshal(data, &u)
            if err != nil {
                b.Fatal(err)
            }
        }
    })
}
```

### 并发操作

```go
func BenchmarkConcurrency(b *testing.B) {
    data := make([]int, 1000)

    b.Run("Sequential", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            processSequential(data)
        }
    })

    b.Run("Parallel", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            processParallel(data)
        }
    })
}

func processSequential(data []int) {
    for _, v := range data {
        _ = v * 2
    }
}

func processParallel(data []int) {
    var wg sync.WaitGroup
    for _, v := range data {
        wg.Add(1)
        go func(val int) {
            defer wg.Done()
            _ = val * 2
        }(v)
    }
    wg.Wait()
}
```

## 基准测试最佳实践

### 重置定时器

```go
func BenchmarkWithProperReset(b *testing.B) {
    data := make([]byte, 1024*1024)  // 1MB

    // 准备工作
    b.ResetTimer()

    for i := 0; i < b.N; i++ {
        // 只测量核心操作
        process(data)
    }
}
```

### 报告指标

```go
func BenchmarkCustomMetrics(b *testing.B) {
    b.Run("Operation", func(b *testing.B) {
        var count int

        for i := 0; i < b.N; i++ {
            count += doOperation()
        }

        // 报告自定义指标
        b.ReportMetric(float64(count)/float64(b.N), "ops/op")
    })
}

func doOperation() int {
    return 42
}
```

### 跳过短测试

```go
func BenchmarkLongRunning(b *testing.B) {
    if testing.Short() {
        b.Skip("skipping long-running benchmark in short mode")
    }

    for i := 0; i < b.N; i++ {
        longRunningOperation()
    }
}

func longRunningOperation() {
    time.Sleep(100 * time.Millisecond)
}
```

## 基准测试分析

### 使用 pprof

```bash
# 生成 CPU profile
go test -bench=. -cpuprofile=cpu.prof

# 分析 CPU profile
go tool pprof cpu.prof

# 生成内存 profile
go test -bench=. -memprofile=mem.prof

# 分析内存 profile
go tool pprof mem.prof
```

### 可视化

```bash
# 生成火焰图
go tool pprof -http=:8080 cpu.prof

# 使用 benchstat
go test -bench=. -count=10 | tee results.txt
benchstat results.txt
```

## 最佳实践

::: tip 基准测试建议

1. **环境稳定** - 在相同环境下运行
2. **多次运行** - 减少偶然性
3. **比较相对** - 使用 benchstat 比较
4. **测试真实** - 模拟实际使用场景
5. **版本控制** - 跟踪性能变化

:::

```go
// ✅ 好的模式
func goodBenchmark(b *testing.B) {
    // 准备数据
    data := prepareTestData()
    b.ResetTimer()  // 重置计时器

    for i := 0; i < b.N; i++ {
        // 只测量核心操作
        process(data)
    }
}

// ❌ 不好的模式
func badBenchmark(b *testing.B) {
    for i := 0; i < b.N; i++ {
        // 每次都准备数据，影响结果
        data := prepareTestData()
        process(data)
    }
}
```

## 总结

| 技术 | 关键点 |
|------|--------|
| **b.N** - 迭代次数由框架控制 |
| **ResetTimer** - 重置计时器 |
| **ReportAllocs** - 报告内存分配 |
| **RunParallel** - 并发测试 |
| **benchstat** - 比较结果 |

::: v-pre

[优化技巧](./optimization.md) → [工程实践](/langs/go/11-engineering/)

:::
