---
title: 文件操作
icon: ri:file-list-line
order: 3
---

# 文件操作

Go 的 `os` 包提供了文件和目录的基本操作。

## 打开文件

### Open 打开

```go
// os.Open 以只读模式打开文件
func openReadOnly(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // 读取文件
    data, err := io.ReadAll(file)
    if err != nil {
        return err
    }

    fmt.Println(string(data))
    return nil
}
```

### OpenFile 打开

```go
// os.OpenFile 以指定模式打开文件
func openWithFlags(filename string) error {
    // O_RDONLY: 只读
    // O_WRONLY: 只写
    // O_RDWR: 读写
    // O_CREATE: 不存在则创建
    // O_TRUNC: 打开时截断
    // O_APPEND: 追加

    file, err := os.OpenFile(filename, os.O_RDWR|os.O_CREATE, 0644)
    if err != nil {
        return err
    }
    defer file.Close()

    // 写入文件
    _, err = file.WriteString("Hello, File!")
    return err
}
```

### Create 创建

```go
// os.Create 创建文件（O_CREATE|O_RDWR|O_TRUNC）
func createFile(filename string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = file.Write([]byte("Initial content"))
    return err
}
```

## 读取文件

### ReadAll

```go
// os.ReadFile 读取整个文件
func readFileSimple(filename string) (string, error) {
    data, err := os.ReadFile(filename)
    if err != nil {
        return "", err
    }
    return string(data), nil
}

// 使用示例
content, err := readFileSimple("config.json")
if err != nil {
    log.Fatal(err)
}
fmt.Println(content)
```

### 分段读取

```go
// 使用 Read 分段读取大文件
func readLargeFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    buf := make([]byte, 1024)
    for {
        n, err := file.Read(buf)
        if n > 0 {
            fmt.Printf("Read %d bytes\n", n)
        }
        if err == io.EOF {
            break
        }
        if err != nil {
            return err
        }
    }

    return nil
}
```

### Scanner 逐行读取

```go
import (
    "bufio"
    "os"
)

func readLines(filename string) ([]string, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var lines []string
    scanner := bufio.NewScanner(file)

    for scanner.Scan() {
        lines = append(lines, scanner.Text())
    }

    if err := scanner.Err(); err != nil {
        return nil, err
    }

    return lines, nil
}
```

## 写入文件

### WriteFile

```go
// os.WriteFile 写入文件
func writeFileSimple(filename string) error {
    data := []byte("Hello, World!\n")
    return os.WriteFile(filename, data, 0644)
}
```

### 流式写入

```go
// 使用 Writer 流式写入
func writeStream(filename string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    writer := bufio.NewWriter(file)
    defer writer.Flush()

    for i := 0; i < 10; i++ {
        fmt.Fprintf(writer, "Line %d\n", i)
    }

    return nil
}
```

### 追加写入

```go
// 追加内容到文件
func appendToFile(filename, content string) error {
    file, err := os.OpenFile(filename,
        os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = file.WriteString(content)
    return err
}
```

## 文件信息

### Stat

```go
// os.Stat 获取文件信息
func getFileInfo(filename string) error {
    info, err := os.Stat(filename)
    if err != nil {
        return err
    }

    fmt.Printf("Name: %s\n", info.Name())
    fmt.Printf("Size: %d bytes\n", info.Size())
    fmt.Printf("Mode: %v\n", info.Mode())
    fmt.Printf("ModTime: %v\n", info.ModTime())
    fmt.Printf("IsDir: %v\n", info.IsDir())

    return nil
}
```

### Lstat

```go
// os.Lstat 获取符号链接信息（不跟随）
func getLinkInfo(filename string) error {
    info, err := os.Lstat(filename)
    if err != nil {
        return err
    }

    if info.Mode()&os.ModeSymlink != 0 {
        fmt.Println("This is a symbolic link")
    }

    return nil
}
```

### 检查文件存在

```go
// 检查文件是否存在
func fileExists(filename string) bool {
    info, err := os.Stat(filename)
    if os.IsNotExist(err) {
        return false
    }
    return !info.IsDir()
}

// 检查目录是否存在
func dirExists(dirname string) bool {
    info, err := os.Stat(dirname)
    if os.IsNotExist(err) {
        return false
    }
    return info.IsDir()
}
```

## 文件权限

### 设置权限

