---
title: std::map
icon: devicon-plain:cplusplus
order: 3
category: STL
tag: 容器
description: C++ STL std::map 关联容器速查文档
---

# std::map

`std::map` 是 C++ STL 中的**关联容器**，存储键值对（key-value pairs），按键排序。

::: tip 核心特点
- **键值对存储**：每个元素包含键和值
- **自动排序**：按键升序排列（基于红黑树实现）
- **唯一键**：每个键只能出现一次
- **对数查找**：查找、插入、删除均为 O(log n)
:::

## 头文件

```cpp
#include <map>
```

## 声明与初始化

```cpp
// 默认构造空 map
std::map<std::string, int> m1;

// 使用初始化列表
std::map<std::string, int> m2 = {
    {"apple", 1},
    {"banana", 2},
    {"cherry", 3}
};

// 拷贝构造
std::map<std::string, int> m3(m2);

// 使用迭代器范围构造
std::map<std::string, int> m4(m2.begin(), m2.end());

// 自定义排序（降序）
std::map<std::string, int, std::greater<std::string>> m5;
```

## 常用操作

### 元素访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `m[key]` | 访问/插入指定键的值 | O(log n) |
| `m.at(key)` | 访问指定键的值（键不存在抛异常） | O(log n) |
| `m.find(key)` | 查找键，返回迭代器 | O(log n) |
| `m.count(key)` | 计算键出现次数（0 或 1） | O(log n) |

```cpp
std::map<std::string, int> m = {{"apple", 1}, {"banana", 2}};

// 下标访问（键不存在会自动插入）
int value = m["apple"];        // 1
m["cherry"] = 3;               // 插入新元素

// at 访问（键不存在抛异常）
int value2 = m.at("banana");   // 2

// 查找
auto it = m.find("apple");
if (it != m.end()) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// 检查键是否存在
if (m.count("banana")) {
    std::cout << "Found!" << std::endl;
}
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `m.size()` | 返回元素个数 |
| `m.empty()` | 判断是否为空 |
| `m.max_size()` | 返回最大可能大小 |

```cpp
std::map<std::string, int> m = {{"a", 1}, {"b", 2}};

m.size();      // 2
m.empty();     // false
```

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `m.insert(pair)` | 插入键值对 | O(log n) |
| `m.erase(key)` | 删除指定键的元素 | O(log n) |
| `m.clear()` | 清空所有元素 | O(n) |
| `m.swap(other)` | 交换两个 map 的内容 | O(1) |

```cpp
std::map<std::string, int> m;

// 插入方式 1：使用 pair
m.insert(std::make_pair("apple", 1));

// 插入方式 2：使用 value_type
m.insert(std::map<std::string, int>::value_type("banana", 2));

// 插入方式 3：使用初始化列表
m.insert({"cherry", 3});

// 插入方式 4：使用下标（最简洁）
m["date"] = 4;

// 删除元素
m.erase("apple");     // 按键删除
auto it = m.find("banana");
if (it != m.end()) {
    m.erase(it);      // 按迭代器删除
}

m.clear();            // 清空
```

### 迭代器

```cpp
std::map<std::string, int> m = {
    {"apple", 1},
    {"banana", 2},
    {"cherry", 3}
};

// 正向遍历
for (auto it = m.begin(); it != m.end(); ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// 范围 for 循环（推荐）
for (const auto& pair : m) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}

// C++17 结构化绑定
for (const auto& [key, value] : m) {
    std::cout << key << ": " << value << std::endl;
}

// 反向遍历
for (auto it = m.rbegin(); it != m.rend(); ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}
```

## 常用算法

### 查找操作

```cpp
std::map<std::string, int> m = {{"a", 1}, {"b", 2}, {"c", 3}};

// 查找特定键
auto it = m.find("b");
if (it != m.end()) {
    std::cout << "Found: " << it->second << std::endl;
}

// 统计键出现次数
size_t count = m.count("a");  // 0 或 1

// 查找下界（>= key）
auto lower = m.lower_bound("b");  // 指向第一个 >= "b" 的元素

// 查找上界（> key）
auto upper = m.upper_bound("b");  // 指向第一个 > "b" 的元素

// 获取范围 [lower_bound, upper_bound)
auto range = m.equal_range("b");
```

## 常见使用场景

::: tabs

@tab 字典/映射

```cpp
// 单词计数
std::map<std::string, int> word_count;
std::string word;
while (std::cin >> word) {
    word_count[word]++;
}

// 配置管理
std::map<std::string, std::string> config = {
    {"host", "localhost"},
    {"port", "8080"},
    {"debug", "true"}
};
```

@tab 缓存实现

```cpp
// 简单缓存
std::map<int, std::string> cache;

std::string get_data(int key) {
    auto it = cache.find(key);
    if (it != cache.end()) {
        return it->second;  // 缓存命中
    }
    // 模拟计算
    std::string value = "data_" + std::to_string(key);
    cache[key] = value;
    return value;
}
```

@tab 分组/索引

```cpp
// 按类别分组
struct Item {
    std::string category;
    std::string name;
};

std::map<std::string, std::vector<Item>> items_by_category;

items_by_category["fruit"].push_back({"fruit", "apple"});
items_by_category["fruit"].push_back({"fruit", "banana"});
items_by_category["vegetable"].push_back({"vegetable", "carrot"});
```

:::

## 自定义比较器

```cpp
// 降序排序
std::map<int, std::string, std::greater<int>> m = {
    {3, "three"},
    {1, "one"},
    {2, "two"}
};
// 顺序: 3, 2, 1

// 自定义比较器
struct CaseInsensitive {
    bool operator()(const std::string& a, const std::string& b) const {
        return std::lexicographical_compare(
            a.begin(), a.end(),
            b.begin(), b.end(),
            [](char c1, char c2) { return tolower(c1) < tolower(c2); }
        );
    }
};

std::map<std::string, int, CaseInsensitive> m;
m["Hello"] = 1;
m["hello"] = 2;  // 不会插入，键已存在
```

## 性能建议

::: tip 性能优化建议

1. **使用 `emplace()` 和 `try_emplace()`**：避免不必要的临时对象
   ```cpp
   m.emplace("key", value);        // C++11
   m.try_emplace("key", value);    // C++17
   ```

2. **使用 `insert_or_assign()`**：C++17 更简洁的插入或更新
   ```cpp
   m.insert_or_assign("key", value);
   ```

3. **使用 `contains()`**：C++20 更直观的存在性检查
   ```cpp
   if (m.contains("key")) { ... }
   ```

4. **优先使用 `count()` 或 `find()`** 而非 `m[key]` 来检查键是否存在（避免默认构造）

:::

## std::map vs std::unordered_map

| 特性 | std::map | std::unordered_map |
|------|----------|---------------------|
| 底层实现 | 红黑树 | 哈希表 |
| 查找复杂度 | O(log n) | O(1) 平均 |
| 插入复杂度 | O(log n) | O(1) 平均 |
| 元素顺序 | 有序 | 无序 |
| 内存开销 | 较大 | 较大（哈希表） |

::: tip 选择建议
- 需要**有序遍历** → `std::map`
- 需要**范围查询**（如查找某个区间内的元素）→ `std::map`
- 追求**查找性能**且不需要顺序 → `std::unordered_map`
:::

## 相关容器

- **`std::unordered_map`**：无序关联容器（哈希表实现）
- **`std::multimap`**：允许重复键的有序关联容器
- **`std::unordered_multimap`**：允许重复键的无序关联容器
- **`std::set`**：仅存储键的有序集合
