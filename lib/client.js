window.__ModuleLoader__.load({ id: "dsh-notify-center", factory: function (require) {
var module = { exports: {} }; var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../dsh-notify-center/src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_client = require("react-dom/client");

// ../dsh-notify-center/src/client/styles.ts
var NOTIFY_CSS = `
/* \u2500\u2500 \u53F3\u4E0A\u89D2\u901A\u77E5\u6808 \u2500\u2500 */
.dnc-stack{position:fixed;top:64px;right:16px;z-index:9999;width:320px;max-width:calc(100vw - 24px);display:flex;flex-direction:column;gap:8px;pointer-events:none}
.dnc-stack-list{display:flex;flex-direction:column;gap:8px}

@keyframes dnc-card-in{0%{opacity:0;transform:translateX(28px) scale(0.96)}100%{opacity:1;transform:translateX(0) scale(1)}}
.dnc-card{position:relative;display:flex;flex-direction:column;gap:5px;padding:10px 12px 10px;border-radius:12px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-left:3px solid var(--dsw-alias-state-business-primary);box-shadow:0 12px 32px rgba(0,0,0,0.22);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;overflow:hidden;pointer-events:auto;animation:dnc-card-in .38s cubic-bezier(.18,.89,.32,1.28) both;transition:transform .18s ease}
.dnc-card:hover{transform:translateY(-1px)}
.dnc-card:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}
.dnc-card.dnc-blocking{border-left-color:var(--dsw-alias-state-warning-primary)}

.dnc-progress-track{position:absolute;top:0;left:0;right:0;height:2px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.dnc-progress-bar{height:100%;width:100%;background:linear-gradient(90deg,var(--dsw-alias-state-business-primary),#7c5cff);transform-origin:left center;animation:dnc-progress 5s linear forwards}
.dnc-blocking .dnc-progress-bar{background:linear-gradient(90deg,var(--dsw-alias-state-warning-primary),var(--dsw-alias-state-error-primary));animation:dnc-pulse .9s ease-in-out infinite alternate}
@keyframes dnc-progress{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@keyframes dnc-pulse{from{opacity:1}to{opacity:.4}}

.dnc-card-header{display:flex;align-items:center;gap:8px;margin-top:2px;min-width:0}
.dnc-card-dot{width:8px;height:8px;border-radius:50%;flex:none;background:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 4px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}
.dnc-blocking .dnc-card-dot{background:var(--dsw-alias-state-warning-primary);box-shadow:0 0 0 4px color-mix(in srgb, var(--dsw-alias-state-warning-primary) 18%, transparent)}
.dnc-card-title{flex:1;min-width:0;font-size:13px;font-weight:650;color:var(--dsw-alias-label-primary);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dnc-card-wait{flex:none;font-size:11px;color:var(--dsw-alias-label-tertiary)}
.dnc-card-ignore{flex:none;border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:11px;font-family:inherit;cursor:pointer;padding:2px 4px;border-radius:6px}
.dnc-card-ignore:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dnc-card-body{font-size:12.5px;color:var(--dsw-alias-label-secondary);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}

.dnc-stack-more{pointer-events:auto;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:12px;font-family:inherit;border-radius:10px;padding:8px;cursor:pointer;text-align:center}
.dnc-stack-more:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}

/* \u2500\u2500 \u4F1A\u8BDD\u5934\u94C3\u94DB \u2500\u2500 */
.dnc-bell{position:relative;width:28px;height:28px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;padding:0;display:inline-flex;align-items:center;justify-content:center;transition:color .15s ease,background .15s ease}
.dnc-bell:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dnc-bell.dnc-on{color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dnc-bell-badge{position:absolute;top:-5px;right:-6px;min-width:15px;height:15px;padding:0 4px;border-radius:999px;background:var(--dsw-alias-state-error-primary);color:#fff;font-size:10px;font-weight:700;line-height:15px;text-align:center;box-sizing:border-box;box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-1)}

.dnc-bell-panel{position:fixed;z-index:10000;width:300px;max-width:calc(100vw - 16px);max-height:min(480px,calc(100vh - 90px));display:flex;flex-direction:column;border-radius:12px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);box-shadow:0 16px 44px rgba(0,0,0,0.24);overflow:hidden;color:var(--dsw-alias-label-primary)}
.dnc-bell-panel-head{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:13px;font-weight:650}
.dnc-bell-clear{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;font-family:inherit;cursor:pointer;padding:3px 6px;border-radius:6px}
.dnc-bell-clear:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dnc-bell-panel-list{overflow:auto;padding:6px;display:flex;flex-direction:column;gap:2px}
.dnc-bell-empty{padding:22px 10px;text-align:center;color:var(--dsw-alias-label-tertiary);font-size:12px}
.dnc-bell-row{display:flex;align-items:flex-start;gap:8px;padding:7px 9px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:12px;text-align:left;cursor:pointer}
.dnc-bell-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dnc-dot{width:7px;height:7px;border-radius:50%;flex:none;margin-top:4px}
.dnc-dot-reply{background:var(--dsw-alias-state-business-primary)}
.dnc-dot-goal{background:var(--dsw-alias-state-success-primary)}
.dnc-dot-error{background:var(--dsw-alias-state-error-primary)}
.dnc-dot-question,.dnc-dot-approval{background:var(--dsw-alias-state-warning-primary)}
.dnc-bell-row-text{display:flex;flex-direction:column;gap:2px;min-width:0}
.dnc-bell-row-title{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dnc-bell-row-summary{color:var(--dsw-alias-label-secondary);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

/* \u2500\u2500 \u8BBE\u7F6E\u9875 \u2500\u2500 */
.dnc-settings{display:flex;flex-direction:column;gap:18px;font-size:13px;color:var(--dsw-alias-label-primary)}
.dnc-settings-group{display:flex;flex-direction:column;gap:2px}
.dnc-settings-head{font-size:13px;font-weight:700;color:var(--dsw-alias-label-secondary);margin:8px 0 6px;text-transform:uppercase;letter-spacing:.4px}
.dnc-settings-desc{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.55;margin:0 0 4px}
.dnc-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);margin-bottom:6px}
.dnc-row-text{min-width:0;flex:1}
.dnc-row-title{font-weight:600;font-size:13px}
.dnc-row-desc{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.5;margin-top:2px}
.dnc-row-control{display:flex;align-items:center;gap:8px;flex:none}
.dnc-kind-controls{display:flex;align-items:center;gap:14px;flex:none}
.dnc-kind{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dnc-switch{position:relative;width:38px;height:21px;border-radius:999px;border:none;cursor:pointer;padding:0;flex:none;background:var(--dsw-alias-bg-layer-2);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1);transition:background .2s ease,box-shadow .2s ease;opacity:1}
.dnc-switch[data-on="1"]{background:var(--dsw-alias-state-business-primary);box-shadow:none}
.dnc-switch:disabled{cursor:not-allowed;opacity:.45}
.dnc-switch-knob{position:absolute;top:2px;left:2px;width:17px;height:17px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.3);transition:left .2s cubic-bezier(.4,0,.2,1)}
.dnc-switch[data-on="1"] .dnc-switch-knob{left:19px}
.dnc-range{flex:none;width:140px;accent-color:var(--dsw-alias-state-business-primary)}
.dnc-select{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:12px;font-family:inherit;padding:5px 8px}
.dnc-chip{font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.dnc-btn{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;font-family:inherit;padding:5px 12px;cursor:pointer}
.dnc-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dnc-btn:disabled{opacity:.5;cursor:default}
.dnc-btn-danger{border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent);color:var(--dsw-alias-state-error-primary)}
.dnc-settings-actions{display:flex;gap:8px;justify-content:flex-end;padding:4px 0}
.dnc-settings-toast{position:sticky;top:0;z-index:5;padding:8px 12px;border-radius:8px;background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 16%, transparent);border:1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary) 40%, transparent);color:var(--dsw-alias-label-primary);font-size:12px}
.dnc-settings-toast.dnc-toast-err{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 16%, transparent);border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent)}
`;
var injected = false;
function ensureNotifyStyles() {
  if (injected) return;
  injected = true;
  try {
    const style = document.createElement("style");
    style.setAttribute("data-dsh-notify-center", "");
    style.textContent = NOTIFY_CSS;
    document.head.appendChild(style);
  } catch {
  }
}

// ../dsh-notify-center/src/client/store.ts
var MAX_STACK = 8;
var items = [];
var overflowCount = 0;
var listeners = /* @__PURE__ */ new Set();
function subscribeStore(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
function getItems() {
  return items;
}
function getOverflow() {
  return overflowCount;
}
function getUnreadCount() {
  return items.reduce((n, it) => n + it.count, 0);
}
function isBlockingKind(kind) {
  return kind === "question" || kind === "approval";
}
function defaultTitle(kind) {
  switch (kind) {
    case "question":
      return "\u7B49\u5F85\u8F93\u5165";
    case "approval":
      return "\u7B49\u5F85\u5BA1\u6279";
    case "error":
      return "\u51FA\u9519";
    case "goal":
      return "\u76EE\u6807\u5B8C\u6210";
    default:
      return "\u56DE\u590D\u5B8C\u6210";
  }
}
function emit() {
  for (const fn of listeners) fn();
}
function addItem(payload) {
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
      (n) => n.sessionId === payload.sessionId && n.kind === kind
    );
    if (idx >= 0) {
      const existing = next[idx];
      next[idx] = {
        ...existing,
        count: existing.count + 1,
        title: title || existing.title,
        summary: summary || existing.summary,
        sessionTitle: sessionTitle || existing.sessionTitle
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
    sessionTitle
  });
  items = next;
  prune();
  emit();
}
function prune() {
  if (items.length <= MAX_STACK) return;
  let overflow = items.length - MAX_STACK;
  const toRemove = [];
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
function removeItem(id) {
  const before = items.length;
  items = items.filter((n) => n.id !== id);
  if (items.length !== before) {
    if (items.length === 0) overflowCount = 0;
    emit();
  }
}
function removeBySession(sessionId, kind) {
  const before = items.length;
  items = items.filter((n) => n.sessionId !== sessionId || kind && n.kind !== kind);
  if (items.length !== before) {
    if (items.length === 0) overflowCount = 0;
    emit();
  }
}
function clearOverflow() {
  const ids = items.filter((n) => !n.blocking).map((n) => n.id);
  items = items.filter((n) => !ids.includes(n.id));
  overflowCount = 0;
  emit();
}
function clearAll() {
  items = [];
  overflowCount = 0;
  emit();
}

// ../dsh-notify-center/src/client/settings.ts
var KEY = "dsh-notify-center:settings:v1";
var DEFAULT_SETTINGS = {
  enabled: true,
  soundEnabled: false,
  volume: 60,
  scheme: "classic",
  replyCard: true,
  replySound: true,
  errorCard: true,
  errorSound: true,
  questionSound: true,
  approvalSound: true,
  desktopToast: true,
  taskbarFlash: true,
  dndManual: false,
  dndSchedule: "off"
};
var current = load();
var listeners2 = /* @__PURE__ */ new Set();
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
  }
  return { ...DEFAULT_SETTINGS };
}
function getSettings() {
  return current;
}
function subscribeSettings(fn) {
  listeners2.add(fn);
  return () => {
    listeners2.delete(fn);
  };
}
function emit2() {
  for (const fn of listeners2) fn();
}
function updateSettings(patch) {
  current = { ...current, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
  }
  emit2();
}
function isDndActive() {
  const s = current;
  if (s.dndManual) return true;
  if (s.dndSchedule && s.dndSchedule !== "off") {
    const [start, end] = s.dndSchedule.split("-");
    const now = /* @__PURE__ */ new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = (start || "00:00").split(":").map(Number);
    const [eh, em] = (end || "00:00").split(":").map(Number);
    let sMin = sh * 60 + (sm || 0);
    let eMin = eh * 60 + (em || 0);
    if (eMin <= sMin) eMin += 24 * 60;
    let c = cur;
    if (eMin > 24 * 60 && c < eMin - 24 * 60) c += 24 * 60;
    if (c >= sMin && c < eMin) return true;
  }
  return false;
}

// ../dsh-notify-center/src/client/sound.ts
var SCHEMES = {
  classic: {
    message: { notes: [[880, 0.15], [1174.66, 0.17]], wave: "sine", peak: 0.55 },
    error: { notes: [[320, 0.3]], wave: "sine2", peak: 0.55 },
    attention: { notes: [[659.25, 0.17], [880, 0.17], [1108.73, 0.21]], wave: "sine", peak: 0.6 }
  },
  soft: {
    message: { notes: [[440, 0.18], [587.33, 0.2]], wave: "sine", peak: 0.45 },
    error: { notes: [[220, 0.34]], wave: "sine", peak: 0.45 },
    attention: { notes: [[329.63, 0.19], [440, 0.19], [554.37, 0.23]], wave: "sine", peak: 0.5 }
  }
};
var audioCtx = null;
function getCtx() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {
      });
    }
    return audioCtx;
  } catch {
    return null;
  }
}
function playSound(kind, scheme, volume) {
  const ac = getCtx();
  if (!ac) return;
  const table = SCHEMES[scheme] || SCHEMES.classic;
  const spec = table[kind] || SCHEMES.classic.message;
  const master = ac.createGain();
  const vol = Math.pow(Math.max(0, Math.min(100, Number(volume) || 0)) / 100, 2) * 0.8;
  master.gain.value = vol;
  master.connect(ac.destination);
  const t0 = ac.currentTime;
  let offset = 0;
  for (const [freq, dur] of spec.notes) {
    const start = t0 + offset;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(1e-4, start);
    g.gain.linearRampToValueAtTime(spec.peak, start + 5e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, start + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    if (spec.wave === "sine2") {
      const osc2 = ac.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      const g2 = ac.createGain();
      g2.gain.setValueAtTime(1e-4, start);
      g2.gain.linearRampToValueAtTime(spec.peak * 0.3, start + 5e-3);
      g2.gain.exponentialRampToValueAtTime(1e-4, start + dur);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(start);
      osc2.stop(start + dur + 0.02);
    }
    offset += dur + 0.01;
  }
}

// ../dsh-notify-center/src/client/session.ts
var sessionsStore = void 0;
var uiWorkspace = void 0;
function initSessionServices(ctx) {
  try {
    sessionsStore = ctx.sessions ?? ctx.get("sessions");
  } catch {
  }
  try {
    uiWorkspace = ctx.uiWorkspace ?? ctx.get("uiWorkspace");
  } catch {
  }
}
function getSessionTitle(sessionId) {
  try {
    const snap = sessionsStore?.list?.getSnapshot();
    const row = snap?.byId?.[sessionId];
    if (row?.displayTitle) return String(row.displayTitle);
    if (row?.title) return String(row.title);
  } catch {
  }
  return "";
}
function openSession(sessionId) {
  try {
    uiWorkspace?.openSession?.(sessionId);
  } catch {
  }
}

// ../dsh-notify-center/src/shared/protocol.ts
var API_PREFIX = "/dsh-notify/api";

// ../dsh-notify-center/src/client/api.ts
async function post(method, payload) {
  const res = await fetch(API_PREFIX + "/" + method, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload ?? {})
  });
  const body = await res.json().catch(() => null);
  if (!body || !body.ok) throw new Error(body?.error?.message || "HTTP " + res.status);
  return body.value;
}
async function fetchStatus() {
  const res = await fetch(API_PREFIX + "/status", { method: "GET" });
  const body = await res.json().catch(() => null);
  if (!body || !body.ok) return { entries: [] };
  return body.value || { entries: [] };
}
function markRead(sessionId, kind) {
  return post("mark-read", { sessionId, kind }).then(() => void 0).catch(() => {
  });
}
function clearAllRead() {
  return post("clear-all").then(() => void 0).catch(() => {
  });
}
function testNotify(kind, sessionId) {
  return post("test", { kind, sessionId }).then(() => void 0).catch(() => {
  });
}
function requestDesktopToast(title, body, kind, flash) {
  return post("toast", { title, body, kind, flash }).then(() => void 0).catch(() => {
  });
}

