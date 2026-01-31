---
title: TensorFlow
icon: simple:tensorflow
order: 3
---

# TensorFlow

TensorFlow 是 Google 开发的开源深度学习框架，提供完整的机器学习工具链。

## 安装和基础

### 安装

```python
# CPU 版本
pip install tensorflow

# GPU 版本 (CUDA)
pip install tensorflow[and-cuda]

# 验证安装
import tensorflow as tf
print(tf.__version__)  # 显示版本号
print(tf.config.list_physical_devices())  # 显示可用设备
```

### 张量基础

```python
import tensorflow as tf

# 创建张量
scalar = tf.constant(42)
vector = tf.constant([1, 2, 3, 4])
matrix = tf.constant([[1, 2], [3, 4]])

# 从 NumPy 创建
import numpy as np
arr = np.array([1, 2, 3])
tensor = tf.constant(arr)

# 特殊张量
zeros = tf.zeros([3, 4])
ones = tf.ones([3, 4])
random = tf.random.normal([3, 4])

# 张量信息
print(tensor.shape)      # 形状
print(tensor.dtype)      # 数据类型
print(tensor.ndim)       # 维度
```

### 张量操作

```python
# 基本运算
a = tf.constant([1, 2, 3])
b = tf.constant([4, 5, 6])

print(a + b)      # 加法
print(a * b)      # 乘法
print(tf.matmul(a, b))  # 矩阵乘法

# 形状操作
x = tf.random.normal([2, 3])
print(tf.reshape(x, [3, 2]))      # 重塑
print(tf.transpose(x))             # 转置
print(tf.expand_dims(x, axis=0))   # 增加维度

# 数学运算
x = tf.constant([1.0, 2.0, 3.0])
print(tf.reduce_mean(x))  # 平均值
print(tf.reduce_sum(x))   # 求和
print(tf.math.sqrt(x))    # 平方根
```

## Keras API

### Sequential 模型

```python
from tensorflow import keras
from tensorflow.keras import layers

# 创建模型
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(10,)),
    layers.Dropout(0.2),
    layers.Dense(32, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

# 查看模型结构
model.summary()

# 逐步添加
model = keras.Sequential()
model.add(layers.Dense(64, activation='relu', input_shape=(10,)))
model.add(layers.Dropout(0.2))
model.add(layers.Dense(1))
```

### 函数式 API

```python
# 创建输入
inputs = keras.Input(shape=(10,))

# 隐藏层
x = layers.Dense(64, activation='relu')(inputs)
x = layers.Dropout(0.2)(x)
x = layers.Dense(32, activation='relu')(x)

# 输出层
outputs = layers.Dense(1, activation='sigmoid')(x)

# 创建模型
model = keras.Model(inputs=inputs, outputs=outputs)
model.summary()
```

### 模型子类化

```python
class MyModel(keras.Model):
    def __init__(self):
        super(MyModel, self).__init__()
        self.dense1 = layers.Dense(64, activation='relu')
        self.dropout = layers.Dropout(0.2)
        self.dense2 = layers.Dense(32, activation='relu')
        self.dense3 = layers.Dense(1, activation='sigmoid')

    def call(self, inputs, training=False):
        x = self.dense1(inputs)
        x = self.dropout(x, training=training)
        x = self.dense2(x)
        return self.dense3(x)

# 创建模型
model = MyModel()
```

## 常用层

### 核心层

```python
from tensorflow.keras import layers

# 全连接层
dense = layers.Dense(128, activation='relu')

# 激活层
activation = layers.Activation('relu')

# Dropout
dropout = layers.Dropout(0.5)

# 批归一化
bn = layers.BatchNormalization()

# 输入层
input_layer = layers.Input(shape=(28, 28, 1))
```

### 卷积层

```python
# 2D 卷积
conv = layers.Conv2D(
    filters=32,
    kernel_size=(3, 3),
    strides=(1, 1),
    padding='same',
    activation='relu'
)

# 池化层
maxpool = layers.MaxPooling2D(pool_size=(2, 2))
avgpool = layers.AveragePooling2D(pool_size=(2, 2))

# 转置卷积
conv_transpose = layers.Conv2DTranspose(
    filters=64,
    kernel_size=(3, 3),
    strides=(2, 2),
    padding='same'
)
```

