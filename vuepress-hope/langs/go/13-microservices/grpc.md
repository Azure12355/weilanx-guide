---
title: gRPC 框架
icon: ri:google-fill
order: 4
---

# gRPC 框架

gRPC 是高性能 RPC 框架，适合微服务间通信。

## Protocol Buffers

### 定义消息

```protobuf
// protos/user.proto
syntax = "proto3";

package user;
option go_package = "./pb";

// 用户服务
service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
}

// 用户消息
message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
  int64 updated_at = 5;
}

// 获取用户请求
message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}

// 列出用户请求
message ListUsersRequest {
  int32 page = 1;
  int32 limit = 2;
}

message ListUsersResponse {
  repeated User users = 1;
  int32 total = 2;
}

// 创建用户请求
message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message CreateUserResponse {
  User user = 1;
}

// 更新用户请求
message UpdateUserRequest {
  string id = 1;
  string name = 2;
  string email = 3;
}

message UpdateUserResponse {
  User user = 1;
}

// 删除用户请求
message DeleteUserRequest {
  string id = 1;
}

message DeleteUserResponse {
  bool success = 1;
}
```

### 编译 Proto

```bash
# 安装 protoc
brew install protobuf

# 安装 Go 插件
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# 生成代码
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    protos/user.proto
```

## gRPC 服务端

### 基础服务

```go
// services/user/server/main.go
package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    "google.golang.org/protobuf/types/known/timestamppb"

    pb "your-module/protos"
)

type UserServer struct {
    pb.UnimplementedUserServiceServer
    repo UserRepository
}

func NewUserServer(repo UserRepository) *UserServer {
    return &UserServer{repo: repo}
}

func (s *UserServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
    user, err := s.repo.FindByID(ctx, req.Id)
    if err != nil {
        return nil, status.Error(codes.NotFound, "user not found")
    }

    return &pb.GetUserResponse{
        User: toProtoUser(user),
    }, nil
}

func (s *UserServer) ListUsers(ctx context.Context, req *pb.ListUsersRequest) (*pb.ListUsersResponse, error) {
    users, total, err := s.repo.List(ctx, req.Page, req.Limit)
    if err != nil {
        return nil, err
    }

    protoUsers := make([]*pb.User, len(users))
    for i, user := range users {
        protoUsers[i] = toProtoUser(user)
    }

    return &pb.ListUsersResponse{
        Users: protoUsers,
        Total: int32(total),
    }, nil
}

func (s *UserServer) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.CreateUserResponse, error) {
    user := &User{
        ID:        uuid.New().String(),
        Name:      req.Name,
        Email:     req.Email,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }

    if err := s.repo.Save(ctx, user); err != nil {
        return nil, err
    }

    return &pb.CreateUserResponse{
        User: toProtoUser(user),
    }, nil
}

func (s *UserServer) UpdateUser(ctx context.Context, req *pb.UpdateUserRequest) (*pb.UpdateUserResponse, error) {
    user, err := s.repo.FindByID(ctx, req.Id)
    if err != nil {
        return nil, status.Error(codes.NotFound, "user not found")
    }

    user.Name = req.Name
    user.Email = req.Email
    user.UpdatedAt = time.Now()

    if err := s.repo.Save(ctx, user); err != nil {
        return nil, err
    }

    return &pb.UpdateUserResponse{
        User: toProtoUser(user),
    }, nil
}

func (s *UserServer) DeleteUser(ctx context.Context, req *pb.DeleteUserRequest) (*pb.DeleteUserResponse, error) {
    if err := s.repo.Delete(ctx, req.Id); err != nil {
        return nil, err
    }

    return &pb.DeleteUserResponse{
        Success: true,
    }, nil
}

func toProtoUser(user *User) *pb.User {
    return &pb.User{
        Id:        user.ID,
        Name:      user.Name,
        Email:     user.Email,
        CreatedAt: timestamppb.New(user.CreatedAt),
        UpdatedAt: timestamppb.New(user.UpdatedAt),
    }
}

func main() {
    // 创建 gRPC 服务器
    server := grpc.NewServer(
        grpc.ChainUnaryInterceptor(
            LoggingInterceptor,
            RecoveryInterceptor,
            AuthInterceptor,
        ),
    )

    // 注册服务
    userServer := NewUserServer(NewUserRepository())
    pb.RegisterUserServiceServer(server, userServer)

    // 启动服务器
    listener, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatal(err)
    }

    log.Println("User service starting on :50051")
    if err := server.Serve(listener); err != nil {
        log.Fatal(err)
    }
}
```

### 拦截器

```go
// 日志拦截器
func LoggingInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    start := time.Now()

    log.Printf("Calling %s", info.FullMethod)

    resp, err := handler(ctx, req)

    duration := time.Since(start)
    log.Printf("Method %s completed in %v", info.FullMethod, duration)

    if err != nil {
        log.Printf("Method %s failed: %v", info.FullMethod, err)
    }

    return resp, err
}

// 恢复拦截器
func RecoveryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
    defer func() {
        if r := recover(); r != nil {
            log.Printf("Panic recovered in %s: %v", info.FullMethod, r)
            err = status.Error(codes.Internal, "internal server error")
        }
    }()

    return handler(ctx, req)
}

// 认证拦截器
func AuthInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    token, err := extractToken(ctx)
    if err != nil {
        return nil, status.Error(codes.Unauthenticated, "missing token")
    }

    claims, err := validateToken(token)
    if err != nil {
        return nil, status.Error(codes.Unauthenticated, "invalid token")
    }

    // 添加用户信息到上下文
    ctx = context.WithValue(ctx, "user_id", claims.UserID)
    ctx = context.WithValue(ctx, "user_role", claims.Role)

    return handler(ctx, req)
}
```

