---
title: std::unordered_set
icon: devicon-plain:cplusplus
order: 9
category: STL
tag: 容器
description: C++ STL std::unordered_set 无序集合容器速查文档
---

# std::unordered_set

`std::unordered_set` 是 C++11 引入的**无序关联容器**，基于**哈希表**实现。

::: tip 核心特点
- **哈希表实现**：底层使用哈希表
- **无序存储**：元素不按特定顺序存储
- **唯一性**：每个元素只能出现一次
- **O(1) 平均查找**：查找、插入、删除平均 O(1)
- **最坏 O(n)**：哈希冲突严重时退化到 O(n)
:::

## 头文件

```cpp
#include <unordered_set>
```

## 声明与初始化

```cpp
// 默认构造
std::unordered_set<int> us1;

// 使用初始化列表
std::unordered_set<int> us2 = {1, 2, 3, 4, 5};

// 指定初始桶数量
std::unordered_set<int> us3(100);  // 至少 100 个桶

// 拷贝构造
std::unordered_set<int> us4(us2);

// 使用迭代器范围构造
std::vector<int> v = {1, 2, 3, 4, 5};
std::unordered_set<int> us5(v.begin(), v.end());

// 自定义哈希函数和相等比较
struct Person {
    std::string name;
    int age;
};
struct PersonHash {
    size_t operator()(const Person& p) const {
        return std::hash<std::string>()(p.name) ^ std::hash<int>()(p.age);
    }
};
struct PersonEqual {
    bool operator()(const Person& a, const Person& b) const {
        return a.name == b.name && a.age == b.age;
    }
};
std::unordered_set<Person, PersonHash, PersonEqual> us6;
```

## 常用操作

### 容量操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `us.size()` | 返回元素个数 | O(1) |
| `us.empty()` | 判断是否为空 | O(1) |
| `us.max_size()` | 返回最大可能大小 | O(1) |

```cpp
std::unordered_set<int> us = {1, 2, 3, 4, 5};

us.size();        // 5
us.empty();       // false
```

### 查找操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `us.find(x)` | 查找 x，返回迭代器 | O(1) |
| `us.count(x)` | 返回 x 的出现次数（0 或 1） | O(1) |
| `us.contains(x)` | 判断是否包含 x（C++20） | O(1) |

```cpp
std::unordered_set<int> us = {1, 2, 3, 4, 5};

// find
auto it = us.find(3);
if (it != us.end()) {
    std::cout << "Found: " << *it << std::endl;
}

// count
if (us.count(4)) {
    std::cout << "4 is in the set" << std::endl;
}

// contains（C++20）
if (us.contains(5)) {
    std::cout << "5 is in the set" << std::endl;
}
```

### 修改操作

| 操作 | 说明 | 平均时间复杂度 |
|------|------|---------------|
| `us.insert(x)` | 插入元素 x | O(1) |
| `us.insert(pos, x)` | 在位置提示处插入 | O(1) |
| `us.erase(x)` | 删除元素 x | O(1) |
| `us.erase(pos)` | 删除指定位置 | O(1) |
| `us.clear()` | 清空所有元素 | O(n) |

```cpp
std::unordered_set<int> us = {2, 4, 6};

// 插入元素
us.insert(1);
us.insert(5);

// 重复插入无效
us.insert(2);  // 无变化

// 删除元素
us.erase(4);

// 通过迭代器删除
auto it = us.find(2);
if (it != us.end()) {
    us.erase(it);
}

// insert 返回值
auto [it, success] = us.insert(3);
if (success) {
    std::cout << "Inserted: " << *it << std::endl;
}
```

### 哈希表操作

| 操作 | 说明 |
|------|------|
| `us.load_factor()` | 返回负载因子（size / bucket_count） |
| `us.max_load_factor()` | 返回/设置最大负载因子 |
| `us.rehash(n)` | 设置桶数量为至少 n |
| `us.reserve(n)` | 为 n 个元素预留空间 |

