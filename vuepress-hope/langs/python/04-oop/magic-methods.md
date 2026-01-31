---
title: 魔术方法
icon: ri:magic-line
order: 4
---

# 魔术方法

魔术方法（Magic Methods）是 Python 中以双下划线开头和结尾的特殊方法，用于实现对象的特殊行为。

## 表示方法

### __str__ 与 __repr__

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        """用户友好的字符串表示"""
        return f"Point({self.x}, {self.y})"

    def __repr__(self):
        """开发者友好的字符串表示（用于调试）"""
        return f"Point(x={self.x}, y={self.y})"

p = Point(3, 4)

print(p)      # Point(3, 4)（使用 __str__）
print(str(p)) # Point(3, 4)
print(repr(p)) # Point(x=3, y=4)

# 在列表中显示时使用 __repr__
points = [p]
print(points)  # [Point(x=3, y=4)]
```

### __format__

```python
class Date:
    def __init__(self, day, month, year):
        self.day = day
        self.month = month
        self.year = year

    def __format__(self, format_spec):
        if format_spec == "dmy":
            return f"{self.day:02d}/{self.month:02d}/{self.year:04d}"
        elif format_spec == "mdy":
            return f"{self.month:02d}/{self.day:02d}/{self.year:04d}"
        elif format_spec == "ymd":
            return f"{self.year:04d}-{self.month:02d}-{self.day:02d}"
        else:
            return str(self)

date = Date(15, 8, 2024)

f"{date:dmy}"  # 15/08/2024
f"{date:mdy}"  # 08/15/2024
f"{date:ymd}"  # 2024-08-15
```

## 比较方法

### 完整比较协议

```python
class Version:
    def __init__(self, major, minor, patch):
        self.major = major
        self.minor = minor
        self.patch = patch

    def __eq__(self, other):
        """相等比较"""
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor, self.patch) == \
               (other.major, other.minor, other.patch)

    def __lt__(self, other):
        """小于比较"""
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor, self.patch) < \
               (other.major, other.minor, other.patch)

    def __le__(self, other):
        """小于等于"""
        return self == other or self < other

    def __gt__(self, other):
        """大于"""
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor, self.patch) > \
               (other.major, other.minor, other.patch)

    def __ge__(self, other):
        """大于等于"""
        return self == other or self > other

    def __ne__(self, other):
        """不等于"""
        return not self == other

    def __repr__(self):
        return f"Version({self.major}, {self.minor}, {self.patch})"

v1 = Version(1, 2, 3)
v2 = Version(1, 10, 0)

v1 < v2   # True（1.2.3 < 1.10.0）
v1 == v2  # False
```

### 使用 functools.total_ordering

```python
from functools import total_ordering

@total_ordering
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def __eq__(self, other):
        if not isinstance(other, Student):
            return NotImplemented
        return self.score == other.score

    def __lt__(self, other):
        if not isinstance(other, Student):
            return NotImplemented
        return self.score < other.score

    def __repr__(self):
        return f"Student({self.name}, {self.score})"

# 只需定义 __eq__ 和 __lt__，其他比较自动生成
s1 = Student("Alice", 85)
s2 = Student("Bob", 90)

s1 <= s2  # True
s1 > s2   # False
```

## 算术运算符

### 基本算术运算

```python
class Fraction:
    def __init__(self, numerator, denominator):
        if denominator == 0:
            raise ValueError("Denominator cannot be zero")
        self.numerator = numerator
        self.denominator = denominator

    def __add__(self, other):
        """加法: +"""
        if isinstance(other, Fraction):
            new_num = self.numerator * other.denominator + \
                      other.numerator * self.denominator
            new_den = self.denominator * other.denominator
            return Fraction(new_num, new_den)
        elif isinstance(other, (int, float)):
            return Fraction(self.numerator + other * self.denominator,
                          self.denominator)
        return NotImplemented

    def __sub__(self, other):
        """减法: -"""
        if isinstance(other, Fraction):
            new_num = self.numerator * other.denominator - \
                      other.numerator * self.denominator
            new_den = self.denominator * other.denominator
            return Fraction(new_num, new_den)
        return NotImplemented

    def __mul__(self, other):
        """乘法: *"""
        if isinstance(other, Fraction):
            return Fraction(self.numerator * other.numerator,
                          self.denominator * other.denominator)
        elif isinstance(other, (int, float)):
            return Fraction(self.numerator * other,
                          self.denominator)
        return NotImplemented

    def __truediv__(self, other):
        """真除法: /"""
        if isinstance(other, Fraction):
            return Fraction(self.numerator * other.denominator,
                          self.denominator * other.numerator)
        return NotImplemented

    def __floordiv__(self, other):
        """地板除: //"""
        result = self / other
        return result.numerator // result.denominator

    def __mod__(self, other):
        """取模: %"""
        if isinstance(other, Fraction):
            result = self / other
            return result.numerator % result.denominator
        return NotImplemented

    def __pow__(self, other):
        """幂运算: **"""
        if isinstance(other, int):
            return Fraction(self.numerator ** other,
                          self.denominator ** other)
        return NotImplemented

    def __repr__(self):
        return f"Fraction({self.numerator}/{self.denominator})"

