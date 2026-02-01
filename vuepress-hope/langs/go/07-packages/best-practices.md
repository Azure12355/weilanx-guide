---
title: 最佳实践
icon: ri:star-line
order: 7
---

# 包管理最佳实践

遵循最佳实践可以让你的 Go 项目更易于维护和协作。

## 项目结构

### 标准项目布局

```
project/
├── go.mod              # 模块定义
├── go.sum              # 依赖校验
├── go.work             # 工作区（可选）
├── main.go             # 入口文件
├── README.md           # 项目文档
├── LICENSE             # 许可证
├── cmd/                # 可执行程序
│   ├── server/
│   │   └── main.go
│   └── client/
│       └── main.go
├── internal/           # 私有应用代码
│   ├── app/
│   ├── config/
│   └── database/
├── pkg/                # 可被外部使用的库
│   ├── api/
│   └── utils/
├── api/                # API 定义
│   ├── http/
│   └── grpc/
├── web/                # Web 资源
│   ├── static/
│   └── templates/
├── configs/            # 配置文件
├── scripts/            # 构建和安装脚本
├── test/               # 额外的测试数据
├── docs/               # 项目文档
├── tools/              # 支持工具
├── examples/           # 示例代码
├── third_party/        # 第三方 fork
├── golangci-lint.yaml  # Linter 配置
├── .dockerignore
├── .gitignore
└── Makefile
```

### 模块命名

```go
// ✅ 好的模块名
module github.com/mycompany/myproject
module gitlab.com/team/project
module example.com/v2/myproject

// ❌ 不好的模块名
module myproject  // 缺少域名前缀
module my-project  // 不要使用连字符
module MyProject   // 不要使用大写
```

## 包命名

### 命名规则

```go
// ✅ 好的包名
package http
package json
package user
package calculator

// 规则：
// 1. 全小写
// 2. 简短（1-2 个单词）
// 3. 描述性
// 4. 不使用下划线或驼峰

// ❌ 不好的包名
package myPackage
package my_package
package calculatorUtil
package a
package data
```

### 包职责

```go
// ✅ 单一职责的包
// strings/strings.go - 字符串操作
package strings

func Reverse(s string) string {
    // 字符串操作
}

// math/math.go - 数学运算
package math

func Add(a, b int) int {
    return a + b
}

// ❌ 多职责的包
// utils/utils.go - 混合不相关功能
package utils

func ReverseString(s string) string {}
func AddNumbers(a, b int) int {}
func ConnectDB() error {}
```

## 导入管理

### 导入顺序

```go
// ✅ 标准导入顺序
import (
    // 1. 标准库
    "fmt"
    "math"

    // 2. 第三方库
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"

    // 3. 本地包
    "github.com/mycompany/myproject/models"
)

// 使用 goimports 自动格式化
// go install golang.org/x/tools/cmd/goimports@latest
// goimports -w main.go
```

### 导入分组

```go
// ✅ 按组导入，使用空行分隔
import (
    "fmt"
    "os"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/go-redis/redis/v8"

    "github.com/mycompany/myproject/config"
    "github.com/mycompany/myproject/models"
)

// 好处：
// 1. 清晰的组织结构
// 2. 易于阅读
// 3. 易于维护
```

## 版本管理

### 语义化版本

```go
// 版本号：v主版本.次版本.修订号

v1.0.0  // 初始稳定版本
v1.1.0  // 新增向后兼容的功能
v1.1.1  // 向后兼容的 Bug 修复
v2.0.0  // 破坏性变更

// 预发布版本
v1.2.0-alpha.1
v1.2.0-beta.1
v1.2.0-rc.1

// 规则：
// 1. 递增主版本（破坏性变更）
// 2. 递增次版本（新功能）
// 3. 递增修订号（Bug 修复）
```

### 主版本后缀

```go
// v2+ 需要主版本后缀

// 目录结构
project/
├── v2/
│   └── calculator.go  // package v2
└── calculator.go      // package calculator (v1)

// v2 包
// v2/calculator.go
package v2

func Add(a, b int) int {
    return a + b + 1  // 破坏性变更
}

// 导入 v2 包
import "github.com/mycompany/calculator/v2"
```

## 依赖管理

### 最小化依赖

```go
// ✅ 最小化依赖

// 1. 优先使用标准库
import "encoding/json"  // ✅ 标准库
// 而非
// import "github.com/json-iterator/go"  // ❌ 第三方库（除非必要）

// 2. 只导入需要的包
import "fmt"  // ✅ 需要
// 不要导入不需要的包

// 3. 使用接口避免依赖
type Logger interface {
    Info(msg string)
}
// 而非直接依赖具体实现
```

### 定期更新

```bash
# 定期检查更新
go list -m -u all

# 审查更新内容
go get -u github.com/pkg/errors
git diff go.mod go.sum

# 测试更新
go test ./...

# 提交更新
git add go.mod go.sum
git commit -m "Update dependencies"
```

## 错误处理

### 包错误设计

```go
// ✅ 好的错误设计
package user

import "github.com/pkg/errors"

// 定义错误变量
var (
    ErrUserNotFound = errors.New("user not found")
    ErrInvalidEmail = errors.New("invalid email")
)

// 返回错误
func (s *Service) GetUser(id int) (*User, error) {
    user, err := s.db.QueryUser(id)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrUserNotFound
        }
        return nil, errors.Wrap(err, "failed to query user")
    }
    return user, nil
}

// 错误包装
func (s *Service) CreateUser(name string) error {
    if err := s.db.InsertUser(name); err != nil {
        return errors.Wrap(err, "failed to create user")
    }
    return nil
}
```

