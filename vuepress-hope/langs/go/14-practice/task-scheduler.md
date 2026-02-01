---
title: 任务调度器
icon: ri:calendar-todo-line
order: 4
---

# 任务调度器

一个分布式任务调度系统，学习定时任务和并发控制。

## 项目概述

### 功能需求

- 定时任务执行
- Cron表达式支持
- 任务队列管理
- 分布式锁
- 任务监控和日志

### 技术栈

```
调度: robfig/cron
队列: Redis/Channel
锁: Redlock
存储: MySQL
监控: Prometheus
```

## 项目结构

```
task-scheduler/
├── cmd/
│   └── scheduler/
│       └── main.go
├── internal/
│   ├── scheduler/
│   │   └── scheduler.go
│   ├── task/
│   │   ├── task.go
│   │   └── executor.go
│   ├── queue/
│   │   └── queue.go
│   ├── lock/
│   │   └── distributed_lock.go
│   └── storage/
│       └── task_storage.go
├── pkg/
│   ├── cron/
│   │   └── parser.go
│   └── logger/
│       └── logger.go
├── configs/
│   └── config.yaml
└── go.mod
```

## 任务定义

### 任务结构

```go
// internal/task/task.go
package task

import "time"

type Task struct {
    ID          string                 `json:"id"`
    Name        string                 `json:"name"`
    Description string                 `json:"description"`
    CronExpr    string                 `json:"cron_expr"`
    Handler     string                 `json:"handler"`
    Args        map[string]interface{} `json:"args"`
    Status      TaskStatus             `json:"status"`
    CreatedAt   time.Time              `json:"created_at"`
    UpdatedAt   time.Time              `json:"updated_at"`
}

type TaskStatus string

const (
    StatusPending   TaskStatus = "pending"
    StatusRunning   TaskStatus = "running"
    StatusCompleted TaskStatus = "completed"
    StatusFailed    TaskStatus = "failed"
    StatusDisabled  TaskStatus = "disabled"
)

type TaskExecution struct {
    ID        string                 `json:"id"`
    TaskID    string                 `json:"task_id"`
    Status    TaskStatus             `json:"status"`
    StartedAt time.Time              `json:"started_at"`
    EndedAt   *time.Time             `json:"ended_at,omitempty"`
    Error     string                 `json:"error,omitempty"`
    Result    map[string]interface{} `json:"result,omitempty"`
    Logs      []string               `json:"logs,omitempty"`
}
```

### 任务执行器

```go
// internal/task/executor.go
package task

import (
    "context"
    "fmt"
    "time"
)

type Executor interface {
    Execute(ctx context.Context, task *Task) (*TaskExecution, error)
}

type TaskExecutor struct {
    handlers map[string]HandlerFunc
}

type HandlerFunc func(ctx context.Context, args map[string]interface{}) (map[string]interface{}, error)

func NewTaskExecutor() *TaskExecutor {
    return &TaskExecutor{
        handlers: make(map[string]HandlerFunc),
    }
}

func (e *TaskExecutor) RegisterHandler(name string, handler HandlerFunc) {
    e.handlers[name] = handler
}

func (e *TaskExecutor) Execute(ctx context.Context, task *Task) (*TaskExecution, error) {
    execution := &TaskExecution{
        ID:        generateExecutionID(),
        TaskID:    task.ID,
        Status:    StatusRunning,
        StartedAt: time.Now(),
        Logs:      make([]string, 0),
    }

    // 获取处理器
    handler, exists := e.handlers[task.Handler]
    if !exists {
        execution.Status = StatusFailed
        execution.Error = fmt.Sprintf("handler not found: %s", task.Handler)
        return execution, fmt.Errorf(execution.Error)
    }

    // 执行任务
    log := func(msg string) {
        execution.Logs = append(execution.Logs, fmt.Sprintf("[%s] %s", time.Now().Format(time.RFC3339), msg))
    }

    log("Task started")
    log(fmt.Sprintf("Executing handler: %s", task.Handler))

    result, err := handler(ctx, task.Args)
    if err != nil {
        execution.Status = StatusFailed
        execution.Error = err.Error()
        log(fmt.Sprintf("Task failed: %v", err))
    } else {
        execution.Status = StatusCompleted
        execution.Result = result
        log("Task completed successfully")
    }

    now := time.Now()
    execution.EndedAt = &now

    return execution, nil
}
```

