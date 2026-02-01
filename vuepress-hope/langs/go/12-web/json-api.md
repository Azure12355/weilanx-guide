---
title: JSON API
icon: ri:braces-line
order: 5
---

# JSON API

良好的 JSON API 设计提供清晰、一致的接口。

## JSON 序列化

### 基本序列化

```go
import "encoding/json"

type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"-"` // 忽略
}

func main() {
    user := User{
        ID:       1,
        Name:     "Alice",
        Email:    "alice@example.com",
        Password: "secret",
    }

    // 序列化
    data, err := json.Marshal(user)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(string(data))
    // {"id":1,"name":"Alice","email":"alice@example.com"}
}
```

### 自定义标签

```go
type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name,omitempty"` // 空值省略
    Email    string `json:"email"`
    Age      int    `json:"age,string"`     // 转字符串
    Created  string `json:"created_at"`     // 重命名
    Internal string `json:"-"`              // 忽略
}

func (u User) MarshalJSON() ([]byte, error) {
    // 自定义序列化
    type Alias User
    return json.Marshal(&struct {
        Age int `json:"age"`
        *Alias
    }{
        Age:  2024 - u.Age,
        Alias: (*Alias)(&u),
    })
}
```

### 反序列化

```go
func unmarshalUser(data []byte) (*User, error) {
    var user User

    if err := json.Unmarshal(data, &user); err != nil {
        return nil, err
    }

    return &user, nil
}

