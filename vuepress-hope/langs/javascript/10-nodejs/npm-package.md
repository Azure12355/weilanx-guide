---
title: npm 包开发
icon: ri:npmjs-line
order: 6
---

# npm 包开发

开发 npm 包可以共享代码、促进代码复用和建立技术影响力。

## 包结构

### 基本结构

```
my-package/
├── package.json          # 包配置
├── README.md             # 文档
├── LICENSE               # 许可证
├── .gitignore            # Git 忽略
├── src/                  # 源码
│   └── index.js
├── dist/                 # 构建输出
│   └── index.js
├── lib/                  # 库文件
├── bin/                  # 命令行工具
│   └── cli.js
├── test/                 # 测试
└── examples/             # 示例
```

### package.json

```json
{
    "name": "my-awesome-package",
    "version": "1.0.0",
    "description": "An awesome npm package",
    "main": "dist/index.js",
    "module": "src/index.js",
    "types": "dist/index.d.ts",
    "bin": {
        "my-cli": "./bin/cli.js"
    },
    "files": [
        "dist",
        "bin",
        "README.md"
    ],
    "scripts": {
        "build": "tsc",
        "test": "jest",
        "lint": "eslint src",
        "prepare": "npm run build",
        "prepublishOnly": "npm run test"
    },
    "keywords": [
        "awesome",
        "package",
        "utility"
    ],
    "author": "Your Name <you@example.com>",
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "https://github.com/username/my-package.git"
    },
    "bugs": {
        "url": "https://github.com/username/my-package/issues"
    },
    "homepage": "https://github.com/username/my-package#readme",
    "dependencies": {
        "lodash": "^4.17.21"
    },
    "devDependencies": {
        "typescript": "^5.0.0",
        "jest": "^29.0.0",
        "@types/node": "^20.0.0"
    },
    "peerDependencies": {
        "react": ">=16.8.0"
    },
    "engines": {
        "node": ">=14.0.0"
    }
}
```

## 包入口

### CommonJS 入口

```javascript
// src/index.js
// 主入口文件

// 导出函数
function greet(name) {
    return `Hello, ${name}!`;
}

// 导出对象
const utils = {
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    lowercase(str) {
        return str.toLowerCase();
    }
};

// 导出类
class MyClass {
    constructor(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}

// 导出
module.exports = {
    greet,
    utils,
    MyClass
};

// 或使用导出快捷方式
// exports.greet = greet;
// exports.utils = utils;
// exports.MyClass = MyClass;
```

### ES Modules 入口

```javascript
// src/index.js
// ES 模块入口

// package.json 设置
// {
//   "type": "module"
// }

// 命名导出
export function greet(name) {
    return `Hello, ${name}!`;
}

export const utils = {
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

export class MyClass {
    constructor(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}

// 默认导出
export default {
    greet,
    utils,
    MyClass
};
```

### 双模式支持

```javascript
// 同时支持 CommonJS 和 ES Modules

// package.json
// {
//   "main": "dist/index.cjs",
//   "module": "dist/index.js",
//   "exports": {
//     ".": {
//       "import": "./dist/index.js",
//       "require": "./dist/index.cjs"
//     }
//   }
// }

// src/index.js
export function greet(name) {
    return `Hello, ${name}!`;
}

// 构建（使用 Rollup 或 esbuild）
// 生成 index.cjs (CommonJS) 和 index.js (ES Modules)
```

## TypeScript 包

### TypeScript 配置

```json
// tsconfig.json
{
    "compilerOptions": {
        "target": "ES2019",
        "module": "ESNext",
        "lib": ["ES2019"],
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### TypeScript 源码

```typescript
// src/index.ts

// 类型定义
export interface User {
    id: number;
    name: string;
    email: string;
}

// 函数
export function createGreeting(name: string): string {
    return `Hello, ${name}!`;
}

// 类
export class UserService {
    private users: Map<number, User> = new Map();

    add(user: User): void {
        this.users.set(user.id, user);
    }

    find(id: number): User | undefined {
        return this.users.get(id);
    }

    list(): User[] {
        return Array.from(this.users.values());
    }
}

// 工具函数
export const utils = {
    capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    formatEmail(name: string, domain: string): string {
        return `${name.toLowerCase()}@${domain}`;
    }
};
```

## 命令行工具

### CLI 入口

```javascript
// bin/cli.js
#!/usr/bin/env node

const { program } = require('commander');

// 版本和描述
program
    .version('1.0.0')
    .description('My awesome CLI tool');

