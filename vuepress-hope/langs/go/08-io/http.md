---
title: HTTP处理
icon: ri:global-line
order: 7
---

# HTTP处理

net/http 包提供了 HTTP 客户端和服务器实现。

## HTTP 客户端

### 基本请求

```go
import "net/http"

// GET 请求
resp, err := http.Get("https://example.com")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

body, err := io.ReadAll(resp.Body)
if err != nil {
    log.Fatal(err)
}

fmt.Println(string(body))
```

### POST 请求

```go
// POST JSON 数据
data := map[string]string{
    "name":  "Alice",
    "email": "alice@example.com",
}

jsonData, _ := json.Marshal(data)
resp, err := http.Post("https://example.com/api/users", "application/json", bytes.NewBuffer(jsonData))
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
```

### 自定义请求

```go
// 创建自定义请求
req, err := http.NewRequest("GET", "https://example.com", nil)
if err != nil {
    log.Fatal(err)
}

// 设置请求头
req.Header.Set("Authorization", "Bearer token")
req.Header.Set("Accept", "application/json")

// 发送请求
client := &http.Client{}
resp, err := client.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
```

### 超时控制

```go
// 创建带超时的客户端
client := &http.Client{
    Timeout: 10 * time.Second,
}

resp, err := client.Get("https://example.com")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
```

## HTTP 服务器

### 基本服务器

```go
// 简单的 HTTP 服务器
func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/", handler)
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### 路由处理

```go
// 多路径处理
func main() {
    // 根路径
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Home Page")
    })

    // 用户路径
    http.HandleFunc("/users/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Users Page")
    })

    // API 路径
    http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "API Page")
    })

    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### 请求方法

```go
func handler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case "GET":
        // 处理 GET
    case "POST":
        // 处理 POST
    case "PUT":
        // 处理 PUT
    case "DELETE":
        // 处理 DELETE
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}
```

### 请求信息

```go
func handler(w http.ResponseWriter, r *http.Request) {
    // 获取请求方法
    method := r.Method

    // 获取请求路径
    path := r.URL.Path

    // 获取查询参数
    query := r.URL.Query()
    name := query.Get("name")

    // 获取请求头
    userAgent := r.Header.Get("User-Agent")

    // 获取表单数据
    r.ParseForm()
    username := r.FormValue("username")

    fmt.Fprintf(w, "Method: %s, Path: %s", method, path)
}
```

## 响应处理

### 设置响应头

```go
func handler(w http.ResponseWriter, r *http.Request) {
    // 设置响应头
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Access-Control-Allow-Origin", "*")

    // 写入响应
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"message":"Hello"}`))
}
```

### JSON 响应

```go
type Response struct {
    Message string `json:"message"`
    Data    any    `json:"data,omitempty"`
}

func jsonHandler(w http.ResponseWriter, r *http.Request) {
    // 设置响应头
    w.Header().Set("Content-Type", "application/json")

    // 创建响应
    resp := Response{
        Message: "Success",
        Data:    struct{Name string}{Name: "Alice"},
    }

    // 编码 JSON
    encoder := json.NewEncoder(w)
    if err := encoder.Encode(resp); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}
```

### 错误处理

```go
func errorHandler(w http.ResponseWriter, r *http.Request) {
    // 路径参数
    id := r.URL.Path[len("/users/"):]
    if id == "" {
        http.Error(w, "User ID required", http.StatusBadRequest)
        return
    }

    // 查找用户
    user, err := findUser(id)
    if err != nil {
        if err == ErrUserNotFound {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // 返回用户
    json.NewEncoder(w).Encode(user)
}
```

## 文件服务

### 静态文件

```go
// 静态文件服务器
func main() {
    // 静态文件目录
    fs := http.FileServer(http.Dir("static"))

    // 注册处理器
    http.Handle("/", fs)

    // 自定义处理器
    http.HandleFunc("/api/", apiHandler)

    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### 文件上传

```go
func uploadHandler(w http.ResponseWriter, r *http.Request) {
    // 解析表单
    err := r.ParseMultipartForm(32 << 20) // 32MB
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // 获取文件
    file, handler, err := r.FormFile("file")
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    defer file.Close()

    // 保存文件
    dst, err := os.Create("uploads/" + handler.Filename)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer dst.Close()

    if _, err := io.Copy(dst, file); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    fmt.Fprintf(w, "File uploaded: %s", handler.Filename)
}
```

### 文件下载

```go
func downloadHandler(w http.ResponseWriter, r *http.Request) {
    filename := r.URL.Query().Get("file")
    if filename == "" {
        http.Error(w, "File name required", http.StatusBadRequest)
        return
    }

    // 打开文件
    file, err := os.Open("files/" + filename)
    if err != nil {
        http.Error(w, "File not found", http.StatusNotFound)
        return
    }
    defer file.Close()

    // 获取文件信息
    info, _ := file.Stat()
    contentType := "application/octet-stream"

    // 设置响应头
    w.Header().Set("Content-Type", contentType)
    w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
    w.Header().Set("Content-Length", fmt.Sprint(info.Size()))

    // 发送文件
    io.Copy(w, file)
}
```

## 中间件

### 日志中间件

```go
func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        // 调用下一个处理器
        next(w, r)

        // 记录日志
        log.Printf("%s %s %s",
            r.Method,
            r.RequestURI,
            time.Since(start),
        )
    }
}
```

### 认证中间件

```go
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // 获取 token
        token := r.Header.Get("Authorization")
        if token == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // 验证 token
        if !validateToken(token) {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // 调用下一个处理器
        next(w, r)
    }
}
```

### CORS 中间件

```go
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // 设置 CORS 头
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        // 处理 OPTIONS 请求
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        // 调用下一个处理器
        next(w, r)
    }
}
```

## 最佳实践

::: tip 使用建议

1. **使用 defer** - 确保响应体被关闭
2. **设置超时** - 避免长时间挂起
3. **错误处理** - 正确处理各种错误
4. **资源清理** - 及时关闭文件和网络连接
5. **安全性** - 验证输入，设置安全头

:::

```go
// ✅ 好的模式
func goodHandler(w http.ResponseWriter, r *http.Request) {
    // 检查方法
    if r.Method != http.MethodGet {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // 处理请求
    data, err := processData(r)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // 返回响应
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}

// ❌ 不好的模式
func badHandler(w http.ResponseWriter, r *http.Request) {
    // 没有错误处理
    data, _ := processData(r)

    // 没有设置响应头
    fmt.Fprintf(w, "%v", data)
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **http.Get** - GET 请求 |
| **http.Post** - POST 请求 |
| **NewRequest** - 自定义请求 |
| **HandleFunc** - 注册处理器 |
| **ResponseWriter** - 响应写入 |
| **http.Error** - 错误响应 |

::: v-pre

[JSON处理](./json.md) → [IO最佳实践](./io-best-practices.md)

:::
