---
title: 配置管理
icon: ri:settings-3-line
order: 4
---

# 配置管理

良好的配置管理让应用更灵活、更易部署。

## 配置结构

### 配置定义

```go
type Config struct {
    Server   ServerConfig   `mapstructure:"server"`
    Database DatabaseConfig `mapstructure:"database"`
    Redis    RedisConfig    `mapstructure:"redis"`
    Log      LogConfig      `mapstructure:"log"`
    Features FeatureFlags   `mapstructure:"features"`
}

type ServerConfig struct {
    Host         string `mapstructure:"host"`
    Port         int    `mapstructure:"port"`
    Mode         string `mapstructure:"mode"`         // debug, release, test
    ReadTimeout  int    `mapstructure:"read_timeout"`  // 秒
    WriteTimeout int    `mapstructure:"write_timeout"` // 秒
}

type DatabaseConfig struct {
    Driver          string `mapstructure:"driver"`
    Host            string `mapstructure:"host"`
    Port            int    `mapstructure:"port"`
    User            string `mapstructure:"user"`
    Password        string `mapstructure:"password"`
    Database        string `mapstructure:"database"`
    MaxOpenConns    int    `mapstructure:"max_open_conns"`
    MaxIdleConns    int    `mapstructure:"max_idle_conns"`
    ConnMaxLifetime int    `mapstructure:"conn_max_lifetime"` // 秒
}

type RedisConfig struct {
    Host     string `mapstructure:"host"`
    Port     int    `mapstructure:"port"`
    Password string `mapstructure:"password"`
    DB       int    `mapstructure:"db"`
}

type LogConfig struct {
    Level  string `mapstructure:"level"`   // debug, info, warn, error
    Format string `mapstructure:"format"` // json, console
}

type FeatureFlags struct {
    EnableCache    bool `mapstructure:"enable_cache"`
    EnableMetrics  bool `mapstructure:"enable_metrics"`
    EnableTracing  bool `mapstructure:"enable_tracing"`
}
```

## 配置文件

### YAML 配置

```yaml
# config/config.yaml
server:
  host: "0.0.0.0"
  port: 8080
  mode: "release"
  read_timeout: 60
  write_timeout: 60

database:
  driver: "mysql"
  host: "localhost"
  port: 3306
  user: "app"
  password: "secret"
  database: "myapp"
  max_open_conns: 100
  max_idle_conns: 10
  conn_max_lifetime: 3600

redis:
  host: "localhost"
  port: 6379
  password: ""
  db: 0

log:
  level: "info"
  format: "json"

features:
  enable_cache: true
  enable_metrics: true
  enable_tracing: false
```

### 环境特定配置

```yaml
# config/config.dev.yaml
server:
  mode: "debug"
log:
  level: "debug"

# config/config.prod.yaml
server:
  mode: "release"
log:
  level: "info"
```

## 加载配置

### 使用 Viper

```go
import "github.com/spf13/viper"

func LoadConfig(configPath string) (*Config, error) {
    v := viper.New()

    // 设置配置文件
    v.SetConfigFile(configPath)
    v.SetConfigType("yaml")

    // 读取环境变量
    v.AutomaticEnv()
    v.SetEnvPrefix("APP")
    v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

    // 读取配置文件
    if err := v.ReadInConfig(); err != nil {
        return nil, fmt.Errorf("failed to read config: %w", err)
    }

    // 解析配置
    var config Config
    if err := v.Unmarshal(&config); err != nil {
        return nil, fmt.Errorf("failed to unmarshal config: %w", err)
    }

    // 验证配置
    if err := validateConfig(&config); err != nil {
        return nil, err
    }

    return &config, nil
}

func validateConfig(cfg *Config) error {
    if cfg.Server.Port <= 0 || cfg.Server.Port > 65535 {
        return fmt.Errorf("invalid server port: %d", cfg.Server.Port)
    }

    if cfg.Database.Host == "" {
        return fmt.Errorf("database host is required")
    }

    return nil
}
```

### 环境变量优先

```go
func loadConfigWithEnv() (*Config, error) {
    v := viper.New()

    // 默认值
    setDefaults(v)

    // 绑定环境变量
    v.BindEnv("server.port", "APP_SERVER_PORT")
    v.BindEnv("database.host", "APP_DB_HOST")
    v.BindEnv("database.password", "APP_DB_PASSWORD")

    // 读取配置文件（可选）
    v.SetConfigName("config")
    v.SetConfigType("yaml")
    v.AddConfigPath("./config")
    v.ReadInConfig()

    var config Config
    if err := v.Unmarshal(&config); err != nil {
        return nil, err
    }

    return &config, nil
}

func setDefaults(v *viper.Viper) {
    v.SetDefault("server.host", "0.0.0.0")
    v.SetDefault("server.port", 8080)
    v.SetDefault("server.mode", "release")
    v.SetDefault("log.level", "info")
}
```

## 敏感信息

### 环境变量

```go
// 敏感信息通过环境变量传递
func loadSensitiveConfig() (*DatabaseConfig, error) {
    cfg := &DatabaseConfig{
        User:     getEnv("DB_USER", "app"),
        Password: getEnv("DB_PASSWORD", ""),
        Host:     getEnv("DB_HOST", "localhost"),
        Port:     parseInt(getEnv("DB_PORT", "3306")),
    }

    if cfg.Password == "" {
        return nil, fmt.Errorf("DB_PASSWORD is required")
    }

    return cfg, nil
}

func getEnv(key, defaultVal string) string {
    if val := os.Getenv(key); val != "" {
        return val
    }
    return defaultVal
}
```

