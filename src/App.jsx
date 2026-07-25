import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
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
import { hydrateCourseEmbeds } from './courseEmbeds'
import { careerCourseGroups, careerCoursePrompts, careerCourseStats } from './careerCourseContent'
import { imageCourseExamples, imageCourseGroups, imageCoursePrompts, imageCourseStats, imagePromptRules } from './imageCourseContent'
import { createSubmission, getAdminDashboard, getSession, grantCourse, isDemoAuth, logout, requestAuthCode, reviewSubmission, verifyAuthCode } from './community'
import { skillCatalog, skillCategories } from './skillCatalog'

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

const skills = skillCatalog

const paidCourses = {
  codex: {
    id: 'codex',
    title: 'Codex 橙皮书',
    description: '从 0 到 1 掌握 AI 编程思维、代码协作和可交付的软件工作流。',
    audience: 'AI 编程入门', duration: '建议 6 周', status: '付费课程', label: '付费进阶', cover: 'assets/course-cover-codex.png', benefit: '把一个想法做成可运行、可验证、可发布的产品',
    price: { original: 199, sale: 49.9 },
    outputs: ['一套可复用的 Codex 工作流', '从需求到交付的项目练习', '代码审查与迭代检查表'],
    syllabus: ['任务拆解与上下文准备', '从原型到可运行产品', '调试、验证与发布'],
    chapters: ['需求拆解与工作区准备', '从原型到可运行页面', '读代码、改代码与调试', '测试、验收与版本迭代', '部署上线与项目复盘'],
    cta: '报名并查看优惠价',
  },
  image: {
    id: 'image',
    title: 'AI 生图工作流训练营',
    description: '从平台和模型选型，到提示词规范、行业案例、系列素材和交付验收，练出一套可复用的视觉生产方法。',
    audience: '内容创作者、运营、品牌和设计初学者', duration: '建议 4 周', status: '付费课程', label: '付费进阶', cover: 'assets/image-example-course-poster.png', benefit: '独立完成一套可发布、可复用的视觉素材',
    price: { original: 199, sale: 49.9 },
    outputs: ['一套生图提示词规范', '30+ 个行业提示词模板', '电商、内容、课程海报作品集'],
    syllabus: ['平台与模型选择', '提示词十段式与迭代规范', '行业案例与系列组图', '作品集和商业交付'],
    chapters: imageCourseGroups.flatMap((group) => group.chapters.map((chapter) => chapter.title)),
    cta: '报名并查看优惠价',
  },
  career: {
    id: 'career',
    title: '大学生求职 AI 课',
    description: '把 AI 用到求职全流程：方向梳理、岗位研究、简历优化、作品集、投递、面试和 Offer 决策。',
    audience: '大学生、应届生和转行初学者', duration: '建议 3 周', status: '付费课程', label: '付费进阶', cover: 'assets/course-cover-career.png', benefit: '拿到一套真实、可投递、可复盘的求职材料',
    stats: careerCourseStats,
    price: { original: 199, sale: 49.9 },
    outputs: ['一份岗位定制简历', '一套求职证据库和作品集', '投递跟踪表、面试回答卡和复盘报告'],
    syllabus: ['岗位定位与 JD 拆解', '简历、项目和作品集', '投递策略与面试模拟', 'Offer 比较与入职准备'],
    chapters: careerCourseGroups.flatMap((group) => group.chapters.map((chapter) => chapter.title)),
    cta: '报名并查看优惠价',
  },
}

const freeCourse = {
  id: 'free',
  kind: 'free',
  title: 'WorkBuddy 免费实战课',
  label: '免费完整课',
  cover: 'assets/course-cover-workbuddy.png',
  benefit: '从安装开始，完成第一个真实任务并搭出自己的 AI 工作系统',
  description: '35 章、17 个实战案例、40+ 个可复制 Prompt，适合第一次把 AI 用进工作的同学。',
  stats: '35 章 · 17 个案例 · 40+ Prompt',
}

const courseCatalog = [freeCourse, paidCourses.image, paidCourses.career, paidCourses.codex]

