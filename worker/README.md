# 武同学 AI 实践营后端配置

前端可以部署到 GitHub Pages；邮箱登录、投稿审核和管理员数据需要把 `worker/index.js` 部署到 Cloudflare Worker，并绑定 D1。

## 1. 创建数据库

```bash
wrangler d1 create wu-ai-practice-camp-db
wrangler d1 execute wu-ai-practice-camp-db --remote --file=worker/schema.sql
```

在 Worker 的绑定配置中把数据库绑定名设为 `DB`，静态资源绑定名设为 `ASSETS`。

## 2. 配置邮箱

验证码邮件使用 Resend。配置以下变量：

- `RESEND_API_KEY`：Resend API Key，建议使用加密 Secret。
- `MAIL_FROM`：已经在 Resend 验证过的发件人，例如 `武同学AI实践营 <hello@example.com>`。
- `ENVIRONMENT=production`：生产环境不要返回错误细节。

没有配置邮箱服务时，前端会明确提示“邮箱服务尚未配置”，不会假装登录成功。

## 3. 设置管理员

先用目标邮箱完成一次登录，再执行：

```sql
UPDATE users SET role = 'admin' WHERE email = '你的管理员邮箱';
```

管理员重新登录后，前端顶部会出现“管理后台”，可以查看用户、查看投稿并通过或退回投稿。

## 4. 投稿素材

当前投稿表单支持填写成品图片或文件 URL，便于先跑通审核流程。正式运营时建议增加 R2 或其他对象存储：前端先取得上传凭证，文件上传成功后再把 URL 写入投稿记录。

## 5. 前端 API 地址

如果 Worker 与前端同域，保持默认的 `/api` 即可。如果 API 是独立域名，构建前设置：

```bash
VITE_API_BASE_URL=https://你的-worker.example.workers.dev/api npm run build
```

本地开发模式内置了演示验证码和演示数据，方便验收页面流程；演示数据只保存在当前浏览器，不会写入线上数据库。
