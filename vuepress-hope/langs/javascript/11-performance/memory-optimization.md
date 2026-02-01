---
title: 内存优化
icon: ri:memory-line
order: 3
---

# 内存优化

JavaScript 内存优化是提升应用性能和稳定性的关键。

## 内存基础

### 垃圾回收

```javascript
// 垃圾回收（GC）：自动释放不再使用的内存

// 引用计数垃圾回收
let obj1 = { name: 'Alice' };
let obj2 = obj1;
// 引用计数 = 2

obj1 = null;
// 引用计数 = 1

obj2 = null;
// 引用计数 = 0，可以回收

// 标记清除垃圾回收（现代算法）
// 1. 从根对象开始标记
// 2. 标记所有可达对象
// 3. 清除未标记对象

// 分代回收
// 新生代：短生命周期对象
// - 使用 Scavenge 算法
// - 分为 From 和 To 空间
// - 复制存活对象到 To 空间

// 老生代：长生命周期对象
// - 使用标记清除算法
// - 标记整理碎片
```

### 内存分析

```javascript
// Chrome DevTools：Memory 面板

// 1. 堆快照
// - 拍摄内存快照
// - 分析内存分布
// - 查找内存泄漏

// 2. 内存时间线
// - 实时监控内存
// - 记录内存变化
// - 识别内存峰值

// 3. 手动触发 GC
// 仅 Chrome DevTools 可用
// GC 按钮

// performance.memory：获取内存信息（非标准）
if (performance.memory) {
    console.log('Used:', performance.memory.usedJSHeapSize);
    console.log('Total:', performance.memory.totalJSHeapSize);
    console.log('Limit:', performance.memory.jsHeapSizeLimit);
}
```

## 内存泄漏

### 常见原因

```javascript
// 1. 全局变量

// ❌ 不推荐：意外全局变量
function createUser() {
    user = { name: 'Alice' };  // 成为全局变量
}

// ✅ 推荐：使用局部变量
function createUser() {
    const user = { name: 'Alice' };
    return user;
}

// 2. 闭包引用

// ❌ 不推荐：闭包持有大对象
function createHandler() {
    const largeData = new Array(1000000).fill(0);

    return function() {
        console.log('Handler');
        // largeData 无法被回收
    };
}

// ✅ 推荐：避免不必要的引用
function createHandler() {
    return function() {
        console.log('Handler');
    };
}

// 3. 定时器未清理

// ❌ 不推荐：未清理定时器
function startPolling() {
    setInterval(() => {
        fetchData();
    }, 1000);
    // 永不停止，回调函数无法被回收
}

// ✅ 推荐：保存定时器 ID 并清理
let timerId;
function startPolling() {
    timerId = setInterval(() => {
        fetchData();
    }, 1000);
}

function stopPolling() {
    clearInterval(timerId);
}

// 4. DOM 引用

// ❌ 不推荐：DOM 移除后仍保留引用
const elements = document.querySelectorAll('.item');
elements.forEach(el => {
    // el 被保留在数组中
});
// DOM 移除后，element 数组仍引用

// ✅ 推荐：清理 DOM 引用
const elements = document.querySelectorAll('.item');
// 使用后清空
elements.length = 0;

// 5. 事件监听器未移除

// ❌ 不推荐：事件监听器未移除
element.addEventListener('click', handler);
// 元素移除后，监听器仍存在

// ✅ 推荐：移除事件监听器
element.addEventListener('click', handler);
// 使用后移除
element.removeEventListener('click', handler);

// 或使用 AbortController
const controller = new AbortController();
element.addEventListener('click', handler, {
    signal: controller.signal
});
// 移除所有监听器
controller.abort();
```

### 检测内存泄漏

