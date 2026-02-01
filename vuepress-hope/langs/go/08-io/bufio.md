---
title: bufio 包
icon: ri:speed-line
order: 4
---

# bufio 包

`bufio` 包提供了带缓冲的 I/O 操作，显著提高读写性能。

## 缓冲 Reader

### 基本使用

```go
// bufio.NewReader 创建缓冲 Reader
func bufferedRead(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // 创建缓冲 Reader（默认 4KB 缓冲）
    reader := bufio.NewReader(file)

    // 读取单行
    line, err := reader.ReadString('\n')
    if err != nil {
        return err
    }

    fmt.Print(line)
    return nil
}
```

### 自定义缓冲

```go
// 指定缓冲区大小
func customBufferSize(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // 32KB 缓冲
    reader := bufio.NewReaderSize(file, 32*1024)

    data, err := io.ReadAll(reader)
    if err != nil {
        return err
    }

    fmt.Printf("Read %d bytes\n", len(data))
    return nil
}
```

### Peek 预览

```go
// bufio.Reader.Peek 预览数据但不移动指针
func peekData(reader *bufio.Reader) ([]byte, error) {
    // 预览接下来 10 字节
    data, err := reader.Peek(10)
    if err != nil {
        return nil, err
    }

    fmt.Printf("Peeked: %s\n", string(data))
    return data, nil
}

// 使用示例：检测文件类型
func detectFileType(filename string) (string, error) {
    file, err := os.Open(filename)
    if err != nil {
        return "", err
    }
    defer file.Close()

    reader := bufio.NewReader(file)

    // 预览前几个字节
    data, err := reader.Peek(4)
    if err != nil {
        return "", err
    }

    // 检测 PNG 文件
    if string(data) == "\x89PNG" {
        return "PNG", nil
    }

    return "Unknown", nil
}
```

## Scanner 扫描器

### 基本使用

```go
// bufio.Scanner 逐行扫描
func scanLines(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    scanner := bufio.NewScanner(file)

    // 逐行扫描
    for scanner.Scan() {
        line := scanner.Text()
        fmt.Println(line)
    }

    if err := scanner.Err(); err != nil {
        return err
    }

    return nil
}
```

### 自定义分割

```go
// 自定义分割函数
func scanWords(text string) []string {
    scanner := bufio.NewScanner(strings.NewReader(text))

    // 按单词分割
    scanner.Split(bufio.ScanWords)

    var words []string
    for scanner.Scan() {
        words = append(words, scanner.Text())
    }

    return words
}

// 使用示例
func parseInput(input string) []string {
    scanner := bufio.NewScanner(strings.NewReader(input))

    // 自定义分割函数
    splitFunc := func(data []byte, atEOF bool) (advance int, token []byte, err error) {
        // 自定义分割逻辑
        if atEOF && len(data) == 0 {
            return 0, nil, nil
        }

        // 按逗号分割
        if i := bytes.IndexByte(data, ','); i >= 0 {
            return i + 1, data[:i], nil
        }

        return len(data), data, nil
    }

    scanner.Split(splitFunc)

    var items []string
    for scanner.Scan() {
        items = append(items, scanner.Text())
    }

    return items
}
```

### 带字节的扫描

```go
// Scanner.Bytes() 获取字节数据
func scanBytes(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    scanner := bufio.NewScanner(file)

    // 自定义缓冲区大小（适用于长行）
    buf := make([]byte, 0, 64*1024) // 64KB
    scanner.Buffer(buf, 1024*1024)   // 最大 1MB

    for scanner.Scan() {
        bytes := scanner.Bytes()
        fmt.Printf("Read %d bytes\n", len(bytes))
    }

    return scanner.Err()
}
```

## 缓冲 Writer

### 基本使用

```go
// bufio.Writer 创建缓冲 Writer
func bufferedWrite(filename string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // 创建缓冲 Writer
    writer := bufio.NewWriter(file)

    // 写入缓冲区
    for i := 0; i < 10; i++ {
        fmt.Fprintf(writer, "Line %d\n", i)
    }

    // 刷新缓冲区
    return writer.Flush()
}
```

### 自动刷新

```go
// bufio.NewWriterSize 指定缓冲区大小
func customWriterSize(filename string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // 8KB 缓冲
    writer := bufio.NewWriterSize(file, 8*1024)

    // 写入数据
    for i := 0; i < 100; i++ {
        writer.WriteString(fmt.Sprintf("Data %d\n", i))

        // 缓冲区满时自动刷新
    }

    // 确保所有数据被写入
    return writer.Flush()
}
```

### ReadFrom

```go
// bufio.Writer.ReadFrom 实现了 io.ReaderFrom
func copyWithWriter(dst io.Writer, src io.Reader) (int64, error) {
    writer := bufio.NewWriter(dst)
    defer writer.Flush()

    // ReadFrom 会高效地复制数据
    return writer.ReadFrom(src)
}
```

## ReadWriter

### 组合读写

