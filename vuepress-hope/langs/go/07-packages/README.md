---
title: 包管理与模块
icon: ri:folder-line
order: 1
---

# 包管理与模块

Go 的包管理和模块系统是其依赖管理和代码组织的核心机制。

## 章节导航

```mermaid
mindmap
  root((包管理与模块))
    包基础
      包声明
      导入导出
      包命名
      包路径
    Go Modules
      go.mod
      go.sum
      依赖管理
      版本控制
    包导入
      相对路径
      绝对路径
      别名导入
      点导入
    依赖管理
      直接依赖
      间接依赖
      依赖更新
      依赖清理
    私有仓库
      模块代理
      认证配置
      私有模块
    最佳实践
      包设计
      版本策略
      依赖控制
```

## 知识体系

### Go Modules 架构

```mermaid
graph TD
    A[go.mod] --> B[模块定义]
    A --> C[依赖声明]
    A --> D[Go 版本]

    E[go.sum] --> F[依赖哈希]
    E --> G[完整性验证]

    H[go.work] --> I[工作区]
    H --> J[多模块管理]

    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style H fill:#fff9c4
```

### 依赖管理流程

```mermaid
graph LR
    A[go get] --> B[下载依赖]
    B --> C[更新 go.mod]
    C --> D[更新 go.sum]
    D --> E[构建项目]

    style A fill:#c8e6c9
    style E fill:#ffccbc
```

## 学习路线

```mermaid
graph LR
    A[包基础] --> B[Go Modules]
    B --> C[依赖管理]
    C --> D[导入机制]
    D --> E[私有仓库]
    E --> F[最佳实践]

    style A fill:#c8e6c9
    style B fill:#fff9c4
    style C fill:#ffccbc
    style D fill:#f8bbd9
    style E fill:#d1c4e9
    style F fill:#c5cae9
```

## 快速预览

### 初始化模块

```bash
# 初始化新模块
go mod init example.com/myproject

# 下载依赖
go mod download

# 整理依赖
go mod tidy

# 查看依赖
go mod graph
```

### 导入包

```go
// 导入标准库
import "fmt"

// 导入第三方包
import "github.com/gin-gonic/gin"

// 导入本地包
import "example.com/myproject/utils"
```

## 核心概念

### Go Modules

```go
// go.mod 文件
module example.com/myproject

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    gorm.io/gorm v1.25.5
)
```

### 依赖版本

```bash
# 指定版本
go get github.com/pkg/errors@v0.9.1

# 最新版本
go get github.com/pkg/errors@latest

# 特定分支
go get github.com/pkg/errors@main

# 提交哈希
go get github.com/pkg/errors@abc123
```

## 实践建议

::: tip 学习建议

1. **理解模块** - Go Modules 是现代依赖管理方式
2. **版本控制** - 使用语义化版本号
3. **依赖最小化** - 只引入必要的依赖
4. **私有模块** - 配置 GOPRIVATE 使用私有仓库
5. **go.sum** - 理解依赖校验机制

:::

## 学习检查

完成本章节学习后，您应该能够：

- [ ] 创建和管理 Go Modules
- [ ] 理解包的导入导出机制
- [ ] 管理项目依赖
- [ ] 配置私有模块仓库
- [ ] 理解版本控制策略
- [ ] 处理依赖冲突

## 下一步

让我们开始深入学习包管理与模块的各个部分！

::: v-pre

[包基础](./packages.md) → [Go Modules](./go-modules.md) → [导入机制](./imports.md) → [依赖管理](./dependencies.md) → [私有仓库](./private-repos.md) → [最佳实践](./best-practices.md)

:::
