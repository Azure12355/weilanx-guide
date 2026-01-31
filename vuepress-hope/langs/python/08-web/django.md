---
title: Django
icon: simple:django
order: 2
---

# Django

Django 是一个功能完整的 Python Web 框架，遵循"电池内置"哲学，提供了从数据库到模板的完整解决方案。

## 快速开始

### 安装和创建项目

```bash
# 安装 Django
pip install django

# 创建项目
django-admin startproject myproject

# 创建应用
python manage.py startapp myapp

# 运行开发服务器
python manage.py runserver
```

### 项目结构

```
myproject/
├── manage.py              # 管理脚本
├── myproject/
│   ├── __init__.py
│   ├── settings.py        # 项目配置
│   ├── urls.py            # URL 配置
│   ├── asgi.py            # ASGI 配置
│   └── wsgi.py            # WSGI 配置
└── myapp/
    ├── __init__.py
    ├── admin.py           # 管理界面
    ├── apps.py            # 应用配置
    ├── models.py          # 数据模型
    ├── tests.py           # 测试
    ├── views.py           # 视图
    ├── urls.py            # 应用 URL
    └── migrations/        # 数据库迁移
```

## 模型

### 定义模型

```python
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    birth_date = models.DateField()

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE,
        related_name="books"
    )
    published_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.title
```

### 字段类型

```python
class Product(models.Model):
    # 字符串
    name = models.CharField(max_length=100)
    description = models.TextField()

    # 数字
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    rating = models.FloatField()

    # 日期时间
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 布尔
    is_active = models.BooleanField(default=True)
    is_featured = models.NullBooleanField()

    # 文件
    image = models.ImageField(upload_to="products/")
    document = models.FileField(upload_to="documents/")

    # URL
    website = models.URLField()

    # Email
    contact_email = models.EmailField()

    # JSON (PostgreSQL)
    metadata = models.JSONField(default=dict)

    # 外键
    category = models.ForeignKey(
        "Category",
        on_delete=models.CASCADE
    )

    # 多对多
    tags = models.ManyToManyField("Tag")

    # 一对一
    profile = models.OneToOneField("Profile", on_delete=models.CASCADE)
```

### 查询

```python
from myapp.models import Book, Author

# 获取所有对象
all_books = Book.objects.all()

# 过滤
python_books = Book.objects.filter(title__contains="Python")
published_books = Book.objects.filter(published_date__year=2023)
cheap_books = Book.objects.filter(price__lt=50)

# 获取单个对象
try:
    book = Book.objects.get(id=1)
except Book.DoesNotExist:
    book = None

# 或使用 get_object_or_404
from django.shortcuts import get_object_or_404
book = get_object_or_404(Book, id=1)

# 排序
books = Book.objects.order_by("-published_date")

# 切片
first_10 = Book.objects.all()[:10]

# 聚合
from django.db.models import Avg, Max, Min, Sum, Count
avg_price = Book.objects.aggregate(Avg("price"))
count = Book.objects.count()

# Q 对象（复杂查询）
from django.db.models import Q
books = Book.objects.filter(
    Q(title__contains="Python") | Q(title__contains="Django")
)

# F 对象（字段比较）
from django.db.models import F
Book.objects.all().update(price=F("price") * 1.1)

# 相关查询
author_books = Author.objects.get(id=1).books.all()
```

## 视图

### 函数视图

```python
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

def home(request):
    return HttpResponse("Welcome to Django!")

def about(request):
    return render(request, "about.html")

def api_data(request):
    data = {"message": "Hello, API!"}
    return JsonResponse(data)
```

### 类视图

```python
from django.views import View

class MyView(View):
    def get(self, request):
        return HttpResponse("GET request")

    def post(self, request):
        return HttpResponse("POST request")
```

### 通用视图

```python
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView
)

class BookListView(ListView):
    model = Book
    template_name = "books/list.html"
    context_object_name = "books"
    paginate_by = 10

class BookDetailView(DetailView):
    model = Book
    template_name = "books/detail.html"
    context_object_name = "book"

class BookCreateView(CreateView):
    model = Book
    fields = ["title", "author", "published_date", "isbn", "price"]
    template_name = "books/form.html"
    success_url = "/books/"

class BookUpdateView(UpdateView):
    model = Book
    fields = ["title", "published_date", "price"]
    template_name = "books/form.html"

class BookDeleteView(DeleteView):
    model = Book
    success_url = "/books/"
```

## URL 路由

### 项目 URL

```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("books/", include("books.urls")),
    path("api/", include("api.urls")),
]
```

### 应用 URL

```python
# books/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.BookListView.as_view(), name="book-list"),
    path("<int:pk>/", views.BookDetailView.as_view(), name="book-detail"),
    path("create/", views.BookCreateView.as_view(), name="book-create"),
    path("<int:pk>/update/", views.BookUpdateView.as_view(), name="book-update"),
    path("<int:pk>/delete/", views.BookDeleteView.as_view(), name="book-delete"),
]
```

### URL 参数

```python
from django.urls import path

urlpatterns = [
    path("book/<int:book_id>/", views.book_detail),     # /book/1/
    path("category/<slug:slug>/", views.category),       # /category/python-books/
    path("archive/<int:year>/<int:month>/", views.archive),  # /archive/2023/10/
]
```

