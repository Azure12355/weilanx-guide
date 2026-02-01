---
title: 部署实践
icon: ri:ship-line
order: 9
---

# 部署实践

微服务部署需要考虑容器化、编排、持续集成等。

## Docker 容器化

### Dockerfile

```dockerfile
# 服务 Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 安装依赖
COPY go.mod go.sum ./
RUN go mod download

# 复制源码
COPY . .

# 编译
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 运行阶段
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 复制二进制文件
COPY --from=builder /app/main .

# 暴露端口
EXPOSE 8080

# 运行
CMD ["./main"]
```

### 多阶段构建

```dockerfile
# 开发环境
FROM golang:1.21-alpine AS dev

WORKDIR /app

# 安装空气
RUN go install github.com/cosmtrek/air@latest

COPY . .

CMD ["air"]

# 测试环境
FROM golang:1.21-alpine AS test

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go test -v ./...

# 生产环境
FROM golang:1.21-alpine AS production

WORKDIR /app

# 编译
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .

# 最小化镜像
FROM scratch

COPY --from=production /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=production /app/main .

EXPOSE 8080

CMD ["./main"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  # API 网关
  gateway:
    build: ./services/gateway
    ports:
      - "8080:8080"
    environment:
      - USER_SERVICE_URL=http://user-service:8001
      - ORDER_SERVICE_URL=http://order-service:8002
    depends_on:
      - user-service
      - order-service

  # 用户服务
  user-service:
    build: ./services/user
    ports:
      - "8001:8001"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=userdb
      - REDIS_URL=redis:6379
    depends_on:
      - mysql
      - redis
    restart: on-failure

  # 订单服务
  order-service:
    build: ./services/order
    ports:
      - "8002:8002"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=orderdb
      - USER_SERVICE_URL=http://user-service:8001
    depends_on:
      - mysql
      - user-service
    restart: on-failure

  # MySQL
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=appdb
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=guest
      - RABBITMQ_DEFAULT_PASS=guest

  # Jaeger
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "9411:9411"

volumes:
  mysql-data:
  redis-data:
```

## Kubernetes 部署

### Deployment

```yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: your-registry/user-service:latest
        ports:
        - containerPort: 8001
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db.host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db.password
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 10
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /ready
            port: 8001
          initialDelaySeconds: 5
          periodSeconds: 3
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - protocol: TCP
    port: 8001
    targetPort: 8001
  type: ClusterIP
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  db.host: "mysql"
  db.port: "3306"
  redis.url: "redis:6379"
  jaeger.endpoint: "http://jaeger:14268/api/traces"
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  db.password: cm9vdHBhc3N3b3Jk  # base64 encoded
  jwt.secret: and0LXNlY3JldC1rZXk=
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gateway
            port:
              number: 8080
```

### HPA (Horizontal Pod Autoscaler)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## CI/CD 流程

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.21'

    - name: Run tests
      run: |
        go test -v -race -coverprofile=coverage.out ./...
        go tool cover -func=coverage.out

    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
    - uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v4
      with:
        manifests: |
          k8s/user-service-deployment.yaml
          k8s/order-service-deployment.yaml
          k8s/gateway-deployment.yaml
        images: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_REGISTRY: registry.gitlab.com
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

test:
  stage: test
  image: golang:1.21
  script:
    - go test -v -race -coverprofile=coverage.out ./...
    - go tool cover -func=coverage.out

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
    - docker tag $IMAGE_TAG $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest

deploy:staging:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/user-service user-service=$IMAGE_TAG
    - kubectl rollout status deployment/user-service
  environment:
    name: staging
  only:
    - develop

deploy:production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/user-service user-service=$IMAGE_TAG
    - kubectl rollout status deployment/user-service
  environment:
    name: production
  when: manual
  only:
    - main
```

## 配置管理

### Viper

```go
import "github.com/spf13/viper"

type Config struct {
    Server   ServerConfig   `mapstructure:"server"`
    Database DatabaseConfig `mapstructure:"database"`
    Redis    RedisConfig    `mapstructure:"redis"`
    Jaeger   JaegerConfig   `mapstructure:"jaeger"`
}

type ServerConfig struct {
    Host string `mapstructure:"host"`
    Port int    `mapstructure:"port"`
}

