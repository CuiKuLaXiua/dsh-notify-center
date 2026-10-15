// 通知设置页（settings.section，id: notifications）。
// 所有设置存 localStorage；试听走 Web Audio；测试通知走宿主 /test 合成事件。

import { useEffect, useState, useSyncExternalStore } from "react";
import { getSettings, subscribeSettings, updateSettings } from "./settings";
import { playSound } from "./sound";
import { clearAllRead, fetchStatus, testNotify } from "./api";
import { t } from "./locale";

export function SettingsSection({ close: _close }: { close?: () => void }) {
  const s = useSyncExternalStore(subscribeSettings, getSettings);
  const [blockingCount, setBlockingCount] = useState(0);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchStatus()
      .then((st) => {
        const arr = st.entries || [];
        setBlockingCount(
          arr.filter((e) => e.kind === "question" || e.kind === "approval").length,
        );
      })
      .catch(() => {});
  }, []);

  function flash(_key: string, ok: boolean, text: string) {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 2200);
  }

  function preview(kind: "message" | "error" | "attention") {
    playSound(kind, s.scheme, s.volume);
  }

  function test(kind: "reply" | "approval") {
    testNotify(kind)
      .then(() => flash("test", true, t("settings.saved")))
      .catch(() => flash("test", false, "failed"));
  }

  return (
    <div className="dnc-settings">
      {toast && <div className={"dnc-settings-toast" + (toast.ok ? "" : " dnc-toast-err")}>{toast.text}</div>}

      <div className="dnc-settings-group">
        <div className="dnc-settings-head">{t("settings.basic")}</div>
        <Row title={t("settings.enabled")} desc={t("settings.enabledDesc")}>
          <Switch checked={s.enabled} onChange={(v) => updateSettings({ enabled: v })} />
        </Row>
      </div>

      <div className="dnc-settings-group">
        <div className="dnc-settings-head">{t("settings.sound")}</div>
        <Row title={t("settings.soundEnabled")} desc={t("settings.soundEnabledDesc")}>
          <Switch
            checked={s.soundEnabled}
            disabled={!s.enabled}
            onChange={(v) => updateSettings({ soundEnabled: v })}
          />
        </Row>
        <Row title={t("settings.volume")} desc={t("settings.volumeDesc")}>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            className="dnc-range"
            value={s.volume}
            disabled={!s.enabled || !s.soundEnabled}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
          />
          <span className="dnc-chip">{s.volume}</span>
        </Row>
        <Row title={t("settings.scheme")} desc={t("settings.schemeDesc")}>
          <select
            className="dnc-select"
            value={s.scheme}
            disabled={!s.enabled || !s.soundEnabled}
            onChange={(e) => updateSettings({ scheme: e.target.value as "classic" | "soft" })}
          >
            <option value="classic">{t("settings.classic")}</option>
            <option value="soft">{t("settings.soft")}</option>
          </select>
        </Row>
        <div className="dnc-settings-actions">
          <button
            type="button"
            className="dnc-btn"
            disabled={!s.enabled || !s.soundEnabled}
            onClick={() => preview("message")}
          >
            {t("settings.previewReply")}
          </button>
          <button
            type="button"
            className="dnc-btn"
            disabled={!s.enabled || !s.soundEnabled}
            onClick={() => preview("error")}
          >
            {t("settings.previewError")}
          </button>
          <button
            type="button"
            className="dnc-btn"
            disabled={!s.enabled || !s.soundEnabled}
            onClick={() => preview("attention")}
          >
            {t("settings.previewAttention")}
          </button>
        </div>
      </div>

      <div className="dnc-settings-group">
        <div className="dnc-settings-head">{t("settings.behavior")}</div>
        <p className="dnc-settings-desc">{t("settings.behaviorDesc")}</p>
        <KindRow
          title={t("settings.replyRow")}
          desc={t("settings.replyRowDesc")}
          card={s.replyCard}
          sound={s.replySound}
          onCard={(v) => updateSettings({ replyCard: v })}
          onSound={(v) => updateSettings({ replySound: v })}
          disabled={!s.enabled}
          soundDisabled={!s.enabled || !s.soundEnabled}
        />
        <KindRow
          title={t("settings.errorRow")}
          desc={t("settings.errorRowDesc")}
          card={s.errorCard}
          sound={s.errorSound}
          onCard={(v) => updateSettings({ errorCard: v })}
          onSound={(v) => updateSettings({ errorSound: v })}
          disabled={!s.enabled}
          soundDisabled={!s.enabled || !s.soundEnabled}
        />
        <KindRow
          title={t("settings.questionRow")}
          desc={t("settings.questionRowDesc")}
          card
          sound={s.questionSound}
          onSound={(v) => updateSettings({ questionSound: v })}
          disabled={!s.enabled}
          soundDisabled={!s.enabled || !s.soundEnabled}
        />
        <KindRow
          title={t("settings.approvalRow")}
          desc={t("settings.approvalRowDesc")}
          card
          sound={s.approvalSound}
          onSound={(v) => updateSettings({ approvalSound: v })}
          disabled={!s.enabled}
          soundDisabled={!s.enabled || !s.soundEnabled}
        />
      </div>

      <div className="dnc-settings-group">
        <div className="dnc-settings-head">{t("settings.desktop")}</div>
        <Row title={t("settings.desktopToast")} desc={t("settings.desktopToastDesc")}>
          <Switch
            checked={s.desktopToast}
            disabled={!s.enabled}
            onChange={(v) => updateSettings({ desktopToast: v })}
          />
        </Row>
        <Row title={t("settings.taskbarFlash")} desc={t("settings.taskbarFlashDesc")}>
          <Switch
            checked={s.taskbarFlash}
            disabled={!s.enabled}
            onChange={(v) => updateSettings({ taskbarFlash: v })}
          />
        </Row>
      </div>

      <div className="dnc-settings-group">
        <div className="dnc-settings-head">{t("settings.dnd")}</div>
        <p className="dnc-settings-desc">{t("settings.dndDesc")}</p>
        <Row title={t("settings.dndManual")} desc={t("settings.dndManualDesc")}>
          <Switch
            checked={s.dndManual}
            onChange={(v) => updateSettings({ dndManual: v })}
          />
        </Row>
        <Row title={t("settings.dndSchedule")} desc={t("settings.dndScheduleDesc")}>
          <select
            className="dnc-select"
            value={s.dndSchedule}
            onChange={(e) => updateSettings({ dndSchedule: e.target.value })}
          >
            <option value="off">{t("settings.dndOff")}</option>
            <option value="22:00-08:00">{t("settings.dndNight")}</option>
            <option value="23:00-07:00">{t("settings.dndNight2")}</option>
            <option value="00:00-08:00">{t("settings.dndMidnight")}</option>
          </select>
        </Row>
      </div>

      <div className="dnc-settings-group">
        <div className="dnc-settings-head">{t("settings.status")}</div>
        <Row
          title={t("settings.unread")}
          desc={`${blockingCount} 条阻塞通知待处理`}
        >
          <button type="button" className="dnc-btn dnc-btn-danger" onClick={() => clearAllRead().then(() => setBlockingCount(0)).catch(() => {})}>
            {t("settings.clearAll")}
          </button>
        </Row>
        <div className="dnc-settings-actions">
          <button type="button" className="dnc-btn" disabled={!s.enabled} onClick={() => test("reply")}>
            {t("settings.testReply")}
          </button>
          <button type="button" className="dnc-btn" disabled={!s.enabled} onClick={() => test("approval")}>
            {t("settings.testBlocking")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: any;
}) {
  return (
    <div className="dnc-row">
      <div className="dnc-row-text">
        <div className="dnc-row-title">{title}</div>
        {desc && <div className="dnc-row-desc">{desc}</div>}
      </div>
      <div className="dnc-row-control">{children}</div>
    </div>
  );
}

function KindRow({
  title,
  desc,
  card,
  sound,
  onCard,
  onSound,
  disabled,
  soundDisabled,
}: {
  title: string;
  desc: string;
  card?: boolean;
  sound?: boolean;
  onCard?: (v: boolean) => void;
  onSound?: (v: boolean) => void;
  disabled: boolean;
  soundDisabled: boolean;
}) {
  return (
    <div className="dnc-row">
      <div className="dnc-row-text">
        <div className="dnc-row-title">{title}</div>
        <div className="dnc-row-desc">{desc}</div>
      </div>
      <div className="dnc-kind-controls">
        {card !== undefined && onCard && (
          <label className="dnc-kind">
            <Switch checked={card} disabled={disabled} onChange={onCard} />
            <span>{t("settings.card")}</span>
          </label>
        )}
        {sound !== undefined && onSound && (
          <label className="dnc-kind">
            <Switch checked={sound} disabled={soundDisabled} onChange={onSound} />
            <span>{t("settings.sound")}</span>
          </label>
        )}
      </div>
    </div>
  );
}

function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className="dnc-switch"
      data-on={checked ? "1" : "0"}
      onClick={() => onChange(!checked)}
    >
      <span className="dnc-switch-knob" />
    </button>
  );
}