## 调度器

### Cron调度器

```go
// internal/scheduler/scheduler.go
package scheduler

import (
    "github.com/robfig/cron/v3"
)

type Scheduler struct {
    cron       *cron.Cron
    executor   *TaskExecutor
    storage    TaskStorage
    queue      TaskQueue
    lock       DistributedLock
    tasks      map[string]*Task
    logger     *zap.Logger
}

func NewScheduler(executor *TaskExecutor, storage TaskStorage, queue TaskQueue, lock DistributedLock, logger *zap.Logger) *Scheduler {
    return &Scheduler{
        cron:     cron.New(cron.WithSeconds()),
        executor: executor,
        storage:  storage,
        queue:    queue,
        lock:     lock,
        tasks:    make(map[string]*Task),
        logger:   logger,
    }
}

func (s *Scheduler) Start() error {
    // 加载启用的任务
    tasks, err := s.storage.FindByStatus(StatusPending)
    if err != nil {
        return err
    }

    for _, task := range tasks {
        if err := s.AddTask(task); err != nil {
            s.logger.Error("Failed to add task",
                zap.String("task_id", task.ID),
                zap.Error(err))
        }
    }

    s.cron.Start()
    s.logger.Info("Scheduler started")

    return nil
}

func (s *Scheduler) Stop() {
    s.cron.Stop()
    s.logger.Info("Scheduler stopped")
}

func (s *Scheduler) AddTask(task *Task) error {
    // 验证 Cron 表达式
    if _, err := cron.ParseStandard(task.CronExpr); err != nil {
        return fmt.Errorf("invalid cron expression: %w", err)
    }

    // 添加到调度器
    if err := s.cron.AddFunc(task.CronExpr, func() {
        s.scheduleTask(task)
    }); err != nil {
        return err
    }

    s.tasks[task.ID] = task
    s.logger.Info("Task added",
        zap.String("task_id", task.ID),
        zap.String("cron_expr", task.CronExpr))

    return nil
}

func (s *Scheduler) RemoveTask(taskID string) error {
    if task, exists := s.tasks[taskID]; exists {
        // 移除任务（需要重启调度器）
        delete(s.tasks, taskID)
        s.logger.Info("Task removed", zap.String("task_id", taskID))
        return nil
    }

    return fmt.Errorf("task not found: %s", taskID)
}

func (s *Scheduler) scheduleTask(task *Task) {
    // 添加到执行队列
    if err := s.queue.Push(task); err != nil {
        s.logger.Error("Failed to queue task",
            zap.String("task_id", task.ID),
            zap.Error(err))
    }
}
```

### 工作协程

```go
func (s *Scheduler) StartWorkers(workerNum int) {
    for i := 0; i < workerNum; i++ {
        go s.worker(i)
    }
    s.logger.Info("Workers started", zap.Int("count", workerNum))
}

func (s *Scheduler) worker(id int) {
    for {
        // 从队列获取任务
        task, err := s.queue.Pop()
        if err != nil {
            s.logger.Error("Failed to pop task",
                zap.Int("worker_id", id),
                zap.Error(err))
            continue
        }

        if task == nil {
            time.Sleep(time.Second)
            continue
        }

        // 获取分布式锁
        lockKey := fmt.Sprintf("lock:task:%s", task.ID)
        lock, err := s.lock.Acquire(lockKey, 30*time.Second)
        if err != nil {
            s.logger.Warn("Failed to acquire lock",
                zap.Int("worker_id", id),
                zap.String("task_id", task.ID))
            continue
        }

        s.logger.Info("Executing task",
            zap.Int("worker_id", id),
            zap.String("task_id", task.ID))

        // 执行任务
        ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
        execution, err := s.executor.Execute(ctx, task)
        cancel()

        // 释放锁
        lock.Release()

        // 保存执行记录
        if err := s.storage.SaveExecution(execution); err != nil {
            s.logger.Error("Failed to save execution",
                zap.String("execution_id", execution.ID),
                zap.Error(err))
        }

        if err != nil {
            s.logger.Error("Task execution failed",
                zap.Int("worker_id", id),
                zap.String("task_id", task.ID),
                zap.Error(err))
        } else {
            s.logger.Info("Task execution completed",
                zap.Int("worker_id", id),
                zap.String("task_id", task.ID))
        }
    }
}
```