type DatabaseConfig struct {
    Host     string `mapstructure:"host"`
    Port     int    `mapstructure:"port"`
    User     string `mapstructure:"user"`
    Password string `mapstructure:"password"`
    Name     string `mapstructure:"name"`
}

func LoadConfig(path string) (*Config, error) {
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath(path)

    // 环境变量
    viper.AutomaticEnv()
    viper.SetEnvPrefix("APP")
    viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

    if err := viper.ReadInConfig(); err != nil {
        return nil, err
    }

    var config Config
    if err := viper.Unmarshal(&config); err != nil {
        return nil, err
    }

    return &config, nil
}
```

### 配置文件

```yaml
# config.yaml
server:
  host: "0.0.0.0"
  port: 8001

database:
  host: "localhost"
  port: 3306
  user: "root"
  password: "password"
  name: "userdb"

redis:
  url: "localhost:6379"
  password: ""
  db: 0

jaeger:
  endpoint: "http://localhost:14268/api/traces"
```

## 健康检查

### 健康检查端点

```go
type HealthChecker struct {
    db    *sql.DB
    redis *redis.Client
}

func (h *HealthChecker) CheckHealth() map[string]string {
    health := make(map[string]string)

    // 检查数据库
    if err := h.db.Ping(); err != nil {
        health["database"] = "unhealthy: " + err.Error()
    } else {
        health["database"] = "healthy"
    }

    // 检查 Redis
    if err := h.redis.Ping(context.Background()).Err(); err != nil {
        health["redis"] = "unhealthy: " + err.Error()
    } else {
        health["redis"] = "healthy"
    }

    // 检查依赖服务
    if err := h.checkUserService(); err != nil {
        health["user_service"] = "unhealthy: " + err.Error()
    } else {
        health["user_service"] = "healthy"
    }

    return health
}

func (h *HealthChecker) IsHealthy() bool {
    for _, status := range h.CheckHealth() {
        if !strings.Contains(status, "healthy") {
            return false
        }
    }
    return true
}

// HTTP 端点
func (h *HealthChecker) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    health := h.CheckHealth()

    status := http.StatusOK
    if !h.IsHealthy() {
        status = http.StatusServiceUnavailable
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(health)
}
```

## 日志聚合

### 结构化日志

```go
import "go.uber.org/zap"

type Logger struct {
    *zap.SugaredLogger
}

func NewLogger(serviceName string) *Logger {
    logger, _ := zap.NewProduction()
    defer logger.Sync()

    return &Logger{
        SugaredLogger: logger.With(
            zap.String("service", serviceName),
        ).Sugar(),
    }
}

func (l *Logger) LogRequest(method, path string, duration time.Duration) {
    l.Infow("request",
        "method", method,
        "path", path,
        "duration", duration,
    )
}

func (l *Logger) LogError(err error, msg string, fields ...interface{}) {
    l.Errorw(msg,
        append([]interface{}{"error", err}, fields...)...,
    )
}
```

## 最佳实践

::: tip 部署建议

1. **容器化** - 使用多阶段构建减小镜像
2. **编排** - 使用 Kubernetes 自动扩展
3. **配置管理** - 配置与代码分离
4. **健康检查** - 实现活跃和就绪探针
5. **日志聚合** - 集中式日志管理

:::

```go
// ✅ 好的部署模式
func deploymentMain() {
    // 1. 加载配置
    config := LoadConfig(".")
    logger := NewLogger(config.ServiceName)

    // 2. 初始化依赖
    db := ConnectDB(config.Database)
    redis := ConnectRedis(config.Redis)

    // 3. 初始化服务
    service := NewService(db, redis, logger)

    // 4. 健康检查
    health := NewHealthChecker(db, redis)
    http.Handle("/health", health)

    // 5. 启动服务
    server := NewServer(config.Server, service, logger)
    logger.Infof("Starting %s on %s:%d",
        config.ServiceName,
        config.Server.Host,
        config.Server.Port,
    )

    if err := server.Start(); err != nil {
        logger.Fatalw("server failed", "error", err)
    }
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **Docker** | 多阶段构建、镜像优化 |
| **Kubernetes** | Deployment、Service、Ingress |
| **CI/CD** | 自动化构建、测试、部署 |
| **配置管理** | Viper、环境变量 |
| **健康检查** | 活跃探针、就绪探针 |

::: v-pre

[链路追踪](./tracing.md) → [实战项目](/langs/go/14-practice/)

:::
