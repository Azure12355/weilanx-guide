---
title: 函数
icon: ri:function-line
order: 4
---

# 函数

函数是 C++ 程序的基本模块，用于封装可重用的代码逻辑。

::: tip 核心要点
- **函数声明**：声明函数原型
- **函数定义**：实现函数体
- **参数传递**：值传递、引用传递、指针传递
- **返回类型**：值返回、引用返回
:::

## 函数基础

### 函数声明与定义

```cpp
#include <iostream>

// 函数声明（函数原型）
int add(int a, int b);
void greet();
double calculate(double x, double y);

// 函数定义
int add(int a, int b) {
    return a + b;
}

void greet() {
    std::cout << "Hello, World!" << std::endl;
}

double calculate(double x, double y) {
    return x * x + y * y;
}

int main() {
    int result = add(5, 3);
    std::cout << "5 + 3 = " << result << std::endl;

    greet();

    double value = calculate(3.0, 4.0);
    std::cout << "3² + 4² = " << value << std::endl;

    return 0;
}
```

### 默认参数

```cpp
#include <iostream>
#include <string>

// 默认参数必须在参数列表末尾
void printInfo(const std::string& name = "无名氏", int age = 0) {
    std::cout << "姓名: " << name << ", 年龄: " << age << std::endl;
}

// 默认参数的函数声明
int multiply(int a, int b = 1);

int main() {
    printInfo();                    // 姓名: 无名氏, 年龄: 0
    printInfo("张三");              // 姓名: 张三, 年龄: 0
    printInfo("李四", 25);          // 姓名: 李四, 年龄: 25

    return 0;
}

// 默认参数只在声明中指定一次
int multiply(int a, int b) {
    return a * b;
}
```

### 可变参数

```cpp
#include <iostream>
#include <cstdarg>

// C 风格可变参数（不推荐）
int sumOldStyle(int count, ...) {
    va_list args;
    va_start(args, count);

    int sum = 0;
    for (int i = 0; i < count; ++i) {
        sum += va_arg(args, int);
    }

    va_end(args);
    return sum;
}

// C++11 可变参数模板
template<typename... Args>
int sum(Args... args) {
    return (args + ...);  // 折叠表达式 (C++17)
}

// 递归处理可变参数
void printAll() {
    std::cout << std::endl;
}

template<typename T, typename... Args>
void printAll(const T& first, const Args&... rest) {
    std::cout << first << " ";
    printAll(rest...);
}

// 初始化列表
template<typename T>
void printList(std::initializer_list<T> list) {
    for (const auto& item : list) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
}

int main() {
    // C 风格
    std::cout << sumOldStyle(4, 1, 2, 3, 4) << std::endl;  // 10

    // C++ 风格
    std::cout << sum(1, 2, 3, 4, 5) << std::endl;  // 15

    // 递归打印
    printAll("Hello", 42, 3.14, 'A');  // Hello 42 3.14 A

    // 初始化列表
    printList({1, 2, 3, 4, 5});  // 1 2 3 4 5

    return 0;
}
```

## 参数传递

### 值传递

```cpp
#include <iostream>

void modifyByValue(int x) {
    x = 100;  // 只修改了副本
}

void modifyArrayByValue(int arr[5]) {
    // 数组退化为指针，实际上是指针传递
    arr[0] = 100;
}

int main() {
    int num = 10;
    modifyByValue(num);
    std::cout << "num = " << num << std::endl;  // 10（未改变）

    int arr[] = {1, 2, 3, 4, 5};
    modifyArrayByValue(arr);
    std::cout << "arr[0] = " << arr[0] << std::endl;  // 100（已改变）

    return 0;
}
```

### 引用传递

```cpp
#include <iostream>
#include <string>

void modifyByReference(int& x) {
    x = 100;  // 修改原变量
}

void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

// const 引用避免拷贝
void printString(const std::string& str) {
    std::cout << str << std::endl;
    // str = "new";  // 错误：不能修改 const 引用
}

int main() {
    int num = 10;
    modifyByReference(num);
    std::cout << "num = " << num << std::endl;  // 100

    int x = 5, y = 10;
    swap(x, y);
    std::cout << "x = " << x << ", y = " << y << std::endl;  // x = 10, y = 5

    std::string s = "Hello";
    printString(s);

    return 0;
}
```

