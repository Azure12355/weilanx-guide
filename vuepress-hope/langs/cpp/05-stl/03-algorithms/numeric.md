---
title: 数值算法
icon: devicon-plain:cplusplus
order: 3
---

# 数值算法

数值算法定义在 `<numeric>` 头文件中，提供累加、内积、差值等数值计算功能。

## std::accumulate

累加元素。

```cpp
#include <numeric>

std::vector<int> vec = {1, 2, 3, 4, 5};

// 默认累加（和）
int sum = std::accumulate(vec.begin(), vec.end(), 0);
// 1 + 2 + 3 + 4 + 5 = 15

// 指定初始值
int sum2 = std::accumulate(vec.begin(), vec.end(), 10);
// 10 + 1 + 2 + 3 + 4 + 5 = 25

// 自定义操作（乘积）
int product = std::accumulate(vec.begin(), vec.end(), 1, std::multiplies<int>());
// 1 * 1 * 2 * 3 * 4 * 5 = 120

// 字符串拼接
std::vector<std::string> words = {"Hello", " ", "World", "!"};
std::string str = std::accumulate(words.begin(), words.end(), std::string());
// "Hello World!"
```

## std::reduce (C++17)

归约（更通用的累加）。

```cpp
#include <numeric>

std::vector<int> vec = {1, 2, 3, 4, 5};

// 默认累加
int sum = std::reduce(vec.begin(), vec.end());
// 15

// 指定初始值
int sum2 = std::reduce(vec.begin(), vec.end(), 0);
// 15

// 自定义操作
int product = std::reduce(vec.begin(), vec.end(), 1, std::multiplies<int>());
// 120

// 并行执行（需要策略）
int sum3 = std::reduce(std::execution::par, vec.begin(), vec.end());
```

## std::inner_product

内积（两个范围的对应元素相乘再求和）。

```cpp
std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = {4, 5, 6};

// 默认内积 (Σ a[i] * b[i])
int result = std::inner_product(vec1.begin(), vec1.end(),
                               vec2.begin(), 0);
// 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32

// 自定义操作
// 使用 add 代替默认乘法，使用 multiply 代替默认加法
int result2 = std::inner_product(vec1.begin(), vec1.end(),
                                vec2.begin(), 0,
                                std::plus<int>(),      // 加法（替代默认乘法）
                                std::multiplies<int>()); // 乘法（替代默认加法）
// (1 + 4) * (2 + 5) * (3 + 6) = 5 * 7 * 9 = 315
```

## std::partial_sum

部分和（前缀和）。

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
std::vector<int> result(vec.size());

std::partial_sum(vec.begin(), vec.end(), result.begin());
// result: {1, 3, 6, 10, 15}
// 1, 1+2, 1+2+3, 1+2+3+4, 1+2+3+4+5

// 原地操作
std::partial_sum(vec.begin(), vec.end(), vec.begin());
// vec: {1, 3, 6, 10, 15}
```

### 自定义操作

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
std::vector<int> result(vec.size());

// 使用乘法
std::partial_sum(vec.begin(), vec.end(), result.begin(),
                 std::multiplies<int>());
// result: {1, 2, 6, 24, 120}
// 1, 1*2, 1*2*3, 1*2*3*4, 1*2*3*4*5
```

## std::adjacent_difference

相邻差。

```cpp
std::vector<int> vec = {1, 3, 6, 10, 15};
std::vector<int> result(vec.size());

std::adjacent_difference(vec.begin(), vec.end(), result.begin());
// result: {1, 2, 3, 4, 5}
// 1, 3-1, 6-3, 10-6, 15-10

// 原地操作
std::adjacent_difference(vec.begin(), vec.end(), vec.begin());
// vec: {1, 2, 3, 4, 5}
```

### 自定义操作

```cpp
std::vector<int> vec = {1, 3, 6, 10, 15};
std::vector<int> result(vec.size());

// 使用乘法
std::adjacent_difference(vec.begin(), vec.end(), result.begin(),
                          std::multiplies<int>());
// result: {1, 3, 18, 60, 150}
// 1, 1*3, 3*6, 6*10, 10*15
```

## std::iota

