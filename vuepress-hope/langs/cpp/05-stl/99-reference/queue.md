---
title: std::queue
icon: devicon-plain:cplusplus
order: 14
category: STL
tag: 容器适配器
description: C++ STL std::queue 队列容器适配器速查文档
---

# std::queue

`std::queue` 是**容器适配器**，提供**队列**（FIFO：先进先出）的数据结构。

::: tip 核心特点
- **FIFO 顺序**：先进先出
- **受限接口**：只允许在尾部添加、头部移除
- **适配器模式**：底层可使用 `deque`、`list`
- **默认底层**：使用 `std::deque`
:::

## 头文件

```cpp
#include <queue>
```

## 声明与初始化

```cpp
// 默认构造（使用 deque 作为底层容器）
std::queue<int> q1;

// 指定底层容器
std::queue<int, std::list<int>> q2;  // 使用 list

// 使用初始化列表（需要先创建底层容器）
std::deque<int> dq = {1, 2, 3};
std::queue<int> q3(dq);

// 拷贝构造
std::queue<int> q4(q3);
```

## 常用操作

| 操作 | 说明 | 时间复杂度 |
|------|------|-----------|
| `q.push(x)` | 将 x 添加到队尾 | O(1) |
| `q.pop()` | 移除队首元素 | O(1) |
| `q.front()` | 返回队首元素 | O(1) |
| `q.back()` | 返回队尾元素 | O(1) |
| `q.size()` | 返回元素个数 | O(1) |
| `q.empty()` | 判断是否为空 | O(1) |

```cpp
std::queue<int> q;

// 入队
q.push(1);  // q: [1]
q.push(2);  // q: [1, 2]
q.push(3);  // q: [1, 2, 3]

// 访问队首和队尾
int front = q.front();  // front = 1（队首）
int back = q.back();    // back = 3（队尾）

// 出队
q.pop();  // q: [2, 3]，移除 1

// 容量操作
q.size();   // 2
q.empty();  // false
```

::: warning `pop()` 不返回值
调用 `pop()` 不会返回被移除的元素，需要先通过 `front()` 获取：
```cpp
// 错误写法
int x = q.pop();  // 编译错误

// 正确写法
int x = q.front();  // 先获取
q.pop();            // 再移除
```
:::

## 底层容器访问

`std::queue` 提供对底层容器的访问：

```cpp
std::queue<int> q;

// 获取底层容器的引用
std::deque<int>& container = q.;  // 注意：. 是成员名称
// 也可以使用 c（C++11）
auto& c = q.c;
```

## 常见使用场景

::: tabs

@tab 广度优先搜索

```cpp
void bfs(const std::vector<std::vector<int>>& graph, int start) {
    std::queue<int> q;
    std::vector<bool> visited(graph.size(), false);

    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int node = q.front(); q.pop();

        std::cout << node << " ";

        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

@tab 层序遍历

```cpp
std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    std::vector<std::vector<int>> result;
    if (!root) return result;

    std::queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();
        std::vector<int> level;

        for (int i = 0; i < levelSize; ++i) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);

            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }

        result.push_back(level);
    }

    return result;
}
```

@tab 任务调度

```cpp
class TaskScheduler {
    std::queue<std::function<void()>> tasks;

public:
    void schedule(std::function<void()> task) {
        tasks.push(task);
    }

    void run() {
        while (!tasks.empty()) {
            auto task = tasks.front(); tasks.pop();
            task();
        }
    }
};
```

@tab 缓冲区

```cpp
template<typename T, size_t MaxSize>
class BoundedQueue {
    std::queue<T> q;

public:
    bool push(const T& value) {
        if (q.size() >= MaxSize) {
            return false;  // 队列已满
        }
        q.push(value);
        return true;
    }

    bool pop(T& value) {
        if (q.empty()) {
            return false;
        }
        value = q.front();
        q.pop();
        return true;
    }
};
```

@tab 生产者-消费者

```cpp
std::queue<int> buffer;
std::mutex mtx;
std::condition_variable cv;

// 生产者
void producer() {
    for (int i = 0; i < 100; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        buffer.push(i);
        cv.notify_one();
    }
}

// 消费者
void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, []{ return !buffer.empty(); });

        int value = buffer.front();
        buffer.pop();

        process(value);
    }
}
```

@tab 打印机队列

```cpp
class PrinterQueue {
    struct Job {
        std::string document;
        int priority;
    };

    std::queue<Job> jobs;

public:
    void addJob(const std::string& doc, int priority) {
        jobs.push({doc, priority});
    }

    void processNext() {
        if (!jobs.empty()) {
            Job job = jobs.front(); jobs.pop();
            print(job.document);
        }
    }

    void print(const std::string& doc) {
        std::cout << "Printing: " << doc << std::endl;
    }
};
```

:::

## queue vs stack

| 特性 | queue | stack |
|------|-------|-------|
| 顺序 | FIFO（先进先出） | LIFO（后进先出） |
| 插入位置 | 队尾 | 栈顶 |
| 删除位置 | 队首 | 栈顶 |
| 访问 | `front()`, `back()` | `top()` |
| 典型应用 | BFS、任务调度 | DFS、函数调用 |

## 选择底层容器

| 底层容器 | 优点 | 缺点 |
|---------|------|------|
| `std::deque`（默认） | 平衡性能，推荐使用 | 无明显缺点 |
| `std::list` | 更稳定的迭代器 | 缓存性能差 |

::: tip 不支持 vector
`std::queue` 不能使用 `std::vector` 作为底层容器，因为 `vector` 不支持 `pop_front()` 操作。
:::

```cpp
// 使用 list 作为底层
std::queue<int, std::list<int>> q;
```

## 性能建议

::: tip 使用建议

1. **使用默认的 `deque`**
   ```cpp
   std::queue<int> q;  // 推荐
   ```

2. **检查空后再 `front()`**
   ```cpp
   if (!q.empty()) {
       int x = q.front();
   }
   ```

3. **优先使用 `emplace()`**（C++11）
   ```cpp
   q.emplace(1, 2, 3);  // 直接构造元素
   ```

4. **使用 `swap()` 高效转移**
   ```cpp
   std::queue<int> q1, q2;
   q1.swap(q2);  // O(1) 交换
   ```

:::

## 相关容器

- **`std::stack`**：栈（LIFO）
- **`std::priority_queue`**：优先队列
- **`std::deque`**：双端队列（queue 的默认底层）