```go
// os.Chmod 修改文件权限
func setPermissions(filename string, mode os.FileMode) error {
    return os.Chmod(filename, mode)
}

// 使用示例
func setFilePerms(filename string) error {
    // 0644: rw-r--r--
    // 0755: rwxr-xr-x
    return setPermissions(filename, 0644)
}
```

### 权限常量

```go
// 文件权限常量
const (
    ModePerm    os.FileMode = 0777 // Unix 权限位
    ModeSetuid  os.FileMode = 04000 // 设置用户 ID
    ModeSetgid  os.FileMode = 02000 // 设置组 ID
    ModeSticky  os.FileMode = 01000 // 粘着位
    ModeType    os.FileMode = 0xF000 // 文件类型位
    ModeDir     os.FileMode = 04000 // 目录
    ModeSymlink os.FileMode = 0xA000 // 符号链接
    ModeDevice  os.FileMode = 06000 // 设备文件
)

// 常用权限
const (
    PermUserRead  os.FileMode = 0400 // 用户读
    PermUserWrite os.FileMode = 0200 // 用户写
    PermUserExec  os.FileMode = 0100 // 用户执行
    PermGroupRead os.FileMode = 0040 // 组读
    PermAllRead   os.FileMode = 0004 // 其他读
)
```

## 文件位置

### Seek 定位

```go
// os.File.Seek 改变读写位置
func seekInFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // 定位到文件末尾
    _, err = file.Seek(0, io.SeekEnd)
    if err != nil {
        return err
    }

    // 定位到文件开头
    _, err = file.Seek(0, io.SeekStart)
    if err != nil {
        return err
    }

    // 定位到相对位置
    _, err = file.Seek(100, io.SeekCurrent)
    return err
}
```

### Truncate 截断

```go
// os.Truncate 截断文件到指定大小
func truncateFile(filename string, size int64) error {
    return os.Truncate(filename, size)
}

// 使用示例：清空文件
func emptyFile(filename string) error {
    return truncateFile(filename, 0)
}
```

## 目录操作

### Mkdir 创建目录

```go
// os.Mkdir 创建目录
func makeDirectory(dirname string) error {
    return os.Mkdir(dirname, 0755)
}

// os.MkdirAll 创建目录及父目录
func makeDirectoryAll(dirname string) error {
    return os.MkdirAll(dirname, 0755)
}
```

### Remove 删除

```go
// os.Remove 删除文件或空目录
func removePath(path string) error {
    return os.Remove(path)
}

// os.RemoveAll 删除目录及内容
func removeAll(path string) error {
    return os.RemoveAll(path)
}
```

### Readdir 读取目录

```go
// os.File.Readdir 读取目录内容
func readDirectory(dirname string) ([]string, error) {
    file, err := os.Open(dirname)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    names, err := file.Readdirnames(-1)
    if err != nil {
        return nil, err
    }

    return names, nil
}
```

## 临时文件

### TempFile

```go
// os.CreateTemp 创建临时文件
func createTempFile() (*os.File, error) {
    // 在系统临时目录创建
    file, err := os.CreateTemp("", "example-*.txt")
    if err != nil {
        return nil, err
    }

    fmt.Println("Temp file:", file.Name())
    return file, nil
}
```

### TempDir

```go
// os.MkdirTemp 创建临时目录
func createTempDir() (string, error) {
    dir, err := os.MkdirTemp("", "example-*")
    if err != nil {
        return "", err
    }

    fmt.Println("Temp dir:", dir)
    return dir, nil
}
```

## 最佳实践

::: tip 使用建议

1. **defer Close** - 确保文件被关闭
2. **检查错误** - 始终检查文件操作错误
3. **缓冲写入** - 使用 bufio 提高性能
4. **资源清理** - 确保临时文件被清理
5. **权限控制** - 设置合适的文件权限

:::

```go
// ✅ 好的模式
func goodFileOp(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()  // 确保关闭

    // 操作文件
    data, err := io.ReadAll(file)
    if err != nil {
        return err
    }

    // 处理数据
    _ = data
    return nil
}

// ❌ 不好的模式
func badFileOp(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    // 忘记关闭文件！

    data, _ := io.ReadAll(file)
    _ = data
    return nil
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Open** - 以只读模式打开 |
| **Create** - 创建或截断文件 |
| **OpenFile** - 指定模式打开 |
| **ReadFile** - 简单读取 |
| **WriteFile** - 简单写入 |
| **Stat** - 获取文件信息 |

::: v-pre

[io 包](./io-package.md) → [bufio](./bufio.md)

:::
