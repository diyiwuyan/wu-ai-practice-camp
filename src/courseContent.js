export const freeCourseGroups = [
  {
    part: '第一篇 · 使用手册：先把 WorkBuddy 用起来',
    range: '01—10',
    summary: '从安装、任务、Skill 到自动化，先跑通第一项真实工作。',
    chapters: [
      { number: '01', title: '初识 WorkBuddy', time: '15 分钟', level: '入门起点', intro: '理解 WorkBuddy 如何从目标、素材和权限出发，规划并交付一个真实任务。', exercise: '把一项模糊工作改写成目标、素材、交付格式和验收标准。', output: '第一条任务卡' },
      { number: '02', title: '下载、安装、登录与更新', time: '20 分钟', level: '动手准备', intro: '从官方入口完成安装、登录、版本确认和基础权限设置。', exercise: '建立一个不含敏感信息的测试工作区，并完成一次只读检查。', output: '安全工作区' },
      { number: '03', title: '主界面、任务与工作区', time: '20 分钟', level: '基础操作', intro: '认清任务、工作区、文件和结果的位置，让每项工作都有清晰边界。', exercise: '为一个真实任务建立输入、中间文件和最终输出三个目录。', output: '任务工作区' },
      { number: '04', title: '快速完成第一个任务', time: '25 分钟', level: '第一次交付', intro: '用 Ask、Plan、Craft 跑通一次从提问、规划到交付的完整闭环。', exercise: '用 3—5 份脱敏材料生成一页带证据和风险的简报。', output: '一页工作简报' },
      { number: '05', title: '加载一个真正用得上的 Skill', time: '25 分钟', level: '能力扩展', intro: '学会判断 Skill 的输入、输出、权限与失败边界，再用小样本验证。', exercise: '选一个内容整理 Skill，用 3 条测试素材跑通并记录失败点。', output: 'Skill 验证记录' },
      { number: '06', title: '专家和专家团', time: '25 分钟', level: '任务编排', intro: '把研究、写作、核验等不同职责拆成有交接格式的小型专家团。', exercise: '为一份行业简报设计研究员和编辑两个角色。', output: '角色分工卡' },
      { number: '07', title: '使用连接器', time: '25 分钟', level: '外部协作', intro: '从只读、单用途连接开始，理解外部系统的权限与数据边界。', exercise: '连接一个资料源，只搜索和汇总，不修改任何外部内容。', output: '连接器权限卡' },
      { number: '08', title: '接入小程序与 IM 助理', time: '30 分钟', level: '移动办公', intro: '把查询、提醒和轻量交办放到移动入口，复杂任务回到工作台。', exercise: '设计一个只收集和汇总日报的移动助理。', output: '移动助理方案' },
      { number: '09', title: '接入外部 API', time: '30 分钟', level: '能力连接', intro: '描述接口的输入、输出、权限和错误处理，再用测试数据完成调用。', exercise: '用一个公开低风险 API 生成一张数据卡。', output: 'API 调用记录' },
      { number: '10', title: '自动化任务', time: '35 分钟', level: '流程自动化', intro: '把触发、处理、交付、日志和失败回退连成一条可观察的流程。', exercise: '设计一个只生成草稿、暂不自动发布的每周简报任务。', output: '自动化流程卡' },
    ],
  },
  {
    part: '第二篇 · 案例篇：从一项任务到一支 AI 团队',
    range: '11—21',
    summary: '把 WorkBuddy 放进办公、文件、资讯、会议、内容与研究场景。',
    chapters: [
      { number: '11', title: 'Word、Excel、PPT 办公三件套', time: '40 分钟', level: '办公交付', intro: '先建立可信的事实底稿，再把同一套信息转换成文档、表格和演示。', exercise: '用一个小主题生成一页 Word、一个数据表和 5 页 PPT 草稿。', output: '办公三件套' },
      { number: '12', title: '整理桌面文件', time: '25 分钟', level: '文件安全', intro: '先盘点、再给方案、小批量执行，并保留原路径和跳过原因。', exercise: '在测试目录中模拟整理，不直接操作真实桌面。', output: '变更清单' },
      { number: '13', title: '远程控制电脑', time: '30 分钟', level: '高风险操作', intro: '认识可逆与不可逆动作，为远程操作设置白名单、暂停点和人工接管。', exercise: '只读取公开页面，遇到登录、验证码或弹窗立即停止。', output: '远程任务卡' },
      { number: '14', title: '生活助手与琐碎事务', time: '25 分钟', level: '日常提效', intro: '把时间、地点、预算和偏好写成约束，让结果可比较而不是凭感觉。', exercise: '设计一场半日活动的 3 个方案，不直接预订。', output: '方案比较表' },
      { number: '15', title: '资讯整合与每日通知', time: '35 分钟', level: '信息流', intro: '把大量链接变成去重、分组、带判断和可行动的每日简报。', exercise: '用自己的 10 条收藏生成一份 3 条精选晨报。', output: '每日简报' },
      { number: '16', title: '收藏变成可复用知识', time: '35 分钟', level: '知识管理', intro: '区分摘要和知识单元，保留来源、事实、观点、引用与下一步动作。', exercise: '把 3 篇收藏整理成可被下一次任务召回的知识卡片。', output: '知识卡片' },
      { number: '17', title: '会议结束后的行动台账', time: '30 分钟', level: '协作执行', intro: '把会议材料区分为已决定、待确认和行动项，补齐责任人、日期与验收标准。', exercise: '用一段会议记录生成可直接执行的行动表。', output: '行动台账' },
      { number: '18', title: '投资分析日常', time: '40 分钟', level: '高风险研究', intro: '用事实、推断、假设、反证信号和跟踪指标搭建结构化研究卡。', exercise: '围绕一家熟悉公司完成三栏分析，不把建议写成确定结论。', output: '公司分析卡' },
      { number: '19', title: '一句话召唤 AI 视频团队', time: '40 分钟', level: '内容生产', intro: '让策划、编剧、导演、剪辑和发布运营各自承担清晰职责。', exercise: '从一个主题开始，先只设计策划和编剧两个角色。', output: '脚本与分镜表' },
      { number: '20', title: '自媒体增长闭环', time: '40 分钟', level: '内容增长', intro: '把选题、脚本、封面、发布和 48 小时复盘串成可迭代的流程。', exercise: '从一段真实经历生成 3 个选题角度并完成一个内容包。', output: '内容发布包' },
      { number: '21', title: 'WorkBuddy 做 GEO 专家', time: '35 分钟', level: '品牌与检索', intro: '从用户问题、AI 回答和可信来源出发，寻找品牌事实的证据缺口。', exercise: '设计 5 个购买前问题，检查品牌是否被 AI 正确理解。', output: 'GEO 优化清单' },
    ],
  },
  {
    part: '第三篇 · 进阶篇：把案例变成自己的工作系统',
    range: '22—25',
    summary: '把一次成功蒸馏成 Skill，学会多 Agent、可靠性和案例复盘。',
    chapters: [
      { number: '22', title: '将书和视频蒸馏为可执行 Skill', time: '45 分钟', level: '方法沉淀', intro: '只保留跨任务仍然成立的判断、步骤、边界和验收，形成可调用的方法协议。', exercise: '用一个成功案例写出 SKILL.md，并用两个反例回归测试。', output: 'SKILL.md' },
      { number: '23', title: 'WorkBuddy 实操案例集', time: '45 分钟', level: '案例复盘', intro: '复盘办公、资讯、文件、内容等任务，练习从结果反推出可复用规则。', exercise: '挑一个做过的案例，补齐输入、步骤、失败点和验收标准。', output: '案例复盘卡' },
      { number: '24', title: '多 Agent 系统设计', time: '45 分钟', level: '系统设计', intro: '理解单 Agent 与多 Agent 的差别，围绕专业分工、并行和独立评审设计流程。', exercise: '设计一个两角色协作流程，并写清交接格式。', output: '多 Agent 流程图' },
      { number: '25', title: '自动化工作流的可靠性', time: '45 分钟', level: '稳定运行', intro: '为自动化增加输入校验、失败重试、日志、人工审批和回滚线索。', exercise: '给一个自动化流程补出异常分支和人工接管点。', output: '可靠性检查表' },
    ],
  },
  {
    part: '第四篇 · 岗位与行业落地',
    range: '26—27',
    summary: '把通用能力映射到岗位，形成可展示的个人 AI 工作流。',
    chapters: [
      { number: '26', title: '不同岗位如何把 WorkBuddy 用深', time: '40 分钟', level: '岗位落地', intro: '把 WorkBuddy 的通用能力映射到运营、产品、市场、人力、行政和研究岗位。', exercise: '为目标岗位画出一条从输入到交付的 AI 工作流。', output: '岗位工作流说明书' },
      { number: '27', title: '从通用能力到行业工作流', time: '45 分钟', level: '长期成长', intro: '把案例、Skill、知识库和验收标准组合起来，形成自己的长期工作系统。', exercise: '完成一份个人 AI 工作系统路线图和下一步行动清单。', output: '个人 AI 系统路线图' },
    ],
  },
]

export const freeCourseStats = [
  ['27', '章节'],
  ['11', '实战案例'],
  ['40+', '可复制 Prompt'],
  ['8—10', '周建议周期'],
]
