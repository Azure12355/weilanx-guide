---
title: 列表
icon: ri:list-ordered
order: 1
---

# 列表（List）

列表是 Python 中最常用的数据结构，是一个有序、可变的集合。

## 列表创建

```python
# 空列表
empty_list = []
empty_list = list()

# 带初始值
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True, [1, 2]]

# 使用 list() 构造函数
list_from_string = list("hello")  # ['h', 'e', 'l', 'l', 'o']
list_from_tuple = list((1, 2, 3))  # [1, 2, 3]
list_from_range = list(range(5))   # [0, 1, 2, 3, 4]

# 列表推导式
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
```

## 索引与切片

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# 索引（从0开始）
numbers[0]    # 0（第一个元素）
numbers[-1]   # 9（最后一个元素）
numbers[-2]   # 8（倒数第二个）

# 切片 [start:stop:step]
numbers[2:5]     # [2, 3, 4]（包含2，不包含5）
numbers[:5]      # [0, 1, 2, 3, 4]（前5个）
numbers[5:]      # [5, 6, 7, 8, 9]（从第5个到末尾）
numbers[::2]     # [0, 2, 4, 6, 8]（每隔2个）
numbers[::-1]    # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]（反转）
numbers[5:1:-1]   # [5, 4, 3, 2]（反向切片）

# 切片创建新列表（不修改原列表）
original = [1, 2, 3, 4, 5]
copy = original[:]  # [1, 2, 3, 4, 5]
```

## 列表方法

### 添加元素

```python
numbers = [1, 2, 3]

# append()：添加到末尾
numbers.append(4)          # [1, 2, 3, 4]

# extend()：扩展列表
numbers.extend([5, 6])     # [1, 2, 3, 4, 5, 6]

# insert()：在指定位置插入
numbers.insert(0, 0)       # [0, 1, 2, 3, 4, 5, 6]
numbers.insert(3, 2.5)     # [0, 1, 2, 2.5, 3, 4, 5, 6]

# 列表拼接
result = [1, 2] + [3, 4]    # [1, 2, 3, 4]
result = [1, 2] * 3        # [1, 2, 1, 2, 1, 2]
```

### 删除元素

```python
numbers = [0, 1, 2, 3, 4, 5]

# remove()：删除指定值
numbers.remove(3)          # [0, 1, 2, 4, 5]
# numbers.remove(10)       # ValueError（值不存在）

# pop()：删除并返回元素
last = numbers.pop()       # 5（删除最后一个）
numbers.pop(0)             # 0（删除指定位置）

# del 语句
del numbers[1]             # 删除索引1的元素
del numbers[1:3]           # 删除切片
del numbers[:]             # 清空列表

# clear()：清空列表
numbers.clear()            # []
```

### 查找与统计

```python
numbers = [1, 2, 3, 2, 4, 2, 5]

# index()：查找元素索引
numbers.index(3)           # 2（首次出现的位置）
numbers.index(2, 2)        # 3（从索引2开始查找）
# numbers.index(10)        # ValueError（元素不存在）

# count()：统计元素出现次数
numbers.count(2)           # 3

# in 运算符
3 in numbers               # True
10 in numbers              # False
10 not in numbers          # True

# len()：列表长度
len(numbers)               # 7
```

### 排序与反转

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# sort()：原地排序
numbers.sort()             # [1, 1, 2, 3, 4, 5, 6, 9]
numbers.sort(reverse=True) # [9, 6, 5, 4, 3, 2, 1, 1]

# sorted()：返回新列表
numbers = [3, 1, 4, 1, 5]
sorted_numbers = sorted(numbers)  # [1, 1, 3, 4, 5]
sorted_desc = sorted(numbers, reverse=True)  # [5, 4, 3, 1, 1]

# reverse()：原地反转
numbers.reverse()          # [5, 1, 4, 1, 3]

# reversed()：返回反向迭代器
list(reversed(numbers))   # [3, 1, 4, 1, 5]

# key 参数排序
words = ["banana", "Apple", "cherry"]
words.sort(key=str.lower)  # ['Apple', 'banana', 'cherry']

# 多级排序
students = [
    ("Alice", 25),
    ("Bob", 20),
    ("Charlie", 25)
]
students.sort(key=lambda x: (x[1], x[0]))
# [('Bob', 20), ('Alice', 25), ('Charlie', 25)]
```

