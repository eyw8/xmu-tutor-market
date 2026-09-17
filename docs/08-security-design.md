# 安全设计文档

## 身份与隐私（核心原则）

1. **不收集身份证、不收集学号** —— 学生身份仅靠厦大官方邮箱（@xmu.edu.cn）验证
2. **不公开学生个人身份信息** —— 公开页只展示学院/专业/年级/科目等家教信息
3. **线下确认身份** —— 家长学生线下自行核对身份，平台不做线上支付（当面结清）
4. **双方隐私平权** —— 联系方式默认隐藏，双方同意后再交换

## 认证与授权

- JWT（HS256，`JWT_SECRET` 签名），`JwtStrategy` 解析 Bearer token → `{ userId, phone, role }`
- `JwtGuard` + `@UseGuards` 保护资源接口
- 密码 bcrypt 加盐哈希（rounds=10），不存明文
- 角色校验：创建主页要求 STUDENT，发布需求要求 PARENT

## 邮箱验证

- `EmailVerificationService`：仅接受 `@xmu.edu.cn` 及其子域（含 `@stu.xmu.edu.cn`）

## 输入校验

- 全局 `ValidationPipe({ whitelist, transform, forbidNonWhitelisted })`
- DTO 用 class-validator：手机号正则、密码最小长度、数值边界等

## 风控（规划，待 RiskLog 模型接入）

- Spam 账号 / 广告信息 / 异常行为检测
- 分级处置：警告 → 限流 → 封禁
- Redis 限流（@nestjs/throttler，依赖已引入）

## 合规

- 一切行为符合中华人民共和国法律；不涉及线上家教支付
