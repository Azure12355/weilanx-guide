---
title: Flask
icon: simple:flask
order: 1
---

# Flask

Flask 是一个轻量级的 Python Web 框架，适合构建小型到中型的 Web 应用和 API。

## 快速开始

### 安装和Hello World

```bash
# 安装 Flask
pip install flask

# 或者安装完整版本（包含开发依赖）
pip install "flask[dotenv]"
```

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)
```

### 运行应用

```bash
# 命令行运行
export FLASK_APP=app.py
export FLASK_ENV=development
flask run

# 指定端口
flask run --port=5000

# 指定主机
flask run --host=0.0.0.0

# Python 代码运行
python app.py
```

## 路由

### 基本路由

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Index Page"

@app.route("/hello")
def hello():
    return "Hello, World!"

@app.route("/user/<username>")
def user_profile(username):
    return f"User: {username}"

@app.route("/post/<int:post_id>")
def show_post(post_id):
    return f"Post: {post_id}"

@app.route("/path/<path:subpath>")
def show_subpath(subpath):
    return f"Subpath: {subpath}"
```

### HTTP 方法

```python
from flask import request

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        return "Login POST"
    return "Login GET"

@app.route("/api/data", methods=["GET", "POST", "PUT", "DELETE"])
def handle_data():
    method = request.method
    return f"Method: {method}"
```

### URL 构建

```python
from flask import url_for

@app.route("/")
def index():
    return "Index"

@app.route("/user/<username>")
def profile(username):
    return f"User: {username}"

@app.route("/test")
def test():
    # 生成 URL
    url = url_for("profile", username="alice")
    return f"Profile URL: {url}"
```

## 请求处理

### 请求数据

```python
from flask import request, json

@app.route("/form", methods=["POST"])
def handle_form():
    # 表单数据
    name = request.form.get("name")
    email = request.form["email"]

    # 文件上传
    file = request.files["file"]
    file.save(f"/uploads/{file.filename}")

    return f"Received: {name}, {email}"

@app.route("/api", methods=["POST"])
def handle_api():
    # JSON 数据
    data = request.get_json()
    name = data.get("name")
    return {"message": f"Hello, {name}"}

@app.route("/args")
def handle_args():
    # 查询参数
    name = request.args.get("name", "Guest")
    page = request.args.get("page", 1, type=int)
    return f"Name: {name}, Page: {page}"

@app.route("/headers")
def handle_headers():
    # 请求头
    user_agent = request.headers.get("User-Agent")
    return f"User-Agent: {user_agent}"
```

### Cookie

```python
from flask import request, make_response

@app.route("/set_cookie")
def set_cookie():
    resp = make_response("Cookie set")
    resp.set_cookie("username", "alice", max_age=3600)
    return resp

@app.route("/get_cookie")
def get_cookie():
    username = request.cookies.get("username")
    return f"Username: {username}"

@app.route("/delete_cookie")
def delete_cookie():
    resp = make_response("Cookie deleted")
    resp.delete_cookie("username")
    return resp
```

### Session

```python
from flask import session, redirect, url_for

app.secret_key = "your-secret-key-here"

@app.route("/login")
def login():
    session["username"] = "alice"
    session["logged_in"] = True
    return redirect(url_for("profile"))

@app.route("/profile")
def profile():
    if "logged_in" in session:
        username = session.get("username")
        return f"Welcome, {username}!"
    return redirect(url_for("login"))

@app.route("/logout")
def logout():
    session.clear()
    return "Logged out"
```

## 响应

### JSON 响应

```python
from flask import jsonify

@app.route("/api/users")
def get_users():
    users = [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"}
    ]
    return jsonify(users)

@app.route("/api/user/<int:id>")
def get_user(id):
    user = {"id": id, "name": "Alice"}
    return jsonify(user)
```

### 自定义响应

```python
from flask import Response

@app.route("/text")
def text_response():
    return Response("Plain text", mimetype="text/plain")

@app.route("/xml")
def xml_response():
    xml = "<?xml version='1.0'?><root>Hello</root>"
    return Response(xml, mimetype="application/xml")

@app.route("/image")
def image_response():
    with open("image.png", "rb") as f:
        image_data = f.read()
    return Response(image_data, mimetype="image/png")
```

### 状态码

```python
@app.route("/not_found")
def not_found():
    return "Not Found", 404

@app.route("/created")
def created():
    return {"id": 1}, 201

@app.route("/error")
def error():
    return {"error": "Invalid input"}, 400
```

## 模板

### Jinja2 模板

```python
from flask import render_template

@app.route("/")
def index():
    return render_template("index.html", title="Home")

@app.route("/user/<name>")
def user(name):
    return render_template("user.html", name=name)
```

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>Welcome</h1>
</body>
</html>
```

```html
<!-- templates/user.html -->
<!DOCTYPE html>
<html>
<head>
    <title>User Profile</title>
