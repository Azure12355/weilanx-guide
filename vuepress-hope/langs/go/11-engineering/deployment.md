---
title: 部署运维
icon: ri:rocket-2-line
order: 7
---

# 部署运维

良好的部署和运维实践确保应用稳定运行。

## 容器化

### Dockerfile

```dockerfile
# 多阶段构建
FROM golang:1.21-alpine AS builder

# 安装依赖
RUN apk add --no-cache git ca-certificates

WORKDIR /app

# 复制依赖文件
COPY go.mod go.sum ./
RUN go mod download

# 复制源码
COPY . .

# 构建
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o myapp ./cmd/myapp

# 运行时镜像
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# 从构建阶段复制
COPY --from=builder /app/myapp .
COPY --from=builder /app/configs ./configs

# 创建非 root 用户
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser && \
    chown -R appuser:appuser /root

USER appuser

EXPOSE 8080

CMD ["./myapp"]
```

### docker-compose

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - APP_SERVER_HOST=0.0.0.0
      - APP_SERVER_PORT=8080
      - APP_DB_HOST=db
      - APP_DB_PORT=3306
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=myapp
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.21'

    - name: Cache Go modules
      uses: actions/cache@v3
      with:
        path: ~/go/pkg/mod
        key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}
        restore-keys: |
          ${{ runner.os }}-go-

    - name: Download dependencies
      run: go mod download

    - name: Run go vet
      run: go vet ./...

    - name: Run golangci-lint
      uses: golangci/golangci-lint-action@v3
      with:
        version: latest

    - name: Run tests
      run: go test -v -race -coverprofile=coverage.out ./...

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage.out

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          myapp:latest
          myapp:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: golang:1.21

  script:
    - go mod download
    - go vet ./...
    - go test -v -race -coverprofile=coverage.out ./...

  coverage: '/coverage: \d+\.\d+% of statements/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind

  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker tag myapp:$CI_COMMIT_SHA myapp:latest
    - docker push myapp:$CI_COMMIT_SHA
    - docker push myapp:latest

deploy:
  stage: deploy
  image: alpine:latest
  only:
    - main

  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK
```

## Kubernetes

### Deployment

```yaml
# deployments/app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8080
        env:
        - name: APP_SERVER_HOST
          value: "0.0.0.0"
        - name: APP_DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db.host
        - name: APP_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db.password
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

### ConfigMap 和 Secret

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.server.host: "0.0.0.0"
  app.server.port: "8080"
  db.host: "postgres.default.svc.cluster.local"
  db.port: "5432"
  log.level: "info"
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  db.password: c2VjcmV0
  api.secret: YXBpX2tleQ==
```

## 健康检查

### 健康检查端点

```go
type HealthChecker struct {
    db    *sql.DB
    redis *redis.Client
}

func (h *HealthChecker) CheckHealth(ctx context.Context) error {
    // 检查数据库
    if err := h.db.PingContext(ctx); err != nil {
        return fmt.Errorf("database unhealthy: %w", err)
    }

    // 检查 Redis
    if err := h.redis.Ping(ctx).Err(); err != nil {
        return fmt.Errorf("redis unhealthy: %w", err)
    }

    return nil
}

// HTTP handler
func (h *HealthChecker) Handler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
        defer cancel()

        if err := h.CheckHealth(ctx); err != nil {
            http.Error(w, err.Error(), http.StatusServiceUnavailable)
            return
        }

        w.WriteHeader(http.StatusOK)
        w.Write([]byte("OK"))
    }
}
```

### 就绪检查

```go
func (h *HealthChecker) CheckReady(ctx context.Context) error {
    // 检查是否就绪
    if !h.isReady {
        return errors.New("service not ready")
    }

    // 检查关键依赖
    return h.CheckHealth(ctx)
}

