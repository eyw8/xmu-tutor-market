# Docker 部署方案

## 架构（docker-compose.yml）

| 服务 | 镜像 | 端口 | 说明 |
|---|---|---|---|
| postgres | postgres:16-alpine | 5432 | 主库，数据卷 pgdata |
| redis | redis:7-alpine | 6379 | 缓存（卷 redisdata） |
| backend | 本地 build | 4000 | NestJS API |
| frontend | 本地 build | 3000 | Next.js |

## 启动

```bash
docker-compose up --build
# 后台运行：docker-compose up -d --build
```

## 关键机制

- 后端多阶段构建（node:20-alpine）：装依赖 → `prisma generate` → `nest build` → 精简运行时
- 后端容器启动时自动建表：无 migrations 时执行 `prisma db push --skip-generate`，有则 `prisma migrate deploy`
- 前端多阶段构建，`output: standalone` 精简产物，非 root 用户运行
- 后端 `depends_on` postgres 健康检查（pg_isready），确保先起库
- 环境变量由 compose 注入（DATABASE_URL / REDIS_URL / JWT_SECRET / NEXT_PUBLIC_API_URL）

## 生产注意事项

- 务必修改 `JWT_SECRET`（compose 中为占位值）
- 数据库密码不要用默认值，改用 secrets
- 生产环境建议加 HTTPS 反向代理（Nginx/Caddy）
