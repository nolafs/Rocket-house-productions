'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { type ReactNode, useRef, useState, useEffect } from 'react';

export interface VideoProps {
  children: ReactNode;
  handlePlay: () => void;
  handlePause: () => void;
  handleReplay: () => void;
}

export function VideoPlayerWrapper({ children, handlePlay, handlePause, handleReplay }: VideoProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrollTriggerReady, setScrollTriggerReady] = useState(false);
  // Use a generic type for ScrollTrigger instance reference (unknown until loaded)
  const scrollTriggerRef = useRef<{
    getById?: (id: string) => { kill: () => void } | undefined;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    if (typeof window === 'undefined') return;
    (async () => {
      const mod = await import('gsap/ScrollTrigger');
      if (!mounted) return;
      scrollTriggerRef.current = mod.ScrollTrigger;
      gsap.registerPlugin(mod.ScrollTrigger);
      setScrollTriggerReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!scrollTriggerReady) return; // wait until ScrollTrigger is loaded
      if (!ref.current) return;
      if (typeof document === 'undefined' || !document.querySelector('.video')) return;

      gsap.fromTo(
        '.video',
        { opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            end: 'bottom 30%',
            markers: false,
            onEnter: () => {
              handlePlay();
            },
            onEnterBack: () => {
              handleReplay();
            },
            onLeave: () => {
              handlePause();
            },
            onLeaveBack: () => {
              handlePlay();
            },
          },
        },
      );

      return () => {
        gsap.killTweensOf('.video');
        const id = ref.current?.id;
        if (id && scrollTriggerRef.current?.getById) {
          scrollTriggerRef.current.getById(id)?.kill();
        }
      };
    },
    { scope: ref, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={ref} className={'relative bg-black'}>
      {children}
    </div>
  );
}

export default VideoPlayerWrapper;
