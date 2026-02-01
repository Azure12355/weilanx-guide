---
title: Node.js 概述
icon: logos:nodejs-icon
order: 1
---

# Node.js 概述

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，使 JavaScript 可以脱离浏览器在服务器端运行。

## 什么是 Node.js

### 基本概念

```javascript
// Node.js：JavaScript 运行时（Runtime）

// 传统 JavaScript
// 只能在浏览器中运行
// 浏览器提供：DOM、BOM、Fetch API 等

// Node.js
// JavaScript 在服务器端运行
// 提供服务器端功能：文件系统、网络、HTTP 等

// Node.js = V8 引擎 + C++ 插件 + JavaScript 库
┌──────────────────────────────────────┐
│            Node.js                   │
├──────────────────────────────────────┤
│  JavaScript API (fs, http, path...) │
├──────────────────────────────────────┤
│     C++ Bindings (libuv)             │
├──────────────────────────────────────┤
│     V8 JavaScript Engine             │
└──────────────────────────────────────┘
```

### 发展历程

```javascript
// Node.js 发展历程

timeline
    title Node.js 发展历程
    2009 : Ryan Dahl 创建 Node.js
    2011 : npm 1.0 发布
    2013 : Express.js 成为标准 Web 框架
    2014 : io.js 分支
    2015 : Node.js 4.0 合并 io.js
    2016 : Node.js 6.0 长期支持版
    2018 : Node.js 10.0 LTS
    2020 : Node.js 14.0 LTS
    2021 : Node.js 16.0 LTS
    2022 : Node.js 18.0 LTS
    2023 : Node.js 20.0 LTS
```

## Node.js 特点

### 事件驱动

```javascript
// 事件驱动：基于事件回调的非阻塞 I/O

// 传统阻塞 I/O（多线程）
// 每个请求一个线程
const fs = require('fs');

// 阻塞方式
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);
// 等待文件读取完成，阻塞后续代码

// Node.js 非阻塞 I/O（事件循环）
// 单线程处理多个请求
const fs = require('fs');

// 非阻塞方式
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});
// 不等待，继续执行后续代码

console.log('This runs first!');

// 事件驱动流程
// 1. 发起 I/O 请求
// 2. 注册回调函数
// 3. 继续执行其他任务
// 4. I/O 完成后触发事件
// 5. 执行回调函数
```

### 非阻塞 I/O

```javascript
// 非阻塞 I/O 模型
const fs = require('fs');

// 同时读取多个文件
console.log('Start reading files...');

fs.readFile('file1.txt', 'utf8', (err, data1) => {
    console.log('File 1 read');
});

fs.readFile('file2.txt', 'utf8', (err, data2) => {
    console.log('File 2 read');
});

fs.readFile('file3.txt', 'utf8', (err, data3) => {
    console.log('File 3 read');
});

console.log('All files queued for reading');

// 输出顺序：
// Start reading files...
// All files queued for reading
// File 1 read
// File 2 read
// File 3 read
// （完成顺序不确定）

// 对比阻塞 I/O
const data1 = fs.readFileSync('file1.txt', 'utf8');  // 等待
const data2 = fs.readFileSync('file2.txt', 'utf8');  // 等待
const data3 = fs.readFileSync('file3.txt', 'utf8');  // 等待
// 总时间 = file1 + file2 + file3
```

### 单线程

```javascript
// 单线程：主线程是单线程的
console.log('Start');

setTimeout(() => {
    console.log('Timeout 1');
}, 1000);

setTimeout(() => {
    console.log('Timeout 2');
}, 0);

console.log('End');

// 输出：
// Start
// End
// Timeout 2
// Timeout 1

// 虽然 setTimeout 是 0ms，但会先执行同步代码

// 单线程的优势
// 1. 简化编程模型
// 2. 避免线程同步问题
// 3. 减少上下文切换开销

// 单线程的局限
// 1. CPU 密集型任务会阻塞
// 2. 无法利用多核 CPU
// 3. 错误会导致整个进程崩溃

// 解决方案
// 1. Worker Threads：多线程
// 2. Cluster：多进程
// 3. C++ 插件：性能密集型任务
```

## Node.js 应用场景

### Web 服务器

```javascript
// Web 服务器：最常见应用
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Hello, World!</h1>');
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello, API!' }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// 使用 Express.js 框架
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hello, API!' });
});

app.listen(3000);
```

### 实时应用

```javascript
// 实时应用：聊天、游戏、协作工具
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        // 广播消息给所有客户端
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

// 使用 Socket.IO
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
```

### API 服务

```javascript
// RESTful API
const express = require('express');
const app = express();

app.use(express.json());

// 获取所有用户
app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ]);
});

// 获取单个用户
app.get('/api/users/:id', (req, res) => {
    const user = { id: req.params.id, name: 'Alice' };
    res.json(user);
});

// 创建用户
app.post('/api/users', (req, res) => {
    const user = req.body;
    res.status(201).json(user);
});

// 更新用户
app.put('/api/users/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body });
});

// 删除用户
app.delete('/api/users/:id', (req, res) => {
    res.status(204).send();
});

app.listen(3000);
```

