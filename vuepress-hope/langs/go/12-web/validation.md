---
title: 请求验证
icon: ri:shield-check-line
order: 4
---

# 请求验证

良好的请求验证确保数据完整性和安全性。

## 结构体验证

### 使用 validator

```go
import "github.com/go-playground/validator/v10"

type CreateUserRequest struct {
    Name  string `json:"name" validate:"required,min=3,max=50"`
    Email string `json:"email" validate:"required,email"`
    Age   int    `json:"age" validate:"required,min=1,max=120"`
}

func validateRequest(req interface{}) error {
    validate := validator.New()
    return validate.Struct(req)
}
```

### 自定义验证器

```go
func init() {
    validate := validator.New()

    // 注册自定义验证器
    validate.RegisterValidation("password", validatePassword)
}

func validatePassword(fl validator.FieldLevel) bool {
    password := fl.Field().String()

    // 至少 8 个字符
    if len(password) < 8 {
        return false
    }

    // 包含大小写字母
    hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
    // 包含数字
    hasDigit := regexp.MustCompile(`[0-9]`).MatchString(password)

    return hasUpper && hasDigit
}

type ChangePasswordRequest struct {
    OldPassword string `json:"old_password" validate:"required"`
    NewPassword string `json:"new_password" validate:"required,password"`
}
```

## Gin 绑定验证

### ShouldBindJSON

```go
type CreateUserRequest struct {
    Name  string `json:"name" binding:"required,min=3,max=50"`
    Email string `json:"email" binding:"required,email"`
    Age   int    `json:"age" binding:"required,min=1,max=120"`
}

func createUser(c *gin.Context) {
    var req CreateUserRequest

    // 绑定和验证
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{
            "error": err.Error(),
        })
        return
    }

    // 处理请求
    user := userService.Create(req)
    c.JSON(201, user)
}
```

### 自定义验证器

```go
func passwordValidator(fl validator.FieldLevel) bool {
    password := fl.Field().String()

    if len(password) < 8 {
        return false
    }

    hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
    hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
    hasDigit := regexp.MustCompile(`[0-9]`).MatchString(password)

    return hasUpper && hasLower && hasDigit
}

func init() {
    if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
        v.RegisterValidation("password", passwordValidator)
    }
}

type RegisterRequest struct {
    Password string `json:"password" binding:"required,password"`
}
```

## 手动验证

### 请求验证

```go
func validateUserRequest(req *CreateUserRequest) error {
    // 验证名称
    if req.Name == "" {
        return errors.New("name is required")
    }
    if len(req.Name) < 3 || len(req.Name) > 50 {
        return errors.New("name must be between 3 and 50 characters")
    }

    // 验证邮箱
    if req.Email == "" {
        return errors.New("email is required")
    }
    if !isValidEmail(req.Email) {
        return errors.New("invalid email format")
    }

    // 验证年龄
    if req.Age < 1 || req.Age > 120 {
        return errors.New("age must be between 1 and 120")
    }

    return nil
}

func isValidEmail(email string) bool {
    re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
    return re.MatchString(email)
}
```

### 验证中间件

```go
func ValidateMiddleware(request interface{}) gin.HandlerFunc {
    return func(c *gin.Context) {
        if err := c.ShouldBindJSON(request); err != nil {
            c.JSON(400, gin.H{
                "error": "Invalid request format",
            })
            c.Abort()
            return
        }

        // 自定义验证
        if err := validateCustom(request); err != nil {
            c.JSON(400, gin.H{
                "error": err.Error(),
            })
            c.Abort()
            return
        }

        c.Next()
    }
}
```

## 参数验证

### 路径参数验证

```go
func getUser(c *gin.Context) {
    id := c.Param("id")

    // 验证 ID 格式
    if !isValidID(id) {
        c.JSON(400, gin.H{
            "error": "Invalid user ID format",
        })
        return
    }

    user, err := userService.Get(id)
    if err != nil {
        c.JSON(404, gin.H{
            "error": "User not found",
        })
        return
    }

    c.JSON(200, user)
}

func isValidID(id string) bool {
    // 验证 ID 是 MongoDB ObjectId 或 UUID
    matched, _ := regexp.MatchString(`^[a-fA-F0-9]{24}$`, id)
    return matched
}
```

### 查询参数验证

