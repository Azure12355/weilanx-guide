---
title: Pandas
icon: simple:pandas
order: 2
---

# Pandas

Pandas 是 Python 数据分析的核心库，提供数据结构和数据分析工具。

## Series

### 创建 Series

```python
import pandas as pd
import numpy as np

# 从列表创建
s = pd.Series([1, 2, 3, 4, 5])
# 0    1
# 1    2
# 2    3
# 3    4
# 4    5

# 带索引
s = pd.Series([1, 2, 3], index=["a", "b", "c"])
# a    1
# b    2
# c    3

# 从字典创建
s = pd.Series({"a": 1, "b": 2, "c": 3})
# a    1
# b    2
# c    3
```

### Series 操作

```python
s = pd.Series([1, 2, 3, 4, 5])

# 访问元素
print(s[0])       # 1
print(s["a"])     # 如果有索引 "a"

# 切片
print(s[1:4])     # 1    2    3

# 向量化运算
print(s * 2)      # 每个元素乘 2
print(s[s > 2])   # 条件筛选

# 统计
print(s.mean())   # 3.0
print(s.sum())    # 15
print(s.std())    # 标准差
```

## DataFrame

### 创建 DataFrame

```python
# 从字典创建
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "city": ["NYC", "LA", "SF"]
})
#      name  age city
# 0    Alice   25  NYC
# 1      Bob   30   LA
# 2  Charlie   35   SF

# 从列表的列表
df = pd.DataFrame([
    ["Alice", 25, "NYC"],
    ["Bob", 30, "LA"],
    ["Charlie", 35, "SF"]
], columns=["name", "age", "city"])

# 从 NumPy 数组
arr = np.random.rand(3, 4)
df = pd.DataFrame(arr, columns=["A", "B", "C", "D"])
```

### DataFrame 属性

```python
df = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})

print(df.shape)      # (3, 2) - 形状
print(df.index)      # RangeIndex(start=0, stop=3, step=1)
print(df.columns)     # Index(['A', 'B'], dtype='object')
print(df.dtypes)     # 每列的数据类型
print(df.info())     # DataFrame 信息
print(df.describe()) # 统计摘要
```

## 数据选择

### 列选择

```python
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "city": ["NYC", "LA", "SF"]
})

# 选择单列
names = df["name"]  # Series
# 或 df.name

# 选择多列
subset = df[["name", "age"]]
```

### 行选择

```python
# 使用 loc（标签索引）
print(df.loc[0])              # 第一行
print(df.loc[0:1])            # 前两行
print(df.loc[0, "name"])      # 标量选择
print(df.loc[0:1, "name": "age"])  # 切片

# 使用 iloc（位置索引）
print(df.iloc[0])             # 第一行
print(df.iloc[0:2])           # 前两行
print(df.iloc[0, 0])          # 第一行第一列
print(df.iloc[0:2, 0:2])      # 前两行前两列
```

### 条件筛选

```python
# 单条件
filtered = df[df["age"] > 30]

# 多条件 AND
filtered = df[(df["age"] > 25) & (df["city"] == "NYC")]

# 多条件 OR
filtered = df[(df["city"] == "NYC") | (df["city"] == "LA")]

# isin
filtered = df[df["city"].isin(["NYC", "SF"])]

# 字符串包含
filtered = df[df["name"].str.contains("A")]
```

## 数据操作

### 添加列

```python
# 添加新列
df["salary"] = [50000, 60000, 70000]

# 基于现有列
df["annual_salary"] = df["salary"] * 12

# 使用 apply
df["name_upper"] = df["name"].apply(str.upper)
```

### 删除列

```python
# 删除单列
df = df.drop("salary", axis=1)
# 或
df = df.drop(columns=["salary"])

# 删除多列
df = df.drop(columns=["salary", "annual_salary"])

# 原地修改
df.drop("salary", axis=1, inplace=True)
```

### 重命名

```python
# 重命名列
df = df.rename(columns={"name": "full_name", "age": "years"})

# 重命名索引
df = df.rename(index={0: "first", 1: "second"})
```

### 排序

```python
# 按值排序
df_sorted = df.sort_values("age")
df_sorted = df.sort_values("age", ascending=False)

# 按索引排序
df_sorted = df.sort_index()
```

## 数据清洗

### 处理缺失值

```python
import numpy as np

# 创建带缺失值的 DataFrame
df = pd.DataFrame({
    "A": [1, 2, np.nan, 4],
    "B": [5, np.nan, np.nan, 8],
    "C": ["a", "b", "c", "d"]
})

# 检查缺失值
print(df.isnull())
print(df.isnull().sum())

# 删除缺失值
df_dropped = df.dropna()           # 删除有 NaN 的行
df_dropped = df.dropna(axis=1)      # 删除有 NaN 的列
df_dropped = df.dropna(subset=["A"])  # 检查指定列

# 填充缺失值
df_filled = df.fillna(0)            # 用 0 填充
df_filled = df.fillna(method="ffill")  # 前向填充
df_filled = df.fillna(method="bfill")  # 后向填充
df_filled = df.fillna({"A": 0, "B": 1})  # 不同列不同值
```

### 处理重复值

```python
# 检查重复
print(df.duplicated())
print(df.duplicated().sum())

# 删除重复
df_unique = df.drop_duplicates()

# 保留最后一个
df_unique = df.drop_duplicates(keep="last")
```

