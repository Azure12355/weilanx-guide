---
title: ES2023+
icon: ri-flashlight-fill-line
order: 8
---

# ES2023+

ES2023 及之后的版本持续引入新特性，让 JavaScript 更加强大和易用。

## ES2023 新特性

### 数组新方法

```javascript
// Array.prototype.toReversed()：返回反转的新数组
const arr = [1, 2, 3, 4, 5];
const reversed = arr.toReversed();

console.log(reversed);  // [5, 4, 3, 2, 1]
console.log(arr);      // [1, 2, 3, 4, 5]（原数组不变）

// 对比 reverse()：会修改原数组
const arr2 = [1, 2, 3];
arr2.reverse();
console.log(arr2);  // [3, 2, 1]
```

```javascript
// Array.prototype.toSorted()：返回排序的新数组
const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 20 },
    { name: 'Charlie', age: 30 }
];

const sorted = users.toSorted((a, b) => a.age - b.age);

console.log(sorted);
// [
//     { name: 'Bob', age: 20 },
//     { name: 'Alice', age: 25 },
//     { name: 'Charlie', age: 30 }
// ]

console.log(users);  // 原数组不变
```

```javascript
// Array.prototype.toSpliced()：返回删除/插入后的新数组
const arr = [1, 2, 3, 4, 5];

// 删除元素
const spliced1 = arr.toSpliced(1, 2);  // 从索引 1 开始删除 2 个
console.log(spliced1);  // [1, 4, 5]
console.log(arr);        // [1, 2, 3, 4, 5]

// 插入元素
const spliced2 = arr.toSpliced(2, 0, 'a', 'b');
console.log(spliced2);  // [1, 2, 'a', 'b', 3, 4, 5]

// 替换元素
const spliced3 = arr.toSpliced(1, 2, 'x', 'y');
console.log(spliced3);  // [1, 'x', 'y', 4, 5]
```

```javascript
// Array.prototype.with()：返回指定索引修改后的新数组
const arr = [1, 2, 3, 4, 5];

const updated = arr.with(2, 100);
console.log(updated);  // [1, 2, 100, 4, 5]
console.log(arr);     // [1, 2, 3, 4, 5]（原数组不变）

// 链式调用
const result = arr
    .with(0, 10)
    .with(4, 50)
    .toReversed();
console.log(result);  // [50, 4, 3, 2, 10]
```

### Hashbang 语法

```javascript
// 她哈希 #! 用于指定 JavaScript 解释器
#!/usr/bin/env node

// index.js
#!/usr/bin/env node
console.log('Hello from Node.js');

// 现在可以直接运行
// chmod +x index.js
// ./index.js
```

### Symbol 作为 WeakMap 键

```javascript
// ES2023 允许 Symbol 作为 WeakMap 键
const sym = Symbol('description');
const weakMap = new WeakMap();

const obj = {};
weakMap.set(sym, 'value');
weakMap.set(obj, 'object value');

console.log(weakMap.get(sym));  // 'value'
console.log(weakMap.get(obj));  // 'object value'

// 注意：必须是已注册的 Symbol
const registeredSym = Symbol.for('registered');
weakMap.set(registeredSym, 'registered value');
```

### 尾随逗号

```javascript
// ES2023 正式支持函数参数和调用的尾随逗号
function sum(a, b, c,) {
    return a + b + c;
}

console.log(sum(1, 2, 3));  // 6

// 对象和数组已经支持
const obj = {
    a: 1,
    b: 2,
    c: 3,
};

const arr = [
    1,
    2,
    3,
];
```

## ES2024 新特性

### Object.groupBy()

