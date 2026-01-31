---
title: FastAPI
icon: simple:fastapi
order: 3
---

# FastAPI

FastAPI 是现代、快速的 Web 框架，用于基于标准 Python 类型提示构建 API。

## 快速开始

### 安装

```bash
# 安装 FastAPI 和 uvicorn
pip install fastapi uvicorn

# 或安装全部依赖
pip install "fastapi[all]"

# 安装开发工具
pip install "uvicorn[standard]"
```

### Hello World

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# 运行服务器
# uvicorn main:app --reload
```

### 运行应用

```bash
# 基本运行
uvicorn main:app

# 开发模式（自动重载）
uvicorn main:app --reload

# 指定端口
uvicorn main:app --port 8000

# 指定主机
uvicorn main:app --host 0.0.0.0

# 多个工作进程
uvicorn main:app --workers 4
```

## 路径操作

### 路径参数

```python
from fastapi import FastAPI

app = FastAPI()

# 基本路径参数
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

# 类型提示
@app.get("/users/{user_id}")
def read_user(user_id: int):
    return {"user_id": user_id, "double": user_id * 2}

# 路径转换
@app.get("/files/{file_path:path}")
def read_file(file_path: str):
    return {"file_path": file_path}

# 多个路径参数
@app.get("/users/{user_id}/posts/{post_id}")
def read_user_post(user_id: int, post_id: int):
    return {"user_id": user_id, "post_id": post_id}
```

### 查询参数

```python
from typing import Optional

@app.get("/items/")
def read_items(
    skip: int = 0,
    limit: int = 10,
    q: Optional[str] = None
):
    return {
        "skip": skip,
        "limit": limit,
        "q": q
    }

# 必需查询参数
@app.get("/search/")
def search(keyword: str):
    return {"keyword": keyword}

# 多个值
@app.get("/items/")
def read_items(ids: list[int] = Query([])):
    return {"ids": ids}
```

### 请求体

```python
from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/")
def create_item(item: Item):
    return item

# 嵌套模型
class User(BaseModel):
    username: str
    full_name: Optional[str] = None

class ItemWithUser(BaseModel):
    item: Item
    user: User

@app.post("/items-with-user/")
def create_item_with_user(data: ItemWithUser):
    return data
```

## 数据验证

### Pydantic 模型

```python
from pydantic import BaseModel, Field, validator

class Item(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0, le=1000000)
    tax: Optional[float] = None

    @validator("price")
    def price_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be positive")
        return v

# 使用模型
@app.post("/items/")
def create_item(item: Item):
    return item
```

### 验证示例

```python
from pydantic import BaseModel, EmailStr, HttpUrl

class User(BaseModel):
    username: str
    email: EmailStr
    website: HttpUrl
    age: int = Field(..., ge=0, le=150)

class Product(BaseModel):
    name: str
    tags: list[str] = []
    categories: set[str] = set()
    metadata: dict[str, float | str] = {}
```

## 响应模型

### 响应类型

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float

class ItemResponse(BaseModel):
    id: int
    name: str
    price: float

@app.post("/items/", response_model=ItemResponse)
def create_item(item: Item):
    # 保存到数据库
    saved_item = save_to_db(item)
    return saved_item

# 响应模型排除字段
class UserIn(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

@app.post("/users/", response_model=UserOut)
def create_user(user: UserIn):
    return save_user(user)
```

### 响应状态码

```python
from fastapi import status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
def create_item(item: Item):
    return item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int):
    delete_item_by_id(item_id)
    return None
```

## 异常处理

### HTTPException

```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]

# 自定义异常
class ItemNotFoundException(Exception):
    pass

@app.exception_handler(ItemNotFoundException)
def item_not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"message": "Item not found"}
    )
```

## 依赖注入

### 简单依赖

```python
from fastapi import Depends, Header

def get_user_agent(user_agent: str = Header(...)):
    return user_agent

@app.get("/items/")
def read_items(user_agent: str = Depends(get_user_agent)):
    return {"user_agent": user_agent}
```

### 类依赖

```python
from fastapi import Depends

class CommonQueries:
    def __init__(
        self,
        skip: int = 0,
        limit: int = 100
    ):
        self.skip = skip
        self.limit = limit

@app.get("/items/")
def read_items(commons: CommonQueries = Depends(CommonQueries)):
    return {"skip": commons.skip, "limit": commons.limit}
```

### 子依赖

