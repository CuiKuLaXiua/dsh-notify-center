// dsh-notify-center 共享协议：插件 id、HTTP 前缀、通知载荷与信封类型。

export const PLUGIN_ID = "dsh-notify-center";

export const API_PREFIX = "/dsh-notify/api";

export type NotifyKind = "reply" | "question" | "approval" | "error" | "goal";

/** 宿主账本 / SSE 广播中的一条通知。 */
export interface LedgerEntry {
  /** 客户端去重键（宿主生成）。 */
  id: string;
  sessionId: string;
  kind: NotifyKind;
  title: string;
  summary: string;
  count: number;
  firstAt: number;
}

/** SSE push 事件载荷 = LedgerEntry + blocking 标志 + 可选 force。 */
export interface PushPayload extends LedgerEntry {
  blocking: boolean;
  /** 测试通知等合成事件强制展示（跳过“前台同会话不打扰”）。 */
  force?: boolean;
}

/** 统一 HTTP 信封（对齐 git-studio / open-in-app 生态语义）。 */
export interface Envelope<T> {
  ok: boolean;
  value?: T;
  error?: { code: string; message: string };
}

export function ok<T>(value: T): Envelope<T> {
  return { ok: true, value };
}

export function fail(code: string, message: string): Envelope<never> {
  return { ok: false, error: { code, message } };
}

export const ErrorCode = {
  BadRequest: "bad-request",
  Forbidden: "forbidden",
  NotFound: "not-found",
  TooLarge: "too-large",
  Internal: "internal",
} as const;