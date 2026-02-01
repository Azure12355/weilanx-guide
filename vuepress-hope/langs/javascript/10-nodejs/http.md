---
title: HTTP 模块
icon: ri:global-line
order: 3
---

# HTTP 模块

Node.js 内置的 http 模块提供了创建 HTTP 服务器和客户端的功能。

## HTTP 服务器

### 创建服务器

```javascript
// http：创建 HTTP 服务器
const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
    // req：请求对象
    // res：响应对象

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

// 监听端口
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// 完整示例
const server = http.createServer((req, res) => {
    // 获取请求方法和 URL
    const { method, url } = req;

    // 路由处理
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home Page</h1>');
    } else if (url === '/api' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello, API!' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});
```

### 请求对象

```javascript
// req：请求对象（IncomingMessage）
const server = http.createServer((req, res) => {
    // 请求方法
    console.log(req.method);  // GET, POST, PUT, DELETE 等

    // 请求 URL
    console.log(req.url);  // /path?query=value

    // HTTP 版本
    console.log(req.httpVersion);  // 1.1

    // 请求头
    console.log(req.headers);
    // {
    //   host: 'localhost:3000',
    //   'user-agent': 'Mozilla/5.0...',
    //   accept: '*/*'
    // }

    // 获取特定请求头
    console.log(req.headers['content-type']);
    console.log(req.headers['user-agent']);

    // 获取请求体
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        console.log(body);
        res.end('Request received');
    });
});
```

### 响应对象

```javascript
// res：响应对象（ServerResponse）
const server = http.createServer((req, res) => {
    // 设置状态码和响应头
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    });

    // 或单独设置
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');

    // 发送响应体
    res.write('Hello');
    res.write('World');
    res.end();

    // 或一次性发送
    res.end('Hello, World!');

    // 发送 JSON
    res.end(JSON.stringify({ message: 'Hello!' }));

    // 重定向
    res.writeHead(301, { 'Location': '/new-url' });
    res.end();
});
```

## 路由处理

### 基础路由

```javascript
// 简单路由
const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (url === '/' && method === 'GET') {
        res.end('Home Page');
    } else if (url === '/about' && method === 'GET') {
        res.end('About Page');
    } else if (url === '/api/data' && method === 'GET') {
        res.end(JSON.stringify({ data: 'Some data' }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
```

### 路由模块

```javascript
// 路由模块
// routes.js
function routes(req, res) {
    const { method, url } = req;

    // 路由表
    const routes = {
        'GET:/': () => 'Home Page',
        'GET:/about': () => 'About Page',
        'GET:/api/users': () => JSON.stringify([{ id: 1, name: 'Alice' }]),
    };

    const key = `${method}:${url}`;
    const handler = routes[key];

    if (handler) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(handler());
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
}

module.exports = routes;

// app.js
const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes);
server.listen(3000);
```

## 请求处理

### GET 请求

```javascript
// 处理 GET 请求
const server = http.createServer((req, res) => {
    if (req.url === '/api/users' && req.method === 'GET') {
        // 模拟数据
        const users = [
            { id: 1, name: 'Alice', age: 25 },
            { id: 2, name: 'Bob', age: 30 }
        ];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } else if (req.url.startsWith('/api/users/') && req.method === 'GET') {
        // 解析动态路径：/api/users/123
        const id = req.url.split('/')[3];
        const user = { id, name: `User ${id}`, age: 25 };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }
});
```

### POST 请求

```javascript
// 处理 POST 请求
const server = http.createServer((req, res) => {
    if (req.url === '/api/users' && req.method === 'POST') {
        let body = '';

        // 接收请求体
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // 解析 JSON
            const data = JSON.parse(body);

            // 创建新用户
            const newUser = {
                id: Date.now(),
                ...data
            };

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });
    }
});

// 测试
// fetch('http://localhost:3000/api/users', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name: 'Charlie', age: 35 })
// })
```

### 其他 HTTP 方法

```javascript
// PUT：更新资源
if (req.url.startsWith('/api/users/') && req.method === 'PUT') {
    const id = req.url.split('/')[3];
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const data = JSON.parse(body);
        const updatedUser = { id, ...data };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
    });
}

// DELETE：删除资源
if (req.url.startsWith('/api/users/') && req.method === 'DELETE') {
    const id = req.url.split('/')[3];

    res.writeHead(204);  // No Content
    res.end();
}
```

## 查询参数

### 解析查询参数

