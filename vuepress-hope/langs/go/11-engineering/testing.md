---
title: 测试策略
icon: ri:test-tube-line
order: 6
---

# 测试策略

全面的测试策略是保证代码质量的关键。

## 测试类型

### 单元测试

```go
package service

import (
    "testing"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

// Mock Repository
type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) FindByID(id string) (*User, error) {
    args := m.Called(id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*User), args.Error(1)
}

func (m *MockUserRepository) Create(user *User) error {
    args := m.Called(user)
    return args.Error(0)
}

// 单元测试
func TestUserService_GetUser(t *testing.T) {
    tests := []struct {
        name    string
        setup   func(*MockUserRepository)
        input   string
        want    *User
        wantErr bool
        errMsg  string
    }{
        {
            name: "success",
            setup: func(m *MockUserRepository) {
                m.On("FindByID", "123").Return(&User{
                    ID:   "123",
                    Name: "Alice",
                }, nil)
            },
            input:   "123",
            want:    &User{ID: "123", Name: "Alice"},
            wantErr: false,
        },
        {
            name: "not found",
            setup: func(m *MockUserRepository) {
                m.On("FindByID", "404").Return(nil, ErrNotFound)
            },
            input:   "404",
            wantErr: true,
            errMsg:  "user not found",
        },
        {
            name: "invalid id",
            setup: func(m *MockUserRepository) {
                // 不设置 mock，应该失败
            },
            input:   "",
            wantErr: true,
            errMsg:  "invalid user id",
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            mockRepo := new(MockUserRepository)
            tt.setup(mockRepo)

            service := NewUserService(mockRepo)

            got, err := service.GetUser(tt.input)

            if tt.wantErr {
                assert.Error(t, err)
                if tt.errMsg != "" {
                    assert.Contains(t, err.Error(), tt.errMsg)
                }
            } else {
                assert.NoError(t, err)
                assert.Equal(t, tt.want, got)
            }

            mockRepo.AssertExpectations(t)
        })
    }
}
```

### 表驱动测试

```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        email    string
        expected bool
    }{
        {"user@example.com", true},
        {"user.name@example.com", true},
        {"user+tag@example.com", true},
        {"invalid", false},
        {"@example.com", false},
        {"user@", false},
        {"", false},
    }

    for _, tt := range tests {
        t.Run(tt.email, func(t *testing.T) {
            result := ValidateEmail(tt.email)
            assert.Equal(t, tt.expected, result)
        })
    }
}

func TestCalculateDiscount(t *testing.T) {
    tests := []struct {
        name           string
        originalPrice  float64
        discountPercent float64
        expected       float64
    }{
        {
            name:           "10% discount",
            originalPrice:  100,
            discountPercent: 10,
            expected:       90,
        },
        {
            name:           "25% discount",
            originalPrice:  200,
            discountPercent: 25,
            expected:       150,
        },
        {
            name:           "50% discount",
            originalPrice:  100,
            discountPercent: 50,
            expected:       50,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := CalculateDiscount(tt.originalPrice, tt.discountPercent)
            assert.Equal(t, tt.expected, result)
        })
    }
}
```

### 集成测试

```go
func TestAPI_Integration(t *testing.T) {
    // 设置测试数据库
    testDB := setupTestDB(t)
    defer teardownTestDB(t, testDB)

    // 创建测试服务器
    app := setupApp(testDB)
    server := httptest.NewServer(app)
    defer server.Close()

    // 测试用例
    t.Run("create and get user", func(t *testing.T) {
        // 创建用户
        createReq := CreateUserRequest{
            Name:  "Alice",
            Email: "alice@example.com",
        }

        resp, err := http.Post(server.URL+"/api/users",
            "application/json",
            toJSON(createReq),
        )
        require.NoError(t, err)
        assert.Equal(t, http.StatusCreated, resp.StatusCode)

        // 解析响应
        var user User
        json.NewDecoder(resp.Body).Decode(&user)
        resp.Body.Close()

        // 获取用户
        getResp, err := http.Get(server.URL + "/api/users/" + user.ID)
        require.NoError(t, err)
        assert.Equal(t, http.StatusOK, getResp.StatusCode)

        var fetchedUser User
        json.NewDecoder(getResp.Body).Decode(&fetchedUser)
        getResp.Body.Close()

        assert.Equal(t, user.ID, fetchedUser.ID)
        assert.Equal(t, user.Name, fetchedUser.Name)
    })
}

func setupTestDB(t *testing.T) *sql.DB {
    db, err := sql.Open("sqlite3", ":memory:")
    require.NoError(t, err)

    // 运行迁移
    _, err = db.Exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    `)
    require.NoError(t, err)

    return db
}

