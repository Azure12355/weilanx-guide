---
title: 元类
icon: ri:code-box-line
order: 5
---

# 元类

元类（Metaclass）是创建类的"类"，是 Python 中最强大的高级特性之一。理解元类意味着理解 Python 的对象模型。

## 类也是对象

```python
# 在 Python 中，一切皆对象
class MyClass:
    pass

# 类本身也是对象
obj = MyClass
print(type(obj))        # <class 'type'>
print(id(obj))          # 类对象的内存地址
print(obj.__name__)     # 'MyClass'

# 可以在运行时创建类
def init_method(self, value):
    self.value = value

def get_value(self):
    return self.value

# 动态创建类
DynamicClass = type('DynamicClass', (), {
    '__init__': init_method,
    'get_value': get_value
})

instance = DynamicClass(42)
print(instance.get_value())  # 42
```

## type 函数

### type 作为类工厂

```python
# type(name, bases, dict)
# name: 类名
# bases: 基类元组
# dict: 类属性字典

# 传统方式
class Person:
    species = "Homo sapiens"

    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, I'm {self.name}"

# 使用 type 创建
Person2 = type(
    'Person2',
    (),
    {
        'species': 'Homo sapiens',
        '__init__': lambda self, name: setattr(self, 'name', name),
        'greet': lambda self: f"Hello, I'm {self.name}"
    }
)
```

### type 检查类型

```python
# type() 用于检查类型
class Animal:
    pass

class Dog(Animal):
    pass

dog = Dog()

type(dog)        # <class '__main__.Dog'>
type(dog) is Dog  # True
type(dog) is Animal  # False

# 使用 isinstance() 更推荐
isinstance(dog, Dog)     # True
isinstance(dog, Animal)  # True
```

## 自定义元类

### 基本元类

```python
# 元类需要继承 type
class MyMeta(type):
    def __new__(cls, name, bases, namespace):
        # 在类创建之前调用
        print(f"Creating class: {name}")
        print(f"Bases: {bases}")
        print(f"Namespace keys: {list(namespace.keys())}")

        # 修改类属性
        if 'greeting' not in namespace:
            namespace['greeting'] = 'Hello'

        # 创建类
        return super().__new__(cls, name, bases, namespace)

class MyClass(metaclass=MyMeta):
    value = 42

    def method(self):
        pass

# Creating class: MyClass
# Bases: ()
# Namespace keys: ['__module__', '__qualname__', 'value', 'method']

print(MyClass.greeting)  # 'Hello'（元类添加的）
```

### 元类修改类行为

```python
class SingletonMeta(type):
    """单例模式元类"""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        # 当创建实例时调用
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Singleton(metaclass=SingletonMeta):
    def __init__(self, value):
        self.value = value

s1 = Singleton(1)
s2 = Singleton(2)

print(s1 is s2)    # True（同一个实例）
print(s1.value)    # 1（首次创建的值）
print(s2.value)    # 1
```

### 元类验证类定义

```python
class ValidateMeta(type):
    """验证类属性的元类"""

    def __new__(cls, name, bases, namespace):
        # 确保所有方法名小写
        for key, value in namespace.items():
            if callable(value) and key != key.lower():
                raise TypeError(f"Method '{key}' should be lowercase")

        # 确保有特定方法
        if name != "Base":
            required_methods = ['get', 'set']
            for method in required_methods:
                if method not in namespace:
                    raise TypeError(f"Class must implement '{method}' method")

        return super().__new__(cls, name, bases, namespace)

class Base(metaclass=ValidateMeta):
    pass

class Data(Base):
    def get(self):
        return "value"

    def set(self, value):
        pass

# 以下会报错
# class InvalidData(Base):
#     def GetData(self):  # 方法名不是小写
#         pass
# TypeError: Method 'GetData' should be lowercase
```

## 元类应用场景

### 1. 注册模式

```python
class PluginRegistry(type):
    """插件注册元类"""
    _registry = {}

    def __new__(cls, name, bases, namespace):
        # 创建类
        new_class = super().__new__(cls, name, bases, namespace)

        # 注册插件
        if name != 'BasePlugin':
            plugin_name = namespace.get('plugin_name', name.lower())
            cls._registry[plugin_name] = new_class

        return new_class

    @classmethod
    def get_plugin(cls, name):
        return cls._registry.get(name)

    @classmethod
    def list_plugins(cls):
        return list(cls._registry.keys())

class BasePlugin(metaclass=PluginRegistry):
    """所有插件的基类"""
    plugin_name = None

class EmailPlugin(BasePlugin):
    plugin_name = "email"

    def send(self, message):
        return f"Sending email: {message}"

class SMSPlugin(BasePlugin):
    plugin_name = "sms"

    def send(self, message):
        return f"Sending SMS: {message}"

# 使用插件
email_plugin = PluginRegistry.get_plugin("email")
email_instance = email_plugin()
print(email_instance.send("Hello"))  # Sending email: Hello

print(PluginRegistry.list_plugins())  # ['email', 'sms']
```

