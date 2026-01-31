---
title: 容器化部署
icon: simple:docker
order: 4
---

# 容器化部署

使用 Docker 容器化 Python 应用，实现一致的开发和部署环境。

## Docker 基础

### Dockerfile 示例

```dockerfile
# 基础镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 运行应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 多阶段构建

```dockerfile
# 构建阶段
FROM python:3.11-slim as builder

WORKDIR /app

# 安装构建依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 安装 Python 依赖到临时目录
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# 运行阶段
FROM python:3.11-slim

WORKDIR /app

# 从构建阶段复制依赖
COPY --from=builder /root/.local /root/.local

# 复制应用代码
COPY . .

# 确保 Python 能找到依赖
ENV PATH=/root/.local/bin:$PATH

# 暴露端口
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 优化镜像大小

```dockerfile
# 使用 alpine 基础镜像
FROM python:3.11-alpine

WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache gcc musl-dev postgresql-dev

# 复制并安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Docker Compose

### 基础配置

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/.venv

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 开发环境配置

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DEBUG=1
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 生产环境配置

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: my-app:1.0.0
    restart: always
    ports:
      - "8000:8000"
    environment:
      - DEBUG=0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres_data:
```

## .dockerignore

```
# Git
.git
.gitignore

# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info
dist
build

# Virtual environments
.venv
venv/
ENV/
env/

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Documentation
docs/
*.md

# Tests
.pytest_cache
.coverage
htmlcov/

# Docker
Dockerfile
docker-compose.yml
.dockerignore
```

## 容器管理

### 构建和运行

```bash
# 构建镜像
docker build -t my-app:1.0.0 .

# 运行容器
docker run -d -p 8000:8000 --name my-app my-app:1.0.0

# 查看日志
docker logs my-app
docker logs -f my-app

# 进入容器
docker exec -it my-app bash

# 停止和删除
docker stop my-app
docker rm my-app

# 删除镜像
docker rmi my-app:1.0.0
```

### Docker Compose 命令

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 删除数据卷
docker-compose down -v

# 构建镜像
docker-compose build

# 重新构建并启动
docker-compose up -d --build
```

## Kubernetes 部署

### Deployment 配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service 配置

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

### ConfigMap 和 Secret

```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DEBUG: "false"
  LOG_LEVEL: "info"

---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  url: "postgresql://user:pass@db:5432/mydb"
```

## 最佳实践

::: tip Docker 建议

1. **使用 .dockerignore**：减少上下文大小
2. **多阶段构建**：减小镜像体积
3. **层缓存**：优化 Dockerfile 层顺序
4. **最小权限**：使用非 root 用户
5. **健康检查**：配置 liveness 和 readiness

::: tip 安全实践

```dockerfile
# 使用非 root 用户
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 创建非 root 用户
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

::: tip 性能优化

```dockerfile
# 合并 RUN 指令
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 利用构建缓存
# 先复制依赖文件，再复制代码
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

::: tip 调试技巧

```bash
# 查看容器日志
docker logs -f --tail 100 my-app

# 实时查看资源使用
docker stats

# 进入运行中的容器
docker exec -it my-app /bin/bash

# 端口映射调试
docker run -p 8000:8000 -p 5678:5678 my-app

# 挂载本地代码
docker run -v $(pwd):/app my-app
```
