---
title: 对象进阶
icon: ri:git-commit-line
order: 1
---

# 对象进阶

深入理解 JavaScript 对象的高级特性和操作方法。

## 对象属性描述符

### 属性特性

```javascript
// 对象属性有多个特性
const person = {
    name: 'Alice'
};

// 获取属性描述符
const descriptor = Object.getOwnPropertyDescriptor(person, 'name');
console.log(descriptor);
// {
//     value: 'Alice',
//     writable: true,      // 可写
//     enumerable: true,    // 可枚举
//     configurable: true   // 可配置
// }
```

### 定义属性

```javascript
const person = {};

// 定义单个属性
Object.defineProperty(person, 'name', {
    value: 'Alice',
    writable: true,      // 可以修改
    enumerable: true,    // 可以被 for...in 遍历
    configurable: true   // 可以删除或重新定义
});

// 只读属性
Object.defineProperty(person, 'id', {
    value: 123,
    writable: false      // 不可修改
});
person.id = 456;
console.log(person.id);  // 123（修改无效）

// 不可枚举属性
Object.defineProperty(person, 'secret', {
    value: 'hidden',
    enumerable: false    // 不可遍历
});
console.log(Object.keys(person));  // ['name', 'id']（不包含 secret）

// 不可删除属性
Object.defineProperty(person, 'permanent', {
    value: 'stays',
    configurable: false  // 不可删除
});
delete person.permanent;
console.log(person.permanent);  // 'stays'
```

### 批量定义属性

```javascript
const person = {};

// 定义多个属性
Object.defineProperties(person, {
    name: {
        value: 'Alice',
        writable: true,
        enumerable: true,
        configurable: true
    },
    age: {
        value: 25,
        writable: true,
        enumerable: true,
        configurable: true
    },
    secret: {
        value: 'password',
        writable: false,
        enumerable: false,
        configurable: false
    }
});

console.log(person);
```

## Getter 和 Setter

### 基本语法

```javascript
const person = {
    firstName: 'Alice',
    lastName: 'Smith',

    // Getter
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },

    // Setter
    set fullName(name) {
        const parts = name.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1];
    }
};

console.log(person.fullName);  // 'Alice Smith'
person.fullName = 'Bob Johnson';
console.log(person.firstName);  // 'Bob'
console.log(person.lastName);   // 'Johnson'
```

### 使用 Object.defineProperty

```javascript
const person = {
    firstName: 'Alice',
    lastName: 'Smith'
};

Object.defineProperty(person, 'fullName', {
    get() {
        return `${this.firstName} ${this.lastName}`;
    },
    set(name) {
        const parts = name.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1];
    },
    enumerable: true,
    configurable: true
});

console.log(person.fullName);  // 'Alice Smith'
```

### 数据验证

```javascript
const user = {
    _age: 0,

    get age() {
        return this._age;
    },

    set age(value) {
        if (value < 0) {
            console.log('年龄不能为负数');
            return;
        }
        if (value > 150) {
            console.log('年龄不合理');
            return;
        }
        this._age = value;
    }
};

user.age = 25;
console.log(user.age);  // 25

user.age = -5;  // '年龄不能为负数'
console.log(user.age);  // 25
```

## 属性的存在性

### in 操作符

```javascript
const person = {
    name: 'Alice',
    age: 25
};

// 检查属性（包括继承的属性）
console.log('name' in person);      // true
console.log('toString' in person);  // true（继承自 Object.prototype）
```

### hasOwnProperty

```javascript
// 检查自身属性（不包括继承的）
console.log(person.hasOwnProperty('name'));     // true
console.log(person.hasOwnProperty('toString')); // false
```

### propertyIsEnumerable

```javascript
// 检查属性是否可枚举
console.log(person.propertyIsEnumerable('name'));  // true
console.log(person.propertyIsEnumerable('toString')); // false
```

## 对象的操作方法

### Object.assign

```javascript
// Object.assign：复制对象（浅拷贝）
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

const result = Object.assign(target, source1, source2);
console.log(result);  // { a: 1, b: 2, c: 3 }

// 注意：target 被修改
console.log(target === result);  // true

// 创建新对象（避免修改原对象）
const newObj = Object.assign({}, person, { age: 30 });
console.log(newObj);  // { name: 'Alice', age: 30 }
console.log(person);  // 原对象不变
```

### Object.is

```javascript
// Object.is：严格相等比较（与 === 类似，但有区别）
console.log(Object.is(1, 1));        // true
console.log(Object.is('hello', 'hello')); // true
console.log(Object.is({}, {}));      // false

// 与 === 的区别
console.log(NaN === NaN);           // false
console.log(Object.is(NaN, NaN));   // true

console.log(-0 === 0);              // true
console.log(Object.is(-0, 0));      // false

console.log(+0 === -0);             // true
console.log(Object.is(+0, -0));     // false
```

### Object.keys/values/entries

```javascript
const person = {
    name: 'Alice',
    age: 25,
    city: 'Beijing'
};

// keys：获取所有可枚举属性的键
console.log(Object.keys(person));
// ['name', 'age', 'city']

// values：获取所有可枚举属性的值
console.log(Object.values(person));
// ['Alice', 25, 'Beijing']

// entries：获取所有可枚举属性的键值对
console.log(Object.entries(person));
// [['name', 'Alice'], ['age', 25], ['city', 'Beijing']]

// 遍历对象
Object.entries(person).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});
```

