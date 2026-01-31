---
title: std::string
icon: devicon-plain:cplusplus
order: 2
category: STL
tag: 容器
description: C++ STL std::string 字符串容器速查文档
---

# std::string

`std::string` 是 C++ STL 中用于处理**字符串**的类，本质上是一个 `std::vector<char>` 的特化版本。

::: tip 核心特点
- **动态大小**：自动管理内存
- **连续存储**：字符在内存中连续存放
- **丰富接口**：提供大量字符串操作方法
:::

## 头文件

```cpp
#include <string>
```

## 声明与初始化

```cpp
// 默认构造空字符串
std::string s1;

// 使用 C 风格字符串
std::string s2 = "Hello";
std::string s3("World");

// 使用字符串字面量（C++11）
using namespace std::string_literals;
std::string s4 = "Hello"s;

// 指定大小和填充字符
std::string s5(10, 'a');  // "aaaaaaaaaa"

// 拷贝构造
std::string s6(s2);

// 子串构造
std::string s7("Hello World", 5);  // "Hello"

// 使用初始化列表
std::string s8 = {'H', 'e', 'l', 'l', 'o'};
```

## 常用操作

### 字符访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `s[i]` | 访问第 i 个字符（不检查边界） | O(1) |
| `s.at(i)` | 访问第 i 个字符（检查边界） | O(1) |
| `s.front()` | 返回第一个字符 | O(1) |
| `s.back()` | 返回最后一个字符 | O(1) |
| `s.c_str()` | 返回 C 风格字符串指针 | O(1) |

```cpp
std::string s = "Hello";

char c1 = s[0];          // 'H'
char c2 = s.at(1);       // 'e'
char c3 = s.front();     // 'H'
char c4 = s.back();      // 'o'
const char* ptr = s.c_str();  // "Hello"
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `s.size()` / `s.length()` | 返回字符串长度 |
| `s.empty()` | 判断是否为空 |
| `s.capacity()` | 返回当前分配的存储容量 |
| `s.reserve(n)` | 预留至少 n 个字符的存储空间 |

```cpp
std::string s = "Hello";

s.size();      // 5
s.length();    // 5
s.empty();     // false
```

### 字符串修改

| 操作 | 说明 |
|------|------|
| `s += str` | 追加字符串 |
| `s.append(str)` | 追加字符串 |
| `s.push_back(c)` | 追加单个字符 |
| `s.insert(pos, str)` | 在指定位置插入 |
| `s.erase(pos, len)` | 删除指定位置字符 |
| `s.clear()` | 清空字符串 |
| `s.resize(n)` | 调整大小 |

```cpp
std::string s = "Hello";

s += " World";        // "Hello World"
s.push_back('!');     // "Hello World!"
s.insert(5, " ");     // "Hello  World!"
s.erase(5, 1);        // "Hello World!"
s.clear();            // ""
```

### 子串操作

| 操作 | 说明 |
|------|------|
| `s.substr(pos, len)` | 获取子串 |
| `s.copy(buf, len, pos)` | 复制到字符数组 |
| `s.compare(str)` | 比较字符串 |

```cpp
std::string s = "Hello World";

std::string sub = s.substr(0, 5);   // "Hello"
std::string sub2 = s.substr(6);     // "World"

int cmp = s.compare("Hello");       // > 0
```

### 查找操作

| 操作 | 说明 | 返回值 |
|------|------|--------|
| `s.find(str)` | 查找子串首次出现位置 | 位置或 `npos` |
| `s.rfind(str)` | 查找子串最后出现位置 | 位置或 `npos` |
| `s.find_first_of(str)` | 查找任一字符首次出现 | 位置或 `npos` |
| `s.find_last_of(str)` | 查找任一字符最后出现 | 位置或 `npos` |

```cpp
std::string s = "Hello World";

size_t pos = s.find("World");    // 6
size_t pos2 = s.find("xyz");     // std::string::npos

if (pos != std::string::npos) {
    std::cout << "Found at position " << pos << std::endl;
}
```

## 字符串转换

### 数字与字符串互转

::: tabs

@tab C++11 std::to_string

```cpp
// 数字转字符串
std::string s1 = std::to_string(42);       // "42"
std::string s2 = std::to_string(3.14);     // "3.140000"
std::string s3 = std::to_string(true);     // "1"
```

@tab std::stoi / stod 系列

```cpp
// 字符串转数字
int i = std::stoi("42");           // 42
double d = std::stod("3.14");      // 3.14
float f = std::stof("3.14");       // 3.14
long l = std::stol("123456789");   // 123456789

// 带位置参数
std::string s = "123abc";
size_t pos;
int num = std::stoi(s, &pos);      // num=123, pos=3
```

@tab 字符串流（传统方式）

```cpp
#include <sstream>

// 数字转字符串
std::ostringstream oss;
oss << 42;
std::string s = oss.str();         // "42"

// 字符串转数字
std::istringstream iss("123");
int num;
iss >> num;                        // num=123
```

:::

## 字符串分割与拼接

### 分割字符串

```cpp
#include <sstream>

std::string s = "Hello,World,C++";
std::stringstream ss(s);
std::string token;
std::vector<std::string> tokens;

while (std::getline(ss, token, ',')) {
    tokens.push_back(token);
}
// tokens: ["Hello", "World", "C++"]
```

### 拼接字符串

```cpp
// 使用 + 运算符
std::string result = "Hello" + " " + "World";

// 使用 append
std::string s = "Hello";
s.append(" World");

// 使用 stringstream
std::stringstream ss;
ss << "Hello" << " " << "World";
std::string result = ss.str();
```

## 大小写转换

```cpp
#include <algorithm>
#include <cctype>

std::string s = "Hello World";

// 转大写
std::transform(s.begin(), s.end(), s.begin(), ::toupper);
// "HELLO WORLD"

// 转小写
std::transform(s.begin(), s.end(), s.begin(), ::tolower);
// "hello world"
```

## 去除空白

```cpp
#include <algorithm>

// 去除前后空白
std::string s = "  hello  ";

// 去除前导空白
s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) {
    return !std::isspace(ch);
}));

// 去除尾随空白
s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
    return !std::isspace(ch);
}).base(), s.end());
```

## 常见使用场景

::: tabs

@tab 读取一行

```cpp
std::string line;
std::getline(std::cin, line);  // 读取整行
```

@tab 按单词读取

```cpp
std::string word;
while (std::cin >> word) {  // 按空白分割
    std::cout << word << std::endl;
}
```

@tab 字符串替换

```cpp
std::string s = "Hello World";

size_t pos = s.find("World");
if (pos != std::string::npos) {
    s.replace(pos, 5, "C++");
}
// "Hello C++"
```

:::

## 性能建议

::: tip 性能优化建议

1. **使用 `reserve()`**：预先分配空间
   ```cpp
   s.reserve(1000);
   ```

2. **使用 `const &` 传递参数**：避免不必要的拷贝
   ```cpp
   void print(const std::string& s);
   ```

3. **使用字符串视图（C++17）**：避免拷贝子串
   ```cpp
   void process(std::string_view sv);
   ```

4. **优先使用 `+=` 而非 `s = s + ...`**

:::

## 相关类型

- **`std::wstring`**：宽字符字符串
- **`std::u16string`**：UTF-16 字符串（C++11）
- **`std::u32string`**：UTF-32 字符串（C++11）
- **`std::string_view`**：字符串视图（C++17）
