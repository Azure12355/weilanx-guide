---
title: 类与对象
icon: ri:shape-line
order: 1
---

# 类与对象

类 (class) 是 C++ 面向对象编程的基本单元，对象 (object) 是类的实例。

::: tip 核心要点
- **类**：定义数据成员和成员函数
- **对象**：类的实例化
- **构造函数**：初始化对象
- **析构函数**：清理资源
:::

## 类的定义

### 基本语法

```cpp
#include <iostream>
#include <string>

class Person {
private:    // 私有成员：只能在类内访问
    std::string name;
    int age;

public:     // 公有成员：可以从外部访问
    // 构造函数
    Person(const std::string& n, int a) : name(n), age(a) {
        std::cout << "构造函数: " << name << std::endl;
    }

    // 默认构造函数
    Person() : name("未知"), age(0) {
        std::cout << "默认构造函数" << std::endl;
    }

    // 析构函数
    ~Person() {
        std::cout << "析构函数: " << name << std::endl;
    }

    // 成员函数
    void introduce() const {
        std::cout << "我叫 " << name << "，今年 " << age << " 岁" << std::endl;
    }

    // Getter/Setter
    std::string getName() const { return name; }
    void setName(const std::string& n) { name = n; }

    int getAge() const { return age; }
    void setAge(int a) { age = a; }

protected:  // 保护成员：派生类可访问
    void protectedMethod() {
        std::cout << "保护方法" << std::endl;
    }
};

int main() {
    // 创建对象
    Person p1("张三", 25);
    p1.introduce();

    Person p2;  // 默认构造
    p2.introduce();

    // 使用 Setter
    p2.setName("李四");
    p2.setAge(30);
    p2.introduce();

    return 0;
}
```

### 成员初始化列表

```cpp
#include <iostream>
#include <string>

class Point {
private:
    const int x;
    const int y;
    std::string label;

public:
    // 成员初始化列表（推荐）
    Point(int xVal, int yVal, const std::string& l)
        : x(xVal), y(yVal), label(l) {
        // 构造函数体
        std::cout << "Point 构造: (" << x << ", " << y << ")" << std::endl;
    }

    // 默认构造函数
    Point() : x(0), y(0), label("原点") {}

    // 委托构造函数 (C++11)
    Point(int xVal, int yVal) : Point(xVal, yVal, "点") {}

    void print() const {
        std::cout << label << ": (" << x << ", " << y << ")" << std::endl;
    }
};

class MyClass {
private:
    int& ref;        // 引用成员必须初始化
    const int value; // const 成员必须初始化

public:
    // 必须使用初始化列表
    MyClass(int& r, int v) : ref(r), value(v) {
        // ref = r;  // 错误：引用不能重新绑定
    }

    void print() const {
        std::cout << "ref = " << ref << ", value = " << value << std::endl;
    }
};

int main() {
    Point p1(3, 4, "A点");
    p1.print();

    Point p2(5, 6);
    p2.print();

    Point p3;
    p3.print();

    int x = 100;
    MyClass obj(x, 200);
    obj.print();

    return 0;
}
```

## 构造函数

### 构造函数类型

```cpp
#include <iostream>

class Demo {
private:
    int value;

public:
    // 默认构造函数
    Demo() : value(0) {
        std::cout << "默认构造" << std::endl;
    }

    // 带参数构造函数
    Demo(int v) : value(v) {
        std::cout << "带参数构造: " << value << std::endl;
    }

    // 拷贝构造函数
    Demo(const Demo& other) : value(other.value) {
        std::cout << "拷贝构造: " << value << std::endl;
    }

    // 移动构造函数 (C++11)
    Demo(Demo&& other) noexcept : value(other.value) {
        std::cout << "移动构造: " << value << std::endl;
    }

    // 拷贝赋值运算符
    Demo& operator=(const Demo& other) {
        std::cout << "拷贝赋值: " << other.value << std::endl;
        if (this != &other) {
            value = other.value;
        }
        return *this;
    }

    // 移动赋值运算符 (C++11)
    Demo& operator=(Demo&& other) noexcept {
        std::cout << "移动赋值: " << other.value << std::endl;
        if (this != &other) {
            value = other.value;
        }
        return *this;
    }

    // 析构函数
    ~Demo() {
        std::cout << "析构: " << value << std::endl;
    }

    void print() const {
        std::cout << "value = " << value << std::endl;
    }
};

int main() {
    Demo d1;         // 默认构造
    Demo d2(42);     // 带参数构造

    Demo d3 = d2;    // 拷贝构造（不是赋值）
    Demo d4(d2);     // 拷贝构造

    Demo d5 = std::move(d2);  // 移动构造

    d1 = d3;         // 拷贝赋值
    d1 = std::move(d3);  // 移动赋值

    return 0;
}
```

### explicit 关键字