f1 = Fraction(1, 2)
f2 = Fraction(1, 4)

f1 + f2     # Fraction(6/8) 即 3/4
f1 - f2     # Fraction(2/8) 即 1/4
f1 * f2     # Fraction(1/8)
f1 / f2     # Fraction(4/2) 即 2
f1 ** 2     # Fraction(1/4)
```

### 反向算术运算

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        if isinstance(other, Vector):
            return Vector(self.x + other.x, self.y + other.y)
        return NotImplemented

    def __radd__(self, other):
        """右加法: 当 Vector 在右侧时调用"""
        if isinstance(other, (int, float)):
            return Vector(other + self.x, other + self.y)
        return NotImplemented

    def __mul__(self, scalar):
        if isinstance(scalar, (int, float)):
            return Vector(self.x * scalar, self.y * scalar)
        return NotImplemented

    def __rmul__(self, scalar):
        """右乘法"""
        return self.__mul__(scalar)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v = Vector(1, 2)

3 + v     # Vector(4, 5)（使用 __radd__）
v + 3     # Vector(4, 5)（使用 __add__）
5 * v     # Vector(5, 10)（使用 __rmul__）
```

### 增量运算

```python
class Counter:
    def __init__(self, value=0):
        self.value = value

    def __iadd__(self, other):
        """增量加法: +="""
        if isinstance(other, (int, Counter)):
            if isinstance(other, Counter):
                self.value += other.value
            else:
                self.value += other
            return self
        return NotImplemented

    def __isub__(self, other):
        """增量减法: -="""
        if isinstance(other, (int, Counter)):
            if isinstance(other, Counter):
                self.value -= other.value
            else:
                self.value -= other
            return self
        return NotImplemented

    def __repr__(self):
        return f"Counter({self.value})"

c1 = Counter(10)
c2 = Counter(5)

c1 += c2   # Counter(15)
c1 -= 3    # Counter(12)
```

## 类型转换

```python
class Money:
    def __init__(self, amount, currency="USD"):
        self.amount = amount
        self.currency = currency

    def __bool__(self):
        """布尔转换"""
        return self.amount != 0

    def __int__(self):
        """整数转换"""
        return int(self.amount)

    def __float__(self):
        """浮点数转换"""
        return float(self.amount)

    def __complex__(self):
        """复数转换"""
        return complex(self.amount, 0)

    def __abs__(self):
        """绝对值"""
        return Money(abs(self.amount), self.currency)

    def __round__(self, ndigits=None):
        """四舍五入"""
        if ndigits is None:
            return Money(round(self.amount), self.currency)
        return Money(round(self.amount, ndigits), self.currency)

    def __repr__(self):
        return f"Money({self.amount}, {self.currency})"

money = Money(99.99, "CNY")

bool(money)   # True
int(money)    # 99
float(money)  # 99.99
abs(money)    # Money(99.99, CNY)
round(money)  # Money(100, CNY)
```

## 容器协议

### 可迭代对象

```python
class Range:
    def __init__(self, start, end, step=1):
        self.start = start
        self.end = end
        self.step = step

    def __iter__(self):
        """返回迭代器"""
        current = self.start
        while current < self.end:
            yield current
            current += self.step

for num in Range(0, 10, 2):
    print(num)  # 0, 2, 4, 6, 8
```

### 序列协议

