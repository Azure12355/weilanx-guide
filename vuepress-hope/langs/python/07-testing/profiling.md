---
title: 性能分析
icon: ri:speed-line
order: 3
---

# 性能分析

性能分析是识别代码瓶颈、优化执行效率的重要过程。

## 时间分析

### time 模块

```python
import time

def measure_time(func):
    """测量函数执行时间"""
    start = time.time()
    result = func()
    end = time.time()
    elapsed = end - start
    print(f"{func.__name__} took {elapsed:.6f}s")
    return result

def measure_time_precise(func):
    """高精度时间测量"""
    start = time.perf_counter()
    result = func()
    end = time.perf_counter()
    elapsed = end - start
    print(f"{func.__name__} took {elapsed:.6f}s")
    return result

# 使用
def slow_function():
    time.sleep(0.1)
    return sum(range(1000000))

measure_time(slow_function)
```

### timeit 模块

```python
import timeit

# 测量代码执行时间
code = """
sum(range(1000))
"""

# 执行 n 次
time_taken = timeit.timeit(code, number=1000)
print(f"Total: {time_taken:.6f}s")
print(f"Average: {time_taken/1000:.6f}s")

# 重复测量
times = timeit.repeat(code, number=1000, repeat=5)
print(f"Times: {times}")
print(f"Min: {min(times):.6f}s")
print(f"Max: {max(times):.6f}s")

# 测量函数
def test_function():
    return sum(range(1000))

time_taken = timeit.timeit(
    test_function,
    number=1000
)
print(f"Function took: {time_taken:.6f}s")
```

### 装饰器计时

```python
import time
from functools import wraps

def timeit_decorator(func):
    """计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__}: {end - start:.6f}s")
        return result
    return wrapper

@timeit_decorator
def example_function():
    time.sleep(0.1)
    return sum(range(100000))
```

## cProfile 分析

### 基本使用

```python
import cProfile

def function_to_profile():
    result = []
    for i in range(100000):
        result.append(i ** 2)
    return sum(result)

# 分析函数
cProfile.run("function_to_profile()")

# 保存到文件
cProfile.run("function_to_profile()", "profile_output")

# 命令行分析
# python -m cProfile -o profile_output script.py
```

### pstats 分析

```python
import pstats

# 读取分析结果
stats = pstats.Stats("profile_output")

# 按累积时间排序
stats.strip_dirs()
stats.sort_stats("cumulative")
stats.print_stats(10)  # 打印前 10 个函数

# 按函数自身时间排序
stats.sort_stats("time")
stats.print_stats(10)

# 按调用次数排序
stats.sort_stats("calls")
stats.print_stats(10)

# 只显示特定函数
stats.print_callers("function_name")
stats.print_callees("function_name")
```

### 分析结果解读

```
ncalls  tottime  percall  cumtime  percall filename:lineno(function)
   5    0.001    0.000    0.001    0.000 example.py:10(func1)
 100    0.002    0.000    0.003    0.000 example.py:20(func2)
```

| 列 | 含义 |
|------|------|
| ncalls | 调用次数 |
| tottime | 函数自身时间（不含子函数） |
| percall | 每次调用的自身时间 |
| cumtime | 累积时间（含子函数） |
| percall | 每次调用的累积时间 |

## 行级分析

### line_profiler

```bash
# 安装
pip install line_profiler

# 使用
```

```python
# 在函数前添加 @profile 装饰器
@profile
def process_data(data):
    result = []
    for item in data:
        processed = item * 2
        result.append(processed)
    return sum(result)

# 命令行分析
# kernprof -l -v script.py
```

```
输出示例：
Timer unit: 1e-06 s

Total time: 0.001 s
File: script.py
Function: process_data at line 1

Line #      Hits         Time  Per Hit   % Time  Line Contents
==============================================================
     1                                           @profile
     2                                           def process_data(data):
     3         1            2      2.0      0.2      result = []
     4    100001        10000      0.1     99.8      for item in data:
     5    100000          500      0.0      5.0          processed = item * 2
     6    100000          400      0.0      4.0          result.append(processed)
     7         1            1      1.0      0.1      return sum(result)
```

