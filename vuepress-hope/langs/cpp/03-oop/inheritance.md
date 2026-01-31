---
title: 继承
icon: ri:git-branch-line
order: 2
---

# 继承

继承是面向对象编程的核心特性之一，允许创建新类复用现有类的代码。

::: tip 核心要点
- **基类/派生类**：父类与子类的关系
- **public/protected/private 继承**：访问控制
- **多继承**：一个类继承多个基类
- **虚继承**：解决菱形继承问题
:::

## 基本继承

### 单继承

```cpp
#include <iostream>
#include <string>

// 基类（父类）
class Animal {
protected:  // 保护成员：派生类可访问
    std::string name;
    int age;

public:
    Animal(const std::string& n, int a) : name(n), age(a) {
        std::cout << "Animal 构造: " << name << std::endl;
    }

    virtual ~Animal() {  // 虚析构函数
        std::cout << "Animal 析构: " << name << std::endl;
    }

    void eat() {
        std::cout << name << " 在吃东西" << std::endl;
    }

    // 虚函数：支持动态绑定
    virtual void makeSound() {
        std::cout << name << " 发出声音" << std::endl;
    }

    void sleep() {
        std::cout << name << " 在睡觉" << std::endl;
    }
};

// 派生类（子类）
class Dog : public Animal {  // public 继承
private:
    std::string breed;

public:
    Dog(const std::string& n, int a, const std::string& b)
        : Animal(n, a), breed(b) {
        std::cout << "Dog 构造: " << name << std::endl;
    }

    ~Dog() override {
        std::cout << "Dog 析构: " << name << std::endl;
    }

    // 重写虚函数
    void makeSound() override {
        std::cout << name << " 汪汪叫" << std::endl;
    }

    void fetch() {
        std::cout << name << " 去捡球" << std::endl;
    }
};

class Cat : public Animal {
private:
    bool indoor;

public:
    Cat(const std::string& n, int a, bool i)
        : Animal(n, a), indoor(i) {
        std::cout << "Cat 构造: " << name << std::endl;
    }

    void makeSound() override {
        std::cout << name << " 喵喵叫" << std::endl;
    }

    void climb() {
        std::cout << name << " 爬树" << std::endl;
    }
};

int main() {
    Dog dog("旺财", 3, "金毛");
    dog.eat();
    dog.makeSound();
    dog.fetch();

    Cat cat("咪咪", 2, true);
    cat.eat();
    cat.makeSound();
    cat.climb();

    return 0;
}
```

### 继承方式与访问控制

```cpp
#include <iostream>

class Base {
public:
    int pub = 1;

protected:
    int prot = 2;

private:
    int priv = 3;
};

// public 继承
class PublicDerived : public Base {
public:
    void access() {
        std::cout << pub << std::endl;   // OK：public 仍是 public
        std::cout << prot << std::endl;  // OK：protected 仍是 protected
        // std::cout << priv << std::endl;  // 错误：private 不可访问
    }
};

// protected 继承
class ProtectedDerived : protected Base {
public:
    void access() {
        std::cout << pub << std::endl;   // OK：public 变为 protected
        std::cout << prot << std::endl;  // OK：protected 仍是 protected
        // std::cout << priv << std::endl;  // 错误：private 不可访问
    }
};

// private 继承
class PrivateDerived : private Base {
public:
    void access() {
        std::cout << pub << std::endl;   // OK：public 变为 private
        std::cout << prot << std::endl;  // OK：protected 变为 private
        // std::cout << priv << std::endl;  // 错误：private 不可访问
    }
};

int main() {
    PublicDerived pubD;
    pubD.pub = 10;  // OK
    // pubD.prot = 20;  // 错误：外部不能访问 protected

    ProtectedDerived protD;
    // protD.pub = 10;  // 错误：public 变为 protected

    PrivateDerived privD;
    // privD.pub = 10;  // 错误：public 变为 private

    return 0;
}
```

## 构造与析构顺序

```cpp
#include <iostream>

class A {
public:
    A() { std::cout << "A 构造" << std::endl; }
    ~A() { std::cout << "A 析构" << std::endl; }
};

class B {
public:
    B() { std::cout << "B 构造" << std::endl; }
    ~B() { std::cout << "B 析构" << std::endl; }
};

class C : public A, public B {
public:
    C() { std::cout << "C 构造" << std::endl; }
    ~C() { std::cout << "C 析构" << std::endl; }
};

int main() {
    C obj;

    // 构造顺序：A → B → C
    // 析构顺序：C → B → A（与构造相反）

    return 0;
}
```

## 多继承

```cpp
#include <iostream>

// 基类 1
class Camera {
public:
    void takePhoto() {
        std::cout << "拍照" << std::endl;
    }
};

// 基类 2
class Phone {
public:
    void makeCall() {
        std::cout << "打电话" << std::endl;
    }
};

// 多继承
class SmartPhone : public Camera, public Phone {
public:
    void runApp() {
        std::cout << "运行应用" << std::endl;
    }
};

int main() {
    SmartPhone phone;
    phone.takePhoto();
    phone.makeCall();
    phone.runApp();

    return 0;
}
```

### 菱形继承与虚继承

