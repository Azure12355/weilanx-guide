---
title: 最佳实践
icon: ri:star-line
order: 7
---

# IO 最佳实践

遵循这些最佳实践可以让你的 I/O 代码更高效、更可靠。

## 资源管理

### defer 关闭

```go
// ✅ 总是使用 defer 关闭资源
func goodClose(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()  // 确保关闭

    // 处理文件
    return nil
}

// ❌ 不要忘记关闭资源
func badClose(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    // 忘记关闭！
    return nil
}
```

### 关闭顺序

```go
// 按相反顺序关闭多个资源
func closeMultiple() error {
    file1, err := os.Open("file1.txt")
    if err != nil {
        return err
    }
    defer file1.Close()

    file2, err := os.Open("file2.txt")
    if err != nil {
        return err
    }
    defer file2.Close()

    // 使用文件
    return nil
}
```

## 错误处理

### 检查错误

```go
// ✅ 检查所有错误
func checkErrors(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return fmt.Errorf("open failed: %w", err)
    }
    defer file.Close()

    data, err := io.ReadAll(file)
    if err != nil {
        return fmt.Errorf("read failed: %w", err)
    }

    _ = data
    return nil
}

// ❌ 忽略错误
func ignoreErrors(filename string) {
    file, _ := os.Open(filename)
    defer file.Close()

    data, _ := io.ReadAll(file)
    _ = data
}
```

### 错误包装

```go
// 包装错误提供上下文
func wrapErrors(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return fmt.Errorf("failed to open %s: %w", filename, err)
    }
    defer file.Close()

    // 处理
    return nil
}
```

## 缓冲策略

### 选择缓冲区大小

```go
// 根据数据大小选择缓冲
func chooseBuffer(dataSize int64) int {
    switch {
    case dataSize < 1024:  // 小数据
        return 512
    case dataSize < 1024*1024:  // 中等数据
        return 4 * 1024
    default:  // 大数据
        return 64 * 1024
    }
}

// 使用 bufio 提高小数据读写性能
func bufferedWrite(filename string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriterSize(file, chooseBuffer(1024))
    defer writer.Flush()

    for i := 0; i < 100; i++ {
        fmt.Fprintf(writer, "Line %d\n", i)
    }

    return nil
}
```

### 大文件处理

```go
// 使用缓冲处理大文件
func processLargeFile(src, dst string) error {
    srcFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer srcFile.Close()

    dstFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer dstFile.Close()

    // 使用 Copy 高效复制
    _, err = io.Copy(dstFile, srcFile)
    return err
}
```

## 性能优化

### 批量操作

```go
// 批量读写而非逐字节
func batchOperation(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    reader := bufio.NewReader(file)
    buf := make([]byte, 32*1024)  // 32KB 缓冲

    var results []string
    for {
        n, err := reader.Read(buf)
        if n > 0 {
            results = append(results, string(buf[:n]))
        }
        if err == io.EOF {
            break
        }
        if err != nil {
            return err
        }
    }

    _ = results
    return nil
}
```

### 避免小读写

```go
// ❌ 避免频繁的小读写
func badPerformance() error {
    file, err := os.Create("output.txt")
    if err != nil {
        return err
    }
    defer file.Close()

    // 每次只写一个字节
    for i := 0; i < 1000; i++ {
        file.Write([]byte{byte(i)})
    }

    return nil
}

// ✅ 使用缓冲
func goodPerformance() error {
    file, err := os.Create("output.txt")
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    defer writer.Flush()

    // 缓冲写入
    for i := 0; i < 1000; i++ {
        writer.WriteByte(byte(i))
    }

    return nil
}
```

## 路径处理

### 跨平台路径

```go
// ✅ 使用 filepath 包
func crossPlatformPath() string {
    dir := "data"
    file := "config.json"

    // 自动使用正确的分隔符
    path := filepath.Join(dir, file)

    return path
}

// ❌ 硬编码分隔符
func hardcodedPath() string {
    // 在 Unix 上工作，Windows 上失败
    return "data/config.json"
}
```

### 路径验证

```go
// 验证路径存在
func validatePath(path string) error {
    // 检查文件是否存在
    _, err := os.Stat(path)
    if err != nil {
        if os.IsNotExist(err) {
            return fmt.Errorf("path does not exist: %s", path)
        }
        return fmt.Errorf("error accessing path: %w", err)
    }
    return nil
}

// 清理路径
func cleanPath(path string) string {
    // 清理冗余分隔符
    return filepath.Clean(path)
}
```

