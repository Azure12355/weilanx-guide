---
title: 项目结构
icon: ri:folder-remote-line
order: 2
---

# 项目结构

良好的项目结构是 Go 工程实践的基础，遵循社区约定可以提高代码可维护性。

## 标准项目布局

### 基本结构

```bash
myapp/
├── cmd/                    # 主应用程序入口
│   ├── myapp/             # 可执行文件 myapp
│   │   └── main.go
│   └── worker/            # 可执行文件 worker
│       └── main.go
├── internal/              # 私有应用和库代码
│   ├── app/              # 应用初始化和依赖注入
│   ├── config/           # 配置加载和验证
│   ├── handler/          # HTTP 处理器
│   ├── service/          # 业务逻辑层
│   ├── repository/       # 数据访问层
│   └── model/            # 数据模型
├── pkg/                   # 可被外部使用的库
│   └── util/
│       └── strings.go
├── api/                   # API 协议定义
│   ├── openapi/          # OpenAPI/Swagger 规范
│   ├── http/             # HTTP API 定义
│   └── grpc/             # gRPC 定义
├── web/                   # Web 静态资源
│   ├── static/
│   └── templates/
├── configs/               # 配置文件示例
│   ├── config.yaml
│   └── config.prod.yaml
├── scripts/               # 构建、安装、分析脚本
│   ├── build.sh
│   └── deploy.sh
├── test/                  # 额外的测试数据和工具
│   ├── testdata/
│   └── mocks/
├── docs/                  # 设计和用户文档
│   ├── api/
│   └── architecture.md
├── deployments/           # 部署配置
│   ├── docker/
│   │   └── Dockerfile
│   └── k8s/
│       └── deployment.yaml
├── .github/               # GitHub 配置
│   └── workflows/
│       └── ci.yml
├── go.mod
├── go.sum
├── Makefile
├── README.md
└── .golangci.yml
```

### cmd 目录

```go
// cmd/myapp/main.go
package main

import (
    "myapp/internal/app"
)

func main() {
    application := app.New()
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
    "myapp/internal/repository"
    "myapp/internal/service"
)

type App struct {
    config *config.Config
    server *Server
}

func New() *App {
    // 加载配置
    cfg, _ := config.Load()

    // 初始化依赖
    db := connectDB(cfg.Database)
    repo := repository.New(db)
    svc := service.New(repo)
    h := handler.New(svc)

    server := NewServer(cfg.Server, h)

    return &App{
        config: cfg,
        server: server,
    }
}

func (a *App) Run() error {
    return a.server.Start()
}
```

## 分层架构

### 领域驱动设计

```
┌─────────────────────────────────────────┐
│           Handler Layer                 │
│  (HTTP, gRPC, CLI handlers)             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Service Layer                 │
│  (Business logic, use cases)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Repository Layer                 │
│  (Data access, external APIs)           │
└─────────────────────────────────────────┘
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

func NewUserHandler(userService *service.UserService) *UserHandler {
    return &UserHandler{
        userService: userService,
    }
}

func (h *UserHandler) RegisterRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        api.GET("/users/:id", h.GetUser)
        api.POST("/users", h.CreateUser)
        api.PUT("/users/:id", h.UpdateUser)
        api.DELETE("/users/:id", h.DeleteUser)
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
    "fmt"

    "myapp/internal/model"
    "myapp/internal/repository"
)

type UserService struct {
    userRepo *repository.UserRepository
    logger   Logger
}

func NewUserService(userRepo *repository.UserRepository, logger Logger) *UserService {
    return &UserService{
        userRepo: userRepo,
        logger:   logger,
    }
}

func (s *UserService) GetUser(ctx context.Context, id string) (*model.User, error) {
    // 验证输入
    if id == "" {
        return nil, fmt.Errorf("invalid user id")
    }

    // 业务逻辑
    user, err := s.userRepo.FindByID(ctx, id)
    if err != nil {
        s.logger.Error("failed to find user", "id", id, "error", err)
        return nil, fmt.Errorf("user not found: %w", err)
    }

    return user, nil
}

func (s *UserService) CreateUser(ctx context.Context, req *CreateUserRequest) (*model.User, error) {
    // 验证
    if err := s.validateCreateRequest(req); err != nil {
        return nil, err
    }

    // 检查重复
    exists, err := s.userRepo.ExistsByEmail(ctx, req.Email)
    if err != nil {
        return nil, err
    }
    if exists {
        return nil, fmt.Errorf("email already exists")
    }

    // 创建用户
    user := &model.User{
        ID:        generateID(),
        Name:      req.Name,
        Email:     req.Email,
        CreatedAt: time.Now(),
    }

    if err := s.userRepo.Create(ctx, user); err != nil {
        return nil, fmt.Errorf("failed to create user: %w", err)
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
        "SELECT id, name, email, created_at FROM users WHERE id = ?",
        id,
    ).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)

    if err == sql.ErrNoRows {
        return nil, fmt.Errorf("user not found")
    }
    if err != nil {
        return nil, err
    }

    return &user, nil
}

func (r *UserRepository) Create(ctx context.Context, user *model.User) error {
    _, err := r.db.ExecContext(ctx,
        "INSERT INTO users (id, name, email, created_at) VALUES (?, ?, ?, ?)",
        user.ID, user.Name, user.Email, user.CreatedAt,
    )
    return err
}

func (r *UserRepository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
    var exists bool
    err := r.db.QueryRowContext(ctx,
        "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)",
        email,
    ).Scan(&exists)
    return exists, err
}
```

