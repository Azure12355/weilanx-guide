---
title: 运算符重载
icon: ri:calculator-line
order: 4
---

# 运算符重载

运算符重载允许为自定义类型定义运算符的行为，使代码更加直观和自然。

::: tip 核心要点
- **成员函数**重载：左操作数是当前对象
- **友元函数**重载：对称运算符推荐
- **输入输出**：重载 `<<` 和 `>>`
- **下标运算符**：重载 `[]`
:::

## 基本运算符重载

### 算术运算符

```cpp
#include <iostream>

class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 成员函数重载 +
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    // 成员函数重载 -
    Complex operator-(const Complex& other) const {
        return Complex(real - other.real, imag - other.imag);
    }

    // 友元函数重载 *（支持 Complex * double）
    friend Complex operator*(const Complex& c, double factor);
    friend Complex operator*(double factor, const Complex& c);

    void print() const {
        std::cout << real;
        if (imag >= 0) std::cout << "+";
        std::cout << imag << "i" << std::endl;
    }
};

// 友元函数实现
Complex operator*(const Complex& c, double factor) {
    return Complex(c.real * factor, c.imag * factor);
}

Complex operator*(double factor, const Complex& c) {
    return Complex(c.real * factor, c.imag * factor);
}

int main() {
    Complex c1(3, 4);
    Complex c2(1, 2);

    Complex sum = c1 + c2;
    sum.print();  // 4+6i

    Complex diff = c1 - c2;
    diff.print();  // 2+2i

    Complex scaled = c1 * 2.0;
    scaled.print();  // 6+8i

    Complex scaled2 = 2.0 * c1;
    scaled2.print();  // 6+8i

    return 0;
}
```

### 关系运算符

```cpp
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(const std::string& n, int a) : name(n), age(a) {}

    // 重载 ==
    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }

    // 重载 !=
    bool operator!=(const Person& other) const {
        return !(*this == other);
    }

    // 重载 <
    bool operator<(const Person& other) const {
        return age < other.age;
    }

    // 其他关系运算符
    bool operator>(const Person& other) const {
        return other < *this;
    }

    bool operator<=(const Person& other) const {
        return !(other < *this);
    }

    bool operator>=(const Person& other) const {
        return !(*this < other);
    }

    void print() const {
        std::cout << name << " (" << age << "岁)" << std::endl;
    }
};

int main() {
    Person p1("张三", 25);
    Person p2("李四", 30);
    Person p3("张三", 25);

    std::cout << std::boolalpha;
    std::cout << "p1 == p2: " << (p1 == p2) << std::endl;  // false
    std::cout << "p1 == p3: " << (p1 == p3) << std::endl;  // true
    std::cout << "p1 < p2: " << (p1 < p2) << std::endl;     // true

    return 0;
}
```

### 赋值运算符

```cpp
#include <iostream>
#include <algorithm>  // std::copy
#include <cstring>

class MyString {
private:
    char* data;
    size_t size;

public:
    MyString(const char* str = "") {
        size = strlen(str);
        data = new char[size + 1];
        strcpy(data, str);
    }

    // 拷贝构造函数
    MyString(const MyString& other) : size(other.size) {
        data = new char[size + 1];
        strcpy(data, other.data);
    }

    // 析构函数
    ~MyString() {
        delete[] data;
    }

    // 拷贝赋值运算符
    MyString& operator=(const MyString& other) {
        std::cout << "拷贝赋值" << std::endl;

        if (this != &other) {  // 自赋值检查
            delete[] data;      // 释放旧资源
            size = other.size;
            data = new char[size + 1];
            strcpy(data, other.data);
        }
        return *this;
    }

    // 移动构造函数 (C++11)
    MyString(MyString&& other) noexcept
        : data(other.data), size(other.size) {
        std::cout << "移动构造" << std::endl;
        other.data = nullptr;
        other.size = 0;
    }

    // 移动赋值运算符 (C++11)
    MyString& operator=(MyString&& other) noexcept {
        std::cout << "移动赋值" << std::endl;

        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }

    void print() const {
        if (data) {
            std::cout << data << std::endl;
        } else {
            std::cout << "(空)" << std::endl;
        }
    }
};

int main() {
    MyString s1("Hello");
    MyString s2("World");

    MyString s3 = s1;      // 拷贝构造
    s3.print();

    s3 = s2;               // 拷贝赋值
    s3.print();

    MyString s4 = std::move(s1);  // 移动构造
    s4.print();

    s4 = std::move(s2);           // 移动赋值
    s4.print();

    return 0;
}
```

