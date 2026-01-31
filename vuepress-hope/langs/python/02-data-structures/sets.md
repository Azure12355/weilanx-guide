---
title: 集合
icon: ri:checkbox-blank-circle-line
order: 4
---

# 集合（Set）

集合是 Python 中无序、不重复元素的数据结构，支持数学集合运算。

## 集合创建

```python
# 空集合（必须使用 set()）
empty = set()
# empty = {}     # 这是字典，不是集合！

# 基本集合
numbers = {1, 2, 3, 4, 5}
colors = {"red", "green", "blue"}

# 自动去重
numbers = {1, 2, 2, 3, 3, 3}  # {1, 2, 3}

# 使用 set() 构造函数
from_list = set([1, 2, 3, 2, 1])  # {1, 2, 3}
from_string = set("hello")          # {'h', 'e', 'l', 'o'}
from_range = set(range(5))          # {0, 1, 2, 3, 4}

# 集合推导式
squares = {x**2 for x in range(5)}  # {0, 1, 4, 9, 16}
evens = {x for x in range(10) if x % 2 == 0}  # {0, 2, 4, 6, 8}
```

## 集合方法

### 添加与删除

```python
numbers = {1, 2, 3, 4, 5}

# add()：添加元素
numbers.add(6)      # {1, 2, 3, 4, 5, 6}
numbers.add(1)      # {1, 2, 3, 4, 5, 6}（重复无效）

# remove()：删除元素（不存在会报错）
numbers.remove(3)   # {1, 2, 4, 5, 6}
# numbers.remove(10)  # KeyError

# discard()：安全删除（不存在不会报错）
numbers.discard(10)  # 什么也不做

# pop()：删除并返回任意元素
element = numbers.pop()

# clear()：清空集合
numbers.clear()     # set()
```

### 集合运算

```python
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

# 并集（| 或 union()）
a | b              # {1, 2, 3, 4, 5, 6, 7, 8}
a.union(b)         # {1, 2, 3, 4, 5, 6, 7, 8}
a | b | c          # 多个集合的并集

# 交集（& 或 intersection()）
a & b              # {4, 5}
a.intersection(b)   # {4, 5}

# 差集（- 或 difference()）
a - b              # {1, 2, 3}（在 a 中不在 b 中）
a.difference(b)    # {1, 2, 3}

# 对称差集（^ 或 symmetric_difference()）
a ^ b              # {1, 2, 3, 6, 7, 8}（不重叠的部分）
a.symmetric_difference(b)

# 子集与超集检查
{1, 2}.issubset(a)      # True（是子集）
{1, 2} <= a            # True
a.issuperset({1, 2})   # True（是超集）
a >= {1, 2}            # True

# 真子集/真超集
{1, 2} < a             # True（真子集）
a > {1, 2}             # True（真超集）

# 是否有交集
a.isdisjoint(b)        # False（有交集）
a.isdisjoint({10, 20}) # True（无交集）
```

### 集合方法

```python
numbers = {1, 2, 3, 4, 5}

# len()：集合大小
len(numbers)  # 5

# in 运算符：成员检查
3 in numbers     # True
10 in numbers    # False

# copy()：浅拷贝
numbers_copy = numbers.copy()

# 操作方法（返回新集合）
numbers.update({6, 7})      # 添加多个元素
numbers.intersection_update({4, 5, 6})  # 保留交集
numbers.difference_update({4, 5})       # 删除差集
numbers.symmetric_difference_update({4, 5, 6})  # 保留对称差
```

## 集合运算符

```python
a = {1, 2, 3}
b = {3, 4, 5}

# 运算符总结
a | b      # 并集
a & b      # 交集
a - b      # 差集
a ^ b      # 对称差

# 复合运算
a |= b     # a = a | b（更新 a）
a &= b     # a = a & b
a -= b     # a = a - b
a ^= b     # a = a ^ b
```

## frozenset（不可变集合）

