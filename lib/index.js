// ../dsh-notify-center/src/shared/protocol.ts
var PLUGIN_ID = "dsh-notify-center";
var API_PREFIX = "/dsh-notify/api";
function ok(value) {
  return { ok: true, value };
}
function fail(code, message) {
  return { ok: false, error: { code, message } };
}
var ErrorCode = {
  BadRequest: "bad-request",
  Forbidden: "forbidden",
  NotFound: "not-found",
  TooLarge: "too-large",
  Internal: "internal"
};

// ../dsh-notify-center/src/host/trust-fence.ts
function isTrustedApiRequest(req, trustedHosts) {
  const host = String(req?.headers?.host ?? "").toLowerCase();
  if (!host) return false;
  const { hostname, isLoopback } = classifyHost(host);
  if (!isLoopback && !(trustedHosts ?? []).some((h) => String(h).toLowerCase() === host)) {
    return false;
  }
  const site = String(req?.headers?.["sec-fetch-site"] ?? "").toLowerCase();
  if (site === "cross-site") return false;
  const origin = req?.headers?.origin;
  if (origin) {
    let originHostname = "";
    try {
      originHostname = new URL(String(origin)).hostname.toLowerCase();
    } catch {
      return false;
    }
    if (originHostname !== hostname) return false;
  }
  return true;
}
function classifyHost(host) {
  let hostname = host;
  const bracket = host.indexOf("]");
  if (bracket !== -1) {
    hostname = host.slice(0, bracket + 1);
  } else {
    const colon = host.lastIndexOf(":");
    if (colon !== -1 && host.indexOf(":") === colon) hostname = host.slice(0, colon);
  }
  hostname = hostname.replace(/^\[/, "").replace(/\]$/, "");
  const isLoopback = hostname === "127.0.0.1" || hostname === "::1" || hostname === "localhost";
  return { hostname, isLoopback };
}

// ../dsh-notify-center/src/host/native.ts
import { spawn } from "node:child_process";
var PS = typeof process.env.SystemRoot === "string" && process.env.SystemRoot ? process.env.SystemRoot + "\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" : "powershell.exe";
function cleanEnv() {
  const env = {};
  for (const key of Object.keys(process.env)) {
    if (/KEY|SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIAL|API[-_]?KEY/i.test(key)) continue;
    const value = process.env[key];
    if (value !== void 0) env[key] = value;
  }
  return env;
}
function run(script, extraEnv = {}) {
  try {
    const child = spawn(
      PS,
      ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-STA", "-Command", script],
      {
        windowsHide: true,
        stdio: "ignore",
        env: { ...cleanEnv(), ...extraEnv }
      }
    );
    child.on("error", () => {
    });
  } catch {
  }
}
function showDesktopToast(title, body, kind) {
  const icon = kind === "error" ? "Error" : kind === "question" || kind === "approval" ? "Warning" : "Info";
  const script = [
    "Add-Type -AssemblyName System.Windows.Forms | Out-Null",
    "Add-Type -AssemblyName System.Drawing | Out-Null",
    "$n = New-Object System.Windows.Forms.NotifyIcon",
    "try {",
    "  $n.Icon = [System.Drawing.SystemIcons]::" + icon,
    "  $n.Visible = $true",
    "  $n.ShowBalloonTip(8000, $env:DNH_TITLE, $env:DNH_BODY, [System.Windows.Forms.ToolTipIcon]::" + icon + ")",
    "  Start-Sleep -Milliseconds 8500",
    "} finally {",
    "  $n.Dispose()",
    "}"
  ].join("\n");
  run(script, { DNH_TITLE: title, DNH_BODY: body });
}
function flashTaskbar() {
  const script = [
    'Add-Type -TypeDefinition @"',
    "using System;",
    "using System.Runtime.InteropServices;",
    "public static class DshFlashUtil {",
    "  [StructLayout(LayoutKind.Sequential)]",
    "  public struct FLASHWINFO {",
    "    public uint cbSize;",
    "    public IntPtr hwnd;",
    "    public uint dwFlags;",
    "    public uint uCount;",
    "    public uint dwTimeout;",
    "  }",
    '  [DllImport("user32.dll")]',
    "  public static extern bool FlashWindowEx(ref FLASHWINFO pwfi);",
    "}",
    '"@',
    "$proc = Get-Process -Id $env:DNH_PID -ErrorAction SilentlyContinue",
    "if ($null -eq $proc) { exit }",
    "$hwnd = $proc.MainWindowHandle",
    "if ($hwnd -eq 0) { exit }",
    "$w = New-Object 'DshFlashUtil+FLASHWINFO'",
    "$w.cbSize = [System.Runtime.InteropServices.Marshal]::SizeOf($w)",
    "$w.hwnd = $hwnd",
    "$w.dwFlags = 15",
    "$w.uCount = 0",
    "$w.dwTimeout = 0",
    "[DshFlashUtil]::FlashWindowEx([ref]$w) | Out-Null"
  ].join("\n");
  run(script, { DNH_PID: String(process.pid) });
}