```cpp
std::unordered_set<int> us;

// 设置最大负载因子
us.max_load_factor(0.75f);

// 预留空间（优化插入性能）
us.reserve(1000);  // 为大约 1000 个元素预留

// 重新哈希
us.rehash(200);  // 设置至少 200 个桶

// 查看哈希表状态
us.load_factor();       // 当前负载因子
us.bucket_count();      // 桶数量
us.max_bucket_count();  // 最大桶数量
```

### 迭代器

::: warning 无序迭代
遍历顺序是不确定的，不要依赖特定顺序。
:::

```cpp
std::unordered_set<int> us = {1, 2, 3, 4, 5};

// 正向遍历
for (auto it = us.begin(); it != us.end(); ++it) {
    std::cout << *it << " ";
}

// 范围 for 循环
for (const auto& elem : us) {
    std::cout << elem << " ";
}

// 局部遍历（C++20）
std::cout << us.contains(5) << std::endl;
```

## unordered_set vs set

| 特性 | unordered_set | set |
|------|--------------|-----|
| 底层实现 | 哈希表 | 红黑树 |
| 有序性 | 无序 | 有序 |
| 查找时间 | O(1) 平均 | O(log n) |
| 插入时间 | O(1) 平均 | O(log n) |
| 内存开销 | 较大 | 较小 |
| 迭代器 | 单向（前向） | 双向 |
| 顺序保证 | 无 | 升序 |

## 常见使用场景

::: tabs

@tab 快速查找

```cpp
// 需要快速判断元素是否存在
std::unordered_set<int> cache;

for (int x : large_dataset) {
    if (cache.contains(x)) {
        // 已处理过
        continue;
    }
    process(x);
    cache.insert(x);
}
```

@tab 去重

```cpp
// 快速去重（不需要排序）
std::vector<int> v = {1, 2, 2, 3, 3, 3, 4};

std::unordered_set<int> unique(v.begin(), v.end());
// unique: {1, 2, 3, 4}（顺序不确定）
```

@tab 自定义类型

```cpp
// 需要提供哈希函数
enum class Color { Red, Green, Blue };

struct ColorHash {
    size_t operator()(Color c) const {
        return std::hash<int>()(static_cast<int>(c));
    }
};

std::unordered_set<Color, ColorHash> colors;
colors.insert(Color::Red);
```

:::

## 性能建议

::: tip 优化建议

1. **预留空间**
   ```cpp
   us.reserve(expected_size);  // 避免多次 rehash
   ```

2. **选择合适的负载因子**
   ```cpp
   // 默认 1.0，可调小以减少冲突
   us.max_load_factor(0.75f);
   ```

3. **使用 `contains()` 代替 `find()`**（C++20）
   ```cpp
   // 更清晰
   if (us.contains(x)) { ... }
   ```

4. **避免在遍历时修改容器**
   ```cpp
   for (auto it = us.begin(); it != us.end(); ) {
       if (should_remove(*it)) {
           it = us.erase(it);  // 正确
           // us.erase(*it);   // 错误！会使迭代器失效
       } else {
           ++it;
       }
   }
   ```

:::

## 哈希函数

对于自定义类型，需要提供哈希函数：

```cpp
struct Point {
    int x, y;
};

// 方法 1：自定义哈希
struct PointHash {
    size_t operator()(const Point& p) const {
        return std::hash<int>()(p.x) ^ (std::hash<int>()(p.y) << 1);
    }
};

struct PointEqual {
    bool operator()(const Point& a, const Point& b) const {
        return a.x == b.x && a.y == b.y;
    }
};

std::unordered_set<Point, PointHash, PointEqual> points;

// 方法 2：特化 std::hash（不推荐，污染全局命名空间）
namespace std {
    template<>
    struct hash<Point> {
        size_t operator()(const Point& p) const {
            return std::hash<int>()(p.x) ^ (std::hash<int>()(p.y) << 1);
        }
    };
}

std::unordered_set<Point> points2;
```

## 相关容器

- **`std::set`**：有序集合
- **`std::unordered_multiset`**：允许重复元素
- **`std::unordered_map`**：无序键值对
- **`std::unordered_set`**：无序集合
