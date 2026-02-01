---
title: 格式化 IO
icon: ri:text
order: 5
---

# 格式化 IO

`fmt` 包提供了格式化 I/O 操作，类似于 C 的 printf 和 scanf。

## 打印输出

### Print 函数

```go
// Print 打印到标准输出
func basicPrint() {
    fmt.Print("Hello")        // Hello（无换行）
    fmt.Println("World")     // World（带换行）

    name := "Alice"
    fmt.Printf("Hello, %s\n", name)  // Hello, Alice
}
```

### 多参数打印

```go
// Println 打印多个参数，用空格分隔
func printMultiple() {
    name := "Alice"
    age := 25

    fmt.Println("Name:", name, "Age:", age)
    // 输出: Name: Alice Age: 25
}
```

### Fprint

```go
// Fprint 打印到指定 Writer
func writeToWriter(w io.Writer) {
    fmt.Fprint(w, "Hello, Writer!\n")

    // 使用示例
    var buf bytes.Buffer
    fmt.Fprint(&buf, "Buffered content")
    fmt.Println(buf.String())
}
```

## 格式化动词

### 通用动词

```go
// %v - 默认格式
func formatValue() {
    user := struct{ Name string; Age int }{"Alice", 25}

    fmt.Printf("%v\n", user)  // {Alice 25}
    fmt.Printf("%+v\n", user) // {Name:Alice Age:25}
    fmt.Printf("%#v\n", user) // struct{Name string; Age int}{Name:Alice, Age:25}
}
```

### 类型动词

```go
// 各种类型动词
func formatTypes() {
    // 布尔值
    fmt.Printf("%t\n", true)    // true
    fmt.Printf("%t\n", false)   // false

    // 整数
    fmt.Printf("%d\n", 42)      // 42（十进制）
    fmt.Printf("%b\n", 42)      // 101010（二进制）
    fmt.Printf("%o\n", 42)      // 52（八进制）
    fmt.Printf("%x\n", 42)      // 2a（十六进制小写）
    fmt.Printf("%X\n", 42)      // 2A（十六进制大写）
    fmt.Printf("%U\n", 42)      // U+002A（Unicode）

    // 浮点数
    fmt.Printf("%f\n", 3.14)    // 3.140000
    fmt.Printf("%.2f\n", 3.14) // 3.14（2 位小数）
    fmt.Printf("%e\n", 3.14)   // 3.140000e+00（科学计数法）
    fmt.Printf("%g\n", 3.14)   // 3.14（紧凑格式）

    // 字符串
    fmt.Printf("%s\n", "Hello") // Hello
    fmt.Printf("%q\n", "Hello") // "Hello"（带引号）

    // 指针
    x := 42
    fmt.Printf("%p\n", &x)     // 0xc0000140a0（指针地址）
}
```

### 宽度和精度

```go
// 宽度和精度控制
func formatWidth() {
    // 宽度
    fmt.Printf("|%10s|\n", "Hello")  // |     Hello|
    fmt.Printf("|%-10s|\n", "Hello") // |Hello     |

    // 精度
    fmt.Printf("%.2f\n", 3.14159)  // 3.14
    fmt.Printf("%6.2f\n", 3.14159) //   3.14

    // 字符串截断
    fmt.Printf("%.3s\n", "Hello")  // Hel
    fmt.Printf("%5.3s\n", "Hello") //   Hel
}
```

## Sprint

### 字符串格式化

```go
// Sprintf 返回格式化字符串
func formatString() string {
    name := "Alice"
    age := 25

    return fmt.Sprintf("Name: %s, Age: %d", name, age)
}

// 使用示例
func useFormattedString() {
    msg := formatString()
    fmt.Println(msg)  // Name: Alice, Age: 25
}
```

### Errorf

```go
// Errorf 创建格式化错误
func formatError() error {
    return fmt.Errorf("code %d: %s", 404, "not found")
}

// 使用示例
func handleError() error {
    return fmt.Errorf("operation failed: %w",
        fmt.Errorf("database error: %w", sql.ErrConnDone))
}
```

## 扫描输入

### Scan

```go
// fmt.Scan 从标准输入扫描
func scanInput() {
    var name string
    var age int

    fmt.Print("Enter name: ")
    fmt.Scan(&name)

    fmt.Print("Enter age: ")
    fmt.Scan(&age)

    fmt.Printf("Name: %s, Age: %d\n", name, age)
}
```

### Scanln

