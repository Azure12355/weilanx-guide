---
title: 多态
icon: ri:shuffle-line
order: 3
---

# 多态

多态是面向对象编程的核心特性之一，允许使用统一的接口处理不同类型的对象。

::: tip 核心要点
- **虚函数**：实现运行时多态
- **纯虚函数**：定义接口
- **抽象类**：包含纯虚函数的类
- **final 关键字**：禁止重写或继承
:::

## 虚函数

### 虚函数基础

```cpp
#include <iostream>
#include <memory>

class Shape {
public:
    // 虚函数：支持动态绑定
    virtual void draw() {
        std::cout << "绘制形状" << std::endl;
    }

    virtual double area() {
        return 0.0;
    }

    // 虚析构函数：确保正确调用派生类析构函数
    virtual ~Shape() {
        std::cout << "Shape 析构" << std::endl;
    }
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    void draw() override {
        std::cout << "绘制圆形，半径: " << radius << std::endl;
    }

    double area() override {
        return 3.14159265 * radius * radius;
    }

    ~Circle() override {
        std::cout << "Circle 析构" << std::endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}

    void draw() override {
        std::cout << "绘制矩形，宽: " << width << ", 高: " << height << std::endl;
    }

    double area() override {
        return width * height;
    }

    ~Rectangle() override {
        std::cout << "Rectangle 析构" << std::endl;
    }
};

int main() {
    // 使用基类指针操作派生类对象
    Shape* shape1 = new Circle(5.0);
    Shape* shape2 = new Rectangle(3.0, 4.0);

    // 动态绑定：调用正确的函数
    shape1->draw();
    std::cout << "面积: " << shape1->area() << std::endl;

    shape2->draw();
    std::cout << "面积: " << shape2->area() << std::endl;

    delete shape1;  // 正确调用 Circle 析构函数
    delete shape2;  // 正确调用 Rectangle 析构函数

    return 0;
}
```

### 虚函数表 (vtable)

```cpp
#include <iostream>
#include <iomanip>

class Base {
public:
    virtual void func1() { std::cout << "Base::func1" << std::endl; }
    virtual void func2() { std::cout << "Base::func2" << std::endl; }
    void nonVirtual() { std::cout << "Base::nonVirtual" << std::endl; }

    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void func1() override { std::cout << "Derived::func1" << std::endl; }
    void func2() override { std::cout << "Derived::func2" << std::endl; }
    void nonVirtual() { std::cout << "Derived::nonVirtual" << std::endl; }
};

int main() {
    Base* ptr = new Derived();

    // 虚函数：运行时绑定
    ptr->func1();       // Derived::func1
    ptr->func2();       // Derived::func2

    // 非虚函数：编译时绑定
    ptr->nonVirtual();  // Base::nonVirtual

    delete ptr;
    return 0;
}
```

## 纯虚函数与抽象类

```cpp
#include <iostream>
#include <string>
#include <vector>

// 抽象类：包含纯虚函数
class Animal {
protected:
    std::string name;

public:
    Animal(const std::string& n) : name(n) {}
    virtual ~Animal() = default;

    // 纯虚函数：必须在派生类中实现
    virtual void makeSound() = 0;
    virtual void move() = 0;

    // 普通函数：可以提供默认实现
    void eat() {
        std::cout << name << " 在吃东西" << std::endl;
    }

    std::string getName() const { return name; }
};

// 派生类必须实现所有纯虚函数
class Dog : public Animal {
public:
    Dog(const std::string& n) : Animal(n) {}

    void makeSound() override {
        std::cout << name << " 汪汪叫" << std::endl;
    }

    void move() override {
        std::cout << name << " 跑来跑去" << std::endl;
    }
};

class Cat : public Animal {
public:
    Cat(const std::string& n) : Animal(n) {}

    void makeSound() override {
        std::cout << name << " 喵喵叫" << std::endl;
    }

    void move() override {
        std::cout << name << " 悄悄地走" << std::endl;
    }
};

// 抽象类也可以有部分实现
class Bird : public Animal {
public:
    Bird(const std::string& n) : Animal(n) {}

    void makeSound() override {
        std::cout << name << " 叽叽喳喳" << std::endl;
    }

    // Bird 仍然是抽象类（没有实现 move）
};

int main() {
    // Animal animal;  // 错误：不能实例化抽象类

    std::vector<std::unique_ptr<Animal>> animals;
    animals.push_back(std::make_unique<Dog>("旺财"));
    animals.push_back(std::make_unique<Cat>("咪咪"));

    for (const auto& animal : animals) {
        animal->makeSound();
        animal->move();
        animal->eat();
        std::cout << std::endl;
    }

    return 0;
}
```

## 接口类

```cpp
#include <iostream>
#include <memory>

// 接口类：纯虚函数 + 虚析构函数 + 无数据成员
class IDrawable {
public:
    virtual ~IDrawable() = default;
    virtual void draw() = 0;
};

class IResizable {
public:
    virtual ~IResizable() = default;
    virtual void resize(double factor) = 0;
};

// 多接口继承
class Button : public IDrawable, public IResizable {
private:
    double width, height;

public:
    Button(double w, double h) : width(w), height(h) {}

    void draw() override {
        std::cout << "绘制按钮: " << width << "x" << height << std::endl;
    }

    void resize(double factor) override {
        width *= factor;
        height *= factor;
        std::cout << "按钮缩放: " << factor << "x" << std::endl;
    }
};

int main() {
    Button btn(100, 50);

    IDrawable* drawable = &btn;
    drawable->draw();

    IResizable* resizable = &btn;
    resizable->resize(1.5);

    return 0;
}
```

