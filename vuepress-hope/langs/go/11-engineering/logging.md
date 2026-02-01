---
title: 日志系统
icon: ri:file-list-3-line
order: 3
---

# 日志系统

良好的日志系统对于调试、监控和维护 Go 应用程序至关重要。

## 日志库选择

### zap - 高性能日志

```go
import "go.uber.org/zap"

// 初始化日志器
func initLogger() *zap.Logger {
    // 开发环境
    logger, _ := zap.NewDevelopment()

    // 生产环境
    logger, _ = zap.NewProduction()

    // 自定义配置
    logger = zap.NewExample()

    return logger
}

// 使用
func main() {
    logger := initLogger()
    defer logger.Sync()  // 刷新缓冲区

    logger.Info("Application started")
}
```

### slog - 结构化日志（Go 1.21+）

```go
import "log/slog"

func initSlog() *slog.Logger {
    // 创建 JSON handler
    handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
        Level: slog.LevelInfo,
    })

    return slog.New(handler)
}

func main() {
    logger := initSlog()

    logger.Info("Application started",
        "version", "1.0.0",
        "env", "production",
    )
}
```

## 日志级别

### 级别使用

```go
import "go.uber.org/zap"

func logLevels(logger *zap.Logger) {
    // Debug：详细的调试信息
    logger.Debug("Processing request",
        zap.String("path", "/api/users"),
        zap.Int("page", 1),
    )

    // Info：一般信息
    logger.Info("User logged in",
        zap.String("user_id", "123"),
        zap.String("ip", "192.168.1.1"),
    )

    // Warn：警告信息
    logger.Warn("High memory usage detected",
        zap.Int64("usage", 1024*1024*1024),
        zap.Float64("threshold", 0.9),
    )

    // Error：错误信息
    logger.Error("Failed to process payment",
        zap.String("order_id", "ORD-001"),
        zap.Error(err),
    )

    // Fatal：致命错误后退出
    logger.Fatal("Cannot connect to database",
        zap.String("host", "localhost:3306"),
        zap.Error(err),
    )
}
```

### 动态级别

```go
// 从环境变量设置日志级别
func initLoggerFromEnv() *zap.Logger {
    level := os.Getenv("LOG_LEVEL")

    var zapLevel zapcore.Level
    switch strings.ToUpper(level) {
    case "DEBUG":
        zapLevel = zapcore.DebugLevel
    case "INFO":
        zapLevel = zapcore.InfoLevel
    case "WARN":
        zapLevel = zapcore.WarnLevel
    case "ERROR":
        zapLevel = zapcore.ErrorLevel
    default:
        zapLevel = zapcore.InfoLevel
    }

    encoderCfg := zap.NewProductionEncoderConfig()
    encoderCfg.TimeKey = "timestamp"
    encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder

    core := zapcore.NewCore(
        zapcore.NewJSONEncoder(encoderCfg),
        zapcore.AddSync(os.Stdout),
        zapLevel,
    )

    return zap.New(core)
}
```

## 结构化日志

### 字段日志

```go
// 使用字段记录结构化数据
func structuredLogging(logger *zap.Logger) {
    // 基本类型
    logger.Info("User action",
        zap.String("user_id", "123"),
        zap.Int("age", 25),
        zap.Bool("active", true),
        zap.Float64("score", 95.5),
    )

    // 时间
    logger.Info("Processing time",
        zap.Duration("elapsed", time.Since(start)),
    )

    // 任意对象
    logger.Info("Request data",
        zap.Any("payload", request),
    )

    // 命名空间
    logger = logger.With(
        zap.String("service", "user-service"),
        zap.String("version", "1.0.0"),
    )

    logger.Info("This log includes service and version")
}
```

### 上下文传递

```go
// 在请求处理中使用日志
func loggingMiddleware(logger *zap.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 为每个请求创建带上下文的日志器
        requestID := c.GetHeader("X-Request-ID")

        log := logger.With(
            zap.String("request_id", requestID),
            zap.String("method", c.Request.Method),
            zap.String("path", c.Request.URL.Path),
        )

        // 存储到上下文
        c.Set("logger", log)

        log.Info("Request started")

        // 记录响应时间
        start := time.Now()
        c.Next()

        log.Info("Request completed",
            zap.Int("status", c.Writer.Status()),
            zap.Duration("duration", time.Since(start)),
        )
    }
}
```

## 日志配置

### 生产环境配置

```go
func newProductionLogger() (*zap.Logger, error) {
    // 编码器配置
    encoderConfig := zap.NewProductionEncoderConfig()
    encoderConfig.TimeKey = "timestamp"
    encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
    encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder

    // 输出
    stdout := zapcore.AddSync(os.Stdout)

    // 核心配置
    core := zapcore.NewCore(
        zapcore.NewJSONEncoder(encoderConfig),
        stdout,
        zapcore.InfoLevel,
    )

    // 添加调用者信息
    logger := zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))

    return logger, nil
}
```

### 开发环境配置

