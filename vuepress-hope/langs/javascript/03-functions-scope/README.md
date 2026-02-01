---
title: 函数与作用域
icon: ri:function-line
order: 4
---

# 函数与作用域

函数是 JavaScript 的一等公民，理解作用域和闭包是进阶的关键。

## 学习内容

- [函数基础](./function-basics.md) - 函数定义、参数、返回值
- [箭头函数](./arrow-functions.md) - 箭头函数语法与 this 绑定
- [闭包](./closures.md) - 闭包原理与应用场景
- [作用域](./scope.md) - 全局、函数、块级作用域
- [this 与上下文](./this-context.md) - this 指向、call/apply/bind

## 函数类型

```javascript
// 函数声明
function greet(name) {
    return `Hello, ${name}!`;
}

// 函数表达式
const greet = function(name) {
    return `Hello, ${name}!`;
};

// 箭头函数
const greet = (name) => `Hello, ${name}!`;

// IIFE (立即执行函数)
(function() {
    console.log('立即执行');
})();
```
