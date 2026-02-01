---
title: Node.js 基础
icon: ri:terminal-box-line
order: 2
---

# Node.js 基础

Node.js 基础知识包括全局对象、模块系统、事件循环等核心概念。

## 全局对象

### Global 对象

```javascript
// global：全局对象（浏览器中的 window）
// 在 Node.js 中，全局变量是 global 的属性

// 定义全局变量
global.myVar = 'Hello';
console.log(myVar);  // Hello

// 注意：避免污染全局命名空间
// 使用模块作用域替代

// 全局函数
console.log('Info');
console.error('Error');
console.warn('Warning');

// 定时器
setTimeout(() => console.log('Delayed'), 1000);
setInterval(() => console.log('Interval'), 1000);
setImmediate(() => console.log('Immediate'));

// 清除定时器
const timeoutId = setTimeout(() => {}, 1000);
clearTimeout(timeoutId);

const intervalId = setInterval(() => {}, 1000);
clearInterval(intervalId);
```

### Process 对象

```javascript
// process：进程信息

// 进程信息
console.log(process.pid);          // 进程 ID
console.log(process.ppid);         // 父进程 ID
console.log(process.platform);     // 操作系统
console.log(process.arch);         // CPU 架构
console.log(process.version);      // Node.js 版本

// 命令行参数
// node app.js arg1 arg2
console.log(process.argv);
// ['node路径', 'app.js路径', 'arg1', 'arg2']

// 解析命令行参数
const args = process.argv.slice(2);
console.log(args);  // ['arg1', 'arg2']

// 环境变量
console.log(process.env.NODE_ENV);  // 环境变量
console.log(process.env.PATH);      // PATH

// 退出进程
process.exit(0);    // 正常退出
process.exit(1);    // 异常退出

// 内存使用
console.log(process.memoryUsage());
// {
//   rss: 20918272,
//   heapTotal: 7684096,
//   heapUsed: 4777040,
//   external: 95845
// }

// CPU 使用
const startUsage = process.cpuUsage();
// ... 执行一些操作
const endUsage = process.cpuUsage(startUsage);
console.log(endUsage);  // { user: 12345, system: 6789 }

// 执行时间
console.time('timer');
// ... 执行一些操作
console.timeEnd('timer');  // timer: 123.456ms
```

### Buffer 对象

```javascript
// Buffer：处理二进制数据

// 创建 Buffer
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.alloc(10);         // 创建 10 字节 Buffer
const buf3 = Buffer.allocUnsafe(10);   // 创建未初始化 Buffer

// 写入数据
buf2.write('Hello');
buf2.write('World', 5);

// 读取数据
console.log(buf1.toString());           // Hello
console.log(buf1.toString('hex'));      // 48656c6c6f
console.log(buf1.toString('base64'));   // SGVsbG8=

// 访问字节
console.log(buf1[0]);                  // 72 ('H')
buf1[0] = 74;                          // 修改为 'J'

// Buffer 操作
const buf4 = Buffer.concat([buf1, buf2]);  // 连接
console.log(buf4.length);                  // 长度
console.log(buf4.slice(0, 5));             // 切片

// 转换
const num = 12345;
const buf5 = Buffer.alloc(4);
buf5.writeUInt32BE(num);  // 写入 32 位无符号整数（大端）
console.log(buf5.readUInt32BE());  // 读取

// 字符串编码
const text = '你好';
const buf6 = Buffer.from(text, 'utf8');
console.log(buf6);  // <Buffer e4 bd a0 e5 a5 bd>
```

## 模块系统

### CommonJS 模块

```javascript
// CommonJS：Node.js 传统模块系统

// 导出（module.js）
// 方式 1：导出对象
module.exports = {
    name: 'Alice',
    age: 25,
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

// 方式 2：导出单个值
module.exports = 'Hello';

// 方式 3：导出函数
module.exports = function(name) {
    console.log(`Hello, ${name}`);
};

// 方式 4：导出类
module.exports = class User {
    constructor(name) {
        this.name = name;
    }
};

// 方式 5：使用 exports
exports.name = 'Alice';
exports.age = 25;
// 注意：不能直接赋值 exports = value

// 导入（main.js）
const user = require('./module');
console.log(user.name);  // Alice
user.greet();

// 解构导入
const { name, age } = require('./module');

// 导入核心模块
const fs = require('fs');
const path = require('path');

// 导入 npm 包
const express = require('express');
```

