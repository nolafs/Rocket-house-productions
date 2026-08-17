'use client';

import { useSyncExternalStore } from 'react';

export function useClientMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    callback => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}
