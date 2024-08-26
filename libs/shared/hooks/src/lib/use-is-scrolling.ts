'use client';
import { useEffect, useState } from 'react';

export const useIsScrolling = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [notAtTop, setNotAtTop] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleScroll = () => {
    if (typeof window === 'undefined') return;

    setIsScrolling(true);
    setNotAtTop(window.scrollY > 0);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setIsScrolling(false);
    }, 200); // Adjust the timeout duration to suit your needs
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return { isScrolling, notAtTop };
};

export default useIsScrolling;