```javascript
// 检测内存泄漏

// 方法 1：堆快照对比
// 1. 执行操作前拍摄快照
// 2. 执行操作
// 3. 触发 GC（DevTools）
// 4. 再次拍摄快照
// 5. 对比两个快照，查找增长的对象

// 方法 2：内存时间线
// 1. 打开 Memory 面板
// 2. 选择 Timeline
// 3. 执行操作
// 4. 观察内存增长趋势

// 方法 3：代码监控
function trackMemory() {
    if (!performance.memory) return;

    const initial = performance.memory.usedJSHeapSize;

    return function() {
        const current = performance.memory.usedJSHeapSize;
        const diff = current - initial;
        const mb = (diff / 1024 / 1024).toFixed(2);
        console.log(`Memory change: +${mb} MB`);
    };
}

// 使用
const checkMemory = trackMemory();
// 执行操作
checkMemory();
```

## 内存优化

### 对象池

```javascript
// 对象池：复用对象减少创建/销毁

class ObjectPool {
    constructor(factory, reset, initialSize = 10) {
        this.factory = factory;
        this.reset = reset;
        this.pool = [];

        for (let i = 0; i < initialSize; i++) {
            this.pool.push(factory());
        }
    }

    acquire() {
        return this.pool.length > 0
            ? this.pool.pop()
            : this.factory();
    }

    release(obj) {
        this.reset(obj);
        this.pool.push(obj);
    }
}

// 使用：向量对象池
const vectorPool = new ObjectPool(
    () => ({ x: 0, y: 0, z: 0 }),
    (v) => { v.x = 0; v.y = 0; v.z = 0; }
);

// 获取对象
const v1 = vectorPool.acquire();
v1.x = 10;
v1.y = 20;

// 释放对象
vectorPool.release(v1);
```

### 懒加载

```javascript
// 懒加载：延迟加载大对象

// ❌ 不推荐：立即加载所有数据
const appData = {
    user: loadUser(),        // 立即加载
    posts: loadPosts(),      // 立即加载
    comments: loadComments() // 立即加载
};

// ✅ 推荐：按需加载
const appData = {
    get user() {
        const value = loadUser();
        Object.defineProperty(this, 'user', { value });
        return value;
    },
    get posts() {
        const value = loadPosts();
        Object.defineProperty(this, 'posts', { value });
        return value;
    },
    get comments() {
        const value = loadComments();
        Object.defineProperty(this, 'comments', { value });
        return value;
    }
};

// 使用 Proxy
function createLazy(loader) {
    let loaded = false;
    let value;

    return new Proxy({}, {
        get(target, prop) {
            if (!loaded) {
                value = loader();
                loaded = true;
            }
            return value[prop];
        },
        set(target, prop, value) {
            if (!loaded) {
                const temp = loader();
                loaded = true;
                value = temp;
            }
            value[prop] = value;
            return true;
        }
    });
}

const user = createLazy(() => loadUser());
console.log(user.name);  // 首次访问时加载
```

### 数据结构优化

```javascript
// 数据结构优化

// 使用 TypedArray
// ❌ 普通数组：内存占用大
const arr = [];
for (let i = 0; i < 1000000; i++) {
    arr.push(i);
}

// ✅ TypedArray：内存占用小
const typed = new Int32Array(1000000);
for (let i = 0; i < 1000000; i++) {
    typed[i] = i;
}

// 内存对比
// Int8Array：1 byte per element
// Uint8Array：1 byte per element
// Int16Array：2 bytes per element
// Uint16Array：2 bytes per element
// Int32Array：4 bytes per element
// Uint32Array：4 bytes per element
// Float32Array：4 bytes per element
// Float64Array：8 bytes per element
// 普通数组：~16 bytes per element

// 使用 Set/Map
// ❌ Object：键只能是字符串/Symbol
const cache = {};
cache[{}] = 'value';  // 键被转换为 '[object Object]'
cache[{}] = 'value';  // 覆盖之前的值

// ✅ Map：键可以是任意类型
const cache = new Map();
const obj1 = {};
const obj2 = {};
cache.set(obj1, 'value1');
cache.set(obj2, 'value2');
console.log(cache.get(obj1));  // 'value1'
console.log(cache.get(obj2));  // 'value2'

// WeakMap/WeakSet：弱引用，自动回收
const weakMap = new WeakMap();
let obj = {};
weakMap.set(obj, 'value');
obj = null;  // weakMap 中的条目自动移除

// 使用场景：DOM 节点关联数据
const elementData = new WeakMap();
elementData.set(element, { clicked: false });
// element 移除后，数据自动回收
```