```go
// bufio.ReadWriter 组合 Reader 和 Writer
func readWriteConn(conn net.Conn) error {
    // 创建带缓冲的 ReadWriter
    rw := bufio.NewReadWriter(
        bufio.NewReader(conn),
        bufio.NewWriter(conn),
    )

    // 读取
    line, err := rw.ReadString('\n')
    if err != nil {
        return err
    }
    fmt.Println("Received:", line)

    // 写入
    _, err = rw.WriteString("ACK\n")
    if err != nil {
        return err
    }

    return rw.Flush()
}
```

## 性能考虑

### 缓冲区大小

```go
// 不同场景的缓冲区大小建议
const (
    // 小数据、频繁交互：4KB（默认）
    SmallBufferSize = 4 * 1024

    // 一般文件操作：32KB
    MediumBufferSize = 32 * 1024

    // 大文件操作：64KB - 256KB
    LargeBufferSize = 128 * 1024
)

// 选择合适的缓冲区大小
func chooseBufferSize(fileSize int64) int {
    switch {
    case fileSize < 1024:
        return SmallBufferSize
    case fileSize < 1024*1024:
        return MediumBufferSize
    default:
        return LargeBufferSize
    }
}
```

### 性能比较

```go
// 不带缓冲 vs 带缓冲
func benchmarkIO() {
    data := []byte("Hello, buffered I/O!\n")
    iterations := 10000

    // 不带缓冲
    start := time.Now()
    for i := 0; i < iterations; i++ {
        file, _ := os.Create("unbuffered.txt")
        for j := 0; j < 100; j++ {
            file.Write(data)
        }
        file.Close()
    }
    fmt.Println("Unbuffered:", time.Since(start))

    // 带缓冲
    start = time.Now()
    for i := 0; i < iterations; i++ {
        file, _ := os.Create("buffered.txt")
        writer := bufio.NewWriter(file)
        for j := 0; j < 100; j++ {
            writer.Write(data)
        }
        writer.Flush()
        file.Close()
    }
    fmt.Println("Buffered:", time.Since(start))
}
```

## 实战示例

### 日志写入器

```go
type LogWriter struct {
    writer *bufio.Writer
    file   *os.File
}

func NewLogWriter(filename string) (*LogWriter, error) {
    file, err := os.OpenFile(filename,
        os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        return nil, err
    }

    return &LogWriter{
        writer: bufio.NewWriter(file),
        file:   file,
    }, nil
}

func (lw *LogWriter) Write(msg string) error {
    _, err := lw.writer.WriteString(msg)
    return err
}

func (lw *LogWriter) Flush() error {
    return lw.writer.Flush()
}

func (lw *LogWriter) Close() error {
    err := lw.writer.Flush()
    if err != nil {
        return err
    }
    return lw.file.Close()
}
```

### CSV 读取

```go
func readCSV(filename string) ([][]string, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    scanner := bufio.NewScanner(file)
    var rows [][]string

    for scanner.Scan() {
        line := scanner.Text()
        // 简单的 CSV 解析
        fields := strings.Split(line, ",")
        rows = append(rows, fields)
    }

    if err := scanner.Err(); err != nil {
        return nil, err
    }

    return rows, nil
}
```

### 配置解析器

```go
func parseConfig(filename string) (map[string]string, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    config := make(map[string]string)
    scanner := bufio.NewScanner(file)

    for scanner.Scan() {
        line := scanner.Text()
        line = strings.TrimSpace(line)

        // 跳过空行和注释
        if line == "" || strings.HasPrefix(line, "#") {
            continue
        }

        // 解析 key=value
        parts := strings.SplitN(line, "=", 2)
        if len(parts) == 2 {
            key := strings.TrimSpace(parts[0])
            value := strings.TrimSpace(parts[1])
            config[key] = value
        }
    }

    return config, scanner.Err()
}
```

## 最佳实践

::: tip 使用建议

1. **总是 Flush** - 确保缓冲区被刷新
2. **合理大小** - 根据场景选择缓冲区大小
3. **Scanner** - 用于逐行或分割扫描
4. **Peek** - 用于预览数据
5. **资源清理** - 使用 defer 确保资源关闭

:::

```go
// ✅ 好的模式
func goodBufio() error {
    file, err := os.Create("output.txt")
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    defer writer.Flush()  // 确保刷新

    for i := 0; i < 100; i++ {
        fmt.Fprintf(writer, "Line %d\n", i)
    }

    return nil
}

// ❌ 不好的模式
func badBufio() error {
    file, err := os.Create("output.txt")
    if err != nil {
        return err
    }

    writer := bufio.NewWriter(file)

    for i := 0; i < 100; i++ {
        fmt.Fprintf(writer, "Line %d\n", i)
    }

    // 忘记 Flush
    file.Close()
    return nil
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Reader** - 带缓冲的读取 |
| **Writer** - 带缓冲的写入 |
| **Scanner** - 逐行扫描 |
| **Peek** - 预览数据 |
| **Flush** - 刷新缓冲区 |
| **ReadWriter** - 组合读写 |

::: v-pre

[文件操作](./files.md) → [格式化IO](./fmt-io.md)

:::
