---
title: Java 数组相关操作
shortTitle: Java 数组操作
description: 本篇内容介绍Java中数组相关操作，介绍数组中常见的知识点，易错点。数组与集合的转换，Stream流等相关知识点
author: 
    name: 蔚蓝Lynx,
    url: https://www.weilanx.com
    email: azure_ylt9217@163.com
isOriginal: true;
date: 2025-12-31
---

# 一、基础数组操作
## （一）声明&初始化数组
### 1.1 静态初始化
```java
//1.静态初始化数组
int[] arr = {1, 2, 3, 4};
```

### 1.2 动态初始化
```java
//2.动态初始化（指定对应的长度，默认为0/int/null/false）
int[] arr = new int[5];
```

### 1.3 分步初始化
```java
int[] arr;
arr = new int[]{1, 2, 3, 4, 5};
```

特别注意 `arr  = new int[]{1, 2, 3, 4}`这种写法，它是将静态初始化和动态初始化结合到了一起，进行混写。



##  （二）获取长度&访问数组
### 2.1 获取数组长度
```java
int len = arr.length;
```

注意点：获取长度使用的是 `length`属性，而不是 `length()`方法。注意和 C++等语言进行区分

### 2.2 访问元素
```java
int first = arr[0]; 
```

### 2.3 修改元素
```java
arr1[0] = 10;
```

## （三）遍历数组
### 3.1 普通 for 循环遍历
```java
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
```

### 3.2 增强 for 循环遍历
```java
for (int num: arr) {
    System.out.println(num);
}
```

### 3.3 Stream 风格遍历
```java
Arrays.stream(arr).forEach(System.out::println); //函数式风格
```

## （四）打印数组
> 特别注意：直接打印数组对象输出的是对应的哈希码（如 `I@1b6d2345`，必须使用工具类）
>

```java
import java.util.Arrays;

int[] arr = {1, 2, 3};
System.out.println(Arrays.toString(arr));  //输出：[1, 2, 3]

//如果是多维数组
int[][] matrix = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(matrix)); //输出：[[1, 2],[3, 4]]
```



# 二、java.util.Arrays 工具类操作 ⭐️
## （一）排序
```java
int[] arr = {5, 1, 3, 2, 4};

//1.升序排序 (Dual-Pivot Quicksort)
Arrays.sort(arr); //排序结果：{1, 2, 3, 4}

//2.降序排序（注意：只能对数组对象不能对普通的基本类型数组 int[]）
Integer[] arrObj = {5, 1, 3};
Arrays.sort(arrObj, Collections.reverseOrder());

//3.自定义排序（Lambda 表达式）
String[] names = {"Alice", "Bob", "Charlie"};
Arrays.sort(names, (a, b) -> b.length() - a.length()); //按长度降序
```

## （二）查找
```java
int arr[] = {1, 2, 3, 4, 5};
int index = Arrays.binarySearch(arr, 5); //返回 4
int notFound = Arrays.binarySearch(arr, 0) //返回 -1
```

## （三）填充
```java
int[] arr = new int[5];
Arrays.fill(arr, 100); //将数组值全部填充为100
```

## （四）比较
```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
System.out.println(a == b); //false（直接比较的是内存地址）
System.out.println(Arrays.equals(a, b)) //true（比较数组元素内容）
```

## （五）复制
```java
int[] original = {1, 2, 3};

//1.复制并扩容/缩容
int[] copy = Arrays.copyOf(original, 5);

//2.复制指定范围（左闭右开）
int[] range = Arrays.copyOfRange(original, 1, 3); // {2, 3}
```

# 三、数组与 List 转换 ⭐️
## （一）数组转 List
### 1.1 对象类型的数组转换
```java
String[] arr = {"A", "B", "C"};

//【陷阱】Arrays.asList() 返回的是固定长度的 List，不支持 add/remove 操作
List<String> fixedList = Arrays.asList(arr);
// fixedList.add("D"); // ❌ 抛出 UnsupportedOperationException错误

//【正确】包装成 ArrayList 以支持增删
List<String> mutableList = new ArrayList<>(Arrays.asList(arr));

//【Java 9+】创建不可变List
List<String> immutableList = List.of(arr);
```

### 1.2 基本类型的数组转换
List 类型只能操作对象，无法直接操作基本数据类型，所以需要先将对应的基本数据类型转换为对应的包装类。

```java
int[] ints = {1, 2, 3};


//【错误示例❌】
List<Integer> list = Arrays.asList(ints); //会被识别成 List<int[]>

//【正确示例✅】使用StreamAPI先将基本数据类型转成包装类，再通过集合工具类将Stream流转成List<Integer>类型
List<Integer> list = Arrays.stream(ints[]).boxed().collect(Collections.toList());
```

## （二）List 转数组
```java
List<String> list = new ArrayList<>();
list.add("A");

//推荐写法：传入一个长度为0的空数组，JVM会自动优化并创建正确大小的数组
String[] result = list.toArray(new String[0]);
```

# 四、Stream 操作 ⭐️
## （一）Java 8 Stream 操作
```java
int arr[]  = {1, 2, 3, 4, 5, 2};

//去重
int[] distinct = Arrays.stream(arr).distinct().toArray();

//过滤
int evens = Arrays.stream(arr).filter(x -> x%2 == 0).toArray();

//映射
int squares = Arrays.stream(arr).map(x -> x * x).toArray();

//统计
int sum = Arrays.stream(arr).sum();
double avg = Arrays.stream(arr).average().orElse(0);

//并行排序
Arrays.parallelSort(arr);
```

## （二）System.arraycopy 高性能复制
```java
int[] src = {1, 2, 3, 4, 5};
int[] dest = new int[10];

System.arrycopy(src, 0, dest, 2, 3);
```



## （三）克隆数组
```java
int[] arr = {1, 2, 3};
int[] clone = arr.clone();
//注意：对于对象数组，这里是「浅拷贝」修改 clone 中的对象会影响原数组
```



## （四）多维数组操作
```java
int[][] ragged = new int[3][];
ragged[0] = new int[2];
ragged[1] = new int[5];

for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        //...
    }
}
```































