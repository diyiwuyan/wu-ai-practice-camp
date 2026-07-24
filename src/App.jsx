import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Bell,
  BookmarkSimple,
  CheckCircle,
  FileText,
  Lightbulb,
  MagnifyingGlass,
  PaperPlaneTilt,
  Plus,
  Sparkle,
  SquaresFour,
  TrendUp,
  UserCircle,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import { freeCourseGroups, freeCourseStats } from './courseContent'

const cases = [
  {
    id: 'receipts',
    title: '用 WorkBuddy 整理一批报销发票',
    description: '批量识别发票信息，自动分类去重，生成报销明细表，节省 90% 整理时间。',
    author: '武同学',
    difficulty: '入门',
    saved: '2.5 小时',
    tags: ['WorkBuddy', 'OCR', '表格处理', '自动化'],
    image: 'assets/case-receipts.jpg',
    accent: '01',
  },
  {
    id: 'briefing',
    title: '把每天的资讯变成一页早报',
    description: '从多个信息源抓取要点，AI 提炼总结，自动生成结构化早报并推送。',
    author: '柚子同学',
    difficulty: '进阶',
    saved: '1.8 小时',
    tags: ['信息抓取', '总结提炼', '日报生成', '自动化'],
    image: 'assets/case-briefing.jpg',
    accent: '02',
  },
  {
    id: 'site',
    title: '从零做一个个人品牌网站',
    description: '用 AI 规划结构、生成文案与设计稿，快速搭建个人作品与服务展示站。',
    author: '阿 May',
    difficulty: '进阶',
    saved: '6.0 小时',
    tags: ['网站搭建', '文案生成', '设计生成', '部署上线'],
    image: 'assets/case-personal-site.jpg',
    accent: '03',
  },
]

const skills = [
  { icon: SquaresFour, name: '提示词工程：让 AI 听懂你', detail: '写出高质量提示词的底层方法', count: '1.2w 人学习' },
  { icon: FileText, name: '用 AI 做数据分析', detail: '从数据到洞察的实用流程', count: '9863 人学习' },
  { icon: Sparkle, name: '自动化工作流搭建', detail: '把重复工作交给 AI 和自动化', count: '8731 人学习' },
]

function CourseModal({ selectedChapter, onSelect, onStart }) {
  return (
    <div className="course-modal-content">
      <div className="course-modal-heading">
        <div>
          <span className="modal-icon"><FileText size={26} /></span>
          <p className="eyebrow orange"><span /> 免费完整课程</p>
          <h2>WorkBuddy 免费实战课</h2>
          <p>把飞书第二稿的免费课内容搬到课程中心：35 章、17 个实战案例、40+ 个可复制 Prompt，从安装开始一直练到自己的工作系统。</p>
        </div>
        <div className="course-modal-stats">{freeCourseStats.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}</div>
      </div>
      <div className="course-modal-layout">
        <div className="course-chapter-list">
          {freeCourseGroups.map((group) => (
            <section key={group.part} className="course-group">
              <div className="course-group-heading"><div><b>{group.part}</b><small>{group.summary}</small></div><em>{group.range}</em></div>
              {group.chapters.map((chapter) => <button key={chapter.number} className={`course-chapter ${selectedChapter.number === chapter.number ? 'selected' : ''}`} onClick={() => onSelect(chapter)}><span>{chapter.number}</span><span><b>{chapter.title}</b><small>{chapter.level} · {chapter.time}</small></span><ArrowRight size={16} /></button>)}
            </section>
          ))}
        </div>
        <article className="course-detail">
          <span className="course-detail-number">第 {selectedChapter.number} 章</span>
          <h3>{selectedChapter.title}</h3>
          <p className="course-detail-intro">{selectedChapter.intro}</p>
          <div className="course-detail-block"><b>马上练习</b><p>{selectedChapter.exercise}</p></div>
          <div className="course-detail-block"><b>本章产出</b><p>{selectedChapter.output}</p></div>
          <div className="course-detail-tip"><CheckCircle size={17} weight="fill" /> 每章都按“看学习卡 → 跟着做 → 换成自己的 → 自测复盘”完成。</div>
          <button className="button button-primary full" onClick={onStart}>开始跟做这门课 <ArrowRight size={17} /></button>
        </article>
      </div>
    </div>
  )
}

const allChapters = freeCourseGroups.flatMap((group) => group.chapters)

