---
title: std::array
icon: devicon-plain:cplusplus
order: 3
category: STL
tag: 容器
description: C++ STL std::array 固定大小数组容器速查文档
---

# std::array

`std::array` 是 C++11 引入的**固定大小数组容器**，是对原生数组的封装，提供更安全的接口。

::: tip 核心特点
- **固定大小**：编译时确定大小，不可动态调整
- **栈上分配**：通常在栈上分配内存
- **连续存储**：元素在内存中连续存放
- **零开销**：性能与原生数组相同
- **安全接口**：提供 `size()`、`at()` 等安全操作
:::

## 头文件

```cpp
#include <array>
```

## 声明与初始化

```cpp
// 声明一个包含 5 个 int 的 array
std::array<int, 5> arr1;

// 使用初始化列表
std::array<int, 5> arr2 = {1, 2, 3, 4, 5};

// 部分初始化（其余为 0）
std::array<int, 5> arr3 = {1, 2};  // {1, 2, 0, 0, 0}

// 拷贝构造
std::array<int, 5> arr4 = arr2;

// 结构化绑定（C++17）
auto [a, b, c, d, e] = arr2;
```

## 常用操作

### 元素访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `arr[i]` | 访问第 i 个元素（不检查边界） | O(1) |
| `arr.at(i)` | 访问第 i 个元素（检查边界） | O(1) |
| `arr.front()` | 返回第一个元素 | O(1) |
| `arr.back()` | 返回最后一个元素 | O(1) |
| `arr.data()` | 返回指向内存数组的指针 | O(1) |

```cpp
std::array<int, 5> arr = {10, 20, 30, 40, 50};

// 下标访问
int x = arr[0];        // x = 10
int y = arr.at(2);     // y = 30

// 首尾元素
int first = arr.front();  // first = 10
int last = arr.back();    // last = 50

// 获取原始指针
int* ptr = arr.data();
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `arr.size()` | 返回元素个数（编译时常量） |
| `arr.empty()` | 判断是否为空（size() == 0） |
| `arr.max_size()` | 返回最大可能大小 |

```cpp
std::array<int, 5> arr;

arr.size();       // 5
arr.empty();      // false
arr.max_size();   // 5
```

### 迭代器支持

```cpp
std::array<int, 5> arr = {1, 2, 3, 4, 5};

// 正向遍历
for (auto it = arr.begin(); it != arr.end(); ++it) {
    std::cout << *it << " ";
}

// 范围 for 循环（推荐）
for (const auto& elem : arr) {
    std::cout << elem << " ";
}

// 反向遍历
for (auto it = arr.rbegin(); it != arr.rend(); ++it) {
    std::cout << *it << " ";
}
```

### 填充与交换

```cpp
std::array<int, 5> arr1 = {1, 2, 3, 4, 5};
std::array<int, 5> arr2;

// 用指定值填充所有元素
arr2.fill(0);  // arr2: {0, 0, 0, 0, 0}

// 交换两个 array 的内容
arr1.swap(arr2);
```

## 算法支持

```cpp
#include <algorithm>

std::array<int, 5> arr = {5, 2, 8, 1, 9};

// 排序
std::sort(arr.begin(), arr.end());  // arr: {1, 2, 5, 8, 9}

// 查找
auto it = std::find(arr.begin(), arr.end(), 5);

// 二分查找（需先排序）
bool found = std::binary_search(arr.begin(), arr.end(), 5);

// 计数
int count = std::count(arr.begin(), arr.end(), 5);

// 填充
std::fill(arr.begin(), arr.end(), 0);  // arr: {0, 0, 0, 0, 0}
```

## array vs 原生数组

| 特性 | std::array | 原生数组 |
|------|-----------|---------|
| 大小信息 | 有 `size()` 方法 | 需要额外维护 |
| 边界检查 | `at()` 方法支持 | 无 |
| 拷贝语义 | 支持值拷贝 | 衰退为指针 |
| 作为返回值 | 可以 | 不方便 |
| 迭代器支持 | 支持 | 不支持 |
| 性能 | 零开销 | 相同 |

```cpp
// std::array 可以拷贝
std::array<int, 3> a1 = {1, 2, 3};
std::array<int, 3> a2 = a1;  // 完整拷贝

// 原生数组会衰退为指针
int arr1[3] = {1, 2, 3};
int arr2[3] = arr1;  // 错误！
auto arr3 = arr1;    // arr3 是 int*，不是数组
```

## 常见使用场景

::: tabs

@tab 固定大小数据

```cpp
// 表示固定大小的向量
std::array<double, 3> vector3d = {1.0, 2.0, 3.0};

// RGB 颜色
std::array<uint8_t, 3> rgb = {255, 128, 0};

// 2D 矩阵的行
std::array<int, 4> row = {1, 2, 3, 4};
```

@tab 作为函数参数

```cpp
// 按值传递（拷贝）
void process(std::array<int, 5> arr);

// 按引用传递（避免拷贝）
void process(const std::array<int, 5>& arr);

// 模板函数（任意大小）
template<size_t N>
void print(const std::array<int, N>& arr) {
    for (const auto& x : arr) {
        std::cout << x << " ";
    }
}
```

@tab 结构化绑定

```cpp
std::array<int, 3> arr = {1, 2, 3};

auto& [x, y, z] = arr;  // C++17
x = 10;  // 修改 arr[0]
```

:::

## tuple 接口

`std::array` 也支持部分 `std::tuple` 的接口：

```cpp
std::array<int, 3> arr = {1, 2, 3};

// 获取第 i 个元素的类型
using ElementType = std::tuple_element<0, decltype(arr)>::type;  // int

// 获取第 i 个元素的引用
std::get<0>(arr) = 10;  // arr[0] = 10

// 获取编译时大小
constexpr size_t size = std::tuple_size<decltype(arr)>::value;  // 3
```

## 性能建议

::: tip 使用建议

1. **优先使用 `std::array`**：相比原生数组更安全、更方便
2. **使用 `constexpr`**：编译期计算 array 大小
   ```cpp
   constexpr size_t N = 5;
   std::array<int, N> arr;
   ```
3. **使用结构化绑定**：提高代码可读性（C++17）
4. **注意边界检查**：调试时使用 `at()`，发布时使用 `[]`

:::

## 相关容器

- **`std::vector`**：动态大小数组
- **原生数组**：`T arr[N]`
- **`std::tuple`**：固定大小，可存储不同类型元素
