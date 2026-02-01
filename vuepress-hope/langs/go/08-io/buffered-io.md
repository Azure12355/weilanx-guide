---
title: 缓冲IO
icon: ri:database-2-line
order: 4
---

# 缓冲IO

bufio 包提供了带缓冲的 I/O 操作，可以显著提高读写性能。

## Reader

### 基本读取

```go
// 创建缓冲 Reader
file, err := os.Open("file.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

reader := bufio.NewReader(file)

// 读取单个字节
b, err := reader.ReadByte()
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Byte: %c\n", b)
```

### ReadBytes

```go
// 读取直到分隔符
file, _ := os.Open("file.txt")
defer file.Close()

reader := bufio.NewReader(file)

// 读取一行
line, err := reader.ReadBytes('\n')
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Line: %s\n", line)
```

### ReadString

```go
// 读取字符串
line, err := reader.ReadString('\n')
if err != nil {
    if err != io.EOF {
        log.Fatal(err)
    }
}
fmt.Printf("Line: %s\n", line)
```

### Peek

```go
// 查看数据但不消费
data, err := reader.Peek(10)
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Next 10 bytes: %s\n", data)
```

## Writer

### 基本写入

```go
// 创建缓冲 Writer
file, err := os.Create("output.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

writer := bufio.NewWriter(file)

// 写入数据
_, err = writer.WriteString("Hello, World!\n")
if err != nil {
    log.Fatal(err)
}

// 刷新缓冲区
err = writer.Flush()
if err != nil {
    log.Fatal(err)
}
```

### WriteString

```go
// 写入字符串
writer := bufio.NewWriter(os.Stdout)

_, err := writer.WriteString("Hello, buffered output!\n")
if err != nil {
    log.Fatal(err)
}

writer.Flush()
```

### 缓冲写入

```go
// 设置缓冲区大小
writer := bufio.NewWriterSize(file, 4096)

// 写入数据会先到缓冲区
for i := 0; i < 100; i++ {
    writer.WriteString("Line\n")
}

// 最后刷新
writer.Flush()
```

## Scanner

### 基本扫描

```go
// 创建 Scanner
file, _ := os.Open("data.txt")
defer file.Close()

scanner := bufio.NewScanner(file)

// 逐行扫描
for scanner.Scan() {
    line := scanner.Text()
    fmt.Println(line)
}

if err := scanner.Err(); err != nil {
    log.Fatal(err)
}
```

### 自定义分割

```go
// 使用自定义分割函数
scanner := bufio.NewScanner(strings.NewReader("word1,word2,word3"))

// 设置分割函数
scanner.Split(bufio.ScanWords)

for scanner.Scan() {
    word := scanner.Text()
    fmt.Println(word)
}
```

### ScanWords

```go
// 按单词扫描
input := "Hello  World\tThis\nis a test"
scanner := bufio.NewScanner(strings.NewReader(input))
scanner.Split(bufio.ScanWords)

for scanner.Scan() {
    fmt.Printf("Word: %s\n", scanner.Text())
}
```

### ScanLines

```go
// 按行扫描
scanner := bufio.NewScanner(strings.NewReader("line1\nline2\nline3"))
scanner.Split(bufio.ScanLines)

for scanner.Scan() {
    fmt.Printf("Line: %s\n", scanner.Text())
}
```

### ScanRunes

```go
// 按字符扫描
scanner := bufio.NewScanner(strings.NewReader("Hello"))
scanner.Split(bufio.ScanRunes)

for scanner.Scan() {
    fmt.Printf("Rune: %c\n", scanner.Text()[0])
}
```

## 性能优化

### 缓冲区大小

```go
// 默认缓冲区大小是 4096 字节
// 可以自定义缓冲区大小

// 小缓冲区（适合小文件）
reader := bufio.NewReaderSize(file, 1024)

// 大缓冲区（适合大文件）
reader := bufio.NewReaderSize(file, 64*1024)
```

### 批量操作

```go
// 使用批量操作提高性能
file, _ := os.Open("large.txt")
defer file.Close()

reader := bufio.NewReader(file)

buf := make([]byte, 4096)
for {
    n, err := reader.Read(buf)
    if n == 0 {
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Fatal(err)
        }
    }

    // 处理数据
    processData(buf[:n])
}
```

## 实战示例

### 日志文件

```go
// 写入日志文件
func writeLog(path, message string) error {
    file, err := os.OpenFile(path, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0644)
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    _, err = writer.WriteString(fmt.Sprintf("[%s] %s\n", time.Now().Format(time.RFC3339), message))
    if err != nil {
        return err
    }

    return writer.Flush()
}
```

### 配置文件

```go
// 读取配置文件
func readConfig(path string) (map[string]string, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    config := make(map[string]string)
    scanner := bufio.NewScanner(file)

    for scanner.Scan() {
        line := scanner.Text()
        if line == "" || strings.HasPrefix(line, "#") {
            continue
        }

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

### CSV 文件

```go
// 读取 CSV 文件
func readCSV(path string) ([][]string, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var data [][]string
    scanner := bufio.NewScanner(file)

    for scanner.Scan() {
        line := scanner.Text()
        fields := strings.Split(line, ",")
        data = append(data, fields)
    }

    return data, scanner.Err()
}

// 写入 CSV 文件
func writeCSV(path string, data [][]string) error {
    file, err := os.Create(path)
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    for _, row := range data {
        line := strings.Join(row, ",")
        if _, err := writer.WriteString(line + "\n"); err != nil {
            return err
        }
    }

    return writer.Flush()
}
```

## 最佳实践

::: tip 使用建议

1. **使用 defer** - 确保资源被释放
2. **检查错误** - 始终检查 I/O 错误
3. **及时 Flush** - 确保数据写入
4. **合适缓冲** - 根据场景选择缓冲区大小
5. **Scanner 优先** - 使用 Scanner 处理文本

:::

```go
// ✅ 好的模式
func goodBufferedIO() error {
    file, err := os.Open("file.txt")
    if err != nil {
        return err
    }
    defer file.Close()

    reader := bufio.NewReader(file)
    scanner := bufio.NewScanner(reader)

    for scanner.Scan() {
        line := scanner.Text()
        fmt.Println(line)
    }

    return scanner.Err()
}

// ❌ 不好的模式
func badBufferedIO() {
    file, _ := os.Open("file.txt")

    reader := bufio.NewReader(file)

    // 忘记 flush
    writer := bufio.NewWriter(os.Stdout)
    writer.WriteString("Hello")
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **ReadWriter** - 缓冲读写 |
| **Scanner** - 便捷扫描 |
| **ReadBytes** - 读取到分隔符 |
| **WriteString** - 写入字符串 |
| **Flush** - 刷新缓冲区 |
| **缓冲区大小** - 性能优化 |

::: v-pre

[文件操作](./file-operations.md) → [IO接口](./io-interfaces.md)

:::
