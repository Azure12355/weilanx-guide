---
title: 基准测试
icon: ri:timer-line
order: 7
---

# 基准测试

基准测试（Benchmark）用于测量代码性能，帮助优化关键路径。

## Benchmark 基础

### 基本 Benchmark

```go
// Benchmark 函数以 Benchmark 开头，接收 *testing.B
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}

// b.N 是基准测试框架自动调整的迭代次数
// 运行：go test -bench=.
```

### Benchmark 结构

```go
// Benchmark 函数必须：
// 1. 以 Benchmark 开头
// 2. 接收 *testing.B 参数
// 3. 在 _test.go 文件中
// 4. 使用 for 循环执行 b.N 次

func BenchmarkFunction(b *testing.B) {
    // Setup 代码（不测量）
    data := prepareData()

    // 重置计时器
    b.ResetTimer()

    for i := 0; i < b.N; i++ {
        // 被测代码
        process(data)
    }
}
```

## 运行 Benchmark

### 基本命令

```bash
# 运行所有 benchmark
go test -bench=.

# 运行指定 benchmark
go test -bench=BenchmarkAdd

# 运行匹配的 benchmark
go test -bench="Add|Subtract"

# 指定运行时间
go test -bench=. -benchtime=5s

# 指定迭代次数
go test -bench=. -benchtime=1000x

# 内存统计
go test -bench=. -benchmem

# 禁用 CPU 优化
go test -bench=. -gcflags=-N

# 详细输出
go test -bench=. -v
```

### 输出解读

```
BenchmarkAdd-8          1000000000          0.256 ns/op
BenchmarkSubtract-8      500000000          0.512 ns/op

# 格式：BenchmarkName-CPUs  迭代次数  每次操作耗时
# -8 表示使用 8 个 CPU
```

## Benchmark 计时

### 计时控制

```go
func BenchmarkWithTimer(b *testing.B) {
    // Setup（不计时）
    data := prepareData()

    // 停止计时
    b.StopTimer()

    // 执行耗时的 setup（不计时）
    expensiveSetup(data)

    // 恢复计时
    b.StartTimer()

    for i := 0; i < b.N; i++ {
        process(data)
    }
}
```

### 重置计时器

```go
func BenchmarkResetTimer(b *testing.B) {
    for i := 0; i < b.N; i++ {
        // 停止计时
        b.StopTimer()

        // Setup（不计时）
        data := prepareData()

        // 重置并开始计时
        b.ResetTimer()

        // 被测代码
        process(data)

        // 清理（不计时）
        b.StopTimer()
        cleanup(data)
    }
}
```

### 暂停计时

```go
func BenchmarkPauseTimer(b *testing.B) {
    data := prepareData()

    b.ResetTimer()

    for i := 0; i < b.N; i++ {
        // 暂停计时
        b.Pause()

        // 不计时的操作
        logOperation(i)

        // 恢复计时
        b.Resume()

        // 被测代码
        process(data)
    }
}
```

## 内存 Benchmark

### 内存分配

```go
func BenchmarkMemory(b *testing.B) {
    for i := 0; i < b.N; i++ {
        // 分配内存
        data := make([]byte, 1024)
        _ = data
    }
}

// 输出示例：
// BenchmarkMemory-8    1000000    1024 ns/op    1024 B/op    1 allocs/op
```

### 报告内存

```go
func BenchmarkReportAllocs(b *testing.B) {
    b.ReportAllocs()

    for i := 0; i < b.N; i++ {
        // 代码
        data := make([]byte, 1024)
        _ = data
    }
}
```

### 比较内存

```go
func BenchmarkSliceGrowth(b *testing.B) {
    b.Run("without-capacity", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var data []int
            for j := 0; j < 1000; j++ {
                data = append(data, j)
            }
        }
    })

    b.Run("with-capacity", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            data := make([]int, 0, 1000)
            for j := 0; j < 1000; j++ {
                data = append(data, j)
            }
        }
    })
}
```

## 并行 Benchmark

### 基本并行

```go
func BenchmarkParallel(b *testing.B) {
    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            // 并行执行的代码
            process()
        }
    })
}
```

### 并行计数器

```go
func BenchmarkParallelCounter(b *testing.B) {
    var counter int64

    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            atomic.AddInt64(&counter, 1)
        }
    })
}
```

## 子 Benchmark

### 分组测试

```go
func BenchmarkOperations(b *testing.B) {
    b.Run("Add", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            Add(2, 3)
        }
    })

    b.Run("Subtract", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            Subtract(5, 3)
        }
    })

    b.Run("Multiply", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            Multiply(2, 3)
        }
    })
}

// 输出：
// BenchmarkOperations/Add-8       1000000000    0.256 ns/op
// BenchmarkOperations/Subtract-8   500000000     0.512 ns/op
// BenchmarkOperations/Multiply-8   200000000     0.768 ns/op
```

