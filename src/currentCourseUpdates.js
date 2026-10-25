const replaceAll = (text, replacements) => replacements.reduce((result, [from, to]) => result.split(from).join(to), text)
const appendOnce = (chapter, marker, section) => {
  if (!chapter?.markdown || chapter.markdown.includes(marker)) return
  chapter.markdown = `${chapter.markdown.trim()}\n\n${section.trim()}\n`
}

export const softwareAudit = {
  checkedAt: '2026-10-25',
  sources: [
    ['WorkBuddy 官网与下载', 'https://www.workbuddy.cn/work/'],
    ['WorkBuddy 安装与更新文档', 'https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Installation-Win-Guide'],
    ['WorkBuddy 移动端连接文档', 'https://www.workbuddy.cn/docs/workbuddymini/features/Multidevice'],
    ['WorkBuddy 连接器文档', 'https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Connector'],
    ['WorkBuddy 模型配置文档', 'https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Model'],
    ['微信读书官方 Skill', 'https://github.com/Tencent/WeChatReading'],
    ['cc-connect', 'https://github.com/chenhg5/cc-connect'],
    ['ChatGPT Images 官方说明', 'https://help.openai.com/en/articles/11084440-images-in-chatgpt'],
    ['微信开发者工具', 'https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html'],
  ],
}

const currentChapter8 = `# 第 8 章 如何通过手机指挥 WorkBuddy

**本章重点：**桌面端与手机端的多端协同、同账号连接设备、手机端查看和接管任务。

> 本章按 [WorkBuddy 多端协同官方文档](https://www.workbuddy.cn/docs/workbuddymini/features/Multidevice) 更新。二维码、按钮名称和移动端功能会随版本变化，请以当前客户端为准。

## 先分清两种运行位置

| 模式 | 任务在哪里运行 | 是否依赖电脑在线 | 适合任务 |
|-|-|-|-|
| 本机模式 | 已连接的电脑 | 是 | 本地文件、本地 Skill、已有工作区 |
| 云端模式 | 隔离的云端环境 | 否 | 调研、写作、临时分析、并行任务 |

WorkBuddy 的手机端不是简单的“远程聊天窗口”：本机模式下，任务仍然在电脑端执行；手机端负责查看状态、继续对话、停止任务和接收产物。

## 连接电脑：当前推荐流程

1. 在桌面端登录 WorkBuddy，确认电脑和手机使用同一个账号。
2. 在桌面端侧边栏底部找到“连接移动端”，打开“允许移动端连接此设备”。
3. 在手机端打开 WorkBuddy App 或小程序，进入设备入口。
4. 在“选择设备”中选择要连接的电脑；首次连接后，设备关系会保留。
5. 先发送一条只读指令，确认电脑在线、工作空间正确，再处理文件或执行外部操作。

手机端可以继续发送指令、停止正在运行的任务、查看等待输入/等待审批/已完成/失败状态，也可以查看和保存电脑端生成的产物。

## 电脑锁屏时的设置

如果希望离开电脑后任务仍能运行，在连接面板中打开“保持唤醒状态，以便远程访问”或“允许锁屏运行”。不同系统的名称可能不同；先用低风险任务测试，再把重要工作交给无人值守任务。

## 手机端 App、小程序与企业微信

移动端入口包括 WorkBuddy App 和 WorkBuddy 小程序；下载入口见 [WorkBuddy 官网](https://www.workbuddy.cn/)。是否提供 iOS、Android、鸿蒙或企业微信能力，以当前官网和账号地区显示为准。

## 常见问题

- 看不到设备：确认桌面端已登录、允许移动端连接已打开，且两端账号一致。
- 任务无法继续：先检查电脑是否在线、是否锁屏、WorkBuddy 是否仍在运行。
- 产物没有回传：先在桌面端确认任务已完成，再检查小程序/移动端的产物列表和网络。
- 要切换账号：在移动端退出当前账号，再用桌面端对应账号登录；不要把登录二维码或授权截图发到公开群组。

## 接入飞书、钉钉等外部消息平台

这类接入不再等同于“扫描一个微信助理二维码”。优先从 WorkBuddy 的“专家·技能·连接器 → 连接器”进入，选择已有连接器或按当前官方指引配置自定义连接器，并遵循最小权限原则。

如果需要把 Claude Code、Cursor、Gemini CLI、Codex 等本地 Agent 接到飞书、钉钉、Slack、Telegram 等平台，可以参考 [cc-connect](https://github.com/chenhg5/cc-connect)：

~~~bash
npm install -g cc-connect
cc-connect --version
cc-connect
~~~

先阅读项目 README，完成 \`config.toml\` 和平台授权，再用一条只读测试消息验证。稳定版与 beta 版能力可能不同，不要照搬旧截图里的版本号或命令。
`