### 密钥管理

```go
import "github.com/sirupsen/logrus"

type SecureConfig struct {
    // 敏感字段不导出
    dbPassword string
    apiSecret  string
}

func (c *SecureConfig) GetDBPassword() string {
    return c.dbPassword
}

func (c *SecureConfig) GetAPISecret() string {
    return c.apiSecret
}

// 从密钥管理系统加载
func loadFromVault(vaultAddr, vaultToken string) (*SecureConfig, error) {
    // 使用 Vault API
    client := vault.NewClient(vaultAddr, vaultToken)

    secret, err := client.GetSecret("secret/myapp")
    if err != nil {
        return nil, err
    }

    return &SecureConfig{
        dbPassword: secret["db_password"].(string),
        apiSecret:  secret["api_secret"].(string),
    }, nil
}
```

## 配置热加载

### 监听配置变化

```go
type ConfigManager struct {
    mu     sync.RWMutex
    config *Config
    path   string
}

func NewConfigManager(path string) (*ConfigManager, error) {
    cm := &ConfigManager{path: path}

    config, err := LoadConfig(path)
    if err != nil {
        return nil, err
    }
    cm.config = config

    // 启动文件监听
    go cm.watchConfig()

    return cm, nil
}

func (cm *ConfigManager) watchConfig() {
    watcher, err := fsnotify.NewWatcher()
    if err != nil {
        log.Printf("Failed to create watcher: %v", err)
        return
    }
    defer watcher.Close()

    watcher.Add(cm.path)

    for {
        select {
        case event, ok := <-watcher.Events:
            if !ok {
                return
            }

            if event.Op&fsnotify.Write == fsnotify.Write {
                log.Println("Config file modified, reloading...")

                newConfig, err := LoadConfig(cm.path)
                if err != nil {
                    log.Printf("Failed to reload config: %v", err)
                    continue
                }

                cm.mu.Lock()
                cm.config = newConfig
                cm.mu.Unlock()

                log.Println("Config reloaded successfully")
            }

        case err, ok := <-watcher.Errors:
            if !ok {
                return
            }
            log.Printf("Watcher error: %v", err)
        }
    }
}

func (cm *ConfigManager) GetConfig() *Config {
    cm.mu.RLock()
    defer cm.mu.RUnlock()
    return cm.config
}
```

## 配置验证

### 结构体验证

```go
// 使用 validator 标签
type Config struct {
    Server   ServerConfig `validate:"required"`
    Database DatabaseConfig `validate:"required"`
}

type ServerConfig struct {
    Host string `validate:"required,hostname|ip"`
    Port int    `validate:"required,min=1,max=65535"`
}

func validateConfig(cfg *Config) error {
    validate := validator.New()

    if err := validate.Struct(cfg); err != nil {
        return fmt.Errorf("config validation failed: %w", err)
    }

    return nil
}
```

### 自定义验证

```go
func validateDatabase(cfg *DatabaseConfig) error {
    // 检查必需字段
    if cfg.Host == "" {
        return fmt.Errorf("database host is required")
    }

    if cfg.Database == "" {
        return fmt.Errorf("database name is required")
    }

    // 检查连接数
    if cfg.MaxOpenConns < 1 {
        return fmt.Errorf("max_open_conns must be >= 1")
    }

    if cfg.MaxIdleConns > cfg.MaxOpenConns {
        return fmt.Errorf("max_idle_conns cannot exceed max_open_conns")
    }

    // 测试连接
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s",
        cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Database)

    db, err := sql.Open(cfg.Driver, dsn)
    if err != nil {
        return fmt.Errorf("failed to open database: %w", err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        return fmt.Errorf("failed to ping database: %w", err)
    }

    return nil
}
```

## 配置注入

### 使用 Wire

```go
//go:build wireinject
// +build wireinject

package app

import "github.com/google/wire"

func InitializeApp(configPath string) (*App, error) {
    wire.Build(
        LoadConfig,
        NewDatabase,
        NewRedis,
        NewLogger,
        NewServer,
        NewApp,
    )
    return &App{}, nil
}

// wire.go
func LoadConfig(configPath string) (*Config, error) {
    return LoadConfig(configPath)
}
```

## 最佳实践

::: tip 配置建议

1. **分层配置** - 默认值、配置文件、环境变量
2. **环境变量** - 敏感信息使用环境变量
3. **验证** - 启动时验证配置有效性
4. **热加载** - 开发环境支持配置热加载
5. **文档** - 配置文件应有注释说明

:::

```go
// ✅ 好的模式
func goodConfig() {
    // 1. 默认值
    cfg := defaultConfig()

    // 2. 配置文件
    if err := loadFromFile(&cfg); err != nil {
        log.Printf("Using default config: %v", err)
    }

    // 3. 环境变量覆盖
    overrideFromEnv(&cfg)

    // 4. 验证
    if err := validateConfig(&cfg); err != nil {
        log.Fatal(err)
    }
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **Viper** - 强大的配置库 |
| **分层** - 默认值、文件、环境变量 |
| **验证** - 启动时验证配置 |
| **敏感** - 使用环境变量或 Vault |
| **热加载** - 监听文件变化 |

::: v-pre

[日志系统](./logging.md) → [错误处理](./error-handling.md)

:::
