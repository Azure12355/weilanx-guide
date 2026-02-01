---
title: 模板字符串
icon: ri:double-quotes-l
order: 2
---

# 模板字符串

模板字符串（Template Literals）是 ES6 引入的字符串字面量，支持嵌入表达式、多行字符串等功能。

## 基本语法

### 反引号字符串

```javascript
// 使用反引号 `（backtick）创建字符串
const str1 = `Hello World`;
const str2 = `Hello
World`;  // 支持换行

// 等价于
const str3 = 'Hello World';
const str4 = 'Hello\nWorld';

// 在字符串中使用反引号
const str5 = `He said: "Hello"`;
const str6 = `It's a beautiful day`;
const str7 = `Use \\` to escape backticks`;
```

### 多行字符串

```javascript
// ❌ 旧方式：使用换行符或字符串拼接
const old1 = 'First line\nSecond line\nThird line';

const old2 = 'First line\n' +
             'Second line\n' +
             'Third line';

// ✅ 新方式：直接换行
const new1 = `First line
Second line
Third line`;

// 保留格式
const html = `
    <div class="container">
        <h1>Title</h1>
        <p>Paragraph</p>
    </div>
`;

console.log(html);
// <div class="container">
//     <h1>Title</h1>
//     <p>Paragraph</p>
// </div>
```

## 表达式插值

### 基本插值

```javascript
// 使用 ${} 插入表达式
const name = 'Alice';
const age = 25;

const message = `My name is ${name} and I'm ${age} years old`;
console.log(message);  // 'My name is Alice and I'm 25 years old'

// 可以是任意 JavaScript 表达式
const a = 10;
const b = 20;
console.log(`${a} + ${b} = ${a + b}`);  // '10 + 20 = 30'

// 调用函数
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(`Message: ${greet('Bob')}`);  // 'Message: Hello, Bob!'

// 三元表达式
const score = 85;
const result = `Score: ${score >= 60 ? 'Pass' : 'Fail'}`;
console.log(result);  // 'Score: Pass'
```

### 复杂表达式

```javascript
// 对象属性
const user = { name: 'Alice', age: 25 };
console.log(`User: ${user.name}, Age: ${user.age}`);

// 数组元素
const items = [1, 2, 3];
console.log(`Items: ${items.join(', ')}`);

// 计算表达式
const price = 99.99;
const quantity = 3;
console.log(`Total: $${(price * quantity).toFixed(2)}`);  // 'Total: $299.97'

// 调用方法
const str = 'hello world';
console.log(`Uppercase: ${str.toUpperCase()}`);  // 'Uppercase: HELLO WORLD'

// 嵌套模板字符串
const name = 'Alice';
const message = `Hello ${`Ms. ${name}`}`;
console.log(message);  // 'Hello Ms. Alice'
```

## 标签模板

### 基本语法

```javascript
// 标签模板：函数 + 模板字符串
function tag(strings, ...values) {
    console.log(strings);  // ['Hello ', '! How are you?']
    console.log(values);   // ['Alice']
    return strings.raw[0] + values[0] + strings.raw[1];
}

const name = 'Alice';
const result = tag`Hello ${name}! How are you?`;
console.log(result);  // 'Hello Alice! How are you?'
```

### 标签模板的应用

```javascript
// 应用 1：转义 HTML
function safeHTML(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i - 1];
        return result +
            string +
            (value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    });
}

const userInput = '<script>alert("XSS")</script>';
const html = safeHTML`<div>${userInput}</div>`;
console.log(html);  // '<div>&lt;script&gt;alert("XSS")&lt;/script&gt;</div>'

// 应用 2：国际化
function i18n(strings, ...values) {
    return strings.reduce((result, string, i) => {
        return result + string + (values[i] || '');
    });
}

const name = 'Alice';
const message = i18n`Hello, ${name}!`;
console.log(message);  // 'Hello, Alice!'

// 应用 3：样式化组件（React）
const Button = styled.button`
    background: ${props => props.primary ? 'blue' : 'gray'};
    color: white;
    padding: 10px 20px;
`;

// 应用 4：SQL 查询构建
function query(strings, ...values) {
    const sql = strings.reduce((result, string, i) => {
        return result + string + (values[i] ? `'${values[i]}'` : '');
    });
    return sql;
}

const tableName = 'users';
const userId = 123;
const sql = query`SELECT * FROM ${tableName} WHERE id = ${userId}`;
console.log(sql);  // "SELECT * FROM 'users' WHERE id = '123'"
```

### String.raw

```javascript
// String.raw：获取原始字符串（不处理转义字符）
const raw = String.raw`Hello\nWorld`;
console.log(raw);  // 'Hello\\nWorld'（而不是换行）

// 应用：正则表达式
const pattern = String.raw`\d{3}-\d{3}-\d{4}`;
console.log(pattern);  // '\\d{3}-\\d{3}-\\d{4}'
const regex = new RegExp(pattern);
console.log(regex.test('123-456-7890'));  // true

// 应用：文件路径（Windows）
const path = String.raw`C:\Users\Alice\Documents`;
console.log(path);  // 'C:\\Users\\Alice\\Documents'
```

## 高级用法

### 嵌套模板

```javascript
// 嵌套模板字符串
const person = {
    name: 'Alice',
    age: 25,
    address: {
        city: 'New York',
        country: 'USA'
    }
};

