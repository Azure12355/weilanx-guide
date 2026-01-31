---
title: 指针与引用
icon: devicon-plain:cplusplus
order: 2
---

# 指针与引用

## 指针基础

### 什么是指针？

指针是一个存储内存地址的变量。

```cpp
int num = 42;
int* ptr = &num;  // ptr 存储 num 的内存地址

std::cout << "num 的值: " << num << std::endl;        // 42
std::cout << "num 的地址: " << &num << std::endl;      // 0x7ffc...
std::cout << "ptr 的值: " << ptr << std::endl;         // 0x7ffc...
std::cout << "*ptr 的值: " << *ptr << std::endl;      // 42
```

### 指针声明

```cpp
int* p1;      // 指向 int 的指针
int *p2;      // 同上，风格不同
int * p3;     // 同上

// 推荐：靠近类型
int* p1, p2;  // p1 和 p2 都是指针

// 多个指针声明时注意
int* p1, p2;  // p1 是指针，p2 是 int！
int *p1, *p2; // 两个都是指针
```

### 指针操作

```cpp
int arr[5] = {10, 20, 30, 40, 50};
int* ptr = arr;  // 指向数组首元素

// 指针算术
ptr++;      // 移动到下一个元素 (arr[1])
ptr += 2;   // 移动两个元素 (arr[3])
ptr--;      // 移动到上一个元素

// 指针与数组的等价性
*(ptr + 0) == ptr[0]  // arr[0]
*(ptr + 1) == ptr[1]  // arr[1]
```

### 指针与 const

```cpp
int x = 10, y = 20;

// 1. 指向常量的指针（指针可变，指向的值不可变）
const int* p1 = &x;
*p1 = 15;   // 错误！不能修改值
p1 = &y;    // 正确！可以改变指向

// 2. 常量指针（指针不可变，指向的值可变）
int* const p2 = &x;
*p2 = 15;   // 正确！可以修改值
p2 = &y;    // 错误！不能改变指向

// 3. 指向常量的常量指针（都不可变）
const int* const p3 = &x;
*p3 = 15;   // 错误！
p3 = &y;    // 错误！
```

## 引用基础

### 什么是引用？

引用是变量的别名，必须在声明时初始化。

```cpp
int num = 42;
int& ref = num;  // ref 是 num 的别名

ref = 100;       // num 也变为 100
std::cout << num;  // 输出 100
```

### 引用 vs 指针

| 特性 | 引用 | 指针 |
|------|------|------|
| 初始化 | 必须初始化 | 可以不初始化 |
| 重新绑定 | 不能 | 可以 |
| 空值 | 不存在 | 可以为 nullptr |
| 内存占用 | 通常无额外开销 | 占用内存存储地址 |
| 语法 | `&` 声明，直接使用 | `*` 声明，`*` 解引用 |

```cpp
// 引用
int a = 10;
int& ref = a;
ref = 20;     // 直接使用

// 指针
int b = 10;
int* ptr = &b;
*ptr = 20;    // 需要解引用
```

## 函数参数传递

### 值传递

```cpp
void swapByValue(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int x = 5, y = 10;
swapByValue(x, y);
// x 仍是 5，y 仍是 10（原变量未改变）
```

### 引用传递

```cpp
void swapByRef(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int x = 5, y = 10;
swapByRef(x, y);
// x 变为 10，y 变为 5
```

### 指针传递

```cpp
void swapByPtr(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int x = 5, y = 10;
swapByPtr(&x, &y);
// x 变为 10，y 变为 5
```

### const 引用

```cpp
// 避免拷贝大对象
void printString(const std::string& str) {
    std::cout << str << std::endl;
}

// str 是只读的，不能修改
void process(const std::vector<int>& vec) {
    // 只读访问
    for (int item : vec) {
        std::cout << item << " ";
    }
}
```

## 函数返回引用/指针

### 返回引用

```cpp
int& getElement(int* arr, int index) {
    return arr[index];  // 返回引用
}

int arr[5] = {1, 2, 3, 4, 5};

// 可以作为左值
getElement(arr, 0) = 100;  // arr[0] 变为 100
```

::: danger 警告
不要返回局部变量的引用！

```cpp
// 错误示例
int& badFunction() {
    int local = 42;
    return local;  // 危险！返回了已销毁变量的引用
}
```

:::

### 返回指针