function CourseModal({ selectedChapter, onSelect, onStart }) {
  const [keyword, setKeyword] = useState('')
  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredGroups = useMemo(() => {
    if (!normalizedKeyword) return freeCourseGroups
    return freeCourseGroups.map((group) => ({
      ...group,
      chapters: group.chapters.filter((chapter) => [chapter.number, chapter.title, chapter.level, chapter.intro, chapter.exercise, chapter.output].join(' ').toLowerCase().includes(normalizedKeyword)),
    })).filter((group) => group.chapters.length)
  }, [normalizedKeyword])

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
          <label className="course-search"><MagnifyingGlass size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索章节、案例或关键词" /></label>
          {filteredGroups.map((group) => (
            <section key={group.part} className="course-group">
              <div className="course-group-heading"><div><b>{group.part}</b><small>{group.summary}</small></div><em>{group.range}</em></div>
              {group.chapters.map((chapter) => <button key={chapter.number} className={`course-chapter ${selectedChapter.number === chapter.number ? 'selected' : ''}`} onClick={() => onSelect(chapter)}><span>{chapter.number}</span><span><b>{chapter.title}</b><small>{chapter.level} · {chapter.time}</small></span><ArrowRight size={16} /></button>)}
            </section>
          ))}
          {!filteredGroups.length && <div className="course-empty">没有找到匹配章节，试试“Skill”“会议”或“自动化”。</div>}
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

function SkillDetailModal({ skill, onNotify }) {
  const Icon = skill.icon
  return <div className="skill-detail-content">
    <span className="modal-icon"><Icon size={26} weight="duotone" /></span>
    <p className="eyebrow orange"><span /> 可安装 Skill</p>
    <h2>{skill.title || skill.name}</h2>
    <div className="skill-detail-name">{skill.name} · {skill.category}</div>
    <p>{skill.detail}</p>
    <div className="skill-detail-meta"><span>适合：{skill.audience}</span><span>{skill.rank}</span><span>安装量：{skill.installs}</span><span>{skill.source}</span></div>
    <div className="skill-benefit"><b>它能帮你</b><strong>{skill.benefit}</strong></div>
    <section className="skill-steps"><b>使用方法</b><ol>{skill.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol></section>
    <section className="skill-install"><div className="prompt-library-heading"><b>安装命令</b><button className="text-link" onClick={() => { navigator.clipboard?.writeText(skill.installCommand); onNotify('安装命令已复制') }}>复制命令 <ArrowRight size={15} /></button></div><code>{skill.installCommand}</code><small className="skill-security">安全提示：{skill.audit}</small></section>
    <div className="skill-detail-links"><a className="button button-outline" href={skill.marketUrl} target="_blank" rel="noreferrer">打开 Skill 详情</a><a className="button button-primary" href={skill.repoUrl} target="_blank" rel="noreferrer">查看 GitHub 仓库 <ArrowRight size={17} /></a></div>
  </div>
}

function SkillGalleryModal({ items, onSelect }) {
  const [category, setCategory] = useState('全部')
  const [recommendIndex, setRecommendIndex] = useState(0)
  const filteredItems = category === '全部' ? items : items.filter((skill) => skill.category === category)
  useEffect(() => {
    const timer = window.setInterval(() => setRecommendIndex((index) => (index + 1) % items.length), 4200)
    return () => window.clearInterval(timer)
  }, [items.length])
  const recommended = items[recommendIndex]
  return <div className="skill-gallery-content">
    <div className="course-modal-heading"><div><span className="modal-icon"><SquaresFour size={26} /></span><p className="eyebrow orange"><span /> Skill 广场</p><h2>找到一个真正能安装的 Skill</h2><p>这里展示来自 skills.sh 榜单、官方仓库和高质量社区仓库的真实 Skill。每个条目都有安装命令、仓库、用途和安全提示。</p></div><div className="course-modal-stats"><span><strong>{items.length}</strong><small>已整理 Skill</small></span><span><strong>滚动推荐</strong><small>榜单更新</small></span></div></div>
    <div className="skill-recommendation"><span className="skill-recommendation-label">正在推荐</span><b>{recommended.title || recommended.name}</b><small>{recommended.rank} · {recommended.installs} 安装</small><button className="text-link" onClick={() => onSelect(recommended)}>查看并安装 <ArrowRight size={15} /></button></div>
    <div className="skill-gallery-filter">{skillCategories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="skill-gallery-grid">{filteredItems.map((skill) => { const Icon = skill.icon; return <button className="skill-gallery-card" key={skill.id} onClick={() => onSelect(skill)}><div className="skill-card-topline"><span className="skill-icon"><Icon size={22} weight="duotone" /></span><small>{skill.category}</small></div><b>{skill.title || skill.name}</b><code>{skill.name}</code><p>{skill.detail}</p><strong>{skill.rank} · {skill.installs} 安装</strong><small className="skill-card-source">{skill.source} · 查看安装详情 <ArrowRight size={15} /></small></button> })}</div>
  </div>
}

function CourseCard({ course, featured = false, onOpen }) {
  return <button className={'learning-card course-card ' + (featured ? 'featured' : '')} onClick={() => onOpen(course)}>
    <div className="course-card-cover"><img src={course.cover} alt="" /><span className={'course-label ' + (course.kind === 'free' ? '' : 'paid')}>{course.label}</span></div>
    <h3>{course.title}</h3>
    <p>{course.description}</p>
    <strong className="course-card-benefit">学完你会：{course.benefit}</strong>
    <small>{course.kind === 'free' ? '免费开始学习' : '查看目录与报名'} <ArrowRight size={16} /></small>
  </button>
}

function CourseCenterModal({ courses, onOpen }) {
  const [keyword, setKeyword] = useState('')
  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredCourses = courses.filter((course) => [course.title, course.description, course.benefit, course.label].join(' ').toLowerCase().includes(normalizedKeyword))
  return <div className="course-center-content">
    <div className="course-modal-heading"><div><span className="modal-icon"><FileText size={26} /></span><p className="eyebrow orange"><span /> 全部课程</p><h2>课程中心</h2><p>首页只展示精选课程，完整课程目录、价格和学习状态都在这里。后续新增课程也会统一进入课程中心。</p></div><div className="course-modal-stats"><span><strong>{courses.length}</strong><small>当前课程</small></span><span><strong>免费 + 付费</strong><small>学习方式</small></span></div></div>
    <label className="course-center-search"><MagnifyingGlass size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索课程、结果或适合人群" /></label>
    <div className="course-center-grid">{filteredCourses.map((course) => <CourseCard key={course.id} course={course} onOpen={onOpen} />)}</div>
    {!filteredCourses.length && <div className="course-empty">没有找到匹配课程，试试搜索“生图”“求职”或“WorkBuddy”。</div>}
  </div>
}

function EnrollmentOffer({ course }) {
  const price = course.price || { original: 199, sale: 49.9 }
  return <section className="enrollment-offer"><div className="enrollment-heading"><b>报名方式</b><small>打开课程后直接查看价格与联系方式</small></div><div className="enrollment-price"><span>整门课程</span><del>原价 ¥{price.original}</del><strong>¥{price.sale}</strong><small>限时优惠价 · 完整课程一次解锁</small></div><div className="enrollment-contact"><img src="assets/contact-personal-qr.jpg" alt="武同学个人二维码" /><div><b>添加武同学报名</b><p>扫码添加武同学，回复“课程”，发送你想报名的课程名称。</p><small>当前课程为整门课程总价，不按章节单独收费；后续可在课程配置中调整整门课程的原价和优惠价。</small></div></div></section>
}

function PaidCourseModal({ course, unlocked, onClose, onNotify }) {
  return (
    <div className="paid-course-content">
      <span className="modal-icon"><Sparkle size={26} /></span>
      <p className="eyebrow orange"><span /> 付费进阶课程</p>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <div className="modal-course-meta"><span>{course.audience}</span><span>{course.duration}</span><span>{unlocked ? '已解锁' : '已上线'}</span></div>
      <div className="course-value"><b>学完你会</b><strong>{course.benefit}</strong></div>
      {course.stats && <div className="course-modal-stats paid-course-stats">{course.stats.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}</div>}
      <div className="paid-course-grid">
        <section><b>你会拿到什么</b><ul>{course.outputs.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><b>课程重点</b><ul>{course.syllabus.map((item) => <li key={item}>{item}</li>)}</ul></section>
      </div>
      {course.chapters?.length > 0 && <section className="paid-chapter-outline"><b>课程目录 · 共 {course.chapters.length} 节</b><ol>{course.chapters.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item}</strong><small>{unlocked ? '已解锁，可开始学习' : '报名后解锁本课程内容'}</small></div></li>)}</ol></section>}
      {unlocked ? <div className="course-unlocked-note"><CheckCircle size={18} weight="fill" /> 本课程已解锁，可以开始学习。</div> : <EnrollmentOffer course={course} />}
    </div>
  )
}

function ImageCourseModal({ unlocked, onNotify }) {
  const chapters = imageCourseGroups.flatMap((group) => group.chapters)
  const [selected, setSelected] = useState(chapters[0])
  const [prompt, setPrompt] = useState(imageCoursePrompts[0])
  return (
    <div className="course-modal-content image-course-content">
      <div className="course-modal-heading">
        <div>
          <span className="modal-icon"><Sparkle size={26} /></span>
          <p className="eyebrow orange"><span /> 付费课程 · {unlocked ? '已解锁' : '已上线'}</p>
          <h2>AI 生图工作流训练营</h2>
          <p>从平台和模型选型，到分行业提示词，再到系列素材和交付验收，练出一套真正能用于工作和作品集的生图方法。</p>
          <div className="course-value"><b>学完你会</b><strong>{paidCourses.image.benefit}</strong></div>
        </div>
        <div className="course-modal-stats">{imageCourseStats.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}</div>
      </div>
      <div className="course-modal-layout">
        <div className="course-chapter-list image-course-list">
          {imageCourseGroups.map((group) => <section key={group.part} className="course-group"><div className="course-group-heading"><div><b>{group.part}</b><small>{group.summary}</small></div><em>{group.range}</em></div>{group.chapters.map((chapter) => <button key={chapter.number} className={'course-chapter ' + (selected.number === chapter.number ? 'selected' : '')} onClick={() => setSelected(chapter)}><span>{chapter.number}</span><span><b>{chapter.title}</b><small>{chapter.level} · {chapter.time}</small></span><ArrowRight size={16} /></button>)}</section>)}
        </div>
        <article className="course-detail image-course-detail">
          <span className="course-detail-number">第 {selected.number} 章</span>
          <h3>{selected.title}</h3>
          <p className="course-detail-intro">{selected.intro}</p>
          {unlocked ? <><div className="course-detail-block"><b>马上练习</b><p>{selected.exercise}</p></div><div className="course-detail-block"><b>本章产出</b><p>{selected.output}</p></div><div className="prompt-library">
            <div className="prompt-library-heading"><b>分行业提示词模板</b><select value={prompt.label} onChange={(event) => setPrompt(imageCoursePrompts.find((item) => item.label === event.target.value) || imageCoursePrompts[0])}>{imageCoursePrompts.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}</select></div>
            <code>{prompt.prompt}</code>
            <button className="text-link" onClick={() => { navigator.clipboard?.writeText(prompt.prompt); onNotify('提示词模板已复制') }}>复制模板 <ArrowRight size={15} /></button>
          </div><section className="prompt-rules"><b>提示词规范</b><div>{imagePromptRules.map(([title, detail]) => <article key={title}><strong>{title}</strong><p>{detail}</p></article>)}</div></section><section className="image-example-section"><div className="prompt-library-heading"><b>示例图：同一套规范如何落地</b><small>先看用途，再看画面结构</small></div><div className="image-example-grid">{imageCourseExamples.map((example) => <article key={example.title}><img src={example.image} alt={example.title} /><span>{example.type}</span><b>{example.title}</b><p>{example.takeaway}</p><button className="text-link" onClick={() => { navigator.clipboard?.writeText(example.prompt); onNotify('示例提示词已复制') }}>复制示例提示词 <ArrowRight size={15} /></button></article>)}</div></section><div className="course-detail-tip"><CheckCircle size={17} weight="fill" /> 每章都要留下过程稿、提示词和验收记录，最后组成自己的作品集。</div></> : <div className="course-lock-note"><Sparkle size={19} /><b>本章内容已上线</b><p>当前展示课程目录与章节简介。完整练习、提示词规范、行业模板和示例图，报名后解锁。</p></div>}
          {unlocked ? <div className="course-unlocked-note"><CheckCircle size={18} weight="fill" /> 生图训练营已解锁，可以开始学习。</div> : <EnrollmentOffer course={paidCourses.image} />}
        </article>
      </div>
    </div>
  )
}

function CareerCourseModal({ unlocked, onNotify }) {
  const chapters = careerCourseGroups.flatMap((group) => group.chapters)
  const [selected, setSelected] = useState(chapters[0])
  const [prompt, setPrompt] = useState(careerCoursePrompts[0])
  return <div className="course-modal-content career-course-content">
    <div className="course-modal-heading"><div><span className="modal-icon"><UserCircle size={26} /></span><p className="eyebrow orange"><span /> 付费课程 · {unlocked ? '已解锁' : '已上线'}</p><h2>大学生求职 AI 课</h2><p>把 7 天启动训练营和完整求职课整合起来：从卡点诊断、岗位定位、JD 拆解到简历、作品集、投递、面试和 Offer 决策，做出一套可执行的求职闭环。</p><div className="course-value"><b>学完你会</b><strong>{paidCourses.career.benefit}</strong></div></div><div className="course-modal-stats">{careerCourseStats.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}</div></div>
    <div className="course-modal-layout"><div className="course-chapter-list career-course-list">{careerCourseGroups.map((group) => <section key={group.part} className="course-group"><div className="course-group-heading"><div><b>{group.part}</b><small>{group.summary}</small></div><em>{group.range}</em></div>{group.chapters.map((chapter) => <button key={chapter.number} className={'course-chapter ' + (selected.number === chapter.number ? 'selected' : '')} onClick={() => setSelected(chapter)}><span>{chapter.number}</span><span><b>{chapter.title}</b><small>{chapter.level} · {chapter.time}</small></span><ArrowRight size={16} /></button>)}</section>)}</div><article className="course-detail career-course-detail"><span className="course-detail-number">第 {selected.number} 章</span><h3>{selected.title}</h3><p className="course-detail-intro">{selected.intro}</p>{unlocked ? <><div className="course-detail-block"><b>马上练习</b><p>{selected.exercise}</p></div><div className="course-detail-block"><b>本章产出</b><p>{selected.output}</p></div>{selected.acceptance && <div className="course-detail-block"><b>验收标准</b><p>{selected.acceptance}</p></div>}<div className="prompt-library"><div className="prompt-library-heading"><b>求职 Prompt 模板</b><select value={prompt.label} onChange={(event) => setPrompt(careerCoursePrompts.find((item) => item.label === event.target.value) || careerCoursePrompts[0])}>{careerCoursePrompts.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}</select></div><code>{prompt.prompt}</code><button className="text-link" onClick={() => { navigator.clipboard?.writeText(prompt.prompt); onNotify('求职 Prompt 已复制') }}>复制 Prompt <ArrowRight size={15} /></button></div><div className="course-detail-tip"><CheckCircle size={17} weight="fill" /> 每章都要留下证据、版本和复盘记录，最后形成完整求职作品集。</div></> : <div className="course-lock-note"><UserCircle size={19} /><b>本章内容已上线</b><p>当前展示课程目录与章节简介。完整练习、求职 Prompt、简历模板、投递计划和面试模拟，报名后解锁。</p></div>}{unlocked ? <div className="course-unlocked-note"><CheckCircle size={18} weight="fill" /> 大学生求职 AI 课已解锁，可以开始学习。</div> : <EnrollmentOffer course={paidCourses.career} />}</article></div>
  </div>
}

function AuthModal({ initialMode = 'login', onClose, onAuthenticated, onNotify }) {
  const [mode, setMode] = useState(initialMode)
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const sendCode = async () => {
    if (!email.includes('@')) { setMessage('请先输入有效邮箱'); return }
    setBusy(true)
    try {
      const result = await requestAuthCode(email, name)
      setMessage(result.message || '验证码已发送，请检查邮箱')
      setStep('code')
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }

  const verifyCode = async () => {
    setBusy(true)
    try {
      const result = await verifyAuthCode(email, code, name)
      onAuthenticated(result.user)
      onNotify(result.demo ? '本地演示账号已登录' : '登录成功')
      onClose()
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}><div className="modal auth-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="关闭"><X size={22} /></button><span className="modal-icon"><UserCircle size={26} /></span><p className="eyebrow orange"><span /> 邮箱登录</p><h2>{mode === 'login' ? '回来继续学习' : '加入武同学AI实践营'}</h2><p>{mode === 'login' ? '登录后同步学习进度、收藏和投稿记录。' : '用邮箱注册，参与课程学习和社区共创。'}</p><div className="auth-switch"><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setStep('email'); setMessage('') }}>登录</button><button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setStep('email'); setMessage('') }}>注册</button></div>{step === 'email' ? <div className="auth-form">{mode === 'register' && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="你的昵称（可选）" /> }<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="name@example.com" autoComplete="email" /><button className="button button-primary full" disabled={busy} onClick={sendCode}>{busy ? '发送中…' : '发送邮箱验证码'}</button></div> : <div className="auth-form"><input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" maxLength={6} placeholder="输入 6 位验证码" autoComplete="one-time-code" /><button className="button button-primary full" disabled={busy} onClick={verifyCode}>{busy ? '验证中…' : '验证并进入'}</button><button className="text-link auth-resend" onClick={() => setStep('email')}>换个邮箱或重新发送</button></div>}{message && <div className="auth-message">{message}</div>}{isDemoAuth() && <small className="auth-demo-note">当前是本地预览模式，验证码会显示在这里；正式部署后将发送到邮箱。</small>}</div></div>
  )
}

function ContributionModal({ user, onClose, onLogin, onNotify }) {
  const [form, setForm] = useState({ title: '', category: '实战案例', description: '', prompt: '', assetUrl: '' })
  const [busy, setBusy] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) { onNotify('请填写标题和案例说明'); return }
    setBusy(true)
    try { await createSubmission(form); onClose(); onNotify('投稿已提交，等待管理员审核') } catch (error) { onNotify(error.message) } finally { setBusy(false) }
  }
  return <div className="modal contribution-modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose} aria-label="关闭"><X size={22} /></button><span className="modal-icon"><Plus size={26} /></span><p className="eyebrow orange"><span /> 学员共创</p><h2>分享你的工作流</h2><p>{user ? '投稿人：' + (user.name || user.email) : '登录后才能提交投稿，内容会先进入管理员审核。'}</p>{user ? <div className="contribution-form"><input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="投稿标题，例如：用 AI 做一份周报" /><select value={form.category} onChange={(event) => update('category', event.target.value)}><option>实战案例</option><option>Skill</option><option>Prompt</option><option>知识卡片</option></select><textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="你解决了什么问题？具体怎么做？最后得到什么结果？" /><textarea value={form.prompt} onChange={(event) => update('prompt', event.target.value)} placeholder="可选：贴出 Prompt、步骤或关键配置" /><input value={form.assetUrl} onChange={(event) => update('assetUrl', event.target.value)} placeholder="可选：成品图片或文件链接" /><button className="button button-primary full" disabled={busy} onClick={submit}>{busy ? '提交中…' : '提交投稿'}</button></div> : <button className="button button-primary full" onClick={() => { onClose(); onLogin() }}>先去登录</button>}</div>
}

