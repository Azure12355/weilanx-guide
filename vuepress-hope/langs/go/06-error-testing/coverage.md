---
title: 测试覆盖
icon: ri:pie-chart-line
order: 8
---

# 测试覆盖

测试覆盖率用于衡量测试的完整性，帮助发现未测试的代码路径。

## 覆盖率类型

### 语句覆盖

```go
// 测试是否覆盖每条语句
func calculate(a, b int) int {
    if a > b {
        return a - b
    }
    return b - a
}

// 测试用例 1：a > b
func TestCalculate_Greater(t *testing.T) {
    result := calculate(5, 3)
    if result != 2 {
        t.Errorf("expected 2, got %d", result)
    }
}

// 测试用例 2：a <= b
func TestCalculate_LessOrEqual(t *testing.T) {
    result := calculate(3, 5)
    if result != 2 {
        t.Errorf("expected 2, got %d", result)
    }
}
```

### 分支覆盖

```go
// 测试是否覆盖所有分支
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// 测试用例 1：正常情况
func TestDivide_Normal(t *testing.T) {
    result, err := divide(10, 2)
    if err != nil {
        t.Errorf("unexpected error: %v", err)
    }
    if result != 5 {
        t.Errorf("expected 5, got %d", result)
    }
}

// 测试用例 2：除以零
func TestDivide_ByZero(t *testing.T) {
    _, err := divide(10, 0)
    if err == nil {
        t.Error("expected error, got nil")
    }
}
```

## 覆盖率命令

### 基本命令

```bash
# 生成覆盖率
go test -cover

# 输出示例：
# ok      example.com/myproject    0.845s    coverage: 85.3% of statements

# 生成覆盖率详情
go test -coverprofile=coverage.out

# 查看覆盖率报告
go tool cover -func=coverage.out

# 输出示例：
# example.com/myproject/calculate.go:15:   calculate    100.0%
# example.com/myproject/calculate.go:20:   divide       75.0%
```

### 覆盖率模式

```bash
# set 模式：是否执行（默认）
go test -coverprofile=coverage.out -covermode=set

# count 模式：执行次数
go test -coverprofile=coverage.out -covermode=count

# atomic 模式：原子计数（并发安全）
go test -coverprofile=coverage.out -covermode=atomic
```

### 覆盖率详情

```bash
# 按函数查看覆盖率
go tool cover -func=coverage.out

# 示例输出：
# github.com/user/project/calc.go:15:    Add          100.0%
# github.com/user/project/calc.go:20:    Subtract    100.0%
# github.com/user/project/calc.go:25:    Multiply      66.7%

# 生成 HTML 报告
go tool cover -html=coverage.out -o coverage.html

# 在浏览器中打开
open coverage.html
```

## 覆盖率目标

### 设置目标

```go
// 在测试中设置覆盖率目标
func TestCoverage(t *testing.T) {
    // 这个测试不做什么，只是触发覆盖率收集
    // 实际测试在其他文件中
}
```

### 覆盖率阈值

```bash
# 检查覆盖率是否达到阈值
go test -coverprofile=coverage.out
coverage=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
echo "Coverage: $coverage%"

# 在 CI 中设置阈值
if (( $(echo "$coverage < 80" | bc -l) )); then
    echo "Coverage below 80%"
    exit 1
fi
```

## 包覆盖率

### 多包覆盖率

```bash
# 测试所有包并生成覆盖率
go test ./... -coverprofile=coverage.out

# 查看总体覆盖率
go tool cover -func=coverage.out | tail -1
```

### 合并覆盖率

```bash
# 生成多个包的覆盖率
go test ./pkg/... -coverprofile=pkg_coverage.out
go test ./cmd/... -coverprofile=cmd_coverage.out

# 合并覆盖率文件
go tool cover -func=pkg_coverage.out > coverage.txt
go tool cover -func=cmd_coverage.out >> coverage.txt
```

## 覆盖率排除

### 排除文件

```go
// +build !test_coverage

// 这个文件在使用 -tags=test_coverage 时不会被编译
// 适用于不需要测试覆盖率的代码
package main

func untestableFunction() {
    // 无法测试的代码
}
```

### 排除代码

```go
// 使用注释排除特定代码
func complexFunction() int {
    // 整个函数
    //go:noinline
    if someCondition {
        return 1
    }
    return 0
}

// 注意：Go 没有内置的排除注释
// 这是通过编译器指令实现的
```

## 覆盖率可视化

### HTML 报告

```bash
# 生成 HTML 报告
go tool cover -html=coverage.out -o coverage.html

# 报告特点：
# - 绿色：已覆盖
# - 红色：未覆盖
# - 点击代码行查看详细信息
```

### 可视化工具

```bash
# 使用 gocov
go install github.com/matm/gocov/cmd/gocov@latest
gocov coverage coverage.out

# 使用 gocov-html
go install github.com/matm/gocov/cmd/gocov-html@latest
gocov coverage coverage.out | gocov-html > coverage.html
```

## CI 集成

### GitHub Actions

```yaml
name: Test Coverage

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.21'

    - name: Run tests with coverage
      run: go test -coverprofile=coverage.out ./...

    - name: Check coverage threshold
      run: |
        coverage=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
        echo "Coverage: $coverage%"
        if (( $(echo "$coverage < 80" | bc -l) )); then
          echo "Coverage below 80%"
          exit 1
        fi

    - name: Upload coverage to artifacts
      uses: actions/upload-artifact@v3
      with:
        name: coverage-report
        path: coverage.html
```

## 最佳实践

::: tip 使用建议

1. **关注关键路径** - 优先测试核心逻辑
2. **边界条件** - 测试边界和异常情况
3. **逐步提高** - 逐步提高覆盖率目标
4. **质量优先** - 不要盲目追求高覆盖率
5. **定期审查** - 定期审查覆盖率报告

:::

```go
// ✅ 好的测试覆盖
func TestGoodCoverage(t *testing.T) {
    tests := []struct {
        name     string
        input    int
        expected int
    }{
        {"zero", 0, 0},
        {"positive", 5, 10},
        {"negative", -5, -10},
        {"max", 2147483647, 0}, // 溢出情况
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := double(tt.input)
            if result != tt.expected {
                t.Errorf("expected %d, got %d", tt.expected, result)
            }
        })
    }
}

// ❌ 不好的测试覆盖
func TestBadCoverage(t *testing.T) {
    // 只测试了正常情况
    result := double(5)
    if result != 10 {
        t.Error("wrong")
    }
}
```

## 覆盖率工具

### go tool cover

```bash
# 基本用法
go tool cover -func=coverage.out    # 函数级别
go tool cover -html=coverage.out     # HTML 报告

# 其他选项
go tool cover -func=coverage.out | grep total  # 总覆盖率
```

### 第三方工具

```bash
# gocov - 更好的覆盖率展示
go install github.com/matm/gocov/cmd/gocov@latest
gocov coverage coverage.out

# gocoverage - 覆盖率徽章
go install github.com/suyashkumar/gocoverage@latest
gocoverage -html coverage.out
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **cover** - 生成覆盖率 |
| **coverprofile** - 覆盖率文件 |
| **covermode** - 覆盖率模式 |
| **go tool cover** - 查看报告 |
| **HTML 报告** - 可视化覆盖率 |
| **CI 集成** - 自动化覆盖率检查 |

::: v-pre

[基准测试](./benchmark.md) → [包管理](/langs/go/07-packages/)

:::
