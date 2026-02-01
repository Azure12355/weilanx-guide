---
title: npm 包管理
icon: ri-npmjs-fill
order: 1
---

# npm 包管理

npm 是 Node.js 的包管理器，也是前端工程化的重要组成部分。

## package.json

### 基础配置

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "我的项目描述",
  "main": "src/index.js",
  "type": "module",
  "author": "Your Name",
  "license": "MIT",
  "keywords": ["javascript", "frontend"],
  "homepage": "https://github.com/user/repo"
}
```

### scripts 配置

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/"
  }
}
```

### dependencies vs devDependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "vite": "^4.4.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0"
  }
}
```

## npm 命令

### 常用命令

```bash
# 初始化项目
npm init
npm init -y  # 跳过所有提示

# 安装依赖
npm install          # 安装 package.json 中的所有依赖
npm install <package>  # 安装包并添加到 dependencies
npm install -D <package>  # 安装包并添加到 devDependencies
npm install -g <package>  # 全局安装

# 安装特定版本
npm install react@17.0.2
npm install react@^17.0.0  # 兼容版本
npm install react@latest    # 最新版本

# 卸载包
npm uninstall <package>

# 更新包
npm update           # 更新所有包
npm update <package>  # 更新指定包
npm outdated         # 检查过时的包

# 运行脚本
npm run <script>
npm run dev          # 开发模式
npm run build        # 构建

# 查看信息
npm list             # 列出已安装的包
npm list --depth=0   # 只列出顶层包
npm info <package>   # 查看包信息
npm view <package>   # 查看包信息
```

### 语义化版本

```
版本格式：major.minor.patch

^1.2.3  ~1.2.3  1.2.3

^1.2.3  兼容版本：>=1.2.3 <2.0.0
~1.2.3  补丁版本：>=1.2.3 <1.3.0
1.2.3   精确版本：=1.2.3
*       任意版本
latest  最新版本
```

## 依赖管理

### package-lock.json

```json
{
  "name": "my-project",
  "lockfileVersion": 2,
  "packages": {
    "node_modules/react": {
      "version": "18.2.0",
      "resolved": "https://registry.npmjs.org/react/-/react-18.2.0.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "loose-envify": "^1.1.0"
      }
    }
  }
}
```

```bash
# 生成锁文件
npm install

# 只读取锁文件（更快）
npm ci

# 清理缓存
npm cache clean --force
```

### 依赖类型

```json
{
  "dependencies": {
    "production-package": "^1.0.0"
  },
  "devDependencies": {
    "dev-tool": "^2.0.0"
  },
  "peerDependencies": {
    "react": ">=16.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    }
  },
  "optionalDependencies": {
    "optional-package": "^1.0.0"
  },
  "bundledDependencies": [
    "bundled-package"
  ]
}
```

## 脚本高级用法

### 钩子

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm",
    "postinstall": "node scripts/postinstall.js",
    "prebuild": "npm run lint",
    "preversion": "npm run test",
    "postversion": "git push && git push --tags"
  }
}
```

### 生命周期脚本

```bash
# 执行顺序
npm install
  → preinstall
  → install
  → postinstall

npm run build
  → prebuild
  → build
  → postbuild
```

### 环境变量

```json
{
  "scripts": {
    "dev": "vite",
    "dev:staging": "NODE_ENV=staging npm run dev",
    "build": "vite build",
    "build:prod": "NODE_ENV=production npm run build"
  }
}
```

## 作用域包

### 创建作用域包

```json
{
  "name": "@username/package-name",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public"
  }
}
```

```bash
# 登录 npm
npm login

# 发布包
npm publish
npm publish --access public

# 撤销发布
npm unpublish <package>@<version>
npm unpublish <package> --force
```

### 私有包

```bash
# 配置私有仓库
npm config set registry https://registry.npm.taobao.org
npm config set @scope:registry https://private.registry.com

# .npmrc
registry=https://registry.npm.taobao.org
@scope:registry=https://private.registry.com
```

## npm 配置

### .npmrc

```ini
# ~/.npmrc 或项目根目录
registry=https://registry.npm.taobao.org
@babel:registry=https://registry.yarnpkg.com

# 代理
proxy=http://127.0.0.1:7890
https-proxy=http://127.0.0.1:7890

# 配置
prefix=/usr/local
cache=/path/to/cache
init-license=MIT
init-author-name=Your Name
init-author-email=you@example.com

# 保存配置
npm config set registry 'https://registry.npm.taobao.org'
npm config get registry
npm config delete registry
npm config list
```

## 最佳实践

::: tip npm 使用建议

1. **使用 npm ci** - CI/CD 中使用 npm ci 代替 npm install
2. **精确版本** - 生产环境锁定版本
3. **定期更新** - 定期检查和更新依赖
4. **清理缓存** - 遇到问题时清理 npm 缓存
5. **使用 .npmrc** - 项目级配置

:::

```bash
# ✅ 推荐做法

# 1. 使用 npm ci（CI/CD）
npm ci

# 2. 使用精确版本（生产）
npm install react@18.2.0 --save-exact

# 3. 审计依赖
npm audit
npm audit fix

# 4. 检查过时包
npm outdated

# 5. 清理缓存
npm cache clean --force
```

## npx 使用

```bash
# npx：执行包命令
npx create-react-app my-app
npx prettier --write .
npx eslint --init

# 使用不同版本
npx react@17

# 临时使用
npx -p typescript tsc --version
```

## pnpm 与 Yarn

### pnpm

```bash
# 安装 pnpm
npm install -g pnpm

# 基本命令（与 npm 类似）
pnpm install
pnpm add <package>
pnpm remove <package>
pnpm update

# 优势：更快、更省空间
```

### Yarn

```bash
# 安装 Yarn
npm install -g yarn

# 基本命令
yarn install
yarn add <package>
yarn remove <package>
yarn upgrade
```

## 总结

| 方面 | 说明 |
|------|------|
| **package.json** | 项目配置文件 |
| **package-lock.json** | 依赖版本锁定 |
| **scripts** | 脚本命令定义 |
| **npm ci** | 快速安装（CI 用）|
| **npx** | 执行包命令 |

::: v-pre

[npm 包管理](./npm.md) → [Webpack 打包](./webpack.md)

:::
