---
title: 现代 C++ (C++11/14/17/20)
icon: devicon-plain:cplusplus
order: 1
---

# 现代 C++ 特性

## C++11 核心特性

### 类型推导

#### auto

```cpp
// 自动推导类型
auto i = 42;                    // int
auto d = 3.14;                  // double
auto& ref = i;                  // int&
auto const* ptr = &i;           // const int*

// 范围 for 循环
std::vector<int> vec = {1, 2, 3, 4, 5};
for (auto item : vec) {
    std::cout << item << " ";
}

// 避免拷贝
for (const auto& item : vec) {
    std::cout << item << " ";
}

// 函数返回值
auto add(int a, int b) -> int {  // 尾置返回类型
    return a + b;
}
```

#### decltype

```cpp
int x = 42;
decltype(x) y = 100;  // y 的类型是 int

// 用于模板
template<typename T, typename U>
auto add(T t, U u) -> decltype(t + u) {
    return t + u;
}
```

#### decltype(auto) (C++14)

```cpp
// 返回值类型推导
decltype(auto) getElement() {
    static int value = 42;
    return (value);  // 返回引用
}
```

### 范围 for 循环

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// 只读遍历
for (const auto& item : vec) {
    std::cout << item << " ";
}

// 修改遍历
for (auto& item : vec) {
    item *= 2;
}

// 初始化列表遍历
for (auto x : {1, 2, 3, 4, 5}) {
    std::cout << x << " ";
}
```

### Lambda 表达式

```cpp
// 基本语法
auto lambda = [](int a, int b) -> int {
    return a + b;
};

// 简化（返回类型自动推导）
auto add = [](int a, int b) {
    return a + b;
};

// 捕获变量
int x = 10, y = 20;

// 值捕获
auto f1 = [x, y]() {
    return x + y;  // x, y 的副本
};

// 引用捕获
auto f2 = [&x, &y]() {
    x = 100;  // 修改原变量
    return x + y;
};

// 混合捕获
auto f3 = [x, &y]() {
    return x + y;
};

// 默认捕获
auto f4 = [=]() {     // 全部值捕获
    return x + y;
};
auto f5 = [&]() {     // 全部引用捕获
    return x + y;
};

// 可变 lambda
auto f6 = [x]() mutable {
    x++;  // 可以修改捕获的副本
    return x;
};

// 与 STL 算法配合
std::vector<int> vec = {1, 2, 3, 4, 5};
std::for_each(vec.begin(), vec.end(), [](int& n) {
    n *= 2;
});

// 排序
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a > b;  // 降序
});

// 查找
auto it = std::find_if(vec.begin(), vec.end(), [](int n) {
    return n > 3;
});
```

### 智能指针

```cpp
#include <memory>

// unique_ptr - 独占所有权
std::unique_ptr<int> ptr1(new int(42));
std::unique_ptr<int> ptr2 = std::make_unique<int>(42);  // C++14 推荐

std::unique_ptr<int> ptr3 = std::move(ptr1);  // 所有权转移

// shared_ptr - 共享所有权
std::shared_ptr<int> sp1 = std::make_shared<int>(42);
std::shared_ptr<int> sp2 = sp1;  // 引用计数 +1

std::cout << sp1.use_count() << std::endl;  // 2

// weak_ptr - 弱引用
std::weak_ptr<int> wp = sp1;
if (auto locked = wp.lock()) {
    std::cout << *locked << std::endl;
}
```

### 右值引用与移动

```cpp
// 左值与右值
int x = 10;       // x 是左值
int& lref = x;    // 左值引用
int&& rref = 10;  // 右值引用

// 移动构造函数
class MyClass {
private:
    int* data;
    size_t size;

public:
    // 拷贝构造函数
    MyClass(const MyClass& other) : size(other.size) {
        data = new int[size];
        std::copy(other.data, other.data + size, data);
    }

    // 移动构造函数
    MyClass(MyClass&& other) noexcept
        : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
    }

    // 移动赋值运算符
    MyClass& operator=(MyClass&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
};

// std::move
MyClass obj1;
MyClass obj2 = std::move(obj1);  // 移动而非拷贝
```

### constexpr

```cpp
// 编译期常量
constexpr int square(int x) {
    return x * x;
}

constexpr int value = square(5);  // 编译期计算

int arr[square(3)];  // 编译期常量可作数组大小

// constexpr 函数 (C++14)
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}

