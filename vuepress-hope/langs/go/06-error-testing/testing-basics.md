---
title: 测试基础
icon: ri:test-tube-line
order: 5
---

# 测试基础

Go 内置了强大的测试支持，通过 `testing` 包提供单元测试、基准测试和示例测试。

## 测试文件

### 文件命名

```go
// 测试文件命名：_test.go
// 例如：calculator_test.go

// 源文件：calculator.go
package calculator

func Add(a, b int) int {
    return a + b
}

// 测试文件：calculator_test.go
package calculator

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}
```

### 测试目录结构

```
project/
├── calculator.go
├── calculator_test.go
├── utils/
│   ├── string.go
│   └── string_test.go
└── main.go
```

## 基本测试

### Test 函数

```go
// 测试函数以 Test 开头，接收 *testing.T
func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5

    if result != expected {
        t.Errorf("Add(2, 3) = %d; want %d", result, expected)
    }
}

// 测试函数必须：
// 1. 以 Test 开头
// 2. 接收 *testing.T 参数
// 3. 没有返回值
// 4. 在 _test.go 文件中
```

### 错误报告

```go
func TestErrorReporting(t *testing.T) {
    // t.Error - 记录错误，继续执行
    if 1 != 2 {
        t.Error("1 should equal 2")
    }

    // t.Errorf - 格式化错误信息，继续执行
    if 1 != 2 {
        t.Errorf("expected %d, got %d", 2, 1)
    }

    // t.Fatal - 记录错误，停止执行
    if 1 != 2 {
        t.Fatal("critical failure")
    }

    // t.Fatalf - 格式化错误信息，停止执行
    if 1 != 2 {
        t.Fatalf("expected %d, got %d", 2, 1)
    }

    // t.Log - 记录信息（使用 -v 标志显示）
    t.Log("This is a log message")
}
```

### 测试辅助

```go
// 辅助函数不以 Test 开头
func setupTest(t *testing.T) *MyStruct {
    t.Helper()  // 标记为辅助函数

    // 辅助函数中的错误会报告到调用位置
    data, err := loadData()
    if err != nil {
        t.Fatalf("failed to load data: %v", err)
    }

    return &MyStruct{Data: data}
}

func TestWithHelper(t *testing.T) {
    m := setupTest(t)  // 如果失败，会报告到这一行

    result := m.Process()
    if result != "expected" {
        t.Errorf("unexpected result: %s", result)
    }
}
```

## 子测试

### t.Run

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -2, -3, -5},
        {"mixed numbers", -2, 3, 1},
        {"zeros", 0, 0, 0},
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

### 并行测试

```go
func TestParallel(t *testing.T) {
    tests := []struct {
        name string
        input int
    }{
        {"test1", 1},
        {"test2", 2},
        {"test3", 3},
    }

    for _, tt := range tests {
        tt := tt  // 并行测试需要捕获循环变量

        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()  // 标记为并行测试

            result := process(tt.input)
            if result != tt.input*2 {
                t.Errorf("expected %d, got %d", tt.input*2, result)
            }
        })
    }
}
```

## 测试生命周期

### Main 和 Setup

```go
// TestMain 在所有测试前后执行
func TestMain(m *testing.M) {
    fmt.Println("Setup: initializing")

    // 执行测试
    code := m.Run()

    fmt.Println("Teardown: cleaning up")
    os.Exit(code)
}

// 单个测试的 setup/teardown
func TestWithSetup(t *testing.T) {
    // Setup
    db := setupTestDB(t)
    defer cleanupTestDB(t, db)

    // 测试
    result := db.Query("SELECT * FROM users")
    if result == nil {
        t.Error("expected result, got nil")
    }
}

func setupTestDB(t *testing.T) *Database {
    t.Helper()
    db, err := OpenTestDB()
    if err != nil {
        t.Fatalf("failed to open test DB: %v", err)
    }
    return db
}

func cleanupTestDB(t *testing.T, db *Database) {
    t.Helper()
    if err := db.Close(); err != nil {
        t.Errorf("failed to close DB: %v", err)
    }
}
```

### 测试套件

```go
// 测试套件
type TestSuite struct {
    db    *Database
    cache *Cache
}

// SetupSuite 在套件开始前执行
func (s *TestSuite) SetupSuite() {
    var err error
    s.db, err = OpenTestDB()
    if err != nil {
        panic(err)
    }

    s.cache = NewCache()
}

// TearDownSuite 在套件结束后执行
func (s *TestSuite) TearDownSuite() {
    if s.db != nil {
        s.db.Close()
    }
}

// SetupTest 在每个测试前执行
func (s *TestSuite) SetupTest() {
    s.db.Exec("TRUNCATE TABLE users")
    s.cache.Clear()
}

// TearDownTest 在每个测试后执行
func (s *TestSuite) TearDownTest() {
    // 清理资源
}

// 使用套件
func TestWithSuite(t *testing.T) {
    suite := &TestSuite{}
    suite.SetupSuite()
    defer suite.TearDownSuite()

    t.Run("Test1", func(t *testing.T) {
        suite.SetupTest()
        defer suite.TearDownTest()

        // 测试代码
    })

    t.Run("Test2", func(t *testing.T) {
        suite.SetupTest()
        defer suite.TearDownTest()

        // 测试代码
    })
}
```

