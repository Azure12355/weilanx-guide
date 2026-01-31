---
title: Hello World
icon: ri:hand-coin-line.svg
order: 3
---

# Hello World

## 第一个 Python 程序

创建 `hello.py` 文件：

```python
# hello.py

# 这是一行注释
print("Hello, World!")
```

运行程序：

```bash
python hello.py
# 输出：Hello, World!
```

## 交互式模式

### Python REPL

```bash
$ python3
Python 3.12.0 (main, Oct  2 2023, 00:00:00)
[GCC 12.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> print("Hello, World!")
Hello, World!
>>> 2 + 2
4
>>> exit()
```

### IPython

```bash
# 安装
pip install ipython

# 启动
ipython

In [1]: print("Hello, World!")
Hello, World!

In [2]: 2 + 2
Out[2]: 4
```

## 带类型的 Hello World

```python
# hello_typed.py

def greet(name: str) -> str:
    """返回问候语

    Args:
        name: 名称

    Returns:
        问候语字符串
    """
    return f"Hello, {name}!"

if __name__ == "__main__":
    message = greet("Python")
    print(message)
```

## 命令行参数

```python
# hello_arg.py
import sys

def main():
    if len(sys.argv) > 1:
        name = sys.argv[1]
    else:
        name = "World"

    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
```

运行：

```bash
python hello_arg.py Alice
# 输出：Hello, Alice!

python hello_arg.py
# 输出：Hello, World!
```

## 使用 argparse

```python
# hello_argparse.py
import argparse

def main():
    parser = argparse.ArgumentParser(description="问候程序")
    parser.add_argument(
        "name",
        nargs="?",
        default="World",
        help="要问候的名字"
    )
    parser.add_argument(
        "-c", "--count",
        type=int,
        default=1,
        help="重复次数"
    )
    parser.add_argument(
        "-u", "--uppercase",
        action="store_true",
        help="使用大写"
    )

    args = parser.parse_args()

    message = f"Hello, {args.name}!"
    if args.uppercase:
        message = message.upper()

    for _ in range(args.count):
        print(message)

if __name__ == "__main__":
    main()
```

运行：

```bash
# 基本用法
python hello_argparse.py Alice
# 输出：Hello, Alice!

# 重复 3 次
python hello_argparse.py Alice -c 3
# 输出：
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!

# 大写
python hello_argparse.py Alice -u
# 输出：HELLO, ALICE!

# 查看帮助
python hello_argparse.py -h
```

## 文件输入

```python
# hello_file.py
import sys

def main():
    # 从文件读取
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r") as f:
            name = f.read().strip()
    else:
        name = "World"

    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
```

## 使用函数和类

```python
# hello_oop.py
from typing import List

class Greeter:
    """问候者类"""

    def __init__(self, greeting: str = "Hello"):
        self.greeting = greeting

    def greet(self, name: str) -> str:
        """生成问候语"""
        return f"{self.greeting}, {name}!"

    def greet_all(self, names: List[str]) -> None:
        """问候多个人"""
        for name in names:
            print(self.greet(name))

def main():
    # 使用类
    greeter = Greeter("Hello")
    greeter.greet_all(["Alice", "Bob", "Charlie"])

    # 自定义问候语
    friendly_greeter = Greeter("Hi there")
    print(friendly_greeter.greet("Python"))

if __name__ == "__main__":
    main()
```

## 异常处理

```python
# hello_exception.py
import sys

def get_name_input() -> str:
    """获取用户输入"""
    try:
        name = input("请输入你的名字: ")
        if not name.strip():
            raise ValueError("名字不能为空")
        return name
    except (EOFError, KeyboardInterrupt):
        print("\n用户中断")
        sys.exit(0)
    except ValueError as e:
        print(f"错误: {e}")
        return "World"

def main():
    name = get_name_input()
    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
```

## 单元测试

```python
# hello_test.py
import unittest

def greet(name: str) -> str:
    return f"Hello, {name}!"

class TestGreet(unittest.TestCase):
    def test_greet(self):
        self.assertEqual(greet("Alice"), "Hello, Alice!")
        self.assertEqual(greet(""), "Hello, !")

    def test_greet_with_special_chars(self):
        self.assertEqual(greet("世界"), "Hello, 世界!")

if __name__ == "__main__":
    # 运行测试
    unittest.main()
```

## 打包为可执行文件

### 使用 PyInstaller

```bash
# 安装
pip install pyinstaller

# 打包
pyinstaller --onefile hello.py

# 运行
./dist/hello
```

## 项目结构

```
hello_project/
├── src/
│   ├── __init__.py
│   └── greeter.py
├── tests/
│   ├── __init__.py
│   └── test_greeter.py
├── requirements.txt
├── setup.py
└── README.md
```

## 最佳实践

::: tip 编码规范

1. **UTF-8 编码**：文件头部添加 `# -*- coding: utf-8 -*-`
2. **Shebang**：`#!/usr/bin/env python3`
3. **main 函数**：使用 `if __name__ == "__main__"`
4. **类型提示**：使用 `typing` 模块
5. **文档字符串**：使用 Google 风格或 NumPy 风格
:::
