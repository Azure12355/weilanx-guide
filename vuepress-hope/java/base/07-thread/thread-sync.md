---
title: 线程同步
icon: ri:lock-line
order: 4
category: Java基础
tag: 多线程基础
description: Java 线程同步详解：synchronized、Lock、线程安全问题
---

# 线程同步

线程同步是**解决多线程并发访问共享资源**导致的数据不一致问题。

## 线程安全问题

### 问题示例

```java
class Ticket implements Runnable {
    private int tickets = 100;
    
    @Override
    public void run() {
        while (tickets > 0) {
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "卖票：" + tickets--);
        }
    }
}

public class UnsafeDemo {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();
        
        new Thread(ticket, "窗口A").start();
        new Thread(ticket, "窗口B").start();
        new Thread(ticket, "窗口C").start();
        // 可能出现重票或负数票
    }
}
```

## synchronized 关键字

### 同步代码块

```java
class SafeTicket implements Runnable {
    private int tickets = 100;
    private Object lock = new Object();
    
    @Override
    public void run() {
        while (true) {
            synchronized (lock) {  // 同步代码块
                if (tickets > 0) {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName() + "卖票：" + tickets--);
                } else {
                    break;
                }
            }
        }
    }
}
```

### 同步方法

```java
class SyncMethod {
    private int count = 0;
    
    // 同步方法
    public synchronized void increment() {
        count++;
    }
    
    // 静态同步方法
    public static synchronized void staticMethod() {
        // ...
    }
}
```

**synchronized 的特点**：

- **锁对象**：非静态方法用 this，静态方法用 类名.class
- **自动释放**：代码执行完或异常时自动释放锁

## Lock 接口

### ReentrantLock 使用

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class LockTicket implements Runnable {
    private int tickets = 100;
    private Lock lock = new ReentrantLock();
    
    @Override
    public void run() {
        while (true) {
            lock.lock();  // 获取锁
            try {
                if (tickets > 0) {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName() + "卖票：" + tickets--);
                } else {
                    break;
                }
            } finally {
                lock.unlock();  // 释放锁
            }
        }
    }
}
```

## synchronized vs Lock

| 特性 | synchronized | Lock |
|------|-------------|-----|
| **使用** | 关键字 | 接口 |
| **锁释放** | 自动 | 手动 |
| **灵活性** | 低 | 高 |
| **公平锁** | 不支持 | 支持 |

## 死锁

### 死锁示例

```java
public class DeadlockDemo {
    public static void main(String[] args) {
        Object lock1 = new Object();
        Object lock2 = new Object();
        
        new Thread(() -> {
            synchronized (lock1) {
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock2) {  // 可能死锁
                    System.out.println("线程1");
                }
            }
        }).start();
        
        new Thread(() -> {
            synchronized (lock2) {
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock1) {  // 可能死锁
                    System.out.println("线程2");
                }
            }
        }).start();
    }
}
```

**避免死锁**：

1. **锁顺序**：多个线程按相同顺序获取锁
2. **超时**：使用 tryLock() 设置超时
3. **死锁检测**：使用工具检测死锁

## 小结

::: tip 核心要点

1. **线程安全**：多线程访问共享资源导致数据不一致
2. **synchronized**：同步代码块、同步方法
3. **Lock**：ReentrantLock，更灵活的锁
4. **死锁**：相互等待对方释放锁，避免死锁
5. **选择原则**：简单用 synchronized，复杂用 Lock

:::

::: info 下一步
- [线程通信](/java/base/07-thread/thread-communication.md) - 学习线程通信
:::
