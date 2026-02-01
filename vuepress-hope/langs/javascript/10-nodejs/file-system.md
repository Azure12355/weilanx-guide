---
title: 文件系统
icon: ri:file-line
order: 2
---

# 文件系统

Node.js 提供了强大的文件系统（fs）模块，用于与文件系统进行交互。

## fs 模块基础

### 导入模块

```javascript
// 导入 fs 模块
const fs = require('fs');

// 导入 fs.promises（Promise API）
const fsPromises = require('fs').promises;

// 导入 path 模块（路径处理）
const path = require('path');

// 路径拼接
const filePath = path.join(__dirname, 'files', 'data.txt');
console.log(filePath);
// /Users/username/project/files/data.txt
```

### 同步 vs 异步

```javascript
// 同步方法（阻塞）
const fs = require('fs');

try {
    const data = fs.readFileSync('file.txt', 'utf8');
    console.log(data);
    // 等待读取完成后才执行后续代码
} catch (err) {
    console.error(err);
}

// 异步回调（非阻塞）
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});
// 不等待，继续执行后续代码

// Promise API
const fsPromises = require('fs').promises;

async function readFile() {
    try {
        const data = await fsPromises.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// 选择建议
// - 同步：脚本、配置文件
// - 异步：服务器、高并发场景
// - Promise：现代异步代码，推荐
```

## 文件操作

### 读取文件

```javascript
// readFile：读取完整文件
const fs = require('fs');

// 异步读取
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// 同步读取
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// Promise 读取
const fsPromises = require('fs').promises;

async function read() {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
}

// 读取为 Buffer（二进制数据）
fs.readFile('image.png', (err, data) => {
    if (err) throw err;
    console.log(data);  // <Buffer 89 50 4e 47 ...>
    console.log(data.toString('base64'));  // Base64 编码
});
```

### 写入文件

```javascript
// writeFile：写入文件（覆盖）
const fs = require('fs');

const content = 'Hello, World!';

// 异步写入
fs.writeFile('file.txt', content, 'utf8', (err) => {
    if (err) throw err;
    console.log('File saved!');
});

// 同步写入
fs.writeFileSync('file.txt', content, 'utf8');

// Promise 写入
await fsPromises.writeFile('file.txt', content, 'utf8');

// 追加内容
fs.appendFile('file.txt', '\nNew line', (err) => {
    if (err) throw err;
    console.log('Content appended!');
});

// 同步追加
fs.appendFileSync('file.txt', '\nNew line');

// 写入 JSON
const data = { name: 'Alice', age: 25 };
fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('JSON saved!');
});
```

### 文件信息

```javascript
// stat：获取文件信息
const fs = require('fs');

fs.stat('file.txt', (err, stats) => {
    if (err) throw err;

    console.log(stats.isFile());          // 是否为文件
    console.log(stats.isDirectory());     // 是否为目录
    console.log(stats.size);              // 文件大小（字节）
    console.log(stats.birthtime);         // 创建时间
    console.log(stats.mtime);             // 修改时间
    console.log(stats.atime);             // 访问时间
    console.log(stats.mode);              // 权限模式

    // 文件权限
    console.log(stats.mode.toString(8));  // 例如：644
});

// 同步版本
const stats = fs.statSync('file.txt');

// exists：检查文件是否存在（已废弃）
// 使用 stat 或 access 代替

// access：检查文件权限
fs.access('file.txt', fs.constants.R_OK, (err) => {
    if (err) {
        console.error('File not readable');
        return;
    }
    console.log('File is readable');
});

// 常用权限常量
fs.constants.F_OK  // 文件存在
fs.constants.R_OK  // 可读
fs.constants.W_OK  // 可写
fs.constants.X_OK  // 可执行
```

### 删除文件

```javascript
// unlink：删除文件
const fs = require('fs');

fs.unlink('file.txt', (err) => {
    if (err) throw err;
    console.log('File deleted!');
});

// 同步删除
fs.unlinkSync('file.txt');

// Promise 删除
await fsPromises.unlink('file.txt');

// 安全删除（先检查存在）
fs.access('file.txt', fs.constants.F_OK, (err) => {
    if (err) {
        console.log('File does not exist');
        return;
    }
    fs.unlink('file.txt', (err) => {
        if (err) throw err;
        console.log('File deleted!');
    });
});
```

## 目录操作

### 创建目录

```javascript
// mkdir：创建目录
const fs = require('fs');

// 创建单个目录
fs.mkdir('dir', (err) => {
    if (err) throw err;
    console.log('Directory created!');
});

// 递归创建目录
fs.mkdir('parent/child/grandchild', { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Directories created!');
});

// 同步创建
fs.mkdirSync('dir', { recursive: true });
```

### 读取目录

