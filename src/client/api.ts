// 宿主 API 薄封装：统一信封解析；网络/信封错误静默（通知是尽力而为）。

import { API_PREFIX } from "../shared/protocol";

async function post(method: string, payload?: unknown): Promise<any> {
  const res = await fetch(API_PREFIX + "/" + method, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  const body = await res.json().catch(() => null);
  if (!body || !body.ok) throw new Error(body?.error?.message || "HTTP " + res.status);
  return body.value;
}

export async function fetchStatus(): Promise<{ entries: any[] }> {
  const res = await fetch(API_PREFIX + "/status", { method: "GET" });
  const body = await res.json().catch(() => null);
  if (!body || !body.ok) return { entries: [] };
  return body.value || { entries: [] };
}

export function markRead(sessionId: string, kind?: string): Promise<void> {
  return post("mark-read", { sessionId, kind }).then(() => undefined).catch(() => {});
}

export function clearAllRead(): Promise<void> {
  return post("clear-all").then(() => undefined).catch(() => {});
}

export function testNotify(kind: string, sessionId?: string): Promise<void> {
  return post("test", { kind, sessionId }).then(() => undefined).catch(() => {});
}

export function requestDesktopToast(
  title: string,
  body: string,
  kind: string,
  flash: boolean,
): Promise<void> {
  return post("toast", { title, body, kind, flash }).then(() => undefined).catch(() => {});
}