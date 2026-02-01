---
title: 内存管理
icon: ri:database-2-line
order: 3
---

# 内存管理

JavaScript 内存管理涉及垃圾回收机制和内存优化技巧。

## 内存模型

### 堆内存

```javascript
// JavaScript 内存模型

┌─────────────────────────────────────────────┐
│           JavaScript Memory                │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────┐  ┌─────────────────────┐   │
│  │   Stack    │  │       Heap          │   │
│  │  （栈）    │  │     （堆）          │   │
│  ├────────────┤  ├─────────────────────┤   │
│  │ 函数调用   │  │ 对象、数组等        │   │
│  │ 基本类型   │  │ 动态分配的内存      │   │
│  │ 局部变量   │  │                     │   │
│  └────────────┘  │ ┌─────┐ ┌─────┐   │   │
│                  │ │{a:1}│ │[1,2]│   │   │
│                  │ └─────┘ └─────┘   │   │
│                  │                     │   │
│                  └─────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘

// Stack：基本类型和引用
let num = 42;          // Stack: 42
let str = 'hello';     // Stack: 'hello'
let obj = { x: 1 };    // Stack: 引用 → Heap: {x: 1}
let arr = [1, 2, 3];   // Stack: 引用 → Heap: [1,2,3]

// Heap：对象和数组
const user = {
    name: 'Alice',
    age: 25,
    address: {
        city: 'Beijing'
    }
};
// 嵌套对象存储在堆中
```

### 内存分配

```javascript
// 内存分配过程

// 1. 声明变量
let x;  // 分配内存（undefined）

// 2. 赋值
x = 42;  // 写入值

// 3. 对象创建
const obj = {};  // 分配新内存

// 4. 数组创建
const arr = [1, 2, 3];  // 分配连续内存

// 5. 函数调用
function foo(a, b) {
    let temp = a + b;
    return temp;
}

foo(1, 2);
// 调用时：
// - 分配栈帧（参数、局部变量）
// - 执行完毕后释放

// 6. 闭包
function createCounter() {
    let count = 0;  // 保存在堆中
    return function() {
        return ++count;
    };
}

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
// count 不会被回收，因为闭包引用
```

## 垃圾回收

### 引用计数

```javascript
// 引用计数：简单但已废弃的 GC 算法

let obj = { name: 'Alice' };
// 引用计数：1

let obj2 = obj;
// 引用计数：2

obj = null;
// 引用计数：1

obj2 = null;
// 引用计数：0，回收

// 问题：循环引用
function circular() {
    const objA = {};
    const objB = {};

    objA.ref = objB;  // A 引用 B
    objB.ref = objA;  // B 引用 A

    // 函数结束后，objA 和 objB 引用计数都是 1
    // 但无法访问，内存泄漏
}

circular();
```

### 标记清除

```javascript
// 标记清除：现代 GC 算法

// 根对象（Root）
// - 全局对象
// - 当前执行栈的变量
// - 当前活动对象

// 步骤 1：标记
// - 从根对象开始遍历
// - 标记所有可达对象

// 步骤 2：清除
// - 回收未标记的对象

// 示例
const globalVar = { data: 'important' };  // 可达（全局变量）

function createObject() {
    const localVar = { temp: 'data' };  // 可达（局部变量）
    return localVar;
}

const obj = createObject();
// obj 引用返回的对象，可达

// 函数返回后，localVar 释放
// 但返回的对象通过 obj 继续可达
```

### 分代回收

```javascript
// 分代垃圾回收

// 新生代（Young Generation）
// - 存放新创建的对象
// - 空间小（1-8 MB）
// - GC 频繁（Scavenge 算法）

// 老生代（Old Generation）
// - 存放存活时间长的对象
// - 空间大
// - GC 不频繁（Mark-Sweep-Compact）

// 对象晋升
function createObject() {
    return { data: 'temp' };
}

// 场景 1：短期存活
function tempObject() {
    const obj = createObject();
    // 使用后立即释放
    return obj.value;
}

// 场景 2：长期存活
const cache = {};
function longLivedObject() {
    cache['key'] = createObject();
    // 长期存在，晋升到老生代
}
```

