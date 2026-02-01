---
title: 微服务应用
icon: ri:apps-2-line
order: 5
---

# 微服务应用

一个完整的微服务架构应用，综合运用所有知识。

## 项目概述

### 功能需求

- 用户服务
- 订单服务
- 产品服务
- API网关
- 服务发现

### 技术栈

```
框架: gRPC/Gin
服务发现: Consul
配置: etcd
数据库: MySQL/Redis
容器: Docker
编排: Kubernetes
```

## 项目结构

```
microservices-app/
├── services/
│   ├── user-service/
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── api/
│   │   └── Dockerfile
│   ├── order-service/
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── api/
│   │   └── Dockerfile
│   ├── product-service/
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── api/
│   │   └── Dockerfile
│   └── api-gateway/
│       ├── cmd/
│       ├── internal/
│       ├── config/
│       └── Dockerfile
├── proto/
│   ├── user.proto
│   ├── order.proto
│   └── product.proto
├── deploy/
│   ├── docker-compose.yml
│   └── k8s/
├── configs/
│   └── ...
└── go.work
```

## 服务定义

### Proto定义

```protobuf
// proto/user.proto
syntax = "proto3";

package user;

service UserService {
    rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
    rpc GetUser(GetUserRequest) returns (GetUserResponse);
    rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
    rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
}

message CreateUserRequest {
    string username = 1;
    string email = 2;
    string password = 3;
}

message CreateUserResponse {
    User user = 1;
}

message GetUserRequest {
    string user_id = 1;
}

message GetUserResponse {
    User user = 1;
}

message User {
    string id = 1;
    string username = 2;
    string email = 3;
    int64 created_at = 4;
}

// proto/order.proto
syntax = "proto3";

package order;

service OrderService {
    rpc CreateOrder(CreateOrderRequest) returns (CreateOrderResponse);
    rpc GetOrder(GetOrderRequest) returns (GetOrderResponse);
    rpc ListUserOrders(ListUserOrdersRequest) returns (ListUserOrdersResponse);
    rpc UpdateOrderStatus(UpdateOrderStatusRequest) returns (UpdateOrderStatusResponse);
}

message CreateOrderRequest {
    string user_id = 1;
    repeated OrderItem items = 2;
}

message OrderItem {
    string product_id = 1;
    int32 quantity = 2;
    double price = 3;
}

message CreateOrderResponse {
    Order order = 1;
}

message Order {
    string id = 1;
    string user_id = 2;
    repeated OrderItem items = 3;
    double total_amount = 4;
    string status = 5;
    int64 created_at = 6;
}
```

## 用户服务

### 服务实现

```go
// services/user-service/internal/service/user_service.go
package service

import (
    "context"
    "time"
)

type UserService struct {
    repo   UserRepository
    logger *zap.Logger
}

func NewUserService(repo UserRepository, logger *zap.Logger) *UserService {
    return &UserService{
        repo:   repo,
        logger: logger,
    }
}

func (s *UserService) CreateUser(ctx context.Context, req *CreateUserRequest) (*User, error) {
    // 检查用户是否已存在
    if exists, err := s.repo.FindByEmail(ctx, req.Email); err == nil && exists != nil {
        return nil, status.Error(codes.AlreadyExists, "user already exists")
    }

    // 创建用户
    user := &User{
        ID:        generateUserID(),
        Username:  req.Username,
        Email:     req.Email,
        Password:  hashPassword(req.Password),
        CreatedAt: time.Now().Unix(),
    }

    if err := s.repo.Save(ctx, user); err != nil {
        s.logger.Error("Failed to save user",
            zap.String("email", req.Email),
            zap.Error(err))
        return nil, status.Error(codes.Internal, "failed to create user")
    }

    return user, nil
}

func (s *UserService) GetUser(ctx context.Context, userID string) (*User, error) {
    user, err := s.repo.FindByID(ctx, userID)
    if err != nil {
        if err == ErrUserNotFound {
            return nil, status.Error(codes.NotFound, "user not found")
        }
        return nil, status.Error(codes.Internal, "failed to get user")
    }

    return user, nil
}
```

### gRPC服务器

```go
// services/user-service/cmd/server/main.go
package main

type server struct {
    pb.UnimplementedUserServiceServer
    userService *UserService
}

func (s *server) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.CreateUserResponse, error) {
    user, err := s.userService.CreateUser(ctx, &CreateUserRequest{
        Username: req.Username,
        Email:    req.Email,
        Password: req.Password,
    })

    if err != nil {
        return nil, err
    }

    return &pb.CreateUserResponse{
        User: &pb.User{
            Id:        user.ID,
            Username:  user.Username,
            Email:     user.Email,
            CreatedAt: user.CreatedAt,
        },
    }, nil
}

func main() {
    // 1. 初始化依赖
    db := initDB()
    logger := initLogger()

    // 2. 初始化服务
    userRepo := NewUserRepository(db)
    userService := NewUserService(userRepo, logger)

    // 3. 创建gRPC服务器
    s := grpc.NewServer()

    pb.RegisterUserServiceServer(s, &server{
        userService: userService,
    })

    // 4. 注册服务发现
    registerService("user-service", "localhost:50051")

    // 5. 启动服务器
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("Failed to listen: %v", err)
    }

    log.Println("User service starting on :50051")

    if err := s.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
```