## 任务队列

### Redis队列

```go
// internal/queue/queue.go
package queue

import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/redis/go-redis/v9"
)

type TaskQueue interface {
    Push(ctx context.Context, task *Task) error
    Pop(ctx context.Context) (*Task, error)
    Size(ctx context.Context) (int64, error)
}

type RedisTaskQueue struct {
    client *redis.Client
    key    string
}

func NewRedisTaskQueue(client *redis.Client, key string) *RedisTaskQueue {
    return &RedisTaskQueue{
        client: client,
        key:    key,
    }
}

func (q *RedisTaskQueue) Push(ctx context.Context, task *Task) error {
    data, err := json.Marshal(task)
    if err != nil {
        return err
    }

    return q.client.LPush(ctx, q.key, data).Err()
}

func (q *RedisTaskQueue) Pop(ctx context.Context) (*Task, error) {
    result, err := q.client.BRPop(ctx, 5*time.Second, q.key).Result()
    if err != nil {
        if err == redis.Nil {
            return nil, nil // 超时
        }
        return nil, err
    }

    var task Task
    if err := json.Unmarshal([]byte(result), &task); err != nil {
        return nil, err
    }

    return &task, nil
}

func (q *RedisTaskQueue) Size(ctx context.Context) (int64, error) {
    return q.client.LLen(ctx, q.key).Result()
}
```

## 分布式锁

### Redlock实现

```go
// internal/lock/distributed_lock.go
package lock

import (
    "context"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

type DistributedLock interface {
    Acquire(key string, ttl time.Duration) (Lock, error)
}

type Lock interface {
    Release() error
    Extend(ttl time.Duration) error
}

type RedLock struct {
    client *redis.Client
}

type redLock struct {
    client *redis.Client
    key    string
    value  string
    ttl    time.Duration
}

func NewRedLock(client *redis.Client) *RedLock {
    return &RedLock{client: client}
}

func (l *RedLock) Acquire(key string, ttl time.Duration) (Lock, error) {
    value := generateLockValue()

    // 尝试获取锁
    acquired, err := l.client.SetNX(context.Background(), key, value, ttl).Result()
    if err != nil {
        return nil, err
    }

    if !acquired {
        return nil, fmt.Errorf("lock already held")
    }

    return &redLock{
        client: l.client,
        key:    key,
        value:  value,
        ttl:    ttl,
    }, nil
}

func (l *redLock) Release() error {
    script := `
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
    `

    _, err := l.client.Eval(context.Background(), script, []string{l.key}, l.value).Result()
    return err
}

func (l *redLock) Extend(ttl time.Duration) error {
    script := `
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("pexpire", KEYS[1], ARGV[2])
        else
            return 0
        end
    `

    result, err := l.client.Eval(context.Background(), script, []string{l.key}, l.value, int(ttl.Milliseconds())).Result()
    if err != nil {
        return err
    }

    if result == int64(0) {
        return fmt.Errorf("lock lost")
    }

    return nil
}
```

## 内置任务

### 任务注册

