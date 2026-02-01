---
title: 聊天应用
icon: ri:message-3-line
order: 3
---

# 聊天应用

通过构建一个实时聊天应用，综合运用 WebSocket 和实时通信技术。

## 项目概述

### 功能需求

```javascript
// 聊天应用功能列表

// 核心功能
// 1. 用户系统
//    - 设置用户名
//    - 头像选择
//    - 用户列表显示

// 2. 消息功能
//    - 发送消息
//    - 接收消息
//    - 消息时间戳
//    - 消息状态

// 3. 实时通信
//    - WebSocket 连接
//    - 自动重连
//    - 连接状态显示

// 4. 聊天界面
//    - 消息列表
//    - 输入区域
//    - 滚动到最新
//    - 消息气泡

// 高级功能
// 5. 消息类型
//    - 文本消息
//    - 表情支持
//    - 图片上传
//    - 代码块

// 6. 用户交互
//    - 输入提示
//    - 正在输入状态
//    - 消息已读回执
//    - @用户功能

// 7. 数据存储
//    - 本地消息历史
//    - 会话恢复
//    - 离线消息
```

### 项目结构

```javascript
// 项目结构

chat-app/
├── index.html          # 主 HTML 文件
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── app.js          # 主应用逻辑
│   ├── websocket.js    # WebSocket 封装
│   ├── storage.js      # 存储管理
│   └── ui.js           # UI 渲染
├── server/
│   └── server.js       # Node.js 服务器
└── README.md           # 项目说明

// 技术栈
// - 原生 JavaScript（ES6+）
// - WebSocket
// - Node.js + ws 库
// - LocalStorage
// - CSS3 动画
```

## 项目实现

### HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>聊天应用</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- 登录界面 -->
    <div class="login-screen" id="login-screen">
        <div class="login-card">
            <h1>💬 聊天应用</h1>
            <div class="login-form">
                <input
                    type="text"
                    id="username-input"
                    placeholder="输入你的用户名..."
                    maxlength="20"
                    autocomplete="off"
                >
                <div class="avatar-selection">
                    <p>选择头像:</p>
                    <div class="avatar-list" id="avatar-list">
                        <div class="avatar-option selected" data-avatar="👨">👨</div>
                        <div class="avatar-option" data-avatar="👩">👩</div>
                        <div class="avatar-option" data-avatar="🧑">🧑</div>
                        <div class="avatar-option" data-avatar="👶">👶</div>
                        <div class="avatar-option" data-avatar="👴">👴</div>
                        <div class="avatar-option" data-avatar="👵">👵</div>
                        <div class="avatar-option" data-avatar="🦸">🦸</div>
                        <div class="avatar-option" data-avatar="🧙">🧙</div>
                    </div>
                </div>
                <button id="join-btn" class="join-btn">加入聊天</button>
            </div>
        </div>
    </div>

    <!-- 聊天界面 -->
    <div class="chat-screen" id="chat-screen" style="display: none;">
        <!-- 侧边栏 -->
        <div class="sidebar">
            <div class="user-profile">
                <span class="user-avatar" id="current-avatar">👨</span>
                <div class="user-info">
                    <p class="user-name" id="current-username">用户</p>
                    <p class="connection-status" id="connection-status">
                        <span class="status-dot online"></span> 在线
                    </p>
                </div>
                <button class="leave-btn" id="leave-btn" title="退出聊天">🚪</button>
            </div>

            <div class="online-users">
                <h3>在线用户</h3>
                <ul class="users-list" id="users-list">
                    <!-- 用户列表动态生成 -->
                </ul>
            </div>
        </div>

        <!-- 聊天区域 -->
        <div class="chat-area">
            <div class="chat-header">
                <h2>公共聊天室</h2>
                <div class="chat-info">
                    <span class="user-count">👥 <span id="online-count">0</span> 人在线</span>
                </div>
            </div>

            <div class="messages-container" id="messages-container">
                <div class="messages-list" id="messages-list">
                    <!-- 消息动态生成 -->
                </div>
            </div>

            <div class="typing-indicator" id="typing-indicator" style="display: none;">
                <span>有人正在输入...</span>
                <span class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>

            <div class="input-area">
                <div class="input-wrapper">
                    <input
                        type="text"
                        id="message-input"
                        placeholder="输入消息..."
                        autocomplete="off"
                    >
                    <button id="send-btn" class="send-btn">
                        <span>发送</span>
                        <span class="send-icon">📤</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/storage.js"></script>
    <script src="js/websocket.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### CSS 样式

