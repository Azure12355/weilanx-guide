---
title: Gin 框架
icon: ri:route-line
order: 2
---

# Gin 框架

Gin 是最流行的 Go Web 框架之一，提供高性能、API 友好的开发体验。

## 基本使用

### 创建 Gin 应用

```go
import "github.com/gin-gonic/gin"

func main() {
    // 创建 Gin 引擎（包含 Logger 和 Recovery 中间件）
    r := gin.Default()

    // 或创建空引擎
    // r := gin.New()

    // 启动服务器
    r.Run(":8080")
}
```

### 路由注册

```go
func setupRoutes(r *gin.Engine) {
    // GET 请求
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

    // POST 请求
    r.POST("/submit", func(c *gin.Context) {
        c.String(200, "POST request")
    })

    // PUT 请求
    r.PUT("/update", func(c *gin.Context) {
        c.String(200, "PUT request")
    })

    // DELETE 请求
    r.DELETE("/delete", func(c *gin.Context) {
        c.String(200, "DELETE request")
    })

    // 匹配所有方法
    r.Any("/any", func(c *gin.Context) {
        c.String(200, "Any method")
    })
}
```

## 路径参数

### 路径参数

```go
func pathParams(r *gin.Engine) {
    // 单个参数
    r.GET("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        c.String(200, "User ID: "+id)
    })

    // 多个参数
    r.GET("/users/:uid/posts/:pid", func(c *gin.Context) {
        uid := c.Param("uid")
        pid := c.Param("pid")
        c.String(200, "User: "+uid+", Post: "+pid)
    })

    // 通配符
    r.GET("/files/*filepath", func(c *gin.Context) {
        filepath := c.Param("filepath")
        c.String(200, "File: "+filepath)
    })
}
```

### 查询参数

```go
func queryParams(r *gin.Engine) {
    r.GET("/search", func(c *gin.Context) {
        // 获取查询参数
        keyword := c.Query("keyword")
        page := c.DefaultQuery("page", "1")
        limit := c.DefaultQuery("limit", "10")

        c.String(200, "Keyword: "+keyword+", Page: "+page)
    })

    // 数组参数
    r.GET("/filter", func(c *gin.Context) {
        tags := c.QueryArray("tags")
        c.JSON(200, tags)
    })

    // Map 参数
    r.GET("/params", func(c *gin.Context) {
        params := c.QueryMap("params")
        c.JSON(200, params)
    })
}
```

## 数据绑定

### JSON 绑定

```go
type User struct {
    Name  string `json:"name" binding:"required"`
    Email string `json:"email" binding:"required,email"`
    Age   int    `json:"age" binding:"min=1,max=120"`
}

func createUser(c *gin.Context) {
    var user User

    // 绑定 JSON
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, user)
}

// 路由
// r.POST("/users", createUser)
```

### 表单绑定

```go
type LoginForm struct {
    Username string `form:"username" binding:"required"`
    Password string `form:"password" binding:"required,min=6"`
}

func login(c *gin.Context) {
    var form LoginForm

    // 绑定表单
    if err := c.ShouldBind(&form); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    c.String(200, "Login: "+form.Username)
}

// 路由
// r.POST("/login", login)
```

### URI 绑定

```go
type URIParams struct {
    ID string `uri:"id" binding:"required"`
}

func getUser(c *gin.Context) {
    var params URIParams

    // 绑定 URI 参数
    if err := c.ShouldBindUri(&params); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    c.String(200, "User ID: "+params.ID)
}

// 路由
// r.GET("/users/:id", getUser)
```

### 查询参数绑定

```go
type QueryParams struct {
    Page    int    `form:"page" binding:"min=1"`
    Limit   int    `form:"limit" binding:"min=1,max=100"`
    Keyword string `form:"keyword"`
}

func search(c *gin.Context) {
    var params QueryParams

    // 绑定查询参数
    if err := c.ShouldBindQuery(&params); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, params)
}

// 路由
// r.GET("/search", search)
```

## 响应处理

### JSON 响应

```go
func jsonResponses(c *gin.Context) {
    // 基本 JSON
    c.JSON(200, gin.H{
        "message": "success",
        "data": map[string]int{
            "id":   1,
            "count": 10,
        },
    })

    // 结构体
    type User struct {
        ID    int    `json:"id"`
        Name  string `json:"name"`
    }
    c.JSON(200, User{ID: 1, Name: "Alice"})

    // 自定义状态码
    c.JSON(201, gin.H{"created": true})
}
```

### 其他响应