// 命令
program
    .command('greet <name>')
    .description('Greet someone')
    .option('-u, --uppercase', 'Output in uppercase')
    .action((name, options) => {
        const { greet } = require('../src/index');
        let message = greet(name);

        if (options.uppercase) {
            message = message.toUpperCase();
        }

        console.log(message);
    });

// 解析参数
program.parse(process.argv);
```

### package.json 配置

```json
{
    "bin": {
        "my-cli": "./bin/cli.js"
    },
    "files": [
        "bin",
        "dist"
    ]
}
```

### 使用 CLI

```bash
# 全局安装
npm install -g my-package

# 使用命令
my-cli greet Alice
my-cli greet Bob --uppercase

# 或使用 npx
npx my-package greet Alice
```

## 测试

### 单元测试

```javascript
// test/index.test.js
const { greet, utils } = require('../src/index');

describe('greet', () => {
    test('should greet with name', () => {
        expect(greet('Alice')).toBe('Hello, Alice!');
    });

    test('should handle empty string', () => {
        expect(greet('')).toBe('Hello, !');
    });
});

describe('utils', () => {
    test('should capitalize string', () => {
        expect(utils.capitalize('hello')).toBe('Hello');
    });

    test('should convert to lowercase', () => {
        expect(utils.lowercase('HELLO')).toBe('hello');
    });
});
```

### package.json 脚本

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "lint": "eslint src test",
        "lint:fix": "eslint src test --fix",
        "format": "prettier --write \"src/**/*.js\"",
        "build": "tsc",
        "prepublishOnly": "npm run lint && npm run test && npm run build"
    }
}
```

## 文档

### README.md

```markdown
# My Awesome Package

[![npm version](https://badge.fury.io/js/my-awesome-package.svg)](https://www.npmjs.com/package/my-awesome-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 功能特性

- ✨ 功能 1
- 🚀 功能 2
- 💡 功能 3

## 安装

\`\`\`bash
npm install my-awesome-package
\`\`\`

## 使用方法

### 基本使用

\`\`\`javascript
const { greet } = require('my-awesome-package');

console.log(greet('Alice'));  // Hello, Alice!
\`\`\`

### 高级用法

\`\`\`javascript
const { utils, MyClass } = require('my-awesome-package');

const text = utils.capitalize('hello');  // Hello
const instance = new MyClass(42);
\`\`\`

## API

### greet(name)

返回问候语。

- **name** \<string\> - 名称
- 返回: \<string\> - 问候语

## License

MIT © [Your Name](https://github.com/username)
```

### JSDoc 注释

```javascript
/**
 * 创建问候语
 * @param {string} name - 要问候的名字
 * @param {Object} options - 配置选项
 * @param {boolean} options.formal - 是否使用正式语气
 * @returns {string} 问候语
 * @example
 * greet('Alice')
 * // => 'Hello, Alice!'
 *
 * greet('Alice', { formal: true })
 * // => 'Good day, Alice!'
 */
function greet(name, options = {}) {
    const { formal = false } = options;

    if (formal) {
        return `Good day, ${name}!`;
    }

    return `Hello, ${name}!`;
}
```

## 发布

### 发布到 npm

```bash
# 登录 npm
npm login

# 检查包名是否可用
npm search my-package

# 发布
npm publish

# 发布特定标签
npm publish --tag beta

# 发布为私有包
npm publish --access restricted

# 更新版本
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0

# 再次发布
npm publish
```

### 组织作用域包

```bash
# 创建作用域包
# package.json
{
    "name": "@username/package-name"
}

# 发布为公开包
npm publish --access public

# 安装
npm install @username/package-name
```

## 最佳实践

::: tip npm 包开发建议

1. **语义化版本** - 遵循 SemVer 规范
2. **文档** - 提供 README 和 API 文档
3. **测试** - 编写单元测试
4. **TypeScript** - 提供类型定义
5. **示例** - 提供使用示例

:::

```javascript
// ✅ 推荐做法

// 1. 清晰的 API
export function doSomething(input) {
    // 参数验证
    if (typeof input !== 'string') {
        throw new TypeError('input must be a string');
    }

    // 实现逻辑
    return input.toUpperCase();
}

// 2. 提供 TypeScript 类型
export interface Options {
    caseSensitive?: boolean;
    trim?: boolean;
}

export function format(input: string, options?: Options): string;

// 3. 错误处理
export class PackageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PackageError';
    }
}

// 4. 提供默认导出和命名导出
export default MyClass;
export { MyClass, helperFunction };

// 5. 添加 JSDoc
/**
 * Convert string to uppercase
 * @param {string} str - Input string
 * @returns {string} Uppercase string
 */
```

::: v-pre

[模块](./modules.md) → [包管理](./package.md)

:::
