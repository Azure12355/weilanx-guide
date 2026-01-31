---
title: 修改算法
icon: devicon-plain:cplusplus
order: 2
---

# 修改算法

STL 提供了多种修改容器内容的算法，包括复制、移动、变换、填充、生成、删除、替换等。

## 复制与移动

### std::copy

复制元素到另一个容器。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> dest(src.size());

std::copy(src.begin(), src.end(), dest.begin());

// 使用 back_inserter 自动扩展
std::vector<int> dest2;
std::copy(src.begin(), src.end(), std::back_inserter(dest2));

// 使用插入迭代器
std::list<int> lst = {10, 20, 30};
std::copy(src.begin(), src.end(), std::inserter(lst, lst.begin()));
```

### std::copy_n (C++11)

复制指定数量的元素。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> dest(3);

std::copy_n(src.begin(), 3, dest.begin());  // dest: {1, 2, 3}
```

### std::copy_if (C++11)

复制满足条件的元素。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> dest;

std::copy_if(src.begin(), src.end(), std::back_inserter(dest), [](int n) {
    return n % 2 == 0;  // 只复制偶数
});
// dest: {2, 4}
```

### std::copy_backward

从后向前复制。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> dest(src.size());

std::copy_backward(src.begin(), src.end(), dest.end());
```

### std::move (C++11)

移动元素。

```cpp
std::vector<std::string> src = {"Hello", "World"};
std::vector<std::string> dest(src.size());

std::move(src.begin(), src.end(), dest.begin());
// src 的元素变为移动后的状态（可能为空）
```

### std::move_backward (C++11)

从后向前移动。

```cpp
std::vector<std::string> src = {"Hello", "World"};
std::vector<std::string> dest(src.size());

std::move_backward(src.begin(), src.end(), dest.end());
```

## 变换

### std::transform

对每个元素应用函数。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
std::vector<int> result(vec.size());

// 一元操作
std::transform(vec.begin(), vec.end(), result.begin(), [](int n) {
    return n * 2;
});
// result: {2, 4, 6, 8, 10}

// 二元操作（两个范围）
std::vector<int> vec2 = {10, 20, 30, 40, 50};
std::vector<int> result2(vec.size());

std::transform(vec.begin(), vec.end(), vec2.begin(), result2.begin(),
    [](int a, int b) {
        return a + b;
    });
// result2: {11, 22, 33, 44, 55}

// 原地变换
std::transform(vec.begin(), vec.end(), vec.begin(), [](int n) {
    return n * 2;
});
// vec: {2, 4, 6, 8, 10}
```

## 填充与生成

### std::fill

用给定值填充。

```cpp
std::vector<int> vec(10);
std::fill(vec.begin(), vec.end(), 42);
// vec: {42, 42, 42, 42, 42, 42, 42, 42, 42, 42}
```

### std::fill_n (C++11)

填充指定数量的元素。

```cpp
std::vector<int> vec(10);
std::fill_n(vec.begin(), 5, 42);
// vec: {42, 42, 42, 42, 42, 0, 0, 0, 0, 0}
```

### std::generate

用函数生成元素。

```cpp
std::vector<int> vec(5);
int n = 0;

std::generate(vec.begin(), vec.end(), [&n]() {
    return n++;  // 生成 0, 1, 2, 3, 4
});
// vec: {0, 1, 2, 3, 4}
```

### std::generate_n

生成指定数量的元素。

```cpp
std::vector<int> vec;
int n = 0;

std::generate_n(std::back_inserter(vec), 5, [&n]() {
    return n++;
});
// vec: {0, 1, 2, 3, 4}
```

### std::iota

填充递增序列。

```cpp
std::vector<int> vec(10);

std::iota(vec.begin(), vec.end(), 1);
// vec: {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

// 从 10 开始
std::iota(vec.begin(), vec.end(), 10);
// vec: {10, 11, 12, 13, 14, 15, 16, 17, 18, 19}
```

## 删除

### std::remove

移除元素（不实际删除，移到末尾）。

```cpp
std::vector<int> vec = {1, 2, 3, 2, 4, 2, 5};

auto new_end = std::remove(vec.begin(), vec.end(), 2);
// vec: {1, 3, 4, 5, ?, ?, ?}  (末尾元素未指定)

// 实际删除
vec.erase(new_end, vec.end());
// vec: {1, 3, 4, 5}
```

### std::remove_if

移除满足条件的元素。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5, 6, 7};

auto new_end = std::remove_if(vec.begin(), vec.end(), [](int n) {
    return n % 2 == 0;  // 移除偶数
});
vec.erase(new_end, vec.end());
// vec: {1, 3, 5, 7}
```

### std::remove_copy / remove_copy_if

复制时移除元素。

```cpp
std::vector<int> src = {1, 2, 3, 2, 4};
std::vector<int> dest;

std::remove_copy(src.begin(), src.end(), std::back_inserter(dest), 2);
// dest: {1, 3, 4}
```

### std::unique

移除连续重复元素。

```cpp
std::vector<int> vec = {1, 2, 2, 3, 3, 3, 4};

// 需要先排序
std::sort(vec.begin(), vec.end());

auto new_end = std::unique(vec.begin(), vec.end());
vec.erase(new_end, vec.end());
// vec: {1, 2, 3, 4}
```

### std::unique_copy

复制时移除重复。

