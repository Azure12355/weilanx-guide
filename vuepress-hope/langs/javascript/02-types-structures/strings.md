---
title: 字符串
icon: ri:text
order: 4
---

# 字符串

字符串是表示文本的数据类型，是 JavaScript 中最常用的类型之一。

## 创建字符串

### 字符串字面量

```javascript
// 单引号
const str1 = 'Hello';

// 双引号
const str2 = "World";

// 模板字符串（ES6）
const name = "Alice";
const str3 = `Hello, ${name}!`;

// 多行字符串
const multiline = `第一行
第二行
第三行`;
```

### String 构造函数

```javascript
// 基本字符串（推荐）
const str1 = String('hello');
console.log(typeof str1);  // 'string'

// 字符串对象（不推荐）
const str2 = new String('hello');
console.log(typeof str2);  // 'object'

// ⚠️ 避免使用 new String()
console.log('hello' === 'hello');  // true
console.log(new String('hello') === new String('hello'));  // false
```

### String.fromCharCode 和 String.fromCodePoint

```javascript
// fromCharCode：从 Unicode 码点创建字符串
console.log(String.fromCharCode(72, 101, 108, 108, 111));  // 'Hello'

// fromCodePoint：支持更广泛的码点（ES6）
console.log(String.fromCodePoint(0x1F600));  // '😀'
```

## 字符串属性

### length

```javascript
const str = 'Hello, World!';

// 获取长度
console.log(str.length);  // 13

// 空字符串
console.log(''.length);  // 0

// 注意：length 是属性，不是方法
console.log(str.length());  // TypeError
```

## 访问字符

### charAt 和 charCodeAt

```javascript
const str = 'Hello';

// charAt：获取指定位置的字符
console.log(str.charAt(0));  // 'H'
console.log(str.charAt(4));  // 'o'
console.log(str.charAt(10)); // ''（空字符串）

// charCodeAt：获取指定位置的字符码点
console.log(str.charCodeAt(0));  // 72（'H' 的 ASCII 码）

// codePointAt：获取完整的码点（ES6，支持代理对）
const emoji = '😀';
console.log(emoji.codePointAt(0));  // 128512
```

### 方括号访问

```javascript
const str = 'Hello';

// 方括号访问（ES5）
console.log(str[0]);  // 'H'
console.log(str[4]);  // 'o'
console.log(str[10]); // undefined（不同于 charAt 返回空字符串）

// ⚠️ 不能设置字符
str[0] = 'h';
console.log(str);  // 'Hello'（字符串是不可变的）
```

## 大小写转换

### toUpperCase 和 toLowerCase

```javascript
const str = 'Hello, World!';

// 转大写
console.log(str.toUpperCase());  // 'HELLO, WORLD!'

// 转小写
console.log(str.toLowerCase());  // 'hello, world!'

// 不修改原字符串
console.log(str);  // 'Hello, World!'
```

### toLocaleUpperCase 和 toLocaleLowerCase

```javascript
// 考虑语言的本地化转换
const str = 'istanbul';

console.log(str.toLocaleUpperCase('tr-TR'));  // 'İSTANBUL'（土耳其语）
console.log(str.toUpperCase());  // 'ISTANBUL'
```

## 查找子串

### indexOf 和 lastIndexOf

```javascript
const str = 'Hello, World! Hello, Universe!';

// indexOf：首次出现的位置
console.log(str.indexOf('Hello'));   // 0
console.log(str.indexOf('World'));   // 7
console.log(str.indexOf('hello'));   // -1（区分大小写）
console.log(str.indexOf('xyz'));     // -1（不存在）

// 起始位置
console.log(str.indexOf('Hello', 1)); // 14（从索引 1 开始查找）

// lastIndexOf：最后出现的位置
console.log(str.lastIndexOf('Hello'));  // 14
console.log(str.lastIndexOf('World'));  // 7
```

### includes

```javascript
const str = 'Hello, World!';

// 检查是否包含子串
console.log(str.includes('Hello'));   // true
console.log(str.includes('world'));   // false（区分大小写）
console.log(str.includes('xyz'));     // false

// 起始位置
console.log(str.includes('Hello', 1)); // false（从索引 1 开始查找）

// 检查是否包含任意一个字符
console.log(str.includes('l'));  // true
```

### startsWith 和 endsWith

```javascript
const str = 'Hello, World!';

// startsWith：检查开头
console.log(str.startsWith('Hello'));  // true
console.log(str.startsWith('World'));  // false
console.log(str.startsWith('World', 7)); // true（从索引 7 开始）

// endsWith：检查结尾
console.log(str.endsWith('!'));       // true
console.log(str.endsWith('World'));   // false
console.log(str.endsWith('World', 12)); // true（到索引 12 结束）
```

