---
title: 运算符
icon: ri:calculator-line
order: 4
---

# 运算符

Go 语言提供了丰富的运算符，用于执行各种计算和操作。

## 运算符分类

```mermaid
mindmap
  root((Go 运算符))
    算术运算符
      加减乘除
      取模
      自增自减
    关系运算符
      等于不等
      大于小于
    逻辑运算符
      逻辑与或非
      短路求值
    位运算符
      按位与或异或
      左移右移
    赋值运算符
      简单赋值
      复合赋值
    其他运算符
      地址取值
      通道发送接收
```

## 算术运算符

### 基本运算

```go
// 加法
sum := 10 + 20        // 30

// 减法
diff := 20 - 10       // 10

// 乘法
product := 5 * 6       // 30

// 除法
quotient := 20 / 3     // 6（整数除法）
floatDiv := 20.0 / 3.0 // 6.666...

// 取模
remainder := 20 % 3    // 2
```

### 自增自减

```go
count := 0

// 后置自增：先返回值，再自增
fmt.Println(count++)  // 0
fmt.Println(count)    // 1

// 前置自增：先自增，再返回值
fmt.Println(++count)  // 2
fmt.Println(count)    // 2

// 自减同理
count--               // count = 1
--count               // count = 0
```

::: warning 自增自减注意事项

```go
// ❌ 不是表达式，不能用于复杂表达式
// result := count++ + 10  // 编译错误

// ✅ 分开操作
count++
result := count + 10
```

:::

## 关系运算符

### 比较运算

```go
// 等于
fmt.Println(10 == 10)  // true
fmt.Println(10 == 20)  // false

// 不等于
fmt.Println(10 != 20)  // true
fmt.Println(10 != 10)  // false

// 大于
fmt.Println(20 > 10)   // true

// 小于
fmt.Println(10 < 20)   // true

// 大于等于
fmt.Println(10 >= 10)  // true

// 小于等于
fmt.Println(10 <= 20)  // true
```

### 类型比较

```go
// 相同类型比较
fmt.Println(10 == 10)     // true
fmt.Println(3.14 == 3.14)  // true

// 不同类型比较
// fmt.Println(10 == 10.0)  // ❌ 编译错误

// 需要类型转换
fmt.Println(float64(10) == 10.0)  // true

// 字符串比较
fmt.Println("Go" == "Go")     // true
fmt.Println("Go" == "go")     // false（区分大小写）
```

## 逻辑运算符

### 基本逻辑运算

```go
// 逻辑与
a := true
b := false
fmt.Println(a && b)  // false

// 逻辑或
fmt.Println(a || b)  // true

// 逻辑非
fmt.Println(!a)      // false
```

### 短路求值

```go
// && 短路：第一个为 false，不计算第二个
result := false && someFunction()
fmt.Println(result)  // false

// || 短路：第一个为 true，不计算第二个
result = true || someFunction()
fmt.Println(result)  // true

func someFunction() bool {
    fmt.Println("执行了")
    return true
}
```

### 逻辑运算技巧

```go
// 默认值模式
value := defaultValue || userValue

// 条件赋值
age := userAge != 0 ? userAge : defaultAge

// 验证检查
if isValid && hasPermission {
    // 执行操作
}
```

## 位运算符

### 按位运算

```go
// 按位与
a := 5  // 0b101
b := 3  // 0b011
fmt.Println(a & b)  // 1 (0b001)

// 按位或
fmt.Println(a | b)  // 7 (0b111)

// 按位异或
fmt.Println(a ^ b)  // 6 (0b110)

// 按位取反
fmt.Println(^a)  // -6 (在二进制中取反)
```

### 移位运算

```go
// 左移
x := 1
fmt.Println(x << 3)  // 8 (1 * 2^3)

// 右移
y := 16
fmt.Println(y >> 2)  // 4 (16 / 2^2)

// 应用
// 快速计算 2 的幂
twoPow3 := 1 << 3  // 8

// 快速乘除
multiplied := 5 << 1  // 10 (5 * 2)
divided := 10 >> 1   // 5 (10 / 2)
```

## 赋值运算符

### 基本赋值

```go
// 简单赋值
var x int
x = 10

// 多变量赋值
a, b := 1, 2

// 交换值
a, b = b, a
```