## 订单服务

### 服务实现

```go
// services/order-service/internal/service/order_service.go
package service

type OrderService struct {
    repo         OrderRepository
    userClient   UserClient
    productClient ProductClient
    logger       *zap.Logger
}

func NewOrderService(
    repo OrderRepository,
    userClient UserClient,
    productClient ProductClient,
    logger *zap.Logger,
) *OrderService {
    return &OrderService{
        repo:         repo,
        userClient:   userClient,
        productClient: productClient,
        logger:       logger,
    }
}

func (s *OrderService) CreateOrder(ctx context.Context, req *CreateOrderRequest) (*Order, error) {
    // 1. 验证用户
    user, err := s.userClient.GetUser(ctx, req.UserID)
    if err != nil {
        return nil, status.Error(codes.NotFound, "user not found")
    }

    // 2. 验证产品和价格
    var totalAmount float64
    for i, item := range req.Items {
        product, err := s.productClient.GetProduct(ctx, item.ProductID)
        if err != nil {
            return nil, status.Error(codes.NotFound, fmt.Sprintf("product %s not found", item.ProductID))
        }

        // 验证价格
        if product.Price != item.Price {
            return nil, status.Error(codes.InvalidArgument, "product price mismatch")
        }

        // 验证库存
        if product.Stock < item.Quantity {
            return nil, status.Error(codes.ResourceExhausted, "insufficient stock")
        }

        req.Items[i].Price = product.Price
        totalAmount += float64(item.Quantity) * product.Price
    }

    // 3. 创建订单
    order := &Order{
        ID:         generateOrderID(),
        UserID:     user.ID,
        Items:      req.Items,
        TotalAmount: totalAmount,
        Status:     "pending",
        CreatedAt:  time.Now().Unix(),
    }

    if err := s.repo.Save(ctx, order); err != nil {
        s.logger.Error("Failed to save order",
            zap.String("order_id", order.ID),
            zap.Error(err))
        return nil, status.Error(codes.Internal, "failed to create order")
    }

    // 4. 发布订单创建事件
    s.publishOrderCreatedEvent(ctx, order)

    return order, nil
}
```

## API网关

### 网关实现

```go
// services/api-gateway/internal/gateway/gateway.go
package gateway

type APIGateway struct {
    userClient    UserClient
    orderClient   OrderClient
    productClient ProductClient
    logger        *zap.Logger
}

func NewAPIGateway(
    userClient UserClient,
    orderClient OrderClient,
    productClient ProductClient,
    logger *zap.Logger,
) *APIGateway {
    return &APIGateway{
        userClient:    userClient,
        orderClient:   orderClient,
        productClient: productClient,
        logger:        logger,
    }
}

func (g *APIGateway) RegisterRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        // 用户相关
        users := api.Group("/users")
        {
            users.POST("", g.CreateUser)
            users.GET("/:id", g.GetUser)
            users.GET("", g.ListUsers)
        }

        // 产品相关
        products := api.Group("/products")
        {
            products.POST("", g.CreateProduct)
            products.GET("/:id", g.GetProduct)
            products.GET("", g.ListProducts)
        }

        // 订单相关
        orders := api.Group("/orders")
        {
            orders.POST("", g.CreateOrder)
            orders.GET("/:id", g.GetOrder)
            orders.GET("/users/:userId", g.GetUserOrders)
        }
    }
}

func (g *APIGateway) CreateOrder(c *gin.Context) {
    var req CreateOrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    // 从上下文获取用户ID（由认证中间件设置）
    userID := c.GetString("user_id")
    req.UserID = userID

    // 调用订单服务
    order, err := g.orderClient.CreateOrder(c.Request.Context(), &req)
    if err != nil {
        g.logger.Error("Failed to create order",
            zap.String("user_id", userID),
            zap.Error(err))

        c.JSON(500, gin.H{"error": "Failed to create order"})
        return
    }

    c.JSON(201, order)
}
```

### 认证中间件

```go
// services/api-gateway/internal/middleware/auth.go
package middleware

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(401, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        // 移除 Bearer 前缀
        token = strings.TrimPrefix(token, "Bearer ")

        // 验证Token
        claims, err := validateToken(token, jwtSecret)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // 设置用户信息到上下文
        c.Set("user_id", claims.UserID)
        c.Set("user_role", claims.Role)

        c.Next()
    }
}
```

## 服务发现

### Consul注册

