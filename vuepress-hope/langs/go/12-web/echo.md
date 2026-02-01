---
title: Echo 框架
icon: ri:flask-line
order: 3
---

# Echo 框架

Echo 是一个高性能、极简的 Go Web 框架，专注于核心功能。

## 基本使用

### 创建 Echo 应用

```go
import "github.com/labstack/echo/v4"
import "github.com/labstack/echo/v4/middleware"

func main() {
    // 创建 Echo 实例
    e := echo.New()

    // 中间件
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(middleware.CORS())

    // 启动服务器
    e.Logger.Fatal(e.Start(":8080"))
}
```

### 路由注册

```go
func setupRoutes(e *echo.Echo) {
    // GET 请求
    e.GET("/", func(c echo.Context) error {
        return c.String(200, "Hello, World!")
    })

    // POST 请求
    e.POST("/submit", func(c echo.Context) error {
        return c.String(200, "POST request")
    })

    // PUT 请求
    e.PUT("/update", func(c echo.Context) error {
        return c.String(200, "PUT request")
    })

    // DELETE 请求
    e.DELETE("/delete", func(c echo.Context) error {
        return c.String(200, "DELETE request")
    })

    // 匹配所有方法
    e.Any("/any", func(c echo.Context) error {
        return c.String(200, "Any method")
    })
}
```

## 路径参数

### 路径参数

```go
func pathParams(e *echo.Echo) {
    // 单个参数
    e.GET("/users/:id", func(c echo.Context) error {
        id := c.Param("id")
        return c.String(200, "User ID: "+id)
    })

    // 多个参数
    e.GET("/users/:uid/posts/:pid", func(c echo.Context) error {
        uid := c.Param("uid")
        pid := c.Param("pid")
        return c.String(200, "User: "+uid+", Post: "+pid)
    })
}
```

### 查询参数

```go
func queryParams(e *echo.Echo) {
    e.GET("/search", func(c echo.Context) error {
        // 获取查询参数
        keyword := c.QueryParam("keyword")
        page := c.QueryParam("page", "1")
        limit := c.QueryParam("limit", "10")

        return c.String(200, "Keyword: "+keyword+", Page: "+page)
    })
}
```

## 数据绑定

### JSON 绑定

```go
type User struct {
    Name  string `json:"name" validate:"required"`
    Email string `json:"email" validate:"required,email"`
}

func createUser(c echo.Context) error {
    var user User

    // 绑定 JSON
    if err := c.Bind(&user); err != nil {
        return c.JSON(400, map[string]string{
            "error": err.Error(),
        })
    }

    return c.JSON(200, user)
}
```

### 表单绑定

```go
type LoginForm struct {
    Username string `form:"username" validate:"required"`
    Password string `form:"password" validate:"required,min=6"`
}

func login(c echo.Context) error {
    var form LoginForm

    // 绑定表单
    if err := c.Bind(&form); err != nil {
        return c.JSON(400, map[string]string{
            "error": err.Error(),
        })
    }

    return c.String(200, "Login: "+form.Username)
}
```

## 中间件

### 使用内置中间件

```go
import "github.com/labstack/echo/v4/middleware"

func setupMiddleware(e *echo.Echo) {
    // 日志中间件
    e.Use(middleware.Logger())

    // 恢复中间件
    e.Use(middleware.Recover())

    // CORS 中间件
    e.Use(middleware.CORS())

    // 安全头
    e.Use(middleware.Secure())

    // 请求 ID
    e.Use(middleware.RequestID())

    // 限流
    e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20, 1*time.Minute)))

    // 超时
    e.Use(middleware.Timeout(60 * time.Second))
}
```

### 自定义中间件

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

// 使用
// e.Use(CustomMiddleware)
```

### 认证中间件

```go
func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
        token := c.Request().Header.Get("Authorization")

        if token == "" {
            return c.JSON(401, map[string]string{
                "error": "Authorization required",
            })
        }

        // 验证 token
        userID, err := validateToken(token)
        if err != nil {
            return c.JSON(401, map[string]string{
                "error": "Invalid token",
            })
        }

        // 存储用户信息
        c.Set("user_id", userID)
        return next(c)
    }
}

