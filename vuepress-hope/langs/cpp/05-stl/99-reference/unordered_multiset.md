---
title: std::unordered_multiset
icon: devicon-plain:cplusplus
order: 11
category: STL
tag: 容器
description: C++ STL std::unordered_multiset 无序多重集合容器速查文档
---

# std::unordered_multiset

`std::unordered_multiset` 是 C++11 引入的**无序关联容器**，基于**哈希表**实现，允许**重复元素**。

::: tip 核心特点
- **哈希表实现**：底层使用哈希表
- **无序存储**：元素不按特定顺序存储
- **允许重复**：同一元素可以出现多次
- **O(1) 平均操作**：查找、插入、删除平均 O(1)
:::

## 头文件

```cpp
#include <unordered_set>
```

## 声明与初始化

```cpp
// 默认构造
std::unordered_multiset<int> ums1;

// 使用初始化列表
std::unordered_multiset<int> ums2 = {1, 2, 2, 3, 3, 3};

// 指定初始桶数量
std::unordered_multiset<int> ums3(100);

// 拷贝构造
std::unordered_multiset<int> ums4(ums2);
```

## 常用操作

### 容量操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `ums.size()` | 返回元素个数 | O(1) |
| `ums.empty()` | 判断是否为空 | O(1) |
| `ums.count(x)` | 返回 x 的出现次数 | O(n) 最坏 |

```cpp
std::unordered_multiset<int> ums = {1, 2, 2, 3, 3, 3};

ums.size();      // 6
ums.empty();     // false
ums.count(2);    // 2
ums.count(3);    // 3
```

### 查找操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `ums.find(x)` | 查找 x，返回第一个匹配 | O(1) |
| `ums.contains(x)` | 判断是否包含 x（C++20） | O(1) |
| `ums.equal_range(x)` | 返回等于 x 的范围 | O(n) |

```cpp
std::unordered_multiset<int> ums = {1, 2, 2, 3, 3, 3};

// find
auto it = ums.find(2);
if (it != ums.end()) {
    std::cout << "Found: " << *it << std::endl;
}

// equal_range
auto [first, last] = ums.equal_range(3);
for (auto it = first; it != last; ++it) {
    std::cout << *it << " ";  // 3 3 3
}
```

### 修改操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `ums.insert(x)` | 插入元素 x | O(1) |
| `ums.erase(x)` | 删除所有等于 x 的元素 | O(n) |
| `ums.clear()` | 清空所有元素 | O(n) |

```cpp
std::unordered_multiset<int> ums = {2, 4};

// 插入元素（可以重复）
ums.insert(2);
ums.insert(2);  // ums: {2, 2, 2, 4}

// 删除指定值（删除所有匹配）
ums.erase(2);  // ums: {4}
```

### 迭代器

```cpp
std::unordered_multiset<int> ums = {1, 2, 2, 3};

for (const auto& elem : ums) {
    std::cout << elem << " ";
}
```

## unordered_multiset vs unordered_set

| 特性 | unordered_multiset | unordered_set |
|------|-------------------|---------------|
| 重复元素 | 允许 | 不允许 |
| `count(x)` | 可能 > 1 | 只能 0 或 1 |
| `insert()` | 总是成功 | 可能失败 |
| 使用场景 | 需要重复统计 | 唯一性约束 |

## 常见使用场景

::: tabs

@tab 统计频率

```cpp
// 统计元素出现次数
std::unordered_multiset<std::string> words;

for (const auto& w : text) {
    words.insert(w);
}

// 查询频率
int count = words.count("hello");
```

@tab 允许重复的去重

```cpp
// 快速去重但保留频率信息
std::vector<int> v = {1, 2, 2, 3, 3, 3};

std::unordered_multiset<int> ums(v.begin(), v.end());

// 查询某个值的数量
int count = ums.count(3);  // 3
```

:::

## 相关容器

- **`std::unordered_set`**：不允许重复元素
- **`std::multiset`**：有序多重集合
- **`std::unordered_multimap`**：无序多重映射
