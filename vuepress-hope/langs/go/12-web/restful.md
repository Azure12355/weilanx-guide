---
title: RESTful 设计
icon: ri:rest-time-line
order: 4
---

# RESTful 设计

RESTful API 设计提供清晰、一致、易于使用的接口。

## 设计原则

### 资源导向

```go
// ✅ 好的设计：资源导向
func setupResourceRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        // 用户资源
        api.GET("/users", listUsers)           // 列出用户
        api.POST("/users", createUser)          // 创建用户
        api.GET("/users/:id", getUser)          // 获取用户
        api.PUT("/users/:id", updateUser)       // 更新用户
        api.DELETE("/users/:id", deleteUser)    // 删除用户

        // 用户子资源
        api.GET("/users/:id/posts", listUserPosts)
        api.POST("/users/:id/posts", createUserPost)
    }
}

// ❌ 不好的设计：动词导向
func setupActionRoutes(r *gin.Engine) {
    api := r.Group("/api")
    {
        api.Get("/listUsers", listUsers)        // 不规范
        api.Post("/createUser", createUser)     // 不规范
        api.Post("/deleteUser", deleteUser)    // 不规范
    }
}
```

### HTTP 方法语义

```go
// 标准 HTTP 方法语义
func methodSemantics(r *gin.Engine) {
    users := r.Group("/api/v1/users")

    // GET - 获取资源（不修改服务器状态）
    users.GET("/:id", getUser)

    // POST - 创建子资源
    users.POST("", createUser)

    // PUT - 完整更新资源
    users.PUT("/:id", updateUser)

    // PATCH - 部分更新资源
    users.PATCH("/:id", patchUser)

    // DELETE - 删除资源
    users.DELETE("/:id", deleteUser)
}
```

## URL 设计

### URL 规范

```go
// ✅ 好的 URL 设计
func goodURLs(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        // 使用复数名词
        api.GET("/users", listUsers)
        api.GET("/users/:id", getUser)

        // 使用小写字母
        api.GET("/users/:id/orders", getUserOrders)

        // 使用连字符分隔
        api.GET("/active-users", getActiveUsers)

        // 层级结构清晰
        api.GET("/users/:id/posts/:post_id", getUserPost)
    }
}

// ❌ 不好的 URL 设计
func badURLs(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        // 使用动词
        api.GET("/getUsers", listUsers)

        // 使用大写字母
        api.GET("/Users", listUsers)

        // 使用下划线
        api.GET("/user_orders", getUserOrders)

        // 层级过深
        api.GET("/users/:id/posts/:post_id/comments/:comment_id", getComment)
    }
}
```

### 查询参数

```go
func queryParameters(r *gin.Engine) {
    api := r.Group("/api/v1/users")
    {
        // 分页
        api.GET("", listUsers)
        // ?page=2&limit=20&sort=name&order=asc

        // 搜索
        api.GET("/search", searchUsers)
        // ?q=alice&age_min=18&age_max=65

        // 过滤
        api.GET("/filter", filterUsers)
        // ?status=active&role=admin

        // 字段选择
        api.GET("/:id", getUser)
        // ?fields=id,name,email
    }
}

func listUsers(c *gin.Context) {
    page := c.DefaultQuery("page", "1")
    limit := c.DefaultQuery("limit", "20")
    sort := c.Query("sort")
    order := c.Query("order", "asc")

    // 转换和验证
    pageNum, _ := strconv.Atoi(page)
    limitNum, _ := strconv.Atoi(limit)

    users := userService.List(pageNum, limitNum, sort, order)
    c.JSON(200, users)
}
```

## 状态码

### 常用状态码

