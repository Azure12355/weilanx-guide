---
title: std::multimap
icon: devicon-plain:cplusplus
order: 8
category: STL
tag: 容器
description: C++ STL std::multimap 多重映射容器速查文档
---

# std::multimap

`std::multimap` 是**关联容器**，存储**键值对**，允许**重复的键**。

::: tip 核心特点
- **键值对存储**：每个元素是 `std::pair<const Key, Value>`
- **允许重复键**：同一键可以对应多个值
- **自动排序**：按 key 排序（默认升序）
- **基于红黑树**：底层实现是红黑树
- **查找高效**：查找、插入、删除都是 O(log n)
:::

## 头文件

```cpp
#include <map>
```

## 声明与初始化

```cpp
// 默认构造空 multimap
std::multimap<std::string, int> mm1;

// 使用初始化列表
std::multimap<std::string, int> mm2 = {
    {"apple", 1},
    {"banana", 2},
    {"apple", 3}  // 允许重复键
};

// 指定排序方式（降序）
std::multimap<std::string, int, std::greater<std::string>> mm3;

// 拷贝构造
std::multimap<std::string, int> mm4(mm2);

// 使用 pair 插入
mm1.insert({"key", 100});
mm1.insert(std::make_pair("key", 200));
```

## 常用操作

### 容量操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `mm.size()` | 返回元素个数 | O(1) |
| `mm.empty()` | 判断是否为空 | O(1) |
| `mm.count(key)` | 返回 key 的出现次数 | O(log n) |

```cpp
std::multimap<std::string, int> mm = {
    {"apple", 1},
    {"banana", 2},
    {"apple", 3}
};

mm.size();          // 3
mm.empty();         // false
mm.count("apple");  // 2
mm.count("banana"); // 1
mm.count("orange"); // 0
```

### 查找操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `mm.find(key)` | 查找 key，返回第一个匹配 | O(log n) |
| `mm.contains(key)` | 判断是否包含 key（C++20） | O(log n) |
| `mm.lower_bound(key)` | 返回 ≥ key 的第一个元素 | O(log n) |
| `mm.upper_bound(key)` | 返回 > key 的第一个元素 | O(log n) |
| `mm.equal_range(key)` | 返回等于 key 的范围 | O(log n) |

```cpp
std::multimap<std::string, int> mm = {
    {"apple", 1},
    {"apple", 2},
    {"banana", 3},
    {"apple", 4}
};

// find：返回第一个匹配
auto it = mm.find("apple");
if (it != mm.end()) {
    std::cout << it->first << ": " << it->second << std::endl;
    // 输出: apple: 1（第一个 apple）
}

// lower_bound：≥ "apple" 的第一个元素
auto lb = mm.lower_bound("apple");

// upper_bound：> "apple" 的第一个元素
auto ub = mm.upper_bound("apple");  // 指向 banana

// equal_range：返回所有等于 "apple" 的范围
auto [first, last] = mm.equal_range("apple");
for (auto it = first; it != last; ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}
// 输出:
// apple: 1
// apple: 2
// apple: 4
```

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `mm.insert({key, val})` | 插入键值对 | O(log n) |
| `mm.erase(key)` | 删除所有等于 key 的元素 | O(log n + k) |
| `mm.erase(pos)` | 删除指定位置元素 | O(log n) |
| `mm.clear()` | 清空所有元素 | O(n) |

```cpp
std::multimap<std::string, int> mm;

// 插入键值对（允许重复键）
mm.insert({"apple", 1});
mm.insert({"banana", 2});
mm.insert({"apple", 3});  // 允许重复
mm.insert(std::make_pair("cherry", 4));
// mm: {apple:1, apple:3, banana:2, cherry:4}

// 删除指定键的所有元素
mm.erase("apple");  // 删除所有 apple
// mm: {banana:2, cherry:4}

// 删除指定位置的元素
auto it = mm.find("banana");
if (it != mm.end()) {
    mm.erase(it);
}

// 删除指定范围
auto [first, last] = mm.equal_range("cherry");
mm.erase(first, last);
```

