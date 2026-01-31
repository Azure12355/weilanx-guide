---
title: Java 常用方法
icon: ri:book-open-line
order: 1
category: Java基础
tag: 附录
description: Java 常用方法速查：字符串、数组、集合、数学、日期时间
---

# Java 常用方法

本文档整理了 Java 开发中最常用的方法，便于快速查阅。

## String 方法

### 常用方法

```java
public class StringMethods {
    public static void main(String[] args) {
        String str = "Hello World";
        
        // 1. 长度
        int length = str.length();  // 11
        
        // 2. 字符访问
        char ch = str.charAt(0);  // 'H'
        
        // 3. 子串
        String sub1 = str.substring(6);  // "World"
        String sub2 = str.substring(0, 5);  // "Hello"
        
        // 4. 查找
        int index1 = str.indexOf("o");  // 4（首次出现）
        int index2 = str.lastIndexOf("o");  // 7（最后出现）
        boolean contains = str.contains("World");  // true
        
        // 5. 比较
        boolean equals = str.equals("Hello World");  // true
        boolean ignoreCase = str.equalsIgnoreCase("hello world");  // true
        int compareTo = str.compareTo("Hello World");  // 0（相等）
        
        // 6. 转换
        String upper = str.toUpperCase();  // "HELLO WORLD"
        String lower = str.toLowerCase();  // "hello world"
        String trim = "  hello  ".trim();  // "hello"
        
        // 7. 替换
        String replace = str.replace("o", "O");  // "HellO WOrld"
        String replaceAll = str.replaceAll("o", "O");  // 正则替换
        
        // 8. 分割
        String[] parts = "a,b,c".split(",");  // ["a", "b", "c"]
        
        // 9. 判断
        boolean empty = "".isEmpty();  // true
        boolean blank = "  ".isBlank();  // true（Java 11+）
        boolean starts = str.startsWith("Hello");  // true
        boolean ends = str.endsWith("World");  // true
        
        // 10. 格式化
        String formatted = String.format("姓名：%s，年龄：%d", "张三", 20);
        // "姓名：张三，年龄：20"
    }
}
```

### StringBuilder 方法

```java
public class StringBuilderMethods {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        
        // 1. 追加
        sb.append("Hello");
        sb.append(" ");
        sb.append("World");
        // sb = "Hello World"
        
        // 2. 插入
        sb.insert(5, " Beautiful");
        // sb = "Hello Beautiful World"
        
        // 3. 删除
        sb.delete(5, 15);
        // sb = "Hello World"
        
        // 4. 替换
        sb.replace(6, 11, "Java");
        // sb = "Hello Java"
        
        // 5. 反转
        sb.reverse();
        // sb = "avaJ olleH"
        
        // 6. 转换为 String
        String str = sb.toString();
    }
}
```

## 数组方法

### Arrays 工具类

```java
import java.util.Arrays;

public class ArrayMethods {
    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6};
        
        // 1. 排序
        Arrays.sort(arr);
        // [1, 1, 2, 3, 4, 5, 6, 9]
        
        // 2. 二分查找（需要先排序）
        int index = Arrays.binarySearch(arr, 5);  // 4
        
        // 3. 填充
        int[] arr2 = new int[5];
        Arrays.fill(arr2, 10);  // [10, 10, 10, 10, 10]
        
        // 4. 复制
        int[] arr3 = Arrays.copyOf(arr, 5);  // 复制前5个元素
        int[] arr4 = Arrays.copyOfRange(arr, 2, 5);  // 复制 [2, 5)
        
        // 5. 比较
        int[] arr5 = {1, 2, 3};
        int[] arr6 = {1, 2, 3};
        boolean equals = Arrays.equals(arr5, arr6);  // true
        
        // 6. 转换为字符串
        String str = Arrays.toString(arr);  // "[1, 1, 2, 3, 4, 5, 6, 9]"
        
        // 7. 多维数组
        int[][] matrix = {{1, 2}, {3, 4}};
        String deepStr = Arrays.deepToString(matrix);  // "[[1, 2], [3, 4]]"
    }
}
```

## 集合方法

### List 方法