func (h *HealthChecker) ReadyHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
        defer cancel()

        if err := h.CheckReady(ctx); err != nil {
            http.Error(w, err.Error(), http.StatusServiceUnavailable)
            return
        }

        w.WriteHeader(http.StatusOK)
        w.Write([]byte("Ready"))
    }
}
```

## 优雅关闭

### 信号处理

```go
func main() {
    // 创建上下文
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // 创建服务器
    server := &http.Server{
        Addr:    ":8080",
        Handler: router,
    }

    // 启动服务器
    go func() {
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server failed: %v", err)
        }
    }()

    // 等待中断信号
    quit := make(chan os.Signal, 1)
    signal.Notify(quit,
        syscall.SIGINT,
        syscall.SIGTERM,
    )
    <-quit

    log.Println("Shutting down server...")

    // 优雅关闭
    shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer shutdownCancel()

    if err := server.Shutdown(shutdownCtx); err != nil {
        log.Printf("Server forced to shutdown: %v", err)
    }

    log.Println("Server exited")
}
```

### 连接清理

```go
func (app *App) Shutdown(ctx context.Context) error {
    var errs []error

    // 关闭 HTTP 服务器
    if err := app.server.Shutdown(ctx); err != nil {
        errs = append(errs, fmt.Errorf("server shutdown: %w", err))
    }

    // 关闭数据库连接
    if err := app.db.Close(); err != nil {
        errs = append(errs, fmt.Errorf("db close: %w", err))
    }

    // 关闭 Redis 连接
    if err := app.redis.Close(); err != nil {
        errs = append(errs, fmt.Errorf("redis close: %w", err))
    }

    if len(errs) > 0 {
        return fmt.Errorf("shutdown errors: %v", errs)
    }

    return nil
}
```

## 监控和指标

### Prometheus 指标

```go
import "github.com/prometheus/client_golang/prometheus"

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "path", "status"},
    )

    httpRequestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "path"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
    prometheus.MustRegister(httpRequestDuration)
}

// 中间件
func MetricsMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()

        c.Next()

        duration := time.Since(start).Seconds()
        status := strconv.Itoa(c.Writer.Status())

        httpRequestsTotal.WithLabelValues(
            c.Request.Method,
            c.FullPath(),
            status,
        ).Inc()

        httpRequestDuration.WithLabelValues(
            c.Request.Method,
            c.FullPath(),
        ).Observe(duration)
    }
}
```

### 结构化日志

```go
func (app *App) logRequest(handler http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        // 包装 ResponseWriter 以捕获状态码
        wrapped := &responseWriter{ResponseWriter: w, status: 200}

        // 处理请求
        handler.ServeHTTP(wrapped, r)

        // 记录请求
        duration := time.Since(start)

        app.logger.Info("Request completed",
            zap.String("method", r.Method),
            zap.String("path", r.URL.Path),
            zap.Int("status", wrapped.status),
            zap.Duration("duration", duration),
            zap.String("ip", r.RemoteAddr),
            zap.String("user_agent", r.UserAgent()),
        )
    })
}

type responseWriter struct {
    http.ResponseWriter
    status int
}

func (w *responseWriter) WriteHeader(status int) {
    w.status = status
    w.ResponseWriter.WriteHeader(status)
}
```

## 最佳实践

::: tip 部署建议

1. **多阶段构建** - 减小最终镜像大小
2. **健康检查** - liveness 和 readiness probes
3. **优雅关闭** - 正确处理信号和清理
4. **资源限制** - 设置合理的 requests 和 limits
5. **监控指标** - 收集关键业务指标

:::

```go
// ✅ 好的模式
func gracefulShutdown() {
    // 捕获信号
    sigChan := make(chan os.Signal, 1)
    signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

    // 等待信号
    <-sigChan

    // 优雅关闭
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := server.Shutdown(ctx); err != nil {
        log.Printf("Shutdown error: %v", err)
    }
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **Docker** - 多阶段构建减小镜像 |
| **CI/CD** - 自动化测试和部署 |
| **K8s** - Deployment、Service、ConfigMap |
| **健康检查** - liveness 和 readiness |
| **优雅关闭** - 正确处理信号 |

::: v-pre

[测试策略](./testing.md) → [Web开发](/langs/go/12-web/)

:::
