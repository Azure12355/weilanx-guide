---
title: 反射与动态
icon: ri:magic-line
order: 3
---

# 反射与动态

反射允许程序在运行时检查和修改对象的结构和行为，是动态编程的基础。

## 内省函数

### 检查属性

```python
class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, I'm {self.name}"

person = Person("Alice")

# hasattr: 检查属性是否存在
print(hasattr(person, 'name'))        # True
print(hasattr(person, 'age'))         # False
print(hasattr(person, 'greet'))       # True

# getattr: 获取属性
name = getattr(person, 'name')
print(name)  # Alice

# 带默认值
age = getattr(person, 'age', 25)
print(age)  # 25

# 不带默认值会抛出 AttributeError
# age = getattr(person, 'age')  # AttributeError

# setattr: 设置属性
setattr(person, 'age', 30)
print(person.age)  # 30

# delattr: 删除属性
delattr(person, 'age')
# print(person.age)  # AttributeError
```

### 获取对象信息

```python
class Person:
    """人类"""

    def __init__(self, name):
        self.name = name

    def greet(self):
        pass

person = Person("Alice")

# dir: 获取属性列表
attrs = dir(person)
print(attrs)
# ['__class__', '__delattr__', '__dict__', '__doc__',
#  '__init__', '__module__', 'name', 'greet', ...]

# vars: 获取 __dict__ 内容
print(vars(person))
# {'name': 'Alice'}

# type: 获取类型
print(type(person))  # <class '__main__.Person'>
print(type(person).__name__)  # Person

# id: 获取对象标识
print(id(person))  # 140234567890000

# isinstance: 检查类型
print(isinstance(person, Person))  # True
print(isinstance(person, object))  # True

# issubclass: 检查继承
print(issubclass(Person, object))  # True
```

## 动态属性访问

### 动态获取属性

```python
class Config:
    DEBUG = True
    TESTING = False
    DATABASE_URL = "sqlite:///db"

# 动态访问
attr_name = 'DEBUG'
value = getattr(Config, attr_name)
print(value)  # True

# 批量获取
settings = ['DEBUG', 'TESTING', 'DATABASE_URL']
for setting in settings:
    value = getattr(Config, setting, None)
    print(f"{setting}: {value}")
```

### 动态调用方法

```python
class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

calc = Calculator()

# 动态调用方法
method_name = 'add'
method = getattr(calc, method_name)
result = method(5, 3)
print(result)  # 8

# 处理用户输入
operation = input("操作 (add/subtract/multiply): ")
if hasattr(calc, operation):
    method = getattr(calc, operation)
    print(method(10, 5))
else:
    print("未知操作")
```

### property 动态创建

```python
class Person:
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

# 动态添加属性
def make_full_name_property(cls):
    """创建 full_name 属性"""

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @full_name.setter
    def full_name(self, value):
        parts = value.split()
        self.first_name = parts[0]
        self.last_name = ' '.join(parts[1:])

    setattr(cls, 'full_name', full_name)
    return cls

@make_full_name_property
class Person:
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

person = Person("Alice", "Smith")
print(person.full_name)  # Alice Smith

person.full_name = "Bob Johnson"
print(person.first_name)  # Bob
print(person.last_name)   # Johnson
```

## 动态导入

### importlib 使用

```python
import importlib

# 动态导入模块
module_name = 'math'
math_module = importlib.import_module(module_name)
print(math_module.sqrt(16))  # 4.0

# 动态导入子模块
datetime_module = importlib.import_module('datetime.datetime')
# 等价于 from datetime import datetime
```

### 插件系统

```python
import importlib
import os
from pathlib import Path

class PluginManager:
    """插件管理器"""

    def __init__(self, plugin_dir='plugins'):
        self.plugin_dir = Path(plugin_dir)
        self.plugins = {}

    def load_plugins(self):
        """加载所有插件"""
        for plugin_file in self.plugin_dir.glob('*.py'):
            if plugin_file.stem == '__init__':
                continue

            # 动态导入
            spec = importlib.util.spec_from_file_location(
                plugin_file.stem,
                plugin_file
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            # 注册插件
            if hasattr(module, 'register'):
                module.register(self)

    def register_plugin(self, name, plugin_class):
        """注册插件"""
        self.plugins[name] = plugin_class

# 插件文件: plugins/hello.py
def register(manager):
    manager.register_plugin('hello', HelloPlugin)

class HelloPlugin:
    def run(self):
        print("Hello from plugin!")
```

