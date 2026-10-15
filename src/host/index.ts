// dsh-notify-center — Host 半端
//
// 职责：
//   1. 一等订阅 dsh 宿主事件，把「回复完成 / 等待输入 / 等待审批 / 出错 / 目标完成」
//      转成统一通知账本；
//   2. 通过 SSE 长连接（/dsh-notify/api/events）实时推送给页面端；
//   3. 提供 status / mark-read / clear-all / test / toast 等 HTTP 端点；
//   4. 按页面端请求触发 Windows 原生右下角气球通知 + 任务栏闪烁。
//
// 事件源（全部为 dsh 一等宿主事件，跨版本稳定）：
//   - session/event          ：assistant/message、turn/end、approval/decided、goal/change
//   - approval/request       ：waterfall，观察者必须立即 next() 放行
//   - user-questions/request ：waterfall，观察者必须立即 next() 放行
//   - api-session/error      ：emit
//
// 注意：approval/request 与 user-questions/request 是 waterfall 事件，
// 本插件只观察，不参与应答——监听器内仅 queueMicrotask 调度通知并同步 next()。

import {
  API_PREFIX,
  ErrorCode,
  PLUGIN_ID,
  fail,
  ok,
  type Envelope,
  type LedgerEntry,
  type NotifyKind,
} from "../shared/protocol";
import { isTrustedApiRequest } from "./trust-fence";
import { flashTaskbar, showDesktopToast } from "./native";

export const inject = ["webServer", "webRuntime"];

const MAX_BODY = 256 * 1024;
const MAX_RECENT = 30;
const MAX_SUMMARY_CHARS = 300;

const BLOCKING_KINDS: ReadonlySet<string> = new Set(["question", "approval"]);

interface CtxLike {
  webServer: any;
  webRuntime?: { trustedHosts?: string[] };
  logger?: { info?(...args: any[]): void; error?(...args: any[]): void };
  on(event: string, listener: (...args: any[]) => void): () => void;
}

// ── 账本 ──────────────────────────────────────────────────────────────

/** 阻塞通知账本：key = sessionId + ":" + kind，持久到用户处理 / resolved。 */
const ledger = new Map<string, LedgerEntry>();
/** 最近的非阻塞通知（重连快照用，封顶 MAX_RECENT）。 */
const recent: LedgerEntry[] = [];
/** SSE 长连接客户端。 */
const sseClients = new Set<any>();
let seq = 0;

