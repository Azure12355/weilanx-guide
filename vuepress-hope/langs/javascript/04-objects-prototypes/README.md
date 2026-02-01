---
title: 对象与原型
icon: ri:git-branch-line
order: 5
---

# 对象与原型

JavaScript 是基于原型的语言，理解原型链是掌握继承的关键。

## 学习内容

- [对象进阶](./object-advanced.md) - 对象创建模式、属性描述符
- [原型链](./prototypes.md) - prototype、__proto__、原型继承
- [继承](./inheritance.md) - 原型链继承、构造函数继承
- [类与面向对象](./class-oop.md) - ES6 class 语法、OOP 实现

## 原型链示意

```mermaid
graph TD
    A[实例对象] -->|__proto__| B[构造函数.prototype]
    B -->|__proto__| C[父构造函数.prototype]
    C -->|__proto__| D[Object.prototype]
    D -->|__proto__| E[null]

    A -.->|constructor| B
```