### Object.freeze/seal/preventExtensions

```javascript
const person = {
    name: 'Alice',
    age: 25
};

// Object.freeze：冻结对象（完全不可变）
Object.freeze(person);
person.age = 30;  // 修改无效
person.city = 'Beijing';  // 添加无效
delete person.name;  // 删除无效
console.log(person);  // { name: 'Alice', age: 25 }
console.log(Object.isFrozen(person));  // true

// Object.seal：密封对象（不能添加删除，但可修改）
const person2 = { name: 'Bob', age: 30 };
Object.seal(person2);
person2.age = 35;  // 修改有效
person2.city = 'Shanghai';  // 添加无效
delete person2.name;  // 删除无效
console.log(person2);  // { name: 'Bob', age: 35 }
console.log(Object.isSealed(person2));  // true

// Object.preventExtensions：阻止添加新属性
const person3 = { name: 'Charlie' };
Object.preventExtensions(person3);
person3.age = 40;  // 修改有效
person3.city = 'Guangzhou';  // 添加无效
console.log(person3);  // { name: 'Charlie', age: 40 }
console.log(Object.isExtensible(person3));  // false
```

## 对象的原型

### 原型链

```javascript
const person = {
    name: 'Alice'
};

// __proto__：指向原型
console.log(person.__proto__ === Object.prototype);  // true

// Object.getPrototypeOf：获取原型
console.log(Object.getPrototypeOf(person) === Object.prototype);  // true

// Object.setPrototypeOf：设置原型（不推荐，性能影响）
const proto = {
    greet() {
        console.log('Hello!');
    }
};

Object.setPrototypeOf(person, proto);
person.greet();  // 'Hello!'
```

### 创建指定原型的对象

```javascript
// Object.create：创建指定原型的对象
const proto = {
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

const person = Object.create(proto);
person.name = 'Alice';
person.greet();  // 'Hello, I'm Alice'

console.log(Object.getPrototypeOf(person) === proto);  // true

// 创建空对象（无原型）
const pureObject = Object.create(null);
console.log(Object.getPrototypeOf(pureObject));  // null
console.log(pureObject.toString);  // undefined
```

## 对象的比较

### 浅比较

```javascript
// 浅比较：比较对象的引用
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
const obj3 = obj1;

console.log(obj1 === obj2);  // false（不同引用）
console.log(obj1 === obj3);  // true（同一引用）

// 浅比较函数
function shallowEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }

    return true;
}

console.log(shallowEqual(obj1, obj2));  // true
```

### 深比较

```javascript
// 深比较：递归比较对象及其嵌套对象
function deepEqual(obj1, obj2) {
    // 基本类型或 null
    if (obj1 === obj2) return true;
    if (obj1 === null || obj2 === null) return false;
    if (typeof obj1 !== typeof obj2) return false;

    // 对象类型
    if (typeof obj1 !== 'object') return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

const obj1 = {
    name: 'Alice',
    address: {
        city: 'Beijing'
    }
};

const obj2 = {
    name: 'Alice',
    address: {
        city: 'Beijing'
    }
};

console.log(deepEqual(obj1, obj2));  // true
```

## 对象的复制

### 浅拷贝

```javascript
const original = {
    name: 'Alice',
    hobbies: ['reading', 'coding']
};

// Object.assign
const copy1 = Object.assign({}, original);

// 展开运算符
const copy2 = { ...original };

// ⚠️ 浅拷贝的问题：嵌套对象仍然是引用
copy1.hobbies.push('gaming');
console.log(original.hobbies);  // ['reading', 'coding', 'gaming']
```

### 深拷贝

```javascript
// JSON 方法（有限制）
const obj = {
    name: 'Alice',
    hobbies: ['reading', 'coding'],
    birthday: new Date()
};

const deepCopy1 = JSON.parse(JSON.stringify(obj));
console.log(deepCopy1);  // { name: 'Alice', hobbies: ['reading', 'coding'] }
// ⚠️ birthday 丢失（Date 无法序列化）

// structuredClone（ES2021）
const deepCopy2 = structuredClone(obj);
console.log(deepCopy2);  // { name: 'Alice', hobbies: ['reading', 'coding'], birthday: ... }

// 手动深拷贝
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;

    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));

    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}
```

## 对象的最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用 Object.freeze 保护常量对象
const CONFIG = Object.freeze({
    api: 'https://api.example.com',
    timeout: 5000
});

// 2. 使用 Object.create 创建原型对象
const person = Object.create(proto);
person.name = 'Alice';

// 3. 使用展开运算符复制对象
const copy = { ...original };

// 4. 使用 Object.keys/values/entries 遍历对象
for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);
}

// 5. 使用 getter/setter 控制属性访问
const user = {
    get name() { return this._name; },
    set name(value) { this._name = value; }
};

// ❌ 不推荐做法

// 1. 使用 __proto__ 设置原型
// const obj = { __proto__: proto };  // 已弃用

// 2. 直接修改 Object.prototype
// Object.prototype.myMethod = function() {};  // 危险

// 3. 过度嵌套对象
const bad = {
    level1: {
        level2: {
            level3: {
                // 太深
            }
        }
    }
};
```

::: tip 下一步

了解原型链 → [原型链](./prototypes.md)
:::
