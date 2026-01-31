---
title: 调试技巧
icon: ri:bug-line
order: 2
---

# 调试技巧

调试是发现和修复代码错误的过程。Python 提供了多种调试工具和技巧。

## print 调试

### 基本输出

```python
def process_data(data):
    print(f"Input data: {data}")  # 调试输出
    result = data * 2
    print(f"Result: {result}")    # 调试输出
    return result

# 使用 f-string 格式化
def debug_function(x, y):
    print(f"x = {x}, type = {type(x)}")
    print(f"y = {y}, type = {type(y)}")
    return x + y
```

### 环境变量控制

```python
import os

DEBUG = os.environ.get("DEBUG", "False") == "True"

def debug_print(*args, **kwargs):
    """条件性调试输出"""
    if DEBUG:
        print(*args, **kwargs)

def process(item):
    debug_print(f"Processing: {item}")
    result = item * 2
    debug_print(f"Result: {result}")
    return result

# 使用
# DEBUG=1 python script.py
```

### logging 模块

```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("debug.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def process_data(data):
    logger.debug(f"Input: {data}")
    try:
        result = complex_operation(data)
        logger.info(f"Success: {result}")
        return result
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        raise

# 不同级别
logger.debug("详细调试信息")
logger.info("一般信息")
logger.warning("警告信息")
logger.error("错误信息")
logger.critical("严重错误")
```

## pdb 调试器

### 基本使用

```python
import pdb

def buggy_function(x, y):
    result = x + y
    pdb.set_trace()  # 设置断点
    result = result * 2
    return result

# 或者在命令行中
# python -m pdb script.py
```

### pdb 命令

| 命令 | 缩写 | 功能 |
|------|------|------|
| continue | c | 继续执行到下一个断点 |
| next | n | 执行下一行（不进入函数） |
| step | s | 执行下一行（进入函数） |
| return | r | 执行到当前函数返回 |
| where | w | 显示堆栈跟踪 |
| list | l | 显示当前代码 |
| args | a | 显示当前函数参数 |
| p expr | | 打印表达式 |
| pp expr | | 美化打印表达式 |
| !statement | | 执行 Python 语句 |
| quit | q | 退出调试器 |

### pdb 示例

```python
def calculate(a, b):
    x = a * 2
    y = b + 3
    z = x / y
    return z

# 在 pdb 中
(Pdb) b calculate  # 在 calculate 设置断点
(Pdb) c           # 继续执行
(Pdb) n           # 下一行
(Pdb) p x         # 打印 x
(Pdb) pp locals() # 打印所有局部变量
(Pdb) !x = 10     # 修改变量
```

### ipdb（增强版）

```bash
# 安装
pip install ipdb

# 使用
import ipdb; ipdb.set_trace()

# 或命令行
python -m ipdb script.py
```

## IDE 调试

### VS Code 调试

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": false
        },
        {
            "name": "Python: Module",
            "type": "python",
            "request": "launch",
            "module": "my_module.main",
            "args": ["--debug"]
        }
    ]
}
```

### PyCharm 调试

1. 在代码行号处点击设置断点
2. 右键选择 "Debug" 运行
3. 使用调试工具栏：
   - Step Over (F8)：下一行
   - Step Into (F7)：进入函数
   - Step Out (Shift+F8)：跳出函数
   - Resume (F9)：继续执行

## 性能分析

### cProfile

```python
import cProfile

def slow_function():
    result = []
    for i in range(100000):
        result.append(i ** 2)
    return sum(result)

# 分析函数
cProfile.run("slow_function()")

# 保存结果
cProfile.run("slow_function()", "profile_stats")

# 使用 pstats 查看结果
import pstats
p = pstats.Stats("profile_stats")
p.sort_stats("cumulative")
p.print_stats(10)  # 打印前 10 个
```

### line_profiler

```bash
# 安装
pip install line_profiler

# 使用
# 在函数前添加 @profile 装饰器
# kernprof -l -v script.py
```

```python
@profile
def process_data(data):
    result = []
    for item in data:
        processed = item * 2
        result.append(processed)
    return result
```

### memory_profiler

```bash
# 安装
pip install memory_profiler

# 使用
# python -m memory_profiler script.py
```

```python
from memory_profiler import profile

