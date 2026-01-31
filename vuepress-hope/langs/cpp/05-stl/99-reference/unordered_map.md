---
title: std::unordered_map
icon: devicon-plain:cplusplus
order: 10
category: STL
tag: 容器
description: C++ STL std::unordered_map 无序映射容器速查文档
---

# std::unordered_map

`std::unordered_map` 是 C++11 引入的**无序关联容器**，存储**键值对**，基于**哈希表**实现。

::: tip 核心特点
- **哈希表实现**：底层使用哈希表
- **无序存储**：元素不按键排序
- **唯一键**：每个键只能出现一次
- **O(1) 平均查找**：查找、插入、删除平均 O(1)
- **支持下标访问**：支持 `um[key]` 语法
:::

## 头文件

```cpp
#include <unordered_map>
```

## 声明与初始化

```cpp
// 默认构造
std::unordered_map<std::string, int> um1;

// 使用初始化列表
std::unordered_map<std::string, int> um2 = {
    {"apple", 1},
    {"banana", 2},
    {"cherry", 3}
};

// 指定初始桶数量
std::unordered_map<std::string, int> um3(100);

// 拷贝构造
std::unordered_map<std::string, int> um4(um2);

// 使用迭代器范围
std::vector<std::pair<std::string, int>> v = {{"key", 100}};
std::unordered_map<std::string, int> um5(v.begin(), v.end());
```

## 常用操作

### 元素访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `um[key]` | 访问元素（不存在则插入默认值） | O(1) 平均 |
| `um.at(key)` | 访问元素（不存在则抛异常） | O(1) 平均 |

```cpp
std::unordered_map<std::string, int> um = {{"apple", 1}};

// 下标访问
int x = um["apple"];    // x = 1
um["banana"] = 2;       // 插入新元素

// at 访问（检查边界）
int y = um.at("apple"); // y = 1
// int z = um.at("orange"); // 抛出 std::out_of_range

// 下标访问会插入默认值
int count = um["orange"];  // 插入 {"orange", 0}
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `um.size()` | 返回元素个数 |
| `um.empty()` | 判断是否为空 |
| `um.count(key)` | 返回 key 的出现次数（0 或 1） |

```cpp
std::unordered_map<std::string, int> um = {{"a", 1}, {"b", 2}};

um.size();        // 2
um.empty();       // false
um.count("a");    // 1
um.count("c");    // 0
```

### 查找操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `um.find(key)` | 查找 key，返回迭代器 | O(1) |
| `um.contains(key)` | 判断是否包含 key（C++20） | O(1) |

```cpp
std::unordered_map<std::string, int> um = {{"apple", 1}};

// find
auto it = um.find("apple");
if (it != um.end()) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// contains（C++20）
if (um.contains("apple")) {
    std::cout << "Found" << std::endl;
}
```

### 修改操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `um.insert({key, val})` | 插入键值对 | O(1) |
| `um.erase(key)` | 删除指定键 | O(1) |
| `um.clear()` | 清空所有元素 | O(n) |

```cpp
std::unordered_map<std::string, int> um;

// 插入
um.insert({"key", 100});
um.insert(std::make_pair("key2", 200));
um.emplace("key3", 300);  // 直接构造

// insert 返回值
auto [it, success] = um.insert({"key", 100});
if (!success) {
    std::cout << "Key already exists" << std::endl;
}

// 删除
um.erase("key");

// 通过迭代器删除
auto it = um.find("key2");
if (it != um.end()) {
    um.erase(it);
}
```

### 哈希表操作

| 操作 | 说明 |
|------|------|
| `um.load_factor()` | 返回负载因子 |
| `um.max_load_factor()` | 返回/设置最大负载因子 |
| `um.rehash(n)` | 设置桶数量 |
| `um.reserve(n)` | 预留空间 |

```cpp
std::unordered_map<std::string, int> um;

// 预留空间（优化性能）
um.reserve(1000);

