---
title: 多线程
icon: ri:thread-line
order: 1
---

# 多线程

Python 的 threading 模块提供了多线程支持，适合 I/O 密集型任务。

## 线程基础

### 创建线程

```python
import threading
import time

def worker(name):
    """线程工作函数"""
    print(f"Worker {name} starting")
    time.sleep(2)
    print(f"Worker {name} finished")

# 创建线程
t1 = threading.Thread(target=worker, args=("A",))
t2 = threading.Thread(target=worker, args=("B",))

# 启动线程
t1.start()
t2.start()

# 等待线程完成
t1.join()
t2.join()

print("All workers finished")
```

### 线程子类

```python
import threading
import time

class WorkerThread(threading.Thread):
    def __init__(self, name):
        super().__init__()
        self.name = name

    def run(self):
        """线程执行的内容"""
        print(f"Thread {self.name} starting")
        time.sleep(2)
        print(f"Thread {self.name} finished")

# 使用
thread = WorkerThread("Worker-1")
thread.start()
thread.join()
```

## 线程同步

### Lock（锁）

```python
import threading

lock = threading.Lock()
counter = 0

def increment():
    global counter
    for _ in range(100000):
        with lock:  # 自动获取和释放锁
            counter += 1

threads = []
for _ in range(10):
    t = threading.Thread(target=increment)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(counter)  # 1000000
```

### RLock（可重入锁）

```python
import threading

lock = threading.RLock()

def recursive_function(n):
    with lock:
        if n > 0:
            print(f"Recursive call {n}")
            recursive_function(n - 1)

# RLock 允许同一线程多次获取锁
recursive_function(5)
```

### Condition（条件变量）

```python
import threading
import time
import random

buffer = []
buffer_size = 5
condition = threading.Condition()

def producer():
    for i in range(10):
        with condition:
            while len(buffer) >= buffer_size:
                print("Buffer full, producer waiting")
                condition.wait()
            item = f"item-{i}"
            buffer.append(item)
            print(f"Produced {item}")
            condition.notify_all()
        time.sleep(random.random())

def consumer():
    for i in range(10):
        with condition:
            while len(buffer) == 0:
                print("Buffer empty, consumer waiting")
                condition.wait()
            item = buffer.pop(0)
            print(f"Consumed {item}")
            condition.notify_all()
        time.sleep(random.random())

p = threading.Thread(target=producer)
c = threading.Thread(target=consumer)
p.start()
c.start()
p.join()
c.join()
```

### Semaphore（信号量）

```python
import threading
import time

# 允许最多 3 个线程同时访问
semaphore = threading.Semaphore(3)

def worker(worker_id):
    print(f"Worker {worker_id} trying to acquire")
    with semaphore:
        print(f"Worker {worker_id} acquired")
        time.sleep(2)
        print(f"Worker {worker_id} releasing")

# 创建多个线程
threads = []
for i in range(10):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

### Event（事件）

```python
import threading
import time

event = threading.Event()

def waiter():
    print("Waiter waiting for event")
    event.wait()  # 等待事件被设置
    print("Waiter detected event")

def setter():
    time.sleep(2)
    print("Setter setting event")
    event.set()  # 设置事件

t1 = threading.Thread(target=waiter)
t2 = threading.Thread(target=setter)
t1.start()
t2.start()
t1.join()
t2.join()
```

### Barrier（栅栏）

```python
import threading
import time

barrier = threading.Barrier(3)  # 等待 3 个线程

def worker(worker_id):
    print(f"Worker {worker_id} starting")
    time.sleep(worker_id)
    print(f"Worker {worker_id} waiting at barrier")
    barrier.wait()  # 等待其他线程
    print(f"Worker {worker_id} passed barrier")

threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

## 线程间通信

### Queue（队列）

```python
import threading
import queue
import time

q = queue.Queue()

def producer():
    for i in range(5):
        item = f"item-{i}"
        q.put(item)
        print(f"Produced {item}")
        time.sleep(0.5)

def consumer():
    while True:
        item = q.get()
        if item == "DONE":
            break
        print(f"Consumed {item}")
        time.sleep(1)
        q.task_done()

p = threading.Thread(target=producer)
c = threading.Thread(target=consumer)
p.start()
c.start()
p.join()
q.put("DONE")
c.join()
```

### 线程本地数据