// ../dsh-notify-center/src/client/notification-stack.tsx
var import_react = require("react");

// ../dsh-notify-center/src/client/locale.ts
var DICT = {
  "nav": { zh: "\u901A\u77E5", en: "Notifications" },
  "settings.basic": { zh: "\u57FA\u7840", en: "Basic" },
  "settings.enabled": { zh: "\u6D88\u606F\u901A\u77E5", en: "Notifications" },
  "settings.enabledDesc": { zh: "agent \u56DE\u590D / \u63D0\u95EE / \u5BA1\u6279 / \u51FA\u9519\u65F6\u63D0\u9192\uFF1B\u63D0\u95EE\u4E0E\u5BA1\u6279\u5C06\u6301\u7EED\u63D0\u9192\u76F4\u5230\u67E5\u770B", en: "Get notified on agent replies, questions, approvals and errors; blocking reminders persist until viewed." },
  "settings.soundGroup": { zh: "\u58F0\u97F3", en: "Sound" },
  "settings.soundEnabled": { zh: "\u63D0\u793A\u97F3", en: "Sound effects" },
  "settings.soundEnabledDesc": { zh: "\u540E\u53F0\u4E8B\u4EF6\u65F6\u540C\u6B65\u64AD\u653E\uFF1B\u7A97\u53E3\u5185\u53EF\u89C1\u7684\u9001\u8FBE\u4E0D\u54CD", en: "Play a sound for background events; visible in-window deliveries stay silent." },
  "settings.volume": { zh: "\u97F3\u91CF", en: "Volume" },
  "settings.volumeDesc": { zh: "0-100\uFF0C\u611F\u77E5\u97F3\u91CF\u6309\u5E73\u65B9\u6620\u5C04\uFF0C\u4F4E\u6BB5\u66F4\u7EC6\u817B", en: "0-100; perceived volume maps by square for finer low end." },
  "settings.scheme": { zh: "\u97F3\u8272", en: "Timbre" },
  "settings.schemeDesc": { zh: "classic \u6E05\u8106\u53CC\u97F3 \xB7 soft \u67D4\u548C\u4F4E\u516B\u5EA6", en: "classic crisp tones \xB7 soft lower octave." },
  "settings.classic": { zh: "\u6E05\u8106 classic", en: "Crisp classic" },
  "settings.soft": { zh: "\u67D4\u548C soft", en: "Soft" },
  "settings.previewReply": { zh: "\u8BD5\u542C \xB7 \u56DE\u590D", en: "Preview \xB7 reply" },
  "settings.previewError": { zh: "\u8BD5\u542C \xB7 \u51FA\u9519", en: "Preview \xB7 error" },
  "settings.previewAttention": { zh: "\u8BD5\u542C \xB7 \u963B\u585E", en: "Preview \xB7 attention" },
  "settings.behavior": { zh: "\u884C\u4E3A", en: "Behavior" },
  "settings.behaviorDesc": { zh: "\u524D\u53F0\u540C\u4F1A\u8BDD\u4E0D\u6253\u6270\uFF08\u6D88\u606F\u5C31\u5728\u773C\u524D\uFF09\u2192 \u524D\u53F0\u5F02\u4F1A\u8BDD\u51FA\u7AD9\u5185\u5361\u7247 \u2192 \u540E\u53F0\u989D\u5916\u5F39\u684C\u9762\u63D0\u9192 + \u58F0\u97F3\uFF1B\u63D0\u95EE/\u5BA1\u6279\u7B49\u963B\u585E\u63D0\u9192\u6301\u7EED\u5230\u5904\u7406\u4E3A\u6B62\u3002", en: "Foreground same-session is silent (message is in view); foreground other-session shows an in-app card; background adds desktop toast + sound. Blocking reminders persist until handled." },
  "settings.replyRow": { zh: "\u56DE\u590D\u5B8C\u6210", en: "Reply finished" },
  "settings.replyRowDesc": { zh: "agent \u56DE\u590D\u9001\u8FBE\u65F6\uFF08\u77E5\u4F1A\u7EA7\uFF09", en: "When an agent reply arrives (notice level)." },
  "settings.errorRow": { zh: "\u51FA\u9519", en: "Error" },
  "settings.errorRowDesc": { zh: "agent \u6267\u884C\u51FA\u9519\u65F6\uFF08\u77E5\u4F1A\u7EA7\uFF09", en: "When an agent errors (notice level)." },
  "settings.questionRow": { zh: "\u7B49\u5F85\u8F93\u5165", en: "Waiting for input" },
  "settings.questionRowDesc": { zh: "agent \u63D0\u95EE\u7B49\u5F85\u56DE\u7B54\uFF08\u5361\u7247\u5E38\u5F00\uFF0C\u95EA\u5230\u5904\u7406\u4E3A\u6B62\uFF09", en: "Agent asks a question (card always on until handled)." },
  "settings.approvalRow": { zh: "\u7B49\u5F85\u5BA1\u6279", en: "Waiting approval" },
  "settings.approvalRowDesc": { zh: "\u5DE5\u5177\u8C03\u7528\u7B49\u5F85\u6279\u51C6\uFF08\u5361\u7247\u5E38\u5F00\uFF0C\u95EA\u5230\u5904\u7406\u4E3A\u6B62\uFF09", en: "Tool call waits for approval (card always on until handled)." },
  "settings.card": { zh: "\u7AD9\u5185\u5361\u7247", en: "In-app card" },
  "settings.sound": { zh: "\u58F0\u97F3", en: "Sound" },
  "settings.desktop": { zh: "\u684C\u9762\u63D0\u9192", en: "Desktop" },
  "settings.desktopToast": { zh: "\u684C\u9762\u53F3\u4E0B\u89D2\u901A\u77E5", en: "Desktop toast (bottom-right)" },
  "settings.desktopToastDesc": { zh: "\u540E\u53F0\u4E8B\u4EF6\u65F6\u5728 Windows \u684C\u9762\u53F3\u4E0B\u89D2\u5F39\u539F\u751F\u901A\u77E5", en: "Show a native Windows toast at the bottom-right for background events." },
  "settings.taskbarFlash": { zh: "\u4EFB\u52A1\u680F\u95EA\u70C1", en: "Flash taskbar" },
  "settings.taskbarFlashDesc": { zh: "\u540E\u53F0\u4E8B\u4EF6\u65F6\u95EA\u70C1\u4EFB\u52A1\u680F\u56FE\u6807\uFF0C\u76F4\u5230\u7A97\u53E3\u88AB\u805A\u7126", en: "Flash the taskbar button on background events until the window is focused." },
  "settings.dnd": { zh: "\u52FF\u6270", en: "Do Not Disturb" },
  "settings.dndDesc": { zh: "\u52FF\u6270\u671F\u95F4\u6291\u5236\u58F0\u97F3\u4E0E\u684C\u9762\u63D0\u9192\uFF1B\u7AD9\u5185\u5361\u7247\u4E0E\u963B\u585E\u63D0\u9192\u4FDD\u7559", en: "During DND, sounds and desktop reminders are suppressed; in-app and blocking reminders stay." },
  "settings.dndManual": { zh: "\u624B\u52A8\u52FF\u6270", en: "Manual DND" },
  "settings.dndManualDesc": { zh: "\u5F00\u542F\u540E\u901A\u77E5\u9759\u9ED8\uFF1A\u58F0\u97F3\u4E0E\u684C\u9762\u63D0\u9192\u6291\u5236\uFF0C\u7AD9\u5185\u5361\u7247\u4FDD\u7559\uFF0C\u963B\u585E\u63D0\u9192\u7EE7\u7EED\u95EA\u5230\u5904\u7406\u4E3A\u6B62", en: "Silence sounds and desktop reminders; in-app cards and blocking reminders stay." },
  "settings.dndSchedule": { zh: "\u52FF\u6270\u65F6\u6BB5", en: "DND schedule" },
  "settings.dndScheduleDesc": { zh: "\u65F6\u6BB5\u5185\u81EA\u52A8\u52FF\u6270\uFF0C\u652F\u6301\u8DE8\u5348\u591C\uFF1B\u4E0E\u624B\u52A8\u5F00\u5173\u4EFB\u4E00\u547D\u4E2D\u5373\u751F\u6548", en: "Auto DND during the window; supports crossing midnight; either manual or schedule triggers DND." },
  "settings.dndOff": { zh: "\u5173\u95ED", en: "Off" },
  "settings.dndNight": { zh: "22:00 - \u6B21\u65E5 08:00", en: "22:00 - 08:00" },
  "settings.dndNight2": { zh: "23:00 - \u6B21\u65E5 07:00", en: "23:00 - 07:00" },
  "settings.dndMidnight": { zh: "00:00 - 08:00", en: "00:00 - 08:00" },
  "settings.status": { zh: "\u72B6\u6001", en: "Status" },
  "settings.unread": { zh: "\u672A\u8BFB\u6982\u89C8", en: "Unread overview" },
  "settings.unreadDesc": { zh: "\u52A0\u8F7D\u4E2D\u2026", en: "Loading\u2026" },
  "settings.clearAll": { zh: "\u5168\u90E8\u5DF2\u8BFB", en: "Mark all read" },
  "settings.test": { zh: "\u6D4B\u8BD5\u901A\u77E5", en: "Test notifications" },
  "settings.testDesc": { zh: "\u5408\u6210\u4E8B\u4EF6\u8D70\u5B8C\u6574\u94FE\u8DEF\uFF08\u5361\u7247 / \u58F0\u97F3 / \u684C\u9762\u63D0\u9192 / \u4EFB\u52A1\u680F\u95EA\u70C1\uFF09", en: "Synthesize an event through the full pipeline (card / sound / desktop toast / taskbar flash)." },
  "settings.testReply": { zh: "\u77E5\u4F1A\u901A\u77E5", en: "Notice" },
  "settings.testBlocking": { zh: "\u963B\u585E\u901A\u77E5", en: "Blocking" },
  "settings.testSim": { zh: "\u6A21\u62DF\u540E\u53F0\u4F1A\u8BDD", en: "Simulated background session" },
  "settings.testCurrent": { zh: "\u5F53\u524D\u4F1A\u8BDD", en: "Current session" },
  "settings.saved": { zh: "\u5DF2\u4FDD\u5B58", en: "Saved" },
  "stack.more": { zh: "\u5DF2\u6298\u53E0 {n} \u6761\u901A\u77E5 \xB7 \u70B9\u51FB\u6E05\u9664", en: "{n} more folded \xB7 click to clear" },
  "stack.ignore": { zh: "\u5FFD\u7565", en: "Ignore" },
  "stack.newMessage": { zh: "\u65B0\u6D88\u606F", en: "New message" },
  "stack.waitJustNow": { zh: "\u521A\u521A", en: "Just now" },
  "stack.waitMin": { zh: "{n} \u5206\u949F", en: "{n} min" },
  "stack.waitHour": { zh: "{n} \u5C0F\u65F6", en: "{n} h" },
  "bell.title": { zh: "\u901A\u77E5\u4E2D\u5FC3", en: "Notification center" },
  "bell.empty": { zh: "\u6682\u65E0\u901A\u77E5", en: "No notifications" },
  "bell.clearAll": { zh: "\u5168\u90E8\u5DF2\u8BFB", en: "Mark all read" },
  "bell.open": { zh: "\u6253\u5F00\u901A\u77E5\u4E2D\u5FC3", en: "Open notification center" },
  "bell.close": { zh: "\u5173\u95ED\u901A\u77E5\u4E2D\u5FC3", en: "Close notification center" }
};
var zhMode = false;
try {
  zhMode = (navigator.language || "").toLowerCase().startsWith("zh");
} catch {
}
function t(key) {
  const e = DICT[key];
  if (!e) return key;
  return zhMode ? e.zh : e.en;
}
function tf(key, vars) {
  let s = t(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split("{" + k + "}").join(String(v));
    }
  }
  return s;
}