填充递增序列（已在修改算法中介绍）。

```cpp
std::vector<int> vec(10);

std::iota(vec.begin(), vec.end(), 1);
// vec: {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

// 从任意值开始
std::iota(vec.begin(), vec.end(), 100);
// vec: {100, 101, 102, 103, 104, 105, 106, 107, 108, 109}
```

## std::gcd / std::lcm (C++17)

最大公约数和最小公倍数。

```cpp
#include <numeric>

int gcd = std::gcd(12, 18);  // 6
int lcm = std::lcm(12, 18);  // 36

// 多个数的 GCD
int gcd2 = std::gcd({12, 18, 24});  // 6
```

## std::midpoint (C++20)

中点计算。

```cpp
#include <numeric>

int mid = std::midpoint(1, 5);      // 3
double mid2 = std::midpoint(1.0, 5.0); // 3.0
```

## GCD 与 LCM 的应用

### 分数化简

```cpp
#include <numeric>

struct Fraction {
    int numerator;
    int denominator;

    void simplify() {
        int g = std::gcd(numerator, denominator);
        numerator /= g;
        denominator /= g;
    }
};

Fraction f{6, 8};
f.simplify();  // {3, 4}
```

### 计算周期

```cpp
// 两个事件的最小公共周期
int period1 = 6;  // 每 6 秒
int period2 = 8;  // 每 8 秒

int common_period = std::lcm(period1, period2);  // 24 秒
```

## 数值计算示例

### 计算多项式

```cpp
// 计算 P(x) = a₀ + a₁x + a₂x² + ...
std::vector<int> coeffs = {1, 2, 3};  // 1 + 2x + 3x²
int x = 2;

int result = std::inner_product(
    coeffs.begin(), coeffs.end(),
    std::vector<int>{1, x, x * x}.begin(),
    0
);
// 1*1 + 2*2 + 3*4 = 1 + 4 + 12 = 17
```

### 滑动窗口和

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
int window_size = 3;

std::vector<int> window_sums;
for (auto it = vec.begin(); it + window_size <= vec.end(); it++) {
    int sum = std::accumulate(it, it + window_size, 0);
    window_sums.push_back(sum);
}
// window_sums: {6, 9, 12} (1+2+3, 2+3+4, 3+4+5)
```

### 运行总和

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
std::vector<int> running_sums(vec.size());

std::partial_sum(vec.begin(), vec.end(), running_sums.begin());
// running_sums: {1, 3, 6, 10, 15}
```

### 差分序列

```cpp
std::vector<int> vec = {1, 3, 6, 10, 15};
std::vector<int> diffs(vec.size());

std::adjacent_difference(vec.begin(), vec.end(), diffs.begin());
// diffs: {1, 2, 3, 4, 5} (原始序列的一阶差分)
```

## 性能考虑

### 时间复杂度

| 算法 | 时间复杂度 |
|------|------------|
| `accumulate` | O(n) |
| `reduce` | O(n) 或 O(n log n) 并行 |
| `inner_product` | O(n) |
| `partial_sum` | O(n) |
| `adjacent_difference` | O(n) |
| `gcd` / `lcm` | O(log min(a,b)) |

### 使用建议

```cpp
// ✅ 使用 accumulate 计算和
int sum = std::accumulate(vec.begin(), vec.end(), 0);

// ✅ 使用 reduce 并行加速 (C++17)
int sum2 = std::reduce(std::execution::par, vec.begin(), vec.end());

// ✅ 使用 inner_product 计算点积
int dot = std::inner_product(v1.begin(), v1.end(), v2.begin(), 0);

// ✅ 使用 partial_sum 计算前缀和
std::partial_sum(vec.begin(), vec.end(), vec.begin());

// ✅ 使用 adjacent_difference 计算差分
std::adjacent_difference(vec.begin(), vec.end(), vec.begin());
```

---

::: tip 数值建议
- **累加使用 `accumulate`** 或 `reduce` (C++17)
- **点积使用 `inner_product`**
- **前缀和使用 `partial_sum`**
- **差分使用 `adjacent_difference`**
- **并行计算使用 `std::execution::par`**
:::