## 文档

### 包文档

```go
// Package http provides HTTP client and server implementations.
//
// The http package is organized as follows:
//
//   http.Client - HTTP client
//   http.Server - HTTP server
//   http.Request - HTTP request
//   http.Response - HTTP response
//
// Example:
//
//   resp, err := http.Get("https://example.com")
//   if err != nil {
//       log.Fatal(err)
//   }
//   defer resp.Body.Close()
//
package http

// NewClient creates a new HTTP client with default settings.
//
// The returned client will use a default transport and redirect policy.
//
// Example:
//
//   client := http.NewClient()
//   resp, err := client.Get("https://example.com")
//
func NewClient() *Client {
    return &Client{
        Transport: DefaultTransport,
    }
}
```

### 导出文档

```bash
# 生成文档
go doc -all github.com/mycompany/myproject

# 本地文档服务器
godoc -http=:6060

# 在浏览器中查看
# http://localhost:6060/pkg/github.com/mycompany/myproject/
```

## 测试

### 测试组织

```go
// calculator_test.go
package calculator

import "testing"

// ✅ 表驱动测试
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -2, -3, -5},
        {"zeros", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d",
                    tt.a, tt.b, got, tt.expected)
            }
        })
    }
}
```

### 基准测试

```go
// calculator_bench_test.go
package calculator

import "testing"

func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}

func BenchmarkAddParallel(b *testing.B) {
    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            Add(2, 3)
        }
    })
}
```

## 配置管理

### 配置文件

```go
// config/config.go
package config

import (
    "os"
    "time"
)

type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
    Logging  LoggingConfig
}

type ServerConfig struct {
    Host         string        `json:"host"`
    Port         int           `json:"port"`
    ReadTimeout  time.Duration `json:"readTimeout"`
    WriteTimeout time.Duration `json:"writeTimeout"`
}

// Load 加载配置
func Load(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err
    }

    var cfg Config
    if err := json.Unmarshal(data, &cfg); err != nil {
        return nil, err
    }

    return &cfg, nil
}
```

### 环境变量

```go
// config/env.go
package config

import "os"

// LoadFromEnv 从环境变量加载配置
func LoadFromEnv() *Config {
    return &Config{
        Server: ServerConfig{
            Host: os.Getenv("SERVER_HOST"),
            Port: parseInt(os.Getenv("SERVER_PORT")),
        },
        Database: DatabaseConfig{
            Host:     os.Getenv("DB_HOST"),
            Port:     parseInt(os.Getenv("DB_PORT")),
            User:     os.Getenv("DB_USER"),
            Password: os.Getenv("DB_PASSWORD"),
        },
    }
}
```

## 构建和发布

### Makefile

```makefile
# Makefile
.PHONY: build test clean install

# 变量
BINARY_NAME=myapp
BUILD_DIR=build
VERSION=$(shell git describe --tags --always --dirty)

# 构建
build:
	go build -o $(BUILD_DIR)/$(BINARY_NAME) -ldflags="-X main.Version=$(VERSION)" ./cmd/server

# 测试
test:
	go test -v -race ./...

# 覆盖率
coverage:
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

# 清理
clean:
	rm -rf $(BUILD_DIR)
	rm -f coverage.out coverage.html

# 安装
install: build
	cp $(BUILD_DIR)/$(BINARY_NAME) /usr/local/bin/

# 运行
run:
	go run ./cmd/server

# Lint
lint:
	golangci-lint run

# 格式化
fmt:
	go fmt ./...
	goimports -w .
```

### Docker

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY go.mod go.sum ./
RUN go mod download

# 复制源码
COPY . .

# 构建
RUN CGO_ENABLED=0 go build -o /app/myapp ./cmd/server

# 最终镜像
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/myapp .

EXPOSE 8080

CMD ["./myapp"]
```

## 最佳实践清单

### 代码质量

```bash
# 格式化代码
go fmt ./...
goimports -w .

# 静态分析
golangci-lint run

# 检查依赖
go mod verify

# 安全扫描
gosec ./...

# 测试
go test -v -race -cover ./...
```

### 版本控制

```bash
# .gitignore
/bin/
/pkg/
*.exe
*.test
*.out
go.work
go.work.sum

# 依赖
vendor/

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# 系统
.DS_Store
Thumbs.db
```

### CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'

      - name: Download dependencies
        run: go mod download

      - name: Verify dependencies
        run: go mod verify

      - name: Run tests
        run: go test -v -race -cover ./...

      - name: Run linter
        uses: golangci/golangci-lint-action@v3
```

## 总结

| 实践 | 关键点 |
|------|--------|
| **项目结构** - 标准布局 |
| **包命名** - 小写、简洁 |
| **导入顺序** - 标准库、第三方、本地 |
| **版本管理** - 语义化版本 |
| **最小依赖** - 只引入必要的依赖 |
| **文档** - 包和导出成员文档 |

::: v-pre

[私有仓库](./private-repos.md) → [文件IO](/langs/go/08-io/)

:::
