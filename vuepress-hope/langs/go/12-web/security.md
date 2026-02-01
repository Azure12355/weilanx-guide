---
title: 安全防护
icon: ri:shield-keyhole-line
order: 7
---

# 安全防护

Web 安全是开发中不可忽视的重要环节。

## 认证授权

### JWT 认证

```go
import "github.com/golang-jwt/jwt/v5"

type Claims struct {
    UserID string `json:"user_id"`
    Role   string `json:"role"`
    jwt.RegisteredClaims
}

type AuthService struct {
    secretKey []byte
}

func NewAuthService(secret string) *AuthService {
    return &AuthService{
        secretKey: []byte(secret),
    }
}

func (a *AuthService) GenerateToken(userID, role string) (string, error) {
    claims := Claims{
        UserID: userID,
        Role:   role,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            NotBefore: jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(a.secretKey)
}

func (a *AuthService) ValidateToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return a.secretKey, nil
    })

    if err != nil {
        return nil, err
    }

    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }

    return nil, fmt.Errorf("invalid token")
}
```

### 认证中间件

```go
func AuthMiddleware(authService *AuthService) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 从 Authorization 头获取 token
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(401, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        // 解析 Bearer token
        parts := strings.SplitN(authHeader, " ", 2)
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(401, gin.H{"error": "Invalid authorization format"})
            c.Abort()
            return
        }

        token := parts[1]

        // 验证 token
        claims, err := authService.ValidateToken(token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // 存储用户信息到上下文
        c.Set("user_id", claims.UserID)
        c.Set("user_role", claims.Role)
        c.Set("claims", claims)

        c.Next()
    }
}
```

### 角色授权

```go
func RequireRole(roles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        userRole, exists := c.Get("user_role")
        if !exists {
            c.JSON(401, gin.H{"error": "Not authenticated"})
            c.Abort()
            return
        }

        roleStr := userRole.(string)
        allowed := false
        for _, role := range roles {
            if role == roleStr {
                allowed = true
                break
            }
        }

        if !allowed {
            c.JSON(403, gin.H{"error": "Insufficient permissions"})
            c.Abort()
            return
        }

        c.Next()
    }
}

// 路由使用
func setupRoutes(r *gin.Engine) {
    authService := NewAuthService("secret")

    api := r.Group("/api")
    api.Use(AuthMiddleware(authService))
    {
        // 所有认证用户
        api.GET("/profile", getProfile)

        // 仅管理员
        admin := api.Group("/admin")
        admin.Use(RequireRole("admin"))
        {
            admin.GET("/users", listUsers)
            admin.DELETE("/users/:id", deleteUser)
        }
    }
}
```

## CORS 配置

### 基本 CORS

