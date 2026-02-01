---
title: 展开与剩余
icon: ri:expand-diagonal-line
order: 4
---

# 展开与剩余

展开（Spread）和剩余（Rest）语法使用 `...` 表示，虽然语法相同，但用途相反。

## 展开语法

### 数组展开

```javascript
// 数组展开：将数组展开为逗号分隔的值
const arr = [1, 2, 3];
console.log(...arr);  // 1 2 3

// 复制数组
const original = [1, 2, 3];
const copy = [...original];
console.log(copy);  // [1, 2, 3]

// 合并数组
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2];
console.log(merged);  // [1, 2, 3, 4]

// 在数组开头添加元素
const newArray = [0, ...arr];
console.log(newArray);  // [0, 1, 2, 3]

// 在数组中间插入元素
const inserted = [...arr.slice(0, 1), 2.5, ...arr.slice(1)];
console.log(inserted);  // [1, 2.5, 3]
```

### 对象展开

```javascript
// 对象展开：将对象展开为键值对
const obj = { a: 1, b: 2 };
console.log({ ...obj });  // { a: 1, b: 2 }

// 复制对象（浅拷贝）
const original = { name: 'Alice', age: 25 };
const copy = { ...original };
console.log(copy);  // { name: 'Alice', age: 25 }

// 合并对象
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged);  // { a: 1, b: 2, c: 3, d: 4 }

// 覆盖属性
const base = { name: 'Alice', age: 25 };
const updated = { ...base, age: 26 };
console.log(updated);  // { name: 'Alice', age: 26 }

// 添加属性
const withEmail = { ...base, email: 'alice@example.com' };
console.log(withEmail);  // { name: 'Alice', age: 25, email: 'alice@example.com' }
```

### 函数调用

```javascript
// 函数参数展开
function add(a, b, c) {
    return a + b + c;
}

const numbers = [1, 2, 3];
console.log(add(...numbers));  // 6

// 部分展开
function greet(greeting, name, punctuation) {
    return `${greeting}, ${name}${punctuation}`;
}

const args = ['Alice', '!'];
console.log(greet('Hello', ...args));  // 'Hello, Alice!'

// Math.max / Math.min
const nums = [5, 2, 8, 1, 9];
console.log(Math.max(...nums));  // 9
console.log(Math.min(...nums));  // 1

// Array.push
const arr1 = [1, 2];
const arr2 = [3, 4];
arr1.push(...arr2);
console.log(arr1);  // [1, 2, 3, 4]
```

### 字符串展开

```javascript
// 字符串展开为字符数组
const str = 'Hello';
const chars = [...str];
console.log(chars);  // ['H', 'e', 'l', 'l', 'o']

// 处理 Unicode 字符
const emoji = '👨‍👩‍👧‍👦';
console.log([...emoji]);  // ['👨', '‍', '👩', '‍', '👧', '‍', '👦']
console.log(emoji.split(''));  // ['👨‍👩‍👧‍👦']（错误）

// 获取字符串长度
const text = 'Hello 👋';
console.log(text.length);              // 8
console.log([...text].length);         // 7（正确的字符数）
console.log(Array.from(text).length);  // 7
```

## 剩余语法

### 剩余参数

```javascript
// 剩余参数：将多个参数收集为数组
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5));  // 15

// 与普通参数结合
function greet(greeting, ...names) {
    names.forEach(name => {
        console.log(`${greeting}, ${name}`);
    });
}

greet('Hello', 'Alice', 'Bob', 'Charlie');
// 'Hello, Alice'
// 'Hello, Bob'
// 'Hello, Charlie'

// 箭头函数
const multiply = (...numbers) =>
    numbers.reduce((product, n) => product * n, 1);

console.log(multiply(2, 3, 4));  // 24
```

### 剩余元素

