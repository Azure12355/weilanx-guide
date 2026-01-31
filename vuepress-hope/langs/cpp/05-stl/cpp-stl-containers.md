---
title: STL 容器
icon: devicon-plain:cplusplus
order: 1
---

# STL 容器

## 容器概览

### 序列容器

| 容器 | 描述 | 头文件 |
|------|------|--------|
| `std::vector` | 动态数组 | `<vector>` |
| `std::deque` | 双端队列 | `<deque>` |
| `std::list` | 双向链表 | `<list>` |
| `std::array` | 固定大小数组 | `<array>` |
| `std::forward_list` | 单向链表 | `<forward_list>` |

### 关联容器

| 容器 | 描述 | 头文件 |
|------|------|--------|
| `std::set` | 有序集合（唯一） | `<set>` |
| `std::map` | 有序映射（唯一键） | `<map>` |
| `std::multiset` | 有序集合（可重复） | `<set>` |
| `std::multimap` | 有序映射（可重复键） | `<map>` |

### 无序容器 (C++11)

| 容器 | 描述 | 头文件 |
|------|------|--------|
| `std::unordered_set` | 哈希集合 | `<unordered_set>` |
| `std::unordered_map` | 哈希映射 | `<unordered_map>` |

## std::vector

最常用的动态数组容器。

```cpp
#include <vector>

// 创建
std::vector<int> vec1;                    // 空 vector
std::vector<int> vec2(5);                 // 5 个元素，默认值 0
std::vector<int> vec3(5, 100);            // 5 个元素，值 100
std::vector<int> vec4 = {1, 2, 3, 4, 5};  // 初始化列表
std::vector<int> vec5(vec4);              // 拷贝构造

// 添加元素
vec1.push_back(10);   // 尾部添加
vec1.emplace_back(20); // 尾部就地构造 (更高效)

vec1.insert(vec1.begin(), 5);  // 指定位置插入

// 访问元素
int first = vec1[0];           // 不检查边界
int second = vec1.at(1);       // 检查边界
int front = vec1.front();      // 第一个元素
int back = vec1.back();        // 最后一个元素
int* data = vec1.data();       // 底层数组指针

// 大小与容量
int size = vec1.size();              // 元素数量
bool empty = vec1.empty();           // 是否为空
int capacity = vec1.capacity();      // 容量
vec1.reserve(100);                   // 预留容量
vec1.resize(10);                     // 调整大小
vec1.shrink_to_fit();                // 收缩到合适大小

// 删除元素
vec1.pop_back();                     // 删除最后一个
vec1.erase(vec1.begin());            // 删除指定位置
vec1.erase(vec1.begin(), vec1.begin() + 2);  // 删除范围
vec1.clear();                        // 清空所有元素

// 遍历
for (size_t i = 0; i < vec1.size(); i++) {
    std::cout << vec1[i] << " ";
}

for (int item : vec1) {
    std::cout << item << " ";
}

for (auto it = vec1.begin(); it != vec1.end(); it++) {
    std::cout << *it << " ";
}
```

## std::deque

双端队列，支持头部和尾部的高效插入删除。

```cpp
#include <deque>

std::deque<int> dq = {1, 2, 3};

// 两端操作
dq.push_front(0);     // 头部添加
dq.push_back(4);      // 尾部添加
dq.pop_front();       // 头部删除
dq.pop_back();        // 尾部删除

// 随机访问
int item = dq[1];     // O(1)
```

## std::list

双向链表，支持任意位置的高效插入删除。

```cpp
#include <list>

std::list<int> lst = {1, 2, 3, 4, 5};

// 插入删除
lst.push_front(0);
lst.push_back(6);
lst.insert(lst.begin(), 100);
lst.erase(lst.begin());
lst.remove(3);  // 删除所有等于 3 的元素

// 链表特有操作
lst.sort();                    // 排序
lst.reverse();                 // 反转
lst.unique();                  // 删除连续重复元素
lst.merge(other_list);         // 合并（已排序）
lst.splice(lst.begin(), other_list);  // 拼接
```

