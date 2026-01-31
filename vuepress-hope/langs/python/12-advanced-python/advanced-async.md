---
title: 高级协程
icon: ri:refresh-line
order: 4
---

# 高级协程

深入 async/await 机制，掌握异步编程的高级模式和最佳实践。

## 异步生成器

### 基础语法

```python
import asyncio

async def async_range(n):
    """异步生成器"""
    for i in range(n):
        await asyncio.sleep(0.1)  # 模拟异步操作
        yield i

async def main():
    # 使用异步生成器
    async for value in async_range(5):
        print(value)

asyncio.run(main())

# 手动迭代
async def manual_iteration():
    gen = async_range(3)
    try:
        print(await gen.asend(None))  # 启动
        print(await gen.asend(None))  # 继续
        print(await gen.asend(None))  # 继续
    except StopAsyncIteration:
        pass
```

### 异步上下文管理器

```python
class AsyncContextManager:
    """异步上下文管理器"""

    async def __aenter__(self):
        print("进入上下文")
        await asyncio.sleep(0.1)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("退出上下文")
        await asyncio.sleep(0.1)
        return False

async def main():
    async with AsyncContextManager() as manager:
        print("在上下文中")

asyncio.run(main())

# 输出:
# 进入上下文
# 在上下文中
# 退出上下文
```

### 异步迭代器

```python
class AsyncIterator:
    """异步迭代器"""

    def __init__(self, n):
        self.n = n
        self.i = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        await asyncio.sleep(0.1)
        if self.i < self.n:
            value = self.i
            self.i += 1
            return value
        raise StopAsyncIteration

async def main():
    async for value in AsyncIterator(5):
        print(value)

asyncio.run(main())
```

## 任务调度

### 创建任务

```python
import asyncio

async def task(name, delay):
    print(f"{name} 开始")
    await asyncio.sleep(delay)
    print(f"{name} 完成")
    return f"{name} 结果"

async def main():
    # 创建任务
    task1 = asyncio.create_task(task("Task1", 1))
    task2 = asyncio.create_task(task("Task2", 2))

    # 等待任务完成
    result1 = await task1
    result2 = await task2

    print(result1, result2)

asyncio.run(main())
```

### gather 使用

```python
async def main():
    # 并发执行多个协程
    results = await asyncio.gather(
        task("Task1", 1),
        task("Task2", 2),
        task("Task3", 1)
    )
    print(results)

    # 处理异常
    try:
        results = await asyncio.gather(
            task("Task1", 1),
            task("Task2", 2),
            return_exceptions=True  # 返回异常而非抛出
        )
        for result in results:
            if isinstance(result, Exception):
                print(f"错误: {result}")
            else:
                print(f"结果: {result}")
    except Exception as e:
        print(f"捕获异常: {e}")
```

### wait 使用

```python
async def main():
    # 创建任务
    tasks = [
        asyncio.create_task(task("Task1", 1)),
        asyncio.create_task(task("Task2", 2)),
        asyncio.create_task(task("Task3", 3))
    ]

    # 等待第一个完成
    done, pending = await asyncio.wait(
        tasks,
        return_when=asyncio.FIRST_COMPLETED
    )
    print(f"已完成: {len(done)}, 待处理: {len(pending)}")

    # 取消剩余任务
    for task in pending:
        task.cancel()

    # 等待所有完成
    done, pending = await asyncio.wait(tasks)
    print(f"全部完成: {len(done)}")
```

## 并发模式

### 生产者-消费者

```python
import asyncio

async def producer(queue, n):
    """生产者"""
    for i in range(n):
        await asyncio.sleep(0.1)
        await queue.put(f"Item {i}")
        print(f"生产: Item {i}")

async def consumer(queue, name):
    """消费者"""
    while True:
        item = await queue.get()
        await asyncio.sleep(0.2)
        print(f"{name} 消费: {item}")
        queue.task_done()

async def main():
    # 创建队列
    queue = asyncio.Queue(maxsize=5)

    # 创建生产者和消费者
    producer_task = asyncio.create_task(producer(queue, 10))
    consumers = [
        asyncio.create_task(consumer(queue, f"Consumer-{i}"))
        for i in range(2)
    ]

    # 等待生产完成
    await producer_task

    # 等待队列清空
    await queue.join()

    # 取消消费者
    for c in consumers:
        c.cancel()

asyncio.run(main())
```

### 限流并发

```python
import asyncio

class Semaphore:
    """信号量限流"""

    def __init__(self, limit):
        self.limit = limit
        self.semaphore = asyncio.Semaphore(limit)

    async def run(self, coro):
        async with self.semaphore:
            return await coro

async def bounded_task(n):
    """限流任务"""
    print(f"开始任务 {n}")
    await asyncio.sleep(1)
    print(f"完成任务 {n}")
    return f"结果 {n}"

async def main():
    # 限制并发数
    limiter = Semaphore(3)

    # 创建任务
    tasks = [
        limiter.run(bounded_task(i))
        for i in range(10)
    ]

    # 等待全部完成
    results = await asyncio.gather(*tasks)
    print(results)

asyncio.run(main())
```