## 内存分析

### memory_profiler

```bash
# 安装
pip install memory_profiler

# 使用
```

```python
from memory_profiler import profile

@profile
def memory_intensive_function():
    data = [x for x in range(1000000)]
    result = sum(data)
    return result

# 命令行分析
# python -m memory_profiler script.py
```

```
输出示例：
Filename: script.py

Line #    Mem usage    Increment  Occurrences   Line Contents
============================================================
     1     50.0 MiB     50.0 MiB           1   @profile
     2                                         def memory_intensive_function():
     3     78.1 MiB     28.1 MiB           1       data = [x for x in range(1000000)]
     4     78.1 MiB      0.0 MiB           1       result = sum(data)
     5     78.1 MiB      0.0 MiB           1       return result
```

### tracemalloc

```python
import tracemalloc

def trace_memory():
    """跟踪内存分配"""
    tracemalloc.start()

    # 执行代码
    data = [x for x in range(1000000)]

    # 获取当前内存快照
    snapshot = tracemalloc.take_snapshot()
    top_stats = snapshot.statistics("lineno")

    # 打印前 10 个
    for stat in top_stats[:10]:
        print(stat)

    tracemalloc.stop()

trace_memory()
```

### 内存对象跟踪

```python
import gc
import sys

def get_objects_count():
    """获取各类对象数量"""
    objects = gc.get_objects()
    type_count = {}

    for obj in objects:
        obj_type = type(obj).__name__
        type_count[obj_type] = type_count.get(obj_type, 0) + 1

    # 按数量排序
    sorted_types = sorted(
        type_count.items(),
        key=lambda x: x[1],
        reverse=True
    )

    for obj_type, count in sorted_types[:20]:
        print(f"{obj_type}: {count}")

def get_biggest_objects():
    """获取最大的对象"""
    objects = gc.get_objects()
    big_objects = []

    for obj in objects:
        try:
            size = sys.getsizeof(obj)
            if size > 1024:  # 大于 1KB
                big_objects.append((obj, size))
        except:
            pass

    # 按大小排序
    big_objects.sort(key=lambda x: x[1], reverse=True)

    for obj, size in big_objects[:10]:
        print(f"{type(obj).__name__}: {size} bytes")
```

## 异步代码分析

### 异步性能测量

```python
import asyncio
import time

async def async_operation():
    await asyncio.sleep(0.1)
    return "Done"

async def measure_async():
    """测量异步操作时间"""
    start = time.perf_counter()
    result = await async_operation()
    end = time.perf_counter()
    print(f"Async operation took: {end - start:.6f}s")
    return result

asyncio.run(measure_async())
```

### 多个协程分析

```python
async def measure_multiple_tasks():
    """测量多个异步任务"""
    start = time.perf_counter()

    # 并发执行
    tasks = [
        async_operation()
        for _ in range(10)
    ]
    results = await asyncio.gather(*tasks)

    end = time.perf_counter()
    print(f"10 tasks took: {end - start:.6f}s")
    return results

asyncio.run(measure_multiple_tasks())
```

## 性能优化技巧

### 算法优化

```python
# ❌ 低效：O(n²)
def find_duplicates_slow(items):
    duplicates = []
    for i, item1 in enumerate(items):
        for j, item2 in enumerate(items):
            if i != j and item1 == item2:
                duplicates.append(item1)
    return duplicates

# ✅ 高效：O(n)
def find_duplicates_fast(items):
    seen = set()
    duplicates = []
    for item in items:
        if item in seen and item not in duplicates:
            duplicates.append(item)
        seen.add(item)
    return duplicates
```

### 数据结构选择

```python
from collections import deque

# ❌ 使用列表作为队列（低效）
queue = []
queue.append(1)        # O(1)
item = queue.pop(0)    # O(n)

# ✅ 使用 deque（高效）
queue = deque()
queue.append(1)        # O(1)
item = queue.popleft()  # O(1)
```

### 生成器表达式

