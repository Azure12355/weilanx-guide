---
title: C++
icon: devicon-plain:cplusplus
order: 5
---

# C++

![C++](https://img.shields.io/badge/C++-20-00599C?style=flat-square&logo=c%2B%2B)

## 概述

C++ 是由 Bjarne Stroustrup 于 1979 年在贝尔实验室创建的通用编程语言。它是 C 语言的超集，增加了面向对象、泛型编程等特性。

## 核心特点

- **高性能**：接近底层的执行效率
- **手动内存管理**：通过指针和引用精确控制
- **多范式**：支持面向对象、泛型、函数式编程
- **零开销抽象**：抽象不会带来运行时成本
- **标准库丰富**：STL 容器、算法、智能指针

## 应用领域

| 领域 | 代表技术/项目 |
|------|--------------|
| 游戏开发 | Unreal Engine, Unity C++ SDK |
| 系统编程 | 操作系统、驱动、嵌入式 |
| 高频交易 | 量化交易系统 |
| 浏览器引擎 | Chrome V8, WebKit |
| 科学计算 | 大型数值模拟 |

## 学习路径

1. **C++ 基础** → 语法、指针、引用
2. **OOP** → 类、继承、多态
3. **STL** → 容器、算法、迭代器
4. **现代 C++** → 智能指针、lambda、移动语义
5. **模板元编程** → 模板特化、SFINAE

## Hello World

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}
```

## 代码示例

```cpp
// 现代 C++ (C++11/14/17/20)
#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    // vector 容器
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    // Lambda 表达式
    std::for_each(numbers.begin(), numbers.end(),
        [](int n) { std::cout << n * 2 << " "; });

    // 智能指针
    auto ptr = std::make_unique<int>(42);

    // 结构化绑定 (C++17)
    auto [min, max] = std::minmax_element(numbers.begin(), numbers.end());

    return 0;
}
```

## 类与继承

```cpp
#include <string>
#include <memory>

class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() const = 0;
};

class Dog : public Animal {
private:
    std::string name;
public:
    Dog(std::string n) : name(std::move(n)) {}

    void speak() const override {
        std::cout << name << " says: Woof!" << std::endl;
    }
};
```

## 相关资源

- [C++ Reference](https://zh.cppreference.com/)
- [Modern C++ Tutorial](https://changkun.de/modern-cpp/)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/)

---

::: tip 学习建议
从现代 C++（C++11 及以后）开始学习，避免使用过时的 C++98 风格。
:::