### 元素访问

```cpp
std::multimap<std::string, int> mm = {{"key", 100}};

// 通过迭代器访问
auto it = mm.begin();
std::cout << it->first << ": " << it->second << std::endl;

// 结构化绑定（C++17）
for (const auto& [key, value] : mm) {
    std::cout << key << ": " << value << std::endl;
}
```

### 迭代器

```cpp
std::multimap<std::string, int> mm = {
    {"apple", 1},
    {"banana", 2},
    {"cherry", 3}
};

// 正向遍历（按 key 排序）
for (auto it = mm.begin(); it != mm.end(); ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// 范围 for 循环
for (const auto& [key, value] : mm) {
    std::cout << key << ": " << value << std::endl;
}

// 反向遍历
for (auto it = mm.rbegin(); it != mm.rend(); ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}
```

## multimap vs map

| 特性 | multimap | map |
|------|----------|-----|
| 重复键 | 允许 | 不允许 |
| `count(key)` | 可能 > 1 | 只能 0 或 1 |
| `insert()` | 总是成功 | 可能失败（键已存在） |
| `erase(key)` | 删除所有匹配 | 删除唯一匹配 |
| `operator[]` | 不支持 | 支持 |
| 使用场景 | 一对多关系 | 一对一映射 |

::: warning 无 operator[]
`std::multimap` 不支持 `mm[key] = value` 语法，因为一个键可能对应多个值。
:::

## 常见使用场景

::: tabs

@tab 一对多关系

```cpp
// 学生-课程关系（一个学生可以选多门课）
std::multimap<std::string, std::string> student_courses;

student_courses.insert({"Alice", "Math"});
student_courses.insert({"Bob", "Physics"});
student_courses.insert({"Alice", "Chemistry"});

// 查询 Alice 选的所有课
auto [first, last] = student_courses.equal_range("Alice");
for (auto it = first; it != last; ++it) {
    std::cout << it->second << std::endl;
}
// 输出:
// Math
// Chemistry
```

@tab 分组数据

```cpp
// 按类别分组
struct Product {
    std::string category;
    std::string name;
};

std::multimap<std::string, std::string> products;

products.insert({"Fruit", "Apple"});
products.insert({"Fruit", "Banana"});
products.insert({"Vegetable", "Carrot"});

// 获取所有水果
auto [first, last] = products.equal_range("Fruit");
for (auto it = first; it != last; ++it) {
    std::cout << it->second << std::endl;
}
```

@tab 时间线事件

```cpp
// 同一时刻可能有多个事件
std::multimap<int, std::string> timeline;

timeline.insert({10, "Event A"});
timeline.insert({20, "Event B"});
timeline.insert({10, "Event C"});  // 同一时刻

// 获取 t=10 时的所有事件
auto events = timeline.equal_range(10);
for (auto it = events.first; it != events.second; ++it) {
    std::cout << it->second << std::endl;
}
```

:::

## 性能建议

::: tip 使用建议

1. **使用 `equal_range()` 处理重复键**
   ```cpp
   auto [first, last] = mm.equal_range(key);
   for (auto it = first; it != last; ++it) {
       // 处理所有等于 key 的元素
   }
   ```

2. **使用 `emplace()` 减少拷贝**
   ```cpp
   mm.emplace(std::make_pair("key", value));
   ```

3. **注意 `erase(key)` 删除所有匹配**
   ```cpp
   mm.erase("key");  // 删除所有 key！

   // 如果只想删除一个
   auto it = mm.find("key");
   if (it != mm.end()) {
       mm.erase(it);
   }
   ```

:::

## 相关容器

- **`std::map`**：不允许重复键
- **`std::unordered_map`**：无序映射
- **`std::unordered_multimap`**：无序多重映射
- **`std::multiset`**：多重集合（只有键）
