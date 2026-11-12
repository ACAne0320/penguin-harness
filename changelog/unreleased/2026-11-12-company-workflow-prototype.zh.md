# 公司工作流程设计原型

Date: 2026-11-12
Type: added
Scope: landing

[English](./2026-11-12-company-workflow-prototype.md)

官网新增 `/company/` 公司模式页面，并提供导航入口。这是一份使用示例数据的交互设计原型，支持中英文及浅色、深色主题。

构建官网后，运行 `node packages/landing/scripts/company-preview.mjs` 可将同一页面导出为 `packages/landing/dist/company-preview.html`，用于离线评审。HTML 内含脚本、样式与标志图片。

## 工作流程

通过任务收件箱、Personal agent 和独立任务会话查看长期目标的推进过程。可以记录新任务、补充讨论意见，并将通知标为已读、稍后处理或归档。

模拟验证展示了通过后自动合并、失败后继续修复、提出疑虑后交给人复核的分流。后续自动验证通过仍保留人工复核要求。所有操作仅作用于原型，不运行 Agent 或合并真实代码。