```cpp
std::vector<int> src = {1, 2, 2, 3, 3, 4};
std::vector<int> dest;

std::unique_copy(src.begin(), src.end(), std::back_inserter(dest));
// dest: {1, 2, 3, 4}
```

## 替换

### std::replace

替换所有等于给定值的元素。

```cpp
std::vector<int> vec = {1, 2, 3, 2, 4, 2};

std::replace(vec.begin(), vec.end(), 2, 99);
// vec: {1, 99, 3, 99, 4, 99}
```

### std::replace_if

替换满足条件的元素。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

std::replace_if(vec.begin(), vec.end(), [](int n) {
    return n % 2 == 0;  // 替换偶数
}, 99);
// vec: {1, 99, 3, 99, 5}
```

### std::replace_copy / replace_copy_if

复制时替换。

```cpp
std::vector<int> src = {1, 2, 3, 2, 4};
std::vector<int> dest;

std::replace_copy(src.begin(), src.end(), std::back_inserter(dest), 2, 99);
// dest: {1, 99, 3, 99, 4}
```

## 反转与旋转

### std::reverse

反转元素顺序。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

std::reverse(vec.begin(), vec.end());
// vec: {5, 4, 3, 2, 1}
```

### std::reverse_copy

复制时反转。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> dest;

std::reverse_copy(src.begin(), src.end(), std::back_inserter(dest));
// dest: {5, 4, 3, 2, 1}
```

### std::rotate

旋转元素。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// 向左旋转 2 个位置
auto new_begin = std::rotate(vec.begin(), vec.begin() + 2, vec.end());
// vec: {3, 4, 5, 1, 2}
```

### std::rotate_copy

复制时旋转。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> dest(5);

std::rotate_copy(src.begin(), src.begin() + 2, src.end(), dest.begin());
// dest: {3, 4, 5, 1, 2}
```

## 随机重排

### std::shuffle (C++11)

随机打乱元素顺序。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
std::random_device rd;
std::mt19937 g(rd());

std::shuffle(vec.begin(), vec.end(), g);
// vec 随机排列
```

### std::sample (C++17)

随机采样。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
std::vector<int> dest(3);

std::random_device rd;
std::mt19937 g(rd());

std::sample(src.begin(), src.end(), dest.begin(), 3, g);
// dest 中有 3 个随机元素
```

## 分区

### std::partition

分区（满足条件的在前）。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5, 6};

auto mid = std::partition(vec.begin(), vec.end(), [](int n) {
    return n % 2 == 0;  // 偶数在前
});
// vec: {2, 4, 6, 1, 3, 5} (顺序不保证)
```

### std::stable_partition

稳定分区（保持相对顺序）。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5, 6};

auto mid = std::stable_partition(vec.begin(), vec.end(), [](int n) {
    return n % 2 == 0;
});
// vec: {2, 4, 6, 1, 3, 5}
```

### std::partition_copy

复制时分区。

```cpp
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> evens, odds;

std::partition_copy(src.begin(), src.end(),
                   std::back_inserter(evens),
                   std::back_inserter(odds),
                   [](int n) { return n % 2 == 0; });
// evens: {2, 4}
// odds: {1, 3, 5}
```

## 其他修改

### std::swap

交换两个值。

```cpp
int a = 10, b = 20;
std::swap(a, b);
// a = 20, b = 10

// 交换容器
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = {4, 5, 6};
std::swap(vec1, vec2);
```

### std::swap_ranges

交换两个范围的元素。

```cpp
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = {4, 5, 6};

std::swap_ranges(vec1.begin(), vec1.begin() + 2, vec2.begin());
// vec1: {4, 5, 3}
// vec2: {1, 2, 6}
```

### std::iter_swap

交换两个迭代器的值。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

std::iter_swap(vec.begin(), vec.begin() + 2);
// vec: {3, 2, 1, 4, 5}
```

### std::random_shuffle (已弃用)

使用 `std::shuffle` 代替。

## 性能考虑

### 时间复杂度

| 算法 | 时间复杂度 | 说明 |
|------|------------|------|
| `copy` / `move` | O(n) | 线性复制 |
| `fill` / `generate` | O(n) | 线性填充 |
| `transform` | O(n) | 线性变换 |
| `remove` / `unique` | O(n) | 线性移除 |
| `reverse` | O(n) | 线性反转 |
| `rotate` | O(n) | 线性旋转 |
| `shuffle` | O(n) | 线性打乱 |
| `partition` | O(n) | 线性分区 |

### 使用建议

```cpp
// ❌ 错误：remove 后忘记 erase
std::vector<int> vec = {1, 2, 2, 3};
std::remove(vec.begin(), vec.end(), 2);  // 元素未实际删除！

// ✅ 正确：erase-remove 惯用法
vec.erase(std::remove(vec.begin(), vec.end(), 2), vec.end());

// ✅ 使用移动语义减少拷贝
std::vector<std::string> src;
std::vector<std::string> dest(src.size());
std::move(src.begin(), src.end(), dest.begin());

// ✅ 使用 transform 原地修改
std::transform(vec.begin(), vec.end(), vec.begin(), [](int n) {
    return n * 2;
});

// ✅ 稳定版本保持相对顺序
std::stable_partition(...)  // 而非 std::partition
```

---

::: tip 修改建议
- **remove 需配合 erase**：erase-remove 惯用法
- **使用 move 减少拷贝**：移动语义
- **稳定算法保持顺序**：`stable_*` 系列
- **使用 iota 填充序列**：简洁高效
:::