### 循环层

```python
# LSTM
lstm = layers.LSTM(
    units=128,
    return_sequences=True,
    return_state=True
)

# GRU
gru = layers.GRU(64, return_sequences=True)

# 双向 RNN
bidirectional = layers.Bidirectional(layers.LSTM(64))
```

## 损失函数

```python
from tensorflow.keras import losses

# 分类损失
binary_crossentropy = losses.BinaryCrossentropy()
categorical_crossentropy = losses.CategoricalCrossentropy()
sparse_categorical_crossentropy = losses.SparseCategoricalCrossentropy()

# 回归损失
mse = losses.MeanSquaredError()
mae = losses.MeanAbsoluteError()
huber = losses.Huber()

# 自定义损失
def custom_loss(y_true, y_pred):
    return tf.reduce_mean(tf.square(y_true - y_pred))

# 使用
model.compile(optimizer='adam', loss='mse', metrics=['mae'])
```

## 优化器

```python
from tensorflow.keras import optimizers

# SGD
sgd = optimizers.SGD(learning_rate=0.01, momentum=0.9)

# Adam
adam = optimizers.Adam(learning_rate=0.001)

# RMSprop
rmsprop = optimizers.RMSprop(learning_rate=0.001)

# AdamW
adamw = optimizers.AdamW(learning_rate=0.001, weight_decay=0.004)

# 学习率调度
lr_schedule = optimizers.schedules.ExponentialDecay(
    initial_learning_rate=1e-2,
    decay_steps=10000,
    decay_rate=0.9
)
optimizer = optimizers.Adam(learning_rate=lr_schedule)
```

## 训练模型

### 基本训练

```python
# 编译模型
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# 训练
history = model.fit(
    x_train, y_train,
    batch_size=32,
    epochs=10,
    validation_split=0.2,
    verbose=1
)

# 评估
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f'Test accuracy: {test_acc:.4f}')

# 预测
predictions = model.predict(x_test)
```

### 回调函数

```python
from tensorflow.keras import callbacks

# 早停
early_stopping = callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

# 模型检查点
checkpoint = callbacks.ModelCheckpoint(
    'best_model.h5',
    monitor='val_accuracy',
    save_best_only=True,
    mode='max'
)

# 学习率衰减
reduce_lr = callbacks.ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.2,
    patience=5,
    min_lr=1e-6
)

# TensorBoard
tensorboard = callbacks.TensorBoard(
    log_dir='./logs',
    histogram_freq=1
)

# 使用回调
history = model.fit(
    x_train, y_train,
    epochs=100,
    validation_split=0.2,
    callbacks=[early_stopping, checkpoint, reduce_lr, tensorboard]
)
```

### 自定义训练循环

```python
# 定义优化器和损失
optimizer = optimizers.Adam()
loss_fn = losses.MeanSquaredError()

# 训练步骤
@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        logits = model(x, training=True)
        loss_value = loss_fn(y, logits)

    grads = tape.gradient(loss_value, model.trainable_weights)
    optimizer.apply_gradients(zip(grads, model.trainable_weights))
    return loss_value

# 训练循环
for epoch in range(epochs):
    for step, (x_batch, y_batch) in enumerate(dataset):
        loss_value = train_step(x_batch, y_batch)

    print(f'Epoch {epoch}: Loss = {loss_value:.4f}')
```

## 数据处理

### Dataset API

```python
# 创建 Dataset
dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train))

# 批处理和打乱
dataset = dataset.shuffle(buffer_size=1024)
dataset = dataset.batch(32)
dataset = dataset.prefetch(tf.data.AUTOTUNE)

# 数据映射
def augment(x, y):
    x = tf.image.random_flip_left_right(x)
    x = tf.image.random_brightness(x, max_delta=0.1)
    return x, y

dataset = dataset.map(augment, num_parallel_calls=tf.data.AUTOTUNE)

# 迭代
for x_batch, y_batch in dataset:
    predictions = model(x_batch)
```

