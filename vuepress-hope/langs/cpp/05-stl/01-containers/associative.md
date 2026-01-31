---
title: 关联容器
icon: devicon-plain:cplusplus
order: 2
---

# 关联容器

关联容器基于排序的数据结构（通常是红黑树），元素按键有序存储，支持高效查找。

## std::set

有序集合，存储唯一的键，自动排序。

### 特性

| 操作 | 时间复杂度 |
|------|------------|
| 插入 | O(log n) |
| 删除 | O(log n) |
| 查找 | O(log n) |
| 遍历 | O(n) |

### 使用示例

```cpp
#include <set>

// 创建与初始化
std::set<int> s1;                       // 空 set
std::set<int> s2 = {5, 2, 8, 1, 9};     // 初始化列表（自动排序）
std::set<int> s3(s2);                    // 拷贝构造

// 插入（自动排序，去重）
s1.insert(3);
s1.insert(1);
s1.insert(2);
s1.insert(1);  // 重复元素不会被插入

// 插入多个
std::vector<int> vec = {6, 4, 7};
s1.insert(vec.begin(), vec.end());

// 查找
auto it = s1.find(3);
if (it != s1.end()) {
    std::cout << "找到: " << *it << std::endl;
}

// 查询元素是否存在
bool exists = s1.count(3) > 0;  // 存在返回 1，否则返回 0

// 删除
s1.erase(3);              // 删除指定值
s1.erase(s1.begin());     // 删除指定位置
s1.erase(s1.begin(), s1.end());  // 删除范围

// 大小
int size = s1.size();
bool empty = s1.empty();

// 清空
s1.clear();

// 遍历（有序）
for (const auto& item : s1) {
    std::cout << item << " ";  // 1 2 3 4 5 6 7
}

// 查找边界
auto lower = s1.lower_bound(5);  // 第一个 >= 5 的元素
auto upper = s1.upper_bound(5);  // 第一个 > 5 的元素
auto range = s1.equal_range(5);  // 等于 5 的范围
```

### 自定义排序

```cpp
// 降序排序
std::set<int, std::greater<int>> desc_set = {1, 2, 3, 4, 5};

// 自定义比较函数
struct Person {
    std::string name;
    int age;
};

struct CompareByAge {
    bool operator()(const Person& a, const Person& b) const {
        return a.age < b.age;
    }
};

std::set<Person, CompareByAge> people;
```

## std::map

有序映射，存储键值对，键唯一，自动按键排序。

### 特性

| 操作 | 时间复杂度 |
|------|------------|
| 插入 | O(log n) |
| 删除 | O(log n) |
| 查找 | O(log n) |
| 访问 | O(log n) |

### 使用示例

```cpp
#include <map>

// 创建与初始化
std::map<std::string, int> m1;
std::map<std::string, int> m2 = {
    {"Alice", 25},
    {"Bob", 30},
    {"Charlie", 35}
};

// 插入
m1["Alice"] = 25;           // 直接赋值
m1.insert({"Bob", 30});      // insert 方法
m1.emplace("Charlie", 35);   // emplace 更高效

// 插入多个
m1.insert(m2.begin(), m2.end());

// 访问
int age1 = m1["Alice"];       // 不存在会自动创建默认值
int age2 = m1.at("Bob");      // 不存在抛出异常

// 安全访问
auto it = m1.find("David");
if (it != m1.end()) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// 修改值
m1["Alice"] = 26;

// 删除
m1.erase("Alice");           // 删除指定键
m1.erase(m1.begin());        // 删除指定位置
m1.erase(m1.begin(), m1.end());  // 删除范围

// 大小
int size = m1.size();
bool empty = m1.empty();

// 清空
m1.clear();

// 遍历（按键排序）
for (const auto& pair : m1) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}

// 使用结构化绑定 (C++17)
for (const auto& [key, value] : m1) {
    std::cout << key << ": " << value << std::endl;
}

// 查找边界
auto lower = m1.lower_bound("Bob");  // 第一个 >= "Bob" 的元素
auto upper = m1.upper_bound("Bob");  // 第一个 > "Bob" 的元素
auto range = m1.equal_range("Bob");  // 等于 "Bob" 的范围
```

### 自定义排序

```cpp
// 按值排序（而非键）
struct CompareByValue {
    bool operator()(const std::pair<const std::string, int>& a,
                     const std::pair<const std::string, int>& b) const {
        return a.second < b.second;
    }
};

std::map<std::string, int, CompareByValue> custom_map;
```

## std::multiset

有序集合，允许重复元素。

