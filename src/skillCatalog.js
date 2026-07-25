import { CheckCircle, FileText, Lightbulb, MagnifyingGlass, PaperPlaneTilt, Sparkle, SquaresFour, TrendUp } from '@phosphor-icons/react'

// 榜单数据按 2026-07-25 的 skills.sh / GitHub 页面整理；安装命令、仓库和技能页均可直接打开。
export const skillCatalog = [
  {
    id: 'find-skills', icon: SquaresFour, name: 'find-skills', title: '发现和安装更多 Skill', category: '发现与管理', detail: '让 AI 先从 Skill 广场找合适的能力，再按需安装。', audience: '不知道该装什么 Skill 的人', benefit: '把“有没有现成能力”变成可搜索、可安装的工作流。', rank: 'All-time #1', installs: '2.7M', stars: '27.1K', source: 'Vercel Labs 官方', audit: 'Trust Hub / Socket 通过；Snyk 提醒', installCommand: 'npx skills add https://github.com/vercel-labs/skills --skill find-skills', repoUrl: 'https://github.com/vercel-labs/skills', marketUrl: 'https://www.skills.sh/vercel-labs/skills/find-skills', steps: ['安装后让 AI 按任务搜索 Skill', '先看来源、安装量和审查状态', '确认仓库内容后再安装到对应 Agent']
  },
  {
    id: 'frontend-design', icon: Sparkle, name: 'frontend-design', title: '做出有辨识度的前端页面', category: '设计与前端', detail: '从审美方向、字体、色彩、布局和动效出发，生成生产级界面。', audience: '做网站、课程页、落地页的人', benefit: '减少模板化 AI 页面，让页面有明确的视觉观点。', rank: 'All-time #2 · Official', installs: '702.4K', stars: '164K', source: 'Anthropic 官方', audit: 'Trust Hub / Socket / Snyk 通过', installCommand: 'npx skills add https://github.com/anthropics/skills --skill frontend-design', repoUrl: 'https://github.com/anthropics/skills', marketUrl: 'https://www.skills.sh/anthropics/skills/frontend-design', steps: ['先说明产品、受众和页面目标', '让 AI 先给出视觉方向和信息层级', '再生成或改造 React、Vue 或 HTML/CSS']
  },
  {
    id: 'vercel-react-best-practices', icon: TrendUp, name: 'vercel-react-best-practices', title: 'React / Next.js 性能优化', category: '开发与性能', detail: '覆盖 70 条 React 和 Next.js 性能规则，按影响优先级检查。', audience: '用 React、Next.js 做网站和应用的人', benefit: '减少请求瀑布、无效渲染和首屏性能问题。', rank: 'All-time #4 · Official', installs: '578.2K', stars: '29.4K', source: 'Vercel Labs 官方', audit: 'Trust Hub / Socket / Snyk 通过', installCommand: 'npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices', repoUrl: 'https://github.com/vercel-labs/agent-skills', marketUrl: 'https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices', steps: ['安装后让 AI 检查现有页面', '按高、中、低影响排序改动', '改完运行构建和性能验证']
  },
  {
    id: 'agent-browser', icon: MagnifyingGlass, name: 'agent-browser', title: '让 Agent 真正操作浏览器', category: '浏览器与自动化', detail: '支持导航、点击、表单、数据提取、截图和会话保持。', audience: '需要让 AI 操作网页、后台和测试环境的人', benefit: '把网页上的重复操作变成可复现的浏览器工作流。', rank: 'All-time #5 · Official', installs: '577.1K', stars: '39.1K', source: 'Vercel Labs 官方', audit: 'Trust Hub / Socket 通过；Snyk 提醒', installCommand: 'npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser', repoUrl: 'https://github.com/vercel-labs/agent-browser', marketUrl: 'https://www.skills.sh/vercel-labs/agent-browser/agent-browser', steps: ['安装 CLI 和浏览器运行环境', '先用快照确认页面元素', '再执行点击、填写、提取和截图']
  },
  {
    id: 'ai-image-generation', icon: Sparkle, name: 'ai-image-generation', title: '调用 50+ 模型生图', category: '图片与视频', detail: '通过 inference.sh / belt CLI 调用多种生图模型，适合做批量素材实验。', audience: '想把生图接入工作流的人', benefit: '从手工试图升级为可重复、可批量的生图流程。', rank: 'Hot #1 · Trending', installs: '357.3K', stars: '649', source: '社区 Skill · 101-skills', audit: 'Trust Hub 通过；Socket 提醒', installCommand: 'npx skills add https://github.com/101-skills/skills --skill ai-image-generation', repoUrl: 'https://github.com/101-skills/skills', marketUrl: 'https://www.skills.sh/101-skills/skills/ai-image-generation', steps: ['安装 Skill 后再安装 belt CLI', '登录模型服务并选择模型', '用小样本验证提示词、比例和输出质量']
  },
  {
    id: 'ai-video-generation', icon: PaperPlaneTilt, name: 'ai-video-generation', title: 'AI 视频生成工作流', category: '图片与视频', detail: '从视频需求、镜头拆解到生成和迭代，适合快速验证视频素材。', audience: '短视频、课程和营销内容创作者', benefit: '把“想做一个视频”拆成可执行的镜头和生成步骤。', rank: 'Trending #1', installs: '21.8K', stars: '649', source: '社区 Skill · 101-skills', audit: '需安装前自行检查仓库和外部服务', installCommand: 'npx skills add https://github.com/101-skills/skills --skill ai-video-generation', repoUrl: 'https://github.com/101-skills/skills', marketUrl: 'https://www.skills.sh/101-skills/skills/ai-video-generation', steps: ['先写清视频用途和发布比例', '按镜头、主体、动作和声音拆分', '每个镜头单独验证后再合成']
  },
  {
    id: 'lark-doc', icon: FileText, name: 'lark-doc', title: '操作飞书文档和知识库', category: '飞书与办公', detail: '读取、创建、更新飞书文档、Wiki、表格和嵌入内容。', audience: '用飞书沉淀课程、知识库和团队资料的人', benefit: '让 AI 直接参与飞书内容整理、迁移和维护。', rank: 'All-time #59 · Official', installs: '386.9K', stars: '15.8K', source: 'Lark / 飞书官方', audit: 'Trust Hub / Socket 通过；Snyk 未通过', installCommand: 'npx skills add https://github.com/larksuite/cli --skill lark-doc', repoUrl: 'https://github.com/larksuite/cli', marketUrl: 'https://www.skills.sh/larksuite/cli/lark-doc', steps: ['先完成 lark-cli 登录和权限配置', '只读取需要的文档范围', '更新后重新读取并验收排版和图片']
  },
  {
    id: 'lark-slides', icon: FileText, name: 'lark-slides', title: '创建和编辑飞书幻灯片', category: '飞书与办公', detail: '按页面规划、布局、素材和 XML 协议创建、修改、验收演示文稿。', audience: '做课程课件、汇报和培训材料的人', benefit: '让 AI 从大纲到可编辑飞书幻灯片形成完整流程。', rank: 'All-time #90 · Official', installs: '334.3K', stars: '15.8K', source: 'Lark / 飞书官方', audit: 'Trust Hub / Socket / Snyk 通过', installCommand: 'npx skills add https://github.com/larksuite/cli --skill lark-slides', repoUrl: 'https://github.com/larksuite/cli', marketUrl: 'https://www.skills.sh/larksuite/cli/lark-slides', steps: ['先输出 slide_plan.json 页面计划', '准备并上传图片等素材', '创建后逐页检查布局、文字和图片']
  },
  {
    id: 'skill-creator', icon: SquaresFour, name: 'skill-creator', title: '创建属于自己的 Skill', category: '发现与管理', detail: '从触发条件、SKILL.md、测试用例到评估迭代，完整创建可复用 Skill。', audience: '想把自己的方法沉淀成 Skill 的人', benefit: '把一次性经验变成团队或社区都能安装的能力包。', rank: 'All-time #92 · Official', installs: '327.3K', stars: '164K', source: 'Anthropic 官方', audit: 'Trust Hub / Socket / Snyk 通过', installCommand: 'npx skills add https://github.com/anthropics/skills --skill skill-creator', repoUrl: 'https://github.com/anthropics/skills', marketUrl: 'https://www.skills.sh/anthropics/skills/skill-creator', steps: ['先写清 Skill 的触发场景', '补齐标准流程、脚本和资源', '用真实任务做有/无 Skill 的对照评估']
  },
  {
    id: 'webapp-testing', icon: CheckCircle, name: 'webapp-testing', title: '测试网页应用', category: '测试与质量', detail: '为网页应用建立可重复的浏览器测试、检查和验收流程。', audience: '做网站、后台和表单流程的人', benefit: '减少“能打开但关键按钮坏了”的上线风险。', rank: 'All-time #221 · Official', installs: '121.1K', stars: '164K', source: 'Anthropic 官方', audit: 'Trust Hub / Socket / Snyk 通过', installCommand: 'npx skills add https://github.com/anthropics/skills --skill webapp-testing', repoUrl: 'https://github.com/anthropics/skills', marketUrl: 'https://www.skills.sh/anthropics/skills/webapp-testing', steps: ['列出核心用户路径', '让 Agent 执行点击和表单测试', '保留失败截图、复现步骤和修复验证']
  },
  {
    id: 'ui-ux-pro-max', icon: Sparkle, name: 'ui-ux-pro-max', title: '查找 UI/UX 设计方案', category: '设计与前端', detail: '提供设计风格、配色、字体、组件和 UX 规则的可搜索数据库。', audience: '需要快速做出设计方向和界面规范的人', benefit: '从“凭感觉设计”变成有依据的界面决策。', rank: 'All-time #101', installs: '283.9K', stars: '109.8K', source: '社区 Skill', audit: 'Trust Hub 未通过；Socket 通过；Snyk 通过', installCommand: 'npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max', repoUrl: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill', marketUrl: 'https://www.skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max', steps: ['先描述产品类型和用户任务', '让 Skill 给出风格、字体和布局建议', '再结合项目现有设计系统落地']
  },
  {
    id: 'brainstorming', icon: Lightbulb, name: 'brainstorming', title: '先想清楚再开始做', category: '项目与工作流', detail: '通过结构化对话把模糊想法变成设计、规格和实施计划。', audience: '需求模糊、容易返工的项目负责人', benefit: '减少没想清楚就开工带来的返工。', rank: 'All-time #99', installs: '295.0K', stars: '260.6K', source: '社区 Skill · obra/superpowers', audit: 'Trust Hub / Socket / Snyk 通过', installCommand: 'npx skills add https://github.com/obra/superpowers --skill brainstorming', repoUrl: 'https://github.com/obra/superpowers', marketUrl: 'https://www.skills.sh/obra/superpowers/brainstorming', steps: ['先探索背景、目标和约束', '给出多个方案并评估取舍', '确认设计后再进入实施计划']
  },
  {
    id: 'systematic-debugging', icon: MagnifyingGlass, name: 'systematic-debugging', title: '系统定位和修复 Bug', category: '测试与质量', detail: '用观察、假设、实验和验证的循环处理复杂错误。', audience: '经常遇到“改了一个地方又坏另一个地方”的开发者', benefit: '避免凭感觉反复改代码，把调试变成可复盘过程。', rank: 'All-time #136', installs: '200.0K', stars: '260.6K', source: '社区 Skill · obra/superpowers', audit: 'Trust Hub / Socket / Snyk 通过', installCommand: 'npx skills add https://github.com/obra/superpowers --skill systematic-debugging', repoUrl: 'https://github.com/obra/superpowers', marketUrl: 'https://www.skills.sh/obra/superpowers/systematic-debugging', steps: ['先复现并记录最小失败样本', '提出可证伪的原因假设', '修复后运行回归验证并留下证据']
  },
  {
    id: 'copywriting', icon: Lightbulb, name: 'copywriting', title: '写转化型产品文案', category: '内容与营销', detail: '从用户、价值主张、证据和行动入口组织网页、课程和营销文案。', audience: '做课程、产品、活动和内容运营的人', benefit: '让文案从“介绍功能”变成“推动下一步行动”。', rank: 'All-time #187', installs: '160.3K', stars: '5.8K', source: '社区 Skill · marketingskills', audit: '安装前建议检查仓库内容', installCommand: 'npx skills add https://github.com/coreyhaines31/marketingskills --skill copywriting', repoUrl: 'https://github.com/coreyhaines31/marketingskills', marketUrl: 'https://www.skills.sh/coreyhaines31/marketingskills/copywriting', steps: ['先明确受众和行动目标', '补齐用户痛点、结果和可信证据', '最后检查标题、结构和 CTA']
  },
]

export const skillCategories = ['全部', ...new Set(skillCatalog.map((skill) => skill.category))]