```javascript
// 按条件分组对象
const people = [
    { name: 'Alice', age: 25, role: 'admin' },
    { name: 'Bob', age: 20, role: 'user' },
    { name: 'Charlie', age: 30, role: 'admin' },
    { name: 'David', age: 22, role: 'user' }
];

// 按角色分组
const groupedByRole = Object.groupBy(people, ({ role }) => role);
console.log(groupedByRole);
// {
//     admin: [
//         { name: 'Alice', age: 25, role: 'admin' },
//         { name: 'Charlie', age: 30, role: 'admin' }
//     ],
//     user: [
//         { name: 'Bob', age: 20, role: 'user' },
//         { name: 'David', age: 22, role: 'user' }
//     ]
// }

// 按年龄段分组
const groupedByAge = Object.groupBy(people, ({ age }) => {
    if (age < 25) return 'young';
    if (age < 30) return 'middle';
    return 'senior';
});
```

### Map.groupBy()

```javascript
// 与 Object.groupBy 类似，但返回 Map
const people = [
    { name: 'Alice', age: 25, city: 'Beijing' },
    { name: 'Bob', age: 20, city: 'Shanghai' },
    { name: 'Charlie', age: 30, city: 'Beijing' },
    { name: 'David', age: 22, city: 'Shanghai' }
];

const groupedByCity = Map.groupBy(people, ({ city }) => city);
console.log(groupedByCity.get('Beijing'));
// [
//     { name: 'Alice', age: 25, city: 'Beijing' },
//     { name: 'Charlie', age: 30, city: 'Beijing' }
// ]

// Map 保持插入顺序
groupedByCity.forEach((value, key) => {
    console.log(`${key}:`, value);
});
```

### Promise.withResolvers()

```javascript
// 创建 Promise 及其 resolve/reject 函数
const { promise, resolve, reject } = Promise.withResolvers();

// 使用
setTimeout(() => {
    resolve('成功！');
}, 1000);

promise.then(console.log);  // '成功！'

// 对比传统方式
let resolve1, reject1;
const promise1 = new Promise((res, rej) => {
    resolve1 = res;
    reject1 = rej;
});

// 优势：
// 1. 不需要在构造函数中包装逻辑
// 2. resolve 和 reject 可以在任意位置调用
// 3. 更简洁的代码
```

### String.prototype.wellFormed()

```javascript
// 检查字符串是否格式良好的 UTF-16
const str = 'Hello';  // 格式良好
const illFormed = 'Hello\uD800';  // 不匹配的代理对

console.log(str.wellFormed());  // true
console.log(illFormed.wellFormed());  // false

// 应用：验证文本编码
function validateUTF16(str) {
    if (!str.wellFormed()) {
        throw new Error('字符串不是有效的 UTF-16');
    }
    return str;
}

try {
    validateUTF16('Hello');
    validateUTF16('Hello\uD800');  // 抛出错误
} catch (error) {
    console.error(error.message);
}
```

### Atomics.waitAsync()

```javascript
// 异步等待（非阻塞）
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

async function waitForUpdate() {
    try {
        // 等待值变化
        const result = await Atomics.waitAsync(int32, 0, 0, 1000);
        console.log('等待结果:', result);

        if (result.async) {
            if (result.value === 'ok') {
                console.log('条件已满足');
            } else if (result.value === 'not-equal') {
                console.log('值不匹配');
            } else if (result.value === 'timed-out') {
                console.log('超时');
            }
        }
    } catch (error) {
        console.error('等待出错:', error);
    }
}

// 在 Worker 中使用
// Atomics.notify(int32, 0);  // 唤醒等待
```

## 即将到来的特性

### Temporal API

```javascript
// 更好的日期时间处理（Stage 3）
import { Temporal } from 'proposal-temporal';

// 当前时间
const now = Temporal.Now.plainDateTimeISO();
console.log(now.toString());  // '2024-01-15T10:30:00'

// 创建特定日期
const date = Temporal.PlainDate.from('2024-01-15');
console.log(date.year);   // 2024
console.log(date.month);  // 1
console.log(date.day);    // 15

// 日期运算
const nextWeek = date.add({ days: 7 });
console.log(nextWeek.toString());  // '2024-01-22'

// 时区处理
const zonedDateTime = Temporal.Now.zonedDateTimeISO('Asia/Shanghai');
console.log(zonedDateTime.toString());  // '2024-01-15T10:30:00+08:00[Asia/Shanghai]'
```

