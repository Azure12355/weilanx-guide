---
title: 并发工具
icon: ri:tools-line
order: 4
---

# 并发工具

concurrent.futures 模块提供了高层次的异步执行接口，简化线程池和进程池的使用。

## Executor 接口

### ThreadPoolExecutor

```python
from concurrent.futures import ThreadPoolExecutor
import time

def task(name):
    print(f"Task {name} starting")
    time.sleep(2)
    print(f"Task {name} finished")
    return f"Result {name}"

# 使用线程池
with ThreadPoolExecutor(max_workers=3) as executor:
    # submit 提交任务
    future1 = executor.submit(task, "A")
    future2 = executor.submit(task, "B")
    future3 = executor.submit(task, "C")

    # 获取结果
    print(future1.result())
    print(future2.result())
    print(future3.result())
```

### ProcessPoolExecutor

```python
from concurrent.futures import ProcessPoolExecutor
import time

def cpu_bound_task(n):
    """CPU 密集型任务"""
    result = 0
    for i in range(n):
        result += i ** 2
    return result

if __name__ == "__main__":
    # 使用进程池
    with ProcessPoolExecutor(max_workers=4) as executor:
        futures = []
        for i in range(8):
            future = executor.submit(cpu_bound_task, 100000)
            futures.append(future)

        # 收集结果
        for future in futures:
            print(future.result())
```

## Future 对象

### 基本操作

```python
from concurrent.futures import ThreadPoolExecutor
import time

def task(name, delay):
    time.sleep(delay)
    return f"Task {name} completed"

with ThreadPoolExecutor() as executor:
    future = executor.submit(task, "A", 2)

    # 检查状态
    print(f"Done: {future.done()}")  # False
    print(f"Running: {future.running()}")  # True

    # 等待完成
    result = future.result()
    print(result)
    print(f"Done: {future.done()}")  # True
```

### 回调函数

```python
from concurrent.futures import ThreadPoolExecutor

def task(n):
    return n ** 2

def callback(future):
    """任务完成时调用"""
    result = future.result()
    print(f"Callback received: {result}")

with ThreadPoolExecutor() as executor:
    future = executor.submit(task, 10)
    future.add_done_callback(callback)
    # 主线程可以继续做其他事情
    print("Main thread continues")
```

### 异常处理

```python
from concurrent.futures import ThreadPoolExecutor

def failing_task():
    raise ValueError("Something went wrong")

with ThreadPoolExecutor() as executor:
    future = executor.submit(failing_task)

    try:
        result = future.result()
    except ValueError as e:
        print(f"Caught error: {e}")

    # 检查异常
    if future.exception():
        print(f"Exception occurred: {future.exception()}")
```

## map 方法

### 基本用法

```python
from concurrent.futures import ThreadPoolExecutor
import time

def process_item(item):
    print(f"Processing {item}")
    time.sleep(1)
    return item.upper()

items = ["a", "b", "c", "d", "e"]

with ThreadPoolExecutor(max_workers=3) as executor:
    # map：保持顺序
    results = executor.map(process_item, items)
    for result in results:
        print(result)
# A, B, C, D, E（按顺序）
```

### 并发执行

```python
from concurrent.futures import as_completed, ThreadPoolExecutor
import time

def task(name):
    time.sleep(1)
    return f"Result {name}"

names = ["A", "B", "C", "D", "E"]

with ThreadPoolExecutor(max_workers=3) as executor:
    # submit + as_completed：谁先完成先返回谁
    futures = {executor.submit(task, name): name for name in names}

    for future in as_completed(futures):
        name = futures[future]
        try:
            result = future.result()
            print(f"{name}: {result}")
        except Exception as e:
            print(f"{name} raised exception: {e}")
```

### 超时控制

```python
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import time

def long_task():
    time.sleep(5)
    return "Done"

with ThreadPoolExecutor() as executor:
    future = executor.submit(long_task)

    try:
        result = future.result(timeout=2)
        print(result)
    except TimeoutError:
        print("Task timed out")

    # map 超时
    try:
        results = list(executor.map(long_task, [], timeout=2))
    except TimeoutError:
        print("Map operation timed out")
```