// ../dsh-notify-center/src/client/notification-stack.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var DISMISS_MS = 5e3;
function markReadItem(item) {
  removeItem(item.id);
  if (item.sessionId) markRead(item.sessionId, item.kind).catch(() => {
  });
}
function NotificationStack() {
  const items2 = (0, import_react.useSyncExternalStore)(subscribeStore, getItems);
  const overflow = (0, import_react.useSyncExternalStore)(subscribeStore, getOverflow);
  const [nowTick, setNowTick] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const timer = setInterval(() => setNowTick((v) => v + 1), 3e4);
    return () => clearInterval(timer);
  }, []);
  const visible = items2.length > 0 || overflow > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dnc-stack", style: visible ? void 0 : { display: "none" }, "aria-live": "polite", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dnc-stack-list", children: items2.map((n, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackCard, { item: n, index: idx, now: nowTick }, n.id)) }),
    overflow > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        className: "dnc-stack-more",
        onClick: () => clearOverflow(),
        children: tf("stack.more", { n: overflow })
      }
    )
  ] });
}
function StackCard({ item, index, now }) {
  const remainRef = (0, import_react.useRef)(DISMISS_MS);
  const startRef = (0, import_react.useRef)(Date.now());
  const timerRef = (0, import_react.useRef)(null);
  const [paused, setPaused] = (0, import_react.useState)(false);
  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }
  function schedule(ms) {
    clearTimer();
    remainRef.current = ms;
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => removeItem(item.id), ms);
  }
  (0, import_react.useEffect)(() => {
    if (item.blocking) return;
    schedule(DISMISS_MS);
    return clearTimer;
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
  function ignore(e) {
    e?.stopPropagation?.();
    markReadItem(item);
  }
  const waitLabel = waitText(item, now);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "dnc-card" + (item.blocking ? " dnc-blocking" : ""),
      "data-kind": item.kind,
      role: "button",
      tabIndex: 0,
      "aria-label": `${item.title} \xB7 ${displayName(item)}`,
      onClick: jump,
      onKeyDown: (e) => {
        if (e.key === "Enter") jump();
        else if (e.key === "Delete" || e.key === "Escape") ignore();
      },
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
      onContextMenu: (e) => {
        e.preventDefault();
        ignore();
      },
      style: { animationDelay: `${Math.min(index * 0.06, 0.3)}s` },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dnc-progress-track", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: "dnc-progress-bar",
            style: { animationPlayState: paused ? "paused" : "running" }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dnc-card-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dnc-card-dot" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dnc-card-title", children: [
            item.title || "\u65B0\u6D88\u606F",
            " \xB7 ",
            displayName(item),
            item.count > 1 ? ` \xB7 ${item.count} \u6761` : ""
          ] }),
          item.blocking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dnc-card-wait", children: waitLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dnc-card-ignore",
              title: "\u5FFD\u7565\uFF08Delete / Escape / \u53F3\u952E\u540C\u6548\uFF09",
              onClick: (e) => ignore(e),
              children: "\u5FFD\u7565"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dnc-card-body", children: item.summary || item.title })
      ]
    }
  );
}
function displayName(n) {
  const t2 = (n.sessionTitle || "").trim();
  if (t2) return t2.length > 16 ? t2.slice(0, 16) + "\u2026" : t2;
  if (!n.sessionId) return "";
  return n.sessionId.length > 6 ? n.sessionId.slice(-6) : n.sessionId;
}
function waitText(n, now) {
  void now;
  const ms = Date.now() - (n.firstAt || Date.now());
  const m = Math.max(0, Math.floor(ms / 6e4));
  if (m < 1) return tf("stack.waitJustNow");
  if (m < 60) return tf("stack.waitMin", { n: m });
  return tf("stack.waitHour", { n: Math.floor(m / 60) });
}

