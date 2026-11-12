/** Bilingual copy for the proposed company workflow. All examples are fictional. */
export const companyZh = {
  name: "公司模式",
  title: "公司模式：从长期目标到经过验证的交付",
  description:
    "公司模式交互设计原型：与 Personal agent 对话，用工单跟踪长期目标，让实际验证决定自动合并或人工复核。",
  prototype: "设计原型",
  headline: "给出目标，让工作持续推进。",
  intro:
    "和一个 Personal agent 对话。它围绕目标发现机会、推进功能，把经过验证的成果交给你。有任何拿不准的地方，就停在合并之前。",
  openDemo: "体验工作流程",
  readRules: "查看验证规则",
  coreTitle: "验证，决定下一步。",
  coreText:
    "实际操作修复后的应用，检查需求和相关模块。通过就自动合并；失败就继续修复；有疑虑就请你做 final check。",
  steps: ["长期目标", "发现与规划", "独立执行", "实际验证", "合并与跟进"],
  demoTitle: "你的工作台",
  demoNote:
    "示例数据与模拟验证。这里的操作只改变原型，不会运行 Agent 或合并真实代码；刷新页面会重置。",
  reset: "重置演示",
  inbox: "任务收件箱",
  personal: "Personal agent",
  goals: "长期目标",
  repo: "示例代码库 / penguin-harness",
  goalLabel: "当前目标",
  goalTitle: "让新用户顺利完成首次配置",
  goalText:
    "从添加模型到首次成功对话，减少配置失败和重复操作。Agent 可以主动规划功能，并持续检查实际效果。",
  goalLink: "查看目标与计划",
  goalProgress: "功能合并之后，继续跟进首次配置的真实使用反馈。",
  filters: {
    attention: "需要我",
    active: "进行中",
    done: "已完成",
    later: "稍后",
    archived: "归档",
    all: "全部",
  },
  stages: {
    queued: "待处理",
    working: "执行中",
    verifying: "验证中",
    review: "待人工复核",
    merged: "已合并",
  },
  verification: { pending: "待验证", passed: "通过", failed: "未通过", uncertain: "需人工判断" },
  unread: "未读",
  read: "标为已读",
  markUnread: "标为未读",
  snooze: "稍后处理",
  archive: "归档通知",
  restore: "移回收件箱",
  empty: "这里暂时没有工单。",
  emptyDetail: "可以切换筛选，或请 Personal agent 记录一件事。",
  attention: (n: number) => (n ? `${n} 件事需要你复核` : "目前没有需要你复核的事情"),
  background: "其余工作继续推进。打开工单查看成果，需要时再进入任务会话。",
  count: (n: number) => `${n} 张工单`,
  tabs: { overview: "任务概况", evidence: "验证记录", session: "任务会话" },
  source: "任务来源",
  purpose: "为什么做这件事",
  acceptance: "开工前的验收标准",
  deliverable: "交付内容",
  viewEvidence: "查看验证记录",
  discuss: "讨论这张工单",
  revision: (n: number) => `示例版本 r${n}`,
  pendingText: "修改完成后进入实际验证。只有当前版本的检查结果才可以用于合并。",
  uncertainText:
    "自动检查已通过，但窄屏下的错误提示仍需检查。Agent 已提出疑虑，这张工单必须由你复核后才能合并。",
  reviewText: "补充验证已通过。此前提出的疑虑仍保留人工复核要求，Agent 不能自行取消。",
  failedText:
    "实际操作发现保存结果不符合验收标准，已退回修复。修复后重新验证，并保留人工复核要求。",
  mergedAgent: "实际验证通过，已自动合并。",
  mergedHuman: "你已完成 final check，确认合并。",
  mergedNote: "验证记录和任务讨论继续保留，结果会反馈到长期目标。",
  queuedText: "已记录到目标下，等待 Personal agent 安排。",
  approve: "复核通过并合并",
  revise: "退回继续修改",
  humanHint: "确认前，请检查下方疑虑和验证记录。此按钮模拟你已实际完成 final check。",
  archivedHint: "归档只收起通知，不会停止任务或清除人工复核要求。",
  snoozedHint: "稍后处理只改变收件箱位置，不会暂停执行。这里可手动移回，不模拟定时唤回。",
  checksTitle: "实际操作与回归检查",
  checksNote: "以下为示例验证记录，演示交付应包含的证据，不代表真实运行结果。",
  checkOperation: "操作步骤",
  checkExpected: "预期与实际结果",
  checks: [
    {
      title: "主要操作路径",
      action: "打开配置页 → 修改配置 → 保存 → 刷新页面",
      result: "配置保持一致，可以继续完成首次对话。",
    },
    {
      title: "失败与恢复",
      action: "输入无效配置 → 查看错误 → 修正后重试",
      result: "错误可恢复，已填写内容保留，没有重复保存。",
    },
    {
      title: "相关模块",
      action: "检查已有对话、模型切换和配置读取",
      result: "相关流程可正常操作，关联回归测试通过。",
    },
    {
      title: "窄屏体验",
      action: "在 390 px 窄屏下展开错误提示并重试",
      result: "提示完整，操作按钮可用，无页面横向溢出。",
    },
  ],
  uncertainty: "疑虑：长错误提示可能挤压重试按钮，需要人实际检查窄屏体验。",
  failure: "实际结果：刷新后配置恢复为旧值，需要继续修复。",
  notRun: "尚未验证此版本。",
  simulation: "模拟验证结果",
  simulatePass: "演示验证通过",
  simulateConcern: "演示发现疑虑",
  simulateFail: "演示验证失败",
  simulationHint: "选择一种结果，查看工单如何流转。所有检查完成且没有人工复核要求时，才自动合并。",
  sessionTitle: "这件事有自己的上下文",
  sessionText:
    "调查、实现和验证记录保留在任务里。Personal agent 接收必要的决定与结果摘要，主对话继续处理其他事情。",
  sessionKinds: ["调查与方案", "实现与修复", "独立验证"],
  sessionDetails: [
    "读取需求，复现问题，记录验收标准。",
    "在任务工作区修改代码，记录改动范围。",
    "根据原始需求实际操作应用，检查相关模块。",
  ],
  conversation: "任务讨论",
  commentPlaceholder: "补充这张工单的需求或复核意见…",
  commentLabel: "任务讨论内容",
  addComment: "记录到工单",
  noComments: "还没有补充意见。讨论只属于这张工单。",
  commentSaved: "意见已记录到当前工单。原型不会调用真实 Agent。",
  you: "你",
  personalTitle: "所有事情，都可以从这里说起。",
  personalText:
    "你负责长期方向，Personal agent 负责持续推进。具体任务的讨论各自展开，重要结论回到这里。",
  summaryTitle: "当前进展",
  summaryText:
    "我正在推进首次配置体验。配置保存修复进入验证，连接失败提示需要你检查窄屏表现。其余工单可以继续推进。",
  summaryLive: (active: number, review: number, done: number) =>
    `${active} 项在推进，${review} 项待复核，${done} 项已合并。`,
  newTask: "随手记下一件事",
  newTaskLabel: "新任务内容",
  newTaskPlaceholder: "例如：首次配置时增加连接测试…",
  recordTask: "记录为工单",
  taskSaved: "已记录为新工单，可在全部任务中查看。",
  savedTask: "查看新工单",
  planTitle: "Agent 正在推进的计划",
  planText:
    "在目标范围内主动发现问题和新功能机会，按价值与依赖安排任务。遇到方向歧义时，用明确的问题请你判断。",
  feedbackTitle: "合并之后，目标还在继续",
  feedbackText:
    "功能能正常使用，是一次交付的验证。新用户是否更顺利，需要结合实际反馈继续判断，再调整后续工单。",
  rulesTitle: "让验证成为合并的条件",
  rulesIntro: "这份原型约定的行为，也应成为实现时的验收标准。",
  rules: [
    {
      title: "通过，自动合并",
      text: "实际操作满足需求，相关模块检查通过，验证对应最终代码，仓库检查满足，且没有待人工复核的疑虑。",
    },
    {
      title: "失败，继续修复",
      text: "明确失败的检查先回到修复。修改后旧证据失效，重新检查当前版本。",
    },
    {
      title: "存疑，人来复核",
      text: "无法验证、效果不够好或影响范围拿不准，就记录具体疑虑。后续自动检查通过，也不能自行撤销人工复核。",
    },
  ],
  contextTitle: "一个入口，各自独立的任务上下文",
  contextText:
    "目标决定方向，工单承载状态与证据，session 执行具体工作。频道与执行细节按需查看，你关注成果和需要判断的事情。",
  samples: {
    save: {
      title: "修复保存后模型选择丢失",
      source: "定时巡检 / 配置流程",
      purpose: "让首次配置能一次保存成功，减少重复输入。",
      acceptance: "保存后刷新保持选择；首次对话可启动；已有模型切换正常。",
      deliverable: "配置写入与读取修复，附刷新和模型切换的回归检查。",
    },
    retry: {
      title: "连接失败时提供可操作的重试提示",
      source: "围绕长期目标主动规划",
      purpose: "帮助新用户从配置错误中恢复，不必重新开始。",
      acceptance: "显示可理解的错误；保留输入；允许重试；窄屏下信息和按钮完整。",
      deliverable: "增加失败提示与重试入口，保留用户已填写的配置。",
    },
    setup: {
      title: "首次配置时增加连接测试",
      source: "围绕长期目标主动规划",
      purpose: "在开始对话之前发现配置问题，缩短排查路径。",
      acceptance: "可以测试连接并显示结果；失败后可以修改再试；不改变已有配置。",
      deliverable: "正在实现连接测试和错误恢复流程。",
    },
    history: {
      title: "恢复上次未完成的配置",
      source: "用户在主对话中提出",
      purpose: "中断后继续原来的配置，避免重复填写。",
      acceptance: "重新进入时恢复草稿；完成后清理草稿；其他配置不受影响。",
      deliverable: "草稿恢复已完成，主要路径、异常恢复与相关回归检查通过。",
    },
    docs: {
      title: "补充首次配置的操作说明",
      source: "目标计划 / 等待界面稳定",
      purpose: "让说明与最终的配置流程一致。",
      acceptance: "说明覆盖成功与失败路径，所有步骤与应用一致。",
      deliverable: "等待配置相关功能稳定后推进。",
    },
    custom: {
      title: "新记录的任务",
      source: "你与 Personal agent 的对话",
      purpose: "将你的补充纳入当前长期目标，安排后续工作。",
      acceptance: "开始执行前澄清需求，并形成可实际验证的验收标准。",
      deliverable: "已记录，尚未开始执行。",
    },
  },
};

