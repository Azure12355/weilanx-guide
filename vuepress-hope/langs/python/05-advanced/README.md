---
title: 进阶特性
icon: ri:lightbulb-flash-line
order: 6
---

# 进阶特性

掌握 Python 进阶特性：异常处理、文件操作、上下文管理器、模块与包。

## 学习内容

<VPCard
  title="异常处理"
  desc="try-except、自定义异常、异常上下文"
  logo="https://api.iconify.design/ri/alert-line.svg"
  link="/langs/python/05-advanced/exceptions.md"
/>

<VPCard
  title="文件与 IO"
  desc="文件读写、路径操作、序列化"
  logo="https://api.iconify.design/ri/file-text-line.svg"
  link="/langs/python/05-advanced/files.md"
/>

<VPCard
  title="上下文管理器"
  desc="with 语句、contextlib、自定义上下文"
  logo="https://api.iconify.design/ri/brackets-line.svg"
  link="/langs/python/05-advanced/context-managers.md"
/>

<VPCard
  title="模块与包"
  desc="模块导入、包结构、__init__.py"
  logo="https://api.iconify.design/ri/package-line.svg"
  link="/langs/python/05-advanced/modules.md"
/>

## 异常层次结构

```
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── StopIteration
    ├── ArithmeticError
    │   ├── FloatingPointError
    │   ├── OverflowError
    │   └── ZeroDivisionError
    ├── AssertionError
    ├── AttributeError
    ├── BufferError
    ├── EOFError
    ├── ImportError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── MemoryError
    ├── NameError
    │   └── UnboundLocalError
    ├── OSError
    │   ├── FileNotFoundError
    │   ├── PermissionError
    │   └── TimeoutError
    ├── TypeError
    └── ValueError
```

## 资源管理模式

::: tabs

@tab 传统方式

```python
f = open("file.txt", "r")
try:
    content = f.read()
finally:
    f.close()
```

@tab 上下文管理器

```python
with open("file.txt", "r") as f:
    content = f.read()
# 自动关闭文件
```

:::
