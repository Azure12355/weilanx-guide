---
title: WebSocket
icon: ri:exchange-line
order: 6
---

# WebSocket

WebSocket 提供全双工通信通道，适合实时应用。

## 基础 WebSocket

### 升级处理器

```go
import (
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        // 生产环境应该验证来源
        return true
    },
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
    // 升级 HTTP 连接
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Printf("WebSocket upgrade failed: %v", err)
        return
    }
    defer conn.Close()

    // 读取消息
    for {
        var msg map[string]interface{}
        if err := conn.ReadJSON(&msg); err != nil {
            log.Printf("Read error: %v", err)
            break
        }

        // 处理消息
        response := map[string]interface{}{
            "type":    "echo",
            "payload": msg,
        }

        if err := conn.WriteJSON(response); err != nil {
            log.Printf("Write error: %v", err)
            break
        }
    }
}
```

### Gin 集成

```go
func wsGinHandler(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Printf("WebSocket upgrade failed: %v", err)
        return
    }
    defer conn.Close()

    for {
        messageType, message, err := conn.ReadMessage()
        if err != nil {
            log.Printf("Read error: %v", err)
            break
        }

        log.Printf("Received: %s", message)

        // 回显消息
        if err := conn.WriteMessage(messageType, message); err != nil {
            log.Printf("Write error: %v", err)
            break
        }
    }
}
```

## 连接管理

### Hub 模式

```go
// Client 表示 WebSocket 客户端
type Client struct {
    ID   string
    Conn *websocket.Conn
    Send chan []byte
    Hub  *Hub
}

// Hub 管理所有客户端
type Hub struct {
    clients    map[*Client]bool
    register   chan *Client
    unregister chan *Client
    broadcast  chan []byte
}

func NewHub() *Hub {
    return &Hub{
        clients:    make(map[*Client]bool),
        register:   make(chan *Client),
        unregister: make(chan *Client),
        broadcast:  make(chan []byte),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client] = true
            log.Printf("Client registered: %s", client.ID)

        case client := <-h.unregister:
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
                close(client.Send)
                log.Printf("Client unregistered: %s", client.ID)
            }

        case message := <-h.broadcast:
            for client := range h.clients {
                select {
                case client.Send <- message:
                default:
                    close(client.Send)
                    delete(h.clients, client)
                }
            }
        }
    }
}
```

### 客户端处理

```go
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
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
                log.Printf("Unexpected close: %v", err)
            }
            break
        }

        // 广播消息
        c.Hub.broadcast <- message
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

            if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
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
```

## 消息协议

### 消息类型

```go
type Message struct {
    Type    string      `json:"type"`
    Payload interface{} `json:"payload"`
}

type ChatMessage struct {
    UserID  string `json:"user_id"`
    Content string `json:"content"`
    RoomID  string `json:"room_id"`
}

type JoinMessage struct {
    UserID string `json:"user_id"`
    RoomID string `json:"room_id"`
}
```

### 消息处理

```go
func (c *Client) handleMessages() {
    for {
        var msg Message
        if err := c.Conn.ReadJSON(&msg); err != nil {
            log.Printf("Read error: %v", err)
            break
        }

        switch msg.Type {
        case "chat":
            var chatMsg ChatMessage
            if err := mapToStruct(msg.Payload, &chatMsg); err != nil {
                c.sendError("Invalid message format")
                continue
            }
            c.handleChat(&chatMsg)

        case "join":
            var joinMsg JoinMessage
            if err := mapToStruct(msg.Payload, &joinMsg); err != nil {
                c.sendError("Invalid join message")
                continue
            }
            c.handleJoin(&joinMsg)

        default:
            c.sendError("Unknown message type")
        }
    }
}

func (c *Client) sendError(msg string) {
    c.Conn.WriteJSON(Message{
        Type: "error",
        Payload: map[string]string{
            "message": msg,
        },
    })
}
```

## 房间管理

### 房间 Hub

```go
type Room struct {
    ID      string
    clients map[*Client]bool
    Hub     *Hub
}

type RoomHub struct {
    rooms  map[string]*Room
    mu     sync.RWMutex
    hub    *Hub
}

func NewRoomHub(hub *Hub) *RoomHub {
    return &RoomHub{
        rooms: make(map[string]*Room),
        hub:   hub,
    }
}

func (rh *RoomHub) Join(roomID string, client *Client) {
    rh.mu.Lock()
    defer rh.mu.Unlock()

    room, exists := rh.rooms[roomID]
    if !exists {
        room = &Room{
            ID:      roomID,
            clients: make(map[*Client]bool),
            Hub:     rh.hub,
        }
        rh.rooms[roomID] = room
    }

    room.clients[client] = true
    client.RoomID = roomID
}

func (rh *RoomHub) Leave(roomID string, client *Client) {
    rh.mu.Lock()
    defer rh.mu.Unlock()

    if room, exists := rh.rooms[roomID]; exists {
        delete(room.clients, client)

        if len(room.clients) == 0 {
            delete(rh.rooms, roomID)
        }
    }
}

func (rh *RoomHub) Broadcast(roomID string, message []byte) {
    rh.mu.RLock()
    defer rh.mu.RUnlock()

    if room, exists := rh.rooms[roomID]; exists {
        for client := range room.clients {
            select {
            case client.Send <- message:
            default:
                close(client.Send)
                delete(room.clients, client)
            }
        }
    }
}
```

