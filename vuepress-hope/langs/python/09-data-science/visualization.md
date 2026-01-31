---
title: 数据可视化
icon: simple:plotly
order: 3
---

# 数据可视化

Python 提供了丰富的数据可视化库，从基础的 Matplotlib 到交互式的 Plotly。

## Matplotlib

### 基础图表

```python
import matplotlib.pyplot as plt
import numpy as np

# 折线图
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label="sin(x)")
plt.xlabel("x")
plt.ylabel("sin(x)")
plt.title("Sine Wave")
plt.legend()
plt.grid(True)
plt.show()

# 散点图
x = np.random.rand(50)
y = np.random.rand(50)
colors = np.random.rand(50)

plt.scatter(x, y, c=colors, cmap="viridis")
plt.xlabel("x")
plt.ylabel("y")
plt.title("Scatter Plot")
plt.colorbar()
plt.show()
```

### 子图

```python
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# 折线图
axes[0, 0].plot(x, y)
axes[0, 0].set_title("Line Plot")

# 散点图
axes[0, 1].scatter(x, y)
axes[0, 1].set_title("Scatter Plot")

# 柱状图
axes[1, 0].bar(["A", "B", "C"], [10, 20, 15])
axes[1, 0].set_title("Bar Chart")

# 直方图
axes[1, 1].hist(np.random.randn(1000), bins=30)
axes[1, 1].set_title("Histogram")

plt.tight_layout()
plt.show()
```

### 柱状图

```python
categories = ["A", "B", "C", "D", "E"]
values = [23, 45, 12, 67, 34]

plt.figure(figsize=(10, 6))
plt.bar(categories, values)
plt.xlabel("Categories")
plt.ylabel("Values")
plt.title("Bar Chart")
plt.show()

# 水平柱状图
plt.barh(categories, values)
plt.xlabel("Values")
plt.ylabel("Categories")
plt.title("Horizontal Bar Chart")
plt.show()
```

### 饼图

```python
sizes = [30, 20, 25, 15, 10]
labels = ["A", "B", "C", "D", "E"]
colors = ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99", "#d9d9d9"]

plt.figure(figsize=(8, 8))
plt.pie(sizes, labels=labels, colors=colors, autopct="%1.1f%%")
plt.title("Pie Chart")
plt.show()
```

## Seaborn

### 统计图表

```python
import seaborn as sns
import pandas as pd
import numpy as np

# 创建示例数据
df = pd.DataFrame({
    "category": np.random.choice(["A", "B", "C"], 100),
    "value": np.random.randn(100),
    "group": np.random.choice(["X", "Y"], 100)
})

# 分布图
sns.histplot(df["value"], kde=True)
plt.title("Distribution with KDE")
plt.show()

# 箱线图
sns.boxplot(x="category", y="value", data=df)
plt.title("Box Plot")
plt.show()

# 小提琴图
sns.violinplot(x="category", y="value", data=df)
plt.title("Violin Plot")
plt.show()
```

### 关系图

```python
# 散点图
tips = sns.load_dataset("tips")
sns.scatterplot(x="total_bill", y="tip", data=tips, hue="sex")
plt.title("Scatter Plot with Hue")
plt.show()

# 回归图
sns.regplot(x="total_bill", y="tip", data=tips)
plt.title("Regression Plot")
plt.show()

# 热力图
flights = sns.load_dataset("flights")
flights_pivot = flights.pivot("month", "year", "passengers")
sns.heatmap(flights_pivot)
plt.title("Heatmap")
plt.show()
```

### 分类图

```python
# 柱状图
sns.barplot(x="day", y="total_bill", data=tips)
plt.title("Bar Plot")
plt.show()

# 点图
sns.stripplot(x="day", y="total_bill", data=tips)
plt.title("Strip Plot")
plt.show()

# 箱线图
sns.boxplot(x="day", y="total_bill", data=tips)
plt.title("Box Plot")
plt.show()
```

## Plotly

### 交互式图表