### URL 反向解析

```python
from django.urls import reverse

# 生成 URL
url = reverse("book-detail", kwargs={"pk": 1})
url = reverse("book-list")

# 在模板中
<a href="{% url 'book-detail' book.id %}">View Book</a>
```

## 模板

### 基本模板

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    <header>
        <h1>My Website</h1>
        <nav>
            <a href="{% url 'home' %}">Home</a>
            <a href="{% url 'about' %}">About</a>
        </nav>
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

### 模板继承

```html
<!-- templates/books/list.html -->
{% extends "base.html" %}

{% block title %}Book List{% endblock %}

{% block content %}
    <h1>Books</h1>
    <ul>
    {% for book in books %}
        <li>
            <a href="{% url 'book-detail' book.id %}">
                {{ book.title }}
            </a>
            by {{ book.author.name }}
        </li>
    {% empty %}
        <li>No books found.</li>
    {% endfor %}
    </ul>
{% endblock %}
```

### 模板过滤器

```html
{{ name|upper }}
{{ price|floatformat:2 }}
{{ description|truncatewords:30 }}
{{ created_at|date:"Y-m-d H:i" }}
{{ content|safe }}
```

## 表单

### ModelForm

```python
from django import forms
from .models import Book

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ["title", "author", "published_date", "isbn", "price"]
        widgets = {
            "published_date": forms.DateInput(attrs={"type": "date"}),
        }

    def clean_price(self):
        price = self.cleaned_data["price"]
        if price <= 0:
            raise forms.ValidationError("Price must be positive")
        return price
```

### 表单视图

```python
from django.shortcuts import render, redirect
from .forms import BookForm

def book_create(request):
    if request.method == "POST":
        form = BookForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("book-list")
    else:
        form = BookForm()

    return render(request, "books/form.html", {"form": form})
```

### 表单模板

```html
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Save</button>
</form>
```

## Admin

### 注册模型

```python
# admin.py
from django.contrib import admin
from .models import Book, Author

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "published_date", "price"]
    list_filter = ["author", "published_date"]
    search_fields = ["title", "isbn"]
    date_hierarchy = "published_date"
    ordering = ["-published_date"]
    fields = ["title", "author", "published_date", "isbn", "price"]
    readonly_fields = ["created_at"]

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "email"]
    search_fields = ["name", "email"]
```

## REST API

### Django REST Framework

```bash
pip install djangorestframework
```

```python
# serializers.py
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)

    class Meta:
        model = Book
        fields = ["id", "title", "author", "author_name", "published_date", "isbn", "price"]
```

```python
# views.py
from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
```

```python
# urls.py
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
]
```

## 中间件

### 自定义中间件

```python
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 请求前处理
        print("Before request")

        response = self.get_response(request)

        # 响应后处理
        print("After request")

        return response
```

### 配置中间件

```python
# settings.py
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "myapp.middleware.SimpleMiddleware",
]
```

## 数据库迁移

### 创建迁移

```bash
# 创建迁移文件
python manage.py makemigrations

# 指定应用
python manage.py makemigrations myapp

# 查看迁移 SQL
python manage.py sqlmigrate myapp 0001

# 执行迁移
python manage.py migrate

# 回滚迁移
python manage.py migrate myapp 0001
```

### 迁移最佳实践

```python
# 创建字段时提供默认值
new_field = models.CharField(max_length=100, default="")

# 或允许为空
new_field = models.CharField(max_length=100, null=True)

# 分步骤修改复杂字段
# 1. 添加新字段（可为空）
# 2. 编写脚本迁移数据
# 3. 使新字段必填
```

## 用户认证

### 用户模型

```python
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username
```

### 认证视图

```python
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            return render(request, "login.html", {"error": "Invalid credentials"})

    return render(request, "login.html")

@login_required
def protected_view(request):
    return HttpResponse("Protected content")

def logout_view(request):
    logout(request)
    return redirect("home")
```

## Django 最佳实践

::: tip Django 建议

1. **使用应用**：分离功能到不同应用
2. **配置分离**：开发、测试、生产配置分开
3. **环境变量**：敏感信息使用环境变量
4. **数据库路由**：多数据库配置
5. **缓存**：使用缓存提高性能

::: tip 项目结构

```
project/
├── config/                 # 配置目录
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── apps/                   # 应用目录
    ├── __init__.py
    ├── users/
    ├── products/
    └── orders/
```

::: tip 常用 Django 扩展

- **djangorestframework**：RESTful API
- **django-cors-headers**：CORS 支持
- **django-filter**：查询过滤
- **django-guardian**：对象级权限
- **celery**：异步任务队列
- **django-debug-toolbar**：调试工具栏
- **django-extensions**：扩展命令

::: tip 性能优化

```python
# settings.py

# 数据库配置
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "CONN_MAX_AGE": 600,
        "OPTIONS": {
            "connect_timeout": 10,
        },
    }
}

# 缓存配置
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
    }
}

# 会话配置
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

# 静态文件
STATIC_ROOT = "/var/www/static/"
MEDIA_ROOT = "/var/www/media/"

# 安全设置
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```
