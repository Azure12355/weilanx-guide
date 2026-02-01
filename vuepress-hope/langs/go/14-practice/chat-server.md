---
title: 聊天服务器
icon: ri:chat-smile-2-line
order: 3
---

# 聊天服务器

一个实时聊天服务器，学习并发编程和 WebSocket。

## 项目概述

### 功能需求

- 实时消息通信
- 多房间支持
- 用户认证
- 在线状态
- 消息历史

### 技术栈

```
WebSocket: gorilla/websocket
并发: Goroutine/Channel
存储: Redis
认证: JWT
日志: Zap
```

## 项目结构

```
chat-server/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── hub/
│   │   └── hub.go
│   ├── client/
│   │   └── client.go
│   ├── message/
│   │   └── message.go
│   ├── auth/
│   │   └── jwt.go
│   └── room/
│       └── room.go
├── pkg/
│   └── websocket/
│       └── upgrader.go
├── configs/
│   └── config.yaml
└── go.mod
```

## Hub 设计

### Hub 结构

```go
// internal/hub/hub.go
package hub

import (
    "log"
)

type Hub struct {
    // 注册的客户端
    clients map[*Client]bool

    // 按房间组织的客户端
    rooms map[string]map[*Client]bool

    // 入站消息
    broadcast chan *Message

    // 注册请求
    register chan *Client

    // 注销请求
    unregister chan *Client

    // 房间管理
    join  chan *RoomOperation
    leave chan *RoomOperation
}

type RoomOperation struct {
    Client *Client
    RoomID string
}

func NewHub() *Hub {
    return &Hub{
        clients:   make(map[*Client]bool),
        rooms:     make(map[string]map[*Client]bool),
        broadcast: make(chan *Message, 256),
        register:  make(chan *Client),
        unregister: make(chan *Client),
        join:      make(chan *RoomOperation),
        leave:     make(chan *RoomOperation),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.registerClient(client)

        case client := <-h.unregister:
            h.unregisterClient(client)

        case message := <-h.broadcast:
            h.handleBroadcast(message)

        case op := <-h.join:
            h.joinRoom(op)

        case op := <-h.leave:
            h.leaveRoom(op)
        }
    }
}

func (h *Hub) registerClient(client *Client) {
    h.clients[client] = true
    log.Printf("Client registered: %s", client.ID)

    // 发送欢迎消息
    client.Send <- &Message{
        Type:    "system",
        Content: "Welcome to the chat server!",
    }
}

func (h *Hub) unregisterClient(client *Client) {
    if _, ok := h.clients[client]; ok {
        delete(h.clients, client)
        close(client.Send)

        // 从所有房间移除
        for roomID := range client.Rooms {
            h.leaveRoom(&RoomOperation{
                Client: client,
                RoomID: roomID,
            })
        }

        log.Printf("Client unregistered: %s", client.ID)
    }
}

func (h *Hub) joinRoom(op *RoomOperation) {
    room, exists := h.rooms[op.RoomID]
    if !exists {
        room = make(map[*Client]bool)
        h.rooms[op.RoomID] = room
    }

    room[op.Client] = true
    op.Client.Rooms[op.RoomID] = true

    log.Printf("Client %s joined room %s", op.Client.ID, op.RoomID)

    // 通知房间成员
    h.broadcastToRoom(op.RoomID, &Message{
        Type:    "system",
        Content: fmt.Sprintf("%s joined the room", op.Client.Nickname),
        RoomID:  op.RoomID,
    }, op.Client)
}

func (h *Hub) leaveRoom(op *RoomOperation) {
    if room, exists := h.rooms[op.RoomID]; exists {
        delete(room, op.Client)
        delete(op.Client.Rooms, op.RoomID)

        // 如果房间为空，删除房间
        if len(room) == 0 {
            delete(h.rooms, op.RoomID)
        }

        log.Printf("Client %s left room %s", op.Client.ID, op.RoomID)

        h.broadcastToRoom(op.RoomID, &Message{
            Type:    "system",
            Content: fmt.Sprintf("%s left the room", op.Client.Nickname),
            RoomID:  op.RoomID,
        })
    }
}

func (h *Hub) handleBroadcast(message *Message) {
    if message.RoomID == "" {
        // 广播给所有客户端
        for client := range h.clients {
            select {
            case client.Send <- message:
            default:
                h.unregister <- client
            }
        }
    } else {
        // 广播给指定房间
        h.broadcastToRoom(message.RoomID, message)
    }
}

func (h *Hub) broadcastToRoom(roomID string, message *Message, exclude ...*Client) {
    room, exists := h.rooms[roomID]
    if !exists {
        return
    }

    excluded := make(map[*Client]bool)
    for _, client := range exclude {
        excluded[client] = true
    }

    for client := range room {
        if excluded[client] {
            continue
        }

        select {
        case client.Send <- message:
        default:
            h.unregister <- client
        }
    }
}
```

