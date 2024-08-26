'use client';
import { createContext, FC, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import scrollTo from 'gsap/ScrollToPlugin';
import useIsMounted from 'ismounted';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(scrollTo);
gsap.registerPlugin(useGSAP);

interface ScrollToProviderContextType {
  scrollTo: (id: string) => void;
}

export const ScrollToProviderContext = createContext<ScrollToProviderContextType | null>(null);

export const ScrollToProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const isMounted = useIsMounted();
  const [_window, setWindowObject] = useState<null | Window>(null);
  const [scrollTo, setScrollTo] = useState<string | null>(null);
  const container = useRef<any>();

  const scrollToFunction = (id: string) => {
    if (typeof window !== 'undefined') {
      setScrollTo(id);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowObject(window);
    }
  }, []);

  useGSAP(
    () => {
      if (isMounted.current && _window && scrollTo) {
        if (typeof _window !== 'undefined') {
          gsap.to(_window, { duration: 2, scrollTo: `#${scrollTo}` });
        }
      }
    },
    { scope: container, dependencies: [scrollTo] },
  );

  return (
    <ScrollToProviderContext.Provider value={{ scrollTo: scrollToFunction }}>
      <div ref={container}>{children}</div>
    </ScrollToProviderContext.Provider>
  );
};

export const useScrollTo = (): ScrollToProviderContextType => {
  const context = useContext(ScrollToProviderContext);

  if (!context) {
    throw new Error('useScrollTo must be used within a ScrollToProvider');
  }
  return context;
};
