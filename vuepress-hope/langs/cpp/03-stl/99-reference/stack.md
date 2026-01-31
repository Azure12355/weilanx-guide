---
title: std::stack
icon: devicon-plain:cplusplus
order: 13
category: STL
tag: 容器适配器
description: C++ STL std::stack 栈容器适配器速查文档
---

# std::stack

`std::stack` 是**容器适配器**，提供**栈**（LIFO：后进先出）的数据结构。

::: tip 核心特点
- **LIFO 顺序**：后进先出
- **受限接口**：只允许在顶部操作
- **适配器模式**：底层可使用 `deque`、`list`、`vector`
- **默认底层**：使用 `std::deque`
:::

## 头文件

```cpp
#include <stack>
```

## 声明与初始化

```cpp
// 默认构造（使用 deque 作为底层容器）
std::stack<int> s1;

// 指定底层容器
std::stack<int, std::vector<int>> s2;    // 使用 vector
std::stack<int, std::list<int>> s3;      // 使用 list

// 使用初始化列表（需要先创建底层容器）
std::deque<int> dq = {1, 2, 3};
std::stack<int> s4(dq);

// 拷贝构造
std::stack<int> s5(s4);
```

## 常用操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `s.push(x)` | 将 x 压入栈顶 | O(1) |
| `s.pop()` | 弹出栈顶元素 | O(1) |
| `s.top()` | 返回栈顶元素 | O(1) |
| `s.size()` | 返回元素个数 | O(1) |
| `s.empty()` | 判断是否为空 | O(1) |

```cpp
std::stack<int> s;

// 入栈
s.push(1);  // s: [1]
s.push(2);  // s: [1, 2]
s.push(3);  // s: [1, 2, 3]

// 访问栈顶
int top = s.top();  // top = 3（栈顶元素）

// 出栈
s.pop();  // s: [1, 2]，移除 3

// 容量操作
s.size();   // 2
s.empty();  // false
```

::: warning `pop()` 不返回值
调用 `pop()` 不会返回被弹出的元素，需要先通过 `top()` 获取：
```cpp
// 错误写法
int x = s.pop();  // 编译错误

// 正确写法
int x = s.top();  // 先获取
s.pop();          // 再弹出
```
:::

## 底层容器访问

`std::stack` 提供对底层容器的访问：

```cpp
std::stack<int> s;

// 获取底层容器的引用
std::deque<int>& container = s.;  // 注意：. 是成员名称
// 也可以使用 c（C++11）
auto& c = s.c;

// 可以直接操作底层容器
container.push_back(100);
```

## 常见使用场景

::: tabs

@tab 括号匹配

```cpp
bool isValidParentheses(const std::string& s) {
    std::stack<char> st;

    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();

            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }

    return st.empty();
}
```

@tab 表达式求值

```cpp
int evaluatePostfix(const std::string& expr) {
    std::stack<int> st;

    std::istringstream iss(expr);
    std::string token;

    while (iss >> token) {
        if (isdigit(token[0])) {
            st.push(std::stoi(token));
        } else {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();

            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else if (token == "/") st.push(a / b);
        }
    }

    return st.top();
}
```

@tab 函数调用栈

```cpp
// 模拟递归
struct Frame {
    int n;
    int stage;
};

int factorial(int n) {
    std::stack<Frame> st;
    st.push({n, 0});

    int result = 1;

    while (!st.empty()) {
        auto [current, stage] = st.top();
        st.pop();

        if (current == 0 || current == 1) {
            continue;
        }

        if (stage == 0) {
            st.push({current, 1});
            st.push({current - 1, 0});
        } else {
            result *= current;
        }
    }

    return result;
}
```

@tab 深度优先搜索

```cpp
void dfs(const std::vector<std::vector<int>>& graph, int start) {
    std::stack<int> st;
    std::vector<bool> visited(graph.size(), false);

    st.push(start);
    visited[start] = true;

    while (!st.empty()) {
        int node = st.top(); st.pop();

        std::cout << node << " ";

        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                st.push(neighbor);
            }
        }
    }
}
```

@tab 撤销操作

```cpp
class TextEditor {
    std::stack<std::string> history;
    std::string text;

public:
    void write(const std::string& s) {
        history.push(text);  // 保存当前状态
        text += s;
    }

    void undo() {
        if (!history.empty()) {
            text = history.top();
            history.pop();
        }
    }

    std::string getText() const { return text; }
};
```

:::

## 选择底层容器

| 底层容器 | 优点 | 缺点 |
|---------|------|------|
| `std::deque`（默认） | 平衡性能，推荐使用 | 无明显缺点 |
| `std::vector` | 更好的缓存性能 | 中间插入效率低 |
| `std::list` | 任意位置插入高效 | 缓存性能差 |

```cpp
// 使用 vector 作为底层（缓存友好）
std::stack<int, std::vector<int>> s1;

// 使用 list 作为底层（频繁插入删除）
std::stack<int, std::list<int>> s2;
```

## 性能建议

::: tip 使用建议

1. **使用默认的 `deque`**
   ```cpp
   std::stack<int> s;  // 推荐
   ```

2. **检查空后再 `top()`**
   ```cpp
   if (!s.empty()) {
       int x = s.top();
   }
   ```

3. **优先使用 `emplace()`**（C++11）
   ```cpp
   s.emplace(1, 2, 3);  // 直接构造元素
   ```

:::

## 相关容器

- **`std::queue`**：队列（FIFO）
- **`std::priority_queue`**：优先队列
- **`std::deque`**：双端队列（stack 的默认底层）