constexpr int fact5 = factorial(5);  // 编译期计算 120
```

### nullptr

```cpp
// 代替 NULL 或 0
void func(int* ptr) {
    if (ptr == nullptr) {
        // ...
    }
}

func(nullptr);  // 清晰明确
```

### 枚举类

```cpp
// 传统 enum（污染命名空间）
enum Color {
    RED,
    GREEN,
    BLUE
};

// enum class（强类型枚举）
enum class Color {
    RED,
    GREEN,
    BLUE
};

Color c = Color::RED;  // 需要作用域

// 指定底层类型
enum class Color : uint8_t {
    RED = 0,
    GREEN = 1,
    BLUE = 2
};
```

### static_assert

```cpp
// 编译期断言
static_assert(sizeof(int) == 4, "int must be 4 bytes");

template<typename T>
void checkType() {
    static_assert(std::is_integral<T>::value, "T must be integral");
}
```

### 别名声明

```cpp
// typedef 旧式
typedef int (*FuncPtr)(int, int);

// using 新式 (C++11)
using FuncPtr = int(*)(int, int);

// 模板别名
template<typename T>
using Vec = std::vector<T>;

Vec<int> vec = {1, 2, 3, 4, 5};
```

### 默认函数

```cpp
class MyClass {
public:
    // 禁用拷贝
    MyClass(const MyClass&) = delete;
    MyClass& operator=(const MyClass&) = delete;

    // 默认构造
    MyClass() = default;

    // 默认析构
    ~MyClass() = default;
};
```

## C++14 新增特性

### 函数返回值推导

```cpp
// 自动推导返回类型
auto add(int a, int b) {
    return a + b;  // 推导为 int
}

auto get_string() {
    return "Hello";  // 推导为 const char*
}
```

### 泛型 lambda

```cpp
auto lambda = [](auto x, auto y) {
    return x + y;
};

lambda(1, 2);       // int
lambda(1.5, 2.5);   // double
```

### 二进制字面量

```cpp
int bin = 0b101010;     // 42
int mask = 0b11110000;  // 240
```

### 数字分隔符

```cpp
int million = 1'000'000;
double pi = 3.141'592'653;
```

### std::make_unique

```cpp
// 创建 unique_ptr 的推荐方式
auto ptr = std::make_unique<int>(42);

// 等价于
std::unique_ptr<int> ptr(new int(42));
```

## C++17 新增特性

### 结构化绑定

```cpp
// 解构 pair
std::pair<int, std::string> p = {42, "Hello"};
auto [num, str] = p;

// 解构 tuple
std::tuple<int, double, std::string> t = {1, 3.14, "World"};
auto [i, d, s] = t;

// 解构数组
int arr[3] = {1, 2, 3};
auto [x, y, z] = arr;

// 解构结构体
struct Point {
    int x, y;
};
Point p = {10, 20};
auto [px, py] = p;

// 范围 for 配合
std::map<std::string, int> m = {{"Alice", 25}, {"Bob", 30}};
for (const auto& [name, age] : m) {
    std::cout << name << ": " << age << std::endl;
}
```

### if 初始化语句

```cpp
// 变量声明与条件结合
if (auto it = map.find(key); it != map.end()) {
    // it 在此作用域内可用
    std::cout << it->second << std::endl;
}

// 配合锁
if (std::lock_guard<std::mutex> lock(mtx); ready) {
    // 临界区
}
```

### std::optional

```cpp
#include <optional>

std::optional<int> divide(int a, int b) {
    if (b == 0) {
        return std::nullopt;  // 表示无值
    }
    return a / b;
}

auto result = divide(10, 2);
if (result) {
    std::cout << *result << std::endl;
} else {
    std::cout << "除零错误" << std::endl;
}

// 提供默认值
int value = result.value_or(0);
```

### std::variant

```cpp
#include <variant>

std::variant<int, double, std::string> var;

var = 42;
std::cout << std::get<int>(var) << std::endl;

var = 3.14;
std::cout << std::get<double>(var) << std::endl;

var = "Hello";
std::cout << std::get<std::string>(var) << std::endl;

// 访问者模式
std::visit([](auto&& arg) {
    std::cout << arg << std::endl;
}, var);
```

### std::any

```cpp
#include <any>

std::any a = 42;
a = 3.14;
a = "Hello";

// 类型安全的访问
if (a.type() == typeid(int)) {
    int value = std::any_cast<int>(a);
}