func teardownTestDB(t *testing.T, db *sql.DB) {
    db.Close()
}
```

## 测试辅助

### Testify 断言

```go
import "github.com/stretchr/testify/assert"
import "github.com/stretchr/testify/require"

func TestAssertions(t *testing.T) {
    // assert - 失败后继续
    assert.Equal(t, 1, 1, "should be equal")
    assert.True(t, 1 == 1, "should be true")
    assert.Nil(t, nil, "should be nil")
    assert.Contains(t, "hello world", "hello", "should contain")

    // require - 失败后立即停止
    require.Equal(t, 1, 1, "must be equal")
    require.NotNil(t, "value", "must not be nil")
}

func TestHTTPAssertions(t *testing.T) {
    resp, _ := http.Get("http://example.com")
    defer resp.Body.Close()

    // HTTP 断言
    assert.Equal(t, http.StatusOK, resp.StatusCode)

    body, _ := io.ReadAll(resp.Body)
    assert.Contains(t, string(body), "example")
}
```

### 测试 fixture

```go
// testdata/fixtures.go
package testdata

func NewUser() *User {
    return &User{
        ID:    generateID(),
        Name:  "Test User",
        Email: "test@example.com",
    }
}

func NewUserWithOverrides(overrides func(*User)) *User {
    user := NewUser()
    overrides(user)
    return user
}

// 使用
func TestWithFixtures(t *testing.T) {
    user := testdata.NewUser()
    user2 := testdata.NewUserWithOverrides(func(u *User) {
        u.Name = "Custom Name"
    })

    assert.Equal(t, "Test User", user.Name)
    assert.Equal(t, "Custom Name", user2.Name)
}
```

### 测试辅助函数

```go
// 辅助函数
func assertHTTPError(t *testing.T, resp *http.Response, code int, msg string) {
    t.Helper()

    assert.Equal(t, code, resp.StatusCode)

    var errResp ErrorResponse
    json.NewDecoder(resp.Body).Decode(&errResp)

    assert.Contains(t, errResp.Message, msg)
}

func setupTestServer(handler http.Handler) *httptest.Server {
    return httptest.NewServer(handler)
}

func cleanupTestServer(server *httptest.Server) {
    server.Close()
}

// 使用
func TestWithErrorHelpers(t *testing.T) {
    server := setupTestServer(router)
    defer cleanupTestServer(server)

    resp, _ := http.Post(server.URL+"/api/users",
        "application/json", strings.NewReader("{}"))

    assertHTTPError(t, resp, http.StatusBadRequest, "validation error")
}
```

## 测试覆盖

### 运行覆盖

```bash
# 运行测试并生成覆盖报告
go test -coverprofile=coverage.out ./...

# 查看覆盖报告
go tool cover -func=coverage.out

# 生成 HTML 覆盖报告
go tool cover -html=coverage.out -o coverage.html
```

### 覆盖阈值

```go
//go:build integration
// +build integration

// integration_test.go
package integration

func TestIntegration(t *testing.T) {
    // 集成测试
}
```

### 按包覆盖

```bash
# 测试特定包
go test -coverprofile=coverage.out ./internal/service

# 测试所有包
go test -coverprofile=coverage.out ./...

# 查看覆盖情况
go tool cover -func=coverage.out | grep total
```

## 并发测试

### race 检测

```go
func TestRaceCondition(t *testing.T) {
    var counter int

    // 使用 t.Parallel 并行运行
    t.Run("parallel", func(t *testing.T) {
        t.Parallel()

        for i := 0; i < 1000; i++ {
            counter++
        }
    })

    t.Run("parallel2", func(t *testing.T) {
        t.Parallel()

        for i := 0; i < 1000; i++ {
            counter++
        }
    })

    // 使用 -race 标志检测竞态
    // go test -race ./...
}
```

### 并发安全测试

```go
func TestConcurrentSafeMap(t *testing.T) {
    m := NewSafeMap()

    var wg sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func(val int) {
            defer wg.Done()
            m.Set(strconv.Itoa(val), val)
        }(i)
    }

    wg.Wait()

    // 验证
    assert.Equal(t, 100, m.Len())
}
```

## 测试组织

### 测试套件

```go
func TestUserService(t *testing.T) {
    // 共享 setup
    suite := &UserServiceTestSuite{
        mockRepo: new(MockUserRepository),
    }

    suite.SetupTest()

    t.Run("CreateUser", suite.TestCreateUser)
    t.Run("GetUser", suite.TestGetUser)
    t.Run("UpdateUser", suite.TestUpdateUser)
    t.Run("DeleteUser", suite.TestDeleteUser)
}

