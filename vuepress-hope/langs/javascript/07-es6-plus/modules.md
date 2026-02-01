---
title: ES 模块
icon: ri:file-list-3-line
order: 7
---

# ES 模块

ES 模块（ES Modules）是 JavaScript 官方的模块化方案，提供了原生的模块支持。

## 模块基础

### 导出（export）

```javascript
// math.js
// 命名导出
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export const multiplier = 2;

// 也可以先声明后导出
const value = 42;

function helper() {
    console.log('Helper');
}

export { value, helper };

// 导出时重命名
export { add as sum, subtract as difference };

// 默认导出
export default function greet(name) {
    console.log(`Hello, ${name}`);
}

// 或导出已声明的函数
function greet2(name) {
    console.log(`Hi, ${name}`);
}

export { greet2 as default };

// 导出类
export class Calculator {
    add(a, b) {
        return a + b;
    }
}

// 导出列表
export { PI, add, subtract };
```

### 导入（import）

```javascript
// main.js
// 导入命名导出
import { PI, add, subtract } from './math.js';

console.log(PI);           // 3.14159
console.log(add(1, 2));     // 3
console.log(subtract(5, 3)); // 2

// 导入并重命名
import { add as sum, subtract as difference } from './math.js';

console.log(sum(1, 2));        // 3
console.log(difference(5, 3));  // 2

// 导入默认导出
import greet from './math.js';
greet('Alice');  // 'Hello, Alice'

// 导入默认导出和命名导出
import greetDefault, { PI, add } from './math.js';

// 导入所有到对象
import * as math from './math.js';

console.log(math.PI);           // 3.14159
console.log(math.add(1, 2));     // 3
console.log(math.subtract(5, 3)); // 2

// 只导入，不使用（副作用导入）
import './styles.css';
import './polyfills.js';
```

## 导入导出模式

### 混合导出

```javascript
// utils.js
// 默认导出
export default {
    name: 'Utils',
    version: '1.0.0'
};

// 命名导出
export const API_URL = 'https://api.example.com';
export const TIMEOUT = 5000;

export function log(message) {
    console.log(message);
}

// main.js
import utils, { API_URL, log } from './utils.js';

console.log(utils);      // { name: 'Utils', version: '1.0.0' }
console.log(API_URL);    // 'https://api.example.com'
log('Hello');           // 'Hello'
```

### 重新导出

```javascript
// 重新导出：从一个模块导出后，再从另一个模块导出

// utils/index.js
// 方式 1：重新导出命名导出
export { log, warn, error } from './logger.js';

// 方式 2：重新导出默认导出
export { default as Logger } from './logger.js';

// 方式 3：重新导出所有
export * from './math.js';
export * from './string.js';

// 方式 4：重新导出并重命名
export { add as sum, subtract as difference } from './math.js';

// 使用
import { sum, difference } from './utils/index.js';
```

### 动态导入

```javascript
// 动态导入：运行时按需加载模块
// 返回 Promise

button.addEventListener('click', async () => {
    const { default: Modal } = await import('./Modal.js');
    const modal = new Modal();
    modal.show();
});

// 条件导入
async function loadModule(feature) {
    if (feature === 'editor') {
        const { default: Editor } = await import('./Editor.js');
        return new Editor();
    } else if (feature === 'viewer') {
        const { default: Viewer } = await import('./Viewer.js');
        return new Viewer();
    }
}

// 懒加载路由
const routes = {
    home: () => import('./pages/Home.js'),
    about: () => import('./pages/About.js'),
    contact: () => import('./pages/Contact.js')
};

app.get('/home', async (req, res) => {
    const { default: Home } = await routes.home();
    res.send(new Home());
});
```

## 模块特点

### 严格模式

```javascript
// ES 模块自动运行在严格模式
// 不需要 'use strict'

// 严格模式的限制：
// 1. 变量必须声明
// x = 10;  // ReferenceError

// 2. this 是 undefined
console.log(this);  // undefined（不是 window）

// 3. 禁止 with
// with (obj) {}  // SyntaxError

// 4. 保留字不能用作变量名
// const interface = {};  // SyntaxError

// 5. 参数名不能重复
// function fn(a, a) {}  // SyntaxError

// 6. 八进制字面量需要 0o 前缀
// const octal = 012;  // SyntaxError
const octal = 0o12;  // OK
```

