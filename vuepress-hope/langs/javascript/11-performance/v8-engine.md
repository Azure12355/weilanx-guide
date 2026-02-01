---
title: V8 引擎
icon: ri-cpu-line
order: 2
---

# V8 引擎

V8 是 Chrome 和 Node.js 使用的 JavaScript 引擎，理解 V8 有助于编写高性能代码。

## V8 架构

### 执行流程

```javascript
// V8 引擎执行 JavaScript 的流程

┌─────────────────────────────────────────────────────┐
│              V8 JavaScript Engine                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. Parser（解析器）                                 │
│     ↓                                                │
│     解析代码 → 生成 AST（抽象语法树）                │
│                                                      │
│  2. Ignition（解释器）                               │
│     ↓                                                │
│     快速生成字节码 → 执行                            │
│     收集类型反馈信息                                 │
│                                                      │
│  3. TurboFan（优化编译器）                           │
│     ↓                                                │
│     基于类型信息优化 → 生成机器码                    │
│     Hot Code 会被优化                               │
│                                                      │
│  4. Orinoco（垃圾回收器）                            │
│     ↓                                                │
│     分代垃圾回收                                     │
│                                                      │
└─────────────────────────────────────────────────────┘

// 流程示例
function add(a, b) {
    return a + b;
}

console.log(add(1, 2));

// 1. Parser：解析为 AST
// FunctionDeclaration {
//   id: Identifier { name: 'add' },
//   params: [Identifier { name: 'a' }, Identifier { name: 'b' }],
//   body: BlockStatement {
//     statements: [
//       ReturnStatement {
//         argument: BinaryExpression {
//           operator: '+',
//           left: Identifier { name: 'a' },
//           right: Identifier { name: 'b' }
//         }
//       }
//     ]
//   }
// }

// 2. Ignition：生成字节码
// # Create closure in context
// LdaGlobal [0], [0]
// Star r0
// LdaGlobal [1], [2]
// Star r1
// Ldar r0
// Add r1
// Return

// 3. TurboFan：优化为机器码
// lea rax, [rdi + rsi*1]  ; 加法运算
// ret                      ; 返回
```

### 隐藏类（Hidden Classes）

```javascript
// V8 使用隐藏类优化对象属性访问

// 创建对象
const obj1 = {};
obj1.x = 1;
obj1.y = 2;

// 相同结构的对象共享隐藏类
const obj2 = {};
obj2.x = 3;
obj2.y = 4;

// obj1 和 obj2 有相同的隐藏类
// 转换过程：
// {} → HClass0 (无属性)
// {x} → HClass1 (有属性 x)
// {x, y} → HClass2 (有属性 x, y)

// 属性访问优化
console.log(obj1.x);  // 直接从已知偏移量读取

// ❌ 破坏隐藏类
const obj3 = {};
obj3.x = 1;
obj3.y = 2;
obj3.z = 3;  // 新属性，创建新隐藏类
delete obj3.x;  // 删除属性，破坏隐藏类

// ✅ 保持隐藏类
const obj4 = { x: 0, y: 0, z: 0 };  // 一次性初始化所有属性
obj4.x = 1;
obj4.y = 2;
obj4.z = 3;
```

### 内联缓存（Inline Caching）

```javascript
// 内联缓存：优化属性访问和方法调用

function getX(obj) {
    return obj.x;
}

// 第一次调用：慢路径（查找属性）
getX({ x: 1 });

// 第二次调用（相同类型的对象）：快路径
// 使用缓存中的偏移量
getX({ x: 2 });

// 多态缓存：支持 2-4 种类型
getX({ x: 3 });  // 类型 A
getX({ x: 4, y: 5 });  // 类型 B

// 超过 4 种类型：变为超态（慢）
getX({ x: 5, y: 6, z: 7 });  // 类型 C
getX({ x: 6, y: 7, z: 8, w: 9 });  // 类型 D
getX({ x: 7, y: 8, z: 9, w: 10, a: 11 });  // 类型 E（超态）
```