```cpp
int* find(int* arr, int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return &arr[i];  // 返回找到元素的地址
        }
    }
    return nullptr;  // 未找到
}
```

## 智能指针 (C++11)

现代 C++ 推荐使用智能指针管理动态内存。

### std::unique_ptr

独占所有权，不可复制，只能移动。

```cpp
#include <memory>

// 创建
std::unique_ptr<int> ptr1(new int(42));
std::unique_ptr<int> ptr2 = std::make_unique<int>(42);  // C++14 推荐

// 访问
std::cout << *ptr2 << std::endl;

// 所有权转移
std::unique_ptr<int> ptr3 = std::move(ptr2);  // ptr2 变为空

// 自定义删除器
std::unique_ptr<FILE, decltype(&fclose)> filePtr(
    fopen("test.txt", "w"),
    fclose
);
```

### std::shared_ptr

共享所有权，使用引用计数。

```cpp
#include <memory>

// 创建
std::shared_ptr<int> ptr1 = std::make_shared<int>(42);

// 复制（共享所有权）
std::shared_ptr<int> ptr2 = ptr1;

// 引用计数
std::cout << "use_count: " << ptr1.use_count() << std::endl;  // 2

// 访问
std::cout << *ptr1 << std::endl;

// 重置
ptr1.reset();  // 引用计数减 1
```

### std::weak_ptr

弱引用，不增加引用计数，解决循环引用。

```cpp
#include <memory>

std::shared_ptr<int> shared = std::make_shared<int>(42);
std::weak_ptr<int> weak = shared;

// 检查是否有效
if (auto locked = weak.lock()) {
    std::cout << *locked << std::endl;  // 安全访问
}

// shared 重置后，weak 会失效
shared.reset();
if (weak.expired()) {
    std::cout << "对象已销毁" << std::endl;
}
```

## 指针的高级用法

### 函数指针

```cpp
int add(int a, int b) { return a + b; }
int subtract(int a, int b) { return a - b; }

// 函数指针声明
int (*operation)(int, int);

operation = add;
std::cout << operation(5, 3) << std::endl;  // 8

operation = subtract;
std::cout << operation(5, 3) << std::endl;  // 2

// 函数指针数组
int (*operations[])(int, int) = {add, subtract};
```

### std::function (C++11)

```cpp
#include <functional>

std::function<int(int, int)> func;

func = add;
std::cout << func(5, 3) << std::endl;  // 8

func = [](int a, int b) { return a * b; };
std::cout << func(5, 3) << std::endl;  // 15
```

### 成员指针

```cpp
class MyClass {
public:
    int value;
    void display() { std::cout << value << std::endl; }
};

int MyClass::* ptrValue = &MyClass::value;
void (MyClass::* ptrFunc)() = &MyClass::display;

MyClass obj;
obj.*ptrValue = 42;
(obj.*ptrFunc)();  // 调用成员函数
```

## 指针与数组

### 数组退化

```cpp
int arr[5] = {1, 2, 3, 4, 5};

// 数组名退化为指针
int* ptr = arr;  // 等价于 &arr[0]

// 无法获取数组大小
int size = sizeof(ptr) / sizeof(int);  // 错误！不是数组大小
```

### 多维数组与指针

```cpp
int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};

// 指向数组的指针
int (*ptr)[3] = matrix;

// 访问元素
ptr[0][0]  // 1
*(*ptr)    // 1
```

### 指针数组 vs 数组指针

```cpp
// 指针数组（数组中存储指针）
int* ptrArray[3];

// 数组指针（指向数组的指针）
int (*arrayPtr)[3];
```

## 最佳实践

### 使用指南

```cpp
// 1. 优先使用引用，避免不必要的指针
void func(const std::string& str);  // 好
void func(const std::string* str);  // 不必要

// 2. 优先使用智能指针，避免手动内存管理
std::unique_ptr<MyClass> ptr = std::make_unique<MyClass>();  // 好
MyClass* ptr = new MyClass();  // 不推荐
delete ptr;  // 容易忘记

// 3. 使用 nullptr 而不是 NULL
int* p = nullptr;  // 好 (C++11)
int* p = NULL;     // 旧式

// 4. 使用 const 明确意图
void func(const int* p);       // 指向常量
void func(int* const p);       // 常量指针
void func(const int* const p); // 都是常量
```

---

::: tip 总结
- **引用**：函数参数、返回值
- **智能指针**：动态内存管理
- **裸指针**：可选语义、可能为空
:::
