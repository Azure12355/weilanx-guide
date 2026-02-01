---
title: 模块系统
icon: ri:stack-line
order: 4
---

# 模块系统

Node.js 的模块系统允许将代码分割成可重用的独立文件。

## CommonJS

### 模块导出

```javascript
// CommonJS：Node.js 原生模块系统

// 导出单个值
// math.js
const add = (a, b) => a + b;
module.exports = add;

// 导入
const add = require('./math');
console.log(add(1, 2));  // 3

// 导出多个值
// utils.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

module.exports = {
    add,
    subtract,
    multiply
};

// 导入
const { add, subtract, multiply } = require('./utils');
console.log(add(1, 2));       // 3
console.log(subtract(5, 3));   // 2
console.log(multiply(4, 5));   // 20

// 使用 exports 简写
// utils.js
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
exports.multiply = (a, b) => a * b;

// 注意：exports 和 module.exports 的区别
// exports 只是 module.exports 的引用
// 直接赋值 exports 会断开引用
exports = { add };  // 错误：不会导出
module.exports = { add };  // 正确
```

### 模块导入

```javascript
// require：导入模块

// 导入核心模块
const fs = require('fs');
const http = require('http');
const path = require('path');

// 导入第三方模块
const express = require('express');
const lodash = require('lodash');

// 导入本地模块
const myModule = require('./myModule');
const utils = require('./utils');

// 导入 JSON 文件
const config = require('./config.json');
const package = require('../package.json');

// 模块加载顺序
// 1. 核心模块（fs、http 等）
// 2. 相对路径（./、../）
// 3. 绝对路径（/path/to/module）
// 4. node_modules 目录

// 模块缓存
const mod1 = require('./myModule');
const mod2 = require('./myModule');
// mod1 和 mod2 是同一个实例
console.log(mod1 === mod2);  // true

// 清除缓存
delete require.cache[require.resolve('./myModule')];
```

### module 对象

```javascript
// module：当前模块的信息
console.log(module);
// {
//   id: '.',
//   exports: {},
//   parent: null,
//   filename: '/path/to/module.js',
//   loaded: false,
//   children: [],
//   paths: [
//     '/path/to/node_modules',
//     '/path/node_modules',
//     '/node_modules'
//   ]
// }

// module.exports：导出的内容
module.exports = {
    myFunction: () => {}
};

// module.id：模块标识符
console.log(module.id);

// module.filename：模块文件路径
console.log(module.filename);

// module.loaded：模块是否已加载
console.log(module.loaded);

// module.parent：导入此模块的父模块
console.log(module.parent);
```

### require 机制

```javascript
// require：模块解析机制

// 解析顺序
// 1. 核心模块
const fs = require('fs');

// 2. 相对路径
const mod = require('./module');

// 3. 绝对路径
const mod = require('/path/to/module');

// 4. node_modules 查找
const mod = require('express');
// 查找顺序：
// - ./node_modules/express
// - ../node_modules/express
// - ../../node_modules/express
// - 直到根目录

// 文件扩展名
const mod = require('./module');  // 自动尝试 .js, .json, .node
const mod = require('./module.js');  // 明确指定

// 目录导入
const mod = require('./mydir');
// 自动查找：
// - ./mydir/package.json 的 main 字段
// - ./mydir/index.js

// require.resolve：解析模块路径
const path = require.resolve('./module');
console.log(path);  // /path/to/module.js

// require.cache：模块缓存
console.log(require.cache);
```

## ES Modules

### 启用 ES Modules

```javascript
// ES Modules：现代 JavaScript 模块系统

// 方式 1：package.json 中设置
{
  "type": "module"
}

// 方式 2：使用 .mjs 扩展名
// app.mjs

// 方式 3：使用 --input-type 标志
node --input-type=module --eval "import { console } from 'node:console';"
```

### 命名导出

```javascript
// 命名导出：export

// 直接导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// 导出列表
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

export { add, subtract, multiply };

// 导出时重命名
export { add as sum, subtract as sub };

// 导入
import { add, subtract, multiply } from './utils.js';
import { add as sum, subtract as sub } from './utils.js';

// 导入所有
import * as utils from './utils.js';
utils.add(1, 2);
utils.subtract(5, 3);
```

