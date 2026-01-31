---
title: 函数式编程
icon: ri:function-line
order: 4
---

# 函数式编程

学习 Python 函数编程，包括函数定义、Lambda、装饰器、生成器等高级特性。

## 学习内容

<VPCard
  title="函数"
  desc="函数定义、参数、作用域、闭包"
  logo="https://api.iconify.design/ri/function-line.svg"
  link="/langs/python/03-functional/functions.md"
/>

<VPCard
  title="Lambda 表达式"
  desc="匿名函数、高阶函数"
  logo="https://api.iconify.design/ri/lightbulb-line.svg"
  link="/langs/python/03-functional/lambda.md"
/>

<VPCard
  title="装饰器"
  desc="函数装饰器、类装饰器、装饰器链"
  logo="https://api.iconify.design/ri/artboard-line.svg"
  link="/langs/python/03-functional/decorators.md"
/>

<VPCard
  title="生成器与迭代器"
  desc="迭代器协议、生成器函数、yield 表达式"
  logo="https://api.iconify.design/ri-refresh-line.svg"
  link="/langs/python/03-functional/generators.md"
/>

## 函数式编程特性

### 高阶函数

```python
# map: 对每个元素应用函数
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
# [1, 4, 9, 16, 25]

# filter: 过滤元素
evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4]

# reduce: 归约
from functools import reduce
sum_all = reduce(lambda x, y: x + y, numbers)
# 15
```

### 装饰器威力

```python
@timer
@cache
def expensive_function(n):
    # 计量耗时 + 缓存结果
    ...
```

### 生成器优势

```python
# 惰性计算，节省内存
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# 生成无限序列
fib = fibonacci()
next(fib)  # 0
next(fib)  # 1
next(fib)  # 1
```