## 优化编译

### 热代码

```javascript
// V8 会优化执行频繁的代码（Hot Code）

// 函数被多次调用后会优化
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// 冷启动（未优化）
factorial(5);  // 解释执行

// 热代码（优化）
for (let i = 0; i < 10000; i++) {
    factorial(i);  // 触发优化
}

// 优化后：编译为高效的机器码
// 使用整数运算、内联递归等优化
```

### 去优化（Deoptimization）

```javascript
// 去优化：当假设不成立时，回退到解释执行

// 示例：类型变化
function add(a, b) {
    return a + b;
}

// 优化：假设 a, b 都是整数
for (let i = 0; i < 10000; i++) {
    add(i, i + 1);  // 整数相加
}
// TurboFan 优化为整数加法

// 去优化：传入字符串
add('hello', 'world');  // 字符串相加，假设不成立
// 回退到解释执行

// 常见去优化原因：
// 1. 类型变化
// 2. 对象结构变化
// 3. 函数参数数量变化
// 4. 使用 try-catch
// 5. 使用 with 或 eval
```

### 优化策略

```javascript
// 代码优化：帮助 V8 更好地优化代码

// 1. 保持类型稳定
function process(items) {
    // ✅ 推荐：类型一致
    for (let i = 0; i < items.length; i++) {
        const item = items[i];  // 总是相同类型
        processItem(item);
    }

    // ❌ 不推荐：类型混合
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (typeof item === 'string') {
            // 字符串处理
        } else if (typeof item === 'number') {
            // 数字处理
        }
    }
}

// 2. 避免对象结构变化
// ✅ 推荐：初始化所有属性
function createUser(name, email, age) {
    return {
        name,
        email,
        age,
        // 预留属性
        address: null,
        phone: null
    };
}

// ❌ 不推荐：动态添加属性
function createUser(name) {
    const user = { name };
    // 根据条件动态添加
    if (someCondition) {
        user.email = '...';
    }
    return user;
}

// 3. 使用数组方法
// ✅ 推荐：使用 map, filter, reduce
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((a, b) => a + b, 0);

// 4. 避免元素删除
// ❌ 不推荐：delete
delete obj.property;  // 破坏隐藏类

// ✅ 推荐：设置为 undefined
obj.property = undefined;  // 保持结构
```

## 垃圾回收

### 分代回收

```javascript
// V8 使用分代垃圾回收（Generational GC）

// 内存分代：
// ┌─────────────────────────────────────┐
// │  新生代（Young Generation）         │
// │  - 新创建的对象                     │
// │  - 空间小（1-8 MB）                 │
// │  - GC 频繁但快速                     │
// │  - Scavenge 算法                    │
// ├─────────────────────────────────────┤
// │  老生代（Old Generation）           │
// │  - 存活时间长的对象                 │
// │  - 空间大                           │
// │  - GC 不频繁但较慢                   │
// │  - Mark-Sweep-Compact 算法          │
// └─────────────────────────────────────┘

// 对象生命周期
const shortLived = {};  // 新生代
// 使用后很快回收

const longLived = {};   // 老生代
// 长期存在

// 从新生代晋升到老生代
// 1. 经历一次 Scavenge GC
// 2. 老生代空间不足时
```

### Scavenge 算法

```javascript
// Scavenge：新生代垃圾回收

// 新生代分为两个空间：From 和 To
// ┌─────────────┬─────────────┐
// │    From     │     To      │
// │  （使用中）  │  （空闲）   │
// └─────────────┴─────────────┘

// 步骤 1：GC 开始
// 将存活对象从 From 复制到 To
// 同时压缩内存

// 步骤 2：交换 From 和 To
// ┌─────────────┬─────────────┐
// │    From     │     To      │
// │   （空闲）   │  （使用中）  │
// └─────────────┴─────────────┘

// 示例
function createShortLivedObjects() {
    const objects = [];
    for (let i = 0; i < 1000; i++) {
        objects.push({ id: i, data: 'temp' });
    }
    return objects;
}

// 函数返回后，大部分对象成为垃圾
// 下一次 GC 时回收
```

