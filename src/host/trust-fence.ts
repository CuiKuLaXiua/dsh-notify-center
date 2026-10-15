// 信任围栏：照 dsh-git-studio / 生态 trust-fence 语义实现。
// 三重校验，任一不过即拒：
//   1) Host 头必须为回环地址或显式信任列表成员（防 DNS rebinding）
//   2) sec-fetch-site: cross-site 拒绝
//   3) Origin 若存在：hostname 必须与 Host 的 hostname 一致
//      —— 按 hostname 而非 host:port 比较：Edge 151 对非默认端口回环 Origin
//      序列化不带端口，按 host:port 比较会把所有路由砖死（生态实测教训）。
export function isTrustedApiRequest(req: any, trustedHosts?: string[]): boolean {
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

function classifyHost(host: string): { hostname: string; isLoopback: boolean } {
  let hostname = host;
  const bracket = host.indexOf("]");
  if (bracket !== -1) {
    hostname = host.slice(0, bracket + 1);
  } else {
    const colon = host.lastIndexOf(":");
    // 仅在恰有一个冒号时视为 host:port（裸 IPv6 无端口场景不受支持，RFC 要求方括号）
    if (colon !== -1 && host.indexOf(":") === colon) hostname = host.slice(0, colon);
  }
  hostname = hostname.replace(/^\[/, "").replace(/\]$/, "");
  const isLoopback = hostname === "127.0.0.1" || hostname === "::1" || hostname === "localhost";
  return { hostname, isLoopback };
}