const sheetRows = (columns, rows) => ({ columns, rows })

export const embeddedSheetTables = {
  'WiAAsoijWhHC3qt5KYtcIGFPnCg:V90EYE': sheetRows(
    ['坑', '原因', '解决方法'],
    [
      ['Prompt 写得太模糊，AI 跑偏', '没指定输入来源和输出格式', 'Prompt 里必须包含输入来源、输出格式、具体字段'],
      ['高频任务消耗大量积分', 'FREQ=HOURLY 一天跑 24 次', '日常任务用 FREQ=DAILY，最多一天一次'],
      ['客户端退了，定时任务不触发', '需要客户端保持运行', '保持电脑开机且 WorkBuddy 运行，或配置锁屏远程'],
    ],
  ),
  'Bo8OsfGDXhpeJwtk0jWcZeihnQg:Yqj7r5': sheetRows(
    ['对比维度', '豆包', 'WorkBuddy'],
    [
      ['主要定位', '对话式 AI 助手', 'AI Agent 桌面工作台'],
      ['文件操作', '需手动上传/下载', '直接读写本地授权文件'],
      ['外部工具', '插件/GPTs', 'MCP 连接器（更开放）'],
      ['自动化', '需手动触发', '支持定时自动化'],
      ['专属专家', '不支持', '100+ 领域专家，按需召唤'],
    ],
  ),
  'NRhsszAhXhAJCStWnmqcBlOGnQd:sQnnCT': sheetRows(
    ['Skill 名称', '功能', '触发词示例'],
    [
      ['xlsx', 'Excel 高级分析、图表生成', '"/xlsx 读取..."'],
      ['pptx', 'PPT 自动制作', '"/pptx 根据..."'],
      ['docx', 'Word 文档生成', '"/docx 写一份..."'],
      ['pdf', 'PDF 读取、合并、拆分、转换', '"/pdf 提取..."'],
      ['frontend-design', '前端页面设计', '"/frontend-design..."'],
      ['agent-browser', '浏览器自动化', '"/agent-browser..."'],
      ['khazix-writer', '公众号长文写作（卡兹克风格）', '"写文章"'],
      ['baoyu-post-to-wechat', '发布到公众号草稿箱', '"发布到公众号"'],
    ],
  ),
  'P8Yts91B2hALGCtJg96c0G79nzP:5nR9Nk': sheetRows(
    ['专家名称', '定位', '擅长领域'],
    [
      ['Kai', '内容创作专家', '多平台内容创作'],
      ['Phoebe', '数据分析师', '复杂数据转化为业务报告'],
      ['Jude', '中国电商运营专家', '天猫/京东/拼多多运营'],
      ['Maya', '抖音策略师', '抖音算法、爆款视频创作'],
      ['Ula', '销售教练', '销售方法论、成交率提升'],
      ['Ben', '品牌策略师', '15 年品牌战略经验'],
      ['Fay', '小红书运营专家', '小红书种草生态、高互动率内容'],
      ['Tess', '招聘专家', '人才招聘全流程管理'],
    ],
  ),
  'P8Yts91B2hALGCtJg96c0G79nzP:3rc55F': sheetRows(
    ['角色', '职责'],
    [
      ['选题研究员', '挖掘选题、收集素材'],
      ['初稿撰写', '生成文章初稿'],
      ['标题优化', '优化标题吸引力'],
      ['排版校对', '格式排版与内容校对'],
    ],
  ),
  'Ny8SsywZlhfzQ2tkU8pcbhJdnue:ArCqrm': sheetRows(
    ['功能分类', '指令示例'],
    [
      ['邮件收取', '"帮我收邮件" / "查看最近一周的邮件"'],
      ['邮件阅读', '"读取第 3 封邮件的正文"'],
      ['邮件搜索', '"找一下上周那个关于预算调整的邮件"'],
      ['邮件摘要', '"帮我看看今天有什么重要邮件，做个摘要"'],
      ['邮件发送', '"帮我写一封给客户的项目延期说明邮件，语气正式"'],
      ['邮件分类', '"把过去一个月的邮件按客户/内部/通知三类整理"'],
      ['自动化工作流', '"每天 8:30 检查邮箱，把重要邮件摘要发到我微信"'],
    ],
  ),
  'Ny8SsywZlhfzQ2tkU8pcbhJdnue:i7lEz4': sheetRows(
    ['服务', '连接方式', '主要能力'],
    [
      ['Notion', 'MCP 连接器', '读写页面、数据库查询'],
      ['Wolai', 'MCP 连接器', '读写文档、块级操作'],
      ['Obsidian', 'Skill 插件', '本地笔记读写、搜索'],
      ['滴答清单', 'MCP 连接器', '任务管理、待办同步'],
      ['Flomo', 'MCP 连接器', '笔记记录、标签管理'],
      ['GitHub', 'MCP 连接器', '仓库操作、PR/Issue 管理'],
      ['飞书', 'MCP 连接器', '云文档读写、多维表格'],
      ['企业微信', 'MCP 连接器', '消息推送、群机器人'],
    ],
  ),
}

export const embeddedVideos = {
  O9VRbQt0Go8idsxQv5Fc6bpLnLc: 'assets/course-media/chapter-13/video-01.mp4',
}

export function hydrateCourseEmbeds(markdown) {
  let hydrated = markdown.replace(/<sheet([^>]*)><\/sheet>/g, (match, attrs) => {
    const token = attrs.match(/token="([^"]+)"/)?.[1]
    const sheetId = attrs.match(/sheet-id="([^"]+)"/)?.[1]
    const table = embeddedSheetTables[`${token}:${sheetId}`]
    if (!table) return ''
    const header = `| ${table.columns.join(' | ')} |`
    const divider = `| ${table.columns.map(() => '---').join(' | ')} |`
    const rows = table.rows.map((row) => `| ${row.map((cell) => String(cell).replaceAll('|', '\\|')).join(' | ')} |`)
    return `\n\n${header}\n${divider}\n${rows.join('\n')}\n\n`
  })
  hydrated = hydrated.replace(/<figure[^>]*>\s*<source[^>]*token="([^"]+)"[^>]*>\s*<\/figure>/g, (match, token) => {
    const video = embeddedVideos[token]
    return video ? `\n\n<video controls preload="metadata" src="${video}"></video>\n\n` : ''
  })
  return hydrated
}
