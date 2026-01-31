---
title: 函数对象
icon: devicon-plain:cplusplus
order: 1
---

# 函数对象

函数对象 (Function Object) 也称为仿函数 (Functor)，是可调用的对象，广泛用于 STL 算法中。

## 什么是函数对象

任何可以像函数一样使用的对象：

```cpp
// 普通函数
int add(int a, int b) {
    return a + b;
}

// 函数对象（仿函数）
struct Add {
    int operator()(int a, int b) const {
        return a + b;
    }
};

// lambda 表达式 (C++11)
auto lambda_add = [](int a, int b) {
    return a + b;
};

// 使用
int result1 = add(1, 2);
Add add_obj;
int result2 = add_obj(1, 2);
int result3 = lambda_add(1, 2);
```

## 标准函数对象

定义在 `<functional>` 头文件中。

### 算术运算

```cpp
#include <functional>

std::plus<int> add;
int sum = add(1, 2);  // 3

std::minus<int> subtract;
int diff = subtract(5, 3);  // 2

std::multiplies<int> multiply;
int product = multiply(3, 4);  // 12

std::divides<int> divide;
int quotient = divide(10, 2);  // 5

std::modulus<int> modulus;
int remainder = modulus(7, 3);  // 1

std::negate<int> negate;
int negated = negate(5);  // -5
```

### 比较运算

```cpp
std::equal_to<int> equal;
bool eq = equal(5, 5);  // true

std::not_equal_to<int> not_equal;
bool ne = not_equal(5, 3);  // true

std::greater<int> greater;
bool gt = greater(5, 3);  // true

std::less<int> less;
bool lt = less(3, 5);  // true

std::greater_equal<int> greater_equal;
bool ge = greater_equal(5, 5);  // true

std::less_equal<int> less_equal;
bool le = less_equal(3, 5);  // true
```

### 逻辑运算

```cpp
std::logical_and<bool> logical_and;
bool a = logical_and(true, false);  // false

std::logical_or<bool> logical_or;
bool b = logical_or(true, false);  // true

std::logical_not<bool> logical_not;
bool c = logical_not(true);  // false
```

### 位运算

```cpp
std::bit_and<int> bit_and;
int d = bit_and(5, 3);  // 1 (0101 & 0011)

std::bit_or<int> bit_or;
int e = bit_or(5, 3);  // 7 (0101 | 0011)

std::bit_xor<int> bit_xor;
int f = bit_xor(5, 3);  // 6 (0101 ^ 0011)

std::bit_not<int> bit_not;
int g = bit_not(5);  // ~5
```

## 自定义函数对象

### 基本形式

```cpp
// 可变参数
struct VariadicSum {
    int operator()(int a, int b) const {
        return a + b;
    }
};

VariadicSum sum;
int result = sum(1, 2);  // 3
```

### 带状态的函数对象

```cpp
struct RunningSum {
    int sum = 0;

    int operator()(int n) {
        sum += n;
        return sum;
    }
};

RunningSum rs;
std::cout << rs(1) << std::endl;  // 1
std::cout << rs(2) << std::endl;  // 3
std::cout << rs(3) << std::endl;  // 6
```

### 成员函数作为函数对象

```cpp
class Counter {
public:
    int increment() { return ++count; }
    int getCount() const { return count; }

private:
    int count = 0;
};

Counter c;

// 使用 std::mem_fn
auto increment_fn = std::mem_fn(&Counter::increment);
increment_fn(c);

// 使用 std::function
std::function<int(Counter*)> getCount = &Counter::getCount;
```

## std::function (C++11)

通用函数包装器。

### 基本用法

```cpp
#include <functional>

// 包装普通函数
int add(int a, int b) {
    return a + b;
}

std::function<int(int, int)> f1 = add;
int result1 = f1(1, 2);  // 3

// 包装 lambda
std::function<int(int, int)> f2 = [](int a, int b) {
    return a + b;
};
int result2 = f2(1, 2);  // 3

// 包装函数对象
struct Add {
    int operator()(int a, int b) const {
        return a + b;
    }
};

std::function<int(int, int)> f3 = Add();
int result3 = f3(1, 2);  // 3
```

### 存储回调

```cpp
class EventProcessor {
private:
    std::function<void()> callback;

public:
    void setCallback(std::function<void()> cb) {
        callback = cb;
    }

    void trigger() {
        if (callback) {
            callback();
        }
    }
};

EventProcessor ep;
ep.setCallback([]() {
    std::cout << "Event triggered!" << std::endl;
});
ep.trigger();
```

## std::bind (C++11)

绑定参数创建新函数对象。

### 基本用法

```cpp
#include <functional>

// 绑定参数
int add(int a, int b) {
    return a + b;
}

// 绑定第二个参数
auto add_five = std::bind(add, std::placeholders::_1, 5);
int result = add_five(3);  // 8 (3 + 5)

// 绑定第一个参数
auto five_add = std::bind(add, 5, std::placeholders::_1);
int result2 = five_add(3);  // 8 (5 + 3)

// 绑定所有参数
auto add_3_5 = std::bind(add, 3, 5);
int result3 = add_3_5();  // 8
```

### 占位符

