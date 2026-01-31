---
title: std::deque
icon: devicon-plain:cplusplus
order: 2
category: STL
tag: 容器
description: C++ STL std::deque 双端队列容器速查文档
---

# std::deque

`std::deque`（double-ended queue）是**双端队列**容器，支持在两端快速插入和删除元素。

::: tip 核心特点
- **双端操作**：头部和尾部插入删除都是 O(1)
- **随机访问**：支持通过下标 O(1) 访问任意元素
- **非连续存储**：内部由多个固定大小缓冲区组成
- **动态大小**：自动管理内存，无需手动分配
:::

## 头文件

```cpp
#include <deque>
```

## 声明与初始化

```cpp
// 默认构造空 deque
std::deque<int> d1;

// 指定大小，值初始化为 0
std::deque<int> d2(10);

// 指定大小和初始值
std::deque<int> d3(10, 5);  // 10 个元素，值都为 5

// 使用初始化列表
std::deque<int> d4 = {1, 2, 3, 4, 5};

// 拷贝构造
std::deque<int> d5(d4);

// 使用迭代器范围构造
std::deque<int> d6(d4.begin(), d4.end());
```

## 常用操作

### 元素访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `d[i]` | 访问第 i 个元素（不检查边界） | O(1) |
| `d.at(i)` | 访问第 i 个元素（检查边界） | O(1) |
| `d.front()` | 返回第一个元素 | O(1) |
| `d.back()` | 返回最后一个元素 | O(1) |

```cpp
std::deque<int> d = {10, 20, 30, 40, 50};

int x = d[0];        // x = 10
int y = d.at(2);     // y = 30
int first = d.front();  // first = 10
int last = d.back();    // last = 50
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `d.size()` | 返回元素个数 |
| `d.empty()` | 判断是否为空 |
| `d.resize(n)` | 调整容器大小 |
| `d.shrink_to_fit()` | 请求减少容量以匹配 size |

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `d.push_back(x)` | 在末尾添加元素 | 均摊 O(1) |
| `d.push_front(x)` | 在头部添加元素 | 均摊 O(1) |
| `d.pop_back()` | 删除末尾元素 | O(1) |
| `d.pop_front()` | 删除头部元素 | O(1) |
| `d.insert(pos, x)` | 在指定位置插入元素 | O(n) |
| `d.erase(pos)` | 删除指定位置元素 | O(n) |
| `d.clear()` | 清空所有元素 | O(n) |

```cpp
std::deque<int> d = {2, 3, 4};

d.push_front(1);       // d: {1, 2, 3, 4}
d.push_back(5);        // d: {1, 2, 3, 4, 5}

d.pop_front();         // d: {2, 3, 4, 5}
d.pop_back();          // d: {2, 3, 4}

d.insert(d.begin() + 1, 10);  // d: {2, 10, 3, 4}
```

### 迭代器

```cpp
std::deque<int> d = {1, 2, 3, 4, 5};

// 正向遍历
for (auto it = d.begin(); it != d.end(); ++it) {
    std::cout << *it << " ";
}

// 范围 for 循环
for (const auto& elem : d) {
    std::cout << elem << " ";
}

// 反向遍历
for (auto it = d.rbegin(); it != d.rend(); ++it) {
    std::cout << *it << " ";
}
```

## deque vs vector

| 特性 | deque | vector |
|------|-------|--------|
| 头部插入删除 | O(1) | O(n) |
| 中间插入删除 | O(n) | O(n) |
| 随机访问 | O(1) | O(1) |
| 内存连续性 | 不保证 | 保证 |
| 迭代器有效性 | 更稳定 | 插入可能失效 |
| 内存开销 | 稍大 | 较小 |

## 常见使用场景

::: tabs

@tab 滑动窗口

```cpp
// 维护固定大小窗口
std::deque<int> window;
int max_size = 3;

for (int x : {1, 2, 3, 4, 5, 6}) {
    window.push_back(x);
    if (window.size() > max_size) {
        window.pop_front();
    }
    // window 中始终是最近 3 个元素
}
```

@tab 双端队列操作

```cpp
// 实现双端队列
std::deque<int> dq;

// 两端添加
dq.push_front(1);
dq.push_back(2);

// 两端移除
dq.pop_front();
dq.pop_back();
```

@tab 作为函数参数

```cpp
// 按引用传递（避免拷贝）
void process(const std::deque<int>& d);

// 按指针传递
void modify(std::deque<int>* d);
```

:::

## 性能建议

::: tip 使用场景选择

**选择 deque 的情况**：
- 需要在头部频繁插入删除元素
- 不需要保证内存连续
- 迭代器需要更稳定（插入删除不会失效）

**选择 vector 的情况**：
- 主要在尾部操作
- 需要内存连续
- 更关注内存开销

:::

## 相关容器

- **`std::vector`**：动态数组，内存连续
- **`std::list`**：双向链表，任意位置插入高效
- **`std::queue`**：队列适配器，默认使用 deque 实现
