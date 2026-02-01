---
title: 解构赋值
icon: ri:braces-line
order: 3
---

# 解构赋值

解构赋值（Destructuring）是 ES6 提供的从数组或对象中提取值的简洁语法。

## 数组解构

### 基本语法

```javascript
// 基本数组解构
const [a, b, c] = [1, 2, 3];
console.log(a);  // 1
console.log(b);  // 2
console.log(c);  // 3

// 只提取需要的值
const [first, second] = [1, 2, 3, 4, 5];
console.log(first);   // 1
console.log(second);  // 2

// 使用默认值
const [x, y, z = 3] = [1, 2];
console.log(x);  // 1
console.log(y);  // 2
console.log(z);  // 3（默认值）
```

### 跳过元素

```javascript
// 跳过某些元素
const [first, , third] = [1, 2, 3];
console.log(first);  // 1
console.log(third);  // 3

// 跳过多个元素
const [a, , , d] = [1, 2, 3, 4];
console.log(a);  // 1
console.log(d);  // 4
```

### 剩余元素

```javascript
// 使用 ... 获取剩余元素
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(rest);   // [2, 3, 4, 5]

// 跳过前面的元素，获取后面的
const [ , , ...rest] = [1, 2, 3, 4, 5];
console.log(rest);  // [3, 4, 5]
```

### 交换变量

```javascript
// 交换变量
let x = 1;
let y = 2;

[x, y] = [y, x];
console.log(x);  // 2
console.log(y);  // 1

// 旧方式
let temp = x;
x = y;
y = temp;
```

### 嵌套数组

```javascript
// 嵌套数组解构
const [a, [b, c]] = [1, [2, 3]];
console.log(a);  // 1
console.log(b);  // 2
console.log(c);  // 3

// 更深的嵌套
const [first, [second, [third, fourth]]] = [1, [2, [3, 4]]];
console.log(first);   // 1
console.log(second);  // 2
console.log(third);   // 3
console.log(fourth);  // 4
```

## 对象解构

### 基本语法

```javascript
// 基本对象解构
const { name, age } = { name: 'Alice', age: 25 };
console.log(name);  // 'Alice'
console.log(age);   // 25

// 属性顺序不重要
const { age, name } = { name: 'Bob', age: 30 };
console.log(name);  // 'Bob'
console.log(age);   // 30

// 使用默认值
const { x = 1, y = 2 } = { x: 10 };
console.log(x);  // 10
console.log(y);  // 2（默认值）
```

### 重命名

```javascript
// 重命名属性
const { name: userName, age: userAge } = { name: 'Alice', age: 25 };
console.log(userName);  // 'Alice'
console.log(userAge);   // 25
// console.log(name);   // ReferenceError

// 使用默认值和重命名
const { name: userName = 'Guest' } = {};
console.log(userName);  // 'Guest'
```

### 嵌套对象

```javascript
// 嵌套对象解构
const user = {
    name: 'Alice',
    address: {
        city: 'New York',
        country: 'USA'
    }
};

const { address: { city, country } } = user;
console.log(city);     // 'New York'
console.log(country);  // 'USA'

// 同时获取多层属性
const { name, address: { city } } = user;
console.log(name);  // 'Alice'
console.log(city);  // 'New York'
```

### 剩余属性

```javascript
// 获取剩余属性
const { a, ...rest } = { a: 1, b: 2, c: 3 };
console.log(a);     // 1
console.log(rest);  // { b: 2, c: 3 }

// 实际应用
const user = { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' };
const { id, ...userInfo } = user;
console.log(id);        // 1
console.log(userInfo);  // { name: 'Alice', age: 25, email: 'alice@example.com' }
```

## 函数参数解构

### 数组参数

```javascript
// 数组参数解构
function sum([a, b]) {
    return a + b;
}

console.log(sum([1, 2]));  // 3

// 使用默认值
function greet([name = 'Guest', age = 0] = []) {
    console.log(`Name: ${name}, Age: ${age}`);
}

greet(['Alice', 25]);  // 'Name: Alice, Age: 25'
greet();              // 'Name: Guest, Age: 0'
```

### 对象参数

```javascript
// 对象参数解构
function createUser({ name, age }) {
    return { name, age };
}

const user = createUser({ name: 'Alice', age: 25 });
console.log(user);  // { name: 'Alice', age: 25 }

// 使用默认值
function register({ name = 'Guest', age = 0 } = {}) {
    console.log(`Name: ${name}, Age: ${age}`);
}

register({ name: 'Bob' });  // 'Name: Bob, Age: 0'
register();                 // 'Name: Guest, Age: 0'

// 重命名参数
function getUserInfo({ name: userName, age: userAge }) {
    console.log(userName, userAge);
}

getUserInfo({ name: 'Alice', age: 25 });  // 'Alice' 25
```

### 实际应用