### Mark-Sweep-Compact

```javascript
// Mark-Sweep-Compact：老生代垃圾回收

// 步骤 1：标记（Mark）
// 从根对象开始，标记所有可达对象

// 步骤 2：清除（Sweep）
// 回收未标记的对象

// 步骤 3：整理（Compact）
// 整理内存，消除碎片

// 示例
// 创建长期存活的对象
const cache = {};
function addToCache(key, value) {
    cache[key] = value;  // 长期存在，进入老生代
}

// 定期清理
function cleanCache() {
    for (const key in cache) {
        if (shouldExpire(key)) {
            delete cache[key];  // 留下空洞
        }
    }
    // GC 时会整理内存
}
```

## 性能调优

### 避免陷阱

```javascript
// V8 性能陷阱

// 1. 隐式类型转换
// ❌ 慢
function sum(a, b) {
    return a + b;  // 类型不确定
}

// ✅ 快
function sum(a, b) {
    return a + b;  // 保持类型稳定
}

// 2. arguments 对象
// ❌ 慢：优化函数不能使用 arguments
function slow() {
    const args = arguments;  // 禁用优化
}

// ✅ 快：使用剩余参数
function fast(...args) {
    // 正常优化
}

// 3. for...in
// ❌ 慢：遍历原型链
for (const key in obj) {
    // ...
}

// ✅ 快：Object.keys 或 for...of
for (const key of Object.keys(obj)) {
    // ...
}

// 4. eval
// ❌ 慢：阻止优化
eval('console.log("hello")');

// ✅ 快：使用 Function
const fn = new Function('console.log("hello")');

// 5. try-catch
// ❌ 慢：阻止优化
function optimized() {
    try {
        // 代码
    } catch (e) {
        // 错误处理
    }
}

// ✅ 快：隔离 try-catch
function optimized() {
    // 主逻辑（可优化）
}

function withErrorHandler() {
    try {
        optimized();
    } catch (e) {
        // 错误处理
    }
}
```

### 使用 Performance API

```javascript
// 使用 Performance API 监控 V8 性能

// 标记关键点
performance.mark('parse-start');
// 解析操作
performance.mark('parse-end');

performance.measure('parse', 'parse-start', 'parse-end');

const measure = performance.getEntriesByName('parse')[0];
console.log(`Parse time: ${measure.duration}ms`);

// 监控垃圾回收
const start = performance.now();
// 执行可能触发 GC 的操作
const end = performance.now();

// 强制 GC（Node.js）
if (global.gc) {
    global.gc();  // --expose-gc 启动
}
```

## 最佳实践

::: tip V8 优化建议

1. **保持类型稳定** - 避免类型变化
2. **初始化对象** - 一次性设置所有属性
3. **避免 delete** - 使用 undefined 替代
4. **使用数组方法** - map, filter, reduce
5. **避免 arguments** - 使用剩余参数

:::

```javascript
// ✅ 推荐做法

// 1. 类型稳定
function add(a: number, b: number): number {
    return a + b;
}

// 2. 对象初始化
const obj = {
    prop1: null,
    prop2: null,
    prop3: null
};

// 3. 避免去优化
// 使用一致的函数签名
function process(data: UserData, options: Options) {
    // 总是相同类型的参数
}

// 4. 数组操作
const results = items.map(transform).filter(validate);

// 5. 避免泄漏
function cleanup() {
    // 清理引用
    cache.clear();
    timer = null;
}
```

::: v-pre

[性能基础](./performance-basics.md) → [内存管理](./memory.md)

:::