## 客户端管理

### Client 结构

```go
// internal/client/client.go
package client

import (
    "log"
    "sync"

    "github.com/gorilla/websocket"
)

type Client struct {
    Hub     *Hub
    ID      string
    Conn    *websocket.Conn
    Send    chan *Message
    Rooms   map[string]bool
    mu      sync.RWMutex

    // 用户信息
    UserID   string
    Nickname string
}

func NewClient(hub *Hub, conn *websocket.Conn, userID, nickname string) *Client {
    return &Client{
        Hub:      hub,
        ID:       generateClientID(),
        Conn:     conn,
        Send:     make(chan *Message, 256),
        Rooms:    make(map[string]bool),
        UserID:   userID,
        Nickname: nickname,
    }
}

func (c *Client) ReadPump() {
    defer func() {
        c.Hub.unregister <- c
        c.Conn.Close()
    }()

    c.Conn.SetReadLimit(512)
    c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
    c.Conn.SetPongHandler(func(string) error {
        c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
        return nil
    })

    for {
        _, message, err := c.Conn.ReadMessage()
        if err != nil {
            if websocket.IsUnexpectedCloseError(err,
                websocket.CloseGoingAway,
                websocket.CloseAbnormalClosure) {
                log.Printf("Unexpected close: %v", err)
            }
            break
        }

        // 处理消息
        c.handleMessage(message)
    }
}

func (c *Client) WritePump() {
    ticker := time.NewTicker(54 * time.Second)
    defer func() {
        ticker.Stop()
        c.Conn.Close()
    }()

    for {
        select {
        case message, ok := <-c.Send:
            c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
            if !ok {
                c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
                return
            }

            data, err := json.Marshal(message)
            if err != nil {
                log.Printf("Failed to marshal message: %v", err)
                continue
            }

            if err := c.Conn.WriteMessage(websocket.TextMessage, data); err != nil {
                return
            }

        case <-ticker.C:
            c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
            if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
                return
            }
        }
    }
}

func (c *Client) handleMessage(data []byte) {
    var msg Message
    if err := json.Unmarshal(data, &msg); err != nil {
        log.Printf("Failed to unmarshal message: %v", err)
        return
    }

    msg.SenderID = c.UserID
    msg.SenderName = c.Nickname
    msg.Timestamp = time.Now()

    switch msg.Type {
    case "chat":
        c.Hub.broadcast <- &msg

    case "join":
        c.Hub.join <- &RoomOperation{
            Client: c,
            RoomID: msg.RoomID,
        }

    case "leave":
        c.Hub.leave <- &RoomOperation{
            Client: c,
            RoomID: msg.RoomID,
        }

    case "users":
        c.handleUsersQuery(msg.RoomID)

    default:
        log.Printf("Unknown message type: %s", msg.Type)
    }
}

func (c *Client) handleUsersQuery(roomID string) {
    // 获取房间内用户列表
    users := c.Hub.GetUsersInRoom(roomID)

    c.Send <- &Message{
        Type:      "users",
        RoomID:    roomID,
        Users:     users,
        Timestamp: time.Now(),
    }
}
```

## 消息处理

### 消息类型

```go
// internal/message/message.go
package message

import "time"

type Message struct {
    ID         string    `json:"id"`
    Type       string    `json:"type"`
    Content    string    `json:"content"`
    RoomID     string    `json:"room_id,omitempty"`
    SenderID   string    `json:"sender_id,omitempty"`
    SenderName string    `json:"sender_name,omitempty"`
    Timestamp  time.Time `json:"timestamp"`
    Users      []*UserInfo `json:"users,omitempty"`
}

type UserInfo struct {
    ID       string `json:"id"`
    Nickname string `json:"nickname"`
}

func NewMessage(msgType, content, roomID string) *Message {
    return &Message{
        ID:        generateMessageID(),
        Type:      msgType,
        Content:   content,
        RoomID:    roomID,
        Timestamp: time.Now(),
    }
}
```

## HTTP 处理器

### WebSocket 端点

```go
// cmd/server/main.go
package main

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true // 生产环境应该验证来源
    },
}

func serveWS(hub *Hub, w http.ResponseWriter, r *http.Request) {
    // 获取认证信息
    token := r.URL.Query().Get("token")
    if token == "" {
        http.Error(w, "Missing token", http.StatusUnauthorized)
        return
    }

    // 验证 Token
    claims, err := validateToken(token)
    if err != nil {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    // 升级到 WebSocket
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Printf("WebSocket upgrade failed: %v", err)
        return
    }

    // 创建客户端
    client := NewClient(hub, conn, claims.UserID, claims.Nickname)

    // 注册客户端
    hub.register <- client

    // 启动读写循环
    go client.WritePump()
    go client.ReadPump()
}
```