function AdminPanel({ data, loading, onRefresh, onReview, onGrant, onClose }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal admin-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="关闭"><X size={22} /></button><div className="admin-heading"><div><p className="eyebrow orange"><span /> 管理员工作台</p><h2>社区运营中心</h2><p>查看用户、处理投稿、维护社区内容状态。</p></div><button className="button button-outline small" onClick={onRefresh}>刷新数据</button></div>{loading ? <div className="course-reader-loading">正在读取管理数据…</div> : <><div className="admin-stats"><span><strong>{data?.stats?.users || 0}</strong><small>用户</small></span><span><strong>{data?.stats?.submissions || 0}</strong><small>投稿</small></span><span><strong>{data?.stats?.pending || 0}</strong><small>待审核</small></span></div><section className="admin-section"><h3>投稿审核</h3>{data?.submissions?.length ? <div className="admin-table">{data.submissions.map((item) => <article key={item.id}><div><b>{item.title}</b><small>{item.author || item.authorEmail || '匿名'} · {item.category} · {item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已拒绝'}</small><p>{item.description}</p></div><div className="admin-actions"><button className="button button-primary small" disabled={item.status === 'approved'} onClick={() => onReview(item.id, 'approved')}>通过</button><button className="button button-outline small" disabled={item.status === 'rejected'} onClick={() => onReview(item.id, 'rejected')}>退回</button></div></article>)}</div> : <div className="course-empty">目前还没有投稿。</div>}</section><section className="admin-section"><h3>最近用户与课程解锁</h3><div className="admin-user-list">{(data?.users || []).slice(0, 8).map((item) => <article className="admin-user-row" key={item.id}><div><b>{item.name || '未命名'}</b><small>{item.email} · {item.role === 'admin' ? '管理员' : '学员'}</small></div><div className="admin-actions"><button className="button button-outline small" disabled={item.unlockedCourses?.includes('image')} onClick={() => onGrant(item.id, 'image')}>{item.unlockedCourses?.includes('image') ? '生图已解锁' : '解锁生图课'}</button><button className="button button-outline small" disabled={item.unlockedCourses?.includes('career')} onClick={() => onGrant(item.id, 'career')}>{item.unlockedCourses?.includes('career') ? '求职已解锁' : '解锁求职课'}</button></div></article>)}</div></section></>}</div></div>
}

const allChapters = freeCourseGroups.flatMap((group) => group.chapters)

function CourseReader({ chapter, details, loadError, completedChapters, onBack, onPrevious, onNext, onComplete }) {
  const chapterIndex = allChapters.findIndex((item) => item.number === chapter.number)
  const isFirst = chapterIndex === 0
  const isLast = chapterIndex === allChapters.length - 1
  const isCompleted = completedChapters.includes(chapter.number)
  const sourceMarkdown = hydrateCourseEmbeds(details?.[chapter.number]?.markdown || '')
  const sourceHtml = useMemo(() => marked.parse(sourceMarkdown, { gfm: true, breaks: true }), [sourceMarkdown])

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
          {loadError ? <div className="course-reader-loading error">正文加载失败，请刷新后重试。</div> : !details ? <div className="course-reader-loading">正在加载本章正文、图片和表格…</div> : <>
            <div className="course-reader-source-note"><span>飞书第二稿 · 原文迁移</span><span>正文、图片、表格、Prompt 已保留</span></div>
            <div className="course-markdown" dangerouslySetInnerHTML={{ __html: sourceHtml }} />
            <div className="course-reader-practice">
              <p className="eyebrow orange"><span /> 本章学习卡</p>
              <h3>看完原文，马上动手</h3>
              <p className="course-reader-lede">不要只看懂这一章，围绕一个真实任务完成练习，并留下可以复用的产出。</p>
              <div className="course-reader-grid">
                <section className="course-reader-card"><span>01</span><h4>跟着做</h4><p>{chapter.exercise}</p></section>
                <section className="course-reader-card"><span>02</span><h4>完成产出</h4><p>{chapter.output}</p></section>
              </div>
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
          </>}
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
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('wu-ai-saved-cases') || '[]') } catch { return [] }
  })
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [session, setSession] = useState(null)
  const [unlockedCourses] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('wu-ai-unlocked-courses') || '[]') } catch { return [] }
  })
  const [authMode, setAuthMode] = useState(null)
  const [adminData, setAdminData] = useState(null)
  const [adminLoading, setAdminLoading] = useState(false)
  const [courseDetails, setCourseDetails] = useState(null)
  const [courseLoadError, setCourseLoadError] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(freeCourseGroups[0].chapters[0])
  const [completedChapters, setCompletedChapters] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('wu-ai-completed-chapters') || '[]') } catch { return [] }
  })

  useEffect(() => { window.localStorage.setItem('wu-ai-saved-cases', JSON.stringify(saved)) }, [saved])
  useEffect(() => { window.localStorage.setItem('wu-ai-completed-chapters', JSON.stringify(completedChapters)) }, [completedChapters])
  useEffect(() => { getSession().then(setSession).catch(() => setSession(null)) }, [])
  useEffect(() => {
    if (modal === 'reader') document.querySelector('.course-reader-modal .course-reader-main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [modal, selectedChapter.number])

  const filteredCases = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return cases
    return cases.filter((item) => [item.title, item.description, ...item.tags].join(' ').toLowerCase().includes(text))
  }, [query])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const hasCourseAccess = (courseId) => session?.role === 'admin' || unlockedCourses.includes(courseId) || session?.unlockedCourses?.includes(courseId)

  const toggleSave = (id) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    notify(saved.includes(id) ? '已取消收藏' : '案例已收藏到我的实践')
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const openCourse = () => {
    const nextChapter = allChapters.find((chapter) => !completedChapters.includes(chapter.number)) || allChapters[0]
    setSelectedChapter(nextChapter)
    setModal('course')
  }
  const openCatalogCourse = (course) => {
    if (course.kind === 'free') openCourse()
    else if (course.id === 'image') setModal('image-course')
    else if (course.id === 'career') setModal('career-course')
    else setModal({ kind: 'paid-course', course })
  }
  const openReader = async () => {
    setModal('reader')
    if (courseDetails) return
    try {
      const module = await import('./courseDetails')
      setCourseDetails(module.courseDetails)
    } catch {
      setCourseLoadError(true)
    }
  }
  const moveChapter = (offset) => {
    const currentIndex = allChapters.findIndex((item) => item.number === selectedChapter.number)
    const nextChapter = allChapters[currentIndex + offset]
    if (nextChapter) setSelectedChapter(nextChapter)
  }
  const completeChapter = () => {
    setCompletedChapters((current) => current.includes(selectedChapter.number) ? current : [...current, selectedChapter.number])
    notify(`第 ${selectedChapter.number} 章已完成，继续保持`)
  }
  const openAdmin = async () => {
    setAdminLoading(true)
    try { setAdminData(await getAdminDashboard()) } catch (error) { notify(error.message) } finally { setAdminLoading(false) }
  }
  const refreshAdmin = async () => {
    setAdminLoading(true)
    try { setAdminData(await getAdminDashboard()) } catch (error) { notify(error.message) } finally { setAdminLoading(false) }
  }
  const handleReview = async (id, status) => {
    try { await reviewSubmission(id, status); await refreshAdmin(); notify(status === 'approved' ? '投稿已通过' : '投稿已退回') } catch (error) { notify(error.message) }
  }
  const handleGrantCourse = async (userId, courseId) => {
    try {
      await grantCourse(userId, courseId)
      if (session?.id === userId) setSession(await getSession())
      await refreshAdmin()
      const courseName = courseId === 'image' ? '生图课' : courseId === 'career' ? '求职课' : 'Codex 橙皮书'
      notify(courseName + '已解锁')
    } catch (error) { notify(error.message) }
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
          {session ? <div className="session-actions"><span className="session-name">{session.name || session.email}</span>{session.role === 'admin' && <button className="button button-outline small" onClick={openAdmin}>管理后台</button>}<button className="button button-primary small" onClick={async () => { await logout(); setSession(null); notify('已退出登录') }}>退出</button></div> : <><button className="button button-outline small" onClick={() => setAuthMode('login')}>登录</button><button className="button button-primary small" onClick={() => setAuthMode('register')}>注册</button></>}
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
            <button className="text-link" onClick={() => { setQuery(''); scrollTo('cases') }}>查看全部案例 <ArrowRight size={17} /></button>
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
                <div className="side-heading"><h3>Skill 本周推荐</h3><button className="text-link" onClick={() => setModal('skills')}>Skill 广场 <ArrowRight size={15} /></button></div>
                <div className="skill-list">{skills.slice(0, 3).map((skill) => { const Icon = skill.icon; return <button className="skill-item" key={skill.id} onClick={() => setModal({ kind: 'skill', skill })}><span className="skill-icon"><Icon size={20} weight="duotone" /></span><span><b>{skill.title || skill.name}</b><small>{skill.detail}</small></span><em>{skill.installs}</em></button> })}</div>
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
            <CourseCard course={freeCourse} featured onOpen={openCatalogCourse} />
            <CourseCard course={paidCourses.image} onOpen={openCatalogCourse} />
            <CourseCard course={paidCourses.career} onOpen={openCatalogCourse} />
            <button className="learning-more-card" onClick={() => setModal('course-center')}><span className="learning-more-number">{courseCatalog.length}</span><b>门课程</b><p>进入课程中心，按主题、结果和学习方式筛选</p><span className="text-link">查看全部课程 <ArrowRight size={16} /></span></button>
          </div>
        </section>

        <section className="page-width roadmap section-block" id="path">
          <div className="section-heading compact"><div><p className="eyebrow orange"><span /> 学习路径</p><h2>从一个任务，到自己的 AI 工作系统</h2></div><button className="text-link" onClick={() => scrollTo('path')}>查看完整路径 <ArrowRight size={17} /></button></div>
          <div className="roadmap-line"><span className="roadmap-step active"><b>01</b><strong>先用起来</strong><small>免费入门</small></span><span className="line" /><span className="roadmap-step"><b>02</b><strong>做真实任务</strong><small>案例练习</small></span><span className="line" /><span className="roadmap-step"><b>03</b><strong>沉淀 Skill</strong><small>方法复用</small></span><span className="line" /><span className="roadmap-step"><b>04</b><strong>组建工作流</strong><small>系统进阶</small></span></div>
        </section>

        <section className="principles" id="knowledge">
          <div className="page-width principles-inner"><div><p className="eyebrow orange"><span /> 我们相信</p><h2>学以致用，互助成长</h2></div><div className="principle-grid"><span><CheckCircle size={26} /><b>真实可复现</b><small>每个案例都经过验证，拿来就能用</small></span><span><TrendUp size={26} /><b>工具即方法</b><small>聚焦 WorkBuddy 等实用工具与技巧</small></span><span><Lightbulb size={26} /><b>学以致用</b><small>从学习到落地，解决真实工作问题</small></span><span><UsersThree size={26} /><b>互助成长</b><small>社区共创，让知识产生更大价值</small></span></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="page-width footer-inner"><div><strong>武同学AI实践营</strong><p>让 AI 真正帮你做事。</p></div><div className="footer-links"><a href="#courses">课程中心</a><a href="#cases">实战案例</a><a href="#skills">Skill 广场</a><a href="#community">学员共创</a></div><span>© 2026 Wu AI Practice Camp</span></div></footer>

      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className={`modal ${modal === 'course' ? 'course-modal' : ''} ${modal === 'reader' ? 'course-reader-modal' : ''} ${modal?.kind === 'paid-course' ? 'paid-course-modal' : ''} ${modal === 'career-course' ? 'course-modal' : ''}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)} aria-label="关闭"><X size={22} /></button>{modal === 'submit' ? <ContributionModal user={session} onClose={() => setModal(null)} onLogin={() => setAuthMode('login')} onNotify={notify} /> : modal === 'course-center' ? <CourseCenterModal courses={courseCatalog} onOpen={openCatalogCourse} /> : modal === 'skills' ? <SkillGalleryModal items={skills} onSelect={(skill) => setModal({ kind: 'skill', skill })} /> : modal?.kind === 'skill' ? <SkillDetailModal skill={modal.skill} onNotify={notify} /> : modal === 'image-course' ? <ImageCourseModal unlocked={hasCourseAccess('image')} onNotify={notify} /> : modal === 'career-course' ? <CareerCourseModal unlocked={hasCourseAccess('career')} onNotify={notify} /> : modal === 'course' ? <CourseModal selectedChapter={selectedChapter} onSelect={setSelectedChapter} onStart={openReader} /> : modal === 'reader' ? <CourseReader chapter={selectedChapter} details={courseDetails} loadError={courseLoadError} completedChapters={completedChapters} onBack={() => setModal('course')} onPrevious={() => moveChapter(-1)} onNext={() => moveChapter(1)} onComplete={completeChapter} /> : modal?.kind === 'paid-course' ? <PaidCourseModal course={modal.course} unlocked={hasCourseAccess(modal.course.id)} onClose={() => setModal(null)} onNotify={notify} /> : <><span className="modal-icon"><CheckCircle size={26} /></span><h2>{modal.title}</h2><p>{modal.description}</p><div className="modal-course-meta"><span>作者：{modal.author}</span><span>难度：{modal.difficulty}</span><span>可节省：{modal.saved}</span></div><button className="button button-primary full" onClick={() => { setModal(null); notify('已加入我的实践') }}>开始复现</button></>}</div></div>}
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} onAuthenticated={setSession} onNotify={notify} />}
      {adminData && session?.role === 'admin' && <AdminPanel data={adminData} loading={adminLoading} onRefresh={refreshAdmin} onReview={handleReview} onGrant={handleGrantCourse} onClose={() => setAdminData(null)} />}
      {toast && <div className="toast"><CheckCircle size={18} weight="fill" />{toast}</div>}
    </div>
  )
}

export default App