```go
// pkg/registry/consul.go
package registry

import (
    "github.com/hashicorp/consul/api"
)

type ConsulRegistry struct {
    client *api.Client
}

func NewConsulRegistry(addr string) (*ConsulRegistry, error) {
    client, err := api.NewClient(&api.Config{
        Address: addr,
    })
    if err != nil {
        return nil, err
    }

    return &ConsulRegistry{client: client}, nil
}

func (r *ConsulRegistry) Register(serviceName, instanceID, address string, port int, healthCheckURL string) error {
    registration := &api.AgentServiceRegistration{
        ID:      instanceID,
        Name:    serviceName,
        Address: address,
        Port:    port,
        Check: &api.AgentServiceCheck{
            HTTP:                           healthCheckURL,
            Interval:                       "10s",
            Timeout:                        "5s",
            DeregisterCriticalServiceAfter: "30s",
        },
    }

    return r.client.Agent().ServiceRegister(registration)
}

func (r *ConsulRegistry) Discover(serviceName string) ([]*api.ServiceEntry, error) {
    services, _, err := r.client.Health().Service(serviceName, "", true, nil)
    if err != nil {
        return nil, err
    }

    return services, nil
}
```

### 服务客户端

```go
// pkg/client/discovery_client.go
package client

type ServiceClient struct {
    registry ServiceRegistry
    balancer LoadBalancer
    logger   *zap.Logger
}

func NewServiceClient(
    registry ServiceRegistry,
    balancer LoadBalancer,
    logger *zap.Logger,
) *ServiceClient {
    return &ServiceClient{
        registry: registry,
        balancer: balancer,
        logger:   logger,
    }
}

func (c *ServiceClient) GetServiceAddress(serviceName string) (string, error) {
    // 从服务发现获取实例
    services, err := c.registry.Discover(serviceName)
    if err != nil {
        return "", err
    }

    if len(services) == 0 {
        return "", fmt.Errorf("no instances found for %s", serviceName)
    }

    // 负载均衡选择
    service := c.balancer.Select(services)

    return fmt.Sprintf("%s:%d", service.Service.Address, service.Service.Port), nil
}
```

## Docker部署

### docker-compose

```yaml
# deploy/docker-compose.yml
version: '3.8'

services:
  consul:
    image: consul:latest
    ports:
      - "8500:8500"
    volumes:
      - consul_data:/consul/data

  etcd:
    image: quay.io/coreos/etcd:latest
    ports:
      - "2379:2379"
    environment:
      - ETCD_ADVERTISE_CLIENT_URLS=http://etcd:2379
      - ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
    volumes:
      - mysql_data:/var/lib/mysql

  user-service:
    build:
      context: ../services/user-service
      dockerfile: Dockerfile
    ports:
      - "50051:50051"
    environment:
      - DB_HOST=mysql
      - CONSUL_ADDR=consul:8500
    depends_on:
      - mysql
      - consul

  order-service:
    build:
      context: ../services/order-service
      dockerfile: Dockerfile
    ports:
      - "50052:50052"
    environment:
      - DB_HOST=mysql
      - CONSUL_ADDR=consul:8500
    depends_on:
      - mysql
      - consul

  product-service:
    build:
      context: ../services/product-service
      dockerfile: Dockerfile
    ports:
      - "50053:50053"
    environment:
      - DB_HOST=mysql
      - CONSUL_ADDR=consul:8500
    depends_on:
      - mysql
      - consul

  api-gateway:
    build:
      context: ../services/api-gateway
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - CONSUL_ADDR=consul:8500
    depends_on:
      - consul

volumes:
  consul_data:
  mysql_data:
```

## Kubernetes部署

### Deployment配置

```yaml
# deploy/k8s/user-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 50051
    targetPort: 50051
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
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
        image: user-service:latest
        ports:
        - containerPort: 50051
        env:
        - name: DB_HOST
          value: mysql-service
        - name: CONSUL_ADDR
          value: consul-service
```

## 监控和追踪

### Prometheus配置

```yaml
# deploy/monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'user-service'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: user-service

  - job_name: 'order-service'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: order-service
```

### Jaeger追踪

```go
// 初始化追踪
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/jaeger"
    "go.opentelemetry.io/otel/sdk/resource"
    tracesdk "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

func initTracer(serviceName string) error {
    // 创建Jaeger导出器
    exp, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint("http://jaeger:14268/api/traces")))
    if err != nil {
        return err
    }

    // 创建资源
    res, err := resource.Merge(
        resource.Default(),
        resource.NewWithAttributes(
            semconv.SchemaURL,
            semconv.ServiceNameKey.String(serviceName),
        ),
    )
    if err != nil {
        return err
    }

    // 创建追踪提供者
    tp := tracesdk.NewTracerProvider(
        tracesdk.WithBatcher(exp),
        tracesdk.WithResource(res),
    )

    otel.SetTracerProvider(tp)

    return nil
}
```

## 最佳实践

::: tip 微服务建议

1. **服务边界** - 按业务领域拆分
2. **API网关** - 统一入口
3. **服务发现** - 动态服务注册
4. **分布式追踪** - 端到端追踪
5. **容器化** - Docker部署

:::

## 总结

| 方面 | 关键点 |
|------|--------|
| **gRPC** - 服务间通信 |
| **服务发现** - Consul注册 |
| **API网关** - 统一入口 |
| **Docker** - 容器化部署 |
| **K8s** - 容器编排 |

::: v-pre

[任务调度器](./task-scheduler.md)

:::