function CourseReader({ chapter, completedChapters, onBack, onPrevious, onNext, onComplete }) {
  const chapterIndex = allChapters.findIndex((item) => item.number === chapter.number)
  const isFirst = chapterIndex === 0
  const isLast = chapterIndex === allChapters.length - 1
  const isCompleted = completedChapters.includes(chapter.number)

  return (
    <div className="course-reader-content">
      <header className="course-reader-header">
        <button className="course-reader-back" onClick={onBack}><ArrowLeft size={17} /> 返回课程目录</button>
        <div className="course-reader-progress"><b>WorkBuddy 免费实战课</b><span>第 {chapterIndex + 1} / {allChapters.length} 章</span></div>
      </header>
      <div className="course-reader-body">
        <aside className="course-reader-aside">
          <span className="course-detail-number">第 {chapter.number} 章 · {chapter.level}</span>
          <h2>{chapter.title}</h2>
          <p>{chapter.intro}</p>
          <div className="course-reader-aside-meta"><span>{chapter.time}</span><span>目标产出：{chapter.output}</span></div>
        </aside>
        <article className="course-reader-main">
          <p className="eyebrow orange"><span /> 本章学习卡</p>
          <h3>先理解，再动手</h3>
          <p className="course-reader-lede">这一章不要求一次学完所有功能，只需要围绕一个真实任务，完成下面这张最小闭环。</p>
          <div className="course-reader-grid">
            <section className="course-reader-card"><span>01</span><h4>跟着做</h4><p>{chapter.exercise}</p></section>
            <section className="course-reader-card"><span>02</span><h4>完成产出</h4><p>{chapter.output}</p></section>
          </div>
          <section className="course-reader-checklist">
            <h4>本章完成标准</h4>
            <ol>
              <li>先确认输入材料、交付格式和验收标准。</li>
              <li>用小样本跟做一遍，记录中途的判断和失败点。</li>
              <li>换成自己的任务再做一遍，并保留可复用的步骤。</li>
            </ol>
          </section>
          <div className="course-reader-tip"><CheckCircle size={18} weight="fill" /> 涉及文件、外部发布或高风险操作时，先停在草稿和预览阶段，确认后再执行。</div>
        </article>
      </div>
      <footer className="course-reader-footer">
        <button className="button button-outline" disabled={isFirst} onClick={onPrevious}><ArrowLeft size={16} /> 上一章</button>
        <button className={`course-reader-complete ${isCompleted ? 'completed' : ''}`} onClick={onComplete}><CheckCircle size={17} weight={isCompleted ? 'fill' : 'regular'} /> {isCompleted ? '已完成本章' : '完成本章'}</button>
        <button className="button button-primary" disabled={isLast} onClick={onNext}>{isLast ? '已到最后一章' : '下一章'} <ArrowRight size={16} /></button>
      </footer>
    </div>
  )
}

