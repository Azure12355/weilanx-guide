---
title: 路由设计
icon: ri:route-line
order: 3
---

# 路由设计

良好的路由设计让 API 更清晰、更易用。

## RESTful 设计

### 资源路由

```go
func setupRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")

    // 用户资源
    users := api.Group("/users")
    {
        users.GET("", listUsers)        // 列出用户
        users.POST("", createUser)      // 创建用户
        users.GET("/:id", getUser)       // 获取用户
        users.PUT("/:id", updateUser)    // 更新用户
        users.DELETE("/:id", deleteUser) // 删除用户
    }

    // 用户子资源
    user := api.Group("/users/:id")
    {
        user.GET("/posts", listUserPosts)    // 用户的文章
        user.POST("/posts", createUserPost) // 为用户创建文章
    }
}
```

### 路由命名规范

```go
// ✅ 好的命名
func goodRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        api.GET("/users", listUsers)           // GET /api/v1/users
        api.GET("/users/:id", getUser)          // GET /api/v1/users/123
        api.POST("/users", createUser)          // POST /api/v1/users
        api.PUT("/users/:id", updateUser)       // PUT /api/v1/users/123
        api.DELETE("/users/:id", deleteUser)    // DELETE /api/v1/users/123
    }
}

// ❌ 不好的命名
func badRoutes(r *gin.Engine) {
    api := r.Group("/api")
    {
        api.Get("/user", listUsers)           // 不一致
        api.Get("/getUser", getUser)          // 动词开头
        api.Post("/createUser", createUser)   // 动词开头
    }
}
```

## 路径参数

### 单参数

```go
func getUser(c *gin.Context) {
    // 获取路径参数
    id := c.Param("id")

    user, err := userService.Get(id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            c.JSON(404, gin.H{"error": "User not found"})
        } else {
            c.JSON(500, gin.H{"error": "Internal error"})
        }
        return
    }

    c.JSON(200, user)
}
```

### 多参数

```go
func getOrderItem(c *gin.Context) {
    // 获取多个路径参数
    orderID := c.Param("orderId")
    itemID := c.Param("itemId")

    item, err := orderService.GetItem(orderID, itemID)
    if err != nil {
        c.JSON(404, gin.H{"error": "Item not found"})
        return
    }

    c.JSON(200, item)
}

// 路由定义
// GET /orders/:orderId/items/:itemId
```

### 通配符

```go
func setupWildcardRoutes(r *gin.Engine) {
    // 通配符路由
    r.GET("/files/*filepath", func(c *gin.Context) {
        filepath := c.Param("filepath")
        c.String(200, "File path: %s", filepath)
    })

    // 匹配 /files/foo/bar.txt
    // filepath = "foo/bar.txt"
}
```

## 查询参数

### 基本查询参数

```go
func listUsers(c *gin.Context) {
    // 获取查询参数
    page := c.DefaultQuery("page", "1")
    limit := c.DefaultQuery("limit", "10")
    sort := c.Query("sort")

    // 转换参数
    pageNum, _ := strconv.Atoi(page)
    limitNum, _ := strconv.Atoi(limit)

    // 查询用户
    users := userService.List(pageNum, limitNum, sort)
    c.JSON(200, users)
}

// GET /api/v1/users?page=2&limit=20&sort=name
```

### 数组查询参数

```go
func searchProducts(c *gin.Context) {
    // 获取数组参数
    categories := c.QueryArray("category")
    tags := c.QueryArray("tag")

    // 搜索产品
    products := productService.Search(categories, tags)
    c.JSON(200, products)
}

// GET /api/v1/products?category=electronics&category=books&tag=new&tag=sale
```

### 地图查询参数

```go
func filterUsers(c *gin.Context) {
    // 获取 map 参数
    filters := c.QueryMap("filter")

    // filters: {"age": "25", "status": "active"}

    users := userService.Filter(filters)
    c.JSON(200, users)
}

// GET /api/v1/users?filter[age]=25&filter[status]=active
```

## 中间件

### 日志中间件

```go
func LoggerMiddleware(logger *zap.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        path := c.Request.URL.Path
        query := c.Request.URL.RawQuery

        c.Next()

        latency := time.Since(start)
        status := c.Writer.Status()

        logger.Info("Request",
            zap.String("method", c.Request.Method),
            zap.String("path", path),
            zap.String("query", query),
            zap.Int("status", status),
            zap.Duration("latency", latency),
            zap.String("ip", c.ClientIP()),
        )
    }
}
```

### 恢复中间件