### 字符串优化

```javascript
// 字符串优化

// 字符串驻留（String Interning）
// 相同字符串共享内存
const str1 = 'hello';
const str2 = 'hello';
console.log(str1 === str2);  // true，共享同一内存

// 避免字符串拼接创建临时对象
// ❌ 不推荐
let result = '';
for (let i = 0; i < 1000; i++) {
    result += 'text';  // 每次创建新字符串
}

// ✅ 推荐：数组 join
const parts = [];
for (let i = 0; i < 1000; i++) {
    parts.push('text');
}
const result = parts.join('');

// ✅ 或使用 StringBuilder
class StringBuilder {
    constructor() {
        this.parts = [];
    }

    append(text) {
        this.parts.push(text);
        return this;
    }

    toString() {
        return this.parts.join('');
    }
}

const sb = new StringBuilder();
sb.append('Hello')
  .append(' ')
  .append('World');
const result = sb.toString();
```

## 内存监控

### 内存限制

```javascript
// Node.js 内存限制

// 默认限制
// 64 位系统：~1.4 GB
// 32 位系统：~0.7 GB

// 查看内存使用
console.log(process.memoryUsage());
// {
//   rss: 21842080,      // 常驻集大小
//   heapTotal: 7684096, // V8 分配的内存
//   heapUsed: 4844392,  // 已使用的堆内存
//   external: 11974     // C++ 对象绑定的内存
// }

// 增加内存限制
// NODE_OPTIONS=--max-old-space-size=4096 node app.js
// 或
node --max-old-space-size=4096 app.js

// 监控内存
setInterval(() => {
    const usage = process.memoryUsage();
    const used = usage.heapUsed / 1024 / 1024;
    const total = usage.heapTotal / 1024 / 1024;
    console.log(`Memory: ${used.toFixed(2)} MB / ${total.toFixed(2)} MB`);
}, 1000);
```

### 内存警告

```javascript
// 内存警告：接近限制时通知

function checkMemory() {
    if (!performance.memory) return;

    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    const usage = usedJSHeapSize / jsHeapSizeLimit;

    if (usage > 0.9) {
        console.warn('Memory usage over 90%!');
        // 触发清理逻辑
        cleanup();
    }
}

function cleanup() {
    // 清理缓存
    cache.clear();

    // 通知用户
    notifyUser('Low memory, some features disabled');

    // 禁用非关键功能
    disableFeatures(['animation', 'preload']);
}
```

## 内存优化最佳实践

```javascript
// ✅ 推荐做法

// 1. 避免全局变量
function init() {
    const data = loadData();
    // 函数结束后自动回收
}

// 2. 清理定时器和监听器
function cleanup() {
    clearInterval(timerId);
    element.removeEventListener('click', handler);
}

// 3. 使用 WeakMap/WeakSet
const weakCache = new WeakMap();

// 4. 使用对象池
const obj = pool.acquire();
pool.release(obj);

// 5. 懒加载数据
const data = new Proxy({}, {
    get(target, prop) {
        if (!target[prop]) {
            target[prop] = loadProperty(prop);
        }
        return target[prop];
    }
});

// 6. 监控内存使用
console.log(process.memoryUsage());

// ❌ 不推荐做法

// 1. 创建全局变量
global.appData = {};

// 2. 忘记清理
setInterval(handler, 1000);

// 3. 闭包持有大对象
function createHandler() {
    const largeData = new Array(1000000);
    return () => console.log('Handler');
}

// 4. 频繁创建对象
for (let i = 0; i < 10000; i++) {
    const obj = {};
}

// 5. 立即加载所有数据
const data = {
    large1: loadLargeData1(),
    large2: loadLargeData2(),
    large3: loadLargeData3()
};

// 6. 忽略内存警告
// 接近限制时继续操作
```

::: tip 内存优化检查清单

- [ ] 避免内存泄漏
- [ ] 使用对象池
- [ ] 实现懒加载
- [ ] 优化数据结构
- [ ] 监控内存使用
// 6. 及时清理资源

:::

::: tip 下一步

学习性能分析 → [性能分析](./performance-analysis.md)
:::
