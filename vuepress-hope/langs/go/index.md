---
title: Go
icon: logos:go
order: 4
---

# Go

![Go](https://img.shields.io/badge/Go-1.21-00ADD8?style=flat-square&logo=go)

## 概述

Go（又称 Golang）是由 Google 开发的开源编程语言，于 2009 年首次发布。它结合了 C 语言的高效性和 Python 的易用性，专为云原生时代设计。

## 核心特点

- **简洁高效**：语法简单，编译速度快
- **原生并发**：通过 goroutine 和 channel 实现轻量级并发
- **内存安全**：内置垃圾回收，指针受限
- **静态类型**：编译时类型检查
- **快速编译**：秒级编译大型项目

## 应用领域

| 领域 | 代表项目/框架 |
|------|--------------|
| 云原生 | Docker, Kubernetes, Prometheus |
| 微服务 | gRPC, Go-kit, Go-micro |
| Web 后端 | Gin, Echo, Beego |
| 区块链 | Ethereum, Go-Ethereum |
| 运维工具 | Traefik, Hugo, CockroachDB |

## 学习路径

1. **Go 基础** → 语法、类型、控制流
2. **并发编程** → goroutine、channel、sync 包
3. **Web 开发** → Gin/Echo 框架、gRPC
4. **微服务** → 服务注册、发现、网关
5. **云原生** → Docker、Kubernetes operator

## Hello World

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

## 代码示例

```go
// 并发示例
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, j)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // 发送任务
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // 收集结果
    for a := 1; a <= 5; a++ {
        <-results
    }
}
```

## 结构体与接口

```go
// 结构体
type User struct {
    Name  string
    Email string
    Age   int
}

// 接口
type Speaker interface {
    Speak() string
}

func (u User) Speak() string {
    return fmt.Sprintf("Hi, I'm %s", u.Name)
}
```

## 相关资源

- [Go 官方文档](https://go.dev/doc/)
- [Go by Example](https://gobyexample.com/)
- [Effective Go](https://go.dev/doc/effective_go)

---

::: tip 为什么选择 Go？
Go 是云原生时代的 C 语言，简洁、高效、并发友好，适合构建分布式系统。
:::