```go
// cmd/scheduler/main.go
package main

func registerBuiltinTasks(executor *TaskExecutor) {
    // 数据备份任务
    executor.RegisterHandler("backup_database", func(ctx context.Context, args map[string]interface{}) (map[string]interface{}, error) {
        database := args["database"].(string)
        outputDir := args["output_dir"].(string)

        // 执行备份
        cmd := exec.CommandContext(ctx, "mysqldump",
            "-u", "root",
            "-p" + os.Getenv("DB_PASSWORD"),
            database,
        )

        output := fmt.Sprintf("%s/backup_%s.sql", outputDir, time.Now().Format("20060102_150405"))

        file, err := os.Create(output)
        if err != nil {
            return nil, err
        }
        defer file.Close()

        cmd.Stdout = file

        if err := cmd.Run(); err != nil {
            return nil, err
        }

        return map[string]interface{}{
            "output_file": output,
            "size":        getFileSize(output),
        }, nil
    })

    // 数据清理任务
    executor.RegisterHandler("cleanup_logs", func(ctx context.Context, args map[string]interface{}) (map[string]interface{}, error) {
        logDir := args["log_dir"].(string)
        days := int(args["days"].(float64))

        cutoff := time.Now().AddDate(0, 0, -days)

        files, err := os.ReadDir(logDir)
        if err != nil {
            return nil, err
        }

        deleted := 0
        for _, file := range files {
            info, err := file.Info()
            if err != nil {
                continue
            }

            if info.ModTime().Before(cutoff) {
                os.Remove(filepath.Join(logDir, file.Name()))
                deleted++
            }
        }

        return map[string]interface{}{
            "deleted_files": deleted,
        }, nil
    })

    // 邮件发送任务
    executor.RegisterHandler("send_email", func(ctx context.Context, args map[string]interface{}) (map[string]interface{}, error) {
        to := args["to"].(string)
        subject := args["subject"].(string)
        body := args["body"].(string)

        // 发送邮件
        if err := sendEmail(to, subject, body); err != nil {
            return nil, err
        }

        return map[string]interface{}{
            "sent_at": time.Now(),
        }, nil
    })

    // 报表生成任务
    executor.RegisterHandler("generate_report", func(ctx context.Context, args map[string]interface{} (map[string]interface{}, error) {
        reportType := args["type"].(string)
        startDate := args["start_date"].(string)
        endDate := args["end_date"].(string)

        // 生成报表
        report, err := generateReport(reportType, startDate, endDate)
        if err != nil {
            return nil, err
        }

        return map[string]interface{}{
            "report_url": report.URL,
            "rows":       report.Rows,
        }, nil
    })
}
```

## API接口

### HTTP处理器

```go
// cmd/scheduler/api.go
package main

func setupAPIRoutes(scheduler *Scheduler) *gin.Engine {
    r := gin.Default()

    api := r.Group("/api")
    {
        // 任务管理
        api.POST("/tasks", s.createTask(scheduler))
        api.GET("/tasks", s.listTasks(scheduler))
        api.GET("/tasks/:id", s.getTask(scheduler))
        api.PUT("/tasks/:id", s.updateTask(scheduler))
        api.DELETE("/tasks/:id", s.deleteTask(scheduler))

        // 执行记录
        api.GET("/tasks/:id/executions", s.getTaskExecutions(scheduler))
        api.GET("/executions/:id", s.getExecution(scheduler))

        // 队列状态
        api.GET("/queue/status", s.getQueueStatus(scheduler))
    }

    return r
}

func createTask(scheduler *Scheduler) gin.HandlerFunc {
    return func(c *gin.Context) {
        var req TaskRequest
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }

        task := &Task{
            ID:          generateTaskID(),
            Name:        req.Name,
            Description: req.Description,
            CronExpr:    req.CronExpr,
            Handler:     req.Handler,
            Args:        req.Args,
            Status:      StatusPending,
            CreatedAt:   time.Now(),
            UpdatedAt:   time.Now(),
        }

        if err := scheduler.storage.Save(task); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        if req.Status != StatusDisabled {
            if err := scheduler.AddTask(task); err != nil {
                c.JSON(500, gin.H{"error": err.Error()})
                return
            }
        }

        c.JSON(201, task)
    }
}

func listTasks(scheduler *Scheduler) gin.HandlerFunc {
    return func(c *gin.Context) {
        status := c.Query("status")

        var tasks []*Task
        var err error

        if status != "" {
            tasks, err = scheduler.storage.FindByStatus(TaskStatus(status))
        } else {
            tasks, err = scheduler.storage.FindAll()
        }

        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        c.JSON(200, tasks)
    }
}
```

