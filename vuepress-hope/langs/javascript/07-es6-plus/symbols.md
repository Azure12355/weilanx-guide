---
title: Symbol
icon: ri-key-2-line
order: 6
---

# Symbol

Symbol 是 ES6 引入的第七种原始数据类型，表示唯一的、不可变的数据类型。

## 基础用法

### 创建 Symbol

```javascript
// 创建 Symbol
const sym1 = Symbol();
const sym2 = Symbol();

// Symbol 是唯一的
console.log(sym1 === sym2);  // false

// 带描述的 Symbol
const sym3 = Symbol('description');
const sym4 = Symbol('description');

console.log(sym3 === sym4);  // false
console.log(sym3.description);  // 'description'
console.log(sym4.description);  // 'description'
```

### Symbol 特点

```javascript
// 1. 唯一性
const sym1 = Symbol('id');
const sym2 = Symbol('id');
console.log(sym1 === sym2);  // false

// 2. 不能使用 new
// const sym = new Symbol();  // TypeError

// 3. 不能与其他类型进行运算
// const result = sym1 + 'string';  // TypeError
// const result = sym1 + 100;       // TypeError

// 4. 可以转换为字符串
const sym = Symbol('test');
console.log(String(sym));        // 'Symbol(test)'
console.log(sym.toString());     // 'Symbol(test)'

// 5. 可以转换为布尔值
console.log(Boolean(sym));       // true
console.log(!sym);               // false
if (sym) {
    console.log('Symbol is truthy');
}
```

## Symbol 作为对象属性

### 属性键

```javascript
// Symbol 作为对象属性键
const id = Symbol('id');
const user = {
    name: 'Alice',
    [id]: 123  // 计算属性名
};

console.log(user[id]);  // 123
console.log(user['id']); // undefined（字符串 'id' 不是 Symbol）

// 添加 Symbol 属性
const email = Symbol('email');
user[email] = 'alice@example.com';

// 访问 Symbol 属性
console.log(user[email]);  // 'alice@example.com'

// 遍历 Symbol 属性
Object.getOwnPropertySymbols(user).forEach(sym => {
    console.log(sym, user[sym]);
});
```

### 属性枚举

```javascript
const user = {
    name: 'Alice',
    age: 25,
    [Symbol('id')]: 123
};

// Symbol 属性不会被 for...in 遍历
for (const key in user) {
    console.log(key);  // 'name', 'age'（不包含 Symbol）
}

// Symbol 属性不会被 Object.keys() 返回
console.log(Object.keys(user));  // ['name', 'age']

// Symbol 属性不会被 Object.getOwnPropertyNames() 返回
console.log(Object.getOwnPropertyNames(user));  // ['name', 'age']

// Symbol 属性不会被 JSON.stringify() 序列化
console.log(JSON.stringify(user));  // '{"name":"Alice","age":25}'

// 获取所有 Symbol 属性
const symbols = Object.getOwnPropertySymbols(user);
console.log(symbols);  // [Symbol(id)]

// 获取所有属性（包括 Symbol）
Reflect.ownKeys(user).forEach(key => {
    console.log(key, user[key]);
});
```

### 私有属性模拟

```javascript
// 使用 Symbol 模拟私有属性
const _count = Symbol('count');
const _increment = Symbol('increment');

class Counter {
    constructor() {
        this[_count] = 0;
    }

    [_increment]() {
        this[_count]++;
    }

    tick() {
        this[_increment]();
        return this[_count];
    }
}

const counter = new Counter();
console.log(counter.tick());  // 1
console.log(counter.tick());  // 2

// 外部无法直接访问（除非有 Symbol 引用）
// console.log(counter[_count]);  // ReferenceError
// console.log(counter[_increment]());  // ReferenceError
```

## 内置 Symbol

### Symbol.iterator

```javascript
// 自定义可迭代对象
const range = {
    start: 1,
    end: 5,
    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;

        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
};

// 使用 for...of 遍历
for (const num of range) {
    console.log(num);  // 1, 2, 3, 4, 5
}

// 使用展开运算符
console.log([...range]);  // [1, 2, 3, 4, 5]
```

### Symbol.asyncIterator

```javascript
// 异步迭代器
const asyncRange = {
    start: 1,
    end: 5,
    [Symbol.asyncIterator]() {
        let current = this.start;
        const end = this.end;

        return {
            async next() {
                if (current <= end) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return { value: current++, done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
};

// 使用 for await...of
(async () => {
    for await (const num of asyncRange) {
        console.log(num);  // 1, 2, 3, 4, 5（间隔 100ms）
    }
})();
```

### Symbol.toStringTag

```javascript
// 自定义对象类型描述
class MyCollection {
    constructor(items) {
        this.items = items;
    }

    get [Symbol.toStringTag]() {
        return 'MyCollection';
    }
}

const collection = new MyCollection([1, 2, 3]);
console.log(Object.prototype.toString.call(collection));  // '[object MyCollection]'
console.log(collection.toString());  // '[object MyCollection]'
```

### Symbol.toPrimitive

```javascript
// 自定义对象到原始值的转换
const temperature = {
    celsius: 0,

    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.celsius * 9 / 5 + 32;  // 转为华氏度
        }
        if (hint === 'string') {
            return `${this.celsius}°C`;
        }
        return this.celsius;
    }
};

console.log(+temperature);      // 32（转为数字）
console.log(`${temperature}`);  // '0°C'（转为字符串）
console.log(temperature + 0);    // 32（默认转为数字）
```

### Symbol.hasInstance

