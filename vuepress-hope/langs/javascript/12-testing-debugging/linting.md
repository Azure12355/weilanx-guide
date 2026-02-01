---
title: 代码规范
icon: ri-code-s-slash-line
order: 5
---

# 代码规范

使用静态分析工具和格式化工具保持代码质量和一致性。

## ESLint

### 基础配置

```javascript
// ESLint 配置

// .eslintrc.js
module.exports = {
    // 运行环境
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },

    // 解析选项
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },

    // 全局变量
    globals: {
        chrome: 'readonly'
    },

    // 扩展配置
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'prettier'  // 必须放在最后
    ],

    // 插件
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'jsx-a11y',
        'import'
    ],

    // 规则
    rules: {
        // 可能的问题
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        'no-var': 'error',
        'prefer-const': 'error',

        // 最佳实践
        'eqeqeq': ['error', 'always'],
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-return-await': 'off',
        '@typescript-eslint/return-await': 'error',

        // React
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // 导入
        'import/order': ['error', {
            groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index'
            ],
            'newlines-between': 'always',
            alphabetize: {
                order: 'asc',
                caseInsensitive: true
            }
        }]
    },

    // 设置
    settings: {
        react: {
            version: 'detect'
        }
    }
};
```

### 自定义规则

```javascript
// 自定义规则配置

module.exports = {
    rules: {
        // 强制使用单引号
        'quotes': ['error', 'single', {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],

        // 强制分号
        'semi': ['error', 'always'],

        // 缩进
        'indent': ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 'first',
            MemberExpression: 1
        }],

        // 对象字面量属性换行
        'object-curly-newline': ['error', {
            ObjectExpression: 'always',
            ObjectPattern: 'never',
            ImportDeclaration: 'never',
            ExportDeclaration: 'never'
        }],

        // 数组方法回调返回
        'array-callback-return': ['error', {
            allowImplicit: true,
            checkForEach: true
        }],

        // 复杂度限制
        'complexity': ['warn', 10],

        // 文件最大行数
        'max-lines': ['warn', {
            max: 300,
            skipBlankLines: true,
            skipComments: true
        }],

        // 函数最大行数
        'max-lines-per-function': ['warn', {
            max: 50,
            skipBlankLines: true,
            skipComments: true
        }],

        // 嵌套深度
        'max-depth': ['warn', 4],

        // 函数参数数量
        'max-params': ['warn', 4],

        // 禁止特定语法
        'no-lonely-if': 'error',
        'no-nested-ternary': 'error',
        'no-unneeded-ternary': 'error',
        'one-var': ['error', 'never'],
        'operator-assignment': ['error', 'never']
    }
};
```

### 忽略文件

```javascript
// .eslintignore

# 依赖
node_modules/
dist/
build/

# 生成文件
*.min.js
*.bundle.js
coverage/

# 配置文件
*.config.js
.eslintrc.js

# 测试文件
**/*.test.js
**/*.spec.js
**/tests/

# 特定目录
public/
static/
vendor/
```

## Prettier

### 基础配置

```javascript
// Prettier 配置

// .prettierrc.js
module.exports = {
    // 行宽
    printWidth: 100,

    // 缩进
    tabWidth: 4,
    useTabs: false,

    // 分号
    semi: true,

    // 引号
    singleQuote: true,
    quoteProps: 'as-needed',

    // 尾随逗号
    trailingComma: 'es5',

    // 空格
    bracketSpacing: true,
    bracketSameLine: false,

    // 箭头函数参数括号
    arrowParens: 'always',

    // 换行符
    endOfLine: 'lf',

    // HTML 空白敏感
    htmlWhitespaceSensitivity: 'css',

    // Vue 文件脚本和样式标签缩进
    vueIndentScriptAndStyle: false,

    // 单个属性标签
    singleAttributePerLine: false
};
```

### 忽略文件

```javascript
// .prettierignore

# 依赖
node_modules/
dist/
build/

# 生成文件
*.min.js
*.bundle.js
coverage/

# 配置文件
package-lock.json
pnpm-lock.yaml
yarn.lock

# 特定文件
CHANGELOG.md
pnpm-workspace.yaml
```

### 编辑器集成

```json
// VSCode settings.json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ]
}
```

