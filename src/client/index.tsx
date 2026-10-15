// dsh-notify-center — Client 半端
//
// 页面端职责：
//   1. 连接宿主 SSE（/dsh-notify/api/events），实时接收通知推送；
//   2. 直接订阅 ctx.remote 的 approval/request 与 user-questions/request
//      （桌面端 UI 同款通道），保证阻塞型通知可靠到达；
//   3. 渲染三个标准槽位：
//      - shell.overlay                         ：右上角通知栈
//      - conversation.session.header.utilities ：铃铛 + 未读角标 + 通知中心
//      - settings.section                      ：通知设置页
//
// 通知栈 / 铃铛 / 设置页全部使用 --dsw-alias-* 主题变量，随 DSH 明暗切换。

import { ensureNotifyStyles } from "./styles";
import { addItem, clearAll, isBlockingKind, removeBySession } from "./store";
import { getSettings, isDndActive } from "./settings";
import { playSound } from "./sound";
import {
  getSessionTitle,
  initSessionServices,
} from "./session";
import { requestDesktopToast } from "./api";
import { NotificationStack } from "./notification-stack";
import { Bell } from "./bell";
import { SettingsSection } from "./settings-section";
import { t } from "./locale";

export const inject = ["slots", "remote", "uiWorkspace", "sessions"];

