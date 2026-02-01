---
title: 开发工具链
icon: ri-tools-line
order: 5
---

# 开发工具链

JavaScript 开发工具链是构建高质量项目的基础。

## ESLint

### 基本配置

```javascript
// .eslintrc.js
module.exports = {
    // 运行环境
    env: {
        browser: true,
        node: true,
        es2021: true
    },

    // 解析器
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },

    // 继承配置
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'  // 必须放在最后
    ],

    // 插件
    plugins: [
        'react',
        '@typescript-eslint',
        'import'
    ],

    // 规则
    rules: {
        // 自定义规则
        'no-console': 'warn',
        'no-debugger': 'warn',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

        // React 规则
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',

        // TypeScript 规则
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
    },

    // 全局变量
    globals: {
        // 浏览器全局变量
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly'
    }
};
```

### 配置文件类型

```javascript
// .eslintrc.js (推荐)
module.exports = {
    // 配置
};

// .eslintrc.json
{
    "env": {
        "browser": true
    },
    "rules": {
        "semi": ["error", "always"]
    }
}

// package.json
{
    "eslintConfig": {
        "extends": "eslint:recommended"
    }
}
```

### 忽略文件

```
# .eslintignore
node_modules/
dist/
build/
coverage/
*.min.js
public/
```

### 脚本命令

```json
{
    "scripts": {
        "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
        "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
        "lint:quiet": "eslint . --ext .js,.jsx,.ts,.tsx --quiet"
    }
}
```

## Prettier

### 基本配置

```javascript
// .prettierrc.js
module.exports = {
    // 行宽
    printWidth: 100,

    // 缩进空格数
    tabWidth: 2,

    // 使用空格缩进
    useTabs: false,

    // 语句末尾添加分号
    semi: true,

    // 使用单引号
    singleQuote: true,

    // 对象属性引号
    quoteProps: 'as-needed',

    // JSX 使用单引号
    jsxSingleQuote: true,

    // 尾随逗号
    trailingComma: 'es5',

    // 对象大括号内部空格
    bracketSpacing: true,

    // 多行 HTML 元素 > 放在末尾
    bracketSameLine: false,

    // 箭头函数参数括号
    arrowParens: 'always',

    // 换行符
    endOfLine: 'lf',

    // 格式化范围
    rangeStart: 0,
    rangeEnd: Infinity
};
```

### 忽略文件

```
# .prettierignore
node_modules/
dist/
build/
coverage/
*.min.js
package-lock.json
pnpm-lock.yaml
yarn.lock
```

### EditorConfig 集成

```
# .editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
```

## Git Hooks

### Husky 配置

```bash
# 安装 Husky
npm install -D husky

# 初始化
npx husky-init
```

```javascript
// package.json
{
    "scripts": {
        "prepare": "husky install"
    }
}
```