### 作用域

```javascript
// 模块有自己的作用域
// 不会污染全局作用域

// module1.js
const name = 'Module 1';
function greet() {
    console.log('Hello from Module 1');
}

// module2.js
const name = 'Module 2';  // 不会与 module1 冲突
function greet() {
    console.log('Hello from Module 2');
}

// 顶层 this 是 undefined
console.log(this);  // undefined
```

### 单例模式

```javascript
// 模块只执行一次，后续导入使用缓存
// 模块是单例的

// config.js
let count = 0;

export function increment() {
    count++;
    console.log('Count:', count);
}

export function getCount() {
    return count;
}

// module1.js
import { increment, getCount } from './config.js';
increment();  // 'Count: 1'

// module2.js
import { increment, getCount } from './config.js';
increment();  // 'Count: 2'（共享同一个模块实例）
```

## 循环依赖

### 问题

```javascript
// a.js
import { b } from './b.js';

export const a = 1;

console.log('a.js:', a, b);

// b.js
import { a } from './a.js';

export const b = 2;

console.log('b.js:', a, b);

// 执行顺序：
// 1. a.js 开始执行
// 2. a.js 遇到 import b.js
// 3. b.js 开始执行
// 4. b.js 遇到 import a.js
// 5. a.js 的导出尚未完成，a 是 undefined
// 6. b.js 继续执行
// 7. b.js 完成
// 8. a.js 继续执行

// 输出：
// 'b.js: undefined 2'
// 'a.js: 1 2'
```

### 解决方案

```javascript
// 方案 1：延迟导入
// a.js
let b;

export const a = 1;

export function init() {
    if (!b) {
        b = await import('./b.js');
    }
    return b;
}

// 方案 2：使用函数
// a.js
import { getB } from './b.js';

export const a = 1;

export function useB() {
    const b = getB();
    console.log(a, b);
}

// b.js
import { a } from './a.js';

export function getB() {
    return 2;
}

console.log('b.js:', a, getB());
```

## import.meta

### 模块信息

```javascript
// import.meta：包含模块的元数据
console.log(import.meta.url);  // 模块的 URL

// 获取当前脚本目录
const currentDir = new URL('.', import.meta.url).href;
console.log(currentDir);

// 相对路径解析
const imagePath = new URL('./image.png', import.meta.url).href;

// 环境变量（Vite 等）
if (import.meta.env.PROD) {
    console.log('Production mode');
}

if (import.meta.env.DEV) {
    console.log('Development mode');
}

// 读取 JSON（需要导入断言）
const data = await fetch(new URL('./data.json', import.meta.url)).then(r => r.json());
```

## 模块最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用命名导出，便于 tree-shaking
export const PI = 3.14159;
export function add(a, b) {
    return a + b;
}

// 2. 使用默认导出导出主要功能
export default class Calculator {}

// 3. 明确的导入路径
import { add } from './math.js';

// 4. 使用导入路径别名
import { Button } from '@/components/Button.js';

// 5. 动态导入按需加载
const module = await import('./heavy-module.js');

// 6. 重新导出组织模块
export * from './utils.js';

// ❌ 不推荐做法

// 1. 导入所有（不利于 tree-shaking）
import * as utils from './utils.js';

// 2. 混合导入命名和默认导出时容易混淆
import utils, { Helper } from './utils.js';

// 3. 绝对路径（难以维护）
import { foo } from '/path/to/project/src/utils.js';

// 4. 忽略 .js 扩展名（某些环境需要）
import { foo } from './utils';  // 应该用 './utils.js'

// 5. 循环依赖
// a.js 导入 b.js，b.js 导入 a.js
```

::: tip ES 模块检查清单

- [ ] 使用 export 导出模块
- [ ] 使用 import 导入模块
- [ ] 理解命名导出和默认导出
- [ ] 使用动态导入按需加载
- [ ] 模块自动运行在严格模式
- [ ] 避免循环依赖

:::

::: tip ES6+ 回顾

恭喜！你已掌握 ES6+ 的核心知识：

- [x] let 与 const
- [x] 模板字符串
- [x] 解构赋值
- [x] 展开与剩余
- [x] 对象增强
- [x] 函数增强
- [x] ES 模块

接下来学习前端工程化 → [前端工程化](../08-engineering/build-tools.md)
:::
