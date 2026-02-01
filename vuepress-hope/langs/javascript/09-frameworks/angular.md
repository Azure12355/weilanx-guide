---
title: Angular
icon: logos:angular-icon
order: 3
---

# Angular

Angular 是一个由 Google 维护的开源 Web 应用框架，基于 TypeScript 构建。

## Angular 基础

### 组件定义

```typescript
// TypeScript 组件
import { Component } from '@angular/core';

@Component({
    // 组件选择器
    selector: 'app-user-profile',

    // 模板文件
    templateUrl: './user-profile.component.html',

    // 样式文件
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
    // 组件属性
    name: string = 'Alice';
    age: number = 25;

    // 组件方法
    greet() {
        console.log(`Hello, ${this.name}!`);
    }
}
```

### 内联模板和样式

```typescript
// 内联模板和样式
@Component({
    selector: 'app-hello',
    template: `
        <div class="hello">
            <h1>Hello, {{ name }}!</h1>
            <p>Age: {{ age }}</p>
        </div>
    `,
    styles: [`
        .hello {
            padding: 20px;
            background: #f0f0f0;
        }
        h1 {
            color: #333;
        }
    `]
})
export class HelloComponent {
    name = 'World';
    age = 1;
}
```

## 数据绑定

### 插值绑定

```html
<!-- 插值：{{ }} -->
<p>Hello, {{ name }}!</p>
<p>Sum: {{ a + b }}</p>
<p>Date: {{ today | date:'short' }}</p>

<!-- 表达式 -->
<p>{{ user.name }}</p>
<p>{{ items.length }}</p>
<p>{{ isActive ? 'Active' : 'Inactive' }}</p>
```

### 属性绑定

```html
<!-- 属性绑定：[] -->
<img [src]="imageUrl" [alt]="imageAlt" />
<button [disabled]="isDisabled">Click</button>
<div [class.active]="isActive">Content</div>

<!-- 类绑定 -->
<div [class]="classExpression">Text</div>
<div [class.active]="isActive">Text</div>
<div [class.active]="isActive" [class.disabled]="isDisabled">Text</div>

<!-- 样式绑定 -->
<div [style.color]="accentColor">Text</div>
<div [style.font-size.px]="fontSize">Text</div>
<div [style]="styleExpression">Text</div>
```

### 事件绑定

```html
<!-- 事件绑定：() -->
<button (click)="onSave()">Save</button>
<input (input)="onInput($event)" />
<form (submit)="onSubmit($event)">

<!-- 事件对象 -->
<button (click)="onClick($event)">Click</button>

```typescript
@Component({
    // ...
})
export class MyComponent {
    onClick(event: MouseEvent) {
        console.log('Clicked!', event);
        event.preventDefault();
    }

    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        console.log('Input:', input.value);
    }
}
```

### 双向绑定

```html
<!-- 双向绑定：[()] -->
<input [(ngModel)]="username" />
<p>Hello, {{ username }}!</p>

```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [FormsModule],
    // ...
})
export class AppModule {}

@Component({
    // ...
})
export class MyComponent {
    username = '';
}
```

## 指令

### 结构指令

```html
<!-- *ngIf：条件渲染 -->
<div *ngIf="isVisible">Visible content</div>
<div *ngIf="isLoggedIn; else loginTemplate">
    Welcome back!
</div>
<ng-template #loginTemplate>
    <p>Please login</p>
</ng-template>

<!-- *ngFor：列表渲染 -->
<div *ngFor="let item of items">
    {{ item.name }}
</div>

<!-- 带索引 -->
<div *ngFor="let item of items; let i = index">
    {{ i }}: {{ item.name }}
</div>

<!-- *ngSwitch -->
<div [ngSwitch]="status">
    <div *ngSwitchCase="'loading'">Loading...</div>
    <div *ngSwitchCase="'success'">Success!</div>
    <div *ngSwitchDefault>Error</div>
</div>
```

### 属性指令

```html
<!-- ngClass -->
<div [ngClass]="{ active: isActive, disabled: isDisabled }">
    Content
</div>

<div [ngClass]="classExpression">Content</div>

<!-- ngStyle -->
<div [ngStyle]="{ color: 'red', fontSize: '14px' }">
    Styled content
</div>

<div [ngStyle]="styleExpression">Content</div>
```

### 自定义指令

```typescript
// 高亮指令
import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[appHighlight]'
})
export class HighlightDirective {
    @Input() appHighlight = '';

    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') onMouseEnter() {
        this.highlight('yellow');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight('');
    }

    private highlight(color: string) {
        this.el.nativeElement.style.backgroundColor = color;
    }
}

// 使用
<p appHighlight>Highlight me!</p>
<p appHighlight="orange">Orange highlight!</p>
```

## 组件通信

### 父子组件通信

```typescript
// 父组件
@Component({
    selector: 'app-parent',
    template: `
        <app-child
            [message]="parentMessage"
            (notify)="onChildNotify($event)">
        </app-child>
    `
})
export class ParentComponent {
    parentMessage = 'Hello from parent';

    onChildNotify(message: string) {
        console.log('Child notified:', message);
    }
}

// 子组件
@Component({
    selector: 'app-child',
    template: `
        <p>{{ message }}</p>
        <button (click)="notifyParent()">Notify Parent</button>
    `
})
export class ChildComponent {
    @Input() message!: string;

    @Output() notify = new EventEmitter<string>();

    notifyParent() {
        this.notify.emit('Hello from child!');
    }
}
```