```javascript
// 配置对象
function init(config) {
    const {
        debug = false,
        timeout = 5000,
        retries = 3
    } = config;

    console.log('Debug:', debug);
    console.log('Timeout:', timeout);
    console.log('Retries:', retries);
}

init({ debug: true, timeout: 3000 });

// API 响应处理
function handleResponse({ data, error, status }) {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data:', data);
    }
    console.log('Status:', status);
}

handleResponse({
    data: { id: 1, name: 'Alice' },
    status: 200
});
```

## 解构的应用

### 交换变量

```javascript
// 交换变量
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a);  // 2
console.log(b);  // 1

// 多个变量
let x = 1, y = 2, z = 3;
[x, y, z] = [z, x, y];
console.log(x);  // 3
console.log(y);  // 1
console.log(z);  // 2
```

### 函数返回多个值

```javascript
// 返回数组
function getPosition() {
    return [10, 20];
}

const [x, y] = getPosition();
console.log(x);  // 10
console.log(y);  // 20

// 返回对象
function getUser() {
    return {
        name: 'Alice',
        age: 25,
        email: 'alice@example.com'
    };
}

const { name, email } = getUser();
console.log(name);   // 'Alice'
console.log(email);  // 'alice@example.com'
```

### 处理 JSON

```javascript
// 解析 JSON
const json = '{"name":"Alice","age":25,"address":{"city":"NYC"}}';
const data = JSON.parse(json);

// 解构需要的属性
const { name, address: { city } } = data;
console.log(name);  // 'Alice'
console.log(city);  // 'NYC'

// 处理 API 响应
fetch('/api/user')
    .then(response => response.json())
    .then(({ id, name, email }) => {
        console.log('User:', id, name, email);
    });
```

### 忽略不需要的属性

```javascript
// 只获取需要的属性
const user = {
    id: 1,
    name: 'Alice',
    age: 25,
    password: 'secret',
    token: 'abc123'
};

// 只获取公开信息
const { name, age } = user;
console.log(name);  // 'Alice'
console.log(age);   // 25

// 排除敏感信息
const { password, token, ...publicInfo } = user;
console.log(publicInfo);  // { id: 1, name: 'Alice', age: 25 }
```

## 高级用法

### 动态属性名

```javascript
// 动态属性名解构
const key = 'name';
const { [key]: value } = { name: 'Alice', age: 25 };
console.log(value);  // 'Alice'

// 计算属性名
const prop = 'user';
const data = {
    user: { name: 'Alice' },
    posts: [{ title: 'Post 1' }]
};
const { [prop]: { name } } = data;
console.log(name);  // 'Alice'
```

### 字符串解构

```javascript
// 字符串可以像数组一样解构
const [a, b, c] = 'ABC';
console.log(a);  // 'A'
console.log(b);  // 'B'
console.log(c);  // 'C'

// 获取前几个字符
const [first, second] = 'Hello';
console.log(first);   // 'H'
console.log(second);  // 'e'

// 使用 ... 获取剩余字符
const [firstChar, ...restChars] = 'Hello';
console.log(firstChar);  // 'H'
console.log(restChars);  // ['e', 'l', 'l', 'o']
```

### Set 和 Map 解构

```javascript
// Set 解构
const set = new Set([1, 2, 3]);
const [first, second] = set;
console.log(first);   // 1
console.log(second);  // 2

// Map 解构
const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
const [[key1, value1], [key2, value2]] = map;
console.log(key1);   // 'key1'
console.log(value1); // 'value1'
```

## 解构最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用解构提取需要的属性
const { name, age } = user;

// 2. 使用重命名避免冲突
const { name: userName } = user;

// 3. 提供默认值
const { name = 'Guest' } = user;

// 4. 在函数参数中使用解构
function init({ debug = false, timeout = 5000 } = {}) {
    // ...
}

// 5. 使用剩余属性获取其他属性
const { id, ...rest } = item;

// 6. 交换变量使用解构
[x, y] = [y, x];

// ❌ 不推荐做法

// 1. 解构时使用嵌套过深
const { a: { b: { c: { d } } } } = obj;

// 2. 忘记默认值
const { name } = user;  // 可能 undefined

// 3. 混合使用多种解构
const { a, b: [c, d] } = complexObject;

// 4. 在循环中重复解构
for (const item of items) {
    const { id, name } = item;
    // ...
}

// ✅ 更好的做法
for (const { id, name } of items) {
    // ...
}
```

::: tip 解构赋值检查清单

- [ ] 理解数组解构和对象解构
- [ ] 使用默认值避免 undefined
- [ ] 使用重命名避免变量冲突
- [ ] 在函数参数中使用解构
- [ ] 使用剩余元素/属性
- [ ] 理解嵌套解构的用法

:::

::: tip 下一步

学习展开与剩余 → [展开与剩余](./spread-rest.md)
:::