### ES Modules

```javascript
// ES Modules：现代 JavaScript 模块系统

// package.json 中设置
{
    "type": "module"
}

// 或使用 .mjs 扩展名

// 导出（module.js）
// 方式 1：命名导出
export const name = 'Alice';
export const age = 25;
export function greet() {
    console.log('Hello');
}
export class User {
    constructor(name) {
        this.name = name;
    }
}

// 方式 2：默认导出
export default {
    name: 'Alice',
    age: 25
};

// 方式 3：混合导出
export const PI = 3.14;
export default class Calculator {}

// 导入（main.js）
// 导入默认导出
import user from './module.js';

// 导入命名导出
import { name, age, greet } from './module.js';

// 导入所有
import * as module from './module.js';

// 导入并重命名
import { name as userName } from './module.js';

// 导入核心模块
import fs from 'fs';
import path from 'path';

// 动态导入
const module = await import('./module.js');
```

### Module 对象

```javascript
// module：当前模块信息

console.log(module.id);           // 模块 ID
console.log(module.filename);     // 文件名
console.log(module.loaded);       // 是否已加载
console.log(module.parent);       // 父模块
console.log.module.children);     // 子模块

// module.exports
// 指向当前模块的导出对象
console.log(module.exports === exports);  // true

// 修改导出
module.exports = {
    name: 'Alice'
};

// exports 是 module.exports 的引用
exports.name = 'Alice';
// 等价于
module.exports.name = 'Alice';

// 注意：不能直接赋值 exports
// exports = { name: 'Alice' };  // ❌ 错误
```

### require 解析

```javascript
// require：模块解析规则

// 1. 核心模块
const fs = require('fs');      // 直接加载核心模块

// 2. 相对路径
const utils = require('./utils');
const utils = require('../utils');
const utils = require('./utils.js');

// 3. 绝对路径
const utils = require('/path/to/utils');

// 4. 模块查找
const express = require('express');
// 查找顺序：
// 1. 当前目录的 node_modules
// 2. 父目录的 node_modules
// 3. 递归向上查找
// 4. 全局目录

// 查找算法
// 1. 查找 package.json 的 main 字段
// 2. 如果没有，查找 index.js
// 3. 如果都没有，抛出错误

// require 缓存
// 同一模块只加载一次
const mod1 = require('./module');
const mod2 = require('./module');
console.log(mod1 === mod2);  // true

// 清除缓存
delete require.cache[require.resolve('./module')];
```

## 事件循环

### 事件循环机制

```javascript
// 事件循环：Node.js 的执行模型

console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve().then(() => console.log('Promise 1'));
Promise.resolve().then(() => console.log('Promise 2'));

process.nextTick(() => console.log('NextTick 1'));
process.nextTick(() => console.log('NextTick 2'));

console.log('End');

// 输出顺序：
// Start
// End
// NextTick 1
// NextTick 2
// Promise 1
// Promise 2
// Timeout 1
// Timeout 2

// 事件循环阶段：
// 1. Timers（setTimeout、setInterval）
// 2. Pending callbacks
// 3. Idle、prepare
// 4. Poll（获取新的 I/O 事件）
// 5. Check（setImmediate）
// 6. Close callbacks

// nextTick 队列（微任务）
// 在每个阶段完成后执行
process.nextTick(() => {
    console.log('NextTick');
});

// Promise 队列（微任务）
// 在 nextTick 之后执行
Promise.resolve().then(() => {
    console.log('Promise');
});
```

### setImmediate vs setTimeout

```javascript
// setImmediate vs setTimeout

setTimeout(() => {
    console.log('Timeout');
}, 0);

setImmediate(() => {
    console.log('Immediate');
});

// 执行顺序不确定
// 因为它们在不同的阶段执行

// 在 I/O 回调中，setImmediate 先执行
const fs = require('fs');

fs.readFile(__filename, () => {
    setTimeout(() => console.log('Timeout'), 0);
    setImmediate(() => console.log('Immediate'));
    // 输出：
    // Immediate
    // Timeout
});
```

## 异步编程

### 回调函数

