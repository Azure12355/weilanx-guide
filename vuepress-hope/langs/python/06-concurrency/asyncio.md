---
title: 异步编程
icon: ri:timer-flash-line
order: 3
---

# 异步编程

asyncio 是 Python 3.4+ 的异步 I/O 库，使用 async/await 语法实现协程，适合高并发 I/O 操作。

## 协程基础

### async/await 语法

```python
import asyncio

async def greet(name):
    """定义协程"""
    print(f"Hello, {name}!")
    await asyncio.sleep(1)  # 异步等待
    print(f"Goodbye, {name}!")
    return f"Greeted {name}"

# 运行协程
async def main():
    result = await greet("Alice")
    print(result)

# Python 3.7+
asyncio.run(main())

# 旧版本
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

### 创建任务

```python
import asyncio

async def fetch_data(id):
    print(f"Fetching data {id}")
    await asyncio.sleep(1)
    return f"Data {id}"

async def main():
    # 创建任务
    task1 = asyncio.create_task(fetch_data(1))
    task2 = asyncio.create_task(fetch_data(2))

    # 等待任务完成
    result1 = await task1
    result2 = await task2

    print(result1, result2)

asyncio.run(main())
```

## 并发执行

### gather

```python
import asyncio

async def task(name, delay):
    print(f"{name} started")
    await asyncio.sleep(delay)
    print(f"{name} finished")
    return f"{name} result"

async def main():
    # 并发执行多个协程
    results = await asyncio.gather(
        task("A", 2),
        task("B", 1),
        task("C", 3),
    )
    print(results)

asyncio.run(main())
```

### wait

```python
import asyncio

async def task(name, delay):
    await asyncio.sleep(delay)
    return f"{name} done"

async def main():
    tasks = [
        asyncio.create_task(task("A", 1)),
        asyncio.create_task(task("B", 2)),
        asyncio.create_task(task("C", 3)),
    ]

    # 等待所有任务完成
    done, pending = await asyncio.wait(tasks)
    for task in done:
        print(task.result())

asyncio.run(main())
```

### wait_for

```python
import asyncio

async def slow_operation():
    await asyncio.sleep(5)
    return "Done"

async def main():
    try:
        # 等待最多 2 秒
        result = await asyncio.wait_for(slow_operation(), timeout=2.0)
        print(result)
    except asyncio.TimeoutError:
        print("Operation timed out")

asyncio.run(main())
```

## 异步生成器

```python
import asyncio

async def async_range(n):
    """异步生成器"""
    for i in range(n):
        await asyncio.sleep(0.5)
        yield i

async def main():
    # 使用异步生成器
    async for num in async_range(5):
        print(num)

    # 异步列表推导
    result = [num async for num in async_range(5)]
    print(result)

asyncio.run(main())
```

## 异步上下文管理器

```python
import asyncio

class AsyncResource:
    async def __aenter__(self):
        print("Acquiring resource")
        await asyncio.sleep(0.5)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Releasing resource")
        await asyncio.sleep(0.5)

async def main():
    async with AsyncResource() as resource:
        print("Using resource")

asyncio.run(main())
```

## 异步迭代器

```python
import asyncio

class AsyncIterator:
    def __init__(self, stop):
        self.stop = stop
        self.current = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.current < self.stop:
            await asyncio.sleep(0.5)
            value = self.current
            self.current += 1
            return value
        raise StopAsyncIteration

async def main():
    async for num in AsyncIterator(5):
        print(num)

asyncio.run(main())
```

## 异步函数

### 阻塞 vs 非阻塞

```python
import asyncio
import time

# ❌ 同步阻塞（阻塞事件循环）
def blocking_call():
    time.sleep(2)  # 阻塞整个事件循环
    return "Done"

# ✅ 异步非阻塞
async def non_blocking_call():
    await asyncio.sleep(2)  # 只阻塞当前协程
    return "Done"

# 在异步代码中运行阻塞函数
async def main():
    # 方法 1：在线程池中运行
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, blocking_call)
    print(result)

asyncio.run(main())
```

### run_in_executor

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

def blocking_io():
    """模拟阻塞 I/O"""
    import time
    time.sleep(2)
    return "IO result"

async def main():
    # 在线程池中运行阻塞 I/O
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(
            pool,
            blocking_io
        )
        print(result)

asyncio.run(main())
```

## 流式 I/O

### 读写流

```python
import asyncio

async def write_to_file(filename, data):
    """异步写入文件"""
    async with asyncio.aiofiles.open(filename, 'w') as f:
        await f.write(data)

async def read_from_file(filename):
    """异步读取文件"""
    async with asyncio.aiofiles.open(filename, 'r') as f:
        content = await f.read()
        return content

# 使用 aiofiles 库
# pip install aiofiles
```

### 网络流

```python
import asyncio

async def handle_client(reader, writer):
    """处理客户端连接"""
    addr = writer.get_extra_info('peername')
    print(f"Connected from {addr}")

    while True:
        data = await reader.read(100)
        if not data:
            break
        message = data.decode()
        print(f"Received: {message}")
        writer.write(data)
        await writer.drain()

    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(
        handle_client,
        '127.0.0.1',
        8888
    )
    async with server:
        await server.serve_forever()

# asyncio.run(main())
```

