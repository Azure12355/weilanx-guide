---
title: 代码优化
icon: ri-magic-line
order: 4
---

# 代码优化

JavaScript 代码优化可以显著提升应用性能。

## 算法优化

### 时间复杂度

```javascript
// 时间复杂度优化

// O(n²) → O(n)
// ❌ 不推荐：嵌套循环
function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}

// ✅ 推荐：使用 Set
function findDuplicates(arr) {
    const seen = new Set();
    const duplicates = new Set();

    for (const item of arr) {
        if (seen.has(item)) {
            duplicates.add(item);
        } else {
            seen.add(item);
        }
    }

    return Array.from(duplicates);
}

// 查找优化
// ❌ O(n)：线性查找
function findItem(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}

// ✅ O(1)：哈希查找
function createLookup(arr) {
    const lookup = new Map();
    arr.forEach((item, index) => {
        lookup.set(item.id, index);
    });
    return lookup;
}

const lookup = createLookup(items);
const index = lookup.get(targetId);
```

### 数据结构选择

```javascript
// 选择合适的数据结构

// 1. 数组 vs Set
// 数组：有序、可重复、访问快
const arr = [1, 2, 3, 2, 1];
console.log(arr[0]);  // O(1)

// Set：唯一、查找快
const set = new Set([1, 2, 3, 2, 1]);
console.log(set.has(2));  // O(1)

// 2. 对象 vs Map
// 对象：字符串键、固定结构
const obj = {
    name: 'Alice',
    age: 25
};
console.log(obj.name);  // O(1) 平均

// Map：任意键、动态增删
const map = new Map([
    ['name', 'Alice'],
    [123, 'number key']
]);
console.log(map.get(123));  // O(1)

// 3. 数组 vs 链表
// 数组：随机访问快、插入删除慢
const arr = [1, 2, 3, 4, 5];
arr[2];  // O(1)
arr.splice(2, 1);  // O(n)

// 链表：插入删除快、访问慢
class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
// 插入：O(1)
// 访问：O(n)

// 4. 栈 vs 队列
// 栈：后进先出
const stack = [];
stack.push(1);  // O(1)
stack.pop();    // O(1)

// 队列：先进先出
class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(item) {
        this.items.push(item);
    }
    dequeue() {
        return this.items.shift();  // O(n)
    }
}

// 优化队列：使用两个栈
class OptimizedQueue {
    constructor() {
        this.inStack = [];
        this.outStack = [];
    }

    enqueue(item) {
        this.inStack.push(item);  // O(1)
    }

    dequeue() {
        if (this.outStack.length === 0) {
            while (this.inStack.length > 0) {
                this.outStack.push(this.inStack.pop());
            }
        }
        return this.outStack.pop();  // O(1) 平均
    }
}
```

## 字符串优化

### 字符串拼接

```javascript
// 字符串拼接优化

// 少量拼接：直接使用 +
let str = 'Hello';
str += ' ';
str += 'World';

// 大量拼接：使用数组
const parts = [];
for (let i = 0; i < 1000; i++) {
    parts.push(`Item ${i}`);
}
const str = parts.join(', ');

// 模板字符串：现代引擎优化
const name = 'Alice';
const greeting = `Hello, ${name}!`;

// StringBuilder 模式
class StringBuilder {
    constructor() {
        this.parts = [];
    }

    append(str) {
        this.parts.push(str);
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
console.log(sb.toString());
```

### 正则优化

```javascript
// 正则表达式优化

// 1. 使用非捕获组
// ❌ 慢：捕获组
const regex1 = /((hello|world)*)/;

// ✅ 快：非捕获组
const regex2 = /(?:hello|world)*/;

// 2. 使用字符类
// ❌ 慢：多个或
const regex3 = /a|b|c|d|e/;

// ✅ 快：字符类
const regex4 = /[a-e]/;

// 3. 使用开头锚点
// ❌ 慢：全局搜索
const regex5 = /pattern/;

// ✅ 快：开头匹配
const regex6 = /^pattern/;

// 4. 避免回溯
// ❌ 慢：嵌套量词
const regex7 = /^(a+)+$/;

// ✅ 快：原子组
const regex8 = /^(?>a+)+$/;

// 5. 预编译正则
// ❌ 慢：每次编译
function test1(str) {
    return /^hello/.test(str);
}

// ✅ 快：预编译
const regex = /^hello/;
function test2(str) {
    return regex.test(str);
}
```

