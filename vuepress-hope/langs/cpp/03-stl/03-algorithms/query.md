---
title: 查询算法
icon: devicon-plain:cplusplus
order: 1
---

# 查询算法

STL 提供了丰富的查询算法，定义在 `<algorithm>` 头文件中。

## 查找元素

### std::find

查找第一个等于给定值的元素。

```cpp
#include <algorithm>

std::vector<int> vec = {1, 2, 3, 4, 5};

// 查找值为 3 的元素
auto it = std::find(vec.begin(), vec.end(), 3);
if (it != vec.end()) {
    std::cout << "找到: " << *it << " 位置: " << std::distance(vec.begin(), it) << std::endl;
}

// 查找自定义对象
std::vector<std::string> words = {"Hello", "World", "C++"};
auto it2 = std::find(words.begin(), words.end(), "World");
```

### std::find_if

查找第一个满足条件的元素。

```cpp
// 查找第一个大于 3 的元素
auto it = std::find_if(vec.begin(), vec.end(), [](int n) {
    return n > 3;
});

// 查找第一个奇数
auto it2 = std::find_if(vec.begin(), vec.end(), [](int n) {
    return n % 2 != 0;
});
```

### std::find_if_not

查找第一个不满足条件的元素。

```cpp
// 查找第一个不大于 3 的元素
auto it = std::find_if_not(vec.begin(), vec.end(), [](int n) {
    return n > 3;
});
```

### std::find_end

查找最后一个子序列。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 1, 2, 3};
std::vector<int> sub = {1, 2, 3};

auto it = std::find_end(vec.begin(), vec.end(), sub.begin(), sub.end());
if (it != vec.end()) {
    std::cout << "找到最后一个子序列，位置: " << std::distance(vec.begin(), it) << std::endl;
}
```

### std::find_first_of

查找第一个存在于另一序列中的元素。

```cpp
std::vector<int> vec = {5, 2, 8, 1, 9};
std::vector<int> targets = {2, 3, 4};

auto it = std::find_first_of(vec.begin(), vec.end(),
                            targets.begin(), targets.end());
if (it != vec.end()) {
    std::cout << "找到: " << *it << std::endl;  // 2
}
```

### std::adjacent_find

查找相邻重复元素。

```cpp
std::vector<int> vec = {1, 2, 2, 3, 4, 4, 4, 5};

auto it = std::adjacent_find(vec.begin(), vec.end());
if (it != vec.end()) {
    std::cout << "第一个相邻重复: " << *it << std::endl;  // 2
}
```

## 统计

### std::count

统计等于给定值的元素个数。

```cpp
std::vector<int> vec = {1, 2, 3, 2, 4, 2, 5};

int count = std::count(vec.begin(), vec.end(), 2);
std::cout << "2 出现了 " << count << " 次" << std::endl;  // 3
```

### std::count_if

统计满足条件的元素个数。

```cpp
// 统计偶数个数
int even_count = std::count_if(vec.begin(), vec.end(), [](int n) {
    return n % 2 == 0;
});

// 统计大于 3 的元素
int greater_count = std::count_if(vec.begin(), vec.end(), [](int n) {
    return n > 3;
});
```

## 比较范围

### std::equal

判断两个范围是否相等。

```cpp
std::vector<int> vec1 = {1, 2, 3, 4, 5};
std::vector<int> vec2 = {1, 2, 3, 4, 5};

bool equal = std::equal(vec1.begin(), vec1.end(), vec2.begin());
```

### std::lexicographical_compare

字典序比较。

```cpp
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = {1, 2, 4};

bool less = std::lexicographical_compare(
    vec1.begin(), vec1.end(),
    vec2.begin(), vec2.end()
);  // true
```

### std::is_permutation

判断是否为相同元素的不同排列。

```cpp
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = {3, 2, 1};

bool perm = std::is_permutation(vec1.begin(), vec1.end(), vec2.begin());
```

## 范围属性

### std::is_sorted

判断是否已排序。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

bool sorted = std::is_sorted(vec.begin(), vec.end());  // true

// 自定义比较
std::vector<int> vec_desc = {5, 4, 3, 2, 1};
bool desc_sorted = std::is_sorted(vec_desc.begin(), vec_desc.end(), std::greater<int>());
```

### std::is_sorted_until

找到第一个破坏排序的位置。

```cpp
std::vector<int> vec = {1, 2, 3, 5, 4, 6};

auto it = std::is_sorted_until(vec.begin(), vec.end());
// it 指向 5 (第一个破坏排序的位置)
```

### std::is_partitioned

判断是否已分区。

```cpp
std::vector<int> vec = {1, 3, 5, 2, 4};  // 奇数在前，偶数在后

bool partitioned = std::is_partitioned(
    vec.begin(), vec.end(),
    [](int n) { return n % 2 != 0; }  // 分区条件
);  // true
```

## 搜索子序列

### std::search

搜索子序列。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5, 6, 7};
std::vector<int> sub = {3, 4, 5};

