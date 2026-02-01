---
title: 服务发现
icon: ri:search-eye-line
order: 5
---

# 服务发现

服务发现让服务实例能够动态找到彼此。

## 服务注册

### Consul 注册

```go
import "github.com/hashicorp/consul/api"

type ConsulRegistry struct {
    client *api.Client
}

func NewConsulRegistry(addr string) (*ConsulRegistry, error) {
    config := api.DefaultConfig()
    config.Address = addr

    client, err := api.NewClient(config)
    if err != nil {
        return nil, err
    }

    return &ConsulRegistry{client: client}, nil
}

func (r *ConsulRegistry) Register(serviceName, instanceID, address string, port int, tags []string) error {
    registration := &api.AgentServiceRegistration{
        ID:      instanceID,
        Name:    serviceName,
        Address: address,
        Port:    port,
        Tags:    tags,
        Check: &api.AgentServiceCheck{
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
            Tags:    service.Service.Tags,
            Status:  ServiceStatus(service.Checks.AggregatedStatus()),
        }
    }

    return instances, nil
}
```

### Etcd 注册

```go
import "go.etcd.io/etcd/client/v3"

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

    instances := make([]*ServiceInstance, 0, len(resp.Kvs))
    for _, kv := range resp.Kvs {
        address, port, err := parseAddress(string(kv.Value))
        if err != nil {
            continue
        }

        parts := strings.Split(string(kv.Key), "/")
        instanceID := parts[len(parts)-1]

        instances = append(instances, &ServiceInstance{
            ID:      instanceID,
            Name:    serviceName,
            Address: address,
            Port:    port,
            Status:  StatusRunning,
        })
    }

    return instances, nil
}

func (r *EtcdRegistry) Deregister(serviceName, instanceID string) error {
    key := fmt.Sprintf("/services/%s/%s", serviceName, instanceID)
    _, err := r.client.Delete(context.Background(), key)
    return err
}
```

### Zookeeper 注册

```go
import "github.com/go-zookeeper/zk"

type ZKRegistry struct {
    conn *zk.Conn
}

func NewZKRegistry(servers []string) (*ZKRegistry, error) {
    conn, _, err := zk.Connect(servers, time.Second*10)
    if err != nil {
        return nil, err
    }

    return &ZKRegistry{conn: conn}, nil
}

func (r *ZKRegistry) Register(serviceName, instanceID, address string, port int) error {
    path := fmt.Sprintf("/services/%s/%s", serviceName, instanceID)
    value := fmt.Sprintf("%s:%d", address, port)

    // 创建临时节点
    flags := int32(zk.FlagEphemeral)
    acl := zk.WorldACL(zk.PermAll)

    // 确保父目录存在
    r.ensurePath(fmt.Sprintf("/services/%s", serviceName))

    _, err := r.conn.Create(path, []byte(value), flags, acl)
    return err
}

func (r *ZKRegistry) Discover(serviceName string) ([]*ServiceInstance, error) {
    path := fmt.Sprintf("/services/%s", serviceName)

    children, _, err := r.conn.Children(path)
    if err != nil {
        return nil, err
    }

    instances := make([]*ServiceInstance, 0, len(children))
    for _, child := range children {
        fullPath := fmt.Sprintf("%s/%s", path, child)
        data, _, err := r.conn.Get(fullPath)
        if err != nil {
            continue
        }

        address, port, err := parseAddress(string(data))
        if err != nil {
            continue
        }

        instances = append(instances, &ServiceInstance{
            ID:      child,
            Name:    serviceName,
            Address: address,
            Port:    port,
            Status:  StatusRunning,
        })
    }

    return instances, nil
}

func (r *ZKRegistry) ensurePath(path string) error {
    flags := int32(0)
    acl := zk.WorldACL(zk.PermAll)
    return r.conn.Create(path, []byte{}, flags, acl)
}
```

## 服务发现

### 发现客户端

```go
type DiscoveryClient struct {
    registry  ServiceRegistry
    balancer  LoadBalancer
    cache     map[string][]*ServiceInstance
    cacheMu   sync.RWMutex
    cacheTTL  time.Duration
    cacheTime map[string]time.Time
}

type ServiceRegistry interface {
    Discover(serviceName string) ([]*ServiceInstance, error)
}

type LoadBalancer interface {
    NextInstance(instances []*ServiceInstance) (*ServiceInstance, error)
}

func NewDiscoveryClient(registry ServiceRegistry, balancer LoadBalancer) *DiscoveryClient {
    return &DiscoveryClient{
        registry:  registry,
        balancer:  balancer,
        cache:     make(map[string][]*ServiceInstance),
        cacheTime: make(map[string]time.Time),
        cacheTTL:  30 * time.Second,
    }
}

func (c *DiscoveryClient) GetInstance(serviceName string) (*ServiceInstance, error) {
    // 检查缓存
    if instances, ok := c.getFromCache(serviceName); ok {
        if len(instances) > 0 {
            return c.balancer.NextInstance(instances)
        }
    }

    // 从注册中心获取
    instances, err := c.registry.Discover(serviceName)
    if err != nil {
        return nil, err
    }

    if len(instances) == 0 {
        return nil, fmt.Errorf("no instances found for %s", serviceName)
    }

    // 更新缓存
    c.updateCache(serviceName, instances)

    return c.balancer.NextInstance(instances)
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

// 服务调用
func (c *DiscoveryClient) Call(ctx context.Context, serviceName string, fn func(*ServiceInstance) error) error {
    instance, err := c.GetInstance(serviceName)
    if err != nil {
        return err
    }

    return fn(instance)
}
```

