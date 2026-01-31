---
title: 元类编程
icon: ri:code-box-line
order: 2
---

# 元类编程

元类是创建类的类，提供了在类创建时修改和扩展类行为的能力。

## type 函数

### 动态创建类

```python
# 使用 type 创建类
MyClass = type('MyClass', (object,), {
    'attr': 100,
    'method': lambda self: print("Hello")
})

# 等价于
class MyClass:
    attr = 100
    def method(self):
        print("Hello")

# type 签名
# type(name, bases, dict)
# name: 类名
# bases: 基类元组
# dict: 类属性字典
```

### type 的三个参数

```python
def show_class(cls):
    print(f"类名: {cls.__name__}")
    print(f"基类: {cls.__bases__}")
    print(f"字典: {cls.__dict__}")

# 使用 type 创建
Person = type(
    'Person',                          # name
    (object,),                         # bases
    {                                  # dict
        'species': 'Homo sapiens',
        'speak': lambda self: print(f"{self.name} 在说话")
    }
)

# 创建实例
person = Person()
person.name = "Alice"
person.speak()  # Alice 在说话
```

## 自定义元类

### 基础元类

```python
class Meta(type):
    """自定义元类"""

    def __new__(mcs, name, bases, namespace):
        # mcs: 元类本身
        # name: 要创建的类名
        # bases: 基类元组
        # namespace: 类属性字典

        print(f"创建类: {name}")
        print(f"基类: {bases}")
        print(f"属性: {list(namespace.keys())}")

        # 修改类属性
        namespace['created_by'] = 'Meta'

        # 调用 type.__new__ 创建类
        return super().__new__(mcs, name, bases, namespace)

class MyClass(metaclass=Meta):
    pass

# 输出: 创建类: MyClass
```

### 添加方法

```python
def string_representation(self):
    """添加字符串表示方法"""
    return f"<{self.__class__.__name__}>"

class AddReprMeta(type):
    """自动添加 __repr__ 的元类"""

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)

        # 如果没有定义 __repr__，添加默认实现
        if '__repr__' not in namespace:
            cls.__repr__ = string_representation

        return cls

class Person(metaclass=AddReprMeta):
    def __init__(self, name):
        self.name = name

person = Person("Alice")
print(person)  # <Person>
```

### 验证类定义

```python
class ValidateMeta(type):
    """验证类定义的元类"""

    def __new__(mcs, name, bases, namespace):
        # 确保有特定方法
        required_methods = ['get', 'post', 'put', 'delete']

        for method in required_methods:
            if method not in namespace:
                raise TypeError(
                    f"{name} 必须实现 {method} 方法"
                )

        return super().__new__(mcs, name, bases, namespace)

class APIView(metaclass=ValidateMeta):
    def get(self):
        pass

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

# 缺少方法会抛出 TypeError
# class InvalidAPI(metaclass=ValidateMeta):
#     pass  # TypeError
```

## 元类应用

### 单例模式

```python
class SingletonMeta(type):
    """单例元类"""

    _instances = {}

    def __call__(cls, *args, **kwargs):
        # 如果类没有实例，创建并缓存
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        # 返回缓存的实例
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        print("初始化数据库连接")

db1 = Database()  # 初始化数据库连接
db2 = Database()  # 不再初始化
print(db1 is db2)  # True
```

### 注册模式

```python
class PluginMeta(type):
    """插件注册元类"""

    def __init__(cls, name, bases, namespace):
        super().__init__(name, bases, namespace)

        # 注册插件
        if not hasattr(cls, '_registry'):
            cls._registry = {}

        cls._registry[name] = cls

class Plugin(metaclass=PluginMeta):
    """插件基类"""

    @classmethod
    def get_plugin(cls, name):
        return cls._registry.get(name)

    @classmethod
    def all_plugins(cls):
        return cls._registry.copy()

class AudioPlugin(Plugin):
    """音频插件"""

class VideoPlugin(Plugin):
    """视频插件"""

print(Plugin.all_plugins())
# {'Plugin': <class '__main__.Plugin'>,
#  'AudioPlugin': <class '__main__.AudioPlugin'>,
#  'VideoPlugin': <class '__main__.VideoPlugin'>}
```

### 抽象基类

```python
from abc import ABC, ABCMeta, abstractmethod

class Shape(ABC, metaclass=ABCMeta):
    """抽象形状类"""

    @abstractmethod
    def area(self):
        """计算面积"""
        pass

    @abstractmethod
    def perimeter(self):
        """计算周长"""
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        import math
        return math.pi * self.radius ** 2

    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

# 无法实例化抽象类
# shape = Shape()  # TypeError

circle = Circle(5)
print(circle.area())  # 78.54
```