### 复合赋值

```go
x := 10

// 加等
x += 5   // x = x + 5 = 15

// 减等
x -= 3   // x = x - 3 = 12

// 乘等
x *= 2   // x = x * 2 = 24

// 除等
x /= 4   // x = x / 4 = 6

// 取模等
x %= 4   // x = x % 4 = 2

// 位运算赋值
x &= 3   // x = x & 3
x |= 5   // x = x | 5
x ^= 2   // x = x ^ 2
x <<= 1  // x = x << 1
x >>= 1  // x = x >> 1
```

## 其他运算符

### 地址运算符

```go
// 取地址运算符 &
x := 10
p := &x  // p 是 *int 类型，指向 x

// 取值运算符 *
fmt.Println(*p)  // 10
```

### 通道运算符

```go
ch := make(chan int)

// 发送运算符 <-
ch <- 42  // 发送 42 到通道

// 接收运算符 <-
value := <-ch  // 从通道接收
```

## 运算符优先级

### 优先级表

```mermaid
graph TD
    A[运算符优先级<br>从高到低] --> B[1 后置 ++ --]
    A --> C[2 前置 ++ --]
    A --> D[3 一元 + - !]
    A --> E[4 * / % << >>]
    A --> F[5 + - ^]
    A --> G[6 == != < <= > >=]
    A --> H[7 &&]
    A --> I[8 ||]
    A --> J[9 赋值 = += 等]

    style A fill:#e3f2fd
    style B fill:#c8e6c9
    style E fill:#fff9c4
```

### 示例

```go
// 优先级示例
result := 2 + 3 * 4
fmt.Println(result)  // 14（先乘后加）

// 使用括号明确优先级
result = (2 + 3) * 4
fmt.Println(result)  // 20

// 复杂表达式
x := 10
y := 20
z := x > 5 && y < 30 || x == 0
fmt.Println(z)  // true（&& 优先于 ||）
```

## 类型兼容性

### 相同类型运算

```go
// ✅ 相同类型
a := 10
b := 20
sum := a + b  // 30

// ✅ 数值字面量自动适配
result := 10 + 20.5  // 30.5 (自动转为 float64)
```

### 不同类型运算

```go
// ❌ 需要显式转换
var a int = 10
var b float64 = 20.5
// sum := a + b  // 编译错误

// ✅ 类型转换
sum := float64(a) + b  // 30.5
```

## 运算符应用

### 位运算技巧

```go
// 判断奇偶
num := 5
isEven := (num & 1) == 0  // false

// 交换值（不使用临时变量）
a, b := 10, 20
a = a ^ b
b = a ^ b
a = a ^ b
// 现在 a=20, b=10

// 快速判断 2 的幂
n := 16
isPowerOfTwo := (n & (n - 1)) == 0  // true
```

### 条件技巧

```go
// 三元运算符的等价写法
age := 20
status := "成年"
if age < 18 {
    status = "未成年"
}

// 短路实现默认值
func getUserName(name string) string {
    return name || "Guest"
}
```

## 最佳实践

::: tip 使用建议

1. **优先使用括号** - 提高可读性，避免优先级问题
2. **注意类型** - 不同类型运算需要显式转换
3. **利用短路** - 提高效率，避免不必要计算
4. **位运算谨慎** - 注意符号性和溢出问题

:::

### 代码示例

```go
// 清晰的运算
result := (a + b) * (c - d)
isAdult := age >= 18 && hasPermission

// 避免复杂的嵌套
// ❌ 不推荐
if a > b {
    if c > d {
        if e > f {
            // 嵌套太深
        }
    }
}

// ✅ 推荐
if a > b && c > d && e > f {
    // 扁平化条件
}
```

## 总结

| 运算符类型 | 主要运算符 | 典型用途 |
|-----------|----------|----------|
| **算术** | `+ - * / %` | 数学计算 |
| **关系** | `== != < > <= >=` | 条件判断 |
| **逻辑** | `&& || !` | 组合条件 |
| **位运算** | `& \| ^ << >>` | 位操作 |
| **赋值** | `=` 及复合赋值 | 赋值操作 |

::: v-pre

[流程控制](./control-flow.md)

:::
