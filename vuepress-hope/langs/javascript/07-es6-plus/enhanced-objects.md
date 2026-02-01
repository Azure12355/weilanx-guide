---
title: 对象增强
icon: ri:braces-line
order: 5
---

# 对象增强

ES6 为对象字面量引入了许多简洁语法和增强功能。

## 属性简写

### 属性值简写

```javascript
// 当属性名和变量名相同时，可以简写
const name = 'Alice';
const age = 25;

// ❌ 旧方式
const person1 = {
    name: name,
    age: age
};

// ✅ 新方式：属性简写
const person2 = { name, age };

console.log(person2);  // { name: 'Alice', age: 25 }

// 实际应用
function createUser(name, email) {
    return { name, email };
    // 等价于 { name: name, email: email }
}

const user = createUser('Alice', 'alice@example.com');
console.log(user);  // { name: 'Alice', email: 'alice@example.com' }
```

### 方法简写

```javascript
// 方法属性简写：省略 function 关键字
// ❌ 旧方式
const calculator1 = {
    add: function(a, b) {
        return a + b;
    },
    subtract: function(a, b) {
        return a - b;
    }
};

// ✅ 新方式：方法简写
const calculator2 = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
        return a - b;
    }
};

console.log(calculator2.add(1, 2));      // 3
console.log(calculator2.subtract(5, 3)); // 2

// Generator 方法简写
const obj = {
    *generator() {
        yield 1;
        yield 2;
        yield 3;
    }
};

for (const value of obj.generator()) {
    console.log(value);  // 1, 2, 3
}
```

### 计算属性名

```javascript
// 计算属性名：使用表达式作为属性名
const key = 'name';
const value = 'Alice';

// ❌ 旧方式
const obj1 = {};
obj1[key] = value;

// ✅ 新方式：计算属性名
const obj2 = {
    [key]: value
};

console.log(obj2);  // { name: 'Alice' }

// 复杂表达式
const prefix = 'user';
const obj3 = {
    [`${prefix}_name`]: 'Alice',
    [`${prefix}_age`]: 25,
    [`${prefix}_email`]: 'alice@example.com'
};

console.log(obj3);
// {
//     user_name: 'Alice',
//     user_age: 25,
//     user_email: 'alice@example.com'
// }

// 动态方法名
const method = 'greet';
const obj4 = {
    [method]() {
        console.log('Hello!');
    }
};

obj4.greet();  // 'Hello!'
```

## 方法定义

### Getter 和 Setter

```javascript
// Getter 和 Setter 简写
const person = {
    _name: 'Alice',

    // Getter
    get name() {
        return this._name.toUpperCase();
    },

    // Setter
    set name(value) {
        if (value.length < 3) {
            console.log('名字太短');
            return;
        }
        this._name = value;
    }
};

console.log(person.name);  // 'ALICE'
person.name = 'Bob';
console.log(person.name);  // 'BOB'
person.name = 'X';  // '名字太短'
console.log(person.name);  // 'BOB'
```

### 方法名

```javascript
// 方法名可以是字符串
const obj = {
    'method with spaces'() {
        console.log('Method with spaces');
    },
    'method-with-dashes'() {
        console.log('Method with dashes');
    },
    'method_with_underscores'() {
        console.log('Method with underscores');
    }
};

obj['method with spaces']();      // 'Method with spaces'
obj['method-with-dashes']();      // 'Method with dashes'
obj['method_with_underscores'](); // 'Method with underscores'

// Symbol 作为方法名
const methodName = Symbol('method');
const obj2 = {
    [methodName]() {
        console.log('Symbol method');
    }
};

obj2[methodName]();  // 'Symbol method'
```

## 对象方法

### Object.is

```javascript
// Object.is：比较两个值是否相同
console.log(Object.is(1, 1));              // true
console.log(Object.is('hello', 'hello'));  // true
console.log(Object.is(true, true));        // true
console.log(Object.is(null, null));        // true

// 与 === 的区别
console.log(Object.is(NaN, NaN));        // true（=== 返回 false）
console.log(Object.is(-0, 0));           // false（=== 返回 true）
console.log(Object.is(-0, -0));          // true

console.log(NaN === NaN);                // false
console.log(-0 === 0);                   // true
```