### 2. 自动属性

```python
class AutoPropertyMeta(type):
    """自动创建属性的元类"""

    def __new__(cls, name, bases, namespace):
        # 查找带类型注解的属性
        annotations = namespace.get('__annotations__', {})

        for attr_name, attr_type in annotations.items():
            if attr_name.startswith('_'):
                # 私有属性，跳过
                continue

            # 创建 getter
            def make_getter(name):
                def getter(self):
                    return getattr(self, f'_{name}')
                return getter

            # 创建 setter
            def make_setter(name, type_):
                def setter(self, value):
                    if not isinstance(value, type_):
                        raise TypeError(f"{name} must be {type_}")
                    setattr(self, f'_{name}', value)
                return setter

            # 创建 property
            getter = make_getter(attr_name)
            setter = make_setter(attr_name, attr_type)
            namespace[attr_name] = property(getter, setter)

        return super().__new__(cls, name, bases, namespace)

class Person(metaclass=AutoPropertyMeta):
    name: str
    age: int
    _internal: str = "private"

p = Person()
p.name = "Alice"      # 正常
p.age = 25           # 正常
# p.age = "twenty"   # TypeError: age must be <class 'int'>
```

### 3. 接口检查

```python
class InterfaceMeta(type):
    """检查类是否实现接口的元类"""

    def __new__(cls, name, bases, namespace):
        # 获取接口要求
        interface = namespace.get('__interface__', [])

        # 检查是否实现所有接口方法
        missing = []
        for method in interface:
            if method not in namespace:
                missing.append(method)

        if missing:
            raise TypeError(
                f"Class '{name}' must implement: {', '.join(missing)}"
            )

        return super().__new__(cls, name, bases, namespace)

class Drawable(metaclass=InterfaceMeta):
    __interface__ = ['draw', 'erase']

    def draw(self):
        pass

    def erase(self):
        pass

# 缺少方法会报错
# class IncompleteDrawable(metaclass=InterfaceMeta):
#     __interface__ = ['draw', 'erase']
#
#     def draw(self):
#         pass
# TypeError: Class 'IncompleteDrawable' must implement: erase
```

### 4. 日志装饰

```python
class LoggedMeta(type):
    """为所有方法添加日志的元类"""

    def __new__(cls, name, bases, namespace):
        # 为每个方法添加日志
        for key, value in list(namespace.items()):
            if callable(value) and not key.startswith('_'):
                # 创建包装函数
                def make_wrapper(func):
                    def wrapper(*args, **kwargs):
                        print(f"Calling {func.__name__}")
                        result = func(*args, **kwargs)
                        print(f"{func.__name__} returned {result}")
                        return result
                    return wrapper

                namespace[key] = make_wrapper(value)

        return super().__new__(cls, name, bases, namespace)

class Service(metaclass=LoggedMeta):
    def process_data(self, data):
        return data.upper()

service = Service()
service.process_data("hello")
# Calling process_data
# process_data returned HELLO
```

## __prepare__ 方法

```python
class OrderedMeta(type):
    """保持类属性定义顺序的元类"""

    @classmethod
    def __prepare__(cls, name, bases):
        # 返回一个有序字典
        from collections import OrderedDict
        return OrderedDict()

    def __new__(cls, name, bases, namespace):
        # namespace 是 OrderedDict
        print(f"Attribute order: {list(namespace.keys())}")
        return super().__new__(cls, name, bases, namespace)

class MyClass(metaclass=OrderedMeta):
    first = 1
    second = 2
    third = 3
    first_again = 1

# Attribute order: ['__module__', '__qualname__', 'first', 'second', 'third', 'first_again']
```

## 元类继承

```python
class MetaA(type):
    def __new__(cls, name, bases, namespace):
        print(f"MetaA creating {name}")
        return super().__new__(cls, name, bases, namespace)

class MetaB(type):
    def __new__(cls, name, bases, namespace):
        print(f"MetaB creating {name}")
        return super().__new__(cls, name, bases, namespace)

class MetaC(MetaA, MetaB):
    def __new__(cls, name, bases, namespace):
        print(f"MetaC creating {name}")
        return super().__new__(cls, name, bases, namespace)

# MRO 决定元类调用顺序
class MyClass(metaclass=MetaC):
    pass

# MetaC creating MyClass
# MetaA creating MyClass
# MetaB creating MyClass
```

## 抽象基类

```python
from abc import ABC, abstractmethod

class AbstractClass(ABC):
    """抽象基类"""

    @abstractmethod
    def abstract_method(self):
        """子类必须实现此方法"""
        pass

    @abstractmethod
    def another_abstract(self):
        pass

    def concrete_method(self):
        """具体方法，子类可直接使用"""
        return "This is a concrete method"

class ConcreteClass(AbstractClass):
    def abstract_method(self):
        return "Implemented abstract method"

    def another_abstract(self):
        return "Implemented another abstract method"

# 不能实例化抽象类
# abstract = AbstractClass()  # TypeError

concrete = ConcreteClass()
concrete.abstract_method()   # "Implemented abstract method"
concrete.concrete_method()   # "This is a concrete method"
```

