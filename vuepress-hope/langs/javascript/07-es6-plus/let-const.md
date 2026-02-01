---
title: let 与 const
icon: ri:variable-line
order: 1
---

# let 与 const

ES2015（ES6）引入了 `let` 和 `const`，解决了 `var` 的许多问题，是现代 JavaScript 开发的标准。

## var 的问题

### 变量提升

```javascript
// ⚠️ var：变量提升
console.log(name);  // undefined（不会报错）
var name = 'Alice';

// 等价于
var name;
console.log(name);
name = 'Alice';

// 导致的问题
if (false) {
    var x = 10;
}
console.log(x);  // undefined（而不是报错）
```

### 函数作用域

```javascript
// ⚠️ var：只有函数作用域，没有块级作用域
function test() {
    if (true) {
        var x = 10;
    }
    console.log(x);  // 10（可以访问）
}

for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出：3, 3, 3（而不是 0, 1, 2）
```

### 重复声明

```javascript
// ⚠️ var：可以重复声明
var x = 10;
var x = 20;  // 不会报错

console.log(x);  // 20

// 可能导致意外的覆盖
var count = 0;
// ... 很多代码
var count = 100;  // 覆盖了之前的值
```

## let

### 基本语法

```javascript
// let：块级作用域变量
let name = 'Alice';
let age = 25;
let isActive = true;

// ✅ 不允许重复声明
let x = 10;
// let x = 20;  // SyntaxError

// ✅ 块级作用域
if (true) {
    let y = 20;
    console.log(y);  // 20
}
// console.log(y);  // ReferenceError

// ✅ 解决循环问题
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出：0, 1, 2
```

### 暂时性死区（TDZ）

```javascript
// TDZ：从块开始到 let 声明之间的区域
// console.log(x);  // ReferenceError（TDZ）
let x = 10;

// 示例
{
    // TDZ 开始
    // console.log(tmp);  // ReferenceError

    let tmp = 'hello';  // TDZ 结束

    console.log(tmp);  // 'hello'
}

// typeof 也会受 TDZ 影响
// console.log(typeof x);  // ReferenceError
let x;
```

### let 的使用场景

```javascript
// 1. 循环计数器
for (let i = 0; i < 10; i++) {
    console.log(i);
}

// 2. 块级变量
if (condition) {
    let result = calculate();
    console.log(result);
}

// 3. 重新赋值的变量
let counter = 0;
counter++;
counter = counter + 1;

// 4. 条件变量
let value;
if (condition) {
    value = 'A';
} else {
    value = 'B';
}
```

## const

### 基本语法

```javascript
// const：块级作用域常量
const PI = 3.14159;
const API_URL = 'https://api.example.com';

// ✅ 必须初始化
// const x;  // SyntaxError（缺少初始化）

// ✅ 不允许重新赋值
const name = 'Alice';
// name = 'Bob';  // TypeError

// ✅ 不允许重复声明
const x = 10;
// const x = 20;  // SyntaxError
```

### const 与对象

```javascript
// ⚠️ const 对于对象和数组是引用保持
const person = { name: 'Alice', age: 25 };

// 可以修改属性
person.name = 'Bob';
person.age = 30;

console.log(person);  // { name: 'Bob', age: 30 }

// ❌ 不能重新赋值
// person = {};  // TypeError

// 数组同理
const items = [1, 2, 3];

// 可以修改数组
items.push(4);
items[0] = 10;

console.log(items);  // [10, 2, 3, 4]

// ❌ 不能重新赋值
// items = [];  // TypeError

// 如何真正冻结对象
const frozen = Object.freeze({ name: 'Alice' });
// frozen.name = 'Bob';  // 严格模式下报错
```

### const 的使用场景

