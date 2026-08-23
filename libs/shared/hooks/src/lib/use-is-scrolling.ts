'use client';
import { useEffect, useRef, useState } from 'react';

export const useIsScrolling = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [notAtTop, setNotAtTop] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setNotAtTop(window.scrollY > 0);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isScrolling, notAtTop };
};

export default useIsScrolling;
