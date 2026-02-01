---
title: 性能基础
icon: ri:speed-line
order: 1
---

# 性能基础

JavaScript 性能优化是提升用户体验的关键，涉及代码执行效率、内存管理和渲染优化。

## 性能指标

### 加载性能

```javascript
// 页面加载性能指标

// 关键时间点
┌─────────────────────────────────────────────┐
│          Page Load Timeline                │
├─────────────────────────────────────────────┤
│                                             │
│  Navigation Start                           │
│       ↓                                    │
│  DOM Content Loaded                         │
│       ↓                                    │
│  Load Complete (window.onload)             │
│       ↓                                    │
│  First Contentful Paint (FCP)              │
│       ↓                                    │
│  Largest Contentful Paint (LCP)            │
│       ↓                                    │
│  Time to Interactive (TTI)                 │
│                                             │
└─────────────────────────────────────────────┘

// Web Vitals：核心性能指标
// 1. LCP (Largest Contentful Paint)：< 2.5s
//    最大内容绘制时间
// 2. FID (First Input Delay)：< 100ms
//    首次输入延迟
// 3. CLS (Cumulative Layout Shift)：< 0.1
//    累积布局偏移
```

### 性能测量

```javascript
// Performance API：测量性能

// 页面加载时间
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];

    console.log('DNS Lookup:', perfData.domainLookupEnd - perfData.domainLookupStart);
    console.log('TCP Connection:', perfData.connectEnd - perfData.connectStart);
    console.log('Request Time:', perfData.responseStart - perfData.requestStart);
    console.log('Response Time:', perfData.responseEnd - perfData.responseStart);
    console.log('DOM Processing:', perfData.domComplete - perfData.domInteractive);
    console.log('Load Complete:', perfData.loadEventEnd - perfData.loadEventStart);
});

// 资源加载时间
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
    console.log(`${resource.name}: ${resource.duration}ms`);
});

// 自定义测量
performance.mark('myTask-start');
// 执行任务
performance.mark('myTask-end');
performance.measure('myTask', 'myTask-start', 'myTask-end');

const measure = performance.getEntriesByName('myTask')[0];
console.log(`Task duration: ${measure.duration}ms`);
```

### Console 计时

```javascript
// Console API：代码计时

// time/timeEnd：测量代码执行时间
console.time('loop');

for (let i = 0; i < 1000000; i++) {
    // 循环操作
}

console.timeEnd('loop');
// loop: 12.345ms

// timeLog：中间时间点
console.time('process');
// 步骤 1
console.timeLog('process', 'Step 1');
// 步骤 2
console.timeLog('process', 'Step 2');
console.timeEnd('process');

// count：计数器
for (let i = 0; i < 10; i++) {
    console.count('loop');
}
// loop: 1
// loop: 2
// ...
// loop: 10
```

## 代码优化

### 避免强制转换

```javascript
// 性能优化：避免类型强制转换

// ❌ 不推荐：隐式类型转换
function compare(a, b) {
    return a == b;  // 类型转换比较
}

// ✅ 推荐：严格相等
function compare(a, b) {
    return a === b;  // 无类型转换
}

// 避免隐式转换
// 慢
if (value == null) { }
if (value == undefined) { }

// 快
if (value === null || value === undefined) { }

// 避免数字字符串转换
// 慢
if (num == '123') { }

// 快
if (num === 123) { }
```

### 循环优化

```javascript
// 循环优化

// ❌ 不推荐：在循环中重复计算
for (let i = 0; i < array.length; i++) {
    // array.length 每次都计算
}

// ✅ 推荐：缓存数组长度
const len = array.length;
for (let i = 0; i < len; i++) {
    // 只计算一次
}

// 或使用倒序循环（最快）
for (let i = array.length - 1; i >= 0; i--) {
    // 与 0 比较快于与其他值比较
}

// 使用 while 循环
let i = array.length;
while (i--) {
    // 处理 array[i]
}

// forEach vs for 循环
// forEach：代码简洁
array.forEach(item => {
    // 处理 item
});

// for 循环：性能更好
for (let i = 0, len = array.length; i < len; i++) {
    // 处理 array[i]
}

// for...of：平衡简洁和性能
for (const item of array) {
    // 处理 item
}
```

### 字符串操作

```javascript
// 字符串操作优化

// ❌ 不推荐：使用 += 连接字符串
let str = '';
for (let i = 0; i < 1000; i++) {
    str += 'text';  // 每次创建新字符串
}

// ✅ 推荐：使用数组 join
const parts = [];
for (let i = 0; i < 1000; i++) {
    parts.push('text');
}
const str = parts.join('');

// 或使用模板字符串（现代引擎优化好）
let str = '';
for (let i = 0; i < 1000; i++) {
    str += `text ${i}`;
}

// 大量字符串拼接：使用 StringBuilder 模式
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

### DOM 操作

```javascript
// DOM 操作优化

// ❌ 不推荐：频繁 DOM 操作
for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    document.body.appendChild(div);  // 100 次 reflow
}

// ✅ 推荐：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);  // 无 reflow
}
document.body.appendChild(fragment);  // 1 次 reflow