// ../dsh-notify-center/src/client/bell.tsx
var import_react2 = require("react");
var import_react_dom = require("react-dom");
var import_jsx_runtime2 = require("react/jsx-runtime");
function Bell() {
  const unread = (0, import_react2.useSyncExternalStore)(subscribeStore, getUnreadCount);
  const items2 = (0, import_react2.useSyncExternalStore)(subscribeStore, getItems);
  const [open, setOpen] = (0, import_react2.useState)(false);
  const btnRef = (0, import_react2.useRef)(null);
  const [rect, setRect] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    if (!open) return;
    const update = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setRect({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const onDown = (e) => {
      const el = e.target;
      if (btnRef.current && !btnRef.current.contains(el)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);
  function jump(n) {
    if (n.sessionId) openSession(n.sessionId);
    removeItem(n.id);
    if (n.sessionId) markRead(n.sessionId, n.kind).catch(() => {
    });
    setOpen(false);
  }
  function markAllRead() {
    clearAll();
    clearAllRead().catch(() => {
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "button",
      {
        ref: btnRef,
        type: "button",
        className: "dnc-bell" + (open ? " dnc-on" : ""),
        "aria-label": open ? t("bell.close") : t("bell.open"),
        "aria-pressed": open,
        onClick: (e) => {
          e?.stopPropagation?.();
          setOpen((v) => !v);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(BellIcon, {}),
          unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dnc-bell-badge", children: unread > 99 ? "99+" : String(unread) })
        ]
      }
    ),
    open && rect && (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dnc-bell-panel", style: { top: rect.top, right: rect.right }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dnc-bell-panel-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("bell.title") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "dnc-bell-clear", onClick: markAllRead, children: t("bell.clearAll") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dnc-bell-panel-list", children: [
          items2.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dnc-bell-empty", children: t("bell.empty") }),
          items2.map((n) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "dnc-bell-row", onClick: () => jump(n), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `dnc-dot dnc-dot-${n.kind}` }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dnc-bell-row-text", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dnc-bell-row-title", children: [
                n.title,
                n.sessionTitle ? ` \xB7 ${n.sessionTitle}` : ""
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dnc-bell-row-summary", children: n.summary || n.title })
            ] })
          ] }, n.id))
        ] })
      ] }),
      document.body
    )
  ] });
}
function BellIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { viewBox: "0 0 16 16", width: "15", height: "15", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "path",
      {
        d: "M8 1.5c-2.2 0-4 1.8-4 4v2.4c0 .9-.35 1.7-.9 2.3l-.6.7c-.35.4-.1 1.1.45 1.1h9.9c.55 0 .8-.7.45-1.1l-.6-.7c-.55-.6-.9-1.4-.9-2.3V5.5c0-2.2-1.8-4-4-4z",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.3",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "path",
      {
        d: "M6.5 12.5a1.5 1.5 0 0 0 3 0",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.3",
        strokeLinecap: "round"
      }
    )
  ] });
}

