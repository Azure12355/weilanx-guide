---
title: Promise
icon: ri:sparkling-line
order: 2
---

# Promise

Promise 是 JavaScript 处理异步操作的现代方式，提供了更优雅的异步编程模式。

## 什么是 Promise

### 基本概念

```javascript
// Promise 表示一个异步操作的最终完成或失败
const promise = new Promise((resolve, reject) => {
    // 异步操作
    setTimeout(() => {
        const success = true;

        if (success) {
            resolve('Operation successful');
        } else {
            reject(new Error('Operation failed'));
        }
    }, 1000);
});

// Promise 有三种状态：
// 1. pending：进行中
// 2. fulfilled：已成功
// 3. rejected：已失败
```

```mermaid
stateDiagram-v2
    [*] --> Pending: new Promise
    Pending --> Fulfilled: resolve()
    Pending --> Rejected: reject()
    Fulfilled --> [*]
    Rejected --> [*]

    note right of Pending
        状态改变不可逆
```

### 创建 Promise

```javascript
// 基本语法
const promise = new Promise((resolve, reject) => {
    // resolve：成功时调用
    // reject：失败时调用
});

// 示例：模拟网络请求
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;

            if (success) {
                resolve({ id: 1, name: 'Alice' });
            } else {
                reject(new Error('Network error'));
            }
        }, 1000);
    });
}

fetchData()
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Error:', error.message));
```

## then/catch/finally

### then 方法

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Success');
    }, 1000);
});

// then：接收两个回调函数
promise.then(
    value => console.log('Resolved:', value),
    error => console.error('Rejected:', error)
);

// 只处理成功
promise.then(value => {
    console.log('Resolved:', value);
});

// 链式调用
promise
    .then(value => {
        console.log('First then:', value);
        return value + '!';
    })
    .then(value => {
        console.log('Second then:', value);
    });
```

### catch 方法

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('Something went wrong'));
    }, 1000);
});

// catch：捕获错误
promise.catch(error => {
    console.error('Caught:', error.message);
});

// 等价于
promise.then(null, error => {
    console.error('Caught:', error.message);
});

// 最佳实践：总是使用 catch
promise
    .then(value => {
        console.log(value);
    })
    .catch(error => {
        console.error(error);
    });
```

### finally 方法

```javascript
const promise = new Promise((resolve) => {
    setTimeout(() => {
        resolve('Success');
    }, 1000);
});

// finally：无论成功或失败都会执行
promise
    .then(value => console.log('Resolved:', value))
    .catch(error => console.error('Rejected:', error))
    .finally(() => console.log('Cleanup'));

// 输出：
// 'Resolved: Success'
// 'Cleanup'

// 实际应用：关闭连接、清除资源
function fetchWithCleanup(url) {
    return fetch(url)
        .then(response => response.json())
        .finally(() => {
            console.log('Request completed');
        });
}
```

## Promise 链

### 链式调用

```javascript
// Promise 链：每个 then 返回新的 Promise
new Promise((resolve) => {
    setTimeout(() => resolve(1), 1000);
})
    .then(value => {
        console.log('Step 1:', value);  // 1
        return value + 1;
    })
    .then(value => {
        console.log('Step 2:', value);  // 2
        return value + 1;
    })
    .then(value => {
        console.log('Step 3:', value);  // 3
    });

// 返回 Promise
function getUser(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: 'Alice' });
        }, 1000);
    });
}

function getPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 101, title: 'Post 1', userId },
                { id: 102, title: 'Post 2', userId }
            ]);
        }, 1000);
    });
}

getUser(1)
    .then(user => {
        console.log('User:', user);
        return getPosts(user.id);
    })
    .then(posts => {
        console.log('Posts:', posts);
    });
```

### 错误传播

```javascript
// 错误会沿着链向下传播，直到被 catch 捕获
Promise.resolve(1)
    .then(value => {
        console.log('Step 1:', value);  // 1
        throw new Error('Something went wrong');
    })
    .then(value => {
        console.log('Step 2:', value);  // 不会执行
    })
    .catch(error => {
        console.error('Caught:', error.message);  // 'Caught: Something went wrong'
    })
    .then(value => {
        console.log('Recovery:', value);  // 会继续执行（catch 恢复了链）
    });

// catch 后返回新的 Promise
Promise.reject(new Error('Failed'))
    .catch(error => {
        console.error('Error:', error.message);
        return 'Recovered';  // 返回值
    })
    .then(value => {
        console.log('Value:', value);  // 'Value: Recovered'
    });
```

## Promise 的静态方法

### Promise.resolve

