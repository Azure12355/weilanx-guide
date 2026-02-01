---
title: 文件操作
icon: ri:file-text-line
order: 3
---

# 文件操作

文件操作是 Go 编程中常见的任务，掌握文件读写至关重要。

## 打开文件

### 基本打开

```go
// Open 打开文件只读
file, err := os.Open("file.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// OpenFile 提供更多选项
file, err := os.OpenFile("file.txt", os.O_RDWR|os.O_CREATE, 0644)
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 打开标志
// os.O_RDONLY - 只读
// os.O_WRONLY - 只写
// os.O_RDWR - 读写
// os.O_CREATE - 创建
// os.O_APPEND - 追加
// os.O_EXCL - 排斥创建
// os.O_SYNC - 同步写入
// os.O_TRUNC - 截断
```

### 创建文件

```go
// Create 创建文件，如果存在则截断
file, err := os.Create("output.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 创建并写入
data := []byte("Hello, World!")
_, err = file.Write(data)
```

## 读取文件

### Read 方法

```go
// 打开文件
file, err := os.Open("file.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 创建缓冲区
buf := make([]byte, 1024)

// 循环读取
for {
    n, err := file.Read(buf)
    if err != nil {
        if err == io.EOF {
            break
        }
        log.Fatal(err)
    }

    // 处理数据
    fmt.Printf("Read %d bytes: %s\n", n, buf[:n])
}
```

### ReadAll

```go
// 读取整个文件
data, err := os.ReadFile("file.txt")
if err != nil {
    log.Fatal(err)
}
fmt.Printf("File content: %s\n", data)
```

### 按行读取

```go
file, err := os.Open("file.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 使用 Scanner 按行读取
scanner := bufio.NewScanner(file)
for scanner.Scan() {
    line := scanner.Text()
    fmt.Println(line)
}

if err := scanner.Err(); err != nil {
    log.Fatal(err)
}
```

## 写入文件

### Write 方法

```go
// 创建或打开文件
file, err := os.Create("output.txt")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 写入数据
data := []byte("Hello, World!\n")
n, err := file.Write(data)
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Wrote %d bytes\n", n)
```

### WriteFile

```go
// 直接写入文件
data := []byte("Hello, World!\n")
err := os.WriteFile("output.txt", data, 0644)
if err != nil {
    log.Fatal(err)
}
```

### 追加写入

```go
// 打开文件准备追加
file, err := os.OpenFile("log.txt", os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0644)
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 追加数据
_, err = file.WriteString("New log entry\n")
if err != nil {
    log.Fatal(err)
}
```

## 文件信息

### Stat

```go
// 获取文件信息
info, err := os.Stat("file.txt")
if err != nil {
    log.Fatal(err)
}

// 文件大小
size := info.Size()
fmt.Printf("File size: %d bytes\n", size)

// 文件权限
mode := info.Mode()
fmt.Printf("File mode: %v\n", mode)

// 修改时间
modTime := info.ModTime()
fmt.Printf("Modified: %v\n", modTime)

// 是否为目录
isDir := info.IsDir()
fmt.Printf("Is directory: %v\n", isDir)

// 文件名
name := info.Name()
fmt.Printf("File name: %s\n", name)
```

### Lstat

```go
// 获取符号链接信息（不跟随链接）
info, err := os.Lstat("symlink")
if err != nil {
    log.Fatal(err)
}
```

## 文件操作

### 重命名

```go
// 重命名/移动文件
err := os.Rename("old.txt", "new.txt")
if err != nil {
    log.Fatal(err)
}
```

### 删除文件

```go
// 删除文件
err := os.Remove("file.txt")
if err != nil {
    log.Fatal(err)
}
```

### 创建目录

```go
// 创建单个目录
err := os.Mkdir("dir", 0755)
if err != nil {
    log.Fatal(err)
}

// 创建多级目录
err = os.MkdirAll("path/to/dir", 0755)
if err != nil {
    log.Fatal(err)
}
```

### 删除目录

```go
// 删除空目录
err := os.Remove("dir")
if err != nil {
    log.Fatal(err)
}

// 删除目录及其内容
err = os.RemoveAll("dir")
if err != nil {
    log.Fatal(err)
}
```