## DOM 优化

### 批量操作

```javascript
// DOM 批量操作

// ❌ 慢：多次 reflow
for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    document.body.appendChild(div);  // 每次 reflow
}

// ✅ 快：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);  // 无 reflow
}
document.body.appendChild(fragment);  // 一次 reflow

// ✅ 快：使用 innerHTML
const items = [];
for (let i = 0; i < 100; i++) {
    items.push(`<div>Item ${i}</div>`);
}
container.innerHTML = items.join('');  // 一次 reflow

// ✅ 快：使用 template
const template = document.createElement('template');
for (let i = 0; i < 100; i++) {
    const clone = template.content.cloneNode(true);
    clone.querySelector('div').textContent = `Item ${i}`;
    container.appendChild(clone);
}
```

### 样式优化

```javascript
// 样式更新优化

// ❌ 慢：多次修改样式
element.style.width = '100px';
element.style.height = '100px';
element.style.background = 'red';
// 3 次 reflow

// ✅ 快：批量修改
element.style.cssText = 'width: 100px; height: 100px; background: red;';
// 1 次 reflow

// ✅ 快：使用 class
.element {
    width: 100px;
    height: 100px;
    background: red;
}

element.className = 'element';

// ✅ 快：使用 CSS 变量
:root {
    --width: 100px;
    --height: 100px;
}

element.style.setProperty('--width', '200px');
```

### 事件委托

```javascript
// 事件委托：减少事件监听器数量

// ❌ 慢：每个元素一个监听器
const items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('click', handleClick);
});

// ✅ 快：使用事件委托
document.addEventListener('click', (e) => {
    if (e.target.matches('.item')) {
        handleClick(e);
    }
});
```

## 异步优化

### Promise 优化

```javascript
// Promise 性能优化

// 1. Promise.all vs Promise.allSettled
// ❌ 慢：一个失败就停止
await Promise.all([
    fetch('/api/1'),
    fetch('/api/2'),
    fetch('/api/3')
]);
// 如果 fetch('/api/2') 失败，全部停止

// ✅ 快：继续执行
await Promise.allSettled([
    fetch('/api/1'),
    fetch('/api/2'),
    fetch('/api/3')
]);
// 无论成功失败，都执行完毕

// 2. Promise 并行
// ❌ 慢：顺序执行
const result1 = await fetch('/api/1');
const result2 = await fetch('/api/2');
const result3 = await fetch('/api/3');

// ✅ 快：并行执行
const [result1, result2, result3] = await Promise.all([
    fetch('/api/1'),
    fetch('/api/2'),
    fetch('/api/3')
]);

// 3. Promise 缓存
const cache = new Map();

async function fetchWithCache(url) {
    if (cache.has(url)) {
        return cache.get(url);
    }

    const response = await fetch(url);
    const data = await response.json();
    cache.set(url, data);
    return data;
}
```

### 防抖节流

```javascript
// 防抖和节流：控制函数执行频率

// 防抖（Debounce）
function debounce(fn, delay) {
    let timerId;
    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 使用：搜索框输入
const search = debounce((keyword) => {
    fetch(`/api/search?q=${keyword}`)
        .then(res => res.json())
        .then(results => displayResults(results));
}, 300);

input.addEventListener('input', (e) => {
    search(e.target.value);
});

// 节流（Throttle）
function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

// 使用：滚动事件
const handleScroll = throttle(() => {
    checkVisibility();
}, 100);

window.addEventListener('scroll', handleScroll);

// requestAnimationFrame 节流
function throttleRAF(fn) {
    let pending = false;
    return function(...args) {
        if (!pending) {
            pending = true;
            requestAnimationFrame(() => {
                fn.apply(this, args);
                pending = false;
            });
        }
    };
}
```

## 数据处理

### 懒加载

