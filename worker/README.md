# 武同学 AI 实践营后端配置

前端可以部署到 GitHub Pages；邮箱登录、投稿审核和管理员数据需要把 `worker/index.js` 部署到 Cloudflare Worker，并绑定 D1。

## 1. 创建数据库

```bash
wrangler d1 create wu-ai-practice-camp-db
wrangler d1 execute wu-ai-practice-camp-db --remote --file=worker/schema.sql
```

如果数据库已经按旧版结构创建过，请单独执行一次课程权限迁移（`schema.sql` 中的最后两段 `course_entitlements` 建表和索引语句），否则管理员解锁按钮无法写入权限。

在 Worker 的绑定配置中把数据库绑定名设为 `DB`，静态资源绑定名设为 `ASSETS`。

## 2. 配置邮箱

验证码邮件使用 Resend。配置以下变量：

- `RESEND_API_KEY`：Resend API Key，建议使用加密 Secret。
- `MAIL_FROM`：已经在 Resend 验证过的发件人，例如 `武同学AI实践营 <hello@example.com>`。
- `ADMIN_EMAIL`：管理员邮箱，设置为 `diyiwuyan@163.com` 后，该邮箱完成验证码登录会自动获得管理员权限。
- `ENVIRONMENT=production`：生产环境不要返回错误细节。

没有配置邮箱服务时，前端会明确提示“邮箱服务尚未配置”，不会假装登录成功。

## 3. 设置管理员

推荐配置 `ADMIN_EMAIL=diyiwuyan@163.com`。如果不使用自动授予，也可以先用目标邮箱完成一次登录，再执行：

```sql
UPDATE users SET role = 'admin' WHERE email = '你的管理员邮箱';
```

管理员重新登录后，前端顶部会出现“管理后台”，可以查看用户、查看投稿并通过或退回投稿。

管理员确认收到手动报名款后，可以在“最近用户与课程解锁”中给用户解锁 Codex 橙皮书、生图训练营或大学生求职 AI 课。解锁后用户重新打开课程，课程状态会显示“已解锁”，并看到完整的 Prompt、练习、示例和课程正文；未解锁用户只看到课程介绍、统计和目录预览。

课程权限写入 `course_entitlements` 表，当前支持的课程编号为 `codex`、`image`、`career`。权限是整门课程权限，生图课和求职课都不是按章节收费。

当前登录方式是邮箱验证码，不保存密码；不要把个人密码写入 Worker 变量、代码或仓库。

## 4. 投稿素材

当前投稿表单支持填写成品图片或文件 URL，便于先跑通审核流程。正式运营时建议增加 R2 或其他对象存储：前端先取得上传凭证，文件上传成功后再把 URL 写入投稿记录。

## 5. 前端 API 地址

如果 Worker 与前端同域，保持默认的 `/api` 即可。如果 API 是独立域名，构建前设置：

```bash
VITE_API_BASE_URL=https://你的-worker.example.workers.dev/api npm run build
```

本地开发模式内置了演示验证码和演示数据，方便验收页面流程；演示数据只保存在当前浏览器，不会写入线上数据库。