## 实战示例

### 字符串拼接

```go
func BenchmarkStringConcat(b *testing.B) {
    b.Run("plus", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            s := ""
            for j := 0; j < 100; j++ {
                s += "x"
            }
            _ = s
        }
    })

    b.Run("builder", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var builder strings.Builder
            for j := 0; j < 100; j++ {
                builder.WriteString("x")
            }
            _ = builder.String()
        }
    })

    b.Run("buffer", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var buffer bytes.Buffer
            for j := 0; j < 100; j++ {
                buffer.WriteString("x")
            }
            _ = buffer.String()
        }
    })
}
```

### Map 操作

```go
func BenchmarkMapOperations(b *testing.B) {
    m := map[string]int{
        "key1": 1,
        "key2": 2,
        "key3": 3,
    }

    b.Run("read", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _ = m["key1"]
        }
    })

    b.Run("write", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            m[fmt.Sprintf("key%d", i)] = i
        }
    })

    b.Run("delete", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            delete(m, "key1")
            m["key1"] = 1
        }
    })
}
```

### JSON 序列化

```go
type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func BenchmarkJSON(b *testing.B) {
    user := User{ID: 1, Name: "Alice", Email: "alice@example.com"}

    b.Run("marshal", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _, err := json.Marshal(&user)
            if err != nil {
                b.Fatal(err)
            }
        }
    })

    data, _ := json.Marshal(&user)

    b.Run("unmarshal", func(b *testing.B) {
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

## 性能比较

### 比较实现

```go
func BenchmarkFibonacci(b *testing.B) {
    b.Run("recursive", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            fibRecursive(20)
        }
    })

    b.Run("iterative", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            fibIterative(20)
        }
    })

    b.Run("memoized", func(b *testing.B) {
        cache := make(map[int]int)
        for i := 0; i < b.N; i++ {
            fibMemoized(20, cache)
        }
    })
}

func fibRecursive(n int) int {
    if n <= 1 {
        return n
    }
    return fibRecursive(n-1) + fibRecursive(n-2)
}

func fibIterative(n int) int {
    a, b := 0, 1
    for i := 0; i < n; i++ {
        a, b = b, a+b
    }
    return a
}

func fibMemoized(n int, cache map[int]int) int {
    if n <= 1 {
        return n
    }
    if val, ok := cache[n]; ok {
        return val
    }
    cache[n] = fibMemoized(n-1, cache) + fibMemoized(n-2, cache)
    return cache[n]
}
```

## Benchmark 技巧

### 避免优化

```go
// ❌ 错误：编译器优化掉循环
func BadBenchmark(b *testing.B) {
    for i := 0; i < b.N; i++ {
        compute()
    }
}

// ✅ 正确：使用结果
func GoodBenchmark(b *testing.B) {
    var result int
    for i := 0; i < b.N; i++ {
        result = compute()
    }
    _ = result  // 使用结果避免优化
}
```

### 预热

```go
func BenchmarkWithWarmup(b *testing.B) {
    // 预热（不测量）
    for i := 0; i < 1000; i++ {
        compute()
    }

    // 重置计时器
    b.ResetTimer()

    // 正式测量
    for i := 0; i < b.N; i++ {
        compute()
    }
}
```

## 最佳实践

::: tip 使用建议

1. **隔离测试** - 每个 benchmark 独立运行
2. **稳定环境** - 在稳定的环境中运行
3. **多次运行** - 多次运行取平均值
4. **比较相对** - 关注相对差异而非绝对值
5. **profile 辅助** - 使用 pprof 分析热点

:::

```go
// ✅ 好的 benchmark
func goodBenchmark(b *testing.B) {
    data := prepareData()
    b.ResetTimer()

    for i := 0; i < b.N; i++ {
        result := process(data)
        if result == nil {
            b.Fatal("unexpected nil result")
        }
    }
}

// ❌ 不好的 benchmark
func badBenchmark(b *testing.B) {
    for i := 0; i < b.N; i++ {
        data := prepareData()  // 包含 setup
        result := process(data)
        _ = result
    }
}
```

## 工具集成

### pprof 分析

```bash
# CPU profiling
go test -bench=. -cpuprofile=cpu.prof
go tool pprof cpu.prof

# Memory profiling
go test -bench=. -memprofile=mem.prof
go tool pprof mem.prof

# 生成可视化
go tool pprof -http=:8080 cpu.prof
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Benchmark** - 以 `Benchmark` 开头 |
| **b.N** - 自动调整的迭代次数 |
| **ResetTimer** - 重置计时器 |
| **ReportAllocs** - 报告内存分配 |
| **RunParallel** - 并行执行 |
| **benchmem** - 内存统计标志 |

::: v-pre

[Table驱动](./table-driven.md) → [包管理](/langs/go/07-packages/)

:::
