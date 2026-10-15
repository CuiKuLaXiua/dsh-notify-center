// 会话 store 访问（inject 提供 sessions/uiWorkspace，未就绪时优雅降级）。
// sessions.list 是快照 store：byId[id].displayTitle 为展示名；
// retainedBy.mainView > 0 的行即当前活动会话（DSH 0.2 起的推导方式）。

let sessionsStore: any = undefined;
let uiWorkspace: any = undefined;

export function initSessionServices(ctx: any): void {
  try {
    sessionsStore = ctx.sessions ?? ctx.get("sessions");
  } catch {
    /* sessions 未就绪 */
  }
  try {
    uiWorkspace = ctx.uiWorkspace ?? ctx.get("uiWorkspace");
  } catch {
    /* uiWorkspace 未就绪 */
  }
}

export function getUiWorkspace(): any {
  return uiWorkspace;
}

export function getSessionTitle(sessionId: string): string {
  try {
    const snap = sessionsStore?.list?.getSnapshot();
    const row = snap?.byId?.[sessionId];
    if (row?.displayTitle) return String(row.displayTitle);
    if (row?.title) return String(row.title);
  } catch {
    /* 忽略 */
  }
  return "";
}

export function getActiveSessionId(): string | undefined {
  try {
    const snap = sessionsStore?.list?.getSnapshot();
    const byId = snap?.byId;
    if (!byId) return undefined;
    for (const id of Object.keys(byId)) {
      const row = byId[id];
      if (row && (row.retainedBy?.mainView ?? 0) > 0) return row.id;
    }
  } catch {
    /* 忽略 */
  }
  return undefined;
}

export function openSession(sessionId: string): void {
  try {
    uiWorkspace?.openSession?.(sessionId);
  } catch {
    /* 忽略 */
  }
}