```javascript
// 自定义 instanceof 行为
class PrimitiveNumber {
    static [Symbol.hasInstance](instance) {
        return typeof instance === 'number';
    }
}

console.log(1 instanceof PrimitiveNumber);    // true
console.log('1' instanceof PrimitiveNumber);  // false
```

### 其他内置 Symbol

```javascript
// Symbol.isConcatSpreadable
// 定义对象是否被 Array.concat() 展开
const arrayLike = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.isConcatSpreadable]: true
};

console.log([].concat(arrayLike));  // ['a', 'b', 'c']

// Symbol.species
// 指定创建派生对象的构造函数
class MyArray extends Array {
    static get [Symbol.species]() {
        return Array;
    }
}

const arr = new MyArray(1, 2, 3);
const mapped = arr.map(x => x * 2);
console.log(mapped instanceof MyArray);  // false
console.log(mapped instanceof Array);    // true

// Symbol.match、Symbol.replace、Symbol.search、Symbol.split
// 自定义字符串方法行为
class CustomMatcher {
    [Symbol.match](string) {
        return string.match(/custom/g);
    }

    [Symbol.replace](string, replaceValue) {
        return string.replace(/custom/g, replaceValue);
    }
}

const str = 'custom custom custom';
console.log('custom'.match(new CustomMatcher()));  // ['custom', 'custom', 'custom']
```

## Symbol 注册表

### Symbol.for()

```javascript
// 全局 Symbol 注册表
const sym1 = Symbol.for('id');
const sym2 = Symbol.for('id');

console.log(sym1 === sym2);  // true（从注册表中查找）

// Symbol.keyFor()
const key = Symbol.keyFor(sym1);
console.log(key);  // 'id'

// 本地 Symbol 不在注册表中
const localSym = Symbol('local');
console.log(Symbol.keyFor(localSym));  // undefined
```

### 应用场景

```javascript
// 单例模式
const INSTANCE = Symbol.for('instance');

class Singleton {
    constructor() {
        if (Singleton[INSTANCE]) {
            return Singleton[INSTANCE];
        }
        Singleton[INSTANCE] = this;
    }

    static getInstance() {
        if (!Singleton[INSTANCE]) {
            Singleton[INSTANCE] = new Singleton();
        }
        return Singleton[INSTANCE];
    }
}

const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2);  // true
```

## 常用场景

### 常量定义

```javascript
// 使用 Symbol 定义常量，避免冲突
const STATUS_PENDING = Symbol('pending');
const STATUS_SUCCESS = Symbol('success');
const STATUS_ERROR = Symbol('error');

function handleStatus(status) {
    switch (status) {
        case STATUS_PENDING:
            console.log('处理中...');
            break;
        case STATUS_SUCCESS:
            console.log('成功！');
            break;
        case STATUS_ERROR:
            console.log('错误！');
            break;
    }
}

handleStatus(STATUS_PENDING);
```

### 消除魔术字符串

```javascript
// ❌ 使用魔术字符串
function getArea(shape, type) {
    if (type === 'circle') {
        return Math.PI * shape.radius ** 2;
    }
    if (type === 'rectangle') {
        return shape.width * shape.height;
    }
}

// ✅ 使用 Symbol
const SHAPE_CIRCLE = Symbol('circle');
const SHAPE_RECTANGLE = Symbol('rectangle');

function getArea(shape, type) {
    if (type === SHAPE_CIRCLE) {
        return Math.PI * shape.radius ** 2;
    }
    if (type === SHAPE_RECTANGLE) {
        return shape.width * shape.height;
    }
}
```

### 元数据存储

```javascript
// 使用 Symbol 存储元数据
const metadata = Symbol('metadata');

function attachMetadata(obj, data) {
    obj[metadata] = data;
}

function getMetadata(obj) {
    return obj[metadata];
}

const user = { name: 'Alice', age: 25 };
attachMetadata(user, { created: Date.now(), version: 1 });

console.log(getMetadata(user));  // { created: ..., version: 1 }
console.log(JSON.stringify(user));  // '{"name":"Alice","age":25}'
```

## 最佳实践

::: tip Symbol 使用建议

1. **唯一标识** - 用于对象属性避免冲突
2. **私有属性** - 模拟私有成员
3. **常量定义** - 消除魔术字符串
4. **元数据** - 存储不序列化的数据
5. **内置方法** - 实现对象协议

:::

```javascript
// ✅ 推荐的 Symbol 使用方式

// 1. 作为唯一属性键
const ID = Symbol('id');
const EMAIL = Symbol('email');

const user = {
    name: 'Alice',
    [ID]: '123',
    [EMAIL]: 'alice@example.com'
};

// 2. 全局 Symbol 注册表
const GLOBAL_EVENT = Symbol.for('global-event');
const sameSymbol = Symbol.for('global-event');
console.log(GLOBAL_EVENT === sameSymbol);  // true

// 3. 元数据存储
const META = Symbol('metadata');
class Model {
    constructor(data) {
        Object.assign(this, data);
        this[META] = { created: Date.now() };
    }

    getMetadata() {
        return this[META];
    }
}
```

## 总结

| 特性 | 描述 |
|------|------|
| **唯一性** | 每个 Symbol 都是唯一的 |
| **原始类型** | 第七种原始数据类型 |
| **不可变** | Symbol 值不能修改 |
| **属性键** | 可作为对象属性键 |
| **不可枚举** | 不会被 for...in 遍历 |
| **不序列化** | JSON.stringify() 忽略 |

::: v-pre

[展开与剩余](./spread-rest.md) → [ES2023+](./es2023-plus.md)

:::