### 构建工具

```javascript
// 构建工具：Webpack、Vite 等基于 Node.js

// 示例：简单的文件处理
const fs = require('fs');
const path = require('path');

// 读取目录所有文件
function readDir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        });
    });
}

// 读取文件内容
function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

// 处理所有文件
async function processFiles(dir) {
    const files = await readDir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const content = await readFile(filePath);

        // 处理文件内容
        console.log(`Processed: ${file}`);
    }
}

processFiles('./src');
```

### 命令行工具

```javascript
// 命令行工具（CLI）
const program = require('commander');

program
    .version('1.0.0')
    .description('My CLI Tool')
    .option('-v, --verbose', 'Verbose output');

program
    .command('create <name>')
    .description('Create a new project')
    .action((name, options) => {
        console.log(`Creating project: ${name}`);
        if (options.verbose) {
            console.log('Verbose mode enabled');
        }
    });

program
    .command('build')
    .description('Build the project')
    .action(() => {
        console.log('Building project...');
    });

program.parse(process.argv);

// 使用：
// node cli.js create my-app --verbose
// node cli.js build
```

## Node.js vs 浏览器环境

### API 差异

```javascript
// 浏览器环境
console.log(window);          // Window 对象
console.log(document);        // Document 对象
console.log(navigator);       // Navigator 对象
console.log(fetch);           // Fetch API
console.log(localStorage);    // 本地存储

// Node.js 环境
console.log(global);          // Global 对象
console.log(process);         // Process 对象
console.log(__dirname);       // 当前文件目录
console.log(__filename);      // 当前文件路径
console.log(require);         // 模块系统
console.log(module);          // 模块对象
console.log(exports);         // 导出对象
```

### 全局对象

```javascript
// Node.js 全局对象

// global：全局命名空间
global.myVar = 'Hello';
console.log(myVar);  // Hello

// process：进程信息
console.log(process.pid);       // 进程 ID
console.log(process.platform);  // 操作系统
console.log(process.argv);      // 命令行参数

// __dirname：当前文件目录
console.log(__dirname);

// __filename：当前文件路径
console.log(__filename);

// Buffer：二进制数据
const buf = Buffer.from('Hello');
console.log(buf.toString());  // Hello

// setTimeout / setInterval
setTimeout(() => console.log('Delayed'), 1000);
setInterval(() => console.log('Interval'), 1000);

// console
console.log('Info');
console.error('Error');
console.warn('Warning');
```

### 模块系统

```javascript
// 浏览器：ES Modules
<script type="module">
    import { func } from './module.js';
    export const value = 42;
</script>

// Node.js：CommonJS（传统）
const fs = require('fs');
module.exports = { readFile: fs.readFile };

// Node.js：ES Modules（现代）
// package.json 中设置 "type": "module"
import fs from 'fs';
export { readFile };
```

## Node.js 运行时

### REPL

```javascript
// REPL：Read-Eval-Print Loop
// 交互式 JavaScript 环境

$ node
> 1 + 1
2
> console.log('Hello')
Hello
undefined
> .help
.break   Sometimes you get stuck, this gets you out
.clear    Break, and also clear the local context
.exit     Exit the REPL
.help     Show this help
> .exit
```

### 运行脚本

```bash
# 运行 JavaScript 文件
node app.js

# 传递参数
node app.js --port 3000

# 在脚本中访问参数
// process.argv
// ['node', 'app.js', '--port', '3000']

# ES 模块支持
node --input-type=module --eval "import { console } from 'node:console'; console.log('Hello')"

# 监听模式（自动重启）
node --watch app.js
```

## Node.js 最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用异步非阻塞代码
fs.readFile('file.txt', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// 2. 错误处理
fs.readFile('file.txt', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// 3. 使用 async/await
async function readFile() {
    try {
        const data = await fs.promises.readFile('file.txt');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// ❌ 不推荐做法

// 1. 使用同步 I/O（阻塞）
const data = fs.readFileSync('file.txt');

// 2. 忽略错误处理
fs.readFile('file.txt', (err, data) => {
    console.log(data);  // err 未处理
});

// 3. 嵌套回调（回调地狱）
fs.readFile('file1.txt', (err, data1) => {
    fs.readFile('file2.txt', (err, data2) => {
        fs.readFile('file3.txt', (err, data3) => {
            // 过深的嵌套
        });
    });
});
```

::: tip Node.js 检查清单

- [ ] 理解事件驱动模型
- [ ] 掌握非阻塞 I/O
- [ ] 了解单线程特性
- [ ] 熟悉 Node.js API
- [ ] 理解模块系统
- [ ] 了解应用场景

:::

::: tip 下一步

学习文件系统 → [文件系统](./file-system.md)
:::
