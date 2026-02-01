---
title: URL短链服务
icon: ri:link
order: 2
---

# URL短链服务

一个完整的 URL 短链服务项目，涵盖 Web 开发核心技能。

## 项目概述

### 功能需求

- 生成短链
- 自定义短码
- 重定向到原始URL
- 访问统计
- API限流

### 技术栈

```
框架: Gin
数据库: MySQL
缓存: Redis
配置: Viper
日志: Zap
测试: Testify
```

## 项目结构

```
url-shortener/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── handler/
│   │   └── url_handler.go
│   ├── service/
│   │   └── url_service.go
│   ├── repository/
│   │   └── url_repository.go
│   └── model/
│       └── url.go
├── pkg/
│   ├── middleware/
│   │   └── rate_limit.go
│   └── utils/
│       └── shortener.go
├── configs/
│   └── config.yaml
├── scripts/
│   └── migrate.sql
└── go.mod
```

## 数据模型

### 数据库表

```sql
-- scripts/migrate.sql
CREATE TABLE urls (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(2048) NOT NULL,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    custom_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    INDEX idx_short_code (short_code),
    INDEX idx_custom_code (custom_code)
);

CREATE TABLE url_stats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    url_id BIGINT UNSIGNED NOT NULL,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent VARCHAR(512),
    INDEX idx_url_id (url_id),
    INDEX idx_accessed_at (accessed_at),
    FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
);
```

### 模型定义

```go
// internal/model/url.go
package model

import "time"

type URL struct {
    ID         int64     `json:"id" gorm:"primaryKey"`
    URL        string    `json:"url" gorm:"type:varchar(2048);not null"`
    ShortCode  string    `json:"short_code" gorm:"type:varchar(50);uniqueIndex;not null"`
    CustomCode string    `json:"custom_code,omitempty" gorm:"type:varchar(50);uniqueIndex"`
    CreatedAt  time.Time `json:"created_at"`
    ExpiresAt  *time.Time `json:"expires_at,omitempty"`
    Stats      []URLStat `json:"stats,omitempty" gorm:"foreignKey:URLID"`
}

type URLStat struct {
    ID         int64     `json:"id" gorm:"primaryKey"`
    URLID      int64     `json:"url_id" gorm:"not null;index"`
    AccessedAt time.Time `json:"accessed_at"`
    IPAddress string    `json:"ip_address" gorm:"type:varchar(45)"`
    UserAgent  string    `json:"user_agent" gorm:"type:varchar(512)"`
}
```

## 服务层

### 短链生成

```go
// internal/service/url_service.go
package service

import (
    "context"
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "time"
)

type URLService struct {
    repo   Repository
    cache  Cache
    config *Config
}

func NewURLService(repo Repository, cache Cache, config *Config) *URLService {
    return &URLService{
        repo:   repo,
        cache:  cache,
        config: config,
    }
}

func (s *URLService) CreateShortenURL(ctx context.Context, req *CreateURLRequest) (*URL, error) {
    // 验证URL
    if err := validateURL(req.URL); err != nil {
        return nil, fmt.Errorf("invalid URL: %w", err)
    }

    // 检查自定义短码
    if req.CustomCode != "" {
        if exists, err := s.repo.FindByShortCode(ctx, req.CustomCode); err == nil && exists != nil {
            return nil, fmt.Errorf("custom code already exists")
        }
    }

    // 生成短码
    shortCode := req.CustomCode
    if shortCode == "" {
        code, err := generateShortCode(6)
        if err != nil {
            return nil, err
        }
        shortCode = code
    }

    // 创建URL记录
    url := &URL{
        URL:        req.URL,
        ShortCode:  shortCode,
        CustomCode: req.CustomCode,
        ExpiresAt:  req.ExpiresAt,
    }

    if err := s.repo.Save(ctx, url); err != nil {
        return nil, fmt.Errorf("failed to save URL: %w", err)
    }

    return url, nil
}

func (s *URLService) GetOriginalURL(ctx context.Context, shortCode string) (*URL, error) {
    // 先从缓存获取
    if url, err := s.cache.Get(ctx, shortCode); err == nil && url != nil {
        return url, nil
    }

    // 从数据库获取
    url, err := s.repo.FindByShortCode(ctx, shortCode)
    if err != nil {
        return nil, fmt.Errorf("URL not found")
    }

    // 检查过期
    if url.ExpiresAt != nil && time.Now().After(*url.ExpiresAt) {
        return nil, fmt.Errorf("URL has expired")
    }

    // 缓存结果
    s.cache.Set(ctx, shortCode, url, 10*time.Minute)

    return url, nil
}

func (s *URLService) RecordAccess(ctx context.Context, urlID int64, ip, userAgent string) error {
    stat := &URLStat{
        URLID:      urlID,
        AccessedAt: time.Now(),
        IPAddress:  ip,
        UserAgent:  userAgent,
    }

    return s.repo.SaveStat(ctx, stat)
}

func generateShortCode(length int) (string, error) {
    bytes := make([]byte, length)
    if _, err := rand.Read(bytes); err != nil {
        return "", err
    }

    return base64.URLEncoding.EncodeToString(bytes)[:length], nil
}
```

