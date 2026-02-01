---
title: 函数增强
icon: ri:function-line
order: 6
---

# 函数增强

ES6 为函数引入了许多新特性，包括默认参数、剩余参数、箭头函数等。

## 默认参数

### 基本语法

```javascript
// 默认参数：为函数参数设置默认值
function greet(name = 'Guest') {
    console.log(`Hello, ${name}`);
}

greet();          // 'Hello, Guest'
greet('Alice');   // 'Hello, Alice'

// 多个默认参数
function createUser(name = 'Guest', age = 0, isActive = true) {
    return { name, age, isActive };
}

console.log(createUser());                    // { name: 'Guest', age: 0, isActive: true }
console.log(createUser('Alice'));              // { name: 'Alice', age: 0, isActive: true }
console.log(createUser('Bob', 25));           // { name: 'Bob', age: 25, isActive: true }
console.log(createUser('Charlie', 30, false)); // { name: 'Charlie', age: 30, isActive: false }
```

### 表达式作为默认值

```javascript
// 使用表达式作为默认值
const getDefaultAge = () => 18;

function createPerson(name, age = getDefaultAge()) {
    return { name, age };
}

console.log(createPerson('Alice'));  // { name: 'Alice', age: 18 }

// 前面的参数可以作为后面参数的默认值
function createTeam(leader, members = [leader]) {
    return { leader, members };
}

console.log(createTeam('Alice'));
// { leader: 'Alice', members: ['Alice'] }

console.log(createTeam('Bob', ['Charlie', 'Dave']));
// { leader: 'Bob', members: ['Charlie', 'Dave'] }
```

### 解构与默认参数

```javascript
// 解构与默认参数结合
function init(config = {}) {
    const {
        debug = false,
        timeout = 5000,
        retries = 3
    } = config;

    console.log('Debug:', debug);
    console.log('Timeout:', timeout);
    console.log('Retries:', retries);
}

init();  // 使用所有默认值
init({ debug: true });  // 只覆盖 debug
init({ timeout: 3000, retries: 5 });  // 覆盖 timeout 和 retries

// 解构直接在参数中使用
function greet({ name = 'Guest', age = 0 } = {}) {
    console.log(`Name: ${name}, Age: ${age}`);
}

greet();  // 'Name: Guest, Age: 0'
greet({ name: 'Alice' });  // 'Name: Alice, Age: 0'
greet({ name: 'Bob', age: 25 });  // 'Name: Bob, Age: 25'
```

## 剩余参数

### 基本语法

```javascript
// 剩余参数：将多个参数收集为数组
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5));  // 15

// 与普通参数结合
function log(level, ...messages) {
    console.log(`[${level}]`, ...messages);
}

log('info', 'User logged in', 'ID:', 123);
// '[info]' 'User logged in' 'ID:' 123

// 箭头函数
const multiply = (...numbers) =>
    numbers.reduce((product, n) => product * n, 1);

console.log(multiply(2, 3, 4));  // 24
```

### 剩余参数与 arguments

```javascript
// 剩余参数 vs arguments
function oldWay() {
    console.log(arguments);  // Arguments 对象（类数组）
    console.log(Array.from(arguments));  // 转换为数组
}

function newWay(...args) {
    console.log(args);  // 真正的数组
    console.log(args.map(x => x * 2));  // 可以直接使用数组方法
}

oldWay(1, 2, 3);
newWay(1, 2, 3);

// 剩余参数的优势
// 1. 真正的数组，可以直接使用数组方法
// 2. 语义更清晰
// 3. 箭头函数也可以使用
```

## 箭头函数

### 基本语法

```javascript
// 箭头函数：更简洁的函数语法
// 基本语法
const add = (a, b) => a + b;
console.log(add(1, 2));  // 3

// 多个语句需要花括号和 return
const greet = (name) => {
    const message = `Hello, ${name}`;
    console.log(message);
    return message;
};

// 单个参数可以省略括号
const double = x => x * 2;
console.log(double(5));  // 10

// 无参数需要括号
const getRandom = () => Math.random();
console.log(getRandom());

// 返回对象字面量需要括号
const createUser = (name) => ({ name, id: Date.now() });
console.log(createUser('Alice'));  // { name: 'Alice', id: ... }
```

### this 绑定

```javascript
// 箭头函数不绑定自己的 this
const person = {
    name: 'Alice',
    // 普通函数：this 指向调用者
    greet1: function() {
        console.log(this.name);  // 'Alice'
        setTimeout(function() {
            console.log(this.name);  // undefined（this 指向全局）
        }, 100);
    },
    // 箭头函数：this 继承外层
    greet2: function() {
        console.log(this.name);  // 'Alice'
        setTimeout(() => {
            console.log(this.name);  // 'Alice'（继承自外层）
        }, 100);
    }
};

person.greet1();
person.greet2();

// 实际应用：DOM 事件处理
const button = document.querySelector('button');

// ❌ 普通：this 不是 button
button.addEventListener('click', function() {
    console.log(this);  // button 元素
    setTimeout(function() {
        console.log(this);  // Window（不是 button）
    }, 100);
});

// ✅ 箭头：this 保持不变
button.addEventListener('click', function() {
    console.log(this);  // button 元素
    setTimeout(() => {
        console.log(this);  // button 元素
    }, 100);
});
```

