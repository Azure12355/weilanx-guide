---
title: 生成器与迭代器
icon: ri:refresh-line
order: 4
---

# 生成器与迭代器

生成器和迭代器是 Python 中处理序列数据的强大工具，支持惰性求值。

## 迭代器

### 迭代器协议

```python
# 迭代器需要实现两个方法
class Counter:
    def __init__(self, limit):
        self.limit = limit
        self.count = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.count < self.limit:
            value = self.count
            self.count += 1
            return value
        raise StopIteration

# 使用迭代器
counter = Counter(5)
for num in counter:
    print(num)  # 0, 1, 2, 3, 4

# 手动迭代
counter = Counter(3)
print(next(counter))  # 0
print(next(counter))  # 1
print(next(counter))  # 2
# next(counter)      # StopIteration
```

### 可迭代对象

```python
# 只需实现 __iter__ 方法
class Squares:
    def __init__(self, limit):
        self.limit = limit

    def __iter__(self):
        return SquaresIterator(self.limit)

class SquaresIterator:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current < self.limit:
            value = self.current ** 2
            self.current += 1
            return value
        raise StopIteration

# 使用
squares = Squares(5)
for square in squares:
    print(square)  # 0, 1, 4, 9, 16
```

## 生成器函数

### 基本生成器

```python
# 使用 yield 创建生成器
def count_down(n):
    while n > 0:
        yield n
        n -= 1

# 使用生成器
for num in count_down(5):
    print(num)  # 5, 4, 3, 2, 1

# 生成器对象
gen = count_down(3)
print(next(gen))  # 3
print(next(gen))  # 2
print(next(gen))  # 1
# next(gen)      # StopIteration
```

### 生成器表达式

```python
# 类似列表推导式的语法
squares = (x**2 for x in range(10))

# 使用生成器
for square in squares:
    print(square)

# 生成器只遍历一次
gen = (x for x in range(3))
list(gen)  # [0, 1, 2]
list(gen)  # []（已耗尽）

# 优势：惰性求值，节省内存
# sum(x**2 for x in range(1000000))  # 只存储当前值
```

### yield from（Python 3.3+）

```python
# 委托给子生成器
def chain(*iterables):
    for it in iterables:
        yield from it

# 使用
list(chain([1, 2], [3, 4], [5, 6]))
# [1, 2, 3, 4, 5, 6]

# 等价于
def chain_old(*iterables):
    for it in iterables:
        for item in it:
            yield item

# 递归生成器
def traverse(tree):
    if isinstance(tree, list):
        for subtree in tree:
            yield from traverse(subtree)
    else:
        yield tree

tree = [1, [2, [3, 4]], 5, [6]]
list(traverse(tree))  # [1, 2, 3, 4, 5, 6]
```

## 无限生成器

```python
# 无限计数器
def count(start=0):
    while True:
        yield start
        start += 1

# 使用 itertools.islice 截取
import itertools
counter = count()
first_10 = itertools.islice(counter, 10)
list(first_10)  # [0, 1, 2, ..., 9]

# 无限循环
def cycle(iterable):
    while True:
        for item in iterable:
            yield item

cycler = cycle([1, 2, 3])
first_10 = itertools.islice(cycler, 10)
list(first_10)  # [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]
```

## 生成器方法

```python
def numbers():
    yield 1
    yield 2
    yield 3
    yield 4

# 生成器方法
gen = numbers()

# send()：向生成器发送值
def echo():
    while True:
        received = yield
        print(f"Received: {received}")

e = echo()
next(e)  # 启动生成器
e.send("Hello")  # Received: Hello
e.send("World")  # Received: World

# throw()：向生成器抛出异常
gen = numbers()
next(gen)
gen.throw(ValueError("Invalid value"))

# close()：关闭生成器
gen = numbers()
next(gen)
gen.close()
# next(gen)  # StopIteration
```

## itertools 模块