```java
import java.util.*;

public class ListMethods {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        
        // 1. 添加
        list.add("A");
        list.add("B");
        list.add(0, "First");  // 在指定位置插入
        
        // 2. 获取
        String first = list.get(0);  // "First"
        
        // 3. 修改
        list.set(0, "NEW");  // 修改指定位置
        
        // 4. 删除
        list.remove(0);  // 删除指定位置
        list.remove("B");  // 删除指定元素
        
        // 5. 判断
        boolean contains = list.contains("A");  // true
        boolean empty = list.isEmpty();  // false
        
        // 6. 大小
        int size = list.size();
        
        // 7. 遍历
        for (String item : list) {
            System.out.println(item);
        }
        
        // 8. 转换为数组
        String[] array = list.toArray(new String[0]);
        
        // 9. 排序
        Collections.sort(list);
        Collections.sort(list, Comparator.reverseOrder());
        
        // 10. 子列表
        List<String> subList = list.subList(0, 2);
    }
}
```

### Map 方法

```java
import java.util.*;

public class MapMethods {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        
        // 1. 添加
        map.put("A", 1);
        map.put("B", 2);
        
        // 2. 获取
        Integer value = map.get("A");  // 1
        Integer orDefault = map.getOrDefault("C", 0);  // 0
        
        // 3. 删除
        map.remove("A");
        map.remove("B", 2);  // 键值都匹配才删除
        
        // 4. 判断
        boolean containsKey = map.containsKey("A");  // true
        boolean containsValue = map.containsValue(1);  // true
        
        // 5. 遍历
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        
        // 遍历键
        for (String key : map.keySet()) {
            System.out.println(key);
        }
        
        // 遍历值
        for (Integer val : map.values()) {
            System.out.println(val);
        }
        
        // 6. 大小
        int size = map.size();
        
        // 7. 判空
        boolean empty = map.isEmpty();
    }
}
```

## 数学方法

### Math 类

```java
public class MathMethods {
    public static void main(String[] args) {
        // 1. 基本运算
        int abs = Math.abs(-10);  // 10（绝对值）
        double pow = Math.pow(2, 3);  // 8.0（幂运算）
        double sqrt = Math.sqrt(16);  // 4.0（平方根）
        double cbrt = Math.cbrt(27);  // 3.0（立方根）
        
        // 2. 取整
        double ceil = Math.ceil(3.14);  // 4.0（向上取整）
        double floor = Math.floor(3.99);  // 3.0（向下取整）
        long round = Math.round(3.5);  // 4（四舍五入）
        
        // 3. 最大/最小
        int max = Math.max(10, 20);  // 20
        int min = Math.min(10, 20);  // 10
        
        // 4. 随机数
        double random = Math.random();  // [0.0, 1.0)
        int randomInt = (int)(Math.random() * 100);  // [0, 100)
        
        // 5. 三角函数
        double sin = Math.sin(Math.PI / 2);  // 1.0
        double cos = Math.cos(0);  // 1.0
        double tan = Math.tan(Math.PI / 4);  // 1.0
        
        // 6. 常量
        System.out.println(Math.PI);  // 3.141592653589793
        System.out.println(Math.E);  // 2.718281828459045
    }
}
```

## 日期时间方法

### LocalDateTime

```java
import java.time.*;
import java.time.format.*;

public class DateTimeMethods {
    public static void main(String[] args) {
        // 1. 获取当前时间
        LocalDate now = LocalDate.now();  // 当前日期
        LocalTime time = LocalTime.now();  // 当前时间
        LocalDateTime dateTime = LocalDateTime.now();  // 当前日期时间
        
        // 2. 创建指定时间
        LocalDate date = LocalDate.of(2024, 1, 1);
        LocalTime lt = LocalTime.of(12, 30, 45);
        LocalDateTime ldt = LocalDateTime.of(2024, 1, 1, 12, 30);
        
        // 3. 格式化
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String str = dateTime.format(formatter);
        // "2024-01-01 12:30:45"
        
        // 4. 解析
        LocalDateTime parsed = LocalDateTime.parse("2024-01-01 12:30:45", formatter);
        
        // 5. 计算
        LocalDate tomorrow = now.plusDays(1);
        LocalDate nextWeek = now.plusWeeks(1);
        LocalDate nextMonth = now.plusMonths(1);
        LocalDate nextYear = now.plusYears(1);
        
        LocalDate yesterday = now.minusDays(1);
        
        // 6. 获取部分
        int year = now.getYear();  // 年
        int month = now.getMonthValue();  // 月（1-12）
        int day = now.getDayOfMonth();  // 日
        DayOfWeek week = now.getDayOfWeek();  // 星期几
        
        // 7. 判断
        boolean isLeap = now.isLeapYear();  // 是否闰年
        boolean isAfter = now.isAfter(yesterday);  // 是否在之后
        boolean isBefore = now.isBefore(tomorrow);  // 是否在之前
        
        // 8. Period（时间段）
        Period period = Period.between(yesterday, tomorrow);
        System.out.println(period.getYears());  // 0
        System.out.println(period.getMonths());  // 0
        System.out.println(period.getDays());  // 2
    }
}
```

