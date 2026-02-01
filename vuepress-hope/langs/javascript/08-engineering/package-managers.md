---
title: 包管理器
icon: ri:package-line
order: 2
---

# 包管理器

包管理器是 JavaScript 生态系统的核心，用于管理项目依赖。

## npm

### 基本使用

```bash
# npm（Node Package Manager）
# Node.js 自带的包管理器

# 初始化项目
npm init
npm init -y  # 跳过所有问题

# 安装包
npm install react           # 安装并保存到 dependencies
npm install react --save    # 同上（已废弃）
npm install react --save-dev # 保存到 devDependencies

# 安装特定版本
npm install react@18.2.0
npm install react@^18.0.0    # 兼容版本
npm install react@latest      # 最新版本

# 全局安装
npm install -g create-react-app
npm install --global yarn

# 卸载包
npm uninstall react
npm remove react

# 更新包
npm update
npm update react

# 查看信息
npm list                    # 查看已安装的包
npm outdated                # 查看过时的包
npm view react version      # 查看包的版本
npm info react              # 查看包的详细信息
```

### package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My awesome project",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "eslint": "^8.40.0",
    "prettier": "^2.8.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ]
}
```

### 语义化版本

```json
// 语义化版本（Semantic Versioning）：major.minor.patch
// 1.2.3
// major：破坏性更新（不兼容的 API 变更）
// minor：向后兼容的功能新增
// patch：向后兼容的 Bug 修复

// 版本范围
{
  "dependencies": {
    // 精确版本：只安装 1.2.3
    "package1": "1.2.3",

    // 波浪号：~1.2.3 -> >=1.2.3 <1.3.0
    // 更新 patch 版本
    "package2": "~1.2.3",

    // 插入符：^1.2.3 -> >=1.2.3 <2.0.0
    // 更新 minor 和 patch 版本
    "package3": "^1.2.3",

    // 大于/小于版本
    "package4": ">1.0.0",
    "package5": ">=2.0.0",
    "package6": "<3.0.0",

    // 范围版本
    "package7": "1.2.3 - 2.3.4",
    "package8": "1.x",
    "package9": "*",

    // 最新版本
    "package10": "latest",
    "package11": "next"
  }
}
```

### package-lock.json

```json
// package-lock.json：锁定依赖版本
// 确保所有环境安装相同版本的依赖

{
  "name": "my-project",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/react": {
      "version": "18.2.0",
      "resolved": "https://registry.npmjs.org/react/-/react-18.2.0.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "loose-envify": "^1.1.0",
        "object-assign": "^4.1.1"
      }
    }
  }
}

// 应该提交到版本控制
// 确保团队使用相同的依赖版本
```

## yarn

### 基本使用

```bash
# Yarn：Facebook 开发的包管理器
# 更快的安装速度和更可靠的依赖管理

# 安装 Yarn
npm install -g yarn

# 初始化项目
yarn init

# 安装包
yarn add react              # 添加到 dependencies
yarn add react --dev        # 添加到 devDependencies
yarn add react --optional   # 添加到 optionalDependencies
yarn add react --peer       # 添加到 peerDependencies

# 安装特定版本
yarn add react@18.2.0

# 全局安装
yarn global add create-react-app

# 卸载包
yarn remove react

# 更新包
yarn upgrade
yarn upgrade react

# 查看信息
yarn list
yarn outdated
yarn info react
```

### yarn.lock

```yaml
# yarn.lock：Yarn 的锁定文件
# 类似 package-lock.json，但格式不同

__metadata:
  version: 6
  cacheKey: 8

"react@18.2.0":
  version: 18.2.0
  resolution: "react@18.2.0"
  dependencies:
    loose-envify: "^1.1.0"
    object-assign: "^4.1.1"
  checksum: 6b23b9c3e9d12a3e...

# 应该提交到版本控制
```

## pnpm

### 基本使用

```bash
# pnpm：快速的、节省磁盘空间的包管理器
# 使用硬链接和符号链接，避免重复下载

# 安装 pnpm
npm install -g pnpm

# 初始化项目
pnpm init

# 安装包
pnpm add react
pnpm add react --save-dev
pnpm add react -D

# 安装特定版本
pnpm add react@18.2.0

# 全局安装
pnpm add -g create-react-app

# 卸载包
pnpm remove react

# 更新包
pnpm update
pnpm update react

# 查看信息
pnpm list
pnpm outdated
pnpm info react
```

### workspace

```json
// pnpm-workspace.yaml：定义 monorepo
packages:
  - 'packages/*'

// packages：
// - packages/components
// - packages/utils
// - packages/app