```python
def query_extractor(q: Optional[str] = None):
    return q

def query_or_cookie_extractor(
    q: str = Depends(query_extractor),
    last_query: Optional[str] = Cookie(None)
):
    if not q:
        return last_query
    return q

@app.get("/items/")
def read_query(
    query_ref: str = Depends(query_or_cookie_extractor)
):
    return {"query_ref": query_ref}
```

## 后台任务

### BackgroundTasks

```python
from fastapi import BackgroundTasks

def send_email(email: str, message: str):
    """发送邮件（后台任务）"""
    # 发送邮件逻辑
    pass

@app.post("/send-email/{email}")
def send_notification(
    email: str,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(send_email, email, "Hello!")
    return {"message": "Email sent in background"}
```

### Celery 集成

```python
from celery import Celery

celery_app = Celery(
    "tasks",
    broker="redis://localhost:6379/0"
)

@celery_app.task
def process_data(data_id: int):
    # 处理数据
    pass

@app.post("/process/{data_id}")
def process_data_endpoint(data_id: int):
    process_data.delay(data_id)
    return {"message": "Processing started"}
```

## WebSocket

### WebSocket 端点

```python
from fastapi import WebSocket

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message: {data}")
```

### WebSocket 管理

```python
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client {client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client {client_id} left")
```

## 数据库集成

### SQLAlchemy

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

Base.metadata.create_all(bind=engine)

# 依赖项
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/items/")
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
```

### Tortoise ORM

```python
from tortoise import Tortoise, fields
from tortoise.models import Model

class Item(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
    description = fields.TextField()

@app.on_event("startup")
async def startup():
    await Tortoise.init(
        db_url="sqlite://:memory:",
        modules={"models": ["__main__"]}
    )
    await Tortoise.generate_schemas()

@app.on_event("shutdown")
async def shutdown():
    await Tortoise.close_connections()

@app.get("/items/")
async def get_items():
    items = await Item.all()
    return items
```

## 认证

### JWT Token

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}
```

### API Key

```python
from fastapi import Security, HTTPException
from fastapi.security.api_key import APIKeyHeader

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header != "expected-api-key":
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key_header

@app.get("/protected")
async def protected_route(api_key: str = Depends(get_api_key)):
    return {"message": "Access granted"}
```

## CORS

### 配置 CORS

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 或使用特定配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://example.com",
        "http://www.example.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["X-Custom-Header"],
)
```

## 文档

### 自定义文档

```python
app = FastAPI(
    title="My API",
    description="This is my API description",
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "API Support",
        "email": "support@example.com"
    },
    license_info={
        "name": "MIT",
        "url": "http://opensource.org/licenses/MIT"
    },
    servers=[
        {"url": "http://localhost:8000", "description": "Development server"},
        {"url": "https://api.example.com", "description": "Production server"}
    ],
    tags=[
        {
            "name": "users",
            "description": "Operations with users"
        },
        {
            "name": "items",
            "description": "Operations with items"
        }
    ]
)
```

### 操作文档

```python
@app.get(
    "/items/{item_id}",
    tags=["items"],
    summary="Get an item",
    description="Retrieve an item by its ID",
    response_description="The retrieved item"
)
def read_item(item_id: int):
    """
    Get an item by ID.

    - **item_id**: The ID of the item to retrieve
    - **returns**: The item object
    """
    return get_item_by_id(item_id)
```

## FastAPI 最佳实践

::: tip FastAPI 建议

1. **类型提示**：充分利用类型提示
2. **Pydantic 模型**：严格验证输入/输出
3. **依赖注入**：复用代码逻辑
4. **异步操作**：数据库和 I/O 使用异步
5. **文档优先**：API 文档自动生成

::: tip 项目结构

```
project/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 应用
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py           # 依赖项
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py     # API 路由
│   │       └── endpoints/
│   │           ├── items.py
│   │           └── users.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py         # 配置
│   │   └── security.py       # 安全
│   ├── models/
│   │   ├── __init__.py
│   │   ├── item.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── item.py           # Pydantic 模型
│   │   └── user.py
│   └── services/
│       ├── __init__.py
│       └── item_service.py
├── tests/
└── alembic/
```

::: tip 性能优化

1. **使用 uvicorn workers**：多进程处理
2. **异步数据库**：使用 async 驱动
3. **缓存**：Redis 缓存热点数据
4. **CDN**：静态文件使用 CDN
5. **Gzip**：启用响应压缩

::: tip 常用扩展

- **databases**：异步数据库支持
- **alembic**：数据库迁移
- **redis**：缓存和任务队列
- **celery**：后台任务处理
- **typer**：CLI 工具
- **pytest**：测试框架
