---
title: 日期时间
icon: ri:calendar-line
order: 2
category: Java基础
tag: 常用类与API
description: Java 日期时间详解：Date、Calendar、DateTimeFormatter、新日期API
---

# 日期时间

Java 提供了**多个日期时间 API**，从传统的 Date/Calendar 到新的 LocalDateTime。

## 传统日期时间

### Date 类

```java
import java.util.Date;

public class DateDemo {
    public static void main(String[] args) {
        // 1. 当前时间
        Date date1 = new Date();
        System.out.println(date1);  // Fri Jan 31 12:00:00 CST 2026
        
        // 2. 指定时间（毫秒）
        Date date2 = new Date(1000L);
        System.out.println(date2);  // Thu Jan 01 08:00:01 CST 1970
        
        // 3. 常用方法
        System.out.println(date1.getTime());  // 毫秒值
        System.out.println(date1.after(date2));  // 是否在之后
        System.out.println(date1.before(date2)); // 是否在之前
    }
}
```

### SimpleDateFormat

```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class SimpleDateFormatDemo {
    public static void main(String[] args) throws Exception {
        Date date = new Date();
        
        // 1. 日期 → 字符串
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String str = sdf.format(date);
        System.out.println(str);  // 2026-01-31 12:00:00
        
        // 2. 字符串 → 日期
        String dateStr = "2026-01-31";
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
        Date date2 = sdf2.parse(dateStr);
        System.out.println(date2);
        
        // 3. 常用模式
        SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy年MM月dd日 E HH:mm:ss");
        System.out.println(sdf3.format(date));  // 2026年01月31日 星期五 12:00:00
    }
}
```

### Calendar 类

```java
import java.util.Calendar;

public class CalendarDemo {
    public static void main(String[] args) {
        // 1. 获取当前日历
        Calendar cal = Calendar.getInstance();
        
        // 2. 获取字段
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;  // 0-11，+1
        int day = cal.get(Calendar.DAY_OF_MONTH);
        System.out.println(year + "-" + month + "-" + day);  // 2026-1-31
        
        // 3. 设置字段
        cal.set(Calendar.YEAR, 2025);
        System.out.println(cal.get(Calendar.YEAR));  // 2025
        
        // 4. 字段加减
        cal.add(Calendar.DAY_OF_MONTH, 7);  // 加7天
        cal.add(Calendar.MONTH, -1);  // 减1个月
        
        // 5. 获取星期
        int week = cal.get(Calendar.DAY_OF_WEEK);  // 1-7
        System.out.println("星期：" + week);
    }
}
```

## 新日期时间 API（JDK 8）

### LocalDateTime

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeDemo {
    public static void main(String[] args) {
        // 1. 当前时间
        LocalDateTime now = LocalDateTime.now();
        System.out.println(now);  // 2026-01-31T12:00:00.000
        
        // 2. 指定时间
        LocalDateTime dt = LocalDateTime.of(2026, 1, 31, 12, 0, 0);
        System.out.println(dt);  // 2026-01-31T12:00
        
        // 3. 格式化
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String str = now.format(formatter);
        System.out.println(str);  // 2026-01-31 12:00:00
        
        // 4. 解析
        LocalDateTime dt2 = LocalDateTime.parse("2026-01-31 12:00:00", formatter);
        System.out.println(dt2);
        
        // 5. 字段操作
        System.out.println(now.getYear());  // 2026
        System.out.println(now.getMonthValue());  // 1
        System.out.println(now.getDayOfMonth());  // 31
        System.out.println(now.getDayOfWeek());  // FRIDAY
        
        // 6. 加减操作
        LocalDateTime newDt = now.plusDays(7).minusMonths(1);
        System.out.println(newDt);
    }
}
```

### Instant：时间戳

```java
import java.time.Instant;

public class InstantDemo {
    public static void main(String[] args) {
        // 1. 当前时间戳
        Instant now = Instant.now();
        System.out.println(now);  // 2026-01-31T04:00:00.000Z
        
        // 2. 获取毫秒
        System.out.println(now.toEpochMilli());  // 毫秒值
        
        // 3. 毫秒创建 Instant
        Instant instant = Instant.ofEpochMilli(1000000000L);
        System.out.println(instant);  // 1970-01-12T13:46:40Z
    }
}
```

## 小结

::: tip 核心要点

1. **Date**：传统日期类，很多方法已过时
2. **SimpleDateFormat**：日期格式化，format()、parse()
3. **Calendar**：日历类，set()、get()、add()
4. **LocalDateTime**：新日期API，线程安全
5. **DateTimeFormatter**：新格式化类
6. **Instant**：时间戳，代替 Date

:::

::: info 下一步
- [枚举](/java/base/08-common-api/enum.md) - 学习枚举
:::
