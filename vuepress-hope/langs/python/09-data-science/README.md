---
title: 数据科学
icon: ri:bar-chart-line
order: 10
---

# 数据科学

使用 Python 进行数据分析、可视化和科学计算。

## 学习内容

<VPCard
  title="NumPy"
  desc="数值计算、多维数组、线性代数"
  logo="https://api.iconify.design/simple-icons/numpy.svg"
  link="/langs/python/09-data-science/numpy.md"
/>

<VPCard
  title="Pandas"
  desc="数据分析、DataFrame、数据清洗"
  logo="https://api.iconify.design/simple-icons/pandas.svg"
  link="/langs/python/09-data-science/pandas.md"
/>

<VPCard
  title="数据可视化"
  desc="Matplotlib、Seaborn、Plotly"
  logo="https://api.iconify.design/ri/pie-chart-line.svg"
  link="/langs/python/09-data-science/visualization.md"
/>

<VPCard
  title="数据获取"
  desc="网络爬虫、API 调用、数据清洗"
  logo="https://api.iconify.design/ri-download-cloud-2-line.svg"
  link="/langs/python/09-data-science/data-acquisition.md"
/>

## 数据科学栈

```
┌─────────────────────────────────────┐
│         应用层                        │
│  机器学习  |  深度学习  |  数据分析    │
├─────────────────────────────────────┤
│         工具层                        │
│  Scikit-learn  |  Statsmodels        │
├─────────────────────────────────────┤
│         核心层                        │
│  NumPy  |  Pandas  |  SciPy          │
├─────────────────────────────────────┤
│         可视化层                      │
│  Matplotlib  |  Seaborn  |  Plotly   │
└─────────────────────────────────────┘
```

## 数据分析流程

```mermaid
flowchart LR
    A[数据获取] --> B[数据清洗]
    B --> C[探索分析]
    C --> D[特征工程]
    D --> E[建模分析]
    E --> F[结果可视化]
    F --> G[报告呈现]
```

## 常用操作

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 读取数据
df = pd.read_csv("data.csv")

# 数据探索
df.head()
df.info()
df.describe()

# 数据清洗
df.dropna()
df.fillna(0)
df.drop_duplicates()

# 数据筛选
df[df["age"] > 30]
df.groupby("category").mean()

# 可视化
df.plot(kind="bar")
plt.show()
```
