---
title: 线程通信
icon: ri:chat-3-line
order: 5
category: Java基础
tag: 多线程基础
description: Java 线程通信详解：wait/notify、生产者消费者模式
---

# 线程通信

线程通信是**多个线程之间交换数据**的机制。

## wait/notify 机制

### 基本方法

```java
class WaitNotifyDemo {
    public static void main(String[] args) {
        Object lock = new Object();
        
        new Thread(() -> {
            synchronized (lock) {
                System.out.println("线程1：开始等待");
                try {
                    lock.wait();  // 释放锁，等待
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("线程1：被唤醒");
            }
        }).start();
        
        new Thread(() -> {
            synchronized (lock) {
                System.out.println("线程2：唤醒");
                lock.notify();  // 唤醒等待的线程
            }
        }).start();
    }
}
```

**wait/notify 方法**：

- `wait()`：释放锁，无限期等待
- `wait(long timeout)`：释放锁，限时等待
- `notify()`：随机唤醒一个等待的线程
- `notifyAll()`：唤醒所有等待的线程

## 生产者消费者模式

### 基本实现

```java
class Warehouse {
    private int product = 0;
    
    // 生产
    public synchronized void produce() {
        while (product >= 10) {  // 避免虚假唤醒
            try {
                wait();  // 仓库满，等待
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        product++;
        System.out.println("生产：" + product);
        notifyAll();  // 唤醒消费者
    }
    
    // 消费
    public synchronized void consume() {
        while (product <= 0) {
            try {
                wait();  // 仓库空，等待
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println("消费：" + product);
        product--;
        notifyAll();  // 唤醒生产者
    }
}

public class ProducerConsumer {
    public static void main(String[] args) {
        Warehouse warehouse = new Warehouse();
        
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                warehouse.produce();
            }
        }, "生产者").start();
        
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                warehouse.consume();
            }
        }, "消费者").start();
    }
}
```

## 小结

::: tip 核心要点

1. **wait/notify**：线程间通信的基本机制
2. **wait()**：释放锁，等待其他线程唤醒
3. **notify()**：随机唤醒一个等待线程
4. **notifyAll()**：唤醒所有等待线程
5. **生产者消费者**：wait/notify 的经典应用

:::

::: info 下一步
- [包装类](/java/base/08-common-api/wrapper-class.md) - 学习常用类与 API
:::