```cpp
#include <iostream>

// 菱形继承问题
class A {
public:
    int value;
    A() : value(0) {
        std::cout << "A 构造" << std::endl;
    }
};

class B : public A {
public:
    B() {
        std::cout << "B 构造, value = " << value << std::endl;
    }
};

class C : public A {
public:
    C() {
        std::cout << "C 构造, value = " << value << std::endl;
    }
};

// 菱形继承：D 有两份 A 的副本
class D : public B, public C {
public:
    D() {
        // value = 10;  // 错误：歧义！B::value 还是 C::value？
        std::cout << "D 构造" << std::endl;
    }
};

// 虚继承解决方案
class VirtualA {
public:
    int value;
    VirtualA() : value(0) {
        std::cout << "VirtualA 构造" << std::endl;
    }
};

class VirtualB : virtual public VirtualA {
public:
    VirtualB() {
        std::cout << "VirtualB 构造" << std::endl;
    }
};

class VirtualC : virtual public VirtualA {
public:
    VirtualC() {
        std::cout << "VirtualC 构造" << std::endl;
    }
};

class VirtualD : public VirtualB, public VirtualC {
public:
    VirtualD() {
        value = 10;  // OK：只有一份 VirtualA
        std::cout << "VirtualD 构造, value = " << value << std::endl;
    }
};

int main() {
    // 菱形继承
    D d;
    d.B::value = 1;
    d.C::value = 2;
    std::cout << "B::value = " << d.B::value << std::endl;
    std::cout << "C::value = " << d.C::value << std::endl;

    std::cout << "---" << std::endl;

    // 虚继承
    VirtualD vd;
    std::cout << "vd.value = " << vd.value << std::endl;

    return 0;
}
```

## 向上转型与向下转型

```cpp
#include <iostream>
#include <string>

class Base {
public:
    virtual void show() {
        std::cout << "Base::show" << std::endl;
    }

    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void show() override {
        std::cout << "Derived::show" << std::endl;
    }

    void specific() {
        std::cout << "Derived::specific" << std::endl;
    }
};

int main() {
    // 向上转型（隐式）
    Derived d;
    Base* basePtr = &d;
    Base& baseRef = d;

    basePtr->show();  // 多态：调用 Derived::show
    baseRef.show();   // 多态：调用 Derived::show

    // basePtr->specific();  // 错误：Base 没有这个方法

    // 向下转型（需要显式转换）
    Derived* derivedPtr = static_cast<Derived*>(basePtr);
    derivedPtr->specific();  // OK

    // 使用 dynamic_cast（更安全）
    Derived* safePtr = dynamic_cast<Derived*>(basePtr);
    if (safePtr) {
        safePtr->specific();
    }

    // 尝试错误转换
    Base baseObj;
    Derived* wrongPtr = dynamic_cast<Derived*>(&baseObj);
    if (wrongPtr == nullptr) {
        std::cout << "转换失败" << std::endl;
    }

    return 0;
}
```

## 继承下的构造函数

```cpp
#include <iostream>
#include <string>

class Base {
protected:
    std::string name;

public:
    Base(const std::string& n) : name(n) {
        std::cout << "Base 构造: " << name << std::endl;
    }

    Base(const Base& other) : name(other.name) {
        std::cout << "Base 拷贝构造" << std::endl;
    }
};

class Derived : public Base {
private:
    int value;

public:
    // 调用基类构造函数
    Derived(const std::string& n, int v) : Base(n), value(v) {
        std::cout << "Derived 构造" << std::endl;
    }

    // 拷贝构造函数
    Derived(const Derived& other) : Base(other), value(other.value) {
        std::cout << "Derived 拷贝构造" << std::endl;
    }

    // C++11：继承基类构造函数
    using Base::Base;
};

int main() {
    Derived d1("测试", 42);

    Derived d2 = d1;  // 拷贝构造

    // 使用继承的构造函数
    Derived d3("仅用基类构造");

    return 0;
}
```

## final 和 override (C++11)

```cpp
#include <iostream>

class Base {
public:
    virtual void func1() {
        std::cout << "Base::func1" << std::endl;
    }

    virtual void func2() {
        std::cout << "Base::func2" << std::endl;
    }
};

class Derived : public Base {
public:
    // override：确保重写了基类虚函数
    void func1() override {
        std::cout << "Derived::func1" << std::endl;
    }

    // void func3() override {}  // 错误：基类没有 func3

    // final：禁止进一步重写
    void func2() override final {
        std::cout << "Derived::func2 (final)" << std::endl;
    }
};

// class MoreDerived : public Derived {
//     void func2() override {}  // 错误：func2 是 final
// };

// final 类：不能被继承
class FinalClass final {
    // ...
};

// class CannotInherit : public FinalClass {};  // 错误

int main() {
    Derived d;
    d.func1();
    d.func2();

    return 0;
}
```

## 使用建议

::: tip 最佳实践

1. **public 继承**：is-a 关系，派生类是基类
2. **虚析构函数**：基类析构函数应为 virtual
3. **虚继承**：解决菱形继承问题
4. **override 关键字**：确保正确重写虚函数
5. **组合优于继承**：优先使用组合
:::

::: warning 注意事项

1. **菱形继承**：使用虚继承解决
2. **构造顺序**：基类先构造，派生类后构造
3. **析构顺序**：派生类先析构，基类后析构
4. **切片问题**：按值传递会导致对象切片
:::
