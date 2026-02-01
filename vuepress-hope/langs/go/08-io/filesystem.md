---
title: 文件系统
icon: ri:folder-line
order: 6
---

# 文件系统

Go 提供了跨平台的文件系统操作接口。

## filepath 包

### 路径操作

```go
import "path/filepath"

// Join - 连接路径元素
func joinPaths() {
    path := filepath.Join("dir", "subdir", "file.txt")
    fmt.Println(path)  // dir/subdir/file.txt (自动使用分隔符)

    // 跨平台分隔符
    sep := string(filepath.Separator)
    fmt.Println("Separator:", sep)
}
```

### Rel 和 Abs

```go
// Rel - 相对路径
func relativePath(base, target string) (string, error) {
    return filepath.Rel(base, target)
}

// Abs - 绝对路径
func absolutePath(path string) (string, error) {
    return filepath.Abs(path)
}
```

### Split 和 Ext

```go
// Split - 分割目录和文件
func splitPath(path string) {
    dir, file := filepath.Split(path)
    fmt.Printf("Dir: %s, File: %s\n", dir, file)
}

// Ext - 获取文件扩展名
func fileExtension(path string) {
    ext := filepath.Ext(path)
    fmt.Printf("Extension: %s\n", ext)  // .txt
}
```

### Base 和 Dir

```go
// Base - 获取文件名
func basePath(path string) {
    base := filepath.Base(path)
    fmt.Printf("Base: %s\n", base)  // file.txt
}

// Dir - 获取目录
func dirPath(path string) {
    dir := filepath.Dir(path)
    fmt.Printf("Dir: %s\n", dir)  // dir/subdir
}
```

### Clean

```go
// Clean - 清理路径
func cleanPath(path string) {
    // 移除冗余分隔符
    // 计算 . 和 ..
    clean := filepath.Clean(path)
    fmt.Println("Clean:", clean)
}
```

### Glob 模式

```go
// Glob - 匹配文件模式
func findFiles(pattern string) ([]string, error) {
    return filepath.Glob(pattern)
}

// 使用示例
func findAllJSON() {
    files, err := filepath.Glob("*.json")
    if err != nil {
        log.Fatal(err)
    }

    for _, file := range files {
        fmt.Println(file)
    }
}
```

### Walk 遍历

```go
// filepath.Walk 遍历目录树
func walkDirectory(root string) error {
    return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        fmt.Printf("Path: %s, IsDir: %v\n", path, info.IsDir())
        return nil
    })
}

// 使用示例：只访问文件
func walkFiles(root string) error {
    return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        // 跳过目录
        if info.IsDir() {
            return nil
        }

        fmt.Println("File:", path)
        return nil
    })
}
```

## ioutil 包

### 简化操作

```go
// ioutil.ReadAll 读取全部内容（已弃用，使用 io.ReadAll）
func readAll(filename string) ([]byte, error) {
    data, err := os.ReadFile(filename)
    if err != nil {
        return nil, err
    }
    return data, nil
}

// ioutil.WriteFile 写入文件（已弃用，使用 os.WriteFile）
func writeAll(filename string, data []byte) error {
    return os.WriteFile(filename, data, 0644)
}
```

### 读取目录

```go
// ioutil.ReadDir 读取目录（已弃用，使用 os.ReadDir）
func readDir(dirname string) ([]os.FileInfo, error) {
    return os.ReadDir(dirname)
}
```

### Temp 文件

```go
// ioutil.TempFile 创建临时文件（已弃用，使用 os.CreateTemp）
func createTempFile() (*os.File, error) {
    return os.CreateTemp("", "example-*.txt")
}

// ioutil.TempDir 创建临时目录（已弃用，使用 os.MkdirTemp）
func createTempDir() (string, error) {
    return os.MkdirTemp("", "example-*")
}
```

## 文件信息

### 获取信息

```go
// 获取文件详细信息
func getFileInfo(filename string) error {
    info, err := os.Stat(filename)
    if err != nil {
        return err
    }

    // 文件大小
    fmt.Printf("Size: %d bytes\n", info.Size())

    // 修改时间
    fmt.Printf("ModTime: %v\n", info.ModTime())

    // 权限
    fmt.Printf("Mode: %v\n", info.Mode())

    // 是否目录
    fmt.Printf("IsDir: %v\n", info.IsDir())

    // 是否常规文件
    fmt.Printf("Mode().IsRegular(): %v\n", info.Mode().IsRegular())

    return nil
}
```

### 修改时间