## 异步锁和同步原语

### Lock

```python
import asyncio

lock = asyncio.Lock()

async def worker(name):
    async with lock:
        print(f"{name} acquired lock")
        await asyncio.sleep(1)
        print(f"{name} released lock")

async def main():
    await asyncio.gather(
        worker("A"),
        worker("B"),
        worker("C")
    )

asyncio.run(main())
```

### Event

```python
import asyncio

event = asyncio.Event()

async def waiter(name):
    print(f"{name} waiting")
    await event.wait()
    print(f"{name} got event")

async def setter():
    await asyncio.sleep(2)
    print("Setting event")
    event.set()

async def main():
    await asyncio.gather(
        waiter("A"),
        waiter("B"),
        setter()
    )

asyncio.run(main())
```

### Queue

```python
import asyncio

async def producer(queue):
    for i in range(5):
        await asyncio.sleep(0.5)
        item = f"item-{i}"
        await queue.put(item)
        print(f"Produced {item}")
    await queue.put("DONE")

async def consumer(queue):
    while True:
        item = await queue.get()
        if item == "DONE":
            queue.task_done()
            break
        await asyncio.sleep(1)
        print(f"Consumed {item}")
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=3)
    await asyncio.gather(
        producer(queue),
        consumer(queue)
    )

asyncio.run(main())
```

## 信号量

```python
import asyncio

semaphore = asyncio.Semaphore(3)  # 最多 3 个并发

async def worker(worker_id):
    async with semaphore:
        print(f"Worker {worker_id} acquired")
        await asyncio.sleep(2)
        print(f"Worker {worker_id} released")

async def main():
    tasks = [worker(i) for i in range(10)]
    await asyncio.gather(*tasks)

asyncio.run(main())
```

## 异步 HTTP 客户端

### aiohttp

```python
import aiohttp
import asyncio

async def fetch(session, url):
    """异步获取 URL"""
    async with session.get(url) as response:
        return await response.text()

async def main():
    urls = [
        "https://httpbin.org/get",
        "https://httpbin.org/delay/1",
        "https://httpbin.org/json",
    ]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        for result in results:
            print(len(result))

asyncio.run(main())
```

### 异步 POST 请求

```python
import aiohttp
import asyncio

async def post_data(session, url, data):
    """异步 POST 请求"""
    async with session.post(url, json=data) as response:
        return await response.json()

async def main():
    url = "https://httpbin.org/post"
    data = {"key": "value"}

    async with aiohttp.ClientSession() as session:
        result = await post_data(session, url, data)
        print(result)

asyncio.run(main())
```

## 异步最佳实践

::: tip 何时使用 asyncio

1. **高并发 I/O**：网络请求、数据库操作
2. **实时应用**：WebSocket、聊天服务器
3. **微服务**：API 网关、代理服务
4. **爬虫**：异步网页抓取

::: tip 避免使用 asyncio

1. **CPU 密集型**：使用多进程
2. **简单脚本**：同步代码更简单
3. **阻塞操作**：无法异步化的操作

::: tip 最佳实践

```python
# ✅ 使用 asyncio.gather 并发执行
results = await asyncio.gather(
    fetch_url(url1),
    fetch_url(url2),
    fetch_url(url3)
)

# ✅ 使用 create_task 提前调度
task = asyncio.create_task(slow_operation())
# 做其他事情
result = await task

# ✅ 使用超时控制
try:
    result = await asyncio.wait_for(operation(), timeout=5.0)
except asyncio.TimeoutError:
    print("Operation timed out")

# ❌ 不要在异步函数中使用阻塞操作
async def bad():
    time.sleep(1)  # 阻塞事件循环

# ✅ 使用异步版本
async def good():
    await asyncio.sleep(1)  # 非阻塞
```

::: tip 调试异步代码

```python
# 启用调试模式
asyncio.run(main(), debug=True)

# 查看任务状态
async def main():
    task = asyncio.create_task(some_coro())
    print(task.done())  # 是否完成
    print(task.cancelled())  # 是否被取消
    print(task.exception())  # 异常信息

# 使用 asyncio.TaskGroup (Python 3.11+)
async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(task1())
        tg.create_task(task2())
        # 自动等待并处理异常
```

::: tip 性能优化

1. **连接池**：复用 HTTP 连接
2. **限制并发**：使用 Semaphore 控制并发数
3. **批量操作**：使用 gather 批量执行
4. **缓存结果**：避免重复请求

::: warning 常见陷阱

```python
# ❌ 忘记 await
async def bad():
    result = fetch_data()  # 忘记 await
    print(result)  # Coroutine object

# ✅ 正确使用 await
async def good():
    result = await fetch_data()
    print(result)

# ❌ 在普通函数中调用协程
def bad():
    fetch_data()  # 不执行

# ✅ 使用 asyncio.run
def good():
    asyncio.run(fetch_data())
```