### 钩子设置

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit $1
```

### Lint-staged 配置

```javascript
// lint-staged.config.js
module.exports = {
    // 匹配所有文件
    '*': 'prettier --write',

    // TypeScript 和 JavaScript
    '*.{ts,tsx,js,jsx}': [
        'eslint --fix',
        'prettier --write'
    ],

    // CSS
    '*.{css,scss,less}': [
        'stylelint --fix',
        'prettier --write'
    ],

    // Markdown
    '*.md': [
        'markdownlint --fix',
        'prettier --write'
    ],

    // JSON
    '*.{json,jsonc}': [
        'prettier --write'
    ]
};
```

```javascript
// package.json
{
    "lint-staged": {
        "*.{ts,tsx,js,jsx}": [
            "eslint --fix",
            "prettier --write"
        ],
        "*.{css,scss}": [
            "stylelint --fix",
            "prettier --write"
        ],
        "*.md": [
            "markdownlint --fix",
            "prettier --write"
        ]
    }
}
```

### Commitlint

```javascript
// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],

    // 自定义规则
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // 新功能
                'fix',      // 修复
                'docs',     // 文档
                'style',    // 格式
                'refactor', // 重构
                'perf',     // 性能
                'test',     // 测试
                'chore',    // 构建
                'ci',       // CI
                'revert'    // 回滚
            ]
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'subject-empty': [2, 'never'],
        'subject-case': [2, 'never', ['sentence-case']],
        'header-max-length': [2, 'always', 100]
    }
};
```

## Stylelint

### 基本配置

```javascript
// stylelint.config.js
module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-prettier'
    ],

    plugins: ['stylelint-order'],

    rules: {
        // 缩进
        'indentation': 2,

        // 字符串
        'string-quotes': 'single',

        // 颜色
        'color-hex-case': 'lower',
        'color-hex-length': 'long',

        // 选择器
        'selector-class-pattern': '^[a-z][a-z0-9-]*$',
        'selector-id-pattern': '^[a-z][a-z0-9-]*$',

        // 属性
        'declaration-block-trailing-semicolon': 'always',

        // 顺序
        'order/properties-alphabetical-order': true
    }
};
```

## Markdownlint

### 基本配置

```json
{
    "default": true,
    "MD013": {
        "line_length": 120,
        "code_blocks": false,
        "tables": false
    },
    "MD033": false,
    "MD041": false
}
```

## 编辑器配置

### VSCode 配置

```json
// .vscode/settings.json
{
    // 编辑器
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },

    // ESLint
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],

    // TypeScript
    "typescript.tsdk": "node_modules/typescript/lib",

    // 文件
    "files.eol": "\n",
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,

    // 排除
    "files.exclude": {
        "**/.git": true,
        "**/.DS_Store": true,
        "**/node_modules": true
    },

    // 搜索
    "search.exclude": {
        "**/node_modules": true,
        "**/bower_components": true,
        "**/dist": true,
        "**/build": true
    }
}
```

### 推荐扩展

```json
// .vscode/extensions.json
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "stylelint.vscode-stylelint",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "usernamehw.errorlens",
        "wayou.vscode-todo-highlight",
        "streetsidesoftware.code-spell-checker"
    ]
}
```

## 版本管理

### Semantic Release

```javascript
// .releaserc.js
module.exports = {
    branches: ['main', 'next'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/npm',
        '@semantic-release/git',
        '@semantic-release/github'
    ]
};
```

### Changesets

```javascript
// .changeset/config.json
{
    "$schema": "https://unpkg.com/@changesets/config@2.0.0/schema.json",
    "changelog": "@changesets/cli/changelog",
    "commit": false,
    "linked": [],
    "access": "restricted",
    "baseBranch": "main",
    "updateInternalDependencies": "patch",
    "ignore": []
}
```

## 最佳实践

::: tip 工具链配置建议

1. **统一配置** - 团队使用相同的配置文件
2. **自动化** - 使用 Git Hooks 自动检查
3. **快速反馈** - 只检查暂存的文件
4. **可扩展** - 根据项目需求定制规则
5. **文档化** - 记录配置决策

:::

```javascript
// ✅ 推荐配置

// 1. ESLint + Prettier 集成
module.exports = {
    extends: [
        'eslint:recommended',
        'prettier'  // 必须放在最后
    ]
};

// 2. Lint-staged 只检查变更文件
{
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
}

// 3. Husky 自动化
// .husky/pre-commit
npx lint-staged

// 4. Commitlint 规范提交
commit: feat(scope): description

// 5. EditorConfig 统一编辑器
root = true
[*]
indent_size = 2
```

## 总结

| 工具 | 用途 |
|------|------|
| **ESLint** | 代码质量检查 |
| **Prettier** | 代码格式化 |
| **Husky** | Git Hooks 管理 |
| **Lint-staged** | 增量检查 |
| **Stylelint** | CSS/SCSS 检查 |
| **Commitlint** | 提交信息规范 |

::: v-pre

[Babel](./babel.md) → [框架与库](../09-frameworks/README.md)

:::