### Object.assign

```javascript
// Object.assign：合并对象（浅拷贝）
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

const result = Object.assign(target, source1, source2);
console.log(result);  // { a: 1, b: 2, c: 3 }

// 注意：修改了 target
console.log(target === result);  // true

// 不修改原对象
const merged = Object.assign({}, { a: 1 }, { b: 2 });
console.log(merged);  // { a: 1, b: 2 }

// 复制对象
const original = { name: 'Alice', age: 25 };
const copy = Object.assign({}, original);
console.log(copy);  // { name: 'Alice', age: 25 }

// ⚠️ 浅拷贝：只拷贝一层
const obj1 = { nested: { value: 1 } };
const obj2 = Object.assign({}, obj1);
obj2.nested.value = 2;
console.log(obj1.nested.value);  // 2（被修改）

// 合并同名属性：后面的覆盖前面的
const result2 = Object.assign(
    { a: 1 },
    { a: 2 },
    { a: 3 }
);
console.log(result2);  // { a: 3 }
```

### Object.keys/values/entries

```javascript
const person = {
    name: 'Alice',
    age: 25,
    email: 'alice@example.com'
};

// Object.keys：获取所有键
const keys = Object.keys(person);
console.log(keys);  // ['name', 'age', 'email']

// Object.values：获取所有值
const values = Object.values(person);
console.log(values);  // ['Alice', 25, 'alice@example.com']

// Object.entries：获取所有键值对
const entries = Object.entries(person);
console.log(entries);
// [
//     ['name', 'Alice'],
//     ['age', 25],
//     ['email', 'alice@example.com']
// ]

// 遍历对象
Object.entries(person).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});

// 转换为 Map
const map = new Map(Object.entries(person));
console.log(map.get('name'));  // 'Alice'

// 从 Map 创建对象
const obj = Object.fromEntries(map);
console.log(obj);  // { name: 'Alice', age: 25, email: 'alice@example.com' }
```

### Object.fromEntries

```javascript
// Object.fromEntries：从键值对创建对象
const entries = [
    ['name', 'Alice'],
    ['age', 25],
    ['email', 'alice@example.com']
];

const person = Object.fromEntries(entries);
console.log(person);  // { name: 'Alice', age: 25, email: 'alice@example.com' }

// 实际应用：过滤对象
const prices = {
    apple: 1.5,
    banana: 0.5,
    orange: 2
};

// 过滤价格大于 1 的项目
const filtered = Object.fromEntries(
    Object.entries(prices)
        .filter(([_, price]) => price > 1)
);
console.log(filtered);  // { apple: 1.5, orange: 2 }

// 转换对象值
const transformed = Object.fromEntries(
    Object.entries(prices)
        .map(([fruit, price]) => [fruit, price * 2])
);
console.log(transformed);
// { apple: 3, banana: 1, orange: 4 }
```

## 对象静态方法

### Object.defineProperty

```javascript
// Object.defineProperty：定义单个属性
const obj = {};

Object.defineProperty(obj, 'name', {
    value: 'Alice',
    writable: true,      // 可写
    enumerable: true,    // 可枚举
    configurable: true   // 可配置
});

console.log(obj.name);  // 'Alice'

// 定义只读属性
Object.defineProperty(obj, 'ID', {
    value: 123,
    writable: false,     // 不可写
    enumerable: true,
    configurable: false
});

// obj.ID = 456;  // 严格模式下报错

// 定义 getter/setter
let _age = 25;
Object.defineProperty(obj, 'age', {
    get() {
        return _age;
    },
    set(value) {
        if (value < 0) {
            throw new Error('年龄不能为负数');
        }
        _age = value;
    },
    enumerable: true,
    configurable: true
});

console.log(obj.age);  // 25
obj.age = 30;
console.log(obj.age);  // 30
```

### Object.defineProperties