```go
func newDevelopmentLogger() (*zap.Logger, error) {
    encoderConfig := zap.NewDevelopmentEncoderConfig()
    encoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
    encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

    core := zapcore.NewCore(
        zapcore.NewConsoleEncoder(encoderConfig),
        zapcore.AddSync(os.Stdout),
        zapcore.DebugLevel,
    )

    logger := zap.New(core, zap.AddCaller())

    return logger, nil
}
```

### 多输出

```go
func newMultiOutputLogger() (*zap.Logger, error) {
    // 控制台输出
    stdout := zapcore.AddSync(os.Stdout)

    // 文件输出
    file, _ := os.OpenFile("app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    fileWriter := zapcore.AddSync(file)

    // 错误文件输出
    errorFile, _ := os.OpenFile("error.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    errorWriter := zapcore.AddSync(errorFile)

    // 编码器
    encoder := zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig())

    // 核心：标准输出到控制台，错误到文件
    core := zapcore.NewTee(
        zapcore.NewCore(encoder, stdout, zapcore.InfoLevel),
        zapcore.NewCore(encoder, errorWriter, zapcore.WarnLevel),
        zapcore.NewCore(encoder, fileWriter, zapcore.DebugLevel),
    )

    return zap.New(core), nil
}
```

## 日志轮转

### lumberjack 日志轮转

```go
import "gopkg.in/natefinch/lumberjack.v2"

func newRotatingLogger() *zap.Logger {
    // 日志轮转配置
    writer := &lumberjack.Logger{
        Filename:   "app.log",
        MaxSize:    100,  // MB
        MaxBackups: 3,
        MaxAge:     28,   // days
        Compress:   true,
    }

    core := zapcore.NewCore(
        zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig()),
        zapcore.AddSync(writer),
        zapcore.InfoLevel,
    )

    return zap.New(core)
}
```

### 日志清理

```go
func cleanOldLogs(logDir string, maxAge time.Duration) error {
    files, err := os.ReadDir(logDir)
    if err != nil {
        return err
    }

    cutoff := time.Now().Add(-maxAge)

    for _, file := range files {
        if file.IsDir() {
            continue
        }

        info, err := file.Info()
        if err != nil {
            continue
        }

        if info.ModTime().Before(cutoff) {
            os.Remove(filepath.Join(logDir, file.Name()))
        }
    }

    return nil
}
```

## 性能考虑

### 避免频繁日志

```go
// ✅ 使用条件日志
func conditionalLogging(logger *zap.Logger, verbose bool) {
    data := expensiveOperation()

    if verbose {
        logger.Debug("Detailed data", zap.Any("data", data))
    }
}

// ❌ 总是记录详细日志
func badLogging(logger *zap.Logger) {
    data := expensiveOperation()
    logger.Debug("Detailed data", zap.Any("data", data))  // 即使不需要也记录
}
```

### 使用采样

```go
// 对高频日志进行采样
func newSamplingLogger() *zap.Logger {
    core := zapcore.NewCore(
        zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig()),
        zapcore.AddSync(os.Stdout),
        zapcore.InfoLevel,
    )

    // 每 100 个日志只记录 1 个
    logger := zap.New(core, zap.WrapCore(zapcore.NewSampler(core, time.Second, 100)))

    return logger
}
```

### 异步日志

```go
// 使用缓冲通道异步写入
type AsyncLogger struct {
    ch   chan *zap.Entry
    zap  *zap.Logger
    stop chan struct{}
}

func NewAsyncLogger(zapLogger *zap.Logger, bufferSize int) *AsyncLogger {
    al := &AsyncLogger{
        ch:   make(chan *zap.Entry, bufferSize),
        zap:  zapLogger,
        stop: make(chan struct{}),
    }

    go al.writer()
    return al
}

func (al *AsyncLogger) writer() {
    for {
        select {
        case entry := <-al.ch:
            al.zap.Log(*entry)
        case <-al.stop:
            return
        }
    }
}

func (al *AsyncLogger) Log(msg string, fields ...zap.Field) {
    entry := &zap.Entry{
        Message: msg,
    }
    al.ch <- entry
}

func (al *AsyncLogger) Close() {
    close(al.stop)
}
```

## 最佳实践

::: tip 日志建议

1. **结构化** - 使用字段而非字符串拼接
2. **适当级别** - Debug 开发，Info 生产
3. **包含上下文** - request_id、user_id 等
4. **避免敏感** - 不记录密码、token 等
5. **性能考虑** - 高频日志使用采样

:::

```go
// ✅ 好的模式
func goodLogging(logger *zap.Logger) {
    logger.Info("User login",
        zap.String("user_id", "123"),
        zap.String("ip", c.ClientIP()),
    )
}

// ❌ 不好的模式
func badLogging(logger *zap.Logger) {
    logger.Info(fmt.Sprintf("User %s logged in from %s",
        userID, clientIP))  // 非结构化
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **zap/slog** - 使用结构化日志库 |
| **级别** - Debug/Info/Warn/Error/Fatal |
| **字段** - 使用字段记录结构化数据 |
| **上下文** - 传递 request_id 等信息 |
| **轮转** - 使用 lumberjack 自动轮转 |

::: v-pre

[项目结构](./project-structure.md) → [配置管理](./configuration.md)

:::
