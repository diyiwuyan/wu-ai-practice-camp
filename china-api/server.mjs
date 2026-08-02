import http from 'node:http'
import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

const PORT = Number(process.env.PORT || 8790)
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || 'diyiwuyan@163.com').toLowerCase()
const SESSION_DAYS = 30
const db = mysql.createPool({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, waitForConnections: true, connectionLimit: 8, charset: 'utf8mb4' })
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ')
const uuid = () => crypto.randomUUID()
const hash = (value) => crypto.createHash('sha256').update(String(value)).digest('hex')
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
const validPassword = (value) => typeof value === 'string' && value.length >= 8 && value.length <= 128
const cookie = (token) => `wu_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 86400}`
const parseCookies = (request) => Object.fromEntries((request.headers.cookie || '').split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key]) => key))
const normalize = (value, length = 1000) => String(value || '').trim().slice(0, length)
const allowedOrigins = new Set(['https://diyiwuyan.github.io', 'https://ai.abcdabcd.cc', 'https://abcdabcd.cc', 'https://www.abcdabcd.cc'])

function cors(request) {
  const origin = request.headers.origin || ''
  const local = /^http:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/i.test(origin)
  const cloudbase = /^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.tcb\.qcloud\.la$/i.test(origin)
  return allowedOrigins.has(origin) || local || cloudbase ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true', 'Vary': 'Origin', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS' } : { Vary: 'Origin' }
}
function send(response, request, status, data, extra = {}) { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...cors(request), ...extra }); response.end(JSON.stringify(data)) }
async function readBody(request) { const parts = []; for await (const part of request) parts.push(part); try { return JSON.parse(Buffer.concat(parts).toString() || '{}') } catch { return {} } }
async function passwordHash(password, salt) { return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (error, derived) => error ? reject(error) : resolve(derived.toString('hex')))) }
async function ensureProfile(userId, inviterId = null) { const [[existing]] = await db.query('SELECT code FROM referral_profiles WHERE user_id = ?', [userId]); if (existing) return existing.code; for (let index = 0; index < 3; index += 1) { const code = 'WU' + crypto.randomBytes(5).toString('hex').toUpperCase(); try { await db.query('INSERT INTO referral_profiles (user_id, code, inviter_id, created_at) VALUES (?, ?, ?, ?)', [userId, code, inviterId, now()]); return code } catch { /* code collision */ } } return null }
async function enrich(user) { const [[points]] = await db.query('SELECT balance FROM user_points WHERE user_id = ?', [user.id]); const [entitlements] = await db.query('SELECT course_id FROM course_entitlements WHERE user_id = ?', [user.id]); const referralCode = await ensureProfile(user.id); return { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status, createdAt: user.created_at || user.createdAt, points: Number(points?.balance || 0), referralCode, unlockedCourses: entitlements.map((item) => item.course_id) } }
async function currentUser(request) { const token = parseCookies(request).wu_session; if (!token) return null; const [[user]] = await db.query('SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ? AND users.status = "active"', [hash(token), Date.now()]); return user ? enrich(user) : null }
async function createSession(userId) { const token = crypto.randomBytes(32).toString('base64url'); await db.query('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)', [hash(token), userId, Date.now() + SESSION_DAYS * 86400 * 1000, now()]); return token }
const requireAdmin = async (request, response) => { const user = await currentUser(request); if (!user || user.role !== 'admin') { send(response, request, 403, { message: '无管理员权限' }); return null } return user }

