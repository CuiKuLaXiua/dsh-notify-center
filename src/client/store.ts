// 站内通知 store：模块级状态 + 订阅（React useSyncExternalStore 消费）。

export interface NotificationItem {
  id: string;
  sessionId: string;
  kind: string;
  title: string;
  summary: string;
  count: number;
  firstAt: number;
  blocking: boolean;
  /** 会话展示名（客户端从 sessions store 解析后写入）。 */
  sessionTitle?: string;
}

export const MAX_STACK = 8;

let items: NotificationItem[] = [];
let overflowCount = 0;
const listeners = new Set<() => void>();

export function subscribeStore(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getItems(): NotificationItem[] {
  return items;
}

export function getOverflow(): number {
  return overflowCount;
}

export function getUnreadCount(): number {
  return items.reduce((n, it) => n + it.count, 0);
}

export function isBlockingKind(kind: string): boolean {
  return kind === "question" || kind === "approval";
}

function defaultTitle(kind: string): string {
  switch (kind) {
    case "question":
      return "等待输入";
    case "approval":
      return "等待审批";
    case "error":
      return "出错";
    case "goal":
      return "目标完成";
    default:
      return "回复完成";
  }
}

function emit(): void {
  for (const fn of listeners) fn();
}

/** 新增 / 合并通知。 */
export function addItem(payload: any): void {
  const kind = payload.kind || "reply";
  const blocking = isBlockingKind(kind);
  const id = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (items.some((n) => n.id === id)) return;

  const title = payload.title || defaultTitle(kind);
  const summary = payload.summary || title;

  if (blocking) {
    const existing = items.find((n) => n.sessionId === payload.sessionId && n.kind === kind);
    if (existing) {
      existing.count += 1;
      existing.summary = summary || existing.summary;
      existing.title = title || existing.title;
      emit();
      return;
    }
  }

  items.push({
    id,
    sessionId: payload.sessionId || "",
    kind,
    title,
    summary,
    count: payload.count || 1,
    firstAt: payload.firstAt || Date.now(),
    blocking,
    sessionTitle: payload.sessionTitle || "",
  });
  prune();
  emit();
}

/** 超出 MAX_STACK 时优先挤掉最旧的非阻塞卡片。 */
function prune(): void {
  if (items.length <= MAX_STACK) return;
  let overflow = items.length - MAX_STACK;
  const toRemove: string[] = [];
  for (const n of items) {
    if (overflow <= 0) break;
    if (!n.blocking) {
      toRemove.push(n.id);
      overflow--;
    }
  }
  for (const id of toRemove) {
    items = items.filter((n) => n.id !== id);
    overflowCount++;
  }
}

export function removeItem(id: string): void {
  const before = items.length;
  items = items.filter((n) => n.id !== id);
  if (items.length !== before) {
    if (items.length === 0) overflowCount = 0;
    emit();
  }
}

export function removeBySession(sessionId: string, kind?: string): void {
  const before = items.length;
  items = items.filter((n) => n.sessionId !== sessionId || (kind && n.kind !== kind));
  if (items.length !== before) {
    if (items.length === 0) overflowCount = 0;
    emit();
  }
}

export function clearOverflow(): void {
  const ids = items.filter((n) => !n.blocking).map((n) => n.id);
  items = items.filter((n) => !ids.includes(n.id));
  overflowCount = 0;
  emit();
}

export function clearAll(): void {
  items = [];
  overflowCount = 0;
  emit();
}