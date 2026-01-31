---
title: 面向对象编程
icon: devicon-plain:cplusplus
order: 1
---

# 面向对象编程

## 类与对象

### 类的定义

```cpp
class Rectangle {
private:    // 私有成员
    double width;
    double height;

public:     // 公共成员
    // 构造函数
    Rectangle(double w, double h) : width(w), height(h) {}

    // 成员函数
    double area() {
        return width * height;
    }

    double perimeter() {
        return 2 * (width + height);
    }

    // Setter
    void setWidth(double w) { width = w; }
    void setHeight(double h) { height = h; }

    // Getter
    double getWidth() const { return width; }
    double getHeight() const { return height; }
};

// 使用
Rectangle rect(5.0, 3.0);
std::cout << "面积: " << rect.area() << std::endl;
```

### 访问修饰符

| 修饰符 | 同类 | 派生类 | 外部 |
|--------|------|--------|------|
| `public` | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` | ✅ | ❌ | ❌ |

### 构造函数

```cpp
class Person {
private:
    std::string name;
    int age;

public:
    // 默认构造函数
    Person() : name("Unknown"), age(0) {}

    // 带参数的构造函数
    Person(std::string n, int a) : name(n), age(a) {}

    // 拷贝构造函数
    Person(const Person& other) : name(other.name), age(other.age) {}

    // 移动构造函数 (C++11)
    Person(Person&& other) noexcept
        : name(std::move(other.name)), age(other.age) {}
};
```

### 析构函数

```cpp
class Resource {
private:
    int* data;

public:
    Resource() {
        data = new int[100];
        std::cout << "资源分配" << std::endl;
    }

    ~Resource() {
        delete[] data;
        std::cout << "资源释放" << std::endl;
    }
};
```

## 封装

### Getter 和 Setter

```cpp
class BankAccount {
private:
    double balance;

public:
    double getBalance() const {
        return balance;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    bool withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;
    }
};
```

### 类内初始化 (C++11)

```cpp
class Point {
private:
    int x = 0;      // 默认值
    int y = 0;

public:
    Point() = default;  // 使用默认构造函数
    Point(int x, int y) : x(x), y(y) {}
};
```

## 继承

### 单继承

```cpp
// 基类
class Animal {
protected:
    std::string name;

public:
    Animal(std::string n) : name(n) {}
    void speak() {
        std::cout << name << " 发出声音" << std::endl;
    }
};

// 派生类
class Dog : public Animal {
private:
    std::string breed;

public:
    Dog(std::string n, std::string b)
        : Animal(n), breed(b) {}

    void bark() {
        std::cout << name << " 汪汪叫！" << std::endl;
    }
};

// 使用
Dog dog("旺财", "哈士奇");
dog.speak();  // 继承的方法
dog.bark();   // 自己的方法
```

### 访问控制

```cpp
class Base {
private:
    int priv = 1;
protected:
    int prot = 2;
public:
    int pub = 3;
};

class Derived : public Base {
public:
    void access() {
        // priv;  // 错误：不可访问
        prot;    // 正确：可访问
        pub;     // 正确：可访问
    }
};
```

### 构造函数与析构函数顺序

```cpp
class Base {
public:
    Base() { std::cout << "Base 构造" << std::endl; }
    ~Base() { std::cout << "Base 析构" << std::endl; }
};

class Derived : public Base {
public:
    Derived() { std::cout << "Derived 构造" << std::endl; }
    ~Derived() { std::cout << "Derived 析构" << std::endl; }
};

// 输出顺序：
// Base 构造 → Derived 构构 → Derived 析构 → Base 析构
```

## 多态

### 虚函数

```cpp
class Shape {
public:
    virtual void draw() {
        std::cout << "绘制形状" << std::endl;
    }

    virtual ~Shape() {}  // 虚析构函数
};

class Circle : public Shape {
public:
    void draw() override {  // override 关键字 (C++11)
        std::cout << "绘制圆形" << std::endl;
    }
};

class Rectangle : public Shape {
public:
    void draw() override {
        std::cout << "绘制矩形" << std::endl;
    }
};

// 多态使用
Shape* shape1 = new Circle();
Shape* shape2 = new Rectangle();