```python
# ❌ 列表（占用内存）
result = [x * 2 for x in range(1000000)]
sum_result = sum(result)

# ✅ 生成器（节省内存）
result = (x * 2 for x in range(1000000))
sum_result = sum(result)
```

### 字符串拼接

```python
# ❌ 低效（创建多个字符串）
result = ""
for item in items:
    result += str(item)

# ✅ 高效（join）
result = "".join(str(item) for item in items)

# ✅ 或使用列表推导
parts = [str(item) for item in items]
result = "".join(parts)
```

### 缓存结果

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    """带缓存的斐波那契"""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 计算非常快
fibonacci(100)
```

## 性能基准测试

### 对比实现

```python
import timeit

def benchmark_implementations():
    """对比不同实现的性能"""

    implementations = {
        "list_append": lambda: [x for x in range(10000)],
        "list_comprehension": lambda: list(range(10000)),
        "generator_to_list": lambda: list(x for x in range(10000)),
    }

    for name, func in implementations.items():
        time_taken = timeit.timeit(func, number=1000)
        print(f"{name}: {time_taken:.6f}s")

benchmark_implementations()
```

### matplotlib 可视化

```python
import matplotlib.pyplot as plt

def plot_performance():
    """绘制性能图表"""
    sizes = [100, 1000, 10000, 100000]
    times_implement1 = []
    times_implement2 = []

    for size in sizes:
        t1 = timeit.timeit(lambda: implement1(size), number=100)
        t2 = timeit.timeit(lambda: implement2(size), number=100)
        times_implement1.append(t1)
        times_implement2.append(t2)

    plt.plot(sizes, times_implement1, label="Implement 1")
    plt.plot(sizes, times_implement2, label="Implement 2")
    plt.xlabel("Input size")
    plt.ylabel("Time (s)")
    plt.legend()
    plt.show()
```

## 性能分析工具

### py-spy（采样分析器）

```bash
# 安装
pip install py-spy

# 采样分析运行中的程序
py-spy top --pid <PID>

# 生成火焰图
py-spy record --pid <PID> -o profile.svg --format svg

# 分析 Python 程序
py-spy run -- python script.py
```

### pyinstrument

```bash
# 安装
pip install pyinstrument

# 使用
pyinstrument script.py

# 或在代码中使用
from pyinstrument import Profiler

profiler = Profiler()
profiler.start()

# 执行代码
your_function()

profiler.stop()
profiler.print()
```

### snakeviz

```bash
# 安装
pip install snakeviz

# 可视化 cProfile 输出
python -m cProfile -o profile.prof script.py
snakeviz profile.prof
```

## 性能优化检查清单

::: tip 性能检查清单

- [ ] **算法复杂度**：是否使用了最优算法？
- [ ] **数据结构**：是否选择了合适的数据结构？
- [ ] **缓存**：是否利用了缓存（lru_cache）？
- [ ] **I/O 操作**：是否批量处理 I/O？
- [ ] **数据库查询**：是否使用了索引和批量操作？
- [ ] **循环**：是否避免了嵌套循环？
- [ ] **字符串操作**：是否使用了 join？
- [ ] **生成器**：是否使用了生成器代替列表？
- [ ] **并发**：是否利用了多线程/多进程/异步？
- [ ] **编译优化**：是否使用了 PyPy 或 Cython？

::: tip 优化顺序

1. **测量**：找出真正的瓶颈
2. **算法**：优化算法和数据结构
3. **缓存**：缓存重复计算
4. **并发**：利用多核和异步
5. **编译**：考虑 JIT 或编译优化

::: tip 性能目标

```python
import timeit

def benchmark_with_goal():
    """带目标的基准测试"""
    GOAL_TIME = 0.1  # 目标：100ms

    def implementation():
        # 你的实现
        return sum(range(1000000))

    time_taken = timeit.timeit(implementation, number=10)
    average = time_taken / 10

    if average <= GOAL_TIME:
        print(f"✅ Goal met: {average:.6f}s <= {GOAL_TIME}s")
    else:
        print(f"❌ Goal not met: {average:.6f}s > {GOAL_TIME}s")

benchmark_with_goal()
```