// 使用 any_cast
try {
    std::string s = std::any_cast<std::string>(a);
} catch (const std::bad_any_cast& e) {
    std::cout << "类型错误" << std::endl;
}
```

### 折叠表达式

```cpp
// 参数包折叠
template<typename... Args>
auto sum(Args... args) {
    return (args + ...);  // 折叠求和
}

int total = sum(1, 2, 3, 4, 5);  // 15

// 打印所有参数
template<typename... Args>
void print(Args... args) {
    (std::cout << ... << args) << std::endl;
}

print(1, " ", 2.5, " ", "Hello");  // 1 2.5 Hello
```

### 内联变量

```cpp
// 头文件中
struct MyClass {
    static inline int value = 42;  // C++17 内联变量
};

// 不再需要在 .cpp 中定义
```

### std::string_view

```cpp
#include <string_view>

// 避免字符串拷贝
void printString(std::string_view str) {
    std::cout << str << std::endl;
}

std::string s = "Hello";
printString(s);           // OK
printString("World");     // OK
printString(std::string_view(s.data(), 3));  // "Hel"
```

## C++20 新增特性

### 概念 (Concepts)

```cpp
#include <concepts>

// 定义概念
template<typename T>
concept Integral = std::is_integral_v<T>;

// 使用概念约束模板
template<Integral T>
T add(T a, T b) {
    return a + b;
}

// requires 子句
template<typename T>
requires std::is_integral_v<T>
T multiply(T a, T b) {
    return a * b;
}
```

### 模块 (Modules)

```cpp
// hello.ixx (模块接口)
export module hello;

export void say_hello() {
    std::cout << "Hello, Modules!" << std::endl;
}

// main.cpp
import hello;

int main() {
    say_hello();
}
```

### 协程 (Coroutines)

```cpp
// Generator 协程
generator<int> range(int start, int end) {
    while (start < end) {
        co_yield start++;
    }
}

for (int n : range(1, 5)) {
    std::cout << n << " ";  // 1 2 3 4
}
```

### 范围 (Ranges)

```cpp
#include <ranges>

std::vector<int> vec = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// 过滤偶数
auto evens = vec | std::views::filter([](int n) {
    return n % 2 == 0;
});

// 变换
auto squared = vec | std::views::transform([](int n) {
    return n * n;
});

// 链式操作
auto result = vec
    | std::views::filter([](int n) { return n % 2 == 0; })
    | std::views::transform([](int n) { return n * 2; });
```

### 三向比较

```cpp
struct Point {
    int x, y;

    // 自动生成比较运算符
    auto operator<=>(const Point&) const = default;
};

Point p1{1, 2};
Point p2{1, 3};

if (p1 < p2) {
    std::cout << "p1 < p2" << std::endl;
}
```

### std::format

```cpp
#include <format>

// 格式化字符串
std::string msg = std::format("Hello, {}!", "World");

// 带索引
std::string s = std::format("{0} {1} {0}", "A", "B");  // "A B A"

// 格式化选项
std::string num = std::format("{:d}", 42);       // "42"
std::string hex = std::format("{:x}", 255);      // "ff"
std::string pi = std::format("{:.2f}", 3.14159); // "3.14"
```

### consteval 函数

```cpp
// 强制编译期求值
consteval int square(int x) {
    return x * x;
}

constexpr int val = square(5);  // OK
int runtime = 10;
// int result = square(runtime);  // 错误！不是常量
```

### constinit

```cpp
// 强制编译期初始化
constinit int global = 42;

// 确保静态变量在编译期初始化
constinit static int value = 100;
```

### std::span

```cpp
#include <span>

void print_span(std::span<int> s) {
    for (int x : s) {
        std::cout << x << " ";
    }
}

int arr[] = {1, 2, 3, 4, 5};
std::vector<int> vec = {1, 2, 3, 4, 5};

print_span(arr);  // OK
print_span(vec);  // OK
```

### contains 成员函数

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// 代替 find() != end()
if (std::ranges::contains(vec, 3)) {
    std::cout << "包含 3" << std::endl;
}

std::map<std::string, int> map = {{"a", 1}, {"b", 2}};
if (map.contains("a")) {
    std::cout << "包含 a" << std::endl;
}
```

---

::: tip 现代 C++ 建议
- 使用 `auto` 简化类型声明
- 优先使用 `std::unique_ptr` 管理动态内存
- 使用 Lambda 表达式替代函数对象
- 使用 `std::optional` 处理可选值
- 使用 `std::string_view` 避免字符串拷贝
- 使用结构化绑定简化代码
:::