type UserServiceTestSuite struct {
    mockRepo *MockUserRepository
    service  *UserService
}

func (s *UserServiceTestSuite) SetupTest() {
    // 每个 test 前运行
}

func (s *UserServiceTestSuite) TearDownTest() {
    // 每个 test 后运行
}

func (s *UserServiceTestSuite) TestCreateUser(t *testing.T) {
    // 测试逻辑
}
```

### 子测试

```go
func TestProcessData(t *testing.T) {
    tests := map[string]struct {
        input    string
        expected string
    }{
        "lowercase": {
            input:    "hello",
            expected: "HELLO",
        },
        "uppercase": {
            input:    "WORLD",
            expected: "WORLD",
        },
        "mixed": {
            input:    "Hello World",
            expected: "HELLO WORLD",
        },
    }

    for name, tt := range tests {
        t.Run(name, func(t *testing.T) {
            result := process(tt.input)
            assert.Equal(t, tt.expected, result)
        })
    }
}
```

## 模拟和桩

### HTTP mock

```go
func TestHTTPClient(t *testing.T) {
    // 创建 mock 服务器
    server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        assert.Equal(t, "/api/users", r.URL.Path)
        assert.Equal(t, "GET", r.Method)

        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"users": []}`))
    }))
    defer server.Close()

    // 使用 mock 服务器
    client := NewClient(server.URL)

    users, err := client.GetUsers()
    assert.NoError(t, err)
    assert.NotNil(t, users)
}
```

### 数据库 mock

```go
func TestWithDBMock(t *testing.T) {
    // 使用 sqlmock
    db, mock, err := sqlmock.New()
    require.NoError(t, err)
    defer db.Close()

    // 设置期望
    rows := sqlmock.NewRows([]string{"id", "name", "email"}).
        AddRow("1", "Alice", "alice@example.com")

    mock.ExpectQuery("SELECT \\* FROM users").
        WillReturnRows(rows)

    // 测试代码
    repo := NewUserRepository(db)
    user, err := repo.Find("1")

    assert.NoError(t, err)
    assert.Equal(t, "Alice", user.Name)

    // 确保所有期望都被满足
    assert.NoError(t, mock.ExpectationsWereMet())
}
```

## 基准测试

### 性能测试

```go
func BenchmarkStringConcat(b *testing.B) {
    for i := 0; i < b.N; i++ {
        result := ""
        for j := 0; j < 100; j++ {
            result += "x"
        }
        _ = result
    }
}

func BenchmarkStringBuilder(b *testing.B) {
    for i := 0; i < b.N; i++ {
        var builder strings.Builder
        for j := 0; j < 100; j++ {
            builder.WriteString("x")
        }
        _ = builder.String()
    }
}
```

## 最佳实践

::: tip 测试建议

1. **测试名称** - 清晰描述测试意图
2. **独立性** - 测试之间不相互依赖
3. **可重复** - 结果可重复验证
4. **快速执行** - 单元测试应该快速
5. **清晰断言** - 使用清晰的断言消息

:::

```go
// ✅ 好的模式
func TestUserService_CreateUser_WithValidInput_ReturnsCreatedUser(t *testing.T) {
    // Given
    service := setupService()
    req := CreateUserRequest{
        Name:  "Alice",
        Email: "alice@example.com",
    }

    // When
    user, err := service.CreateUser(req)

    // Then
    assert.NoError(t, err)
    assert.NotNil(t, user)
    assert.Equal(t, req.Name, user.Name)
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **单元测试** - 测试独立功能 |
| **表驱动** - 多场景测试 |
| **Mock** - 隔离外部依赖 |
| **集成测试** - 测试组件交互 |
| **覆盖** - 确保充分覆盖 |

::: v-pre

[错误处理](./error-handling.md) → [部署运维](./deployment.md)

:::