```python
import plotly.graph_objects as go
import plotly.express as px

# 折线图
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=[1, 2, 3, 4],
    y=[10, 15, 13, 17],
    mode="lines",
    name="Line"
))
fig.update_layout(title="Interactive Line Plot")
fig.show()

# 散点图
df = px.data.iris()
fig = px.scatter(
    df, x="sepal_width", y="sepal_length",
    color="species", title="Scatter Plot"
)
fig.show()
```

### 3D 图表

```python
import numpy as np

# 3D 曲面图
x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

fig = go.Figure(data=[go.Surface(z=Z, x=X, y=Y)])
fig.update_layout(title="3D Surface Plot")
fig.show()
```

### 动画图表

```python
import plotly.graph_objects as go
import numpy as np

# 创建动画
frames = []
for i in range(10):
    x = np.linspace(0, 2*np.pi, 100)
    y = np.sin(x + i*0.1)
    frames.append(go.Scatter(x=x, y=y, mode="lines"))

fig = go.Figure(
    data=frames[0],
    frames=frames
)
fig.update_layout(title="Animated Sine Wave")
fig.show()
```

## Bokeh

### 基础图表

```python
from bokeh.plotting import figure, show
from bokeh.models import ColumnDataSource
import numpy as np

# 创建数据
x = np.linspace(0, 10, 100)
y = np.sin(x)

# 创建图表
p = figure(title="Sine Wave", x_axis_label="x", y_axis_label="sin(x)")
p.line(x, y, legend_label="sin(x)", line_width=2)
p.circle(x, y, size=5, color="red", alpha=0.5)
show(p)
```

### 交互式仪表板

```python
from bokeh.layouts import column
from bokeh.models import Slider

# 创建图表
p = figure(title="Interactive Plot", tools="pan,box_zoom,reset")
p.line(x, y, line_width=2)

# 添加滑块
slider = Slider(start=0, end=10, value=1, step=0.1, title="Frequency")

# 布局
layout = column(p, slider)
show(layout)
```

## Altair

### 声明式可视化

```python
import altair as alt
import pandas as pd

# 创建数据
df = pd.DataFrame({
    "x": range(10),
    "y": [i**2 for i in range(10)]
})

# 折线图
chart = alt.Chart(df).mark_line().encode(
    x="x",
    y="y"
).properties(
    width=600,
    height=400
)
chart.show()

# 散点图
chart = alt.Chart(df).mark_circle(size=60).encode(
    x="x",
    y="y",
    color="x",
    tooltip=["x", "y"]
).interactive()
chart.show()
```

### 组合图表

```python
# 创建基础图表
base = alt.Chart(df).encode(x="x")

# 折线 + 点
line = base.mark_line().encode(y="y")
points = base.mark_circle().encode(y="y")

# 组合
chart = line + points
chart.show()
```

## 可视化最佳实践

::: tip 图表选择指南

| 数据类型 | 推荐图表 |
|----------|----------|
| 趋势变化 | 折线图 |
| 分类比较 | 柱状图 |
| 占比关系 | 饼图 |
| 分布情况 | 直方图、箱线图 |
| 相关关系 | 散点图 |
| 时间序列 | 时间线图 |
| 地理数据 | 地图 |

::: tip 设计原则

1. **简洁清晰**：避免不必要的装饰
2. **颜色选择**：使用色盲友好的调色板
3. **标签完整**：清晰的标题和轴标签
4. **数据墨水比**：最大化数据/墨水比例
5. **交互设计**：突出重要信息

::: tip 配色方案

```python
# 色盲友好调色板
colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]

# 颜色渐变
cmap = "viridis"  # 或 "plasma", "inferno", "magma"

# 单色渐变
sns.set_palette("husl")
```

::: tip 图表美化

```python
# 设置样式
plt.style.use("seaborn-v0_8-darkgrid")

# 自定义样式
plt.rcParams.update({
    "figure.figsize": (12, 6),
    "font.size": 12,
    "axes.labelsize": 14,
    "axes.titlesize": 16,
    "xtick.labelsize": 12,
    "ytick.labelsize": 12,
    "legend.fontsize": 12
})
```

::: tip 保存图表

```python
# 保存为图片
plt.savefig("plot.png", dpi=300, bbox_inches="tight")

# 保存为 PDF
plt.savefig("plot.pdf")

# 保存为 SVG
plt.savefig("plot.svg")
```