### 图像预处理

```python
from tensorflow.keras import layers

# 数据增强
data_augmentation = keras.Sequential([
    layers.RandomFlip('horizontal'),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
    layers.RandomContrast(0.1)
])

# 预处理
inputs = keras.Input(shape=(224, 224, 3))
x = data_augmentation(inputs)
x = layers.Rescaling(1./255)(x)

# 或使用预处理层
preprocess = layers.Rescaling(1./127.5, offset=-1)
x = preprocess(inputs)
```

### 文本预处理

```python
from tensorflow.keras.layers import TextVectorization

# 准备数据
texts = ['hello world', 'foo bar', 'test sentence']

# 创建向量化器
vectorizer = TextVectorization(
    max_tokens=1000,
    output_mode='int',
    output_sequence_length=10
)

# 适应数据
vectorizer.adapt(texts)

# 使用
vectorized_text = vectorizer(['hello world', 'foo bar'])
```

## 模型保存

### 保存完整模型

```python
# 保存为 Keras 格式
model.save('my_model.keras')

# 保存为 HDF5 格式
model.save('my_model.h5')

# 加载模型
loaded_model = keras.models.load_model('my_model.keras')
```

### 只保存权重

```python
# 保存权重
model.save_weights('model_weights.weights.h5')

# 加载权重（需要先创建模型结构）
model = create_model()
model.load_weights('model_weights.weights.h5')
```

### 保存为 SavedModel 格式

```python
# 导出为 SavedModel
tf.saved_model.save(model, 'saved_model/1')

# 加载
loaded = tf.saved_model.load('saved_model/1')
```

## TensorFlow Hub

```python
import tensorflow_hub as hub

# 加载预训练模型
hub_model = hub.KerasLayer(
    'https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/2',
    input_shape=(224, 224, 3),
    trainable=False
)

# 使用预训练层
model = keras.Sequential([
    hub_model,
    layers.Dense(128, activation='relu'),
    layers.Dense(num_classes, activation='softmax')
])
```

## TensorFlow 最佳实践

::: tip TensorFlow 建议

1. **使用 Keras API**：优先使用高层 Keras API
2. **启用混合精度**：使用 FP16 加速训练
3. **使用 Dataset API**：高效数据加载
4. **合理使用 GPU**：分布式训练和混合精度
5. **监控训练**：使用 TensorBoard

::: tip 性能优化

```python
# 混合精度训练
from tensorflow.keras import mixed_precision

# 设置策略
policy = mixed_precision.Policy('mixed_float16')
mixed_precision.set_global_policy(policy)

# 编译时使用损失缩放
optimizer = mixed_precision.LossScaleOptimizer(optimizer)
model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])
```

::: tip 分布式训练

```python
# MirroredStrategy (单机多卡)
strategy = tf.distribute.MirroredStrategy()

with strategy.scope():
    model = create_model()
    model.compile(optimizer='adam', loss='mse')

# MultiWorkerMirroredStrategy (多机)
strategy = tf.distribute.MultiWorkerMirroredStrategy()

# TPUStrategy (TPU)
strategy = tf.distribute.TPUStrategy()
```

::: tip 调试技巧

```python
# 检查 GPU 可用性
print(tf.config.list_physical_devices('GPU'))

# 设置 GPU 内存增长
gpus = tf.config.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

# Eager 执行调试
tf.config.run_functions_eagerly(True)

# 打印张量值
tf.debugging.enable_check_numerics()
```

::: tip 常见问题

```python
# GPU 内存不足
# 解决：减小 batch_size 或使用梯度累积

# NaN 损失
# 解决：降低学习率、检查数据、使用梯度裁剪
tf.clip_by_global_norm(gradients, clip_norm=1.0)

# 过拟合
# 解决：添加 Dropout、数据增强、正则化
layers.Dense(64, activation='relu', kernel_regularizer=regularizers.l2(0.01))
```
