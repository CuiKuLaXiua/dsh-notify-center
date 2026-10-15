// 客户端设置：localStorage 持久化，零后端依赖。
// 设置项覆盖：总开关 / 提示音 / 音量 / 音色 / 各类型行为 / 桌面提醒 / 勿扰。

export interface NotifySettings {
  enabled: boolean;
  soundEnabled: boolean;
  volume: number;
  scheme: "classic" | "soft";
  replyCard: boolean;
  replySound: boolean;
  errorCard: boolean;
  errorSound: boolean;
  questionSound: boolean;
  approvalSound: boolean;
  desktopToast: boolean;
  taskbarFlash: boolean;
  dndManual: boolean;
  dndSchedule: string;
}

const KEY = "dsh-notify-center:settings:v1";

export const DEFAULT_SETTINGS: NotifySettings = {
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
  dndSchedule: "off",
};

let current: NotifySettings = load();
const listeners = new Set<() => void>();

function load(): NotifySettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* 回退默认 */
  }
  return { ...DEFAULT_SETTINGS };
}

export function getSettings(): NotifySettings {
  return current;
}

export function subscribeSettings(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit(): void {
  for (const fn of listeners) fn();
}

export function updateSettings(patch: Partial<NotifySettings>): void {
  current = { ...current, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* 忽略 */
  }
  emit();
}

/** 当前是否处于勿扰（手动开关 / 时段任一命中）。 */
export function isDndActive(): boolean {
  const s = current;
  if (s.dndManual) return true;
  if (s.dndSchedule && s.dndSchedule !== "off") {
    const [start, end] = s.dndSchedule.split("-");
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = (start || "00:00").split(":").map(Number);
    const [eh, em] = (end || "00:00").split(":").map(Number);
    let sMin = sh * 60 + (sm || 0);
    let eMin = eh * 60 + (em || 0);
    if (eMin <= sMin) eMin += 24 * 60; // 跨午夜
    let c = cur;
    if (eMin > 24 * 60 && c < eMin - 24 * 60) c += 24 * 60;
    if (c >= sMin && c < eMin) return true;
  }
  return false;
}