</head>
<body>
    <h1>User: {{ name }}</h1>

    {% if name == "Alice" %}
        <p>Welcome back, Alice!</p>
    {% else %}
        <p>Hello, {{ name }}!</p>
    {% endif %}

    <ul>
    {% for item in items %}
        <li>{{ item }}</li>
    {% endfor %}
    </ul>
</body>
</html>
```

### 模板继承

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}Default{% endblock %}</title>
</head>
<body>
    <header>
        {% block header %}{% endblock %}
    </header>

    <main>
        {% block content %}{% endblock %}
    </main>

    <footer>
        {% block footer %}{% endblock %}
    </footer>
</body>
</html>
```

```html
<!-- templates/index.html -->
{% extends "base.html" %}

{% block title %}Home{% endblock %}

{% block content %}
    <h1>Welcome to the home page!</h1>
{% endblock %}
```

## 静态文件

```
myapp/
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│       └── logo.png
└── templates/
```

```html
<!-- 在模板中引用静态文件 -->
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
<script src="{{ url_for('static', filename='js/script.js') }}"></script>
<img src="{{ url_for('static', filename='images/logo.png') }}" alt="Logo">
```

## 错误处理

### 错误页面

```python
from flask import render_template

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template("500.html"), 500

@app.errorhandler(Exception)
def handle_exception(e):
    return {"error": str(e)}, 500
```

### 中止请求

```python
from flask import abort

@app.route("/user/<id>")
def get_user(id):
    user = find_user(id)
    if user is None:
        abort(404, description="User not found")
    return jsonify(user)
```

## 重定向

```python
from flask import redirect, url_for

@app.route("/")
def index():
    return redirect(url_for("login"))

@app.route("/login")
def login():
    return "Login Page"

# 重定向到外部 URL
@app.route("/old")
def old_route():
    return redirect("https://example.com")
```

## RESTful API

### API 结构

```python
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    email = db.Column(db.String(120))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }

# GET /api/users - 获取所有用户
@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# GET /api/users/<id> - 获取单个用户
@app.route("/api/users/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

# POST /api/users - 创建用户
@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json()
    user = User(
        name=data["name"],
        email=data["email"]
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# PUT /api/users/<id> - 更新用户
@app.route("/api/users/<int:id>", methods=["PUT"])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    db.session.commit()
    return jsonify(user.to_dict())

# DELETE /api/users/<id> - 删除用户
@app.route("/api/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return "", 204
```

## 蓝图（Blueprints）

### 模块化应用

```python
# auth/__init__.py
from flask import Blueprint

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login")
def login():
    return "Login"

@auth_bp.route("/register")
def register():
    return "Register"
```

```python
# app.py
from flask import Flask
from auth import auth_bp

app = Flask(__name__)
app.register_blueprint(auth_bp, url_prefix="/auth")
```

### 大型应用结构

```
myapp/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── auth/
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── templates/
│   └── static/
├── config.py
└── run.py
```

## 中间件

### 请求前/后处理

```python
@app.before_request
def before_request():
    """每个请求前执行"""
    print("Before request")

@app.after_request
def after_request(response):
    """每个请求后执行"""
    print("After request")
    return response

@app.teardown_request
def teardown_request(exception):
    """请求结束后执行"""
    print("Teardown request")

@app.teardown_appcontext
def teardown_appcontext(exception):
    """应用上下文结束后执行"""
    print("Teardown appcontext")
```

### 自定义装饰器

```python
from functools import wraps
from flask import session, redirect, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "logged_in" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function

@app.route("/protected")
@login_required
def protected():
    return "Protected page"
```

## 配置管理

### 配置类

```python
class Config:
    SECRET_KEY = "your-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"

app.config.from_object(DevelopmentConfig)
```

### 环境变量

```bash
# .env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///app.db
```

```python
from dotenv import load_dotenv
load_dotenv()

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
```

## Flask 最佳实践

::: tip Flask 建议

1. **使用蓝图**：模块化应用结构
2. **环境变量**：敏感信息使用环境变量
3. **工厂模式**：使用应用工厂函数
4. **数据库迁移**：使用 Flask-Migrate
5. **表单验证**：使用 WTForms

::: tip 应用工厂

```python
def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)

    # 注册蓝图
    from auth import auth_bp
    from api import api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)

    return app
```

::: tip 常用扩展

- **Flask-SQLAlchemy**：数据库 ORM
- **Flask-Migrate**：数据库迁移
- **Flask-WTF**：表单处理和验证
- **Flask-Login**：用户认证
- **Flask-Admin**：管理界面
- **Flask-RESTful**：RESTful API
- **Flask-CORS**：跨域支持
