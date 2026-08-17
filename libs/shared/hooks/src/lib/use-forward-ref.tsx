'use client';
import type React from 'react';
import { useLayoutEffect, useRef } from 'react';

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = useRef<T>(null);

  useLayoutEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}
