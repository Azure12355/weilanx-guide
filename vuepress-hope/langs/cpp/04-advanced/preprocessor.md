---
title: 预处理器与编译指令
icon: ri:code-s-slash-line
order: 3
---

# 预处理器与编译指令

预处理器在编译前处理源代码，提供宏定义、条件编译、文件包含等功能。

::: tip 核心要点
- **#define/#undef**：宏定义与取消
- **#ifdef/#ifndef/#endif**：条件编译
- **#include**：文件包含
- **#pragma**：编译器指令
:::

## 宏定义

### 基本宏定义

```cpp
#include <iostream>

// 简单宏
#define PI 3.14159265
#define MAX_SIZE 100

// 带参数的宏
#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

// 多行宏
#define PRINT_INFO(name, age) \
    std::cout << "姓名: " << name << ", 年龄: " << age << std::endl

// 字符串化
#define STRINGIFY(x) #x
#define CONCAT(a, b) a##b

// 取消宏定义
#undef MAX_SIZE

int main() {
    // 使用宏
    std::cout << "PI = " << PI << std::endl;

    int result = SQUARE(5);
    std::cout << "SQUARE(5) = " << result << std::endl;

    int maxValue = MAX(10, 20);
    std::cout << "MAX(10, 20) = " << maxValue << std::endl;

    PRINT_INFO("张三", 25);

    // 字符串化
    std::cout << STRINGIFY(Hello World) << std::endl;

    // 标记连接
    int xy = 100;
    std::cout << CONCAT(x, y) << std::endl;  // 输出 xy 的值

    return 0;
}
```

### 宏 vs 内联函数 vs constexpr

```cpp
#include <iostream>

// 宏：无类型检查，文本替换
#define SQUARE_MACRO(x) ((x) * (x))

// 内联函数：有类型检查
inline int squareInline(int x) {
    return x * x;
}

// constexpr：编译期计算
constexpr int squareConstexpr(int x) {
    return x * x;
}

int main() {
    int a = 5;

    // 宏：注意副作用
    int result1 = SQUARE_MACRO(a++);  // 宏展开为 ((a++) * (a++))
    std::cout << "SQUARE_MACRO(a++) = " << result1 << ", a = " << a << std::endl;

    a = 5;
    int result2 = squareInline(a++);  // 函数调用，a 只增加一次
    std::cout << "squareInline(a++) = " << result2 << ", a = " << a << std::endl;

    // constexpr：编译期常量
    constexpr int result3 = squareConstexpr(10);
    int arr[squareConstexpr(3)];  // 可用于数组大小

    return 0;
}
```

## 条件编译

### #ifdef/#ifndef/#endif

```cpp
#include <iostream>

// 定义宏
#define DEBUG_MODE
#define VERSION 2

// 条件编译
#ifdef DEBUG_MODE
    #define LOG(msg) std::cout << "[DEBUG] " << msg << std::endl
#else
    #define LOG(msg)
#endif

// 头文件保护
#ifndef MY_HEADER_H
#define MY_HEADER_H

    // 头文件内容

#endif  // MY_HEADER_H

// #if/#elif/#else/#endif
#if VERSION == 1
    void version1() {
        std::cout << "版本 1" << std::endl;
    }
#elif VERSION == 2
    void version2() {
        std::cout << "版本 2" << std::endl;
    }
#else
    void versionDefault() {
        std::cout << "默认版本" << std::endl;
    }
#endif

// defined 运算符
#if defined(DEBUG_MODE) && defined(VERSION)
    void combinedCheck() {
        std::cout << "DEBUG_MODE 和 VERSION 都定义了" << std::endl;
    }
#endif

int main() {
    LOG("程序启动");

#if VERSION == 2
    version2();
#elif VERSION == 1
    version1();
#else
    versionDefault();
#endif

#if defined(DEBUG_MODE) && defined(VERSION)
    combinedCheck();
#endif

    return 0;
}
```

### 平台相关编译

```cpp
#include <iostream>

// 跨平台代码
void platformSpecific() {
#if defined(_WIN32) || defined(_WIN64)
    std::cout << "Windows 平台" << std::endl;
#elif defined(__linux__)
    std::cout << "Linux 平台" << std::endl;
#elif defined(__APPLE__)
    std::cout << "macOS 平台" << std::endl;
#else
    std::cout << "未知平台" << std::endl;
#endif
}

// 编译器相关
void compilerSpecific() {
#if defined(__GNUC__)
    std::cout << "GCC 编译器" << std::endl;
#elif defined(_MSC_VER)
    std::cout << "MSVC 编译器" << std::endl;
#elif defined(__clang__)
    std::cout << "Clang 编译器" << std::endl;
#endif
}

int main() {
    platformSpecific();
    compilerSpecific();
    return 0;
}
```

