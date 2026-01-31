---
title: 上下文管理器
icon: ri:brackets-line
order: 3
---

# 上下文管理器

上下文管理器（Context Manager）是 Python 中管理资源的强大工具，通过 `with` 语句确保资源的正确获取和释放。

## 基本概念

### with 语句

```python
# 基本用法
with open("file.txt", "r") as file:
    content = file.read()
# 文件自动关闭，即使发生异常

# 等价于
file = open("file.txt", "r")
try:
    content = file.read()
finally:
    file.close()
```

### 多个上下文

```python
# 同时打开多个文件
with open("input.txt") as inp, open("output.txt", "w") as out:
    out.write(inp.read())

# 嵌套上下文
with open("file1.txt") as f1:
    with open("file2.txt") as f2:
        content = f1.read() + f2.read()
```

## 创建上下文管理器

### 基于类

```python
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        """进入上下文时调用"""
        self.file = open(self.filename, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出上下文时调用"""
        if self.file:
            self.file.close()

        # 返回 False 不抑制异常
        # 返回 True 抑制异常
        return False

# 使用
with FileManager("example.txt", "r") as f:
    content = f.read()
# 文件自动关闭
```

### 异常处理

```python
class SafeOperation:
    def __enter__(self):
        print("Entering context")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            print(f"Exception occurred: {exc_val}")
            # 返回 True 抑制异常
            return True
        print("Exiting normally")
        return False

with SafeOperation():
    raise ValueError("Something went wrong")
print("This will be printed because exception was suppressed")
```

### contextlib 装饰器

```python
from contextlib import contextmanager

@contextmanager
def managed_resource():
    """使用生成器创建上下文管理器"""
    # 获取资源
    resource = acquire_resource()
    try:
        yield resource
    finally:
        # 释放资源
        release_resource(resource)

def acquire_resource():
    print("Acquiring resource")
    return "Resource"

def release_resource(resource):
    print(f"Releasing {resource}")

# 使用
with managed_resource() as res:
    print(f"Using {res}")
# Acquiring resource
# Using Resource
# Releasing Resource
```

## contextlib 模块

### closing

```python
from contextlib import closing
from urllib.request import urlopen

# 确保对象被关闭
with closing(urlopen("http://example.com")) as page:
    content = page.read()

# 自定义对象
class Connection:
    def close(self):
        print("Connection closed")

with closing(Connection()):
    pass  # 自动调用 close()
```

### suppress

```python
from contextlib import suppress

# 抑制特定异常
with suppress(FileNotFoundError):
    os.remove("nonexistent.txt")

# 抑制多个异常
with suppress(KeyError, AttributeError, ValueError):
    # 可能抛出这些异常的代码
    pass

# 等价于
try:
    os.remove("nonexistent.txt")
except FileNotFoundError:
    pass
```

### redirect_stdout/redirect_stderr

```python
from contextlib import redirect_stdout, redirect_stderr

# 重定向输出
with open("output.txt", "w") as f:
    with redirect_stdout(f):
        print("This goes to file")
        # 所有 stdout 输出写入文件

# 重定向错误
with open("errors.txt", "w") as f:
    with redirect_stderr(f):
        # 所有 stderr 输出写入文件
        raise Exception("Error message")
```

### ExitStack

```python
from contextlib import ExitStack

# 动态管理多个上下文
filenames = ["file1.txt", "file2.txt", "file3.txt"]

with ExitStack() as stack:
    files = [stack.enter_context(open(fname)) for fname in filenames]
    # 处理所有文件
    for f in files:
        print(f.read())
# 所有文件自动关闭

# 条件性上下文
with ExitStack() as stack:
    if need_file:
        f = stack.enter_context(open("data.txt"))
    # 其他操作
```

## 实际应用示例

### 数据库连接

```python
from contextlib import contextmanager

@contextmanager
def db_connection(connection_string):
    """数据库连接上下文管理器"""
    conn = None
    try:
        conn = connect_to_database(connection_string)
        yield conn
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

# 使用
with db_connection("postgresql://...") as conn:
    result = conn.execute("SELECT * FROM users")
# 连接自动关闭，出错时自动回滚
```

### 锁管理

```python
from threading import Lock
from contextlib import contextmanager

lock = Lock()

@contextmanager
def acquire_lock(lock):
    """获取锁的上下文管理器"""
    lock.acquire()
    try:
        yield
    finally:
        lock.release()

# 使用
with acquire_lock(lock):
    # 临界区代码
    critical_section()
# 锁自动释放
```

### 计时器

```python
import time
from contextlib import contextmanager

@contextmanager
def timer(name="Operation"):
    """计时上下文管理器"""
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"{name} took {elapsed:.4f} seconds")

# 使用
with timer("Data Processing"):
    process_data()
# Data Processing took 1.2345 seconds
```

### 临时目录

