---
title: 字典
icon: ri:book-mark-line
order: 3
---

# 字典（Dict）

字典是 Python 中最重要的数据结构之一，存储键值对（Key-Value）映射。

## 字典创建

```python
# 空字典
empty = {}
empty = dict()

# 基本字典
person = {
    "name": "Alice",
    "age": 25,
    "city": "Beijing"
}

# 使用 dict() 构造函数
person = dict(name="Bob", age=30)
# {'name': 'Bob', 'age': 30}

# 从键值对列表创建
items = [("name", "Charlie"), ("age", 35)]
person = dict(items)
# {'name': 'Charlie', 'age': 35}

# 字典推导式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# fromkeys() 创建相同值的字典
keys = ["a", "b", "c"]
dict.fromkeys(keys)         # {'a': None, 'b': None, 'c': None}
dict.fromkeys(keys, 0)      # {'a': 0, 'b': 0, 'c': 0}
```

## 访问与修改

### 基本操作

```python
person = {"name": "Alice", "age": 25}

# 访问值
person["name"]      # "Alice"
# person["email"]   # KeyError（键不存在）

# 安全访问（指定默认值）
person.get("name")         # "Alice"
person.get("email")        # None
person.get("email", "N/A") # "N/A"

# 添加/修改键值对
person["email"] = "alice@example.com"  # 添加
person["age"] = 26                      # 修改

# setdefault()：不存在则设置
person.setdefault("phone", "123-4567")  # "123-4567"（设置并返回）
person.setdefault("name", "Bob")        # "Alice"（已存在，不修改）
```

### 删除元素

```python
person = {"name": "Alice", "age": 25, "city": "Beijing"}

# del 语句
del person["age"]      # 删除键
# del person["email"]  # KeyError

# pop()：删除并返回值
age = person.pop("age")       # 25
person.pop("email", "N/A")   # "N/A"（指定默认值）
# person.pop("email")        # KeyError

# popitem()：删除并返回任意键值对（LIFO）
item = person.popitem()  # ('city', 'Beijing')

# clear()：清空字典
person.clear()  # {}
```

## 字典方法

### 视图对象

```python
person = {"name": "Alice", "age": 25, "city": "Beijing"}

# keys()：键视图
person.keys()  # dict_keys(['name', 'age', 'city'])

# values()：值视图
person.values()  # dict_values(['Alice', 25, 'Beijing'])

# items()：键值对视图
person.items()  # dict_items([('name', 'Alice'), ('age', 25), ('city', 'Beijing')])

# 视图是动态的
keys = person.keys()
"age" in keys  # True
person.pop("age")
"age" in keys  # False
```

### 更新与合并

```python
# update()：更新字典
person = {"name": "Alice", "age": 25}

# 使用字典
person.update({"age": 26, "city": "Beijing"})
# {'name': 'Alice', 'age': 26, 'city': 'Beijing'}

# 使用关键字
person.update(age=27, email="alice@example.com")
# {'name': 'Alice', 'age': 27, 'city': 'Beijing', 'email': 'alice@example.com'}

# 使用可迭代对象
person.update([("phone", "123456"), ("country", "China")])
```

### 其他方法

```python
person = {"name": "Alice", "age": 25}

# len()：字典大小
len(person)  # 2

# in 运算符：检查键
"name" in person   # True
"email" in person  # False

# copy()：浅拷贝
person_copy = person.copy()

# setdefault()：获取或设置默认值
person.setdefault("email", "N/A")  # "N/A"

# 字典比较
d1 = {"a": 1, "b": 2}
d2 = {"a": 1, "b": 2}
d1 == d2  # True
```

## 字典遍历

```python
person = {"name": "Alice", "age": 25, "city": "Beijing"}

# 遍历键
for key in person:
    print(key, person[key])

# 遍历键（推荐）
for key in person.keys():
    print(key)

# 遍历值
for value in person.values():
    print(value)

# 遍历键值对（推荐）
for key, value in person.items():
    print(f"{key}: {value}")

# 同时使用索引和键值对
for i, (key, value) in enumerate(person.items()):
    print(f"{i}: {key} = {value}")
```

## 字典推导式

```python
# 基本推导式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 带条件过滤
evens = {x: x**2 for x in range(10) if x % 2 == 0}
# {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# 转换字典
original = {"a": 1, "b": 2, "c": 3}
upper_keys = {k.upper(): v for k, v in original.items()}
# {'A': 1, 'B': 2, 'C': 3}

# 值转换
doubled = {k: v*2 for k, v in original.items()}
# {'a': 2, 'b': 4, 'c': 6}

# 过滤字典
filtered = {k: v for k, v in original.items() if v > 1}
# {'b': 2, 'c': 3}

# 从两个列表创建
keys = ["name", "age", "city"]
values = ["Alice", 25, "Beijing"]
person = dict(zip(keys, values))
# {'name': 'Alice', 'age': 25, 'city': 'Beijing'}
```