```cpp
#include <set>

std::multiset<int> ms = {1, 2, 2, 3, 3, 3};

// 插入（允许重复）
ms.insert(2);  // 现在有 4 个 2

// 计数（返回出现次数）
int count = ms.count(2);  // 4

// 删除（删除所有匹配的元素）
ms.erase(2);

// 查找（返回第一个匹配的位置）
auto it = ms.find(3);
```

## std::multimap

有序映射，允许重复的键。

```cpp
#include <map>

std::multimap<std::string, int> mm;

// 插入（允许重复键）
mm.insert({"Alice", 25});
mm.insert({"Bob", 30});
mm.insert({"Alice", 26});  // 允许重复键

// 计数
int count = mm.count("Alice");  // 2

// 查找（返回第一个匹配的位置）
auto it = mm.find("Alice");

// 删除（删除所有匹配的键）
mm.erase("Alice");

// 遍历所有相同键的值
auto range = mm.equal_range("Alice");
for (auto it = range.first; it != range.second; it++) {
    std::cout << it->second << " ";  // 25 26
}
```

## 关联容器对比

| 特性 | set | map | multiset | multimap |
|------|-----|-----|----------|----------|
| 元素类型 | 键 | 键值对 | 键 | 键值对 |
| 键唯一性 | ✅ | ✅ | ❌ | ❌ |
| 自动排序 | ✅ | ✅ | ✅ | ✅ |
| 下标访问 | ❌ | ✅ | ❌ | ❌ |

## 使用场景

### set / multiset

```cpp
// 去重
std::vector<int> vec = {1, 2, 2, 3, 3, 3};
std::set<int> unique(vec.begin(), vec.end());  // 1 2 3

// 集合运算
std::set<int> a = {1, 2, 3, 4};
std::set<int> b = {3, 4, 5, 6};

// 并集
std::set<int> uni;
std::set_union(a.begin(), a.end(), b.begin(), b.end(),
               std::inserter(uni, uni.begin()));

// 交集
std::set<int> inter;
std::set_intersection(a.begin(), a.end(), b.begin(), b.end(),
                     std::inserter(inter, inter.begin()));

// 差集
std::set<int> diff;
std::set_difference(a.begin(), a.end(), b.begin(), b.end(),
                   std::inserter(diff, diff.begin()));
```

### map / multimap

```cpp
// 字典/映射
std::map<std::string, int> ages;
ages["Alice"] = 25;
ages["Bob"] = 30;

// 计数
std::map<std::string, int> word_count;
std::string word = "hello";
word_count[word]++;  // 统计词频

// 分组
std::multimap<int, std::string> by_age;
by_age.insert({25, "Alice"});
by_age.insert({30, "Bob"});
by_age.insert({25, "Charlie"});  // 同一 age 可以有多人

// 查找所有 25 岁的人
auto range = by_age.equal_range(25);
for (auto it = range.first; it != range.second; it++) {
    std::cout << it->second << " ";  // Alice Charlie
}
```

## 性能考虑

### 使用 hint 优化插入

```cpp
std::set<int> s = {1, 3, 5, 7, 9};

// 先查找插入位置，再插入
auto it = s.lower_bound(6);
s.insert(it, 6);  // 比直接 insert 更高效
```

### 使用 emplace 减少拷贝

```cpp
std::set<std::pair<int, int>> s;

// insert 会创建临时对象
s.insert({1, 2});

// emplace 就地构造
s.emplace(1, 2);
```

### 使用 const 引用遍历

```cpp
// 避免拷贝
for (const auto& item : s) {
    // ...
}

for (const auto& [key, value] : m) {
    // ...
}
```

## 关联容器 vs 无序容器

| 特性 | 关联容器 | 无序容器 |
|------|----------|----------|
| 底层结构 | 红黑树 | 哈希表 |
| 查找复杂度 | O(log n) | 平均 O(1)，最坏 O(n) |
| 有序性 | ✅ 自动排序 | ❌ 无序 |
| 内存开销 | 较大 | 较小 |

### 选择建议

- **需要有序** → 关联容器 (`set`/`map`)
- **需要范围查询** → 关联容器
- **只需要查找** → 无序容器 (`unordered_set`/`unordered_map`)
- **需要顺序遍历** → 关联容器
- **追求极致性能** → 无序容器

---

::: tip 使用建议
- 需要有序时使用 `set`/`map`
- 使用 `emplace` 代替 `insert`
- 遍历时使用 `const` 引用
- 使用 `count` 检查存在性，`find` 获取位置
:::