## System 类方法

```java
public class SystemMethods {
    public static void main(String[] args) {
        // 1. 当前时间（毫秒）
        long millis = System.currentTimeMillis();
        
        // 2. 当前时间（纳秒）
        long nanos = System.nanoTime();
        
        // 3. 数组复制
        int[] src = {1, 2, 3, 4, 5};
        int[] dest = new int[5];
        System.arraycopy(src, 0, dest, 0, 5);
        
        // 4. 环境变量
        Map<String, String> env = System.getenv();
        String javaHome = env.get("JAVA_HOME");
        
        // 5. 系统属性
        String osName = System.getProperty("os.name");
        String javaVersion = System.getProperty("java.version");
        
        // 6. 退出
        // System.exit(0);  // 正常退出
        // System.exit(1);  // 异常退出
        
        // 7. 垃圾回收
        System.gc();
        
        // 8. 标准输出/输入/错误
        PrintStream out = System.out;
        InputStream in = System.in;
        PrintStream err = System.err;
    }
}
```

## Objects 类方法

```java
import java.util.Objects;

public class ObjectsMethods {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = null;
        
        // 1. 判空
        boolean isNull = Objects.isNull(str2);  // true
        boolean nonNull = Objects.nonNull(str1);  // true
        
        // 2. 相等（处理 null）
        boolean equals = Objects.equals(str1, "Hello");  // true
        boolean equals2 = Objects.equals(str2, null);  // true
        
        // 3. 默认值
        String orElse = Objects.requireNonNullElse(str2, "默认值");  // "默认值"
        
        // 4. 要求非空（否则抛出异常）
        String req = Objects.requireNonNull(str1);
        // String req2 = Objects.requireNonNull(str2, "不能为空");  // 抛出 NullPointerException
        
        // 5. 哈希
        int hash = Objects.hash(str1, str2);  // 组合哈希
        
        // 6. toString
        String str = Objects.toString(str1);  // "Hello"
        String str2 = Objects.toString(null, "NULL");  // "NULL"
    }
}
```

## Collections 工具类

```java
import java.util.*;

public class CollectionsMethods {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6));
        
        // 1. 排序
        Collections.sort(list);  // 自然排序
        Collections.sort(list, Comparator.reverseOrder());  // 降序
        
        // 2. 打乱
        Collections.shuffle(list);
        
        // 3. 反转
        Collections.reverse(list);
        
        // 4. 交换
        Collections.swap(list, 0, 1);  // 交换位置0和1
        
        // 5. 查找
        int max = Collections.max(list);  // 最大值
        int min = Collections.min(list);  // 最小值
        int frequency = Collections.frequency(list, 1);  // 频率
        
        // 6. 替换
        Collections.replaceAll(list, 1, 100);  // 所有1替换为100
        
        // 7. 填充
        Collections.fill(list, 0);  // 所有元素设为0
        
        // 8. 不可修改集合
        List<Integer> unmodifiable = Collections.unmodifiableList(list);
        Set<Integer> unmodifiableSet = Collections.unmodifiableSet(new HashSet<>(list));
        
        // 9. 单元素集合
        List<String> singletonList = Collections.singletonList("Hello");
        Set<String> singletonSet = Collections.singleton("Hello");
        
        // 10. 空集合
        List<String> emptyList = Collections.emptyList();
        Set<String> emptySet = Collections.emptySet();
    }
}
```

## 小结

::: tip 常用方法快速索引

| 类别 | 类/方法 | 说明 |
|------|---------|------|
| **字符串** | `String.length()` | 长度 |
| | `String.substring()` | 子串 |
| | `String.split()` | 分割 |
| | `String.replace()` | 替换 |
| **数组** | `Arrays.sort()` | 排序 |
| | `Arrays.toString()` | 转字符串 |
| | `Arrays.copyOf()` | 复制 |
| **集合** | `List.add()` | 添加 |
| | `Map.put()` | 添加 |
| | `Map.get()` | 获取 |
| **数学** | `Math.abs()` | 绝对值 |
| | `Math.random()` | 随机数 |
| | `Math.max()` | 最大值 |
| **日期** | `LocalDate.now()` | 当前日期 |
| | `LocalDateTime.format()` | 格式化 |
| | `LocalDate.plusDays()` | 加天数 |

:::

::: info 相关文档

- [String 详解](/java/base/03-array-string/string.md)
- [集合框架](/java/base/04-collections/overview.md)
- [日期时间](/java/base/08-common-api/datetime.md)

:::
