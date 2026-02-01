---
title: 数据类型与结构
icon: ri:layout-grid-line
order: 3
---

# 数据类型与结构

JavaScript 有 7 种原始类型和多种引用类型，理解它们是编写健壮代码的基础。

## 学习内容

- [原始类型](./primitives.md) - number、string、boolean、null、undefined、symbol、bigint
- [对象基础](./objects.md) - 对象创建、属性访问
- [数组](./arrays.md) - 数组方法、遍历、操作
- [字符串](./strings.md) - 字符串方法、模板字符串
- [类型转换](./types-conversion.md) - 显式与隐式转换

## 类型系统图

```mermaid
graph TD
    A[JavaScript 类型] --> B[原始类型]
    A --> C[引用类型]

    B --> B1[number]
    B --> B2[string]
    B --> B3[boolean]
    B --> B4[null]
    B --> B5[undefined]
    B --> B6[symbol]
    B --> B7[bigint]

    C --> C1[Object]
    C --> C2[Array]
    C --> C3[Function]
    C --> C4[Date]
    C --> C5[RegExp]
    C --> C6[Map/Set]
```
