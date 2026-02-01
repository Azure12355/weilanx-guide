---
title: 依赖管理
icon: ri:links-line
order: 5
---

# 依赖管理

有效的依赖管理确保项目构建的稳定性和可重复性。

## 依赖类型

### 直接依赖

```go
// go.mod
module example.com/myproject

go 1.21

require (
    // 直接依赖：项目代码中直接导入的包
    github.com/gin-gonic/gin v1.9.1
    gorm.io/gorm v1.25.5
    github.com/stretchr/testify v1.8.4
)
```

### 间接依赖

```go
// go.mod
require (
    github.com/gin-gonic/gin v1.9.1

    // 间接依赖：gin 依赖的包
    github.com/bytedance/sonic v1.9.1 // indirect
    github.com/gabriel-vasile/mimetype v1.4.2 // indirect
    golang.org/x/net v0.15.0 // indirect
)

// indirect 标记：
// - 标记为间接依赖
// - 不在项目代码中直接导入
// - 由直接依赖引入
```

### 查看依赖关系

```bash
# 列出所有依赖
go mod list

# 只列出直接依赖
go mod list -m

# 查看完整依赖图
go mod graph

# 查看特定依赖
go mod list -m github.com/gin-gonic/gin

# 查看为什么需要某个依赖
go mod why github.com/bytedance/sonic

# 输出示例：
# # example.com/myproject
# github.com/gin-gonic/gin
# github.com/gin-gonic/gin
# github.com/bytedance/sonic
```

## 版本选择

### 语义化版本

```go
// 版本号：v主版本.次版本.修订号

v1.0.0 - 初始稳定版本
v1.1.0 - 新增功能，向后兼容
v1.1.1 - Bug 修复，向后兼容
v2.0.0 - 破坏性变更

// 预发布版本
v1.2.0-alpha
v1.2.0-beta.1
v1.2.0-rc.1

// 伪版本（没有标签的提交）
v0.0.0-20230101120000-abc123def456
```

### 版本查询

```bash
# 获取最新版本
go get github.com/pkg/errors@latest

# 获取特定版本
go get github.com/pkg/errors@v0.9.1

# 获取版本前缀
go get github.com/pkg/errors@v0.9

# 获取分支
go get github.com/pkg/errors@main
go get github.com/pkg/errors@develop

# 获取提交
go get github.com/pkg/errors@abc123def456
```

### 版本约束

```go
// 在 go.mod 中指定版本

require (
    // 精确版本
    github.com/pkg/errors v0.9.1

    // 版本范围（使用波浪号）
    github.com/pkg/errors v0.9.1  // >= v0.9.1, < v0.10.0

    // 主版本后缀表示不同的 API
    github.com/pkg/errors/v2 v2.0.0
)

// 导入时的版本
import (
    "github.com/pkg/errors"      // v1
    "github.com/pkg/errors/v2"   // v2
)
```

## 更新依赖

### 检查更新

```bash
# 检查所有可用的更新
go list -m -u all

# 输出示例：
// github.com/gin-gonic/gin v1.9.1 [v1.10.0]
// gorm.io/gorm v1.25.5 [v1.25.6]

# 检查特定包的更新
go list -m -u github.com/gin-gonic/gin
```

### 更新命令

```bash
# 更新到最新次要版本（v1.x.x）
go get -u github.com/pkg/errors

# 更新到最新补丁版本（v1.1.x）
go get -u=patch github.com/pkg/errors

# 更新所有依赖
go get -u ./...

# 更新所有直接依赖
go get -u $(go list -m -f '{{if not .Indirect}}{{.Path}}{{end}}' all)
```

### 更新策略

```go
// 策略 1: 自动更新（适合开发）
// 使用 go mod tidy 自动选择版本

// 策略 2: 锁定版本（适合生产）
// 在 go.mod 中明确指定版本
require github.com/pkg/errors v0.9.1

// 策略 3: 主版本升级（需代码变更）
// 从 v1 升级到 v2
// 更新导入路径
// import "github.com/pkg/errors/v2"
```

## 清理依赖

### go mod tidy

