# 开发指南

## 架构

```
┌─ dsh Host (Node) ──────────────────────────────────────────────┐
│  lib/index.js（宿主半）                                          │
│   · ctx.on('session/event')           回复/目标/审批注销         │
│   · ctx.on('approval/request')         审批请求（观察者 next()）  │
│   · ctx.on('user-questions/request')    提问请求（观察者 next()） │
│   · ctx.on('api-session/error')         出错                     │
│   · 账本（阻塞持久 / 非阻塞 recent 30）                           │
│   · SSE /status /mark-read /clear-all /test /toast               │
│   · PowerShell：右下角气球通知 + FlashWindowEx 任务栏闪烁          │
└──────────────┬────────────────────────────────────────────────┘
               │ SSE（/dsh-notify/api/events）+ HTTP
┌─ 浏览器渲染进程 ─▼───────────────────────────────────────────────┐
│  lib/client.js（客户端半，ModuleLoader 闭包工厂）                 │
│   · shell.overlay                        右上角通知栈             │
│   · conversation.session.header.utilities 铃铛 + 角标 + 下拉     │
│   · settings.section                      通知设置页             │
│   · Web Audio 提示音 / localStorage 设置 / 三态路由               │
└─────────────────────────────────────────────────────────────────┘
```

## 目录

```
src/
  shared/protocol.ts     插件 id、API 前缀、通知载荷、HTTP 信封
  host/
    index.ts            宿主入口：事件订阅 + 账本 + HTTP + SSE
    trust-fence.ts      回环 / Sec-Fetch-Site / Origin 校验
    native.ts           PowerShell 右下角气球通知 + 任务栏闪烁
  client/
    index.tsx           客户端入口：SSE、三态路由、槽位注册
    notification-stack.tsx  右上角通知栈
    bell.tsx            铃铛 + 未读角标 + 通知中心下拉
    settings-section.tsx    设置页
    store.ts            站内通知 store（useSyncExternalStore）
    settings.ts         localStorage 设置
    sound.ts            Web Audio 提示音合成
    session.ts          sessions / uiWorkspace 访问（可选服务）
    api.ts              宿主 HTTP 封装
    locale.ts           轻量中英文案
    styles.ts           全部样式（--dsw-alias-* 主题变量）
```

## 构建

```sh
node build.mjs
```

- `lib/index.js`：ESM，`platform: node`，仅依赖 Node 内置模块；
- `lib/client.js`：CJS 闭包工厂（`window.__ModuleLoader__.load`），
  外置 `react` / `react-dom` 等平台模块；
- 构建脚本自带产物自检（头部、语法、注册面字符串）。

若本包没有 `node_modules/esbuild`，`build.mjs` 会自动回退到
`D:/code/dsh-git-studio` 或 `D:/code/Zenith` 的 `node_modules`。

## 测试

```sh
node smoke.mjs
```

- 动态导入 `lib/index.js`，断言 `inject` / `apply` 导出；
- 语法检查 `lib/client.js`，断言 ModuleLoader 头部与槽位字符串。

## 事件订阅注意

- `approval/request` 与 `user-questions/request` 是 **waterfall** 事件：
  本插件只观察，监听器内用 `queueMicrotask` 调度通知，并**同步调用 `next()`**
  放行，绝不参与应答；
- `approval/decided` 会话事件用于自动注销审批卡片；
- 子代理过滤：`session.parentSession || session.origin === 'subagent'` 时跳过
  回复 / 目标通知。

## 原生通知注意

- 右下角气球：`System.Windows.Forms.NotifyIcon.ShowBalloonTip`，在 PowerShell
  `-STA` 进程中运行 8.5 秒后释放；
- 任务栏闪烁：`FlashWindowEx`，`dwFlags = 0x0F`（FLASHW_ALL |
  FLASHW_TIMERNOFG），闪到窗口聚焦为止；`process.pid` 即桌面端主进程 PID；
- 安全：子进程环境变量剔除 KEY/SECRET/TOKEN/PASSWORD 等键；内容经环境变量
  传递，避免 PowerShell 注入。