```css
/* css/style.css */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 100vh;
    overflow: hidden;
}

/* 登录界面 */
.login-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 400px;
    width: 90%;
    animation: slideUp 0.5s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-card h1 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    color: #333;
}

#username-input {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1.1rem;
    margin-bottom: 20px;
    transition: border-color 0.3s;
}

#username-input:focus {
    outline: none;
    border-color: #667eea;
}

.avatar-selection p {
    text-align: left;
    margin-bottom: 10px;
    color: #666;
    font-weight: 500;
}

.avatar-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 25px;
}

.avatar-option {
    font-size: 2.5rem;
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
}

.avatar-option:hover {
    border-color: #667eea;
    transform: scale(1.1);
}

.avatar-option.selected {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
}

.join-btn {
    width: 100%;
    padding: 15px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s;
}

.join-btn:hover {
    background: #5568d3;
}

/* 聊天界面 */
.chat-screen {
    display: flex;
    height: 100vh;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* 侧边栏 */
.sidebar {
    width: 300px;
    background: white;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e0e0e0;
}

.user-profile {
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-avatar {
    font-size: 3rem;
}

.user-info {
    flex: 1;
}

.user-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 5px;
}

.connection-status {
    font-size: 0.9rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 5px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.status-dot.online {
    background: #2ecc71;
}

.status-dot.offline {
    background: #e74c3c;
}

.status-dot.connecting {
    background: #f39c12;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.leave-btn {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    transition: transform 0.2s;
}

.leave-btn:hover {
    transform: scale(1.2);
}

.online-users {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.online-users h3 {
    font-size: 1rem;
    color: #666;
    margin-bottom: 15px;
}

.users-list {
    list-style: none;
}

.user-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 5px;
    transition: background 0.2s;
}

.user-item:hover {
    background: #f5f5f5;
}

.user-item .avatar {
    font-size: 1.5rem;
}

.user-item .name {
    flex: 1;
    color: #333;
}

.user-item .you {
    font-size: 0.8rem;
    color: #999;
}

/* 聊天区域 */
.chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f9f9f9;
}

.chat-header {
    padding: 20px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h2 {
    color: #333;
}

.user-count {
    color: #666;
    font-size: 0.9rem;
}

/* 消息区域 */
.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.messages-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.system-message {
    text-align: center;
    color: #999;
    font-size: 0.9rem;
    padding: 10px;
}

.message {
    display: flex;
    gap: 10px;
    max-width: 70%;
}

.message.own {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.message .avatar {
    font-size: 2rem;
    flex-shrink: 0;
}

.message-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.message.own .message-content {
    align-items: flex-end;
}

.message-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #666;
}

.message.own .message-info {
    flex-direction: row-reverse;
}

.message-sender {
    font-weight: 600;
}

.message-time {
    font-size: 0.8rem;
}

.message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    word-wrap: break-word;
    line-height: 1.4;
}

.message:not(.own) .message-bubble {
    background: white;
    border-bottom-left-radius: 4px;
}

.message.own .message-bubble {
    background: #667eea;
    color: white;
    border-bottom-right-radius: 4px;
}

/* 输入状态 */
.typing-indicator {
    padding: 10px 20px;
    font-size: 0.9rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 10px;
}

.typing-dots {
    display: flex;
    gap: 4px;
}

.typing-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
    animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
}

/* 输入区域 */
.input-area {
    padding: 20px;
    background: white;
    border-top: 1px solid #e0e0e0;
}

.input-wrapper {
    display: flex;
    gap: 10px;
    max-width: 800px;
    margin: 0 auto;
}

#message-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

#message-input:focus {
    outline: none;
    border-color: #667eea;
}

.send-btn {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.send-btn:hover {
    background: #5568d3;
}

.send-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 768px) {
    .sidebar {
        position: absolute;
        left: -300px;
        height: 100%;
        z-index: 10;
        transition: left 0.3s;
    }

    .sidebar.open {
        left: 0;
    }

    .message {
        max-width: 85%;
    }
}
```

### WebSocket 封装

```javascript
// js/websocket.js

class ChatWebSocket {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.listeners = {};
        this.isManualClose = false;
    }

    connect(username, avatar) {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(`${this.url}?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}`);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;
                    this.emit('connected');
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.emit(data.type, data);
                    } catch (error) {
                        console.error('Failed to parse message:', error);
                    }
                };

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.emit('disconnected');

                    if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnect(username, avatar);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.emit('error', error);
                    reject(error);
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    reconnect(username, avatar) {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.emit('reconnecting', { attempt: this.reconnectAttempts });

        setTimeout(() => {
            this.connect(username, avatar);
        }, delay);
    }

    send(type, data = {}) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = { type, ...data, timestamp: Date.now() };
            this.ws.send(JSON.stringify(message));
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    close() {
        this.isManualClose = true;
        if (this.ws) {
            this.ws.close();
        }
    }

    getReadyState() {
        return this.ws ? this.ws.readyState : WebSocket.CLOSED;
    }
}

export default ChatWebSocket;
```

