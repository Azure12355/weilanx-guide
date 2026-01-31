---
title: 异常处理
icon: ri:alert-line
order: 2
---

# 异常处理

异常处理是 C++ 中处理运行时错误的机制，提供了一种结构化的错误处理方式。

::: tip 核心要点
- **try-catch**：捕获和处理异常
- **throw**：抛出异常
- **异常类**：标准异常类层次结构
- **RAII**：资源获取即初始化，异常安全
:::

## 基本异常处理

### try-catch 基础

```cpp
#include <iostream>
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("除零错误");
    }
    return a / b;
}

int main() {
    try {
        int result = divide(10, 0);
        std::cout << "结果: " << result << std::endl;
    }
    catch (const std::runtime_error& e) {
        std::cerr << "捕获异常: " << e.what() << std::endl;
    }

    return 0;
}
```

### 多个 catch 块

```cpp
#include <iostream>
#include <stdexcept>
#include <string>

void process(int choice) {
    switch (choice) {
        case 1:
            throw std::runtime_error("运行时错误");
        case 2:
            throw std::logic_error("逻辑错误");
        case 3:
            throw std::out_of_range("越界错误");
        case 4:
            throw std::invalid_argument("无效参数");
        default:
            std::cout << "正常处理" << std::endl;
    }
}

int main() {
    for (int i = 0; i <= 4; ++i) {
        try {
            process(i);
        }
        catch (const std::runtime_error& e) {
            std::cerr << "runtime_error: " << e.what() << std::endl;
        }
        catch (const std::logic_error& e) {
            std::cerr << "logic_error: " << e.what() << std::endl;
        }
        catch (const std::exception& e) {
            std::cerr << "exception: " << e.what() << std::endl;
        }
        catch (...) {
            std::cerr << "未知异常" << std::endl;
        }
    }

    return 0;
}
```

## 标准异常类

### 异常类层次结构

```cpp
#include <iostream>
#include <stdexcept>
#include <vector>

void demonstrateExceptions() {
    // std::exception：所有标准异常的基类
    // std::logic_error：程序逻辑错误（可预防）
    throw std::logic_error("逻辑错误");

    // std::runtime_error：运行时错误（难以预防）
    throw std::runtime_error("运行时错误");

    // 常用逻辑错误
    throw std::invalid_argument("无效参数");
    throw std::domain_error("域错误");
    throw std::length_error("长度错误");
    throw std::out_of_range("越界错误");

    // 常用运行时错误
    throw std::range_error("范围错误");
    throw std::overflow_error("溢出错误");
    throw std::underflow_error("下溢错误");
}

int main() {
    try {
        std::vector<int> vec;
        vec.at(10);  // 抛出 std::out_of_range
    }
    catch (const std::out_of_range& e) {
        std::cerr << "捕获越界: " << e.what() << std::endl;
    }

    return 0;
}
```

## 自定义异常类

```cpp
#include <iostream>
#include <stdexcept>
#include <string>

// 自定义异常类
class MyException : public std::exception {
private:
    std::string message;

public:
    MyException(const std::string& msg) : message(msg) {}

    // 重写 what() 函数
    const char* what() const noexcept override {
        return message.c_str();
    }
};

// 带错误代码的异常
class ErrorCodeException : public std::runtime_error {
private:
    int errorCode;

public:
    ErrorCodeException(int code, const std::string& msg)
        : std::runtime_error(msg), errorCode(code) {}

    int getErrorCode() const {
        return errorCode;
    }
};

void throwCustomException() {
    throw MyException("自定义异常消息");
}

void throwErrorCodeException() {
    throw ErrorCodeException(404, "资源未找到");
}

int main() {
    try {
        throwCustomException();
    }
    catch (const MyException& e) {
        std::cerr << "自定义异常: " << e.what() << std::endl;
    }

    try {
        throwErrorCodeException();
    }
    catch (const ErrorCodeException& e) {
        std::cerr << "错误代码: " << e.getErrorCode()
                  << ", 消息: " << e.what() << std::endl;
    }

    return 0;
}
```

## 异常安全

### RAII 与异常安全

