---
title: 最佳实践
icon: ri:star-line
order: 5
---

# 反射与泛型最佳实践

遵循这些最佳实践可以让你的代码更安全、更高效、更易维护。

## 泛型 vs 反射

### 选择原则

```go
// ✅ 优先使用泛型：类型安全且性能好
func Sum[T constraints.Integer](numbers []T) T {
    var sum T
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// ❌ 避免使用反射：除非确实需要运行时类型检查
func SumReflect(values interface{}) interface{} {
    v := reflect.ValueOf(values)
    var result float64
    for i := 0; i < v.Len(); i++ {
        result += v.Index(i).Float()
    }
    return result
}
```

### 性能对比

```go
// 直接调用：基准
func DirectSum(numbers []int) int {
    sum := 0
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// 泛型：与直接调用性能相同
func GenericSum[T constraints.Integer](numbers []T) T {
    var sum T
    for _, n := range numbers {
        sum += n
    }
    return sum
}

// 反射：比直接调用慢约 100 倍
func ReflectSum(numbers interface{}) int {
    v := reflect.ValueOf(numbers)
    sum := 0
    for i := 0; i < v.Len(); i++ {
        sum += int(v.Index(i).Int())
    }
    return sum
}
```

## 泛型最佳实践

### 约束设计

```go
// ✅ 好的模式：精确的约束
type Number interface {
    int | int64 | float64
}

func Add[T Number](a, b T) T {
    return a + b
}

// ✅ 使用 ~ 包含自定义类型
type IntLike interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64
}

type MyInt int
func Double[T IntLike](n T) T { return n * 2 }

// ❌ 不好的模式：过度宽泛
func Anything[T any](value T) T { return value }
```

### 类型参数命名

```go
// ✅ 好的模式：简洁明了的类型参数名
func Map[T, U any](slice []T, fn func(T) U) []U

type Map[K comparable, V any] struct {
    data map[K]V
}

// ❌ 不好的模式：无意义的类型参数名
func Map[T1, T2 any](slice []T1, fn func(T1) T2) []T2

type Container[A, B, C any] struct {
    first A
    second B
    third C
}
```

### 文档完善

```go
// Min 返回两个值中的较小值
//
// 类型参数 T 必须实现 constraints.Ordered 约束
// 即支持 < 和 > 操作符的类型
//
// 示例：
//   Min(1, 2)    // 返回 1
//   Min("a", "b") // 返回 "a"
func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

// Pair 结构体存储一对可能不同类型的值
//
// 类型参数：
//   T - 第一个值的类型
//   U - 第二个值的类型
//
// 示例：
//   p := Pair(1, "hello")
type Pair[T, U any] struct {
    First  T
    Second U
}
```

### 避免过度泛型

```go
// ✅ 好的模式：特定类型有特定实现
func IntMax(a, b int) int {
    if a > b {
        return a
    }
    return b
}

func FloatMax(a, b float64) float64 {
    if a > b {
        return a
    }
    return b
}

// ❌ 不好的模式：简单场景不需要泛型
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}
```

## 反射最佳实践

### 缓存反射信息

```go
// ✅ 好的模式：缓存反射信息
type fieldCache struct {
    fields map[reflect.Type][]reflect.StructField
    mu     sync.RWMutex
}

var globalFieldCache = &fieldCache{
    fields: make(map[reflect.Type][]reflect.StructField),
}

func GetFields(typ reflect.Type) []reflect.StructField {
    globalFieldCache.mu.RLock()
    fields, ok := globalFieldCache.fields[typ]
    globalFieldCache.mu.RUnlock()

    if ok {
        return fields
    }

    globalFieldCache.mu.Lock()
    defer globalFieldCache.mu.Unlock()

    if fields, ok := globalFieldCache.fields[typ]; ok {
        return fields
    }

    fields = make([]reflect.StructField, typ.NumField())
    for i := 0; i < typ.NumField(); i++ {
        fields[i] = typ.Field(i)
    }

    globalFieldCache.fields[typ] = fields
    return fields
}

// ❌ 不好的模式：每次都反射
func GetFieldsSlow(typ reflect.Type) []reflect.StructField {
    fields := make([]reflect.StructField, typ.NumField())
    for i := 0; i < typ.NumField(); i++ {
        fields[i] = typ.Field(i)
    }
    return fields
}
```

### 错误处理

