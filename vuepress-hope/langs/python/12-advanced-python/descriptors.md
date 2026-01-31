---
title: 描述器协议
icon: ri:stack-line
order: 1
---

# 描述器协议

描述器是 Python 中实现托管属性的强大机制，是 property、classmethod 等装饰器的底层实现。

## 描述器基础

### 什么是描述器

```python
# 描述器协议
class Descriptor:
    def __get__(self, obj, objtype=None):
        """获取属性"""
        pass

    def __set__(self, obj, value):
        """设置属性"""
        pass

    def __delete__(self, obj):
        """删除属性"""
        pass

# 数据描述器：定义了 __set__ 或 __delete__
# 非数据描述器：只定义了 __get__
```

### 基础示例

```python
class LoggingDescriptor:
    """带日志的描述器"""

    def __set_name__(self, owner, name):
        self.name = name
        self.private_name = '_' + name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        value = getattr(obj, self.private_name, None)
        print(f"Getting {self.name}: {value}")
        return value

    def __set__(self, obj, value):
        print(f"Setting {self.name} to {value}")
        setattr(obj, self.private_name, value)

    def __delete__(self, obj):
        print(f"Deleting {self.name}")
        delattr(obj, self.private_name)

class Person:
    name = LoggingDescriptor()
    age = LoggingDescriptor()

person = Person()
person.name = "Alice"  # Setting name to Alice
value = person.name    # Getting name: Alice
del person.name        # Deleting name
```

## 描述器类型

### 数据描述器

```python
class ValidatedAttribute:
    """验证属性值的数据描述器"""

    def __init__(self, type_hint, min_value=None, max_value=None):
        self.type_hint = type_hint
        self.min_value = min_value
        self.max_value = max_value

    def __set_name__(self, owner, name):
        self.name = name
        self.private_name = '_' + name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name)

    def __set__(self, obj, value):
        # 类型验证
        if not isinstance(value, self.type_hint):
            raise TypeError(
                f"{self.name} must be {self.type_hint.__name__}"
            )

        # 范围验证
        if self.min_value is not None and value < self.min_value:
            raise ValueError(
                f"{self.name} must be >= {self.min_value}"
            )

        if self.max_value is not None and value > self.max_value:
            raise ValueError(
                f"{self.name} must be <= {self.max_value}"
            )

        setattr(obj, self.private_name, value)

class Person:
    age = ValidatedAttribute(int, min_value=0, max_value=150)
    name = ValidatedAttribute(str)

person = Person()
person.age = 25
person.name = "Alice"

# person.age = -1  # ValueError
# person.name = 123  # TypeError
```

### 非数据描述器

```python
class CachedAttribute:
    """缓存属性的非数据描述器"""

    def __init__(self, method):
        self.method = method
        self.cache_name = '_' + method.__name__ + '_cache'

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self

        # 检查缓存
        cache = getattr(obj, self.cache_name, None)
        if cache is not None:
            return cache

        # 计算并缓存
        value = self.method(obj)
        setattr(obj, self.cache_name, value)
        return value

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @CachedAttribute
    def area(self):
        print("计算面积...")
        import math
        return math.pi * self.radius ** 2

circle = Circle(5)
print(circle.area)  # 计算面积... → 78.54
print(circle.area)  # 78.54 (使用缓存)
```

## 描述器应用

### 类型验证

```python
class Typed:
    """类型验证描述器"""

    def __init__(self, expected_type):
        self.expected_type = expected_type

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(
                f"{self.name} 期望 {self.expected_type.__name__}, "
                f"得到 {type(value).__name__}"
            )
        obj.__dict__[self.name] = value

class Person:
    name = Typed(str)
    age = Typed(int)
    salary = Typed(float)
```

### 值范围验证

```python
class Bounded:
    """范围验证描述器"""

    def __init__(self, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if self.min_value is not None and value < self.min_value:
            raise ValueError(
                f"{self.name} 必须 >= {self.min_value}"
            )
        if self.max_value is not None and value > self.max_value:
            raise ValueError(
                f"{self.name} 必须 <= {self.max_value}"
            )
        obj.__dict__[self.name] = value

class Product:
    price = Bounded(min_value=0)
    quantity = Bounded(min_value=0, max_value=1000)
```

### 延迟计算

