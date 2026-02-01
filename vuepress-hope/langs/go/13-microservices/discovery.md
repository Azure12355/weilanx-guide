---
title: 服务发现
icon: ri:search-eye-line
order: 4
---

# 服务发现

服务发现让服务实例能够动态找到彼此。

## 服务注册

### 服务注册表

```go
// 服务注册表
type ServiceRegistry struct {
    mu       sync.RWMutex
    services map[string][]*ServiceInstance
}

type ServiceInstance struct {
    ID        string
    Name      string
    Address   string
    Port      int
    Metadata  map[string]string
    Status    ServiceStatus
    LastHeartbeat time.Time
}

type ServiceStatus string

const (
    StatusStarting ServiceStatus = "starting"
    StatusRunning  ServiceStatus = "running"
    StatusStopping ServiceStatus = "stopping"
    StatusStopped  ServiceStatus = "stopped"
)

func NewServiceRegistry() *ServiceRegistry {
    return &ServiceRegistry{
        services: make(map[string][]*ServiceInstance),
    }
}

func (r *ServiceRegistry) Register(instance *ServiceInstance) error {
    r.mu.Lock()
    defer r.mu.Unlock()

    instances := r.services[instance.Name]
    for _, existing := range instances {
        if existing.ID == instance.ID {
            return fmt.Errorf("instance already registered")
        }
    }

    instance.Status = StatusRunning
    instance.LastHeartbeat = time.Now()
    r.services[instance.Name] = append(instances, instance)

    return nil
}

func (r *ServiceRegistry) Deregister(serviceName, instanceID string) error {
    r.mu.Lock()
    defer r.mu.Unlock()

    instances := r.services[serviceName]
    for i, instance := range instances {
        if instance.ID == instanceID {
            r.services[serviceName] = append(instances[:i], instances[i+1:]...)
            return nil
        }
    }

    return fmt.Errorf("instance not found")
}

func (r *ServiceRegistry) Heartbeat(serviceName, instanceID string) error {
    r.mu.Lock()
    defer r.mu.Unlock()

    instances := r.services[serviceName]
    for _, instance := range instances {
        if instance.ID == instanceID {
            instance.LastHeartbeat = time.Now()
            instance.Status = StatusRunning
            return nil
        }
    }

    return fmt.Errorf("instance not found")
}
```

### 服务发现

```go
type LoadBalancer interface {
    NextInstance(instances []*ServiceInstance) (*ServiceInstance, error)
}

// 轮询负载均衡
type RoundRobinBalancer struct {
    counters map[string]int
    mu       sync.Mutex
}

func NewRoundRobinBalancer() *RoundRobinBalancer {
    return &RoundRobinBalancer{
        counters: make(map[string]int),
    }
}

func (b *RoundRobinBalancer) NextInstance(instances []*ServiceInstance) (*ServiceInstance, error) {
    if len(instances) == 0 {
        return nil, fmt.Errorf("no instances available")
    }

    b.mu.Lock()
    defer b.mu.Unlock()

    serviceName := instances[0].Name
    idx := b.counters[serviceName] % len(instances)
    b.counters[serviceName]++

    return instances[idx], nil
}

// 随机负载均衡
type RandomBalancer struct{}

func NewRandomBalancer() *RandomBalancer {
    return &RandomBalancer{}
}

func (b *RandomBalancer) NextInstance(instances []*ServiceInstance) (*ServiceInstance, error) {
    if len(instances) == 0 {
        return nil, fmt.Errorf("no instances available")
    }

    idx := rand.Intn(len(instances))
    return instances[idx], nil
}

// 服务发现客户端
type DiscoveryClient struct {
    registry    *ServiceRegistry
    balancer    LoadBalancer
    cache       map[string][]*ServiceInstance
    cacheTTL    time.Duration
    cacheTime   map[string]time.Time
}

func NewDiscoveryClient(registry *ServiceRegistry, balancer LoadBalancer) *DiscoveryClient {
    return &DiscoveryClient{
        registry:  registry,
        balancer:  balancer,
        cache:     make(map[string][]*ServiceInstance),
        cacheTTL:  30 * time.Second,
        cacheTime: make(map[string]time.Time),
    }
}

func (c *DiscoveryClient) Discover(serviceName string) (*ServiceInstance, error) {
    // 检查缓存
    if instances, ok := c.getFromCache(serviceName); ok {
        if len(instances) > 0 {
            return c.balancer.NextInstance(instances)
        }
    }

    // 从注册表获取
    c.registry.mu.RLock()
    instances := c.registry.services[serviceName]
    c.registry.mu.RUnlock()

    if len(instances) == 0 {
        return nil, fmt.Errorf("no instances found for %s", serviceName)
    }

    // 过滤健康实例
    healthy := c.filterHealthy(instances)
    if len(healthy) == 0 {
        return nil, fmt.Errorf("no healthy instances for %s", serviceName)
    }

    // 更新缓存
    c.updateCache(serviceName, healthy)

    return c.balancer.NextInstance(healthy)
}

func (c *DiscoveryClient) filterHealthy(instances []*ServiceInstance) []*ServiceInstance {
    healthy := make([]*ServiceInstance, 0)
    for _, instance := range instances {
        if instance.Status == StatusRunning &&
           time.Since(instance.LastHeartbeat) < 30*time.Second {
            healthy = append(healthy, instance)
        }
    }
    return healthy
}

func (c *DiscoveryClient) getFromCache(serviceName string) ([]*ServiceInstance, bool) {
    c.cacheMu.RLock()
    defer c.cacheMu.RUnlock()

    cacheTime, exists := c.cacheTime[serviceName]
    if !exists || time.Since(cacheTime) > c.cacheTTL {
        return nil, false
    }

    instances, exists := c.cache[serviceName]
    return instances, exists
}

func (c *DiscoveryClient) updateCache(serviceName string, instances []*ServiceInstance) {
    c.cacheMu.Lock()
    defer c.cacheMu.Unlock()

    c.cache[serviceName] = instances
    c.cacheTime[serviceName] = time.Now()
}
```