```javascript
// Object.defineProperties：定义多个属性
const obj = {};

Object.defineProperties(obj, {
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
    email: {
        value: 'alice@example.com',
        writable: true,
        enumerable: true,
        configurable: true
    }
});

console.log(obj);  // { name: 'Alice', age: 25, email: 'alice@example.com' }
```

### Object.getOwnPropertyDescriptor(s)

```javascript
// Object.getOwnPropertyDescriptor：获取属性描述符
const obj = { name: 'Alice' };
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');

console.log(descriptor);
// {
//     value: 'Alice',
//     writable: true,
//     enumerable: true,
//     configurable: true
// }

// Object.getOwnPropertyDescriptors：获取所有属性描述符
const person = {
    name: 'Alice',
    age: 25
};

const descriptors = Object.getOwnPropertyDescriptors(person);
console.log(descriptors);
// {
//     name: { value: 'Alice', writable: true, enumerable: true, configurable: true },
//     age: { value: 25, writable: true, enumerable: true, configurable: true }
// }

// 复制对象时保留属性特性
const clone = Object.defineProperties(
    {},
    Object.getOwnPropertyDescriptors(person)
);
```

## 对象原型方法

### Object.create

```javascript
// Object.create：创建新对象并指定原型
const person = {
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

const alice = Object.create(person);
alice.name = 'Alice';

alice.greet();  // 'Hello, I'm Alice'

console.log(Object.getPrototypeOf(alice) === person);  // true

// 创建空对象（无原型）
const nullObj = Object.create(null);
console.log(Object.getPrototypeOf(nullObj));  // null
console.log(nullObj.toString);  // undefined（没有继承 Object.prototype）
```

### Object.getPrototypeOf

```javascript
// Object.getPrototypeOf：获取对象原型
const obj = {};
console.log(Object.getPrototypeOf(obj) === Object.prototype);  // true

const arr = [];
console.log(Object.getPrototypeOf(arr) === Array.prototype);   // true

function Person() {}
const person = new Person();
console.log(Object.getPrototypeOf(person) === Person.prototype);  // true
```

### Object.setPrototypeOf

```javascript
// Object.setPrototypeOf：设置对象原型（慎用）
const obj1 = { a: 1 };
const obj2 = { b: 2 };

Object.setPrototypeOf(obj1, obj2);
console.log(obj1.b);  // 2（继承自 obj2）

// ⚠️ 性能警告：避免在代码运行时修改原型
// 应该在创建对象时设置原型
const better = Object.create(obj2);
better.a = 1;
console.log(better.b);  // 2
```

## 对象增强最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用属性简写
const name = 'Alice';
const person = { name };

// 2. 使用方法简写
const calculator = {
    add(a, b) {
        return a + b;
    }
};

// 3. 使用计算属性名
const key = 'dynamic';
const obj = { [key]: 'value' };

// 4. 使用展开运算符复制和合并
const copy = { ...original };
const merged = { ...obj1, ...obj2 };

// 5. 使用 Object.keys/values/entries 遍历
Object.keys(obj).forEach(key => console.log(key));

// 6. 使用 Object.fromEntries 创建对象
const map = new Map([['a', 1], ['b', 2]]);
const fromMap = Object.fromEntries(map);

// ❌ 不推荐做法

// 1. 滥用 __proto__（已废弃）
const obj = { __proto__: someProto };

// 2. 运行时修改原型
Object.setPrototypeOf(obj, newProto);

// 3. 忘记 Object.assign 是浅拷贝
const copy = Object.assign({}, deepObj);

// 4. 使用 for...in 遍历（会遍历原型链）
for (const key in obj) {
    // 应该用 Object.keys 或 Object.entries
}
```

::: tip 对象增强检查清单

- [ ] 使用属性简写和方法简写
- [ ] 使用计算属性名动态创建属性
- [ ] 理解 Object.assign 的浅拷贝特性
- [ ] 使用 Object.keys/values/entries 遍历
- [ ] 使用 Object.fromEntries 创建对象
- [ ] 避免运行时修改原型

:::

::: tip 下一步

学习函数增强 → [函数增强](./enhanced-functions.md)
:::
