---
title: 反射
icon: ri:mirror-line
order: 2
---

# 反射

Go 的 `reflect` 包提供了运行时反射机制，允许程序检查变量的类型和值，并在运行时动态调用方法。

## 反射基础

### Type 和 Value

```go
import "reflect"

func reflectionBasics() {
    var x int = 42

    // TypeOf 获取类型
    t := reflect.TypeOf(x)
    fmt.Println("Type:", t)          // int
    fmt.Println("Name:", t.Name())    // int
    fmt.Println("Kind:", t.Kind())    // int

    // ValueOf 获取值
    v := reflect.ValueOf(x)
    fmt.Println("Value:", v)          // 42
    fmt.Println("Interface:", v.Interface()) // 42

    // Kind 枚举
    switch v.Kind() {
    case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
        fmt.Println("这是整数类型")
    case reflect.Struct:
        fmt.Println("这是结构体")
    }
}
```

### Kind 类型

```go
// reflect.Kind 枚举值
func examineKind(v interface{}) {
    rv := reflect.ValueOf(v)

    switch rv.Kind() {
    case reflect.Invalid:
        fmt.Println("无效值")
    case reflect.Bool:
        fmt.Println("布尔值:", rv.Bool())
    case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
        fmt.Println("整数:", rv.Int())
    case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
        fmt.Println("无符号整数:", rv.Uint())
    case reflect.Float32, reflect.Float64:
        fmt.Println("浮点数:", rv.Float())
    case reflect.String:
        fmt.Println("字符串:", rv.String())
    case reflect.Ptr:
        fmt.Println("指针，指向:", rv.Elem())
    case reflect.Struct:
        fmt.Println("结构体")
    case reflect.Slice:
        fmt.Println("切片，长度:", rv.Len())
    case reflect.Map:
        fmt.Println("映射")
    case reflect.Func:
        fmt.Println("函数")
    }
}
```

## Value 操作

### 获取和设置值

```go
// 可设置性
func setValue() {
    var x int = 42

    // 直接获取的值不可设置
    v := reflect.ValueOf(x)
    fmt.Println("CanSet:", v.CanSet())  // false

    // 通过指针获取可设置的值
    p := reflect.ValueOf(&x)
    v = p.Elem()
    fmt.Println("CanSet:", v.CanSet())  // true

    // 设置新值
    v.SetInt(100)
    fmt.Println("x =", x)  // x = 100
}
```

### 值的方法

```go
// reflect.Value 常用方法
func valueMethods() {
    var num float64 = 3.14
    v := reflect.ValueOf(num)

    // 类型相关
    fmt.Println("Type:", v.Type())
    fmt.Println("Kind:", v.Kind())

    // 获取值
    fmt.Println("Float:", v.Float())
    fmt.Println("Interface:", v.Interface())
    fmt.Println("String:", v.String())
    fmt.Println("Int:", int(v.Int()))

    // 零值
    zero := reflect.Zero(v.Type())
    fmt.Println("Zero:", zero)

    // 是否有效
    fmt.Println("IsValid:", v.IsValid())
}
```

## 结构体反射

### 遍历字段

```go
type Person struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
    Addr string `json:"addr,omitempty"`
}

func iterateStruct(obj interface{}) {
    v := reflect.ValueOf(obj)
    t := v.Type()

    // 遍历所有字段
    for i := 0; i < v.NumField(); i++ {
        field := t.Field(i)
        value := v.Field(i)

        fmt.Printf("字段名: %s\n", field.Name)
        fmt.Printf("类型: %s\n", field.Type)
        fmt.Printf("值: %v\n", value.Interface())

        // 获取标签
        jsonTag := field.Tag.Get("json")
        fmt.Printf("JSON tag: %s\n", jsonTag)
        fmt.Println("---")
    }
}

// 使用示例
p := Person{Name: "Alice", Age: 25}
iterateStruct(p)
```

### 获取字段

```go
// 通过名称获取字段
func getFieldByName(obj interface{}, fieldName string) interface{} {
    v := reflect.ValueOf(obj)

    // 处理指针
    if v.Kind() == reflect.Ptr {
        v = v.Elem()
    }

    if v.Kind() != reflect.Struct {
        return nil
    }

    field := v.FieldByName(fieldName)
    if !field.IsValid() {
        return nil
    }

    return field.Interface()
}

// 使用
value := getFieldByName(p, "Name")
fmt.Println("Name:", value)
```

### 设置字段值

