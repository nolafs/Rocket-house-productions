/* eslint-disable-next-line */
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ReactNode, useRef, useState } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface VideoProps {
  children: ReactNode;
  handlePlay: () => void;
  handlePause: () => void;
  handleReplay: () => void;
}

export function VideoPlayerWrapper({ children, handlePlay, handlePause, handleReplay }: VideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      //check if target is defined
      if (!ref.current) {
        console.error('VideoPlayerWrapper: ref.current is null');
        return;
      }

      gsap.fromTo(
        '.video',
        { opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            //toggleActions: 'play pause resume reset',
            //markers: true,
            trigger: ref.current,
            start: 'top 70%',
            end: 'bottom 30%',
            onEnter: () => {
              setReady(true);
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
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={'relative'}>
      <div className={'video'}>{children}</div>
    </div>
  );
}

export default VideoPlayerWrapper;