## 文件包含

### #include 指令

```cpp
// 系统头文件：<> 在系统路径中查找
#include <iostream>
#include <vector>
#include <string>

// 用户头文件："" 在当前目录和指定路径中查找
#include "myheader.h"
#include "../utils/helper.h"

// 防止重复包含
#ifndef MY_CLASS_H
#define MY_CLASS_H

class MyClass {
    // 类定义
};

#endif  // MY_CLASS_H

// 或者使用 #pragma once（非标准但广泛支持）
#pragma once

class AnotherClass {
    // 类定义
};
```

## #pragma 指令

### 常用 pragma

```cpp
#include <iostream>

// 禁用警告
#pragma warning(disable: 4996)  // MSVC

// 内存对齐
#pragma pack(push, 1)
struct PackedStruct {
    char a;     // 1 字节
    int b;      // 4 字节（无填充）
    char c;     // 1 字节
};  // 总共 6 字节
#pragma pack(pop)

// 一次性
#pragma once  // 等价于头文件保护

// 注释
#pragma message("编译信息")

// GCC/Clang 特定
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-variable"
int unusedVariable = 42;
#pragma GCC diagnostic pop

// 显示编译信息
void showCompileInfo() {
    #if defined(__DATE__)
        std::cout << "编译日期: " << __DATE__ << std::endl;
    #endif

    #if defined(__TIME__)
        std::cout << "编译时间: " << __TIME__ << std::endl;
    #endif

    #if defined(__FILE__)
        std::cout << "文件名: " << __FILE__ << std::endl;
    #endif

    #if defined(__LINE__)
        std::cout << "行号: " << __LINE__ << std::endl;
    #endif
}

int main() {
    std::cout << "sizeof(PackedStruct) = "
              << sizeof(PackedStruct) << std::endl;

    showCompileInfo();

    return 0;
}
```

### 自定义诊断消息

```cpp
#include <iostream>

// 静态断言（C++11）
static_assert(sizeof(int) == 4, "int 必须是 4 字节");

// 编译时错误
#if SOME_CONDITION
    #error "SOME_CONDITION 被定义了"
#endif

// 编译时警告
#if SOME_OTHER_CONDITION
    #warning "SOME_OTHER_CONDITION 被定义了"
#endif

// 位置信息
#define LOCATION std::cout << __FILE__ << ":" << __LINE__ << std::endl

int main() {
    LOCATION;  // 输出文件名和行号

    return 0;
}
```

## 预定义宏

```cpp
#include <iostream>

void printPredefinedMacros() {
    // 标准预定义宏
    std::cout << "__FILE__: " << __FILE__ << std::endl;
    std::cout << "__LINE__: " << __LINE__ << std::endl;
    std::cout << "__DATE__: " << __DATE__ << std::endl;
    std::cout << "__TIME__: " << __TIME__ << std::endl;

    // C++ 标准
    std::cout << "__cplusplus: " << __cplusplus << std::endl;

    // 编译器特定
    #ifdef __GNUC__
        std::cout << "GNUC version: " << __GNUC__ << std::endl;
    #endif

    #ifdef _MSC_VER
        std::cout << "MSVC version: " << _MSC_VER << std::endl;
    #endif

    // 函数名（C++11）
    #ifdef __func__
        std::cout << "__func__: " << __func__ << std::endl;
    #endif

    // 装饰后的函数名
    std::cout << "__FUNCTION__: " << __FUNCTION__ << std::endl;
    std::cout << "__PRETTY_FUNCTION__: " << __PRETTY_FUNCTION__ << std::endl;
}

int main() {
    printPredefinedMacros();
    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **优先使用 constexpr/inline**：而非宏
2. **头文件保护**：使用 `#pragma once` 或 `#ifndef`
3. **宏名全大写**：区分宏和普通代码
4. **条件编译**：用于平台差异和调试
5. **宏参数加括号**：避免优先级问题
:::

::: warning 注意事项

1. **宏无类型检查**：容易引入错误
2. **宏副作用**：注意多次求值问题
3. **调试困难**：宏展开后难以调试
4. **命名冲突**：宏可能意外替换其他代码
:::