```python
class CustomList:
    def __init__(self, items):
        self._items = list(items)

    def __len__(self):
        """长度"""
        return len(self._items)

    def __getitem__(self, index):
        """获取元素"""
        if isinstance(index, slice):
            return CustomList(self._items[index])
        return self._items[index]

    def __setitem__(self, index, value):
        """设置元素"""
        self._items[index] = value

    def __delitem__(self, index):
        """删除元素"""
        del self._items[index]

    def __contains__(self, item):
        """成员检查"""
        return item in self._items

    def __repr__(self):
        return f"CustomList({self._items})"

lst = CustomList([1, 2, 3, 4, 5])

len(lst)           # 5
lst[1]             # 2
lst[1:3]           # CustomList([2, 3])
lst[2] = 30        # 修改
3 in lst           # True
del lst[0]         # 删除
```

### 映射协议

```python
class CaseInsensitiveDict:
    def __init__(self, data=None):
        self._data = {}
        if data:
            self.update(data)

    def __getitem__(self, key):
        return self._data[key.lower()]

    def __setitem__(self, key, value):
        self._data[key.lower()] = value

    def __delitem__(self, key):
        del self._data[key.lower()]

    def __contains__(self, key):
        return key.lower() in self._data

    def __len__(self):
        return len(self._data)

    def __iter__(self):
        return iter(self._data)

    def __repr__(self):
        return f"CaseInsensitiveDict({dict(self._data)})"

d = CaseInsensitiveDict()
d["Name"] = "Alice"
d["name"]     # "Alice"（不区分大小写）
"NAME" in d   # True
```

## 可调用对象

```python
class Factorial:
    def __init__(self):
        self.cache = {0: 1, 1: 1}

    def __call__(self, n):
        """使对象可调用"""
        if n not in self.cache:
            self.cache[n] = n * self(n - 1)
        return self.cache[n]

factorial = Factorial()

factorial(5)  # 120
factorial(10) # 3628800
```

## 上下文管理器

```python
class Timer:
    def __init__(self, name="Operation"):
        self.name = name

    def __enter__(self):
        """进入上下文"""
        import time
        self.start_time = time.time()
        print(f"[{self.name}] Started")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出上下文"""
        import time
        end_time = time.time()
        elapsed = end_time - self.start_time
        print(f"[{self.name}] Finished in {elapsed:.4f}s")

        # 返回 False 表示不抑制异常
        # 返回 True 表示抑制异常
        return False

with Timer("Data Loading"):
    # 执行一些操作
    sum(range(1000000))
# [Data Loading] Started
# [Data Loading] Finished in 0.0123s
```

### 异步上下文管理器

```python
class AsyncTimer:
    def __init__(self, name="Async Operation"):
        self.name = name

    async def __aenter__(self):
        """进入异步上下文"""
        import asyncio
        self.start_time = asyncio.get_event_loop().time()
        print(f"[{self.name}] Started")
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """退出异步上下文"""
        import asyncio
        end_time = asyncio.get_event_loop().time()
        elapsed = end_time - self.start_time
        print(f"[{self.name}] Finished in {elapsed:.4f}s")
        return False

async def main():
    async with AsyncTimer("Async Task"):
        await asyncio.sleep(1)

# asyncio.run(main())
```

## 属性访问

```python
class ProtectedAttributes:
    def __init__(self):
        self._data = {}

    def __getattr__(self, name):
        """访问不存在的属性时调用"""
        if name.startswith("protected_"):
            return f"Access denied for {name}"
        raise AttributeError(f"'{type(self).__name__}' object has no attribute '{name}'")

    def __setattr__(self, name, value):
        """设置属性时调用"""
        if name.startswith("_"):
            super().__setattr__(name, value)
        else:
            print(f"Cannot set public attribute '{name}'")

    def __delattr__(self, name):
        """删除属性时调用"""
        if name.startswith("_"):
            super().__delattr__(name)
        else:
            raise AttributeError(f"Cannot delete '{name}'")

obj = ProtectedAttributes()
obj._data = {"key": "value"}  # 允许
obj.public = "test"          # Cannot set public attribute 'public'
obj.protected_data           # "Access denied for protected_data"
```

### 描述符协议

```python
class ValidatedAttribute:
    """描述符：验证属性值"""
    def __init__(self, name, validator):
        self.name = name
        self.validator = validator

    def __get__(self, obj, objtype):
        if obj is None:
            return self
        return obj.__dict__.get(f"_{self.name}")

    def __set__(self, obj, value):
        if not self.validator(value):
            raise ValueError(f"Invalid value for {self.name}")
        obj.__dict__[f"_{self.name}"] = value

    def __delete__(self, obj):
        raise AttributeError(f"Cannot delete {self.name}")

class Person:
    name = ValidatedAttribute("name", lambda x: isinstance(x, str) and len(x) > 0)
    age = ValidatedAttribute("age", lambda x: isinstance(x, int) and 0 <= x <= 150)

    def __init__(self, name, age):
        self.name = name
        self.age = age

person = Person("Alice", 25)
person.name  # "Alice"
# person.age = 200  # ValueError
```

