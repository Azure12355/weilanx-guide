---
title: Docker部署
icon: ri:docker-line
order: 6
---

# Docker 部署

使用 Docker 容器化 Go 应用，简化部署和运维。

## Dockerfile

### 多阶段构建

```dockerfile
# 构建阶段
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

### 最小化镜像

```dockerfile
# 使用 distroless 镜像
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o myapp ./cmd/myapp

# distroless 更小更安全
FROM gcr.io/distroless/static-debian11

COPY --from=builder /app/myapp /myapp
COPY --from=builder /app/configs /configs

EXPOSE 8080

ENTRYPOINT ["/myapp"]
```

## Docker Compose

### 基本配置

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

### 开发环境

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      target: builder
    volumes:
      - .:/app
    ports:
      - "8080:8080"
    environment:
      - APP_ENV=development
    command: go run ./cmd/myapp
```

## 构建优化

### 依赖缓存

```dockerfile
# ✅ 利用 Docker 层缓存
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 先复制依赖文件，利用缓存
COPY go.mod go.sum ./
RUN go mod download

# 再复制源码
COPY . .

# 构建
RUN CGO_ENABLED=0 go build -o myapp ./cmd/myapp
```

### 并行构建

```dockerfile
# 并行下载和编译
RUN go mod download && \
    go build -ldflags="-s -w" -o myapp ./cmd/myapp
```

## 健康检查

### Dockerfile 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
```

### Compose 健康检查

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 最佳实践

::: tip Docker 建议

1. **多阶段构建** - 减小镜像大小
2. **非 root 用户** - 提高安全性
3. **健康检查** - 监控应用状态
4. **资源限制** - 防止资源耗尽
5. **日志配置** - 使用 stdout/stderr

:::

```dockerfile
# ✅ 好的模式
FROM golang:1.21-alpine AS builder
# ... 构建逻辑 ...

FROM alpine:latest
RUN adduser -D -u 1000 appuser
USER appuser
# ... 运行配置 ...
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **多阶段** | 减小最终镜像大小 |
| **alpine** | 使用轻量级基础镜像 |
| **健康检查** | 监控应用状态 |
| **非 root** | 提高安全性 |
| **日志** | 输出到标准输出 |

::: v-pre

[代码规范](./code-style.md) → [部署运维](./deployment.md)

:::
