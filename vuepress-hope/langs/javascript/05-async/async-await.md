---
title: async/await
icon: ri:refresh-line
order: 3
---

# async/await

async/await 是 ES2017 引入的语法糖，让异步代码看起来像同步代码，极大地提高了可读性。

## async 函数

### 基本语法

```javascript
// async 函数：返回 Promise 的函数
async function greet() {
    return 'Hello!';
}

// 调用 async 函数返回 Promise
const promise = greet();
console.log(promise);  // Promise {<fulfilled>: 'Hello!'}

// 使用 then 获取结果
greet().then(value => console.log(value));  // 'Hello!'
```

### async 函数的返回值

```javascript
// 返回原始值
async function f1() {
    return 'Hello';
}
f1().then(v => console.log(v));  // 'Hello'

// 返回 Promise
async function f2() {
    return Promise.resolve('World');
}
f2().then(v => console.log(v));  // 'World'

// 等价于
async function f2() {
    return 'World';
}

// 抛出错误
async function f3() {
    throw new Error('Failed');
}
f3().catch(e => console.log(e.message));  // 'Failed'

// 等价于
async function f3() {
    return Promise.reject(new Error('Failed'));
}
```

## await 表达式

### 基本语法

```javascript
// await：等待 Promise 完成
async function fetchData() {
    const promise = new Promise(resolve => {
        setTimeout(() => resolve('Data loaded'), 1000);
    });

    const result = await promise;
    console.log(result);  // 'Data loaded'
}

fetchData();

// ⚠️ await 只能在 async 函数中使用
// const result = await promise;  // SyntaxError
```

### await 的值

```javascript
// await 等待 Promise 完成
async function f() {
    // 等待 Promise
    const p = Promise.resolve('Success');
    const value1 = await p;
    console.log(value1);  // 'Success'

    // 等待非 Promise 值（直接返回）
    const value2 = await 'Direct';
    console.log(value2);  // 'Direct'
}
```

### 串行 vs 并行

```javascript
// 串行执行：等待每个操作完成
async function serial() {
    console.log('Start');

    const p1 = new Promise(resolve => {
        setTimeout(() => {
            console.log('P1 done');
            resolve('Result 1');
        }, 1000);
    });

    const p2 = new Promise(resolve => {
        setTimeout(() => {
            console.log('P2 done');
            resolve('Result 2');
        }, 500);
    });

    const r1 = await p1;  // 等待 1 秒
    console.log('Got:', r1);

    const r2 = await p2;  // 等待 0.5 秒
    console.log('Got:', r2);

    // 总时间：1.5 秒
    console.log('End');
}

// 并行执行：同时发起多个操作
async function parallel() {
    console.log('Start');

    const p1 = new Promise(resolve => {
        setTimeout(() => {
            console.log('P1 done');
            resolve('Result 1');
        }, 1000);
    });

    const p2 = new Promise(resolve => {
        setTimeout(() => {
            console.log('P2 done');
            resolve('Result 2');
        }, 500);
    });

    const [r1, r2] = await Promise.all([p1, p2]);
    console.log('Got:', r1, r2);

    // 总时间：1 秒
    console.log('End');
}
```

## 错误处理

### try-catch

```javascript
// 使用 try-catch 捕获错误
async function fetchWithError() {
    try {
        const data = await fetch('/api/data');
        const json = await data.json();
        console.log('Data:', json);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchWithError();

// 多个 await 的错误处理
async function multiple() {
    try {
        const user = await getUser(1);
        const posts = await getPosts(user.id);
        const comments = await getComments(posts[0].id);

        console.log('All data loaded');
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

### finally

```javascript
// finally：无论成功或失败都会执行
async function fetchWithCleanup() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        console.log('Cleanup');
    }
}

fetchWithCleanup();
```

## async/await 的优势

### vs Promise 链

```javascript
// ❌ Promise 链：嵌套和回调地狱
function getUser(id) {
    return fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => {
            return fetch(`/api/posts?userId=${user.id}`)
                .then(response => response.json())
                .then(posts => {
                    return { user, posts };
                });
        });
}