export function applyImageCourseUpdates({ imageCourseGroups, imageCourseChapterContent }) {
  const intro = imageCourseGroups?.flatMap((group) => group.chapters || []).find((chapter) => chapter.number === '01')
  if (intro) intro.title = '破冰入门：0基础上手 ChatGPT Images'

  const handbook = imageCourseGroups?.flatMap((group) => group.chapters || []).find((chapter) => chapter.number === 'B')
  if (handbook) handbook.title = 'ChatGPT Images 提示词精选手册'

  const openingLesson = imageCourseChapterContent?.['00']
  if (openingLesson?.sections?.[0]?.[1]) {
    openingLesson.sections[0][1] = '课程示例主要使用 ChatGPT Images；也可把结构迁移到其他支持对话式生图的平台。'
  }
}

export function applyCurrentCourseUpdates({ courseDetails, worksCourseDetails } = {}) {
  const chapter2 = courseDetails?.['02']
  if (chapter2) {
    chapter2.markdown = replaceAll(chapter2.markdown, [
      ['https://www.codebuddy.cn/events/invite?inviteCode=zb8i5hqtpx9vbk', 'https://www.workbuddy.cn/work/'],
      ['下载WorkBuddy，点击官方地址（https://www.workbuddy.cn/work/），选择WorkBuddy，点击“下载WorkBuddy”即可下载。', '访问 [WorkBuddy 官方下载页](https://www.workbuddy.cn/work/)，选择与系统匹配的版本，点击“下载 WorkBuddy”即可下载。'],
      ['点击左下角个人中心，选择“检查更新”，检查是否有新版本，若有新版本，可更新', '点击左下角头像 → 关于 → 检查更新，系统会自动检测版本；有新版本时按提示下载并升级。'],
    ])
  }

  const chapter5 = courseDetails?.['05']
  if (chapter5) {
    chapter5.markdown = replaceAll(chapter5.markdown, [
      ['SkillHub上', '技能市场上'],
      ['SkillHub技能市场', 'WorkBuddy 的技能市场'],
      ['从 SkillHub 浏览安装', '从技能市场浏览安装'],
      ['进入 SkillHub', '进入技能市场'],
      ['从 OpenClaw 社区安装', '让 WorkBuddy 按描述查找或创建'],
    ])
  }

  const chapter7 = courseDetails?.['07']
  if (chapter7) {
    chapter7.markdown = replaceAll(chapter7.markdown, [
      ['当前已支持 QQ 邮箱、腾讯文档、腾讯乐享、腾讯会议、TAPD 等连接器。', '当前官方文档列出的连接器包括 QQ 邮箱、腾讯文档、腾讯乐享、腾讯会议、TAPD、腾讯网盘等，具体列表以客户端为准。'],
      ['左侧导航栏点击「**资料库**」→ 授权绑定腾讯文档账号', '左侧边栏点击「**专家·技能·连接器**」→「连接器」，找到腾讯文档并点击「+」完成授权'],
      ['用 QQ 邮箱 App（≥7.1.5）扫描系统跳转的授权二维码', '按页面提示使用 QQ 邮箱 App 扫码授权，所需版本以当前页面提示为准'],
      ['点击连接器管理页面右上角「**自定义连接器**」按钮，按引导配置 MCP 连接器。', '在「连接器」页面点击「+」或「**自定义连接器**」，按引导配置 MCP 连接器。'],
    ])
  }

  if (courseDetails?.['08']) courseDetails['08'] = { ...courseDetails['08'], markdown: currentChapter8 }

  const chapter9 = courseDetails?.['09']
  if (chapter9) {
    chapter9.markdown = replaceAll(chapter9.markdown, [
      ['WorkBuddy支持接入其他 LLM 的 API，以及 Coding Plan、Token Plan 等套餐。', 'WorkBuddy 支持内置模型、第三方模型与自定义模型；具体能力、套餐和模型列表以 [官方模型配置文档](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Model) 为准。'],
      ['比如，DeepSeek，你只需要输入api key即可，', '如果供应商已经在列表中，通常只需补充 API Key；如果未列出，请按供应商文档准备完整的接口地址、模型名和权限信息。'],
      ['选择【自定义costom】，填写接口地址（供应商后台有）', '选择「自定义 / Custom」，按供应商后台填写接口地址、API Key 和模型名称；保存前先确认费用、数据流向和权限。'],
    ])
  }

  appendOnce(courseDetails?.['09'], '## 当前版本补充：模型与数据边界', `## 当前版本补充：模型与数据边界

截至 2026-10-25，WorkBuddy 官方更新日志已经进入 5.9 系列。自定义模型除了填写接口地址、API Key 和模型名称，还要确认供应商是否可信、数据会发送到哪里、费用如何计算，以及是否需要额外的权限。

- 不要把 API Key、Cookie 或企业数据粘贴到公开对话或截图中。
- 先用无敏感信息的小样本测试，再处理真实资料。
- 自定义模型的可用模型、套餐和客户端入口会变化，优先以 [官方模型配置文档](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Model) 和 [官方更新日志](https://www.workbuddy.cn/docs/workbuddy/Changelog) 为准。
`)

  appendOnce(courseDetails?.['10'], '## 当前版本补充：让自动化可观察', `## 当前版本补充：让自动化可观察

自动化任务不要只验证“能不能跑”，还要验证“出了问题能不能发现和接管”。建议按下面顺序上线：

1. 先运行一次性任务或草稿模式，确认输入、输出和费用。
2. 保留任务历史、执行状态、失败原因和最终产物。
3. 为需要人工判断的动作保留审批点，不要默认自动发布或批量发送。
4. 设置通知和失败后的人工接管路径，再逐步提高频率和权限。

具体入口和任务能力以 [WorkBuddy 自动化文档](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Automation-Guide) 为准。
`)

  appendOnce(courseDetails?.['15'], '## 当前版本补充：资讯来源与核验', `## 当前版本补充：资讯来源与核验

资讯整合不仅是摘要，还要保留原始链接、发布时间和事实核验状态。对腾讯文档等外部资料，优先使用官方连接器或授权入口；不要把搜索结果摘要当作事实本身。

每条最终进入简报的内容至少保留：来源、发布时间、事实摘要、与工作的关系、待核验点和下一步动作。
`)

  appendOnce(courseDetails?.['16'], '## 当前版本补充：知识库权限', `## 当前版本补充：知识库权限

当前 WorkBuddy 继续增强腾讯文档等知识库连接能力。导入文件夹、搜索和上传前，先确认连接器授权范围，只开放完成当前任务所需的目录；首次接入建议先做只读检索，再测试写入或同步。

连接器入口和具体权限以 [官方连接器文档](https://open.workbuddy.cn/docs/connector) 为准。
`)

  appendOnce(courseDetails?.['27'], '## 当前版本补充：微信读书授权顺序', `## 当前版本补充：微信读书授权顺序

微信读书 Skill 只从 [官方仓库](https://github.com/Tencent/WeChatReading) 获取。第一次配置时先完成只读书架盘点，确认返回的是自己的数据，再做划线整理；API Key、登录凭据和个人阅读数据不要放进公开仓库、截图或共享 Prompt。
`)

  appendOnce(courseDetails?.['30'], '## 当前版本补充：Skill 交付标准', `## 当前版本补充：Skill 交付标准

一个可交付的 Skill 至少应包含：触发条件、输入输出、权限边界、失败处理、测试样例、版本记录和卸载方式。安装前先阅读仓库里的 \`SKILL.md\`、脚本和依赖；不要因为榜单排名或安装量就直接信任。
`)

  appendOnce(courseDetails?.['33'], '## 当前版本补充：可靠性验收', `## 当前版本补充：可靠性验收

上线自动化前，至少保留一次成功样本、一次失败样本和一次人工接管记录。每次迭代只改一个变量，并记录输入、版本、日志、产物和回滚方式；涉及对外发送、付费或删除操作时，默认停在人工确认。
`)

  Object.values(courseDetails || {}).forEach((chapter) => {
    if (!chapter?.markdown) return
    chapter.markdown = replaceAll(chapter.markdown, [
      ['SkillHub技能市场', 'WorkBuddy 的技能市场'],
      ['SkillHub上', '技能市场上'],
      ['SkillHub', '技能市场'],
      ['从 OpenClaw 社区安装', '让 WorkBuddy 按描述查找或创建'],
      ['CodeBuddy', 'WorkBuddy'],
      ['codebuddy', 'workbuddy'],
      ['7.1.5(鸿蒙0.2.9)及更新版本支持', '以当前页面提示的版本为准'],
      ['≥7.1.5', '以当前页面提示的版本为准'],
    ])
  })

  const works2 = worksCourseDetails?.['02']
  if (works2) {
    works2.markdown = replaceAll(works2.markdown, [
      ['`nihe0909/xiaohongshu-ai-workbench`', '[`mengke-wang/xiaohongshu-ai-workbench`](https://github.com/mengke-wang/xiaohongshu-ai-workbench)'],
      ['nihe0909/xiaohongshu-ai-workbench', 'mengke-wang/xiaohongshu-ai-workbench'],
    ])
  }
}