// ../dsh-notify-center/src/client/settings-section.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function SettingsSection({ close: _close }) {
  const s = (0, import_react3.useSyncExternalStore)(subscribeSettings, getSettings);
  const [blockingCount, setBlockingCount] = (0, import_react3.useState)(0);
  const [toast, setToast] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    fetchStatus().then((st) => {
      const arr = st.entries || [];
      setBlockingCount(
        arr.filter((e) => e.kind === "question" || e.kind === "approval").length
      );
    }).catch(() => {
    });
  }, []);
  function flash(_key, ok, text) {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 2200);
  }
  function preview(kind) {
    playSound(kind, s.scheme, s.volume);
  }
  function test(kind) {
    testNotify(kind).then(() => flash("test", true, t("settings.saved"))).catch(() => flash("test", false, "failed"));
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings", children: [
    toast && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-settings-toast" + (toast.ok ? "" : " dnc-toast-err"), children: toast.text }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-settings-head", children: t("settings.basic") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Row, { title: t("settings.enabled"), desc: t("settings.enabledDesc"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Switch, { checked: s.enabled, onChange: (v) => updateSettings({ enabled: v }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-settings-head", children: t("settings.sound") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Row, { title: t("settings.soundEnabled"), desc: t("settings.soundEnabledDesc"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Switch,
        {
          checked: s.soundEnabled,
          disabled: !s.enabled,
          onChange: (v) => updateSettings({ soundEnabled: v })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Row, { title: t("settings.volume"), desc: t("settings.volumeDesc"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            step: 1,
            className: "dnc-range",
            value: s.volume,
            disabled: !s.enabled || !s.soundEnabled,
            onChange: (e) => updateSettings({ volume: Number(e.target.value) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dnc-chip", children: s.volume })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Row, { title: t("settings.scheme"), desc: t("settings.schemeDesc"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "select",
        {
          className: "dnc-select",
          value: s.scheme,
          disabled: !s.enabled || !s.soundEnabled,
          onChange: (e) => updateSettings({ scheme: e.target.value }),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "classic", children: t("settings.classic") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "soft", children: t("settings.soft") })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "dnc-btn",
            disabled: !s.enabled || !s.soundEnabled,
            onClick: () => preview("message"),
            children: t("settings.previewReply")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "dnc-btn",
            disabled: !s.enabled || !s.soundEnabled,
            onClick: () => preview("error"),
            children: t("settings.previewError")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "dnc-btn",
            disabled: !s.enabled || !s.soundEnabled,
            onClick: () => preview("attention"),
            children: t("settings.previewAttention")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-settings-head", children: t("settings.behavior") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dnc-settings-desc", children: t("settings.behaviorDesc") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        KindRow,
        {
          title: t("settings.replyRow"),
          desc: t("settings.replyRowDesc"),
          card: s.replyCard,
          sound: s.replySound,
          onCard: (v) => updateSettings({ replyCard: v }),
          onSound: (v) => updateSettings({ replySound: v }),
          disabled: !s.enabled,
          soundDisabled: !s.enabled || !s.soundEnabled
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        KindRow,
        {
          title: t("settings.errorRow"),
          desc: t("settings.errorRowDesc"),
          card: s.errorCard,
          sound: s.errorSound,
          onCard: (v) => updateSettings({ errorCard: v }),
          onSound: (v) => updateSettings({ errorSound: v }),
          disabled: !s.enabled,
          soundDisabled: !s.enabled || !s.soundEnabled
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        KindRow,
        {
          title: t("settings.questionRow"),
          desc: t("settings.questionRowDesc"),
          card: true,
          sound: s.questionSound,
          onSound: (v) => updateSettings({ questionSound: v }),
          disabled: !s.enabled,
          soundDisabled: !s.enabled || !s.soundEnabled
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        KindRow,
        {
          title: t("settings.approvalRow"),
          desc: t("settings.approvalRowDesc"),
          card: true,
          sound: s.approvalSound,
          onSound: (v) => updateSettings({ approvalSound: v }),
          disabled: !s.enabled,
          soundDisabled: !s.enabled || !s.soundEnabled
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-settings-head", children: t("settings.desktop") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Row, { title: t("settings.desktopToast"), desc: t("settings.desktopToastDesc"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Switch,
        {
          checked: s.desktopToast,
          disabled: !s.enabled,
          onChange: (v) => updateSettings({ desktopToast: v })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Row, { title: t("settings.taskbarFlash"), desc: t("settings.taskbarFlashDesc"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Switch,
        {
          checked: s.taskbarFlash,
          disabled: !s.enabled,
          onChange: (v) => updateSettings({ taskbarFlash: v })
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-settings-head", children: t("settings.dnd") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dnc-settings-desc", children: t("settings.dndDesc") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Row, { title: t("settings.dndManual"), desc: t("settings.dndManualDesc"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Switch,
        {
          checked: s.dndManual,
          onChange: (v) => updateSettings({ dndManual: v })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Row, { title: t("settings.dndSchedule"), desc: t("settings.dndScheduleDesc"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "select",
        {
          className: "dnc-select",
          value: s.dndSchedule,
          onChange: (e) => updateSettings({ dndSchedule: e.target.value }),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "off", children: t("settings.dndOff") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "22:00-08:00", children: t("settings.dndNight") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "23:00-07:00", children: t("settings.dndNight2") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "00:00-08:00", children: t("settings.dndMidnight") })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-settings-head", children: t("settings.status") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Row,
        {
          title: t("settings.unread"),
          desc: `${blockingCount} \u6761\u963B\u585E\u901A\u77E5\u5F85\u5904\u7406`,
          children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "dnc-btn dnc-btn-danger", onClick: () => clearAllRead().then(() => setBlockingCount(0)).catch(() => {
          }), children: t("settings.clearAll") })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-settings-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "dnc-btn", disabled: !s.enabled, onClick: () => test("reply"), children: t("settings.testReply") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "dnc-btn", disabled: !s.enabled, onClick: () => test("approval"), children: t("settings.testBlocking") })
      ] })
    ] })
  ] });
}
function Row({
  title,
  desc,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-row-text", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-row-title", children: title }),
      desc && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-row-desc", children: desc })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-row-control", children })
  ] });
}
function KindRow({
  title,
  desc,
  card,
  sound,
  onCard,
  onSound,
  disabled,
  soundDisabled
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-row-text", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-row-title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dnc-row-desc", children: desc })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dnc-kind-controls", children: [
      card !== void 0 && onCard && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "dnc-kind", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Switch, { checked: card, disabled, onChange: onCard }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("settings.card") })
      ] }),
      sound !== void 0 && onSound && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "dnc-kind", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Switch, { checked: sound, disabled: soundDisabled, onChange: onSound }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("settings.sound") })
      ] })
    ] })
  ] });
}
function Switch({
  checked,
  onChange,
  disabled
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      disabled,
      className: "dnc-switch",
      "data-on": checked ? "1" : "0",
      onClick: () => onChange(!checked),
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dnc-switch-knob" })
    }
  );
}

