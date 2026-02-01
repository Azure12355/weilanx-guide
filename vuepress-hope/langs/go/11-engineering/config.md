---
title: 配置管理
icon: ri:settings-4-line
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
}

type ServerConfig struct {
    Host         string `mapstructure:"host"`
    Port         int    `mapstructure:"port"`
    Mode         string `mapstructure:"mode"`
    ReadTimeout  int    `mapstructure:"read_timeout"`
    WriteTimeout int    `mapstructure:"write_timeout"`
}

type DatabaseConfig struct {
    Driver   string `mapstructure:"driver"`
    Host     string `mapstructure:"host"`
    Port     int    `mapstructure:"port"`
    User     string `mapstructure:"user"`
    Password string `mapstructure:"password"`
    Database string `mapstructure:"database"`
}

type RedisConfig struct {
    Host     string `mapstructure:"host"`
    Port     int    `mapstructure:"port"`
    Password string `mapstructure:"password"`
    DB       int    `mapstructure:"db"`
}

type LogConfig struct {
    Level  string `mapstructure:"level"`
    Format string `mapstructure:"format"`
}
```

## 配置文件

### YAML 格式

```yaml
# config.yaml
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

redis:
  host: "localhost"
  port: 6379
  password: ""
  db: 0

log:
  level: "info"
  format: "json"
```

### 环境变量

```go
// 从环境变量加载敏感配置
func loadFromEnv() *Config {
    return &Config{
        Database: DatabaseConfig{
            Password: os.Getenv("DB_PASSWORD"),
        },
    }
}
```

## 加载配置

### 使用 Viper

```go
import "github.com/spf13/viper"

func Load(configPath string) (*Config, error) {
    v := viper.New()

    // 设置配置文件
    v.SetConfigFile(configPath)
    v.SetConfigType("yaml")

    // 读取环境变量
    v.AutomaticEnv()
    v.SetEnvPrefix("APP")
    v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

    // 读取配置
    if err := v.ReadInConfig(); err != nil {
        return nil, err
    }

    var config Config
    if err := v.Unmarshal(&config); err != nil {
        return nil, err
    }

    return &config, nil
}
```

### 配置验证

```go
func validate(cfg *Config) error {
    if cfg.Server.Port <= 0 || cfg.Server.Port > 65535 {
        return fmt.Errorf("invalid port: %d", cfg.Server.Port)
    }

    if cfg.Database.Host == "" {
        return fmt.Errorf("database host is required")
    }

    return nil
}
```

## 最佳实践

::: tip 配置建议

1. **分层配置** - 默认值、文件、环境变量
2. **敏感信息** - 使用环境变量
3. **验证** - 启动时验证配置
4. **文档** - 配置文件应有注释

:::

```go
// ✅ 好的模式
func loadGoodConfig() *Config {
    cfg := defaultConfig()

    if err := loadFromFile(&cfg); err != nil {
        log.Printf("Using defaults: %v", err)
    }

    overrideFromEnv(&cfg)

    if err := validate(&cfg); err != nil {
        log.Fatal(err)
    }

    return cfg
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **Viper** | 配置加载库 |
| **分层** | 默认值、文件、环境 |
| **验证** | 启动时验证 |
| **敏感** | 使用环境变量 |

::: v-pre

[日志系统](./logging.md) → [代码规范](./code-style.md)

:::