## 列表操作

### 复制列表

```python
original = [1, 2, 3, 4, 5]

# 浅拷贝
copy1 = original[:]        # 切片复制
copy2 = original.copy()    # copy() 方法
copy3 = list(original)     # list() 构造
import copy
copy4 = copy.copy(original) # copy 模块

# 深拷贝（嵌套列表）
nested = [[1, 2], [3, 4]]
deep_copy = copy.deepcopy(nested)

# 注意：赋值不是复制
reference = original  # 两者指向同一对象
reference[0] = 99
print(original)  # [99, 2, 3, 4, 5]
```

### 列表比较

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = [1, 2, 4]

# 值比较
a == b  # True
a == c  # False
a != c  # True

# 顺序比较
a < c   # True（逐元素比较）
a <= c  # True
a > c   # False

# 身份比较
a is b  # False（不同对象）
a is a  # True
```

### 列表解包

```python
# 基本解包
numbers = [1, 2, 3]
a, b, c = numbers  # a=1, b=2, c=3

# 使用 * 收集剩余元素
numbers = [1, 2, 3, 4, 5]
first, *rest, last = numbers
# first=1, rest=[2, 3, 4], last=5

# 嵌套解包
matrix = [[1, 2], [3, 4]]
[[a, b], [c, d]] = matrix
# a=1, b=2, c=3, d=4
```

## 列表推导式

```python
# 基本推导式
squares = [x**2 for x in range(10)]

# 带条件过滤
evens = [x for x in range(20) if x % 2 == 0]

# 嵌套循环
matrix = [[i*j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]

# 条件表达式
result = [x if x % 2 == 0 else "odd" for x in range(5)]
# ['odd', 0, 'odd', 2, 'odd']

# 复杂表达式
words = ["hello", "world", "python"]
upper_words = [word.upper() for word in words if len(word) > 5]
# ['PYTHON']

# 调用函数
import math
roots = [math.sqrt(x) for x in range(10) if x > 0]
```

## 列表作为栈和队列

### 栈操作（LIFO）

```python
stack = []

# push
stack.append(1)
stack.append(2)
stack.append(3)

# pop
item = stack.pop()  # 3
item = stack.pop()  # 2
```

### 队列操作（FIFO）

```python
from collections import deque

queue = deque()

# enqueue
queue.append(1)
queue.append(2)

# dequeue
item = queue.popleft()  # 1
```

### 双端队列

```python
from collections import deque

dq = deque([1, 2, 3])

# 两端添加
dq.append(4)       # 右端添加
dq.appendleft(0)    # 左端添加

# 两端弹出
dq.pop()            # 右端弹出
dq.popleft()        # 左端弹出

# 旋转
dq.rotate(1)        # 向右旋转1位
dq.rotate(-1)       # 向左旋转1位
```

## 列表性能

```python
# 时间复杂度（n为列表长度）
operation = {
    "索引访问": "O(1)",
    "append": "O(1)",
    "pop(末尾)": "O(1)",
    "insert": "O(n)",
    "pop(中间)": "O(n)",
    "删除": "O(n)",
    "查找": "O(n)",
    "切片": "O(k)",
}
```

::: tip 性能建议

1. **频繁头部操作**：使用 `collections.deque`
2. **频繁查找**：使用 `set` 或 `dict`
3. **频繁成员检查**：转换为 `set`
4. **大数据排序**：使用 `sorted()` 而非 `.sort()`
:::

## 常用模式

```python
# 去重（保持顺序）
items = [1, 2, 2, 3, 1, 4]
unique = []
seen = set()
for item in items:
    if item not in seen:
        seen.add(item)
        unique.append(item)
# [1, 2, 3, 4]

# 分组
from itertools import groupby
numbers = [1, 1, 2, 2, 3, 3, 3]
groups = [(k, list(g)) for k, g in groupby(numbers)]
# [(1, [1, 1]), (2, [2, 2]), (3, [3, 3, 3])]

# 扁平化嵌套列表
nested = [[1, 2], [3, 4], [5]]
flat = [item for sublist in nested for item in sublist]
# [1, 2, 3, 4, 5]

# 矩阵转置
matrix = [[1, 2, 3], [4, 5, 6]]
transposed = list(zip(*matrix))
# [(1, 4), (2, 5), (3, 6)]
```
