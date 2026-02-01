---
title: JSON处理
icon: ri:braces-line
order: 6
---

# JSON处理

encoding/json 包提供了 JSON 的编解码功能，是 Go 中处理 JSON 的标准方式。

## 基本编解码

### Marshal 编码

```go
import "encoding/json"

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// 编码为 JSON
user := User{ID: 1, Name: "Alice", Email: "alice@example.com"}
data, err := json.Marshal(user)
if err != nil {
    log.Fatal(err)
}

fmt.Println(string(data))
// {"id":1,"name":"Alice","email":"alice@example.com"}
```

### Unmarshal 解码

```go
// JSON 数据
jsonStr := `{"id":1,"name":"Alice","email":"alice@example.com"}`

// 解码
var user User
err := json.Unmarshal([]byte(jsonStr), &user)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("ID: %d, Name: %s, Email: %s\n", user.ID, user.Name, user.Email)
```

## 结构体标签

### json 标签

```go
type User struct {
    // 基本标签
    ID   int    `json:"id"`        // 指定 JSON 字段名
    Name string `json:"name"`      // 导出字段

    // 高级选项
    Age      int       `json:"age,omitempty"`      // 零值省略
    Password string    `json:"-"`                   // 忽略字段
    Internal string    `json:"internal,noexport"`  // 自定义选项
    Created time.Time `json:"created_at"`         // 重命名

    // 嵌套结构
    Address  Address   `json:"address"`
    Settings Settings  `json:"settings"`
}

type Address struct {
    City    string `json:"city"`
    Country string `json:"country"`
}

type Settings struct {
    Theme string `json:"theme"`
}
```

### 标签选项

```go
type Product struct {
    // omitempty - 零值省略
    Name  string  `json:"name,omitempty"`
    Price float64 `json:"price,omitempty"`

    // - 忽略字段
    InternalCode string `json:"-"`

    // 自定义字段名
    ProductID int `json:"product_id"`

    // 嵌套
    Spec ProductSpec `json:"spec"`
}

type ProductSpec struct {
    Dimensions string `json:"dimensions"`
    Weight     string `json:"weight"`
}
```

## 高级编解码

### Encoder

```go
// 流式编码
func encodeJSON(w io.Writer, data interface{}) error {
    encoder := json.NewEncoder(w)
    return encoder.Encode(data)
}

// 使用示例
file, err := os.Create("output.json")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

user := User{ID: 1, Name: "Alice"}
err = json.NewEncoder(file).Encode(user)
```

### Decoder

```go
// 流式解码
func decodeJSON(r io.Reader) ([]User, error) {
    var users []User
    decoder := json.NewDecoder(r)

    for {
        var user User
        if err := decoder.Decode(&user); err != nil {
            if err == io.EOF {
                break
            }
            return nil, err
        }
        users = append(users, user)
    }

    return users, nil
}

// 使用示例
file, _ := os.Open("users.json")
defer file.Close()

var users []User
err := json.NewDecoder(file).Decode(&users)
```

### Indent 美化

```go
// 美化 JSON 输出
data, _ := json.Marshal(user)

// 美化输出，带前缀和缩进
pretty, err := json.MarshalIndent(user, "", "  ")
if err != nil {
    log.Fatal(err)
}

fmt.Println(string(pretty))
// {
//   "id": 1,
//   "name": "Alice",
//   "email": "alice@example.com"
// }
```

## 处理动态JSON

### RawMessage

```go
// RawMessage 保留原始 JSON
type Message struct {
    ID      int             `json:"id"`
    Type    string          `json:"type"`
    Payload json.RawMessage `json:"payload"`
}

// 解码
msg := Message{ID: 1, Type: "user"}
json.Unmarshal([]byte(`{"payload":{"name":"Alice"}}`), &msg)

// 后续处理
var payload map[string]interface{}
json.Unmarshal(msg.Payload, &payload)
fmt.Println(payload["name"])
```

### map[string]interface{}

```go
// 解码到 map
var data map[string]interface{}
json.Unmarshal([]byte(`{"name":"Alice","age":30}`), &data)

// 访问数据
name := data["name"].(string)
age := data["age"].(float64)

// 注意：数字被解析为 float64
fmt.Printf("Name: %s, Age: %.0f\n", name, age)
```

### interface{}

