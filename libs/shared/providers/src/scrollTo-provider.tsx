'use client';
import { createContext, FC, type ReactNode, useContext } from 'react';
import gsap from 'gsap';
import scrollTo from 'gsap/ScrollToPlugin';

gsap.registerPlugin(scrollTo);

interface ScrollToProviderContextType {
  scrollTo: (id: string) => void;
}

export const ScrollToProviderContext = createContext<ScrollToProviderContextType | null>(null);

export const ScrollToProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const scrollTo = (id: string) => {
    if (typeof window !== 'undefined') {
      gsap.to(window, { duration: 2, scrollTo: `#${id}` });
    }
  };

  return <ScrollToProviderContext.Provider value={{ scrollTo }}>{children}</ScrollToProviderContext.Provider>;
};

export const useScrollTo = (): ScrollToProviderContextType => {
  const context = useContext(ScrollToProviderContext);
  if (!context) {
    throw new Error('useScrollTo must be used within a ScrollToProvider');
  }
  return context;
};