// 使用流式解析
func streamDecode(r io.Reader) (*User, error) {
    decoder := json.NewDecoder(r)

    var user User
    if err := decoder.Decode(&user); err != nil {
        return nil, err
    }

    return &user, nil
}
```

## RESTful 响应格式

### 统一响应结构

```go
type Response struct {
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

func Success(c *gin.Context, data interface{}) {
    c.JSON(200, Response{
        Success: true,
        Data:    data,
    })
}

func SuccessWithMeta(c *gin.Context, data interface{}, meta *MetaInfo) {
    c.JSON(200, Response{
        Success: true,
        Data:    data,
        Meta:    meta,
    })
}

func Error(c *gin.Context, code int, errCode, message string) {
    c.JSON(code, Response{
        Success: false,
        Error: &ErrorInfo{
            Code:    errCode,
            Message: message,
        },
    })
}
```

### 分页响应

```go
type ListResponse struct {
    Items      interface{} `json:"items"`
    Pagination *Pagination `json:"pagination"`
}

type Pagination struct {
    Page       int `json:"page"`
    PageSize   int `json:"page_size"`
    TotalCount int `json:"total_count"`
    TotalPages int `json:"total_pages"`
    HasNext    bool `json:"has_next"`
    HasPrev    bool `json:"has_prev"`
}

func NewPagination(page, pageSize, totalCount int) *Pagination {
    totalPages := (totalCount + pageSize - 1) / pageSize

    return &Pagination{
        Page:       page,
        PageSize:   pageSize,
        TotalCount: totalCount,
        TotalPages: totalPages,
        HasNext:    page < totalPages,
        HasPrev:    page > 1,
    }
}

func listUsers(c *gin.Context) {
    page := getPage(c)
    limit := getLimit(c)

    users, total := userService.List(page, limit)

    SuccessWithMeta(c, users, &MetaInfo{
        Page:       page,
        PageSize:   limit,
        TotalCount: total,
        TotalPages: (total + limit - 1) / limit,
    })
}
```

## 数据转换

### DTO 转换

```go
// 数据库模型
type User struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    Password  string    `json:"-"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

// API 响应 DTO
type UserDTO struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

// 转换函数
func ToUserDTO(user *User) *UserDTO {
    return &UserDTO{
        ID:        user.ID,
        Name:      user.Name,
        Email:     user.Email,
        CreatedAt: user.CreatedAt,
    }
}

func ToUserDTOs(users []*User) []*UserDTO {
    dtos := make([]*UserDTO, len(users))
    for i, user := range users {
        dtos[i] = ToUserDTO(user)
    }
    return dtos
}
```

### 请求 DTO

```go
// 创建请求
type CreateUserRequest struct {
    Name  string `json:"name" binding:"required,min=3,max=50"`
    Email string `json:"email" binding:"required,email"`
    Age   int    `json:"age" binding:"min=1,max=120"`
}

// 更新请求
type UpdateUserRequest struct {
    Name  *string `json:"name,omitempty" binding:"omitempty,min=3,max=50"`
    Email *string `json:"email,omitempty" binding:"omitempty,email"`
    Age   *int    `json:"age,omitempty" binding:"omitempty,min=1,max=120"`
}

func createUser(c *gin.Context) {
    var req CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        Error(c, 400, "INVALID_REQUEST", err.Error())
        return
    }

    user := userService.Create(req)
    Success(c, ToUserDTO(user))
}
```

## 高级功能

### JSON 流式处理

```go
func streamUsers(c *gin.Context) {
    c.Header("Content-Type", "application/json")
    c.Stream(func(w io.Writer) bool {
        // 流式写入
        encoder := json.NewEncoder(w)

        users := userService.GetUsers()
        for _, user := range users {
            if err := encoder.Encode(user); err != nil {
                return false
            }
        }

        return false
    })
}
```

### JSONP 支持

```go
func jsonpHandler(c *gin.Context) {
    callback := c.Query("callback")

    data := map[string]interface{}{
        "message": "Hello, JSONP!",
    }

    jsonData, _ := json.Marshal(data)

    if callback != "" {
        c.Header("Content-Type", "application/javascript")
        c.String(200, "%s(%s)", callback, string(jsonData))
    } else {
        c.JSON(200, data)
    }
}
```

### JSON 字段选择

```go
func getUserFields(c *gin.Context) {
    id := c.Param("id")
    fields := c.Query("fields") // "id,name,email"

    user := userService.Get(id)

    if fields != "" {
        fieldMap := parseFields(fields)
        c.JSON(200, selectFields(user, fieldMap))
    } else {
        c.JSON(200, user)
    }
}

func parseFields(fields string) map[string]bool {
    fieldMap := make(map[string]bool)
    for _, field := range strings.Split(fields, ",") {
        fieldMap[strings.TrimSpace(field)] = true
    }
    return fieldMap
}

func selectFields(user interface{}, fields map[string]interface{}) {
    // 使用反射选择字段
    v := reflect.ValueOf(user)
    if v.Kind() == reflect.Ptr {
        v = v.Elem()
    }

    result := make(map[string]interface{})
    t := v.Type()

    for i := 0; i < v.NumField(); i++ {
        field := t.Field(i)
        jsonTag := field.Tag.Get("json")

        if fields[jsonTag] {
            result[jsonTag] = v.Field(i).Interface()
        }
    }

    return result
}
```

## 错误处理

### 错误响应

```go
type APIError struct {
    Code       string `json:"code"`
    Message    string `json:"message"`
    StatusCode int    `json:"-"`
    Details    string `json:"details,omitempty"`
}

func (e *APIError) Error() string {
    return e.Message
}

var (
    ErrBadRequest = &APIError{
        Code:       "BAD_REQUEST",
        Message:    "Invalid request",
        StatusCode: 400,
    }

    ErrNotFound = &APIError{
        Code:       "NOT_FOUND",
        Message:    "Resource not found",
        StatusCode: 404,
    }

    ErrUnauthorized = &APIError{
        Code:       "UNAUTHORIZED",
        Message:    "Authentication required",
        StatusCode: 401,
    }
)

func HandleAPIError(c *gin.Context, err error) {
    if apiErr, ok := err.(*APIError); ok {
        c.JSON(apiErr.StatusCode, Response{
            Success: false,
            Error: &ErrorInfo{
                Code:    apiErr.Code,
                Message: apiErr.Message,
            },
        })
        return
    }

    // 默认错误
    c.JSON(500, Response{
        Success: false,
        Error: &ErrorInfo{
            Code:    "INTERNAL_ERROR",
            Message: "Internal server error",
        },
    })
}
```

### 错误中间件

```go
func ErrorMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()

        // 检查是否有错误
        if len(c.Errors) > 0 {
            err := c.Errors.Last().Err

            if apiErr, ok := err.(*APIError); ok {
                c.JSON(apiErr.StatusCode, Response{
                    Success: false,
                    Error: &ErrorInfo{
                        Code:    apiErr.Code,
                        Message: apiErr.Message,
                    },
                })
            } else {
                c.JSON(500, Response{
                    Success: false,
                    Error: &ErrorInfo{
                        Code:    "INTERNAL_ERROR",
                        Message: "Internal server error",
                    },
                })
            }
        }
    }
}
```

## 最佳实践

::: tip JSON API 建议

1. **统一格式** - 使用一致的响应结构
2. **合适状态码** - 正确使用 HTTP 状态码
3. **版本控制** - API 使用版本号
4. **字段过滤** - 支持字段选择
5. **错误清晰** - 返回明确的错误信息

:::

```go
// ✅ 好的模式
func goodAPIHandler(c *gin.Context) {
    // 1. 绑定和验证请求
    var req Request
    if err := c.ShouldBindJSON(&req); err != nil {
        Error(c, 400, "INVALID_REQUEST", err.Error())
        return
    }

    // 2. 业务逻辑
    result, err := service.Process(req)
    if err != nil {
        HandleAPIError(c, err)
        return
    }

    // 3. 返回响应
    Success(c, ToDTO(result))
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **序列化** - encoding/json 标签 |
| **响应格式** - 统一的 Response 结构 |
| **分页** - 返回元数据信息 |
| **DTO** - 分离模型和 API 表示 |
| **错误处理** - 清晰的错误代码 |

::: v-pre

[验证](./validation.md) → [WebSocket](./websockets.md)

:::