## 依赖注入

### 构造函数注入

```go
// internal/app/wire.go
package app

import (
    "myapp/internal/config"
    "myapp/internal/handler"
    "myapp/internal/repository"
    "myapp/internal/service"
)

type Container struct {
    Config       *config.Config
    DB           *sql.DB

    // Repositories
    UserRepo     *repository.UserRepository

    // Services
    UserService  *service.UserService

    // Handlers
    UserHandler  *handler.UserHandler
}

func NewContainer(cfg *config.Config) (*Container, error) {
    c := &Container{Config: cfg}

    // 初始化数据库
    db, err := sql.Open("mysql", cfg.Database.DSN)
    if err != nil {
        return nil, err
    }
    c.DB = db

    // 初始化 repositories
    c.UserRepo = repository.NewUserRepository(db)

    // 初始化 services
    c.UserService = service.NewUserService(c.UserRepo, logger)

    // 初始化 handlers
    c.UserHandler = handler.NewUserHandler(c.UserService)

    return c, nil
}

func (c *Container) Close() error {
    return c.DB.Close()
}
```

### 使用 Wire

```go
//go:build wireinject
// +build wireinject

package app

import (
    "github.com/google/wire"
)

func InitializeApplication(cfg *config.Config) (*App, error) {
    wire.Build(
        NewDB,
        repository.NewUserRepository,
        service.NewUserService,
        handler.NewUserHandler,
        NewServer,
        NewApp,
    )
    return &App{}, nil
}

// wire.go
//go:generate wire
func InitializeApplication(cfg *config.Config) (*App, error)
```

## 包命名

### 包命名规则

```go
// ✅ 好的包名
package user      // 简洁、小写
package api       // 清晰描述
package http      // 标准库风格

// ❌ 不好的包名
package users     // 复数
package userSvc   // 缩写
package myservice // 过于通用
```

### 包结构示例

```
internal/
├── handler/          # 处理器层
│   ├── user.go
│   └── product.go
├── service/          # 服务层
│   ├── user.go
│   └── product.go
└── repository/       # 数据访问层
    ├── user.go
    └── product.go
```

## 接口定义

### 接口位置

```go
// ✅ 接口在使用方定义
// internal/service/user.go
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*model.User, error)
    Create(ctx context.Context, user *model.User) error
    Update(ctx context.Context, user *model.User) error
    Delete(ctx context.Context, id string) error
}

type UserService struct {
    repo UserRepository  // 接口，不是具体类型
}

// internal/repository/user.go
type UserRepository struct {  // 具体实现
    db *sql.DB
}

// ❌ 不好的方式：在 provider 定义接口
// internal/repository/user.go
type UserRepository interface { ... }

type userRepoImpl struct { ... }
```

### 测试 mock

```go
// internal/service/user_test.go
type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) FindByID(ctx context.Context, id string) (*model.User, error) {
    args := m.Called(ctx, id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*model.User), args.Error(1)
}

func TestUserService_GetUser(t *testing.T) {
    mockRepo := new(MockUserRepository)
    mockRepo.On("FindByID", mock.Anything, "123").Return(&model.User{ID: "123"}, nil)

    service := NewUserService(mockRepo, zap.NewNop())
    user, err := service.GetUser(context.Background(), "123")

    assert.NoError(t, err)
    assert.Equal(t, "123", user.ID)
    mockRepo.AssertExpectations(t)
}
```

## 构建系统

### Makefile

```makefile
# Makefile
.PHONY: all build clean test lint run

# 变量
APP_NAME=myapp
VERSION=$(shell git describe --tags --always --dirty)
BUILD_TIME=$(shell date -u '+%Y-%m-%d_%H:%M:%S')
LDFLAGS=-ldflags "-X main.Version=$(VERSION) -X main.BuildTime=$(BUILD_TIME)"

# 目标
all: build

build:
	go build $(LDFLAGS) -o bin/$(APP_NAME) ./cmd/$(APP_NAME)

build-worker:
	go build $(LDFLAGS) -o bin/worker ./cmd/worker

clean:
	rm -rf bin/

test:
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

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

// app_dev.go
package main

func init() {
    // 开发环境初始化
    EnableDebugLog()
}

// +build prod

// app_prod.go
package main

func init() {
    // 生产环境初始化
    EnableProductionMode()
}
```

## 最佳实践

::: tip 项目结构建议

1. **遵循约定** - 使用标准项目布局
2. **分层清晰** - handler、service、repository
3. **接口定义** - 接口在使用方定义
4. **依赖注入** - 使用构造函数或 Wire
5. **包命名** - 简洁、小写、描述性

:::

```go
// ✅ 好的模式
func goodStructure() {
    // 清晰的分层
    repo := repository.New(db)
    service := service.New(repo)
    handler := handler.New(service)

    // 依赖关系明确
    _ = handler
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **标准布局** - cmd、internal、pkg |
| **分层架构** - handler、service、repository |
| **依赖注入** - 构造函数或 Wire |
| **接口位置** - 在使用方定义 |
| **构建系统** - Makefile 或 scripts |

::: v-pre

[概述](./README.md) → [日志系统](./logging.md)

:::
