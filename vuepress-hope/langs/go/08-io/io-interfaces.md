---
title: IO接口
icon: ri:interface-line
order: 5
---

# IO接口

Go 的 I/O 系统基于接口设计，理解这些接口对于编写灵活的代码至关重要。

## 核心接口

### Reader 接口

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

// 实现示例
type StringReader struct {
    data string
    pos  int
}

func (r *StringReader) Read(p []byte) (n int, err error) {
    if r.pos >= len(r.data) {
        return 0, io.EOF
    }

    n = copy(p, r.data[r.pos:])
    r.pos += n
    return n, nil
}

// 使用
reader := &StringReader{data: "Hello"}
buf := make([]byte, 10)
n, err := reader.Read(buf)
```

### Writer 接口

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}

// 实现示例
type StringWriter struct {
    buffer bytes.Buffer
}

func (w *StringWriter) Write(p []byte) (n int, err error) {
    return w.buffer.Write(p)
}

func (w *StringWriter) String() string {
    return w.buffer.String()
}

// 使用
writer := &StringWriter{}
writer.Write([]byte("Hello"))
fmt.Println(writer.String())
```

## 组合接口

### ReadWriter

```go
type ReadWriter interface {
    Reader
    Writer
}

// 实现同时读写
type Buffer struct {
    data []byte
    pos  int
}

func (b *Buffer) Read(p []byte) (n int, err error) {
    if b.pos >= len(b.data) {
        return 0, io.EOF
    }
    n = copy(p, b.data[b.pos:])
    b.pos += n
    return n, nil
}

func (b *Buffer) Write(p []byte) (n int, err error) {
    b.data = append(b.data, p...)
    return len(p), nil
}
```

### ReadCloser

```go
type ReadCloser interface {
    Reader
    Closer
}

// 实现可读可关闭
type File struct {
    *os.File
}

func (f *File) Read(p []byte) (n int, err error) {
    return f.File.Read(p)
}

func (f *File) Close() error {
    return f.File.Close()
}
```

### WriteCloser

```go
type WriteCloser interface {
    Writer
    Closer
}

// HTTP 响应实现了 WriteCloser
resp, err := http.Get("https://example.com")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

data, err := io.ReadAll(resp.Body)
```

### Seeker

```go
type Seeker interface {
    Seek(offset int64, whence int) (int64, error)
}

// whence 常量
const (
    SeekStart   = 0  // 相对文件开始
    SeekCurrent = 1  // 相对当前位置
    SeekEnd     = 2  // 相对文件结束
)

// 使用示例
file, _ := os.Open("file.txt")
defer file.Close()

// 移动到文件末尾
pos, _ := file.Seek(0, io.SeekEnd)
fmt.Printf("File size: %d\n", pos)

// 移动到文件开始
file.Seek(0, io.SeekStart)
```

## 接口实现

### strings.Reader

```go
// strings.Reader 实现了 Reader, ReaderAt, Seeker, ByteScanner
r := strings.NewReader("Hello, World!")

// Read
buf := make([]byte, 5)
n, err := r.Read(buf)
fmt.Printf("Read %d bytes: %s\n", n, buf[:n])

// ReadAt
data := make([]byte, 5)
n, err = r.ReadAt(data, 7) // 从偏移 7 开始
fmt.Printf("ReadAt %d bytes: %s\n", n, data[:n])

// Seek
pos, _ := r.Seek(0, io.SeekStart)
fmt.Printf("Seeked to %d\n", pos)
```

### bytes.Buffer

```go
// bytes.Buffer 实现了 Reader, Writer, ReadWriter, ByteWriter
var buf bytes.Buffer

// Write
buf.WriteString("Hello")
buf.WriteByte(' ')
buf.WriteString("World")

// Read
data := make([]byte, 5)
n, err := buf.Read(data)
fmt.Printf("Read %d bytes: %s\n", n, data[:n])

// String
fmt.Println(buf.String())
```

### io.Pipe

```go
// 创建内存管道
pr, pw := io.Pipe()

// 写入
go func() {
    defer pw.Close()
    pw.Write([]byte("Hello, Pipe!"))
}()

// 读取
data, err := io.ReadAll(pr)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Pipe data: %s\n", data)
```