## 内存泄漏

### 常见原因

```javascript
// 内存泄漏常见原因

// 1. 全局变量
// ❌ 泄漏
globalData = new Array(1000000);

// ✅ 正确
function processData() {
    const data = new Array(1000000);
    // 处理后自动释放
}

// 2. 未清理的定时器
// ❌ 泄漏
function startTimer() {
    setInterval(() => {
        // 永远执行
    }, 1000);
}

// ✅ 正确
let timerId;
function startTimer() {
    timerId = setInterval(() => {
        // 定时操作
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);  // 清理
}

// 3. 闭包引用
// ❌ 泄漏
function createHandler() {
    const largeData = new Array(1000000);
    return function() {
        // 引用 largeData，无法回收
        console.log('Handler called');
    };
}

// ✅ 正确
function createHandler() {
    return function() {
        console.log('Handler called');
    };
}

// 4. DOM 引用
// ❌ 泄漏
const elements = [];
function cacheElements() {
    elements.push(document.querySelectorAll('div'));
    // DOM 删除后，引用仍在
}

// ✅ 正确
function cacheElements() {
    return document.querySelector('#main');
}

// 5. 事件监听
// ❌ 泄漏
function addListener() {
    element.addEventListener('click', handler);
    // 元素删除后，监听器仍在
}

// ✅ 正确
function addListener() {
    element.addEventListener('click', handler);
}

function removeListener() {
    element.removeEventListener('click', handler);
}
```

### 检测内存泄漏

```javascript
// 使用 Chrome DevTools 检测内存泄漏

// 1. Memory 面板
// - Take Heap Snapshot：堆快照
// - Allocation sampling：内存分配采样
// - Allocation timeline：分配时间线

// 2. 示例：检测闭包泄漏
function createLeak() {
    const data = new Array(1000000);
    return function() {
        return data.length;
    };
}

const leak = createLeak();

// Heap Snapshot：
// - 查看 Detached DOM
// - 查看对象保留树
// - 查找大对象

// 3. 检测 DOM 泄漏
function addElements() {
    const container = document.getElementById('container');
    for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.innerHTML = `Item ${i}`;
        div.addEventListener('click', () => {
            console.log(i);
        });
        container.appendChild(div);
    }
    // 移除容器但监听器仍在
    container.remove();
}
```

## 内存优化

### 对象池

```javascript
// 对象池：复用对象，减少 GC 压力

class ObjectPool {
    constructor(createFn, resetFn) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
    }

    acquire() {
        return this.pool.length > 0
            ? this.pool.pop()
            : this.createFn();
    }

    release(obj) {
        this.resetFn(obj);
        this.pool.push(obj);
    }
}

// 使用：向量对象池
const vectorPool = new ObjectPool(
    () => ({ x: 0, y: 0 }),
    (v) => { v.x = 0; v.y = 0; }
);

function processVectors() {
    const v1 = vectorPool.acquire();
    v1.x = 10;
    v1.y = 20;

    const v2 = vectorPool.acquire();
    v2.x = 30;
    v2.y = 40;

    // 使用向量
    const result = v1.x + v2.x;

    // 释放回池
    vectorPool.release(v1);
    vectorPool.release(v2);
}
```

### 弱引用

```javascript
// WeakMap 和 WeakSet：弱引用

// WeakMap：键是弱引用
const cache = new WeakMap();

function processData(obj) {
    if (cache.has(obj)) {
        return cache.get(obj);
    }

    const result = expensiveOperation(obj);
    cache.set(obj, result);
    return result;
}

// 当对象不再被引用时，自动从 WeakMap 移除
let data = { key: 'value' };
processData(data);
data = null;  // data 从 cache 中自动移除

// WeakSet：弱引用集合
const tracked = new WeakSet();

function track(obj) {
    tracked.add(obj);
}

function isTracked(obj) {
    return tracked.has(obj);
}

let item = { id: 1 };
track(item);
console.log(isTracked(item));  // true

item = null;  // 自动从 WeakSet 移除
```

### 内存管理技巧

