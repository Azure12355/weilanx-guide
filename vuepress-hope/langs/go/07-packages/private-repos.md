---
title: 私有仓库
icon: ri:git-branch-line
order: 6
---

# 私有仓库

在 Go 中使用私有仓库需要特殊配置，包括认证和代理设置。

## 私有模块配置

### GOPRIVATE 设置

```bash
# 设置私有模块前缀
export GOPRIVATE=github.com/mycompany

# 多个私有前缀
export GOPRIVATE=github.com/mycompany,gitlab.com/myteam,bitbucket.org/myorg

# 使用逗号分隔多个前缀
export GOPRIVATE=*.mycompany.com,*.myteam.com

# 查看当前 GOPRIVATE 设置
go env GOPRIVATE
```

### 环境变量配置

```bash
# GOPROXY - 模块代理
export GOPROXY=https://goproxy.cn,https://goproxy.io,direct

# GOSUMDB - 校验和数据库
export GOSUMDB=sum.golang.google.cn
export GOSUMDB=off  # 禁用校验

# GOPRIVATE - 私有模块前缀
export GOPRIVATE=github.com/mycompany

# GONOPROXY - 不使用代理的路径
export GONOPROXY=github.com/mycompany

# GONOSUMDB - 不校验的路径
export GONOSUMDB=github.com/mycompany

# GOPATH - 工作目录
export GOPATH=$HOME/go

# GOMODCACHE - 模块缓存
export GOMODCACHE=$HOME/go/pkg/mod
```

## 认证配置

### Git 凭据

```bash
# 方法 1: 使用 netrc
# ~/.netrc
machine github.com
login your-username
password your-personal-access-token

# 方法 2: 使用 Git credential helper
git config --global credential.helper store

# 方法 3: 使用 URL 重写
git config --global url."https://username:token@github.com/".insteadOf "https://github.com/"
```

### SSH 配置

```bash
# 生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 添加到 SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

# 复制公钥到 GitHub
cat ~/.ssh/id_rsa.pub

# 配置 SSH (~/.ssh/config)
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa

# 测试连接
ssh -T git@github.com
```

### 访问令牌

```bash
# GitHub Personal Access Token
# Settings → Developer settings → Personal access tokens

# GitLab Personal Access Token
# Settings → Access Tokens

# 使用令牌克隆
git clone https://username:token@github.com/mycompany/private-repo.git
```

## 私有模块使用

### 创建私有模块

```go
// go.mod
module github.com/mycompany/private-pkg

go 1.21

// 私有模块的 go.mod 文件
// 在私有仓库中创建
```

### 导入私有模块

```go
// 项目的 go.mod
module github.com/mycompany/myproject

go 1.21

require (
    // 导入私有模块
    github.com/mycompany/private-pkg v1.0.0
)

// 代码中使用
import (
    "github.com/mycompany/private-pkg/utils"
)

func main() {
    utils.DoSomething()
}
```

### 替换为本地路径

```go
// go.mod
module github.com/mycompany/myproject

go 1.21

// 替换为本地路径
replace github.com/mycompany/private-pkg => ../private-pkg

// 或使用绝对路径
replace github.com/mycompany/private-pkg => /abs/path/to/private-pkg
```

## 自定义域名

### 自定义 Git 服务器

```bash
# 配置 Git 使用自定义域名
git config --global url."ssh://git@git.mycompany.com/".insteadOf "https://git.mycompany.com/"

# 在 go.mod 中使用
module git.mycompany.com/myproject

go 1.21

require (
    git.mycompany.com/private-pkg v1.0.0
)
```

### 子模块导入

```go
// 使用子模块
module github.com/mycompany/myproject

go 1.21

require (
    // 主模块
    github.com/mycompany/main-pkg v1.0.0
    // 子模块
    github.com/mycompany/main-pkg/submodule v1.0.0
)
```

## 代理配置

### 代理设置

```bash
# 公共代理
export GOPROXY=https://goproxy.cn,direct
export GOPROXY=https://goproxy.io,direct

# 私有代理
export GOPROXY=https://proxy.mycompany.com,direct

# 代理链
export GOPROXY=https://proxy1.com,https://proxy2.com,direct

# 绕过代理
export GONOPROXY=github.com/mycompany
```

### 企业代理

