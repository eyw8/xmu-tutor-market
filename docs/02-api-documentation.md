# API 接口文档

Base URL：`http://localhost:4000/api`（全局前缀 `/api`）
鉴权：除注册/登录外，需请求头 `Authorization: Bearer <JWT>`

## Auth

### POST /auth/register/student — 学生注册
Body: `{ phone, password, college, major, grade, email? }`
返回: `{ accessToken }`

### POST /auth/register/parent — 家长注册
Body: `{ phone, password, childGrade }`
返回: `{ accessToken }`

### POST /auth/login — 登录
Body: `{ phone, password }`
返回: `{ accessToken }`

## Profiles（学生家教主页）

### POST /profiles — 创建/更新主页（需 JWT，角色 STUDENT）
Body: `{ college, major, grade, subjects[], pricePerHour, availableTimes[{day,start,end}] }`

### GET /profiles/me — 查看自己的主页

## Requests（家长需求）

### POST /requests — 发布需求（需 JWT，角色 PARENT）
Body: `{ childGrade, subject, budgetMin, budgetMax, timePreference[{day,start,end}], region }`

### GET /requests — 我的需求列表

### GET /requests/:id/matches — 该需求的匹配结果（按分数降序）
返回项: `{ tutorProfileId, college, major, grade, subjects, pricePerHour, score, breakdown }`

## 匹配评分公式

```
Score = 0.3*price + 0.25*subject + 0.2*time + 0.15*distance + 0.1*rating
```
各分量归一化到 0-100（详见 `backend/src/matching/score.util.ts`）。

## 其他

- GET /health — 健康检查
- Swagger UI: `/api/docs`（代码已预留，接入 `@nestjs/swagger` 装饰器后启用）