## std::array (C++11)

固定大小数组，性能与原生数组相同。

```cpp
#include <array>

std::array<int, 5> arr = {1, 2, 3, 4, 5};

// 访问
int first = arr[0];
int second = arr.at(1);

// 迭代器
for (auto it = arr.begin(); it != arr.end(); it++) {
    std::cout << *it << " ";
}

// 大小
int size = arr.size();  // 编期期常量
```

## std::set

有序集合，元素唯一，自动排序。

```cpp
#include <set>

std::set<int> s = {5, 2, 8, 1, 9};

// 插入（自动排序，去重）
s.insert(3);
s.insert(5);  // 重复元素不会被插入

// 查找
auto it = s.find(3);
if (it != s.end()) {
    std::cout << "找到: " << *it << std::endl;
}

// 删除
s.erase(3);
s.erase(s.begin());

// 遍历（有序）
for (int item : s) {
    std::cout << item << " ";  // 1 2 5 8 9
}

// 查询
bool exists = s.count(5) > 0;  // 存在返回 1
```

## std::map

有序映射，键值对，键唯一。

```cpp
#include <map>

std::map<std::string, int> ages;

// 插入
ages["Alice"] = 25;
ages["Bob"] = 30;
ages.insert({"Charlie", 35});
ages.emplace("David", 40);  // 就地构造

// 访问
int aliceAge = ages["Alice"];       // 不存在会自动创建
int bobAge = ages.at("Bob");        // 不存在抛出异常

// 查找
auto it = ages.find("Bob");
if (it != ages.end()) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// 删除
ages.erase("Alice");

// 遍历（按键排序）
for (const auto& pair : ages) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}
```

## std::unordered_set (C++11)

哈希集合，平均 O(1) 查找。

```cpp
#include <unordered_set>

std::unordered_set<int> us = {5, 2, 8, 1, 9};

// 插入
us.insert(3);

// 查找
auto it = us.find(3);
if (it != us.end()) {
    std::cout << "找到: " << *it << std::endl;
}

// 查询
bool exists = us.count(5) > 0;

// 遍历（无序）
for (int item : us) {
    std::cout << item << " ";
}
```

## std::unordered_map (C++11)

哈希映射，平均 O(1) 查找。

```cpp
#include <unordered_map>

std::unordered_map<std::string, int> scores;

scores["Alice"] = 95;
scores["Bob"] = 87;

// 访问
int score = scores["Alice"];  // O(1) 平均

// 遍历（无序）
for (const auto& pair : scores) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}
```

## std::pair

键值对，常用于容器元素。

```cpp
#include <utility>

std::pair<std::string, int> p1("Alice", 25);
std::pair<std::string, int> p2 = std::make_pair("Bob", 30);

// 访问
std::cout << p1.first << ": " << p1.second << std::endl;

// 结构化绑定 (C++17)
auto [name, age] = p2;
```

## std::tuple (C++11)

固定大小的异构集合。

```cpp
#include <tuple>

// 创建
std::tuple<int, std::string, double> t1(42, "Hello", 3.14);
auto t2 = std::make_tuple(43, "World", 2.71);

// 访问
int n = std::get<0>(t1);           // 42
std::string s = std::get<1>(t1);   // "Hello"

// 结构化绑定 (C++17)
auto [num, str, val] = t2;

// 拼接和比较
auto t3 = std::tuple_cat(t1, t2);
bool equal = (t1 == t2);
```

## 容器适配器

### std::stack

```cpp
#include <stack>

std::stack<int> stk;

stk.push(1);
stk.push(2);
stk.push(3);

int top = stk.top();  // 3
stk.pop();

bool empty = stk.empty();
int size = stk.size();
```

### std::queue

```cpp
#include <queue>

std::queue<int> q;

q.push(1);
q.push(2);
q.push(3);

int front = q.front();  // 1
int back = q.back();    // 3
q.pop();
```

### std::priority_queue

