---
title: 多态与封装
icon: ri:shuffle-line
order: 3
---

# 多态与封装

多态和封装是面向对象编程的核心概念。

## 多态

### 方法重写

```python
class Animal:
    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

class Robot(Animal):
    def speak(self):
        return "Beep boop"

# 多态调用
animals = [Dog(), Cat(), Robot()]
for animal in animals:
    print(animal.speak())
# Woof!
# Meow!
# Beep boop
```

### 接口与协议

```python
# Python 没有真正的接口，但可以通过抽象基类模拟
from abc import ABC, abstractmethod

class Printable(ABC):
    @abstractmethod
    def print(self):
        pass

class Document(Printable):
    def __init__(self, content):
        self.content = content

    def print(self):
        print(self.content)

class Image(Printable):
    def __init__(self, data):
        self.data = data

    def print(self):
        print(f"[Image data: {len(self.data)} bytes]")

# 使用接口
items = [Document("Hello"), Image(b"binary_data")]
for item in items:
    item.print()
```

### 鸭子类型

```python
# 不需要显式继承，只需实现相同方法
class File:
    def read(self):
        return "File content"

class Database:
    def read(self):
        return "Database data"

class NetworkResource:
    def read(self):
        return "Network data"

def process_resource(resource):
    # 只要对象有 read() 方法即可
    return resource.read()

file = File()
db = Database()
network = NetworkResource()

process_resource(file)     # "File content"
process_resource(db)        # "Database data"
process_resource(network)  # "Network data"
```

## 运算符重载

### 比较运算符

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __lt__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return (self.x**2 + self.y**2) < (other.x**2 + other.y**2)

    def __le__(self, other):
        return self == other or self < other

v1 = Vector(1, 2)
v2 = Vector(3, 4)

v1 == v2  # False
v1 < v2   # True
v1 <= v2  # True
```

### 算术运算符

```python
class ComplexNumber:
    def __init__(self, real, imag):
        self.real = real
        self.imag = imag

    def __add__(self, other):
        return ComplexNumber(
            self.real + other.real,
            self.imag + other.imag
        )

    def __sub__(self, other):
        return ComplexNumber(
            self.real - other.real,
            self.imag - other.imag
        )

    def __mul__(self, scalar):
        return ComplexNumber(
            self.real * scalar,
            self.imag * scalar
        )

    def __repr__(self):
        return f"{self.real} + {self.imag}i"

c1 = ComplexNumber(1, 2)
c2 = ComplexNumber(3, 4)

c1 + c2     # 4 + 6i
c1 - c2     # -2 + -2i
c1 * 3      # 3 + 6i
```

### 反射运算符

```python
class Container:
    def __init__(self, items):
        self.items = items

    def __contains__(self, item):
        return item in self.items

    def __len__(self):
        return len(self.items)

    def __getitem__(self, index):
        return self.items[index]

    def __setitem__(self, index, value):
        self.items[index] = value

    def __delitem__(self, index):
        del self.items[index]

container = Container([1, 2, 3])

2 in container          # True
len(container)          # 3
container[1]             # 2
container[1] = 20        # 修改
del container[1]         # 删除
```

## 封装

### 访问控制

```python
class BankAccount:
    def __init__(self, account_number, balance):
        # 公有属性
        self.account_number = account_number
        # 私有属性（名称修饰）
        self.__balance = balance
        # 受保护属性
        self._owner = "Unknown"

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def get_balance(self):
        # 只读访问私有属性
        return self.__balance

    def _internal_method(self):
        # 受保护方法（约定）
        return "Internal use only"

account = BankAccount("12345", 1000)
account.account_number  # "12345"（公有）
# account.__balance     # 无法直接访问（实际是 _BankAccount__balance）
account.get_balance()   # 1000（通过方法访问）
account._internal_method()  # "Internal use only"（约定，但可访问）
```

### 属性装饰器

```python
class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age

    @property
    def name(self):
        """获取姓名（只读）"""
        return self._name

    @property
    def age(self):
        """获取年龄"""
        return self._age

    @age.setter
    def age(self, value):
        """设置年龄（带验证）"""
        if value < 0:
            raise ValueError("Age cannot be negative")
        if value > 150:
            raise ValueError("Invalid age")
        self._age = value

person = Person("Alice", 25)
person.name     # "Alice"（只读）
# person.name = "Bob"  # AttributeError（只读属性）
person.age      # 25
person.age = 30   # 通过 setter 验证
# person.age = -10  # ValueError
```

### 私有方法

```python
class SecureData:
    def __init__(self, data):
        self.__data = data

    def __encrypt(self, text):
        """私有方法：加密"""
        return text[::-1]  # 简单反转

    def get_data(self):
        """公开方法：返回加密的数据"""
        return self.__encrypt(self.__data)

data = SecureData("secret")
data.get_data()  # "terces"（加密后）
# data.__encrypt("text")  # 无法直接调用（实际是 _SecureData__encrypt）
```

## 抽象基类与多态

```python
from abc import ABC, abstractmethod

class DataProcessor(ABC):
    @abstractmethod
    def process(self, data):
        """处理数据"""
        pass

class CSVProcessor(DataProcessor):
    def process(self, data):
        # 处理 CSV 数据
        return f"CSV: {data}"

class JSONProcessor(DataProcessor):
    def process(self, data):
        # 处理 JSON 数据
        return f"JSON: {data}"

class XMLProcessor(DataProcessor):
    def process(self, data):
        # 处理 XML 数据
        return f"XML: {data}"

# 多态使用
processors = [
    CSVProcessor(),
    JSONProcessor(),
    XMLProcessor()
]

data = "sample data"
for processor in processors:
    print(processor.process(data))
# CSV: sample data
# JSON: sample data
# XML: sample data
```

## 封装的最佳实践

::: tip 封装原则

1. **隐藏实现细节**：外部不需要知道内部如何工作
2. **提供清晰接口**：通过公开方法暴露功能
3. **保护内部状态**：验证输入，维护不变量
4. **最小权限原则**：属性和方法按需设置访问级别

::: tip 访问级别约定

- `public`：公开属性和方法（无前缀）
- `_protected`：受保护（单下划线，约定不直接访问）
- `__private`：私有（双下划线，名称修饰）

::: warning 注意事项

```python
# Python 的"私有"不是真正私有
class MyClass:
    def __init__(self):
        self.__private = "private"

obj = MyClass()
# 实际上还是可以访问（通过名称修饰）
obj._MyClass__private  # "private"
```
