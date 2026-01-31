---
title: ML Pipeline
icon: simple:circleci
order: 4
---

# ML Pipeline

机器学习流水线将数据预处理、模型训练、评估和部署整合为完整的自动化流程。

## 流水线组件

### Pipeline 基础

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC

# 创建流水线
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=0.95)),
    ('svm', SVC(kernel='rbf'))
])

# 训练
pipeline.fit(X_train, y_train)

# 预测
y_pred = pipeline.predict(X_test)

# 评估
accuracy = pipeline.score(X_test, y_test)
```

### FeatureUnion

```python
from sklearn.pipeline import FeatureUnion
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest

# 并行特征处理
combined_features = FeatureUnion([
    ('pca', PCA(n_components=5)),
    ('kbest', SelectKBest(k=5))
])

# 在流水线中使用
pipeline = Pipeline([
    ('features', combined_features),
    ('svm', SVC(kernel='rbf'))
])
```

### 自定义转换器

```python
from sklearn.base import BaseEstimator, TransformerMixin

class CustomTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, param1=1):
        self.param1 = param1

    def fit(self, X, y=None):
        # 学习参数
        self.mean_ = X.mean(axis=0)
        return self

    def transform(self, X):
        # 转换数据
        return X - self.mean_

# 使用
pipeline = Pipeline([
    ('custom', CustomTransformer(param1=2)),
    ('scaler', StandardScaler()),
    ('model', SomeModel())
])
```

## 数据预处理流水线

### 数值和分类特征

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import pandas as pd

# 定义特征类型
numeric_features = ['age', 'income']
categorical_features = ['city', 'gender']

# 创建转换器
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(), categorical_features)
    ]
)

# 完整流水线
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier())
])

# 训练
pipeline.fit(X_train, y_train)
```

### 缺失值处理

```python
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# 数值特征
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 分类特征
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# 组合
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)
```

### 文本特征流水线

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer

# 文本转换器
text_transformer = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=1000))
])

# 多模态特征
preprocessor = ColumnTransformer(
    transformers=[
        ('text', text_transformer, 'text_column'),
        ('num', StandardScaler(), numeric_features)
    ]
)

# 完整流水线
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression())
])
```

## 模型选择流水线

### GridSearchCV 与 Pipeline

```python
from sklearn.model_selection import GridSearchCV

# 定义参数网格
param_grid = {
    'preprocessor__num__imputer__strategy': ['mean', 'median'],
    'classifier__n_estimators': [100, 200],
    'classifier__max_depth': [3, 5, 7]
}

# 网格搜索
grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

# 最佳参数
print(grid_search.best_params_)
print(grid_search.best_score_)

# 最佳模型
best_model = grid_search.best_estimator_
```

### 多模型比较

```python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC

# 定义多个模型
models = {
    'lr': Pipeline([
        ('preprocessor', preprocessor),
        ('clf', LogisticRegression())
    ]),
    'rf': Pipeline([
        ('preprocessor', preprocessor),
        ('clf', RandomForestClassifier())
    ]),
    'gb': Pipeline([
        ('preprocessor', preprocessor),
        ('clf', GradientBoostingClassifier())
    ])
}

# 比较模型
for name, model in models.items():
    scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f'{name}: {scores.mean():.3f} (+/- {scores.std():.3f})')
```

## MLflow 实验追踪

### 安装和初始化

```python
# 安装
# pip install mlflow

import mlflow
import mlflow.sklearn

# 启动 UI
# mlflow ui

# 设置跟踪 URI
mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("my_experiment")
```

### 记录实验

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

with mlflow.start_run():
    # 设置参数
    n_estimators = 100
    max_depth = 5

    # 记录参数
    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_depth", max_depth)

    # 训练模型
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth
    )
    model.fit(X_train, y_train)

    # 预测
    y_pred = model.predict(X_test)

    # 计算指标
    accuracy = accuracy_score(y_test, y_pred)

    # 记录指标
    mlflow.log_metric("accuracy", accuracy)

    # 记录模型
    mlflow.sklearn.log_model(model, "model")

    # 记录文件
    mlflow.log_artifact("preprocessing_pipeline.pkl")
```

### 自动记录

```python
# 自动记录参数、指标和模型
mlflow.sklearn.autolog()

# 训练模型
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 评估
predictions = model.predict(X_test)
mlflow.end_run()
```