```python
import threading

# 创建线程本地数据
local_data = threading.local()

def worker():
    local_data.value = 0
    for i in range(5):
        local_data.value += i
    print(f"Thread {threading.current_thread().name}: {local_data.value}")

threads = []
for i in range(3):
    t = threading.Thread(target=worker)
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

## 线程池

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
    # 提交任务
    future1 = executor.submit(task, "A")
    future2 = executor.submit(task, "B")
    future3 = executor.submit(task, "C")

    # 获取结果
    print(future1.result())
    print(future2.result())
    print(future3.result())

# 批量提交
with ThreadPoolExecutor(max_workers=3) as executor:
    tasks = ["A", "B", "C", "D", "E"]
    results = executor.map(task, tasks)
    for result in results:
        print(result)

# 使用 as_completed
from concurrent.futures import as_completed

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = {executor.submit(task, name): name for name in ["A", "B", "C"]}
    for future in as_completed(futures):
        name = futures[future]
        try:
            result = future.result()
            print(f"{name}: {result}")
        except Exception as e:
            print(f"{name} raised exception: {e}")
```

## 线程安全的数据结构

```python
import threading
from queue import Queue

# Queue 是线程安全的
q = Queue()
q.put(1)
q.put(2)
print(q.get())  # 1

# deque 用于简单场景
from collections import deque
from threading import Lock

class ThreadSafeDeque:
    def __init__(self):
        self.deque = deque()
        self.lock = Lock()

    def append(self, item):
        with self.lock:
            self.deque.append(item)

    def popleft(self):
        with self.lock:
            return self.deque.popleft() if self.deque else None
```

## GIL（全局解释器锁）

### GIL 的影响

```python
import threading
import time

# CPU 密集型任务（受 GIL 限制）
def cpu_bound_task(n):
    while n > 0:
        n -= 1

# I/O 密集型任务（不受 GIL 影响）
def io_bound_task():
    time.sleep(1)

# CPU 密集型：多线程没有优势
start = time.time()
t1 = threading.Thread(target=cpu_bound_task, args=(100000000,))
t2 = threading.Thread(target=cpu_bound_task, args=(100000000,))
t1.start()
t2.start()
t1.join()
t2.join()
print(f"Multi-thread: {time.time() - start:.2f}s")

# I/O 密集型：多线程有优势
start = time.time()
threads = [threading.Thread(target=io_bound_task) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(f"Multi-thread I/O: {time.time() - start:.2f}s")
```

### 绕过 GIL

```python
# 使用 multiprocessing 而不是 threading
from multiprocessing import Process

def cpu_bound(n):
    while n > 0:
        n -= 1

p1 = Process(target=cpu_bound, args=(100000000,))
p2 = Process(target=cpu_bound, args=(100000000,))
p1.start()
p2.start()
p1.join()
p2.join()

# 或使用 C 扩展/numpy 等（释放 GIL）
import numpy as np
```

## 线程调试

### 线程信息

```python
import threading

def show_threads():
    print(f"Active threads: {threading.active_count()}")
    for thread in threading.enumerate():
        print(f"- {thread.name} (daemon: {thread.daemon})")

def worker():
    print(f"Worker: {threading.current_thread().name}")
    print(f"Thread ID: {threading.get_ident()}")

show_threads()
t = threading.Thread(target=worker, name="MyWorker")
t.start()
t.join()
```

### 超时控制

```python
import threading
import time

def long_task():
    time.sleep(10)
    return "Done"

t = threading.Thread(target=long_task)
t.start()
t.join(timeout=3)  # 等待最多 3 秒

if t.is_alive():
    print("Thread still running after timeout")
else:
    print("Thread finished")
```

## 线程最佳实践

::: tip 何时使用多线程

1. **I/O 密集型**：网络请求、文件读写
2. **用户界面**：保持响应性
3. **简单并发**：代码结构简单
4. **共享内存**：线程间共享数据容易

::: tip 避免使用多线程

1. **CPU 密集型**：受 GIL 限制
2. **复杂同步**：锁竞争降低性能
3. **需要隔离**：进程更安全

::: tip 多进程 vs 多线程

| 特性 | 多进程 | 多线程 |
|------|--------|--------|
| CPU 密集型 | ✅ 优秀 | ❌ 受 GIL 限制 |
| I/O 密集型 | ✅ 良好 | ✅ 优秀 |
| 内存隔离 | ✅ 进程隔离 | ❌ 共享内存 |
| 创建开销 | ❌ 较高 | ✅ 较低 |
| 通信 | ❌ 复杂 | ✅ 简单 |

::: warning 常见陷阱

```python
# ❌ 死锁
lock1 = threading.Lock()
lock2 = threading.Lock()

def thread1():
    with lock1:
        with lock2:  # 可能死锁
            pass

def thread2():
    with lock2:
        with lock1:  # 可能死锁
            pass

# ✅ 固定加锁顺序
def thread1():
    with lock1:
        with lock2:
            pass

def thread2():
    with lock1:  # 相同顺序
        with lock2:
            pass
```

::: tip 性能建议

1. **避免过多线程**：通常 CPU 核心数的 2-4 倍
2. **使用线程池**：ThreadPoolExecutor 管理线程
3. **减少锁粒度**：只保护必要的代码
4. **使用无锁结构**：Queue、threading.local 等
5. **考虑异步**：asyncio 比 threading 更轻量