```javascript
// 回调函数：传统异步编程方式

const fs = require('fs');

// 读取文件
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// 回调地狱（避免）
fs.readFile('file1.txt', (err, data1) => {
    fs.readFile('file2.txt', (err, data2) => {
        fs.readFile('file3.txt', (err, data3) => {
            // 过深的嵌套
        });
    });
});
```

### Promise

```javascript
// Promise：ES6 异步编程

const fs = require('fs').promises;

// 基本用法
fs.readFile('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(err => console.error(err));

// 链式调用
fs.readFile('file1.txt', 'utf8')
    .then(data1 => {
        console.log(data1);
        return fs.readFile('file2.txt', 'utf8');
    })
    .then(data2 => {
        console.log(data2);
        return fs.readFile('file3.txt', 'utf8');
    })
    .then(data3 => {
        console.log(data3);
    })
    .catch(err => {
        console.error(err);
    });

// Promise.all
Promise.all([
    fs.readFile('file1.txt', 'utf8'),
    fs.readFile('file2.txt', 'utf8'),
    fs.readFile('file3.txt', 'utf8')
])
    .then(([data1, data2, data3]) => {
        console.log(data1, data2, data3);
    })
    .catch(err => console.error(err));
```

### Async/Await

```javascript
// async/await：ES8 异步编程

const fs = require('fs').promises;

// 基本用法
async function readFile() {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// 顺序执行
async function readFiles() {
    try {
        const data1 = await fs.readFile('file1.txt', 'utf8');
        console.log(data1);

        const data2 = await fs.readFile('file2.txt', 'utf8');
        console.log(data2);

        const data3 = await fs.readFile('file3.txt', 'utf8');
        console.log(data3);
    } catch (err) {
        console.error(err);
    }
}

// 并行执行
async function readFilesParallel() {
    try {
        const [data1, data2, data3] = await Promise.all([
            fs.readFile('file1.txt', 'utf8'),
            fs.readFile('file2.txt', 'utf8'),
            fs.readFile('file3.txt', 'utf8')
        ]);

        console.log(data1, data2, data3);
    } catch (err) {
        console.error(err);
    }
}

// 箭头函数
const readFile = async () => {
    const data = await fs.readFile('file.txt', 'utf8');
    return data;
};
```

## 错误处理

### 错误类型

```javascript
// 错误类型

// 1. SyntaxError（语法错误）
// const obj = ;  // SyntaxError

// 2. TypeError（类型错误）
// const num = 123;
// num.toUpperCase();  // TypeError

// 3. ReferenceError（引用错误）
// console.log(notDefined);  // ReferenceError

// 4. RangeError（范围错误）
// new Array(-1);  // RangeError

// 5. Error（自定义错误）
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
    }
}

throw new CustomError('Something went wrong');
```

### 错误处理模式

```javascript
// 错误处理模式

// 1. try-catch（同步）
try {
    JSON.parse(invalidJSON);
} catch (err) {
    console.error(err);
}

// 2. 回调错误优先
fs.readFile('file.txt', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// 3. Promise catch
Promise.reject(new Error('Failed'))
    .catch(err => console.error(err));

// 4. async/await try-catch
async function readFile() {
    try {
        const data = await fs.readFile('file.txt');
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// 5. 全局错误处理
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
```

## 最佳实践

::: tip Node.js 基础建议

1. **使用 async/await** - 避免回调地狱
2. **错误处理** - 始终处理错误
3. **避免全局变量** - 使用模块作用域
4. **使用 ES Modules** - 现代模块系统
5. **理解事件循环** - 优化性能

:::

```javascript
// ✅ 推荐做法

// 1. 使用 async/await
async function main() {
    try {
        const data = await fs.readFile('file.txt');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// 2. 错误处理
try {
    JSON.parse(jsonString);
} catch (err) {
    console.error('Invalid JSON:', err);
}

// 3. 模块导出
export const PI = 3.14;
export default function calculate() {}

// 4. Buffer 处理
const buffer = Buffer.from(string, 'utf8');

// 5. 事件监听
process.on('SIGINT', () => {
    console.log('Exiting...');
    process.exit(0);
});
```

::: v-pre

[概述](./nodejs-overview.md) → [HTTP 服务器](./http-server.md)

:::
