---
title: HTTP 服务器
icon: ri-server-line
order: 4
---

# HTTP 服务器

Node.js 内置 HTTP 模块可用于创建 Web 服务器。

## HTTP 模块基础

### 创建服务器

```javascript
// http 模块：创建 HTTP 服务器

const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
    // req：请求对象
    // res：响应对象

    // 设置响应头
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'X-Custom-Header': 'value'
    });

    // 发送响应
    res.end('Hello, World!');
});

// 监听端口
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// 访问 http://localhost:3000
// 响应：Hello, World!
```

### 请求对象

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // 请求方法
    console.log(req.method);  // GET, POST, PUT, DELETE

    // 请求 URL
    console.log(req.url);     // /path?query=value

    // HTTP 版本
    console.log(req.httpVersion);  // 1.1

    // 请求头
    console.log(req.headers);
    // {
    //   host: 'localhost:3000',
    //   'user-agent': 'Mozilla/5.0...',
    //   accept: '*/*',
    //   ...
    // }

    // 获取特定请求头
    console.log(req.headers['user-agent']);

    // 请求体（需要监听 data 事件）
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        console.log('Request body:', body);
        res.end('OK');
    });
});

server.listen(3000);
```

### 响应对象

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // 设置状态码
    res.statusCode = 200;
    // 或使用 res.writeHead(200)

    // 设置响应头
    res.setHeader('Content-Type', 'text/plain');
    // 或使用 res.writeHead(200, { 'Content-Type': 'text/plain' })

    // 设置多个响应头
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'value'
    });

    // 发送响应体
    res.write('Hello, ');
    res.write('World!');
    res.end();

    // 或一次性发送
    res.end('Hello, World!');

    // 发送 JSON
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello' }));

    // 重定向
    res.writeHead(302, { 'Location': '/new-location' });
    res.end();

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');

    // 500 Server Error
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
});

server.listen(3000);
```

## 路由处理

### 基本路由

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // 解析 URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 路由处理
    if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home Page</h1>');

    } else if (pathname === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Page</h1>');

    } else if (pathname === '/api/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: [1, 2, 3] }));

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(3000);
```

### 路由参数

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 匹配 /users/:id
    const userMatch = pathname.match(/^\/users\/(\d+)$/);
    if (userMatch) {
        const userId = userMatch[1];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ userId, name: `User ${userId}` }));
        return;
    }

    // 匹配 /posts/:postId/comments/:commentId
    const commentMatch = pathname.match(/^\/posts\/(\d+)\/comments\/(\d+)$/);
    if (commentMatch) {
        const [, postId, commentId] = commentMatch;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ postId, commentId }));
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(3000);
```

### 查询参数

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // 解析查询参数
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    console.log(query);
    // URL: /search?keyword=nodejs&page=1
    // query: { keyword: 'nodejs', page: '1' }

    // 访问查询参数
    const keyword = query.keyword || '';
    const page = parseInt(query.page) || 1;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        keyword,
        page,
        results: [`Result for "${keyword}" on page ${page}`]
    }));
});

server.listen(3000);

// 访问：http://localhost:3000/search?keyword=nodejs&page=1
// 响应：{ "keyword": "nodejs", "page": 1, "results": ["Result for "nodejs" on page 1"] }
```

## HTTP 方法

### GET 请求

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const { method } = req;
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // GET 请求
    if (method === 'GET' && pathname === '/api/users') {
        // 获取所有用户
        const users = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));

    } else if (method === 'GET' && pathname.match(/^\/api\/users\/\d+$/)) {
        // 获取单个用户
        const userId = pathname.split('/').pop();
        const user = { id: userId, name: `User ${userId}` };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }

    // 其他请求返回 405 Method Not Allowed
    else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

server.listen(3000);
```

### POST 请求

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const { method } = req;
    const pathname = url.parse(req.url).pathname;

    // POST 请求
    if (method === 'POST' && pathname === '/api/users') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // 解析 JSON 请求体
                const data = JSON.parse(body);

                // 创建用户
                const newUser = {
                    id: Date.now(),
                    name: data.name,
                    email: data.email
                };

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });

    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});

server.listen(3000);

// 测试
// curl -X POST http://localhost:3000/api/users \
//   -H "Content-Type: application/json" \
//   -d '{"name":"Alice","email":"alice@example.com"}'
```

### PUT 请求

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const { method } = req;
    const pathname = url.parse(req.url).pathname;

    // PUT 请求
    if (method === 'PUT' && pathname.match(/^\/api\/users\/\d+$/)) {
        const userId = pathname.split('/').pop();
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                // 更新用户
                const updatedUser = {
                    id: userId,
                    ...data
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedUser));

            } catch (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });

    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});

server.listen(3000);
```

### DELETE 请求

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const { method } = req;
    const pathname = url.parse(req.url).pathname;

    // DELETE 请求
    if (method === 'DELETE' && pathname.match(/^\/api\/users\/\d+$/)) {
        const userId = pathname.split('/').pop();

        // 删除用户
        res.writeHead(204);  // No Content
        res.end();

    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});

server.listen(3000);
```

## 静态文件服务

### 基本静态文件服务

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // 构建文件路径
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // 获取文件扩展名
    const extname = path.extname(filePath);

    // 内容类型映射
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = contentTypes[extname] || 'application/octet-stream';

    // 读取并返回文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(3000);
```

### 流式静态文件服务

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // 创建可读流
    const readStream = fs.createReadStream(filePath);

    // 错误处理
    readStream.on('error', (err) => {
        if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(500);
            res.end('Server Error');
        }
    });

    // 管道输出到响应
    readStream.pipe(res);
});

server.listen(3000);
```

## HTTPS 服务器

### 创建 HTTPS 服务器

```javascript
const https = require('https');
const fs = require('fs');

// SSL 证书
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// 创建 HTTPS 服务器
const server = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Hello, HTTPS!');
});

server.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// 生成自签名证书（开发环境）
// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

### HTTP 重定向到 HTTPS

```javascript
const http = require('http');
const https = require('https');

// HTTP 服务器（重定向到 HTTPS）
http.createServer((req, res) => {
    res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80);

// HTTPS 服务器
https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Hello, HTTPS!');
}).listen(443);
```

## 最佳实践

::: tip HTTP 服务器建议

1. **使用框架** - Express、Koa 等
2. **HTTPS** - 生产环境使用加密
3. **压缩** - 启用 gzip 压缩
4. **CORS** - 正确配置跨域
5. **安全头** - 设置安全响应头

:::

```javascript
// ✅ 推荐做法

// 1. 使用 Express 框架
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});

app.listen(3000);

// 2. 设置安全头
helmet(app);

// 3. 启用压缩
const compression = require('compression');
app.use(compression());

// 4. CORS
const cors = require('cors');
app.use(cors());

// 5. 错误处理
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});
```

::: v-pre

[HTTP](./http.md) → [模块](./modules.md)

:::