### 超时控制

```python
import asyncio

async def main():
    # 等待超时
    try:
        result = await asyncio.wait_for(
            asyncio.sleep(5),
            timeout=2.0
        )
    except asyncio.TimeoutError:
        print("操作超时")

    # 使用 timeout 上下文
    try:
        async with asyncio.timeout(2.0):
            await asyncio.sleep(5)
    except TimeoutError:
        print("上下文超时")

    # 取消任务
    task = asyncio.create_task(asyncio.sleep(10))
    await asyncio.sleep(1)
    task.cancel()

    try:
        await task
    except asyncio.CancelledError:
        print("任务已取消")

asyncio.run(main())
```

## 异步同步桥接

### run_in_executor

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

def blocking_operation(n):
    """阻塞操作"""
    import time
    time.sleep(n)
    return f"完成 {n}"

async def main():
    loop = asyncio.get_event_loop()

    # 在线程池执行阻塞操作
    with ThreadPoolExecutor() as executor:
        result = await loop.run_in_executor(
            executor,
            blocking_operation,
            2
        )
        print(result)

asyncio.run(main())
```

### to_thread 和 to_process

```python
import asyncio

async def main():
    # 运行在线程中
    result = await asyncio.to_thread(
        blocking_operation,
        2
    )
    print(result)

    # 运行在进程中（Python 3.11+）
    # result = await asyncio.to_process(
    #     cpu_bound_operation,
    #     1000000
    # )

asyncio.run(main())
```

## 异步网络编程

### 异步 HTTP 客户端

```python
import aiohttp
import asyncio

async def fetch(session, url):
    """获取 URL"""
    async with session.get(url) as response:
        return await response.text()

async def main():
    urls = [
        'https://example.com',
        'https://example.org',
        'https://example.net'
    ]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        for url, content in zip(urls, results):
            print(f"{url}: {len(content)} bytes")

asyncio.run(main())
```

### 异步 WebSocket

```python
import asyncio
import websockets

async def websocket_client():
    """WebSocket 客户端"""
    uri = "ws://localhost:8765"

    async with websockets.connect(uri) as websocket:
        # 发送消息
        await websocket.send("Hello, Server!")

        # 接收消息
        response = await websocket.recv()
        print(f"收到: {response}")

asyncio.run(websocket_client())
```

### 异步服务器

```python
from aiohttp import web

async def handle(request):
    """请求处理器"""
    name = request.match_info.get('name', 'Anonymous')
    text = f"Hello, {name}!"
    return web.Response(text=text)

async def main():
    """创建服务器"""
    app = web.Application()
    app.add_routes([
        web.get('/', handle),
        web.get('/{name}', handle)
    ])

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8080)
    await site.start()

    print("服务器运行在 http://localhost:8080")

    # 保持运行
    await asyncio.Event().wait()

if __name__ == '__main__':
    asyncio.run(main())
```

## 异步最佳实践

::: tip 异步编程建议

1. **避免阻塞**：不要在协程中调用阻塞函数
2. **使用 create_task**：尽早创建任务提高并发
3. **正确关闭**：确保资源正确释放
4. **异常处理**：妥善处理异步异常
5. **避免过度**：不是所有场景都需要异步

::: tip 常见错误

```python
# 错误 1: 在异步函数中使用阻塞调用
async def bad():
    time.sleep(1)  # ❌ 阻塞整个事件循环

async def good():
    await asyncio.sleep(1)  # ✅ 非阻塞

# 错误 2: 忘记 await
async def bad():
    asyncio.sleep(1)  # ❌ 协程对象被忽略

async def good():
    await asyncio.sleep(1)  # ✅ 正确等待

# 错误 3: 在循环中创建任务
async def bad():
    for i in range(10):
        task = asyncio.create_task(coro(i))
        await task  # ❌ 串行执行

async def good():
    tasks = [asyncio.create_task(coro(i)) for i in range(10)]
    await asyncio.gather(*tasks)  # ✅ 并发执行
```

::: tip 调试异步代码

```python
# 启用调试模式
asyncio.run(main(), debug=True)

# 查看任务状态
async def debug_tasks():
    tasks = asyncio.all_tasks()
    for task in tasks:
        print(f"Task: {task.get_name()}, Done: {task.done()}")

# 使用日志
import logging
logging.basicConfig(level=logging.DEBUG)

# 链式异常
async def sub_task():
    raise ValueError("子任务错误")

async def main():
    try:
        await asyncio.create_task(sub_task())
    except Exception as e:
        print(f"捕获: {e}")
```

::: tip 性能优化

```python
# 批量处理
async def batch_process(items, batch_size=10):
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        await asyncio.gather(*[process(item) for item in batch])

# 连接池
async def main():
    connector = aiohttp.TCPConnector(limit=100)
    async with aiohttp.ClientSession(connector=connector) as session:
        # 复用连接
        await fetch_many(session, urls)

# 信号量限流
semaphore = asyncio.Semaphore(10)

async def limited_task(url):
    async with semaphore:
        return await fetch(url)
```