```javascript
// 解析查询参数
// URL: /api/search?q=nodejs&page=1

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // 获取查询参数
    const query = url.searchParams;
    const q = query.get('q');      // 'nodejs'
    const page = query.get('page'); // '1'

    // 获取所有参数
    const params = Object.fromEntries(query.entries());
    // { q: 'nodejs', page: '1' }

    res.end(JSON.stringify(params));
});

// 或手动解析
function parseQuery(url) {
    const queryString = url.split('?')[1];
    if (!queryString) return {};

    const params = {};
    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return params;
}

const params = parseQuery(req.url);
```

## Express.js

### 基础使用

```javascript
// Express.js：Node.js Web 框架
// npm install express

const express = require('express');
const app = express();

// 中间件：解析 JSON 请求体
app.use(express.json());

// 中间件：解析 URL 编码请求体
app.use(express.urlencoded({ extended: true }));

// 路由：GET
app.get('/', (req, res) => {
    res.send('Home Page');
});

// 路由：带参数
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    res.send(`User ${id}`);
});

// 路由：POST
app.post('/users', (req, res) => {
    const user = req.body;
    res.json(user);
});

// 监听端口
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### 路由器

```javascript
// 路由器：模块化路由
const express = require('express');
const router = express.Router();

// 用户路由
router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'Alice' }]);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ id, name: `User ${id}` });
});

router.post('/', (req, res) => {
    const user = req.body;
    res.status(201).json(user);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ id, ...req.body });
});

router.delete('/:id', (req, res) => {
    res.status(204).send();
});

module.exports = router;

// app.js
const express = require('express');
const userRouter = require('./routes/users');

const app = express();
app.use(express.json());

// 挂载路由
app.use('/api/users', userRouter);

app.listen(3000);
```

### 中间件

```javascript
// 中间件：处理请求的函数
const express = require('express');
const app = express();

// 应用级中间件
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();  // 调用下一个中间件
});

// 路由级中间件
app.get('/protected', (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).send('Unauthorized');
    }

    next();
}, (req, res) => {
    res.send('Protected data');
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 内置中间件
app.use(express.static('public'));  // 静态文件
app.use(express.json());           // 解析 JSON
app.use(express.urlencoded({ extended: true }));  // 解析表单
```

## HTTPS 服务器

### 创建 HTTPS 服务器

```javascript
// HTTPS：安全的 HTTP
const https = require('https');
const fs = require('fs');

// 加载证书和私钥
const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem')
};

// 创建 HTTPS 服务器
const server = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Secure connection!');
});

server.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// 或使用 Express
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Secure connection!');
});

const server = https.createServer(options, app);
server.listen(443);
```

## HTTP 客户端

### 发起请求

```javascript
// http.request：发起 HTTP 请求
const http = require('http');

const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/posts/1',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log(body);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();

// POST 请求
const postData = JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1
});

const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/posts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log(body);
    });
});

req.write(postData);
req.end();
```

### 使用第三方库

```javascript
// Axios：流行的 HTTP 客户端
// npm install axios

const axios = require('axios');

// GET 请求
axios.get('https://api.example.com/data')
    .then(response => console.log(response.data))
    .catch(error => console.error(error));

// POST 请求
axios.post('https://api.example.com/users', {
    name: 'Alice',
    age: 25
})
.then(response => console.log(response.data))
.catch(error => console.error(error));

// async/await
async function fetchData() {
    try {
        const response = await axios.get('https://api.example.com/data');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// node-fetch：浏览器 fetch API 的 Node.js 实现
// npm install node-fetch

const fetch = require('node-fetch');

async function fetchData() {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
}
```

## HTTP 最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用 Express.js 简化开发
const express = require('express');
const app = express();

// 2. 使用中间件处理请求
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. 模块化路由
const userRouter = require('./routes/users');
app.use('/api/users', userRouter);

// 4. 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 5. 使用 HTTPS
const https = require('https');
const server = https.createServer(options, app);

// 6. 设置安全头
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ❌ 不推荐做法

// 1. 直接使用 http 模块构建复杂应用
// 使用 Express.js 等 Web 框架

// 2. 忘记错误处理
req.on('error', (e) => {
    console.error(e);
});

// 3. 忽略请求体大小限制
// 可能导致内存溢出

// 4. 未设置安全头
// 容易受到攻击

// 5. 硬编码配置
const port = 3000;
// 使用环境变量
```

::: tip HTTP 模块检查清单

- [ ] 掌握 http 模块 API
- [ ] 理解请求响应流程
- [ ] 使用 Express.js 框架
- [ ] 模块化路由
- [ ] 正确处理错误
- [ ] 设置安全头

:::

::: tip 下一步

学习模块系统 → [模块系统](./modules.md)
:::