### 服务通信

```typescript
// 数据服务
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private dataSource = new BehaviorSubject<any>(null);
    data$ = this.dataSource.asObservable();

    updateData(data: any) {
        this.dataSource.next(data);
    }
}

// 组件 A：发送数据
@Component({ /* ... */ })
export class ComponentA {
    constructor(private dataService: DataService) {}

    sendData() {
        this.dataService.updateData({ message: 'Hello!' });
    }
}

// 组件 B：接收数据
@Component({ /* ... */ })
export class ComponentB implements OnInit {
    data: any;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.dataService.data$.subscribe(data => {
            this.data = data;
        });
    }
}
```

## 依赖注入

### 服务

```typescript
// 用户服务
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'  // 全局单例
})
export class UserService {
    private apiUrl = 'https://api.example.com/users';

    constructor(private http: HttpClient) {}

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getUser(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createUser(user: any): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }
}
```

### 使用服务

```typescript
@Component({
    selector: 'app-user-list',
    template: `
        <div *ngFor="let user of users">
            {{ user.name }}
        </div>
    `
})
export class UserListComponent implements OnInit {
    users: any[] = [];

    // 构造函数注入
    constructor(private userService: UserService) {}

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe(
            users => this.users = users,
            error => console.error('Error:', error)
        );
    }
}
```

## 路由

### 基本配置

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'users', component: UsersComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 路由参数

```html
<!-- 路由链接 -->
<a routerLink="/home">Home</a>
<a routerLink="/users/1">User 1</a>
<a [routerLink]="['/users', userId]">User</a>

```typescript
// 获取路由参数
@Component({ /* ... */ })
export class UserDetailComponent implements OnInit {
    user: any;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ) {}

    ngOnInit() {
        // 获取参数
        const id = this.route.snapshot.paramMap.get('id');

        // 或使用 Observable
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            this.loadUser(id);
        });
    }

    loadUser(id: string) {
        this.userService.getUser(+id).subscribe(
            user => this.user = user
        );
    }
}
```

### 路由守卫

```typescript
// 认证守卫
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}

// 应用守卫
const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard]
    }
];
```

## 表单

### 模板驱动表单

```html
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <input name="username"
           ngModel
           required
           minlength="3"
           #username="ngModel">

    <div *ngIf="username.invalid && username.touched">
        <div *ngIf="username.errors?.['required']">
            Username is required
        </div>
        <div *ngIf="username.errors?.['minlength']">
            Minimum 3 characters
        </div>
    </div>

    <button type="submit" [disabled]="form.invalid">
        Submit
    </button>
</form>
```

### 响应式表单

```typescript
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    template: `
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <input formControlName="username">
            <div *ngIf="loginForm.get('username')?.errors?.['required']">
                Username required
            </div>

            <input formControlName="password" type="password">
            <div *ngIf="loginForm.get('password')?.errors?.['minlength']">
                Min 6 characters
            </div>

            <button [disabled]="loginForm.invalid">Login</button>
        </form>
    `
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            console.log('Form value:', this.loginForm.value);
        }
    }
}
```

## 管道

### 内置管道

```html
<!-- DatePipe -->
<p>{{ today | date:'short' }}</p>
<p>{{ today | date:'fullDate' }}</p>
<p>{{ today | date:'yyyy-MM-dd HH:mm:ss' }}</p>

<!-- UpperCasePipe / LowerCasePipe -->
<p>{{ text | uppercase }}</p>
<p>{{ text | lowercase }}</p>

<!-- CurrencyPipe -->
<p>{{ price | currency:'CNY' }}</p>
<p>{{ price | currency:'USD':'symbol':'1.2-2' }}</p>

<!-- PercentPipe -->
<p>{{ value | percent }}</p>

<!-- DecimalPipe -->
<p>{{ number | number:'1.2-2' }}</p>

<!-- JsonPipe -->
<pre>{{ object | json }}</pre>
```

### 自定义管道

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 20): string {
        if (!value) return '';
        return value.length > limit
            ? value.substring(0, limit) + '...'
            : value;
    }
}

// 使用
<p>{{ longText | truncate:50 }}</p>
```

## 最佳实践

::: tip Angular 开发建议

1. **使用 TypeScript** - 充分利用类型系统
2. **单一职责** - 每个组件只做一件事
3. **依赖注入** - 使用服务管理状态
4. **OnPush 变更检测** - 提高性能
5. **模块化** - 合理划分功能模块

:::

```typescript
// ✅ 推荐做法

// 1. 使用接口定义数据类型
interface User {
    id: number;
    name: string;
    email: string;
}

// 2. 使用服务封装业务逻辑
@Injectable({ providedIn: 'root' })
export class UserService {
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('/api/users');
    }
}

// 3. 使用生命周期钩子
export class Component implements OnInit, OnDestroy {
    ngOnInit() {
        // 初始化逻辑
    }

    ngOnDestroy() {
        // 清理逻辑
    }
}

// 4. 使用不可变数据
this.users = [...this.users, newUser];

// 5. 使用 async pipe
<div *ngFor="let user of users$ | async">
    {{ user.name }}
</div>
```

## 总结

| 方面 | 说明 |
|------|------|
| **组件** | 应用基本构建块 |
| **指令** | 扩展 HTML 功能 |
| **服务** | 业务逻辑封装 |
| **依赖注入** | 解耦和可测试性 |
| **路由** | 页面导航管理 |

::: v-pre

[状态管理](./state-management.md) → [路由](./routing.md)

:::
