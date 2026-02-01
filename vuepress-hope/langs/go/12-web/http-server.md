---
title: HTTP 服务
icon: ri:server-line
order: 2
---

# HTTP 服务

Go 的 `net/http` 标准库提供了强大的 HTTP 服务器支持，也可以选择丰富的 Web 框架。

## 标准库 HTTP 服务器

### 基本 HTTP 服务器

```go
package main

import (
    "fmt"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!\n")
    fmt.Fprintf(w, "Path: %s\n", r.URL.Path)
    fmt.Fprintf(w, "Method: %s\n", r.Method)
}

func main() {
    // 注册处理器
    http.HandleFunc("/", helloHandler)

    // 启动服务器
    fmt.Println("Server starting on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}
```

### http.ServeMux 路由

```go
func main() {
    mux := http.NewServeMux()

    // 精确匹配
    mux.HandleFunc("/", homeHandler)
    mux.HandleFunc("/api/users", usersHandler)

    // 前缀匹配
    mux.Handle("/static/", http.StripPrefix("/static/",
        http.FileServer(http.Dir("static"))))

    // 带超时的服务器
    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    log.Println("Server starting on :8080")
    if err := server.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}
```

### http.Handler 接口

```go
// 自定义 Handler
type MyHandler struct{}

func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Custom handler\n")

    // 检查方法
    switch r.Method {
    case "GET":
        h.handleGet(w, r)
    case "POST":
        h.handlePost(w, r)
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func (h *MyHandler) handleGet(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "GET request\n")
}

func (h *MyHandler) handlePost(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "POST request\n")
}

func main() {
    handler := &MyHandler{}

    // 使用自定义 Handler
    http.Handle("/custom", handler)

    http.ListenAndServe(":8080", nil)
}
```

## Gin 框架

### 基本 Gin 服务器

```go
import "github.com/gin-gonic/gin"

func main() {
    // 创建 Gin 引擎
    r := gin.Default()

    // 注册路由
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

    // 启动服务器
    r.Run(":8080")
}
```

### 路由分组

```go
func setupRoutes(r *gin.Engine) {
    // API v1
    v1 := r.Group("/api/v1")
    {
        v1.GET("/users", listUsersV1)
        v1.POST("/users", createUserV1)
    }

    // API v2
    v2 := r.Group("/api/v2")
    {
        v2.GET("/users", listUsersV2)
        v2.POST("/users", createUserV2)
    }

    // 认证中间件
    auth := r.Group("/api")
    auth.Use(AuthMiddleware())
    {
        auth.GET("/profile", getProfile)
        auth.POST("/profile", updateProfile)
    }
}
```

### 中间件链

```go
func setupMiddleware(r *gin.Engine) {
    // 全局中间件
    r.Use(LoggerMiddleware())
    r.Use(CORSMiddleware())
    r.Use(RecoveryMiddleware())

    // 路由级中间件
    authorized := r.Group("/api")
    authorized.Use(AuthMiddleware())
    {
        authorized.GET("/protected", protectedHandler)
    }
}
```

## Echo 框架

### 基本 Echo 服务器

```go
import "github.com/labstack/echo/v4"

func main() {
    // 创建 Echo 实例
    e := echo.New()

    // 中间件
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(middleware.CORS())

    // 路由
    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, "Hello, World!")
    })

    e.GET("/users/:id", getUser)

    // 启动服务器
    e.Logger.Fatal(e.Start(":8080"))
}

func getUser(c echo.Context) error {
    id := c.Param("id")
    return c.String(http.StatusOK, "User ID: "+id)
}
```

### Echo 中间件

```go
func CustomMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
        // 前置处理
        start := time.Now()

        // 调用下一个处理器
        if err := next(c); err != nil {
            return err
        }

        // 后置处理
        duration := time.Since(start)
        c.Response().Header().Set("X-Duration", duration.String())

        return nil
    }
}
```

## Fiber 框架

### 基本 Fiber 服务器