## 对象创建销毁

```python
class TrackedClass:
    instances = []

    def __new__(cls, *args, **kwargs):
        """创建对象时调用"""
        print(f"Creating instance of {cls.__name__}")
        instance = super().__new__(cls)
        cls.instances.append(instance)
        return instance

    def __init__(self, value):
        """初始化对象时调用"""
        print(f"Initializing instance with value: {value}")
        self.value = value

    def __del__(self):
        """销毁对象时调用"""
        print(f"Destroying instance with value: {self.value}")
        if self in TrackedClass.instances:
            TrackedClass.instances.remove(self)

obj = TrackedClass(42)
# Creating instance of TrackedClass
# Initializing instance with value: 42

del obj
# Destroying instance with value: 42
```

## 杂项魔术方法

### __hash__

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __hash__(self):
        """使对象可哈希（可用作字典键或集合元素）"""
        return hash((self.x, self.y))

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(1, 2)

points_set = {p1, p2}  # {Point(1, 2)}（因为 __hash__ 和 __eq__）
points_dict = {p1: "first point"}
```

### __bytes__

```python
class Data:
    def __init__(self, content):
        self.content = content

    def __bytes__(self):
        """字节表示"""
        return self.content.encode('utf-8')

data = Data("Hello")
bytes(data)  # b'Hello'
```

### __index__

```python
class Number:
    def __init__(self, value):
        self.value = value

    def __index__(self):
        """用于切片等需要整数的地方"""
        return int(self.value)

num = Number(5)

range(10)[num]    # 5（用作索引）
[num] * 3         # [5, 5, 5]
```

## 魔术方法速查表

| 类别 | 方法 | 描述 |
|------|------|------|
| **表示** | `__str__` | 字符串表示 |
| | `__repr__` | 开发者表示 |
| | `__format__` | 格式化 |
| **比较** | `__eq__` | 等于 |
| | `__ne__` | 不等于 |
| | `__lt__` | 小于 |
| | `__le__` | 小于等于 |
| | `__gt__` | 大于 |
| | `__ge__` | 大于等于 |
| **算术** | `__add__` | 加法 |
| | `__sub__` | 减法 |
| | `__mul__` | 乘法 |
| | `__truediv__` | 真除法 |
| | `__floordiv__` | 地板除 |
| | `__mod__` | 取模 |
| | `__pow__` | 幂运算 |
| **反向** | `__radd__` | 右加法 |
| | `__rsub__` | 右减法 |
| | `__rmul__` | 右乘法 |
| **增量** | `__iadd__` | 增量加 |
| | `__isub__` | 增量减 |
| **类型** | `__bool__` | 布尔转换 |
| | `__int__` | 整数转换 |
| | `__float__` | 浮点转换 |
| | `__complex__` | 复数转换 |
| **容器** | `__len__` | 长度 |
| | `__getitem__` | 获取元素 |
| | `__setitem__` | 设置元素 |
| | `__delitem__` | 删除元素 |
| | `__contains__` | 成员检查 |
| | `__iter__` | 迭代器 |
| **可调用** | `__call__` | 调用对象 |
| **上下文** | `__enter__` | 进入上下文 |
| | `__exit__` | 退出上下文 |
| **属性** | `__getattr__` | 获取属性 |
| | `__setattr__` | 设置属性 |
| | `__delattr__` | 删除属性 |
| **描述符** | `__get__` | 描述符获取 |
| | `__set__` | 描述符设置 |
| | `__delete__` | 描述符删除 |
| **哈希** | `__hash__` | 哈希值 |

::: tip 魔术方法最佳实践

1. **成对实现**：比较和算术方法通常成对出现
2. **返回 NotImplemented**：类型不匹配时返回 NotImplemented
3. **保持一致性**：__eq__ 和 __hash__ 应保持一致
4. **使用装饰器**：@total_ordering 减少代码量
5. **文档清晰**：为每个魔术方法添加文档字符串

::: warning 注意事项

1. __del__ 不保证被调用（垃圾回收机制）
2. 避免在 __init__ 中调用可能被重写的方法
3. __new__ 主要用于不可变类型和元类
4. 描述符必须实现 __get__，__set__ 和 __delete__ 可选
:::
