---
title: 异步优化
icon: ri:timer-line
order: 2
---

# 异步优化

JavaScript 是单线程的，异步操作是性能优化的关键。

## 异步模式

### Promise 并行

```javascript
// Promise 并行执行

// ❌ 不推荐：顺序执行（慢）
async function fetchUsers() {
    const user1 = await fetchUser(1);
    const user2 = await fetchUser(2);
    const user3 = await fetchUser(3);
    return [user1, user2, user3];
}
// 总时间 = 1s + 1s + 1s = 3s

// ✅ 推荐：并行执行（快）
async function fetchUsers() {
    const [user1, user2, user3] = await Promise.all([
        fetchUser(1),
        fetchUser(2),
        fetchUser(3)
    ]);
    return [user1, user2, user3];
}
// 总时间 = max(1s, 1s, 1s) = 1s

// Promise.all：全部成功才成功
Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log(results);
    })
    .catch(error => {
        // 任一失败则失败
        console.error(error);
    });

// Promise.allSettled：等待全部完成
Promise.allSettled([promise1, promise2, promise3])
    .then(results => {
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log(result.value);
            } else {
                console.error(result.reason);
            }
        });
    });
```

### Promise Race

```javascript
// Promise.race：返回最快完成的

// 超时控制
function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

// 使用
fetchWithTimeout('/api/data')
    .then(response => response.json())
    .catch(error => {
        if (error.message === 'Timeout') {
            console.log('Request timeout');
        }
    });

// 多源请求：取最快的结果
const data = await Promise.race([
    fetchFromSource1(),
    fetchFromSource2(),
    fetchFromSource3()
]);
```

### 限制并发

```javascript
// 限制并发数：避免过多并发请求

class ConcurrencyLimit {
    constructor(maxConcurrent) {
        this.maxConcurrent = maxConcurrent;
        this.current = 0;
        this.queue = [];
    }

    async run(fn) {
        while (this.current >= this.maxConcurrent) {
            await new Promise(resolve => this.queue.push(resolve));
        }

        this.current++;
        try {
            return await fn();
        } finally {
            this.current--;
            const resolve = this.queue.shift();
            if (resolve) resolve();
        }
    }
}

// 使用
const limit = new ConcurrencyLimit(3);

const urls = [
    'https://api.example.com/1',
    'https://api.example.com/2',
    'https://api.example.com/3',
    'https://api.example.com/4',
    'https://api.example.com/5'
];

const results = await Promise.all(
    urls.map(url => limit.run(() => fetch(url)))
);
```

## 请求优化

### 防抖和节流

```javascript
// 防抖（Debounce）：延迟执行
function debounce(fn, delay) {
    let timerId;
    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 使用场景：搜索输入
const searchInput = document.getElementById('search');
const debouncedSearch = debounce(async (query) => {
    const results = await searchAPI(query);
    displayResults(results);
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// 节流（Throttle）：限制执行频率
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

// 使用场景：滚动事件
const throttledScroll = throttle(() => {
    console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### 请求缓存

```javascript
// 请求缓存：避免重复请求

class RequestCache {
    constructor() {
        this.cache = new Map();
    }

    async get(key, fetcher, ttl = 60000) {
        // 检查缓存
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.data;
        }

        // 获取数据
        const data = await fetcher();

        // 存入缓存
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });

        return data;
    }

    clear() {
        this.cache.clear();
    }
}

// 使用
const cache = new RequestCache();

async function getUser(id) {
    return cache.get(
        `user-${id}`,
        () => fetch(`/api/users/${id}`).then(r => r.json())
    );
}

// 第一次请求：实际请求
const user1 = await getUser(1);

// 第二次请求：从缓存读取
const user2 = await getUser(1);
```

### 批量请求

```javascript
// 批量请求：合并多个请求

class BatchRequest {
    constructor(batchFn, delay = 10) {
        this.batchFn = batchFn;
        this.delay = delay;
        this.queue = [];
        this.timerId = null;
    }

    async add(key) {
        return new Promise((resolve, reject) => {
            this.queue.push({ key, resolve, reject });

            if (!this.timerId) {
                this.timerId = setTimeout(() => {
                    this.flush();
                }, this.delay);
            }
        });
    }

    async flush() {
        const batch = this.queue.splice(0);
        this.timerId = null;

        try {
            const keys = batch.map(item => item.key);
            const results = await this.batchFn(keys);

            batch.forEach((item, index) => {
                item.resolve(results[index]);
            });
        } catch (error) {
            batch.forEach(item => {
                item.reject(error);
            });
        }
    }
}

// 使用
const userBatch = new BatchRequest(async (ids) => {
    const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ ids })
    });
    return response.json();
});

// 多个请求自动合并
const [user1, user2, user3] = await Promise.all([
    userBatch.add(1),
    userBatch.add(2),
    userBatch.add(3)
]);
```

## 事件循环优化

### 避免阻塞

```javascript
// 避免阻塞事件循环