```python
class LazyProperty:
    """延迟计算属性"""

    def __init__(self, func):
        self.func = func
        self.attr_name = '_' + func.__name__

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self

        # 已计算则返回缓存
        if hasattr(obj, self.attr_name):
            return getattr(obj, self.attr_name)

        # 首次计算
        value = self.func(obj)
        setattr(obj, self.attr_name, value)
        return value

class Database:
    def __init__(self, connection_string):
        self.connection_string = connection_string

    @LazyProperty
    def connection(self):
        print("建立数据库连接...")
        # 模拟建立连接
        import time
        time.sleep(1)
        return f"Connection to {self.connection_string}"

db = Database('localhost:5432')
print("数据库对象创建")
print(db.connection)  # 建立数据库连接...
print(db.connection)  # 使用缓存
```

### 观察者模式

```python
class ObservedAttribute:
    """可观察的属性描述器"""

    def __init__(self, default=None):
        self.default = default

    def __set_name__(self, owner, name):
        self.name = name
        self.private_name = '_' + name
        self.callbacks = []

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name, self.default)

    def __set__(self, obj, value):
        old_value = self.__get__(obj)
        setattr(obj, self.private_name, value)

        # 触发回调
        for callback in self.callbacks:
            callback(obj, self.name, old_value, value)

    def add_callback(self, callback):
        self.callbacks.append(callback)

class Person:
    age = ObservedAttribute(default=0)

    @classmethod
    def on_age_change(cls, callback):
        cls.age.add_callback(callback)

# 添加观察者
def log_age_change(obj, name, old_value, new_value):
    print(f"{obj.__class__.__name__}.{name}: {old_value} → {new_value}")

Person.on_age_change(log_age_change)

person = Person()
person.age = 18  # Person.age: 0 → 18
person.age = 19  # Person.age: 18 → 19
```

## 描述器 vs Property

### 实现对比

```python
# 使用 property
class Circle1:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("半径必须为正数")
        self._radius = value

# 使用描述器
class PositiveNumber:
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError("必须为正数")
        obj.__dict__[self.name] = value

class Circle2:
    radius = PositiveNumber()

    def __init__(self, radius):
        self.radius = radius  # 使用描述器
```

### 描述器优势

```python
# 描述器可复用
class ValidatedString:
    def __init__(self, min_length=0, max_length=100):
        self.min_length = min_length
        self.max_length = max_length

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name, "")

    def __set__(self, obj, value):
        if not isinstance(value, str):
            raise TypeError("必须是字符串")

        if len(value) < self.min_length:
            raise ValueError(f"长度至少 {self.min_length}")

        if len(value) > self.max_length:
            raise ValueError(f"长度最多 {self.max_length}")

        obj.__dict__[self.name] = value

class User:
    username = ValidatedString(min_length=3, max_length=20)
    email = ValidatedString(min_length=5, max_length=100)
    bio = ValidatedString(min_length=0, max_length=500)
```

## 描述器最佳实践

::: tip 描述器建议

1. **使用 __set_name__**：自动获取属性名称
2. **避免递归**：使用私有名称存储
3. **考虑缓存**：非数据描述器适合缓存
4. **文档完善**：描述器逻辑较复杂
5. **优先 property**：简单情况用 property

::: tip 命名约定

```python
class GoodDescriptor:
    def __set_name__(self, owner, name):
        self.public_name = name       # name
        self.private_name = '_' + name  # _name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        # 从实例字典读取，避免递归
        return obj.__dict__.get(self.private_name)

    def __set__(self, obj, value):
        # 写入实例字典
        obj.__dict__[self.private_name] = value
```

::: tip 描述器选择

```python
# 简单 getter/setter → @property
@property
def value(self):
    return self._value

@value.setter
def value(self, val):
    self._value = val

# 需要复用 → 描述器
class Positive:
    # ... 描述器实现

class Product:
    price = Positive()
    quantity = Positive()

# 需要缓存 → 非数据描述器
@cached_property
def expensive_computation(self):
    # ...
```

::: tip 调试技巧

```python
class DebugDescriptor:
    """带调试信息的描述器"""

    def __init__(self, default=None):
        self.default = default

    def __set_name__(self, owner, name):
        self.name = name
        print(f"[DEBUG] 描述器 {self.name} 绑定到 {owner.__name__}")

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        value = obj.__dict__.get(self.name, self.default)
        print(f"[DEBUG] 获取 {obj.__class__.__name__}.{self.name} = {value}")
        return value

    def __set__(self, obj, value):
        print(f"[DEBUG] 设置 {obj.__class__.__name__}.{self.name} = {value}")
        obj.__dict__[self.name] = value
```
