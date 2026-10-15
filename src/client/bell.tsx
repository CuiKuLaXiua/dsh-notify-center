// 会话头铃铛入口（conversation.session.header.utilities）。
// 未读角标 = 当前通知栈条数；点击展开通知中心下拉，点击条目跳转会话。

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  type NotificationItem,
  clearAll,
  getItems,
  getUnreadCount,
  removeItem,
  subscribeStore,
} from "./store";
import { clearAllRead, markRead } from "./api";
import { openSession } from "./session";
import { t } from "./locale";

export function Bell() {
  const unread = useSyncExternalStore(subscribeStore, getUnreadCount);
  const items = useSyncExternalStore(subscribeStore, getItems);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setRect({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const onDown = (e: MouseEvent) => {
      const el = e.target as Node | null;
      if (btnRef.current && !btnRef.current.contains(el)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  function jump(n: NotificationItem) {
    if (n.sessionId) openSession(n.sessionId);
    removeItem(n.id);
    if (n.sessionId) markRead(n.sessionId, n.kind).catch(() => {});
    setOpen(false);
  }

  function markAllRead() {
    clearAll();
    clearAllRead().catch(() => {});
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={"dnc-bell" + (open ? " dnc-on" : "")}
        aria-label={open ? t("bell.close") : t("bell.open")}
        aria-pressed={open}
        onClick={(e) => {
          e?.stopPropagation?.();
          setOpen((v) => !v);
        }}
      >
        <BellIcon />
        {unread > 0 && (
          <span className="dnc-bell-badge">{unread > 99 ? "99+" : String(unread)}</span>
        )}
      </button>
      {open && rect && (
        createPortal(
          <div className="dnc-bell-panel" style={{ top: rect.top, right: rect.right }}>
            <div className="dnc-bell-panel-head">
              <span>{t("bell.title")}</span>
              <button type="button" className="dnc-bell-clear" onClick={markAllRead}>
                {t("bell.clearAll")}
              </button>
            </div>
            <div className="dnc-bell-panel-list">
              {items.length === 0 && <div className="dnc-bell-empty">{t("bell.empty")}</div>}
              {items.map((n) => (
                <button key={n.id} type="button" className="dnc-bell-row" onClick={() => jump(n)}>
                  <span className={`dnc-dot dnc-dot-${n.kind}`} />
                  <span className="dnc-bell-row-text">
                    <span className="dnc-bell-row-title">
                      {n.title}
                      {n.sessionTitle ? ` · ${n.sessionTitle}` : ""}
                    </span>
                    <span className="dnc-bell-row-summary">{n.summary || n.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )
      )}
    </>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path
        d="M8 1.5c-2.2 0-4 1.8-4 4v2.4c0 .9-.35 1.7-.9 2.3l-.6.7c-.35.4-.1 1.1.45 1.1h9.9c.55 0 .8-.7.45-1.1l-.6-.7c-.55-.6-.9-1.4-.9-2.3V5.5c0-2.2-1.8-4-4-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 12.5a1.5 1.5 0 0 0 3 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}