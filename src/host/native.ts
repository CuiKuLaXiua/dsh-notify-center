// Windows 原生通知 + 任务栏闪烁（宿主侧，PowerShell 子进程，零运行时依赖）。
//
// - showDesktopToast：System.Windows.Forms.NotifyIcon 气球提示，出现在桌面右下角
//   （任务栏托盘上方），无需 AUMID / 打包标识，Windows 10/11 开箱即用；
// - flashTaskbar：FlashWindowEx 闪烁桌面端主窗口。注意桌面端宿主运行在 web 服务
//   进程（通常没有主窗口），所以脚本会按进程名回退到拥有主窗口的 Electron 主进程。
//
// 安全：子进程环境变量仅保留白名单字段，剔除 KEY/SECRET/TOKEN/PASSWORD 等敏感值；
// 通知内容经环境变量传递，避免 PowerShell 命令注入。
import { spawn } from "node:child_process";

const PS =
  typeof process.env.SystemRoot === "string" && process.env.SystemRoot
    ? process.env.SystemRoot + "\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
    : "powershell.exe";

/** 清洗后的环境变量：只保留与凭据无关的键。 */
function cleanEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const key of Object.keys(process.env)) {
    if (/KEY|SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIAL|API[-_]?KEY/i.test(key)) continue;
    const value = process.env[key];
    if (value !== undefined) env[key] = value;
  }
  return env;
}

/** 后台静默执行 PowerShell（不等待、不捕获输出；失败静默）。 */
function run(script: string, extraEnv: Record<string, string> = {}): void {
  try {
    const child = spawn(
      PS,
      ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-STA", "-Command", script],
      {
        windowsHide: true,
        stdio: "ignore",
        env: { ...cleanEnv(), ...extraEnv },
      },
    );
    child.on("error", () => {});
  } catch {
    /* 忽略：通知是尽力而为的增强，不影响主流程 */
  }
}

/** 桌面右下角原生气球通知。 */
export function showDesktopToast(
  title: string,
  body: string,
  kind: "reply" | "question" | "approval" | "error" | "goal",
): void {
  const icon =
    kind === "error" ? "Error" : kind === "question" || kind === "approval" ? "Warning" : "Info";
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
    "}",
  ].join("\n");
  run(script, { DNH_TITLE: title, DNH_BODY: body });
}

/** 任务栏闪烁（FLASHW_ALL | FLASHW_TIMERNOFG = 0x0F，闪到窗口聚焦为止）。
 *
 * 桌面端宿主运行在 web 服务进程（process.pid 通常没有主窗口），因此脚本先尝试
 * 当前进程，若 MainWindowHandle 为 0，则按进程名回退到第一个有主窗口的实例。
 */
export function flashTaskbar(): void {
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
    // 先尝试当前进程；若没有主窗口，回退到同名进程中第一个有主窗口的实例
    "$proc = Get-Process -Id $env:DNH_PID -ErrorAction SilentlyContinue",
    "if ($null -eq $proc -or $proc.MainWindowHandle -eq 0) {",
    "  $proc = Get-Process -Name $env:DNH_PROC_NAME -ErrorAction SilentlyContinue |",
    "    Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1",
    "}",
    "if ($null -eq $proc -or $proc.MainWindowHandle -eq 0) { exit }",
    "$hwnd = $proc.MainWindowHandle",
    "$w = New-Object 'DshFlashUtil+FLASHWINFO'",
    "$w.cbSize = [System.Runtime.InteropServices.Marshal]::SizeOf($w)",
    "$w.hwnd = $hwnd",
    "$w.dwFlags = 15",
    "$w.uCount = 0",
    "$w.dwTimeout = 0",
    "[DshFlashUtil]::FlashWindowEx([ref]$w) | Out-Null",
  ].join("\n");
  run(script, { DNH_PID: String(process.pid), DNH_PROC_NAME: "DeepSeek Harness" });
}