```go
// ✅ 好的模式：完善的错误处理
func SetField(obj interface{}, fieldName string, value interface{}) error {
    v := reflect.ValueOf(obj)

    if v.Kind() != reflect.Ptr || v.Elem().Kind() != reflect.Struct {
        return fmt.Errorf("obj 必须是指向结构体的指针")
    }

    v = v.Elem()
    field := v.FieldByName(fieldName)

    if !field.IsValid() {
        return fmt.Errorf("字段不存在: %s", fieldName)
    }

    if !field.CanSet() {
        return fmt.Errorf("字段不可设置: %s", fieldName)
    }

    val := reflect.ValueOf(value)
    if val.Type().AssignableTo(field.Type()) {
        field.Set(val)
        return nil
    }

    return fmt.Errorf("类型不匹配: 期望 %v, 实际 %v",
        field.Type(), val.Type())
}

// ❌ 不好的模式：忽略错误
func SetFieldUnsafe(obj interface{}, fieldName string, value interface{}) {
    v := reflect.ValueOf(obj).Elem()
    v.FieldByName(fieldName).Set(reflect.ValueOf(value))
}
```

### 可选方案优先

```go
// ✅ 好的模式：优先使用接口
type Stringer interface {
    String() string
}

func PrintString(s Stringer) {
    fmt.Println(s.String())
}

// ❌ 不好的模式：用反射实现相同功能
func PrintStringReflect(v interface{}) {
    rv := reflect.ValueOf(v)
    method := rv.MethodByName("String")
    if method.IsValid() {
        results := method.Call(nil)
        fmt.Println(results[0])
    }
}
```

## 组合使用

### 泛型 + 反射

```go
// 泛型提供类型安全，反射处理特定逻辑
func Marshal[T any](v T) ([]byte, error) {
    // 泛型确保 T 在编译时确定
    val := reflect.ValueOf(v)

    // 反射处理序列化
    switch val.Kind() {
    case reflect.Struct:
        return marshalStruct(val)
    case reflect.Map:
        return marshalMap(val)
    default:
        return marshalPrimitive(val)
    }
}

func marshalStruct(v reflect.Value) ([]byte, error) {
    // 结构体序列化逻辑
    return nil, nil
}

func marshalMap(v reflect.Value) ([]byte, error) {
    // 映射序列化逻辑
    return nil, nil
}

func marshalPrimitive(v reflect.Value) ([]byte, error) {
    // 基本类型序列化逻辑
    return nil, nil
}
```

### 约束反射

```go
// 使用约束限制反射的使用
type Struct interface {
    any // 任意类型，但实际使用时建议限制
}

func CopyFields[T Struct](dst, src *T) error {
    dstVal := reflect.ValueOf(dst).Elem()
    srcVal := reflect.ValueOf(src).Elem()

    dstType := dstVal.Type()
    if srcVal.Type() != dstType {
        return fmt.Errorf("类型不匹配")
    }

    for i := 0; i < dstVal.NumField(); i++ {
        field := dstVal.Field(i)
        if field.CanSet() {
            field.Set(srcVal.Field(i))
        }
    }

    return nil
}
```

## 实用模式

### 类型转换辅助

```go
// 泛型类型转换
func Convert[T, U any](value T, converter func(T) U) U {
    return converter(value)
}

// 使用示例
num := 42
str := Convert(num, strconv.Itoa)
fmt.Println(str)  // "42"

f := Convert(str, func(s string) float64 {
    result, _ := strconv.ParseFloat(s, 64)
    return result
})
fmt.Println(f)  // 42.0
```

### 通用验证器

```go
type Validator[T any] interface {
    Validate(T) error
}

func ValidateAll[T any](items []T, validators ...Validator[T]) error {
    for _, item := range items {
        for _, v := range validators {
            if err := v.Validate(item); err != nil {
                return err
            }
        }
    }
    return nil
}

// 使用
type Person struct {
    Name string
    Age  int
}

type NameValidator struct{}

func (nv NameValidator) Validate(p Person) error {
    if p.Name == "" {
        return fmt.Errorf("name 不能为空")
    }
    return nil
}

type AgeValidator struct{}

func (av AgeValidator) Validate(p Person) error {
    if p.Age < 0 || p.Age > 150 {
        return fmt.Errorf("age 无效")
    }
    return nil
}

people := []Person{{Name: "Alice", Age: 25}}
err := ValidateAll(people, NameValidator{}, AgeValidator{})
```

### 构建器模式

```go
type Builder[T any] struct {
    value T
}

func NewBuilder[T any](init T) *Builder[T] {
    return &Builder[T]{value: init}
}

func (b *Builder[T]) With(fn func(*T)) *Builder[T] {
    fn(&b.value)
    return b
}

func (b *Builder[T]) Build() T {
    return b.value
}

// 使用
type Config struct {
    Host     string
    Port     int
    Timeout  time.Duration
}

config := NewBuilder(Config{}).
    With(func(c *Config) { c.Host = "localhost" }).
    With(func(c *Config) { c.Port = 8080 }).
    With(func(c *Config) { c.Timeout = 30 * time.Second }).
    Build()

fmt.Printf("%+v\n", config)
```