```bash
# 企业内部代理
export GOPROXY=https://goproxy.company.com
export GOPRIVATE=*.company.com
export GOSUMDB=off

# 或直接访问
export GOPROXY=direct
export GOPRIVATE=*.company.com
```

## 故障排除

### 网络问题

```bash
# 问题：无法访问私有仓库
# 解决 1: 检查 GOPRIVATE
go env GOPRIVATE

# 解决 2: 设置 GOPROXY
export GOPROXY=direct

# 解决 3: 清理缓存
go clean -modcache
```

### 认证问题

```bash
# 问题：认证失败
# 解决 1: 检查 Git 凭据
git config --list | grep credential

# 解决 2: 重新配置 token
git config --global url."https://token@github.com/".insteadOf "https://github.com/"

# 解决 3: 测试连接
git ls-remote https://github.com/mycompany/private-repo
```

### 模块问题

```bash
# 问题：模块未找到
# 解决 1: 检查 go.mod
cat go.mod

# 解决 2: 更新依赖
go mod download

# 解决 3: 验证依赖
go mod verify
```

## CI/CD 配置

### GitHub Actions

```yaml
name: Go Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'

      - name: Configure Git
        run: |
          git config --global url."https://${{ secrets.GITHUB_TOKEN }}@github.com/".insteadOf "https://github.com/"

      - name: Download dependencies
        env:
          GOPRIVATE: github.com/mycompany
        run: go mod download

      - name: Build
        run: go build ./...
```

### GitLab CI

```yaml
image: golang:1.21

variables:
  GOPRIVATE: gitlab.com/mycompany

before_script:
  - git config --global url."https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com/".insteadOf "https://gitlab.com/"

build:
  script:
    - go mod download
    - go build ./...
```

### Jenkins

```groovy
pipeline {
    agent any

    environment {
        GOPRIVATE = 'github.com/mycompany'
        GO_CREDENTIALS = credentials('github-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git config --global url."https://${GO_CREDENTIALS}@github.com/".insteadOf "https://github.com/"'
            }
        }

        stage('Build') {
            steps {
                sh 'go mod download'
                sh 'go build ./...'
            }
        }
    }
}
```

## 工作区私有模块

### 多模块开发

```bash
# 创建工作区
go work init

# 添加私有模块
go work use ./private-pkg
go work use ./myproject

# 同步工作区
go work sync
```

### 本地模块替换

```go
// go.work
go 1.21

use (
    ./private-pkg
    ./myproject
)

// go.work.sum 包含所有模块的哈希
```

## 安全实践

### 令牌管理

```bash
# ❌ 不好的做法
export GITHUB_TOKEN=ghp_1234567890

# ✅ 好的做法
# 使用环境变量文件
# .envrc 或 .env
export GITHUB_TOKEN=$(cat ~/.github-token)

# 使用密钥管理工具
# - HashiCorp Vault
# - AWS Secrets Manager
# - Azure Key Vault
```

### 最小权限

```bash
# GitHub Token 权限
# - repo: 完整仓库访问（私有模块）
# - read:org: 组织读取（可选）
# - 不需要其他权限

# GitLab Token 权限
# - read_api: API 读取
# - read_repository: 仓库读取
```

## 最佳实践

::: tip 使用建议

1. **环境变量** - 使用 GOPRIVATE 配置私有模块
2. **SSH 认证** - 优先使用 SSH 而非 HTTPS
3. **令牌管理** - 使用个人访问令牌
4. **最小权限** - 限制令牌的权限范围
5. **CI/CD** - 在 CI/CD 中正确配置认证

:::

```bash
# ✅ 好的配置

# ~/.bashrc 或 ~/.zshrc
export GOPRIVATE=github.com/mycompany
export GOPROXY=https://goproxy.cn,direct
export GOSUMDB=sum.golang.google.cn

# Git 配置
git config --global url."ssh://git@github.com/".insteadOf "https://github.com/"

# 工作区
go work init
go work use ./private-pkg
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **GOPRIVATE** - 私有模块前缀 |
| **GOPROXY** - 模块代理设置 |
| **认证** - SSH 或 Token 认证 |
| **go.work** - 工作区多模块 |
| **CI/CD** - 环境变量配置 |
| **安全** - 最小权限原则 |

::: v-pre

[依赖管理](./dependencies.md) → [最佳实践](./best-practices.md)

:::