### HTTP 路由

```go
func setupRoutes(hub *Hub) *http.ServeMux {
    mux := http.NewServeMux()

    // WebSocket 端点
    mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        serveWS(hub, w, r)
    })

    // REST API
    mux.HandleFunc("/api/rooms", handleListRooms(hub))
    mux.HandleFunc("/api/rooms/", handleRoomInfo(hub))

    // 静态文件
    mux.Handle("/", http.FileServer(http.Dir("./static")))

    return mux
}

func handleListRooms(hub *Hub) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        rooms := hub.GetAllRooms()

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(rooms)
    }
}

func handleRoomInfo(hub *Hub) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        roomID := strings.TrimPrefix(r.URL.Path, "/api/rooms/")

        room, exists := hub.GetRoom(roomID)
        if !exists {
            http.Error(w, "Room not found", http.StatusNotFound)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(room)
    }
}
```

## 认证系统

### JWT 处理

```go
// internal/auth/jwt.go
package auth

import (
    "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
    UserID   string `json:"user_id"`
    Nickname string `json:"nickname"`
    jwt.RegisteredClaims
}

type AuthService struct {
    secretKey []byte
}

func NewAuthService(secret string) *AuthService {
    return &AuthService{
        secretKey: []byte(secret),
    }
}

func (a *AuthService) GenerateToken(userID, nickname string) (string, error) {
    claims := Claims{
        UserID:   userID,
        Nickname: nickname,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(a.secretKey)
}

func (a *AuthService) ValidateToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method")
        }
        return a.secretKey, nil
    })

    if err != nil {
        return nil, err
    }

    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }

    return nil, fmt.Errorf("invalid token")
}
```

## 主程序

```go
// cmd/server/main.go
package main

func main() {
    // 1. 加载配置
    config := loadConfig()

    // 2. 初始化 Hub
    hub := NewHub()
    go hub.Run()

    // 3. 初始化认证服务
    authService := NewAuthService(config.JWT.Secret)

    // 4. 设置路由
    mux := setupRoutes(hub)

    // 5. 启动服务器
    addr := fmt.Sprintf(":%d", config.Server.Port)
    log.Printf("Server starting on %s", addr)

    if err := http.ListenAndServe(addr, mux); err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}
```

## 客户端示例

### HTML 客户端

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat Room</title>
</head>
<body>
    <div id="messages"></div>
    <input type="text" id="messageInput" />
    <button onclick="sendMessage()">Send</button>

    <script>
        const ws = new WebSocket('ws://localhost:8080/ws?token=YOUR_TOKEN');

        ws.onmessage = function(event) {
            const msg = JSON.parse(event.data);
            displayMessage(msg);
        };

        function sendMessage() {
            const input = document.getElementById('messageInput');
            const msg = {
                type: 'chat',
                content: input.value,
                room_id: 'general'
            };
            ws.send(JSON.stringify(msg));
            input.value = '';
        }

        function displayMessage(msg) {
            const div = document.createElement('div');
            div.textContent = `${msg.sender_name}: ${msg.content}`;
            document.getElementById('messages').appendChild(div);
        }

        function joinRoom(roomId) {
            ws.send(JSON.stringify({
                type: 'join',
                room_id: roomId
            }));
        }

        // 加入默认房间
        joinRoom('general');
    </script>
</body>
</html>
```

## 部署

### Dockerfile

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o server ./cmd/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
```

### docker-compose

```yaml
version: '3.8'

services:
  chat-server:
    build: .
    ports:
      - "8080:8080"
    environment:
      - JWT_SECRET=your-secret-key
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## 扩展功能

### 功能建议

1. **私聊功能** - 一对一聊天
2. **文件传输** - 支持发送文件
3. **消息持久化** - 存储聊天记录
4. **敏感词过滤** - 内容审核
5. **在线状态** - 显示用户在线状态

### 性能优化

1. **连接池** - 管理大量连接
2. **消息压缩** - 减少传输数据
3. **负载均衡** - 多服务器部署
4. **监控告警** - 监控连接数和消息量

## 总结

| 方面 | 关键点 |
|------|--------|
| **Hub模式** - 管理所有客户端 |
| **Goroutine** - 并发读写 |
| **Channel** - 消息传递 |
| **WebSocket** - 实时通信 |
| **JWT认证** - 用户身份验证 |

::: v-pre

[URL短链服务](./url-shortener.md) → [任务调度器](./task-scheduler.md)

:::
