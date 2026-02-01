---
title: npm 包管理
icon: ri:package-line
order: 5
---

# npm 包管理

npm（Node Package Manager）是 Node.js 的包管理器，用于安装、管理和发布 JavaScript 包。

## package.json

### 基本配置

```json
// package.json：项目配置文件

{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My awesome project",
  "main": "index.js",
  "type": "module",
  "author": "Your Name",
  "license": "MIT",
  "keywords": ["nodejs", "javascript"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  }
}

// 初始化 package.json
npm init
npm init -y  // 使用默认值

// 字段说明
// name：包名称（必需）
// version：版本号（必需）
// description：包描述
// main：入口文件
// type：模块类型（"module" 或 "commonjs"）
// author：作者
// license：许可证
// keywords：关键词
// repository：仓库地址
```

### scripts

```json
// scripts：脚本命令

{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production",
    "lint": "eslint src/"
  }
}

// 运行脚本
npm run start
npm run dev
npm test  // 可以省略 run

// 生命周期脚本
{
  "scripts": {
    "preinstall": "echo Before install",
    "install": "echo Installing",
    "postinstall": "echo After install",
    "prestart": "echo Before start",
    "start": "node index.js",
    "poststart": "echo After start"
  }
}

// 生命周期顺序
// npm install
// preinstall → install → postinstall
// npm start
// prestart → start → poststart
```

### dependencies

```json
// dependencies：生产依赖

{
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "~4.17.21",
    "axios": "1.4.0"
  }
}

// 版本号规则
// "1.2.3"：精确版本
// "^1.2.3"：兼容版本（1.x.x，>= 1.2.3 < 2.0.0）
// "~1.2.3"：补丁版本（1.2.x，>= 1.2.3 < 1.3.0）
// ">=1.2.3"：大于或等于
// "<1.2.3"：小于
// "*"：任意版本
// "latest"：最新版本
// "git+https://..."：Git 仓库

// 安装依赖
npm install express
npm install express --save-prod  // 生产依赖（默认）
npm install express --save-dev   // 开发依赖
npm install express -D            // --save-dev 简写

// 安装多个
npm install express lodash axios

// 从 package.json 安装
npm install
```

### devDependencies

```json
// devDependencies：开发依赖

{
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "webpack": "^5.0.0",
    "nodemon": "^3.0.0"
  }
}

// 安装开发依赖
npm install jest --save-dev
npm install jest -D

// 区别
// dependencies：生产环境需要的
// devDependencies：仅开发环境需要的
```

### 其他字段

```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },

  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ],

  "config": {
    "port": "3000"
  },

  "bin": {
    "my-cli": "./bin/cli.js"
  },

  "files": [
    "src/",
    "dist/",
    "README.md"
  ],

  "private": true
}
```

## npm 命令

### 基本命令

```bash
# 安装包
npm install express
npm i express

# 全局安装
npm install -g nodemon
npm install --global nodemon

# 卸载包
npm uninstall express
npm remove express

# 更新包
npm update express

# 查看已安装的包
npm list
npm ls

# 查看包信息
npm view express
npm info express

# 搜索包
npm search express

# 清理缓存
npm cache clean --force

# 检查过期包
npm outdated

# 审计安全漏洞
npm audit
npm audit fix
```

### npm config

```bash
# 配置
npm config list

# 设置配置
npm config set init-author-name "Your Name"
npm config set init-author-email "you@example.com"
npm config set init-license "MIT"

# 注册表
npm config set registry https://registry.npmjs.org/
npm config set registry https://registry.npmmirror.com/  // 淘宝镜像

# 全局位置
npm config get prefix
# /usr/local

# 查看配置文件位置
npm config get userconfig
# ~/.npmrc

# 项目配置文件
# .npmrc
registry=https://registry.npmmirror.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### npm scripts

```bash
# 运行脚本
npm run start
npm start  // 可以省略 run

# 传递参数
npm run build -- --mode production

# 显示可用脚本
npm run

# 链接本地包
npm link
npm link my-package

# 取消链接
npm unlink
```

## 发布包

### 准备发布

```bash
# 1. 注册 npm 账号
npm adduser
npm login

# 2. 检查包名是否可用
npm view package-name

# 3. 更新版本
npm version patch  // 1.0.0 → 1.0.1
npm version minor  // 1.0.0 → 1.1.0
npm version major  // 1.0.0 → 2.0.0

# 4. 发布
npm publish

# 5. 发布特定标签
npm publish --tag beta

# 6. 取消发布
npm unpublish package-name@version
npm unpublish package-name --force
```

### package.json 配置

```json
{
  "name": "@scope/package-name",
  "version": "1.0.0",
  "description": "My awesome package",
  "main": "index.js",
  "types": "index.d.ts",
  "files": [
    "lib/",
    "types/",
    "README.md"
  ],
  "keywords": ["keyword1", "keyword2"],
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  },
  "bugs": {
    "url": "https://github.com/username/repo/issues"
  },
  "homepage": "https://github.com/username/repo#readme"
}
```

### 作用域包

```bash
# 创建作用域包
{
  "name": "@username/package-name"
}

# 发布到作用域
npm publish --access public

# 私有包
npm publish --access restricted
```

## npx

### 基本使用

```bash
# npx：执行包命令

# 直接运行包
npx create-react-app my-app
npx prettier --write .

# 运行不同版本
npx create-react-app@5 my-app

# 运行本地包
npx webpack

# 运行远程包
npx https://gist.github.com/.../script.js

# 不使用缓存
npx --no-cache command

# 安装并运行
npx -p typescript -p tsc-v
```

## 其他包管理器

### Yarn

```bash
# 安装 Yarn
npm install -g yarn

# 初始化项目
yarn init

# 安装依赖
yarn install
yarn add express
yarn add jest --dev

# 运行脚本
yarn start
yarn build

# 更新依赖
yarn upgrade

# 移除依赖
yarn remove express

# 发布包
yarn publish
```

### pnpm

```bash
# 安装 pnpm
npm install -g pnpm

# 初始化项目
pnpm init

# 安装依赖
pnpm install
pnpm add express
pnpm add -D jest

# 运行脚本
pnpm start
pnpm build

# 发布包
pnpm publish
```

## 包管理最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用语义化版本
{
  "dependencies": {
    "express": "^4.18.0"
  }
}

// 2. 区分生产和开发依赖
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}

// 3. 使用 npm scripts
{
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "build": "webpack --mode production"
  }
}

// 4. 使用 .npmrc 配置项目
registry=https://registry.npmmirror.com/

// 5. 定期更新依赖
npm outdated
npm update

// 6. 使用 lock 文件
// package-lock.json 或 yarn.lock

// ❌ 不推荐做法

// 1. 忽略版本号
{
  "dependencies": {
    "express": "*"
  }
}

// 2. 混用包管理器
// npm 和 yarn 混用

// 3. 直接修改 node_modules
// 应该通过 npm install

// 4. 忽略安全审计
npm audit

// 5. 不检查过期包
npm outdated
```

::: tip 包管理检查清单

- [ ] 配置 package.json
- [ ] 使用语义化版本
- [ ] 区分生产和开发依赖
- [ ] 使用 npm scripts
- [ ] 定期更新依赖
- [ ] 审计安全漏洞

:::

::: tip Node.js 回顾

恭喜！你已掌握 Node.js 的核心知识：

- [x] Node.js 概述
- [x] 文件系统
- [x] HTTP 模块
- [x] 模块系统
- [x] npm 包管理

接下来学习性能优化 → [性能优化](../11-performance/performance-basics.md)
:::