const template = `
    Name: ${person.name}
    Age: ${person.age}
    Address: ${`${person.address.city}, ${person.address.country}`}
`;

console.log(template);
// Name: Alice
// Age: 25
// Address: New York, USA

// 函数返回模板字符串
function getItemTemplate(item) {
    return `
        <div class="item">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="price">$${item.price}</span>
        </div>
    `;
}

const item = { name: 'Product', description: 'Description', price: 99.99 };
console.log(getItemTemplate(item));
```

### 条件渲染

```javascript
// 条件渲染
const showDetails = true;
const user = { name: 'Alice', email: 'alice@example.com' };

const template = `
    <div class="user">
        <h2>${user.name}</h2>
        ${showDetails ? `<p>Email: ${user.email}</p>` : ''}
    </div>
`;

console.log(template);
// <div class="user">
//     <h2>Alice</h2>
//     <p>Email: alice@example.com</p>
// </div>

// 更复杂的条件
const isLoggedIn = true;
const isAdmin = false;

const template2 = `
    ${!isLoggedIn ? '<a href="/login">Login</a>' : `
        <span>Welcome!</span>
        ${isAdmin ? '<a href="/admin">Admin</a>' : '<a href="/profile">Profile</a>'}
    `}
`;
```

### 列表渲染

```javascript
// 列表渲染
const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
];

const list = `
    <ul>
        ${items.map(item => `
            <li data-id="${item.id}">${item.name}</li>
        `).join('')}
    </ul>
`;

console.log(list);
// <ul>
//     <li data-id="1">Item 1</li>
//     <li data-id="2">Item 2</li>
//     <li data-id="3">Item 3</li>
// </ul>

// 带索引的列表
const table = `
    <table>
        ${items.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
            </tr>
        `).join('')}
    </table>
`;
```

## 模板字符串与旧字符串对比

### 字符串拼接

```javascript
// ❌ 旧方式：使用 + 拼接
const name = 'Alice';
const age = 25;
const message1 = 'My name is ' + name + ' and I\'m ' + age + ' years old';

// ✅ 新方式：模板字符串
const message2 = `My name is ${name} and I'm ${age} years old`;

// 多行拼接
// ❌ 旧方式
const html1 = '<div class="container">' +
              '<h1>Title</h1>' +
              '<p>Content</p>' +
              '</div>';

// ✅ 新方式
const html2 = `
    <div class="container">
        <h1>Title</h1>
        <p>Content</p>
    </div>
`;
```

### 转义字符

```javascript
// 转义引号
const str1 = 'He said: "Hello"';        // 双引号
const str2 = "It's a beautiful day";    // 单引号
const str3 = `He said: "It's great"`;   // 模板字符串不需要转义

// 转义反引号
const str4 = `Use \` to create template strings`;

// 转义 ${}
const str5 = `Use \${} for interpolation`;

// 原始字符串（不处理转义）
const str6 = String.raw`Hello\nWorld`;  // 'Hello\nWorld'
```

## 性能考虑

```javascript
// 模板字符串 vs 字符串拼接
const name = 'Alice';

// 简单拼接：性能相近
const str1 = `Hello ${name}`;
const str2 = 'Hello ' + name;

// 复杂拼接：模板字符串更清晰
const user = { name: 'Alice', age: 25, city: 'NYC' };

// ✅ 模板字符串
const template1 = `
    Name: ${user.name}
    Age: ${user.age}
    City: ${user.city}
`;

// ❌ 字符串拼接
const template2 = 'Name: ' + user.name + '\n' +
                  'Age: ' + user.age + '\n' +
                  'City: ' + user.city;

// 性能优化：大量字符串拼接使用数组
const parts = [];
for (let i = 0; i < 1000; i++) {
    parts.push(`Item ${i}`);
}
const result = parts.join('\n');
```

## 模板字符串最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用模板字符串处理多行文本
const html = `
    <div class="container">
        <h1>Title</h1>
    </div>
`;

// 2. 使用表达式插值
const message = `Hello, ${name}!`;

// 3. 使用标签模板处理特殊需求
const sql = query`SELECT * FROM users WHERE id = ${userId}`;

// 4. 使用 String.raw 处理正则和路径
const regex = String.raw`\d{3}-\d{3}-\d{4}`;
const path = String.raw`C:\Users\Alice`;

// 5. 复杂逻辑先计算再插值
const total = calculateTotal(items);
const template = `Total: $${total.toFixed(2)}`;

// ❌ 不推荐做法

// 1. 在插值中写复杂逻辑
const bad1 = `Result: ${items.map(x => x * 2).filter(x => x > 10).join(', ')}`;

// 2. 过度嵌套模板字符串
const bad2 = `Outer ${`Middle ${`Inner`}`}`;

// 3. 忘记转义特殊字符
const bad3 = `${userInput}`;  // XSS 风险

// 4. 使用模板字符串拼接大字符串（性能差）
for (let i = 0; i < 10000; i++) {
    result += `Item ${i}\n`;  // 应该用数组
}
```

::: tip 模板字符串检查清单

- [ ] 使用反引号创建模板字符串
- [ ] 使用 ${} 插入表达式
- [ ] 利用多行字符串特性
- [ ] 理解标签模板的用法
- [ ] 使用 String.raw 处理原始字符串
- [ ] 注意 XSS 安全问题

:::

::: tip 下一步

学习解构赋值 → [解构赋值](./destructuring.md)
:::