### 不能作为构造函数

```javascript
// 箭头函数不能使用 new
const Person = (name) => {
    this.name = name;
};

// const alice = new Person('Alice');  // TypeError: Person is not a constructor

// 箭头函数没有 prototype
console.log(Person.prototype);  // undefined

// 实际应用：不适合作为方法/构造函数
// ✅ 使用 class 或普通函数
class Person {
    constructor(name) {
        this.name = name;
    }
}
```

### 没有 arguments 对象

```javascript
// 箭头函数没有 arguments 对象
function oldFunc() {
    console.log(arguments);  // Arguments 对象
}

const newFunc = () => {
    // console.log(arguments);  // ReferenceError
    console.log(...args);  // 使用剩余参数
};

// 使用剩余参数代替
const withRest = (...args) => {
    console.log(args);  // 数组
};
```

## 尾调用优化

### 什么是尾调用

```javascript
// 尾调用：函数的最后一步是调用另一个函数
// 尾调用优化：不需要保留外层函数的调用栈

// 尾调用示例
function factorial(n, acc = 1) {
    if (n === 0) return acc;
    return factorial(n - 1, n * acc);  // 尾调用
}

console.log(factorial(5));  // 120

// 非尾调用
function factorialBad(n) {
    if (n === 0) return 1;
    return n * factorialBad(n - 1);  // 非尾调用（还需要乘以 n）
}
```

### 尾调用优化的条件

```javascript
// 尾调用优化的条件：
// 1. 严格模式
// 2. 尾调用是函数的最后一步
// 3. 尾调用的函数与当前函数不同

'use strict';

// ✅ 尾调用优化
function optimized() {
    return otherFunction();
}

// ❌ 不优化：调用后还有操作
function notOptimized1() {
    return otherFunction() + 1;
}

// ❌ 不优化：调用后赋值
function notOptimized2() {
    const result = otherFunction();
    return result;
}

// ❌ 不优化：闭包
function notOptimized3() {
    otherFunction();
    return function() {};
}
```

## 函数属性

### name 属性

```javascript
// 函数的 name 属性
function add(a, b) {
    return a + b;
}

console.log(add.name);  // 'add'

// 匿名函数
const multiply = function(a, b) {
    return a + b;
};

console.log(multiply.name);  // 'multiply'

// 箭头函数
const subtract = (a, b) => a - b;
console.log(subtract.name);  // 'subtract'

// bind 后的函数
function greet() {
    console.log(this.name);
}

const boundGreet = greet.bind({ name: 'Alice' });
console.log(boundGreet.name);  // 'bound greet'
```

### length 属性

```javascript
// 函数的 length 属性：期望的参数个数
function fn1(a, b, c) {}
console.log(fn1.length);  // 3

function fn2(a, b = 2, c = 3) {}
console.log(fn2.length);  // 1（默认参数不计入）

function fn3(a, b, ...rest) {}
console.log(fn3.length);  // 2（剩余参数不计入）
```

## 函数增强最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用默认参数提供默认值
function greet(name = 'Guest') {
    console.log(`Hello, ${name}`);
}

// 2. 使用剩余参数处理可变参数
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

// 3. 使用箭头函数简化回调
items.map(item => item * 2);

// 4. 在回调中使用箭头函数保持 this
setTimeout(() => {
    console.log(this.name);
}, 100);

// 5. 使用尾递归优化递归
function factorial(n, acc = 1) {
    if (n === 0) return acc;
    return factorial(n - 1, n * acc);
}

// 6. 解构参数提供清晰 API
function init({ debug = false, timeout = 5000 } = {}) {
    // ...
}

// ❌ 不推荐做法

// 1. 修改 arguments 对象
function bad() {
    arguments[0] = 10;  // 不要修改
}

// 2. 使用 eval（安全风险）
// const result = eval(code);

// 3. 使用 Function 构造函数（安全风险）
// const fn = new Function('a', 'b', 'return a + b');

// 4. 过度嵌套箭头函数
const bad = x => y => z => z * y * x;
```

::: tip 函数增强检查清单

- [ ] 使用默认参数提供默认值
- [ ] 使用剩余参数处理可变参数
- [ ] 理解箭头函数的 this 绑定
- [ ] 箭头函数不能作为构造函数
- [ ] 理解尾调用优化
- [ ] 使用解构参数提供清晰 API

:::

::: tip 下一步

学习 ES 模块 → [ES 模块](./modules.md)
:::
