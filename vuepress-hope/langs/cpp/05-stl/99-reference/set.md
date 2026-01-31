---
title: std::set
icon: devicon-plain:cplusplus
order: 6
category: STL
tag: 容器
description: C++ STL std::set 集合容器速查文档
---

# std::set

`std::set` 是**关联容器**，存储**唯一**的、**排序**的元素。

::: tip 核心特点
- **唯一性**：每个元素只能出现一次
- **自动排序**：元素按 key 排序（默认升序）
- **基于红黑树**：底层实现是红黑树
- **查找高效**：查找、插入、删除都是 O(log n)
- **不可修改**：元素值不可修改（只能删除后重新插入）
:::

## 头文件

```cpp
#include <set>
```

## 声明与初始化

```cpp
// 默认构造空 set（升序，使用 std::less）
std::set<int> s1;

// 使用初始化列表
std::set<int> s2 = {5, 2, 8, 1, 9};  // s2: {1, 2, 5, 8, 9}

// 指定排序方式（降序）
std::set<int, std::greater<int>> s3;

// 拷贝构造
std::set<int> s4(s2);

// 使用迭代器范围构造
std::vector<int> v = {5, 2, 8, 1, 9};
std::set<int> s5(v.begin(), v.end());

// 自定义比较（结构体）
struct Person {
    std::string name;
    int age;
};
struct PersonCompare {
    bool operator()(const Person& a, const Person& b) const {
        return a.age < b.age;
    }
};
std::set<Person, PersonCompare> s6;
```

## 常用操作

### 容量操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `s.size()` | 返回元素个数 | O(1) |
| `s.empty()` | 判断是否为空 | O(1) |
| `s.max_size()` | 返回最大可能大小 | O(1) |
| `s.count(x)` | 返回 x 的出现次数（0 或 1） | O(log n) |

```cpp
std::set<int> s = {1, 2, 3, 4, 5};

s.size();        // 5
s.empty();       // false
s.count(3);      // 1
s.count(6);      // 0
```

### 查找操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `s.find(x)` | 查找 x，返回迭代器 | O(log n) |
| `s.contains(x)` | 判断是否包含 x（C++20） | O(log n) |
| `s.lower_bound(x)` | 返回 ≥ x 的第一个元素 | O(log n) |
| `s.upper_bound(x)` | 返回 > x 的第一个元素 | O(log n) |
| `s.equal_range(x)` | 返回等于 x 的范围 | O(log n) |

```cpp
std::set<int> s = {1, 3, 5, 7, 9};

// find
auto it = s.find(5);
if (it != s.end()) {
    std::cout << "Found: " << *it << std::endl;
}

// contains（C++20）
if (s.contains(7)) {
    std::cout << "7 is in the set" << std::endl;
}

// lower_bound：返回 ≥ 5 的第一个元素
auto lb = s.lower_bound(5);  // 指向 5
auto lb2 = s.lower_bound(6); // 指向 7

// upper_bound：返回 > 5 的第一个元素
auto ub = s.upper_bound(5);  // 指向 7

// equal_range：返回等于 x 的范围
auto [first, last] = s.equal_range(5);
```

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `s.insert(x)` | 插入元素 x | O(log n) |
| `s.insert(pos, x)` | 在位置提示处插入 | O(log n) |
| `s.erase(x)` | 删除元素 x | O(log n) |
| `s.erase(pos)` | 删除指定位置元素 | O(log n) |
| `s.clear()` | 清空所有元素 | O(n) |

```cpp
std::set<int> s = {2, 4, 6};

// 插入元素
s.insert(1);  // s: {1, 2, 4, 6}
s.insert(5);  // s: {1, 2, 4, 5, 6}

// 重复插入不会生效
s.insert(2);  // s: {1, 2, 4, 5, 6}，无变化

// 删除元素
s.erase(4);   // s: {1, 2, 5, 6}

// 通过迭代器删除
auto it = s.find(2);
if (it != s.end()) {
    s.erase(it);  // s: {1, 5, 6}
}

// 插入返回值：pair<迭代器, 是否成功>
auto [it, success] = s.insert(3);
if (success) {
    std::cout << "Inserted: " << *it << std::endl;
}
```

### 迭代器

```cpp
std::set<int> s = {1, 2, 3, 4, 5};

// 正向遍历（有序）
for (auto it = s.begin(); it != s.end(); ++it) {
    std::cout << *it << " ";  // 1 2 3 4 5
}

// 范围 for 循环
for (const auto& elem : s) {
    std::cout << elem << " ";
}

// 反向遍历（降序）
for (auto it = s.rbegin(); it != s.rend(); ++it) {
    std::cout << *it << " ";  // 5 4 3 2 1
}

// C++17: 结构化绑定遍历
for (const auto& [value, _] : s) {
    std::cout << value << " ";
}
```

## set vs unordered_set

| 特性 | set | unordered_set |
|------|-----|---------------|
| 底层实现 | 红黑树 | 哈希表 |
| 有序性 | 有序 | 无序 |
| 查找时间 | O(log n) | O(1) 平均 |
| 插入时间 | O(log n) | O(1) 平均 |
| 内存开销 | 较小 | 较大 |
| 迭代器顺序 | 有序 | 无序 |

## 常见使用场景

::: tabs

@tab 去重

```cpp
// 数组去重
std::vector<int> v = {1, 2, 2, 3, 3, 3, 4};

std::set<int> s(v.begin(), v.end());
// s: {1, 2, 3, 4}
```

@tab 排序去重

```cpp
// 同时排序和去重
std::vector<int> v = {5, 1, 3, 5, 2, 1};

std::set<int> s(v.begin(), v.end());
// s: {1, 2, 3, 5}

// 转回 vector
std::vector<int> result(s.begin(), s.end());
```

@tab 集合运算

```cpp
std::set<int> a = {1, 2, 3, 4};
std::set<int> b = {3, 4, 5, 6};

std::set<int> intersection;
std::set_intersection(a.begin(), a.end(),
                     b.begin(), b.end(),
                     std::inserter(intersection, intersection.begin()));
// intersection: {3, 4}

std::set<int> union_set;
std::set_union(a.begin(), a.end(),
               b.begin(), b.end(),
               std::inserter(union_set, union_set.begin()));
// union_set: {1, 2, 3, 4, 5, 6}
```

@tab 自定义类型

```cpp
struct Point {
    int x, y;
    bool operator<(const Point& p) const {
        return x < p.x || (x == p.x && y < p.y);
    }
};

std::set<Point> points;
points.insert({1, 2});
points.insert({3, 4});
```

:::

## 性能建议

::: tip 优化建议

1. **使用 `contains()` 代替 `find()`**（C++20）
   ```cpp
   // C++20 之前
   if (s.find(x) != s.end()) { ... }

   // C++20
   if (s.contains(x)) { ... }
   ```

2. **使用 `count()` 检查存在性**
   ```cpp
   if (s.count(x)) { ... }  // 比 find() 更简洁
   ```

3. **利用 `insert()` 返回值**
   ```cpp
   auto [it, inserted] = s.insert(x);
   if (!inserted) {
       // x 已存在
   }
   ```

4. **使用 `emplace()` 代替 `insert()`**
   ```cpp
   std::set<std::string> s;
   s.emplace("hello");  // 直接构造，避免临时对象
   ```

:::

## 相关容器

- **`std::multiset`**：允许重复元素
- **`std::unordered_set`**：无序集合，哈希表实现
- **`std::map`**：键值对集合
- **`std::unordered_map`**：无序键值对集合