## 性能优化

### 避免不必要的反射

```go
// ✅ 使用代码生成或泛型避免反射
// 代码生成工具：go generate
// 泛型：Go 1.18+

// ❌ 避免在热路径中使用反射
func HotPath(data interface{}) {
    v := reflect.ValueOf(data)
    // 反射操作很慢
}
```

### 使用 sync.Pool

```go
// 反射对象池
var valuePool = sync.Pool{
    New: func() interface{} {
        return reflect.New(reflect.TypeOf(struct{}{})).Elem()
    },
}

func ProcessWithPool(data interface{}) {
    v := valuePool.Get().(reflect.Value)
    defer valuePool.Put(v)

    // 使用反射值
    v.Set(reflect.ValueOf(data))
}
```

## 调试技巧

### 类型信息输出

```go
func DebugType[T any](value T) {
    fmt.Printf("Type: %T\n", value)
    fmt.Printf("Size: %d\n", unsafe.Sizeof(value))

    t := reflect.TypeOf(value)
    fmt.Printf("Kind: %v\n", t.Kind())
    fmt.Printf("Name: %s\n", t.Name())
    fmt.Printf("PkgPath: %s\n", t.PkgPath())
}
```

### 泛型实例化跟踪

```go
func TrackInstantiation[T any](value T) {
    fmt.Printf("Instantiated with type: %T\n", value)

    // 可以用于调试泛型函数被哪些类型调用
    log.Printf("Generic function called with type: %T", value)
}
```

## 常见陷阱

### 反射陷阱

```go
// ❌ 陷阱 1：未解引用指针
func getField(ptr interface{}, fieldName string) interface{} {
    v := reflect.ValueOf(ptr)
    field := v.FieldByName(fieldName)  // 错误：需要 Elem()
    return field.Interface()
}

// ✅ 正确处理指针
func getFieldCorrect(ptr interface{}, fieldName string) interface{} {
    v := reflect.ValueOf(ptr)
    if v.Kind() == reflect.Ptr {
        v = v.Elem()
    }
    field := v.FieldByName(fieldName)
    return field.Interface()
}

// ❌ 陷阱 2：未检查 CanSet
func setField(ptr interface{}, fieldName string, value interface{}) {
    v := reflect.ValueOf(ptr).Elem()
    field := v.FieldByName(fieldName)
    field.Set(reflect.ValueOf(value))  // 可能 panic
}

// ✅ 检查可设置性
func setFieldCorrect(ptr interface{}, fieldName string, value interface{}) error {
    v := reflect.ValueOf(ptr)
    if v.Kind() != reflect.Ptr {
        return fmt.Errorf("需要指针")
    }
    v = v.Elem()
    field := v.FieldByName(fieldName)
    if !field.CanSet() {
        return fmt.Errorf("字段不可设置")
    }
    field.Set(reflect.ValueOf(value))
    return nil
}
```

### 泛型陷阱

```go
// ❌ 陷阱 1：混淆 ~ 和确切类型
type MyInt int

type ExactInt interface {
    int  // 只包含 int，不包含 MyInt
}

type UnderlyingInt interface {
    ~int  // 包含 int 和所有底层为 int 的类型
}

func UseExact[T ExactInt](v T) {}
func UseUnderlying[T UnderlyingInt](v T) {}

var mi MyInt = 42
// UseExact(mi)    // 编译错误：MyInt 不在 ExactInt 中
UseUnderlying(mi)  // 成功：MyInt 底层是 int

// ❌ 陷阱 2：nil 无法推断类型
func ReturnNil[T any]() T {
    var zero T
    return zero  // 返回零值，不是 nil
}

// 需要显式指定或使用指针
func ReturnNilPointer[T any]() *T {
    return nil
}

result := ReturnNilPointer[int]()  // 返回 nil *int
```

## 总结

| 实践 | 关键点 |
|------|--------|
| **优先泛型** - 类型安全且高性能 |
| **谨慎反射** - 缓存反射信息 |
| **精确约束** - 避免过度宽泛 |
| **完善文档** - 泛型代码需要更多文档 |
| **组合使用** - 泛型提供框架，反射处理细节 |

::: v-pre

[类型推断](./type-inference.md) → [性能优化](/langs/go/10-performance/)

:::