## 健康检查

### 健康检查器

```go
type HealthChecker struct {
    registry    *ServiceRegistry
    interval    time.Duration
    timeout     time.Duration
    stopCh      chan struct{}
}

type HealthCheck struct {
    ServiceName string
    InstanceID  string
    Endpoint    string
}

func NewHealthChecker(registry *ServiceRegistry, interval time.Duration) *HealthChecker {
    return &HealthChecker{
        registry: registry,
        interval: interval,
        timeout:  10 * time.Second,
        stopCh:   make(chan struct{}),
    }
}

func (h *HealthChecker) Start() {
    ticker := time.NewTicker(h.interval)
    defer ticker.Stop()

    for {
        select {
        case <-ticker.C:
            h.checkAllServices()
        case <-h.stopCh:
            return
        }
    }
}

func (h *HealthChecker) Stop() {
    close(h.stopCh)
}

func (h *HealthChecker) checkAllServices() {
    h.registry.mu.RLock()
    defer h.registry.mu.RUnlock()

    for serviceName, instances := range h.registry.services {
        for _, instance := range instances {
            go h.checkService(serviceName, instance)
        }
    }
}

func (h *HealthChecker) checkService(serviceName string, instance *ServiceInstance) {
    url := fmt.Sprintf("http://%s:%d/health", instance.Address, instance.Port)

    ctx, cancel := context.WithTimeout(context.Background(), h.timeout)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        h.markUnhealthy(serviceName, instance.ID)
        return
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        h.markUnhealthy(serviceName, instance.ID)
        return
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        h.markUnhealthy(serviceName, instance.ID)
        return
    }

    // 更新心跳时间
    h.registry.Heartbeat(serviceName, instance.ID)
}

func (h *HealthChecker) markUnhealthy(serviceName, instanceID string) {
    h.registry.mu.Lock()
    defer h.registry.mu.Unlock()

    instances := h.registry.services[serviceName]
    for _, instance := range instances {
        if instance.ID == instanceID {
            instance.Status = StatusStopped
            break
        }
    }
}
```

### 服务健康端点

```go
func HealthHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // 检查数据库连接
        if err := checkDatabase(); err != nil {
            w.WriteHeader(503)
            json.NewEncoder(w).Encode(map[string]string{
                "status": "unhealthy",
                "error":  "database unavailable",
            })
            return
        }

        // 检查 Redis 连接
        if err := checkRedis(); err != nil {
            w.WriteHeader(503)
            json.NewEncoder(w).Encode(map[string]string{
                "status": "unhealthy",
                "error":  "redis unavailable",
            })
            return
        }

        w.WriteHeader(200)
        json.NewEncoder(w).Encode(map[string]string{
            "status": "healthy",
        })
    }
}

func ReadyHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // 检查服务是否就绪
        if !isReady() {
            w.WriteHeader(503)
            return
        }

        w.WriteHeader(200)
        json.NewEncoder(w).Encode(map[string]string{
            "status": "ready",
        })
    }
}
```

## 注册中心

### Consul 注册

```go
type ConsulRegistry struct {
    client *consul.Client
}

func NewConsulRegistry(addr string) (*ConsulRegistry, error) {
    config := consul.DefaultConfig()
    config.Address = addr

    client, err := consul.NewClient(config)
    if err != nil {
        return nil, err
    }

    return &ConsulRegistry{client: client}, nil
}

func (r *ConsulRegistry) Register(serviceName, instanceID, address string, port int, metadata map[string]string) error {
    registration := &consul.AgentServiceRegistration{
        ID:      instanceID,
        Name:    serviceName,
        Address: address,
        Port:    port,
        Meta:    metadata,
        Check: &consul.AgentServiceCheck{
            HTTP:                           fmt.Sprintf("http://%s:%d/health", address, port),
            Interval:                       "10s",
            Timeout:                        "5s",
            DeregisterCriticalServiceAfter: "30s",
        },
    }

    return r.client.Agent().ServiceRegister(registration)
}

func (r *ConsulRegistry) Deregister(instanceID string) error {
    return r.client.Agent().ServiceDeregister(instanceID)
}

func (r *ConsulRegistry) Discover(serviceName string) ([]*ServiceInstance, error) {
    services, _, err := r.client.Health().Service(serviceName, "", true, nil)
    if err != nil {
        return nil, err
    }

    instances := make([]*ServiceInstance, len(services))
    for i, service := range services {
        instances[i] = &ServiceInstance{
            ID:      service.Service.ID,
            Name:    service.Service.Service,
            Address: service.Service.Address,
            Port:    service.Service.Port,
            Metadata: service.Service.Meta,
            Status:  StatusRunning,
        }
    }

    return instances, nil
}
```

