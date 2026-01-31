---
title: 类与对象
icon: ri:shape-line
order: 1
---

# 类与对象

类是创建对象的蓝图，对象是类的实例。

## 类定义

### 基本语法

```python
# 简单类
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, I'm {self.name}!"

# 创建实例
person = Person("Alice", 25)
person.greet()  # "Hello, I'm Alice!"

# 访问属性
person.name  # "Alice"
person.age   # 25
```

### 属性与方法

```python
class Student:
    # 类属性（共享）
    school = "Python High School"
    count = 0

    def __init__(self, name, age):
        # 实例属性
        self.name = name
        self.age = age
        # 修改类属性
        Student.count += 1

    # 实例方法
    def introduce(self):
        return f"I'm {self.name}, {self.age} years old."

    # 类方法
    @classmethod
    def get_count(cls):
        return cls.count

    # 静态方法
    @staticmethod
    def is_adult(age):
        return age >= 18

# 使用
student = Student("Bob", 20)
student.introduce()  # "I'm Bob, 20 years old."
Student.get_count()  # 1
Student.is_adult(20)  # True
```

### 私有属性

```python
class BankAccount:
    def __init__(self, initial_balance):
        self.__balance = initial_balance  # 私有属性

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def get_balance(self):
        return self.__balance

    # 名称修饰
    # __balance 实际上是 _BankAccount__balance
```

## 构造与析构

### __init__ 与 __new__

```python
class MyClass:
    def __new__(cls, *args, **kwargs):
        print("Creating instance")
        instance = super().__new__(cls)
        return instance

    def __init__(self, value):
        print("Initializing instance")
        self.value = value

# 使用
obj = MyClass(42)
# Creating instance
# Initializing instance
```

### __del__ 析构函数

```python
class Resource:
    def __init__(self, name):
        self.name = name
        print(f"Resource {name} created")

    def __del__(self):
        print(f"Resource {self.name} destroyed")

# 使用
r = Resource("file.txt")  # Resource file.txt created
del r  # Resource file.txt destroyed
```

## 继承

### 单继承

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "Some sound"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # 调用父类构造函数
        self.breed = breed

    def speak(self):
        return "Woof!"

# 使用
dog = Dog("Buddy", "Golden Retriever")
dog.speak()  # "Woof!"
dog.name    # "Buddy"
```

### 方法重写

```python
class Parent:
    def method(self):
        return "Parent method"

class Child(Parent):
    def method(self):
        # 调用父类方法
        original = super().method()
        return f"Child method ({original})"

child = Child()
child.method()  # "Child method (Parent method)"
```

### super() 函数

```python
class Base:
    def __init__(self, value):
        self.value = value

class Derived(Base):
    def __init__(self, value, extra):
        super().__init__(value)  # 调用父类 __init__
        self.extra = extra

    def method(self):
        return super().method()  # 调用父类方法
```

## 多态

### 方法重写

```python
class Shape:
    def area(self):
        raise NotImplementedError

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

# 多态使用
shapes = [Rectangle(5, 10), Circle(7)]
for shape in shapes:
    print(shape.area())  # 50, 153.938...
```

### 鸭子类型

```python
# Python 的鸭子类型：如果它走起来像鸭子...

class Duck:
    def quack(self):
        return "Quack!"

class Person:
    def quack(self):
        return "I'm quacking like a duck!"

def make_it_quack(obj):
    return obj.quack()

duck = Duck()
person = Person()

make_it_quack(duck)    # "Quack!"
make_it_quack(person)  # "I'm quacking like a duck!"
```

## 数据类

### @dataclass 装饰器（Python 3.7+）

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    z: float = 0.0

# 自动生成 __init__, __repr__, __eq__
p = Point(1.0, 2.0)
print(p)  # Point(x=1.0, y=2.0, z=0.0)

# 默认值
p2 = Point(1.0, 2.0, 3.0)

# 比较自动生成
p3 = Point(1.0, 2.0)
p == p3  # True
```

### 不可变数据类

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class ImmutablePoint:
    x: float
    y: float

point = ImmutablePoint(1.0, 2.0)
# point.x = 3.0  # FrozenInstanceError（无法修改）
```

## 属性装饰器

### @property

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below -273.15°C is not possible")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

# 使用
temp = Temperature(25)
temp.celsius        # 25
temp.fahrenheit     # 77.0
temp.celsius = 30    # 设置新值
# temp.celsius = -300  # ValueError
```

### __slots__

```python
class OptimizedClass:
    __slots__ = ['name', 'age']  # 限制属性

    def __init__(self, name, age):
        self.name = name
        self.age = age

# 优点：
# 1. 节省内存（不需要 __dict__）
# 2. 提高访问速度

# 缺点：
# 1. 不能添加新属性
# 2. 不能使用 __dict__ 或 __weakref__

obj = OptimizedClass("Alice", 25)
# obj.email = "alice@example.com"  # AttributeError
```

## 类的最佳实践

::: tip 类设计原则

1. **单一职责**：每个类只做一件事
2. **封装**：隐藏内部实现
3. **组合优于继承**：多用组合，少用继承
4. **显式优于隐式**：明确的方法名
5. **文档字符串**：使用 docstring 说明类和方法

::: tip 命名规范

- **类名**：PascalCase（如 `MyClass`）
- **方法/函数**：snake_case（如 `my_method`）
- **私有属性**：_leading_underscore（如 `_private`）
- **真正私有**：__double_underscore（如 `__private`）
:::
