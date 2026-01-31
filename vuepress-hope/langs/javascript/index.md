---
title: JavaScript
icon: logos:javascript
order: 3
---

# JavaScript

![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow?style=flat-square&logo=javascript)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## 概述

JavaScript 是一门动态的、弱类型的编程语言，最初由 Brendan Eich 于 1995 年在 Netscape 创建。它是 Web 开发的三驾马车（HTML、CSS、JS）之一，也是唯一能在浏览器中运行的编程语言。

## 核心特点

- **事件驱动**：异步编程模型，适合处理 I/O 密集型任务
- **函数式**：支持高阶函数、闭包、箭头函数
- **原型继承**：基于原型的面向对象编程
- **动态类型**：变量类型在运行时确定
- **单线程**：通过事件循环实现非阻塞 I/O

## 应用领域

| 领域 | 代表技术/框架 |
|------|--------------|
| 前端开发 | React, Vue, Angular, Svelte |
| 后端开发 | Node.js, Express, NestJS, Koa |
| 移动应用 | React Native, Ionic |
| 桌面应用 | Electron, Tauri |
| 小程序 | 微信小程序, uni-app |

## 学习路径

1. **JavaScript 基础** → 语法、DOM 操作、事件处理
2. **ES6+ 新特性** → 箭头函数、Promise、async/await
3. **前端框架** → Vue3 / React
4. **TypeScript** → 类型系统、泛型
5. **Node.js** → 后端开发、工程化工具

## Hello World

```javascript
// 传统写法
function greet(name) {
    return `Hello, ${name}!`;
}

// 箭头函数
const greet2 = (name) => `Hello, ${name}!`;

// 异步操作
async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
}
```

## 代码示例

```javascript
// 数组方法
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((a, b) => a + b, 0);

// 解构赋值
const { name, age } = user;
const [first, second] = array;

// Promise & async/await
const data = await fetchData()
    .then(res => res.json())
    .catch(err => console.error(err));
```

## TypeScript 推荐

现代 JavaScript 开发强烈推荐使用 TypeScript：

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

async function getUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
}
```

## 相关资源

- [MDN Web Docs](https://developer.mozilla.org/zh-CN/)
- [现代 JavaScript 教程](https://zh.javascript.info/)
- [TypeScript 官方文档](https://www.typescriptlang.org/zh/)

---

::: tip 学习建议
从 Vue3 开始学习是个不错的选择！本站正是基于 VuePress 构建的。
:::