shape1->draw();  // 输出: 绘制圆形
shape2->draw();  // 输出: 绘制矩形

delete shape1;
delete shape2;
```

### 纯虚函数与抽象类

```cpp
// 抽象类
class Vehicle {
public:
    virtual void start() = 0;  // 纯虚函数
    virtual void stop() = 0;

    virtual ~Vehicle() = default;
};

// 必须实现所有纯虚函数
class Car : public Vehicle {
public:
    void start() override {
        std::cout << "汽车启动" << std::endl;
    }

    void stop() override {
        std::cout << "汽车停止" << std::endl;
    }
};

// Vehicle v;  // 错误：不能实例化抽象类
Car car;      // 正确
```

### final 关键字 (C++11)

```cpp
class Base final {  // 不能被继承
public:
    virtual void func() final {  // 不能被重写
        // ...
    }
};

// class Derived : Base {}  // 错误：Base 是 final
```

## 重载运算符

### 成员函数方式

```cpp
class Complex {
private:
    double real;
    double imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 运算符重载
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    Complex operator-(const Complex& other) const {
        return Complex(real - other.real, imag - other.imag);
    }

    void display() const {
        std::cout << real << " + " << imag << "i" << std::endl;
    }
};

// 使用
Complex c1(3, 4);
Complex c2(1, 2);
Complex c3 = c1 + c2;
c3.display();  // 4 + 6i
```

### 友元函数方式

```cpp
class Complex {
private:
    double real;
    double imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 友元函数
    friend Complex operator+(const Complex& a, const Complex& b);
    friend std::ostream& operator<<(std::ostream& os, const Complex& c);
};

Complex operator+(const Complex& a, const Complex& b) {
    return Complex(a.real + b.real, a.imag + b.imag);
}

std::ostream& operator<<(std::ostream& os, const Complex& c) {
    os << c.real << " + " << c.imag << "i";
    return os;
}

// 使用
Complex c1(3, 4);
Complex c2(1, 2);
Complex c3 = c1 + c2;
std::cout << c3 << std::endl;  // 4 + 6i
```

## 友元

```cpp
class Box {
private:
    double width;

public:
    Box(double w) : width(w) {}

    // 友元函数
    friend void printWidth(const Box& box);

    // 友元类
    friend class BoxPrinter;
};

void printWidth(const Box& box) {
    // 可以访问私有成员
    std::cout << "Width: " << box.width << std::endl;
}

class BoxPrinter {
public:
    void print(const Box& box) {
        // 可以访问私有成员
        std::cout << "Width: " << box.width << std::endl;
    }
};
```

## 静态成员

```cpp
class Counter {
private:
    static int count;  // 静态成员变量

public:
    Counter() {
        count++;
    }

    ~Counter() {
        count--;
    }

    static int getCount() {  // 静态成员函数
        return count;
    }
};

// 静态成员初始化
int Counter::count = 0;

// 使用
Counter c1, c2, c3;
std::cout << Counter::getCount() << std::endl;  // 3
```

## 常量成员

```cpp
class Constants {
private:
    const int value;

public:
    Constants(int v) : value(v) {}  // 初始化列表

    int getValue() const {  // const 成员函数
        return value;
    }

    // void setValue(int v) {}  // 错误：const 函数不能修改成员
};
```

## 对象管理

### 对象数组

```cpp
Point points[3] = {
    Point(0, 0),
    Point(1, 2),
    Point(3, 4)
};

// 动态数组
Point* dynamicPoints = new Point[5];
delete[] dynamicPoints;
```

### 对象指针

```cpp
Rectangle* rect = new Rectangle(5, 3);
rect->area();  // 使用箭头运算符
delete rect;
```

### this 指针

```cpp
class Person {
private:
    std::string name;

public:
    Person(std::string name) : name(name) {}

    Person& setName(std::string name) {
        this->name = name;  // this 指针
        return *this;  // 返回当前对象
    }
};

// 链式调用
person.setName("Alice").setName("Bob");
```

---

::: tip SOLID 原则
- **S**ingle Responsibility - 单一职责
- **O**pen/Closed - 开闭原则
- **L**iskov Substitution - 里氏替换
- **I**nterface Segregation - 接口隔离
- **D**ependency Inversion - 依赖倒置
:::