```javascript
// readdir：读取目录内容
const fs = require('fs');

fs.readdir('dir', (err, files) => {
    if (err) throw err;
    console.log(files);
    // ['file1.txt', 'file2.txt', 'subdir']
});

// 带详细信息
fs.readdir('dir', { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        console.log(file.name);
        console.log(file.isDirectory());  // 是否为目录
        console.log(file.isFile());       // 是否为文件
    });
});

// Promise 读取
const files = await fsPromises.readdir('dir');
```

### 删除目录

```javascript
// rmdir：删除空目录
const fs = require('fs');

fs.rmdir('empty-dir', (err) => {
    if (err) throw err;
    console.log('Directory removed!');
});

// 递归删除目录（Node.js 14.14.0+）
fs.rm('dir', { recursive: true, force: true }, (err) => {
    if (err) throw err;
    console.log('Directory removed!');
});

// 同步删除
fs.rmSync('dir', { recursive: true, force: true });
```

## 路径操作

### path 模块

```javascript
// path：路径处理模块
const path = require('path');

// 路径拼接
const fullPath = path.join('users', 'local', 'file.txt');
// users/local/file.txt

// 解析路径
const parsed = path.parse('/users/local/file.txt');
console.log(parsed);
// {
//   root: '/',
//   dir: '/users/local',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// 路径规范化
const normalized = path.normalize('/users/../local/./file.txt');
// /local/file.txt

// 获取目录名
const dir = path.dirname('/users/local/file.txt');
// /users/local

// 获取文件名
const base = path.basename('/users/local/file.txt');
// file.txt

// 获取扩展名
const ext = path.extname('/users/local/file.txt');
// .txt

// 绝对路径
const absolute = path.resolve('file.txt');
// /Users/username/project/file.txt

// 相对路径
const relative = path.relative('/users/local', '/users/file.txt');
// ../file.txt
```

### __dirname 和 __filename

```javascript
// __dirname：当前文件所在目录
console.log(__dirname);
// /Users/username/project/src

// __filename：当前文件的完整路径
console.log(__filename);
// /Users/username/project/src/app.js

// 使用场景
// 读取相对于当前脚本的文件
const filePath = path.join(__dirname, 'data', 'config.json');
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data));
});

// ES Modules 中没有 __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## 流（Streams）

### 基本概念

```javascript
// Stream：流式处理数据
// 优势：内存效率高、处理速度快

// 四种流类型
// 1. Readable：可读流（读取数据）
// 2. Writable：可写流（写入数据）
// 3. Duplex：双工流（可读可写）
// 4. Transform：转换流（修改数据）

// 创建可读流
const fs = require('fs');

const readStream = fs.createReadStream('file.txt', 'utf8');

readStream.on('data', (chunk) => {
    console.log('Received chunk:', chunk);
});

readStream.on('end', () => {
    console.log('Finished reading');
});

readStream.on('error', (err) => {
    console.error('Error:', err);
});

// 创建可写流
const writeStream = fs.createWriteStream('output.txt', 'utf8');

writeStream.write('Hello, ');
writeStream.write('World!');
writeStream.end();

writeStream.on('finish', () => {
    console.log('Finished writing');
});
```

### 管道（Pipe）

```javascript
// pipe：连接可读流和可写流
const fs = require('fs');

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

// 管道自动处理数据流
readStream.pipe(writeStream);

// 完整示例：文件复制
readStream.on('end', () => {
    console.log('File copied!');
});

// 链式管道
const zlib = require('zlib');

// 压缩文件
fs.createReadStream('input.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('input.txt.gz'));

// 解压文件
fs.createReadStream('input.txt.gz')
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream('output.txt'));
```

## 文件系统最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用异步 API
const data = await fsPromises.readFile('file.txt', 'utf8');

// 2. 错误处理
try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
} catch (err) {
    console.error('Error reading file:', err);
}

// 3. 使用 path.join 拼接路径
const filePath = path.join(__dirname, 'files', 'data.txt');

// 4. 使用流处理大文件
const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('output.txt');
readStream.pipe(writeStream);

// 5. 清理资源
const readStream = fs.createReadStream('file.txt');
readStream.on('end', () => {
    readStream.destroy();
});

// ❌ 不推荐做法

// 1. 使用同步 API 阻塞事件循环
const data = fs.readFileSync('file.txt');

// 2. 字符串拼接路径
const filePath = __dirname + '/files/data.txt';
// 不同系统分隔符不同

// 3. 忽略错误处理
fs.readFile('file.txt', (err, data) => {
    console.log(data);  // err 未处理
});

// 4. 一次性读取大文件
const data = fs.readFileSync('large-file.txt');
// 可能导致内存溢出

// 5. 硬编码路径
const filePath = '/Users/username/project/file.txt';
// 不具有可移植性
```

::: tip 文件系统检查清单

- [ ] 掌握 fs 模块 API
- [ ] 理解同步/异步区别
- [ ] 使用 path 模块处理路径
- [ ] 使用流处理大文件
- [ ] 正确处理错误
- [ ] 避免阻塞事件循环

:::

::: tip 下一步

学习 HTTP 模块 → [HTTP 模块](./http.md)
:::