### 指针传递

```cpp
#include <iostream>

void modifyByPointer(int* ptr) {
    if (ptr) {
        *ptr = 100;  // 修改指针指向的值
    }
}

void swapByPointer(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int num = 10;
    modifyByPointer(&num);
    std::cout << "num = " << num << std::endl;  // 100

    int x = 5, y = 10;
    swapByPointer(&x, &y);
    std::cout << "x = " << x << ", y = " << y << std::endl;  // x = 10, y = 5

    return 0;
}
```

## 返回值

### 值返回

```cpp
#include <iostream>
#include <string>

// 返回基本类型
int add(int a, int b) {
    return a + b;
}

// 返回对象（可能涉及拷贝）
std::string createString() {
    return "Hello";  // RVO（返回值优化）可能消除拷贝
}

// 返回局部变量的警告
int* badFunction() {
    int local = 42;
    return &local;  // 危险：返回局部变量地址
}

int* goodFunction() {
    int* ptr = new int(42);
    return ptr;  // OK：但需要手动释放
}

int main() {
    int result = add(5, 3);
    std::cout << "5 + 3 = " << result << std::endl;

    std::string str = createString();
    std::cout << str << std::endl;

    // int* bad = badFunction();  // 未定义行为
    // std::cout << *bad << std::endl;

    int* good = goodFunction();
    std::cout << *good << std::endl;
    delete good;  // 记得释放

    return 0;
}
```

### 引用返回

```cpp
#include <iostream>
#include <array>

class Container {
private:
    std::array<int, 5> data = {1, 2, 3, 4, 5};

public:
    // 返回引用，可以修改
    int& operator[](size_t index) {
        return data[index];
    }

    // const 引用，只读
    const int& operator[](size_t index) const {
        return data[index];
    }

    // 返回局部变量的引用是错误的
    // int& getLocal() {
    //     int local = 42;
    //     return local;  // 错误
    // }
};

int& getGlobalRef() {
    static int global = 42;
    return global;  // OK：返回静态变量的引用
}

int main() {
    Container container;

    // 可以作为左值
    container[2] = 999;
    std::cout << "container[2] = " << container[2] << std::endl;  // 999

    // 只读访问
    const Container& c = container;
    std::cout << "c[2] = " << c[2] << std::endl;  // 999

    return 0;
}
```

## 函数重载

```cpp
#include <iostream>
#include <string>

// 函数重载：同名函数，不同参数列表
int add(int a, int b) {
    std::cout << "int 版本" << std::endl;
    return a + b;
}

double add(double a, double b) {
    std::cout << "double 版本" << std::endl;
    return a + b;
}

std::string add(const std::string& a, const std::string& b) {
    std::cout << "string 版本" << std::endl;
    return a + b;
}

// 参数数量不同
int multiply(int a) {
    return a * 2;
}

int multiply(int a, int b) {
    return a * b;
}

// 参数顺序不同
void print(int a, double b) {
    std::cout << "int: " << a << ", double: " << b << std::endl;
}

void print(double a, int b) {
    std::cout << "double: " << a << ", int: " << b << std::endl;
}

int main() {
    add(1, 2);        // int 版本
    add(1.5, 2.5);    // double 版本
    add("A", "B");    // string 版本

    multiply(5);      // 10
    multiply(5, 3);   // 15

    print(1, 2.5);    // int: 1, double: 2.5
    print(1.5, 2);    // double: 1.5, int: 2

    return 0;
}
```

## 内联函数

```cpp
#include <iostream>

// 内联函数建议编译器展开代码
inline int square(int x) {
    return x * x;
}

// 短小的函数适合内联
inline int max(int a, int b) {
    return (a > b) ? a : b;
}

// 复杂的函数通常不会被内联
int complexCalculation(int n) {
    int result = 0;
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            result += i * j;
        }
    }
    return result;
}

int main() {
    int x = 5;
    std::cout << "square(" << x << ") = " << square(x) << std::endl;
    std::cout << "max(10, 20) = " << max(10, 20) << std::endl;

    return 0;
}
```