### 类型转换

```python
# 转换类型
df["A"] = df["A"].astype(int)
df["B"] = df["B"].astype(float)
df["C"] = df["C"].astype(str)

# 自动转换
df["A"] = pd.to_numeric(df["A"])
df["date"] = pd.to_datetime(df["date"])
```

## 数据分组

### groupby

```python
df = pd.DataFrame({
    "category": ["A", "B", "A", "B", "A"],
    "value": [10, 20, 30, 40, 50]
})

# 分组求和
grouped = df.groupby("category").sum()
# category  value
# A            90
# B            60

# 多种聚合
grouped = df.groupby("category").agg({
    "value": ["sum", "mean", "count"]
})

# 分组后迭代
for name, group in df.groupby("category"):
    print(f"Category: {name}")
    print(group)
```

### pivot_table

```python
df = pd.DataFrame({
    "date": ["2023-01", "2023-01", "2023-02", "2023-02"],
    "category": ["A", "B", "A", "B"],
    "value": [10, 20, 30, 40]
})

pivot = df.pivot_table(
    index="date",
    columns="category",
    values="value",
    aggfunc="sum"
)
```

## 数据合并

### concat

```python
# 垂直拼接
df1 = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
df2 = pd.DataFrame({"A": [5, 6], "B": [7, 8]})
concatenated = pd.concat([df1, df2], ignore_index=True)

# 水平拼接
concatenated = pd.concat([df1, df2], axis=1)
```

### merge

```python
# 内连接
df1 = pd.DataFrame({"key": ["A", "B", "C"], "value1": [1, 2, 3]})
df2 = pd.DataFrame({"key": ["A", "B", "D"], "value2": [4, 5, 6]})
merged = pd.merge(df1, df2, on="key")

# 左连接
merged = pd.merge(df1, df2, on="key", how="left")

# 外连接
merged = pd.merge(df1, df2, on="key", how="outer")
```

### join

```python
# 基于索引连接
df1 = pd.DataFrame({"A": [1, 2, 3]}, index=["a", "b", "c"])
df2 = pd.DataFrame({"B": [4, 5, 6]}, index=["a", "b", "d"])
joined = df1.join(df2, how="outer")
```

## 时间序列

### 时间索引

```python
# 创建时间范围
dates = pd.date_range("2023-01-01", periods=6, freq="D")
df = pd.DataFrame({"value": range(6)}, index=dates)

# 重采样
monthly = df.resample("M").sum()
weekly = df.resample("W").mean()

# 滚动窗口
rolling = df.rolling(window=3).mean()
```

### 时间操作

```python
# 转换为 datetime
df["date"] = pd.to_datetime(df["date"])

# 提取时间部分
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["weekday"] = df["date"].dt.weekday

# 时间差
df["time_diff"] = df["date"] - df["date"].shift(1)
```

## 数据读写

### CSV

```python
# 读取 CSV
df = pd.read_csv("data.csv")

# 写入 CSV
df.to_csv("output.csv", index=False)

# 读取特定列
df = pd.read_csv("data.csv", usecols=["col1", "col2"])

# 跳过行
df = pd.read_csv("data.csv", skiprows=1)
```

### Excel

```python
# 读取 Excel
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")

# 写入 Excel
df.to_excel("output.xlsx", sheet_name="Sheet1", index=False)

# 多表读取
excel_file = pd.ExcelFile("data.xlsx")
df1 = pd.read_excel(excel_file, "Sheet1")
df2 = pd.read_excel(excel_file, "Sheet2")
```

### SQL

```python
import sqlite3

# 从 SQL 读取
conn = sqlite3.connect("database.db")
df = pd.read_sql_query("SELECT * FROM users", conn)

# 写入 SQL
df.to_sql("users", conn, if_exists="append", index=False)
```

### JSON

```python
# 读取 JSON
df = pd.read_json("data.json")

# 写入 JSON
df.to_json("output.json", orient="records")
```

## Pandas 最佳实践

::: tip Pandas 建议

1. **链式操作**：使用方法链
2. **避免循环**：使用向量化操作
3. **使用 categorial**：减少重复字符串内存
4. **避免 append**：预分配或使用 concat
5. **使用 copy**：避免 SettingWithCopyWarning

::: tip 性能优化

```python
# ❌ 慢：循环
for i in range(len(df)):
    df.loc[i, "new_col"] = df.loc[i, "col1"] * 2

# ✅ 快：向量化
df["new_col"] = df["col1"] * 2

# ✅ 使用 categorial 减少内存
df["category"] = df["category"].astype("category")
```

::: tip 链式操作

```python
# 链式方法
result = (df
    .query("age > 25")
    .assign(salary=lambda x: x["age"] * 1000)
    .sort_values("salary", ascending=False)
)
```

::: tip 内存优化

```python
# 使用合适的数据类型
df["age"] = df["age"].astype("int8")     # 小整数
df["price"] = df["price"].astype("float32")  # 单精度浮点
df["category"] = df["category"].astype("category")  # 分类数据

# 删除不需要的列
df = df.drop(columns=["unnecessary_column"])

# 使用 iterator 分块读取大文件
for chunk in pd.read_csv("large_file.csv", chunksize=10000):
    process(chunk)
```
