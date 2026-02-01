---
title: io 包
icon: ri:database-2-line
order: 2
---

# io 包

`io` 包提供了 I/O 原语的基本接口，是 Go I/O 系统的基础。

## 核心接口

### Reader 接口

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

// 使用示例
func readFromReader(r io.Reader) ([]byte, error) {
    buf := make([]byte, 1024)
    n, err := r.Read(buf)
    if err != nil {
        return nil, err
    }
    return buf[:n], nil
}
```

### Writer 接口

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}

// 使用示例
func writeToWriter(w io.Writer, data []byte) error {
    _, err := w.Write(data)
    return err
}
```

### Closer 接口

```go
type Closer interface {
    Close() error
}

// 使用示例
func closeResource(c io.Closer) {
    err := c.Close()
    if err != nil {
        log.Printf("close error: %v", err)
    }
}
```

### 组合接口

```go
// ReadWriter - 可读可写
type ReadWriter interface {
    Reader
    Writer
}

// ReadCloser - 可读可关闭
type ReadCloser interface {
    Reader
    Closer
}

// WriteCloser - 可写可关闭
type WriteCloser interface {
    Writer
    Closer
}

// Seeker - 可定位
type Seeker interface {
    Seek(offset int64, whence int) (int64, error)
}
```

## 基本操作

### Copy 复制

```go
// io.Copy 从 src 复制到 dst
func copyData(src io.Reader, dst io.Writer) (int64, error) {
    return io.Copy(dst, src)
}

// 使用示例
func copyFile(src, dst string) error {
    source, err := os.Open(src)
    if err != nil {
        return err
    }
    defer source.Close()

    destination, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer destination.Close()

    _, err = io.Copy(destination, source)
    return err
}
```

### CopyN 限制复制

```go
// io.CopyN 复制 n 个字节
func copyLimited(src io.Reader, dst io.Writer, n int64) (int64, error) {
    return io.CopyN(dst, src, n)
}

// 使用示例
func copyFirst100Bytes(src io.Reader, dst io.Writer) (int64, error) {
    return io.CopyN(dst, src, 100)
}
```

### CopyBuffer 缓冲复制

```go
// io.CopyBuffer 使用指定的缓冲区复制
func copyWithBuffer(src io.Reader, dst io.Writer) (int64, error) {
    buf := make([]byte, 32*1024) // 32KB 缓冲
    return io.CopyBuffer(dst, src, buf)
}
```

## 管道和管道

### Pipe

```go
// io.Pipe 创建同步的内存管道
func usePipe() {
    pr, pw := io.Pipe()

    // 写入
    go func() {
        defer pw.Close()
        pw.Write([]byte("Hello, Pipe!"))
    }()

    // 读取
    data := make([]byte, 20)
    n, err := pr.Read(data)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Read %d bytes: %s\n", n, data[:n])
}
```

### PipeWriter

```go
type PipeWriter struct {
    // 包含过滤后的字段或未导出的字段
}

func (w *PipeWriter) Write(data []byte) (n int, err error) {
    // 写入实现
    return
}

func (w *PipeWriter) Close() error {
    // 关闭实现
    return nil
}
```

### PipeReader

```go
type PipeReader struct {
    // 包含过滤后的字段或未导出的字段
}

func (r *PipeReader) Read(data []byte) (n int, err error) {
    // 读取实现
    return
}

func (r *PipeReader) Close() error {
    // 关闭实现
    return nil
}
```

## 限制读取

### LimitedReader

```go
// io.LimitReader 限制读取的字节数
func limitReading(r io.Reader) io.Reader {
    return io.LimitReader(r, 1000) // 最多读取 1000 字节
}

// 使用示例
func readLimited(src io.Reader) {
    limited := io.LimitReader(src, 1024)
    data, err := io.ReadAll(limited)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Read %d bytes\n", len(data))
}
```

### SectionReader

```go
// io.NewSectionReader 从某一部分读取
func readSection(r io.ReaderAt) io.Reader {
    return io.NewSectionReader(r, 100, 200) // 从偏移 100 开始，读取 200 字节
}

// 使用示例
func readPartialFile(filename string) {
    file, err := os.Open(filename)
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()

    // 读取文件的某一部分
    section := io.NewSectionReader(file, 0, 1024)
    data, err := io.ReadAll(section)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Read first 1KB: %d bytes\n", len(data))
}
```