## 负载均衡

### 轮询均衡

```go
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
```

### 加权轮询

```go
type WeightedRoundRobinBalancer struct {
    currentWeights map[string]int
    effectiveWeights map[string]int
    mu sync.Mutex
}

type WeightedInstance struct {
    Instance *ServiceInstance
    Weight   int
}

func NewWeightedRoundRobinBalancer() *WeightedRoundRobinBalancer {
    return &WeightedRoundRobinBalancer{
        currentWeights: make(map[string]int),
        effectiveWeights: make(map[string]int),
    }
}

func (b *WeightedRoundRobinBalancer) NextInstance(instances []*ServiceInstance) (*ServiceInstance, error) {
    if len(instances) == 0 {
        return nil, fmt.Errorf("no instances available")
    }

    b.mu.Lock()
    defer b.mu.Unlock()

    total := 0
    var best *ServiceInstance
    maxCurrent := -1

    for _, instance := range instances {
        // 获取权重
        weight := b.getWeight(instance)
        current := b.getCurrentWeight(instance) + weight

        b.setCurrentWeight(instance, current)
        total += weight

        if current > maxCurrent {
            maxCurrent = current
            best = instance
        }
    }

    if best == nil {
        return nil, fmt.Errorf("no instances available")
    }

    // 减少权重
    current := b.getCurrentWeight(best)
    b.setCurrentWeight(best, current-total)

    return best, nil
}

func (b *WeightedRoundRobinBalancer) getWeight(instance *ServiceInstance) int {
    // 从元数据获取权重
    if weightStr, ok := instance.Metadata["weight"]; ok {
        if weight, err := strconv.Atoi(weightStr); err == nil {
            return weight
        }
    }
    return 1 // 默认权重
}
```

### 最少连接

```go
type LeastConnectionsBalancer struct {
    connections map[string]int
    mu          sync.Mutex
}

func NewLeastConnectionsBalancer() *LeastConnectionsBalancer {
    return &LeastConnectionsBalancer{
        connections: make(map[string]int),
    }
}

func (b *LeastConnectionsBalancer) NextInstance(instances []*ServiceInstance) (*ServiceInstance, error) {
    if len(instances) == 0 {
        return nil, fmt.Errorf("no instances available")
    }

    b.mu.Lock()
    defer b.mu.Unlock()

    var selected *ServiceInstance
    minConns := int(^uint(0) >> 1) // Max int

    for _, instance := range instances {
        key := instance.ID
        conns := b.connections[key]

        if conns < minConns {
            minConns = conns
            selected = instance
        }
    }

    b.connections[selected.ID]++
    return selected, nil
}

func (b *LeastConnectionsBalancer) Release(instance *ServiceInstance) {
    b.mu.Lock()
    defer b.mu.Unlock()

    if b.connections[instance.ID] > 0 {
        b.connections[instance.ID]--
    }
}
```

## 健康检查

### 主动健康检查

```go
type HealthChecker struct {
    registry ServiceRegistry
    interval time.Duration
    timeout  time.Duration
    stopCh   chan struct{}
}

func NewHealthChecker(registry ServiceRegistry, interval time.Duration) *HealthChecker {
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
            h.checkAll()
        case <-h.stopCh:
            return
        }
    }
}

func (h *HealthChecker) Stop() {
    close(h.stopCh)
}

func (h *HealthChecker) checkAll() {
    // 获取所有服务
    services := h.getAllServices()

    for _, service := range services {
        go h.checkService(service)
    }
}

func (h *HealthChecker) checkService(instance *ServiceInstance) {
    url := fmt.Sprintf("http://%s:%d/health", instance.Address, instance.Port)

    ctx, cancel := context.WithTimeout(context.Background(), h.timeout)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        h.markUnhealthy(instance)
        return
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil || resp.StatusCode != 200 {
        h.markUnhealthy(instance)
        return
    }
    defer resp.Body.Close()

    h.markHealthy(instance)
}
```

## 最佳实践

::: tip 服务发现建议

1. **健康检查** - 定期检查服务状态
2. **负载均衡** - 选择合适的均衡策略
3. **本地缓存** - 减少注册中心压力
4. **优雅下线** - 注销前完成请求处理
5. **故障隔离** - 自动剔除不健康实例

:::

```go
// ✅ 好的服务发现模式
func registerService() {
    // 1. 创建服务实例
    instance := &ServiceInstance{
        ID:      getInstanceID(),
        Name:    "user-service",
        Address: getLocalIP(),
        Port:    8001,
    }

    // 2. 注册到 Consul
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
| **Consul** - 服务注册与发现 |
| **Etcd** - 分布式键值存储 |
| **Zookeeper** - 协调服务 |
| **负载均衡** - 轮询、加权、最少连接 |
| **健康检查** - 主动检查实例状态 |

::: v-pre

[gRPC](./grpc.md) → [链路追踪](./tracing.md)

:::
