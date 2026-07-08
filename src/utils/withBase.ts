/** Prefixa paths com o base do Vite (necessário no GitHub Pages). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!path || path === "/") return base || "/";
  if (path.startsWith("#")) return `${base}/${path}`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