```javascript
// 数组剩余元素
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);   // 1
console.log(second);  // 2
console.log(rest);    // [3, 4, 5]

// 跳过前面的元素
const [ , , ...others] = [1, 2, 3, 4, 5];
console.log(others);  // [3, 4, 5]

// 分割数组
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head);  // 1
console.log(tail);  // [2, 3, 4, 5]
```

### 剩余属性

```javascript
// 对象剩余属性
const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a);     // 1
console.log(b);     // 2
console.log(rest);  // { c: 3, d: 4 }

// 排除某些属性
const user = {
    id: 1,
    name: 'Alice',
    age: 25,
    password: 'secret'
};

const { password, ...publicInfo } = user;
console.log(publicInfo);  // { id: 1, name: 'Alice', age: 25 }

// 提取和重命名
const { id: userId, ...otherProps } = user;
console.log(userId);     // 1
console.log(otherProps); // { name: 'Alice', age: 25, password: 'secret' }
```

## 展开与剩余对比

```javascript
// 展开：展开数组/对象
const arr = [1, 2, 3];
const obj = { a: 1, b: 2 };

// 展开数组
console.log([...arr, 4]);  // [1, 2, 3, 4]

// 展开对象
console.log({ ...obj, c: 3 });  // { a: 1, b: 2, c: 3 }

// 剩余：收集到数组/对象
// 剩余参数
function fn(...args) {
    console.log(args);  // [1, 2, 3]
}
fn(1, 2, 3);

// 剩余元素
const [first, ...rest] = [1, 2, 3];
console.log(first);  // 1
console.log(rest);   // [2, 3]

// 剩余属性
const { a, ...others } = { a: 1, b: 2, c: 3 };
console.log(a);       // 1
console.log(others);  // { b: 2, c: 3 }
```

## 实际应用

### 深拷贝

```javascript
// 浅拷贝（只拷贝一层）
const original = {
    name: 'Alice',
    hobbies: ['reading', 'gaming']
};

const shallow = { ...original };
shallow.hobbies.push('coding');
console.log(original.hobbies);  // ['reading', 'gaming', 'coding']（被修改）

// 深拷贝（多层拷贝）
const deep = {
    ...original,
    hobbies: [...original.hobbies]
};
deep.hobbies.push('swimming');
console.log(original.hobbies);  // ['reading', 'gaming', 'coding']（不被修改）

// 或使用 structuredClone（现代浏览器）
const cloned = structuredClone(original);
```

### 不可变更新

```javascript
// 不可变更新：返回新对象而不是修改原对象
const state = {
    users: [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: true }
    ],
    count: 2
};

// 更新嵌套属性
const newState = {
    ...state,
    users: state.users.map(user =>
        user.id === 1
            ? { ...user, active: false }
            : user
    )
};

// 添加元素
const withNewUser = {
    ...state,
    users: [...state.users, { id: 3, name: 'Charlie', active: true }],
    count: state.count + 1
};

// 删除元素
const withoutUser = {
    ...state,
    users: state.users.filter(user => user.id !== 1),
    count: state.count - 1
};
```

### 数组操作

```javascript
// 复制数组
const original = [1, 2, 3];
const copy = [...original];

// 合并数组
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2];  // [1, 2, 3, 4]

// 添加元素
const withNew = [...original, 4];  // [1, 2, 3, 4]
const atStart = [0, ...original];   // [0, 1, 2, 3]

// 删除元素（通过 filter）
const without = original.filter(x => x !== 2);  // [1, 3]

// 更新元素
const updated = original.map(x => x === 2 ? 20 : x);  // [1, 20, 3]

// 条件添加元素
const conditional = [...original, ...(condition ? [4] : [])];
```

### 函数应用