export function apply(ctx: any): void {
  ensureNotifyStyles();
  initSessionServices(ctx);

  // ── 推送 → UI 的路由 ──
  function handlePush(payload: any): void {
    if (!payload || !payload.sessionId) return;
    const s = getSettings();
    if (!s.enabled && !payload.force) return;

    const kind = payload.kind || "reply";
    const blocking = isBlockingKind(kind);
    const focused = typeof document !== "undefined" && document.hasFocus() && !document.hidden;

    // 无论是否在前台同会话，都及时弹卡（用户可随时点「忽略」关闭）。
    const title =
      payload.title ||
      (blocking
        ? kind === "approval"
          ? t("settings.approvalRow")
          : t("settings.questionRow")
        : t("stack.newMessage"));
    const summary = payload.summary || title;
    const sessionTitle = getSessionTitle(payload.sessionId);

    addItem({
      ...payload,
      title,
      summary,
      sessionTitle,
      blocking,
    });

    // 后台行为：声音 + 桌面右下角 + 任务栏闪烁
    const isBackground = !focused;
    if (isBackground || payload.force) {
      const dnd = isDndActive();
      const kindSound =
        kind === "approval"
          ? s.approvalSound
          : kind === "question"
            ? s.questionSound
            : kind === "error"
              ? s.errorSound
              : s.replySound;
      if (s.soundEnabled && kindSound && !dnd) {
        playSound(
          kind === "error" ? "error" : blocking ? "attention" : "message",
          s.scheme,
          s.volume,
        );
      }
      if (!dnd && (s.desktopToast || s.taskbarFlash)) {
        const display = sessionTitle ? `${title} · ${sessionTitle}` : title;
        requestDesktopToast(display, summary || title, kind, s.taskbarFlash);
      }
    }
  }

  // 阻塞型事件：桌面端 UI 正是通过 remote.$on 接收这些 waterfall（Scoped<Agent>，
  // 根宿主插件不一定能收到）。这里作为可靠通道直接建卡；仅观察，立即 next() 放行。
  function addBlockingCard(kind: string, sessionId: string, request: any): void {
    const s = getSettings();
    if (!s.enabled) return;
    const title = kind === "approval" ? t("settings.approvalRow") : t("settings.questionRow");
    let summary = "";
    if (kind === "question") {
      summary = String(request?.questions?.[0]?.question || "agent 正在等待你的回答");
    } else {
      summary = String(request?.reason || `工具调用需要审批：${request?.toolName || "工具"}`);
    }
    const sessionTitle = getSessionTitle(sessionId);
    addItem({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${kind}`,
      sessionId,
      kind,
      title,
      summary,
      count: 1,
      firstAt: Date.now(),
      blocking: true,
      sessionTitle,
    });

    const focused = typeof document !== "undefined" && document.hasFocus() && !document.hidden;
    if (!focused) {
      const dnd = isDndActive();
      const kindSound = kind === "approval" ? s.approvalSound : s.questionSound;
      if (s.soundEnabled && kindSound && !dnd) {
        playSound("attention", s.scheme, s.volume);
      }
      if (!dnd && (s.desktopToast || s.taskbarFlash)) {
        const display = sessionTitle ? `${title} · ${sessionTitle}` : title;
        requestDesktopToast(display, summary || title, kind, s.taskbarFlash);
      }
    }
  }

  try {
    ctx.remote?.$on?.("approval/request", (request: any, next: () => void) => {
      try {
        const sessionId = request?.agent?.id || request?.sessionId || request?.agentId || "";
        if (sessionId) addBlockingCard("approval", sessionId, request);
      } catch {
        /* 忽略畸形载荷 */
      }
      if (typeof next === "function") next();
    });
  } catch {
    /* remote 未就绪 */
  }

  try {
    ctx.remote?.$on?.("user-questions/request", (request: any, next: () => void) => {
      try {
        const sessionId = request?.agent?.id || request?.sessionId || request?.agentId || "";
        if (sessionId) addBlockingCard("question", sessionId, request);
      } catch {
        /* 忽略畸形载荷 */
      }
      if (typeof next === "function") next();
    });
  } catch {
    /* remote 未就绪 */
  }

  // ── SSE 长连接（宿主 /dsh-notify/api/events）──
  function connectSSE(): () => void {
    if (typeof EventSource === "undefined") return () => {};
    let es: EventSource | null = null;
    try {
      es = new EventSource("/dsh-notify/api/events");
    } catch {
      return () => {};
    }
    es.addEventListener("snapshot", (e: any) => {
      try {
        const data = JSON.parse(e.data);
        clearAll();
        (data.entries || []).forEach((entry: any) =>
          addItem({
            ...entry,
            blocking: isBlockingKind(entry.kind || "reply"),
            sessionTitle: getSessionTitle(entry.sessionId || ""),
          }),
        );
      } catch {
        /* 忽略坏帧 */
      }
    });
    es.addEventListener("push", (e: any) => {
      try {
        handlePush(JSON.parse(e.data));
      } catch {
        /* 忽略坏帧 */
      }
    });
    es.addEventListener("resolved", (e: any) => {
      try {
        const d = JSON.parse(e.data);
        if (d.sessionId === "*") clearAll();
        else removeBySession(d.sessionId, d.kind);
      } catch {
        /* 忽略坏帧 */
      }
    });
    // EventSource 自动重连（retry: 3000）
    return () => {
      try {
        es?.close();
      } catch {
        /* 忽略 */
      }
      es = null;
    };
  }

  ctx.effect(() => connectSSE(), "notify-center: sse");

  // ── 槽位注册 ──
  ctx.effect(
    () =>
      ctx.slots.inject("shell.overlay", () =>
        ctx.slots.register(
          { name: "shell.overlay", id: "notify-center.stack", order: 1000, label: t("bell.title") },
          () => <NotificationStack />,
        ),
      ),
    "notify-center: stack",
  );

  ctx.effect(
    () =>
      ctx.slots.inject("conversation.session.header.utilities", () =>
        ctx.slots.register(
          { name: "conversation.session.header.utilities", id: "notify-center.bell", order: 30, label: t("bell.title") },
          () => <Bell />,
        ),
      ),
    "notify-center: bell",
  );

  ctx.effect(
    () =>
      ctx.slots.inject("settings.section", () =>
        ctx.slots.register(
          { name: "settings.section", id: "notifications", order: 80, label: () => t("nav") },
          (props: any) => <SettingsSection close={props?.close} />,
        ),
      ),
    "notify-center: settings",
  );
}