@profile
def memory_intensive_function():
    data = [x for x in range(1000000)]
    return sum(data)
```

## 时间测量

### time 模块

```python
import time

def timed_function():
    start = time.time()
    # 执行代码
    time.sleep(1)
    end = time.time()
    print(f"Elapsed: {end - start:.4f}s")

# timeit 模块
import timeit

code = """
sum(range(1000))
"""

# 执行 n 次
time = timeit.timeit(code, number=1000)
print(f"Total time: {time}s")
print(f"Average: {time/1000}s")

# repeat 多次
times = timeit.repeat(code, number=1000, repeat=5)
print(f"Times: {times}")
```

### 装饰器计时

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"
```

### contextlib 计时

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(name="Operation"):
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"{name} took {elapsed:.4f}s")

with timer("Data Processing"):
    # 执行代码
    time.sleep(1)
```

## 错误追踪

### traceback 模块

```python
import traceback

def function_a():
    function_b()

def function_b():
    function_c()

def function_c():
    try:
        raise ValueError("Something went wrong")
    except Exception:
        # 打印完整的堆栈跟踪
        traceback.print_exc()

        # 获取堆栈信息作为字符串
        error_str = traceback.format_exc()
        print(error_str)

function_a()
```

### 异常信息

```python
import sys
import traceback

def handle_exception():
    try:
        # 可能出错的代码
        1 / 0
    except Exception as e:
        # 异常类型和消息
        print(f"Exception type: {type(e)}")
        print(f"Exception message: {e}")

        # 堆栈信息
        exc_type, exc_value, exc_traceback = sys.exc_info()
        print(f"Exception type: {exc_type}")
        print(f"Exception value: {exc_value}")

        # 格式化堆栈
        formatted = traceback.format_exception(
            exc_type, exc_value, exc_traceback
        )
        print("".join(formatted))
```

## 调试最佳实践

::: tip 调试策略

1. **二分法**：注释一半代码定位问题
2. **最小化**：创建最小的可复现示例
3. **假设验证**：提出假设并测试
4. **日志记录**：添加详细日志
5. **版本控制**：对比工作版本

::: tip 常见问题

| 问题 | 可能原因 | 调试方法 |
|------|----------|----------|
| ImportError | 路径问题 | 检查 sys.path |
| TypeError | 类型不匹配 | 使用 type() 检查 |
| AttributeError | 对象没有属性 | 使用 dir() 查看 |
| KeyError | 字典键不存在 | 使用 dict.get() |
| IndexError | 列表索引越界 | 检查 len() |

::: tip 防御性编程

```python
def safe_divide(a, b):
    """安全的除法"""
    if b == 0:
        logger.error(f"Division by zero: {a} / {b}")
        return None
    return a / b

def safe_get(dictionary, key, default=None):
    """安全的字典获取"""
    return dictionary.get(key, default)

def assert_types(**kwargs):
    """类型断言装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for key, value in kwargs.items():
                expected_type = type(kwargs[key])
                if not isinstance(value, expected_type):
                    raise TypeError(
                        f"{key} must be {expected_type}, "
                        f"got {type(value)}"
                    )
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

::: tip 调试工具推荐

1. **pdb**：内置调试器
2. **ipdb**：增强的调试器
3. **pudb**：可视化调试器
4. **py-spy**：采样分析器
5. **py-slow**：慢代码检测

::: tip 远程调试

```python
# 使用 rpdb 进行远程调试
# pip install rpdb

import rpdb

def complex_function():
    # 在需要调试的地方设置断点
    rpdb.set_trace(host="0.0.0.0", port=4444)
    # 然后用 telnet 或 nc 连接到端口 4444
    return result
```

::: tip 性能优化流程

1. **测量**：使用 profiler 找出瓶颈
2. **分析**：确定优化目标
3. **优化**：针对性优化
4. **验证**：再次测量确认效果

```python
import cProfile
import pstats

def profile_function(func):
    """分析函数性能"""
    profiler = cProfile.Profile()
    profiler.enable()
    result = func()
    profiler.disable()

    stats = pstats.Stats(profiler)
    stats.sort_stats("cumulative")
    stats.print_stats(20)
    return result
```
