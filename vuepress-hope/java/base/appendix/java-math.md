---
title: Java数学相关操作
shortTitle: Java数学操作
description: 本篇内容介绍Java中数学相关的操作，包括小数、三角函数、随机数等等内容。也有相关的数学相关的实战案例
author: 
    name: 蔚蓝Lynx,
    url: https://www.weilanx.com
    email: azure_ylt9217@163.com
isOriginal: true;
icon: fluent:math-formula-16-regular
date: 2025-12-29
---

# 一、java.lang.Math 类库
Math 类是工具类，所有的方法都是 static 类型的。直接通过 Math.方法名() 调用。

## （一）取整与舍入
| 方法  | 含义 | 示例（10.5） | 示例（-10.5） | 记忆口诀 |
| --- | --- | --- | --- | --- |
| Math.round() | 四舍五入 | 11.0 | -10.0 | +0.5 向下取整 |
| Math.ceil() | 向上取整 | 11.0 | -10.0 | 往数轴正方向取 |
| Math.floor() | 向下取整 | 10.0 | -11.0 | 往数轴负方向取 |
| Math.abs() | 绝对值 | 10.5 | 10.5 | 取绝对值 |


```java
System.out.println(Math.round(10.5)); // 11
System.out.println(Math.round(-10.5)); // -10
```

## （二）最值与比较
```java
int a = 10, b = 20;
int max = Math.max(a, b); // 20
int min = Math.min(a, b); // 10

// 限制范围（Clamp）：虽然 Math 没直接提供，但可以组合使用
// 保证 val 在 [min, max] 之间
int val = 50;
int clamped = Math.max(0, Math.min(val, 100));
```

## （三）幂运算与开方
```java
// 1. 开平方
double sqrt = Math.sqrt(16); // 4.0

// 2. 立方根
double sqrt = Math.cbrt(27); // 3.0

// 3. 幂运算（Power） - a 的 b 次方
double pow = Math.pow(2, 3); // 2^3 = 8.0
//注意：Math.pow()返回的是double，如果需要 int 需要强转
```

## （四）随机数
```java
//返回 [0.0, 1.0] 之间的 double
double rand = Math.random();

// 生成 [min, max] 之间的随机整数公式
// (int)(Math.random() * (max - min + 1) + min)
int randomInt = (int)(Math.random() * 10 + 1); //1~10
```



# 二、java.math 类库
涉及 金钱、金融、超大整数 计算时，无法使用 double 或 float，因为会有精度丢失问题（如 0.1 + 0.2 != 0.3）必须使用 BigDecimal

## （一）BigDecimal
### 1.1 初始化
```java
//【错误示例❌】直接使用数字会导致精度丢失
BigDecimal bad = new BigDecimal(0.1); // 结果其实是 0.1000000000000000000000000000055...

// 【正确示例✅】使用 String 构造器
BigDecimal good1 = new BigDecimal("0.1");

// 【正确示例✅】使用 valueOf 推荐！！！
BigDecimal good2 = BigDecimal.valueOf(0.1);
```



### 1.2 基础运算
```java
BigDecimal b1 = new BigDecimal("10.5");
BigDecimal b2 = new BigDecimal("2.0");

// 加减乘
BigDecimal sum = b1.add(b2); //12.5
BigDecimal sub = b2.subtract(b2); //8.5
BigDecimal mul = b1.multiply(b2); //21.0

//除法（必须指定精度和舍入模式，否则遇到无限循环小数会抛出异常）
// scale: 保留几位小数，RoundingMode：舍入模式
BigDecimal div = b1.divide(b2, 2, RoundingMode.HALF_UP); //四舍五入保留2位
```



### 1.3 比较大小
不能使用 equals()， 因为 1.0 和 1.00 在 equals() 中是不相等的（scale 不同）

```java
BigDecimal x = new BigDecimal("1.0");
BigDecimal y = new BigDecimal("1.00");

//【错误示例❌】使用equals无法正确比较
System.out.println(x.equals(y)); // false

//【正确示例✅】使用 compareTo
// 返回 0 表示相等，1 表示大于，-1 表示小于
System.out.println(x.compareTo(y) == 0); //true
```

## （二）BigInteger
```java
BigInteger bigA = new BigInteger("123456789123456789");
BigInteger bigB = new BigInteger("987654321987654321");


// 运算方法与 BigDecimal 类似（add、subtract、multiply、divide）
BigInteger result = bigA.add(bigB);


// 进制转换
String hex = result.toString(16); //转换为16进制字符串;
```



