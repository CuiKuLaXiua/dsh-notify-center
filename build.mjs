// dsh-notify-center 构建脚本
// 产物落入本包 lib/（ModuleLoader 双半结构）。
// 依赖策略：仅用 esbuild；优先用本包 node_modules，找不到则回退到
// D:/code/dsh-git-studio 或 D:/code/Zenith 的 node_modules（用户机器上的现成 esbuild）。
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// 输出目录可用环境变量 DNC_OUT_DIR 覆盖（绝对路径），默认 lib/
const outDir = process.env.DNC_OUT_DIR || join(here, "lib");
const PLUGIN_ID = "dsh-notify-center";

const require = createRequire(import.meta.url);

function loadEsbuild() {
  const candidates = [
    join(here, "node_modules", "esbuild"),
    "D:/code/dsh-git-studio/node_modules/esbuild",
    "D:/code/Zenith/node_modules/esbuild",
  ];
  for (const p of candidates) {
    try {
      return require(p);
    } catch {
      /* 尝试下一个 */
    }
  }
  throw new Error(
    "esbuild 未找到。请先运行 npm install，或确认 esbuild 存在于 D:/code/dsh-git-studio 或 D:/code/Zenith 的 node_modules。",
  );
}

const esbuild = loadEsbuild();

// ── host 半：ESM，平台 node ──
await esbuild.build({
  entryPoints: [join(here, "src", "host", "index.ts")],
  outfile: join(outDir, "index.js"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  sourcemap: false,
  legalComments: "none",
  logLevel: "warning",
});

// ── client 半：CJS 闭包工厂，平台 browser ──
const CLIENT_EXTERNALS = [
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "@deepseek-ai/dsh-client-ui-primitives",
];

await esbuild.build({
  entryPoints: [join(here, "src", "client", "index.tsx")],
  outfile: join(outDir, "client.js"),
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: ["es2020"],
  external: CLIENT_EXTERNALS,
  jsx: "automatic",
  sourcemap: false,
  legalComments: "none",
  logLevel: "warning",
  banner: {
    js:
      'window.__ModuleLoader__.load({ id: "' + PLUGIN_ID + '", factory: function (require) {\n' +
      'var module = { exports: {} }; var exports = module.exports;\n' +
      'Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });',
  },
  footer: { js: "\nreturn module.exports;\n} });" },
});

// ── 产物自检 ──
const clientSrc = readFileSync(join(outDir, "client.js"), "utf8");
if (!clientSrc.startsWith('window.__ModuleLoader__.load({ id: "' + PLUGIN_ID + '"')) {
  throw new Error("client bundle 头部不是 ModuleLoader 闭包工厂");
}
try {
  new Function(clientSrc);
} catch (e) {
  throw new Error("client bundle 语法校验失败: " + (e && e.message));
}
for (const needle of [
  "shell.overlay",
  "conversation.session.header.utilities",
  "settings.section",
  "dnc-stack",
  "/dsh-notify/api/events",
]) {
  if (!clientSrc.includes(needle)) throw new Error("client bundle 缺少注册面: " + needle);
}
for (const name of ["index.js", "client.js"]) {
  const size = readFileSync(join(outDir, name)).length;
  console.log("  lib/" + name + "  " + (size / 1024).toFixed(1) + " KB");
}
console.log("dsh-notify-center build -> lib/ OK");