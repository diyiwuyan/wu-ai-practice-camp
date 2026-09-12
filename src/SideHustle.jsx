import React, { useMemo, useState } from 'react'
import './sidehustle.css'

const referral = {
  inviteUrl: '',
  qrImage: '',
  wechat: '',
}

const projects = [
  { id: 'ai-coding', tag: 'AI 编程', title: 'AI Coding 接单与小程序交付', result: '10天首单 ¥9,000', cost: '低成本', time: '每天 2–4 小时', level: '进阶', fit: '会一点产品或开发，愿意交付客户', summary: '从真实需求出发，用 AI Coding 快速做出小程序或工具，把能力变成可交付的项目。', source: '公开案例整理' },
  { id: 'content', tag: 'AI 自媒体', title: 'AI 内容账号：广告、私域与企业服务', result: '1个月 2.5万粉', cost: '低成本', time: '每天 1–2 小时', level: '入门', fit: '愿意持续输出，有垂直领域经验', summary: '把 AI 变成内容生产线，先用稳定更新获取流量，再延伸到商单、私域和服务。', source: '公开精华帖解读' },
  { id: 'xiaohongshu', tag: '小红书', title: '虚拟资料与知识库产品', result: '月自然流量收入 ¥5万', cost: '低成本', time: '每天 1–2 小时', level: '入门', fit: '熟悉某个行业，能把经验整理成产品', summary: '围绕明确人群做资料或知识库，靠搜索和内容获得自然流量，交付可以逐步自动化。', source: '公开案例整理' },
  { id: 'video', tag: '视频号', title: 'AI 剧情与图书带货', result: '单月 GMV 40万', cost: '中等', time: '每天 2–3 小时', level: '进阶', fit: '愿意做选题、脚本和批量测试', summary: '用 AI 降低视频制作成本，结合视频号分发与商品挂载，重点在选题验证和持续迭代。', source: '公开案例整理' },
  { id: 'overseas', tag: 'AI 出海', title: '个人开发者的 AI 工具站', result: '7天日入千刀案例', cost: '中等', time: '每天 3–6 小时', level: '进阶', fit: '能读英文，愿意做产品和海外分发', summary: '先找具体需求，再用 AI 快速验证工具站，真正的难点在选品、收款和持续获客。', source: '公开精华帖解读' },
  { id: 'offline', tag: '项目实操', title: 'AI 线下课与小型训练营', result: '3场收款 ¥5,039', cost: '低成本', time: '按项目安排', level: '入门', fit: '有本地人脉或专业技能，愿意交付', summary: '把已有技能包装成小型线下产品，从招生、场地、课程到交付形成可复用 SOP。', source: '站长真实复盘' },
]

const voyages = [
  { title: 'AI 工具与自动化', status: '适合正在进行', period: '7–21 天', output: '跑通一个可用工作流或产品原型', action: '先完成一个真实需求的最小版本' },
  { title: '内容自动化', status: '适合新手入门', period: '14–21 天', output: '形成选题、成稿、发布与复盘节奏', action: '用一个垂直主题连续发布 7 天' },
  { title: '小红书 / 视频号变现', status: '适合内容型选手', period: '14–28 天', output: '完成一次选品、发布和转化测试', action: '先找一个能验证需求的低价产品' },
  { title: 'AI 出海与工具站', status: '适合有时间投入', period: '21–42 天', output: '验证一个海外需求和首批用户', action: '从用户问题而不是工具功能开始' },
]

function track(event, payload = {}) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: `sidehustle_${event}`, ...payload })
  try { localStorage.setItem('sidehustle_last_event', JSON.stringify({ event, ...payload, at: Date.now() })) } catch {}
}

function ReferralPanel({ compact = false }) {
  const hasQr = Boolean(referral.qrImage)
  const hasInvite = Boolean(referral.inviteUrl)
  return <div className={`sh-referral ${compact ? 'compact' : ''}`}>
    <div className="sh-referral-copy">
      <span className="sh-kicker">下一步</span>
      <h3>先体验，再决定要不要加入</h3>
      <p>免费体验 3 天，先看内容、项目库和航海节奏。适合行动的人，不适合只想找“稳赚项目”的人。</p>
    </div>
    <div className="sh-referral-actions">
      {hasInvite ? <a className="sh-button primary" href={referral.inviteUrl} target="_blank" rel="noreferrer" onClick={() => track('invite_click', { source: compact ? 'compact' : 'hero' })}>打开我的邀请链接</a> : <button className="sh-button primary" onClick={() => track('invite_placeholder', { source: compact ? 'compact' : 'hero' })}>等待接入邀请链接</button>}
      {hasQr ? <img className="sh-qr" src={referral.qrImage} alt="生财有术邀请二维码" onLoad={() => track('qr_view')} /> : <div className="sh-qr placeholder">二维码<br/>待接入</div>}
    </div>
    <small>个人推荐页 · 通过邀请链接加入后，推荐人可能获得平台奖励，具体以支付页和官方规则为准。</small>
  </div>
}

function ProjectCard({ project, onOpen }) {
  return <article className="sh-project-card">
    <div className="sh-card-top"><span className="sh-tag">{project.tag}</span><span className="sh-level">{project.level}</span></div>
    <h3>{project.title}</h3>
    <div className="sh-result">{project.result}</div>
    <p>{project.summary}</p>
    <div className="sh-meta"><span>{project.cost}</span><span>{project.time}</span></div>
    <div className="sh-card-foot"><span>适合：{project.fit}</span><button onClick={() => onOpen(project)}>看案例解读 →</button></div>
  </article>
}

