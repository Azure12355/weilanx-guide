---
title: 运算符
icon: ri:calculator-line
order: 2
---

# 运算符

Python 支持多种运算符，包括算术、比较、逻辑、位运算符等。

## 算术运算符

```python
# 基本运算
a, b = 10, 3

print(a + b)    # 13  加法
print(a - b)    # 7   减法
print(a * b)    # 30  乘法
print(a / b)    # 3.333... 除法（结果为浮点数）
print(a // b)   # 3   整除
print(a % b)    # 1   取模（余数）
print(a ** b)   # 1000 幂运算

# 幂运算的优先级
2 ** 3 ** 2    # 512 (2 ** (3 ** 2))
(2 ** 3) ** 2  # 64

# 复数运算
z1 = 3 + 4j
z2 = 1 + 2j
print(z1 + z2)  # (4+6j)
print(z1 * z2)  # (-5+10j)
```

## 比较运算符

```python
a, b = 5, 10

print(a == b)   # False  等于
print(a != b)   # True   不等于
print(a < b)    # True   小于
print(a <= b)   # True   小于等于
print(a > b)    # False  大于
print(a >= b)   # False  大于等于

# 链式比较
x = 5
print(1 < x < 10)  # True
print(10 < x < 20) # False

# 字符串比较
"apple" < "banana"  # True（按字典序）
"A" < "a"          # True（大写字母 ASCII 值更小）

# 列表比较（按元素逐个比较）
[1, 2] < [1, 3]    # True
[1, 2] < [1, 2, 3] # True（较短的小）
```

## 逻辑运算符

```python
a, b = True, False

print(a and b)  # False  逻辑与
print(a or b)   # True   逻辑或
print(not a)    # False  逻辑非

# 短路求值
def func():
    print("函数被调用")
    return True

False and func()  # 不会调用 func()（短路）
True or func()    # 不会调用 func()（短路）

# 真值测试
# 以下值被视为 False：
bool(False)    # False
bool(None)     # False
bool(0)        # False
bool(0.0)      # False
bool("")       # False
bool([])       # False
bool(())       # False
bool({})       # False
bool(set())    # False

# 其他所有值都被视为 True
```

## 位运算符

```python
a, b = 5, 3  # 5 = 0b101, 3 = 0b011

print(a & b)   # 1  (0b001) 按位与
print(a | b)   # 7  (0b111) 按位或
print(a ^ b)   # 6  (0b110) 按位异或
print(~a)      # -6        按位取反
print(a << 1)  # 10 (0b1010) 左移
print(a >> 1)  # 2  (0b010) 右移

# 位运算应用
# 检查奇偶
num = 5
is_odd = num & 1  # 1 (True)

# 乘以 2 的幂
x = 5
x <<= 3  # x * 8 = 40

# 交换变量（不使用临时变量）
a, b = 5, 3
a ^= b
b ^= a
a ^= b
# a = 3, b = 5
```

## 赋值运算符

```python
x = 10

# 复合赋值
x += 5   # x = x + 5   => 15
x -= 3   # x = x - 3   => 12
x *= 2   # x = x * 2   => 24
x /= 4   # x = x / 4   => 6.0
x //= 2  # x = x // 2  => 3.0
x %= 3   # x = x % 3   => 0.0
x **= 2  # x = x ** 2  => 0.0
x &= 1   # x = x & 1
x |= 2   # x = x | 2
x ^= 3   # x = x ^ 3
x <<= 1  # x = x << 1
x >>= 1  # x = x >> 1

# 海象运算符（Python 3.8+）
if (n := len("hello")) > 3:
    print(f"长度为 {n}")  # 长度为 5

# 在列表推导式中使用
numbers = [len(line) for line in ["hello", "world", "python"] if (n := len(line)) > 5]
```

## 成员运算符

```python
# in 和 not in
numbers = [1, 2, 3, 4, 5]

print(3 in numbers)       # True
print(6 in numbers)       # False
print(6 not in numbers)   # True

# 字符串检查
text = "Hello World"
print("World" in text)    # True
print("world" in text)    # False（区分大小写）

# 字典检查（检查键）
person = {"name": "Alice", "age": 25}
print("name" in person)   # True
print("Alice" in person)  # False
```

## 身份运算符

```python
# is 和 is not（检查是否为同一对象）
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)    # True（值相等）
print(a is b)    # False（不同对象）
print(a is c)    # True（同一对象）

print(a is not b)  # True

# None 的比较（推荐使用 is）
x = None
print(x is None)      # True
print(x == None)      # True（但不推荐）

# 小整数缓存（-5 到 256）
a = 256
b = 256
print(a is b)    # True

a = 257
b = 257
print(a is b)    # False（超出缓存范围）
```

## 运算符优先级

从高到低的运算符优先级：

```python
# 1. 括号
(result) := expression

# 2. 索引、切片、属性访问、函数调用
obj[index]
obj[start:stop]
obj.attribute
function()

# 3. 幂运算
**

# 4. 正负号、按位取反
+x, -x, ~x

# 5. 乘除、取模
*, /, //, %

# 6. 加减
+, -

# 7. 位移
<<, >>

# 8. 按位与
&

# 9. 按位异或
^

# 10. 按位或
|

# 11. 比较
in, not in, is, is not, <, <=, >, >=, !=, ==

# 12. 逻辑非
not

# 13. 逻辑与
and

# 14. 逻辑或
or

# 15. 赋值
=, +=, -=, etc.

# 16. 海象运算符
:=
```

## 运算符示例

```python
# 复杂表达式
result = 2 + 3 * 4        # 14（乘法优先）
result = (2 + 3) * 4      # 20（括号优先）
result = 2 * 3 ** 2       # 18（幂运算优先）
result = 10 / 2 + 3 * 4   # 17.0（先乘除后加减）

# 逻辑表达式
x, y = 5, 10
result = x > 0 and y < 20  # True
result = x > 10 or y < 5   # False
result = not (x == y)      # True

# 位运算表达式
flags = 0b1010  # 10
mask = 0b1100   # 12
flags & mask    # 8  (0b1000)
flags | mask    # 14 (0b1110)
flags ^ mask    # 6  (0b0110)
```

## 类型转换与运算

```python
# 隐式类型转换
result = 10 + 3.14    # 13.14（int + float = float）
result = 10 + True    # 11（bool 被视为 int）
result = "Hello" * 3  # "HelloHelloHello"

# 显式类型转换
result = int(3.14) + 2        # 5
result = float(10) / 3        # 3.333...
result = str(123) + "456"     # "123456"

# 混合类型运算需要注意
result = "10" + 20  # TypeError（不能直接相加）
result = int("10") + 20  # 30（正确转换）
```

## 运算符重载

```python
# 在类中重载运算符
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
v3 = v1 + v2  # Vector(4, 6)
print(v3)      # Vector(4, 6)
```
