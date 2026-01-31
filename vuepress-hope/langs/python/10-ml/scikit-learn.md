---
title: Scikit-Learn
icon: simple:scikitlearn
order: 1
---

# Scikit-Learn

Scikit-Learn 是 Python 最流行的机器学习库，提供完整的机器学习工具链。

## 数据准备

### 训练测试分割

```python
from sklearn.model_selection import train_test_split

# 基本分割
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 分层分割（保持类别比例）
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
```

### 数据预处理

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

# 标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 归一化
normalizer = MinMaxScaler()
X_normalized = normalizer.fit_transform(X)

# 列转换器
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_columns),
        ("cat", OneHotEncoder(), categorical_columns)
    ]
)
```

### 特征选择

```python
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.feature_selection import RFE
from sklearn.ensemble import RandomForestClassifier

# 选择最好的 k 个特征
selector = SelectKBest(f_classif, k=5)
X_new = selector.fit_transform(X, y)

# 递归特征消除
model = RandomForestClassifier()
rfe = RFE(model, n_features_to_select=5)
X_new = rfe.fit_transform(X, y)
```

## 监督学习

### 分类算法

```python
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# 逻辑回归
model = LogisticRegression()
model.fit(X_train, y_train)

# 支持向量机
model = SVC(kernel="rbf")
model.fit(X_train, y_train)

# K 近邻
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

# 决策树
model = DecisionTreeClassifier(max_depth=3)
model.fit(X_train, y_train)

# 随机森林
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)
```

### 回归算法

```python
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor

# 线性回归
model = LinearRegression()
model.fit(X_train, y_train)

# 支持向量回归
model = SVR(kernel="rbf")
model.fit(X_train, y_train)

# 随机森林回归
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)
```

## 无监督学习

### 聚类

```python
from sklearn.cluster import KMeans, DBSCAN
from sklearn.cluster import AgglomerativeClustering

# K 均值
kmeans = KMeans(n_clusters=3)
clusters = kmeans.fit_predict(X)

# DBSCAN
dbscan = DBSCAN(eps=0.5, min_samples=5)
clusters = dbscan.fit_predict(X)

# 层次聚类
agg = AgglomerativeClustering(n_clusters=3)
clusters = agg.fit_predict(X)
```

### 降维

```python
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

# 主成分分析
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# t-SNE
tsne = TSNE(n_components=2, perplexity=30)
X_tsne = tsne.fit_transform(X)
```

## 模型评估

### 交叉验证

```python
from sklearn.model_selection import cross_val_score

# K 折交叉验证
scores = cross_val_score(model, X, y, cv=5)
print(f"Accuracy: {scores.mean():.3f} (+/- {scores.std():.3f})")

# 分层 K 折
from sklearn.model_selection import StratifiedKFold
skf = StratifiedKFold(n_splits=5)
scores = cross_val_score(model, X, y, cv=skf)
```

### 评估指标

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)
from sklearn.metrics import mean_squared_error, r2_score

# 分类指标
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average="weighted")
recall = recall_score(y_test, y_pred, average="weighted")
f1 = f1_score(y_test, y_pred, average="weighted")

# 混淆矩阵
cm = confusion_matrix(y_test, y_pred)

# 分类报告
report = classification_report(y_test, y_pred)

# 回归指标
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
```

### 超参数调优

```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

# 网格搜索
param_grid = {
    "n_estimators": [50, 100, 200],
    "max_depth": [3, 5, 7, None],
    "min_samples_split": [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(),
    param_grid,
    cv=5,
    scoring="accuracy"
)
grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_
best_params = grid_search.best_params_

# 随机搜索
from scipy.stats import randint

param_distributions = {
    "n_estimators": randint(50, 200),
    "max_depth": randint(3, 10),
    "min_samples_split": randint(2, 11)
}

random_search = RandomizedSearchCV(
    RandomForestClassifier(),
    param_distributions,
    n_iter=50,
    cv=5,
    scoring="accuracy"
)
random_search.fit(X_train, y_train)
```

## 流水线

### Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

# 创建流水线
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("svm", SVC(kernel="rbf"))
])

# 训练
pipeline.fit(X_train, y_train)

# 预测
y_pred = pipeline.predict(X_test)
```

### GridSearchCV + Pipeline

```python
# 在流水线上使用网格搜索
param_grid = {
    "svm__C": [0.1, 1, 10],
    "svm__gamma": ["scale", "auto"]
}

grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5
)
grid_search.fit(X_train, y_train)
```

## Scikit-Learn 最佳实践

::: tip 机器学习流程

1. **探索数据**：理解数据分布和特征
2. **预处理**：标准化、编码、缺失值处理
3. **特征工程**：创建和选择有用特征
4. **模型选择**：尝试多种算法
5. **超参数调优**：优化模型性能
6. **模型评估**：交叉验证和测试集评估

::: tip 常见错误

```python
# ❌ 数据泄露
# 在分割前对整个数据集标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # 错误
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)

# ✅ 正确做法
X_train, X_test, y_train, y_test = train_test_split(X, y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ❌ 忘记随机种子
X_train, X_test, y_train, y_test = train_test_split(X, y)

# ✅ 固定随机种子
X_train, X_test, y_train, y_test = train_test_split(
    X, y, random_state=42
)
```

::: tip 模型保存

```python
import joblib

# 保存模型
joblib.dump(model, "model.pkl")

# 加载模型
loaded_model = joblib.load("model.pkl")

# 保存完整流水线
joblib.dump(pipeline, "pipeline.pkl")
```
