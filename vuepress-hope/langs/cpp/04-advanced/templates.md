---
title: 模板
icon: ri:code-s-slash-line
order: 1
---

# 模板

模板是 C++ 泛型编程的基础，允许编写与类型无关的代码。

::: tip 核心要点
- **函数模板**：泛型函数
- **类模板**：泛型类
- **模板特化**：特定类型专门实现
- **模板参数**：类型参数、非类型参数、模板模板参数
:::

## 函数模板

### 基本函数模板

```cpp
#include <iostream>

// 函数模板
template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// 多个类型参数
template<typename T, typename U>
auto add(T t, U u) -> decltype(t + u) {
    return t + u;
}

// 使用
int main() {
    // 显式指定模板参数
    std::cout << maximum<int>(5, 10) << std::endl;      // 10

    // 隐式推导模板参数
    std::cout << maximum(3.14, 2.71) << std::endl;      // 3.14
    std::cout << maximum('a', 'z') << std::endl;        // z

    // 不同类型
    std::cout << add(5, 3.14) << std::endl;             // 8.14
    std::cout << add(3.14, 5) << std::endl;             // 8.14

    return 0;
}
```

### 模板参数推导 (C++17)

```cpp
#include <iostream>
#include <string>

// C++17：推导指南
template<typename T>
class Box {
private:
    T value;

public:
    Box(T v) : value(v) {}

    T get() const { return value; }
};

// C++17：类模板参数推导
Box(int) -> Box<int>;
Box(double) -> Box<double>;
Box(const char*) -> Box<std::string>;

int main() {
    // C++17 可以省略模板参数
    Box b1(42);           // 推导为 Box<int>
    Box b2(3.14);         // 推导为 Box<double>
    Box b3("Hello");      // 推导为 Box<std::string>

    std::cout << b1.get() << std::endl;
    std::cout << b2.get() << std::endl;
    std::cout << b3.get() << std::endl;

    return 0;
}
```

## 类模板

### 基本类模板

```cpp
#include <iostream>
#include <algorithm>

template<typename T>
class Stack {
private:
    T* data;
    size_t size;
    size_t capacity;

public:
    Stack(size_t initialCapacity = 10)
        : size(0), capacity(initialCapacity) {
        data = new T[capacity];
    }

    ~Stack() {
        delete[] data;
    }

    void push(const T& value) {
        if (size >= capacity) {
            resize(capacity * 2);
        }
        data[size++] = value;
    }

    T pop() {
        if (size == 0) {
            throw std::runtime_error("Stack 为空");
        }
        return data[--size];
    }

    bool isEmpty() const {
        return size == 0;
    }

    size_t getSize() const {
        return size;
    }

private:
    void resize(size_t newCapacity) {
        T* newData = new T[newCapacity];
        std::copy(data, data + size, newData);
        delete[] data;
        data = newData;
        capacity = newCapacity;
    }
};

int main() {
    Stack<int> intStack;
    intStack.push(1);
    intStack.push(2);
    intStack.push(3);

    while (!intStack.isEmpty()) {
        std::cout << intStack.pop() << " ";
    }
    std::cout << std::endl;

    Stack<std::string> stringStack;
    stringStack.push("Hello");
    stringStack.push("World");

    while (!stringStack.isEmpty()) {
        std::cout << stringStack.pop() << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

### 默认模板参数

```cpp
#include <iostream>
#include <vector>

// 默认类型参数
template<typename T = int>
class Number {
private:
    T value;

public:
    Number(T v) : value(v) {}
    void print() const {
        std::cout << value << std::endl;
    }
};

// 默认非类型参数
template<typename T, size_t Size = 10>
class Array {
private:
    T data[Size];

public:
    size_t size() const {
        return Size;
    }

    T& operator[](size_t index) {
        return data[index];
    }
};

int main() {
    // 使用默认类型
    Number<> n1(42);     // Number<int>
    Number<double> n2(3.14);

    n1.print();
    n2.print();

    // 使用默认大小
    Array<int, 5> arr1;
    Array<int> arr2;     // Array<int, 10>

    std::cout << "arr1.size() = " << arr1.size() << std::endl;
    std::cout << "arr2.size() = " << arr2.size() << std::endl;

    return 0;
}
```

## 模板特化

### 全特化与偏特化

```cpp
#include <iostream>

// 主模板
template<typename T, typename U>
struct Pair {
    T first;
    U second;

    Pair(T f, U s) : first(f), second(s) {}

    void print() const {
        std::cout << "Pair<T, U>: " << first << ", " << second << std::endl;
    }
};

// 全特化：两个类型都是 int
template<>
struct Pair<int, int> {
    int first;
    int second;

    Pair(int f, int s) : first(f), second(s) {}

    void print() const {
        std::cout << "Pair<int, int>: " << first << " + " << second
                  << " = " << (first + second) << std::endl;
    }
};

// 偏特化：第二个类型是指针
template<typename T, typename U>
struct Pair<T, U*> {
    T first;
    U* second;

    Pair(T f, U* s) : first(f), second(s) {}

    void print() const {
        std::cout << "Pair<T, U*>: " << first << ", " << *second << std::endl;
    }
};