```go
// 动态设置字段值
func setField(obj interface{}, fieldName string, newValue interface{}) error {
    v := reflect.ValueOf(obj)

    // 必须是可寻址的
    if !v.CanAddr() {
        return fmt.Errorf("对象不可寻址")
    }

    // 解引用指针
    if v.Kind() == reflect.Ptr {
        v = v.Elem()
    }

    if v.Kind() != reflect.Struct {
        return fmt.Errorf("不是结构体")
    }

    field := v.FieldByName(fieldName)
    if !field.IsValid() {
        return fmt.Errorf("字段不存在: %s", fieldName)
    }

    if !field.CanSet() {
        return fmt.Errorf("字段不可设置: %s", fieldName)
    }

    // 设置新值
    newVal := reflect.ValueOf(newValue)
    if newVal.Type().AssignableTo(field.Type()) {
        field.Set(newVal)
    } else {
        return fmt.Errorf("类型不匹配")
    }

    return nil
}

// 使用
p := Person{Name: "Alice", Age: 25}
err := setField(&p, "Name", "Bob")
if err != nil {
    log.Fatal(err)
}
fmt.Println(p)  // {Bob 25 }
```

## 切片和映射反射

### 切片操作

```go
func reflectSlice() {
    nums := []int{1, 2, 3, 4, 5}
    v := reflect.ValueOf(nums)

    // 长度和容量
    fmt.Println("Len:", v.Len())
    fmt.Println("Cap:", v.Cap())

    // 获取元素
    for i := 0; i < v.Len(); i++ {
        elem := v.Index(i)
        fmt.Printf("Index %d: %v\n", i, elem.Interface())
    }

    // 修改元素
    v.Index(0).SetInt(100)
    fmt.Println(nums)  // [100 2 3 4 5]

    // 追加元素
    v.SetLen(3)  // 截断
    fmt.Println(nums)  // [100 2 3]
}

// 创建新切片
func createSlice(elemType reflect.Type, len int) reflect.Value {
    return reflect.MakeSlice(reflect.SliceOf(elemType), len, len)
}

// 使用
v := createSlice(reflect.TypeOf(0), 5)
for i := 0; i < v.Len(); i++ {
    v.Index(i).SetInt(int64(i * 10))
}
fmt.Println(v.Interface())  // [0 10 20 30 40]
```

### 映射操作

```go
func reflectMap() {
    m := map[string]int{"a": 1, "b": 2}
    v := reflect.ValueOf(m)

    // 遍历
    iter := v.MapRange()
    for iter.Next() {
        key := iter.Key()
        value := iter.Value()
        fmt.Printf("%s = %v\n", key.String(), value.Interface())
    }

    // 获取值
    key := reflect.ValueOf("a")
    value := v.MapIndex(key)
    fmt.Println("a =", value.Int())

    // 设置值
    v.SetMapIndex(reflect.ValueOf("c"), reflect.ValueOf(3))
    fmt.Println(m)  // map[a:1 b:2 c:3]

    // 删除
    v.SetMapIndex(reflect.ValueOf("a"), reflect.Value{})
    fmt.Println(m)  // map[b:2 c:3]
}

// 创建新映射
func createMap(keyType, valueType reflect.Type) reflect.Value {
    return reflect.MakeMap(reflect.MapOf(keyType, valueType))
}

// 使用
m := createMap(reflect.TypeOf(""), reflect.TypeOf(0))
m.SetMapIndex(reflect.ValueOf("x"), reflect.ValueOf(10))
fmt.Println(m.Interface())  // map[x:10]
```

## 方法调用

### 调用方法

```go
type Calculator struct{}

func (c Calculator) Add(a, b int) int {
    return a + b
}

func (c Calculator) Multiply(a, b int) int {
    return a * b
}

func callMethod(obj interface{}, methodName string, args ...interface{}) ([]interface{}, error) {
    v := reflect.ValueOf(obj)

    // 获取方法
    method := v.MethodByName(methodName)
    if !method.IsValid() {
        return nil, fmt.Errorf("方法不存在: %s", methodName)
    }

    // 准备参数
    in := make([]reflect.Value, len(args))
    for i, arg := range args {
        in[i] = reflect.ValueOf(arg)
    }

    // 调用方法
    out := method.Call(in)

    // 转换返回值
    result := make([]interface{}, len(out))
    for i, v := range out {
        result[i] = v.Interface()
    }

    return result, nil
}

// 使用
calc := Calculator{}
result, err := callMethod(calc, "Add", 3, 5)
if err != nil {
    log.Fatal(err)
}
fmt.Println("结果:", result[0])  // 8
```

