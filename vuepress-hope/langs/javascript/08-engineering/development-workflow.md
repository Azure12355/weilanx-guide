---
title: 开发工作流
icon: ri:workflow-line
order: 5
---

# 开发工作流

现代前端开发有一套完整的工作流，从开发到部署的各个环节。

## 开发环境

### 本地开发

```bash
# 开发环境设置

# 1. 安装 Node.js
# 下载并安装 LTS 版本
node --version
npm --version

# 2. 初始化项目
npm create vite@latest my-app
cd my-app
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器访问
# http://localhost:5173

# 5. 热更新（HMR）
# 修改代码后自动刷新浏览器
```

### 环境配置

```javascript
// vite.config.js
export default defineConfig({
    // 开发服务器
    server: {
        port: 3000,
        host: true,          // 监听所有地址
        open: true,          // 自动打开浏览器
        strictPort: true,    // 端口被占用时失败而不是尝试下一个端口

        // 代理 API 请求
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },

    // 构建优化
    build: {
        outDir: 'dist',
        sourcemap: true,     // 生成 sourcemap
        minify: 'terser',    // 压缩代码
        target: 'es2015'     // 目标浏览器
    }
});

// .env.development
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=Dev App

// .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=Production App
```

## 代码规范

### ESLint

```javascript
// .eslintrc.js
module.exports = {
    // 运行环境
    env: {
        browser: true,
        es2021: true,
        node: true
    },

    // 扩展配置
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended'
    ],

    // 解析器
    parser: '@typescript-eslint/parser',

    // 插件
    plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint'
    ],

    // 规则
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    },

    // 设置
    settings: {
        react: {
            version: 'detect'
        }
    }
};
```

### Prettier

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}

// .prettierignore
node_modules
dist
build
coverage
*.min.js
*.min.css
package-lock.json
pnpm-lock.yaml
```

### Git Hooks

```javascript
// husky + lint-staged
// 安装
npm install -D husky lint-staged
npx husky install

// 配置 package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  },
  "scripts": {
    "prepare": "husky install"
  }
}

// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

// .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit $1
```

## 版本控制

### Git 配置

```bash
# Git 配置
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# .gitignore
node_modules
dist
build
.env.local
.DS_Store
*.log
coverage
.vscode
.idea

# 分支策略
# main：生产环境
# develop：开发环境
# feature/*：功能分支
# hotfix/*：修复分支
```

### 提交规范

```javascript
// Commitizen + Commitlint
// 安装
npm install -D commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional

// 配置 package.json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}

// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', [
            'feat',     // 新功能
            'fix',      // 修复 Bug
            'docs',     // 文档更新
            'style',    // 代码格式调整
            'refactor', // 重构
            'perf',     // 性能优化
            'test',     // 测试相关
            'chore',    // 构建/工具相关
            'revert'    // 回滚
        ]],
        'subject-case': [0]  // 允许任意大小写
    }
};

// 使用
// npm run commit
// feat: add user authentication
// fix: resolve memory leak
// docs: update README
```

## 测试

### 单元测试

```javascript
// Vitest 配置
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'test/']
        }
    }
});

// 示例测试
// math.test.ts
import { describe, it, expect } from 'vitest';
import { add, subtract } from './math';

describe('Math utilities', () => {
    it('should add two numbers', () => {
        expect(add(1, 2)).toBe(3);
    });

    it('should subtract two numbers', () => {
        expect(subtract(5, 3)).toBe(2);
    });
});
```

### E2E 测试

```javascript
// Playwright 配置
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    }
});

// 示例 E2E 测试
// home.spec.ts
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home/);
});

test('navigation works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL(/.*about/);
});
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # 代码检查
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  # 测试
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  # 构建
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  # 部署
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 部署

### 静态站点部署

```bash
# 1. 构建项目
npm run build

# 2. 部署到 GitHub Pages
# 在 vite.config.js 中设置 base
export default defineConfig({
  base: '/repo-name/'
})

# 3. 推送到 gh-pages 分支
npm run build
npx gh-pages -d dist

# 或使用 GitHub Actions 自动部署
# 参考上面的 CI/CD 配置
```

### 服务器部署

```bash
# 1. 构建
npm run build

# 2. 上传到服务器
scp -r dist/* user@server:/var/www/html/

# 3. 配置 Nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 4. 重启 Nginx
sudo systemctl restart nginx
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产环境
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建镜像
docker build -t my-app .

# 运行容器
docker run -d -p 80:80 --name my-app my-app
```

## 性能监控

### Lighthouse

```bash
# Lighthouse：网页性能分析
npm install -g lighthouse

# 运行
lighthouse https://example.com --view

# CI 集成
npm install -D @lhci/cli

// lighthouserc.js
module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000'],
            numberOfRuns: 3
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }]
            }
        }
    }
};
```

### 错误监控

```javascript
// Sentry：错误监控
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: 'YOUR_DSN',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
});

// 捕获错误
try {
    // 可能出错的代码
} catch (error) {
    Sentry.captureException(error);
}

// 用户反馈
Sentry.captureMessage('User feedback', {
    level: 'info',
    extra: {
        feedback: 'Good experience'
    }
});
```

## 开发工作流最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用环境变量管理配置
const apiUrl = import.meta.env.VITE_API_URL;

// 2. 使用 ESLint + Prettier 统一代码风格
npm run lint
npm run format

// 3. 使用 Git Hooks 自动检查
npx husky install
npx lint-staged

// 4. 遵循提交规范
npm run commit
// feat: add new feature
// fix: resolve bug

// 5. 编写测试
npm run test
npm run test:e2e

// 6. 使用 CI/CD 自动化
// GitHub Actions / GitLab CI / Jenkins

// ❌ 不推荐做法

// 1. 忽略代码检查
// 提交未经检查的代码

// 2. 不编写测试
// 导致 Bug 增加

// 3. 手动部署
// 容易出错，不高效

// 4. 忽略错误监控
// 无法及时发现生产问题

// 5. 不使用版本控制
// 代码丢失风险
```

::: tip 开发工作流检查清单

- [ ] 配置开发环境
- [ ] 设置代码检查工具
- [ ] 配置 Git Hooks
- [ ] 遵循提交规范
- [ ] 编写测试
- [ ] 配置 CI/CD
- [ ] 设置错误监控

:::

::: tip 前端工程化回顾

恭喜！你已掌握前端工程化的核心知识：

- [x] 构建工具
- [x] 包管理器
- [x] 模块打包器
- [x] 任务运行器
- [x] 开发工作流

接下来学习框架与库 → [框架与库](../09-frameworks/react.md)
:::
