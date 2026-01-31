---
title: Lambda 表达式
icon: ri:lightbulb-line
order: 2
---

# Lambda 表达式

Lambda 表达式（匿名函数）是创建小型匿名函数的简洁方式。

## 基本语法

```python
# lambda 语法
lambda arguments: expression

# 等价于
def anonymous(arguments):
    return expression

# 基本 lambda
add = lambda x, y: x + y
add(3, 4)  # 7

# 单参数
square = lambda x: x ** 2
square(5)  # 25

# 无参数
get_default = lambda: 42
get_default()  # 42

# 多个表达式（不能直接使用，需要用元组）
multi = lambda x: (x * 2, x + 1)
multi(5)  # (10, 6)
```

## Lambda 使用场景

### 内置函数配合

```python
# map()
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
# [1, 4, 9, 16, 25]

# filter()
evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4]

# sorted()
students = [("Alice", 25), ("Bob", 20), ("Charlie", 30)]
sorted(students, key=lambda s: s[1])
# [('Bob', 20), ('Alice', 25), ('Charlie', 30)]

# reduce()
from functools import reduce
numbers = [1, 2, 3, 4, 5]
total = reduce(lambda x, y: x + y, numbers)  # 15
```

### 列表/字典推导式替代

```python
# 列表推导式（更易读）
squares = [x ** 2 for x in range(10)]

# lambda 与 map（功能相同但较啰嗦）
squares = list(map(lambda x: x ** 2, range(10)))

# 字典推导式
word_lengths = {word: len(word) for word in ["hello", "world", "python"]}
# {'hello': 5, 'world': 5, 'python': 6}
```

### 短期回调函数

```python
# 按钮点击
button.on_click(lambda event: print("Clicked!"))

# 定时器
import threading
timer = threading.Timer(5.0, lambda: print("Timeout!"))
timer.start()

# 排序键
pairs = [(1, 'one'), (2, 'two'), (3, 'three')]
pairs.sort(key=lambda pair: pair[1])
# [(1, 'one'), (3, 'three'), (2, 'two')]
```

## Lambda 限制

```python
# ❌ 不能包含语句
# lambda x: if x > 0: return x（语法错误）

# ✅ 使用三元表达式
lambda x: x if x > 0 else -x

# ❌ 不能包含多个表达式
# lambda x: print(x); return x * 2（语法错误）

# ✅ 使用元组
lambda x: (print(x), x * 2)

# 复杂逻辑推荐使用 def
def process(x):
    print(x)
    return x * 2
```

## 常见模式

```python
# 身份函数
identity = lambda x: x
identity(42)  # 42

# 常量函数
constant_5 = lambda: 5
constant_5()  # 5

# 选择器
get_first = lambda seq: seq[0]
get_last = lambda seq: seq[-1]

# 调试
debug_print = lambda x: print(f"Debug: {x}")

# 类型检查
is_string = lambda x: isinstance(x, str)
is_number = lambda x: isinstance(x, (int, float))

# 字典访问
get_name = lambda d: d.get("name", "Unknown")
```

## Lambda 与闭包

```python
# 闭包陷阱
def create_multipliers():
    return [lambda x: x * i for i in range(3)]

multipliers = create_multipliers()
multipliers[0](5)  # 10（不是 0！i 最终值为 2）

# 正确做法
def create_multipliers_fixed():
    return [lambda x, i=i: x * i for i in range(3)]

multipliers = create_multipliers_fixed()
multipliers[0](5)  # 0
multipliers[1](5)  # 5
multipliers[2](5)  # 10

# 或使用 functools.partial
from functools import partial

def multiply(x, factor):
    return x * factor

multipliers = [partial(multiply, factor=i) for i in range(3)]
multipliers[0](5)  # 0
```

## 高级用法

```python
# 多参数 lambda
transform = lambda x, y, z: f"{x}-{y}-{z}"
transform("A", "B", "C")  # "A-B-C"

# 可变参数
sum_all = lambda *args: sum(args)
sum_all(1, 2, 3, 4, 5)  # 15

# 关键字参数
key_value = lambda **kwargs: kwargs.keys()
key_value(a=1, b=2)  # dict_keys(['a', 'b'])

# 条件表达式
abs_value = lambda x: x if x >= 0 else -x
abs_value(-5)  # 5

# 短路求值
safe_get = lambda d, k: d and d.get(k)
safe_get({"a": 1}, "a")  # 1
safe_get(None, "a")  # None

# 链式操作
process = lambda x: x.strip().lower().replace(" ", "_")
process("  Hello World  ")  # "hello_world"
```

## 实际应用

```python
# GUI 编程
root.bind("<Button-1>", lambda e: handle_click(e))

# 数据处理
data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]
sorted_data = sorted(data, key=lambda x: x["age"])
# [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 30}]

# 配置函数
operations = {
    "add": lambda a, b: a + b,
    "subtract": lambda a, b: a - b,
    "multiply": lambda a, b: a * b,
}
operations["add"](5, 3)  # 8

# 过滤和转换
numbers = [1, -2, 3, -4, 5]
positive_squared = list(
    map(lambda x: x ** 2,
        filter(lambda x: x > 0, numbers))
)
# [1, 9, 25]
```

## Lambda vs def

```python
# 简单操作：lambda
add = lambda x, y: x + y

# 复杂操作：def
def add_with_validation(x, y):
    """Add two numbers with validation."""
    if not isinstance(x, (int, float)):
        raise TypeError("x must be a number")
    if not isinstance(y, (int, float)):
        raise TypeError("y must be a number")
    return x + y

# 命名函数更易调试
def named_function(x):
    return x ** 2

named_function.__name__  # 'named_function'

lambda x: x ** 2  # <lambda>
```

::: tip 何时使用 Lambda

**适合使用 Lambda：**
- 简单的单行函数
- 作为参数传递（如 key=）
- 短期使用的回调函数
- 不需要复用的函数

**不适合使用 Lambda：**
- 复杂逻辑（多行）
- 需要文档字符串
- 需要类型提示
- 需要调试（命名函数更清晰）
:::