```python
# 创建不可变集合
fs = frozenset([1, 2, 3, 2, 1])
# frozenset({1, 2, 3})

# 不能修改
# fs.add(4)   # AttributeError
# fs.remove(1)  # AttributeError

# 可作为字典键
d = {
    frozenset([1, 2]): "first",
    frozenset([3, 4]): "second",
}

# 集合的集合
s = {frozenset([1, 2]), frozenset([3, 4])}
```

## 集合应用

```python
# 去重
items = [1, 2, 2, 3, 3, 3]
unique = list(set(items))  # [1, 2, 3]（顺序不定）

# 保持顺序的去重
items = [1, 2, 2, 3, 3, 3]
seen = set()
unique = [x for x in items if not (x in seen or seen.add(x))]
# [1, 2, 3]

# 成员检查（高效）
allowed = {"Alice", "Bob", "Charlie"}
if "Alice" in allowed:
    print("Welcome")

# 找出差异
old_users = {"Alice", "Bob", "Charlie"}
new_users = {"Bob", "Charlie", "David"}
new_users - old_users  # {"David"}（新增）
old_users - new_users  # {"Alice"}（离开）

# 标签系统
post_tags = {"python", "programming", "tutorial"}
user_interests = {"python", "data-science"}

# 找出匹配的标签
matched = post_tags & user_interests  # {"python"}

# 找出未匹配的标签
unmatched = post_tags - user_interests  # {"programming", "tutorial"}

# 权限检查
admin_permissions = {"read", "write", "delete"}
user_permissions = {"read", "write"}

# 检查权限
if admin_permissions.issuperset(user_permissions):
    print("User has all admin permissions")

if {"read", "write"}.issubset(user_permissions):
    print("User can read and write")
```

## 集合性能

```python
# 时间复杂度
operations = {
    "添加": "O(1)",
    "删除": "O(1)",
    "成员检查": "O(1)",
    "并集": "O(len(a) + len(b))",
    "交集": "O(min(len(a), len(b)))",
    "差集": "O(len(a))",
}

# 性能比较（成员检查）
# 集合 vs 列表
import time

# 列表
lst = list(range(100000))
start = time.time()
99999 in lst  # False（遍历整个列表）
# 耗时：约 0.01 秒

# 集合
s = set(range(100000))
start = time.time()
99999 in s  # False（哈希查找）
# 耗时：约 0.000001 秒
```

## 集合 vs 列表

| 特性 | 集合 | 列表 |
|------|------|------|
| 有序性 | 无序（Python 3.7+ 插入顺序） | 有序 |
| 唯一性 | 自动去重 | 允许重复 |
| 索引 | 不支持 | 支持 |
| 性能 | 成员检查 O(1) | 成员检查 O(n) |
| 可哈希 | 可哈希（元素必须是可哈希） | 不可哈希 |

::: tip 使用场景

```python
# ✅ 使用集合的场景
# 1. 需要唯一性
unique_items = set(items)

# 2. 频繁成员检查
if item in allowed_items:

# 3. 集合运算
common = set_a & set_b

# 4. 去重
list(set(duplicate_items))

# ✅ 使用列表的场景
# 1. 需要保持顺序
items = [first, second, third]

# 2. 需要索引访问
items[0]
items[-1]

# 3. 允许重复
scores = [95, 85, 95, 90]
```

## 集合推导式高级用法

```python
# 多重条件
numbers = {x for x in range(100) if x % 2 == 0 if x % 3 == 0}
# {0, 6, 12, 18, ..., 96}

# 嵌套推导
matrix = {(x, y) for x in range(3) for y in range(3)}
# {(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)}

# 函数应用
import math
perfect_squares = {x for x in range(100) if int(math.sqrt(x))**2 == x}
# {0, 1, 4, 9, 16, 25, 36, 49, 64, 81}

# 字典键集合
d = {"a": 1, "b": 2, "c": 3}
keys = set(d.keys())  # {'a', 'b', 'c'}
```
