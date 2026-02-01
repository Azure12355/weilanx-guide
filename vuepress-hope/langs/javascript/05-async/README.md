---
title: 异步编程
icon: ri:refresh-line
order: 6
---

# 异步编程

JavaScript 是单线程的，异步编程是处理耗时操作的核心机制。

## 学习内容

- [回调函数](./callbacks.md) - 回调模式、回调地狱
- [Promise](./promises.md) - Promise 基础、链式调用
- [async/await](./async-await.md) - 异步函数语法糖
- [事件循环](./event-loop.md) - Event Loop、宏任务与微任务

## 异步演进

```javascript
// 1. 回调函数
getData(function(data) {
    processData(data, function(result) {
        displayResult(result);
    });
});

// 2. Promise
getData()
    .then(processData)
    .then(displayResult)
    .catch(handleError);

// 3. async/await
async function handleData() {
    try {
        const data = await getData();
        const result = await processData(data);
        await displayResult(result);
    } catch (error) {
        handleError(error);
    }
}
```