int main() {
    Pair<int, double> p1(1, 2.5);
    p1.print();  // Pair<T, U>

    Pair<int, int> p2(3, 4);
    p2.print();  // Pair<int, int>

    int value = 100;
    Pair<int, int*> p3(5, &value);
    p3.print();  // Pair<T, U*>

    return 0;
}
```

### 函数模板特化

```cpp
#include <iostream>
#include <cstring>

// 主模板
template<typename T>
bool equal(T a, T b) {
    return a == b;
}

// 特化：C 字符串
template<>
bool equal<const char*>(const char* a, const char* b) {
    return strcmp(a, b) == 0;
}

// 或者使用重载（推荐）
bool equal(const char* a, const char* b) {
    return strcmp(a, b) == 0;
}

int main() {
    std::cout << std::boolalpha;

    std::cout << equal(5, 5) << std::endl;           // true
    std::cout << equal(3.14, 2.71) << std::endl;     // false
    std::cout << equal("hello", "hello") << std::endl; // true

    return 0;
}
```

## 非类型模板参数

```cpp
#include <iostream>

template<typename T, size_t N>
class FixedArray {
private:
    T data[N];

public:
    size_t size() const {
        return N;
    }

    T& operator[](size_t index) {
        return data[index];
    }

    const T& operator[](size_t index) const {
        return data[index];
    }
};

// 非类型模板参数：编译期常量
template<int Value>
struct Factorial {
    static const int value = Factorial<Value - 1>::value * Value;
};

// 特化：终止条件
template<>
struct Factorial<0> {
    static const int value = 1;
};

int main() {
    // 非类型模板参数
    FixedArray<int, 5> arr;
    for (size_t i = 0; i < arr.size(); ++i) {
        arr[i] = static_cast<int>(i * 10);
    }

    for (size_t i = 0; i < arr.size(); ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;

    // 编译期计算
    constexpr int fact5 = Factorial<5>::value;
    std::cout << "5! = " << fact5 << std::endl;  // 120

    return 0;
}
```

## 可变参数模板 (C++11)

```cpp
#include <iostream>
#include <utility>

// 递归终止条件
void printAll() {
    std::cout << std::endl;
}

// 可变参数模板
template<typename T, typename... Args>
void printAll(const T& first, const Args&... rest) {
    std::cout << first << " ";
    printAll(rest...);  // 递归展开
}

// 折叠表达式 (C++17)
template<typename... Args>
auto sum(Args... args) {
    return (args + ...);  // 折叠求和
}

template<typename... Args>
void printAll17(Args... args) {
    (std::cout << ... << args) << std::endl;  // 折叠输出
}

// 完美转发
template<typename... Args>
void forwardAll(Args&&... args) {
    printAll(std::forward<Args>(args)...);
}

int main() {
    // 可变参数模板
    printAll(1, 2.5, "Hello", 'A');

    // 折叠表达式
    std::cout << "sum(1, 2, 3, 4, 5) = " << sum(1, 2, 3, 4, 5) << std::endl;

    // C++17 折叠输出
    printAll17("A", "B", "C");

    // 完美转发
    forwardAll(42, 3.14, "World");

    return 0;
}
```

## 模板成员函数

```cpp
#include <iostream>
#include <vector>

class MyClass {
public:
    // 模板成员函数
    template<typename T>
    void print(const T& value) {
        std::cout << value << std::endl;
    }

    template<typename T>
    T add(T a, T b) {
        return a + b;
    }
};

int main() {
    MyClass obj;

    obj.print(42);        // int
    obj.print(3.14);      // double
    obj.print("Hello");   // const char*

    std::cout << obj.add(5, 3) << std::endl;       // 8
    std::cout << obj.add(2.5, 1.5) << std::endl;  // 4

    return 0;
}
```

## 概念约束 (C++20)

```cpp
#include <iostream>
#include <concepts>

// 定义概念
template<typename T>
concept Integral = std::is_integral_v<T>;

template<typename T>
concept Number = requires(T t) {
    t + t;
    t - t;
    t * t;
    t / t;
};

// 使用概念约束模板
template<Integral T>
T add(T a, T b) {
    return a + b;
}

// requires 子句
template<typename T>
requires Number<T>
T multiply(T a, T b) {
    return a * b;
}

// 简写语法
Number auto divide(Number auto a, Number auto b) {
    return a / b;
}

int main() {
    std::cout << add(5, 3) << std::endl;       // OK
    // add(5.5, 3.3);  // 错误：不是整型

    std::cout << multiply(5, 3) << std::endl;  // OK
    std::cout << multiply(2.5, 1.5) << std::endl;  // OK

    std::cout << divide(10, 2) << std::endl;   // OK
    std::cout << divide(10.0, 2.0) << std::endl;  // OK

    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **优先使用函数模板**：避免代码重复
2. **特化谨慎使用**：通常重载更好
3. **概念约束**：C++20 使用概念提高可读性
4. **折叠表达式**：简化可变参数处理
5. **constexpr 模板**：实现编译期计算
:::

::: warning 注意事项

1. **模板代码膨胀**：每个实例化生成一份代码
2. **编译错误复杂**：模板错误信息难以理解
3. **分离编译**：模板通常在头文件中
4. **递归深度**：可变参数递归注意深度限制
:::
