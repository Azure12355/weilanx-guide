---
title: 数据库操作
icon: ri:database-2-line
order: 4
---

# 数据库操作

Python 提供了多种数据库操作方式，从简单的 SQLite 到复杂的 PostgreSQL 和 MySQL。

## SQLite

### 基本操作

```python
import sqlite3

# 连接数据库
conn = sqlite3.connect("example.db")
cursor = conn.cursor()

# 创建表
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        age INTEGER
    )
""")

# 插入数据
cursor.execute(
    "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
    ("Alice", "alice@example.com", 25)
)

# 批量插入
users = [
    ("Bob", "bob@example.com", 30),
    ("Charlie", "charlie@example.com", 35)
]
cursor.executemany(
    "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
    users
)

# 查询数据
cursor.execute("SELECT * FROM users")
users = cursor.fetchall()  # 获取所有
print(users)

# 使用行对象
conn.row_factory = sqlite3.Row
cursor.execute("SELECT * FROM users")
for row in cursor:
    print(dict(row))  # 字典形式

# 提交事务
conn.commit()

# 关闭连接
conn.close()
```

### 上下文管理器

```python
# 自动提交和关闭
def query_users():
    with sqlite3.connect("example.db") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users")
        return cursor.fetchall()

# 使用 with 自动提交
def insert_user(name, email, age):
    with sqlite3.connect("example.db") as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
            (name, email, age)
        )
        # 自动提交
```

## SQLAlchemy

### ORM 基础

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 创建引擎
engine = create_engine("sqlite:///example.db")

# 声明基类
Base = declarative_base()

# 定义模型
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)
    age = Column(Integer)

    def __repr__(self):
        return f"<User(name={self.name}, email={self.email})>"

# 创建表
Base.metadata.create_all(engine)

# 创建会话
Session = sessionmaker(bind=engine)
session = Session()
```

### CRUD 操作

```python
# Create
user = User(name="Alice", email="alice@example.com", age=25)
session.add(user)
session.commit()

# Read
user = session.query(User).filter_by(name="Alice").first()
all_users = session.query(User).all()

# Update
user.age = 26
session.commit()

# Delete
session.delete(user)
session.commit()

# 批量操作
session.bulk_insert_mappings(User, [
    {"name": "Bob", "email": "bob@example.com", "age": 30},
    {"name": "Charlie", "email": "charlie@example.com", "age": 35}
])
session.commit()
```

### 复杂查询

```python
from sqlalchemy import or_, and_, func

# 过滤
users = session.query(User).filter(User.age > 25).all()

# 多条件
users = session.query(User).filter(
    and_(User.age > 25, User.age < 40)
).all()

# OR 条件
users = session.query(User).filter(
    or_(User.name == "Alice", User.name == "Bob")
).all()

# 排序
users = session.query(User).order_by(User.age.desc()).all()

# 限制
users = session.query(User).limit(10).all()

# 聚合
count = session.query(func.count(User.id)).scalar()
avg_age = session.query(func.avg(User.age)).scalar()

# JOIN
class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    city = Column(String(50))
    user = relationship("User", back_populates="addresses")

User.addresses = relationship("Address", order_by=Address.id)

# 使用 JOIN
results = session.query(User, Address).join(Address).all()
```

### 事务管理

```python
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)

# 上下文管理器（自动提交/回滚）
with Session() as session:
    user = User(name="Alice", email="alice@example.com")
    session.add(user)
    # 自动提交

# 手动控制
session = Session()
try:
    user = User(name="Bob", email="bob@example.com")
    session.add(user)
    session.commit()
except:
    session.rollback()
    raise
finally:
    session.close()
```

## Alembic 迁移

### 初始化

```bash
# 安装
pip install alembic

# 初始化
alembic init alembic

# 配置 alembic.ini
# sqlalchemy.url = sqlite:///example.db
```

### 创建迁移

```bash
# 生成迁移脚本
alembic revision --autogenerate -m "Add users table"

# 执行迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1

# 查看迁移历史
alembic history
```

### 迁移脚本

```python
# alembic/versions/001_add_users_table.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("email", sa.String(100), unique=True),
        sa.Column("age", sa.Integer()),
    )

def downgrade():
    op.drop_table("users")
```

## PostgreSQL

### psycopg2

```python
import psycopg2
from psycopg2.extras import RealDictCursor

# 连接
conn = psycopg2.connect(
    host="localhost",
    database="mydb",
    user="user",
    password="password"
)

# 使用字典游标
cursor = conn.cursor(cursor_factory=RealDictCursor)

# 查询
cursor.execute("SELECT * FROM users")
users = cursor.fetchall()

# 插入
cursor.execute(
    "INSERT INTO users (name, email) VALUES (%s, %s)",
    ("Alice", "alice@example.com")
)

# 批量插入
data = [("Bob", "bob@example.com"), ("Charlie", "charlie@example.com")]
cursor.executemany(
    "INSERT INTO users (name, email) VALUES (%s, %s)",
    data
)