// 设置负载因子
um.max_load_factor(0.75f);

// 查看状态
um.load_factor();    // 当前负载因子
um.bucket_count();   // 桶数量
```

### 迭代器

```cpp
std::unordered_map<std::string, int> um = {
    {"apple", 1},
    {"banana", 2},
    {"cherry", 3}
};

// 正向遍历
for (auto it = um.begin(); it != um.end(); ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// 范围 for 循环
for (const auto& [key, value] : um) {
    std::cout << key << ": " << value << std::endl;
}

// C++17: 结构化绑定
for (const auto& [key, value] : um) {
    std::cout << key << " = " << value << std::endl;
}
```

## unordered_map vs map

| 特性 | unordered_map | map |
|------|--------------|-----|
| 底层实现 | 哈希表 | 红黑树 |
| 有序性 | 无序 | 按 key 有序 |
| 查找时间 | O(1) 平均 | O(log n) |
| 插入时间 | O(1) 平均 | O(log n) |
| 内存开销 | 较大 | 较小 |
| 迭代器 | 单向 | 双向 |

## 常见使用场景

::: tabs

@tab 快速查找表

```cpp
// 字典、缓存等场景
std::unordered_map<std::string, int> cache;

int getValue(const std::string& key) {
    auto it = cache.find(key);
    if (it != cache.end()) {
        return it->second;  // 缓存命中
    }
    int value = compute(key);
    cache[key] = value;
    return value;
}
```

@tab 计数

```cpp
// 统计元素出现次数
std::unordered_map<std::string, int> counts;

for (const auto& word : words) {
    counts[word]++;
}
```

@tab 配置存储

```cpp
// 存储配置项
std::unordered_map<std::string, std::string> config = {
    {"host", "localhost"},
    {"port", "8080"},
    {"debug", "true"}
};

std::string host = config["host"];
```

@tab 避免默认插入

```cpp
std::unordered_map<std::string, int> um;

// 使用 find 避免默认插入
auto it = um.find("key");
if (it != um.end()) {
    int value = it->second;
}

// 使用 contains（C++20）
if (um.contains("key")) {
    int value = um["key"];
}

// 使用 try_emplace（C++17）
auto [it, inserted] = um.try_emplace("key", 100);
```

:::

## 性能建议

::: tip 优化建议

1. **使用 `reserve()` 预留空间**
   ```cpp
   um.reserve(1000);  // 避免多次 rehash
   ```

2. **使用 `contains()` 或 `find()` 代替 `[]`**
   ```cpp
   // 只读取时避免默认插入
   if (um.contains(key)) {
       int value = um[key];
   }
   ```

3. **使用 `try_emplace()`**（C++17）
   ```cpp
   // 比 insert() 更高效
   um.try_emplace(key, args...);
   ```

4. **使用 `insert_or_assign()`**（C++17）
   ```cpp
   // 更简洁的插入或更新
   um.insert_or_assign(key, value);
   ```

5. **使用 `count()` 检查存在**
   ```cpp
   if (um.count(key)) { ... }
   ```

:::

## 高级操作

### C++17 新增

```cpp
std::unordered_map<std::string, int> um;

// try_emplace：仅在键不存在时插入
auto [it, inserted] = um.try_emplace("key", 100);

// insert_or_assign：插入或更新
um.insert_or_assign("key", 200);  // 更新

// extract：移除节点（不失效其他迭代器）
auto node = um.extract("key");
if (!node.empty()) {
    node.key() = "new_key";  // 修改键
    um.insert(std::move(node));
}

// merge：合并两个 map
std::unordered_map<std::string, int> um2;
um.merge(um2);  // um2 的元素移到 um
```

## 相关容器

- **`std::map`**：有序映射
- **`std::unordered_multimap`**：允许重复键
- **`std::unordered_set`**：无序集合
- **`std::unordered_set`**：无序集合