## 下标运算符

```cpp
#include <iostream>
#include <stdexcept>
#include <vector>

class Array {
private:
    std::vector<int> data;

public:
    Array(size_t size) : data(size) {}

    // 非const 版本：可以修改
    int& operator[](size_t index) {
        if (index >= data.size()) {
            throw std::out_of_range("索引越界");
        }
        return data[index];
    }

    // const 版本：只读
    const int& operator[](size_t index) const {
        if (index >= data.size()) {
            throw std::out_of_range("索引越界");
        }
        return data[index];
    }

    size_t size() const {
        return data.size();
    }
};

int main() {
    Array arr(5);

    // 可以作为左值
    for (size_t i = 0; i < arr.size(); ++i) {
        arr[i] = static_cast<int>(i * 10);
    }

    // 可以作为右值
    for (size_t i = 0; i < arr.size(); ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;

    const Array& carr = arr;
    std::cout << "carr[0] = " << carr[0] << std::endl;
    // carr[0] = 100;  // 错误：const 版本

    return 0;
}
```

## 函数调用运算符

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

// 函数对象（仿函数）
class Multiply {
private:
    int factor;

public:
    Multiply(int f) : factor(f) {}

    // 重载 ()
    int operator()(int x) const {
        return x * factor;
    }
};

// 比较器
class DescendingCompare {
public:
    bool operator()(int a, int b) const {
        return a > b;  // 降序
    }
};

// 可变参数的函数对象
class Accumulator {
private:
    int sum;

public:
    Accumulator() : sum(0) {}

    int operator()() {
        return sum;
    }

    int operator()(int value) {
        sum += value;
        return sum;
    }
};

int main() {
    // 函数对象
    Multiply times3(3);
    std::cout << times3(5) << std::endl;  // 15

    Multiply times10(10);
    std::cout << times10(7) << std::endl;  // 70

    // 与 STL 算法配合
    std::vector<int> vec = {1, 5, 3, 9, 2};
    std::sort(vec.begin(), vec.end(), DescendingCompare());

    for (int n : vec) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    // 可变参数函数对象
    Accumulator acc;
    std::cout << acc() << std::endl;    // 0
    std::cout << acc(10) << std::endl;  // 10
    std::cout << acc(20) << std::endl;  // 30
    std::cout << acc() << std::endl;    // 30

    return 0;
}
```

## 输入输出运算符

```cpp
#include <iostream>
#include <string>

class Point {
private:
    int x, y;

public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}

    // 输出运算符（友元函数）
    friend std::ostream& operator<<(std::ostream& os, const Point& p);

    // 输入运算符（友元函数）
    friend std::istream& operator>>(std::istream& is, Point& p);
};

// 输出运算符实现
std::ostream& operator<<(std::ostream& os, const Point& p) {
    os << "(" << p.x << ", " << p.y << ")";
    return os;
}

// 输入运算符实现
std::istream& operator>>(std::istream& is, Point& p) {
    char ch;
    is >> ch;           // 读取 '('
    is >> p.x;          // 读取 x
    is >> ch;           // 读取 ','
    is >> p.y;          // 读取 y
    is >> ch;           // 读取 ')'
    return is;
}

