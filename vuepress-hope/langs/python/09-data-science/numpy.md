---
title: NumPy
icon: simple:numpy
order: 1
---

# NumPy

NumPy 是 Python 科学计算的基础库，提供高效的数组操作和数学函数。

## 数组创建

### 基本创建

```python
import numpy as np

# 从列表创建
arr = np.array([1, 2, 3, 4, 5])
print(arr)  # [1 2 3 4 5]

# 多维数组
arr2d = np.array([[1, 2, 3], [4, 5, 6]])
print(arr2d)
# [[1 2 3]
#  [4 5 6]]

# 指定类型
arr = np.array([1, 2, 3], dtype=np.float64)
```

### 特殊数组

```python
# 全零
zeros = np.zeros((3, 4))
# [[0. 0. 0. 0.]
#  [0. 0. 0. 0.]
#  [0. 0. 0. 0.]]

# 全一
ones = np.ones((2, 3))
# [[1. 1. 1.]
#  [1. 1. 1.]]

# 填充
filled = np.full((2, 2), 7)
# [[7 7]
#  [7 7]]

# 单位矩阵
identity = np.eye(3)
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]

# 范围
range_arr = np.arange(0, 10, 2)  # [0 2 4 6 8]

# 线性空间
linspace = np.linspace(0, 1, 5)  # [0.   0.25 0.5  0.75 1.  ]

# 随机数组
random = np.random.rand(3, 3)  # 0-1 之间
random_int = np.random.randint(0, 10, size=(3, 3))
```

## 数组属性

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.shape)      # (2, 3) - 形状
print(arr.ndim)       # 2 - 维度
print(arr.size)       # 6 - 元素总数
print(arr.dtype)      # int64 - 数据类型
print(arr.itemsize)   # 8 - 每个元素大小（字节）
print(arr.nbytes)     # 48 - 总字节数
```

## 数组索引

### 基本索引

```python
arr = np.array([1, 2, 3, 4, 5])

# 单个元素
print(arr[0])   # 1
print(arr[-1])  # 5

# 切片
print(arr[1:4])    # [2 3 4]
print(arr[::2])    # [1 3 5]
print(arr[::-1])   # [5 4 3 2 1]
```

### 多维索引

```python
arr2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# 单个元素
print(arr2d[0, 0])    # 1
print(arr2d[1, 2])    # 6

# 切片
print(arr2d[0, :])    # [1 2 3] - 第一行
print(arr2d[:, 0])    # [1 4 7] - 第一列
print(arr2d[1:, 1:])  # [[5 6] [8 9]]

# 花式索引
print(arr2d[[0, 2], [0, 2]])  # [1 9]
```

## 数组运算

### 算术运算

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 基本运算
print(a + b)   # [5 7 9]
print(a - b)   # [-3 -3 -3]
print(a * b)   # [4 10 18]
print(a / b)   # [0.25 0.4 0.5]
print(a ** 2)  # [1 4 9]

# 标量运算
print(a + 10)  # [11 12 13]
print(a * 2)   # [2 4 6]
```

### 广播

```python
# 不同形状数组运算
a = np.array([[1, 2, 3], [4, 5, 6]])  # (2, 3)
b = np.array([10, 20, 30])              # (3,)

print(a + b)
# [[11 22 33]
#  [14 25 36]]

# 二维广播
a = np.array([[1], [2], [3]])  # (3, 1)
b = np.array([10, 20, 30])      # (3,)

print(a + b)
# [[11 21 31]
#  [12 22 32]
#  [13 23 33]]
```

### 数学函数

```python
arr = np.array([1, 2, 3, 4])

# 基本数学函数
print(np.sqrt(arr))    # [1.         1.41421356 1.73205081 2.        ]
print(np.exp(arr))     # [ 2.71828183  7.3890561  20.08553692 54.59815003]
print(np.log(arr))     # [0.         0.69314718 1.09861229 1.38629436]
print(np.sin(arr))     # [0.84147098 0.90929743 0.14112001 -0.7568025]

# 舍入
arr = np.array([1.2, 2.5, 3.7, 4.1])
print(np.round(arr))   # [1. 2. 4. 4.]
print(np.floor(arr))   # [1. 2. 3. 4.]
print(np.ceil(arr))    # [2. 3. 4. 5.]

# 统计函数
print(np.sum(arr))     # 11.5
print(np.mean(arr))    # 2.875
print(np.std(arr))     # 1.258305739
print(np.var(arr))     # 1.58333333
print(np.min(arr))     # 1.2
print(np.max(arr))     # 4.1
print(np.median(arr))  # 3.1
```