## 模型部署

### 保存模型

```python
import joblib
import pickle

# 使用 joblib
joblib.dump(pipeline, 'model.joblib')

# 使用 pickle
with open('model.pkl', 'wb') as f:
    pickle.dump(pipeline, f)

# MLflow 格式
mlflow.sklearn.save_model(pipeline, "model_path")
```

### 加载和预测

```python
# 加载模型
loaded_pipeline = joblib.load('model.joblib')

# 单个预测
single_prediction = loaded_pipeline.predict([[5.1, 3.5, 1.4, 0.2]])

# 批量预测
batch_predictions = loaded_pipeline.predict(X_new)
```

### FastAPI 部署

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# 加载模型
model = joblib.load('model.joblib')

# 定义输入数据模型
class InputData(BaseModel):
    feature1: float
    feature2: float
    feature3: float
    feature4: float

@app.post("/predict")
def predict(data: InputData):
    try:
        # 转换输入
        features = np.array([[
            data.feature1,
            data.feature2,
            data.feature3,
            data.feature4
        ]])

        # 预测
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]

        return {
            "prediction": int(prediction),
            "probability": probability.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
def root():
    return {"message": "ML Model API"}
```

### Docker 容器化

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY model.joblib .
COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 模型监控

### 性能监控

```python
import mlflow

# 加载生产模型
model = mlflow.sklearn.load_model("models:/production/model")

# 记录生产指标
with mlflow.start_run():
    # 获取真实标签和预测
    y_true = get_true_labels()
    y_pred = model.predict(X)

    # 计算指标
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='weighted')

    # 记录
    mlflow.log_metric("prod_accuracy", accuracy)
    mlflow.log_metric("prod_precision", precision)
```

### 数据漂移检测

```python
from alibi_detect import CategoricalDrift
from alibi_detect.datasets import fetch_mnist

# 训练数据
X_train = fetch_mnist()['X_train']

# 创建漂移检测器
cd = CategoricalDrift(
    X_train,
    p_val=0.05
)

# 检测新数据
X_new = get_new_data()
pred = cd.predict(X_new)

if pred['data']['is_drift']:
    print("检测到数据漂移！")
    # 重新训练模型
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline

on: [push]

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Run tests
        run: |
          pytest tests/

      - name: Train model
        run: |
          python train.py

      - name: Log model
        run: |
          python log_model.py
```

## ML Pipeline 最佳实践

::: tip 流水线设计原则

1. **模块化**：每个组件独立可测试
2. **可重现性**：固定随机种子，记录所有参数
3. **版本控制**：代码、数据、模型都需要版本控制
4. **自动化**：尽可能自动化整个流程
5. **监控**：持续监控模型性能

::: tip 数据管理

```python
# 数据版本控制
import dvc.api

# 加载特定版本数据
data = dvc.api.read(
    'data/train.csv',
    repo='https://github.com/user/repo',
    rev='v1.0'
)

# 数据集信息
mlflow.log_dataset(
    features=X_train,
    target=y_train,
    context="training"
)
```

::: tip 模型注册

```python
# 注册模型
mlflow.sklearn.log_model(
    model,
    "model",
    registered_model_name="ProductionModel"
)

# 过渡模型阶段
client = mlflow.tracking.MlflowClient()
client.transition_model_version_stage(
    name="ProductionModel",
    version=1,
    stage="Production"
)
```

::: tip 批量预测

```python
# 大数据批量预测
import pandas as pd

def batch_predict(model, data_path, batch_size=1000):
    results = []
    for chunk in pd.read_csv(data_path, chunksize=batch_size):
        predictions = model.predict(chunk)
        results.extend(predictions)
    return results

# 使用
predictions = batch_predict(model, 'new_data.csv')
```

::: tip A/B 测试

```python
# 模型 A/B 测试
model_a = load_model('model_v1.joblib')
model_b = load_model('model_v2.joblib')

# 分流
def ab_predict(data, model_a, model_b, traffic_ratio=0.5):
    if random.random() < traffic_ratio:
        return model_a.predict(data), 'A'
    else:
        return model_b.predict(data), 'B'

# 收集指标
for data in test_data:
    pred, version = ab_predict(data, model_a, model_b)
    log_prediction(data, pred, version)
```