### search

```javascript
const str = 'Hello, World!';

// search：使用正则表达式查找
console.log(str.search(/World/));  // 7
console.log(str.search(/world/i)); // 7（忽略大小写）
console.log(str.search(/xyz/));    // -1
```

## 提取子串

### slice

```javascript
const str = 'Hello, World!';

// slice：提取子串（推荐）
console.log(str.slice(0, 5));    // 'Hello'
console.log(str.slice(7));       // 'World!'
console.log(str.slice(-6));      // 'World!'
console.log(str.slice(0, -1));   // 'Hello, World'
console.log(str.slice(-6, -1));  // 'World'

// 不修改原字符串
console.log(str);  // 'Hello, World!'
```

### substring

```javascript
const str = 'Hello, World!';

// substring：类似 slice，但不支持负数
console.log(str.substring(0, 5));  // 'Hello'
console.log(str.substring(7));     // 'World!'
console.log(str.substring(7, 0));  // 'Hello, '（自动交换参数）

// ⚠️ 负数被视为 0
console.log(str.substring(-6));    // 'Hello, World!'
```

### substr

```javascript
const str = 'Hello, World!';

// substr：从起始位置提取指定长度
// ⚠️ 已废弃，不推荐使用
console.log(str.substr(0, 5));  // 'Hello'
console.log(str.substr(7, 5));  // 'World'
```

::: tip slice vs substring vs substr

- **slice**：支持负数，推荐使用
- **substring**：自动交换参数，负数视为 0
- **substr**：已废弃，避免使用

:::

## 替换字符串

### replace

```javascript
const str = 'Hello, World! Hello, Universe!';

// replace：替换第一个匹配
console.log(str.replace('Hello', 'Hi'));
// 'Hi, World! Hello, Universe!'

// 使用正则表达式替换所有匹配
console.log(str.replace(/Hello/g, 'Hi'));
// 'Hi, World! Hi, Universe!'

// 使用函数
const result = str.replace(/Hello/g, match => {
    return match.toLowerCase();
});
console.log(result);
// 'hello, World! hello, Universe!'
```

### replaceAll（ES2021）

```javascript
const str = 'Hello, World! Hello, Universe!';

// replaceAll：替换所有匹配
console.log(str.replaceAll('Hello', 'Hi'));
// 'Hi, World! Hi, Universe!'

// 等价于
console.log(str.replace(/Hello/g, 'Hi'));
// 'Hi, World! Hi, Universe!'
```

## 分割和连接

### split

```javascript
const str = 'apple,banana,orange';

// split：分割为数组
console.log(str.split(','));  // ['apple', 'banana', 'orange']

// 限制分割数量
console.log(str.split(',', 2));  // ['apple', 'banana']

// 使用正则表达式
console.log(str.split(/,+/));  // ['apple', 'banana', 'orange']

// 分割字符
const chars = 'hello';
console.log(chars.split(''));  // ['h', 'e', 'l', 'l', 'o']

// 分割单词
const sentence = 'Hello,   World!';
console.log(sentence.split(/\s+/));  // ['Hello,', 'World!']
```

### join

```javascript
// join：连接数组的元素
const fruits = ['apple', 'banana', 'orange'];

console.log(fruits.join());        // 'apple,banana,orange'
console.log(fruits.join(', '));    // 'apple, banana, orange'
console.log(fruits.join(' | '));   // 'apple | banana | orange'
console.log(fruits.join(''));      // 'applebananaorange'
```

## 去除空格

### trim

```javascript
const str = '  hello  ';

// trim：去除两端空格
console.log(str.trim());      // 'hello'
console.log(str.trim().length); // 5

// 不修改原字符串
console.log(str);  // '  hello  '
```

### trimStart 和 trimEnd

```javascript
const str = '  hello  ';

// trimStart（或 trimLeft）：去除开头空格
console.log(str.trimStart());  // 'hello  '

// trimEnd（或 trimRight）：去除末尾空格
console.log(str.trimEnd());    // '  hello'
```

### replace 清除所有空格

```javascript
const str = '  hello   world  ';

// 去除所有空格
console.log(str.replace(/\s/g, ''));  // 'helloworld'

// 去除多余空格
console.log(str.replace(/\s+/g, ' ').trim());  // 'hello world'
```

## 填充字符串

### padStart 和 padEnd（ES2017）

