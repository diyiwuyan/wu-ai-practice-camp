const SESSION_COOKIE = "wu_session";
const SESSION_DAYS = 30;

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

function isoNow() {
  return new Date().toISOString();
}

function getCookie(request, name) {
  const cookies = request.headers.get("Cookie") || "";
  return cookies.split(";").map((item) => item.trim()).find((item) => item.startsWith(name + "="))?.slice(name.length + 1) || "";
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function body(request) {
  try { return await request.json(); } catch { return {}; }
}

function validEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function apiUnavailable(env) {
  return !env.DB ? json({ message: "API 尚未配置数据库" }, 404) : null;
}

async function currentUser(request, env) {
  if (!env.DB) return null;
  const sessionToken = getCookie(request, SESSION_COOKIE);
  if (!sessionToken) return null;
  const tokenHash = await sha256(sessionToken);
  const row = await env.DB.prepare(
    "SELECT users.id, users.email, users.name, users.role, users.status, users.created_at AS createdAt FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ? AND users.status = 'active'",
  ).bind(tokenHash, Date.now()).first();
  return row || null;
}

function sessionCookie(token) {
  return SESSION_COOKIE + "=" + token + "; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=" + (SESSION_DAYS * 86400);
}

async function sendAuthEmail(env, email, code) {
  if (!env.RESEND_API_KEY) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM || "武同学AI实践营 <onboarding@resend.dev>",
      to: [email],
      subject: "武同学AI实践营登录验证码",
      html: '<p>你的验证码是：</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">' + code + '</p><p>验证码 10 分钟内有效。如非本人操作，请忽略此邮件。</p>',
    }),
  });
  return response.ok;
}

async function handleApi(request, env, url) {
  const unavailable = apiUnavailable(env);
  if (unavailable) return unavailable;
  const route = url.pathname.replace(/^\/api\/?/, "");

  if (request.method === "POST" && route === "auth/request-code") {
    const payload = await body(request);
    const email = String(payload.email || "").trim().toLowerCase();
    const name = String(payload.name || "").trim().slice(0, 40);
    if (!validEmail(email)) return json({ message: "请输入有效邮箱" }, 400);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await sha256(code);
    const now = isoNow();
    await env.DB.prepare("INSERT INTO otp_codes (email, code_hash, expires_at, attempts, created_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(email) DO UPDATE SET code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0, created_at = excluded.created_at").bind(email, codeHash, Date.now() + 10 * 60 * 1000, now).run();
    const sent = await sendAuthEmail(env, email, code);
    if (!sent) return json({ message: "邮箱服务尚未配置，请先配置 RESEND_API_KEY 与 MAIL_FROM" }, 503);
    return json({ ok: true, message: "验证码已发送，请检查邮箱", name });
  }

  if (request.method === "POST" && route === "auth/verify-code") {
    const payload = await body(request);
    const email = String(payload.email || "").trim().toLowerCase();
    const code = String(payload.code || "").trim();
    const name = String(payload.name || "").trim().slice(0, 40);
    const record = await env.DB.prepare("SELECT * FROM otp_codes WHERE email = ?").bind(email).first();
    if (!record || record.expires_at < Date.now() || record.attempts >= 5 || (await sha256(code)) !== record.code_hash) {
      if (record) await env.DB.prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE email = ?").bind(email).run();
      return json({ message: "验证码错误或已过期" }, 400);
    }
    await env.DB.prepare("DELETE FROM otp_codes WHERE email = ?").bind(email).run();
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, email, name, role, status, created_at) VALUES (?, ?, ?, 'learner', 'active', ?) ON CONFLICT(email) DO UPDATE SET name = CASE WHEN excluded.name <> '' THEN excluded.name ELSE users.name END").bind(id, email, name || email.split("@")[0], isoNow()).run();
    const user = await env.DB.prepare("SELECT id, email, name, role, status, created_at AS createdAt FROM users WHERE email = ?").bind(email).first();
    const sessionToken = randomToken();
    await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(await sha256(sessionToken), user.id, Date.now() + SESSION_DAYS * 86400 * 1000, isoNow()).run();
    return json({ ok: true, user }, 200, { "Set-Cookie": sessionCookie(sessionToken) });
  }

  if (request.method === "POST" && route === "auth/logout") {
    const sessionToken = getCookie(request, SESSION_COOKIE);
    if (sessionToken) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(sessionToken)).run();
    return json({ ok: true }, 200, { "Set-Cookie": SESSION_COOKIE + "=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0" });
  }

  if (request.method === "GET" && route === "me") return json({ user: await currentUser(request, env) });

  if (request.method === "POST" && route === "submissions") {
    const user = await currentUser(request, env);
    if (!user) return json({ message: "请先登录" }, 401);
    const payload = await body(request);
    const title = String(payload.title || "").trim().slice(0, 100);
    const category = String(payload.category || "").trim().slice(0, 30);
    const description = String(payload.description || "").trim().slice(0, 3000);
    const prompt = String(payload.prompt || "").trim().slice(0, 10000);
    const assetUrl = String(payload.assetUrl || "").trim().slice(0, 500);
    if (!title || !category || !description) return json({ message: "标题、分类和案例说明不能为空" }, 400);
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO submissions (id, user_id, title, category, description, prompt, asset_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)").bind(id, user.id, title, category, description, prompt, assetUrl, isoNow()).run();
    return json({ ok: true, submission: { id, title, category, description, prompt, assetUrl, status: "pending" } }, 201);
  }

  if (request.method === "GET" && route === "admin/dashboard") {
    const user = await currentUser(request, env);
    if (!user || user.role !== "admin") return json({ message: "无管理员权限" }, 403);
    const users = await env.DB.prepare("SELECT id, email, name, role, status, created_at AS createdAt FROM users ORDER BY created_at DESC LIMIT 200").all();
    const submissions = await env.DB.prepare("SELECT submissions.*, users.email AS authorEmail, users.name AS author FROM submissions JOIN users ON users.id = submissions.user_id ORDER BY submissions.created_at DESC LIMIT 200").all();
    const stats = await env.DB.prepare("SELECT COUNT(*) AS submissions, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending FROM submissions").first();
    return json({ users: users.results || [], submissions: submissions.results || [], stats: { users: (users.results || []).length, submissions: Number(stats?.submissions || 0), pending: Number(stats?.pending || 0) } });
  }

  const adminMatch = route.match(/^admin\/submissions\/([^/]+)$/);
  if (request.method === "PATCH" && adminMatch) {
    const user = await currentUser(request, env);
    if (!user || user.role !== "admin") return json({ message: "无管理员权限" }, 403);
    const payload = await body(request);
    const status = ["pending", "approved", "rejected"].includes(payload.status) ? payload.status : "pending";
    const note = String(payload.note || "").trim().slice(0, 1000);
    await env.DB.prepare("UPDATE submissions SET status = ?, reviewer_note = ?, reviewed_at = ? WHERE id = ?").bind(status, note, isoNow(), adminMatch[1]).run();
    return json({ ok: true });
  }

  return json({ message: "API 路径不存在" }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (!env.DB) {
        await env.ASSETS.fetch(request);
        return json({ message: "API 尚未配置数据库" }, 404);
      }
      try { return await handleApi(request, env, url); } catch (error) {
        return json({ message: "服务器处理失败", detail: env.ENVIRONMENT === "development" ? String(error) : undefined }, 500);
      }
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) return response;
    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