```go
func listUsers(c *gin.Context) {
    // 获取并验证查询参数
    page, err := parsePageQuery(c.Query("page"))
    if err != nil {
        c.JSON(400, gin.H{
            "error": "Invalid page parameter",
        })
        return
    }

    limit, err := parseLimitQuery(c.Query("limit"))
    if err != nil {
        c.JSON(400, gin.H{
            "error": "Invalid limit parameter",
        })
        return
    }

    // 查询用户
    users := userService.List(page, limit)
    c.JSON(200, users)
}

func parsePageQuery(pageStr string) (int, error) {
    if pageStr == "" {
        return 1, nil
    }

    page, err := strconv.Atoi(pageStr)
    if err != nil {
        return 0, err
    }

    if page < 1 {
        return 0, errors.New("page must be >= 1")
    }

    return page, nil
}

func parseLimitQuery(limitStr string) (int, error) {
    if limitStr == "" {
        return 10, nil
    }

    limit, err := strconv.Atoi(limitStr)
    if err != nil {
        return 0, err
    }

    if limit < 1 || limit > 100 {
        return 0, errors.New("limit must be between 1 and 100")
    }

    return limit, nil
}
```

## 错误响应

### 统一错误格式

```go
type ErrorResponse struct {
    Error   string            `json:"error"`
    Code    string            `json:"code,omitempty"`
    Details map[string]string `json:"details,omitempty"`
}

func ValidationErrorResponse(c *gin.Context, err error) {
    c.JSON(400, ErrorResponse{
        Error: "Validation failed",
        Code:  "VALIDATION_ERROR",
        Details: map[string]string{
            "message": err.Error(),
        },
    })
}

func NotFoundResponse(c *gin.Context, resource string) {
    c.JSON(404, ErrorResponse{
        Error: fmt.Sprintf("%s not found", resource),
        Code:  "NOT_FOUND",
    })
}
```

### 错误处理

```go
func handleError(c *gin.Context, err error) {
    switch e := err.(type) {
    case *ValidationError:
        c.JSON(400, ErrorResponse{
            Error: e.Error(),
            Code:  "VALIDATION_ERROR",
        })

    case *NotFoundError:
        c.JSON(404, ErrorResponse{
            Error: e.Error(),
            Code:  "NOT_FOUND",
        })

    case *ConflictError:
        c.JSON(409, ErrorResponse{
            Error: e.Error(),
            Code:  "CONFLICT",
        })

    default:
        c.JSON(500, ErrorResponse{
            Error: "Internal server error",
            Code:  "INTERNAL_ERROR",
        })
    }
}
```

## 文件上传验证

### 文件类型验证

```go
func uploadFile(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(400, gin.H{
            "error": "No file uploaded",
        })
        return
    }

    // 验证文件大小
    const maxSize = 10 * 1024 * 1024 // 10MB
    if file.Size > maxSize {
        c.JSON(400, gin.H{
            "error": "File too large (max 10MB)",
        })
        return
    }

    // 验证文件类型
    if !isValidFileType(file.Header.Get("Content-Type")) {
        c.JSON(400, gin.H{
            "error": "Invalid file type",
        })
        return
    }

    // 验证文件扩展名
    if !isValidExtension(file.Filename) {
        c.JSON(400, gin.H{
            "error": "Invalid file extension",
        })
        return
    }

    // 处理文件
    filename := saveFile(file)
    c.JSON(200, gin.H{
        "filename": filename,
    })
}

func isValidFileType(contentType string) bool {
    allowedTypes := []string{
        "image/jpeg",
        "image/png",
        "application/pdf",
    }

    for _, t := range allowedTypes {
        if t == contentType {
            return true
        }
    }

    return false
}

func isValidExtension(filename string) bool {
    ext := strings.ToLower(filepath.Ext(filename))
    allowedExts := []string{".jpg", ".jpeg", ".png", ".pdf"}

    for _, e := range allowedExts {
        if e == ext {
            return true
        }
    }

    return false
}
```

## 最佳实践

::: tip 验证建议

1. **尽早验证** - 在控制器层验证
2. **完整验证** - 验证所有输入
3. **友好错误** - 返回清晰的错误信息
4. **类型安全** - 使用结构体绑定
5. **自定义规则** - 实现业务验证逻辑

:::

```go
// ✅ 好的模式
func goodValidation(c *gin.Context) {
    var req CreateUserRequest

    // 1. 绑定和验证
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    // 2. 业务验证
    if err := userService.ValidateEmail(req.Email); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    // 3. 处理请求
    user := userService.Create(req)
    c.JSON(201, user)
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **validator** - 结构体验证库 |
| **binding** - Gin 绑定验证 |
| **自定义验证器** - 业务规则验证 |
| **参数验证** - 路径和查询参数 |
| **错误格式** - 统一的错误响应 |

::: v-pre

[路由](./routing.md) → [JSON API](./json-api.md)

:::
