---
title: std::vector
icon: devicon-plain:cplusplus
order: 1
category: STL
tag: 容器
description: C++ STL std::vector 动态数组容器速查文档
---

# std::vector

`std::vector` 是 C++ STL 中最常用的**序列容器**，提供动态大小的数组，支持随机访问。

::: tip 核心特点
- **动态大小**：自动管理内存，可动态增删元素
- **连续存储**：元素在内存中连续存放，支持随机访问
- **随机访问**：通过下标 O(1) 时间访问任意元素
:::

## 头文件

```cpp
#include <vector>
```

## 声明与初始化

```cpp
// 默认构造空 vector
std::vector<int> v1;

// 指定大小，值初始化为 0
std::vector<int> v2(10);

// 指定大小和初始值
std::vector<int> v3(10, 5);  // 10 个元素，值都为 5

// 使用初始化列表
std::vector<int> v4 = {1, 2, 3, 4, 5};

// 拷贝构造
std::vector<int> v5(v4);

// 使用迭代器范围构造
std::vector<int> v6(v4.begin(), v4.end());
```

## 常用操作

### 元素访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `v[i]` | 访问第 i 个元素（不检查边界） | O(1) |
| `v.at(i)` | 访问第 i 个元素（检查边界，越界抛异常） | O(1) |
| `v.front()` | 返回第一个元素 | O(1) |
| `v.back()` | 返回最后一个元素 | O(1) |
| `v.data()` | 返回指向内存数组的指针 | O(1) |

```cpp
std::vector<int> v = {10, 20, 30, 40, 50};

// 下标访问
int x = v[0];        // x = 10
int y = v.at(2);     // y = 30

// 首尾元素
int first = v.front();  // first = 10
int last = v.back();    // last = 50

// 获取原始指针
int* ptr = v.data();
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `v.size()` | 返回元素个数 |
| `v.empty()` | 判断是否为空 |
| `v.capacity()` | 返回当前分配的存储容量 |
| `v.reserve(n)` | 预留至少 n 个元素的存储空间 |
| `v.shrink_to_fit()` | 请求减少容量以匹配 size |

```cpp
std::vector<int> v = {1, 2, 3};

v.size();      // 3
v.empty();     // false
v.capacity();  // >= 3

v.reserve(100);  // 预留空间，避免多次重新分配
```

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `v.push_back(x)` | 在末尾添加元素 | 均摊 O(1) |
| `v.pop_back()` | 删除末尾元素 | O(1) |
| `v.insert(pos, x)` | 在指定位置插入元素 | O(n) |
| `v.erase(pos)` | 删除指定位置元素 | O(n) |
| `v.clear()` | 清空所有元素 | O(n) |
| `v.resize(n)` | 调整容器大小 | O(n) |

```cpp
std::vector<int> v = {1, 2, 3};

v.push_back(4);        // v: {1, 2, 3, 4}
v.pop_back();          // v: {1, 2, 3}

v.insert(v.begin() + 1, 10);  // v: {1, 10, 2, 3}
v.erase(v.begin());           // v: {10, 2, 3}

v.resize(5);           // v: {10, 2, 3, 0, 0}
v.clear();             // v: {}
```

### 迭代器

```cpp
std::vector<int> v = {1, 2, 3, 4, 5};

// 正向遍历
for (auto it = v.begin(); it != v.end(); ++it) {
    std::cout << *it << " ";
}

// 范围 for 循环（推荐）
for (const auto& elem : v) {
    std::cout << elem << " ";
}

// 反向遍历
for (auto it = v.rbegin(); it != v.rend(); ++it) {
    std::cout << *it << " ";
}
```

## 算法支持

`std::vector` 支持所有 STL 算法：

```cpp
#include <algorithm>

std::vector<int> v = {5, 2, 8, 1, 9};

// 排序
std::sort(v.begin(), v.end());  // v: {1, 2, 5, 8, 9}

// 查找
auto it = std::find(v.begin(), v.end(), 5);

// 二分查找（需先排序）
bool found = std::binary_search(v.begin(), v.end(), 5);

// 计数
int count = std::count(v.begin(), v.end(), 5);
```

## 常见使用场景

::: tabs

@tab 动态数组

```cpp
// 读取不确定数量的输入
std::vector<int> numbers;
int x;
while (std::cin >> x) {
    numbers.push_back(x);
}
```

@tab 二维数组

```cpp
// 创建 m x n 的二维 vector
std::vector<std::vector<int>> matrix(m, std::vector<int>(n));

// 访问元素
matrix[i][j] = 42;
```

@tab 作为函数参数

```cpp
// 按值传递（拷贝）
void func1(std::vector<int> v);

// 按引用传递（避免拷贝）
void func2(const std::vector<int>& v);

// 按指针传递
void func3(std::vector<int>* v);
```

:::

## 性能建议

::: tip 性能优化建议

1. **使用 `reserve()`**：当知道大致元素数量时，预先分配空间
   ```cpp
   v.reserve(1000);  // 避免多次重新分配
   ```

2. **使用 `emplace_back()`**：直接在容器中构造元素，避免临时对象
   ```cpp
   v.emplace_back(1, 2);  // 比 push_back 更高效
   ```

3. **避免频繁插入删除中间元素**：这是 O(n) 操作

4. **使用 `const &` 传递参数**：避免不必要的拷贝
   ```cpp
   void print(const std::vector<int>& v);
   ```

:::

## 相关容器

- **`std::array`**：固定大小数组，栈上分配
- **`std::deque`**：双端队列，两端插入删除效率高
- **`std::list`**：链表，任意位置插入删除效率高