## 数组形状操作

### reshape

```python
arr = np.arange(12)

# 改变形状
reshaped = arr.reshape(3, 4)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# 自动推断维度
reshaped = arr.reshape(3, -1)  # 第二维自动计算
```

### transpose

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

# 转置
transposed = arr.T
# [[1 4]
#  [2 5]
#  [3 6]]

# 或使用 transpose()
transposed = np.transpose(arr)
```

### flatten 和 ravel

```python
arr2d = np.array([[1, 2, 3], [4, 5, 6]])

# flatten（返回副本）
flattened = arr2d.flatten()  # [1 2 3 4 5 6]

# ravel（返回视图，可能修改原数组）
raveled = arr2d.ravel()     # [1 2 3 4 5 6]
```

### concatenate

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 拼接
concatenated = np.concatenate([a, b])  # [1 2 3 4 5 6]

# 垂直拼接
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
vstacked = np.vstack((a, b))
# [[1 2]
#  [3 4]
#  [5 6]
#  [7 8]]

# 水平拼接
hstacked = np.hstack((a, b))
# [[1 2 5 6]
#  [3 4 7 8]]
```

### split

```python
arr = np.arange(12).reshape(3, 4)

# 水平分割
split = np.hsplit(arr, 2)  # 分成 2 部分

# 垂直分割
split = np.vsplit(arr, 3)  # 分成 3 部分
```

## 线性代数

### 矩阵运算

```python
# 矩阵乘法
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

print(a @ b)  # 或 np.dot(a, b)
# [[19 22]
#  [43 50]]

# 元级乘法
print(a * b)
# [[ 5 12]
#  [21 32]]
```

### 矩阵属性

```python
a = np.array([[1, 2], [3, 4]])

# 行列式
print(np.linalg.det(a))  # -2.0

# 逆矩阵
print(np.linalg.inv(a))
# [[-2.   1. ]
#  [ 1.5 -0.5]]

# 特征值和特征向量
eigenvalues, eigenvectors = np.linalg.eig(a)

# 矩阵秩
rank = np.linalg.matrix_rank(a)  # 2
```

## 条件和筛选

### where

```python
arr = np.array([1, 2, 3, 4, 5])

# 条件索引
indices = np.where(arr > 3)  # (array([3, 4]),)
print(arr[indices])          # [4 5]

# 条件值
result = np.where(arr > 3, arr, 0)  # [0 0 0 4 5]
```

### 布尔索引

```python
arr = np.array([1, 2, 3, 4, 5])

# 布尔条件
mask = arr > 3
print(arr[mask])  # [4 5]

# 多条件
mask = (arr > 2) & (arr < 5)
print(arr[mask])  # [3 4]
```

### unique

```python
arr = np.array([1, 2, 2, 3, 3, 3, 4])

# 唯一值
unique = np.unique(arr)  # [1 2 3 4]

# 唯一值和计数
unique, counts = np.unique(arr, return_counts=True)
# unique: [1 2 3 4]
# counts: [1 2 3 1]
```

## NumPy 最佳实践

::: tip NumPy 建议

1. **向量化操作**：避免 Python 循环
2. **预分配数组**：避免动态增长
3. **使用广播**：减少内存使用
4. **视图而非副本**：提高性能
5. **正确类型**：选择合适的 dtype

::: tip 性能优化

```python
# ❌ 慢：Python 循环
result = []
for i in range(1000000):
    result.append(i ** 2)

# ✅ 快：向量化操作
arr = np.arange(1000000)
result = arr ** 2
```

::: tip 内存优化

```python
# 使用合适的数据类型
arr = np.array([1, 2, 3], dtype=np.int32)   # 比 int64 节省内存
arr = np.array([1.0, 2.0, 3.0], dtype=np.float32)

# 使用视图而非副本
arr = np.arange(10)
view = arr[2:5]  # 视图，不复制数据
copy = arr[2:5].copy()  # 副本，复制数据
```

::: tip 广播规则

1. 从右到左比较形状
2. 维度相同或为 1 时可以广播
3. 缺失维度视为 1
4. 所有维度要么相同要么为 1
