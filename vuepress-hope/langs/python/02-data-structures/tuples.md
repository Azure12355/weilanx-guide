---
title: 元组
icon: ri:link
order: 2
---

# 元组（Tuple）

元组是 Python 中不可变的有序序列，一旦创建就不能修改。

## 元组创建

```python
# 空元组
empty = ()
empty = tuple()

# 单个元素（注意逗号）
single = (1,)      # 需要
# single = (1)     # 这是整数 1，不是元组

# 多个元素
coordinates = (3, 4)
colors = ("red", "green", "blue")

# 不使用括号（隐式创建）
implicit = 1, 2, 3

# 使用 tuple() 构造函数
from_list = tuple([1, 2, 3])    # (1, 2, 3)
from_string = tuple("hello")    # ('h', 'e', 'l', 'l', 'o')
from_range = tuple(range(3))    # (0, 1, 2)

# 元组推导式（使用生成器）
squares = tuple(x**2 for x in range(5))  # (0, 1, 4, 9, 16)
```

## 元组操作

### 索引与切片

```python
numbers = (0, 1, 2, 3, 4, 5)

# 索引
numbers[0]    # 0
numbers[-1]   # 5

# 切片（返回元组）
numbers[1:4]      # (1, 2, 3)
numbers[::2]      # (0, 2, 4)
numbers[::-1]     # (5, 4, 3, 2, 1, 0)
```

### 元组方法

```python
numbers = (1, 2, 3, 2, 4, 2, 5)

# count()：统计元素出现次数
numbers.count(2)  # 3

# index()：查找元素索引
numbers.index(3)  # 2
numbers.index(2, 2)  # 3（从索引2开始查找）

# len()：元组长度
len(numbers)      # 7

# 元素存在性检查
3 in numbers      # True
10 in numbers     # False
```

### 不可变性

```python
coordinates = (3, 4)

# ❌ 不能修改元素
# coordinates[0] = 5  # TypeError

# ❌ 不能添加/删除元素
# coordinates.append(5)  # AttributeError

# ✅ 但可以包含可变对象
mixed = (1, [2, 3], "hello")
mixed[1].append(4)  # ✅ 可以修改列表元素
# mixed = (1, [2, 3, 4], "hello")

# 创建新元组（拼接）
new_coords = coordinates + (5,)
# (3, 4, 5)

# 重复
repeated = (1, 2) * 3
# (1, 2, 1, 2, 1, 2)
```

## 元组解包

### 基本解包

```python
# 位置解包
coordinates = (3, 4)
x, y = coordinates
# x = 3, y = 4

# 多变量解包
a, b, c = (1, 2, 3)
# a=1, b=2, c=3
```

### 高级解包

```python
# 使用 * 收集剩余元素
numbers = (1, 2, 3, 4, 5)
first, *rest, last = numbers
# first=1, rest=[2, 3, 4], last=5

# 只要部分元素
head, *tail = (1, 2, 3, 4, 5)
# head=1, tail=[2, 3, 4, 5]

*init, last = (1, 2, 3, 4, 5)
# init=[1, 2, 3, 4], last=5

# 忽略某些值
a, _, c = (1, 2, 3)
# a=1, c=3（忽略中间值）

first, *_, last = (1, 2, 3, 4, 5)
# first=1, last=5（忽略中间所有值）
```

### 嵌套解包

```python
# 嵌套元组解包
nested = ((1, 2), (3, 4))
(a, b), (c, d) = nested
# a=1, b=2, c=3, d=4

# 混合解包
data = (1, [2, 3], "hello")
num, lst, text = data
# num=1, lst=[2, 3], text="hello"
```

## 命名元组

### collections.namedtuple

```python
from collections import namedtuple

# 定义命名元组类型
Point = namedtuple('Point', ['x', 'y'])
# 或使用字符串
Point = namedtuple('Point', 'x y')

# 创建实例
p = Point(3, 4)

# 访问字段
p.x  # 3
p.y  # 4

# 解包
x, y = p

# _make() 从可迭代对象创建
p2 = Point._make([5, 6])

# _asdict() 转换为字典
p._asdict()  # {'x': 3, 'y': 4}

# _replace() 创建新实例
p3 = p._replace(x=10)
# Point(x=10, y=4)

# 字段
Point._fields  # ('x', 'y')

# 默认值
Point = namedtuple('Point', 'x y', defaults=[0, 0])
p = Point()  # Point(x=0, y=0)
```