```javascript
// 内存管理技巧

// 1. 及时释放大对象
function processLargeData() {
    const largeData = new Array(1000000);
    // 处理数据
    const result = largeData.reduce((sum, val) => sum + val, 0);
    // 立即释放引用
    largeData = null;
    return result;
}

// 2. 使用流处理大文件
const fs = require('fs');

// ❌ 一次性读取
const data = fs.readFileSync('large-file.txt');
// 占用大量内存

// ✅ 流式读取
const stream = fs.createReadStream('large-file.txt');
let chunkCount = 0;

stream.on('data', (chunk) => {
    chunkCount++;
    // 处理小块数据
});

stream.on('end', () => {
    console.log(`Processed ${chunkCount} chunks`);
});

// 3. 分批处理
function batchProcess(items, batchSize, processFn) {
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        processFn(batch);
        // 允许 GC
        if (global.gc) global.gc();
    }
}

// 4. 使用 TypedArray
// ❌ 普通数组
const arr = [];
for (let i = 0; i < 1000000; i++) {
    arr.push(i);
}

// ✅ TypedArray
const typedArr = new Int32Array(1000000);
for (let i = 0; i < typedArr.length; i++) {
    typedArr[i] = i;
}
// 内存占用更少

// 5. 字符串池
const stringPool = new Map();

function intern(str) {
    if (stringPool.has(str)) {
        return stringPool.get(str);
    }
    stringPool.set(str, str);
    return str;
}

// 复用字符串
const s1 = intern('hello');
const s2 = intern('hello');
console.log(s1 === s2);  // true，同一引用
```

## 内存分析

### Chrome DevTools

```javascript
// 使用 Chrome DevTools 分析内存

// 1. Heap Snapshot
// - Take Heap Snapshot
// - 对比两个快照
// - 查看对象分配

// 示例：分析内存增长
function growMemory() {
    const data = [];
    for (let i = 0; i < 10000; i++) {
        data.push(new Array(1000).fill(i));
    }
    return data;
}

// Snapshot 1：初始状态
const result1 = growMemory();

// Snapshot 2：增长后
const result2 = growMemory();

// 对比快照，查看增长原因

// 2. Memory Profiler
performance.memory;
// {
//   usedJSHeapSize: 10000000,
//   totalJSHeapSize: 20000000,
//   jsHeapSizeLimit: 1500000000
// }

// 3. 监控内存
setInterval(() => {
    const mem = performance.memory;
    console.log(`Used: ${Math.round(mem.usedJSHeapSize / 1024 / 1024)} MB`);
    console.log(`Total: ${Math.round(mem.totalJSHeapSize / 1024 / 1024)} MB`);
    console.log(`Limit: ${Math.round(mem.jsHeapSizeLimit / 1024 / 1024)} MB`);
}, 1000);
```

## 最佳实践

::: tip 内存管理建议

1. **及时释放** - 不再使用的对象设为 null
2. **避免全局** - 使用局部变量和模块作用域
3. **清理监听** - 移除事件监听和定时器
4. **使用弱引用** - WeakMap/WeakSet 缓存
5. **分批处理** - 大数据分批处理

:::

```javascript
// ✅ 推荐做法

// 1. 及时释放
function processData() {
    const data = acquireLargeData();
    const result = transform(data);
    data = null;  // 释放大对象
    return result;
}

// 2. 避免全局
(function() {
    const localData = {};
    // 模块作用域
})();

// 3. 清理资源
class ResourceManager {
    constructor() {
        this.timers = [];
        this.listeners = [];
    }

    addTimer(fn, delay) {
        const id = setInterval(fn, delay);
        this.timers.push(id);
        return id;
    }

    cleanup() {
        this.timers.forEach(id => clearInterval(id));
        this.listeners.forEach(({el, type, fn}) => {
            el.removeEventListener(type, fn);
        });
        this.timers = [];
        this.listeners = [];
    }
}

// 4. 使用对象池
const pool = new ObjectPool(createFn, resetFn);
const obj = pool.acquire();
pool.release(obj);

// 5. 分批处理
function processLarge(items) {
    const batchSize = 1000;
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        processBatch(batch);
    }
}
```

::: v-pre

[V8 引擎](./v8-engine.md) → [代码优化](./optimization.md)

:::
