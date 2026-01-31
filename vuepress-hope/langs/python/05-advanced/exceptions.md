---
title: 异常处理
icon: ri:alert-line
order: 1
---

# 异常处理

异常处理是 Python 中处理错误和异常情况的机制，使程序能够优雅地处理错误而不是崩溃。

## 异常基础

### try-except 语句

```python
# 基本语法
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")

# 多个 except 块
try:
    number = int(input("Enter a number: "))
    result = 100 / number
except ValueError:
    print("That's not a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"Unexpected error: {e}")
```

### 捕获异常信息

```python
try:
    file = open("nonexistent.txt", "r")
    content = file.read()
except FileNotFoundError as e:
    print(f"File not found: {e.filename}")
    print(f"Error message: {e.strerror}")
except IOError as e:
    print(f"I/O error: {e}")

# 获取完整异常信息
import traceback

try:
    result = 10 / 0
except Exception:
    print("An error occurred:")
    traceback.print_exc()
```

## else 和 finally

### else 子句

```python
# else：没有异常时执行
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Division by zero")
else:
    print(f"Result is {result}")  # 只在没有异常时执行

# 实际应用
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"
    else:
        return f"Result: {result}"

print(divide(10, 2))  # Result: 5.0
print(divide(10, 0))  # Cannot divide by zero
```

### finally 子句

```python
# finally：无论如何都执行
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found")
finally:
    print("Cleanup code here")
    # 即使有异常也会执行

# 确保资源释放
def process_file(filename):
    file = None
    try:
        file = open(filename, "r")
        content = file.read()
        return content
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None
    finally:
        if file:
            file.close()  # 确保文件被关闭
            print("File closed")

# 更好的做法：使用 with 语句（上下文管理器）
def process_file_better(filename):
    try:
        with open(filename, "r") as file:
            return file.read()
    except FileNotFoundError:
        return None
```

## 自定义异常

### 创建异常类

```python
class CustomError(Exception):
    """自定义异常基类"""
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

class ValidationError(CustomError):
    """验证错误"""
    def __init__(self, field, message):
        self.field = field
        self.message = f"{field}: {message}"
        super().__init__(self.message)

class NotFoundError(CustomError):
    """未找到错误"""
    pass

# 使用自定义异常
def validate_user(data):
    if not data.get('name'):
        raise ValidationError('name', 'Name is required')
    if not data.get('email'):
        raise ValidationError('email', 'Email is required')
    if len(data.get('name', '')) < 3:
        raise ValidationError('name', 'Name too short')

try:
    validate_user({'name': 'AB'})
except ValidationError as e:
    print(f"Validation failed: {e.message}")
    print(f"Field: {e.field}")
```

### 异常链

```python
class DataProcessingError(Exception):
    pass

def process_data(data):
    try:
        # 一些可能失败的操作
        result = int(data)
        return result * 2
    except ValueError as e:
        # 使用 raise ... from ... 保留原始异常
        raise DataProcessingError("Failed to process data") from e

try:
    process_data("abc")
except DataProcessingError as e:
    print(f"Error: {e}")
    print(f"Caused by: {e.__cause__}")  # 原始异常

# 不使用 from 的异常链
def handle_error():
    try:
        raise ValueError("Original error")
    except ValueError:
        # raise 会保留异常链
        raise TypeError("New error")

try:
    handle_error()
except TypeError as e:
    print(f"Error: {e}")
    print(f"Context: {e.__context__}")  # 上下文异常
```

## 常见异常模式

### 重试机制

```python
import time

def retry(func, max_attempts=3, delay=1):
    """重试装饰器"""
    def wrapper(*args, **kwargs):
        for attempt in range(max_attempts):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt == max_attempts - 1:
                    raise
                print(f"Attempt {attempt + 1} failed, retrying...")
                time.sleep(delay)
    return wrapper

@retry
def unreliable_function():
    import random
    if random.random() < 0.7:
        raise ValueError("Random failure")
    return "Success"

# 使用
result = unreliable_function()
```

### 资源清理

```python
# 确保资源被释放
class Resource:
    def __init__(self, name):
        self.name = name
        print(f"Resource {name} acquired")

    def close(self):
        print(f"Resource {self.name} released")

# 使用 try-finally
def use_resource():
    resource = Resource("file.txt")
    try:
        # 使用资源
        print("Using resource")
    finally:
        resource.close()  # 确保释放

# 更好的方式：上下文管理器
class ManagedResource:
    def __init__(self, name):
        self.name = name
        self.resource = None

    def __enter__(self):
        self.resource = Resource(self.name)
        return self.resource

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.resource:
            self.resource.close()
        # 返回 False 表示不抑制异常
        return False

with ManagedResource("file.txt") as res:
    print("Using resource")
# 资源自动释放
```

### 上下文感知的异常处理

```python
class ContextError(Exception):
    """带上下文的错误"""
    def __init__(self, message, context=None):
        super().__init__(message)
        self.context = context or {}

    def with_context(self, **kwargs):
        """添加上下文信息"""
        self.context.update(kwargs)
        return self

def process_user(user_id):
    try:
        user = get_user(user_id)
        if not user:
            error = ContextError("User not found")
            error.with_context(user_id=user_id, action="get_user")
            raise error
    except ContextError as e:
        print(f"Error: {e}")
        print(f"Context: {e.context}")
        raise

def get_user(user_id):
    # 模拟用户查找
    return None
```

## 异常层级

