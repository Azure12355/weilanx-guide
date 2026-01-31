---
title: std::multiset
icon: devicon-plain:cplusplus
order: 7
category: STL
tag: 容器
description: C++ STL std::multiset 多重集合容器速查文档
---

# std::multiset

`std::multiset` 是**关联容器**，存储**可重复**的、**排序**的元素。

::: tip 核心特点
- **允许重复**：同一元素可以出现多次
- **自动排序**：元素按 key 排序（默认升序）
- **基于红黑树**：底层实现是红黑树
- **查找高效**：查找、插入、删除都是 O(log n)
- **稳定排序**：相等元素保持插入相对顺序
:::

## 头文件

```cpp
#include <set>
```

## 声明与初始化

```cpp
// 默认构造空 multiset（升序）
std::multiset<int> ms1;

// 使用初始化列表
std::multiset<int> ms2 = {5, 2, 8, 2, 9, 5};  // ms2: {2, 2, 5, 5, 8, 9}

// 指定排序方式（降序）
std::multiset<int, std::greater<int>> ms3;

// 拷贝构造
std::multiset<int> ms4(ms2);

// 使用迭代器范围构造
std::vector<int> v = {5, 2, 8, 2, 9};
std::multiset<int> ms5(v.begin(), v.end());
```

## 常用操作

### 容量操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `ms.size()` | 返回元素个数 | O(1) |
| `ms.empty()` | 判断是否为空 | O(1) |
| `ms.count(x)` | 返回 x 的出现次数 | O(log n) |

```cpp
std::multiset<int> ms = {1, 2, 2, 3, 3, 3};

ms.size();      // 6
ms.empty();     // false
ms.count(2);    // 2
ms.count(3);    // 3
ms.count(4);    // 0
```

### 查找操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `ms.find(x)` | 查找 x，返回第一个匹配的迭代器 | O(log n) |
| `ms.contains(x)` | 判断是否包含 x（C++20） | O(log n) |
| `ms.lower_bound(x)` | 返回 ≥ x 的第一个元素 | O(log n) |
| `ms.upper_bound(x)` | 返回 > x 的第一个元素 | O(log n) |
| `ms.equal_range(x)` | 返回等于 x 的范围 | O(log n) |

```cpp
std::multiset<int> ms = {1, 2, 2, 3, 3, 3, 4};

// find：返回第一个匹配
auto it = ms.find(3);  // 指向第一个 3

// lower_bound：≥ 3 的第一个元素
auto lb = ms.lower_bound(3);  // 指向第一个 3

// upper_bound：> 3 的第一个元素
auto ub = ms.upper_bound(3);  // 指向 4

// equal_range：返回等于 3 的范围
auto [first, last] = ms.equal_range(3);
// first 指向第一个 3，last 指向 4

// 遍历所有等于 3 的元素
for (auto it = first; it != last; ++it) {
    std::cout << *it << " ";  // 3 3 3
}
```

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `ms.insert(x)` | 插入元素 x | O(log n) |
| `ms.erase(x)` | 删除所有等于 x 的元素 | O(log n + k) |
| `ms.erase(pos)` | 删除指定位置元素 | O(log n) |
| `ms.clear()` | 清空所有元素 | O(n) |

```cpp
std::multiset<int> ms = {2, 4, 6};

// 插入元素（可以重复）
ms.insert(2);  // ms: {2, 2, 4, 6}
ms.insert(4);  // ms: {2, 2, 4, 4, 6}

// 删除指定值（删除所有匹配）
ms.erase(2);   // ms: {4, 4, 6}

// 删除指定位置的元素
auto it = ms.find(4);
ms.erase(it);  // ms: {4, 6}

// 删除指定范围的元素
auto [first, last] = ms.equal_range(4);
ms.erase(first, last);  // 删除所有 4
```

### 迭代器

```cpp
std::multiset<int> ms = {1, 2, 2, 3};

// 正向遍历（有序）
for (auto it = ms.begin(); it != ms.end(); ++it) {
    std::cout << *it << " ";  // 1 2 2 3
}

// 范围 for 循环
for (const auto& elem : ms) {
    std::cout << elem << " ";
}

// 反向遍历
for (auto it = ms.rbegin(); it != ms.rend(); ++it) {
    std::cout << *it << " ";  // 3 2 2 1
}
```

## multiset vs set

| 特性 | multiset | set |
|------|----------|-----|
| 重复元素 | 允许 | 不允许 |
| `count(x)` | 可能 > 1 | 只能 0 或 1 |
| `insert(x)` | 总是成功 | 可能失败（已存在） |
| `erase(x)` | 删除所有匹配 | 删除唯一匹配 |
| 使用场景 | 需要重复 | 唯一性约束 |

## 常见使用场景

::: tabs

@tab 统计频率

```cpp
// 统计元素出现次数
std::vector<int> v = {1, 2, 2, 3, 3, 3, 4};

std::multiset<int> ms(v.begin(), v.end());

// 查询每个元素的出现次数
for (int x : ms) {
    std::cout << x << ": " << ms.count(x) << std::endl;
}
```

@tab 数据分组

```cpp
// 按值分组数据
struct Record {
    int category;
    std::string data;
};

std::multiset<int, Record> records;  // 按 category 排序

// 插入记录
records.insert({1, "data1"});
records.insert({2, "data2"});
records.insert({1, "data3"});

// 获取所有 category = 1 的记录
auto [first, last] = records.equal_range(1);
for (auto it = first; it != last; ++it) {
    std::cout << it->second << std::endl;
}
```

@tab 优先级队列

```cpp
// 允许相同优先级的元素
std::multiset<int> pq;

pq.insert(3);
pq.insert(1);
pq.insert(3);  // 允许重复

// 获取最小值
if (!pq.empty()) {
    auto min = *pq.begin();
    pq.erase(pq.begin());
}
```

:::

## 性能建议

::: tip 使用建议

1. **使用 `equal_range()` 处理重复元素**
   ```cpp
   auto [first, last] = ms.equal_range(x);
   for (auto it = first; it != last; ++it) {
       // 处理所有等于 x 的元素
   }
   ```

2. **注意 `erase(x)` 的行为**
   ```cpp
   ms.erase(5);  // 删除所有值为 5 的元素！

   // 如果只想删除一个
   auto it = ms.find(5);
   if (it != ms.end()) {
       ms.erase(it);  // 只删除第一个
   }
   ```

3. **使用 `count()` 检查重复**
   ```cpp
   if (ms.count(x) > 1) {
       std::cout << x << " appears " << ms.count(x) << " times" << std::endl;
   }
   ```

:::

## 相关容器

- **`std::set`**：不允许重复元素
- **`std::unordered_multiset`**：无序多重集合
- **`std::multimap`**：键值对多重映射
- **`std::unordered_multimap`**：无序键值对多重映射