```bash
# 整理依赖
go mod tidy

// 作用：
// 1. 添加缺失的依赖
// 2. 移除未使用的依赖
// 3. 更新 go.sum

# 查看将要做的更改
go mod tidy -diff

# 只整理不修改
go mod tidy -v
```

### go mod verify

```bash
# 验证依赖
go mod verify

// 作用：
// 1. 检查依赖的哈希
// 2. 确保依赖未被篡改
// 3. 验证 go.sum 完整性
```

### go mod vendor

```bash
# 创建 vendor 目录
go mod vendor

// 作用：
// 1. 复制依赖到 vendor/
// 2. 支持离线构建
// 3. 可重复构建

# 使用 vendor 模式构建
go build -mod=vendor
```

## 依赖冲突

### 版本冲突

```go
// 场景：两个包依赖不同版本
// packageA → github.com/pkg/errors v0.9.0
// packageB → github.com/pkg/errors v0.8.0

// Go Modules 的解决方案：
// 1. 选择满足约束的最低版本
// 2. 在 go.mod 中只保留一个版本
// 3. 通常选择更新的版本

require (
    github.com/pkg/errors v0.9.0  // 被选择
)
```

### 最小版本选择

```go
// Go Modules 使用最小版本选择（MVS）

// 场景：
// 项目 → A → v1.2
// 项目 → B → v1.3
// 项目 → C → v1.1

// 选择 v1.3（满足所有约束的最低版本）

// 优点：
// - 可重复构建
// - 明确的版本选择
// - 避免意外更新
```

## 依赖分析

### 查看依赖关系

```bash
# 完整依赖图
go mod graph

# 查看特定包的依赖
go mod graph | grep "github.com/gin-gonic/gin"

# 查看依赖链
go mod why github.com/bytedance/sonic
```

### 依赖大小

```bash
# 查看模块缓存大小
du -sh $(go env GOMODCACHE)

# 查看特定模块
ls -lh $(go env GOMODCACHE)/github.com/gin-gonic/
```

## 私有依赖

### 配置访问

```bash
# 设置私有模块前缀
export GOPRIVATE=github.com/mycompany

# 设置模块代理
export GOPROXY=https://goproxy.cn,direct

# 设置校验和数据库
export GOSUMDB=off

# 设置访问令牌
git config --global url."https://username:token@github.com/".insteadOf "https://github.com/"
```

### 认证配置

```go
// netrc 文件
// ~/.netrc
machine github.com
login username
password token

// 或使用 git credential
git config --global credential.helper store
git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
```

## 依赖锁定

### 生产锁定

```bash
# 使用 go.mod 和 go.sum 锁定版本

# 方法 1: 不运行 go get -u
# 保持现有版本不变

# 方法 2: 指定精确版本
go get github.com/pkg/errors@v0.9.1

# 方法 3: 使用 vendor 模式
go mod vendor
go build -mod=vendor
```

### 版本策略

```go
// 开发环境
// - 使用最新稳定版本
// - 定期更新依赖
// - 关注安全更新

// 测试环境
// - 锁定版本
// - 使用 go.mod 和 go.sum
// - 确保可重复构建

// 生产环境
// - 严格锁定版本
// - 不自动更新
// - 使用 vendor 模式（可选）
```

## 最佳实践

::: tip 使用建议

1. **定期更新** - 及时获取安全补丁
2. **版本锁定** - 生产环境锁定版本
3. **审查依赖** - 检查依赖的安全性和质量
4. **最小化依赖** - 只引入必要的依赖
5. **文档记录** - 记录重要的依赖更新

:::

```bash
# ✅ 好的依赖管理实践

# 1. 定期检查更新
go list -m -u all

# 2. 更新前查看变更
go get -u github.com/pkg/errors
git diff go.mod go.sum

# 3. 测试更新
go test ./...

# 4. 提交前整理
go mod tidy

# 5. 验证完整性
go mod verify
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **直接依赖** - 代码中直接导入 |
| **间接依赖** - 传递依赖 |
| **MVS** - 最小版本选择 |
| **go mod tidy** - 整理依赖 |
| **go mod verify** - 验证完整性 |
| **版本锁定** - 确保可重复构建 |

::: v-pre

[导入导出](./import-export.md) → [私有仓库](./private-repos.md)

:::