```cpp
using namespace std::placeholders;

// _1, _2, _3... 表示第 1, 2, 3... 个参数
int multiply(int a, int b, int c) {
    return a * b * c;
}

auto mul_by_2 = std::bind(multiply, _1, 2, _2);
int result = mul_by_2(3, 4);  // 3 * 2 * 4 = 24

auto mul_2_by = std::bind(multiply, 2, _1, _2);
int result2 = mul_2_by(3, 4);  // 2 * 3 * 4 = 24
```

### 绑定成员函数

```cpp
class MyClass {
public:
    int add(int a, int b) {
        return a + b;
    }

    int value = 0;
};

MyClass obj;

// 绑定成员函数（需要对象或指针）
auto member_add = std::bind(&MyClass::add, &obj, _1, _2);
int result = member_add(1, 2);  // 3

// 绑定成员变量
auto get_value = std::bind(&MyClass::value, &obj);
int val = get_value();  // 0
```

## std::mem_fn (C++11)

成员函数包装器。

```cpp
#include <functional>

class MyClass {
public:
    void print() {
        std::cout << "Hello" << std::endl;
    }

    int add(int a, int b) {
        return a + b;
    }
};

MyClass obj;

// 包装成员函数
auto print_fn = std::mem_fn(&MyClass::print);
print_fn(obj);

auto add_fn = std::mem_fn(&MyClass::add);
int sum = add_fn(obj, 1, 2);  // 3
```

## Lambda 表达式 (C++11)

最常用的函数对象形式。

### 基本语法

```cpp
// 无捕获
auto lambda1 = []() {
    return 42;
};

// 捕获变量
int x = 10;
auto lambda2 = [x](int n) {
    return n + x;
};

// 引用捕获
int y = 20;
auto lambda3 = [&y](int n) {
    y += n;
    return y;
};

// 混合捕获
auto lambda4 = [x, &y](int n) {
    return x + y + n;
};

// 默认捕获
auto lambda5 = [=](int n) {
    return n + x;  // 只读
};

auto lambda6 = [&](int n) {
    x += n;  // 可修改
};
```

### 与算法配合

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// std::for_each
std::for_each(vec.begin(), vec.end(), [](int& n) {
    n *= 2;
});

// std::transform
std::transform(vec.begin(), vec.end(), vec.begin(), [](int n) {
    return n * 2;
});

// std::sort
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a > b;  // 降序
});

// std::find_if
auto it = std::find_if(vec.begin(), vec.end(), [](int n) {
    return n > 3;
});
```

### 泛型 Lambda (C++14)

```cpp
auto generic_lambda = [](auto a, auto b) {
    return a + b;
};

int i = generic_lambda(1, 2);        // int
double d = generic_lambda(1.5, 2.5); // double
```

## 返回值推导

### C++11 尾置返回类型

```cpp
auto add = [](int a, int b) -> int {
    return a + b;
};
```

### C++14 自动推导

```cpp
auto add = [](int a, int b) {
    return a + b;  // 自动推导为 int
};
```

## 可变参数模板 Lambda (C++14)

```cpp
auto print_all = [](auto... args) {
    (std::cout << ... << args) << std::endl;
};

print_all(1, "hello", 3.14);  // 1hello3.14
```

## 使用场景

### 排序

```cpp
std::vector<Person> people;

// 按年龄排序
std::sort(people.begin(), people.end(),
    [](const Person& a, const Person& b) {
        return a.age < b.age;
    });

// 按姓名排序
std::sort(people.begin(), people.end(),
    [](const Person& a, const Person& b) {
        return a.name < b.name;
    });
```

### 条件统计

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5, 6};

// 统计偶数
int even_count = std::count_if(vec.begin(), vec.end(),
    [](int n) { return n % 2 == 0; });

// 统计大于 3 的元素
int gt_count = std::count_if(vec.begin(), vec.end(),
    [](int n) { return n > 3; });
```

### 容器操作

```cpp
// 复制满足条件的元素
std::vector<int> src = {1, 2, 3, 4, 5};
std::vector<int> dest;

std::copy_if(src.begin(), src.end(), std::back_inserter(dest),
    [](int n) { return n % 2 == 0; });
// dest: {2, 4}
```

## 性能考虑

### 函数对象 vs 函数指针

```cpp
// 函数指针
bool is_even(int n) {
    return n % 2 == 0;
}

// 函数对象
struct IsEven {
    bool operator()(int n) const {
        return n % 2 == 0;
    }
};

// 函数对象可能更快（可内联）
std::vector<int> vec(1000000);
std::sort(vec.begin(), vec.end(), IsEven());  // 可能更快
```

### Lambda 捕获

```cpp
// 值捕获（拷贝）
int x = 10;
auto lambda1 = [x](int n) {
    return n + x;  // x 的副本
};

// 引用捕获（避免拷贝）
std::vector<int> vec;
auto lambda2 = [&vec]() {
    vec.push_back(42);  // 修改原 vector
};

// 初始化捕获 (C++14)
auto lambda3 = [vec = std::vector<int>{1, 2, 3}]() {
    return vec.size();
};
```

---

::: tip 函数对象建议
- **优先使用 Lambda**：简洁高效
- **标准算法用标准函数对象**：`std::less`, `std::greater` 等
- **复杂逻辑用 Lambda**：可读性更好
- **注意捕获**：引用捕获避免拷贝，但要确保对象生命周期
:::