```go
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers",
            "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

### 受限 CORS

```go
func RestrictedCORSMiddleware(allowedOrigins []string) gin.HandlerFunc {
    return func(c *gin.Context) {
        origin := c.Request.Header.Get("Origin")

        // 检查来源是否在允许列表中
        allowed := false
        for _, allowedOrigin := range allowedOrigins {
            if origin == allowedOrigin {
                allowed = true
                break
            }
        }

        if allowed {
            c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
            c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
            c.Writer.Header().Set("Access-Control-Allow-Headers",
                "Content-Type, Authorization")
            c.Writer.Header().Set("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS")
            c.Writer.Header().Set("Access-Control-Max-Age", "86400")
        }

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

## CSRF 防护

### CSRF Token

```go
type CSRFService struct {
    store map[string]string
    mu    sync.RWMutex
}

func NewCSRFService() *CSRFService {
    return &CSRFService{
        store: make(map[string]string),
    }
}

func (c *CSRFService) GenerateToken(sessionID string) string {
    c.mu.Lock()
    defer c.mu.Unlock()

    token := generateRandomToken(32)
    c.store[sessionID] = token
    return token
}

func (c *CSRFService) ValidateToken(sessionID, token string) bool {
    c.mu.RLock()
    defer c.mu.RUnlock()

    storedToken, exists := c.store[sessionID]
    if !exists {
        return false
    }

    return storedToken == token
}

func generateRandomToken(length int) string {
    bytes := make([]byte, length)
    if _, err := rand.Read(bytes); err != nil {
        panic(err)
    }
    return hex.EncodeToString(bytes)
}
```

### CSRF 中间件

```go
func CSRFMiddleware(csrfService *CSRFService) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 跳过安全方法
        if c.Request.Method == "GET" || c.Request.Method == "HEAD" || c.Request.Method == "OPTIONS" {
            c.Next()
            return
        }

        // 获取 session ID
        sessionID := c.GetHeader("X-Session-ID")
        if sessionID == "" {
            c.JSON(400, gin.H{"error": "Missing session ID"})
            c.Abort()
            return
        }

        // 获取 CSRF token
        token := c.GetHeader("X-CSRF-Token")
        if token == "" {
            c.JSON(400, gin.H{"error": "Missing CSRF token"})
            c.Abort()
            return
        }

        // 验证 token
        if !csrfService.ValidateToken(sessionID, token) {
            c.JSON(403, gin.H{"error": "Invalid CSRF token"})
            c.Abort()
            return
        }

        c.Next()
    }
}
```

## SQL 注入防护

### 参数化查询

```go
// ❌ 错误：拼接 SQL
func badGetUser(db *sql.DB, username string) (*User, error) {
    query := fmt.Sprintf("SELECT * FROM users WHERE username = '%s'", username)
    // 容易受到 SQL 注入攻击
    return db.Query(query)
}

// ✅ 正确：使用参数化查询
func goodGetUser(db *sql.DB, username string) (*User, error) {
    var user User
    query := "SELECT id, username, email FROM users WHERE username = ?"
    err := db.QueryRow(query, username).Scan(&user.ID, &user.Username, &user.Email)
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

### ORM 使用

```go
import (
    "gorm.io/gorm"
    "gorm.io/driver/mysql"
)

func GetUserByEmail(db *gorm.DB, email string) (*User, error) {
    var user User
    // GORM 自动参数化
    result := db.Where("email = ?", email).First(&user)
    if result.Error != nil {
        return nil, result.Error
    }
    return &user, nil
}

func GetUserWithConditions(db *gorm.DB, username, email string) (*User, error) {
    var user User
    // GORM 自动处理所有参数
    result := db.Where("username = ? AND email = ?", username, email).First(&user)
    if result.Error != nil {
        return nil, result.Error
    }
    return &user, nil
}
```

## XSS 防护

### 输入验证

```go
import "regexp"

var htmlTagRegex = regexp.MustCompile(`<[^>]*>`)

func SanitizeInput(input string) string {
    // 移除 HTML 标签
    return htmlTagRegex.ReplaceAllString(input, "")
}

func ValidateUsername(username string) error {
    // 只允许字母、数字、下划线
    validUsername := regexp.MustCompile(`^[a-zA-Z0-9_]{3,20}$`)
    if !validUsername.MatchString(username) {
        return fmt.Errorf("invalid username format")
    }
    return nil
}
```

### 输出转义

```go
import "html"

func renderComment(c *gin.Context, comment *Comment) {
    // 转义用户输入
    safeContent := html.EscapeString(comment.Content)

    c.HTML(200, "comment.html", gin.H{
        "content": safeContent,
    })
}
```

## 密码安全

### 密码哈希

```go
import "golang.org/x/crypto/bcrypt"

type UserService struct {
    db *gorm.DB
}

func (s *UserService) CreateUser(username, password string) error {
    // 哈希密码
    hashedPassword, err := bcrypt.GenerateFromPassword(
        []byte(password),
        bcrypt.DefaultCost,
    )
    if err != nil {
        return err
    }

    user := &User{
        Username: username,
        Password: string(hashedPassword),
    }

    return s.db.Create(user).Error
}

func (s *UserService) AuthenticateUser(username, password string) (*User, error) {
    var user User
    if err := s.db.Where("username = ?", username).First(&user).Error; err != nil {
        return nil, err
    }

    // 验证密码
    if err := bcrypt.CompareHashAndPassword(
        []byte(user.Password),
        []byte(password),
    ); err != nil {
        return nil, err
    }

    return &user, nil
}
```

### 密码策略

```go
type PasswordPolicy struct {
    MinLength    int
    RequireUpper bool
    RequireLower bool
    RequireDigit bool
    RequireSpecial bool
}

func (p *PasswordPolicy) Validate(password string) error {
    if len(password) < p.MinLength {
        return fmt.Errorf("password must be at least %d characters", p.MinLength)
    }

    if p.RequireUpper {
        if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
            return fmt.Errorf("password must contain uppercase letters")
        }
    }

    if p.RequireLower {
        if !regexp.MustCompile(`[a-z]`).MatchString(password) {
            return fmt.Errorf("password must contain lowercase letters")
        }
    }

    if p.RequireDigit {
        if !regexp.MustCompile(`[0-9]`).MatchString(password) {
            return fmt.Errorf("password must contain digits")
        }
    }

    if p.RequireSpecial {
        if !regexp.MustCompile(`[!@#$%^&*]`).MatchString(password) {
            return fmt.Errorf("password must contain special characters")
        }
    }

    return nil
}
```

## 限流保护

### 令牌桶算法

```go
import "golang.org/x/time/rate"

type IPRateLimiter struct {
    ips map[string]*rate.Limiter
    mu  sync.RWMutex
    r   rate.Limit
    b   int
}

func NewIPRateLimiter(r rate.Limit, b int) *IPRateLimiter {
    return &IPRateLimiter{
        ips: make(map[string]*rate.Limiter),
        r:   r,
        b:   b,
    }
}

func (i *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
    i.mu.Lock()
    defer i.mu.Unlock()

    limiter, exists := i.ips[ip]
    if !exists {
        limiter = rate.NewLimiter(i.r, i.b)
        i.ips[ip] = limiter
    }

    return limiter
}

func RateLimitMiddleware(limiter *IPRateLimiter) gin.HandlerFunc {
    return func(c *gin.Context) {
        ip := c.ClientIP()
        if !limiter.GetLimiter(ip).Allow() {
            c.JSON(429, gin.H{"error": "Rate limit exceeded"})
            c.Abort()
            return
        }
        c.Next()
    }
}
```

### 滑动窗口

```go
type SlidingWindowLimiter struct {
    windows map[string]*Window
    mu      sync.RWMutex
    limit   int
    window  time.Duration
}

type Window struct {
    requests []time.Time
    mu       sync.Mutex
}

func NewSlidingWindowLimiter(limit int, window time.Duration) *SlidingWindowLimiter {
    return &SlidingWindowLimiter{
        windows: make(map[string]*Window),
        limit:   limit,
        window:  window,
    }
}

func (s *SlidingWindowLimiter) Allow(key string) bool {
    s.mu.Lock()
    window, exists := s.windows[key]
    if !exists {
        window = &Window{}
        s.windows[key] = window
    }
    s.mu.Unlock()

    window.mu.Lock()
    defer window.mu.Unlock()

    now := time.Now()
    // 移除窗口外的请求
    cutoff := now.Add(-s.window)
    valid := make([]time.Time, 0)
    for _, t := range window.requests {
        if t.After(cutoff) {
            valid = append(valid, t)
        }
    }

    window.requests = valid

    // 检查是否超限
    if len(window.requests) >= s.limit {
        return false
    }

    window.requests = append(window.requests, now)
    return true
}
```

## 最佳实践

::: tip 安全建议

1. **永远不要信任用户输入** - 验证所有输入
2. **使用参数化查询** - 防止 SQL 注入
3. **HTTPS 传输** - 加密敏感数据
4. **最小权限原则** - 限制访问范围
5. **定期审计** - 检查安全漏洞

:::

```go
// ✅ 好的安全模式
func secureHandler(c *gin.Context) {
    // 1. 认证检查
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(401, gin.H{"error": "Unauthorized"})
        return
    }

    // 2. 输入验证
    var req Request
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Invalid request"})
        return
    }

    // 3. 业务逻辑
    result, err := service.Process(userID.(string), req)
    if err != nil {
        c.JSON(500, gin.H{"error": "Internal error"})
        return
    }

    // 4. 输出转义
    c.JSON(200, result)
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **认证** - JWT Token 验证 |
| **授权** - 基于角色的访问控制 |
| **CORS** - 限制跨域请求 |
| **CSRF** - Token 验证 |
| **注入防护** - 参数化查询 |

::: v-pre

[WebSocket](./websockets.md) → [工程实践](/langs/go/11-engineering/)

:::
