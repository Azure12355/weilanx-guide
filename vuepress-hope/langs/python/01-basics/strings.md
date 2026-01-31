---
title: 字符串操作
icon: ri:font-size-2
order: 4
---

# 字符串操作

字符串是 Python 中最常用的数据类型之一，提供了丰富的操作方法。

## 字符串创建与基本操作

### 字符串定义

```python
# 单引号
s1 = 'Hello'

# 双引号
s2 = "World"

# 三引号（多行字符串）
s3 = """This is a
multi-line
string"""

# 原始字符串（不转义）
path = r"C:\Users\name"

# 字节字符串
b = b"Hello"

# Unicode 字符串
emoji = "😀🎉🚀"
chinese = "你好世界"
```

### 字符串拼接

```python
# 使用 + 运算符
greeting = "Hello" + " " + "World"

# 使用 join()（推荐）
words = ["Hello", "Beautiful", "World"]
sentence = " ".join(words)

# 使用 f-string（Python 3.6+）
name = "Alice"
age = 25
message = f"My name is {name} and I'm {age} years old"

# format() 方法
template = "Hello, {0}! You are {1} years old."
message = template.format(name, age)

# % 格式化（旧式）
message = "Hello, %s! You are %d years old." % (name, age)
```

## 字符串格式化

### f-string（推荐）

```python
# 基本用法
name = "Alice"
age = 25
print(f"Name: {name}, Age: {age}")

# 表达式计算
x = 10
y = 20
print(f"{x} + {y} = {x + y}")

# 格式化选项
pi = 3.14159265
print(f"{pi:.2f}")    # 3.14（保留2位小数）
print(f"{pi:>10.2f}")  # "      3.14"（右对齐，宽度10）
print(f"{pi:<10.2f}")  # "3.14      "（左对齐，宽度10）
print(f"{pi:^10.2f}")  # "   3.14   "（居中，宽度10）

# 千位分隔符
number = 1000000
print(f"{number:,}")  # 1,000,000

# 百分比
ratio = 0.8567
print(f"{ratio:.2%}")  # 85.67%

# 日期格式化
from datetime import datetime
now = datetime.now()
print(f"{now:%Y-%m-%d %H:%M:%S}")  # 2024-01-01 12:00:00
```

### format() 方法

```python
# 位置参数
"{0} likes {1}".format("Alice", "Python")  # "Alice likes Python"

# 关键字参数
"{name} likes {language}".format(name="Bob", language="Java")

# 混合使用
"{0} likes {language}".format("Charlie", language="C++")

# 格式化选项
"{:>10}".format("Hello")  # "     Hello"（右对齐）
"{:<10}".format("Hello")  # "Hello     "（左对齐）
"{:^10}".format("Hello")  # "  Hello   "（居中）
"{:10.2f}".format(3.14159)  # "      3.14"

# 格式化字典
person = {"name": "David", "age": 30}
"{name} is {age} years old".format(**person)
```

### % 格式化

```python
# 基本用法
name = "Eve"
age = 28
"My name is %s and I'm %d years old" % (name, age)

# 格式化选项
"%10s" % "Hello"    # "     Hello"
"%10.2f" % 3.14159  # "      3.14"
"%.2f%%" % 0.8567   # "85.67%"
```

## 字符串方法

### 大小写转换

```python
text = "Hello World"

# 转换方法
text.lower()          # "hello world"（全小写）
text.upper()          # "HELLO WORLD"（全大写）
text.title()          # "Hello World"（标题格式）
text.capitalize()     # "Hello world"（首字母大写）
text.swapcase()       # "hELLO wORLD"（大小写互换）

# 判断方法
"hello".islower()     # True
"HELLO".isupper()     # True
"Hello World".istitle()  # True
"HELLO123".isupper()  # True
```

### 查找与替换

```python
text = "Hello World, Hello Python"

# 查找
text.find("Hello")    # 0（首次出现位置）
text.rfind("Hello")   # 13（最后出现位置）
text.index("World")   # 6（不存在会报错）
text.rindex("World")  # 6（从右边查找）

# 计数
text.count("Hello")   # 2（出现次数）

# 替换
text.replace("Hello", "Hi")  # "Hi World, Hi Python"
text.replace("Hello", "Hi", 1)  # "Hi World, Hello Python"（只替换一次）

# 检查开头/结尾
text.startswith("Hello")  # True
text.endswith("Python")   # True
"hello.txt".startswith(("hello", "world"))  # True
```

### 去除空白

```python
text = "  Hello World  "

text.strip()      # "Hello World"（去除首尾空白）
text.lstrip()     # "Hello World  "（去除左边空白）
text.rstrip()     # "  Hello World"（去除右边空白）

# 去除指定字符
text = "---Hello---"
text.strip("-")   # "Hello"
text.lstrip("-")  # "Hello---"
```

### 分割与连接