## 动态类创建

### type 创建类

```python
# 动态创建类
class_name = 'Person'
bases = (object,)
attributes = {
    'species': 'Homo sapiens',
    'greet': lambda self: "Hello!"
}

Person = type(class_name, bases, attributes)

person = Person()
print(person.species)  # Homo sapiens
print(person.greet())   # Hello!
```

### 工厂函数

```python
def create_model_class(table_name, fields):
    """动态创建模型类"""

    class Meta:
        def __new__(mcs, name, bases, namespace):
            namespace['__tablename__'] = table_name
            namespace.update(fields)
            return super().__new__(mcs, name, bases, namespace)

    class ModelBase(metaclass=Meta):
        pass

    return ModelBase

# 创建 User 模型
User = create_model_class('users', {
    'id': int,
    'name': str,
    'email': str
})

user = User()
user.id = 1
user.name = "Alice"
user.email = "alice@example.com"
```

## 代码执行

### exec 和 eval

```python
# eval: 计算表达式
result = eval("2 + 2")
print(result)  # 4

# 使用命名空间
namespace = {'x': 10, 'y': 20}
result = eval("x + y", namespace)
print(result)  # 30

# exec: 执行代码
code = """
def greet(name):
    return f'Hello, {name}!'

message = greet('World')
"""
namespace = {}
exec(code, namespace)
print(namespace['message'])  # Hello, World!

# 危险！不要执行不可信代码
# user_input = "__import__('os').system('rm -rf /')"
# eval(user_input)  # 灾难
```

### 动态函数

```python
def make_function(operation):
    """创建特定操作的函数"""
    if operation == 'add':
        return lambda a, b: a + b
    elif operation == 'multiply':
        return lambda a, b: a * b
    else:
        raise ValueError(f"未知操作: {operation}")

add_func = make_function('add')
print(add_func(5, 3))  # 8
```

## 反射最佳实践

::: tip 反射建议

1. **谨慎使用**：反射代码难理解和维护
2. **提供文档**：动态行为需要详细说明
3. **错误处理**：做好异常处理
4. **安全考虑**：避免执行不可信代码
5. **性能影响**：反射比直接调用慢

::: tip 安全实践

```python
# 白名单验证
ALLOWED_ATTRS = {'name', 'age', 'email'}

def safe_getattr(obj, attr):
    """安全的属性获取"""
    if attr in ALLOWED_ATTRS:
        return getattr(obj, attr, None)
    raise AttributeError(f"禁止访问 {attr}")

# 限制 eval 命名空间
SAFE_BUILTINS = {
    'abs': abs,
    'max': max,
    'min': min,
    'sum': sum
}

def safe_eval(expression):
    """安全的表达式计算"""
    return eval(expression, {'__builtins__': {}}, SAFE_BUILTINS)

result = safe_eval("max([1, 2, 3])")  # 3
# result = safe_eval("__import__('os')")  # NameError
```

::: tip 调试反射

```python
import inspect

def trace_attribute_access(cls):
    """跟踪属性访问"""

    original_getattribute = cls.__getattribute__

    def new_getattribute(self, name):
        print(f"[TRACE] 访问属性: {name}")
        return original_getattribute(self, name)

    cls.__getattribute__ = new_getattribute
    return cls

@trace_attribute_access
class MyClass:
    def __init__(self):
        self.value = 42

obj = MyClass()
value = obj.value  # [TRACE] 访问属性: value
```

::: tip 性能优化

```python
# 缓存反射结果
class CachedAccess:
    def __init__(self):
        self._method_cache = {}

    def call_method(self, method_name, *args):
        # 检查缓存
        if method_name not in self._method_cache:
            self._method_cache[method_name] = getattr(self, method_name)

        # 使用缓存的方法
        method = self._method_cache[method_name]
        return method(*args)

# 使用 __slots__ 减少属性查找开销
class OptimizedClass:
    __slots__ = ['x', 'y']

    def __init__(self, x, y):
        self.x = x
        self.y = y
```
