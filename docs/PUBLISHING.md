# 发布指南

## GitHub 安装（推荐，无需 npm 账号）

1. 构建并提交产物：

   ```sh
   node build.mjs
   git add -A
   git commit -m "build: 0.1.0"
   git push
   ```

   `lib/` 是已构建产物，**必须提交**——GitHub 安装直接下载仓库，不在本地构建。

2. 用户安装：

   ```sh
   # 桌面端 Plugins 页安装来源
   github:CuiKuLaXiua/dsh-notify-center

   # 或命令行（桌面端需先完全退出）
   dsh plugin --profile desktop add github:CuiKuLaXiua/dsh-notify-center
   ```

## npm 发布（需要 npm 账号）

```sh
npm login
npm version patch     # 或手动改 version
npm publish
```

发布前确认：

- `package.json` 的 `files` 包含 `lib`、`cordis.patch.yml`、`locale`、`README.md`、`icon.svg`；
- `exports` 正确暴露 `.` / `./client` / `./locale/*.json`；
- `dsh.bundle.patch` 与 `dsh.client` 元数据完整。

发布后用户可：

```sh
dsh plugin --profile web add dsh-notify-center
```

## 命名冲突提示

`dsh-notify` 已被生态占用（Pasumao 的宿主-only 原生 toast 插件）。
本插件命名 `dsh-notify-center`，聚焦「页面内通知中心 + 桌面提醒 + 声音 + 任务栏闪烁」，
与既有插件定位互补。