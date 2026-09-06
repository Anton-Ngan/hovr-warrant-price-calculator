/** Prefix API paths. Empty in local Vite (proxy). Set VITE_API_URL on Vercel. */
export function apiUrl(path: string): string {
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
    return `${base.replace(/\/$/, "")}${path}`;  // .replace avoids https://api.example.com/ + /api/history becoming a double slash
  }