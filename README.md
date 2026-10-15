# dsh-notify-center

DeepSeek Harness (DSH) 标准插件 — **通知中心**：页面右上角站内通知 + 桌面右下角原生提醒 + 提示音 + 任务栏闪烁。

桌面端跑任务时切走窗口，agent 回复完成 / 提问 / 请求审批 / 出错都会提醒你：

- **页面内右上角通知**：卡片堆叠、5 秒自动消失、阻塞提醒常驻脉冲、点击跳转会话；
- **桌面右下角通知**：Windows 原生气球提示（任务栏托盘上方），无需 AUMID；
- **声音通知**：Web Audio 实时合成，classic / soft 两套音色，回复 / 出错 / 阻塞三种提示音；
- **任务栏闪烁**：后台事件时闪烁 DSH 主窗口任务栏按钮，直到窗口被聚焦；
- **三态路由**：前台同会话不打扰 → 前台异会话出站内卡片 → 后台额外桌面提醒 + 声音；
- **通知中心**：会话头铃铛 + 未读角标，点击展开通知列表，一键跳转 / 全部已读；
- **完整设置页**：「设置 → 通知」中可开关各类型行为、音色音量、勿扰时段、测试通知。

## 目录

- [特性](#特性)
- [安装](#安装)
- [使用说明](#使用说明)
- [通知类型与路由](#通知类型与路由)
- [开发](#开发)
- [发布（维护者）](#发布维护者)
- [License](#license)

## 特性

- **纯 DSH 标准插件**：`dsh.bundle.patch` + `dsh.client`，`dsh plugin add` 一条命令安装；
- **宿主一等事件订阅**：`session/event`、`approval/request`、`user-questions/request`、`api-session/error`，
  协议级稳定，不依赖页面内部 store；
- **SSE 实时推送**：宿主 → 页面端长连接，阻塞通知账本跨重连保持；
- **零运行时依赖**：宿主只用 Node 内置模块 + PowerShell；页面端只用 React / react-dom（平台注入）；
- **纯主题变量**：使用 `var(--dsw-alias-*)`，自动跟随 DSH 明/暗主题；
- **隐私与安全**：PowerShell 子进程环境变量剔除 KEY/SECRET/TOKEN 等敏感值；HTTP 端点回环 + 信任围栏。

## 安装

前置：已安装 DeepSeek Harness 桌面版（或 Web 版），Node.js >= 22。

### 桌面版

在桌面端 **Plugins / 插件** 页的安装来源中使用 GitHub 源命令安装：

```sh
github:CuiKuLaXiua/dsh-notify-center
```

1. 打开桌面端 → 侧边栏 **Plugins / 插件** 页；
2. 在安装来源输入框粘贴 `github:CuiKuLaXiua/dsh-notify-center`；
3. 点击安装并重启桌面端，生效后右上角出现通知卡片，会话头出现铃铛。

也可以直接双击项目根目录的 `install-to-desktop.cmd`（会先要求完全退出桌面端）。

### Web 版（npm 发布后）

```sh
dsh plugin --profile web add dsh-notify-center
```

## 使用说明

- **右上角卡片**：新事件到达时在页面右上角弹出；
  - 非阻塞（回复 / 出错 / 目标完成）5 秒后自动消失，鼠标悬停暂停倒计时；
  - 阻塞（等待输入 / 等待审批）常驻脉冲，直到处理或手动忽略；
  - 点击卡片跳转到对应会话；「忽略」按钮 / Delete / Esc / 右键可关闭；
  - 超出 8 条时，最旧的非阻塞通知折叠为「已折叠 N 条 · 点击清除」。
- **铃铛**：会话标题栏右上角；未读角标显示待处理数量；点击展开通知列表，可跳转或全部已读。
- **设置**：侧边栏 → 设置 → **通知**：
  - 总开关、提示音（音色 / 音量 / 试听）；
  - 各类型行为：回复 / 出错可分别开关站内卡片与声音；提问 / 审批声音开关（卡片常开）；
  - 桌面提醒：桌面右下角通知、任务栏闪烁；
  - 勿扰：手动开关 / 时段预设（支持跨午夜）；
  - 状态：未读概览、全部已读、测试通知（知会 / 阻塞）。

## 通知类型与路由

| 事件 | 类型 | 行为 |
|---|---|---|
| `turn/end`（根会话） | 回复完成 | 非阻塞：卡片 5s + 后台声音/桌面/闪烁 |
| `api-session/error` | 出错 | 非阻塞：卡片 5s + 后台声音/桌面/闪烁 |
| `goal/change` complete | 目标完成 | 非阻塞：卡片 5s + 后台声音/桌面/闪烁 |
| `user-questions/request` | 等待输入 | **阻塞**：卡片常驻 + 后台声音/桌面/闪烁，直到处理 |
| `approval/request` | 等待审批 | **阻塞**：卡片常驻 + 后台声音/桌面/闪烁，直到处理（`approval/decided` 自动注销） |

三态路由（与桌面端前台状态联动）：

1. **前台同会话**：消息就在眼前，非阻塞不打扰；阻塞提醒仍出现；
2. **前台异会话**：出站内卡片，不响声音、不弹桌面；
3. **后台**（窗口失焦 / 最小化）：卡片 + 声音 + 桌面右下角通知 + 任务栏闪烁。

子代理会话默认不产生回复/目标通知，避免刷屏（阻塞审批仍会提醒）。

## 开发

```sh
npm install        # 安装 esbuild（或用现有 D:/code/dsh-git-studio 的 node_modules）
npm run build      # 构建 lib/index.js + lib/client.js
npm run smoke      # 校验构建产物
```

详见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)。

## 发布（维护者）

```sh
npm login
npm publish
```

或直接推送 GitHub，使用 `github:CuiKuLaXiua/dsh-notify-center` 安装。
详见 [docs/PUBLISHING.md](docs/PUBLISHING.md)。

## License

[MIT](./LICENSE)