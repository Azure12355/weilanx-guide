---
title: std::priority_queue
icon: devicon-plain:cplusplus
order: 15
category: STL
tag: 容器适配器
description: C++ STL std::priority_queue 优先队列容器适配器速查文档
---

# std::priority_queue

`std::priority_queue` 是**容器适配器**，提供**优先队列**的数据结构，保证**顶部元素总是最大（或最小）**。

::: tip 核心特点
- **堆实现**：底层使用堆（默认大顶堆）
- **优先级访问**：顶部元素总是优先级最高的
- **受限接口**：只能访问顶部元素
- **默认底层**：使用 `std::vector`
- **默认排序**：大顶堆（大的在前）
:::

## 头文件

```cpp
#include <queue>
```

## 声明与初始化

```cpp
// 默认大顶堆
std::priority_queue<int> pq1;

// 小顶堆（使用 greater）
std::priority_queue<int, std::vector<int>, std::greater<int>> pq2;

// 使用初始化列表
std::priority_queue<int> pq3{1, 5, 3, 7, 2};

// 从向量构造
std::vector<int> v = {1, 5, 3, 7, 2};
std::priority_queue<int> pq4(v.begin(), v.end());

// 自定义比较
struct Compare {
    bool operator()(int a, int b) {
        return a > b;  // 小顶堆
    }
};
std::priority_queue<int, std::vector<int>, Compare> pq5;
```

## 常用操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `pq.push(x)` | 插入元素 x | O(log n) |
| `pq.pop()` | 移除顶部元素 | O(log n) |
| `pq.top()` | 返回顶部元素 | O(1) |
| `pq.size()` | 返回元素个数 | O(1) |
| `pq.empty()` | 判断是否为空 | O(1) |

```cpp
// 大顶堆（默认）
std::priority_queue<int> pq;

pq.push(3);  // pq: [3]
pq.push(1);  // pq: [3, 1]
pq.push(4);  // pq: [4, 1, 3]
pq.push(2);  // pq: [4, 2, 3, 1]

// 访问顶部（最大值）
int top = pq.top();  // top = 4

// 移除顶部
pq.pop();  // pq: [3, 2, 1]，移除 4

// 容量操作
pq.size();   // 3
pq.empty();  // false
```

::: warning `pop()` 不返回值
调用 `pop()` 不会返回被移除的元素，需要先通过 `top()` 获取：
```cpp
// 错误写法
int x = pq.pop();  // 编译错误

// 正确写法
int x = pq.top();  // 先获取
pq.pop();          // 再移除
```
:::

## 小顶堆

```cpp
// 方法 1：使用 greater
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;

min_pq.push(3);
min_pq.push(1);
min_pq.push(4);

int top = min_pq.top();  // top = 1（最小值）

// 方法 2：插入负值（大顶堆模拟小顶堆）
std::priority_queue<int> pq2;
pq2.push(-3);
pq2.push(-1);
pq2.push(-4);
int top = -pq2.top();  // top = 1
```

## 自定义类型

```cpp
// 自定义类型：需要重载 < 运算符
struct Task {
    int priority;
    std::string name;

    bool operator<(const Task& other) const {
        return priority < other.priority;  // 大顶堆
    }
};

std::priority_queue<Task> tasks;

tasks.push({3, "Low"});
tasks.push({1, "High"});
tasks.push({2, "Medium"});

// top 优先级最高
Task top = tasks.top();  // priority: 3, name: "Low"

// 或使用自定义比较器
struct TaskCompare {
    bool operator()(const Task& a, const Task& b) {
        return a.priority > b.priority;  // 小顶堆
    }
};

std::priority_queue<Task, std::vector<Task>, TaskCompare> min_tasks;
```

## 底层容器访问

```cpp
std::priority_queue<int> pq;

// 获取底层容器的引用
std::vector<int>& container = pq.;  // 注意：. 是成员名称
// 也可以使用 c（C++11）
auto& c = pq.c;
```

## 常见使用场景

::: tabs

@tab Top K 问题

```cpp
// 找出最大的 K 个数
std::vector<int> topK(const std::vector<int>& nums, int k) {
    std::priority_queue<int> pq(nums.begin(), nums.end());

    std::vector<int> result;
    for (int i = 0; i < k && !pq.empty(); ++i) {
        result.push_back(pq.top());
        pq.pop();
    }

    return result;
}

// 找出最小的 K 个数（使用小顶堆）
std::vector<int> topKSmall(const std::vector<int>& nums, int k) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> pq(nums.begin(), nums.end());

    std::vector<int> result;
    for (int i = 0; i < k && !pq.empty(); ++i) {
        result.push_back(pq.top());
        pq.pop();
    }

    return result;
}
```

@tab 任务调度