int main() {
    Point p1(3, 4);

    // 使用重载的 <<
    std::cout << "p1 = " << p1 << std::endl;

    // 使用重载的 >>
    Point p2;
    std::cout << "输入坐标 (格式: x,y): ";
    std::cin >> p2;
    std::cout << "p2 = " << p2 << std::endl;

    return 0;
}
```

## 自增自减运算符

```cpp
#include <iostream>

class Counter {
private:
    int value;

public:
    Counter(int v = 0) : value(v) {}

    // 前置 ++（返回引用）
    Counter& operator++() {
        ++value;
        return *this;
    }

    // 后置 ++（返回旧值，使用占位参数）
    Counter operator++(int) {
        Counter temp = *this;
        ++value;
        return temp;
    }

    // 前置 --
    Counter& operator--() {
        --value;
        return *this;
    }

    // 后置 --
    Counter operator--(int) {
        Counter temp = *this;
        --value;
        return temp;
    }

    int getValue() const {
        return value;
    }
};

int main() {
    Counter c(10);

    std::cout << "初始值: " << c.getValue() << std::endl;

    // 前置：先增加，再返回
    ++c;
    std::cout << "++c: " << c.getValue() << std::endl;

    // 后置：先返回，再增加
    Counter result = c++;
    std::cout << "c++ 后的 c: " << c.getValue() << std::endl;
    std::cout << "返回值: " << result.getValue() << std::endl;

    return 0;
}
```

## 智能指针运算符

```cpp
#include <iostream>

template<typename T>
class SmartPtr {
private:
    T* ptr;

public:
    explicit SmartPtr(T* p = nullptr) : ptr(p) {}

    ~SmartPtr() {
        delete ptr;
    }

    // 禁止拷贝
    SmartPtr(const SmartPtr&) = delete;
    SmartPtr& operator=(const SmartPtr&) = delete;

    // 移动构造
    SmartPtr(SmartPtr&& other) noexcept : ptr(other.ptr) {
        other.ptr = nullptr;
    }

    // 移动赋值
    SmartPtr& operator=(SmartPtr&& other) noexcept {
        if (this != &other) {
            delete ptr;
            ptr = other.ptr;
            other.ptr = nullptr;
        }
        return *this;
    }

    // 重载 * 和 ->
    T& operator*() const {
        return *ptr;
    }

    T* operator->() const {
        return ptr;
    }

    // bool 转换
    explicit operator bool() const {
        return ptr != nullptr;
    }
};

class MyClass {
public:
    void hello() {
        std::cout << "Hello from MyClass" << std::endl;
    }
};

int main() {
    SmartPtr<MyClass> ptr(new MyClass());

    if (ptr) {
        ptr->hello();
        (*ptr).hello();
    }

    return 0;
}
```

## 转换运算符

```cpp
#include <iostream>
#include <string>

class Rational {
private:
    int numerator, denominator;

public:
    Rational(int n = 0, int d = 1) : numerator(n), denominator(d) {}

    // 转换为 double
    operator double() const {
        return static_cast<double>(numerator) / denominator;
    }

    // explicit 转换 (C++11)
    explicit operator std::string() const {
        return std::to_string(numerator) + "/" + std::to_string(denominator);
    }

    void print() const {
        std::cout << numerator << "/" << denominator << std::endl;
    }
};

int main() {
    Rational r(3, 4);

    // 隐式转换
    double d = r;
    std::cout << "r = " << d << std::endl;

    // 显式转换
    std::string s = static_cast<std::string>(r);
    std::cout << "r = " << s << std::endl;

    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **保持语义**：重载应符合运算符的自然含义
2. **对称运算符用友元**：如 `+`、`==`
3. **返回引用**：赋值、自增等运算符
4. **自赋值检查**：赋值运算符中
5. **const 正确性**：不修改对象的运算符
:::

::: warning 不可重载

- `::` 作用域解析
- `.` 成员访问
- `.*` 成员指针访问
- `?:` 条件运算符
- `sizeof` 大小运算符
- `typeid` 类型信息
:::
