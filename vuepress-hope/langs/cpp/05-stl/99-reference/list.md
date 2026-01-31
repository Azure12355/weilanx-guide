---
title: std::list
icon: devicon-plain:cplusplus
order: 4
category: STL
tag: 容器
description: C++ STL std::list 双向链表容器速查文档
---

# std::list

`std::list` 是**双向链表**容器，支持在任意位置高效插入和删除元素。

::: tip 核心特点
- **双向链表**：每个节点包含前后指针
- **高效插入删除**：任意位置插入删除都是 O(1)
- **不支持随机访问**：只能顺序访问，无 `[]` 操作符
- **迭代器稳定**：插入删除操作不会使迭代器失效
- **非连续存储**：节点在内存中不连续
:::

## 头文件

```cpp
#include <list>
```

## 声明与初始化

```cpp
// 默认构造空 list
std::list<int> l1;

// 指定大小，值初始化为 0
std::list<int> l2(10);

// 指定大小和初始值
std::list<int> l3(10, 5);  // 10 个元素，值都为 5

// 使用初始化列表
std::list<int> l4 = {1, 2, 3, 4, 5};

// 拷贝构造
std::list<int> l5(l4);

// 使用迭代器范围构造
std::list<int> l6(l4.begin(), l4.end());
```

## 常用操作

### 元素访问

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `l.front()` | 返回第一个元素 | O(1) |
| `l.back()` | 返回最后一个元素 | O(1) |

::: warning 不支持随机访问
`std::list` 不支持 `[]` 和 `at()` 操作符，只能顺序访问。
:::

```cpp
std::list<int> l = {10, 20, 30, 40, 50};

int first = l.front();  // first = 10
int last = l.back();    // last = 50

// 修改首尾元素
l.front() = 100;
l.back() = 200;
```

### 容量操作

| 操作 | 说明 |
|------|------|
| `l.size()` | 返回元素个数 |
| `l.empty()` | 判断是否为空 |
| `l.resize(n)` | 调整容器大小 |
| `l.max_size()` | 返回最大可能大小 |

```cpp
std::list<int> l = {1, 2, 3};

l.size();       // 3
l.empty();      // false

l.resize(5);    // l: {1, 2, 3, 0, 0}
l.resize(2);    // l: {1, 2}
```

### 修改操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `l.push_back(x)` | 在末尾添加元素 | O(1) |
| `l.push_front(x)` | 在头部添加元素 | O(1) |
| `l.pop_back()` | 删除末尾元素 | O(1) |
| `l.pop_front()` | 删除头部元素 | O(1) |
| `l.insert(pos, x)` | 在指定位置插入元素 | O(1) |
| `l.erase(pos)` | 删除指定位置元素 | O(1) |
| `l.clear()` | 清空所有元素 | O(n) |

```cpp
std::list<int> l = {2, 3, 4};

l.push_front(1);       // l: {1, 2, 3, 4}
l.push_back(5);        // l: {1, 2, 3, 4, 5}

l.pop_front();         // l: {2, 3, 4, 5}
l.pop_back();          // l: {2, 3, 4}

// 在指定位置插入
auto it = l.begin();
std::advance(it, 1);   // 指向第二个元素
l.insert(it, 10);      // l: {2, 10, 3, 4}

// 删除指定位置
l.erase(it);           // l: {2, 10, 4}
```

### 特有操作

```cpp
std::list<int> l1 = {1, 2, 3};
std::list<int> l2 = {4, 5, 6};

// 拼接：将 l2 的所有元素移到 l1 前面
l1.splice(l1.begin(), l2);  // l1: {4, 5, 6, 1, 2, 3}, l2: {}

// 移除特定值
l1.remove(3);  // 删除所有值为 3 的元素

// 条件移除
l1.remove_if([](int n) { return n > 4; });  // 删除所有大于 4 的元素

// 去重（需要先排序）
l1.sort();
l1.unique();  // 删除连续重复的元素

// 合并（需要先排序）
l1.sort();
l2.sort();
l1.merge(l2);  // l2 的元素合并到 l1，l2 变空

// 反转
l1.reverse();

// 交换两个 list 的内容
l1.swap(l2);
```

### 迭代器

```cpp
std::list<int> l = {1, 2, 3, 4, 5};

// 正向遍历
for (auto it = l.begin(); it != l.end(); ++it) {
    std::cout << *it << " ";
}

// 范围 for 循环
for (const auto& elem : l) {
    std::cout << elem << " ";
}

// 反向遍历
for (auto it = l.rbegin(); it != l.rend(); ++it) {
    std::cout << *it << " ";
}
```

## list vs vector

| 特性 | list | vector |
|------|------|--------|
| 随机访问 | 不支持 | 支持 O(1) |
| 头部插入删除 | O(1) | O(n) |
| 中间插入删除 | O(1) | O(n) |
| 内存连续性 | 不保证 | 保证 |
| 迭代器类型 | 双向迭代器 | 随机访问迭代器 |
| 迭代器稳定性 | 稳定 | 插入可能失效 |
| 每元素开销 | 存储前后指针 | 无额外开销 |
| 缓存友好性 | 差 | 好 |

## 常见使用场景

::: tabs

@tab 频繁中间插入

```cpp
// 需要在中间频繁插入删除的场景
std::list<int> data = {1, 2, 4, 5};

auto it = data.begin();
std::advance(it, 2);
data.insert(it, 3);  // 高效插入
```

@tab 稳定迭代器

```cpp
// 插入删除不使迭代器失效
std::list<int> l = {1, 2, 3, 4, 5};

auto it = l.begin();
++it;  // 指向 2

l.push_front(0);  // it 仍然有效
l.erase(l.begin());  // it 仍然有效
```

@tab 链表操作

```cpp
// 实现自定义链表操作
std::list<int> l1 = {1, 2, 3};
std::list<int> l2 = {4, 5, 6};

// 移动元素
l1.splice(l1.end(), l2);  // l1: {1, 2, 3, 4, 5, 6}

// 排序和去重
l1.sort();
l1.unique();
```

:::

## 性能建议

::: tip 使用场景选择

**选择 list 的情况**：
- 需要在中间频繁插入删除
- 需要稳定的迭代器
- 不需要随机访问

**选择 vector 的情况**：
- 需要随机访问
- 主要在尾部操作
- 更关注缓存性能

:::

::: warning 避免随机访问

由于 list 不支持随机访问，使用 `std::advance` 或 `std::next` 移动迭代器：

```cpp
std::list<int> l = {1, 2, 3, 4, 5};

// 慢：需要 O(n) 时间
auto it = l.begin();
std::advance(it, 3);  // 指向第 4 个元素

// C++11: 使用 next
auto it2 = std::next(l.begin(), 3);
```

:::

## 相关容器

- **`std::vector`**：动态数组，支持随机访问
- **`std::deque`**：双端队列，支持随机访问
- **`std::forward_list`**：单向链表，更省内存
