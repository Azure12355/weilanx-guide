---
title: 导入导出
icon: ri:exchange-line
order: 4
---

# 导入导出

理解 Go 的导入导出机制，掌握代码组织的核心原则。

## 导入机制

### 导入路径

```go
// 标准库导入
import "fmt"
import "math"
import "net/http"

// 第三方库导入
import "github.com/gin-gonic/gin"
import "gorm.io/gorm"

// 本地包导入
import "example.com/myproject/utils"
```

### 导入方式

```go
// 常规导入
import "fmt"

// 别名导入
import stdfmt "fmt"

// 点导入
import . "fmt"

// 空白导入
import _ "image/png"
```

## 导出规则

### 导出标识符

```go
package calculator

// 导出：大写字母开头
func Add(a, b int) int {
    return a + b
}

// 未导出：小写字母开头
func internalAdd(a, b int) int {
    return a + b
}

// 导出变量
const Pi = 3.14159

var Version = "1.0.0"

// 未导出变量
const internalPi = 3.14

var internalVersion = "1.0"
```

### 导出结构体

```go
package models

// User 是导出的结构体
type User struct {
    ID       int
    Name     string
    email    string  // 未导出
    Password string  // 导出但应该私有
}

// NewUser 是导出的构造函数
func NewUser(name string) *User {
    return &User{
        Name: name,
    }
}

// GetName 是导出的方法
func (u *User) GetName() string {
    return u.Name
}

// setEmail 是未导出的方法
func (u *User) setEmail(email string) {
    u.email = email
}
```

## 导入最佳实践

### 分组导入

```go
// ✅ 推荐：分组导入
import (
    // 标准库
    "fmt"
    "log"
    "net/http"

    // 第三方库
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"

    // 本地包
    "example.com/myproject/config"
    "example.com/myproject/models"
)

// ❌ 不推荐：单独导入
import "fmt"
import "log"
import "net/http"
```

### 导入顺序

```go
import (
    // 1. 标准库
    "fmt"
    "log"

    // 2. 第三方库
    "github.com/gin-gonic/gin"

    // 3. 本地包
    "example.com/myproject/utils"
)
```

### 空白导入

```go
import (
    _ "github.com/lib/pq"         // 注册 PostgreSQL 驱动
    _ "github.com/go-sql-driver/mysql"  // 注册 MySQL 驱动
    _ "image/jpeg"                 // 注册 JPEG 解码器
)

// 空白导入只执行包的 init 函数
// 不使用包中的任何导出成员
```

## 导出最佳实践

### 最小化导出

```go
// ✅ 好的设计：只导出必要的成员
package user

type User struct {
    ID   int
    Name string
    // 未导出的敏感信息
    password string
    email    string
}

// 导出方法
func (u *User) SetPassword(password string) {
    u.password = hashPassword(password)
}

func (u *User) SetEmail(email string) {
    u.email = validateEmail(email)
}

// ❌ 不好的设计：导出所有成员
type User struct {
    ID       int
    Name     string
    Password string  // 直接导出
    Email    string  // 直接导出
}
```

### 接口导出

```go
// ✅ 导出接口，隐藏实现
package services

// UserService 是导出的接口
type UserService interface {
    CreateUser(name string) (*User, error)
    GetUser(id int) (*User, error)
}

// userService 是未导出的实现
type userService struct {
    db *Database
}

// NewUserService 返回导出接口
func NewUserService(db *Database) UserService {
    return &userService{db: db}
}
```

## 命名规范

### 包命名

```go
// ✅ 好的包名：小写、简洁、描述性
package http
package json
package strings
package calculator

// ❌ 不好的包名
package myPackage      // 驼峰命名
package my_package     // 下划线
package calculatorUtil // 过长
package a              // 无意义
```

### 导出命名

```go
// ✅ 好的导出命名
func GetUser() {}
func CreateOrder() {}
type DatabaseManager struct {}

// ❌ 不好的导出命名
func getUser() {}     // 未导出
func get_user() {}    // 下划线
func GETUSER() {}     // 全大写
type DBMgr struct {}  // 缩写过度
```

## 循环导入

### 问题示例

```go
// ❌ 循环导入（编译错误）

// packageA/a.go
package packageA

import "example.com/project/packageB"

func A() {
    packageB.B()
}

// packageB/b.go
package packageB

import "example.com/project/packageA"  // 循环导入！

func B() {
    packageA.A()
}
```

### 解决方案

```go
// ✅ 创建共享包
// common/common.go
package common

func CommonFunc() {}

// packageA 使用 common
package packageA

import "example.com/project/common"

func A() {
    common.CommonFunc()
}

// packageB 使用 common
package packageB

import "example.com/project/common"

func B() {
    common.CommonFunc()
}
```

## 依赖管理

### 导入依赖

```go
// 包的依赖关系应该是单向的
// main → handler → service → repository

// main.go
package main

import "example.com/project/handler"

func main() {
    handler.Start()
}

// handler/handler.go
package handler

import "example.com/project/service"

func Start() {
    service.Process()
}

// service/service.go
package service

import "example.com/project/repository"

func Process() {
    repository.Query()
}
```

### 依赖注入

```go
// ✅ 使用依赖注入避免循环依赖
package service

type UserService interface {
    GetUser(id int) (*User, error)
}

type OrderService struct {
    userService UserService
}

func NewOrderService(us UserService) *OrderService {
    return &OrderService{
        userService: us,
    }
}

func (s *OrderService) CreateOrder(userID int) error {
    // 通过接口调用，避免直接导入
    user, err := s.userService.GetUser(userID)
    if err != nil {
        return err
    }
    // ...
    return nil
}
```

## 最佳实践

::: tip 使用建议

1. **分组导入** - 标准库、第三方、本地
2. **最小化导出** - 只导出必要的成员
3. **避免循环** - 设计包时避免循环导入
4. **清晰命名** - 使用有意义的命名
5. **接口隔离** - 导出接口，隐藏实现

:::

```go
// ✅ 好的导入导出示例
package main

import (
    // 标准库
    "fmt"
    "log"

    // 第三方库
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"

    // 本地包
    "example.com/myproject/config"
    "example.com/myproject/models"
)

func main() {
    cfg := config.Load()
    db := models.ConnectDB(cfg.Database)
    router := gin.Default()

    if err := router.Run(":8080"); err != nil {
        log.Fatal(err)
    }
}
```

## 总结

| 概念 | 关键点 |
|------|--------|
| **导入** - `import "path"` |
| **导出** - 大写字母开头 |
| **分组** - 清晰组织导入 |
| **空白导入** - 执行 init 函数 |
| **避免循环** - 单向依赖 |
| **最小化** - 只导出必要的成员 |

::: v-pre

[包基础](./packages.md) → [Go Modules](./go-modules.md)

:::
