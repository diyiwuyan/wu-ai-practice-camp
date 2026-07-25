const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://wu-ai-practice-camp-api.diyiwuyan.workers.dev/api' : '/api')
const DEMO_MODE = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true'

const STORAGE = {
  session: 'wu-ai-session',
  authCode: 'wu-ai-demo-auth-code',
  users: 'wu-ai-demo-users',
  submissions: 'wu-ai-demo-submissions',
  redemptionCodes: 'wu-ai-demo-redemption-codes',
}

function readJson(key, fallback) {
  try { return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

async function request(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.message || '请求失败，请稍后再试')
    error.status = response.status
    throw error
  }
  return payload
}

export function isDemoAuth() { return DEMO_MODE }

export async function requestAuthCode(email, name = '') {
  try {
    return await request('/auth/request-code', { method: 'POST', body: JSON.stringify({ email, name }) })
  } catch (error) {
    if (error.status === 404 && !DEMO_MODE) throw new Error('线上邮箱服务尚未接入，请先部署 Worker 并配置邮件服务')
    if (!DEMO_MODE || error.status !== 404) throw error
    const code = String(Math.floor(100000 + Math.random() * 900000))
    writeJson(STORAGE.authCode, { email, code, expiresAt: Date.now() + 10 * 60 * 1000 })
    return { demo: true, message: '本地演示验证码：' + code }
  }
}

export async function verifyAuthCode(email, code, name = '') {
  try {
    const payload = await request('/auth/verify-code', { method: 'POST', body: JSON.stringify({ email, code, name }) })
    if (payload.user) writeJson(STORAGE.session, payload.user)
    return payload
  } catch (error) {
    if (error.status === 404 && !DEMO_MODE) throw new Error('线上邮箱服务尚未接入，请先部署 Worker 并配置邮件服务')
    if (!DEMO_MODE || error.status !== 404) throw error
    const saved = readJson(STORAGE.authCode, null)
    if (!saved || saved.email !== email || saved.code !== code || saved.expiresAt < Date.now()) throw new Error('验证码错误或已过期')
    const users = readJson(STORAGE.users, [])
    const existing = users.find((item) => item.email === email)
    const user = existing || { id: 'demo-' + Date.now(), email, name: name || email.split('@')[0], role: email === 'diyiwuyan@163.com' ? 'admin' : 'learner', points: 0, unlockedCourses: [], createdAt: new Date().toISOString() }
    user.points = Number(user.points || 0)
    user.unlockedCourses = user.unlockedCourses || []
    writeJson(STORAGE.users, [...users.filter((item) => item.email !== email), user])
    writeJson(STORAGE.session, user)
    return { user, demo: true }
  }
}

export async function getSession() {
  try {
    const payload = await request('/me')
    return payload.user || null
  } catch (error) {
    if (DEMO_MODE && error.status === 404) {
      const user = readJson(STORAGE.session, null)
      return user ? { ...user, points: Number(user.points || 0), unlockedCourses: user.unlockedCourses || [] } : null
    }
    return null
  }
}

export async function logout() {
  try { await request('/auth/logout', { method: 'POST' }) } catch { /* local fallback */ }
  window.localStorage.removeItem(STORAGE.session)
}

export async function createSubmission(submission) {
  try {
    return await request('/submissions', { method: 'POST', body: JSON.stringify(submission) })
  } catch (error) {
    if (error.status === 404 && !DEMO_MODE) throw new Error('线上投稿服务尚未接入，请先部署 Worker 并配置 D1')
    if (!DEMO_MODE || error.status !== 404) throw error
    const user = readJson(STORAGE.session, null)
    const item = { ...submission, id: 'demo-submission-' + Date.now(), status: 'pending', author: user?.name || user?.email || '本地演示用户', authorEmail: user?.email || '', createdAt: new Date().toISOString() }
    writeJson(STORAGE.submissions, [item, ...readJson(STORAGE.submissions, [])])
    return { submission: item, demo: true }
  }
}

