---
title: Table 驱动测试
icon: ri:table-line
order: 6
---

# Table 驱动测试

Table 驱动测试是 Go 中推荐的测试模式，通过表格定义多组测试用例。

## 基本模式

### 简单 Table 测试

```go
func TestAdd(t *testing.T) {
    // 定义测试用例表
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -2, -3, -5},
        {"mixed numbers", -2, 3, 1},
        {"zeros", 0, 0, 0},
        {"large numbers", 1000000, 2000000, 3000000},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}
```

### 匿名结构

```go
func TestDivide(t *testing.T) {
    tests := []struct {
        name     string
        a, b     float64
        expected float64
    }{
        // 正常情况
        {name: "basic division", a: 10, b: 2, expected: 5},
        {name: "decimal result", a: 5, b: 2, expected: 2.5},

        // 边界情况
        {name: "divide by one", a: 10, b: 1, expected: 10},
        {name: "divide zero", a: 0, b: 5, expected: 0},

        // 负数
        {name: "negative numbers", a: -10, b: 2, expected: -5},
        {name: "negative denominator", a: 10, b: -2, expected: -5},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Divide(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Divide(%f, %f) = %f; want %f",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}
```

## 错误测试

### 错误用例

```go
func TestDivideErrors(t *testing.T) {
    tests := []struct {
        name        string
        a, b        float64
        expected    float64
        expectError bool
    }{
        {"normal division", 10, 2, 5, false},
        {"divide by zero", 10, 0, 0, true},
        {"negative division", -10, 2, -5, false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := Divide(tt.a, tt.b)

            if tt.expectError {
                if err == nil {
                    t.Error("expected error, got nil")
                }
                return
            }

            if err != nil {
                t.Errorf("unexpected error: %v", err)
                return
            }

            if result != tt.expected {
                t.Errorf("expected %f, got %f", tt.expected, result)
            }
        })
    }
}
```

### 错误类型测试

```go
func TestValidate(t *testing.T) {
    tests := []struct {
        name        string
        input       string
        expectedErr error
    }{
        {
            name:        "valid input",
            input:       "valid@email.com",
            expectedErr: nil,
        },
        {
            name:        "empty input",
            input:       "",
            expectedErr: &ValidationError{Field: "email"},
        },
        {
            name:        "invalid format",
            input:       "invalid",
            expectedErr: &ValidationError{Field: "email"},
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := Validate(tt.input)

            if tt.expectedErr == nil {
                if err != nil {
                    t.Errorf("expected no error, got %v", err)
                }
                return
            }

            if err == nil {
                t.Error("expected error, got nil")
                return
            }

            // 检查错误类型
            var validationErr *ValidationError
            if !errors.As(err, &validationErr) {
                t.Errorf("expected ValidationError, got %T", err)
            }
        })
    }
}
```

## Setup 和 Teardown

### 每个用例的 Setup

```go
func TestWithSetup(t *testing.T) {
    tests := []struct {
        name     string
        setup    func(*Database)
        input    string
        expected string
    }{
        {
            name: "with existing data",
            setup: func(db *Database) {
                db.Exec("INSERT INTO users (name) VALUES ('Alice')")
            },
            input:    "SELECT name FROM users",
            expected: "Alice",
        },
        {
            name:  "with empty database",
            setup: func(db *Database) {},
            input: "SELECT name FROM users",
            expected: "",
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // 每个子测试独立的 setup
            db := setupTestDB(t)
            defer cleanupTestDB(t, db)

            // 执行用例特定的 setup
            tt.setup(db)

            // 执行测试
            result := db.Query(tt.input)
            if result != tt.expected {
                t.Errorf("expected %s, got %s", tt.expected, result)
            }
        })
    }
}
```

## 并行 Table 测试

### 并行执行

```go
func TestParallelTable(t *testing.T) {
    tests := []struct {
        name  string
        input int
    }{
        {"test1", 1},
        {"test2", 2},
        {"test3", 3},
        {"test4", 4},
    }

    for _, tt := range tests {
        tt := tt  // 捕获循环变量

        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()  // 标记为并行测试

            // 每个并行测试需要独立的资源
            result := process(tt.input)
            if result != tt.input*2 {
                t.Errorf("expected %d, got %d", tt.input*2, result)
            }
        })
    }
}
```

### 并行测试注意事项

```go
func TestParallelWithResources(t *testing.T) {
    tests := []struct {
        name string
        id   int
    }{
        {"user1", 1},
        {"user2", 2},
        {"user3", 3},
    }

    for _, tt := range tests {
        tt := tt

        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()

            // 并行测试需要独立资源
            db := createTestDBForUser(t, tt.id)
            defer db.Close()

            user := db.GetUser(tt.id)
            if user == nil {
                t.Error("user not found")
            }
        })
    }
}
```

## 测试数据

### 从文件加载

```go
func TestFromFile(t *testing.T) {
    // 读取测试数据文件
    data, err := os.ReadFile("testdata/cases.json")
    if err != nil {
        t.Fatalf("failed to read test data: %v", err)
    }

    // 解析测试用例
    var tests []struct {
        Name     string `json:"name"`
        Input    string `json:"input"`
        Expected string `json:"expected"`
    }
    if err := json.Unmarshal(data, &tests); err != nil {
        t.Fatalf("failed to parse test data: %v", err)
    }

    for _, tt := range tests {
        t.Run(tt.Name, func(t *testing.T) {
            result := Process(tt.Input)
            if result != tt.Expected {
                t.Errorf("expected %s, got %s", tt.Expected, result)
            }
        })
    }
}
```