// 批量更新样式
// ❌ 不推荐
element.style.width = '100px';
element.style.height = '100px';
element.style.background = 'red';
// 3 次 reflow

// ✅ 推荐
element.style.cssText = 'width: 100px; height: 100px; background: red;';
// 1 次 reflow

// 或使用 class
element.className = 'my-class';
```

## 内存优化

### 避免内存泄漏

```javascript
// 内存泄漏常见原因

// 1. 全局变量
// ❌ 不推荐
globalData = { ... };  // 永久存在于内存

// ✅ 推荐
function processData() {
    const data = { ... };
    // 处理 data
    // 函数结束后 data 被回收
}

// 2. 未清理的定时器
// ❌ 不推荐
function startTimer() {
    setInterval(() => {
        // 永远执行
    }, 1000);
}

// ✅ 推荐
let timerId;
function startTimer() {
    timerId = setInterval(() => {
        // 执行操作
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}

// 3. 闭包引用
// ❌ 不推荐
function createHandler() {
    const largeData = new Array(1000000);
    return function() {
        // 引用 largeData，无法回收
        console.log('Handler');
    };
}

// ✅ 推荐
function createHandler() {
    return function() {
        // 不引用外部数据
        console.log('Handler');
    };
}

// 4. DOM 引用
// ❌ 不推荐
const elements = [];
function cacheElements() {
    elements.push(document.querySelectorAll('div'));
    // DOM 移除后仍在内存中
}

// ✅ 推荐
function cacheElements() {
    // 只缓存必要的引用
    const mainElement = document.querySelector('#main');
    return mainElement;
}
```

### 优化数据结构

```javascript
// 数据结构优化

// 使用 Set/Map 代替 Object
// Set：唯一值集合
const set = new Set([1, 2, 3, 3, 3]);
console.log(set);  // Set {1, 2, 3}

// Map：键值对
const map = new Map([
    ['key1', 'value1'],
    ['key2', 'value2']
]);

// 性能比较
// 查找操作
// Object：O(n) 最坏情况
// Map：O(1) 平均情况

// 选择建议
// - Object：静态配置、固定结构
// - Map：动态键值对、频繁增删

// 使用 TypedArray
// 普通数组
const arr = [1, 2, 3, 4, 5];

// TypedArray：高性能数值数组
const int8 = new Int8Array([1, 2, 3, 4, 5]);
const uint16 = new Uint16Array([1, 2, 3, 4, 5]);
const float32 = new Float32Array([1.1, 2.2, 3.3]);

// 优势
// - 内存占用小
// - 访问速度快
// - 适合数值计算
```

## 性能分析工具

### Chrome DevTools

```javascript
// Performance 面板

// 1. 记录性能
// - 点击 Record
// - 执行操作
// - 点击 Stop
// - 查看分析结果

// 2. Performance API
// 在代码中标记关键点
performance.mark('app-start');
// ... 应用启动
performance.mark('app-ready');
performance.measure('startup', 'app-start', 'app-ready');

// 3. User Timing API
performance.mark('fetch-start');
await fetch('/api/data');
performance.mark('fetch-end');
performance.measure('api-fetch', 'fetch-start', 'fetch-end');

// 获取测量结果
const measures = performance.getEntriesByType('measure');
measures.forEach(measure => {
    console.log(`${measure.name}: ${measure.duration}ms`);
});
```

### Lighthouse

```bash
# Lighthouse：网页性能分析工具

# 安装
npm install -g lighthouse

# 运行
lighthouse https://example.com

# 指定选项
lighthouse https://example.com --only-categories=performance

# 生成报告
lighthouse https://example.com --output html --output-path report.html

# 在 CI 中使用
npm install -D @lhci/cli
```

## 性能最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用严格相等
if (value === null) { }

// 2. 缓存数组长度
const len = array.length;
for (let i = 0; i < len; i++) { }

// 3. 批量 DOM 操作
const fragment = document.createDocumentFragment();
// ... 操作 fragment
document.body.appendChild(fragment);

// 4. 防抖和节流
const debounced = debounce(handler, 300);
const throttled = throttle(handler, 300);

// 5. 使用性能 API
performance.mark('start');
// ... 操作
performance.mark('end');
performance.measure('operation', 'start', 'end');

// 6. 避免内存泄漏
function cleanup() {
    // 清理定时器
    clearInterval(timerId);

    // 清理事件监听
    element.removeEventListener('click', handler);

    // 清空引用
    largeData = null;
}

// ❌ 不推荐做法

// 1. 使用 == 比较
if (value == null) { }

// 2. 循环中重复计算
for (let i = 0; i < array.length; i++) { }

// 3. 频繁 DOM 操作
document.body.appendChild(div);

// 4. 忘记清理
setInterval(() => { }, 1000);  // 永不清理

// 5. 全局变量
global.appData = { };
```

::: tip 性能基础检查清单

- [ ] 理解性能指标
- [ ] 使用性能 API
- [ ] 优化循环和字符串
// 5. 避免 DOM 重排
// 6. 防止内存泄漏

:::

::: tip 下一步

学习异步优化 → [异步优化](./async-optimization.md)
:::
