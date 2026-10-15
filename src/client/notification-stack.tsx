// 右上角站内通知栈（注册于 shell.overlay）。
// 非阻塞 5s 自动消失（hover 暂停/恢复）；阻塞常驻脉冲直到处理；
// 点击跳转会话；忽略按钮 / Delete / Esc / 右键同效；溢出折叠聚合。

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  type NotificationItem,
  clearOverflow,
  getItems,
  getOverflow,
  removeItem,
  subscribeStore,
} from "./store";
import { markRead } from "./api";
import { openSession } from "./session";
import { tf } from "./locale";

const DISMISS_MS = 5000;

function markReadItem(item: NotificationItem): void {
  removeItem(item.id);
  if (item.sessionId) markRead(item.sessionId, item.kind).catch(() => {});
}

export function NotificationStack() {
  const items = useSyncExternalStore(subscribeStore, getItems);
  const overflow = useSyncExternalStore(subscribeStore, getOverflow);
  const [nowTick, setNowTick] = useState(0);

  // 阻塞卡「已等 N 分钟」心跳
  useEffect(() => {
    const timer = setInterval(() => setNowTick((v) => v + 1), 30_000);
    return () => clearInterval(timer);
  }, []);

  const visible = items.length > 0 || overflow > 0;

  return (
    <div className="dnc-stack" style={visible ? undefined : { display: "none" }} aria-live="polite">
      <div className="dnc-stack-list">
        {items.map((n, idx) => (
          <StackCard key={n.id} item={n} index={idx} now={nowTick} />
        ))}
      </div>
      {overflow > 0 && (
        <button
          type="button"
          className="dnc-stack-more"
          onClick={() => clearOverflow()}
        >
          {tf("stack.more", { n: overflow })}
        </button>
      )}
    </div>
  );
}

function StackCard({ item, index, now }: { item: NotificationItem; index: number; now: number }) {
  const remainRef = useRef(DISMISS_MS);
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = useState(false);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function schedule(ms: number) {
    clearTimer();
    remainRef.current = ms;
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => removeItem(item.id), ms);
  }

  useEffect(() => {
    if (item.blocking) return;
    schedule(DISMISS_MS);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.blocking]);

  function onEnter() {
    if (item.blocking) return;
    if (timerRef.current) {
      remainRef.current = Math.max(0, remainRef.current - (Date.now() - startRef.current));
    }
    clearTimer();
    setPaused(true);
  }

  function onLeave() {
    if (item.blocking) return;
    if (remainRef.current > 0) schedule(remainRef.current);
    setPaused(false);
  }

  function jump() {
    if (item.sessionId) openSession(item.sessionId);
    markReadItem(item);
  }

  function ignore(e?: any) {
    e?.stopPropagation?.();
    markReadItem(item);
  }

  const waitLabel = waitText(item, now);

  return (
    <div
      className={"dnc-card" + (item.blocking ? " dnc-blocking" : "")}
      data-kind={item.kind}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} · ${displayName(item)}`}
      onClick={jump}
      onKeyDown={(e: any) => {
        if (e.key === "Enter") jump();
        else if (e.key === "Delete" || e.key === "Escape") ignore();
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onContextMenu={(e) => {
        e.preventDefault();
        ignore();
      }}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.3)}s` }}
    >
      <div className="dnc-progress-track">
        <div
          className="dnc-progress-bar"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        />
      </div>
      <div className="dnc-card-header">
        <span className="dnc-card-dot" />
        <span className="dnc-card-title">
          {item.title || "新消息"} · {displayName(item)}
          {item.count > 1 ? ` · ${item.count} 条` : ""}
        </span>
        {item.blocking && <span className="dnc-card-wait">{waitLabel}</span>}
        <button
          type="button"
          className="dnc-card-ignore"
          title="忽略（Delete / Escape / 右键同效）"
          onClick={(e) => ignore(e)}
        >
          忽略
        </button>
      </div>
      <div className="dnc-card-body">{item.summary || item.title}</div>
    </div>
  );
}

function displayName(n: NotificationItem): string {
  const t = (n.sessionTitle || "").trim();
  if (t) return t.length > 16 ? t.slice(0, 16) + "…" : t;
  if (!n.sessionId) return "";
  return n.sessionId.length > 6 ? n.sessionId.slice(-6) : n.sessionId;
}

function waitText(n: NotificationItem, now: number): string {
  void now;
  const ms = Date.now() - (n.firstAt || Date.now());
  const m = Math.max(0, Math.floor(ms / 60000));
  if (m < 1) return tf("stack.waitJustNow");
  if (m < 60) return tf("stack.waitMin", { n: m });
  return tf("stack.waitHour", { n: Math.floor(m / 60) });
}