```go
import "github.com/gofiber/fiber/v2"

func main() {
    // 创建 Fiber 应用
    app := fiber.New(fiber.Config{
        Prefork:       true,
        CaseSensitive: true,
        StrictRouting: true,
    })

    // 中间件
    app.Use(logger.New())
    app.Use(cors.New())
    app.Use(recover.New())

    // 路由
    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World!")
    })

    app.Get("/users/:id", getUser)

    // 启动服务器
    app.Listen(":8080")
}

func getUser(c *fiber.Ctx) error {
    id := c.Params("id")
    return c.SendString("User ID: " + id)
}
```

## 框架选择

### 框架对比

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **net/http** | 标准库，无依赖 | 简单服务，学习 |
| **Gin** | 高性能，API友好 | RESTful API，微服务 |
| **Echo** | 极简，中间件丰富 | 高性能 API |
| **Fiber** | 基于 Fasthttp，极快 | 高性能场景 |
| **Chi** | 轻量，可组合 | 模块化设计 |

### 性能对比

```go
// benchmark 测试
func BenchmarkHandlers(b *testing.B) {
    b.Run("Gin", func(b *testing.B) {
        r := gin.New()
        r.GET("/ping", func(c *gin.Context) {
            c.JSON(200, gin.H{"message": "pong"})
        })

        w := httptest.NewRecorder()
        req, _ := http.NewRequest("GET", "/ping", nil)

        b.ResetTimer()
        for i := 0; i < b.N; i++ {
            r.ServeHTTP(w, req)
        }
    })

    b.Run("Echo", func(b *testing.B) {
        e := echo.New()
        e.GET("/ping", func(c echo.Context) error {
            return c.JSON(200, map[string]string{"message": "pong"})
        })

        for i := 0; i < b.N; i++ {
            w := httptest.NewRecorder()
            req, _ := http.NewRequest("GET", "/ping", nil)
            e.ServeHTTP(req, w)
        }
    })
}
```

## HTTP/2 支持

### 启用 HTTP/2

```go
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello over HTTP/2!")
    })

    // 配置 TLS
    server := &http.Server{
        Addr:    ":443",
        Handler: mux,
        TLSConfig: &tls.Config{
            MinVersion: tls.VersionTLS12,
        },
    }

    log.Println("HTTPS server starting on :443")
    if err := server.ListenAndServeTLS("cert.pem", "key.pem"); err != nil {
        log.Fatal(err)
    }
}
```

### HTTP/2 推送

```go
func pushHandler(w http.ResponseWriter, r *http.Request) {
    pusher, ok := w.(http.Pusher)
    if ok {
        // 推送资源
        pusher.Push("/static/style.css", nil)
        pusher.Push("/static/app.js", nil)
    }

    fmt.Fprintf(w, "Main content with pushed resources")
}
```

## 静态文件服务

### 文件服务器

```go
func main() {
    mux := http.NewServeMux()

    // 静态文件服务
    fs := http.FileServer(http.Dir("./static"))
    mux.Handle("/static/", http.StripPrefix("/static/", fs))

    // SPA 支持
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, http.FileServer(http.Dir("./static")).Open("./static/index.html"))
    })

    http.ListenAndServe(":8080", mux)
}
```

### 嵌入式静态资源

```go
import "embed"

//go:embed static/*
var staticFiles embed.FS

func main() {
    mux := http.NewServeMux()

    // 使用嵌入的文件系统
    fsys, err := fs.Sub(staticFiles, "static")
    if err != nil {
        log.Fatal(err)
    }

    fileServer := http.FileServer(http.FS(fsys))
    mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

    http.ListenAndServe(":8080", mux)
}
```

## 最佳实践

::: tip HTTP 服务建议

1. **超时设置** - 设置合理的超时时间
2. **优雅关闭** - 正确处理关闭信号
3. **中间件** - 使用中间件处理横切关注点
4. **日志记录** - 记录请求和响应
5. **错误处理** - 统一的错误处理

:::

```go
// ✅ 好的模式
func goodHTTPServer() *http.Server {
    mux := http.NewServeMux()

    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    return server
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **net/http** - 标准库支持 |
| **Gin** - 流行的 Web 框架 |
| **Echo** - 高性能框架 |
| **中间件** - 处理横切关注点 |
| **HTTP/2** - 支持最新协议 |

::: v-pre

[概述](./README.md) → [路由](./routing.md)

:::