```go
// 解码到 interface{}
var data interface{}
json.Unmarshal([]byte(`{"name":"Alice","age":30,"tags":["golang","json"]}`), &data)

// 类型断言
m := data.(map[string]interface{})
name := m["name"].(string)
age := int(m["age"].(float64))
tags := m["tags"].([]interface{})

fmt.Println(name, age, tags)
```

## 错误处理

### SyntaxError

```go
// 处理语法错误
var user User
err := json.Unmarshal([]byte(`{invalid json}`), &user)
if err != nil {
    if syntaxErr, ok := err.(*json.SyntaxError); ok {
        fmt.Printf("Syntax error at offset %d\n", syntaxErr.Offset)
    }
    log.Fatal(err)
}
```

### UnmarshalTypeError

```go
// 处理类型错误
var user User
err := json.Unmarshal([]byte(`{"id":"not a number"}`), &user)
if err != nil {
    if typeErr, ok := err.(*json.UnmarshalTypeError); ok {
        fmt.Printf("Type error for field %s: %v\n", typeErr.Field, typeErr.Value)
    }
}
```

### UnmarshalFieldError

```go
// 处理未知字段
type User struct {
    Name string `json:"name"`
}

// 启用 DisallowUnknownFields
decoder := json.NewDecoder(strings.NewReader(`{"name":"Alice","unknown":"value"}`))
decoder.DisallowUnknownFields(true)

var user User
err := decoder.Decode(&user)
if err != nil {
    fmt.Printf("Unknown field error: %v\n", err)
}
```

## 自定义编解码

### MarshalJSON

```go
// 自定义编码
type DateTime struct {
    time.Time
}

func (dt DateTime) MarshalJSON() ([]byte, error) {
    return json.Marshal(dt.Time.Format(time.RFC3339))
}

func (dt *DateTime) UnmarshalJSON(data []byte) error {
    var s string
    if err := json.Unmarshal(data, &s); err != nil {
        return err
    }
    t, err := time.Parse(time.RFC3339, s)
    if err != nil {
        return err
    }
    dt.Time = t
    return nil
}
```

### encoding.TextMarshaler

```go
// 实现 TextMarshaler 和 TextUnmarshaler
type Color struct {
    R, G, B uint8
}

func (c Color) MarshalText() ([]byte, error) {
    return []byte(fmt.Sprintf("#%02x%02x%02x", c.R, c.G, c.B)), nil
}

func (c *Color) UnmarshalText(data []byte) error {
    _, err := fmt.Sscanf(string(data), "#%02x%02x%02x", &c.R, &c.G, &c.B)
    return err
}
```

## HTTP JSON

### JSON API

```go
func getUserHandler(w http.ResponseWriter, r *http.Request) {
    // 设置响应头
    w.Header().Set("Content-Type", "application/json")

    // 获取用户
    user := getUserByID(1)

    // 编码 JSON
    encoder := json.NewEncoder(w)
    if err := encoder.Encode(user); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
    // 解码请求
    var user User
    decoder := json.NewDecoder(r.Body)
    if err := decoder.Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // 创建用户
    if err := createUser(&user); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // 返回响应
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}
```

## 最佳实践

::: tip 使用建议

1. **使用标签** - 为结构体字段添加 json 标签
2. **错误检查** - 始终检查编解码错误
3. **流式处理** - 大文件使用 Encoder/Decoder
4. **零值省略** - 使用 omitempty 选项
5. **类型安全** - 优先使用结构体而非 interface{}

:::

```go
// ✅ 好的 JSON 处理
func handleJSON(w http.ResponseWriter, r *http.Request) {
    var req Request
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    resp := processRequest(&req)

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(resp)
}

// ❌ 不好的 JSON 处理
func handleJSONBad(w http.ResponseWriter, r *http.Request) {
    // 没有检查错误
    body, _ := io.ReadAll(r.Body)

    // 没有设置响应头
    fmt.Fprintf(w, "%s", body)
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **Marshal** - 编码为 JSON |
| **Unmarshal** - 解码 JSON |
| **Encoder** - 流式编码 |
| **Decoder** - 流式解码 |
| **RawMessage** - 延迟解码 |
| **标签** - 控制字段映射 |

::: v-pre

[IO接口](./io-interfaces.md) → [HTTP处理](./http.md)

:::