### Iterator Helpers

```javascript
// 迭代器辅助方法（Stage 3）
const numbers = [1, 2, 3, 4, 5][Symbol.iterator]();

// map
const mapped = numbers.map(x => x * 2);
console.log([...mapped]);  // [2, 4, 6, 8, 10]

// filter
const filtered = numbers.filter(x => x > 2);
console.log([...filtered]);  // [3, 4, 5]

// take
const taken = numbers.take(3);
console.log([...taken]);  // [1, 2, 3]

// drop
const dropped = numbers.drop(2);
console.log([...dropped]);  // [3, 4, 5]

// toArray
const array = numbers.toArray();
console.log(array);  // [1, 2, 3, 4, 5]
```

### Decorators

```javascript
// 装饰器（Stage 3）
class MyClass {
    @logged
    @readonly
    method(x) {
        return x * 2;
    }
}

// 装饰器定义
function logged(target, key, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`调用 ${key}(${args})`);
        const result = original.apply(this, args);
        console.log(`返回 ${result}`);
        return result;
    };
}

function readonly(target, key, descriptor) {
    descriptor.writable = false;
}

// 使用
const obj = new MyClass();
obj.method(5);  // 调用 method(5) / 返回 10
```

## 使用策略

### 特性检测

```javascript
// 检查是否支持某个特性
function supportsArrayToSorted() {
    return typeof Array.prototype.toSorted === 'function';
}

function supportsTemporal() {
    return typeof Temporal !== 'undefined';
}

// 条件使用
function sortArray(arr) {
    if (supportsArrayToSorted()) {
        return arr.toSorted();
    }
    return [...arr].sort();
}
```

### Polyfill

```javascript
// 使用 core-js 添加 polyfill
import 'core-js/actual/array/to-sorted';
import 'core-js/actual/promise/with-resolvers';

// 现在可以使用新特性
const arr = [3, 1, 2];
const sorted = arr.toSorted();  // 即使在旧浏览器中也能工作
```

### Babel 配置

```javascript
// babel.config.js
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 2 versions', 'not dead']
            },
            corejs: 3,
            useBuiltIns: 'usage'
        }]
    ];
};
```

## 最佳实践

::: tip ES2023+ 使用建议

1. **使用新方法** - 优先使用不可变方法（toSorted、toReversed）
2. **特性检测** - 检查浏览器支持情况
3. **Polyfill** - 为旧浏览器提供支持
4. **渐进增强** - 在支持的环境中使用新特性
5. **关注 TC39** - 了解最新提案进展

:::

```javascript
// ✅ 推荐做法

// 1. 使用不可变方法
const arr = [3, 1, 2];
const sorted = arr.toSorted();  // 不修改原数组
const reversed = arr.toReversed();

// 2. 使用 Promise.withResolvers
const { promise, resolve, reject } = Promise.withResolvers();
fetchData().then(resolve).catch(reject);

// 3. 使用 Object.groupBy
const grouped = Object.groupBy(items, item => item.category);

// 4. 使用 wellFormed 验证
if (userInput.wellFormed()) {
    processString(userInput);
}
```

## 版本对照表

| 版本 | 年份 | 主要特性 |
|------|------|----------|
| ES2023 | 2023 | toSorted、toReversed、toSpliced、with、groupBy |
| ES2024 | 2024 | Object.groupBy、Promise.withResolvers、Atomics.waitAsync |
| Stage 3 | - | Temporal、Iterator Helpers、Decorators |
| Stage 2 | - | Pipelining operator、Pattern Matching |

::: v-pre

[Symbol](./symbols.md) → [模块化](./modules.md)

:::
