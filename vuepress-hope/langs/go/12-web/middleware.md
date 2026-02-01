---
title: 中间件
icon: ri:stack-line
order: 5
---

# 中间件

中间件处理请求和响应的横切关注点。

## 基本中间件

### 中间件结构

```go
// 中间件函数签名
func Middleware(next gin.HandlerFunc) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 前置处理

        // 调用下一个处理器
        c.Next()

        // 后置处理
    }
}
```

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
            zap.String("user-agent", c.Request.UserAgent()),
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
                    zap.String("stack", string(debug.Stack())),
                )

                c.JSON(500, gin.H{
                    "error": "Internal server error",
                })
                c.Abort()
            }
        }()

        c.Next()
    }
}
```

## 认证中间件

### JWT 认证

```go
func JWTAuthMiddleware(secretKey string) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")

        if token == "" {
            c.JSON(401, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        // 移除 "Bearer " 前缀
        token = strings.TrimPrefix(token, "Bearer ")

        // 验证 token
        claims, err := validateJWT(token, secretKey)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // 存储用户信息
        c.Set("user_id", claims.UserID)
        c.Set("user_role", claims.Role)

        c.Next()
    }
}

func validateJWT(token, secretKey string) (*Claims, error) {
    // JWT 验证逻辑
    return nil, nil
}
```

### API Key 认证

```go
func APIKeyMiddleware(validKeys []string) gin.HandlerFunc {
    keyMap := make(map[string]bool)
    for _, key := range validKeys {
        keyMap[key] = true
    }

    return func(c *gin.Context) {
        apiKey := c.GetHeader("X-API-Key")

        if apiKey == "" {
            c.JSON(401, gin.H{"error": "API key required"})
            c.Abort()
            return
        }

        if !keyMap[apiKey] {
            c.JSON(401, gin.H{"error": "Invalid API key"})
            c.Abort()
            return
        }

        c.Next()
    }
}
```

## CORS 中间件

### 基本 CORS

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

### 配置 CORS

```go
func ConfigurableCORS(allowedOrigins []string) gin.HandlerFunc {
    return func(c *gin.Context) {
        origin := c.Request.Header.Get("Origin")

        // 检查来源
        allowed := false
        for _, allowed := range allowedOrigins {
            if origin == allowed {
                allowed = true
                break
            }
        }

        if allowed {
            c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
        }

        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Max-Age", "86400")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

## 限流中间件

### 简单限流

```go
func RateLimitMiddleware(requestsPerMinute int) gin.HandlerFunc {
    limiter := rate.NewLimiter(rate.Every(time.Minute, requestsPerMinute))

    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.JSON(429, gin.H{
                "error": "Too many requests",
            })
            c.Abort()
            return
        }

        c.Next()
    }
}
```

### IP 限流

```go
type IPRateLimiter struct {
    limiters map[string]*rate.Limiter
    mu       sync.RWMutex
    rate     rate.Limit
}

func NewIPRateLimiter(requestsPerMinute int) *IPRateLimiter {
    return &IPRateLimiter{
        limiters: make(map[string]*rate.Limiter),
        rate:     rate.Every(time.Minute, requestsPerMinute),
    }
}

func (irl *IPRateLimiter) Middleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        ip := c.ClientIP()

        irl.mu.Lock()
        limiter, exists := irl.limiters[ip]
        if !exists {
            limiter = rate.NewLimiter(irl.rate)
            irl.limiters[ip] = limiter
        }
        irl.mu.Unlock()

        if !limiter.Allow() {
            c.JSON(429, gin.H{
                "error": "Too many requests from this IP",
            })
            c.Abort()
            return
        }

        c.Next()
    }
}
```

## 压缩中间件

### Gzip 压缩

```go
import "github.com/gin-contrib/gzip"

func setupGzip(r *gin.Engine) {
    // 使用 Gzip 中间件
    r.Use(gzip.Gzip(gzip.DefaultCompression))

    // 排除某些路径
    r.Use(func(c *gin.Context) {
        // 不压缩已经压缩的内容
        if strings.Contains(c.Request.Header.Get("Accept-Encoding"), "gzip") {
            c.Next()
        } else {
            c.Next()
        }
    })
}
```

## 请求 ID

### 唯一 ID

```go
func RequestIDMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 从请求头获取或生成新 ID
        requestID := c.GetHeader("X-Request-ID")
        if requestID == "" {
            requestID = generateRequestID()
        }

        // 设置到上下文
        c.Set("request_id", requestID)

        // 设置响应头
        c.Writer.Header().Set("X-Request-ID", requestID)

        c.Next()
    }
}

func generateRequestID() string {
    return uuid.New().String()
}
```

## 超时中间件

### 请求超时

```go
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 设置超时上下文
        ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
        defer cancel()

        // 替换请求上下文
        c.Request = c.Request.WithContext(ctx)

        finished := make(chan struct{})

        go func() {
            c.Next()
            close(finished)
        }()

        select {
        case <-finished:
            return
        case <-ctx.Done():
            c.JSON(504, gin.H{
                "error": "Request timeout",
            })
            c.Abort()
            return
        }
    }
}
```

## 性能监控

### 响应时间

```go
func ResponseTimeMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()

        c.Next()

        duration := time.Since(start)

        // 记录响应时间
        c.Writer.Header().Set("X-Response-Time", duration.String())

        // 如果超过阈值，记录日志
        if duration > 1*time.Second {
            log.Printf("Slow request: %s %s took %v",
                c.Request.Method,
                c.Request.URL.Path,
                duration,
            )
        }
    }
}
```

### Prometheus 指标

```go
import "github.com/prometheus/client_golang/prometheus"
import "github.com/prometheus/client_golang/prometheus/promauto"

var (
    httpRequestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "path", "status"},
    )

    httpRequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "path"},
    )
)

func PrometheusMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()

        c.Next()

        // 记录请求计数
        httpRequestsTotal.WithLabelValues(
            c.Request.Method,
            c.FullPath(),
            strconv.Itoa(c.Writer.Status()),
        ).Inc()

        // 记录请求持续时间
        httpRequestDuration.WithLabelValues(
            c.Request.Method,
            c.FullPath(),
        ).Observe(time.Since(start).Seconds())
    }
}
```

## 安全中间件

### 安全头

```go
func SecurityMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 安全响应头
        c.Writer.Header().Set("X-Frame-Options", "DENY")
        c.Writer.Header().Set("X-Content-Type-Options", "nosniff")
        c.Writer.Header().Set("X-XSS-Protection", "1; mode=block")
        c.Writer.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        c.Writer.Header().Set("Content-Security-Policy", "default-src 'self'")

        c.Next()
    }
}
```

### IP 白名单

```go
func IPWhitelistMiddleware(allowedIPs []string) gin.HandlerFunc {
    ipSet := make(map[string]bool)
    for _, ip := range allowedIPs {
        ipSet[ip] = true
    }

    return func(c *gin.Context) {
        ip := c.ClientIP()

        if !ipSet[ip] {
            c.JSON(403, gin.H{
                "error": "Forbidden",
            })
            c.Abort()
            return
        }

        c.Next()
    }
}
```

## 最佳实践

::: tip 中间件建议

1. **执行顺序** - 中间件顺序很重要
2. **性能考虑** - 避免阻塞操作
3. **错误处理** - 正确处理和传播错误
4. **资源清理** - 使用 defer 确保清理
5. **测试覆盖** - 为中间件编写测试

:::

```go
// ✅ 好的模式
func setupMiddleware(r *gin.Engine) {
    // 全局中间件
    r.Use(SecurityMiddleware())
    r.Use(LoggerMiddleware(logger))
    r.Use(RecoveryMiddleware(logger))
    r.Use(CORSMiddleware())
    r.Use(RequestIDMiddleware())

    // 路由级中间件
    auth := r.Group("/api")
    auth.Use(AuthMiddleware())
    {
        auth.GET("/profile", getProfile)
    }
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **结构** - 前置处理、c.Next()、后置处理 |
| **认证** - JWT、API Key |
| **CORS** - 跨域资源共享 |
| **限流** - 防止滥用 |
| **安全** - 安全响应头 |

::: v-pre

[RESTful](./restful.md) → [数据库](./database.md)

:::