```javascript
// 懒加载：延迟加载数据

// 图片懒加载
class LazyImage {
    constructor(img) {
        this.img = img;
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.load();
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '50px' }
        );
    }

    load() {
        const src = this.img.dataset.src;
        this.img.src = src;
        this.img.classList.add('loaded');
    }

    observe() {
        this.observer.observe(this.img);
    }
}

// 数据分页加载
class DataLoader {
    constructor(loadFn, options = {}) {
        this.loadFn = loadFn;
        this.pageSize = options.pageSize || 20;
        this.currentPage = 0;
        this.loading = false;
        this.hasMore = true;
    }

    async loadMore() {
        if (this.loading || !this.hasMore) {
            return;
        }

        this.loading = true;
        const data = await this.loadFn(this.currentPage, this.pageSize);

        if (data.length < this.pageSize) {
            this.hasMore = false;
        }

        this.currentPage++;
        this.loading = false;

        return data;
    }
}

// 使用
const loader = new DataLoader(async (page, size) => {
    const response = await fetch(`/api/items?page=${page}&size=${size}`);
    return response.json();
});

window.addEventListener('scroll', async () => {
    if (isNearBottom()) {
        const items = await loader.loadMore();
        appendItems(items);
    }
});
```

### 虚拟列表

```javascript
// 虚拟列表：只渲染可见项

class VirtualList {
    constructor(options) {
        this.container = options.container;
        this.itemHeight = options.itemHeight;
        this.items = options.items;
        this.renderItem = options.renderItem;

        this.visibleStart = 0;
        this.visibleEnd = 0;

        this.init();
    }

    init() {
        this.updateVisibleRange();
        this.render();
        this.container.addEventListener('scroll', () => {
            this.updateVisibleRange();
            this.render();
        });
    }

    updateVisibleRange() {
        const scrollTop = this.container.scrollTop;
        const containerHeight = this.container.clientHeight;

        this.visibleStart = Math.floor(scrollTop / this.itemHeight);
        this.visibleEnd = Math.ceil((scrollTop + containerHeight) / this.itemHeight);
    }

    render() {
        const fragment = document.createDocumentFragment();

        // 添加 padding 占位
        const paddingBefore = this.visibleStart * this.itemHeight;
        const paddingAfter = (this.items.length - this.visibleEnd) * this.itemHeight;

        const spacerBefore = document.createElement('div');
        spacerBefore.style.height = `${paddingBefore}px`;
        fragment.appendChild(spacerBefore);

        // 渲染可见项
        for (let i = this.visibleStart; i < this.visibleEnd; i++) {
            if (i < this.items.length) {
                const item = this.items[i];
                const element = this.renderItem(item, i);
                element.style.position = 'absolute';
                element.style.top = `${i * this.itemHeight}px`;
                element.style.height = `${this.itemHeight}px`;
                fragment.appendChild(element);
            }
        }

        const spacerAfter = document.createElement('div');
        spacerAfter.style.height = `${paddingAfter}px`;
        fragment.appendChild(spacerAfter);

        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
}
```

## 性能测试

### Benchmark

```javascript
// 性能测试

// 使用 performance.now()
function measurePerformance(fn, iterations = 10000) {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        fn();
    }

    const end = performance.now();
    return end - start;
}

// 测试不同方法
const arr = new Array(1000).fill(0);

const time1 = measurePerformance(() => {
    arr.map(x => x * 2);
});

const time2 = measurePerformance(() => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i] * 2);
    }
});

console.log(`map: ${time1}ms`);  // 较慢
console.log(`for: ${time2}ms`);  // 较快

// 使用 Benchmark.js
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

suite
    .add('map', () => {
        arr.map(x => x * 2);
    })
    .add('for', () => {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(arr[i] * 2);
        }
    })
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .run();
```

## 最佳实践

::: tip 代码优化建议

1. **选择正确算法** - 时间复杂度优先
2. **合适数据结构** - 根据场景选择
3. **批量 DOM 操作** - 减少 reflow
4. **使用异步** - Promise、async/await
5. **懒加载** - 延迟加载非关键资源

:::

```javascript
// ✅ 推荐做法

// 1. 使用 Set/Map
const set = new Set([1, 2, 3]);
const map = new Map([['key', 'value']]);

// 2. 预编译正则
const regex = /^pattern$/;

// 3. 批量 DOM 操作
const fragment = document.createDocumentFragment();
// ... 操作 fragment
document.body.appendChild(fragment);

// 4. 事件委托
document.addEventListener('click', (e) => {
    if (e.target.matches('.item')) {
        handleClick(e);
    }
});

// 5. 防抖节流
const debounced = debounce(fn, 300);
const throttled = throttle(fn, 300);

// 6. 并行请求
const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
```

::: v-pre

[内存管理](./memory.md) → [性能分析](./profiling.md)

:::
