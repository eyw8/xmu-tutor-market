# XMU Tutor Market

厦门大学校园教育服务撮合平台 —— 连接厦大学子与小学、初中、高中学生家庭，**不收取中介费**，只提供信息匹配、信用评价与价格参考。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| 后端 | NestJS 10 + TypeScript |
| 数据库 | PostgreSQL 16 (Prisma ORM) |
| 缓存 | Redis 7 |
| 部署 | Docker + docker-compose |

## 目录结构

```
xmu-tutor-market/
├── backend/                 # NestJS API (端口 4000)
│   ├── prisma/schema.prisma # 数据模型 (ER)
│   └── src/
│       ├── auth/            # 注册/登录/JWT/邮箱验证
│       ├── profiles/        # 学生家教主页
│       ├── requests/        # 家长需求 + 匹配端点
│       ├── matching/        # 匹配评分算法 (核心)
│       └── price-index/     # 厦大价格指数
├── frontend/                # Next.js 前端 (端口 3000)
│   ├── app/                 # 页面 (login/register/dashboard/...)
│   └── components/          # Button/Card/Navbar/Modal/Form
├── docs/                    # 交付文档
└── docker-compose.yml
```

## 快速启动（Docker）

```bash
cd xmu-tutor-market
docker-compose up --build
```

启动后：
- 前端 http://localhost:3000
- 后端 API http://localhost:4000/api （Swagger 文档：http://localhost:4000/api/docs）
- PostgreSQL :5432 / Redis :6379

首次启动时后端容器会自动执行 `prisma db push` 建表。

## 本地开发

```bash
# 后端
cd backend
cp .env.example .env        # 填写 DATABASE_URL / JWT_SECRET
npm install
npx prisma generate
npm run start:dev           # 需要本地 PostgreSQL 运行

# 前端
cd frontend
npm install
npm run dev
```

## 核心特性

- **注册/登录**：学生（厦大邮箱验证，仅 @xmu.edu.cn）、家长（手机号）；JWT 鉴权；bcrypt 加密
- **家教主页**：学生创建学院/专业/年级/科目/价格/可授课时间
- **家长需求**：发布孩子年级/科目/预算/时间/区域
- **匹配系统**：价格 0.3 + 科目 0.25 + 时间 0.2 + 距离 0.15 + 评价 0.1 加权评分
- **价格指数**：小学数学 / 初中英语 / 高中物理 实时均价、中位价、趋势、需求变化

详见 `docs/` 目录下各文档。