// ../dsh-notify-center/src/host/index.ts
var inject = ["webServer", "webRuntime"];
var MAX_BODY = 256 * 1024;
var MAX_RECENT = 30;
var MAX_SUMMARY_CHARS = 300;
var BLOCKING_KINDS = /* @__PURE__ */ new Set(["question", "approval"]);
var ledger = /* @__PURE__ */ new Map();
var recent = [];
var sseClients = /* @__PURE__ */ new Set();
var seq = 0;
function newId(kind) {
  seq = (seq + 1) % 65535;
  return `${Date.now().toString(36)}-${seq.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
function snapshotEntries() {
  return [...ledger.values(), ...recent];
}
function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
function broadcast(event, data) {
  const line = `event: ${event}
data: ${JSON.stringify(data)}

`;
  for (const res of sseClients) {
    try {
      res.write(line);
    } catch {
      sseClients.delete(res);
    }
  }
}
function pushNotification(entry, opts) {
  const blocking = BLOCKING_KINDS.has(entry.kind);
  if (blocking) {
    const key = entry.sessionId + ":" + entry.kind;
    const existing = ledger.get(key);
    if (existing) {
      existing.count += 1;
      existing.summary = entry.summary || existing.summary;
      existing.title = entry.title || existing.title;
      broadcast("push", { ...existing, blocking: true, force: opts?.force });
      return;
    }
    ledger.set(key, entry);
  } else {
    recent.unshift(entry);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
  }
  broadcast("push", { ...entry, blocking, force: opts?.force });
}
function notify(sessionId, kind, title, summary) {
  if (!sessionId) return;
  pushNotification({
    id: newId(kind),
    sessionId,
    kind,
    title,
    summary: (summary || "").slice(0, MAX_SUMMARY_CHARS),
    count: 1,
    firstAt: Date.now()
  });
}
function removeLedger(sessionId, kind) {
  let removed = 0;
  for (const [key, e] of ledger) {
    if (e.sessionId === sessionId && (!kind || e.kind === kind)) {
      ledger.delete(key);
      removed++;
    }
  }
  return removed;
}
function clearAllLedger() {
  ledger.clear();
}
function extractText(content) {
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) {
    if (block && typeof block.text === "string") parts.push(block.text);
    else if (typeof block === "string") parts.push(block);
  }
  return parts.join(" ").trim();
}
var lastAssistant = /* @__PURE__ */ new Map();
function apply(ctx) {
  const { webServer, webRuntime, logger } = ctx;
  const trustedHosts = webRuntime?.trustedHosts;
  ctx.on("session/event", (session, event) => {
    try {
      const sessionId = session?.id || event?.sessionId || "";
      if (!sessionId) return;
      const type = event?.type;
      if (type === "assistant/message") {
        const text = extractText(event?.data?.message?.content);
        if (text) lastAssistant.set(sessionId, text.slice(0, MAX_SUMMARY_CHARS));
      } else if (type === "turn/end") {
        if (session?.parentSession || session?.origin === "subagent") return;
        const summary = lastAssistant.get(sessionId) || "";
        lastAssistant.delete(sessionId);
        notify(sessionId, "reply", "\u56DE\u590D\u5B8C\u6210", summary || "agent \u5DF2\u56DE\u590D");
      } else if (type === "approval/decided") {
        const removed = removeLedger(sessionId, "approval");
        if (removed > 0) broadcast("resolved", { sessionId, kind: "approval" });
      } else if (type === "goal/change" && event?.data?.operation === "complete") {
        if (session?.parentSession || session?.origin === "subagent") return;
        const goalTitle = event?.data?.value?.title || event?.data?.goal?.title || event?.data?.title || "\u76EE\u6807\u5B8C\u6210";
        notify(sessionId, "goal", "\u76EE\u6807\u5B8C\u6210", String(goalTitle));
      }
    } catch (e) {
      logger?.error?.(PLUGIN_ID + ": session/event: " + String(e?.message ?? e));
    }
  });
  ctx.on("approval/request", (req, next) => {
    try {
      const sessionId = req?.agent?.id;
      if (sessionId) {
        const tool = req?.toolName || "\u5DE5\u5177";
        const reason = req?.reason;
        queueMicrotask(
          () => notify(sessionId, "approval", "\u7B49\u5F85\u5BA1\u6279", reason || `\u5DE5\u5177\u8C03\u7528\u9700\u8981\u5BA1\u6279\uFF1A${tool}`)
        );
      }
    } catch {
    }
    if (typeof next === "function") return next();
  });
  ctx.on("user-questions/request", (req, next) => {
    try {
      const sessionId = req?.agent?.id;
      if (sessionId) {
        const q = Array.isArray(req?.questions) && req.questions[0]?.question ? req.questions[0].question : "agent \u6B63\u5728\u7B49\u5F85\u4F60\u7684\u56DE\u7B54";
        queueMicrotask(() => notify(sessionId, "question", "\u7B49\u5F85\u8F93\u5165", String(q)));
      }
    } catch {
    }
    if (typeof next === "function") return next();
  });
  ctx.on("api-session/error", (sessionId, message) => {
    try {
      notify(String(sessionId || ""), "error", "\u51FA\u9519", String(message || "agent \u6267\u884C\u51FA\u9519"));
    } catch {
    }
  });
  webServer.register({
    kind: "prefix",
    path: API_PREFIX,
    handler: async (req, res) => {
      if (!isTrustedApiRequest(req, trustedHosts)) {
        sendJson(res, 403, fail(ErrorCode.Forbidden, "untrusted request"));
        return;
      }
      let pathname = "";
      try {
        pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
      } catch {
        sendJson(res, 400, fail(ErrorCode.BadRequest, "bad path"));
        return;
      }
      if (pathname === `${API_PREFIX}/events` && req.method === "GET") {
        handleEvents(req, res);
        return;
      }
      if (pathname === `${API_PREFIX}/status` && req.method === "GET") {
        sendJson(res, 200, ok({ entries: snapshotEntries() }));
        return;
      }
      if (req.method !== "POST") {
        sendJson(res, 400, fail(ErrorCode.BadRequest, "expect POST"));
        return;
      }
      const method = pathname.slice(API_PREFIX.length + 1);
      if (!method || method.includes("/")) {
        sendJson(res, 400, fail(ErrorCode.BadRequest, "bad method"));
        return;
      }
      let payload = {};
      try {
        payload = await readJsonBody(req);
      } catch (e) {
        const tooLarge = String(e?.message ?? "") === "too-large";
        sendJson(res, tooLarge ? 413 : 400, fail(ErrorCode.BadRequest, tooLarge ? "body too large" : "invalid JSON body"));
        return;
      }
      try {
        switch (method) {
          case "mark-read": {
            const sessionId = String(payload?.sessionId || "");
            const kind = typeof payload?.kind === "string" ? payload.kind : void 0;
            const removed = sessionId ? removeLedger(sessionId, kind) : clearAllLedger();
            if (sessionId) broadcast("resolved", { sessionId, kind });
            sendJson(res, 200, ok({ removed }));
            break;
          }
          case "clear-all": {
            clearAllLedger();
            broadcast("resolved", { sessionId: "*" });
            sendJson(res, 200, ok({}));
            break;
          }
          case "test": {
            const kind = payload?.kind === "approval" || payload?.kind === "question" ? payload.kind : "reply";
            const sessionId = String(payload?.sessionId || "");
            const entry = {
              id: newId(kind),
              sessionId: sessionId || "test-session",
              kind,
              title: kind === "approval" ? "\u7B49\u5F85\u5BA1\u6279" : kind === "question" ? "\u7B49\u5F85\u8F93\u5165" : "\u6D4B\u8BD5\u901A\u77E5",
              summary: kind === "approval" ? "\u5DE5\u5177\u8C03\u7528\u9700\u8981\u5BA1\u6279\uFF08\u6D4B\u8BD5\uFF09" : kind === "question" ? "agent \u6B63\u5728\u7B49\u5F85\u4F60\u7684\u56DE\u7B54\uFF08\u6D4B\u8BD5\uFF09" : "\u8FD9\u662F\u4E00\u6761\u6D4B\u8BD5\u901A\u77E5",
              count: 1,
              firstAt: Date.now()
            };
            pushNotification(entry, { force: true });
            sendJson(res, 200, ok({}));
            break;
          }
          case "toast": {
            const title = String(payload?.title || "DeepSeek Harness");
            const body = String(payload?.body || "");
            const kind = String(payload?.kind || "reply");
            const flash = payload?.flash !== false;
            if (flash) flashTaskbar();
            showDesktopToast(title, body, kind);
            sendJson(res, 200, ok({}));
            break;
          }
          default:
            sendJson(res, 404, fail(ErrorCode.NotFound, "unknown method: " + method));
        }
      } catch (e) {
        logger?.error?.(PLUGIN_ID + ": " + method + " failed: " + String(e?.message ?? e));
        sendJson(res, 500, fail(ErrorCode.Internal, "internal error"));
      }
    }
  });
  logger?.info?.(PLUGIN_ID + ": route ready \u2014 " + API_PREFIX);
}
function handleEvents(req, res) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "x-accel-buffering": "no"
  });
  res.write("retry: 3000\n\n");
  res.write(`event: snapshot
data: ${JSON.stringify({ entries: snapshotEntries() })}

`);
  sseClients.add(res);
  req.on("close", () => {
    sseClients.delete(res);
  });
  req.on("error", () => {
    sseClients.delete(res);
  });
}
function readJsonBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (c) => {
      total += c.length;
      if (total > MAX_BODY) {
        reject(new Error("too-large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolveBody({});
        return;
      }
      let text = Buffer.concat(chunks).toString("utf8");
      if (text.charCodeAt(0) === 65279) text = text.slice(1);
      try {
        resolveBody(text ? JSON.parse(text) : {});
      } catch {
        reject(new Error("bad-json"));
      }
    });
    req.on("error", reject);
  });
}
export {
  apply,
  inject
};
