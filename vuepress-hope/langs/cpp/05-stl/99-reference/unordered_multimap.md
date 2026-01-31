---
title: std::unordered_multimap
icon: devicon-plain:cplusplus
order: 12
category: STL
tag: 容器
description: C++ STL std::unordered_multimap 无序多重映射容器速查文档
---

# std::unordered_multimap

`std::unordered_multimap` 是 C++11 引入的**无序关联容器**，存储**键值对**，允许**重复的键**，基于**哈希表**实现。

::: tip 核心特点
- **哈希表实现**：底层使用哈希表
- **无序存储**：元素不按特定顺序
- **允许重复键**：同一键可以对应多个值
- **O(1) 平均操作**：查找、插入、删除平均 O(1)
- **无下标访问**：不支持 `umm[key]` 语法
:::

## 头文件

```cpp
#include <unordered_map>
```

## 声明与初始化

```cpp
// 默认构造
std::unordered_multimap<std::string, int> umm1;

// 使用初始化列表
std::unordered_multimap<std::string, int> umm2 = {
    {"apple", 1},
    {"apple", 2},  // 允许重复键
    {"banana", 3}
};

// 拷贝构造
std::unordered_multimap<std::string, int> umm3(umm2);
```

## 常用操作

### 容量操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `umm.size()` | 返回元素个数 | O(1) |
| `umm.empty()` | 判断是否为空 | O(1) |
| `umm.count(key)` | 返回 key 的出现次数 | O(n) 最坏 |

```cpp
std::unordered_multimap<std::string, int> umm = {
    {"apple", 1},
    {"apple", 2},
    {"banana", 3}
};

umm.size();          // 3
umm.count("apple");  // 2
umm.count("banana"); // 1
```

### 查找操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `umm.find(key)` | 查找 key，返回第一个匹配 | O(1) |
| `umm.contains(key)` | 判断是否包含 key（C++20） | O(1) |
| `umm.equal_range(key)` | 返回等于 key 的范围 | O(n) |

```cpp
std::unordered_multimap<std::string, int> umm = {
    {"apple", 1},
    {"apple", 2},
    {"banana", 3}
};

// find
auto it = umm.find("apple");
if (it != umm.end()) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// equal_range：获取所有等于 "apple" 的元素
auto [first, last] = umm.equal_range("apple");
for (auto it = first; it != last; ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}
```

### 修改操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `umm.insert({key, val})` | 插入键值对 | O(1) |
| `umm.erase(key)` | 删除所有等于 key 的元素 | O(n) |
| `umm.clear()` | 清空所有元素 | O(n) |

```cpp
std::unordered_multimap<std::string, int> umm;

// 插入键值对（允许重复键）
umm.insert({"key", 100});
umm.insert({"key", 200});  // 允许重复

// 删除指定键的所有元素
umm.erase("key");  // 删除所有 key
```

### 迭代器

```cpp
std::unordered_multimap<std::string, int> umm = {
    {"apple", 1},
    {"banana", 2}
};

// 正向遍历
for (const auto& [key, value] : umm) {
    std::cout << key << ": " << value << std::endl;
}
```

## unordered_multimap vs unordered_map

| 特性 | unordered_multimap | unordered_map |
|------|-------------------|---------------|
| 重复键 | 允许 | 不允许 |
| `count(key)` | 可能 > 1 | 只能 0 或 1 |
| `insert()` | 总是成功 | 可能失败 |
| `operator[]` | 不支持 | 支持 |

## 常见使用场景

::: tabs

@tab 一对多关系

```cpp
// 学生-课程关系（无序）
std::unordered_multimap<std::string, std::string> student_courses;

student_courses.insert({"Alice", "Math"});
student_courses.insert({"Alice", "Physics"});

// 查询 Alice 的所有课程
auto [first, last] = student_courses.equal_range("Alice");
for (auto it = first; it != last; ++it) {
    std::cout << it->second << std::endl;
}
```

@tab 快速分组

```cpp
// 按类别分组（不需要排序）
std::unordered_multimap<std::string, std::string> groups;

groups.insert({"Fruit", "Apple"});
groups.insert({"Fruit", "Banana"});
groups.insert({"Veg", "Carrot"});
```

:::

## 相关容器

- **`std::unordered_map`**：不允许重复键
- **`std::multimap`**：有序多重映射
- **`std::unordered_multiset`**：无序多重集合