## 认证授权

### 连接认证

```go
func AuthMiddleware(tokenStore TokenStore) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 从查询参数获取 token
        token := c.Query("token")

        if token == "" {
            c.JSON(401, gin.H{"error": "Token required"})
            c.Abort()
            return
        }

        // 验证 token
        claims, err := tokenStore.Validate(token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // 存储用户信息
        c.Set("user_id", claims.UserID)
        c.Set("user_role", claims.Role)

        c.Next()
    }
}

func authenticatedWebSocketHandler(c *gin.Context) {
    userID := c.GetString("user_id")

    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        return
    }

    client := &Client{
        ID:   userID,
        Conn: conn,
        Send: make(chan []byte, 256),
        Hub:  hub,
    }

    hub.register <- client

    go client.WritePump()
    go client.ReadPump()
}
```

## 心跳检测

### Ping/Pong

```go
func (c *Client) startHeartbeat() {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ticker.C:
            if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
                log.Printf("Ping failed: %v", err)
                return
            }

        case <-c.done:
            return
        }
    }
}

func (c *Client) setupPongHandler() {
    c.Conn.SetPongHandler(func(appData string) error {
        c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
        return nil
    })
}
```

### 超时断开

```go
func (c *Client) ReadPump() {
    defer c.close()

    c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))

    for {
        _, _, err := c.Conn.ReadMessage()
        if err != nil {
            if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
                break
            }

            if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
                log.Printf("Client timeout: %s", c.ID)
                break
            }

            log.Printf("Read error: %v", err)
            break
        }

        c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
    }
}
```

## 生产实践

### 重连机制

```go
// 客户端重连逻辑 (JavaScript)
class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.reconnectDelay = 1000;
        this.maxReconnectDelay = 30000;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('Connected');
            this.reconnectDelay = 1000;
        };

        this.ws.onclose = () => {
            console.log('Disconnected, reconnecting...');
            setTimeout(() => this.connect(), this.reconnectDelay);
            this.reconnectDelay = Math.min(
                this.reconnectDelay * 2,
                this.maxReconnectDelay
            );
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    send(data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}
```

### 消息确认

```go
type Message struct {
    ID      string      `json:"id"`
    Type    string      `json:"type"`
    Payload interface{} `json:"payload"`
}

type AckMessage struct {
    MessageID string `json:"message_id"`
    Status    string `json:"status"`
}

func (c *Client) writeMessageWithAck(msg *Message) error {
    // 发送消息
    if err := c.Conn.WriteJSON(msg); err != nil {
        return err
    }

    // 等待确认
    ackChan := make(chan *AckMessage, 1)
    c.pendingAcks[msg.ID] = ackChan

    select {
    case ack := <-ackChan:
        if ack.Status != "ok" {
            return fmt.Errorf("message not acknowledged")
        }
        return nil

    case <-time.After(10 * time.Second):
        return fmt.Errorf("acknowledgment timeout")
    }
}
```

## 最佳实践

::: tip WebSocket 建议

1. **心跳检测** - 定期发送 Ping 消息
2. **优雅关闭** - 正确处理连接关闭
3. **消息确认** - 重要消息需要确认
4. **房间隔离** - 使用房间管理多客户端
5. **错误处理** - 妥善处理网络错误

:::

```go
// ✅ 好的模式
func goodWebSocketHandler(c *gin.Context) {
    // 1. 升级连接
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        return
    }
    defer conn.Close()

    // 2. 创建客户端
    client := NewClient(conn)
    hub.register <- client

    // 3. 启动读写循环
    go client.WritePump()
    client.ReadPump()
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **gorilla/websocket** - 流行 WebSocket 库 |
| **Hub 模式** - 管理多个客户端 |
| **房间管理** - 隔离不同通信组 |
| **心跳检测** - 保持连接活跃 |
| **重连机制** - 处理网络断开 |

::: v-pre

[JSON API](./json-api.md) → [安全](./security.md)

:::