### 默认导出

```javascript
// 默认导出：export default

// 导出
const add = (a, b) => a + b;
export default add;

// 或直接导出
export default (a, b) => a + b;

// 导入
import add from './utils.js';

// 也可以重命名
import sum from './utils.js';

// 混合导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default (a, b) => a * b;

// 导入
import multiply, { add, subtract } from './utils.js';
```

### 动态导入

```javascript
// 动态导入：运行时导入模块

// 动态 import() 返回 Promise
const module = await import('./utils.js');
console.log(module);

// 导入特定内容
const { add } = await import('./utils.js');

// 默认导出
const module = await import('./utils.js');
const add = module.default;

// 按需加载
async function loadModule() {
    if (condition) {
        const { utils } = await import('./utils.js');
        utils.add(1, 2);
    }
}

// 路由懒加载
const routes = {
    '/': () => import('./pages/home.js'),
    '/about': () => import('./pages/about.js'),
    '/contact': () => import('./pages/contact.js')
};

app.get('/:page', async (req, res) => {
    const pageModule = await routes[req.params.page]();
    pageModule.default(req, res);
});
```

### import.meta

```javascript
// import.meta：模块元信息

// __dirname 替代
const __dirname = import.meta.dirname;

// __filename 替代
const __filename = import.meta.filename;

// import.meta.url：模块 URL
console.log(import.meta.url);
// file:///path/to/module.js

// 相对路径解析
const filePath = new URL('./data.json', import.meta.url).pathname;
```

## 模块规范对比

### CommonJS vs ES Modules

```javascript
// CommonJS vs ES Modules

// CommonJS
// - Node.js 原生
// - 同步加载
// - 运行时加载
const fs = require('fs');
module.exports = fs;

// ES Modules
// - 现代标准
// - 异步加载
// - 编译时加载
import fs from 'fs';
export default fs;

// 主要区别
// 1. 导出方式
// CommonJS：module.exports
// ES Modules：export

// 2. 导入方式
// CommonJS：require()
// ES Modules：import

// 3. 加载时机
// CommonJS：运行时加载
// ES Modules：编译时加载

// 4. 值拷贝 vs 引用
// CommonJS：值拷贝
// ES Modules：引用

// CommonJS 值拷贝
// counter.js
let count = 0;
module.exports = { count };

// main.js
const counter = require('./counter');
counter.count = 1;
// counter.js 中的 count 不变

// ES Modules 引用
// counter.js
export let count = 0;

// main.js
import { count } from './counter';
count = 1;
// counter.js 中的 count 也改变
```

## 模块最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用 ES Modules（新项目）
export const add = (a, b) => a + b;
import { add } from './utils.js';

// 2. 使用命名导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 3. 使用绝对路径
// 使用路径别名或 node_modules

// 4. 模块职责单一
// 一个模块做一件事

// 5. 避免循环依赖
// a.js
import { b } from './b.js';
export const a = 1;

// b.js
import { a } from './a.js';
export const b = 2;

// ❌ 不推荐做法

// 1. 混用 CommonJS 和 ES Modules
// 可能导致问题

// 2. 过度导出
// 导出太多内容

// 3. 相对路径过深
import { mod } from '../../../utils/module.js';
// 应使用路径别名

// 4. 修改导入的值
import { count } from './counter.js';
count = 1;  // 错误

// 5. 忽略文件扩展名
// CommonJS 可省略，ES Modules 需要写 .js
import { mod } from './module';  // 错误
import { mod } from './module.js';  // 正确
```

::: tip 模块系统检查清单

- [ ] 掌握 CommonJS 模块
- [ ] 掌握 ES Modules
- [ ] 理解模块加载机制
- [ ] 避免循环依赖
- [ ] 使用命名导出
- [ ] 选择合适的模块系统

:::

::: tip 下一步

学习包管理器 → [包管理器](../08-engineering/package-managers.md)
:::
