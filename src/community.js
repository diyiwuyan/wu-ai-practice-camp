const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://wu-ai-practice-camp-api.diyiwuyan.workers.dev/api' : '/api')
const DEMO_MODE = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true'

const STORAGE = {
  session: 'wu-ai-session',
  authCode: 'wu-ai-demo-auth-code',
  users: 'wu-ai-demo-users',
  submissions: 'wu-ai-demo-submissions',
  redemptionCodes: 'wu-ai-demo-redemption-codes',
  communityLikes: 'wu-ai-demo-community-likes',
  communityComments: 'wu-ai-demo-community-comments',
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

export async function passwordRegister(email, name, password, inviteCode = '') {
  const payload = await request('/auth/password-register', { method: 'POST', body: JSON.stringify({ email, name, password, inviteCode }) })
  if (payload.user) writeJson(STORAGE.session, payload.user)
  return payload
}

export async function passwordLogin(email, password) {
  const payload = await request('/auth/password-login', { method: 'POST', body: JSON.stringify({ email, password }) })
  if (payload.user) writeJson(STORAGE.session, payload.user)
  return payload
}

export async function resetPassword(email, code, password) {
  const payload = await request('/auth/password-reset', { method: 'POST', body: JSON.stringify({ email, code, password }) })
  if (payload.user) writeJson(STORAGE.session, payload.user)
  return payload
}

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

export async function verifyAuthCode(email, code, name = '', inviteCode = '') {
  try {
    const payload = await request('/auth/verify-code', { method: 'POST', body: JSON.stringify({ email, code, name, inviteCode }) })
    if (payload.user) writeJson(STORAGE.session, payload.user)
    return payload
  } catch (error) {
    if (error.status === 404 && !DEMO_MODE) throw new Error('线上邮箱服务尚未接入，请先部署 Worker 并配置邮件服务')
    if (!DEMO_MODE || error.status !== 404) throw error
    const saved = readJson(STORAGE.authCode, null)
    if (!saved || saved.email !== email || saved.code !== code || saved.expiresAt < Date.now()) throw new Error('验证码错误或已过期')
    const users = readJson(STORAGE.users, [])
    const existing = users.find((item) => item.email === email)
    const inviter = !existing && inviteCode ? users.find((item) => item.referralCode === inviteCode) : null
    const user = existing || { id: 'demo-' + Date.now(), email, name: name || email.split('@')[0], role: email === 'diyiwuyan@163.com' ? 'admin' : 'learner', points: 0, unlockedCourses: [], referralCode: 'WU' + Math.random().toString(36).slice(2, 10).toUpperCase(), invitedBy: inviter?.id || null, referralEarned: 0, createdAt: new Date().toISOString() }
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

export async function getReferralSummary() {
  try { return await request('/referrals') } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const current = readJson(STORAGE.session, null)
    if (!current) throw new Error('请先登录')
    const users = readJson(STORAGE.users, [])
    const invited = users.filter((item) => item.invitedBy === current.id)
    return { referralCode: current.referralCode, invitedCount: invited.length, earnedPoints: Number(current.referralEarned || 0), rate: 0.3, windowDays: 30, transactions: [], demo: true }
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

export async function getPublishedSubmissions({ category = '', sort = 'latest', query = '' } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (sort) params.set('sort', sort)
  if (query) params.set('q', query)
  try {
    const payload = await request('/submissions?' + params.toString())
    return payload.submissions || []
  } catch (error) {
    if (!DEMO_MODE || error.status !== 404) return []
    const normalized = query.trim().toLowerCase()
    return readJson(STORAGE.submissions, []).filter((item) => item.status === 'approved').filter((item) => !category || item.category === category).filter((item) => !normalized || [item.title, item.description, item.category, item.prompt].join(' ').toLowerCase().includes(normalized))
  }
}

export async function toggleSubmissionLike(submissionId) {
  try { return await request(`/submissions/${encodeURIComponent(submissionId)}/like`, { method: 'POST' }) } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const current = readJson(STORAGE.communityLikes, {})
    const liked = !current[submissionId]
    writeJson(STORAGE.communityLikes, { ...current, [submissionId]: liked })
    return { liked, likes: liked ? 1 : 0, demo: true }
  }
}

export async function getSubmissionComments(submissionId) {
  try {
    const payload = await request(`/submissions/${encodeURIComponent(submissionId)}/comments`)
    return payload.comments || []
  } catch (error) {
    if (!DEMO_MODE || error.status !== 404) return []
    return readJson(STORAGE.communityComments, {})[submissionId] || []
  }
}

export async function addSubmissionComment(submissionId, text) {
  try { return await request(`/submissions/${encodeURIComponent(submissionId)}/comments`, { method: 'POST', body: JSON.stringify({ text }) }) } catch (error) {
    if (!DEMO_MODE || error.status !== 404) throw error
    const user = readJson(STORAGE.session, null)
    if (!user) throw new Error('请先登录后评论')
    const all = readJson(STORAGE.communityComments, {})
    const comment = { id: 'demo-comment-' + Date.now(), submissionId, text: String(text).trim(), author: user.name || user.email, createdAt: new Date().toISOString() }
    writeJson(STORAGE.communityComments, { ...all, [submissionId]: [...(all[submissionId] || []), comment] })
    return { comment, demo: true }
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

export async function revokeCourse(userId, courseId) {
  return request('/admin/users/' + userId + '/courses/' + encodeURIComponent(courseId), { method: 'DELETE' })
}

export async function createAdminUser(user) {
  return request('/admin/users', { method: 'POST', body: JSON.stringify(user) })
}

export async function updateAdminUser(userId, update) {
  return request('/admin/users/' + userId, { method: 'PATCH', body: JSON.stringify(update) })
}

export async function deleteAdminUser(userId) {
  return request('/admin/users/' + userId, { method: 'DELETE' })
}

export async function adjustAdminPoints(userId, amount, note = '') {
  return request('/admin/users/' + userId + '/points', { method: 'POST', body: JSON.stringify({ amount: Number(amount), note }) })
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
    const registeredAt = Date.parse(current.createdAt || '')
    const referralEligible = current.invitedBy && Number.isFinite(registeredAt) && Date.now() >= registeredAt && Date.now() - registeredAt <= 30 * 86400 * 1000
    const reward = referralEligible ? Math.round(price * 0.3 * 100) / 100 : 0
    const user = { ...current, points: Number(current.points || 0) - price, unlockedCourses: [...new Set([...unlockedCourses, courseId])] }
    writeJson(STORAGE.session, user)
    const users = readJson(STORAGE.users, [])
    writeJson(STORAGE.users, users.map((item) => item.id === user.id ? user : item).map((item) => item.id === current.invitedBy ? { ...item, points: Number(item.points || 0) + reward, referralEarned: Number(item.referralEarned || 0) + reward } : item))
    return { ok: true, courseId, spentPoints: price, referralReward: reward, user, demo: true }
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
