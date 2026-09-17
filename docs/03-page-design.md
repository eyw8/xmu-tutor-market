# 页面设计说明（Figma 风格）

## 设计基调

- 主色：蓝色系（`blue-600` 主按钮 / 链接，`blue-700` hover）
- 中性：灰阶（`gray-50` 背景 → `gray-900` 标题文字）
- 圆角：卡片 `rounded-xl`、按钮 `rounded-lg`
- 字体：系统默认无衬线，标题加粗，正文 `text-sm/text-base`
- 布局：居中容器（`max-w-2xl`~`max-w-6xl`），卡片 + 网格

## 组件库（components/）

| 组件 | 说明 |
|---|---|
| Button | variant(primary/secondary/ghost/danger) × size(sm/md/lg) |
| Card | 卡片容器（可选 title） |
| Navbar | 顶栏：Logo + 登录/学生注册/家长注册链接 |
| Modal | 受控弹窗（open/onClose，遮罩点击关闭） |
| Form + Field | 表单容器 + 输入项（label/hint） |

## 页面

| 路由 | 说明 |
|---|---|
| / | 首页（品牌 + 标语） |
| /login | 登录（手机号+密码） |
| /register/student | 学生注册（手机号/密码/学院/专业/年级/厦大邮箱） |
| /register/parent | 家长注册（手机号/密码/孩子年级） |
| /student/dashboard | 学生工作台：展示家教主页 / 未创建提示 |
| /parent/dashboard | 家长工作台：需求列表 + 发布入口 |
| /parent/request/new | 发布需求表单（含多时段编辑器） |
| /parent/request/[id]/matches | 匹配结果列表（分数 + 五维分解） |

## 关键交互

- 未登录访问受保护页 → 重定向 `/login`
- 登录/注册成功 → 存 `token` 到 localStorage → 跳首页
- 发布需求成功 → 跳转该需求的匹配结果页