### typing.NamedTuple（Python 3.6+）

```python
from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float

# 创建实例
p = Point(3.0, 4.0)
p.x  # 3.0
p.y  # 4.0

# 带默认值
class Point(NamedTuple):
    x: float = 0.0
    y: float = 0.0

p = Point()  # Point(x=0.0, y=0.0)
p2 = Point(3.0)  # Point(x=3.0, y=0.0)
```

## 元组 vs 列表

| 特性 | 元组 | 列表 |
|------|------|------|
| 可变性 | 不可变 | 可变 |
| 语法 | `(1, 2)` | `[1, 2]` |
| 用途 | 固定数据 | 可变集合 |
| 性能 | 更快更省内存 | 稍慢稍占内存 |
| 哈希 | 可哈希（可作字典键） | 不可哈希 |

### 使用场景

```python
# ✅ 元组适合：固定配置
CONFIG = ("localhost", 8080, "utf-8")

# ✅ 元组适合：字典键
locations = {
    (37.7749, -122.4194): "San Francisco",
    (40.7128, -74.0060): "New York",
}

# ✅ 元组适合：返回多个值
def get_user(user_id):
    # 查询数据库
    return ("Alice", 25, "alice@example.com")

name, age, email = get_user(1)

# ✅ 列表适合：数据收集
results = []
for item in items:
    results.append(process(item))

# ✅ 列表适合：需要修改的数据
cart = []
cart.append("item1")
cart.remove("item2")
```

## 元组方法

### 转换与比较

```python
# 转换为列表
t = (1, 2, 3)
lst = list(t)  # [1, 2, 3]

# 列表转元组
lst = [1, 2, 3]
t = tuple(lst)  # (1, 2, 3)

# 字符串转元组
t = tuple("hello")  # ('h', 'e', 'l', 'l', 'o')

# 元组比较
(1, 2) == (1, 2)  # True
(1, 2) < (1, 3)   # True
(1, 2) < (2, 1)   # True

# 字典序比较
('a', 'b') < ('a', 'c')  # True
```

### 连接与重复

```python
# 连接
(1, 2) + (3, 4)  # (1, 2, 3, 4)

# 重复
(1, 2) * 3  # (1, 2, 1, 2, 1, 2)

# 注意：重复创建的是新元组
nested = ([1, 2],)
repeated = nested * 2
# ([1, 2], [1, 2])
repeated[0].append(3)
# nested = ([1, 2, 3],)
# repeated = ([1, 2, 3], [1, 2, 3])
```

## 元组高级用法

### 作为字典键

```python
# 坐标到名称的映射
coordinates = {
    (0, 0): "原点",
    (1, 0): "东",
    (0, 1): "北",
}

coordinates[(0, 0)]  # "原点"

# 列表不能作为键（不可哈希）
# {[1, 2]: "value"}  # TypeError
```

### 记录结构

```python
# 使用元组作为轻量级记录
# 命名约定：首字母大写表示"类型"
Point = (float, float)
Vector = (float, float, float)

# 使用
def distance(p1: Point, p2: Point) -> float:
    x1, y1 = p1
    x2, y2 = p2
    return ((x2 - x1)**2 + (y2 - y1)**2)**0.5

p1 = (0.0, 0.0)
p2 = (3.0, 4.0)
distance(p1, p2)  # 5.0
```

### 函数参数

```python
# *args 收集位置参数为元组
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3, 4, 5)  # 15

# 拆包元组作为参数
numbers = (1, 2, 3)
print(*numbers)  # 等价于 print(1, 2, 3)

# 元组作为单个参数
def process_pair(pair):
    x, y = pair
    return x + y

process_pair((3, 4))  # 7
```

## 性能考虑

```python
import sys

# 内存占用
lst = [1, 2, 3, 4, 5]
tup = (1, 2, 3, 4, 5)

sys.getsizeof(lst)  # ~120 字节
sys.getsizeof(tup)  # ~80 字节

# 创建速度
# 元组创建通常比列表快
# 尤其在已知大小时

# 访问速度
# 元组和列表索引访问都是 O(1)
# 元组稍微快一点（不可变的优化）
```

::: tip 何时使用元组

1. **数据不应改变**：配置、常量
2. **作为字典键**：需要可哈希
3. **返回多个值**：函数返回
4. **性能敏感**：大量数据时更省内存
5. **数据记录**：轻量级数据结构
:::
