import fs from 'node:fs'

const html = await (await fetch('https://skills.sh/?view=all-time')).text()
const normalized = html.replace(/\\"/g, '"')
const recordPattern = /"source":"([^"]+)","skillId":"([^"]+)","name":"([^"]+)","installs":(\d+)/g
const all = []
let match
while ((match = recordPattern.exec(normalized))) {
  all.push({ source: match[1], slug: match[2], name: match[3], installs: Number(match[4]) })
}

if (all.length < 220) throw new Error(`skills.sh leaderboard returned only ${all.length} records`)

const rules = [
  ['读书与研究', /book|read|paper|research|arxiv|academic|literature|study|learn|knowledge|citation|scholar|journal|pdf|summar|extract|crawl|firecrawl/i],
  ['生图与设计', /image|photo|visual|illustrat|infographic|poster|cover|figma|design|ui|ux|graphic|canvas|screenshot|video|thumbnail|xhs|xiaohongshu|baoyu/i],
  ['办公与文档', /excel|spreadsheet|word|doc|office|ppt|slide|notion|feishu|lark|gmail|outlook|calendar|drive|keep|report|invoice|meeting|linear|jira|slack|task|project/i],
  ['数据与分析', /data|sql|python|csv|table|analytics|dashboard|stat|finance|chart|etl|db|database|postgres|supabase|airtable|metric|forecast/i],
  ['写作与内容', /write|writer|writing|article|blog|newsletter|email|copy|content|story|script|translate|translation|proofread|brand|prd|product|documentation|markdown/i],
  ['自媒体与增长', /social|douyin|tiktok|youtube|instagram|seo|marketing|sales|lead|growth|prospect|ads|viral|launch|community|linkedin/i],
  ['自我进化', /coach|mentor|habit|productivity|plan|goal|reflection|decision|career|interview|personal|brainstorm|think|memory|feedback|grill|motivat/i],
  ['Skill 蒸馏与升级', /skill|creator|evol|improv|workflow|agent|orchestrat|multi|prompt|context|debug|review|eval|test|refactor|performance|security|deploy|release|qa|audit/i],
]

const categoryFor = (value) => rules.find(([, pattern]) => pattern.test(value))?.[0] || '代码与开发'
const humanize = (value) => value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
const formatInstalls = (value) => value >= 1000000 ? `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M` : value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(value)
const categoryCopy = {
  '读书与研究': '阅读、检索、研究和知识沉淀',
  '生图与设计': '图片、视觉、视频和界面创作',
  '办公与文档': '文档、表格、会议和团队协作',
  '数据与分析': '数据清洗、分析、图表和数据库',
  '写作与内容': '写作、编辑、翻译和内容生产',
  '自媒体与增长': '自媒体、营销、SEO 和增长',
  '自我进化': '规划、复盘、学习和个人成长',
  'Skill 蒸馏与升级': '创建、评估、调试和升级 Agent 能力',
  '代码与开发': '开发、框架、测试和工程交付',
}

const seen = new Set()
const expanded = all.slice(0, 260).filter((item) => {
  if (seen.has(item.slug)) return false
  seen.add(item.slug)
  return true
}).slice(0, 240).map((item, index) => {
  const category = categoryFor(`${item.source} ${item.slug}`)
  const label = humanize(item.name || item.slug)
  return {
    id: `${item.source}/${item.slug}`,
    name: item.name || item.slug,
    title: label,
    category,
    detail: `把 ${label} 相关能力装进 Agent，适合${categoryCopy[category]}。详细行为以仓库里的 SKILL.md 为准。`,
    audience: `${category}场景的 AI 使用者`,
    benefit: `少走一遍从零搭建流程，先安装、再用真实任务验证。`,
    rank: `All-time #${index + 1}`,
    installs: formatInstalls(item.installs),
    source: item.source,
    audit: '目录榜单信息不等于安全背书；安装前请检查仓库、SKILL.md、脚本和权限。',
    installCommand: `npx skills add https://github.com/${item.source} --skill ${item.slug}`,
    repoUrl: `https://github.com/${item.source}`,
    marketUrl: `https://www.skills.sh/${item.source}/${item.slug}`,
    steps: ['先打开 Skill 页面和仓库，确认来源与最近更新时间', '用低风险样本运行一次，检查输入、输出和外部权限', '确认结果稳定后，再把它加入自己的日常工作流'],
  }
})

const output = `// Generated from the public skills.sh all-time leaderboard on ${new Date().toISOString().slice(0, 10)}.\n// Do not edit by hand; run: node scripts/generate-skill-catalog.mjs\nexport const expandedSkillCatalog = ${JSON.stringify(expanded, null, 2)}\n`
fs.writeFileSync(new URL('../src/skillCatalogExpanded.js', import.meta.url), output)
console.log(`Generated ${expanded.length} expanded skills across ${new Set(expanded.map((item) => item.category)).size} categories.`)