```cpp
#include <iostream>

class A {
public:
    // explicit 禁止隐式转换
    explicit A(int x) {
        std::cout << "A 构造: " << x << std::endl;
    }
};

class B {
public:
    // 允许隐式转换
    B(int x) {
        std::cout << "B 构造: " << x << std::endl;
    }
};

void takeA(A a) {
    std::cout << "takeA" << std::endl;
}

void takeB(B b) {
    std::cout << "takeB" << std::endl;
}

int main() {
    A a1(10);     // OK：直接初始化
    // A a2 = 20;  // 错误：explicit 禁止隐式转换
    // takeA(30);  // 错误：不能隐式转换

    B b1(10);     // OK：直接初始化
    B b2 = 20;    // OK：拷贝初始化（隐式转换）
    takeB(30);    // OK：隐式转换

    return 0;
}
```

## this 指针

```cpp
#include <iostream>
#include <string>

class Person {
private:
    std::string name;

public:
    Person(const std::string& n) : name(n) {}

    // this 指针指向当前对象
    void printName() const {
        std::cout << "this->name = " << this->name << std::endl;
        std::cout << "(*this).name = " << (*this).name << std::endl;
    }

    // 返回对象引用（支持链式调用）
    Person& setName(const std::string& n) {
        this->name = n;
        return *this;
    }

    Person& setAge(int age) {
        // 使用 this 区分成员变量和参数
        // 这里假设有 age 成员
        return *this;
    }

    // 返回 const 引用
    const Person& show() const {
        std::cout << name << std::endl;
        return *this;
    }
};

int main() {
    Person p("张三");

    // 链式调用
    p.setName("李四").show();

    return 0;
}
```

## const 成员函数

```cpp
#include <iostream>

class Counter {
private:
    int count;

public:
    Counter(int c = 0) : count(c) {}

    // const 成员函数：不修改对象状态
    int getValue() const {
        // count++;  // 错误：不能修改成员
        return count;
    }

    // 非 const 成员函数
    void increment() {
        count++;
    }

    // const 重载
    void display() const {
        std::cout << "const 版本: " << count << std::endl;
    }

    void display() {
        std::cout << "非 const 版本: " << count << std::endl;
    }
};

int main() {
    Counter c1(10);

    c1.display();        // 调用非 const 版本

    const Counter c2(20);
    c2.display();        // 调用 const 版本

    return 0;
}
```

## static 成员

```cpp
#include <iostream>

class Widget {
private:
    static int count;  // 静态成员声明

public:
    Widget() {
        count++;
    }

    ~Widget() {
        count--;
    }

    // 静态成员函数
    static int getCount() {
        // std::cout << this;  // 错误：静态函数没有 this 指针
        return count;
    }

    // const 静态成员 (C++11)
    static const int MAX = 100;

    // constexpr 静态成员 (C++11)
    static constexpr double PI = 3.14159265;
};

// 静态成员定义
int Widget::count = 0;

int main() {
    std::cout << "初始计数: " << Widget::getCount() << std::endl;

    Widget w1, w2, w3;
    std::cout << "创建后: " << Widget::getCount() << std::endl;

    {
        Widget w4, w5;
        std::cout << "临时对象: " << Widget::getCount() << std::endl;
    }

    std::cout << "销毁后: " << Widget::getCount() << std::endl;

    std::cout << "MAX = " << Widget::MAX << std::endl;
    std::cout << "PI = " << Widget::PI << std::endl;

    return 0;
}
```

## 友元

```cpp
#include <iostream>

class A {
private:
    int value;

public:
    A(int v) : value(v) {}

    // 友元函数
    friend void printValue(const A& a);

    // 友元类
    friend class B;
};

void printValue(const A& a) {
    // 友元函数可以访问私有成员
    std::cout << "A::value = " << a.value << std::endl;
}

class B {
public:
    void modify(A& a, int newValue) {
        // 友元类可以访问私有成员
        a.value = newValue;
    }
};

int main() {
    A a(42);
    printValue(a);  // 友元函数

    B b;
    b.modify(a, 100);
    printValue(a);

    return 0;
}
```

## 嵌套类

```cpp
#include <iostream>

class Outer {
private:
    int value;

public:
    Outer(int v) : value(v) {}

    // 嵌套类
    class Inner {
    private:
        int data;

    public:
        Inner(int d) : data(d) {}

        void display() const {
            std::cout << "Inner::data = " << data << std::endl;
        }

        // 嵌套类可以访问外层类的静态成员
        // 但不能访问非静态成员
    };

    void createInner() {
        Inner inner(100);
        inner.display();
    }
};

int main() {
    Outer outer(50);

    // 使用作用域运算符创建嵌套类对象
    Outer::Inner inner(200);
    inner.display();

    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **使用初始化列表**：效率更高，const/引用成员必须使用
2. **explicit 单参数构造**：避免意外的隐式转换
3. **const 成员函数**：不修改对象的函数标记为 const
4. **RAII**：在构造函数中获取资源，析构函数中释放
5. **禁止拷贝**：使用 `= delete` 禁止拷贝构造和赋值
:::

::: warning 注意事项

1. **析构函数应为 virtual**：如果类会被继承
2. **自赋值检查**：拷贝赋值运算符中检查
3. **资源管理**：遵循 Rule of Three/Five
4. **this 指针**：注意 this 是右值
:::