```javascript
// Promise.resolve：返回一个已完成的 Promise
const p1 = Promise.resolve('Success');
console.log(p1);  // Promise {<fulfilled>: 'Success'}

// 等价于
const p2 = new Promise(resolve => resolve('Success'));

// 传递 Promise（直接返回）
const p3 = Promise.resolve(p1);
console.log(p3 === p1);  // true

// 传递 thenable 对象
const thenable = {
    then(resolve) {
        resolve('Thenable value');
    }
};
Promise.resolve(thenable);  // Promise {<fulfilled>: 'Thenable value'}
```

### Promise.reject

```javascript
// Promise.reject：返回一个已拒绝的 Promise
const p = Promise.reject(new Error('Failed'));
console.log(p);  // Promise {<rejected>: Error: Failed}

// 等价于
const p2 = new Promise((resolve, reject) => {
    reject(new Error('Failed'));
});
```

### Promise.all

```javascript
// Promise.all：所有 Promise 都完成才完成
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then(values => {
    console.log('All:', values);  // [1, 2, 3]
});

// 一个失败则全部失败
const p4 = Promise.resolve(1);
const p5 = Promise.reject(new Error('Failed'));
const p6 = Promise.resolve(3);

Promise.all([p4, p5, p6])
    .then(values => console.log(values))
    .catch(error => console.error('Error:', error.message));  // 'Error: Failed'
```

### Promise.allSettled

```javascript
// Promise.allSettled：等待所有 Promise 完成（不管成功或失败）
const p1 = Promise.resolve(1);
const p2 = Promise.reject(new Error('Failed'));
const p3 = Promise.resolve(3);

Promise.allSettled([p1, p2, p3]).then(results => {
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            console.log('Success:', result.value);
        } else {
            console.error('Error:', result.reason.message);
        }
    });
});
// 'Success: 1'
// 'Error: Failed'
// 'Success: 3'
```

### Promise.race

```javascript
// Promise.race：返回最先完成的结果
const p1 = new Promise(resolve => setTimeout(() => resolve('First'), 1000));
const p2 = new Promise(resolve => setTimeout(() => resolve('Second'), 500));
const p3 = new Promise(resolve => setTimeout(() => resolve('Third'), 1500));

Promise.race([p1, p2, p3]).then(value => {
    console.log('Winner:', value);  // 'Second'（最快完成的）
});

// 实际应用：请求超时
function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

fetchWithTimeout('/api/data', 3000)
    .then(response => response.json())
    .catch(error => console.error('Error:', error.message));
```

### Promise.any

```javascript
// Promise.any：返回第一个完成的 Promise（忽略拒绝）
const p1 = Promise.reject(new Error('Failed 1'));
const p2 = Promise.reject(new Error('Failed 2'));
const p3 = Promise.resolve('Success');

Promise.any([p1, p2, p3]).then(value => {
    console.log('First success:', value);  // 'Success'
});

// 所有都拒绝则返回 AggregateError
Promise.any([
    Promise.reject(new Error('Failed 1')),
    Promise.reject(new Error('Failed 2'))
]).catch(error => {
    console.error('All failed:', error.errors.map(e => e.message));
    // 'All failed: ['Failed 1', 'Failed 2']'
});
```

## Promise 的最佳实践

```javascript
// ✅ 推荐做法

// 1. 总是返回或传递 Promise
function fetchData() {
    return fetch('/api/data')
        .then(response => response.json());
}

// 2. 总是处理错误
fetchData()
    .then(data => console.log(data))
    .catch(error => console.error(error));

// 3. 使用 Promise.all 并行处理
Promise.all([
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
])
    .then(responses => console.log('All fetched'));

// 4. 使用 finally 进行清理
fetch('/api/data')
    .then(response => response.json())
    .catch(error => console.error(error))
    .finally(() => console.log('Request completed'));

// ❌ 不推荐做法

// 1. 忘记 catch
fetchData()
    .then(data => console.log(data));
// 错误未处理！

// 2. 在 then 中嵌套 Promise
fetchData()
    .then(data => {
        fetchMore(data.id)
            .then(more => {
                console.log(more);
            });
    });

// 3. 混合使用回调和 Promise
function bad() {
    fs.readFile('file.txt', (err, data) => {
        // 应该使用 Promise
    });
}
```

::: tip Promise 检查清单

- [ ] 理解 Promise 的三种状态
- [ ] 总是处理错误（使用 catch）
- [ ] 使用 finally 进行清理
- [ ] 使用 Promise.all 并行处理
- [ ] 使用 Promise.race 实现超时
- [ ] 避免在 then 中嵌套 Promise

:::

::: tip 下一步

了解 async/await → [async/await](./async-await.md)
:::