```python
# Python 异常层级
"""
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── StopIteration
    ├── ArithmeticError
    │   ├── FloatingPointError
    │   ├── OverflowError
    │   └── ZeroDivisionError
    ├── AssertionError
    ├── AttributeError
    ├── BufferError
    ├── EOFError
    ├── ImportError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── MemoryError
    ├── NameError
    ├── OSError
    │   ├── FileNotFoundError
    │   ├── PermissionError
    └── TypeError
    └── ValueError
"""

# 捕获基类可以捕获所有子类
try:
    result = 10 / 0
except ArithmeticError:  # 捕获 ZeroDivisionError
    print("Arithmetic error occurred")

# 广泛的异常捕获
try:
    # 一些操作
    pass
except Exception as e:
    # 捕获大部分异常（不包括 SystemExit 等）
    print(f"Error: {e}")
```

## 警告处理

```python
import warnings

# 发出警告
warnings.warn("This is a warning", UserWarning)

# 过滤警告
warnings.filterwarnings("ignore")  # 忽略所有警告
warnings.filterwarnings("error")   # 警告转为错误
warnings.filterwarnings("always")  # 总是显示警告

# 特定警告过滤
warnings.filterwarnings("ignore", category=DeprecationWarning)

# 使用上下文管理器
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    # 在此块中忽略警告
    warnings.warn("This will be ignored")

# 自定义警告
class MyWarning(Warning):
    pass

warnings.warn("Custom warning", MyWarning)
```

## 异常最佳实践

::: tip 异常处理原则

1. **具体捕获**：只捕获预期的异常
2. **及早捕获**：在能够处理的地方捕获
3. **不要吞异常**：至少记录日志
4. **提供上下文**：包含有用的错误信息
5. **清理资源**：使用 finally 或 with 语句

::: tip 好的实践

```python
# ✅ 好：具体异常
try:
    data = json.loads(json_string)
except json.JSONDecodeError as e:
    logger.error(f"Invalid JSON: {e}")
    raise ValueError(f"Failed to parse JSON: {e}") from e

# ❌ 坏：捕获所有异常
try:
    data = json.loads(json_string)
except:
    pass  # 静默失败

# ✅ 好：使用 finally 清理
file = None
try:
    file = open("data.txt", "r")
    # 处理文件
finally:
    if file:
        file.close()

# ✅ 更好：使用 with
with open("data.txt", "r") as file:
    # 处理文件
```

::: warning 避免的模式

```python
# ❌ 不要这样
try:
    # 整个函数体
    pass
except Exception:
    pass

# ❌ 不要在循环中捕获异常（除非必要）
for item in items:
    try:
        process(item)
    except:
        pass  # 可能隐藏真正的错误

# ✅ 更好
try:
    for item in items:
        process(item)
except SpecificError as e:
    logger.error(f"Processing failed: {e}")
```

## 实际应用示例

### API 错误处理

```python
import requests
from typing import Optional

class APIError(Exception):
    def __init__(self, message, status_code=None, response_data=None):
        super().__init__(message)
        self.status_code = status_code
        self.response_data = response_data

def fetch_user(user_id: int) -> Optional[dict]:
    """获取用户信息"""
    url = f"https://api.example.com/users/{user_id}"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()  # 4xx/5xx 会抛出异常
        return response.json()

    except requests.Timeout:
        raise APIError(f"Request timeout for user {user_id}")
    except requests.ConnectionError:
        raise APIError(f"Connection error for user {user_id}")
    except requests.HTTPError as e:
        raise APIError(
            f"HTTP error for user {user_id}",
            status_code=e.response.status_code,
            response_data=e.response.text
        )
    except requests.RequestException as e:
        raise APIError(f"Request failed for user {user_id}: {e}")
    except ValueError as e:
        raise APIError(f"Invalid JSON response for user {user_id}")

# 使用
try:
    user = fetch_user(123)
    print(user)
except APIError as e:
    if e.status_code == 404:
        print("User not found")
    elif e.status_code == 500:
        print("Server error")
    else:
        print(f"API error: {e}")
```

### 数据验证

```python
from dataclasses import dataclass
from typing import List

class ValidationError(Exception):
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

@dataclass
class User:
    name: str
    email: str
    age: int

    def __post_init__(self):
        """数据验证"""
        errors = []

        if not self.name or len(self.name) < 2:
            errors.append(("name", "Name must be at least 2 characters"))

        if "@" not in self.email:
            errors.append(("email", "Invalid email format"))

        if not isinstance(self.age, int) or self.age < 0 or self.age > 150:
            errors.append(("age", "Age must be between 0 and 150"))

        if errors:
            # 合并所有验证错误
            messages = [f"{field}: {msg}" for field, msg in errors]
            raise ValidationError(
                "user",
                "; ".join(messages)
            )

# 使用
try:
    user = User(name="A", email="invalid", age=200)
except ValidationError as e:
    print(f"Validation error: {e.message}")
```

### 文件处理

```python
import os
from pathlib import Path

def process_files(directory: str):
    """处理目录中的所有文件"""
    path = Path(directory)

    if not path.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")

    if not path.is_dir():
        raise NotADirectoryError(f"Not a directory: {directory}")

    processed = 0
    failed = 0

    for file_path in path.glob("*.txt"):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()
                # 处理内容
                processed += 1
        except UnicodeDecodeError:
            # 尝试其他编码
            try:
                with open(file_path, "r", encoding="gbk") as file:
                    content = file.read()
                    processed += 1
            except Exception as e:
                print(f"Failed to read {file_path.name}: {e}")
                failed += 1
        except Exception as e:
            print(f"Error processing {file_path.name}: {e}")
            failed += 1

    print(f"Processed: {processed}, Failed: {failed}")
    return processed, failed
```

::: tip 调试技巧

1. **使用 traceback**：`traceback.print_exc()`
2. **日志记录**：`logging.exception()` 自动记录堆栈
3. **pdb 调试**：`import pdb; pdb.set_trace()`
4. **异常信息**：包含足够的上下文信息
:::