```javascript
// 可变参数函数
function log(...messages) {
    messages.forEach(msg => console.log(msg));
}

log('Hello', 'World', '!');

// 构造器
function Person(name, ...hobbies) {
    this.name = name;
    this.hobbies = hobbies;
}

const person = new Person('Alice', 'reading', 'gaming');
console.log(person);  // { name: 'Alice', hobbies: ['reading', 'gaming'] }

// 参数转发
function wrapper(...args) {
    return originalFunction(...args);
}

// 事件处理器
function createHandler(eventType) {
    return (...args) => {
        console.log(`Event: ${eventType}`, args);
    };
}

const clickHandler = createHandler('click');
button.addEventListener('click', clickHandler);
```

### 柯里化与偏函数

```javascript
// 柯里化
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...more) => curried(...args, ...more);
    };
}

function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));  // 6
console.log(curriedAdd(1, 2)(3));  // 6

// 偏函数
function partial(fn, ...presetArgs) {
    return (...laterArgs) => fn(...presetArgs, ...laterArgs);
}

function greet(greeting, name) {
    return `${greeting}, ${name}`;
}

const sayHello = partial(greet, 'Hello');
console.log(sayHello('Alice'));  // 'Hello, Alice'
```

## 注意事项

### 浅拷贝限制

```javascript
// ⚠️ 展开语法是浅拷贝
const original = {
    nested: { value: 1 }
};

const copy = { ...original };
copy.nested.value = 2;

console.log(original.nested.value);  // 2（被修改）

// 解决方案：深拷贝
const deepCopy = {
    ...original,
    nested: { ...original.nested }
};

// 或使用 structuredClone
const cloned = structuredClone(original);
```

### 对象顺序

```javascript
// ⚠️ 后面的属性会覆盖前面的
const obj = { a: 1, b: 2, a: 3 };
console.log(obj);  // { a: 3, b: 2 }

// 展开时顺序重要
const merged1 = { a: 1, b: 2, ...{ a: 3 } };
console.log(merged1);  // { a: 3, b: 2 }

const merged2 = { ...{ a: 3 }, a: 1, b: 2 };
console.log(merged2);  // { a: 1, b: 2 }
```

### 剩余参数位置

```javascript
// ⚠️ 剩余参数必须是最后一个参数
function good(a, b, ...rest) {
    console.log(rest);
}

// ❌ 错误：剩余参数在中间
// function bad(a, ...rest, b) {}

// ✅ 正确：剩余参数在最后
function correct(a, ...rest) {
    console.log(rest);
}

// 对象剩余属性同理
const { a, ...rest, b } = obj;  // ❌ 语法错误
const { a, b, ...rest } = obj;  // ✅ 正确
```

## 展开与剩余最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用展开复制数组和对象
const copy = [...original];
const clone = { ...original };

// 2. 使用展开合并数组和对象
const merged = [...arr1, ...arr2];
const combined = { ...obj1, ...obj2 };

// 3. 使用剩余参数处理可变参数
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

// 4. 使用剩余元素/属性提取数据
const [first, ...rest] = array;
const { id, ...others } = object;

// 5. 不可变更新
const newState = { ...state, updated: true };
const newItems = [...items, newItem];

// 6. 柯里化和偏函数应用
const curried = fn => (...args) => arg => fn(...args, arg);

// ❌ 不推荐做法

// 1. 忘记展开是浅拷贝
const copy = { ...deepObject };  // 嵌套对象共享引用

// 2. 展开大数组（性能问题）
const huge = [...arrayOfMillionItems];

// 3. 过度嵌套展开
const nested = { ...{ ...{ ...obj } } };

// 4. 在循环中重复展开
for (let i = 0; i < 1000; i++) {
    const copy = [...original];  // 每次都创建新数组
}
```

::: tip 展开与剩余检查清单

- [ ] 理解展开和剩余的区别
- [ ] 使用展开复制和合并
- [ ] 使用剩余参数处理可变参数
- [ ] 使用剩余元素/属性提取数据
- [ ] 注意展开是浅拷贝
- [ ] 剩余参数必须是最后一个

:::

::: tip 下一步

学习对象增强 → [对象增强](./enhanced-objects.md)
:::
