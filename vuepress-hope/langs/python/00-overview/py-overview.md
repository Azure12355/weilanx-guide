---
title: Python 概述
icon: ri:book-2-line
order: 1
---

# Python 概述

## 什么是 Python

Python 是一门高级、解释型、通用编程语言，由荷兰程序员 Guido van Rossum（吉多·范罗苏姆）于 1991 年首次发布。Python 的设计哲学强调代码的可读性和简洁的语法。

## 设计哲学

Python 之禅（The Zen of Python）体现了 Python 的核心设计理念：

```python
>>> import this
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

## 核心特点

### 1. 简洁优雅

```python
# Java 风格
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

# Python 风格
print("Hello, World!")
```

### 2. 动态类型

```python
# 无需声明类型
x = 42          # int
x = "hello"     # str
x = [1, 2, 3]   # list
```

### 3. 强类型

```python
# Python 是强类型语言，不会隐式转换
"42" + 42  # TypeError: can only concatenate str (not "int") to str
```

### 4. 缩进敏感

```python
def greet(name):
    if name:
        return f"Hello, {name}!"
    else:
        return "Hello, Stranger!"
```

## 应用领域

### 数据科学与机器学习

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 数据分析
df = pd.read_csv("data.csv")
df.groupby("category").mean().plot(kind="bar")
```

**主流框架**：
- NumPy：数值计算
- Pandas：数据分析
- Matplotlib/Seaborn：数据可视化
- Scikit-learn：机器学习
- TensorFlow/PyTorch：深度学习

### Web 开发

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/users")
def get_users():
    return jsonify({"users": ["Alice", "Bob"]})

if __name__ == "__main__":
    app.run(debug=True)
```

**主流框架**：
- Django：全栈框架
- Flask：轻量级框架
- FastAPI：现代异步框架

### 自动化与脚本

```python
import os
import shutil

# 批量重命名文件
for i, filename in enumerate(os.listdir(".")):
    if filename.endswith(".txt"):
        shutil.move(filename, f"document_{i}.txt")
```

### 网络爬虫

```python
import requests
from bs4 import BeautifulSoup

response = requests.get("https://example.com")
soup = BeautifulSoup(response.text, "html.parser")
titles = soup.find_all("h1", class_="title")
```

## Python 版本选择

### Python 2 vs Python 3

| 特性 | Python 2 | Python 3 |
|------|----------|----------|
| 状态 | 已停止维护（2020年1月） | 活跃开发 |
| print | `print "Hello"` | `print("Hello")` |
| 除法 | `5/2 = 2` | `5/2 = 2.5` |
| 字符串 | ASCII 默认 | Unicode 默认 |
| 整数 | sys.maxint | 无限制 |

### 当前推荐版本

- **稳定版**：Python 3.12.x
- **最新版**：Python 3.13.x
- **最低要求**：Python 3.8+

## 学习资源

::: tabs

@tab 官方文档

- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/)

@tab 在线学习

- [LeetCode Python 题解](https://leetcode.cn/)
- [Real Python](https://realpython.com/)
- [Python Morsels](https://www.pythonmorsels.com/)

@tab 经典书籍

- 《Python 编程：从入门到实践》
- 《流畅的 Python》（Fluent Python）
- 《Effective Python》

:::
