// 站内通知 store：模块级状态 + 订阅（React useSyncExternalStore 消费）。
//
// ⚠ 重要：所有变更必须**替换数组引用**（不可变更新）。useSyncExternalStore 通过
// Object.is(getSnapshot()) 比较快照，原地 push/splice 后引用不变，React 不会重渲染，
// 导致通知卡片不出现（历史 bug：addItem 曾用 items.push 原地修改）。

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

/** 新增 / 合并通知（不可变更新，总是替换 items 引用）。 */
export function addItem(payload: any): void {
  const kind = payload.kind || "reply";
  const blocking = isBlockingKind(kind);
  const id = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (items.some((n) => n.id === id)) return;

  const title = payload.title || defaultTitle(kind);
  const summary = payload.summary || title;
  const sessionTitle = payload.sessionTitle || "";

  const next = items.slice();

  if (blocking) {
    const idx = next.findIndex(
      (n) => n.sessionId === payload.sessionId && n.kind === kind,
    );
    if (idx >= 0) {
      const existing = next[idx];
      next[idx] = {
        ...existing,
        count: existing.count + 1,
        title: title || existing.title,
        summary: summary || existing.summary,
        sessionTitle: sessionTitle || existing.sessionTitle,
      };
      items = next;
      emit();
      return;
    }
  }

  next.push({
    id,
    sessionId: payload.sessionId || "",
    kind,
    title,
    summary,
    count: payload.count || 1,
    firstAt: payload.firstAt || Date.now(),
    blocking,
    sessionTitle,
  });
  items = next;
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