// 共享依赖
// 所有项目共享 node_modules，节省磁盘空间
```

### pnpm 功能

```bash
# pnpm 独有功能

# 1. 严格的依赖管理
# 只能安装 package.json 中声明的依赖
pnpm add lodash-es  # 未声明时警告

# 2. 查看 Bundle 大小
pnpm why react  # 查看为什么安装了某个包

# 3. Patch 包
pnpm patch express  # 修改包并应用补丁

# 4. 覆盖依赖
# .npmrc
shamefully-hoist=true

# 5. 存储管理
pnpm store prune  # 清理未使用的包
```

## 对比选择

### 性能对比

```bash
# 安装速度（从快到慢）
# pnpm > yarn > npm

# 磁盘空间（从少到多）
# pnpm < yarn < npm

# 社区支持（从多到少）
# npm > yarn > pnpm

# 功能完整性
# npm：最完整
# yarn：类似 npm
# pnpm：更严格、更快速
```

### 选择建议

```javascript
// 选择建议

// 1. 新项目：推荐 pnpm
// - 安装速度快
// - 节省磁盘空间
// - 严格的依赖管理

// 2. Monorepo：推荐 pnpm workspace
// - 原生支持 workspace
// - 共享依赖
// - 快速的安装

// 3. 传统项目：npm 或 yarn
// - 兼容性好
// - 社区支持广泛
// - 文档丰富

// 4. CI/CD：推荐 pnpm 或 yarn
// - 安装速度快
// - 节省时间和带宽
```

## 依赖管理

### dependencies vs devDependencies

```json
{
  "dependencies": {
    // 生产环境依赖
    // 应用运行时需要的包
    "react": "^18.2.0",
    "axios": "^1.4.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    // 开发环境依赖
    // 构建、测试、代码检查等工具
    "vite": "^4.3.0",
    "eslint": "^8.40.0",
    "prettier": "^2.8.0",
    "@types/react": "^18.2.0"
  },
  "peerDependencies": {
    // 对等依赖
    // 宿主项目需要安装的依赖
    "react": ">=16.8.0"
  },
  "optionalDependencies": {
    // 可选依赖
    // 安装失败不会导致安装失败
    "fsevents": "^2.3.0"
  }
}
```

### 依赖管理最佳实践

```json
{
  // ✅ 推荐做法

  // 1. 明确区分 dependencies 和 devDependencies
  "dependencies": {
    // 只包含运行时依赖
    "react": "^18.2.0"
  },
  "devDependencies": {
    // 包含开发工具
    "eslint": "^8.40.0"
  },

  // 2. 使用精确版本范围
  "dependencies": {
    // 使用 ^ 允许自动更新
    "react": "^18.2.0",
    // 不使用 * 或 latest
  },

  // 3. 锁定文件提交到版本控制
  // package-lock.json 或 yarn.lock 或 pnpm-lock.yaml

  // 4. 定期更新依赖
  // npm update
  // yarn upgrade
  // pnpm update

  // ❌ 不推荐做法

  // 1. 混淆 dependencies 和 devDependencies
  "dependencies": {
    "eslint": "^8.40.0"  // 应该在 devDependencies
  },

  // 2. 使用过于宽泛的版本范围
  "dependencies": {
    "package": "*",
    "package": "latest"
  },

  // 3. 忽略锁文件
  // 不提交 package-lock.json
}
```

## 私有包

### 发布包

```bash
# 1. 注册 npm 账号
npm adduser

# 2. 登录
npm login

# 3. 准备 package.json
{
  "name": "@username/package-name",
  "version": "1.0.0",
  "private": false,
  "publishConfig": {
    "access": "public"
  }
}

# 4. 发布
npm publish

# 5. 发布特定标签
npm publish --tag beta

# 6. 取消发布
npm unpublish package-name@version
```

### 私有仓库

```bash
# 使用私有仓库

# 1. npm 私有仓库
npm set registry https://npm.example.com
npm login --registry=https://npm.example.com

# 2. .npmrc 配置
@scope:registry=https://npm.example.com
//npm.example.com/:_authToken=${NPM_TOKEN}

# 3. Verdaccio（本地私有仓库）
npm install -g verdaccio
verdaccio

# 4. Nexus（企业私有仓库）
# 配置 Nexus npm 仓库
```

::: tip 包管理器检查清单

- [ ] 选择合适的包管理器（npm/yarn/pnpm）
- [ ] 理解语义化版本
- [ ] 正确使用 dependencies/devDependencies
- [ ] 提交锁文件到版本控制
- [ ] 定期更新依赖
- [ ] 使用私有仓库管理企业包

:::

::: tip 下一步

学习模块打包器 → [模块打包器](./module-bundlers.md)
:::