export async function getAdminDashboard() {
  try { return await request('/admin/dashboard') } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const users = readJson(STORAGE.users, [])
    const submissions = readJson(STORAGE.submissions, [])
    return { users, submissions, stats: { users: users.length, submissions: submissions.length, pending: submissions.filter((item) => item.status === 'pending').length } }
  }
}

export async function reviewSubmission(id, status, note = '') {
  try { return await request('/admin/submissions/' + id, { method: 'PATCH', body: JSON.stringify({ status, note }) }) } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const submissions = readJson(STORAGE.submissions, [])
    const updated = submissions.map((item) => item.id === id ? { ...item, status, reviewerNote: note, reviewedAt: new Date().toISOString() } : item)
    writeJson(STORAGE.submissions, updated)
    return { ok: true, submission: updated.find((item) => item.id === id), demo: true }
  }
}

export async function grantCourse(userId, courseId) {
  try { return await request('/admin/users/' + userId + '/courses', { method: 'POST', body: JSON.stringify({ courseId }) }) } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const users = readJson(STORAGE.users, [])
    const updated = users.map((item) => item.id === userId ? { ...item, unlockedCourses: [...new Set([...(item.unlockedCourses || []), courseId])] } : item)
    writeJson(STORAGE.users, updated)
    const current = readJson(STORAGE.session, null)
    if (current?.id === userId) writeJson(STORAGE.session, { ...current, unlockedCourses: [...new Set([...(current.unlockedCourses || []), courseId])] })
    return { ok: true, courseId, demo: true }
  }
}

export async function redeemPoints(code) {
  try { return await request('/points/redeem', { method: 'POST', body: JSON.stringify({ code }) }) } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const normalized = String(code || '').trim().toUpperCase()
    const codes = readJson(STORAGE.redemptionCodes, [])
    const item = codes.find((entry) => entry.code === normalized && !entry.redeemedBy)
    if (!item) throw new Error('兑换码不存在或已使用')
    const current = readJson(STORAGE.session, null)
    if (!current) throw new Error('请先登录')
    const user = { ...current, points: Number(current.points || 0) + Number(item.points), unlockedCourses: current.unlockedCourses || [] }
    writeJson(STORAGE.redemptionCodes, codes.map((entry) => entry.code === normalized ? { ...entry, redeemedBy: current.id, redeemedAt: new Date().toISOString() } : entry))
    writeJson(STORAGE.session, user)
    return { ok: true, addedPoints: Number(item.points), user, demo: true }
  }
}

export async function unlockCourse(courseId, price = 49.9) {
  try { return await request('/courses/' + encodeURIComponent(courseId) + '/unlock', { method: 'POST' }) } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const current = readJson(STORAGE.session, null)
    if (!current) throw new Error('请先登录')
    const unlockedCourses = current.unlockedCourses || []
    if (unlockedCourses.includes(courseId)) return { ok: true, alreadyUnlocked: true, user: current, demo: true }
    if (Number(current.points || 0) < price) throw new Error(`积分不足，需要 ${price} 积分`)
    const user = { ...current, points: Number(current.points || 0) - price, unlockedCourses: [...new Set([...unlockedCourses, courseId])] }
    writeJson(STORAGE.session, user)
    const users = readJson(STORAGE.users, [])
    writeJson(STORAGE.users, users.map((item) => item.id === user.id ? user : item))
    return { ok: true, courseId, spentPoints: price, user, demo: true }
  }
}

export async function createRedemptionCodes(count, points) {
  try { return await request('/admin/redemption-codes', { method: 'POST', body: JSON.stringify({ count, points }) }) } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const codes = Array.from({ length: Math.max(1, Math.min(200, Number(count) || 1)) }, () => ({ code: `WU-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, points: Number(points) }))
    writeJson(STORAGE.redemptionCodes, [...codes, ...readJson(STORAGE.redemptionCodes, [])])
    return { ok: true, points: Number(points), codes, demo: true }
  }
}
