---
title: PyTorch
icon: simple:pytorch
order: 2
---

# PyTorch

PyTorch 是 Facebook 开发的深度学习框架，提供灵活的动态计算图和强大的 GPU 支持。

## 张量基础

### 创建张量

```python
import torch
import numpy as np

# 从列表创建
tensor = torch.tensor([1, 2, 3, 4])

# 从 NumPy 创建
arr = np.array([1, 2, 3, 4])
tensor = torch.from_numpy(arr)

# 特定形状
zeros = torch.zeros(3, 4)
ones = torch.ones(3, 4)
random_tensor = torch.randn(3, 4)

# 特定类型
tensor = torch.tensor([1.0, 2.0, 3.0], dtype=torch.float64)
```

### 张量操作

```python
# 基本运算
a = torch.tensor([1, 2, 3])
b = torch.tensor([4, 5, 6])

print(a + b)   # [5 7 9]
print(a * b)   # [4 10 18]
print(a @ b)   # 32 (点积)

# 形状操作
x = torch.randn(2, 3)
print(x.shape)           # torch.Size([2, 3])
print(x.view(3, 2))       # 重塑
print(x.permute(1, 0))    # 转置

# 拼接
a = torch.randn(2, 3)
b = torch.randn(2, 3)
catted = torch.cat([a, b], dim=0)  # 按行拼接
```

### GPU 张量

```python
# 检查 CUDA 可用
print(torch.cuda.is_available())

# 移动到 GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tensor = tensor.to(device)

# 创建 GPU 张量
if torch.cuda.is_available():
    tensor = torch.randn(3, 3).cuda()

# 多 GPU
if torch.cuda.device_count() > 1:
    model = torch.nn.DataParallel(model)
```

## 神经网络

### 定义网络

```python
import torch.nn as nn
import torch.nn.functional as F

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 卷积层
        self.conv1 = nn.Conv2d(1, 32, 3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        # 全连接层
        self.fc1 = nn.Linear(64 * 8 * 8, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        # 卷积 + 池化 + ReLU
        x = F.max_pool2d(F.relu(self.conv1(x)), 2)
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)
        # 展平
        x = x.view(-1, 64 * 8 * 8)
        # 全连接 + ReLU
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = Net()
```

### 常用层

```python
# 卷积层
conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3, padding=1)

# 池化层
pool = nn.MaxPool2d(kernel_size=2, stride=2)
avg_pool = nn.AvgPool2d(kernel_size=2, stride=2)

# 批归一化
bn = nn.BatchNorm2d(64)

# Dropout
dropout = nn.Dropout(p=0.5)

# 全连接层
linear = nn.Linear(128, 10)

# 循环层
lstm = nn.LSTM(input_size=64, hidden_size=128, num_layers=2)
gru = nn.GRU(input_size=64, hidden_size=128, num_layers=2)
```

## 损失函数

```python
import torch.nn as nn

# 分类损失
criterion = nn.CrossEntropyLoss()

# 回归损失
criterion = nn.MSELoss()

# 二分类损失
criterion = nn.BCEWithLogitsLoss()

# 使用
output = model(input)
loss = criterion(output, target)
```

## 优化器

```python
import torch.optim as optim

# SGD
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Adam
optimizer = optim.Adam(model.parameters(), lr=0.001)

# RMSprop
optimizer = optim.RMSprop(model.parameters(), lr=0.001)

# 学习率调度
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, "min")
```

## 训练循环

### 基本训练

```python
import torch
from torch.utils.data import DataLoader

# 数据
train_loader = DataLoader(dataset, batch_size=32, shuffle=True)

# 模型、损失、优化器
model = Net()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 训练
num_epochs = 10
model.train()

for epoch in range(num_epochs):
    for batch_idx, (data, target) in enumerate(train_loader):
        # 前向传播
        output = model(data)
        loss = criterion(output, target)

        # 反向传播
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if batch_idx % 100 == 0:
            print(f"Epoch {epoch}, Batch {batch_idx}, Loss: {loss.item():.4f}")
```

### 评估模型

```python
model.eval()  # 设置为评估模式

test_loss = 0
correct = 0
with torch.no_grad():  # 不计算梯度
    for data, target in test_loader:
        output = model(data)
        test_loss += criterion(output, target).item()
        pred = output.argmax(dim=1, keepdim=True)
        correct += pred.eq(target.view_as(pred)).sum().item()

test_loss /= len(test_loader.dataset)
accuracy = correct / len(test_loader.dataset)

print(f"Test Loss: {test_loss:.4f}, Accuracy: {accuracy:.4f}")
```

## 数据加载

### Dataset 和 DataLoader

```python
from torch.utils.data import Dataset, DataLoader

class CustomDataset(Dataset):
    def __init__(self, data, labels):
        self.data = data
        self.labels = labels

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        x = self.data[idx]
        y = self.labels[idx]
        return x, y

# 数据集
dataset = CustomDataset(data, labels)

# 数据加载器
dataloader = DataLoader(
    dataset,
    batch_size=32,
    shuffle=True,
    num_workers=4
)
```

### 数据变换

```python
from torchvision import transforms

# 图像变换
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# 应用到数据集
from torchvision.datasets import ImageFolder
dataset = ImageFolder("data/", transform=transform)
```

## 模型保存与加载

### 保存模型

```python
# 保存整个模型
torch.save(model, "model.pth")

# 保存模型参数
torch.save(model.state_dict(), "model_weights.pth")

# 保存检查点
torch.save({
    "epoch": epoch,
    "model_state_dict": model.state_dict(),
    "optimizer_state_dict": optimizer.state_dict(),
    "loss": loss,
}, "checkpoint.pth")
```

### 加载模型

```python
# 加载整个模型
model = torch.load("model.pth")

# 加载模型参数
model = Net()
model.load_state_dict(torch.load("model_weights.pth"))

# 加载检查点
checkpoint = torch.load("checkpoint.pth")
model.load_state_dict(checkpoint["model_state_dict"])
optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
epoch = checkpoint["epoch"]
loss = checkpoint["loss"]
```

## PyTorch 最佳实践

::: tip PyTorch 建议

1. **使用 DataLoader**：高效批量加载数据
2. **GPU 加速**：充分利用 GPU 并行
3. **梯度裁剪**：防止梯度爆炸
4. **早停**：防止过拟合
5. **混合精度**：使用 FP16 加速训练

::: tip 性能优化

```python
# 混合精度训练
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

for data, target in train_loader:
    optimizer.zero_grad()

    with autocast():
        output = model(data)
        loss = criterion(output, target)

    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

::: tip 调试技巧

```python
# 梯度检查
for name, param in model.named_parameters():
    if param.grad is not None:
        print(f"{name}: grad norm {param.grad.norm()}")

# 检查模型参数
for name, param in model.named_parameters():
    print(f"{name}: {param.data.mean()}")

# 可视化计算图
from torchviz import make_dot
make_dot(output, params=dict(list(model.named_parameters()))).render("model.gv", view=False)
```

::: tip 常见问题

```python
# GPU 内存不足
torch.cuda.empty_cache()  # 清空缓存

# 梯度爆炸
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

# 学习率衰减
scheduler = optim.lr_scheduler.ExponentialLR(optimizer, gamma=0.95)
```