export function App() {
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState([])
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [selectedChapter, setSelectedChapter] = useState(freeCourseGroups[0].chapters[0])
  const [completedChapters, setCompletedChapters] = useState([])

  const filteredCases = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return cases
    return cases.filter((item) => [item.title, item.description, ...item.tags].join(' ').toLowerCase().includes(text))
  }, [query])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const toggleSave = (id) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    notify(saved.includes(id) ? '已取消收藏' : '案例已收藏到我的实践')
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const openCourse = () => { setSelectedChapter(freeCourseGroups[0].chapters[0]); setModal('course') }
  const openReader = () => setModal('reader')
  const moveChapter = (offset) => {
    const currentIndex = allChapters.findIndex((item) => item.number === selectedChapter.number)
    const nextChapter = allChapters[currentIndex + offset]
    if (nextChapter) setSelectedChapter(nextChapter)
  }
  const completeChapter = () => {
    setCompletedChapters((current) => current.includes(selectedChapter.number) ? current : [...current, selectedChapter.number])
    notify(`第 ${selectedChapter.number} 章已完成，继续保持`) 
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" onClick={() => scrollTo('top')}>
          <span className="brand-mark">武</span>
          <span>
            <strong>武同学AI实践营</strong>
            <small>WU AI PRACTICE CAMP</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="主导航">
          <a className="active" href="#top">首页</a>
          <a href="#courses">课程</a>
          <a href="#cases">实战案例</a>
          <a href="#path">学习路径</a>
          <a href="#knowledge">文档库</a>
          <a href="#community">社区</a>
        </nav>
        <div className="header-actions">
          <label className="search-box">
            <MagnifyingGlass size={18} weight="bold" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索案例、Skill、课程" />
          </label>
          <button className="icon-button" aria-label="通知" onClick={() => notify('目前没有新的通知')}><Bell size={20} /></button>
          <button className="button button-outline small" onClick={() => notify('登录功能将在下一版接入')}>登录</button>
          <button className="button button-primary small" onClick={() => setModal('signup')}>注册</button>
        </div>
      </header>

      <main id="top">
        <section className="hero page-width">
          <div className="hero-copy">
            <p className="eyebrow"><span /> AI 实践社区 · 真实任务驱动</p>
            <h1>把每一次成功，<br /><em>变成可复用的方法</em></h1>
            <p className="hero-lede">课程、案例、Skill 和知识库，陪你把 AI 用进真实工作。</p>
            <div className="hero-actions">
              <button className="button button-primary large" onClick={() => scrollTo('courses')}>开始免费学习 <ArrowRight size={19} weight="bold" /></button>
              <button className="button button-outline large" onClick={() => scrollTo('cases')}>浏览实战案例 <ArrowRight size={19} weight="bold" /></button>
            </div>
            <div className="hero-stats">
              <span><strong>10万+</strong><small>同学一起学习</small></span>
              <span><strong>300+</strong><small>课程持续更新</small></span>
              <span><strong>可复用</strong><small>把方法沉淀下来</small></span>
            </div>
          </div>
          <div className="hero-art" aria-label="AI 工作流示意图">
            <img src="assets/hero-community.jpg" alt="橙色 AI 工作流插画" />
            <div className="hero-note hero-note-one">学以致用<br /><b>知行合一</b></div>
            <div className="hero-note hero-note-two">专注解决<br /><b>实际问题</b></div>
          </div>
        </section>

        <section className="page-width section-block" id="cases">
          <div className="section-heading">
            <div>
              <p className="eyebrow orange"><span /> 每周更新</p>
              <h2>本周真实案例</h2>
              <p>不是看完就忘的教程，而是拿来就能复现的工作方法。</p>
            </div>
            <button className="text-link" onClick={() => notify('案例筛选页正在制作中')}>查看全部案例 <ArrowRight size={17} /></button>
          </div>
          <div className="content-grid">
            <div className="case-list">
              {filteredCases.map((item) => (
                <article className="case-row" key={item.id}>
                  <img src={item.image} alt="" />
                  <div className="case-body">
                    <div className="case-title-line">
                      <span className="case-number">{item.accent}</span>
                      <h3>{item.title}</h3>
                      <span className="reproducible"><CheckCircle size={14} weight="fill" /> 可复现</span>
                    </div>
                    <p>{item.description}</p>
                    <div className="case-meta"><span><UserCircle size={17} /> {item.author}</span><span>难度：{item.difficulty}</span><span>节省时间：{item.saved}</span></div>
                    <div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <button className={`save-button ${saved.includes(item.id) ? 'saved' : ''}`} aria-label="收藏案例" onClick={() => toggleSave(item.id)}><BookmarkSimple size={20} weight={saved.includes(item.id) ? 'fill' : 'regular'} /></button>
                  <button className="case-open" onClick={() => setModal(item)}>查看 <ArrowRight size={16} /></button>
                </article>
              ))}
              {!filteredCases.length && <div className="empty-state">没有找到匹配的案例，试试搜索“自动化”或“WorkBuddy”。</div>}
            </div>

            <aside className="side-stack">
              <section className="side-card" id="skills">
                <div className="side-heading"><h3>Skill 本周推荐</h3><button className="text-link" onClick={() => notify('Skill 广场正在整理中')}>更多 Skill <ArrowRight size={15} /></button></div>
                <div className="skill-list">{skills.map(({ icon: Icon, name, detail, count }) => <button className="skill-item" key={name} onClick={() => notify(`已打开：${name}`)}><span className="skill-icon"><Icon size={20} weight="duotone" /></span><span><b>{name}</b><small>{detail}</small></span><em>{count}</em></button>)}</div>
              </section>
              <section className="side-card contribution-card" id="community">
                <div className="side-heading"><h3>学员贡献</h3><UsersThree size={21} weight="duotone" /></div>
                <div className="contribution-stats"><span><strong>1,248</strong><small>实战案例</small></span><span><strong>327</strong><small>优质 Skill</small></span><span><strong>2,156</strong><small>知识库条目</small></span></div>
                <div className="member-line"><UsersThree size={19} /><span>已有 12,345 位同学在这里互相帮助，共同成长</span></div>
              </section>
              <section className="share-card">
                <div><h3>分享你的工作流</h3><p>把你的实战经验沉淀为案例，帮助更多同学提升效率。</p><button className="button button-primary" onClick={() => setModal('submit')}>立即发布案例 <PaperPlaneTilt size={17} weight="fill" /></button></div>
                <Sparkle size={62} weight="duotone" className="share-spark" />
              </section>
            </aside>
          </div>
        </section>

        <section className="page-width learning-strip" id="courses">
          <div><p className="eyebrow orange"><span /> 从今天开始</p><h2>先学一门，马上用起来</h2><p>免费课程帮助你入门，付费课程带你完成更完整的结果。</p></div>
          <div className="learning-cards">
            <button className="learning-card featured" onClick={openCourse}><span className="course-label">免费课程</span><h3>WorkBuddy 免费实战课</h3><p>35 章完整内容，带你从安装、任务、Skill、实战案例到自己的 AI 工作系统</p><div className="progress"><span style={{ width: `${Math.max(8, Math.round((completedChapters.length / allChapters.length) * 100))}%` }} /></div><small>{completedChapters.length ? `已完成 ${completedChapters.length}/${allChapters.length} 章 · 继续学习` : '查看完整目录，开始第一章'} <ArrowRight size={16} /></small></button>
            <button className="learning-card" onClick={() => notify('付费课程详情将在下一版接入')}><span className="course-label paid">付费进阶</span><h3>Codex 橙皮书</h3><p>从 0 到 1 掌握 AI 编程思维与实战方法</p><small>了解课程 <ArrowRight size={16} /></small></button>
            <button className="learning-card" onClick={() => notify('付费课程详情将在下一版接入')}><span className="course-label paid">付费进阶</span><h3>image2 生图训练营</h3><p>系统掌握 AI 生图技巧与工作流</p><small>了解课程 <ArrowRight size={16} /></small></button>
          </div>
        </section>

        <section className="page-width roadmap section-block" id="path">
          <div className="section-heading compact"><div><p className="eyebrow orange"><span /> 学习路径</p><h2>从一个任务，到自己的 AI 工作系统</h2></div><button className="text-link" onClick={() => notify('完整学习路径正在制作中')}>查看完整路径 <ArrowRight size={17} /></button></div>
          <div className="roadmap-line"><span className="roadmap-step active"><b>01</b><strong>先用起来</strong><small>免费入门</small></span><span className="line" /><span className="roadmap-step"><b>02</b><strong>做真实任务</strong><small>案例练习</small></span><span className="line" /><span className="roadmap-step"><b>03</b><strong>沉淀 Skill</strong><small>方法复用</small></span><span className="line" /><span className="roadmap-step"><b>04</b><strong>组建工作流</strong><small>系统进阶</small></span></div>
        </section>

        <section className="principles" id="knowledge">
          <div className="page-width principles-inner"><div><p className="eyebrow orange"><span /> 我们相信</p><h2>学以致用，互助成长</h2></div><div className="principle-grid"><span><CheckCircle size={26} /><b>真实可复现</b><small>每个案例都经过验证，拿来就能用</small></span><span><TrendUp size={26} /><b>工具即方法</b><small>聚焦 WorkBuddy 等实用工具与技巧</small></span><span><Lightbulb size={26} /><b>学以致用</b><small>从学习到落地，解决真实工作问题</small></span><span><UsersThree size={26} /><b>互助成长</b><small>社区共创，让知识产生更大价值</small></span></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="page-width footer-inner"><div><strong>武同学AI实践营</strong><p>让 AI 真正帮你做事。</p></div><div className="footer-links"><a href="#courses">课程中心</a><a href="#cases">实战案例</a><a href="#skills">Skill 广场</a><a href="#community">学员共创</a></div><span>© 2026 Wu AI Practice Camp</span></div></footer>

      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className={`modal ${modal === 'course' ? 'course-modal' : ''} ${modal === 'reader' ? 'course-reader-modal' : ''}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)} aria-label="关闭"><X size={22} /></button>{modal === 'submit' ? <><span className="modal-icon"><Plus size={26} /></span><h2>分享你的工作流</h2><p>下一版将支持上传案例、Skill、Prompt 和配套文件。现在可以先留下你的想法。</p><textarea placeholder="你最想分享什么 AI 工作方法？" /><button className="button button-primary full" onClick={() => { setModal(null); notify('感谢你的分享，投稿入口即将开放') }}>提交想法</button></> : modal === 'signup' ? <><span className="modal-icon"><UserCircle size={26} /></span><h2>加入武同学AI实践营</h2><p>注册后可以记录学习进度、收藏案例，并参与社区共创。</p><button className="button button-primary full" onClick={() => { setModal(null); notify('注册功能将在下一版接入') }}>继续注册</button></> : modal === 'course' ? <CourseModal selectedChapter={selectedChapter} onSelect={setSelectedChapter} onStart={openReader} /> : modal === 'reader' ? <CourseReader chapter={selectedChapter} completedChapters={completedChapters} onBack={() => setModal('course')} onPrevious={() => moveChapter(-1)} onNext={() => moveChapter(1)} onComplete={completeChapter} /> : <><span className="modal-icon"><CheckCircle size={26} /></span><h2>{modal.title}</h2><p>{modal.description}</p><div className="modal-course-meta"><span>作者：{modal.author}</span><span>难度：{modal.difficulty}</span><span>可节省：{modal.saved}</span></div><button className="button button-primary full" onClick={() => { setModal(null); notify('已加入我的实践') }}>开始复现</button></>}</div></div>}
      {toast && <div className="toast"><CheckCircle size={18} weight="fill" />{toast}</div>}
    </div>
  )
}

export default App