```go
// os.Chtimes 修改访问和修改时间
func changeTimes(filename string) error {
    // 设置为当前时间
    now := time.Now()
    return os.Chtimes(filename, now, now)
}
```

## 目录操作

### 创建目录

```go
// Mkdir 创建单个目录
func createDir(dirname string) error {
    return os.Mkdir(dirname, 0755)
}

// MkdirAll 创建目录及父目录
func createDirAll(dirname string) error {
    return os.MkdirAll(dirname, 0755)
}
```

### 删除

```go
// Remove 删除文件或空目录
func removePath(path string) error {
    return os.Remove(path)
}

// RemoveAll 删除目录及内容
func removeAll(path string) error {
    return os.RemoveAll(path)
}
```

### 重命名

```go
// Rename 重命名或移动文件
func renameFile(oldname, newname string) error {
    return os.Rename(oldname, newname)
}

// 使用示例：移动文件
func moveFile(src, dst string) error {
    // 确保目标目录存在
    if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
        return err
    }

    return os.Rename(src, dst)
}
```

## 符号链接

### 创建链接

```go
// os.Symlink 创建符号链接
func createSymlink(src, link string) error {
    return os.Symlink(src, link)
}

// 使用示例
func linkFile(src, link string) error {
    // 创建相对链接
    rel, err := filepath.Rel(filepath.Dir(link), src)
    if err != nil {
        return err
    }

    return os.Symlink(rel, link)
}
```

### 读取链接

```go
// os.Readlink 读取符号链接
func readSymlink(link string) (string, error) {
    return os.Readlink(link)
}

// EvalSymlinks 评估所有符号链接
func evaluateSymlinks(path string) (string, error) {
    return filepath.EvalSymlinks(path)
}
```

## 文件属性

### 权限控制

```go
// Chmod 修改权限
func changePermissions(filename string) error {
    // 0644: rw-r--r--
    return os.Chmod(filename, 0644)
}

// 检查权限
func checkPermissions(filename string) (os.FileMode, error) {
    info, err := os.Stat(filename)
    if err != nil {
        return 0, err
    }
    return info.Mode(), nil
}
```

### 所有者

```go
// os.Chown 修改所有者（Unix）
func changeOwner(filename string, uid, gid int) error {
    return os.Chown(filename, uid, gid)
}

// os.Lchown 修改符号链接所有者
func changeLinkOwner(filename string, uid, gid int) error {
    return os.Lchown(filename, uid, gid)
}
```

## 路径处理

### Match 模式匹配

```go
// filepath.Match 检查路径是否匹配模式
func matchPattern(pattern, path string) (bool, error) {
    return filepath.Match(pattern, path)
}

// 使用示例
func findMatches() {
    matches, _ := filepath.Glob("*.txt")
    for _, match := range matches {
        fmt.Println(match)
    }
}
```

### SplitList

```go
// filepath.SplitList 分割路径为所有元素
func splitPathList(path string) []string {
    return filepath.SplitList(path)
}

// 使用示例
func pathElements(path string) {
    elements := filepath.SplitList(path)
    for i, elem := range elements {
        fmt.Printf("%d: %s\n", i, elem)
    }
}
```

## 最佳实践

::: tip 使用建议

1. **使用 filepath** - 跨平台路径处理
2. **错误处理** - 检查文件操作错误
3. **路径清理** - 使用 filepath.Clean
4. **相对路径** - 使用 filepath.Rel
5. **遍历控制** - 在 Walk 中返回错误停止

:::

```go
// ✅ 好的模式
func goodFileOps() error {
    // 使用 filepath 处理路径
    path := filepath.Join("dir", "file.txt")

    // 检查文件是否存在
    if _, err := os.Stat(path); os.IsNotExist(err) {
        return fmt.Errorf("file not found: %s", path)
    }

    // 打开文件
    file, err := os.Open(path)
    if err != nil {
        return err
    }
    defer file.Close()

    return nil
}

// ❌ 不好的模式
func badFileOps() {
    // 硬编码路径分隔符
    path := "dir\\file.txt"  // Windows only

    // 不检查错误
    file, _ := os.Open(path)
    _ = file
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **filepath** - 跨平台路径处理 |
| **Join** - 连接路径元素 |
| **Abs** - 绝对路径 |
| **Rel** - 相对路径 |
| **Walk** - 遍历目录树 |
| **Glob** - 模式匹配 |

::: v-pre

[格式化IO](./fmt-io.md) → [最佳实践](./io-best-practices.md)

:::