## wait 方法

```python
from concurrent.futures import (
    ThreadPoolExecutor,
    wait,
    ALL_COMPLETED,
    FIRST_COMPLETED,
    FIRST_EXCEPTION
)
import time

def task(name, delay):
    time.sleep(delay)
    if name == "B":
        raise ValueError("Error in B")
    return f"Result {name}"

with ThreadPoolExecutor() as executor:
    futures = [
        executor.submit(task, "A", 3),
        executor.submit(task, "B", 1),
        executor.submit(task, "C", 2),
    ]

    # 等待所有完成
    done, not_done = wait(futures)
    print(f"All completed: {len(done)}")

    # 等待第一个完成
    done, not_done = wait(futures, return_when=FIRST_COMPLETED)
    print(f"First completed: {len(done)}")

    # 等待第一个异常
    done, not_done = wait(futures, return_when=FIRST_EXCEPTION)
    print(f"First exception or all completed")
```

## ExecutorService

### 关闭和等待

```python
from concurrent.futures import ThreadPoolExecutor
import time

def task(n):
    time.sleep(1)
    return n ** 2

executor = ThreadPoolExecutor(max_workers=3)

# 提交任务
futures = [executor.submit(task, i) for i in range(10)]

# 关闭：不再接受新任务
executor.shutdown(wait=False)
print("Executor shutdown")

# 等待所有任务完成
executor.shutdown(wait=True)
print("All tasks completed")
```

### 上下文管理器

```python
from concurrent.futures import ThreadPoolExecutor

# 推荐：使用 with 语句
with ThreadPoolExecutor(max_workers=3) as executor:
    future = executor.submit(lambda: 42)
    result = future.result()
    print(result)
# 自动调用 shutdown
```

## 实际应用

### 并发下载

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

def download_url(url):
    """下载 URL 内容"""
    try:
        response = requests.get(url, timeout=5)
        return {
            "url": url,
            "status": response.status_code,
            "length": len(response.content)
        }
    except Exception as e:
        return {"url": url, "error": str(e)}

urls = [
    "https://www.example.com",
    "https://www.python.org",
    "https://www.github.com",
]

with ThreadPoolExecutor(max_workers=5) as executor:
    # 提交所有下载任务
    futures = {executor.submit(download_url, url): url for url in urls}

    # 处理完成的任务
    for future in as_completed(futures):
        url = futures[future]
        try:
            result = future.result()
            if "error" in result:
                print(f"{url} failed: {result['error']}")
            else:
                print(f"{url}: {result['status']}, {result['length']} bytes")
        except Exception as e:
            print(f"{url} raised exception: {e}")
```

### 并发文件处理

```python
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

def process_file(filepath):
    """处理单个文件"""
    try:
        with open(filepath, "r") as f:
            content = f.read()
            # 做一些处理
            return len(content)
    except Exception as e:
        return 0

def process_directory(directory):
    """处理目录中的所有文件"""
    files = list(Path(directory).glob("*.txt"))

    with ProcessPoolExecutor() as executor:
        results = executor.map(process_file, files)
        total = sum(results)
    return total

if __name__ == "__main__":
    total = process_directory("./data")
    print(f"Total characters: {total}")
```

### 并发 API 请求

```python
from concurrent.futures import ThreadPoolExecutor
import requests

def fetch_api(endpoint):
    """获取 API 端点"""
    url = f"https://api.example.com/{endpoint}"
    try:
        response = requests.get(url, timeout=3)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

endpoints = ["users", "posts", "comments"]

with ThreadPoolExecutor(max_workers=3) as executor:
    results = executor.map(fetch_api, endpoints)
    for endpoint, result in zip(endpoints, results):
        print(f"{endpoint}: {result}")
