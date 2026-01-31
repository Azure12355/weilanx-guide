---
title: Python
icon: logos:python
order: 2
---

# Python

![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)
![PyPI](https://img.shields.io/badge/PyPI-packages-green?style=flat-square)

## 概述

Python 是一门高级编程语言，由 Guido van Rossum 于 1991 年创建。它以简洁、易读的语法和强大的生态系统而闻名，被称为"胶水语言"。

## 核心特点

- **简洁优雅**：代码可读性强，接近自然语言
- **动态类型**：无需声明变量类型
- **解释执行**：开发速度快，支持交互式编程
- **丰富的库**：PyPI 拥有超过 50 万个第三方包
- **多范式**：支持面向对象、函数式、过程式编程

## 应用领域

| 领域 | 代表库/框架 |
|------|-------------|
| 数据科学 | NumPy, Pandas, SciPy |
| 机器学习 | TensorFlow, PyTorch, scikit-learn |
| Web 开发 | Django, Flask, FastAPI |
| 自动化 | Selenium, Playwright, PyAutoGUI |
| 爬虫 | Scrapy, BeautifulSoup, Requests |

## 学习路径

1. **Python 基础** → 语法、数据类型、控制流
2. **Python 进阶** → 装饰器、生成器、上下文管理器
3. **Web 开发** → Django/Flask 框架
4. **数据分析** → NumPy, Pandas, Matplotlib
5. **机器学习** → scikit-learn, PyTorch

## Hello World

```python
def greet(name: str) -> str:
    """返回问候语"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("Python"))
```

## 代码示例

```python
# 列表推导式
squares = [x**2 for x in range(10)]

# 装饰器
@timer
def slow_function():
    time.sleep(1)

# 上下文管理器
with open("file.txt") as f:
    content = f.read()
```

## 相关资源

- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [Awesome Python](https://awesome-python.com/)

---

::: tip 为什么选择 Python？
> "人生苦短，我用 Python。" — Python 社区名言
:::
