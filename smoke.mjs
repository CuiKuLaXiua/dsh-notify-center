// dsh-notify-center smoke 测试：校验构建产物结构（无需运行 dsh）。
// 运行：node smoke.mjs
import { readFileSync } from "node:fs";

const here = new URL(".", import.meta.url);

// 1) host 半可动态导入，且导出 inject + apply
const mod = await import(new URL("./lib/index.js", here).href);
if (!Array.isArray(mod.inject)) throw new Error("host inject 缺失");
if (!mod.inject.includes("webServer")) throw new Error("host inject 缺少 webServer");
if (typeof mod.apply !== "function") throw new Error("host apply 缺失");
console.log("  host lib/index.js OK (inject + apply)");

// 2) client 半是 ModuleLoader 闭包工厂且语法合法
const clientSrc = readFileSync(new URL("./lib/client.js", here), "utf8");
if (!clientSrc.startsWith('window.__ModuleLoader__.load({ id: "dsh-notify-center"')) {
  throw new Error("client bundle 头部不是 ModuleLoader 闭包工厂");
}
new Function(clientSrc);
for (const needle of ["shell.overlay", "settings.section", "dnc-stack"]) {
  if (!clientSrc.includes(needle)) throw new Error("client bundle 缺少 " + needle);
}
console.log("  client lib/client.js OK (ModuleLoader + slots)");
console.log("smoke OK");