## Stylelint

### CSS/SCSS 规范

```javascript
// Stylelint 配置

// stylelint.config.js
module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-recommended-scss'
    ],

    rules: {
        // 缩进
        'indentation': 4,

        // 字符串
        'string-quotes': 'single',

        // 颜色
        'color-hex-case': 'lower',
        'color-hex-length': 'long',
        'color-named': 'never',

        // 字体
        'font-family-name-quotes': 'always-where-recommended',
        'font-weight-notation': 'numeric',

        // 选择器
        'selector-class-pattern': '^[a-z][a-z0-9-]*$',
        'selector-id-pattern': '^[a-z][a-z0-9-]*$',
        'selector-no-vendor-prefix': true,
        'selector-max-id': 0,

        // 属性
        'property-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,

        // 声明
        'declaration-block-trailing-semicolon': 'always',
        'declaration-colon-space-after': 'always',
        'declaration-colon-space-before': 'never',

        // 块
        'block-opening-brace-space-before': 'always',
        'block-closing-brace-newline-after': 'always',

        // 注释
        'comment-whitespace-inside': 'always',

        // 限制
        'selector-max-specificity': '0,4,0',
        'selector-max-class': 3,
        'selector-max-compound-selectors': 4,
        'max-nesting-depth': 4
    }
};
```

### 忽略文件

```css
/* .stylelintignore */

# 依赖
node_modules/
dist/
build/

# 生成文件
*.min.css

# 特定目录
public/
static/
vendor/
```

## Markdownlint

### Markdown 规范

```javascript
// Markdownlint 配置

// .markdownlint.json
{
    "default": true,
    "MD003": { "style": "atx_closed" },
    "MD004": { "style": "dash" },
    "MD013": {
        "line_length": 100,
        "code_blocks": false,
        "tables": false
    },
    "MD024": { "siblings_only": true },
    "MD029": { "style": "ordered" },
    "MD033": false,
    "MD041": false
}
```

### 常用规则说明

```markdown
<!-- MD013: 行长度 -->
<!-- ❌ 太长 -->
This is a very long line that exceeds the maximum line length limit of 100 characters

<!-- ✅ 换行 -->
This is a long line that is properly
wrapped within the limit

<!-- MD024: 多个标题 -->
<!-- ❌ 重复 -->
# 第一章
## 第一节

# 第二章  <!-- 不允许同级别标题连续

<!-- ✅ 正确 -->
# 第一章
## 第一节

## 第二节

# 第二章

<!-- MD026: 标题标点 -->
<!-- ❌ 使用标点 -->
## This is a header.

<!-- ✅ 不使用标点 -->
## This is a header
```

## Git Hooks

### Husky 配置

```javascript
// Husky 配置

// package.json
{
    "scripts": {
        "prepare": "husky install",
        "lint": "eslint . --ext .js,.ts,.tsx",
        "lint:fix": "eslint . --ext .js,.ts,.tsx --fix",
        "format": "prettier --write .",
        "format:check": "prettier --check ."
    }
}

// 安装 Husky
// npx husky install

// 添加 pre-commit hook
// npx husky add .husky/pre-commit "npx lint-staged"

// 添加 commit-msg hook
// npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### lint-staged

```javascript
// lint-staged 配置

// .lintstagedrc.js
module.exports = {
    // JavaScript/TypeScript
    '*.{js,jsx,ts,tsx}': [
        'eslint --fix',
        'prettier --write',
        'git add'
    ],

    // CSS/SCSS
    '*.{css,scss,sass,less}': [
        'stylelint --fix',
        'prettier --write',
        'git add'
    ],

    // Markdown
    '*.md': [
        'markdownlint --fix',
        'prettier --write',
        'git add'
    ],

    // JSON
    '*.{json,jsonc}': [
        'prettier --write',
        'git add'
    ],

    // YAML
    '*.{yml,yaml}': [
        'prettier --write',
        'git add'
    ]
};
```

### Commitlint

```javascript
// Commitlint 配置

// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // 类型枚举
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
                'revert',   // 回退
                'build'     // 构建
            ]
        ],

        // 类型大小写
        'type-case': [2, 'always', 'lower-case'],

        // 类型不能为空
        'type-empty': [2, 'never'],

        // 作用域大小写
        'scope-case': [2, 'always', 'lower-case'],

        // 主题不能为空
        'subject-empty': [2, 'never'],

        // 主题不以句号结尾
        'subject-full-stop': [2, 'never', '.'],

        // 主题格式
        'subject-case': [0],

        // Header 最大长度
        'header-max-length': [2, 'always', 100]
    }
};
```

### 完整示例

```javascript
// package.json 完整配置
{
    "name": "my-project",
    "version": "1.0.0",
    "scripts": {
        // 开发
        "dev": "vite",
        "build": "vite build",

        // Lint
        "lint": "eslint . --ext .js,.ts,.tsx",
        "lint:fix": "eslint . --ext .js,.ts,.tsx --fix",
        "lint:css": "stylelint '**/*.{css,scss}'",
        "lint:css:fix": "stylelint '**/*.{css,scss}' --fix",

        // Format
        "format": "prettier --write .",
        "format:check": "prettier --check .",

        // Test
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage",

        // Git Hooks
        "prepare": "husky install",
        "precommit": "lint-staged",
        "commitmsg": "commitlint --edit $1"
    },
    "lint-staged": {
        "*.{js,jsx,ts,tsx}": [
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
        ],
        "*.{json,jsonc,yml,yaml}": [
            "prettier --write"
        ]
    },
    "devDependencies": {
        "@commitlint/cli": "^17.0.0",
        "@commitlint/config-conventional": "^17.0.0",
        "@typescript-eslint/parser": "^5.0.0",
        "eslint": "^8.0.0",
        "eslint-plugin-react": "^7.0.0",
        "eslint-plugin-react-hooks": "^4.0.0",
        "husky": "^8.0.0",
        "lint-staged": "^13.0.0",
        "prettier": "^3.0.0",
        "stylelint": "^14.0.0",
        "stylelint-config-standard": "^29.0.0"
    }
}
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/lint.yml
name: Lint

on:
    push:
        branches: [main, develop]
    pull_request:

jobs:
    lint:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'
                  cache: 'npm'

            - name: Install dependencies
              run: npm ci

            - name: Run ESLint
              run: npm run lint

            - name: Run Prettier
              run: npm run format:check

            - name: Run Stylelint
              run: npm run lint:css

            - name: Run Markdownlint
              run: npx markdownlint '**/*.md'

            - name: Run TypeScript
              run: npx tsc --noEmit
```

## 最佳实践

::: tip 代码规范建议

1. **统一配置** - 团队共享配置文件
2. **自动化** - 使用 Git Hooks 强制执行
3. **渐进式** - 逐步引入和修复问题
4. **文档化** - 记录自定义规则和配置
5. **定期更新** - 保持工具和规则最新

:::

```javascript
// ✅ 推荐做法

// 1. 共享配置
// .eslintrc.js
module.exports = {
    extends: [
        '@company/eslint-config',  // 公司统一配置
        'plugin:react/recommended'
    ]
};

// 2. 分层配置
module.exports = {
    overrides: [
        {
            files: ['*.test.js', '*.spec.js'],
            env: {
                jest: true
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off'
            }
        },
        {
            files: ['*.config.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off'
            }
        }
    ]
};

// 3. 禁用规则注释
// eslint-disable-next-line no-console
console.log('Debug message');

/* eslint-disable */
// 特殊代码块
/* eslint-enable */

// 4. Prettier 特定文件
// @format
const formatted = true;

// 5. Git Hooks
// package.json
{
    "lint-staged": {
        "*.js": ["eslint --fix", "prettier --write"]
    }
}

// ❌ 不推荐做法

// 1. 完全禁用 ESLint
/* eslint-disable */
const badCode = true;
/* eslint-enable */

// 2. 忽略所有文件
// .eslintignore
**/*  // 不推荐

// 3. 不使用 lint-staged
// pre-commit 检查所有文件，太慢

// 4. 配置冲突
// ESLint 和 Prettier 规则冲突
// 解决：使用 eslint-config-prettier

// 5. 提交后检查
// 应该在 pre-commit 阶段检查
```

::: v-pre

[E2E 测试](./e2e-testing.md) → [总结](../14-practice/README.md)

:::