async function register(request, response, body) { const email = normalize(body.email, 190).toLowerCase(); const name = normalize(body.name, 40); const password = String(body.password || ''); if (!validEmail(email)) return send(response, request, 400, { message: '请输入有效邮箱' }); if (!validPassword(password)) return send(response, request, 400, { message: '密码至少 8 位，最多 128 位' }); const [[existing]] = await db.query('SELECT * FROM users WHERE email = ?', [email]); if (existing?.password_hash) return send(response, request, 409, { message: '该邮箱已注册，请直接登录' }); const id = existing?.id || uuid(); const salt = crypto.randomBytes(16).toString('hex'); const encrypted = await passwordHash(password, salt); const role = email === ADMIN_EMAIL ? 'admin' : 'learner'; const time = now(); await db.query('INSERT INTO users (id, email, name, role, status, password_hash, password_salt, created_at, updated_at) VALUES (?, ?, ?, ?, "active", ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), role = IF(VALUES(role) = "admin", "admin", role), status = "active", password_hash = VALUES(password_hash), password_salt = VALUES(password_salt), updated_at = VALUES(updated_at)', [id, email, name || email.split('@')[0], role, encrypted, salt, time, time]); await db.query('INSERT IGNORE INTO user_points (user_id, balance, updated_at) VALUES (?, 0, ?)', [id, time]); const invite = normalize(body.inviteCode, 30).toUpperCase(); let inviterId = null; if (!existing && invite) { const [[inviter]] = await db.query('SELECT user_id FROM referral_profiles WHERE code = ?', [invite]); inviterId = inviter?.user_id || null } await ensureProfile(id, inviterId); const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [id]); const token = await createSession(id); send(response, request, 201, { ok: true, user: await enrich(user) }, { 'Set-Cookie': cookie(token) }) }
async function login(request, response, body) { const email = normalize(body.email, 190).toLowerCase(); const password = String(body.password || ''); const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]); if (!user || !user.password_hash || !crypto.timingSafeEqual(Buffer.from(await passwordHash(password, user.password_salt), 'hex'), Buffer.from(user.password_hash, 'hex'))) return send(response, request, 401, { message: '邮箱或密码不正确' }); if (user.status !== 'active') return send(response, request, 403, { message: '账号不可用，请联系管理员' }); const token = await createSession(user.id); send(response, request, 200, { ok: true, user: await enrich(user) }, { 'Set-Cookie': cookie(token) }) }

async function api(request, response, url) {
  const route = url.pathname.replace(/^\/api\/?/, '')
  if (request.method === 'OPTIONS') { response.writeHead(204, cors(request)); return response.end() }
  if (route === 'health') return send(response, request, 200, { ok: true, service: 'wu-ai-practice-camp-china-api', time: new Date().toISOString() })
  const body = ['POST', 'PATCH'].includes(request.method) ? await readBody(request) : {}
  if (request.method === 'POST' && route === 'auth/password-register') return register(request, response, body)
  if (request.method === 'POST' && route === 'auth/password-login') return login(request, response, body)
  if (request.method === 'POST' && route === 'auth/logout') { const token = parseCookies(request).wu_session; if (token) await db.query('DELETE FROM sessions WHERE token_hash = ?', [hash(token)]); return send(response, request, 200, { ok: true }, { 'Set-Cookie': 'wu_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0' }) }
  if (request.method === 'GET' && route === 'me') return send(response, request, 200, { user: await currentUser(request) })
  if (route === 'auth/request-code' || route === 'auth/verify-code' || route === 'auth/password-reset') return send(response, request, 501, { message: '国内版当前使用邮箱密码登录；验证码找回正在迁移中。' })
  if (request.method === 'GET' && route === 'admin/dashboard') { const admin = await requireAdmin(request, response); if (!admin) return; const [users] = await db.query('SELECT u.id,u.email,u.name,u.role,u.status,u.created_at,COALESCE(p.balance,0) AS points FROM users u LEFT JOIN user_points p ON p.user_id=u.id ORDER BY u.created_at DESC LIMIT 200'); const [submissions] = await db.query('SELECT s.*,u.email AS authorEmail,u.name AS author FROM submissions s JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 200'); const mapped = await Promise.all(users.map(async (user) => ({ ...user, createdAt: user.created_at, unlockedCourses: (await db.query('SELECT course_id FROM course_entitlements WHERE user_id = ?', [user.id]))[0].map((item) => item.course_id) }))); return send(response, request, 200, { users: mapped, submissions, redemptionCodes: [], stats: { users: mapped.length, submissions: submissions.length, pending: submissions.filter((item) => item.status === 'pending').length } }) }
  return send(response, request, 404, { message: 'API 路径不存在' })
}

http.createServer(async (request, response) => { try { const url = new URL(request.url || '/', 'http://localhost'); if (!url.pathname.startsWith('/api')) return send(response, request, 404, { message: 'Not found' }); await api(request, response, url) } catch (error) { console.error(error); send(response, request, 500, { message: '服务器处理失败' }) } }).listen(PORT, '127.0.0.1', () => console.log(`wu ai china api listening on ${PORT}`))