```python
# split()
text = "Hello,World,Python"
text.split(",")            # ["Hello", "World", "Python"]
text.split(",", 1)         # ["Hello", "World,Python"]（分割一次）
text.split()               # ["Hello,World,Python"]（默认按空白分割）

# rsplit()
text.rsplit(",", 1)        # ["Hello,World", "Python"]

# partition()
text.partition(",")        # ("Hello", ",", "World,Python")

# rpartition()
text.rpartition(",")       # ("Hello,World", ",", "Python")

# splitlines()
multiline = "Line1\nLine2\rLine3\r\nLine4"
multiline.splitlines()     # ["Line1", "Line2", "Line3", "Line4"]

# join()
"-".join(["Hello", "World", "Python"])  # "Hello-World-Python"
```

### 对齐与填充

```python
text = "Hello"

# 左对齐
text.ljust(10)        # "Hello     "
text.ljust(10, "-")   # "Hello-----"

# 右对齐
text.rjust(10)        # "     Hello"
text.rjust(10, "-")   # "-----Hello"

# 居中
text.center(10)       # "  Hello   "
text.center(10, "-")  # "--Hello---"

# 填充
text.zfill(10)        # "00000Hello"
```

## 正则表达式

### re 模块基础

```python
import re

# 匹配
pattern = r"\d+"
text = "Python 3.12"
re.search(pattern, text)      # <re.Match object; span=(7, 10), match='12'>
re.findall(pattern, text)     # ['3', '12']
re.match(pattern, text)       # None（必须从开头匹配）

# 替换
re.sub(r"\d+", "X", "Python 3.12")  # "Python X.X"

# 分割
re.split(r"\s+", "Hello    World")  # ["Hello", "World"]

# 编译正则表达式
pattern = re.compile(r"\d+")
pattern.findall("Python 3.12")  # ['3', '12']
```

### 常用正则模式

```python
import re

# 邮箱验证
email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
re.match(email_pattern, "user@example.com")  # 匹配

# 电话号码
phone_pattern = r"\d{3}-\d{4}-\d{4}"
re.match(phone_pattern, "138-1234-5678")  # 匹配

# URL
url_pattern = r"https?://[^\s]+"
re.findall(url_pattern, "Visit https://example.com or http://test.org")

# 提取所有单词
words = re.findall(r"\b\w+\b", "Hello, World! Python is great.")
# ["Hello", "World", "Python", "is", "great"]

# 捕获组
date_pattern = r"(\d{4})-(\d{2})-(\d{2})"
match = re.search(date_pattern, "Date: 2024-01-01")
match.group(1)  # "2024"
match.group(2)  # "01"
match.group(3)  # "01"
```

## Unicode 字符串

```python
# Unicode 字符
emoji = "😀"
chinese = "中文"
accent = "café"

# 获取 Unicode 码点
ord("😀")  # 128512
ord("中")  # 20013

# 从码点创建字符
chr(128512)  # "😀"
chr(20013)   # "中"

# Unicode 转义
"\u4e2d\u6587"  # "中文"
"\U0001f600"     # "😀"

# 编码与解码
text = "你好"
encoded = text.encode("utf-8")  # b'\xe4\xbd\xa0\xe5\xa5\xbd'
decoded = encoded.decode("utf-8")  # "你好"
```

## 字符串编码

```python
# 编码
text = "Hello, 你好"
text.encode("utf-8")    # b'Hello, \xe4\xbd\xa0\xe5\xa5\xbd'
text.encode("gbk")      # b'Hello, \xc4\xe3\xba\xc3'

# 解码
data = b'Hello, \xe4\xbd\xa0\xe5\xa5\xbd'
data.decode("utf-8")    # "Hello, 你好"

# 检测编码
import chardet
raw_data = b'\xe4\xbd\xa0\xe5\xa5\xbd'
chardet.detect(raw_data)  # {'encoding': 'utf-8', 'confidence': 0.99}
```

## 字符串模板

```python
from string import Template

# 基本用法
template = Template("Hello, $name!")
template.substitute(name="Alice")  # "Hello, Alice!"

# 使用字典
data = {"name": "Bob", "age": 30}
template = Template("$name is $age years old")
template.substitute(data)

# safe_substitute（缺少变量不会报错）
template = Template("Hello, $name!")
template.safe_substitute({"age": 30})  # "Hello, $name!"
```

## 最佳实践

::: tip 格式化选择

- **简单场景**：f-string（最简洁、最快）
- **兼容旧版本**：format() 方法
- **国际化和复杂格式**：format() 或模板

::: tip 字符串拼接

```python
# ❌ 不推荐（循环中使用 +）
result = ""
for s in strings:
    result += s  # 每次都创建新字符串

# ✅ 推荐（使用 join）
result = "".join(strings)

# ✅ 推荐（使用列表推导式）
result = "".join(s for s in strings)
```

::: tip 正则表达式

```python
# ❌ 不推荐（每次都重新编译）
for text in texts:
    re.match(r"\d+", text)

# ✅ 推荐（预编译）
pattern = re.compile(r"\d+")
for text in texts:
    pattern.match(text)
```