## 测试覆盖

### 运行测试

```bash
# 运行当前包的测试
go test

# 运行所有包的测试
go test ./...

# 运行指定测试
go test -run TestAdd

# 运行匹配的测试
go test -run "TestAdd|TestSubtract"

# 详细输出
go test -v

# 并行测试
go test -parallel 4

# 超时设置
go test -timeout 30s
```

### 覆盖率

```bash
# 生成覆盖率
go test -cover

# 覆盖率详情
go test -coverprofile=coverage.out

# 查看覆盖率报告
go tool cover -func=coverage.out

# 生成 HTML 报告
go tool cover -html=coverage.out -o coverage.html

# 设置覆盖率阈值
go test -coverprofile=coverage.out -covermode=atomic
```

### 覆盖率模式

```go
// 覆盖率模式：
// set: 是否执行（默认）
// count: 执行次数
// atomic: 原子计数（并发安全）
```

## Mock 和 Stub

### 接口 Mock

```go
// 定义接口
type Database interface {
    Query(query string) (*Result, error)
    Exec(query string, args ...interface{}) error
}

// Mock 实现
type MockDatabase struct {
    QueryFunc func(query string) (*Result, error)
    ExecFunc  func(query string, args ...interface{}) error
}

func (m *MockDatabase) Query(query string) (*Result, error) {
    if m.QueryFunc != nil {
        return m.QueryFunc(query)
    }
    return nil, fmt.Errorf("QueryFunc not set")
}

func (m *MockDatabase) Exec(query string, args ...interface{}) error {
    if m.ExecFunc != nil {
        return m.ExecFunc(query, args...)
    }
    return fmt.Errorf("ExecFunc not set")
}

// 使用 mock
func TestWithMock(t *testing.T) {
    mockDB := &MockDatabase{
        QueryFunc: func(query string) (*Result, error) {
            return &Result{Count: 42}, nil
        },
    }

    service := NewService(mockDB)
    result, err := service.GetData()
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }

    if result.Count != 42 {
        t.Errorf("expected count 42, got %d", result.Count)
    }
}
```

### HTTP 测试

```go
func TestHTTPHandler(t *testing.T) {
    // 创建测试请求
    req := httptest.NewRequest("GET", "/users/123", nil)
    w := httptest.NewRecorder()

    // 调用处理器
    handler := http.HandlerFunc(GetUser)
    handler.ServeHTTP(w, req)

    // 检查响应
    if w.Code != http.StatusOK {
        t.Errorf("expected status 200, got %d", w.Code)
    }

    expected := `{"id":123,"name":"Test User"}`
    if w.Body.String() != expected {
        t.Errorf("expected body %s, got %s", expected, w.Body.String())
    }
}
```

## 测试断言库

### 自定义断言

```go
// 自定义断言函数
func assertEqual(t *testing.T, expected, actual interface{}) {
    t.Helper()
    if expected != actual {
        t.Errorf("expected %v, got %v", expected, actual)
    }
}

func assertNoError(t *testing.T, err error) {
    t.Helper()
    if err != nil {
        t.Errorf("unexpected error: %v", err)
    }
}

func assertError(t *testing.T, err error) {
    t.Helper()
    if err == nil {
        t.Error("expected error, got nil")
    }
}

// 使用自定义断言
func TestWithAssertions(t *testing.T) {
    result := Add(2, 3)
    assertEqual(t, 5, result)

    data, err := loadData()
    assertNoError(t, err)
    assertEqual(t, "expected", data)
}
```

## 最佳实践

::: tip 使用建议

1. **表驱动测试** - 使用表格测试多场景
2. **子测试** - 使用 t.Run 组织测试
3. **辅助函数** - 使用 t.Helper() 标记
4. **并行测试** - 使用 t.Parallel() 加速
5. **覆盖率** - 确保关键路径被测试

:::

```go
// ✅ 好的测试
func GoodTest(t *testing.T) {
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
        tt := tt
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()
            result := double(tt.input)
            if result != tt.expected {
                t.Errorf("expected %d, got %d", tt.expected, result)
            }
        })
    }
}

// ❌ 不好的测试
func BadTest(t *testing.T) {
    // 硬编码值，不易扩展
    result := double(5)
    if result != 10 {
        t.Error("wrong")
    }
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **文件** - 以 `_test.go` 结尾 |
| **函数** - 以 `Test` 开头 |
| **t.Error** - 记录错误，继续 |
| **t.Fatal** - 记录错误，停止 |
| **t.Run** - 子测试 |
| **t.Parallel** - 并行测试 |

::: v-pre

[Panic/Recover](./panic-recover.md) → [Table驱动](./table-driven.md)

:::