### CSV 测试数据

```go
func TestFromCSV(t *testing.T) {
    // 打开 CSV 文件
    file, err := os.Open("testdata/cases.csv")
    if err != nil {
        t.Fatalf("failed to open CSV: %v", err)
    }
    defer file.Close()

    reader := csv.NewReader(file)
    records, err := reader.ReadAll()
    if err != nil {
        t.Fatalf("failed to read CSV: %v", err)
    }

    for i, record := range records {
        t.Run(fmt.Sprintf("case_%d", i), func(t *testing.T) {
            input := record[0]
            expected := record[1]

            result := Process(input)
            if result != expected {
                t.Errorf("expected %s, got %s", expected, result)
            }
        })
    }
}
```

## 复杂场景

### 状态测试

```go
func TestCounter(t *testing.T) {
    tests := []struct {
        name     string
        actions  func(*Counter)
        expected int
    }{
        {
            name: "increment once",
            actions: func(c *Counter) {
                c.Increment()
            },
            expected: 1,
        },
        {
            name: "increment multiple times",
            actions: func(c *Counter) {
                c.Increment()
                c.Increment()
                c.Increment()
            },
            expected: 3,
        },
        {
            name: "increment and decrement",
            actions: func(c *Counter) {
                c.Increment()
                c.Increment()
                c.Decrement()
            },
            expected: 1,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            counter := NewCounter()
            tt.actions(counter)

            if counter.Value() != tt.expected {
                t.Errorf("expected %d, got %d", tt.expected, counter.Value())
            }
        })
    }
}
```

### HTTP 测试

```go
func TestHTTPHandlers(t *testing.T) {
    tests := []struct {
        name           string
        method         string
        path           string
        body           string
        expectedStatus int
        expectedBody   string
    }{
        {
            name:           "get user",
            method:         "GET",
            path:           "/users/123",
            expectedStatus: http.StatusOK,
            expectedBody:   `{"id":123,"name":"Test User"}`,
        },
        {
            name:           "create user",
            method:         "POST",
            path:           "/users",
            body:           `{"name":"New User"}`,
            expectedStatus: http.StatusCreated,
            expectedBody:   `{"id":456,"name":"New User"}`,
        },
        {
            name:           "not found",
            method:         "GET",
            path:           "/users/999",
            expectedStatus: http.StatusNotFound,
            expectedBody:   `{"error":"user not found"}`,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // 创建测试请求
            var body io.Reader
            if tt.body != "" {
                body = strings.NewReader(tt.body)
            }
            req := httptest.NewRequest(tt.method, tt.path, body)
            w := httptest.NewRecorder()

            // 调用处理器
            handler := NewHandler()
            handler.ServeHTTP(w, req)

            // 验证响应
            if w.Code != tt.expectedStatus {
                t.Errorf("expected status %d, got %d", tt.expectedStatus, w.Code)
            }

            if w.Body.String() != tt.expectedBody {
                t.Errorf("expected body %s, got %s", tt.expectedBody, w.Body.String())
            }
        })
    }
}
```

## 测试生成

### 生成测试用例

```go
// 生成大量测试用例
func generateTests(count int) []struct {
    input    int
    expected int
} {
    tests := make([]struct {
        input    int
        expected int
    }, count)

    for i := 0; i < count; i++ {
        tests[i].input = i
        tests[i].expected = i * 2
    }

    return tests
}

func TestGenerated(t *testing.T) {
    tests := generateTests(100)

    for _, tt := range tests {
        t.Run(fmt.Sprintf("input_%d", tt.input), func(t *testing.T) {
            result := double(tt.input)
            if result != tt.expected {
                t.Errorf("expected %d, got %d", tt.expected, result)
            }
        })
    }
}
```

## 最佳实践

::: tip 使用建议

1. **命名用例** - 为每个用例提供描述性名称
2. **测试结构** - 使用匿名结构组织测试数据
3. **子测试** - 使用 t.Run 隔离用例
4. **并行测试** - 独立用例使用 t.Parallel
5. **清晰错误** - 提供有用的错误信息

:::

```go
// ✅ 好的 table 测试
func goodTableTest(t *testing.T) {
    tests := []struct {
        name     string
        input    int
        expected int
    }{
        {"zero", 0, 0},
        {"positive", 5, 10},
        {"negative", -5, -10},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := double(tt.input); got != tt.expected {
                t.Errorf("double(%d) = %d; want %d", tt.input, got, tt.expected)
            }
        })
    }
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **结构体** - 定义测试用例表格 |
| **t.Run** - 每个用例作为子测试 |
| **匿名结构** - 灵活定义测试数据 |
| **错误处理** - 测试错误用例 |
| **并行测试** - 使用 t.Parallel |
| **测试数据** - 从文件加载 |

::: v-pre

[测试基础](./testing-basics.md) → [Benchmark](./benchmarks.md)

:::
