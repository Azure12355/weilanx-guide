---
title: 装饰器
icon: ri:artboard-line
order: 3
---

# 装饰器

装饰器是修改函数或类行为的强大工具，本质上是一个返回函数的函数。

## 基本装饰器

```python
# 简单装饰器
def my_decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# Before function call
# Hello!
# After function call

# 等价于
def say_hello():
    print("Hello!")

say_hello = my_decorator(say_hello)
```

## 保留函数信息

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 保留原函数的元信息
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def add(a, b):
    """Add two numbers."""
    return a + b

add.__name__  # 'add'（而不是 'wrapper'）
add.__doc__   # 'Add two numbers.'
```

## 带参数的装饰器

```python
def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
```

## 装饰器参数

```python
def debug(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        print(f"Args: {args}")
        print(f"Kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"Result: {result}")
        return result
    return wrapper

@debug
def add(a, b):
    return a + b

add(3, 4)
# Calling add
# Args: (3, 4)
# Kwargs: {}
# Result: 7
```

## 常用装饰器模式

### 计时装饰器

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

slow_function()  # slow_function took 1.0001 seconds
```

### 缓存装饰器

```python
from functools import wraps

def memoize(func):
    cache = {}

    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

fibonacci(100)  # 快速返回（已缓存）
```

### 或者使用 functools.lru_cache

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

### 验证装饰器

```python
def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        for arg in args:
            if isinstance(arg, (int, float)) and arg < 0:
                raise ValueError("Arguments must be positive")
        return func(*args, **kwargs)
    return wrapper

@validate_positive
def calculate_area(length, width):
    return length * width

calculate_area(5, 3)  # 15
# calculate_area(-5, 3)  # ValueError
```

### 重试装饰器

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
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
    return decorator

@retry(max_attempts=3, delay=1)
def unreliable_function():
    import random
    if random.random() < 0.7:
        raise ValueError("Random failure!")
    return "Success"
```

## 类装饰器

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} called {self.count} times")
        return self.func(*args, **kwargs)

@CountCalls
def greet():
    print("Hello!")

greet()  # greet called 1 times
greet()  # greet called 2 times
```

## 装饰器堆叠

```python
@timer
@debug
@memoize
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 等价于
fibonacci = timer(debug(memoize(fibonacci)))
```

## 带状态的装饰器

```python
def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@count_calls
def process():
    pass

process()
process()
process.calls  # 2
```

## 参数化装饰器

```python
def register(active=True):
    def decorator(func):
        func.active = active
        return func
    return decorator

@register(active=True)
def func1():
    pass

@register(active=False)
def func2():
    pass

func1.active  # True
func2.active  # False
```

## functools.wraps 的重要性

```python
# 不使用 wraps
def bad_decorator(func):
    def wrapper():
        return func()
    return wrapper

@bad_decorator
def my_func():
    """My function docstring."""
    pass

print(my_func.__name__)  # 'wrapper'（丢失原函数名）
print(my_func.__doc__)   # None（丢失文档字符串）

# 使用 wraps
from functools import wraps

def good_decorator(func):
    @wraps(func)
    def wrapper():
        return func()
    return wrapper

@good_decorator
def my_func2():
    """My function docstring."""
    pass

print(my_func2.__name__)  # 'my_func2'（保留原函数名）
print(my_func2.__doc__)   # 'My function docstring.'（保留文档）
```

::: tip 装饰器最佳实践

1. **总是使用 @wraps**：保留原函数元信息
2. **保持简单**：装饰器应该简单明了
3. **使用组合**：多个小装饰器优于一个大装饰器
4. **考虑性能**：装饰器会带来轻微性能开销
5. **文档清晰**：装饰器自身也需要文档字符串
:::