```cpp
#include <queue>

// 最大堆（默认）
std::priority_queue<int> pq;
pq.push(3);
pq.push(1);
pq.push(4);
int top = pq.top();  // 4

// 最小堆
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
min_pq.push(3);
min_pq.push(1);
min_pq.push(4);
int min = min_pq.top();  // 1
```

## 迭代器

### 迭代器类型

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// 正向迭代器
for (std::vector<int>::iterator it = vec.begin(); it != vec.end(); it++) {
    std::cout << *it << " ";
}

// 常量迭代器
for (std::vector<int>::const_iterator it = vec.cbegin(); it != vec.cend(); it++) {
    std::cout << *it << " ";
}

// 反向迭代器
for (std::vector<int>::reverse_iterator it = vec.rbegin(); it != vec.rend(); it++) {
    std::cout << *it << " ";
}

// auto 关键字简化
for (auto it = vec.begin(); it != vec.end(); it++) {
    std::cout << *it << " ";
}
```

### 迭代器操作

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
auto it = vec.begin() + 2;  // 指向第 3 个元素

std::advance(it, 1);        // 前进 1
auto dist = std::distance(vec.begin(), it);  // 计算距离

std::next(it);              // 返回下一个迭代器的副本
std::prev(it);              // 返回上一个迭代器的副本
```

## 算法库

### 查找算法

```cpp
#include <algorithm>

std::vector<int> vec = {1, 2, 3, 4, 5};

// 查找元素
auto it = std::find(vec.begin(), vec.end(), 3);

// 查找第一个满足条件的元素
auto it2 = std::find_if(vec.begin(), vec.end(), [](int x) {
    return x > 3;
});

// 二分查找（需要有序）
std::vector<int> sorted = {1, 2, 3, 4, 5};
bool found = std::binary_search(sorted.begin(), sorted.end(), 3);
auto lower = std::lower_bound(sorted.begin(), sorted.end(), 3);
```

### 排序算法

```cpp
std::vector<int> vec = {5, 2, 8, 1, 9};

// 升序排序
std::sort(vec.begin(), vec.end());

// 降序排序
std::sort(vec.begin(), vec.end(), std::greater<int>());

// 自定义排序
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a > b;  // 降序
});

// 部分排序
std::partial_sort(vec.begin(), vec.begin() + 3, vec.end());

// 第 n 大元素
std::nth_element(vec.begin(), vec.begin() + 2, vec.end());
```

### 修改算法

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};
std::vector<int> dest(5);

// 复制
std::copy(vec.begin(), vec.end(), dest.begin());

// 填充
std::fill(vec.begin(), vec.end(), 0);

// 变换
std::transform(vec.begin(), vec.end(), vec.begin(), [](int x) {
    return x * 2;
});

// 去重（需要先排序）
std::sort(vec.begin(), vec.end());
auto last = std::unique(vec.begin(), vec.end());
vec.erase(last, vec.end());

// 反转
std::reverse(vec.begin(), vec.end());
```

### 数值算法

```cpp
#include <numeric>

std::vector<int> vec = {1, 2, 3, 4, 5};

// 累加
int sum = std::accumulate(vec.begin(), vec.end(), 0);

// 乘积
int product = std::accumulate(vec.begin(), vec.end(), 1, std::multiplies<int>());

// 内积
int dot = std::inner_product(vec1.begin(), vec1.end(), vec2.begin(), 0);
```

## 容器选择指南

| 场景 | 推荐容器 |
|------|----------|
| 随机访问，尾部增删 | `std::vector` |
| 两端增删 | `std::deque` |
| 中间频繁增删 | `std::list` |
| 有序，唯一 | `std::set` |
| 有序键值对 | `std::map` |
| 快速查找 | `std::unordered_set/map` |
| 栈操作 | `std::stack` |
| 队列操作 | `std::queue` |

---

::: tip 性能建议
- `std::vector` 是默认首选
- 预留容量避免重新分配
- 使用 `emplace` 比 `insert` 更高效
- 优先使用算法库而非手写循环
:::
