---
title: IO 总览
icon: ri:file-text-line
order: 1
---

# 文件与 IO

Go 的 I/O 操作围绕 `io` 包的接口设计，提供了统一的读写抽象。

## 章节导航

```mermaid
mindmap
  root((文件与 IO))
    io 包
      Reader 接口
      Writer 接口
      Copy 与 Pipe
    文件操作
      读写文件
      文件属性
      目录操作
      路径处理
    bufio 包
      缓冲读写
      Scanner
      Writer
    格式化 IO
      fmt 包
      格式化动词
      自定义格式
    文件系统
      os 包
      filepath 包
      ioutil 包
    最佳实践
      资源清理
      错误处理
      性能优化
```

## 知识体系

### IO 接口层次

```mermaid
graph TD
    A[io.Reader] --> B[io.ReaderAt]
    A --> C[io.ByteReader]
    A --> D[io.RuneReader]

    E[io.Writer] --> F[io.WriterAt]
    E --> G[io.ByteWriter]
    E --> H[io.StringWriter]

    I[io.ReadWriter] --> A
    I --> E

    J[io.ReadCloser] --> A
    J --> K[io.Closer]

    L[io.WriteCloser] --> E
    L --> K

    style A fill:#c8e6c9
    style E fill:#fff9c4
    style I fill:#ffccbc
```

### 文件系统

```mermaid
graph TD
    A[os.File] --> B[文件]
    A --> C[目录]
    A --> D[设备]

    B --> E[Read/Write]
    C --> F[Readdir]
    D --> G[Stream]

    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style F fill:#fff9c4
    style G fill:#ffccbc
```

## 学习路线

```mermaid
graph LR
    A[io 接口] --> B[文件操作]
    B --> C[bufio]
    C --> D[格式化 IO]
    D --> E[文件系统]
    E --> F[最佳实践]

    style A fill:#c8e6c9
    style B fill:#fff9c4
    style C fill:#ffccbc
    style D fill:#f8bbd9
    style E fill:#d1c4e9
    style F fill:#c5cae9
```

## 快速预览

### 读取文件

```go
// 简单读取
data, err := os.ReadFile("config.json")
if err != nil {
    log.Fatal(err)
}
fmt.Println(string(data))
```

### 写入文件

```go
// 简单写入
err := os.WriteFile("output.txt", []byte("Hello"), 0644)
if err != nil {
    log.Fatal(err)
}
```

### 流式处理

```go
// 打开文件
file, err := os.Open("data.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 读取内容
scanner := bufio.NewScanner(file)
for scanner.Scan() {
    fmt.Println(scanner.Text())
}
```

## 核心概念

### Reader 接口

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

// Read 最多读取 len(p) 字节到 p
// 返回读取的字节数 n 和遇到的错误
```

### Writer 接口

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}

// Write 从 p 写入数据
// 返回写入的字节数 n 和遇到的错误
```

### Closer 接口

```go
type Closer interface {
    Close() error
}

// Close 关闭资源并释放
```

## 实践建议

::: tip 学习建议

1. **理解接口** - 掌握 Reader/Writer 接口
2. **使用 defer** - 确保资源被正确关闭
3. **缓冲 I/O** - 使用 bufio 提高性能
4. **错误处理** - 始终检查和处理错误
5. **路径处理** - 使用 filepath 而非硬编码路径

:::

## 学习检查

完成本章节学习后，您应该能够：

- [ ] 使用 io.Reader 和 io.Writer 接口
- [ ] 读写文件和目录
- [ ] 使用 bufio 进行缓冲 I/O
- [ ] 格式化输入输出
- [ ] 处理文件路径
- [ ] 管理文件权限和属性
- [ ] 避免常见的 I/O 错误

## 下一步

让我们开始深入学习文件与 IO 的各个部分！

::: v-pre

[io 包](./io-package.md) → [文件操作](./files.md) → [bufio](./bufio.md) → [格式化IO](./fmt-io.md) → [文件系统](./filesystem.md) → [最佳实践](./io-best-practices.md)

:::
