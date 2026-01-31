---
title: Rust
icon: devicon-plain:rust
order: 6
---

# Rust

![Rust](https://img.shields.io/badge/Rust-1.75-000000?style=flat-square&logo=rust)

## 概述

Rust 是一门系统编程语言，由 Mozilla 研究员 Graydon Hoare 于 2006 年开始设计，2010 年开源。它专注于安全、并发和性能。

## 核心特点

- **内存安全**：编译时保证，无需垃圾回收
- **所有权系统**：独特的内存管理机制
- **零开销抽象**：高级特性不影响性能
- ** fearless 并发**：编译器保证线程安全
- **优秀的工具链**：Cargo、rustup、rustfmt

## 应用领域

| 领域 | 代表项目/框架 |
|------|--------------|
| 系统编程 | Redox OS, Tokio |
| WebAssembly | Yew, Actix Web |
| 区块链 | Solana, Polkadot |
| 嵌入式 | embedded-hal, Tock OS |
| CLI 工具 | ripgrep, fd, bat |

## 学习路径

1. **Rust 基础** → 语法、变量、函数
2. **所有权系统** → 所有权、借用、生命周期
3. **结构体与枚举** → 模式匹配、Option/Result
4. **并发编程** → 线程、channel、async/await
5. **项目实战** → CLI 工具、Web 服务

## Hello World

```rust
fn main() {
    println!("Hello, Rust!");
}
```

## 代码示例

```rust
// 所有权与借用
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 的所有权转移到 s2

    // let s3 = s1; // 编译错误！s1 已失效

    let s3 = s2.clone(); // 深拷贝
    println!("{}", s3);

    let len = calculate_length(&s3); // 借用
    println!("Length: {}", len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s 离开作用域，但因为是引用，不释放内存
```

## 模式匹配与 Option

```rust
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Some(result) => println!("Result: {}", result),
        None => println!("Cannot divide by zero"),
    }

    // if let 简化模式匹配
    if let Some(result) = divide(10.0, 0.0) {
        println!("Result: {}", result);
    } else {
        println!("Division failed");
    }
}
```

## 结构体与 Trait

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

trait Summary {
    fn summarize(&self) -> String;
}

impl Summary for Rectangle {
    fn summarize(&self) -> String {
        format!("{} x {} rectangle", self.width, self.height)
    }
}
```

## 相关资源

- [Rust 官方文档](https://www.rust-lang.org/zh-CN/)
- [Rust 程序设计语言](https://kaisery.github.io/trpl-zh-cn/)
- [Rust by Example](https://rustwiki.org/zh-CN/rust-by-example/)

---

::: tip 为什么选择 Rust？
Rust 提供了系统级编程的性能，同时保证了内存安全，是 C/C++ 的现代替代方案。
:::