### 缓存接口

```go
// internal/service/cache.go
package service

import "context"

type Cache interface {
    Get(ctx context.Context, key string) (*URL, error)
    Set(ctx context.Context, key string, url *URL, ttl time.Duration) error
    Delete(ctx context.Context, key string) error
}

type RedisCache struct {
    client *redis.Client
}

func NewRedisCache(addr string) *RedisCache {
    return &RedisCache{
        client: redis.NewClient(&redis.Options{
            Addr: addr,
        }),
    }
}

func (c *RedisCache) Get(ctx context.Context, key string) (*URL, error) {
    val, err := c.client.Get(ctx, "url:"+key).Bytes()
    if err != nil {
        return nil, err
    }

    var url URL
    if err := json.Unmarshal(val, &url); err != nil {
        return nil, err
    }

    return &url, nil
}

func (c *RedisCache) Set(ctx context.Context, key string, url *URL, ttl time.Duration) error {
    data, err := json.Marshal(url)
    if err != nil {
        return err
    }

    return c.client.Set(ctx, "url:"+key, data, ttl).Err()
}

func (c *RedisCache) Delete(ctx context.Context, key string) error {
    return c.client.Del(ctx, "url:"+key).Err()
}
```

## HTTP 处理器

### 路由定义

```go
// internal/handler/url_handler.go
package handler

import (
    "github.com/gin-gonic/gin"
)

type URLHandler struct {
    service *URLService
}

func NewURLHandler(service *URLService) *URLHandler {
    return &URLHandler{service: service}
}

func (h *URLHandler) RegisterRoutes(r *gin.Engine) {
    api := r.Group("/api")
    {
        api.POST("/shorten", h.CreateShortenURL)
        api.GET("/info/:shortCode", h.GetURLInfo)
        api.GET("/stats/:shortCode", h.GetURLStats)
    }

    // 短链重定向
    r.GET("/:shortCode", h.Redirect)
}
```

### 处理器实现

```go
// 创建短链
func (h *URLHandler) CreateShortenURL(c *gin.Context) {
    var req CreateURLRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    url, err := h.service.CreateShortenURL(c.Request.Context(), &req)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{
        "short_url":   getBaseURL(c) + "/" + url.ShortCode,
        "short_code":  url.ShortCode,
        "original_url": url.URL,
    })
}

// 重定向
func (h *URLHandler) Redirect(c *gin.Context) {
    shortCode := c.Param("shortCode")

    url, err := h.service.GetOriginalURL(c.Request.Context(), shortCode)
    if err != nil {
        c.JSON(404, gin.H{"error": "Short URL not found"})
        return
    }

    // 记录访问
    go h.service.RecordAccess(
        c.Request.Context(),
        url.ID,
        c.ClientIP(),
        c.Request.UserAgent(),
    )

    c.Redirect(301, url.URL)
}

// 获取URL信息
func (h *URLHandler) GetURLInfo(c *gin.Context) {
    shortCode := c.Param("shortCode")

    url, err := h.service.GetOriginalURL(c.Request.Context(), shortCode)
    if err != nil {
        c.JSON(404, gin.H{"error": "Short URL not found"})
        return
    }

    c.JSON(200, url)
}

// 获取统计信息
func (h *URLHandler) GetURLStats(c *gin.Context) {
    shortCode := c.Param("shortCode")

    url, err := h.service.GetOriginalURL(c.Request.Context(), shortCode)
    if err != nil {
        c.JSON(404, gin.H{"error": "Short URL not found"})
        return
    }

    stats, err := h.service.GetStats(c.Request.Context(), url.ID)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{
        "url":        url.URL,
        "short_code": url.ShortCode,
        "created_at": url.CreatedAt,
        "total_clicks": len(stats),
        "stats":      stats,
    })
}
```