## TeeReader

### 分流读取

```go
// io.TeeReader 写入到 w 同时返回 r 的内容
func teeReader(r io.Reader, w io.Writer) io.Reader {
    return io.TeeReader(r, w)
}

// 使用示例：同时读取和写入
func readAndWrite(src io.Reader, dst io.Writer) {
    tee := io.TeeReader(src, os.Stdout)

    // 读取并写入 stdout
    data, err := io.ReadAll(tee)
    if err != nil {
        log.Fatal(err)
    }

    // 同时写入目标
    dst.Write(data)
}
```

### 多重输出

```go
// MultiWriter 写入到多个 Writer
func multiWrite(outputs ...io.Writer) io.Writer {
    return io.MultiWriter(outputs...)
}

// 使用示例
func writeToMultiple(data []byte) {
    // 创建多个输出
    var buf1, buf2 bytes.Buffer
    file, _ := os.Create("output.log")

    // 同时写入所有输出
    writer := io.MultiWriter(&buf1, &buf2, file)
    writer.Write(data)

    fmt.Println("Buf1:", buf1.String())
    fmt.Println("Buf2:", buf2.String())
}
```

## 读取器工具

### ReadAll

```go
// io.ReadAll 读取所有数据直到 EOF
func readAllData(r io.Reader) ([]byte, error) {
    return io.ReadAll(r)
}

// 使用示例
func readFullFile(filename string) ([]byte, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    return io.ReadAll(file)
}
```

### ReadAtLeast

```go
// io.ReadAtLeast 至少读取 min 个字节
func readAtLeast(r io.Reader, buf []byte, min int) (int, error) {
    return io.ReadAtLeast(r, buf, min)
}

// 使用示例
func ensureRead(r io.Reader, size int) ([]byte, error) {
    buf := make([]byte, size)
    _, err := io.ReadAtLeast(r, buf, size)
    if err != nil {
        return nil, err
    }
    return buf, nil
}
```

### ReadFull

```go
// io.ReadFull 读取恰好 len(buf) 个字节
func readFull(r io.Reader, size int) ([]byte, error) {
    buf := make([]byte, size)
    _, err := io.ReadFull(r, buf)
    if err != nil {
        return nil, err
    }
    return buf, nil
}
```

## 写入器工具

### WriteString

```go
// io.WriteString 写入字符串
func writeString(w io.Writer, s string) (int, error) {
    return io.WriteString(w, s)
}

// 使用示例
func writeLog(w io.Writer, message string) error {
    _, err := io.WriteString(w, message+"\n")
    return err
}
```

## 字节和字符

### ByteReader

```go
// 读取单个字节
type ByteReader interface {
    ReadByte() (byte, error)
}

// 使用示例
func readBytes(r io.ByteReader) {
    for {
        b, err := r.ReadByte()
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("Byte: %c\n", b)
    }
}
```

### RuneReader

```go
// 读取单个 Unicode 字符
type RuneReader interface {
    ReadRune() (r rune, size int, err error)
}

// 使用示例
func readRunes(r io.RuneReader) {
    for {
        r, size, err := r.ReadRune()
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("Rune: %c (size: %d)\n", r, size)
    }
}
```

## 最佳实践

::: tip 使用建议

1. **使用 defer** - 确保资源被关闭
2. **检查错误** - 始终检查 I/O 错误
3. **缓冲区大小** - 选择合适的缓冲区大小
4. **Copy 优先** - 优先使用 io.Copy
5. **组合接口** - 利用组合接口的灵活性

:::

```go
// ✅ 好的模式
func goodIO(r io.Reader, w io.Writer) error {
    defer r.Close()  // 确保 r 被关闭

    // 使用 io.Copy 而非手动读取
    _, err := io.Copy(w, r)
    return err
}

// ❌ 不好的模式
func badIO(r io.Reader, w io.Writer) error {
    // 忘记关闭资源
    buf := make([]byte, 1024)
    _, err := r.Read(buf)
    // ...
    return err
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Reader** - `Read(p []byte)` 读取接口 |
| **Writer** - `Write(p []byte)` 写入接口 |
| **Closer** - `Close()` 关闭接口 |
| **Copy** - 高效复制数据 |
| **LimitReader** - 限制读取量 |
| **TeeReader** - 分流读取 |

::: v-pre

[IO总览](./README.md) → [文件操作](./files.md)

:::