### ORM 风格

```python
class ModelMeta(type):
    """ORM 风格的元类"""

    def __new__(mcs, name, bases, namespace):
        # 收集字段定义
        fields = {}
        for key, value in list(namespace.items()):
            if isinstance(value, Field):
                fields[key] = value
                del namespace[key]

        namespace['_fields'] = fields
        return super().__new__(mcs, name, bases, namespace)

class Field:
    """字段定义"""

    def __init__(self, field_type, primary_key=False):
        self.field_type = field_type
        self.primary_key = primary_key

class Model(metaclass=ModelMeta):
    """模型基类"""

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key in self._fields:
                setattr(self, key, value)

    def __repr__(self):
        fields = ', '.join(
            f"{k}={getattr(self, k, None)}"
            for k in self._fields.keys()
        )
        return f"<{self.__class__.__name__}({fields})>"

class User(Model):
    id = Field(int, primary_key=True)
    name = Field(str)
    email = Field(str)

user = User(id=1, name="Alice", email="alice@example.com")
print(user)  # <User(id=1, name=Alice, email=alice@example.com)>
```

## 类装饰器

### 装饰器作为元类替代

```python
def add_repr(cls):
    """添加 __repr__ 的类装饰器"""

    original_repr = cls.__repr__

    def new_repr(self):
        try:
            return original_repr(self)
        except NotImplementedError:
            return f"<{self.__class__.__name__} object>"

    cls.__repr__ = new_repr
    return cls

@add_repr
class Person:
    def __init__(self, name):
        self.name = name

person = Person("Alice")
print(person)  # <Person object>
```

### 可接受参数的装饰器

```python
def register_class(cls=None, *, active=True):
    """类注册装饰器"""

    def decorator(cls):
        cls._registered = active
        return cls

    if cls is None:
        # 带参数使用 @register_class(active=False)
        return decorator
    else:
        # 不带参数使用 @register_class
        return decorator(cls)

@register_class
class Service1:
    pass

@register_class(active=False)
class Service2:
    pass

print(Service1._registered)  # True
print(Service2._registered)  # False
```

## 元类最佳实践

::: tip 元类建议

1. **避免过度使用**：99% 的情况不需要元类
2. **优先类装饰器**：更简单易懂
3. **文档完善**：元类逻辑复杂
4. **考虑 ABC**：抽象基类替代
5. **调试友好**：添加调试信息

::: tip 选择指南

```python
# 简单验证 → 类装饰器
def validate(cls):
    for method in ['get', 'post']:
        if not hasattr(cls, method):
            raise TypeError(f"缺少 {method} 方法")
    return cls

@validate
class APIView:
    def get(self): pass
    def post(self): pass

# 复杂逻辑 → 元类
class SingletonMeta(type):
    # ... 单例实现

class Database(metaclass=SingletonMeta):
    pass
```

::: tip 常见错误

```python
# 错误 1: 忘记返回类
class BadMeta(type):
    def __new__(mcs, name, bases, namespace):
        super().__new__(mcs, name, bases, namespace)
        # ❌ 忘记返回

# 正确做法
class GoodMeta(type):
    def __new__(mcs, name, bases, namespace):
        return super().__new__(mcs, name, bases, namespace)
        # ✅ 返回创建的类

# 错误 2: 修改元组
class BadMeta(type):
    def __new__(mcs, name, bases, namespace):
        bases += (ExtraBase,)  # ❌ 元组不可变

# 正确做法
class GoodMeta(type):
    def __new__(mcs, name, bases, namespace):
        bases = bases + (ExtraBase,)  # ✅ 创建新元组
        return super().__new__(mcs, name, bases, namespace)
```

::: tip MRO 顺序

```python
class A:
    pass

class B(A):
    pass

class C(A):
    pass

class D(B, C, metaclass=type):
    pass

print(D.__mro__)
# (<class '__main__.D'>,
#  <class '__main__.B'>,
#  <class '__main__.C'>,
#  <class '__main__.A'>,
#  <class 'object'>)

# 元类影响 MRO
class MetaA(type):
    pass

class MetaB(type):
    pass

class A(metaclass=MetaA):
    pass

class B(metaclass=MetaB):
    pass

# 会报错，元类冲突
# class C(A, B):
#     pass
```
