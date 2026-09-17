# 数据库 Schema（ER 模型）

数据源：`backend/prisma/schema.prisma`（Prisma 5.22 / PostgreSQL 16）

## 枚举

- `Role`: STUDENT | PARENT | ADMIN

## 模型

### User（用户基表）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | String (cuid) | 主键 |
| phone | String @unique | 手机号（登录账号） |
| passwordHash | String | bcrypt 哈希 |
| role | Role | 角色 |
| email | String? @unique | 邮箱（学生为厦大邮箱） |
| createdAt / updatedAt | DateTime | 时间戳 |

关系：1:1 StudentProfile?、1:1 ParentProfile?、1:1 TutorProfile?

### StudentProfile（学生档案）
| 字段 | 类型 | 说明 |
|---|---|---|
| userId | String @id | 主键 = User.id（1:1） |
| college / major | String | 学院 / 专业 |
| grade | Int | 年级 |
| verifiedEmail | String? @unique | 已验证厦大邮箱 |

### ParentProfile（家长档案）
| 字段 | 类型 | 说明 |
|---|---|---|
| userId | String @id | 主键 = User.id（1:1） |
| childGrade | Int | 孩子年级 |

关系：1:N requests

### TutorProfile（家教主页）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | String (cuid) | 主键 |
| userId | String @unique | 所属用户（1:1，级联删除） |
| college / major | String | 学院 / 专业 |
| grade | Int | 年级 |
| subjects | String[] | 可授科目 |
| pricePerHour | Float | 时薪 |
| availableTimes | Json | 可授课时间 [{day,start,end}] |

### TutoringRequest（家长需求）
| 字段 | 类型 | 说明 |
|---|---|---|
| id | String (cuid) | 主键 |
| parentId | String | 所属家长（级联删除） |
| childGrade | Int | 孩子年级 |
| subject | String | 科目 |
| budgetMin / budgetMax | Float | 预算区间 |
| timePreference | Json | 期望时间 [{day,start,end}] |
| region | String | 区域 |
| status | String | 默认 OPEN |

索引：`(subject, region)`