export const companyEn: typeof companyZh = {
  name: "Company",
  title: "Company mode: from long-term goals to verified delivery",
  description:
    "An interactive company-mode design prototype: one personal agent, a task inbox, and hands-on verification before automatic merge or human review.",
  prototype: "Design prototype",
  headline: "Set a goal. Keep the work moving.",
  intro:
    "Work with one personal agent. It finds opportunities, builds features and verifies the result. Whenever something is uncertain, it stops before merging.",
  openDemo: "Explore the workflow",
  readRules: "Read verification rules",
  coreTitle: "Verification decides what happens next.",
  coreText:
    "Operate the updated app and check the requirement and related modules. A pass can merge automatically. A failure returns to repair. A concern needs your final check.",
  steps: [
    "Long-term goal",
    "Discover and plan",
    "Independent work",
    "Hands-on verification",
    "Merge and follow up",
  ],
  demoTitle: "Your workbench",
  demoNote:
    "Sample data and simulated verification. Actions change this prototype only; they do not run agents or merge code. Refresh to reset.",
  reset: "Reset demo",
  inbox: "Task inbox",
  personal: "Personal agent",
  goals: "Long-term goal",
  repo: "Example repository / penguin-harness",
  goalLabel: "Current goal",
  goalTitle: "Help new users complete their first setup",
  goalText:
    "Reduce failed configuration and repeated work, from adding a model to the first successful conversation. The agent can plan features and follow up on their impact.",
  goalLink: "View goal and plan",
  goalProgress: "After merging, keep checking feedback from first-time setup.",
  filters: {
    attention: "Needs me",
    active: "In progress",
    done: "Completed",
    later: "Later",
    archived: "Archived",
    all: "All",
  },
  stages: {
    queued: "Queued",
    working: "In progress",
    verifying: "Verifying",
    review: "Human review",
    merged: "Merged",
  },
  verification: {
    pending: "Not checked",
    passed: "Passed",
    failed: "Failed",
    uncertain: "Needs judgment",
  },
  unread: "Unread",
  read: "Mark read",
  markUnread: "Mark unread",
  snooze: "Handle later",
  archive: "Archive notice",
  restore: "Return to inbox",
  empty: "No tasks in this view.",
  emptyDetail: "Choose another filter or ask your personal agent to record a task.",
  attention: (n: number) =>
    n
      ? `${n} ${n === 1 ? "task needs" : "tasks need"} your review`
      : "Nothing needs your review right now",
  background:
    "Other work keeps moving. Open a task for its results, then its sessions when needed.",
  count: (n: number) => `${n} tasks`,
  tabs: { overview: "Overview", evidence: "Verification", session: "Task sessions" },
  source: "Source",
  purpose: "Why this matters",
  acceptance: "Acceptance criteria set before work",
  deliverable: "Deliverable",
  viewEvidence: "View verification",
  discuss: "Discuss this task",
  revision: (n: number) => `Sample revision r${n}`,
  pendingText:
    "The updated app must be checked. Only evidence for the current revision can support a merge.",
  uncertainText:
    "Automated checks passed, but the error message needs a narrow-screen check. The agent raised a concern, so this task requires your review before merging.",
  reviewText:
    "Additional verification passed. The earlier concern still requires human review; the agent cannot remove that requirement.",
  failedText:
    "Hands-on testing found that the saved value fails the acceptance criteria. The task returned to repair and must be reverified, with human review retained.",
  mergedAgent: "Hands-on verification passed. Merged automatically.",
  mergedHuman: "You completed the final check and approved the merge.",
  mergedNote:
    "Verification and discussion remain on the task. The result feeds back into the long-term goal.",
  queuedText: "Recorded under the goal, awaiting a place in the plan.",
  approve: "Approve and merge",
  revise: "Return for changes",
  humanHint:
    "Check the concern and evidence below first. This button simulates your completed hands-on final check.",
  archivedHint:
    "Archiving hides the notice. It does not stop work or remove required human review.",
  snoozedHint:
    "Later changes the inbox position, not execution. Return it manually here; timed reminders are not simulated.",
  checksTitle: "Hands-on and regression checks",
  checksNote:
    "These sample records show what delivery evidence should contain. They are not results of real tests.",
  checkOperation: "Steps taken",
  checkExpected: "Expected and observed result",
  checks: [
    {
      title: "Main user journey",
      action: "Open configuration → change a value → save → reload",
      result: "The configuration remains consistent and the first conversation can start.",
    },
    {
      title: "Failure and recovery",
      action: "Enter invalid configuration → read the error → correct and retry",
      result: "The error is recoverable, inputs remain and no duplicate save occurs.",
    },
    {
      title: "Related modules",
      action: "Check existing conversations, model switching and configuration reads",
      result: "Related journeys work and associated regression tests pass.",
    },
    {
      title: "Narrow-screen experience",
      action: "Expand the error and retry at a 390 px viewport",
      result:
        "The message is complete, actions remain usable and the page does not overflow horizontally.",
    },
  ],
  uncertainty:
    "Concern: a long error message may squeeze the retry button. A person needs to check the narrow-screen experience.",
  failure: "Observed: reloading restores the old value. Further repair is needed.",
  notRun: "This revision has not been verified.",
  simulation: "Simulate a verification result",
  simulatePass: "Simulate a pass",
  simulateConcern: "Simulate a concern",
  simulateFail: "Simulate a failure",
  simulationHint:
    "Choose a result to explore the transition. Automatic merge requires completed checks and no outstanding human-review requirement.",
  sessionTitle: "A context of its own",
  sessionText:
    "Investigation, implementation and verification stay with this task. The personal agent receives decisions and result summaries while its main conversation handles other work.",
  sessionKinds: [
    "Investigation and approach",
    "Implementation and repair",
    "Independent verification",
  ],
  sessionDetails: [
    "Read the requirement, reproduce the issue and record acceptance criteria.",
    "Change code in the task workspace and record the affected area.",
    "Operate the app against the original requirement and check related modules.",
  ],
  conversation: "Task discussion",
  commentPlaceholder: "Add a requirement or review note for this task…",
  commentLabel: "Task discussion content",
  addComment: "Record on task",
  noComments: "No additional notes yet. This discussion belongs to this task only.",
  commentSaved: "Recorded on this task. This prototype does not call a real agent.",
  you: "You",
  personalTitle: "Every piece of work can start here.",
  personalText:
    "You set the direction. Your personal agent keeps work moving. Each task has its own discussion, with key conclusions returning here.",
  summaryTitle: "Current progress",
  summaryText:
    "I am working on first-time setup. The configuration-save fix is ready for verification. The connection error needs a narrow-screen review. Other tasks can continue.",
  summaryLive: (active: number, review: number, done: number) =>
    `${active} in progress, ${review} awaiting review, ${done} merged.`,
  newTask: "Record something to do",
  newTaskLabel: "New task",
  newTaskPlaceholder: "For example: add a connection test during first-time setup…",
  recordTask: "Record as a task",
  taskSaved: "Recorded as a new task. Find it in the full inbox.",
  savedTask: "View new task",
  planTitle: "The agent's current plan",
  planText:
    "Find problems and feature opportunities within the goal, then order tasks by value and dependency. Ask a concrete question when the direction is unclear.",
  feedbackTitle: "The goal continues after a merge",
  feedbackText:
    "A working feature verifies one delivery. Whether setup became easier takes real feedback, which informs the next tasks.",
  rulesTitle: "Make verification a condition of merging",
  rulesIntro:
    "The behavior defined by this prototype also sets acceptance criteria for implementation.",
  rules: [
    {
      title: "Pass, then merge",
      text: "Hands-on checks satisfy the requirement, related modules pass, evidence matches the final code, repository checks are satisfied and no human review is outstanding.",
    },
    {
      title: "Fail, then repair",
      text: "A failed check returns work to repair. Further edits invalidate old evidence; check the current revision again.",
    },
    {
      title: "Uncertain, ask a person",
      text: "Record a specific concern when verification is unavailable, quality is insufficient or impact is uncertain. A later automated pass cannot cancel required human review.",
    },
  ],
  contextTitle: "One contact, independent task contexts",
  contextText:
    "Goals set direction, tasks hold status and evidence, and sessions do the work. Channels and execution details are available when needed. Your focus stays on results and decisions.",
  samples: {
    save: {
      title: "Keep the model selection after saving",
      source: "Scheduled configuration check",
      purpose: "Make the first save stick, without asking users to repeat their input.",
      acceptance:
        "Selection survives reload; the first conversation starts; existing model switching still works.",
      deliverable:
        "Configuration write and read fix, with reload and model-switching regression checks.",
    },
    retry: {
      title: "Make connection errors actionable",
      source: "Feature planned from the long-term goal",
      purpose: "Help new users recover from configuration errors without starting over.",
      acceptance:
        "Explain the error, retain input, allow retries and keep messages and actions usable on narrow screens.",
      deliverable: "An error message and retry action that preserve the user's configuration.",
    },
    setup: {
      title: "Test the connection during first-time setup",
      source: "Feature planned from the long-term goal",
      purpose: "Find configuration problems before the first conversation.",
      acceptance:
        "Test and display the result; allow correction and retry; preserve existing configuration.",
      deliverable: "Implementing the connection test and recovery flow.",
    },
    history: {
      title: "Resume an unfinished configuration",
      source: "Requested in the main conversation",
      purpose: "Continue after an interruption without entering everything again.",
      acceptance:
        "Restore the draft on return, clear it after completion and preserve other configuration.",
      deliverable:
        "Draft recovery delivered. Main journey, recovery and related regression checks passed.",
    },
    docs: {
      title: "Document first-time setup",
      source: "Goal plan / waiting for the interface",
      purpose: "Keep instructions aligned with the final configuration flow.",
      acceptance: "Cover successful and failed setup with steps that match the app.",
      deliverable: "Waiting for the configuration features to settle.",
    },
    custom: {
      title: "Newly recorded task",
      source: "Your conversation with the personal agent",
      purpose: "Include your request in the current goal and plan the work.",
      acceptance:
        "Clarify the requirement and define hands-on acceptance criteria before starting.",
      deliverable: "Recorded; execution has not started.",
    },
  },
};
