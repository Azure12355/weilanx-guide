---
title: 多进程
icon: ri:cpu-line
order: 2
---

# 多进程

Python 的 multiprocessing 模块提供了多进程支持，绕过 GIL 限制，适合 CPU 密集型任务。

## 进程基础

### 创建进程

```python
import multiprocessing
import time

def worker(name):
    """进程工作函数"""
    print(f"Worker {name} starting")
    time.sleep(2)
    print(f"Worker {name} finished")

if __name__ == "__main__":
    # 创建进程
    p1 = multiprocessing.Process(target=worker, args=("A",))
    p2 = multiprocessing.Process(target=worker, args=("B",))

    # 启动进程
    p1.start()
    p2.start()

    # 等待进程完成
    p1.join()
    p2.join()

    print("All workers finished")
```

### 进程子类

```python
import multiprocessing
import time

class WorkerProcess(multiprocessing.Process):
    def __init__(self, name):
        super().__init__()
        self.name = name

    def run(self):
        """进程执行的内容"""
        print(f"Process {self.name} starting (PID: {self.pid})")
        time.sleep(2)
        print(f"Process {self.name} finished")

if __name__ == "__main__":
    process = WorkerProcess("Worker-1")
    process.start()
    process.join()
```

## 进程间通信

### Queue（队列）

```python
import multiprocessing

def producer(queue):
    for i in range(5):
        item = f"item-{i}"
        queue.put(item)
        print(f"Produced {item}")
    queue.put("DONE")

def consumer(queue):
    while True:
        item = queue.get()
        if item == "DONE":
            break
        print(f"Consumed {item}")

if __name__ == "__main__":
    queue = multiprocessing.Queue()
    p = multiprocessing.Process(target=producer, args=(queue,))
    c = multiprocessing.Process(target=consumer, args=(queue,))
    p.start()
    c.start()
    p.join()
    c.join()
```

### Pipe（管道）

```python
import multiprocessing

def sender(conn):
    """发送端"""
    conn.send("Hello")
    conn.send([1, 2, 3])
    conn.close()

def receiver(conn):
    """接收端"""
    try:
        while True:
            data = conn.recv()
            print(f"Received: {data}")
    except EOFError:
        print("Connection closed")

if __name__ == "__main__":
    # 创建双向管道
    parent_conn, child_conn = multiprocessing.Pipe()

    p = multiprocessing.Process(target=sender, args=(child_conn,))
    p.start()

    # 主进程接收
    try:
        while True:
            data = parent_conn.recv()
            print(f"Main received: {data}")
    except EOFError:
        pass

    p.join()
```

### 共享内存

```python
import multiprocessing

def worker(value, array):
    """修改共享内存"""
    value.value = 42
    for i in range(len(array)):
        array[i] = array[i] * 2

if __name__ == "__main__":
    # 共享值
    value = multiprocessing.Value("i", 0)

    # 共享数组
    array = multiprocessing.Array("i", [1, 2, 3, 4, 5])

    p = multiprocessing.Process(target=worker, args=(value, array))
    p.start()
    p.join()

    print(f"Value: {value.value}")
    print(f"Array: {list(array)}")
    # Value: 42
    # Array: [2, 4, 6, 8, 10]
```

### Manager（高级共享）

```python
import multiprocessing

def worker(shared_dict, shared_list):
    shared_dict["key"] = "value"
    shared_list.append(1)
    shared_list.append(2)
    shared_list.append(3)

if __name__ == "__main__":
    with multiprocessing.Manager() as manager:
        # 创建共享对象
        shared_dict = manager.dict()
        shared_list = manager.list()

        p = multiprocessing.Process(
            target=worker,
            args=(shared_dict, shared_list)
        )
        p.start()
        p.join()

        print(shared_dict)  # {'key': 'value'}
        print(shared_list)  # [1, 2, 3]
```

## 进程池

### Pool 基础

```python
import multiprocessing
import time

def task(name):
    print(f"Task {name} starting")
    time.sleep(2)
    print(f"Task {name} finished")
    return f"Result {name}"

if __name__ == "__main__":
    # 创建进程池
    with multiprocessing.Pool(processes=4) as pool:
        # apply：同步执行
        result = pool.apply(task, args=("A",))
        print(result)

        # apply_async：异步执行
        async_result = pool.apply_async(task, args=("B",))
        result = async_result.get()  # 获取结果
        print(result)

        # map：批量同步执行
        results = pool.map(task, ["C", "D", "E"])
        print(results)

        # map_async：批量异步执行
        async_results = pool.map_async(task, ["F", "G", "H"])
        results = async_results.get()
        print(results)
```

### Pool 方法

```python
import multiprocessing

def square(x):
    return x ** 2

if __name__ == "__main__":
    with multiprocessing.Pool() as pool:
        # map：保持顺序
        results = pool.map(square, range(10))
        print(results)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

        # imap：迭代器版本
        for result in pool.imap(square, range(5)):
            print(result)

        # imap_unordered：不保证顺序
        for result in pool.imap_unordered(square, range(5)):
            print(result)

        # starmap：解包参数
        results = pool.starmap(
            lambda x, y: x + y,
            [(1, 2), (3, 4), (5, 6)]
        )
        print(results)  # [3, 7, 11]
```

### 回调函数

```python
import multiprocessing

def task(x):
    return x ** 2

def callback(result):
    print(f"Callback received: {result}")

def error_callback(error):
    print(f"Error occurred: {error}")

if __name__ == "__main__":
    with multiprocessing.Pool() as pool:
        # 添加回调
        async_result = pool.apply_async(
            task,
            args=(5,),
            callback=callback,
            error_callback=error_callback
        )
        async_result.wait()
```