```

## 性能比较

### ThreadPool vs ProcessPool

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import time

def io_task(n):
    """I/O 密集型任务"""
    time.sleep(0.1)
    return n

def cpu_task(n):
    """CPU 密集型任务"""
    result = 0
    for i in range(100000):
        result += i ** 2
    return result

tasks = list(range(100))

# 测试线程池（I/O 任务）
start = time.time()
with ThreadPoolExecutor() as executor:
    results = list(executor.map(io_task, tasks))
thread_time = time.time() - start

# 测试进程池（I/O 任务）
start = time.time()
with ProcessPoolExecutor() as executor:
    results = list(executor.map(io_task, tasks))
process_io_time = time.time() - start

# 测试线程池（CPU 任务）
start = time.time()
with ThreadPoolExecutor() as executor:
    results = list(executor.map(cpu_task, tasks))
thread_cpu_time = time.time() - start

# 测试进程池（CPU 任务）
start = time.time()
with ProcessPoolExecutor() as executor:
    results = list(executor.map(cpu_task, tasks))
process_cpu_time = time.time() - start

print(f"Thread I/O: {thread_time:.2f}s")
print(f"Process I/O: {process_io_time:.2f}s")
print(f"Thread CPU: {thread_cpu_time:.2f}s")
print(f"Process CPU: {process_cpu_time:.2f}s")
```

## 最佳实践

::: tip Executor 选择

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| I/O 密集型 | ThreadPoolExecutor | 线程轻量，上下文切换快 |
| CPU 密集型 | ProcessPoolExecutor | 绕过 GIL，充分利用多核 |
| 混合任务 | 分别使用 | 根据任务特性选择 |
| 简单并发 | ThreadPoolExecutor | 代码简单，开销小 |

::: tip 线程/进程数设置

```python
import os

# I/O 密集型：线程数 = I/O 等待时间 / CPU 时间 + 1
io_workers = 50

# CPU 密集型：进程数 = CPU 核心数
cpu_workers = os.cpu_count()

# 混合：根据实际情况调整
# 通常使用 CPU 核心数的 2-4 倍
mixed_workers = os.cpu_count() * 2
```

::: tip 资源管理

```python
# ✅ 使用上下文管理器
with ThreadPoolExecutor(max_workers=10) as executor:
    results = executor.map(func, items)
# 自动清理资源

# ✅ 限制并发数
semaphore = threading.Semaphore(10)

def limited_task():
    with semaphore:
        return heavy_operation()

# ✅ 使用队列控制任务流
from queue import Queue
task_queue = Queue(maxsize=100)
```

::: tip 错误处理

```python
# ✅ 捕获单个任务异常
with ThreadPoolExecutor() as executor:
    futures = [executor.submit(task, i) for i in range(10)]
    for future in as_completed(futures):
        try:
            result = future.result()
        except Exception as e:
            print(f"Task failed: {e}")

# ✅ 使用 map 异常处理
with ThreadPoolExecutor() as executor:
    results = executor.map(task, items)
    for result in results:
        if isinstance(result, Exception):
            print(f"Error: {result}")
```

::: tip 性能优化

```python
# ✅ 批量提交
batch_size = 100
for i in range(0, len(items), batch_size):
    batch = items[i:i+batch_size]
    results = executor.map(func, batch)

# ✅ 使用 chunksize（map）
results = executor.map(
    func,
    large_list,
    chunksize=100
)

# ✅ 避免过度创建
# 不要为每个小任务创建新 executor
# 重用同一个 executor
```

::: warning 常见陷阱

```python
# ❌ 忘记关闭 executor
executor = ThreadPoolExecutor()
executor.submit(task)
# 程序可能不会退出

# ✅ 使用 shutdown 或 with
with ThreadPoolExecutor() as executor:
    executor.submit(task)

# ❌ 在主进程外创建 ProcessPoolExecutor
# Windows 需要 if __name__ == "__main__"

# ❌ 共享不可序列化的对象
def task():
    return database_connection.query()  # 错误
