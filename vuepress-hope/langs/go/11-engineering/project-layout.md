---
title: 项目布局
icon: ri:layout-grid-line
order: 2
---

# 项目布局

标准 Go 项目布局确保代码组织清晰、易于维护和协作。

## 标准布局

### 完整目录结构

```bash
myapp/
├── cmd/                    # 主应用程序入口
│   ├── myapp/             # 可执行文件 myapp
│   │   └── main.go
│   └── worker/            # 可执行文件 worker
│       └── main.go
├── internal/              # 私有应用和库代码
│   ├── app/              # 应用初始化
│   ├── config/           # 配置加载
│   ├── handler/          # HTTP 处理器
│   ├── service/          # 业务逻辑
│   ├── repository/       # 数据访问
│   └── model/            # 数据模型
├── pkg/                   # 可被外部使用的库
│   └── util/
├── api/                   # API 协议定义
│   ├── openapi/          # OpenAPI/Swagger
│   ├── http/             # HTTP API
│   └── grpc/             # gRPC 定义
├── web/                   # Web 静态资源
│   ├── static/
│   └── templates/
├── configs/               # 配置文件示例
├── scripts/               # 构建和部署脚本
├── test/                  # 测试数据和工具
├── docs/                  # 项目文档
├── deployments/           # 部署配置
│   ├── docker/
│   └── k8s/
└── .github/               # GitHub 配置
```

### cmd 目录

```go
// cmd/myapp/main.go
package main

import (
    "myapp/internal/app"
    "myapp/internal/config"
)

func main() {
    // 加载配置
    cfg, err := config.Load()
    if err != nil {
        panic(err)
    }

    // 创建并运行应用
    application := app.New(cfg)
    application.Run()
}
```

### internal 目录

```go
// internal/app/app.go
package app

import (
    "myapp/internal/config"
    "myapp/internal/handler"
    "myapp/internal/service"
    "myapp/internal/repository"
)

type App struct {
    config *config.Config
    server *Server
}

func New(cfg *config.Config) *App {
    // 初始化数据库
    db := connectDB(cfg.Database)

    // 初始化各层
    repo := repository.New(db)
    svc := service.New(repo)
    h := handler.New(svc)

    server := NewServer(cfg.Server, h)

    return &App{
        config: cfg,
        server: server,
    }
}
```

## 分层架构

### 三层架构

```
┌─────────────────────────────────┐
│        Handler Layer             │  HTTP/gRPC 处理
│  (Controller/Presentation)       │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│        Service Layer             │  业务逻辑
│  (Business Logic/Use Cases)      │
└─────────────┬───────────────────┘
              │
┌─────────────▼───────────────────┐
│      Repository Layer           │  数据访问
│  (Data Access/Persistence)       │
└─────────────────────────────────┘
```

### Handler 层

```go
// internal/handler/user.go
package handler

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "myapp/internal/service"
)

type UserHandler struct {
    userService *service.UserService
}

func NewUserHandler(svc *service.UserService) *UserHandler {
    return &UserHandler{userService: svc}
}

func (h *UserHandler) RegisterRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        api.GET("/users/:id", h.GetUser)
        api.POST("/users", h.CreateUser)
        api.PUT("/users/:id", h.UpdateUser)
    }
}

func (h *UserHandler) GetUser(c *gin.Context) {
    id := c.Param("id")
    user, err := h.userService.GetUser(c.Request.Context(), id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, user)
}
```

### Service 层

```go
// internal/service/user.go
package service

import (
    "context"
    "myapp/internal/model"
    "myapp/internal/repository"
)

type UserService struct {
    userRepo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
    return &UserService{userRepo: repo}
}

func (s *UserService) GetUser(ctx context.Context, id string) (*model.User, error) {
    // 业务逻辑
    if id == "" {
        return nil, errors.New("invalid user id")
    }

    user, err := s.userRepo.FindByID(ctx, id)
    if err != nil {
        return nil, err
    }

    return user, nil
}
```

### Repository 层

```go
// internal/repository/user.go
package repository

import (
    "context"
    "database/sql"
    "myapp/internal/model"
)

type UserRepository struct {
    db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
    return &UserRepository{db: db}
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*model.User, error) {
    var user model.User
    err := r.db.QueryRowContext(ctx,
        "SELECT id, name, email FROM users WHERE id = ?", id,
    ).Scan(&user.ID, &user.Name, &user.Email)

    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

## 包组织

### 包命名规则

```go
// ✅ 好的包名
package user        // 简洁、小写、单数
package api         // 清晰描述
package http        // 标准库风格

// ❌ 不好的包名
package users       // 复数
package userSvc     // 缩写
package myservice   // 过于通用
```

### 包结构示例

```
internal/
├── handler/          # 处理器包
│   ├── user.go       # 用户相关处理器
│   └── product.go    # 产品相关处理器
├── service/          # 服务包
│   ├── user.go       # 用户服务
│   └── product.go    # 产品服务
└── repository/       # 仓库包
    ├── user.go       # 用户仓库
    └── product.go    # 产品仓库
```

### 依赖注入

```go
// 构造函数注入
type Container struct {
    Config      *config.Config
    DB          *sql.DB
    UserRepo    *repository.UserRepository
    UserService *service.UserService
    UserHandler *handler.UserHandler
}

func NewContainer(cfg *config.Config) (*Container, error) {
    c := &Container{Config: cfg}

    // 初始化数据库
    db, err := sql.Open("mysql", cfg.Database.DSN)
    if err != nil {
        return nil, err
    }
    c.DB = db

    // 初始化依赖链
    c.UserRepo = repository.NewUserRepository(db)
    c.UserService = service.NewUserService(c.UserRepo)
    c.UserHandler = handler.NewUserHandler(c.UserService)

    return c, nil
}
```

## 构建系统

### Makefile

```makefile
# Makefile
.PHONY: all build clean test lint run

APP_NAME := myapp
VERSION := $(shell git describe --tags --always)
LDFLAGS := -ldflags "-X main.Version=$(VERSION)"

all: build

build:
	go build $(LDFLAGS) -o bin/$(APP_NAME) ./cmd/$(APP_NAME)

build-worker:
	go build $(LDFLAGS) -o bin/worker ./cmd/worker

clean:
	rm -rf bin/

test:
	go test -v -race -coverprofile=coverage.out ./...

lint:
	golangci-lint run

run:
	go run ./cmd/$(APP_NAME)

docker-build:
	docker build -t $(APP_NAME):$(VERSION) .

docker-run:
	docker run -p 8080:8080 $(APP_NAME):$(VERSION)
```

### 构建标签

```go
// +build !prod

// app_dev.go - 开发环境
package main

func init() {
    EnableDebugLog()
}

// +build prod

// app_prod.go - 生产环境
package main

func init() {
    EnableProductionMode()
}
```

## 最佳实践

::: tip 布局建议

1. **遵循约定** - 使用标准 Go 项目布局
2. **分层清晰** - handler、service、repository
3. **包命名** - 简洁、小写、单数
4. **依赖注入** - 使用构造函数或 Wire
5. **构建系统** - Makefile 或 scripts

:::

```go
// ✅ 好的模式
func goodStructure() {
    // 清晰的分层
    repo := repository.New(db)
    service := service.New(repo)
    handler := handler.New(service)

    _ = handler
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **cmd** | 主应用程序入口 |
| **internal** | 私有应用代码 |
| **pkg** | 可被外部使用的库 |
| **分层** | handler、service、repository |
| **构建** | Makefile 或 scripts |

::: v-pre

[概述](./README.md) → [代码规范](./code-style.md)

:::