conn.commit()
cursor.close()
conn.close()
```

### SQLAlchemy PostgreSQL

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# PostgreSQL 连接
engine = create_engine(
    "postgresql://user:password@localhost/mydb"
)

# 或使用 psycopg2
engine = create_engine(
    "postgresql+psycopg2://user:password@localhost/mydb"
)

Session = sessionmaker(bind=engine)
session = Session()
```

## MongoDB

### PyMongo

```python
from pymongo import MongoClient

# 连接
client = MongoClient("mongodb://localhost:27017/")
db = client["mydb"]
collection = db["users"]

# 插入
user = {"name": "Alice", "email": "alice@example.com", "age": 25}
result = collection.insert_one(user)
print(f"Inserted ID: {result.inserted_id}")

# 批量插入
users = [
    {"name": "Bob", "email": "bob@example.com"},
    {"name": "Charlie", "email": "charlie@example.com"}
]
result = collection.insert_many(users)

# 查询
user = collection.find_one({"name": "Alice"})
all_users = collection.find({"age": {"$gt": 25}})

# 更新
collection.update_one(
    {"name": "Alice"},
    {"$set": {"age": 26}}
)

# 删除
collection.delete_one({"name": "Alice"})
```

### Motor（异步）

```python
from motor.motor_asyncio import AsyncIOMotorClient

# 连接
client = AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["mydb"]
collection = db["users"]

# 异步操作
async def create_user(name, email):
    user = {"name": name, "email": email}
    result = await collection.insert_one(user)
    return result.inserted_id

async def find_user(name):
    user = await collection.find_one({"name": name})
    return user
```

## Redis

### 基本操作

```python
import redis

# 连接
r = redis.Redis(host="localhost", port=6379, db=0)

# 字符串
r.set("key", "value")
value = r.get("key")

# 设置过期时间
r.setex("key", 3600, "value")  # 1 小时

# 哈希
r.hset("user:1", "name", "Alice")
name = r.hget("user:1", "name")
user = r.hgetall("user:1")

# 列表
r.lpush("tasks", "task1", "task2")
task = r.rpop("tasks")

# 集合
r.sadd("tags", "python", "django", "flask")
tags = r.smembers("tags")

# 有序集合
r.zadd("ranking", {"Alice": 100, "Bob": 90})
rank = r.zrevrank("ranking", "Alice")
```

### 缓存装饰器

```python
from functools import wraps
import redis
import pickle
import hashlib

r = redis.Redis()

def cache(expire=3600):
    """缓存装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 生成缓存键
            key = f"{func.__name__}:{args}:{kwargs}"
            key_hash = hashlib.md5(key.encode()).hexdigest()

            # 尝试获取缓存
            cached = r.get(key_hash)
            if cached:
                return pickle.loads(cached)

            # 执行函数
            result = func(*args, **kwargs)

            # 存入缓存
            r.setex(key_hash, expire, pickle.dumps(result))

            return result
        return wrapper
    return decorator

@cache(expire=1800)
def expensive_function(n):
    return sum(range(n))
```

## 数据库连接池

### SQLAlchemy 连接池

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

# 配置连接池
engine = create_engine(
    "postgresql://user:password@localhost/mydb",
    poolclass=QueuePool,
    pool_size=10,           # 池大小
    max_overflow=5,         # 最大溢出
    pool_timeout=30,         # 获取连接超时
    pool_recycle=3600,       # 回收时间
    pool_pre_ping=True       # 连接检查
)
```

### psycopg2 连接池

```python
from psycopg2 import pool

# 创建连接池
connection_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host="localhost",
    database="mydb",
    user="user",
    password="password"
)

# 获取连接
conn = connection_pool.getconn()
try:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
finally:
    connection_pool.putconn(conn)  # 归还连接
```

## 数据库最佳实践

::: tip 数据库设计原则

1. **规范化**：避免数据冗余
2. **索引**：为常用查询添加索引
3. **外键**：维护数据完整性
4. **事务**：确保数据一致性
5. **备份**：定期备份数据

::: tip 性能优化

```python
# 1. 使用批量操作
session.bulk_insert_mappings(User, users_data)

# 2. 延迟加载
users = session.query(User).options(
    lazyload(User.addresses)
).all()

# 3. 只查询需要的列
users = session.query(User.name, User.email).all()

# 4. 使用索引
class User(Base):
    __tablename__ = "users"
    name = Column(String(100), index=True)  # 索引
    email = Column(String(100), unique=True)  # 唯一索引

# 5. 连接池
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40
)
```

::: tip 错误处理

```python
from sqlalchemy import exc

try:
    user = session.query(User).filter_by(id=1).one()
except exc.NoResultFound:
    print("No user found")
except exc.MultipleResultsFound:
    print("Multiple users found")
except exc.SQLAlchemyError as e:
    print(f"Database error: {e}")
```

::: tip 迁移策略

1. **版本控制**：使用 Alembic 管理迁移
2. **测试迁移**：在测试环境先测试
3. **备份**：迁移前备份数据
4. **回滚计划**：准备回滚脚本
5. **监控**：迁移后监控数据库性能