export function SideHustle() {
  const [filter, setFilter] = useState('全部')
  const [selected, setSelected] = useState(null)
  const tags = ['全部', ...new Set(projects.map(p => p.tag))]
  const filtered = useMemo(() => filter === '全部' ? projects : projects.filter(p => p.tag === filter), [filter])

  const openProject = (project) => { setSelected(project); track('case_open', { id: project.id, tag: project.tag }) }

  return <main className="sidehustle-page">
    <nav className="sh-nav"><a className="sh-brand" href="/camp/">武同学<span>AI实践营</span></a><div className="sh-nav-links"><a href="#projects">项目地图</a><a href="#voyages">航海路线</a><a href="#how">怎么使用</a><a className="sh-nav-cta" href="#join">免费体验 3 天</a></div></nav>

    <section className="sh-hero">
      <div className="sh-hero-grid">
        <div>
          <div className="sh-eyebrow">AI · 副业 · 项目实操</div>
          <h1>别再刷零散的赚钱项目，先找到适合你的那条路。</h1>
          <p className="sh-hero-lead">把生财有术里的公开案例、项目方向和航海路线，按投入、难度和第一步整理给你。先判断，再行动。</p>
          <div className="sh-hero-actions"><a className="sh-button primary" href="#projects" onClick={() => track('hero_explore')}>开始找项目</a><a className="sh-button ghost" href="#how">我想先了解生财</a></div>
          <div className="sh-proof"><span><b>6</b> 个方向</span><span><b>4</b> 条航海路线</span><span><b>1</b> 个真实复盘</span></div>
        </div>
        <div className="sh-hero-note"><div className="sh-note-pin">今日路线</div><div className="sh-note-title">从“我想搞钱”到“我今天做什么”</div><ol><li>按你的时间和预算筛方向</li><li>看真实结果与失败成本</li><li>选一条路线，完成第一步</li></ol><div className="sh-note-stamp">先完成，再完美</div></div>
      </div>
    </section>

    <section className="sh-section" id="projects"><div className="sh-section-head"><div><span className="sh-kicker">项目地图</span><h2>先看适不适合，再看赚了多少</h2></div><p>公开摘要给你判断依据，完整答案回到原帖和官方体验。</p></div><div className="sh-filters">{tags.map(tag => <button key={tag} className={filter === tag ? 'active' : ''} onClick={() => { setFilter(tag); track('filter', { tag }) }}>{tag}</button>)}</div><div className="sh-project-grid">{filtered.map(project => <ProjectCard key={project.id} project={project} onOpen={openProject} />)}</div></section>

    <section className="sh-callout"><div><span className="sh-kicker">一张图看懂</span><h2>你缺的可能不是项目，而是一个能走完的步骤。</h2><p>每个方向都拆成：适合谁、投入什么、第一步做什么、最容易在哪个环节卡住。</p></div><a className="sh-button dark" href="#voyages">看航海路线 →</a></section>

    <section className="sh-section voyages" id="voyages"><div className="sh-section-head"><div><span className="sh-kicker">航海路线</span><h2>把“想做”变成一段有节奏的实战</h2></div><p>航海期数、名额和规则会变化，以下只展示路线和公开信息，具体以官方页面为准。</p></div><div className="sh-voyage-grid">{voyages.map((v, i) => <article className="sh-voyage" key={v.title}><div className="sh-voyage-no">0{i + 1}</div><div><span className="sh-tag">{v.status}</span><h3>{v.title}</h3><p>{v.output}</p><div className="sh-voyage-meta"><span>{v.period}</span><span>第一步：{v.action}</span></div></div></article>)}</div></section>

    <section className="sh-how" id="how"><div className="sh-how-copy"><span className="sh-kicker">怎么使用</span><h2>先用公开内容做判断，再用体验做验证。</h2><p>生财有术是一个高密度的项目、案例和实战社群。这里不会替你保证收益，也不会把会员全文搬到公开页面。</p><div className="sh-how-list"><div><b>01</b><span>从项目地图找到与你条件接近的方向</span></div><div><b>02</b><span>看案例结果、成本、风险和第一步</span></div><div><b>03</b><span>领取体验，感受内容和航海节奏</span></div></div></div><div className="sh-how-card"><div className="sh-card-label">官方能力</div><h3>生财 MCP</h3><p>让 AI 直接检索精华帖、项目库、风向标和航海内容。官方已开放 OAuth 接入，权限以你的账号为准。</p><a href="https://scys.com/onepage/mcpHelp" target="_blank" rel="noreferrer">查看官方 MCP 说明 →</a></div></section>

    <section className="sh-join" id="join"><ReferralPanel /></section>
    <footer className="sh-footer"><div><b>武同学 AI实践营</b><span>个人推荐页 · 内容版权归生财有术及原作者所有</span></div><div><a href="/camp/">回到 AI 实践营</a><a href="https://scys.com/" target="_blank" rel="noreferrer">生财有术官网</a></div></footer>

    {selected && <div className="sh-modal-backdrop" role="presentation" onClick={() => setSelected(null)}><div className="sh-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={e => e.stopPropagation()}><button className="sh-modal-close" onClick={() => setSelected(null)} aria-label="关闭">×</button><span className="sh-tag">{selected.tag}</span><h2>{selected.title}</h2><div className="sh-modal-result">{selected.result}</div><p>{selected.summary}</p><div className="sh-modal-block"><b>适合谁</b><span>{selected.fit}</span></div><div className="sh-modal-block"><b>公开说明</b><span>这是基于公开案例的结构化解读，收益不构成承诺。完整方法请回到原帖和官方体验。</span></div><ReferralPanel compact /></div></div>}
  </main>
}