## Lambda 表达式 (C++11)

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    // 基本 lambda
    auto lambda1 = []() {
        std::cout << "Hello, Lambda!" << std::endl;
    };
    lambda1();

    // 带参数
    auto lambda2 = [](int a, int b) {
        return a + b;
    };
    std::cout << "5 + 3 = " << lambda2(5, 3) << std::endl;

    // 捕获变量
    int x = 10, y = 20;

    // 值捕获
    auto lambda3 = [x, y]() {
        std::cout << "x = " << x << ", y = " << y << std::endl;
    };
    lambda3();

    // 引用捕获
    auto lambda4 = [&x, &y]() {
        x = 100;
        y = 200;
    };
    lambda4();
    std::cout << "x = " << x << ", y = " << y << std::endl;

    // 默认捕获
    auto lambda5 = [=]() {  // 全部值捕获
        std::cout << x << ", " << y << std::endl;
    };

    auto lambda6 = [&]() {  // 全部引用捕获
        x++;
        y++;
    };

    // 可变 lambda
    auto lambda7 = [x]() mutable {
        x++;  // 可以修改捕获的副本
        std::cout << "lambda7: x = " << x << std::endl;
    };
    lambda7();

    // 与 STL 算法配合
    std::vector<int> vec = {1, 2, 3, 4, 5};
    std::for_each(vec.begin(), vec.end(), [](int& n) {
        n *= 2;
    });

    std::cout << "向量: ";
    for (int n : vec) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

## 函数指针

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}

int main() {
    // 函数指针声明
    int (*funcPtr)(int, int) = add;

    // 使用函数指针
    std::cout << "5 + 3 = " << funcPtr(5, 3) << std::endl;  // 8

    // 函数指针数组
    int (*operations[3])(int, int) = {add, subtract, multiply};

    for (int i = 0; i < 3; ++i) {
        std::cout << "operations[" << i << "](10, 5) = "
                  << operations[i](10, 5) << std::endl;
    }

    // typedef/using 简化
    using Operation = int(*)(int, int);
    Operation op = subtract;
    std::cout << "10 - 5 = " << op(10, 5) << std::endl;

    // 作为函数参数
    auto compute = [](int (*op)(int, int), int a, int b) {
        return op(a, b);
    };
    std::cout << "compute(add, 5, 3) = " << compute(add, 5, 3) << std::endl;

    return 0;
}
```

## std::function (C++11)

```cpp
#include <iostream>
#include <functional>

int add(int a, int b) {
    return a + b;
}

struct Multiplier {
    int operator()(int a, int b) {
        return a * b;
    }
};

int main() {
    // std::function 可以存储任何可调用对象
    std::function<int(int, int)> func1 = add;
    std::cout << "func1(5, 3) = " << func1(5, 3) << std::endl;

    // lambda
    std::function<int(int, int)> func2 = [](int a, int b) {
        return a - b;
    };
    std::cout << "func2(5, 3) = " << func2(5, 3) << std::endl;

    // 函数对象
    std::function<int(int, int)> func3 = Multiplier();
    std::cout << "func3(5, 3) = " << func3(5, 3) << std::endl;

    // 空的 function
    std::function<int(int, int)> func4;
    if (!func4) {
        std::cout << "func4 为空" << std::endl;
    }

    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **传 const 引用**：大对象参数使用 `const T&`
2. **返回 const 引用**：大对象返回时避免拷贝
3. **使用 lambda**：简短回调用 lambda 表达式
4. **std::function**：需要存储可调用对象时使用
5. **内联小函数**：频繁调用的小函数标记 inline
:::

::: warning 常见错误

1. **返回局部变量引用**：未定义行为
2. **重载歧义**：参数类型过于相似
3. **默认参数重复**：声明和定义都指定默认参数
4. **函数指针类型错误**：函数签名不匹配
:::