## 临时文件

### 创建临时文件

```go
// 创建临时文件
file, err := os.CreateTemp("", "example")
if err != nil {
    log.Fatal(err)
}
defer os.Remove(file.Name()) // 清理

fmt.Printf("Temp file: %s\n", file.Name())

// 使用临时文件
file.WriteString("Temporary data")
```

### 临时目录

```go
// 创建临时目录
dir, err := os.MkdirTemp("", "example")
if err != nil {
    log.Fatal(err)
}
defer os.RemoveAll(dir) // 清理

fmt.Printf("Temp dir: %s\n", dir)
```

## 文件路径

### filepath 包

```go
import "path/filepath"

// Join 连接路径
path := filepath.Join("dir", "subdir", "file.txt")
fmt.Println(path)  // dir/subdir/file.txt

// Base 获取文件名
base := filepath.Base("/path/to/file.txt")
fmt.Println(base)  // file.txt

// Dir 获取目录
dir := filepath.Dir("/path/to/file.txt")
fmt.Println(dir)  // /path/to

// Ext 获取扩展名
ext := filepath.Ext("/path/to/file.txt")
fmt.Println(ext)  // .txt

// Split 分割路径
dir, file := filepath.Split("/path/to/file.txt")
fmt.Println(dir)   // /path/to
fmt.Println(file)  // file.txt
```

### 相对路径

```go
// Abs 获取绝对路径
abs, err := filepath.Abs("file.txt")
if err != nil {
    log.Fatal(err)
}
fmt.Println(abs)

// Rel 获取相对路径
rel, err := filepath.Rel("/path/to", "/path/to/file.txt")
if err != nil {
    log.Fatal(err)
}
fmt.Println(rel)  // file.txt
```

## 文件权限

### 权限模式

```go
// 权限常量
// 0400 - 所有者只读
// 0200 - 组只读
// 0100 - 其他人只读
// 0600 - 所有者读写
// 0644 - 所有者读写，其他人只读
// 0755 - 所有者完全权限，其他人执行和读
// 0755 - rwxr-xr-x

// 创建文件时指定权限
file, err := os.OpenFile("file.txt", os.O_CREATE|os.O_WRONLY, 0644)
if err != nil {
    log.Fatal(err)
}
defer file.Close()

// 更改权限
err = os.Chmod("file.txt", 0755)
if err != nil {
    log.Fatal(err)
}
```

### 检查权限

```go
// 检查文件是否存在
info, err := os.Stat("file.txt")
if os.IsNotExist(err) {
    fmt.Println("File does not exist")
}

// 检查权限
mode := info.Mode()
perm := mode.Perm()

fmt.Printf("Permissions: %04o\n", perm)
```

## 最佳实践

::: tip 使用建议

1. **defer 关闭** - 确保文件被关闭
2. **检查错误** - 始终检查 I/O 错误
3. **缓冲 I/O** - 使用 bufio 提高性能
4. **资源清理** - 及时清理临时文件
5. **路径操作** - 使用 filepath 包

:::

```go
// ✅ 好的模式
func goodFileOperation() error {
    // 打开文件
    file, err := os.Open("file.txt")
    if err != nil {
        return err
    }
    defer file.Close()  // 确保关闭

    // 读取文件
    data, err := io.ReadAll(file)
    if err != nil {
        return err
    }

    // 处理数据
    fmt.Println(string(data))
    return nil
}

// ❌ 不好的模式
func badFileOperation() {
    // 没有检查错误
    file, _ := os.Open("file.txt")

    // 忘记关闭
    data := make([]byte, 1024)
    file.Read(data)
}
```

## 总结

| 操作 | 关键点 |
|------|--------|
| **Open** - 打开文件 |
| **Create** - 创建文件 |
| **Read** - 读取数据 |
| **Write** - 写入数据 |
| **Stat** - 文件信息 |
| **Remove** - 删除文件 |

::: v-pre

[IO总览](./README.md) → [缓冲IO](./buffered-io.md)

:::
