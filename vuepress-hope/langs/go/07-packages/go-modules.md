---
title: Go Modules
icon: ri:database-2-line
order: 3
---

# Go Modules

Go Modules 是 Go 的官方依赖管理系统，自 Go 1.11 起成为标准。

## go.mod 文件

### 创建模块

```bash
# 初始化新模块
go mod init example.com/myproject

# 初始化子目录模块
go mod init example.com/myproject/services
```

### go.mod 结构

```go
// go.mod 文件示例
module example.com/myproject

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    gorm.io/gorm v1.25.5
    github.com/stretchr/testify v1.8.4
)

require (
    github.com/bytedance/sonic v1.9.1 // indirect
    golang.org/x/net v0.15.0 // indirect
)

replace (
    github.com/old/pkg => github.com/new/pkg v1.2.3
)

exclude (
    github.com/bad/pkg v1.0.0
)

retract (
    v1.0.1 // 有 bug 的版本
)
```

### 指令详解

```go
// module - 模块路径（模块名）
module example.com/myproject

// go - Go 版本要求
go 1.21

// require - 依赖包
require (
    github.com/pkg/errors v0.9.1
)

// indirect - 间接依赖
require github.com/bytedance/sonic v1.9.1 // indirect

// replace - 替换依赖
replace github.com/old/pkg => ../local/pkg

// exclude - 排除版本
exclude github.com/bad/pkg v1.0.0

// retract - 撤回版本
retract v1.0.1
```

## go.sum 文件

### 文件结构

```
github.com/gin-gonic/gin v1.9.1 h1:...哈希...
github.com/gin-gonic/gin v1.9.1/go.mod h1:...哈希...
github.com/stretchr/testify v1.8.4 h1:...哈希...
github.com/stretchr/testify v1.8.4/go.mod h1:...哈希...
```

### 作用

```go
// go.sum 的作用：
// 1. 记录依赖的加密哈希
// 2. 确保依赖完整性
// 3. 防止依赖被篡改
// 4. 支持可重复构建

// 不应手动编辑 go.sum
// 由 go 命令自动维护
```

## 依赖管理命令

### 基本命令

```bash
# 初始化模块
go mod init example.com/myproject

# 下载依赖
go mod download

# 整理依赖
go mod tidy

# 验证依赖
go mod verify

# 查看依赖
go mod list

# 查看依赖图
go mod graph

# 为什么需要某个依赖
go mod why github.com/pkg/errors
```

### 添加依赖

```bash
# 添加最新版本
go get github.com/pkg/errors

# 添加指定版本
go get github.com/pkg/errors@v0.9.1

# 添加特定分支
go get github.com/pkg/errors@main

# 添加特定提交
go get github.com/pkg/errors@abc123def

# 更新所有依赖
go get -u ./...

# 更新指定依赖
go get -u github.com/pkg/errors
```

### 版本选择

```go
// 版本号格式
v1.2.3        // 主版本.次版本.修订号
v1.2.3-pre    // 预发布版本
v0.0.0-20230101120000-abc123  // 伪版本

// 查询版本
// @latest        - 最新版本
// @v1.2          - v1.2.x 的最新版本
// @v1.2.3        - 精确版本
// @master        - master 分支
// @commit-hash   - 特定提交
```

## 依赖管理

### 直接依赖

```bash
# 查看直接依赖
go mod list -m

# 输出示例：
# example.com/myproject
# github.com/gin-gonic/gin v1.9.1
# gorm.io/gorm v1.25.5
```

### 间接依赖

```bash
# 查看所有依赖（包括间接）
go mod list

# 查看某个包为什么被需要
go mod why github.com/bytedance/sonic

# 输出示例：
# # example.com/myproject
# github.com/gin-gonic/gin
# github.com/gin-gonic/gin
# github.com/bytedance/sonic
```

### 更新依赖

```bash
# 检查可用的更新
go list -m -u all

# 更新所有依赖到最新次要版本
go get -u ./...

# 更新所有依赖到最新主版本
go get -u=patch ./...

# 更新特定依赖
go get -u github.com/gin-gonic/gin
```

## 模块操作

### 本地替换

```go
// go.mod
module example.com/myproject

go 1.21

// 替换为本地路径
replace github.com/remote/pkg => ../local/pkg

// 或使用绝对路径
replace github.com/remote/pkg => /abs/path/to/pkg
```

