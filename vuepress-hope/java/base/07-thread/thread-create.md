---
title: 线程创建
icon: ri:git-branch-line
order: 2
category: Java基础
tag: 多线程基础
description: Java 线程创建详解：Thread、Runnable、Callable 的使用与区别
---

# 线程创建

Java 提供了**三种创建线程**的方式：继承 Thread、实现 Runnable、实现 Callable。

## 继承 Thread 类

### 基本用法

```java
class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(getName() + "执行：" + i);
        }
    }
}

public class ExtendsThread {
    public static void main(String[] args) {
        MyThread t1 = new MyThread();
        MyThread t2 = new MyThread();
        
        t1.start();
        t2.start();
    }
}
```

## 实现 Runnable 接口

### 基本用法

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + "执行：" + i);
        }
    }
}

public class ImplementsRunnable {
    public static void main(String[] args) {
        MyRunnable mr = new MyRunnable();
        
        Thread t1 = new Thread(mr, "线程1");
        Thread t2 = new Thread(mr, "线程2");
        
        t1.start();
        t2.start();
    }
}
```

## 实现 Callable 接口

### 基本用法

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

class MyCallable implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        return sum;
    }
}

public class ImplementsCallable {
    public static void main(String[] args) throws Exception {
        MyCallable mc = new MyCallable();
        FutureTask<Integer> ft = new FutureTask<>(mc);
        
        Thread t = new Thread(ft);
        t.start();
        
        Integer result = ft.get();
        System.out.println("结果：" + result);
    }
}
```

## 三种方式对比

| 方式 | 优点 | 缺点 | 使用场景 |
|------|------|------|----------|
| **继承 Thread** | 简单直接 | 单继承限制 | 简单场景 |
| **实现 Runnable** | 避免单继承、多共享 | 无返回值 | 需要共享资源 |
| **实现 Callable** | 有返回值、可抛异常 | 稍复杂 | 需要返回值 |

## 匿名内部类创建线程

### Runnable 匿名内部类

```java
public class AnonymousRunnable {
    public static void main(String[] args) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("匿名内部类线程");
            }
        }).start();
    }
}
```

### Lambda 表达式（JDK 8）

```java
public class LambdaThread {
    public static void main(String[] args) {
        new Thread(() -> {
            System.out.println("Lambda 线程");
        }).start();
    }
}
```

## 小结

::: tip 核心要点

1. **继承 Thread**：简单但单继承限制
2. **实现 Runnable**：推荐方式，避免单继承
3. **实现 Callable**：有返回值，支持异常
4. **匿名内部类**：简化代码
5. **Lambda**：最简洁，JDK 8+

:::

::: info 下一步
- [线程生命周期](/java/base/07-thread/thread-lifecycle.md) - 学习线程生命周期
:::