## 主程序

```go
// cmd/scheduler/main.go
package main

func main() {
    // 1. 加载配置
    config := loadConfig()

    // 2. 初始化日志
    logger := initLogger(config.Log)

    // 3. 初始化组件
    redisClient := redis.NewClient(&redis.Options{
        Addr: config.Redis.Addr,
    })

    db := initDB(config.Database)

    // 4. 初始化各层
    storage := NewTaskStorage(db)
    queue := NewRedisTaskQueue(redisClient, "task_queue")
    lock := NewRedLock(redisClient)
    executor := NewTaskExecutor()

    // 注册内置任务
    registerBuiltinTasks(executor)

    // 5. 初始化调度器
    scheduler := NewScheduler(executor, storage, queue, lock, logger)

    // 6. 启动调度器
    if err := scheduler.Start(); err != nil {
        logger.Fatal("Failed to start scheduler", zap.Error(err))
    }

    // 7. 启动工作协程
    scheduler.StartWorkers(config.WorkerNum)

    // 8. 启动HTTP服务
    r := setupAPIRoutes(scheduler)

    addr := fmt.Sprintf(":%d", config.Server.Port)
    logger.Info("HTTP server starting", zap.String("addr", addr))

    if err := r.Run(addr); err != nil {
        logger.Fatal("HTTP server failed", zap.Error(err))
    }
}
```

## API使用

### 创建任务

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Backup",
    "description": "Backup database daily at 2 AM",
    "cron_expr": "0 0 2 * * *",
    "handler": "backup_database",
    "args": {
      "database": "mydb",
      "output_dir": "/backups"
    }
  }'

# 响应
{
  "id": "task_123",
  "name": "Daily Backup",
  "cron_expr": "0 0 2 * * *",
  "handler": "backup_database",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 查看执行记录

```bash
curl http://localhost:8080/api/tasks/task_123/executions

# 响应
[
  {
    "id": "exec_456",
    "task_id": "task_123",
    "status": "completed",
    "started_at": "2024-01-01T02:00:00Z",
    "ended_at": "2024-01-01T02:05:00Z",
    "result": {
      "output_file": "/backups/backup_20240101_020000.sql",
      "size": 1048576
    },
    "logs": [
      "[2024-01-01T02:00:00Z] Task started",
      "[2024-01-01T02:00:01Z] Executing handler: backup_database",
      "[2024-01-01T02:05:00Z] Task completed successfully"
    ]
  }
]
```

## 部署

### Dockerfile

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o scheduler ./cmd/scheduler

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata curl

WORKDIR /root/

COPY --from=builder /app/scheduler .
COPY --from=builder /app/configs ./configs

EXPOSE 8080

CMD ["./scheduler"]
```

### docker-compose

```yaml
version: '3.8'

services:
  scheduler:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - REDIS_ADDR=redis:6379
      - WORKER_NUM=5
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=scheduler
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

## 扩展功能

### 功能建议

1. **任务依赖** - 支持任务间依赖关系
2. **失败重试** - 自动重试失败任务
3. **任务优先级** - 优先执行重要任务
4. **动态配置** - 运行时修改任务
5. **邮件通知** - 任务完成通知

### 性能优化

1. **任务分片** - 大任务拆分执行
2. **结果缓存** - 缓存任务结果
3. **异步执行** - 长时间运行任务
4. **资源限制** - 限制任务资源使用

## 总结

| 方面 | 关键点 |
|------|--------|
| **Cron** - 定时调度 |
| **队列** - 任务队列管理 |
| **锁** - 分布式锁 |
| **工作池** - 并发执行 |
| **监控** - 执行日志和监控 |

::: v-pre

[聊天服务器](./chat-server.md) → [微服务应用](./microservices-app.md)

:::