// ❌ 不推荐：长时间运行的任务
function processLargeArray(array) {
    for (let i = 0; i < array.length; i++) {
        // 处理每个元素
        heavyComputation(array[i]);
    }
    // 阻塞事件循环
}

// ✅ 推荐：分块处理
async function processLargeArray(array, chunkSize = 1000) {
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunk.forEach(item => heavyComputation(item));

        // 让出控制权
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}

// 或使用 setImmediate
function processLargeArray(array, chunkSize = 1000) {
    let index = 0;

    function processChunk() {
        const end = Math.min(index + chunkSize, array.length);
        for (; index < end; index++) {
            heavyComputation(array[index]);
        }

        if (index < array.length) {
            setImmediate(processChunk);
        }
    }

    processChunk();
}
```

### 任务调度

```javascript
// 任务调度：优先级队列

class TaskQueue {
    constructor() {
        this.queue = [];
        this.running = false;
    }

    add(task, priority = 0) {
        this.queue.push({ task, priority });
        this.queue.sort((a, b) => b.priority - a.priority);

        if (!this.running) {
            this.running = true;
            this.process();
        }
    }

    async process() {
        while (this.queue.length > 0) {
            const { task } = this.queue.shift();
            await task();
        }
        this.running = false;
    }
}

// 使用
const queue = new TaskQueue();

queue.add(async () => {
    console.log('High priority task');
    await fetch('/api/important');
}, 10);

queue.add(async () => {
    console.log('Low priority task');
    await fetch('/api/background');
}, 1);
```

## Worker 线程

### Web Worker

```javascript
// Web Worker：后台线程处理

// 主线程
const worker = new Worker('worker.js');

// 发送消息
worker.postMessage({
    type: 'process',
    data: largeArray
});

// 接收消息
worker.onmessage = (e) => {
    const { type, result } = e.data;
    console.log('Worker result:', result);
};

// 错误处理
worker.onerror = (error) => {
    console.error('Worker error:', error);
};

// 终止 Worker
worker.terminate();

// worker.js
self.onmessage = (e) => {
    const { type, data } = e.data;

    if (type === 'process') {
        // 耗时操作
        const result = heavyComputation(data);

        // 发送结果
        self.postMessage({
            type: 'result',
            result
        });
    }
};
```

### Worker Pool

```javascript
// Worker Pool：管理多个 Worker

class WorkerPool {
    constructor(script, size = 4) {
        this.script = script;
        this.size = size;
        this.workers = [];
        this.queue = [];

        for (let i = 0; i < size; i++) {
            const worker = new Worker(script);
            worker.onmessage = (e) => {
                const { resolve } = worker.currentTask;
                resolve(e.data);
                worker.currentTask = null;
                this.processQueue();
            };
            this.workers.push(worker);
        }
    }

    async run(data) {
        return new Promise((resolve) => {
            this.queue.push({ data, resolve });
            this.processQueue();
        });
    }

    processQueue() {
        if (this.queue.length === 0) return;

        const worker = this.workers.find(w => !w.currentTask);
        if (!worker) return;

        const task = this.queue.shift();
        worker.currentTask = task;
        worker.postMessage(task.data);
    }

    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
    }
}

// 使用
const pool = new WorkerPool('worker.js', 4);

const results = await Promise.all([
    pool.run({ data: largeArray1 }),
    pool.run({ data: largeArray2 }),
    pool.run({ data: largeArray3 }),
    pool.run({ data: largeArray4 })
]);
```

## 异步优化最佳实践

```javascript
// ✅ 推荐做法

// 1. 并行执行独立任务
const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
]);

// 2. 使用防抖/节流
const debounced = debounce(handler, 300);
const throttled = throttle(handler, 300);

// 3. 缓存请求结果
const data = await cache.get('key', fetcher);

// 4. 限制并发数
const limit = new ConcurrencyLimit(3);
await limit.run(() => fetch(url));

// 5. 避免阻塞事件循环
await new Promise(resolve => setTimeout(resolve, 0));

// 6. 使用 Worker 处理密集任务
const worker = new Worker('worker.js');
worker.postMessage(data);

// ❌ 不推荐做法

// 1. 顺序执行独立任务
const user = await fetchUser();
const posts = await fetchPosts();
const comments = await fetchComments();

// 2. 不使用防抖/节流
input.addEventListener('input', handler);

// 3. 重复请求相同数据
const data1 = await fetch('/api/data');
const data2 = await fetch('/api/data');

// 4. 无限制并发
urls.forEach(url => fetch(url));

// 5. 阻塞事件循环
for (let i = 0; i < 1000000; i++) {
    heavyComputation();
}
```

::: tip 异步优化检查清单

- [ ] 并行执行独立任务
- [ ] 使用防抖/节流
- [ ] 实现请求缓存
- [ ] 限制并发数
- [ ] 避免阻塞事件循环
- [ ] 使用 Worker 处理密集任务

:::

::: tip 下一步

学习内存优化 → [内存优化](./memory-optimization.md)
:::
