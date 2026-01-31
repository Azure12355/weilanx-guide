---
title: std::forward_list
icon: devicon-plain:cplusplus
order: 5
category: STL
tag: 容器
description: C++ STL std::forward_list 单向链表容器速查文档
---

# std::forward_list

`std::forward_list` 是 C++11 引入的**单向链表**容器，比 `std::list` 更节省内存。

::: tip 核心特点
- **单向链表**：每个节点只包含后继指针
- **内存高效**：比 `std::list` 节省一个指针的空间
- **高效插入删除**：已知位置后插入删除是 O(1)
- **不支持反向遍历**：只有前向迭代器
- **不支持 `size()`**：维护大小需要额外开销
:::

## 头文件

```cpp
#include <forward_list>
```

## 声明与初始化

```cpp
// 默认构造空 forward_list
std::forward_list<int> fl1;

// 指定大小和初始值
std::forward_list<int> fl2(10, 5);  // 10 个元素，值都为 5

// 使用初始化列表
std::forward_list<int> fl3 = {1, 2, 3, 4, 5};

// 拷贝构造
std::forward_list<int> fl4(fl3);

// 使用迭代器范围构造
std::forward_list<int> fl5(fl3.begin(), fl3.end());
```

## 常用操作

### 元素访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `fl.front()` | 返回第一个元素 | O(1) |

::: warning 限制
`std::forward_list` 不支持 `back()`、`push_back()`、`pop_back()` 操作。
:::

```cpp
std::forward_list<int> fl = {10, 20, 30, 40, 50};

int first = fl.front();  // first = 10

// 修改首元素
fl.front() = 100;
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `fl.empty()` | 判断是否为空 |
| `fl.max_size()` | 返回最大可能大小 |

::: tip 无 size() 方法
由于维护大小需要 O(n) 遍历，`std::forward_list` 故意不提供 `size()` 方法。如需获取大小，使用 `std::distance`。
:::

```cpp
std::forward_list<int> fl = {1, 2, 3};

fl.empty();  // false

// 获取大小（需要遍历）
size_t size = std::distance(fl.begin(), fl.end());  // 3
```

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `fl.push_front(x)` | 在头部添加元素 | O(1) |
| `fl.pop_front()` | 删除头部元素 | O(1) |
| `fl.insert_after(pos, x)` | 在指定位置**之后**插入 | O(1) |
| `fl.erase_after(pos)` | 删除指定位置**之后**的元素 | O(1) |
| `fl.clear()` | 清空所有元素 | O(n) |
| `fl.resize(n)` | 调整容器大小 | O(n) |

::: tip 插入位置
由于单向链表只能向前遍历，所有插入删除操作都是在指定位置**之后**进行。
:::

```cpp
std::forward_list<int> fl = {1, 2, 4, 5};

fl.push_front(0);  // fl: {0, 1, 2, 4, 5}
fl.pop_front();    // fl: {1, 2, 4, 5}

// insert_after：在指定位置之后插入
auto it = fl.begin();
++it;  // 指向 2
fl.insert_after(it, 3);  // fl: {1, 2, 3, 4, 5}

// erase_after：删除指定位置之后的元素
fl.erase_after(it);  // fl: {1, 2, 4, 5}
```

### 特有操作

```cpp
std::forward_list<int> fl1 = {1, 2, 3};
std::forward_list<int> fl2 = {4, 5, 6};

// 拼接：在指定位置之后拼接另一个链表
auto it = fl1.begin();
fl1.insert_after(it, fl2);  // fl1: {1, 4, 5, 6, 2, 3}

// 移除特定值
fl1.remove(3);  // 删除所有值为 3 的元素

// 条件移除
fl1.remove_if([](int n) { return n > 4; });  // 删除所有大于 4 的元素

// 去重（需要先排序）
fl1.sort();
fl1.unique();  // 删除连续重复的元素

// 合并（需要先排序）
fl1.sort();
fl2.sort();
fl1.merge(fl2);  // fl2 的元素合并到 fl1，fl2 变空

// 反转
fl1.reverse();

// 交换两个 forward_list 的内容
fl1.swap(fl2);
```

### before_begin 操作

`before_begin()` 返回指向首元素之前位置的迭代器，用于在头部插入：

```cpp
std::forward_list<int> fl = {2, 3, 4};

// 在头部插入（等效于 push_front）
fl.insert_after(fl.before_begin(), 1);  // fl: {1, 2, 3, 4}

// 删除首元素（等效于 pop_front）
fl.erase_after(fl.before_begin());  // fl: {2, 3, 4}
```

### 迭代器

```cpp
std::forward_list<int> fl = {1, 2, 3, 4, 5};

// 正向遍历
for (auto it = fl.begin(); it != fl.end(); ++it) {
    std::cout << *it << " ";
}

// 范围 for 循环
for (const auto& elem : fl) {
    std::cout << elem << " ";
}

// ::: warning 无反向迭代器
// std::forward_list 不支持 rbegin() 和 rend()
// :::
```

## forward_list vs list

| 特性 | forward_list | list |
|------|-------------|------|
| 指针数量 | 每节点 1 个 | 每节点 2 个 |
| 内存占用 | 更少 | 更多 |
| 反向遍历 | 不支持 | 支持 |
| `size()` | 无 | 有 |
| `back()` | 无 | 有 |
| `push_back()` | 无 | 有 |
| 插入位置 | `after` | `before` |

## 常见使用场景

::: tabs

@tab 内存受限场景

```cpp
// 大量小节点，内存敏感场景
struct SmallNode {
    int data;
    // forward_list 比 list 每节点节省一个指针
};

std::forward_list<SmallNode> nodes;
```

@tab 单向遍历

```cpp
// 只需要单向遍历的场景
std::forward_list<int> queue = {1, 2, 3, 4, 5};

for (auto& x : queue) {
    process(x);
}
```

@tab 头部操作

```cpp
// 主要在头部操作
std::forward_list<int> stack;

stack.push_front(1);
stack.push_front(2);
stack.pop_front();  // LIFO
```

:::

## 性能建议

::: tip 使用场景选择

**选择 forward_list 的情况**：
- 内存受限
- 只需单向遍历
- 主要在头部操作
- 不需要 `size()` 方法

**选择 list 的情况**：
- 需要反向遍历
- 需要 `size()` 方法
- 需要在尾部操作
:::

::: tip 获取大小技巧

如果确实需要获取 `forward_list` 的大小：

```cpp
// 方法 1：使用 distance（遍历一次）
auto size = std::distance(fl.begin(), fl.end());

// 方法 2：手动维护大小
std::forward_list<int> fl;
size_t count = 0;

// 每次插入时更新
fl.push_front(1);
++count;

// 每次删除时更新
fl.pop_front();
--count;
```

:::

## 相关容器

- **`std::list`**：双向链表
- **`std::vector`**：动态数组
- **`std::deque`**：双端队列
