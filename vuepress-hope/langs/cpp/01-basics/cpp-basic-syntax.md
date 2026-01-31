---
title: 基础语法
icon: devicon-plain:cplusplus
order: 1
---

# 基础语法

## 程序结构

C++ 程序的基本结构：

```cpp
#include <iostream>  // 头文件包含

// 主函数入口
int main() {
    std::cout << "Hello, World!" << std::endl;  // 输出语句
    return 0;  // 返回值
}
```

## 注释

```cpp
// 单行注释

/*
 * 多行注释
 * 可以跨多行
 */

/**
 * 文档注释
 * 通常用于函数/类说明
 */
```

## 变量与数据类型

### 基本数据类型

| 类型 | 描述 | 大小 | 范围 |
|------|------|------|------|
| `bool` | 布尔值 | 1 byte | `true`, `false` |
| `char` | 字符 | 1 byte | -128 ~ 127 |
| `int` | 整数 | 4 byte | -2³¹ ~ 2³¹-1 |
| `float` | 单精度浮点 | 4 byte | ±3.4E38 (7位精度) |
| `double` | 双精度浮点 | 8 byte | ±1.7E308 (15位精度) |

### 变量声明

```cpp
// 声明并初始化
int age = 25;
double price = 99.99;
char grade = 'A';
bool isActive = true;

// 列表初始化 (C++11)
int x{10};
int y = {20};

// auto 类型推导 (C++11)
auto name = "C++";      // const char*
auto value = 3.14;      // double
auto count = 100;       // int

// decltype 类型推导 (C++11)
decltype(x) z = 30;     // z 的类型与 x 相同 (int)
```

### 常量

```cpp
// const 常量
const int MAX_SIZE = 100;
const double PI = 3.14159;

// 宏常量（不推荐）
#define MAX_SIZE 100

// constexpr 编译期常量 (C++11)
constexpr int ARRAY_SIZE = 10;
int arr[ARRAY_SIZE];  // 合法，因为是编译期常量
```

## 运算符

### 算术运算符

```cpp
int a = 10, b = 3;

a + b;   // 13  加法
a - b;   // 7   减法
a * b;   // 30  乘法
a / b;   // 3   整数除法
a % b;   // 1   取模

a++;     // 后置自增，先使用后加1
++a;     // 前置自增，先加1后使用
```

### 关系运算符

```cpp
a == b   // 等于
a != b   // 不等于
a > b    // 大于
a < b    // 小于
a >= b   // 大于等于
a <= b   // 小于等于
```

### 逻辑运算符

```cpp
bool x = true, y = false;

x && y   // 逻辑与 (AND)
x || y   // 逻辑或 (OR)
!x       // 逻辑非 (NOT)
```

### 位运算符

```cpp
int a = 5;    // 二进制: 101
int b = 3;    // 二进制: 011

a & b;   // 1 (001)  按位与
a | b;   // 7 (111)  按位或
a ^ b;   // 6 (110)  按位异或
~a;      // -6       按位取反
a << 1;  // 10 (1010) 左移
a >> 1;  // 2 (10)    右移
```

## 控制流

### if-else 语句

```cpp
int score = 85;

if (score >= 90) {
    std::cout << "优秀" << std::endl;
} else if (score >= 60) {
    std::cout << "及格" << std::endl;
} else {
    std::cout << "不及格" << std::endl;
}

// 条件运算符（三元运算符）
std::string result = (score >= 60) ? "及格" : "不及格";
```

### switch 语句

```cpp
int day = 3;

switch (day) {
    case 1:
        std::cout << "星期一" << std::endl;
        break;
    case 2:
        std::cout << "星期二" << std::endl;
        break;
    case 3:
        std::cout << "星期三" << std::endl;
        break;
    default:
        std::cout << "其他" << std::endl;
}
```

### for 循环

```cpp
// 传统 for 循环
for (int i = 0; i < 10; i++) {
    std::cout << i << " ";
}

// 范围 for 循环 (C++11)
std::vector<int> nums = {1, 2, 3, 4, 5};
for (int num : nums) {
    std::cout << num << " ";
}

// 使用引用避免拷贝
for (const auto& num : nums) {
    std::cout << num << " ";
}
```

### while 循环