auto it = std::search(vec.begin(), vec.end(), sub.begin(), sub.end());
if (it != vec.end()) {
    std::cout << "找到子序列，位置: " << std::distance(vec.begin(), it) << std::endl;  // 2
}
```

### std::search_n

搜索 n 个连续相同的值。

```cpp
std::vector<int> vec = {1, 2, 2, 2, 3};

auto it = std::search_n(vec.begin(), vec.end(), 3, 2);
// it 指向第一个 2
```

## 二分查找

### std::binary_search

判断元素是否存在（需要有序）。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

bool found = std::binary_search(vec.begin(), vec.end(), 3);  // true
bool not_found = std::binary_search(vec.begin(), vec.end(), 6);  // false
```

### std::lower_bound

找到第一个不小于给定值的元素。

```cpp
std::vector<int> vec = {1, 3, 5, 7, 9};

auto it = std::lower_bound(vec.begin(), vec.end(), 5);
// it 指向 5

auto it2 = std::lower_bound(vec.begin(), vec.end(), 6);
// it2 指向 7 (第一个 >= 6 的元素)
```

### std::upper_bound

找到第一个大于给定值的元素。

```cpp
auto it = std::upper_bound(vec.begin(), vec.end(), 5);
// it 指向 7 (第一个 > 5 的元素)
```

### std::equal_range

找到等于给定值的元素范围。

```cpp
std::vector<int> vec = {1, 2, 2, 2, 3};

auto range = std::equal_range(vec.begin(), vec.end(), 2);
// range.first 指向第一个 2
// range.second 指向最后一个 2 之后的位置

int count = std::distance(range.first, range.second);  // 3
```

## 最值

### std::min / std::max

```cpp
int mn = std::min({1, 5, 3, 9, 2});  // 1
int mx = std::max({1, 5, 3, 9, 2});  // 9

// 自定义比较
auto min_it = std::min_element(vec.begin(), vec.end());
auto max_it = std::max_element(vec.begin(), vec.end());
```

### std::min_element / std::max_element

```cpp
std::vector<int> vec = {5, 2, 8, 1, 9};

auto min_it = std::min_element(vec.begin(), vec.end());
std::cout << "最小值: " << *min_it << std::endl;  // 1

auto max_it = std::max_element(vec.begin(), vec.end());
std::cout << "最大值: " << *max_it << std::endl;  // 9
```

### std::minmax / std::minmax_element

```cpp
// 返回 pair
auto [mn, mx] = std::minmax({1, 5, 3, 9, 2});

// 返回迭代器 pair
auto [min_it, max_it] = std::minmax_element(vec.begin(), vec.end());
```

### std::clamp (C++17)

将值限制在范围内。

```cpp
int value = 150;
int clamped = std::clamp(value, 0, 100);  // 100
```

## 其他查询

### std::all_of / std::any_of / std::none_of

```cpp
std::vector<int> vec = {2, 4, 6, 8, 10};

// 所有元素都满足条件？
bool all_even = std::all_of(vec.begin(), vec.end(), [](int n) {
    return n % 2 == 0;
});  // true

// 存在元素满足条件？
bool any_gt_5 = std::any_of(vec.begin(), vec.end(), [](int n) {
    return n > 5;
});  // true

// 没有元素满足条件？
bool none_odd = std::none_of(vec.begin(), vec.end(), [](int n) {
    return n % 2 != 0;
});  // true
```

### std::mismatch

找到第一个不同的位置。

```cpp
std::vector<int> vec1 = {1, 2, 3, 4, 5};
std::vector<int> vec2 = {1, 2, 5, 4, 3};

auto [it1, it2] = std::mismatch(vec1.begin(), vec1.end(), vec2.begin());
// it1 指向 vec1 的 3
// it2 指向 vec2 的 5
```

### std::lexicographical_compare_three_way (C++20)

三向比较。

```cpp
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = {1, 2, 4};

auto cmp = std::lexicographical_compare_three_way(
    vec1.begin(), vec1.end(),
    vec2.begin(), vec2.end()
);
// cmp < 0 表示 vec1 < vec2
```

## 性能考虑

### 时间复杂度

| 算法 | 时间复杂度 | 说明 |
|------|------------|------|
| `find` | O(n) | 线性查找 |
| `binary_search` | O(log n) | 需要有序 |
| `find_if` | O(n) | 线性查找 |
| `count` | O(n) | 线性统计 |
| `min/max_element` | O(n) | 线性查找 |
| `lower/upper_bound` | O(log n) | 二分查找 |

### 使用建议

```cpp
// 无序数据：使用线性查找
std::vector<int> vec = {5, 2, 8, 1, 9};
auto it = std::find(vec.begin(), vec.end(), 8);

// 有序数据：使用二分查找
std::sort(vec.begin(), vec.end());
auto it = std::lower_bound(vec.begin(), vec.end(), 8);

// 需要频繁查找：使用关联/无序容器
std::unordered_set<int> us = {5, 2, 8, 1, 9};
bool found = us.count(8) > 0;
```

---

::: tip 查询建议
- **有序数据优先用二分查找**
- **频繁查找考虑用哈希容器**
- **使用 `any_of/all_of/none_of` 替代手写循环**
- **`lower_bound` / `upper_bound` 需要有序**
:::