## 临时文件

### 清理临时文件

```go
// 创建和清理临时文件
func useTempFile() error {
    // 创建临时文件
    tmpfile, err := os.CreateTemp("", "example-*.txt")
    if err != nil {
        return err
    }
    defer os.Remove(tmpfile.Name())  // 确保删除

    // 使用临时文件
    fmt.Fprintf(tmpfile, "Temporary data\n")

    // 使用完成后自动删除
    return nil
}

// 临时目录
func useTempDir() error {
    tmpdir, err := os.MkdirTemp("", "example-*")
    if err != nil {
        return err
    }
    defer os.RemoveAll(tmpdir)  // 确保删除

    // 使用临时目录
    tmpfile := filepath.Join(tmpdir, "data.txt")
    return os.WriteFile(tmpfile, []byte("data"), 0644)
}
```

## 并发安全

### 文件锁

```go
// 使用文件锁防止并发写入冲突
func lockedWrite(filename string, data []byte) error {
    file, err := os.OpenFile(filename,
        os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        return err
    }
    defer file.Close()

    // 获取独占锁
    err = syscall.Flock(int(file.Fd()), syscall.LOCK_EX)
    if err != nil {
        return err
    }
    defer syscall.Flock(int(file.Fd()), syscall.LOCK_UN)

    // 安全写入
    _, err = file.Write(data)
    return err
}
```

## 最佳实践清单

### 文件操作

```go
// ✅ 文件操作最佳实践
func bestPracticeFile(filename string) error {
    // 1. 检查路径
    if err := validatePath(filename); err != nil {
        return err
    }

    // 2. 打开资源
    file, err := os.Open(filename)
    if err != nil {
        return fmt.Errorf("open failed: %w", err)
    }
    defer file.Close()  // 3. 确保关闭

    // 4. 缓冲读取
    reader := bufio.NewReader(file)

    // 5. 处理数据
    data, err := io.ReadAll(reader)
    if err != nil {
        return fmt.Errorf("read failed: %w", err)
    }

    _ = data
    return nil
}
```

### 错误处理

```go
// 详细的错误处理
func detailedErrorHandling(filename string) (string, error) {
    // 尝试读取文件
    data, err := os.ReadFile(filename)
    if err != nil {
        // 根据错误类型返回不同信息
        if os.IsNotExist(err) {
            return "", fmt.Errorf("file not found: %s", filename)
        }
        if os.IsPermission(err) {
            return "", fmt.Errorf("permission denied: %s", filename)
        }
        return "", fmt.Errorf("read error: %w", err)
    }

    return string(data), nil
}
```

## 常见陷阱

### 忘记 Flush

```go
// ❌ 忘记刷新缓冲区
func forgetFlush(filename string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    writer.WriteString("Data")

    // 忘记 Flush！数据可能未写入
    return nil
}

// ✅ 使用 defer 确保刷新
func ensureFlush(filename string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    defer writer.Flush()  // 确保刷新

    writer.WriteString("Data")
    return nil
}
```

### 资源泄漏

```go
// ❌ 可能的资源泄漏
func potentialLeak() {
    file, err := os.Open("data.txt")
    if err != nil {
        return  // 提前返回，文件未关闭
    }

    data := make([]byte, 1024)
    file.Read(data)

    // 如果这里 panic，文件不会关闭
    if len(data) == 0 {
        panic("empty data")
    }
}

// ✅ 正确的资源管理
func properManagement() (err error) {
    file, err := os.Open("data.txt")
    if err != nil {
        return err
    }
    defer func() {
        if closeErr := file.Close(); closeErr != nil {
            err = closeErr
        }
    }()

    data := make([]byte, 1024)
    _, err = file.Read(data)
    return err
}
```

## 总结

| 实践 | 关键点 |
|------|--------|
| **defer Close** - 确保资源关闭 |
| **错误检查** - 始终检查 I/O 错误 |
| **缓冲 I/O** - 使用 bufio 提高性能 |
| **filepath** - 跨平台路径处理 |
| **临时文件** - 确保清理临时文件 |
| **并发安全** - 注意并发访问 |

::: v-pre

[文件系统](./filesystem.md) → [反射与泛型](/langs/go/09-reflection-generics/)

:::
