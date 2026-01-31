---
title: Java 正则表达式操作
shortTitle: Java 正则表达式
description: 本篇内容介绍Java中的正则表达式相关的操作，零基础入门Regex正则表达式，包含了基础、进阶、实战相关内容。让你能够直接上手实操。
author: 
    name: 蔚蓝Lynx,
    url: https://www.weilanx.com
    email: azure_ylt9217@163.com
isOriginal: true;
icon: bi:regex
date: 2025-12-29
---





![画板](https://image.weilanx.com/20251229201125011.jpeg!blog-img)

# 一、正则表达式核心语法
## （一）基础字符与转义
### 1.1 元字符
+ 包含：`. ^ $ * + ? {} [] \ | ()`
+ 规则：如果要匹配元字符本身，必须使用 `\` 转义字符

### 1.2 点号
点号 `.` 用于匹配除了换行符以外的任意一个字符



|  场景 |  正则表达式 |  匹配目标 |  不匹配 |  经典错误❌ |
| --- | --- | --- | --- | --- |
| 匹配文件名 | a\.txt | a.txt | atxt | a.txt（点号未转义会匹配 `abtxt`, `a@txt`） |
| 匹配路径 | `C:\\Windows` | `C:\Windows` | `C:Windows` | Java 中字符串反斜杠需要使用双重转义 `\\\\` |


## （二）字符组
定义一个位置上允许出现的字符集合

+ `[abc]`：只允许出现 `a`, `b`, `c` 这三个字符
+ `[^abc]`：只允许出现除了`a`, `b`, `c` 这三个字符的其他任何字符
+ `[a-z]`：允许出现所有的小写字母

|  场景 |  正则表达式 |  匹配目标 |  不匹配 |  经典错误❌ |
| --- | --- | --- | --- | --- |
| 十六进制位 | `[0-9A-Fa-f]` | `AB12348` | `ASHJKL` | `A-z`中包含了了 `[`, `\`, `]`等其他 ASCII 字符 |
| 排除数字 | `[^0-9]` | `a`,`#` | `1234` | 不要把 `^`放到中括号的外面，否则就变成了开头匹配 |


## （三）预定义字符集
+ `\d`：数字 `[0-9]`
+ `\w`：单词字符 `[a-z0-9A-Z_]`（注意包含了下划线）
+ `\s`：空白字符（空格、制表符、换行符）
+ 大写字母表示取反：`\D`(非数字)，`\W`(非单词)， `\S`(非空白)

|  场景 |  正则表达式 |  匹配目标 |  不匹配 |  经典错误❌ |
| --- | --- | --- | --- | --- |
| 匹配变量名 | `^[a-zA-z_]\w*` | `var1`, `_cnt` | `1var` | 认为 `\w`不包含数字 |
| 匹配空格 | `\s+` | `  ` | `a` | 只写空格字符 `'  '`无法匹配 Tab |


## （四）量词
控制字符出现的次数

+ `*`：0 次或多次
+ `+`：1 次或多次
+ `?`：0 次或 1 次
+ `{n}`：恰好 n 次
+ `{n,}`：至少 n 次
+ `{n,m}`：至少 n 次，至多 m 次

|  场景 |  正则表达式 |  匹配目标 |  不匹配 |  经典错误❌ |
| --- | --- | --- | --- | --- |
| 手机号 | `1\d{10}` | `13816181728` | `12347` | `1\d{10,}`没限制长度 |
| http 协议 | `https?` | `http`, `https` | `httpp` | `(https)?`匹配整个单词出现 1 次或者 0 次 |


## （五）贪婪&懒惰
+ 贪婪模式：尽可能多的匹配
+ 懒惰：尽可能少的匹配

|  场景 |  文本 |  正则匹配 |  结果 |  注意📢 |
| :---: | --- | :---: | --- | :---: |
|  提取标签 贪婪模式 | ```html <div>A<div> <div>B<div> ```  | `<div>.*</div>` | ```html <div>A<div> <div>B<div> ```  | 没加 `?`是贪婪模式 |
|  提取标签 懒惰模式 | ```html <div>A<div> <div>B<div> ```  | `<div>.*?</div>` | ```html <div>A<div> ```  | 加上 `?`是懒惰模式 |


## （六）边界匹配
定位位置，不消耗字符

+ `^`：行首（或字符串首）
+ `$`：行尾（或字符串尾）
+ `\b`：单词边界

|  场景 |  正则表达式 |  匹配目标 |  不匹配 |  经典错误❌ |
| --- | --- | --- | --- | --- |
| 校验 QQ 号 | `^\d{5,12}$` | `181728` | `12sq347` | 没加 `^$`, `abs12347asdf`也能匹配成功 |
| 查找单词 | `\bcat\b` | `cat` | `category` | 没加 `\b`，会误匹配 `certificate`中的 cat |


## （七）分组与引用
+ `(exp)`：捕获分组，自动编号（1，2，3 ...）
+ `(?:exp)`：非捕获分组，只用于逻辑组合，不保存结果
+ `\1`：反向引用，引用第一个分组匹配到的具体内容

|  场景 |  正则表达式 |  匹配目标 |  不匹配 |  经典错误❌ |
| --- | --- | --- | --- | --- |
| 匹配重复词 | `(\w+)\s\1` | `go go` | `go to` | `(\w+)\s\w+`无法保证前后单词一致 |
| 年月日 | `(\d{4})-(\d{2})-(\d{2})` | `2004-04-14` |  | 应用：`$1`年 `$2`月格式化替换 |


## （八）断言
零宽断言，只判断「周围有什么」，不消耗字符

+ `(?=exp)`：正向先行断言（往右看必须是）
+ `(?!exp)`：负向先行断言（往右看不能是）
+ `(?<=exp)`：正向后行断言（往左看必须是）
+ `(?<!exp)`：负向后行断言（往左看不能是）

|  场景 |  正则表达式 |  匹配目标 |
| --- | --- | --- |
| 强密码 | `^(?=.*[A-Z])(?=.*[a-z]).{8,}$` | 必须包含大小写，且长度大于 8 |
| 金额提取 | `(?<=\$)\d+` | 匹配 `$100`中的 `100`不含$ |


# 二、Java 正则表达式操作
## （一）String 类的便捷操作
### 1.1 验证 matches
```java
String phone = "13817238213";

// 【经典错误❌】matches会自动加上 ^$，无需手动添加
boolean isValid = phone.matches("1\\d{10}");
System.out.println(isVaild); //true
```



### 1.2 切割 split
```java
String str = "java,python,,c++";

// ✂️基础用法
String[] langs = str.split(","); // 结果：["java", "python", " ", "c++"];（中间空串会被保留）

// ⚠️经典陷阱：末尾的空串默认会被舍弃
String str2 = "a, b, c, , ";
String[] res2 = str2.split(","); // 长度是3，不是 5！

// ✅ 高级用法：limit 参数传负数，保留末尾空串
String[] res3 = str2.split(",", -1); //长度是 5
```





### 1.3 替换 replaceAll
```java
String text = "hello 123 world 456";
//将所有数字替换为 * 
String safe = text.replcaeAll("\\d+", "*");
```



## （二）Pattern 与 Matcher
对于频繁调用正则，或者需要提取内容（提取分组）的场景，必须使用 Pattern

+ 基本流程
1. `Pattern.compile(regex)`：编译正则（耗时，建议缓存）
2. `pattern.matcher(text)`：创建匹配器
3. `matcher.find() / matches()`：执行匹配



### 2.1 实战案例一：提取网页中的链接
```java
import java.util.regex.*;

public class RegexDemo{
    public static void main(String[] args) {
        String html = "<a href='https://www.google.com'>Google</a><a href='http://baidu.com'>Baidu</a>";

        // 1.编译正则表达式
        Pattern pattern = Pattern.compile("href='(.*?)'") // 懒惰模式匹配

        // 2.创建 Matcher
        Matcher matcher = pattern.matcher(html);

        // 3.循环查找(find)
        while (matcher.find()) {
            // group(0) 是整个匹配到的串：href='https://...'
            // group(1) 是第一个括号内的内容 https://www.google.com
            System.out.println("Found URL: " + matcher.group(1));
        }
    }
}
```





### 2.2 实战案例二：性能优化
```java
// 【错误案例❌】再循环中编译
for (String s: list) {
    // 每次都需要编译正则，性能极差
    if (s.matches("^user_\\d+$")) { ... }
}

// 【正确案例✅】static缓存
// 在类中定义静态常量
private static final Pattern USER_ID_PATTERN = Pattern.compile("^user_\\d+$");

public void check(List<String> list) {
    for (String s: list) {
        //复用 compiled pattern
        if (USER_ID_PATTERN.matcher(s).matches()) { ... }
    }
}
```



## （三）Matcher 高级替换
```java
public class AdvancedReplace {
    public static void main(String[] args) {
        String text = "Items: 10, Price: 50";
        Pattern p = Pattern.compile("\\d+");
        Matcher m = p.matcher(text);

        StringBuffer sb = new StringBuffer();

        while (m.find()) {
            // 1.获取当前匹配到的数字
            int val = Integer.parseInt(m.group());

            // 2.逻辑处理：乘以2
            String newVal = String.valueOf(val * 2);
            
            // 3.替换并追加到 sb
            m.appendReplacement(sb, newVal);
        }

        // 4.把剩余的尾巴补上
        m.appendTail(sb);

        System.out.pringln(sb.toString());
        //输出：Items: 20, Price: 100
    }
}
```



## （四）正则标志位
在 `Pattern.compile`时可以传入 flag 改变匹配行为

+ `Pattern.CASE_INSENSITIVE``(?i)`：忽略大小写
+ `Pattern.ODTALL``(?s)`：让 `.`号也能匹配换行符（默认不匹配）
+ `Pattern.MULTILINE``(?m)`：让 `^`和 `$` 匹配每一行的行首行尾，而不仅仅是整个字符串的开头结尾

```java
String log = "Start\nEnd";
// ❌默认 . 不匹配 \n 匹配失败
boolean b1 = Pattern.compile("Start.*End").matcher(log).matches(); //false

// ✅ 开启 DOTALL模式
boolean b2 = Pattern.compile("Start.*End", Pattern.DOTALL).matcher(log).matches(); //true

// ✅ 内联写法（推荐，更简洁）
boolean b3 = log.matches("(?s)Start.*End"); //true
```



# 融会贯通🦙
## 案例一：密码与规则校验
**背景：**  
你的系统需要一个极其严格的密码校验器，同时还要顺便从一段脏数据中提取出所有合法的密码进行分析。  
密码规则如下：

+ 长度必须在 12 到 32 位之间。
+ 必须同时包含以下四类字符中的至少三类：
    - 大写字母 `[A-Z]`
    - 小写字母 `[a-z]`
    - 数字 `[0-9]`
    - 特殊符号 (仅限 `!@#$%^&*?`)
+ 不能包含连续 3 个及以上的重复字符（例如 `aaa`、`111` 是禁止的）。
+ 不能包含用户名（假设用户名是已知的，忽略大小写）。

---

任务：  
编写一个方法 `List<String> extractAndValidate(String rawText, String username)`。

+ 从 `rawText` 中提取出所有符合基础格式（长度12-32，不含空格）的潜在密码串。
+ 对提取出的串进行上述规则校验。
+ 返回所有合法的密码列表。

考察点：

+ 零宽先行断言 `(?=, ?!)` 的组合使用。
+ 反向引用 `(\1)` 检测重复字符。
+ Pattern 标志位 `(CASE_INSENSITIVE)`。

---

💡思路：

+ Step1 提取：用简单的正则 `[a-zA-Z0-9!@#$%^&*?]{12,32}`从脏文本中提取潜在密码，不要使用 `split()`
+ Step2 校验：处理潜在密码，编写简单正则并进行逻辑组装来判断
    - 规则 A：是否包含重复字符？`(.)\\1\\1`
    - 规则 B：是否包含用户名？
    - 规则 C：字符种类是否大于 3？

```java
import java.util.regex.*;
import java.util.*;
import java.lang.String;

public class PasswordValid {

    // 正则匹配：提取原始文本中的潜在密码
    private static final Pattern PASSWORD_EXTRACT = Pattern.compile("[a-zA-Z0-9!@#$%^&*?]{12,32}");

    // 正则匹配：提取重复字符
    private static final Pattern CHAR_REPEAT_PATTERN = Pattern.compile("(.)\\1\\1");

    // 正则匹配：字符种类
    private static final Pattern HAS_UPPER = Pattern.compile("[A-Z]");
    private static final Pattern HAS_LOWER = Pattern.compile("[a-z]");
    private static final Pattern HAS_DIGITAL = Pattern.compile("[0-9]");
    private static final Pattern HAS_SPECIAL = Pattern.compile("[!@#$%^&*?]");
    
    public static void main(String[] args) {   
        String rawText = "Here are some passwords: Password123!@# (too simple), " +
                "Correct-Answer-Is: StrongP@ssw0rd2023 " +  // 合法
                "BadOne: aaa123456789 (repeats), " +
                "UserContained: admin123456789! (contains admin)";
        
        String username = "Admin"; // 测试忽略大小写匹配

        PasswordValid validator = new PasswordValid();
        List<String> validPasswords = validator.extractAndValidate(rawText, username);

        System.out.println("Valid Passwords: " + validPasswords);
    }

    public List<String> extractAndValidate(String rawText, String username) {
        List<String> result = new ArrayList<>();

        // 1.提取 rawText 中所有潜在的密码
        Matcher extractor = PASSWORD_EXTRACT.matcher(rawText);
        while (extractor.find()) {
            // group() 就是刚才提取到的“潜在密码”
            String pwd = extractor.group();

            // 2.校验提取出的密码
            if (isValid(pwd, username)) {
                result.add(pwd);
            }
        }

        return result;
    }

    public boolean isValid(String pwd, String username) {
        // 1.校验是否包含重复字符
        if (CHAR_REPEAT_PATTERN.matcher(pwd).find()) return false;

        // 2.校验是否包含用户名
        if (pwd.toLowerCase().contains(username.toLowerCase())) return false;

        int cnt = 0;
        if (HAS_UPPER.matcher(pwd).find()) cnt++;
        if (HAS_LOWER.matcher(pwd).find()) cnt++;
        if (HAS_DIGITAL.matcher(pwd).find()) cnt++;
        if (HAS_SPECIAL.matcher(pwd).find()) cnt++;

        return cnt >= 3;
        
    }

    
}
```

## 案例二：Nginx 网关日志分析
背景：  
你正在编写一个日志监控系统，需要解析 Nginx 的 access.log。日志格式并不完全标准，且混杂了换行符。  
一条典型的日志如下（可能跨行）：

```systemverilog
[2023-10-01 14:20:30] IP:192.168.1.105 "POST /api/v1/login?user=admin&token=xyz HTTP/1.1" Status:200 Bytes:1024 User-Agent:"Mozilla/5.0 (Macintosh; ...)" Ref:"http://google.com"
```

任务：  
编写一个解析器，将日志字符串转化为 Map<String, String>，需提取以下字段：

+ time: 2023-10-01 14:20:30
+ ip: 192.168.1.105
+ method: POST
+ path: /api/v1/login (注意：只要路径，不要后面的查询参数 ?user=...)
+ status: 200
+ is_internal: 如果 IP 是内网 IP（192.168.x.x 或 10.x.x.x），字段值为 "true"，否则 "false"。

考察点：

+ 复杂的分组提取 (Matcher.group(n)).
+ 非贪婪匹配 (.*?).
+ 正则对 IP 地址的匹配逻辑。
+ Matcher.find() 循环处理流式日志。

---

思路💡

+ step1：编写不同字段对应的正则表达式
    - time：`\\[(\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2})\\]`
    - ip: `IP:(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})`
    - method & path：`"\"([A-Z]+)\\s([^?]*).*?\""`
    - status: `Status:(\\d+)`
    - is_internal：在代码内的逻辑上进行实现
+ step2：分段处理不同的逻辑

```java
package com.weilanx.appendix.regex_;

import java.util.*;
import java.util.regex.*;

public class LogAnalysis {

    // 1. 时间模式
    // - \[ \] 转义匹配字面量方括号
    // - 使用 () 捕获内部时间字符串
    private static final Pattern TIME_PATTERN = Pattern.compile("\\[(\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2})\\]");

    // 2. IP模式
    // - 提取整个IP作为 group(1)
    // - 使用 ?: 非捕获分组优化性能 (可选)
    private static final Pattern IP_PATTERN = Pattern.compile("IP:(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})");

    // 3. 核心请求行模式 (Method + Path)
    // 技巧：一次性提取 Method 和 Path，因为它们在一起
    // POST /api/v1/login?user=...
    // group(1): POST
    // group(2): /api/v1/login (利用 [^?]* 排除问号后的参数)
    private static final Pattern REQUEST_PATTERN = Pattern.compile("\"([A-Z]+)\\s([^?]*).*?\"");

    // 4. 状态模式
    private static final Pattern STATUS_PATTERN = Pattern.compile("Status:(\\d+)");

    public static void main(String[] args) {
        String rawLog = "[2023-10-01 14:20:30] IP:192.168.1.105 \"POST /api/v1/login?user=admin&token=xyz HTTP/1.1\" Status:200 Bytes:1024 User-Agent:\"Mozilla/5.0 (Macintosh; ...)\" Ref:\"http://google.com\"";

        Map<String, String> resMap = extractLogInfo(rawLog);

        // 打印结果验证
        resMap.forEach((k, v) -> System.out.println(k + ": " + v));
    }

    public static Map<String, String> extractLogInfo(String rawLog) {
        Map<String, String> resMap = new HashMap<>();

        // 1. 提取时间
        Matcher timeMatcher = TIME_PATTERN.matcher(rawLog);
        if (timeMatcher.find()) {
            // group(1) 提取括号里的内容，即不含 [] 的时间
            resMap.put("time", timeMatcher.group(1));
        }

        // 2. 提取IP (并判断内网)
        Matcher ipMatcher = IP_PATTERN.matcher(rawLog);
        if (ipMatcher.find()) {
            String ip = ipMatcher.group(1);
            resMap.put("ip", ip);
            resMap.put("is_internal", isInternalIp(ip) ? "true" : "false");
        }

        // 3. 提取 Method 和 Path (合并处理)
        Matcher reqMatcher = REQUEST_PATTERN.matcher(rawLog);
        if (reqMatcher.find()) {
            resMap.put("method", reqMatcher.group(1)); // POST
            resMap.put("path", reqMatcher.group(2));   // /api/v1/login
        }

        // 4. 提取状态码
        Matcher statusMatcher = STATUS_PATTERN.matcher(rawLog);
        if (statusMatcher.find()) {
            resMap.put("status", statusMatcher.group(1));
        }

        return resMap;
    }

    // 辅助方法：判断内网IP
    // 内网段：192.168.x.x 或 10.x.x.x
    private static boolean isInternalIp(String ip) {
        return ip.startsWith("192.168.") || ip.startsWith("10.");
    }
}
```