## （三）超长整数排序
### 3.1 使用 BigInteger
```java
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SortBigNumbers() {
    public static void main(String[] args) {
        //假设输入的是字符串类型的超大整数
        List<String> nums = Arrays.asList("123456789123456789", "99", "100", "3");

        //方式：使用 Stream 将 String 转成 BigInteger 进行排序
        // 注意：这种方式不转回 String ，最终列表里是 BigInteger 对象
        Collections.sort(nums, (s1, s2) -> {
            BigInteger b1 = new BigInteger(s1);
            BigInteger b2 = new BigInteger(s2);
            return s1.compareTo(b2);
        })

        System.out.println(nums); 
    }
}
```

### 3.2 自定义字符串比较器
```java
import java.util.Arrays;
import java.util.Comparator;

public class StringNumberSort {
    public static void main(String[] args) {
        String[] nums = {"12341234123412341234", "46523452345", "123465324", "6234659238"};

        Arrays.sort(nums, new Comparator<String>() {
            @Override
            public int compare(String s1, String s2) {
                //1.以后比较长度
                if (s1.length() != s2.length()) {
                    return s1.length() - s2.length();
                }
                //2.长度相同，直接比较字典序
                return s1.compareTo(s2);
            }
        })

        /*
        Arrays.sort(nums, (s1, s2) -> s1.length() == s2.length() ? s1.length() - s2.length(): s1.compareTo(s2))
        */
        
        System.out.println(Arrays.toString(nums));
    }
}
```

### 3.3 字符串比较器优化（处理前导 0 和负数）
```java
import java.util.Arrays;
import java.util.Comparator;

public class ComplexNumberSort {
    public static void main(String[] args) {
        String[] nums = {"-12341231789324", "70819234679801234", "12340891723894", "12340891723895", "123", "00124", "001"}

        Arrays.sort(nums, (s1, s2) -> {
            // 1.预处理：去掉前导0，使用正则表达式处理
            String cleanS1 = removeLoadingZero(s1);
            String cleanS2 = removeLoadingZero(s2);

            boolean isNeg1 = cleanS1.startWith("-");
            boolean isNeg2 = cleanS2.startWith("-");

            // 2.符号不同：正数大
            if (isNeg1 != isNeg2) {
                return isNeg1 ? -1: 1;
            }

            // 3.符号相同
            if (!isNeg1) {
                //正数
                if (cleanS1.length() != cleanS2.length()) {
                    return cleanS1.length() - cleanS2.length();
                } 
                return cleanS1.compareTo(cleanS2);
            } else {
                //负数：与正数逻辑相反
                if (cleanS1.length() != cleanS2.length()) {
                    return cleanS2.length() - cleanS1.length();
                } 
                return cleanS2.compareTo(cleanS1);
            }
        })
    }

    // 使用正则表达式去除前导0
    private static String removeLoadingZero(String s) {
        
    }
}
```

# 三、高级与位运算
## （一）位运算
```java
int n = 10;

// 1. 乘除 2 的幂（移位）
int mul2 = n << 1; // n * 2
int div2 = n >> 1; // n / 2

// 2. 判断奇偶（比 % 2 快 ）
boolean isOdd = (n & 1) == 1;

// 3. 交换两个数
a ^= b; b ^= a; a ^= b;

// 4. 求平均数（防止（a+b）溢出）
int mid = (a & b) + ((a ^ b) >> 1); //也就是 a + (b-a)/2
```

## （二）高级函数运算
```java
// 1. 三角函数（参数是弧度，不是角度）
Math.sin(Math.PI / 2); // 1.0
Math.toDegrees(Math.PI); // 180.0

// 2. 对数
Math.log(Math.E); //自然对数 ln(e) = 1.0
Math.log10(100); //以10为底 log10(100) = 2.0

// 3. 符号函数（signum）
Math.signum(-50); // 返回 -1.0（负数），0.0（零），1.0（正数）
```





# 四、Random 与随机数进阶
## （一）java.util.Random
```java
Random rand = new Random();
int i = rand.nextInt(100);
boolean b = rand.nextBoolean();
```

## （二）TreadLocalRandom
```java
import java.util.concurrent.ThreadLocalRandom;

ThreadLocalRandom current = ThreadLocalRandom.current();

int r = current.nextInt(10, 20);
```

## （三）SecureRandom
```java
SecureRandom sr = new SecureRandom();
byte[] bytes = new byte[16];
sr.nextBytes(bytes); //生成强随机的字节序列
```