## 工具函数

### io.Copy

```go
// 高效复制数据
func copyData(src, dst string) error {
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

### io.CopyN

```go
// 复制指定字节数
func copyFirstN(src, dst string, n int64) error {
    source, _ := os.Open(src)
    defer source.Close()

    destination, _ := os.Create(dst)
    defer destination.Close()

    _, err := io.CopyN(destination, source, n)
    return err
}
```

### io.CopyBuffer

```go
// 使用指定缓冲区复制
func copyWithBuffer(src, dst string, bufSize int) error {
    source, _ := os.Open(src)
    defer source.Close()

    destination, _ := os.Create(dst)
    defer destination.Close()

    buf := make([]byte, bufSize)
    _, err := io.CopyBuffer(destination, source, buf)
    return err
}
```

### io.ReadAll

```go
// 读取全部数据
func readAllData(path string) ([]byte, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    return io.ReadAll(file)
}
```

## 限制器

### LimitReader

```go
// 限制读取的字节数
func limitedRead(r io.Reader, limit int64) io.Reader {
    return io.LimitReader(r, limit)
}

// 使用
file, _ := os.Open("large.txt")
defer file.Close()

limited := io.LimitReader(file, 1024)
data, _ := io.ReadAll(limited)
fmt.Printf("Read %d bytes\n", len(data))
```

### SectionReader

```go
// 读取文件的一部分
func readSection(file *os.File, offset, size int64) io.Reader {
    return io.NewSectionReader(file, offset, size)
}

// 使用
file, _ := os.Open("large.txt")
defer file.Close()

section := io.NewSectionReader(file, 100, 200)
data, _ := io.ReadAll(section)
fmt.Printf("Read %d bytes from section\n", len(data))
```

## 多路复用

### MultiReader

```go
// 组合多个 Reader
r1 := strings.NewReader("Hello, ")
r2 := strings.NewReader("World!")
r3 := strings.NewReader(" How are you?")

reader := io.MultiReader(r1, r2, r3)

data, err := io.ReadAll(reader)
if err != nil {
    log.Fatal(err)
}

fmt.Println(string(data)) // "Hello, World! How are you?"
```

### MultiWriter

```go
// 同时写入多个 Writer
var buf1, buf2 bytes.Buffer
file, _ := os.Create("output.txt")
defer file.Close()

writer := io.MultiWriter(&buf1, &buf2, file)

writer.Write([]byte("Hello, MultiWriter!"))

fmt.Println(buf1.String())
fmt.Println(buf2.String())
```

### TeeReader

```go
// 分流读取：同时读取和写入
pr, pw := io.Pipe()

tee := io.TeeReader(pr, os.Stdout)

go func() {
    pw.Write([]byte("Hello, Tee!"))
    pw.Close()
}()

data, _ := io.ReadAll(tee)
fmt.Printf("Read: %s\n", data)
```

## 最佳实践

::: tip 使用建议

1. **使用接口** - 编写接受接口的函数
2. **组合接口** - 利用接口组合的灵活性
3. **io.Copy** - 优先使用 io.Copy
4. **资源清理** - 使用 defer 确保资源关闭
5. **错误处理** - 始终检查错误

:::

```go
// ✅ 好的模式
func processStream(r io.Reader, w io.Writer) error {
    defer r.Close()

    // 使用 io.Copy 高效复制
    _, err := io.Copy(w, r)
    return err
}

// ❌ 不好的模式
func processStreamBad(r io.Reader, w io.Writer) error {
    // 手动复制，效率低
    buf := make([]byte, 1024)
    for {
        n, err := r.Read(buf)
        if n == 0 {
            if err == io.EOF {
                break
            }
            return err
        }
        if _, err := w.Write(buf[:n]); err != nil {
            return err
        }
    }
    return nil
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Reader** - `Read(p []byte)` |
| **Writer** - `Write(p []byte)` |
| **Closer** - `Close()` |
| **Seeker** - `Seek(offset, whence)` |
| **ReadWriter** - 读+写组合 |
| **io.Copy** - 高效复制 |

::: v-pre

[缓冲IO](./buffered-io.md) → [JSON处理](./json.md)

:::