## 字典排序

```python
person = {"name": "Alice", "age": 25, "city": "Beijing"}

# 按键排序
sorted_by_key = dict(sorted(person.items()))
# {'age': 25, 'city': 'Beijing', 'name': 'Alice'}

# 按值排序
sorted_by_value = dict(sorted(person.items(), key=lambda x: x[1]))
# {'age': 25, 'name': 'Alice', 'city': 'Beijing'}

# 反向排序
reverse_sorted = dict(sorted(person.items(), reverse=True))
# {'name': 'Alice', 'city': 'Beijing', 'age': 25}

# 复杂排序
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 78}
]
sorted_students = sorted(students, key=lambda x: x["score"], reverse=True)
```

## 嵌套字典

```python
# 多层嵌套
data = {
    "user": {
        "name": "Alice",
        "age": 25,
        "address": {
            "city": "Beijing",
            "district": "Chaoyang"
        }
    },
    "settings": {
        "theme": "dark",
        "language": "zh-CN"
    }
}

# 访问嵌套数据
data["user"]["name"]              # "Alice"
data["user"]["address"]["city"]    # "Beijing"

# 安全访问嵌套数据
def safe_get(d, keys, default=None):
    for key in keys:
        if isinstance(d, dict) and key in d:
            d = d[key]
        else:
            return default
    return d

safe_get(data, ["user", "address", "city"])    # "Beijing"
safe_get(data, ["user", "phone"])              # None
```

## 默认字典

```python
from collections import defaultdict

# 默认值为列表
words = defaultdict(list)
words["apple"].append("A fruit")
words["apple"].append("A tech company")
# defaultdict(list, {'apple': ['A fruit', 'A tech company']})

# 默认值为整数
counter = defaultdict(int)
for letter in "hello":
    counter[letter] += 1
# defaultdict(int, {'h': 1, 'e': 1, 'l': 2, 'o': 1})

# 默认值为 set
groups = defaultdict(set)
groups["fruit"].add("apple")
groups["fruit"].add("banana")
# defaultdict(set, {'fruit': {'apple', 'banana'}})

# 自定义默认值
def default_value():
    return "N/A"

d = defaultdict(default_value)
d["name"]  # "N/A"
```

## 有序字典

```python
from collections import OrderedDict

# Python 3.7+ 普通字典保持插入顺序
d = {}
d["a"] = 1
d["b"] = 2
d["c"] = 3
list(d.keys())  # ['a', 'b', 'c']

# OrderedDict 提供额外方法
from collections import OrderedDict
od = OrderedDict()
od["a"] = 1
od["b"] = 2
od["c"] = 3

# move_to_end()
od.move_to_end("a")  # 移到末尾
od.move_to_end("c", last=False)  # 移到开头

# popitem()
od.popitem(last=False)  # 弹出第一个
```

## 字典合并（Python 3.9+）

```python
# 使用 | 运算符合并
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}

merged = d1 | d2
# {'a': 1, 'b': 3, 'c': 4}（d2 覆盖 d1）

# 使用 |= 更新
d1 |= d2
# {'a': 1, 'b': 3, 'c': 4}

# 多个字典合并
d1 | d2 | d3
```

## 字典应用

```python
# 计数器
text = "hello world"
counter = {}
for char in text:
    counter[char] = counter.get(char, 0) + 1
# {'h': 1, 'e': 1, 'l': 3, 'o': 2, ' ': 1, 'w': 1, 'r': 1, 'd': 1}

# 分组
from itertools import groupby
data = [("Alice", 25), ("Bob", 30), ("Charlie", 25)]
groups = {}
for name, age in data:
    groups.setdefault(age, []).append(name)
# {25: ['Alice', 'Charlie'], 30: ['Bob']}

# 缓存/记忆化
cache = {}
def fibonacci(n):
    if n in cache:
        return cache[n]
    if n < 2:
        result = n
    else:
        result = fibonacci(n-1) + fibonacci(n-2)
    cache[n] = result
    return result
```

## 性能考虑

```python
# 时间复杂度
operations = {
    "访问/设置": "O(1)",
    "删除": "O(1)",
    "遍历": "O(n)",
    "复制": "O(n)",
}

# 大字典优化
# 1. 使用 __slots__ 减少内存
# 2. 考虑使用 defaultdict
# 3. 批量操作使用 update()
```

::: tip 最佳实践

1. **使用 `.get()` 而非直接访问**：避免 KeyError
2. **使用 `setdefault()` 或 `defaultdict`**：初始化复杂结构
3. **字典推导式**：简洁创建字典
4. **`items()` 遍历**：同时获取键和值
5. **Python 3.7+**：字典保持插入顺序
:::
