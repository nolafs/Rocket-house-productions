'use client';
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
  FunctionComponent,
} from 'react';

// UI Context

export type UIContextType = {
  trans1: () => { x: number; y: number };
  trans2: () => { x: number; y: number };
};

export const UIContext = createContext<UIContextType | undefined>(undefined);

// UI Context Provider

type TProps = {
  children: ReactNode;
};

export const UIProvider: FunctionComponent<TProps> = ({children}) => {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  const onMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    });
  }, []);

  const trans1 = useMemo(
    () => () => ({
      x: (mousePosition.x / 15) * -1,
      y: (mousePosition.y / 15) * -1,
    }),
    [mousePosition]
  );

  const trans2 = useMemo(
    () => () => ({
      x: mousePosition.x / 15,
      y: mousePosition.y / 15,
    }),
    [mousePosition]
  );

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  const value = useMemo(
    () => ({
      trans1,
      trans2,
    }),
    [trans1, trans2]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// UI Context Consumer hooks

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
