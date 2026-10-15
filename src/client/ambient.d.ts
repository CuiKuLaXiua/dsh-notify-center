// 最低限度环境类型（esbuild 不做类型检查，本文件仅为编辑器体验）。
// 与 git-studio 同策略：不放动态 require，避免被安全扫描误判。

declare module "react" {
  export function useState<S>(initial: S | (() => S)): [S, (v: S) => void];
  export function useEffect(fn: () => void | (() => void), deps?: unknown[]): void;
  export function useRef<T>(initial: T): { current: T };
  export function useSyncExternalStore<T>(
    subscribe: (fn: () => void) => () => void,
    getSnapshot: () => T,
  ): T;
}

declare module "react/jsx-runtime" {
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown;
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown;
  export const Fragment: unknown;
}

declare module "react-dom" {
  export function createPortal(children: unknown, container: Element | DocumentFragment): unknown;
}

declare namespace JSX {
  type Element = unknown;
  interface ElementChildrenAttribute {
    children: unknown;
  }
  interface IntrinsicElements {
    [elem: string]: unknown;
  }
  interface ElementAttributesProperty {
    props: unknown;
  }
}

// 浏览器全局（esbuild 不检查，这里仅为编辑器提示）
interface Window {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}