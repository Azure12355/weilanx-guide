---
title: 函数
icon: ri:function-line
order: 1
---

# 函数

函数是 Python 中最重要的代码组织方式，用于封装可重用的逻辑。

## 函数定义

### 基本语法

```python
# 简单函数
def greet():
    return "Hello, World!"

# 带参数的函数
def greet_name(name):
    return f"Hello, {name}!"

# 带默认参数的函数
def greet_with_default(name="World"):
    return f"Hello, {name}!"

# 多个参数
def introduce(name, age, city):
    return f"{name} is {age} years old from {city}"
```

### 参数类型

```python
# 位置参数
def func(a, b, c):
    return f"a={a}, b={b}, c={c}"

func(1, 2, 3)  # a=1, b=2, c=3

# 关键字参数
func(a=1, b=2, c=3)  # a=1, b=2, c=3
func(c=3, a=1, b=2)  # 顺序可变

# 默认参数
def func_with_default(a, b=2, c=3):
    return f"a={a}, b={b}, c={c}"

func_with_default(1)        # a=1, b=2, c=3
func_with_default(1, 10)     # a=1, b=10, c=3

# 可变位置参数 (*args)
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3, 4, 5)  # 15

# 可变关键字参数 (**kwargs)
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="Beijing")
# name: Alice
# age: 25
# city: Beijing

# 混合参数
def complex_func(a, b, *args, c=10, **kwargs):
    return f"a={a}, b={b}, args={args}, c={c}, kwargs={kwargs}"

complex_func(1, 2, 3, 4, c=20, d=30, e=40)
# a=1, b=2, args=(3, 4), c=20, kwargs={'d': 30, 'e': 40}
```

### 参数解包

```python
# 列表/元组解包
args = [1, 2, 3]
def func(a, b, c):
    return a + b + c

func(*args)  # 6

# 字典解包
kwargs = {"name": "Alice", "age": 25}
def greet(**kwargs):
    return f"Hello, {kwargs.get('name', 'World')}!"

greet(**kwargs)  # "Hello, Alice!"

# 混合解包
def func(a, b, c=10, d=20):
    return f"a={a}, b={b}, c={c}, d={d}"

args = [1, 2]
kwargs = {"c": 30, "d": 40}
func(*args, **kwargs)  # a=1, b=2, c=30, d=40
```

## 返回值

```python
# 单个返回值
def add(a, b):
    return a + b

# 多个返回值（实际返回元组）
def get_user_info(user_id):
    # 查询数据库
    return "Alice", 25, "alice@example.com"

name, age, email = get_user_info(1)

# 无返回值（返回 None）
def print_message(message):
    print(message)
    # 等价于 return None

# 条件返回
def divide(a, b):
    if b == 0:
        return None
    return a / b

# 提前返回
def process_value(value):
    if value is None:
        return "No value"
    if value < 0:
        return "Negative"
    return f"Positive: {value}"
```

## 作用域

```python
# 全局变量
global_var = 100

def func():
    # 局部变量
    local_var = 10
    print(global_var)  # 100（可以读取全局变量）

func()
# print(local_var)  # NameError（局部变量不可见）

# 修改全局变量（需要 global 关键字）
count = 0

def increment():
    global count
    count += 1

increment()
print(count)  # 1

# 嵌套函数与 nonlocal
def outer():
    x = 10

    def inner():
        nonlocal x
        x += 5
        return x

    return inner()

outer()  # 15
```

## 类型提示

```python
# 基本类型提示
def add(a: int, b: int) -> int:
    return a + b

# 可选类型
from typing import Optional

def find_user(user_id: int) -> Optional[str]:
    # 查询用户
    return "Alice" if user_id == 1 else None

# 联合类型
from typing import Union

def process(value: Union[int, str]) -> str:
    return str(value)

# Python 3.10+ 新语法
def process_new(value: int | str) -> str:
    return str(value)

# 列表类型提示
from typing import List

def sum_numbers(numbers: List[int]) -> int:
    return sum(numbers)

# 字典类型提示
from typing import Dict

def get_config() -> Dict[str, str]:
    return {"host": "localhost", "port": "8080"}

# 类型别名
from typing import List, Tuple

Vector = List[float]

def dot_product(v1: Vector, v2: Vector) -> float:
    return sum(a * b for a, b in zip(v1, v2))
```

## 递归函数

```python
# 阶乘
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

factorial(5)  # 120

# 斐波那契数列
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 优化版（使用缓存）
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_cached(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci_cached(n - 1) + fibonacci_cached(n - 2)

# 深度优先搜索
def dfs(tree, node, target):
    if node == target:
        return True
    for child in tree.get(node, []):
        if dfs(tree, child, target):
            return True
    return False
```

## 高阶函数

```python
# 函数作为参数
def apply_operation(x, operation):
    return operation(x)

result = apply_operation(5, lambda x: x ** 2)  # 25

# 函数作为返回值
def create_multiplier(factor):
    def multiplier(x):
        return x * factor
    return multiplier

times_3 = create_multiplier(3)
times_3(5)  # 15

# 内置高阶函数
numbers = [1, 2, 3, 4, 5]

# map()
list(map(lambda x: x ** 2, numbers))  # [1, 4, 9, 16, 25]

# filter()
list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4]

# reduce()
from functools import reduce
reduce(lambda x, y: x + y, numbers)  # 15

# sorted()
sorted([-3, 1, -4, 2], key=abs)  # [1, 2, -3, -4]
```

## 函数属性

```python
def my_function():
    """这是文档字符串"""
    return 42

# 访问函数属性
my_function.__name__      # 'my_function'
my_function.__doc__       # '这是文档字符串'
my_function.__module__    # '__main__'
my_function.__dict__      # {}

# 设置函数属性
my_function.author = "Alice"
my_function.version = "1.0"
my_function.author  # 'Alice'
```

::: tip 函数设计原则

1. **单一职责**：函数只做一件事
2. **清晰命名**：使用动词或动词短语
3. **参数合理**：避免过多参数（<= 5 个）
4. **返回一致**：始终返回相同类型
5. **文档完善**：使用 docstring 说明用途
:::