```go
func statusCodes(c *gin.Context) {
    // 2xx 成功
    // 200 OK - 请求成功
    // 201 Created - 资源创建成功
    // 204 No Content - 请求成功，无返回内容

    // 3xx 重定向
    // 301 Moved Permanently - 永久重定向
    // 304 Not Modified - 资源未修改

    // 4xx 客户端错误
    // 400 Bad Request - 请求参数错误
    // 401 Unauthorized - 未认证
    // 403 Forbidden - 无权限
    // 404 Not Found - 资源不存在
    // 409 Conflict - 资源冲突
    // 422 Unprocessable Entity - 验证失败
    // 429 Too Many Requests - 请求过多

    // 5xx 服务器错误
    // 500 Internal Server Error - 服务器错误
    // 503 Service Unavailable - 服务不可用
}

func getUser(c *gin.Context) {
    id := c.Param("id")

    user, err := userService.Get(id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            c.JSON(404, gin.H{
                "error": "User not found",
            })
            return
        }
        c.JSON(500, gin.H{
            "error": "Internal server error",
        })
        return
    }

    c.JSON(200, user)
}
```

## 响应格式

### 统一响应

```go
// 统一响应结构
type APIResponse struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data,omitempty"`
    Error   *ErrorInfo  `json:"error,omitempty"`
    Meta    *MetaInfo   `json:"meta,omitempty"`
}

type ErrorInfo struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Details string `json:"details,omitempty"`
}

type MetaInfo struct {
    Page       int `json:"page"`
    PageSize   int `json:"page_size"`
    TotalCount int `json:"total_count"`
    TotalPages int `json:"total_pages"`
}

// 成功响应
func Success(c *gin.Context, data interface{}) {
    c.JSON(200, APIResponse{
        Success: true,
        Data:    data,
    })
}

// 分页响应
func SuccessWithMeta(c *gin.Context, data interface{}, meta *MetaInfo) {
    c.JSON(200, APIResponse{
        Success: true,
        Data:    data,
        Meta:    meta,
    })
}

// 错误响应
func Error(c *gin.Context, status int, code, message string) {
    c.JSON(status, APIResponse{
        Success: false,
        Error: &ErrorInfo{
            Code:    code,
            Message: message,
        },
    })
}
```

## 版本控制

### URL 版本

```go
func versionedAPI(r *gin.Engine) {
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

### Header 版本

```go
func headerVersion(r *gin.Engine) {
    api := r.Group("/api")
    {
        api.GET("/users, func(c *gin.Context) {
            version := c.Request.Header.Get("API-Version")

            switch version {
            case "v2":
                listUsersV2(c)
            default:
                listUsersV1(c)
            }
        })
    }
}
```

## HATEOAS

### 超媒体

```go
type UserWithLinks struct {
    ID    string          `json:"id"`
    Name  string          `json:"name"`
    Links []ResourceLink   `json:"links"`
}

type ResourceLink struct {
    Rel  string `json:"rel"`
    Href string `json:"href"`
    Type string `json:"type,omitempty"`
}

func getUserWithLinks(c *gin.Context) {
    id := c.Param("id")
    user := userService.Get(id)

    response := UserWithLinks{
        ID:   user.ID,
        Name: user.Name,
        Links: []ResourceLink{
            {
                Rel:  "self",
                Href: "/api/v1/users/" + id,
            },
            {
                Rel:  "posts",
                Href: "/api/v1/users/" + id + "/posts",
            },
            {
                Rel:  "update",
                Href: "/api/v1/users/" + id,
                Type: "PUT",
            },
        },
    }

    c.JSON(200, response)
}
```

## 最佳实践

::: tip RESTful 设计建议

1. **名词复数** - 使用 /users 而非 /user
2. **层级清晰** - /users/:id/posts 而非 /user_posts
3. **HTTP 方法** - 正确使用 GET/POST/PUT/DELETE
4. **状态码** - 返回正确的状态码
5. **统一响应** - 使用一致的响应格式

:::

```go
// ✅ 好的设计
func goodRESTful(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        api.GET("/users", listUsers)
        api.POST("/users", createUser)
        api.GET("/users/:id", getUser)
        api.PUT("/users/:id", updateUser)
        api.DELETE("/users/:id", deleteUser)
    }
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **资源** - 名词复数形式 |
| **URL** - 小写、连字符分隔 |
| **方法** - 正确的 HTTP 语义 |
| **状态码** - 准确的状态码 |
| **版本** - URL 或 Header 版本控制 |

::: v-pre

[Echo](./echo.md) → [中间件](./middleware.md)

:::