```cpp
// while 循环
int i = 0;
while (i < 10) {
    std::cout << i << " ";
    i++;
}

// do-while 循环
int j = 0;
do {
    std::cout << j << " ";
    j++;
} while (j < 10);
```

## 函数

### 函数定义

```cpp
// 函数声明
int add(int a, int b);

// 函数定义
int add(int a, int b) {
    return a + b;
}

// 函数调用
int result = add(5, 3);
```

### 参数传递

```cpp
// 值传递
void swapByValue(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
} // 不会改变原变量

// 引用传递
void swapByRef(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
} // 会改变原变量

// 指针传递
void swapByPtr(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// const 引用（避免拷贝大对象）
void printString(const std::string& str) {
    std::cout << str << std::endl;
}
```

### 默认参数 (C++11)

```cpp
int multiply(int a, int b = 2) {
    return a * b;
}

multiply(5);    // 10  (使用默认参数)
multiply(5, 3); // 15
```

### 函数重载

```cpp
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

// 根据参数类型自动选择
add(1, 2);        // 调用 int 版本
add(1.5, 2.5);    // 调用 double 版本
```

### 内联函数

```cpp
inline int square(int x) {
    return x * x;
}
```

## 数组与字符串

### 数组

```cpp
// 声明数组
int arr[5] = {1, 2, 3, 4, 5};

// 访问元素
arr[0] = 10;  // 第一个元素
int last = arr[4];  // 最后一个元素

// 获取数组大小
int size = sizeof(arr) / sizeof(arr[0]);

// 范围 for 遍历
for (int num : arr) {
    std::cout << num << " ";
}
```

### std::array (C++11)

```cpp
#include <array>

std::array<int, 5> arr = {1, 2, 3, 4, 5};

// 获取大小
int size = arr.size();

// 访问元素
arr[0] = 10;
arr.at(1) = 20;  // 带边界检查
```

### std::vector (动态数组)

```cpp
#include <vector>

// 创建 vector
std::vector<int> vec = {1, 2, 3, 4, 5};

// 添加元素
vec.push_back(6);

// 获取大小
int size = vec.size();

// 访问元素
int first = vec[0];
int last = vec.back();

// 遍历
for (int num : vec) {
    std::cout << num << " ";
}
```

### 字符串

```cpp
#include <string>

// C 风格字符串（不推荐）
char cstr[] = "Hello";

// std::string (推荐)
std::string str = "Hello, C++";

// 字符串拼接
std::string greeting = str + "!";

// 获取长度
int len = str.length();

// 访问字符
char first = str[0];

// 子字符串
std::string sub = str.substr(0, 5);  // "Hello"

// 查找
size_t pos = str.find("C++");
```

## 指针与引用

### 指针

```cpp
int num = 42;
int* ptr = &num;  // ptr 指向 num 的地址

// 解引用
int value = *ptr;  // 42

// 指针运算
ptr++;  // 移动到下一个 int

// 空指针 (C++11)
int* p1 = nullptr;
int* p2 = NULL;   // 旧式写法，不推荐
int* p3 = 0;      // 旧式写法，不推荐
```

### 引用

```cpp
int num = 42;
int& ref = num;  // ref 是 num 的引用

ref = 100;  // num 也变为 100

// 引用必须初始化
int& ref2;  // 错误！引用必须初始化

// 引用不能重新绑定
int num2 = 50;
ref = num2;  // 这是赋值，不是重新绑定
```

## 输入输出

```cpp
#include <iostream>

int age;
std::string name;

// 输入
std::cout << "请输入姓名: ";
std::getline(std::cin, name);  // 读取一行（包含空格）

std::cout << "请输入年龄: ";
std::cin >> age;  // 读取单个词

// 输出
std::cout << "姓名: " << name << std::endl;
std::cout << "年龄: " << age << std::endl;

// 格式化输出 (C++20)
#include <format>
std::string msg = std::format("姓名: {}, 年龄: {}", name, age);
std::cout << msg << std::endl;
```

---

::: tip 编码规范
- 使用 `{}` 初始化（C++11 统一初始化）
- 优先使用 `const` 和 `constexpr`
- 使用 `auto` 简化类型声明
- 优先使用范围 for 循环
:::