```python
import tempfile
import shutil
from contextlib import contextmanager

@contextmanager
def temp_directory():
    """临时目录上下文管理器"""
    temp_dir = tempfile.mkdtemp()
    try:
        yield temp_dir
    finally:
        shutil.rmtree(temp_dir)

# 使用
with temp_directory() as temp_dir:
    # 在临时目录中工作
    file_path = f"{temp_dir}/data.txt"
    with open(file_path, "w") as f:
        f.write("Temporary data")
# 临时目录自动删除
```

### 环境变量

```python
import os
from contextlib import contextmanager

@contextmanager
def set_env(**environ):
    """临时设置环境变量"""
    old_values = {key: os.environ.get(key) for key in environ}
    try:
        # 设置新值
        for key, value in environ.items():
            os.environ[key] = value
        yield
    finally:
        # 恢复旧值
        for key, old_value in old_values.items():
            if old_value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = old_value

# 使用
with set_env(DEBUG="true", LOG_LEVEL="info"):
    # 在此块中环境变量已修改
    print(os.environ["DEBUG"])  # "true"
# 环境变量自动恢复
```

### 临时改变工作目录

```python
import os
from contextlib import contextmanager

@contextmanager
def working_directory(path):
    """临时改变工作目录"""
    old_cwd = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(old_cwd)

# 使用
with working_directory("/tmp"):
    # 当前工作目录是 /tmp
    print(os.getcwd())  # /tmp
# 自动恢复到原目录
```

## 异步上下文管理器

### async with 语句

```python
class AsyncResource:
    async def __aenter__(self):
        """异步进入上下文"""
        print("Acquiring resource asynchronously")
        await asyncio.sleep(0.1)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """异步退出上下文"""
        print("Releasing resource asynchronously")
        await asyncio.sleep(0.1)
        return False

async def main():
    async with AsyncResource() as resource:
        print("Using resource")
        await asyncio.sleep(0.5)

import asyncio
asyncio.run(main())
```

### contextlib.asynccontextmanager

```python
from contextlib import asynccontextmanager
import asyncio

@asynccontextmanager
async def async_resource():
    """异步资源管理器"""
    # 异步获取资源
    print("Acquiring...")
    await asyncio.sleep(0.1)
    resource = "Async Resource"
    try:
        yield resource
    finally:
        # 异步释放资源
        print("Releasing...")
        await asyncio.sleep(0.1)

async def main():
    async with async_resource() as res:
        print(f"Using {res}")

asyncio.run(main())
```

## 组合上下文管理器

### 嵌套 vs 使用 ExitStack

```python
from contextlib import ExitStack

# 传统嵌套方式
with open("file1.txt") as f1:
    with open("file2.txt") as f2:
        with open("file3.txt") as f3:
            # 处理文件
            pass

# 使用 ExitStack（更灵活）
filenames = ["file1.txt", "file2.txt", "file3.txt"]

with ExitStack() as stack:
    files = [stack.enter_context(open(fname)) for fname in filenames]
    # 处理文件
    for f in files:
        print(f.read())
```

### 条件性上下文

```python
from contextlib import ExitStack, nullcontext

# 条件性使用上下文
def process_data(use_transaction=True):
    context = db_transaction() if use_transaction else nullcontext()
    with context:
        # 处理数据
        pass

# 或者使用 ExitStack
def conditional_context(need_lock=False):
    with ExitStack() as stack:
        if need_lock:
            stack.enter_context(acquire_lock(lock))
        # 其他操作
        pass
```

## 资源管理最佳实践

::: tip 上下文管理器设计原则

1. **幂等性**：多次进入/退出应该是安全的
2. **异常安全**：确保资源在异常时也能释放
3. **清晰命名**：上下文管理器名称应清晰表达用途
4. **文档完整**：说明管理的资源和异常行为

::: tip 选择实现方式

| 方式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| 类方法 | 复杂状态管理 | 完整控制 | 代码较多 |
| @contextmanager | 简单资源管理 | 简洁 | 异常处理限制 |
| 内置函数 | 标准操作 | 无需编写 | 功能固定 |

::: tip 常见模式

```python
# ✅ 好：清晰的资源管理
with acquire_lock(lock):
    critical_operation()

# ✅ 好：临时状态修改
with temporary_config(setting="value"):
    operation_with_config()

# ✅ 好：可组合的上下文
with timer(), log_context("operation"):
    perform_operation()
```

::: warning 避免的模式

```python
# ❌ 不要忽略异常
class BadManager:
    def __exit__(self, *args):
        return True  # 抑制所有异常

# ❌ 不要在 __enter__ 中做太多工作
class SlowManager:
    def __enter__(self):
        time.sleep(10)  # 阻塞太久
        return self

# ❌ 不要忘记清理
class LeakyManager:
    def __exit__(self, *args):
        # 忘记清理资源
        pass
```