```go
func RecoveryMiddleware(logger *zap.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        defer func() {
            if r := recover(); r != nil {
                logger.Error("Panic recovered",
                    zap.Any("error", r),
                    zap.String("path", c.Request.URL.Path),
                    zap.Stack("stack"),
                )

                c.JSON(500, gin.H{
                    "error": "Internal server error",
                })
            }
        }()

        c.Next()
    }
}
```

### 认证中间件

```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")

        if token == "" {
            c.JSON(401, gin.H{
                "error": "Authorization header required",
            })
            c.Abort()
            return
        }

        // 验证 token
        claims, err := validateToken(token)
        if err != nil {
            c.JSON(401, gin.H{
                "error": "Invalid token",
            })
            c.Abort()
            return
        }

        // 存储用户信息
        c.Set("user_id", claims.UserID)
        c.Set("user_role", claims.Role)

        c.Next()
    }
}
```

### CORS 中间件

```go
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

## 路由分组

### 版本分组

```go
func setupVersionedRoutes(r *gin.Engine) {
    // API v1
    v1 := r.Group("/api/v1")
    setupV1Routes(v1)

    // API v2
    v2 := r.Group("/api/v2")
    setupV2Routes(v2)
}

func setupV1Routes(r *gin.RouterGroup) {
    r.GET("/users", listUsersV1)
    r.POST("/users", createUserV1)
}

func setupV2Routes(r *gin.RouterGroup) {
    r.GET("/users", listUsersV2)
    r.POST("/users", createUserV2)
}
```

### 认证分组

```go
func setupAuthRoutes(r *gin.Engine) {
    // 公开路由
    public := r.Group("/api")
    {
        public.POST("/login", login)
        public.POST("/register", register)
    }

    // 需要认证的路由
    auth := r.Group("/api")
    auth.Use(AuthMiddleware())
    {
        auth.GET("/profile", getProfile)
        auth.PUT("/profile", updateProfile)
        auth.GET("/settings", getSettings)
        auth.PUT("/settings", updateSettings)
    }
}
```

### 管理员分组

```go
func setupAdminRoutes(r *gin.Engine) {
    admin := r.Group("/admin")
    admin.Use(AuthMiddleware())
    admin.Use(AdminOnlyMiddleware())
    {
        admin.GET("/users", adminListUsers)
        admin.DELETE("/users/:id", adminDeleteUser)
        admin.GET("/stats", adminGetStats)
    }
}
```

## 路由组织

### 模块化路由

```go
// routes/user.go
package routes

func RegisterUserRoutes(r *gin.RouterGroup, userService *service.UserService) {
    userHandler := handler.NewUserHandler(userService)

    users := r.Group("/users")
    {
        users.GET("", userHandler.List)
        users.POST("", userHandler.Create)
        users.GET("/:id", userHandler.Get)
        users.PUT("/:id", userHandler.Update)
        users.DELETE("/:id", userHandler.Delete)
    }
}

// routes/order.go
package routes

func RegisterOrderRoutes(r *gin.RouterGroup, orderService *service.OrderService) {
    orderHandler := handler.NewOrderHandler(orderService)

    orders := r.Group("/orders")
    {
        orders.GET("", orderHandler.List)
        orders.POST("", orderHandler.Create)
        orders.GET("/:id", orderHandler.Get)
        orders.PUT("/:id", orderHandler.Update)
    }
}

// main.go
func main() {
    r := gin.Default()

    api := r.Group("/api/v1")

    // 注册模块路由
    routes.RegisterUserRoutes(api, userService)
    routes.RegisterOrderRoutes(api, orderService)

    r.Run(":8080")
}
```

## 最佳实践

::: tip 路由设计建议

1. **RESTful** - 遵循 REST 设计原则
2. **版本控制** - 使用 /api/v1 前缀
3. **名词复数** - 使用 users 而非 user
4. **层级清晰** - /users/:id/posts 而非 /user_posts
5. **HTTP 方法** - 正确使用 GET/POST/PUT/DELETE

:::

```go
// ✅ 好的设计
func goodRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        api.GET("/users", listUsers)           // 列出
        api.POST("/users", createUser)          // 创建
        api.GET("/users/:id", getUser)          // 获取
        api.PUT("/users/:id", updateUser)       // 更新
        api.DELETE("/users/:id", deleteUser)    // 删除
    }
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **RESTful** - 资源导向的设计 |
| **路径参数** - :id 形式的参数 |
| **查询参数** - ?key=value 格式 |
| **中间件** - 处理横切关注点 |
| **路由分组** - 模块化组织路由 |

::: v-pre

[HTTP服务](./http-server.md) → [验证](./validation.md)

:::