## 抽象属性

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @property
    @abstractmethod
    def area(self):
        """子类必须实现此属性"""
        pass

    @property
    @abstractmethod
    def perimeter(self):
        """子类必须实现此属性"""
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self._width = width
        self._height = height

    @property
    def area(self):
        return self._width * self._height

    @property
    def perimeter(self):
        return 2 * (self._width + self._height)

rect = Rectangle(5, 10)
print(rect.area)      # 50
print(rect.perimeter) # 30
```

## 元类 vs 类装饰器

### 类装饰器实现单例

```python
def singleton(cls):
    """单例类装饰器"""
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance

@singleton
class Database:
    def __init__(self):
        print("Initializing database")

db1 = Database()  # Initializing database
db2 = Database()  # 不会再次初始化
print(db1 is db2)  # True
```

### 元类 vs 装饰器选择

```python
# 元类：影响类创建
class Meta(type):
    def __new__(cls, name, bases, namespace):
        # 修改类定义
        namespace['modified'] = True
        return super().__new__(cls, name, bases, namespace)

# 类装饰器：装饰类对象
def decorator(cls):
    # 修改类对象
    cls.modified = True
    return cls

# 大多数情况下，类装饰器更简单
# 元类用于需要控制类创建过程的情况
```

## 元类最佳实践

::: tip 何时使用元类

1. **框架开发**：Django ORM、Form 等
2. **API 验证**：确保类符合特定接口
3. **注册模式**：自动注册插件
4. **单例模式**：确保只有一个实例
5. **日志/调试**：自动装饰方法

::: warning 何时避免使用元类

1. **简单需求**：使用类装饰器
2. **代码可读性**：元类使代码难以理解
3. **性能要求**：元类有轻微性能开销
4. **团队协作**：元类增加学习曲线

::: tip 元类设计原则

1. **最小化影响**：只修改必要的内容
2. **清晰文档**：详细说明元类的作用
3. **向后兼容**：不破坏现有代码
4. **考虑替代方案**：装饰器可能更简单

:::

## 元类陷阱

```python
# 陷阱 1：忘记返回类
class BadMeta(type):
    def __new__(cls, name, bases, namespace):
        # 忘记返回！
        pass

# TypeError: __new__ must return a type

# 陷阱 2：无限递归
class RecursiveMeta(type):
    def __new__(cls, name, bases, namespace):
        return RecursiveMeta(name, bases, namespace)
    # 无限递归，栈溢出

# 正确做法
class CorrectMeta(type):
    def __new__(cls, name, bases, namespace):
        return super().__new__(cls, name, bases, namespace)

# 陷阱 3：修改同一个元类
class Meta(type):
    pass

Meta2 = Meta  # 引用同一个元类

class A(metaclass=Meta):
    pass

# B 也会受到 Meta 的影响（因为共享）
```

## 实战案例

### ORM 实现

```python
class Field:
    def __init__(self, field_type, primary_key=False):
        self.field_type = field_type
        self.primary_key = primary_key

class ORMMeta(type):
    def __new__(cls, name, bases, namespace):
        if name == 'Model':
            return super().__new__(cls, name, bases, namespace)

        # 收集字段
        fields = {}
        for key, value in list(namespace.items()):
            if isinstance(value, Field):
                fields[key] = value

        namespace['_fields'] = fields
        namespace['_table'] = name.lower()

        return super().__new__(cls, name, bases, namespace)

class Model(metaclass=ORMMeta):
    pass

class User(Model):
    id = Field(int, primary_key=True)
    name = Field(str)
    email = Field(str)

print(User._fields)
# {'id': Field(...), 'name': Field(...), 'email': Field(...)}
print(User._table)  # 'user'
```

### 自动 API

```python
class APIMeta(type):
    def __new__(cls, name, bases, namespace):
        if name == 'BaseAPI':
            return super().__new__(cls, name, bases, namespace)

        # 为每个方法创建路由
        routes = {}
        for key, value in namespace.items():
            if callable(value) and not key.startswith('_'):
                routes[f'/{name.lower()}/{key}'] = value

        namespace['_routes'] = routes
        namespace['get_routes'] = lambda self: self._routes

        return super().__new__(cls, name, bases, namespace)

class BaseAPI(metaclass=APIMeta):
    pass

class UserAPI(BaseAPI):
    def list(self):
        return "List all users"

    def create(self):
        return "Create a user"

    def update(self):
        return "Update a user"

api = UserAPI()
print(api.get_routes())
# {'/userapi/list': <method>, '/userapi/create': <method>, '/userapi/update': <method>}
```

::: tip 元类学习路径

1. **理解 type**：type 是所有类的元类
2. **继承 type**：创建自己的元类
3. **__new__ 方法**：控制类创建
4. **__prepare__ 方法**：控制命名空间
5. **实际应用**：框架、ORM、API
:::
