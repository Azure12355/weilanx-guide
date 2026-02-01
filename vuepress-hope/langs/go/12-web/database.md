---
title: 数据库操作
icon: ri:database-2-line
order: 6
---

# 数据库操作

Go 中数据库操作的常见模式和最佳实践。

## database/sql

### 基本连接

```go
import "database/sql"

func connectDB(dsn string) (*sql.DB, error) {
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        return nil, err
    }

    // 测试连接
    if err := db.Ping(); err != nil {
        return nil, err
    }

    // 设置连接池
    db.SetMaxOpenConns(100)
    db.SetMaxIdleConns(10)
    db.SetConnMaxLifetime(time.Hour)

    return db, nil
}

// 使用
func main() {
    db, err := connectDB("user:password@tcp(localhost:3306)/dbname")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
}
```

### CRUD 操作

```go
// Create
func createUser(db *sql.DB, user *User) error {
    query := `INSERT INTO users (name, email) VALUES (?, ?)`
    result, err := db.Exec(query, user.Name, user.Email)
    if err != nil {
        return err
    }

    id, _ := result.LastInsertId()
    user.ID = int(id)

    return nil
}

// Read
func getUser(db *sql.DB, id int) (*User, error) {
    var user User
    query := `SELECT id, name, email FROM users WHERE id = ?`
    err := db.QueryRow(query, id).Scan(&user.ID, &user.Name, &user.Email)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// Update
func updateUser(db *sql.DB, user *User) error {
    query := `UPDATE users SET name = ?, email = ? WHERE id = ?`
    _, err := db.Exec(query, user.Name, user.Email, user.ID)
    return err
}

// Delete
func deleteUser(db *sql.DB, id int) error {
    query := `DELETE FROM users WHERE id = ?`
    _, err := db.Exec(query, id)
    return err
}
```

### 查询操作

```go
// 查询单行
func getUserByEmail(db *sql.DB, email string) (*User, error) {
    var user User
    query := `SELECT id, name, email FROM users WHERE email = ?`
    err := db.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// 查询多行
func listUsers(db *sql.DB, limit int) ([]User, error) {
    query := `SELECT id, name, email FROM users LIMIT ?`
    rows, err := db.Query(query, limit)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
            return nil, err
        }
        users = append(users, user)
    }

    return users, rows.Err()
}
```

## 事务处理

### 基本事务

```go
func transferMoney(db *sql.DB, fromID, toID int, amount float64) error {
    // 开始事务
    tx, err := db.Begin()
    if err != nil {
        return err
    }

    defer func() {
        if err != nil {
            tx.Rollback()
        }
    }()

    // 扣款
    _, err = tx.Exec(`UPDATE accounts SET balance = balance - ? WHERE id = ?`, amount, fromID)
    if err != nil {
        return err
    }

    // 存款
    _, err = tx.Exec(`UPDATE accounts SET balance = balance + ? WHERE id = ?`, amount, toID)
    if err != nil {
        return err
    }

    // 提交事务
    if err := tx.Commit(); err != nil {
        return err
    }

    return nil
}
```

### 隔离级别

```go
func transactionWithIsolation(db *sql.DB) error {
    tx, err := db.BeginTx(context.Background(), &sql.TxOptions{
        Isolation: sql.LevelSerializable,
    })
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // 执行操作
    _, err = tx.Exec("UPDATE users SET name = ? WHERE id = ?", "Alice", 1)
    if err != nil {
        return err
    }

    return tx.Commit()
}
```

## ORM 框架

### GORM 基本使用

```go
import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

type User struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
    Name      string    `json:"name" gorm:"size:255"`
    Email     string    `json:"email" gorm:"uniqueIndex;size:255"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

// 连接数据库
func connectGORM(dsn string) (*gorm.DB, error) {
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, err
    }

    // 自动迁移
    db.AutoMigrate(&User{})

    return db, nil
}

// CRUD 操作
func gormCRUD(db *gorm.DB) {
    // Create
    user := User{Name: "Alice", Email: "alice@example.com"}
    db.Create(&user)

    // Read
    var result User
    db.First(&result, 1)
    db.Where("name = ?", "Alice").First(&result)

    // Update
    db.Model(&user).Update("name", "Bob")

    // Delete
    db.Delete(&user)
}
```

### 关联关系

```go
type User struct {
    ID      uint      `json:"id" gorm:"primaryKey"`
    Name    string    `json:"name"`
    Orders  []Order   `json:"orders" gorm:"foreignKey:UserID"`
}

type Order struct {
    ID     uint   `json:"id" gorm:"primaryKey"`
    UserID uint   `json:"user_id" gorm:"index"`
    Amount float64 `json:"amount"`
}