### 版本替换

```go
// 替换为不同版本
require github.com/pkg/errors v0.9.1
replace github.com/pkg/errors => github.com/pkg/errors v0.8.0

// 替换为 fork
replace github.com/original/pkg => github.com/fork/pkg v1.0.0
```

### 排除版本

```go
// 排除特定版本
exclude github.com/bad/pkg v1.0.0
exclude github.com/bad/pkg v1.1.0

// 排除不会让 go 使用其他版本
// 而是会导致错误，强制你选择版本
```

### 撤回版本

```go
// 撤回有问题的版本
retract v1.0.1 // 严重 bug
retract v1.0.2 // 安全漏洞

// 添加撤回原因
retract v1.0.1 {
    // 严重 bug：数据可能丢失
}
```

## 工作区模式

### go.work 文件

```go
// go.work
go 1.21

use (
    ./app
    ./services/auth
    ./services/user
)

// 目录替换
replace github.com/company/pkg => ./pkg
```

### 工作区命令

```bash
# 初始化工作区
go work init

# 添加模块到工作区
go work use ./services/auth

# 同步工作区
go work sync

# 查看工作区信息
go work vendor
```

## 私有模块

### 配置 GOPRIVATE

```bash
# 设置私有模块前缀
export GOPRIVATE=github.com/mycompany

# 多个私有前缀
export GOPRIVATE=github.com/mycompany,gitlab.com/myteam

# 模块代理设置
export GOPROXY=https://goproxy.cn,direct
export GOSUMDB=off
```

### go.mod 配置

```go
// go.mod
module github.com/mycompany/myproject

go 1.21

// 私有仓库配置
require (
    github.com/mycompany/private-pkg v1.0.0
)
```

## 版本控制

### 语义化版本

```go
// 版本号格式：v主版本.次版本.修订号

v1.0.0  - 初始稳定版本
v1.1.0  - 新增功能（向后兼容）
v1.1.1  - Bug 修复（向后兼容）
v2.0.0  - 破坏性更改

// 预发布版本
v1.2.3-alpha
v1.2.3-beta
v1.2.3-rc.1
```

### 主版本后缀

```go
// v2 及以上需要主版本后缀

// v1 不需要后缀
module github.com/example/pkg

// v2 需要后缀
module github.com/example/pkg/v2

// 导入 v2 包
import "github.com/example/pkg/v2"

// 目录结构
pkg/
├── v2/
│   └── pkg.go  // package v2
└── pkg.go      // package pkg (v1)
```

## 最佳实践

::: tip 使用建议

1. **提交 go.sum** - 确保依赖完整性
2. **版本锁定** - 生产环境锁定版本
3. **定期更新** - 及时更新安全补丁
4. **最小化依赖** - 只引入必要的依赖
5. **私有模块** - 配置 GOPRIVATE

:::

```bash
# ✅ 好的工作流

# 1. 初始化模块
go mod init github.com/myorg/myproject

# 2. 添加依赖
go get github.com/gin-gonic/gin@v1.9.1

# 3. 整理依赖
go mod tidy

# 4. 验证依赖
go mod verify

# 5. 构建项目
go build ./...

# 6. 提交 go.mod 和 go.sum
git add go.mod go.sum
git commit -m "Add dependencies"
```

## 常见问题

### 依赖冲突

```bash
# 问题：多个包依赖不同版本
# 解决：使用 go mod tidy 自动解析

# 查看冲突
go mod graph | grep package-name

# 手动指定版本
go get github.com/pkg/errors@v0.9.1
```

### 依赖未使用

```bash
# 问题：go.sum 有未使用的依赖
# 解决：运行 go mod tidy

go mod tidy

# 或只清理未使用的依赖
go mod tidy -diff
```

### 网络问题

```bash
# 设置代理
export GOPROXY=https://goproxy.cn,direct

# 跳过校验和数据库
export GOSUMDB=off

# 直接从源码仓库获取
export GOPRIVATE=github.com/mycompany
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **go.mod** - 模块定义和依赖声明 |
| **go.sum** - 依赖哈希校验 |
| **go mod tidy** - 整理依赖 |
| **go get** - 添加/更新依赖 |
| **replace** - 本地或版本替换 |
| **GOPRIVATE** - 私有模块配置 |

::: v-pre

[包基础](./packages.md) → [导入机制](./imports.md)

:::