// ../dsh-notify-center/src/client/index.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var inject = ["slots", "remote", "uiWorkspace", "sessions"];
var stackRoot = null;
function apply(ctx) {
  ensureNotifyStyles();
  initSessionServices(ctx);
  try {
    if (!stackRoot && typeof document !== "undefined") {
      const host = document.createElement("div");
      host.setAttribute("data-dsh-notify-center-root", "");
      document.body.appendChild(host);
      stackRoot = (0, import_client.createRoot)(host);
      stackRoot.render(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NotificationStack, {}));
    }
  } catch {
  }
  function handlePush(payload) {
    if (!payload || !payload.sessionId) return;
    const s = getSettings();
    if (!s.enabled && !payload.force) return;
    const kind = payload.kind || "reply";
    const blocking = isBlockingKind(kind);
    const focused = typeof document !== "undefined" && document.hasFocus() && !document.hidden;
    const title = payload.title || (blocking ? kind === "approval" ? t("settings.approvalRow") : t("settings.questionRow") : t("stack.newMessage"));
    const summary = payload.summary || title;
    const sessionTitle = getSessionTitle(payload.sessionId);
    addItem({
      ...payload,
      title,
      summary,
      sessionTitle,
      blocking
    });
    const isBackground = !focused;
    if (isBackground || payload.force) {
      const dnd = isDndActive();
      const kindSound = kind === "approval" ? s.approvalSound : kind === "question" ? s.questionSound : kind === "error" ? s.errorSound : s.replySound;
      if (s.soundEnabled && kindSound && !dnd) {
        playSound(
          kind === "error" ? "error" : blocking ? "attention" : "message",
          s.scheme,
          s.volume
        );
      }
      if (!dnd && (s.desktopToast || s.taskbarFlash)) {
        const display = sessionTitle ? `${title} \xB7 ${sessionTitle}` : title;
        requestDesktopToast(display, summary || title, kind, s.taskbarFlash);
      }
    }
  }
  function addBlockingCard(kind, sessionId, request) {
    const s = getSettings();
    if (!s.enabled) return;
    const title = kind === "approval" ? t("settings.approvalRow") : t("settings.questionRow");
    let summary = "";
    if (kind === "question") {
      summary = String(request?.questions?.[0]?.question || "agent \u6B63\u5728\u7B49\u5F85\u4F60\u7684\u56DE\u7B54");
    } else {
      summary = String(request?.reason || `\u5DE5\u5177\u8C03\u7528\u9700\u8981\u5BA1\u6279\uFF1A${request?.toolName || "\u5DE5\u5177"}`);
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
      sessionTitle
    });
    const focused = typeof document !== "undefined" && document.hasFocus() && !document.hidden;
    if (!focused) {
      const dnd = isDndActive();
      const kindSound = kind === "approval" ? s.approvalSound : s.questionSound;
      if (s.soundEnabled && kindSound && !dnd) {
        playSound("attention", s.scheme, s.volume);
      }
      if (!dnd && (s.desktopToast || s.taskbarFlash)) {
        const display = sessionTitle ? `${title} \xB7 ${sessionTitle}` : title;
        requestDesktopToast(display, summary || title, kind, s.taskbarFlash);
      }
    }
  }
  try {
    ctx.remote?.$on?.("approval/request", (request, next) => {
      try {
        const sessionId = request?.agent?.id || request?.sessionId || request?.agentId || "";
        if (sessionId) addBlockingCard("approval", sessionId, request);
      } catch {
      }
      if (typeof next === "function") next();
    });
  } catch {
  }
  try {
    ctx.remote?.$on?.("user-questions/request", (request, next) => {
      try {
        const sessionId = request?.agent?.id || request?.sessionId || request?.agentId || "";
        if (sessionId) addBlockingCard("question", sessionId, request);
      } catch {
      }
      if (typeof next === "function") next();
    });
  } catch {
  }
  function connectSSE() {
    if (typeof EventSource === "undefined") return () => {
    };
    let es = null;
    try {
      es = new EventSource("/dsh-notify/api/events");
    } catch {
      return () => {
      };
    }
    es.addEventListener("snapshot", (e) => {
      try {
        const data = JSON.parse(e.data);
        clearAll();
        (data.entries || []).forEach(
          (entry) => addItem({
            ...entry,
            blocking: isBlockingKind(entry.kind || "reply"),
            sessionTitle: getSessionTitle(entry.sessionId || "")
          })
        );
      } catch {
      }
    });
    es.addEventListener("push", (e) => {
      try {
        handlePush(JSON.parse(e.data));
      } catch {
      }
    });
    es.addEventListener("resolved", (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.sessionId === "*") clearAll();
        else removeBySession(d.sessionId, d.kind);
      } catch {
      }
    });
    return () => {
      try {
        es?.close();
      } catch {
      }
      es = null;
    };
  }
  ctx.effect(() => connectSSE(), "notify-center: sse");
  ctx.effect(
    () => ctx.slots.inject(
      "conversation.session.header.utilities",
      () => ctx.slots.register(
        { name: "conversation.session.header.utilities", id: "notify-center.bell", order: 30, label: t("bell.title") },
        () => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Bell, {})
      )
    ),
    "notify-center: bell"
  );
  ctx.effect(
    () => ctx.slots.inject(
      "settings.section",
      () => ctx.slots.register(
        { name: "settings.section", id: "notifications", order: 80, label: () => t("nav") },
        (props) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SettingsSection, { close: props?.close })
      )
    ),
    "notify-center: settings"
  );
}

return module.exports;
} });