```cpp
struct Task {
    int priority;
    std::string job;

    bool operator<(const Task& other) const {
        return priority < other.priority;  // 优先级高的先执行
    }
};

class TaskScheduler {
    std::priority_queue<Task> tasks;

public:
    void addTask(int priority, const std::string& job) {
        tasks.push({priority, job});
    }

    void executeNext() {
        if (!tasks.empty()) {
            Task task = tasks.top(); tasks.pop();
            std::cout << "Executing: " << task.job << std::endl;
        }
    }

    bool hasTasks() const {
        return !tasks.empty();
    }
};
```

@tab 哈夫曼编码

```cpp
struct Node {
    int freq;
    char ch;
    Node *left, *right;

    Node(int f, char c = '\0', Node* l = nullptr, Node* r = nullptr)
        : freq(f), ch(c), left(l), right(r) {}

    bool operator<(const Node& other) const {
        return freq > other.freq;  // 小顶堆
    }
};

std::string huffmanEncode(const std::string& text) {
    // 统计频率
    std::map<char, int> freq;
    for (char c : text) {
        freq[c]++;
    }

    // 构建小顶堆
    std::priority_queue<Node> pq;
    for (auto [ch, f] : freq) {
        pq.push(Node(f, ch));
    }

    // 构建哈夫曼树
    while (pq.size() > 1) {
        Node* right = new Node(pq.top()); pq.pop();
        Node* left = new Node(pq.top()); pq.pop();
        pq.push(Node(left->freq + right->freq, '\0', left, right));
    }

    // ... 生成编码
    return "";
}
```

@tab 合并 K 个有序链表

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

struct Compare {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val;  // 小顶堆
    }
};

ListNode* mergeKLists(std::vector<ListNode*>& lists) {
    std::priority_queue<ListNode*, std::vector<ListNode*>, Compare> pq;

    for (ListNode* head : lists) {
        if (head) {
            pq.push(head);
        }
    }

    ListNode dummy(0);
    ListNode* tail = &dummy;

    while (!pq.empty()) {
        ListNode* node = pq.top(); pq.pop();
        tail->next = node;
        tail = tail->next;

        if (node->next) {
            pq.push(node->next);
        }
    }

    return dummy.next;
}
```

@tab Dijkstra 最短路径

```cpp
using Edge = std::pair<int, int>;  // {destination, weight}

std::vector<int> dijkstra(const std::vector<std::vector<Edge>>& graph, int start) {
    int n = graph.size();
    std::vector<int> dist(n, INT_MAX);
    dist[start] = 0;

    // 小顶堆：{distance, vertex}
    std::priority_queue<std::pair<int, int>,
                      std::vector<std::pair<int, int>>,
                      std::greater<std::pair<int, int>>> pq;

    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();

        if (d > dist[u]) continue;

        for (auto [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}
```

@tab 滑动窗口最大值

```cpp
std::vector<int> maxSlidingWindow(std::vector<int>& nums, int k) {
    std::vector<int> result;
    std::priority_queue<std::pair<int, int>> pq;  // {value, index}

    for (int i = 0; i < nums.size(); ++i) {
        pq.push({nums[i], i});

        // 移除超出窗口的元素
        while (pq.top().second <= i - k) {
            pq.pop();
        }

        // 记录窗口最大值
        if (i >= k - 1) {
            result.push_back(pq.top().first);
        }
    }

    return result;
}
```

:::

## 选择底层容器

| 底层容器 | 优点 | 缺点 |
|---------|------|------|
| `std::vector`（默认） | 最佳性能，推荐使用 | 无明显缺点 |
| `std::deque` | 平衡性能 | 稍慢于 vector |

```cpp
// 使用 deque 作为底层
std::priority_queue<int, std::deque<int>> pq;
```

## 性能建议

::: tip 使用建议

1. **使用小顶堆时注意语法**
   ```cpp
   std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
   ```

2. **检查空后再 `top()`**
   ```cpp
   if (!pq.empty()) {
       int x = pq.top();
   }
   ```

3. **自定义类型要重载 `<`**
   ```cpp
   struct MyType {
       int priority;
       bool operator<(const MyType& other) const {
           return priority < other.priority;
       }
   };
   ```

:::

## priority_queue vs set/multiset

| 特性 | priority_queue | set/multiset |
|------|---------------|--------------|
| 底层实现 | 堆 | 红黑树 |
| 访问任意元素 | 不支持 | 支持 |
| 访问极值 | O(1) | O(1) |
| 插入/删除 | O(log n) | O(log n) |
| 内存开销 | 较小 | 较大 |
| 使用场景 | 只需极值 | 需要遍历/查找 |

## 相关容器

- **`std::queue`**：普通队列（FIFO）
- **`std::stack`**：栈（LIFO）
- **`std::set`**：有序集合（支持遍历）
- **`std::vector`**：priority_queue 的默认底层
