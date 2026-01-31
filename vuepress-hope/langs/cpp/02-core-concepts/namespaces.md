---
title: 命名空间
icon: ri:layout-grid-line
order: 5
---

# 命名空间

命名空间 (namespace) 是 C++ 中用于组织代码、避免命名冲突的机制。

::: tip 核心要点
- **命名空间**：将标识符分组到指定作用域
- **using 声明**：引入单个名称
- **using 指令**：引入整个命名空间
- **匿名命名空间**：限制名称到当前翻译单元
:::

## 命名空间基础

### 定义命名空间

```cpp
#include <iostream>

// 定义命名空间
namespace MyNamespace {
    int value = 42;

    void print() {
        std::cout << "MyNamespace::value = " << value << std::endl;
    }

    int add(int a, int b) {
        return a + b;
    }
}

// 嵌套命名空间
namespace Outer {
    namespace Inner {
        void hello() {
            std::cout << "Hello from Outer::Inner!" << std::endl;
        }
    }
}

// C++17 嵌套命名空间简化
namespace Modern::Nested {
    void greet() {
        std::cout << "Hello from Modern::Nested!" << std::endl;
    }
}

int main() {
    // 使用完全限定名
    MyNamespace::print();
    std::cout << "MyNamespace::add(5, 3) = "
              << MyNamespace::add(5, 3) << std::endl;

    Outer::Inner::hello();
    Modern::Nested::greet();

    return 0;
}
```

### using 声明

```cpp
#include <iostream>

namespace First {
    int value = 100;
    void display() {
        std::cout << "First::value = " << value << std::endl;
    }
}

namespace Second {
    int value = 200;
    void display() {
        std::cout << "Second::value = " << value << std::endl;
    }
}

int main() {
    // using 声明：引入单个名称
    using First::display;
    display();  // 调用 First::display

    // using 声明有作用域
    {
        using Second::display;
        display();  // 调用 Second::display
    }

    display();  // 又是 First::display（外部 using 仍然有效）

    // 多个 using 声明
    using First::value;
    using Second::value;  // 错误：冲突

    return 0;
}
```

### using 指令

```cpp
#include <iostream>

namespace Math {
    const double PI = 3.14159265;
    double square(double x) { return x * x; }
    double cube(double x) { return x * x * x; }
}

namespace Text {
    void print(const char* msg) {
        std::cout << msg << std::endl;
    }
}

int main() {
    // using 指令：引入整个命名空间
    using namespace Math;

    std::cout << "PI = " << PI << std::endl;
    std::cout << "square(3) = " << square(3) << std::endl;

    // 使用完全限定名解决歧义
    using namespace Text;
    Text::print("Hello");  // 明确使用 Text::print

    return 0;
}
```

## 命名空间别名

```cpp
#include <iostream>

namespace VeryLongNamespaceName {
    int value = 42;
    void print() {
        std::cout << "value = " << value << std::endl;
    }
}

int main() {
    // 创建命名空间别名
    namespace VLNN = VeryLongNamespaceName;

    VLNN::print();
    std::cout << "VLNN::value = " << VLNN::value << std::endl;

    return 0;
}
```

## 匿名命名空间

```cpp
#include <iostream>

// 匿名命名空间：限制到当前翻译单元
namespace {
    int internalValue = 100;

    void internalFunction() {
        std::cout << "内部函数: " << internalValue << std::endl;
    }
}

void publicFunction() {
    internalFunction();  // OK：同一文件内可访问
}

// 匿名命名空间等价于 static
// static int internalValue = 100;
```

## 命名空间与类

```cpp
#include <iostream>
#include <vector>

namespace Container {
    template<typename T>
    class Stack {
    private:
        std::vector<T> data;

    public:
        void push(const T& value) {
            data.push_back(value);
        }

        T pop() {
            T value = data.back();
            data.pop_back();
            return value;
        }

        bool empty() const {
            return data.empty();
        }
    };
}

int main() {
    using Container::Stack;

    Stack<int> stack;
    stack.push(1);
    stack.push(2);
    stack.push(3);

    while (!stack.empty()) {
        std::cout << stack.pop() << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

## 命名空间与函数重载

```cpp
#include <iostream>

namespace A {
    void func(int x) {
        std::cout << "A::func(int): " << x << std::endl;
    }
}

namespace B {
    void func(double x) {
        std::cout << "B::func(double): " << x << std::endl;
    }
}

int main() {
    using namespace A;
    using namespace B;

    func(42);      // 调用 A::func(int)
    func(3.14);    // 调用 B::func(double)

    // 明确指定命名空间
    A::func(42);
    B::func(3.14);

    return 0;
}
```

## 命名空间最佳实践

```cpp
#include <iostream>
#include <vector>

// 库的命名空间：通常用库名的缩写
namespace mylib {
    namespace graphics {
        class Renderer {
        public:
            void render() {
                std::cout << "渲染中..." << std::endl;
            }
        };
    }

    namespace audio {
        class Player {
        public:
            void play() {
                std::cout << "播放中..." << std::endl;
            }
        };
    }
}

// 使用别名简化访问
namespace gfx = mylib::graphics;
namespace aud = mylib::audio;

int main() {
    gfx::Renderer renderer;
    renderer.render();

    aud::Player player;
    player.play();

    return 0;
}
```

## 内联命名空间 (C++11)

```cpp
#include <iostream>

// 内联命名空间：默认版本
namespace MyLib {
    namespace V1 {
        void process() {
            std::cout << "版本 1" << std::endl;
        }
    }

    // 内联命名空间：无需限定即可访问
    inline namespace V2 {
        void process() {
            std::cout << "版本 2" << std::endl;
        }
    }
}

int main() {
    // 默认使用内联命名空间
    MyLib::process();  // 版本 2

    // 仍然可以访问旧版本
    MyLib::V1::process();  // 版本 1

    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **使用命名空间组织代码**：按功能模块划分
2. **头文件中避免 using**：防止命名污染
3. **实现文件中使用**：简化代码
4. **匿名命名空间**：替代 static 限制作用域
5. **命名空间别名**：简化长命名空间名
:::

::: warning 注意事项

1. **不要在头文件中使用 using 指令**：强制用户引入命名空间
2. **避免 using 声明冲突**：小心引入同名函数
3. **命名空间不要嵌套太深**：保持结构简单
4. **全局函数尽量放在命名空间中**：避免污染全局
:::