```cpp
#include <iostream>
#include <memory>
#include <fstream>

// 异常安全的类
class ResourceManager {
private:
    int* data;
    std::ofstream file;

public:
    ResourceManager(size_t size, const std::string& filename)
        : data(nullptr), file(filename) {
        data = new int[size];
        std::cout << "资源分配成功" << std::endl;
    }

    ~ResourceManager() {
        delete[] data;
        // 文件自动关闭
        std::cout << "资源释放成功" << std::endl;
    }

    void writeToFile(int value) {
        file << value << std::endl;
    }
};

void riskyOperation() {
    ResourceManager rm(10, "test.txt");

    rm.writeToFile(42);

    // 即使抛出异常，析构函数也会被调用
    throw std::runtime_error("操作失败");
}

int main() {
    try {
        riskyOperation();
    }
    catch (const std::exception& e) {
        std::cerr << "捕获异常: " << e.what() << std::endl;
    }
    // ResourceManager 的析构函数已被调用

    return 0;
}
```

### 智能指针与异常

```cpp
#include <iostream>
#include <memory>
#include <vector>

// 使用智能指针确保异常安全
void processWithSmartPointer() {
    auto ptr = std::make_unique<int>(42);

    // 即使抛出异常，内存也会被正确释放
    throw std::runtime_error("错误");

    // unique_ptr 自动析构
}

void processWithVector() {
    std::vector<int> vec = {1, 2, 3, 4, 5};

    // vector 的析构函数会被调用
    throw std::runtime_error("错误");
}

int main() {
    try {
        processWithSmartPointer();
    }
    catch (const std::exception&) {
        std::cout << "异常已捕获，内存已释放" << std::endl;
    }

    try {
        processWithVector();
    }
    catch (const std::exception&) {
        std::cout << "异常已捕获，vector 已析构" << std::endl;
    }

    return 0;
}
```

## noexcept (C++11)

```cpp
#include <iostream>
#include <vector>

// noexcept：保证不抛出异常
int safeFunction(int x) noexcept {
    return x * 2;
}

// 条件 noexcept
template<typename T>
void process(T t) noexcept(std::is_nothrow_copy_constructible_v<T>) {
    T copy = t;
}

// 析构函数默认 noexcept (C++11)
class MyClass {
public:
    ~MyClass() noexcept {
        // 清理资源
    }
};

// 移动操作通常 noexcept
class Movable {
public:
    Movable() = default;

    Movable(Movable&& other) noexcept {
        // 移动实现
    }

    Movable& operator=(Movable&& other) noexcept {
        return *this;
    }
};

int main() {
    std::cout << "safeFunction(5) = " << safeFunction(5) << std::endl;

    int value = 42;
    process(value);

    return 0;
}
```

## 函数 try 块

```cpp
#include <iostream>
#include <stdexcept>

class MyClass {
private:
    int* data;

public:
    // 函数 try 块：捕获构造函数初始化列表中的异常
    MyClass(int size) try
        : data(new int[size]) {
        // 构造函数体
    }
    catch (const std::bad_alloc& e) {
        std::cerr << "内存分配失败: " << e.what() << std::endl;
        // 重新抛出异常
        throw;
    }

    ~MyClass() {
        delete[] data;
    }
};

int main() {
    try {
        MyClass obj(1000000000000);  // 可能抛出 bad_alloc
    }
    catch (const std::exception& e) {
        std::cerr << "构造失败: " << e.what() << std::endl;
    }

    return 0;
}
```

## 异常规范 (已弃用)

```cpp
#include <iostream>
#include <stdexcept>

// C++17 前：动态异常规范（已弃用）
void oldStyle() throw(std::runtime_error) {
    throw std::runtime_error("错误");
}

// C++11 及以后：使用 noexcept
void newStyle() noexcept {
    // 不抛出异常
}

// 条件 noexcept
template<typename T>
void conditionalNoexcept(T t) noexcept(noexcept(t.someMethod())) {
    t.someMethod();
}

// C++17：noexcept(false) 表示可能抛出异常
void mayThrow() noexcept(false) {
    throw std::runtime_error("错误");
}
```

## 使用建议

::: tip 最佳实践

1. **按值抛出，按引用捕获**：避免不必要的拷贝
2. **继承 std::exception**：自定义异常应继承标准异常
3. **RAII**：确保资源在异常时正确释放
4. **noexcept**：明确标记不抛出异常的函数
5. **异常安全**：提供强异常安全保证
:::

::: warning 注意事项

1. **异常规范**：动态异常规范已弃用
2. **构造函数**：构造函数中抛出异常可能导致对象未完全构造
3. **析构函数**：析构函数不应抛出异常
4. **性能开销**：异常处理有运行时开销
:::