## 运行时类型信息 (RTTI)

```cpp
#include <iostream>
#include <typeinfo>
#include <vector>

class Base {
public:
    virtual ~Base() = default;
    virtual void whoAmI() {
        std::cout << "我是 Base" << std::endl;
    }
};

class Derived : public Base {
public:
    void whoAmI() override {
        std::cout << "我是 Derived" << std::endl;
    }
};

class Another : public Base {
public:
    void whoAmI() override {
        std::cout << "我是 Another" << std::endl;
    }
};

int main() {
    Base* ptr = new Derived();

    // typeid 获取类型信息
    std::cout << "类型名: " << typeid(*ptr).name() << std::endl;

    // dynamic_cast 类型转换
    if (auto derived = dynamic_cast<Derived*>(ptr)) {
        std::cout << "转换成功，是 Derived" << std::endl;
        derived->whoAmI();
    }

    // 错误转换
    if (auto another = dynamic_cast<Another*>(ptr)) {
        std::cout << "是 Another" << std::endl;
    } else {
        std::cout << "不是 Another" << std::endl;
    }

    delete ptr;

    // 使用 typeid 比较
    Base* base1 = new Derived();
    Base* base2 = new Derived();
    Base* base3 = new Another();

    if (typeid(*base1) == typeid(*base2)) {
        std::cout << "base1 和 base2 类型相同" << std::endl;
    }

    if (typeid(*base1) != typeid(*base3)) {
        std::cout << "base1 和 base3 类型不同" << std::endl;
    }

    delete base1;
    delete base2;
    delete base3;

    return 0;
}
```

## 协变返回类型

```cpp
#include <iostream>
#include <memory>

class Base {
public:
    virtual Base* clone() {
        std::cout << "Base::clone" << std::endl;
        return new Base(*this);
    }

    virtual ~Base() = default;
};

class Derived : public Base {
public:
    // 协变返回类型：返回 Derived* 而非 Base*
    Derived* clone() override {
        std::cout << "Derived::clone" << std::endl;
        return new Derived(*this);
    }
};

int main() {
    Derived d;
    Base* basePtr = &d;

    Base* cloned = basePtr->clone();  // 返回 Base*
    Derived* derivedCloned = d.clone(); // 返回 Derived*

    delete cloned;
    delete derivedCloned;

    return 0;
}
```

## 虚函数性能

```cpp
#include <iostream>
#include <chrono>

class Base {
public:
    virtual void virtualFunction() {
        // 空函数用于测试
    }

    void nonVirtualFunction() {
        // 空函数用于测试
    }

    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void virtualFunction() override {
        // 空函数
    }
};

void testVirtualCalls(Base* obj, int iterations) {
    auto start = std::chrono::high_resolution_clock::now();

    for (int i = 0; i < iterations; ++i) {
        obj->virtualFunction();
    }

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);

    std::cout << "虚函数调用 " << iterations << " 次: " << duration.count() << " μs" << std::endl;
}

void testNonVirtualCalls(Base* obj, int iterations) {
    auto start = std::chrono::high_resolution_clock::now();

    for (int i = 0; i < iterations; ++i) {
        obj->nonVirtualFunction();
    }

    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);

    std::cout << "非虚函数调用 " << iterations << " 次: " << duration.count() << " μs" << std::endl;
}

int main() {
    Derived obj;
    const int iterations = 10000000;

    testVirtualCalls(&obj, iterations);
    testNonVirtualCalls(&obj, iterations);

    return 0;
}
```

## 多态设计模式

### 策略模式

```cpp
#include <iostream>
#include <memory>

// 策略接口
class SortStrategy {
public:
    virtual ~SortStrategy() = default;
    virtual void sort() = 0;
};

// 具体策略
class QuickSort : public SortStrategy {
public:
    void sort() override {
        std::cout << "使用快速排序" << std::endl;
    }
};

class MergeSort : public SortStrategy {
public:
    void sort() override {
        std::cout << "使用归并排序" << std::endl;
    }
};

// 上下文
class Sorter {
private:
    std::unique_ptr<SortStrategy> strategy;

public:
    void setStrategy(std::unique_ptr<SortStrategy> s) {
        strategy = std::move(s);
    }

    void performSort() {
        if (strategy) {
            strategy->sort();
        }
    }
};

int main() {
    Sorter sorter;

    sorter.setStrategy(std::make_unique<QuickSort>());
    sorter.performSort();

    sorter.setStrategy(std::make_unique<MergeSort>());
    sorter.performSort();

    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **虚析构函数**：基类应有虚析构函数
2. **override 关键字**：确保正确重写
3. **纯虚函数**：定义接口规范
4. **避免过度使用**：虚函数有性能开销
5. **final 关键字**：禁止不需要的重写
:::

::: warning 注意事项

1. **构造函数中不调用虚函数**：调用的是当前类的版本
2. **析构函数中不调用虚函数**：对象已部分销毁
3. **菱形继承**：使用虚继承解决
4. **对象切片**：按值传递会丢失多态
:::
