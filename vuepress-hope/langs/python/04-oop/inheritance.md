---
title: 继承
icon: ri:git-branch-line
order: 2
---

# 继承

继承允许类基于另一个类创建，复用代码并扩展功能。

## 单继承

### 基本语法

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "Some sound"

    def eat(self):
        return f"{self.name} is eating"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return "Woof!"

# 使用
dog = Dog("Buddy", "Golden Retriever")
dog.speak()  # "Woof!"
dog.eat()    # "Buddy is eating"（继承自 Animal）
```

### 方法重写

```python
class Parent:
    def method(self):
        return "Parent's method"

class Child(Parent):
    def method(self):
        return "Child's method"

    def parent_method(self):
        return super().method()

child = Child()
child.method()         # "Child's method"
child.parent_method()  # "Parent's method"
```

## 多继承

### 基本语法

```python
class Flyer:
    def fly(self):
        return "Flying"

class Swimmer:
    def swim(self):
        return "Swimming"

class Duck(Flyer, Swimmer):
    def quack(self):
        return "Quack!"

duck = Duck()
duck.fly()    # "Flying"
duck.swim()  # "Swimming"
duck.quack() # "Quack!"
```

### MRO（方法解析顺序）

```python
class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return "B"

class C(A):
    def method(self):
        return "C"

class D(B, C):
    pass

# MRO 顺序
print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

d = D()
d.method()  # "B"（按 MRO 顺序查找）
```

### super() 与多继承

```python
class Base:
    def __init__(self, value):
        self.value = value

class A(Base):
    def __init__(self, value):
        super().__init__(value)
        self.a_value = value * 2

class B(Base):
    def __init__(self, value):
        super().__init__(value)
        self.b_value = value * 3

class C(A, B):
    def __init__(self, value):
        super().__init__(value)  # 按照类 C 的 MRO 调用下一个类
        self.c_value = value * 4

c = C(10)
# 按照 MRO：C -> A -> B -> Base
# value 会被最后设置为 Base 的值
```

## Mixin 模式

```python
class LoggingMixin:
    def log(self, message):
        print(f"[LOG] {message}")

class CachingMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._cache = {}

    def get_cached(self, key):
        return self._cache.get(key)

    def set_cache(self, key, value):
        self._cache[key] = value

class Database(LoggingMixin, CachingMixin):
    def __init__(self, connection_string):
        super().__init__(connection_string)
        self.connection_string = connection_string

    def query(self, sql):
        cached = self.get_cached(sql)
        if cached:
            self.log(f"Cache hit for: {sql}")
            return cached
        self.log(f"Executing: {sql}")
        result = f"Result of {sql}"
        self.set_cache(sql, result)
        return result

db = Database("localhost:5432")
db.query("SELECT * FROM users")
db.query("SELECT * FROM users")  # 第二次从缓存获取
```

## 抽象基类

### abc 模块

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        """计算面积"""
        pass

    @abstractmethod
    def perimeter(self):
        """计算周长"""
        pass

# 不能实例化抽象类
# shape = Shape()  # TypeError

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

rect = Rectangle(5, 10)
rect.area()  # 50
```

### 抽象属性

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @property
    @abstractmethod
    def name(self):
        pass

    @property
    @abstractmethod
    def species(self):
        pass

class Dog(Animal):
    def __init__(self, name):
        self._name = name

    @property
    def name(self):
        return self._name

    @property
    def species(self):
        return "Canis familiaris"

dog = Dog("Buddy")
dog.name     # "Buddy"
dog.species  # "Canis familiaris"
```

## 继承最佳实践

::: tip 继承原则

1. **Liskov 替换原则**：子类应该能够替换父类
2. **组合优于继承**：优先使用组合而非继承
3. **明确继承关系**：只继承有意义的关系（IS-A 关系）
4. **避免深层继承**：继承层次不宜过深
5. **使用 Mixin**：通过 Mixin 添加共享功能

::: warning 常见陷阱

```python
# 陷阱 1：忘记调用 super().__init__()
class Parent:
    def __init__(self, value):
        self.value = value

class Child(Parent):
    def __init__(self, value, extra):
        super().__init__(value)  # 必须调用
        self.extra = extra

# 陷阱 2：多继承的钻石问题
# 使用 super() 和协作多重继承来解决
```