## gRPC 客户端

### 基础客户端

```go
// client/user_client.go
package client

import (
    "context"
    "time"

    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"

    pb "your-module/protos"
)

type UserClient struct {
    client pb.UserServiceClient
    conn   *grpc.ClientConn
}

func NewUserClient(addr string) (*UserClient, error) {
    conn, err := grpc.Dial(addr,
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithChainUnaryInterceptor(
            ClientLoggingInterceptor,
            ClientAuthInterceptor,
        ),
    )
    if err != nil {
        return nil, err
    }

    return &UserClient{
        client: pb.NewUserServiceClient(conn),
        conn:   conn,
    }, nil
}

func (c *UserClient) GetUser(ctx context.Context, id string) (*pb.User, error) {
    req := &pb.GetUserRequest{Id: id}
    resp, err := c.client.GetUser(ctx, req)
    if err != nil {
        return nil, err
    }
    return resp.User, nil
}

func (c *UserClient) ListUsers(ctx context.Context, page, limit int) ([]*pb.User, int32, error) {
    req := &pb.ListUsersRequest{
        Page:  int32(page),
        Limit: int32(limit),
    }
    resp, err := c.client.ListUsers(ctx, req)
    if err != nil {
        return nil, 0, err
    }
    return resp.Users, resp.Total, nil
}

func (c *UserClient) CreateUser(ctx context.Context, name, email string) (*pb.User, error) {
    req := &pb.CreateUserRequest{
        Name:  name,
        Email: email,
    }
    resp, err := c.client.CreateUser(ctx, req)
    if err != nil {
        return nil, err
    }
    return resp.User, nil
}

func (c *UserClient) Close() error {
    return c.conn.Close()
}
```

### 客户端拦截器

```go
// 客户端日志拦截器
func ClientLoggingInterceptor(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
    start := time.Now()

    log.Printf("Calling %s", method)

    err := invoker(ctx, method, req, reply, cc, opts...)

    duration := time.Since(start)
    log.Printf("Method %s completed in %v", method, duration)

    if err != nil {
        log.Printf("Method %s failed: %v", method, err)
    }

    return err
}

// 客户端认证拦截器
func ClientAuthInterceptor(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
    token := getTokenFromContext(ctx)

    return invoker(ctx, method, req, reply, cc, append(opts, grpc.PerRPCCredentials(tokenProvider{token: token}))...)
}

type tokenProvider struct {
    token string
}

func (t tokenProvider) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
    return map[string]string{
        "authorization": "Bearer " + t.token,
    }, nil
}

func (t tokenProvider) RequireTransportSecurity() bool {
    return false
}
```

## 流式 RPC

### 服务端流

```protobuf
service NotificationService {
  rpc StreamNotifications(StreamRequest) returns (stream Notification);
}

message Notification {
  string id = 1;
  string message = 2;
  int64 timestamp = 3;
}
```

```go
func (s *NotificationServer) StreamNotifications(req *pb.StreamRequest, stream pb.NotificationService_StreamNotificationsServer) error {
    userID := req.UserId

    // 持续发送通知
    ticker := time.NewTicker(1 * time.Second)
    defer ticker.Stop()

    for i := 0; ; i++ {
        select {
        case <-ticker.C:
            notification := &pb.Notification{
                Id:        uuid.New().String(),
                Message:   fmt.Sprintf("Notification %d for user %s", i, userID),
                Timestamp: time.Now().Unix(),
            }

            if err := stream.Send(notification); err != nil {
                return err
            }

        case <-stream.Context().Done():
            return nil
        }
    }
}
```

### 客户端流

```go
func (s *UploadService) UploadData(stream pb.UploadService_UploadDataServer) error {
    var receivedSize int64

    for {
        req, err := stream.Recv()
        if err == io.EOF {
            // 完成上传
            return stream.SendAndClose(&pb.UploadResponse{
                Size:     receivedSize,
                Filename: req.Filename,
            })
        }
        if err != nil {
            return err
        }

        receivedSize += int64(len(req.Data))
        log.Printf("Received chunk: %d bytes", len(req.Data))
    }
}
```

### 双向流

```go
func (s *ChatService) Chat(stream pb.ChatService_ChatServer) error {
    for {
        req, err := stream.Recv()
        if err == io.EOF {
            return nil
        }
        if err != nil {
            return err
        }

        // 处理消息
        resp := &pb.ChatMessage{
            User:      "Server",
            Message:   fmt.Sprintf("Echo: %s", req.Message),
            Timestamp: time.Now().Unix(),
        }

        if err := stream.Send(resp); err != nil {
            return err
        }
    }
}
```

## 最佳实践

::: tip gRPC 使用建议

1. **定义清晰** - Proto 定义要有清晰注释
2. **错误处理** - 使用 status.Error 返回错误
3. **拦截器** - 处理横切关注点
4. **流式处理** - 大数据传输使用流式
5. **超时控制** - 设置合理的超时时间

:::

```go
// ✅ 好的 gRPC 模式
func goodGRPCServer() {
    // 1. 创建带拦截器的服务器
    server := grpc.NewServer(
        grpc.ChainUnaryInterceptor(
            LoggingInterceptor,
            RecoveryInterceptor,
        ),
    )

    // 2. 注册服务
    pb.RegisterUserServiceServer(server, NewUserServer())

    // 3. 启动服务
    listener, _ := net.Listen("tcp", ":50051")
    server.Serve(listener)
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **Proto** - Protocol Buffers 定义 |
| **服务端** - Unary 和流式 RPC |
| **客户端** - 连接和调用 |
| **拦截器** - 中间件模式 |
| **流式** - 服务端、客户端、双向流 |

::: v-pre

[架构设计](./architecture.md) → [服务发现](./service-discovery.md)

:::
