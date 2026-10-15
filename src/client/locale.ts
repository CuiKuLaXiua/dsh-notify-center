// 客户端轻量国际化：跟随 navigator.language，zh 用中文，其余用英文。
// 不依赖 dsh locale 服务，保持零外部依赖（与 git-studio 同策略）。

const DICT: Record<string, { zh: string; en: string }> = {
  "nav": { zh: "通知", en: "Notifications" },
  "settings.basic": { zh: "基础", en: "Basic" },
  "settings.enabled": { zh: "消息通知", en: "Notifications" },
  "settings.enabledDesc": { zh: "agent 回复 / 提问 / 审批 / 出错时提醒；提问与审批将持续提醒直到查看", en: "Get notified on agent replies, questions, approvals and errors; blocking reminders persist until viewed." },
  "settings.soundGroup": { zh: "声音", en: "Sound" },
  "settings.soundEnabled": { zh: "提示音", en: "Sound effects" },
  "settings.soundEnabledDesc": { zh: "后台事件时同步播放；窗口内可见的送达不响", en: "Play a sound for background events; visible in-window deliveries stay silent." },
  "settings.volume": { zh: "音量", en: "Volume" },
  "settings.volumeDesc": { zh: "0-100，感知音量按平方映射，低段更细腻", en: "0-100; perceived volume maps by square for finer low end." },
  "settings.scheme": { zh: "音色", en: "Timbre" },
  "settings.schemeDesc": { zh: "classic 清脆双音 · soft 柔和低八度", en: "classic crisp tones · soft lower octave." },
  "settings.classic": { zh: "清脆 classic", en: "Crisp classic" },
  "settings.soft": { zh: "柔和 soft", en: "Soft" },
  "settings.previewReply": { zh: "试听 · 回复", en: "Preview · reply" },
  "settings.previewError": { zh: "试听 · 出错", en: "Preview · error" },
  "settings.previewAttention": { zh: "试听 · 阻塞", en: "Preview · attention" },
  "settings.behavior": { zh: "行为", en: "Behavior" },
  "settings.behaviorDesc": { zh: "前台同会话不打扰（消息就在眼前）→ 前台异会话出站内卡片 → 后台额外弹桌面提醒 + 声音；提问/审批等阻塞提醒持续到处理为止。", en: "Foreground same-session is silent (message is in view); foreground other-session shows an in-app card; background adds desktop toast + sound. Blocking reminders persist until handled." },
  "settings.replyRow": { zh: "回复完成", en: "Reply finished" },
  "settings.replyRowDesc": { zh: "agent 回复送达时（知会级）", en: "When an agent reply arrives (notice level)." },
  "settings.errorRow": { zh: "出错", en: "Error" },
  "settings.errorRowDesc": { zh: "agent 执行出错时（知会级）", en: "When an agent errors (notice level)." },
  "settings.questionRow": { zh: "等待输入", en: "Waiting for input" },
  "settings.questionRowDesc": { zh: "agent 提问等待回答（卡片常开，闪到处理为止）", en: "Agent asks a question (card always on until handled)." },
  "settings.approvalRow": { zh: "等待审批", en: "Waiting approval" },
  "settings.approvalRowDesc": { zh: "工具调用等待批准（卡片常开，闪到处理为止）", en: "Tool call waits for approval (card always on until handled)." },
  "settings.card": { zh: "站内卡片", en: "In-app card" },
  "settings.sound": { zh: "声音", en: "Sound" },
  "settings.desktop": { zh: "桌面提醒", en: "Desktop" },
  "settings.desktopToast": { zh: "桌面右下角通知", en: "Desktop toast (bottom-right)" },
  "settings.desktopToastDesc": { zh: "后台事件时在 Windows 桌面右下角弹原生通知", en: "Show a native Windows toast at the bottom-right for background events." },
  "settings.taskbarFlash": { zh: "任务栏闪烁", en: "Flash taskbar" },
  "settings.taskbarFlashDesc": { zh: "后台事件时闪烁任务栏图标，直到窗口被聚焦", en: "Flash the taskbar button on background events until the window is focused." },
  "settings.dnd": { zh: "勿扰", en: "Do Not Disturb" },
  "settings.dndDesc": { zh: "勿扰期间抑制声音与桌面提醒；站内卡片与阻塞提醒保留", en: "During DND, sounds and desktop reminders are suppressed; in-app and blocking reminders stay." },
  "settings.dndManual": { zh: "手动勿扰", en: "Manual DND" },
  "settings.dndManualDesc": { zh: "开启后通知静默：声音与桌面提醒抑制，站内卡片保留，阻塞提醒继续闪到处理为止", en: "Silence sounds and desktop reminders; in-app cards and blocking reminders stay." },
  "settings.dndSchedule": { zh: "勿扰时段", en: "DND schedule" },
  "settings.dndScheduleDesc": { zh: "时段内自动勿扰，支持跨午夜；与手动开关任一命中即生效", en: "Auto DND during the window; supports crossing midnight; either manual or schedule triggers DND." },
  "settings.dndOff": { zh: "关闭", en: "Off" },
  "settings.dndNight": { zh: "22:00 - 次日 08:00", en: "22:00 - 08:00" },
  "settings.dndNight2": { zh: "23:00 - 次日 07:00", en: "23:00 - 07:00" },
  "settings.dndMidnight": { zh: "00:00 - 08:00", en: "00:00 - 08:00" },
  "settings.status": { zh: "状态", en: "Status" },
  "settings.unread": { zh: "未读概览", en: "Unread overview" },
  "settings.unreadDesc": { zh: "加载中…", en: "Loading…" },
  "settings.clearAll": { zh: "全部已读", en: "Mark all read" },
  "settings.test": { zh: "测试通知", en: "Test notifications" },
  "settings.testDesc": { zh: "合成事件走完整链路（卡片 / 声音 / 桌面提醒 / 任务栏闪烁）", en: "Synthesize an event through the full pipeline (card / sound / desktop toast / taskbar flash)." },
  "settings.testReply": { zh: "知会通知", en: "Notice" },
  "settings.testBlocking": { zh: "阻塞通知", en: "Blocking" },
  "settings.testSim": { zh: "模拟后台会话", en: "Simulated background session" },
  "settings.testCurrent": { zh: "当前会话", en: "Current session" },
  "settings.saved": { zh: "已保存", en: "Saved" },
  "stack.more": { zh: "已折叠 {n} 条通知 · 点击清除", en: "{n} more folded · click to clear" },
  "stack.ignore": { zh: "忽略", en: "Ignore" },
  "stack.newMessage": { zh: "新消息", en: "New message" },
  "stack.waitJustNow": { zh: "刚刚", en: "Just now" },
  "stack.waitMin": { zh: "{n} 分钟", en: "{n} min" },
  "stack.waitHour": { zh: "{n} 小时", en: "{n} h" },
  "bell.title": { zh: "通知中心", en: "Notification center" },
  "bell.empty": { zh: "暂无通知", en: "No notifications" },
  "bell.clearAll": { zh: "全部已读", en: "Mark all read" },
  "bell.open": { zh: "打开通知中心", en: "Open notification center" },
  "bell.close": { zh: "关闭通知中心", en: "Close notification center" },
};

let zhMode = false;
try {
  zhMode = (navigator.language || "").toLowerCase().startsWith("zh");
} catch {
  /* SSR 不存在时默认英文 */
}

export function t(key: string): string {
  const e = DICT[key];
  if (!e) return key;
  return zhMode ? e.zh : e.en;
}

export function tf(key: string, vars?: Record<string, string | number>): string {
  let s = t(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split("{" + k + "}").join(String(v));
    }
  }
  return s;
}