```go
// fmt.Scanln 扫描直到换行
func scanLine() {
    var name string
    var age int

    fmt.Println("Enter name and age:")
    fmt.Scanln(&name, &age)

    fmt.Printf("Name: %s, Age: %d\n", name, age)
}
```

### Fscan

```go
// fmt.Fscan 从 Reader 扫描
func scanFromReader(r io.Reader) error {
    var name string
    var age int

    _, err := fmt.Fscan(r, &name, &age)
    if err != nil {
        return err
    }

    fmt.Printf("Name: %s, Age: %d\n", name, age)
    return nil
}
```

### Sscanf

```go
// fmt.Sscanf 从字符串扫描
func scanFromString() {
    data := "Alice 25"

    var name string
    var age int

    n, err := fmt.Sscanf(data, "%s %d", &name, &age)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Scanned %d values: %s, %d\n", n, name, age)
}
```

## 自定义格式

### Stringer 接口

```go
// fmt.Stringer 自定义字符串表示
type Person struct {
    Name string
    Age  int
}

func (p Person) String() string {
    return fmt.Sprintf("%s (age %d)", p.Name, p.Age)
}

func useStringer() {
    p := Person{Name: "Alice", Age: 25}
    fmt.Println(p)  // Alice (age 25)
}
```

### Formatter 接口

```go
// fmt.Formatter 自定义格式化
type Money struct {
    Amount int64
    Currency string
}

func (m Money) Format(f fmt.State, verb rune) {
    switch verb {
    case 'v', 's':
        fmt.Fprintf(f, "%s%d", m.Currency, m.Amount)
    case 'd':
        fmt.Fprintf(f, "%d", m.Amount)
    case 'f':
        dollars := float64(m.Amount) / 100
        fmt.Fprintf(f, "%.2f", dollars)
    default:
        fmt.Fprintf(f, "!VERB(%c)", verb)
    }
}

func useFormatter() {
    m := Money{Amount: 12345, Currency: "$"}

    fmt.Printf("%v\n", m)    // $12345
    fmt.Printf("%d\n", m)    // 12345
    fmt.Printf("%f\n", m)    // 123.45
}
```

## 格式化标志

### 标志

```go
// 格式化标志
func formatFlags() {
    // + - 总是打印符号
    fmt.Printf("%+d\n", 42)   // +42
    fmt.Printf("%+d\n", -42)  // -42

    // - - 左对齐
    fmt.Printf("|%-10s|\n", "Hello")  // |Hello     |

    // # - 备用格式（%#o, %#x）
    fmt.Printf("%#o\n", 42)    // 052
    fmt.Printf("%#x\n", 42)    // 0x2a

    // ' ' - 空格（正数留空格）
    fmt.Printf("|% d|% d|\n", 42, -42)  // | 42|-42|

    // 0 - 用零填充
    fmt.Printf("%05d\n", 42)  // 00042
}
```

## 自定义输出

### 自定义 Writer

```go
// 自定义 Writer
type Logger struct {
    prefix string
    writer io.Writer
}

func (l *Logger) Write(p []byte) (n int, err error) {
    // 添加前缀
    prefix := []byte(fmt.Sprintf("[%s] ", l.prefix))
    _, err = l.writer.Write(prefix)
    if err != nil {
        return 0, err
    }

    // 写入内容
    return l.writer.Write(p)
}

func useCustomWriter() {
    logger := &Logger{
        prefix: "INFO",
        writer: os.Stdout,
    }

    fmt.Fprintln(logger, "Application started")
}
```

## 最佳实践

::: tip 使用建议

1. **Errorf** - 使用 Errorf 创建错误
2. **Stringer** - 实现 Stringer 接口
3. **类型安全** - 优先使用类型安全的格式化
4. **缓冲输出** - 频繁输出使用缓冲
5. **错误检查** - 检查 Scan 的错误

:::

```go
// ✅ 好的模式
func goodFormat() error {
    // 使用 Errorf 创建错误
    return fmt.Errorf("failed to process item %d: %w",
        42, ErrNotFound)
}

// ❌ 不好的模式
func badFormat() string {
    // 忽略错误
    var s string
    fmt.Scan(&s)
    return s
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Print** - 标准输出 |
| **Printf** - 格式化输出 |
| **Sprintf** - 返回格式化字符串 |
| **Errorf** - 返回格式化错误 |
| **Scan** - 扫描输入 |
| **Stringer** - 自定义字符串表示 |

::: v-pre

[bufio](./bufio.md) → [文件系统](./filesystem.md)

:::