### Etcd 注册

```go
type EtcdRegistry struct {
    client *clientv3.Client
}

func NewEtcdRegistry(endpoints []string) (*EtcdRegistry, error) {
    cli, err := clientv3.New(clientv3.Config{
        Endpoints: endpoints,
    })
    if err != nil {
        return nil, err
    }

    return &EtcdRegistry{client: cli}, nil
}

func (r *EtcdRegistry) Register(serviceName, instanceID, address string, port int, ttl int) error {
    key := fmt.Sprintf("/services/%s/%s", serviceName, instanceID)

    value := fmt.Sprintf("%s:%d", address, port)

    // 创建租约
    lease, err := r.client.Grant(context.Background(), int64(ttl))
    if err != nil {
        return err
    }

    // 注册服务
    _, err = r.client.Put(context.Background(), key, value, clientv3.WithLease(lease.ID))
    if err != nil {
        return err
    }

    // 保持心跳
    go r.keepAlive(key, lease.ID, time.Duration(ttl/2)*time.Second)

    return nil
}

func (r *EtcdRegistry) keepAlive(key string, leaseID clientv3.LeaseID, interval time.Duration) {
    ticker := time.NewTicker(interval)
    defer ticker.Stop()

    ch, kaerr := r.client.KeepAlive(context.Background(), leaseID)
    if kaerr != nil {
        log.Printf("KeepAlive failed: %v", kaerr)
        return
    }

    for {
        select {
        case ka := <-ch:
            if ka == nil {
                log.Printf("KeepAlive channel closed")
                return
            }
        case <-ticker.C:
            _, err := r.client.KeepAliveOnce(context.Background(), leaseID)
            if err != nil {
                log.Printf("KeepAliveOnce failed: %v", err)
                return
            }
        }
    }
}

func (r *EtcdRegistry) Discover(serviceName string) ([]*ServiceInstance, error) {
    prefix := fmt.Sprintf("/services/%s/", serviceName)

    resp, err := r.client.Get(context.Background(), prefix, clientv3.WithPrefix())
    if err != nil {
        return nil, err
    }

    instances := make([]*ServiceInstance, len(resp.Kvs))
    for i, kv := range resp.Kvs {
        parts := strings.Split(string(kv.Key), "/")
        instanceID := parts[len(parts)-1]

        address, port, err := parseAddress(string(kv.Value))
        if err != nil {
            continue
        }

        instances[i] = &ServiceInstance{
            ID:      instanceID,
            Name:    serviceName,
            Address: address,
            Port:    port,
            Status:  StatusRunning,
        }
    }

    return instances, nil
}

func parseAddress(value string) (string, int, error) {
    parts := strings.Split(value, ":")
    if len(parts) != 2 {
        return "", 0, fmt.Errorf("invalid address format")
    }

    port, err := strconv.Atoi(parts[1])
    if err != nil {
        return "", 0, err
    }

    return parts[0], port, nil
}
```

## 最佳实践

::: tip 服务发现建议

1. **心跳检测** - 定期检查服务健康状态
2. **负载均衡** - 使用多种均衡策略
3. **本地缓存** - 减少注册中心压力
4. **优雅下线** - 注销前完成请求处理
5. **故障隔离** - 自动剔除不健康实例

:::

```go
// ✅ 好的服务注册模式
func registerService() {
    // 1. 创建服务实例
    instance := &ServiceInstance{
        ID:      getInstanceID(),
        Name:    "user-service",
        Address: getLocalIP(),
        Port:    8001,
    }

    // 2. 注册到注册中心
    registry.Register(instance)

    // 3. 启动健康检查
    healthChecker := NewHealthChecker(registry, 10*time.Second)
    go healthChecker.Start()

    // 4. 处理退出信号
    handleShutdown(func() {
        registry.Deregister(instance.ID)
        healthChecker.Stop()
    })
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **服务注册** - 动态注册实例 |
| **服务发现** - 查找服务实例 |
| **健康检查** - 监控实例状态 |
| **负载均衡** - 分发请求 |
| **Consul/Etcd** - 注册中心 |

::: v-pre

[服务通信](./communication.md) → [弹性设计](./resilience.md)

:::
