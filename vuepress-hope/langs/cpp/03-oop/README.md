---
title: 面向对象编程
icon: devicon-plain:cplusplus
order: 4
---

# 面向对象编程 (OOP)

面向对象是 C++ 的核心特性，包括封装、继承、多态三大支柱。

::: tip OOP 三大支柱
- **封装**：隐藏实现细节，暴露接口
- **继承**：代码复用，建立层次关系
- **多态**：同一接口，不同实现
:::

## 学习内容

<VPCard
  title="类与对象"
  desc="类的定义、构造函数、析构函数、成员变量与成员函数"
  logo="https://api.iconify.design/ri/shape-line.svg"
  link="/langs/cpp/03-oop/class-object/"
/>

<VPCard
  title="封装与访问控制"
  desc="public、protected、private、友元"
  logo="https://api.iconify.design/ri/lock-2-line.svg"
  link="/langs/cpp/03-oop/encapsulation/"
/>

<VPCard
  title="继承"
  desc="单继承、多继承、虚继承、菱形问题"
  logo="https://api.iconify.design/ri/git-branch-line.svg"
  link="/langs/cpp/03-oop/inheritance/"
/>

<VPCard
  title="多态"
  desc="虚函数、纯虚函数、抽象类、override、final"
  logo="https://api.iconify.design/ri/shuffle-line.svg"
  link="/langs/cpp/03-oop/polymorphism/"
/>

<VPCard
  title="运算符重载"
  desc="成员函数 vs 全局函数、常见运算符重载"
  logo="https://api.iconify.design/ri/functions-line.svg"
  link="/langs/cpp/03-oop/operator-overloading/"
/>

## 学习路径

```mermaid
flowchart LR
    A[类与对象] --> B[封装]
    A --> C[继承]
    C --> D[多态]
    B --> E[运算符重载]
```

::: center
**图：C++ 面向对象学习路径**
:::

## 核心概念

### 类的定义

```cpp
class MyClass {
public:        // 公有访问
    MyClass(int x) : value(x) {}  // 构造函数
    ~MyClass() {}                   // 析构函数

    void display() const {
        std::cout << value << std::endl;
    }

protected:     // 保护访问
    int getValue() const { return value; }

private:       // 私有访问
    int value;
};
```

### 继承

```cpp
class Derived : public Base {
public:
    Derived(int x) : Base(x) {}

    void overrideMethod() override {
        // 重写基类虚函数
    }
};
```

### 多态

```cpp
// 使用基类指针调用派生类方法
Base* ptr = new Derived();
ptr->virtualMethod();  // 调用 Derived::virtualMethod
delete ptr;
```