function newId(kind: string): string {
  seq = (seq + 1) % 0xffff;
  return `${Date.now().toString(36)}-${seq.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function snapshotEntries(): LedgerEntry[] {
  return [...ledger.values(), ...recent];
}

function sendJson(res: any, status: number, body: Envelope<unknown>): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function broadcast(event: string, data: unknown): void {
  const line = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(line);
    } catch {
      sseClients.delete(res);
    }
  }
}

function pushNotification(entry: LedgerEntry, opts?: { force?: boolean }): void {
  const blocking = BLOCKING_KINDS.has(entry.kind);
  if (blocking) {
    const key = entry.sessionId + ":" + entry.kind;
    const existing = ledger.get(key);
    if (existing) {
      existing.count += 1;
      existing.summary = entry.summary || existing.summary;
      existing.title = entry.title || existing.title;
      broadcast("push", { ...existing, blocking: true, force: opts?.force });
      return;
    }
    ledger.set(key, entry);
  } else {
    recent.unshift(entry);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
  }
  broadcast("push", { ...entry, blocking, force: opts?.force });
}

function notify(
  sessionId: string,
  kind: NotifyKind,
  title: string,
  summary: string,
): void {
  if (!sessionId) return;
  pushNotification({
    id: newId(kind),
    sessionId,
    kind,
    title,
    summary: (summary || "").slice(0, MAX_SUMMARY_CHARS),
    count: 1,
    firstAt: Date.now(),
  });
}

function removeLedger(sessionId: string, kind?: string): number {
  let removed = 0;
  for (const [key, e] of ledger) {
    if (e.sessionId === sessionId && (!kind || e.kind === kind)) {
      ledger.delete(key);
      removed++;
    }
  }
  return removed;
}

function clearAllLedger(): void {
  ledger.clear();
}

// ── 事件 → 通知映射 ──────────────────────────────────────────────────

function extractText(content: any): string {
  if (!Array.isArray(content)) return "";
  const parts: string[] = [];
  for (const block of content) {
    if (block && typeof block.text === "string") parts.push(block.text);
    else if (typeof block === "string") parts.push(block);
  }
  return parts.join(" ").trim();
}

/** 每会话最近一条助手消息正文（turn/end 时取用）。 */
const lastAssistant = new Map<string, string>();

export function apply(ctx: CtxLike): void {
  const { webServer, webRuntime, logger } = ctx;
  const trustedHosts = webRuntime?.trustedHosts;

  // ── 事件订阅 ──
  ctx.on("session/event", (session: any, event: any) => {
    try {
      const sessionId = session?.id || event?.sessionId || "";
      if (!sessionId) return;
      const type = event?.type;
      if (type === "assistant/message") {
        const text = extractText(event?.data?.message?.content);
        if (text) lastAssistant.set(sessionId, text.slice(0, MAX_SUMMARY_CHARS));
      } else if (type === "turn/end") {
        // 只提醒根会话，避免子代理刷屏
        if (session?.parentSession || session?.origin === "subagent") return;
        const summary = lastAssistant.get(sessionId) || "";
        lastAssistant.delete(sessionId);
        notify(sessionId, "reply", "回复完成", summary || "agent 已回复");
      } else if (type === "approval/decided") {
        const removed = removeLedger(sessionId, "approval");
        if (removed > 0) broadcast("resolved", { sessionId, kind: "approval" });
      } else if (type === "goal/change" && event?.data?.operation === "complete") {
        if (session?.parentSession || session?.origin === "subagent") return;
        const goalTitle =
          event?.data?.value?.title || event?.data?.goal?.title || event?.data?.title || "目标完成";
        notify(sessionId, "goal", "目标完成", String(goalTitle));
      }
    } catch (e: any) {
      logger?.error?.(PLUGIN_ID + ": session/event: " + String(e?.message ?? e));
    }
  });

  // waterfall 观察者：只调度通知，同步 next() 放行，绝不参与应答
  ctx.on("approval/request", (req: any, next: () => void) => {
    try {
      const sessionId = req?.agent?.id;
      if (sessionId) {
        const tool = req?.toolName || "工具";
        const reason = req?.reason;
        queueMicrotask(() =>
          notify(sessionId, "approval", "等待审批", reason || `工具调用需要审批：${tool}`),
        );
      }
    } catch {
      /* 忽略畸形载荷 */
    }
    if (typeof next === "function") return next();
  });

  ctx.on("user-questions/request", (req: any, next: () => void) => {
    try {
      const sessionId = req?.agent?.id;
      if (sessionId) {
        const q =
          Array.isArray(req?.questions) && req.questions[0]?.question
            ? req.questions[0].question
            : "agent 正在等待你的回答";
        queueMicrotask(() => notify(sessionId, "question", "等待输入", String(q)));
      }
    } catch {
      /* 忽略畸形载荷 */
    }
    if (typeof next === "function") return next();
  });

  ctx.on("api-session/error", (sessionId: string, message: string) => {
    try {
      notify(String(sessionId || ""), "error", "出错", String(message || "agent 执行出错"));
    } catch {
      /* 忽略 */
    }
  });

  // ── HTTP 路由 ──
  webServer.register({
    kind: "prefix",
    path: API_PREFIX,
    handler: async (req: any, res: any) => {
      if (!isTrustedApiRequest(req, trustedHosts)) {
        sendJson(res, 403, fail(ErrorCode.Forbidden, "untrusted request"));
        return;
      }
      let pathname = "";
      try {
        pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
      } catch {
        sendJson(res, 400, fail(ErrorCode.BadRequest, "bad path"));
        return;
      }

      if (pathname === `${API_PREFIX}/events` && req.method === "GET") {
        handleEvents(req, res);
        return;
      }
      if (pathname === `${API_PREFIX}/status` && req.method === "GET") {
        sendJson(res, 200, ok({ entries: snapshotEntries() }));
        return;
      }
      if (req.method !== "POST") {
        sendJson(res, 400, fail(ErrorCode.BadRequest, "expect POST"));
        return;
      }
      const method = pathname.slice(API_PREFIX.length + 1);
      if (!method || method.includes("/")) {
        sendJson(res, 400, fail(ErrorCode.BadRequest, "bad method"));
        return;
      }

      let payload: any = {};
      try {
        payload = await readJsonBody(req);
      } catch (e: any) {
        const tooLarge = String(e?.message ?? "") === "too-large";
        sendJson(res, tooLarge ? 413 : 400, fail(ErrorCode.BadRequest, tooLarge ? "body too large" : "invalid JSON body"));
        return;
      }

      try {
        switch (method) {
          case "mark-read": {
            const sessionId = String(payload?.sessionId || "");
            const kind = typeof payload?.kind === "string" ? payload.kind : undefined;
            const removed = sessionId ? removeLedger(sessionId, kind) : clearAllLedger();
            if (sessionId) broadcast("resolved", { sessionId, kind });
            sendJson(res, 200, ok({ removed }));
            break;
          }
          case "clear-all": {
            clearAllLedger();
            broadcast("resolved", { sessionId: "*" });
            sendJson(res, 200, ok({}));
            break;
          }
          case "test": {
            const kind: NotifyKind =
              payload?.kind === "approval" || payload?.kind === "question" ? payload.kind : "reply";
            const sessionId = String(payload?.sessionId || "");
            const entry: LedgerEntry = {
              id: newId(kind),
              sessionId: sessionId || "test-session",
              kind,
              title:
                kind === "approval"
                  ? "等待审批"
                  : kind === "question"
                    ? "等待输入"
                    : "测试通知",
              summary:
                kind === "approval"
                  ? "工具调用需要审批（测试）"
                  : kind === "question"
                    ? "agent 正在等待你的回答（测试）"
                    : "这是一条测试通知",
              count: 1,
              firstAt: Date.now(),
            };
            pushNotification(entry, { force: true });
            sendJson(res, 200, ok({}));
            break;
          }
          case "toast": {
            const title = String(payload?.title || "DeepSeek Harness");
            const body = String(payload?.body || "");
            const kind = String(payload?.kind || "reply") as NotifyKind;
            const flash = payload?.flash !== false;
            if (flash) flashTaskbar();
            showDesktopToast(title, body, kind);
            sendJson(res, 200, ok({}));
            break;
          }
          default:
            sendJson(res, 404, fail(ErrorCode.NotFound, "unknown method: " + method));
        }
      } catch (e: any) {
        logger?.error?.(PLUGIN_ID + ": " + method + " failed: " + String(e?.message ?? e));
        sendJson(res, 500, fail(ErrorCode.Internal, "internal error"));
      }
    },
  });

  logger?.info?.(PLUGIN_ID + ": route ready — " + API_PREFIX);
}

function handleEvents(req: any, res: any): void {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "x-accel-buffering": "no",
  });
  res.write("retry: 3000\n\n");
  res.write(`event: snapshot\ndata: ${JSON.stringify({ entries: snapshotEntries() })}\n\n`);
  sseClients.add(res);
  req.on("close", () => {
    sseClients.delete(res);
  });
  req.on("error", () => {
    sseClients.delete(res);
  });
}

// JSON body 读取：1MB 上限防无限读；兼容 BOM（fetch-runtime 同款容错）
function readJsonBody(req: any): Promise<any> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (c: Buffer) => {
      total += c.length;
      if (total > MAX_BODY) {
        reject(new Error("too-large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolveBody({});
        return;
      }
      let text = Buffer.concat(chunks).toString("utf8");
      if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
      try {
        resolveBody(text ? JSON.parse(text) : {});
      } catch {
        reject(new Error("bad-json"));
      }
    });
    req.on("error", reject);
  });
}