// dsh-notify-center 全部样式。颜色一律使用 DSH 别名变量（--dsw-alias-*），
// 随壳层明/暗主题自动切换。注入到 <style>，避免污染组件树。

export const NOTIFY_CSS = `
/* ── 右上角通知栈 ── */
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

/* ── 会话头铃铛 ── */
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

/* ── 设置页 ── */
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

let injected = false;

export function ensureNotifyStyles(): void {
  if (injected) return;
  injected = true;
  try {
    const style = document.createElement("style");
    style.setAttribute("data-dsh-notify-center", "");
    style.textContent = NOTIFY_CSS;
    document.head.appendChild(style);
  } catch {
    /* 忽略 */
  }
}