// Preload 关联
func getUserWithOrders(db *gorm.DB, userID uint) (*User, error) {
    var user User
    err := db.Preload("Orders").First(&user, userID).Error
    return &user, err
}

// 创建关联
func createOrder(db *gorm.DB, userID uint) error {
    order := Order{UserID: userID, Amount: 100.0}
    return db.Create(&order).Error
}
```

### 钩子

```go
// BeforeCreate
func (u *User) BeforeCreate(tx *gorm.DB) error {
    u.CreatedAt = time.Now()
    return nil
}

// AfterCreate
func (u *User) AfterCreate(tx *gorm.DB) error {
    log.Printf("User created: %v", u.ID)
    return nil
}

// BeforeUpdate
func (u *User) BeforeUpdate(tx *gorm.DB) error {
    u.UpdatedAt = time.Now()
    return nil
}
```

## SQL Builder

### Squirrel

```go
import "github.com/Masterminds/squirrel"

func squirrelQuery(db *sql.DB) ([]User, error) {
    // 构建查询
    query, args, _ := squirrel.
        Select("id", "name", "email").
        From("users").
        Where(squirrel.Eq{"status": "active"}).
        Where(squirrel.Gt{"created_at": time.Now().AddDate(-30, 0, 0)}).
        Limit(10).
        ToSql()

    // 执行查询
    rows, err := db.Query(query, args...)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
            return nil, err
        }
        users = append(users, user)
    }

    return users, nil
}
```

### sqlx

```go
import "github.com/jmoiron/sqlx"

func sqlxQuery(db *sqlx.DB) ([]User, error) {
    var users []User

    // 查询并自动扫描
    err := db.Select(&users).
        Query("SELECT id, name, email FROM users WHERE status = ?", "active")

    return users, err
}

// 事务
func sqlxTransaction(db *sqlx.DB) error {
    tx, err := db.BeginTxx(context.Background(), nil)
    if err != nil {
        return err
    }

    _, err = tx.Exec("UPDATE users SET name = ? WHERE id = ?", "Alice", 1)
    if err != nil {
        tx.Rollback()
        return err
    }

    return tx.Commit()
}
```

## 连接池管理

### 连接池配置

```go
func configurePool(db *sql.DB) {
    // 最大打开连接数
    db.SetMaxOpenConns(100)

    // 最大空闲连接数
    db.SetMaxIdleConns(10)

    // 连接最大生命周期
    db.SetConnMaxLifetime(time.Hour)

    // 连接最大空闲时间
    db.SetConnMaxIdleTime(10 * time.Minute)
}
```

### 连接健康检查

```go
func healthCheck(db *sql.DB) error {
    // Ping 测试连接
    if err := db.Ping(); err != nil {
        return fmt.Errorf("database ping failed: %w", err)
    }

    // 检查连接状态
    stats := db.Stats()
    if stats.OpenConnections >= stats.MaxOpenConnections {
        return fmt.Errorf("connection pool exhausted")
    }

    return nil
}
```

## 数据库迁移

### 迁移工具

```go
// 使用 migrate 库
import "github.com/golang-migrate/migrate"

func runMigrations() error {
    m, err := migrate.New(
        "mysql://user:password@tcp(localhost:3306)/dbname",
        "file://migrations",
    )
    if err != nil {
        return err
    }

    // 执行迁移
    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        return err
    }

    return nil
}

// 迁移文件
// migrations/20240101000001_create_users_table.up.sql
// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
```

## 最佳实践

::: tip 数据库操作建议

1. **使用事务** - 确保数据一致性
2. **预处理语句** - 防止 SQL 注入
3. **连接池** - 合理配置连接池
4. **错误处理** - 正确处理数据库错误
5. **资源清理** - 使用 defer 关闭资源

:::

```go
// ✅ 好的模式
func goodDBOperation(db *sql.DB) error {
    // 使用事务
    tx, _ := db.Begin()
    defer tx.Rollback()

    // 预处理语句
    stmt, _ := tx.Prepare("INSERT INTO users (name) VALUES (?)")
    defer stmt.Close()

    // 执行
    if _, err := stmt.Exec("Alice"); err != nil {
        return err
    }

    return tx.Commit()
}
```

## 总结

| 方面 | 关键点 |
|------|--------|
| **database/sql** | 标准库数据库操作 |
| **GORM** | 流行的 ORM 框架 |
| **事务** | Begin、Commit、Rollback |
| **连接池** | SetMaxOpenConns |
| **迁移** | golang-migrate |

::: v-pre

[中间件](./middleware.md) → [安全](./security.md)

:::