## 中间件

### 限流中间件

```go
// pkg/middleware/rate_limit.go
package middleware

import (
    "github.com/gin-gonic/gin"
    "golang.org/x/time/rate"
)

func RateLimitMiddleware(rps int) gin.HandlerFunc {
    limiter := rate.NewLimiter(rate.Limit(rps), rps)

    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.JSON(429, gin.H{"error": "Rate limit exceeded"})
            c.Abort()
            return
        }
        c.Next()
    }
}
```

## 主程序

```go
// cmd/server/main.go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
    "go.uber.org/zap"
)

func main() {
    // 1. 加载配置
    config, err := loadConfig()
    if err != nil {
        log.Fatalf("Failed to load config: %v", err)
    }

    // 2. 初始化日志
    logger, err := initLogger(config.Log)
    if err != nil {
        log.Fatalf("Failed to init logger: %v", err)
    }

    // 3. 初始化数据库
    db, err := initDB(config.Database)
    if err != nil {
        logger.Fatal("Failed to init database", zap.Error(err))
    }

    // 4. 初始化缓存
    cache := NewRedisCache(config.Redis.Addr)

    // 5. 初始化服务层
    repo := NewURLRepository(db)
    service := NewURLService(repo, cache, config)

    // 6. 初始化HTTP服务
    handler := NewURLHandler(service)

    r := gin.Default()

    // 中间件
    r.Use(RateLimitMiddleware(100))
    r.Use(LoggingMiddleware(logger))

    // 注册路由
    handler.RegisterRoutes(r)

    // 7. 启动服务
    srv := &http.Server{
        Addr:    fmt.Sprintf(":%d", config.Server.Port),
        Handler: r,
    }

    go func() {
        logger.Info("Server started",
            zap.Int("port", config.Server.Port))
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Fatal("Server failed", zap.Error(err))
        }
    }()

    // 8. 优雅关闭
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    logger.Info("Server shutting down...")

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        logger.Fatal("Server forced to shutdown", zap.Error(err))
    }

    logger.Info("Server exited")
}
```

## API 使用

### 创建短链

```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/golang/go",
    "custom_code": "golang"
  }'

# 响应
{
  "short_url": "http://localhost:8080/golang",
  "short_code": "golang",
  "original_url": "https://github.com/golang/go"
}
```

### 访问统计

```bash
curl http://localhost:8080/api/stats/golang

# 响应
{
  "url": "https://github.com/golang/go",
  "short_code": "golang",
  "created_at": "2024-01-01T00:00:00Z",
  "total_clicks": 42,
  "stats": [
    {
      "accessed_at": "2024-01-01T12:00:00Z",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0..."
    }
  ]
}
```

## 部署

### Dockerfile

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o server ./cmd/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

COPY --from=builder /app/server .
COPY --from=builder /app/configs ./configs

EXPOSE 8080

CMD ["./server"]
```

### docker-compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - REDIS_ADDR=redis:6379
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=url_shortener
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

## 扩展功能

### 功能建议

1. **短码规则** - 支持不同长度的短码
2. **批量生成** - 一次生成多个短链
3. **QR码生成** - 自动生成二维码
4. **分析报告** - 详细的访问分析
5. **API认证** - JWT Token认证

### 性能优化

1. **批量缓存** - 预热热点短链
2. **读写分离** - 主从数据库
3. **CDN加速** - 静态资源CDN
4. **监控告警** - Prometheus监控

## 总结

| 方面 | 关键点 |
|------|--------|
| **数据模型** - URL表和统计表 |
| **服务层** - 短链生成和缓存 |
| **缓存策略** - Redis缓存短链 |
| **API设计** - RESTful接口 |
| **部署** - Docker容器化 |

::: v-pre

[概述](./README.md) → [聊天服务器](./chat-server.md)

:::