```javascript
// padStart：开头填充
console.log('5'.padStart(2, '0'));    // '05'
console.log('5'.padStart(3, '0'));    // '005'
console.log('abc'.padStart(6, '0'));  // '000abc'

// padEnd：末尾填充
console.log('5'.padEnd(2, '0'));      // '50'
console.log('abc'.padEnd(6, '0'));    // 'abc000'

// 实际应用
console.log('123'.padStart(16, ' ')); // '             123'
console.log('USD '.padEnd(10, '.'));  // 'USD......'
```

## 重复字符串

### repeat（ES2015）

```javascript
// repeat：重复字符串
console.log('ha'.repeat(3));  // 'hahaha'
console.log('abc'.repeat(2)); // 'abcabc'

// ⚠️ 重复 0 次返回空字符串
console.log('abc'.repeat(0)); // ''

// 负数或 Infinity 报错
// 'abc'.repeat(-1);  // RangeError
```

## 模板字符串

### 基本语法

```javascript
const name = 'Alice';
const age = 25;

// 模板字符串（使用反引号）
const message = `Hello, ${name}! You are ${age} years old.`;
console.log(message);
// 'Hello, Alice! You are 25 years old.'

// 多行字符串
const multiline = `第一行
第二行
第三行`;
console.log(multiline);

// 等价于
const multiline2 = '第一行\n第二行\n第三行';
```

### 表达式插值

```javascript
// 任意 JavaScript 表达式
const a = 10;
const b = 20;

console.log(`${a} + ${b} = ${a + b}`);  // '10 + 20 = 30'
console.log(`${a} > ${b} ? ${a > b}`);  // '10 > 20 ? false'

// 调用函数
function getName() {
    return 'Alice';
}
console.log(`Hello, ${getName()}!`);  // 'Hello, Alice!'

// 访问属性
const user = { name: 'Alice', age: 25 };
console.log(`${user.name} is ${user.age}`);  // 'Alice is 25'
```

### 标签模板

```javascript
// 标签模板函数
function tag(strings, ...values) {
    console.log(strings);  // ['Hello, ', '! You are ', ' years old.']
    console.log(values);   // ['Alice', 25]
    return 'Custom result';
}

const name = 'Alice';
const age = 25;
const result = tag`Hello, ${name}! You are ${age} years old.`;
console.log(result);  // 'Custom result'

// 实际应用：HTML 转义
function html(strings, ...values) {
    return strings.reduce((acc, str, i) => {
        const value = values[i] || '';
        return acc + str + String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }, '');
}

const user = '<script>alert("XSS")</script>';
console.log(html`User: ${user}`);  // 'User: &lt;script&gt;alert("XSS")&lt;/script&gt;'
```

## 字符串比较

### localeCompare

```javascript
// localeCompare：本地化比较
const str1 = 'apple';
const str2 = 'banana';

console.log(str1.localeCompare(str2));  // -1（str1 < str2）
console.log(str2.localeCompare(str1));  // 1（str2 > str1）
console.log(str1.localeCompare(str1));  // 0（相等）

// 中文排序
const fruits = ['橙子', '苹果', '香蕉'];
fruits.sort((a, b) => a.localeCompare(b, 'zh'));
console.log(fruits);  // ['橙子', '苹果', '香蕉']
```

## Unicode 支持

### 字符与码点

```javascript
// UTF-16 码元（code unit）
const str = 'hello';
console.log(str.length);  // 5

// 代理对（surrogate pair）
const emoji = '😀';
console.log(emoji.length);  // 2（占用两个码元）
console.log([...emoji].length);  // 1（实际字符数）

// Array.from 正确处理 Unicode
console.log(Array.from('😀👍').length);  // 2
```

### normalize

```javascript
// Unicode 规范化
const str1 = 'café';
const str2 = 'cafe\u0301';  // café（组合字符）

console.log(str1.length);  // 4
console.log(str2.length);  // 5

console.log(str1 === str2);  // false
console.log(str1.normalize() === str2.normalize());  // true

// NFC 规范化
console.log(str1.normalize('NFC') === str2.normalize('NFC'));  // true
```

## 字符串最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用模板字符串
const message = `Hello, ${name}!`;

// 2. 使用 slice 而非 substring
const sub = str.slice(0, 5);

// 3. 使用 includes 检查包含
const has = str.includes('substring');

// 4. 使用 trim 清除空格
const clean = str.trim();

// 5. 使用 padStart/padEnd 填充
const padded = num.toString().padStart(2, '0');

// ❌ 不推荐做法

// 1. 使用字符串拼接（可用模板字符串）
const msg = 'Hello, ' + name + '!';

// 2. 使用 eval
eval('console.log("dangerous")');

// 3. 使用 substr（已废弃）
str.substr(0, 5);
```

::: tip 下一步

了解类型转换 → [类型转换](./types-conversion.md)
:::
