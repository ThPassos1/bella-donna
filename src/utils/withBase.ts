/** Prefixa paths com o base do Vite (necessário no GitHub Pages). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!path || path === "/") return base || "/";
  if (path.startsWith("#")) return `${base}/${path}`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Resolve URL de asset local ou externo (imagens, etc.). */
export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (base && (path === base || path.startsWith(`${base}/`))) return path;

  return withBase(path);
}
