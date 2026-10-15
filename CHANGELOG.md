# Changelog

## 0.1.3 (2026-10)

- 修复：通知卡片不渲染。改用 `createRoot` 将右上角通知栈直接挂载到 `document.body`，
  不再依赖 `shell.overlay` 槽位渲染（该槽位在部分版本/视图下不可靠）。
- 构建自检同步更新（不再要求 `shell.overlay`）。

## 0.1.2 (2026-10)

- 修复：点击通知卡片跳转会话（把 `uiWorkspace`/`sessions` 加入客户端 inject，直接调用 `ctx.uiWorkspace.openSession`）。
- 修复：阻塞型通知（提问/审批）在桌面端不出现。根宿主插件收不到 `Scoped<Agent>` 的 waterfall，
  改为在客户端直接订阅 `ctx.remote.$on('approval/request')` / `ctx.remote.$on('user-questions/request')`
  （与桌面端 UI 同通道），只观察并立即 `next()` 放行。

## 0.1.1 (2026-10)

- 修复：站内通知卡片不显示（store 原地修改数组导致 useSyncExternalStore 不重渲染）。
- 修复：任务栏闪烁失效（桌面端宿主进程没有主窗口，改为按进程名回退到主窗口进程）。
- 改进：去掉「前台同会话不打扰」的抑制，通知卡片总是及时弹出。
- 改进：`/status` 返回 `sseClients` 数量，便于诊断客户端是否连接。
- 新增：`agent/error` 兜底订阅（部分宿主版本不发 `api-session/error`）。

## 0.1.0 (2026-09)

- 首个版本：从 Zenith 项目的通知系统提取为独立 DSH 标准插件。
- 功能：
  - 页面右上角站内通知栈（非阻塞 5s 自动消失、阻塞常驻、点击跳转会话、溢出折叠）；
  - 桌面右下角 Windows 原生气球通知（PowerShell NotifyIcon，无需 AUMID）；
  - 提示音（Web Audio 合成，classic / soft 两套音色）；
  - 任务栏闪烁（FlashWindowEx，闪到窗口聚焦为止）；
  - 会话头铃铛 + 未读角标 + 通知中心下拉；
  - 设置页（设置 → 通知）：总开关 / 声音 / 各类型行为 / 桌面提醒 / 勿扰 / 测试；
  - 宿主一等事件订阅 + SSE 推送 + 阻塞账本跨重连保持。