```javascript
// 1. 配置常量
const CONFIG = {
    API_URL: 'https://api.example.com',
    TIMEOUT: 5000,
    RETRY_COUNT: 3
};

// 2. 导入的模块
const React = require('react');
const { Component } = React;

// 3. 不变的引用
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 4. 回调函数
const handleClick = (e) => {
    console.log('Clicked', e.target);
};
button.addEventListener('click', handleClick);

// 5. 不会重新赋值的变量
const MAX_SIZE = 100;
const DEFAULT_PAGE = 1;
```

## let vs const

### 优先使用 const

```javascript
// ✅ 推荐做法：优先使用 const
const name = 'Alice';  // 不需要重新赋值

const users = [];      // 虽然会修改数组，但引用不变
users.push('Alice');

// ❌ 避免不必要的 let
let count = 0;
count = count + 1;     // 可以用 const

// ✅ 正确做法
const count2 = 0;
const newCount = count2 + 1;
```

### 何时使用 let

```javascript
// 使用 let 的场景

// 1. 循环计数器
for (let i = 0; i < 10; i++) {
    console.log(i);
}

// 2. 累加器
let sum = 0;
for (const num of numbers) {
    sum += num;
}

// 3. 条件赋值
let result;
if (condition) {
    result = 'A';
} else {
    result = 'B';
}

// 4. 状态变量
let isLoading = true;
fetchData().then(() => {
    isLoading = false;
});
```

## 变量声明最佳实践

```javascript
// ✅ 推荐做法

// 1. 默认使用 const
const config = { debug: true };
const elements = document.querySelectorAll('.item');

// 2. 需要重新赋值时使用 let
let count = 0;
count++;

// 3. 在块级作用域中使用
{
    const temp = getTemporaryValue();
    console.log(temp);
}

// 4. 变量声明在使用位置附近
function process(items) {
    const filtered = items.filter(x => x > 0);
    const mapped = filtered.map(x => x * 2);
    return mapped.reduce((a, b) => a + b, 0);
}

// ❌ 不推荐做法

// 1. 滥用 var
var x = 10;

// 2. 不必要的 let
let name = 'Alice';  // 应该用 const

// 3. 声明与使用相隔太远
const config = { /* ... */ };
// ... 很多代码
const result = process(config);

// 4. 在块外声明
let temp;
if (condition) {
    temp = calculate();
}
```

## 作用域对比

```javascript
// var：函数作用域
function testVar() {
    if (true) {
        var x = 10;
    }
    console.log(x);  // 10
}

// let/const：块级作用域
function testLet() {
    if (true) {
        let y = 20;
        console.log(y);  // 20
    }
    // console.log(y);  // ReferenceError
}

// 循环中的作用域
// 使用 var
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出：3, 3, 3

// 使用 let
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 100);
}
// 输出：0, 1, 2

// 全局作用域
var globalVar = 'var';
let globalLet = 'let';
const globalConst = 'const';

// 在浏览器中
console.log(window.globalVar);   // 'var'
console.log(window.globalLet);   // undefined
console.log(window.globalConst); // undefined
```

## 临时性死区详解

```javascript
// TDZ 的各种情况

// 情况 1：变量声明前访问
// console.log(x);  // ReferenceError
let x;

// 情况 2：函数默认参数
// const x = 1;
// function foo(x = y) {  // ReferenceError
//     let y = 2;
// }

// 情况 3：typeof 也不行
// console.log(typeof x);  // ReferenceError
let x;

// 情况 4：跨 TDZ 不行
function foo() {
    // console.log(x);  // ReferenceError
}

let x;
foo();  // OK

// 情况 5：TDZ 在不同块
{
    // console.log(x);  // ReferenceError
    let x = 1;
}
{
    // console.log(x);  // ReferenceError
    let x = 2;
}
```

::: tip 变量声明检查清单

- [ ] 优先使用 const
- [ ] 需要重新赋值时使用 let
- [ ] 避免使用 var
- [ ] 理解块级作用域
- [ ] 理解暂时性死区（TDZ）
- [ ] 在使用位置附近声明变量

:::

::: tip 下一步

学习模板字符串 → [模板字符串](./template-literals.md)
:::