### 存储管理

```javascript
// js/storage.js

class ChatStorage {
    constructor() {
        this.USER_KEY = 'chat_user';
        this.MESSAGES_KEY = 'chat_messages';
    }

    // 保存用户信息
    saveUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    // 获取用户信息
    getUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    // 清除用户信息
    clearUser() {
        localStorage.removeItem(this.USER_KEY);
    }

    // 保存消息历史
    saveMessage(message) {
        const messages = this.getMessages();
        messages.push(message);
        // 只保留最近 100 条
        if (messages.length > 100) {
            messages.shift();
        }
        localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
    }

    // 获取消息历史
    getMessages() {
        const messages = localStorage.getItem(this.MESSAGES_KEY);
        return messages ? JSON.parse(messages) : [];
    }

    // 清除消息历史
    clearMessages() {
        localStorage.removeItem(this.MESSAGES_KEY);
    }
}

export default ChatStorage;
```

### UI 渲染

```javascript
// js/ui.js

class ChatUI {
    constructor() {
        this.loginScreen = document.getElementById('login-screen');
        this.chatScreen = document.getElementById('chat-screen');
        this.usernameInput = document.getElementById('username-input');
        this.avatarList = document.getElementById('avatar-list');
        this.joinBtn = document.getElementById('join-btn');

        this.currentUsername = document.getElementById('current-username');
        this.currentAvatar = document.getElementById('current-avatar');
        this.connectionStatus = document.getElementById('connection-status');
        this.usersList = document.getElementById('users-list');
        this.onlineCount = document.getElementById('online-count');
        this.messagesList = document.getElementById('messages-list');
        this.messagesContainer = document.getElementById('messages-container');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');

        this.selectedAvatar = '👨';
        this.setupAvatarSelection();
    }

    setupAvatarSelection() {
        this.avatarList.addEventListener('click', (e) => {
            const avatarOption = e.target.closest('.avatar-option');
            if (avatarOption) {
                document.querySelectorAll('.avatar-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                avatarOption.classList.add('selected');
                this.selectedAvatar = avatarOption.dataset.avatar;
            }
        });
    }

    showChatScreen() {
        this.loginScreen.style.display = 'none';
        this.chatScreen.style.display = 'flex';
    }

    showLoginScreen() {
        this.chatScreen.style.display = 'none';
        this.loginScreen.style.display = 'flex';
    }

    updateUserProfile(user) {
        this.currentUsername.textContent = user.username;
        this.currentAvatar.textContent = user.avatar;
    }

    updateConnectionStatus(status) {
        const statusDot = this.connectionStatus.querySelector('.status-dot');
        const statusText = this.connectionStatus.childNodes[1];

        statusDot.className = 'status-dot';

        switch (status) {
            case 'connected':
                statusDot.classList.add('online');
                statusText.textContent = ' 在线';
                break;
            case 'connecting':
                statusDot.classList.add('connecting');
                statusText.textContent = ' 连接中...';
                break;
            case 'disconnected':
                statusDot.classList.add('offline');
                statusText.textContent = ' 离线';
                break;
        }
    }

    renderUsersList(users, currentUsername) {
        this.usersList.innerHTML = '';
        this.onlineCount.textContent = users.length;

        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'user-item';
            li.innerHTML = `
                <span class="avatar">${user.avatar}</span>
                <span class="name">${this.escapeHtml(user.username)}</span>
                ${user.username === currentUsername ? '<span class="you">(你)</span>' : ''}
            `;
            this.usersList.appendChild(li);
        });
    }

    addMessage(message, currentUsername) {
        const isOwn = message.username === currentUsername;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isOwn ? 'own' : ''}`;
        messageDiv.innerHTML = `
            <span class="avatar">${message.avatar}</span>
            <div class="message-content">
                <div class="message-info">
                    <span class="message-sender">${this.escapeHtml(message.username)}</span>
                    <span class="message-time">${this.formatTime(message.timestamp)}</span>
                </div>
                <div class="message-bubble">${this.escapeHtml(message.text)}</div>
            </div>
        `;
        this.messagesList.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addSystemMessage(text) {
        const div = document.createElement('div');
        div.className = 'system-message';
        div.textContent = text;
        this.messagesList.appendChild(div);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    getMessageText() {
        return this.messageInput.value.trim();
    }

    clearInput() {
        this.messageInput.value = '';
    }

    focusInput() {
        this.messageInput.focus();
    }

    enableSend() {
        this.sendBtn.disabled = false;
    }

    disableSend() {
        this.sendBtn.disabled = true;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

export default ChatUI;
```

### 应用逻辑

```javascript
// js/app.js

import ChatWebSocket from './websocket.js';
import ChatStorage from './storage.js';
import ChatUI from './ui.js';

class ChatApp {
    constructor(wsUrl) {
        this.ws = new ChatWebSocket(wsUrl);
        this.storage = new ChatStorage();
        this.ui = new ChatUI();

        this.user = null;
        this.typingTimer = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupWebSocketListeners();
        this.checkRememberedUser();
    }

    bindEvents() {
        // 加入聊天
        this.ui.joinBtn.addEventListener('click', () => {
            this.handleJoin();
        });

        // 回车加入
        this.ui.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleJoin();
            }
        });

        // 发送消息
        this.ui.sendBtn.addEventListener('click', () => {
            this.handleSend();
        });

        // 回车发送
        this.ui.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // 正在输入
        this.ui.messageInput.addEventListener('input', () => {
            this.handleTyping();
        });
    }

    setupWebSocketListeners() {
        this.ws.on('connected', () => {
            this.ui.updateConnectionStatus('connected');
            this.ui.enableSend();
        });

        this.ws.on('disconnected', () => {
            this.ui.updateConnectionStatus('disconnected');
            this.ui.disableSend();
        });

        this.ws.on('reconnecting', (data) => {
            this.ui.updateConnectionStatus('connecting');
            this.ui.addSystemMessage(`连接断开，正在重连... (尝试 ${data.attempt}/${5})`);
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.ws.on('users', (data) => {
            this.ui.renderUsersList(data.users, this.user.username);
        });

        this.ws.on('message', (data) => {
            this.ui.addMessage(data, this.user.username);
            this.storage.saveMessage(data);
        });

        this.ws.on('system', (data) => {
            this.ui.addSystemMessage(data.text);
        });

        this.ws.on('typing', (data) => {
            if (data.username !== this.user.username) {
                this.ui.showTypingIndicator();
                clearTimeout(this.typingTimer);
                this.typingTimer = setTimeout(() => {
                    this.ui.hideTypingIndicator();
                }, 3000);
            }
        });
    }

    checkRememberedUser() {
        const rememberedUser = this.storage.getUser();
        if (rememberedUser) {
            this.ui.usernameInput.value = rememberedUser.username;
        }
    }

    async handleJoin() {
        const username = this.ui.usernameInput.value.trim();
        if (!username) {
            alert('请输入用户名');
            return;
        }

        this.user = {
            username: username,
            avatar: this.ui.selectedAvatar
        };

        this.ui.updateConnectionStatus('connecting');
        this.ui.joinBtn.disabled = true;

        try {
            await this.ws.connect(this.user.username, this.user.avatar);
            this.storage.saveUser(this.user);
            this.ui.updateUserProfile(this.user);
            this.ui.showChatScreen();

            // 加载历史消息
            const messages = this.storage.getMessages();
            messages.forEach(msg => {
                this.ui.addMessage(msg, this.user.username);
            });

        } catch (error) {
            alert('连接失败，请检查服务器是否运行');
            this.ui.joinBtn.disabled = false;
            this.ui.updateConnectionStatus('disconnected');
        }
    }

    handleSend() {
        const text = this.ui.getMessageText();
        if (!text) return;

        this.ws.send('message', { text });
        this.ui.clearInput();
        this.ui.focusInput();
    }

    handleTyping() {
        this.ws.send('typing');
    }

    leave() {
        if (confirm('确定要退出聊天吗？')) {
            this.ws.send('leave');
            this.ws.close();
            this.storage.clearUser();
            this.ui.showLoginScreen();
            this.ui.joinBtn.disabled = false;
            this.ui.updateConnectionStatus('disconnected');
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // WebSocket 服务器地址
    const wsUrl = 'ws://localhost:3000';
    new ChatApp(wsUrl);
});
```

### Node.js 服务器

```javascript
// server/server.js

const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const users = new Map();

wss.on('connection', (ws, req) => {
    // 解析 URL 参数获取用户信息
    const url = new URL(req.url, `http://${req.headers.host}`);
    const username = url.searchParams.get('username');
    const avatar = url.searchParams.get('avatar') || '👨';

    if (!username) {
        ws.close();
        return;
    }

    // 创建用户对象
    const user = {
        id: Date.now() + Math.random(),
        username,
        avatar,
        ws
    };

    users.set(user.id, user);

    // 发送用户列表
    broadcastUsers();

    // 广播系统消息
    broadcast({
        type: 'system',
        text: `${username} 加入了聊天`
    });

    // 发送欢迎消息
    send(ws, {
        type: 'system',
        text: `欢迎 ${username}！`
    });

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'message':
                    handleMessage(user, message.text);
                    break;
                case 'typing':
                    handleTyping(user);
                    break;
                case 'leave':
                    handleLeave(user);
                    break;
            }
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    });

    ws.on('close', () => {
        handleLeave(user);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function handleMessage(user, text) {
    if (!text || text.trim() === '') return;

    const message = {
        type: 'message',
        username: user.username,
        avatar: user.avatar,
        text: text.trim(),
        timestamp: Date.now()
    };

    broadcast(message);
}

function handleTyping(user) {
    broadcast({
        type: 'typing',
        username: user.username
    }, user.id);
}

function handleLeave(user) {
    if (!users.has(user.id)) return;

    users.delete(user.id);
    broadcastUsers();

    broadcast({
        type: 'system',
        text: `${user.username} 离开了聊天`
    });
}

function broadcast(message, excludeUserId = null) {
    const data = JSON.stringify(message);

    users.forEach((user) => {
        if (user.id !== excludeUserId && user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(data);
        }
    });
}

function broadcastUsers() {
    const usersList = Array.from(users.values()).map(user => ({
        username: user.username,
        avatar: user.avatar
    }));

    broadcast({
        type: 'users',
        users: usersList
    });
}

function send(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
    console.log(`WebSocket server: ws://localhost:${PORT}`);
});
```

### package.json

```json
{
  "name": "chat-app",
  "version": "1.0.0",
  "description": "Real-time chat application",
  "main": "server/server.js",
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js"
  },
  "dependencies": {
    "ws": "^8.14.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

## 项目总结

### 技术要点

```javascript
// 技术要点总结

// 1. WebSocket 通信
// - 实时双向通信
// - 连接状态管理
// - 自动重连机制
// - 错误处理

// 2. 前后端分离
// - JSON 消息格式
// - 事件类型系统
// - 用户状态同步
// - 消息广播

// 3. 状态管理
// - 在线用户列表
// - 消息历史存储
// - 连接状态追踪
// - UI 状态更新

// 4. 用户体验
// - 消息气泡设计
// - 输入状态提示
// - 平滑动画效果
// - 响应式布局

// 5. 数据持久化
// - LocalStorage
// - 消息历史
// - 用户信息
// - 会话恢复
```

### WebSocket 原理

```javascript
// WebSocket 通信流程

// 1. 握手阶段
// 客户端发送 HTTP 请求升级协议
// GET ws://localhost:3000 HTTP/1.1
// Upgrade: websocket
// Connection: Upgrade

// 服务器响应
// HTTP/1.1 101 Switching Protocols
// Upgrade: websocket
// Connection: Upgrade

// 2. 数据传输
// - 全双工通信
// - 低延迟
// - 持久连接

// 3. 连接关闭
// - 主动关闭
// - 超时关闭
// - 错误关闭
```

### 扩展功能

```javascript
// 可扩展功能

// 1. 私聊功能
// - 一对一聊天
// - 消息加密
// - 聊天记录

// 2. 群组功能
// - 创建群组
// - 邀请成员
// - 群组管理

// 3. 多媒体消息
// - 图片发送
// - 语音消息
// - 文件传输

// 4. 消息功能
// - 消息撤回
// - 消息引用
// - 消息搜索

// 5. 用户功能
// - 用户注册
// - 头像上传
// - 好友系统
// - 黑名单
```

::: tip 聊天应用检查清单

- [ ] 完成 HTML 结构
- [ ] 完成 CSS 样式
- [ ] 实现 WebSocket 封装
- [ ] 实现存储管理
- [ ] 实现 UI 渲染
- [ ] 实现应用逻辑
- [ ] 实现 Node.js 服务器
- [ ] 安装依赖 (npm install ws)
- [ ] 启动服务器测试
- [ ] 扩展应用功能

:::

::: tip 实战项目回顾

恭喜！你已完成所有实战项目：

- [x] 待办事项应用
- [x] 天气应用
- [x] 聊天应用

你已经掌握了 JavaScript 的核心知识和实战技能！继续加油！🎉
:::