// ✅ async/await：清晰的顺序代码
async function getUser(id) {
    const userResponse = await fetch(`/api/users/${id}`);
    const user = await userResponse.json();

    const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
    const posts = await postsResponse.json();

    return { user, posts };
}
```

### 错误处理

```javascript
// ❌ Promise 链的错误处理
function getData() {
    return fetch('/api/data')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// ✅ async/await 的错误处理
async function getData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## 并行处理

### Promise.all

```javascript
// 并行获取多个资源
async function fetchMultiple() {
    try {
        const [users, posts, comments] = await Promise.all([
            fetch('/api/users').then(r => r.json()),
            fetch('/api/posts').then(r => r.json()),
            fetch('/api/comments').then(r => r.json())
        ]);

        console.log('Users:', users);
        console.log('Posts:', posts);
        console.log('Comments:', comments);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// 使用 for...of 串行处理（较慢）
async function fetchSerial() {
    const urls = ['/api/users', '/api/posts', '/api/comments'];

    for (const url of urls) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Data from', url, ':', data);
        } catch (error) {
            console.error('Error fetching', url, ':', error.message);
        }
    }
}
```

### for...await

```javascript
// for...await：遍历异步迭代器
async function fetchItems() {
    const urls = ['/api/1', '/api/2', '/api/3'];

    for await (const url of urls) {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Data:', data);
    }
}

// 读取异步生成器
async function* asyncGenerator() {
    yield Promise.resolve(1);
    yield Promise.resolve(2);
    yield Promise.resolve(3);
}

async function consumeGenerator() {
    for await (const value of asyncGenerator()) {
        console.log('Value:', value);  // 1, 2, 3
    }
}

consumeGenerator();
```

## 顶级 await（ES2022）

```javascript
// 顶级 await：在模块顶层使用 await（ES2022）
// 模块文件
const response = await fetch('/api/data');
const data = await response.json();
console.log(data);

// ⚠️ 注意：顶级 await 只能在 ES 模块中使用
// <script type="module">
//     const data = await fetch('/api/data');
// </script>
```

## async/await 的最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用 async/await 替代 Promise 链
async function loadData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
}

// 2. 使用 try-catch-finally 处理错误和清理
async function processData() {
    try {
        const data = await fetchData();
        return processData(data);
    } catch (error) {
        handleError(error);
    } finally {
        cleanup();
    }
}

// 3. 使用 Promise.all 并行处理
async function fetchAll() {
    const [users, posts] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/posts').then(r => r.json())
    ]);
    return { users, posts };
}

// 4. 提取 Promise 逻辑到单独函数
function fetchUser(id) {
    return fetch(`/api/users/${id}`).then(r => r.json());
}

async function showUser(id) {
    const user = await fetchUser(id);
    console.log('User:', user);
}

// ❌ 不推荐做法

// 1. 在循环中使用 await（串行，慢）
async function bad() {
    const urls = ['/api/1', '/api/2', '/api/3'];
    for (const url of urls) {
        const data = await fetch(url);  // 串行执行
    }
}

// ✅ 使用 Promise.all 并行
async function good() {
    const urls = ['/api/1', '/api/2', '/api/3'];
    const promises = urls.map(url => fetch(url));
    const responses = await Promise.all(promises);
}

// 2. 忘记错误处理
async function noErrorHandling() {
    const data = await fetchData();
    console.log(data);
    // 如果 fetchData 失败，会抛出未捕获的错误
}

// 3. 混合使用 async/await 和 Promise
async function mixed() {
    const data = await fetchData().then(r => r.json());
    // 不一致，难以阅读
}
```

::: tip async/await 检查清单

- [ ] 使用 async/await 替代 Promise 链
- [ ] 总是使用 try-catch 处理错误
- [ ] 使用 Promise.all 并行处理
- [ ] 避免在循环中串行使用 await
- [ ] 保持异步函数的一致性
- [ ] 使用 finally 进行清理

:::

::: tip 下一步

了解事件循环 → [事件循环](./event-loop.md)
:::