```python
import itertools

# count()：无限计数
counter = itertools.count(start=10, step=2)
list(itertools.islice(counter, 5))  # [10, 12, 14, 16, 18]

# cycle()：无限循环
cycler = itertools.cycle([1, 2, 3])
list(itertools.islice(cycler, 10))  # [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]

# repeat()：重复元素
repeater = itertools.repeat(10, 3)
list(repeater)  # [10, 10, 10]

# accumulate()：累积
list(itertools.accumulate([1, 2, 3, 4, 5]))
# [1, 3, 6, 10, 15]

# chain()：连接可迭代对象
list(itertools.chain([1, 2], [3, 4], [5, 6]))
# [1, 2, 3, 4, 5, 6]

# compress()：过滤
list(itertools.compress("ABCDEF", [1, 0, 1, 0, 1, 0]))
# ['A', 'C', 'E']

# takewhile()：取直到条件为假
list(itertools.takewhile(lambda x: x < 5, [1, 2, 3, 4, 5, 6, 7]))
# [1, 2, 3, 4]

# dropwhile()：丢弃直到条件为假
list(itertools.dropwhile(lambda x: x < 5, [1, 2, 3, 4, 5, 6, 7]))
# [5, 6, 7]

# filterfalse()：过滤为假的元素
list(itertools.filterfalse(lambda x: x % 2, range(10)))
# [0, 2, 4, 6, 8]

# islice()：切片
list(itertools.islice(range(10), 2, 8, 2))
# [2, 4, 6]

# permutations()：排列
list(itertools.permutations([1, 2, 3], 2))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]

# combinations()：组合
list(itertools.combinations([1, 2, 3, 4], 2))
# [(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)]

# product()：笛卡尔积
list(itertools.product([1, 2], ['a', 'b']))
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

## 生成器应用

### 读取大文件

```python
def read_large_file(filename):
    """逐行读取大文件，节省内存"""
    with open(filename) as f:
        for line in f:
            yield line.strip()

# 使用
for line in read_large_file("large_file.txt"):
    process(line)
```

### 斐波那契数列

```python
def fibonacci():
    """生成斐波那契数列"""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# 获取前 10 个
fib = fibonacci()
first_10 = [next(fib) for _ in range(10)]
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### 树遍历

```python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    """中序遍历二叉树"""
    if root:
        yield from inorder_traversal(root.left)
        yield root.val
        yield from inorder_traversal(root.right)

# 使用
tree = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3, TreeNode(6), TreeNode(7))
)
list(inorder_traversal(tree))  # [4, 2, 5, 1, 6, 3, 7]
```

### 管道风格处理

```python
# 生成器管道
def read_lines(filename):
    with open(filename) as f:
        for line in f:
            yield line

def filter_lines(lines, keyword):
    for line in lines:
        if keyword in line:
            yield line

def transform_lines(lines):
    for line in lines:
        yield line.strip().upper()

# 组合管道
lines = read_lines("data.txt")
filtered = filter_lines(lines, "python")
transformed = transform_lines(filtered)

for line in transformed:
    print(line)
```

## 生成器 vs 列表

| 特性 | 生成器 | 列表 |
|------|--------|------|
| 内存使用 | 惰性，O(1) | 立即创建，O(n) |
| 速度 | 首次较慢 | 首次较快 |
| 可迭代 | 只能一次 | 可多次遍历 |
| 用途 | 大数据、流数据 | 小数据、需要索引 |

```python
# 列表：一次性创建
def get_squares_list(n):
    return [x**2 for x in range(n)]
# 立即占用内存

# 生成器：按需生成
def get_squares_gen(n):
    for x in range(n):
        yield x**2
# 只存储当前状态
```

::: tip 使用生成器的场景

1. **大数据集**：不希望一次性加载到内存
2. **流数据**：文件读取、网络请求
3. **无限序列**：计数器、循环
4. **管道处理**：数据处理流水线
5. **性能优化**：惰性求值，按需计算

::: warning 注意事项

1. 生成器只能遍历一次
2. 生成器不支持 len() 和索引
3. 使用后记得关闭（处理资源）
:::