// 使用
// e.Use(AuthMiddleware)
```

## 响应处理

### JSON 响应

```go
func jsonResponses(c echo.Context) error {
    // 基本 JSON
    return c.JSON(200, map[string]interface{}{
        "message": "success",
        "data": map[string]int{
            "id":   1,
            "count": 10,
        },
    })

    // JSON Pretty Print
    return c.JSONPretty(200, map[string]string{
        "message": "Hello, Echo!",
    }, "  ")
}
```

### 其他响应

```go
func otherResponses(c echo.Context) error {
    // 字符串
    return c.String(200, "Hello, World!")

    // HTML
    return c.HTML(200, "index.html", map[string]string{
        "title": "Home",
    })

    // XML
    return c.XML(200, map[string]string{
        "message": "success",
    })

    // 文件
    return c.File("/files/file.txt")

    // 附件
    return c.Attachment("/files/file.txt", "custom_name.txt")

    // Blob
    return c.Blob(200, []byte("Hello"))

    // 流
    return c.Stream(200, "application/octet-stream", func(w io.Writer) error {
        fmt.Fprintf(w, "Streaming data")
        return nil
    })

    // 重定向
    return c.Redirect(302, "/login")

    // 无内容
    return c.NoContent(204)
}
```

## 路由分组

### 基本分组

```go
func routeGroups(e *echo.Echo) {
    // API v1
    v1 := e.Group("/api/v1")
    {
        v1.GET("/users", listUsersV1)
        v1.POST("/users", createUserV1)
    }

    // API v2
    v2 := e.Group("/api/v2")
    {
        v2.GET("/users", listUsersV2)
        v2.POST("/users", createUserV2)
    }
}
```

### 嵌套分组

```go
func nestedGroups(e *echo.Echo) {
    // 用户子资源
    users := e.Group("/api/v1/users")
    {
        users.GET("", listUsers)
        users.POST("", createUser)
        users.GET("/:id", getUser)

        // 用户文章
        posts := users.Group(":id/posts")
        {
            posts.GET("", listUserPosts)
            posts.POST("", createUserPost)
        }
    }
}
```

## 静态文件

### 静态文件服务

```go
func staticFiles(e *echo.Echo) {
    // 静态文件
    e.Static("/static", "static")

    // 单个文件
    e.File("/favicon.ico", "resources/favicon.ico")

    // 使用 http.FileServer
    e.GET("/files/*", func(c echo.Context) error {
        return echo.FileServer("files")(c)
    })
}
```

## 文件上传

### 单文件上传

```go
func uploadFile(c echo.Context) error {
    // 获取文件
    file, err := c.FormFile("file")
    if err != nil {
        return c.JSON(400, map[string]string{
            "error": err.Error(),
        })
    }

    // 打开源文件
    src, err := file.Open()
    if err != nil {
        return err
    }
    defer src.Close()

    // 创建目标文件
    dst, err := os.Create("uploads/" + file.Filename)
    if err != nil {
        return err
    }
    defer dst.Close()

    // 复制文件
    if _, err = io.Copy(dst, src); err != nil {
        return err
    }

    return c.JSON(200, map[string]string{
        "message": "File uploaded",
        "filename": file.Filename,
    })
}

// 路由
// e.POST("/upload", uploadFile)
```

### 多文件上传

```go
func uploadFiles(c echo.Context) error {
    // 获取表单
    form, err := c.MultipartForm()
    if err != nil {
        return err
    }

    files := form.File["files"]
    uploaded := make([]string, 0)

    for _, file := range files {
        src, err := file.Open()
        if err != nil {
            continue
        }
        defer src.Close()

        dst, err := os.Create("uploads/" + file.Filename)
        if err != nil {
            continue
        }
        defer dst.Close()

        if _, err = io.Copy(dst, src); err == nil {
            uploaded = append(uploaded, file.Filename)
        }
    }

    return c.JSON(200, map[string]interface{}{
        "message": "Files uploaded",
        "files": uploaded,
    })
}
```

## 错误处理

### 自定义错误

```go
type APIError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
}

func (e *APIError) Error() string {
    return e.Message
}

// 错误处理器
func customHTTPErrorHandler(err error, c echo.Context) {
    var (
        code = http.StatusInternalServerError
        msg  interface{}
    )

    if he, ok := err.(*HTTPError); ok {
        code = he.Code
        msg = he.Message
    } else if apiErr, ok := err.(*APIError); ok {
        code = apiErr.Code
        msg = apiErr.Message
    } else {
        msg = err.Error()
    }

    c.JSON(code, map[string]interface{}{
        "error": msg,
    })
}

// 设置自定义错误处理器
// e.HTTPErrorHandler = customHTTPErrorHandler
```

## 最佳实践

::: tip Echo 使用建议

1. **使用分组** - 组织路由结构
2. **中间件** - 处理横切关注点
3. **数据验证** - 使用 validate 标签
4. **错误处理** - 自定义错误处理器
5. **日志记录** - 使用 Logger 中间件

:::

```go
// ✅ 好的模式
func goodEchoApp() {
    e := echo.New()

    // 配置中间件
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(middleware.CORS())

    // 使用分组
    api := e.Group("/api/v1")
    {
        api.GET("/users", listUsers)
        api.POST("/users", createUser)
    }

    e.Logger.Fatal(e.Start(":8080"))
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **路由** - GET、POST、PUT、DELETE |
| **参数** - Param、QueryParam |
| **绑定** - Bind 方法 |
| **响应** - JSON、String、HTML |
| **中间件** - 内置和自定义 |

::: v-pre

[Gin](./gin.md) → [RESTful](./restful.md)

:::
