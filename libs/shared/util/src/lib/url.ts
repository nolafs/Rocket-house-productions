// utils/url.ts
export function currentFullPath(pathname: string, sp: URLSearchParams, hash?: string) {
  const query = sp.toString();
  return pathname + (query ? `?${query}` : '') + (hash ?? '');
}

export function sanitizeReturnTo(rt: string | null): string {
  // prevent external redirects
  if (!rt || !rt.startsWith('/')) return '/';
  return rt;
}