```go
func otherResponses(c *gin.Context) {
    // 字符串
    c.String(200, "Hello, World!")

    // HTML
    c.HTML(200, "index.html", gin.H{
        "title": "Home",
    })

    // XML
    c.XML(200, gin.H{"message": "success"})

    // YAML
    c.YAML(200, gin.H{"message": "success"})

    // 文件下载
    c.File("/files/file.txt")

    // 文件名
    c.FileAttachment("/files/file.txt", "custom_name.txt")

    // 重定向
    c.Redirect(302, "/login")

    // 纯文本
    c.Data(200, "text/plain", []byte("Hello"))
}
```

## 中间件

### 全局中间件

```go
func setupMiddleware(r *gin.Engine) {
    // 使用内置中间件
    r.Use(gin.Logger())
    r.Use(gin.Recovery())

    // 自定义中间件
    r.Use(CustomMiddleware())

    // 中间件配置
    r.Use gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
        return fmt.Sprintf("[%s] %s %s %d\n",
            param.TimeStamp.Format(time.RFC3339),
            param.Method,
            param.Path,
            param.StatusCode,
        )
    })
}
```

### 路由级中间件

```go
func routeMiddleware(r *gin.Engine) {
    // 认证中间件
    authorized := r.Group("/api")
    authorized.Use(AuthMiddleware())
    {
        authorized.GET("/profile", getProfile)
        authorized.POST("/profile", updateProfile)
    }

    // 管理员中间件
    admin := r.Group("/admin")
    admin.Use(AuthMiddleware(), AdminMiddleware())
    {
        admin.GET("/users", listAllUsers)
        admin.DELETE("/users/:id", deleteUser)
    }
}
```

### 自定义中间件

```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")

        if token == "" {
            c.JSON(401, gin.H{"error": "Authorization required"})
            c.Abort()
            return
        }

        // 验证 token
        userID, err := validateToken(token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // 存储用户信息
        c.Set("user_id", userID)
        c.Next()
    }
}

func LoggerMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()

        c.Next()

        latency := time.Since(start)
        status := c.Writer.Status()

        log.Printf("[%s] %s %s %d %v",
            c.Request.Method,
            c.Request.URL.Path,
            status,
            latency,
        )
    }
}
```

## 路由分组

### 基本分组

```go
func routeGroups(r *gin.Engine) {
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
}
```

### 分层分组

```go
func nestedGroups(r *gin.Engine) {
    // 用户子资源
    users := r.Group("/api/v1/users")
    {
        users.GET("", listUsers)
        users.POST("", createUser)
        users.GET("/:id", getUser)

        // 用户文章
        posts := users.Group(":id/posts")
        {
            posts.GET("", listUserPosts)
            posts.POST("", createUserPost)
            posts.GET("/:post_id", getUserPost)
        }
    }
}
```

## 文件上传

### 单文件上传

```go
func uploadFile(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    // 保存文件
    dst := "./uploads/" + file.Filename
    if err := c.SaveUploadedFile(file, dst); err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{
        "message": "File uploaded",
        "filename": file.Filename,
    })
}

// 路由
// r.POST("/upload", uploadFile)
```

### 多文件上传

```go
func uploadFiles(c *gin.Context) {
    form, err := c.MultipartForm()
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    files := form.File["files"]
    uploaded := make([]string, 0)

    for _, file := range files {
        dst := "./uploads/" + file.Filename
        if err := c.SaveUploadedFile(file, dst); err != nil {
            continue
        }
        uploaded = append(uploaded, file.Filename)
    }

    c.JSON(200, gin.H{
        "message": "Files uploaded",
        "files": uploaded,
    })
}

// 路由
// r.POST("/uploads", uploadFiles)
```

## 静态文件

### 静态文件服务

```go
func staticFiles(r *gin.Engine) {
    // 静态文件
    r.Static("/static", "./static")
    r.StaticFile("/favicon.ico", "./resources/favicon.ico")

    // 使用 StaticFS
    r.StaticFS("/static2", http.Dir("./static"))
}
```

## 最佳实践

::: tip Gin 使用建议

1. **使用分组** - 组织路由结构
2. **中间件** - 处理横切关注点
3. **数据验证** - 使用 binding 标签
4. **错误处理** - 统一的错误响应
5. **日志记录** - 记录请求和响应

:::

```go
// ✅ 好的模式
func goodGinApp() {
    r := gin.Default()

    // 使用分组
    api := r.Group("/api/v1")
    {
        api.GET("/users", listUsers)
        api.POST("/users", createUser)
    }

    r.Run(":8080")
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **路由** - GET、POST、PUT、DELETE |
| **参数** - 路径参数、查询参数 |
| **绑定** - ShouldBindJSON、ShouldBind |
| **响应** - JSON、String、HTML |
| **中间件** - 全局、路由级 |

::: v-pre

[概述](./README.md) → [Echo](./echo.md)

:::