## 接口反射

### 检查接口实现

```go
type Writer interface {
    Write([]byte) (int, error)
}

type FileWriter struct {
    file *os.File
}

func (fw FileWriter) Write(data []byte) (int, error) {
    return fw.file.Write(data)
}

func checkImplementation(obj interface{}, iface interface{}) bool {
    objType := reflect.TypeOf(obj)
    ifaceType := reflect.TypeOf(iface).Elem()

    return objType.Implements(ifaceType)
}

// 使用
fw := FileWriter{}
var w Writer = fw

fmt.Println("FileWriter 实现 Writer:", checkImplementation(fw, (*Writer)(nil)))
```

### 接口值反射

```go
// 获取接口的动态类型和值
func inspectInterface(i interface{}) {
    v := reflect.ValueOf(i)

    // 是否为 nil 接口
    if !v.IsValid() {
        fmt.Println("nil 接口")
        return
    }

    // 动态类型
    fmt.Println("类型:", v.Type())
    // 动态值
    fmt.Println("值:", v.Interface())

    // 是否为 nil
    fmt.Println("IsNil:", v.IsNil())
}

// 使用
var w io.Writer
inspectInterface(w)  // nil 接口

w = os.Stdout
inspectInterface(w)  // *os.File 类型
```

## 反射性能

### 性能比较

```go
// 直接调用
func directCall(p Person) string {
    return p.Name
}

// 反射调用
func reflectionCall(p Person) string {
    v := reflect.ValueOf(p)
    field := v.FieldByName("Name")
    return field.String()
}

// 基准测试
func BenchmarkDirectCall(b *testing.B) {
    p := Person{Name: "Alice"}
    for i := 0; i < b.N; i++ {
        directCall(p)
    }
}

func BenchmarkReflectionCall(b *testing.B) {
    p := Person{Name: "Alice"}
    for i := 0; i < b.N; i++ {
        reflectionCall(p)
    }
}

// 结果：反射比直接调用慢约 100 倍
```

### 缓存反射信息

```go
// 缓存反射信息以提高性能
type fieldCache struct {
    fields map[reflect.Type][]reflect.StructField
    mu     sync.RWMutex
}

func (fc *fieldCache) GetFields(typ reflect.Type) []reflect.StructField {
    // 先读锁
    fc.mu.RLock()
    fields, ok := fc.fields[typ]
    fc.mu.RUnlock()

    if ok {
        return fields
    }

    // 写锁并计算
    fc.mu.Lock()
    defer fc.mu.Unlock()

    // 双重检查
    if fields, ok := fc.fields[typ]; ok {
        return fields
    }

    fields = cachedFields(typ)
    if fc.fields == nil {
        fc.fields = make(map[reflect.Type][]reflect.StructField)
    }
    fc.fields[typ] = fields

    return fields
}

func cachedFields(typ reflect.Type) []reflect.StructField {
    var fields []reflect.StructField
    for i := 0; i < typ.NumField(); i++ {
        fields = append(fields, typ.Field(i))
    }
    return fields
}
```

## 最佳实践

::: tip 使用建议

1. **避免过度使用** - 反射比直接代码慢
2. **缓存反射信息** - 减少重复计算
3. **优先用接口** - 类型安全且性能好
4. **错误处理** - 反射操作容易出错

:::

```go
// ✅ 好的模式：缓存反射信息
var cachedType = reflect.TypeOf(Person{})

func fastSetField(p *Person, name string, value interface{}) error {
    field, ok := cachedType.FieldByName(name)
    if !ok {
        return fmt.Errorf("字段不存在")
    }

    fv := reflect.ValueOf(p).Elem().FieldByName(name)
    fv.Set(reflect.ValueOf(value))
    return nil
}

// ❌ 不好的模式：每次都反射
func slowSetField(p *Person, name string, value interface{}) error {
    v := reflect.ValueOf(p).Elem()
    field := v.FieldByName(name)
    if !field.IsValid() {
        return fmt.Errorf("字段不存在")
    }
    field.Set(reflect.ValueOf(value))
    return nil
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **TypeOf** - 获取类型信息 |
| **ValueOf** - 获取值信息 |
| **Kind** - 类型的底层类别 |
| **CanSet** - 值是否可设置 |
| **反射性能** - 比直接调用慢 |

::: v-pre

[概述](./README.md) → [泛型](./generics.md)

:::