## 进程同步

### Lock（锁）

```python
import multiprocessing

def worker(lock, shared_value):
    with lock:
        shared_value.value += 1

if __name__ == "__main__":
    lock = multiprocessing.Lock()
    value = multiprocessing.Value("i", 0)

    processes = []
    for _ in range(10):
        p = multiprocessing.Process(
            target=worker,
            args=(lock, value)
        )
        processes.append(p)
        p.start()

    for p in processes:
        p.join()

    print(value.value)  # 10
```

### 其他同步原语

```python
import multiprocessing
import time

# Semaphore
semaphore = multiprocessing.Semaphore(3)

# Event
event = multiprocessing.Event()

# Condition
condition = multiprocessing.Condition()

# Barrier
barrier = multiprocessing.Barrier(3)
```

## 进程数据共享

### Value 和 Array

```python
import multiprocessing

def modify_data(value, array):
    value.value = 100
    for i in range(len(array)):
        array[i] = i * 10

if __name__ == "__main__":
    # Value: 类型代码 + 初始值
    # 类型代码: 'i'(int), 'f'(float), 'd'(double), 'c'(char)
    value = multiprocessing.Value("i", 0)

    # Array: 类型代码 + 初始值列表
    array = multiprocessing.Array("i", [0] * 5)

    p = multiprocessing.Process(
        target=modify_data,
        args=(value, array)
    )
    p.start()
    p.join()

    print(value.value)
    print(list(array))
```

### 类型代码

| 代码 | 类型 | 代码 | 类型 |
|------|------|------|------|
| 'b' | signed char | 'B' | unsigned char |
| 'h' | signed short | 'H' | unsigned short |
| 'i' | signed int | 'I' | unsigned int |
| 'l' | signed long | 'L' | unsigned long |
| 'q' | signed long long | 'Q' | unsigned long long |
| 'f' | float | 'd' | double |

## 进程池进阶

### 超时控制

```python
import multiprocessing
import time

def long_task(x):
    time.sleep(x)
    return x

if __name__ == "__main__":
    with multiprocessing.Pool() as pool:
        # apply_async 超时
        async_result = pool.apply_async(long_task, args=(10,))
        try:
            result = async_result.get(timeout=3)
            print(result)
        except multiprocessing.TimeoutError:
            print("Task timed out")

        # map_async 超时
        async_result = pool.map_async(long_task, [1, 2, 10, 4])
        try:
            results = async_result.get(timeout=3)
            print(results)
        except multiprocessing.TimeoutError:
            print("Some tasks timed out")
```

### 异常处理

```python
import multiprocessing

def failing_task(x):
    if x == 5:
        raise ValueError("Invalid value")
    return x ** 2

if __name__ == "__main__":
    with multiprocessing.Pool() as pool:
        try:
            results = pool.map(failing_task, range(10))
        except Exception as e:
            print(f"Error in pool: {e}")

        # 使用 apply_async 捕获异常
        async_result = pool.apply_async(failing_task, args=(5,))
        try:
            result = async_result.get()
        except ValueError as e:
            print(f"Caught error: {e}")
```

## 进程调试

### 进程信息

```python
import multiprocessing
import os

def info(title):
    print(title)
    print(f"Module name: {__name__}")
    print(f"Parent process: {os.getppid()}")
    print(f"Process id: {os.getpid()}")

if __name__ == "__main__":
    info("Main line")
    p = multiprocessing.Process(target=info, args=("Function",))
    p.start()
    p.join()
```

### 日志记录

```python
import multiprocessing
import logging

def worker():
    logger = logging.getLogger()
    logger.info("Worker starting")

if __name__ == "__main__":
    # 配置日志
    logging.basicConfig(
        level=logging.INFO,
        format="%(processName)s: %(message)s"
    )

    p = multiprocessing.Process(target=worker)
    p.start()
    p.join()
```

## 多进程最佳实践

::: tip 何时使用多进程

1. **CPU 密集型**：绕过 GIL 限制
2. **隔离需求**：进程间完全隔离
3. **崩溃隔离**：一个进程崩溃不影响其他
4. **多核利用**：充分利用多核 CPU

::: tip 进程 vs 线程选择

| 场景 | 推荐方案 |
|------|----------|
| CPU 密集型 | 多进程 |
| I/O 密集型 | 多线程 / asyncio |
| 需要隔离 | 多进程 |
| 共享数据 | 多线程 |
| 简单并发 | 多线程 |

::: tip 性能优化

```python
# ❌ 创建过多进程
with Pool(processes=100) as pool:  # 过多
    pass

# ✅ 根据 CPU 核心数
import os
cpu_count = os.cpu_count()
with Pool(processes=cpu_count) as pool:
    pass

# ✅ 使用 chunksize 提高效率
with Pool() as pool:
    results = pool.map(func, large_list, chunksize=100)
```

::: warning 常见陷阱

```python
# ❌ 忘记 if __name__ == "__main__"
# 会导致递归创建进程

# ✅ 正确写法
if __name__ == "__main__":
    p = Process(target=func)
    p.start()
    p.join()

# ❌ 共享大对象（序列化开销）
def worker(large_data):
    pass

# ✅ 使用共享内存或文件
def worker(shared_array):
    pass
```

::: tip 内存管理

1. **及时 join**：避免僵尸进程
2. **使用 Pool**：自动管理进程
3. **限制数量**：不要创建过多进程
4. **清理资源**：关闭队列、管道等

::: tip 调试技巧

1. **减少进程数**：调试时使用 1-2 个进程
2. **日志记录**：每个进程独立日志
3. **简化任务**：隔离问题
4. **使用 pdb**：单进程调试
