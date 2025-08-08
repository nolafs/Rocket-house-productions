'use client';
import { ReactNode, useRef } from 'react';
import Image from 'next/image';
import styles from './parallax-scene.module.scss';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@rocket-house-productions/util';

gsap.registerPlugin(useGSAP);

interface ParallaxSceneProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxScene({ children, className }: ParallaxSceneProps) {
  const container = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    //check if window is defined
    if (typeof window === 'undefined') {
      return;
    }

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    window.addEventListener('mousemove', e => {
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const tiltx = dy / cy;
      const tilty = -(dx / cx);
      const radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
      const degree = radius * 12;
      gsap.to(container.current, 1, {
        rotationX: tiltx * 2,
        rotationY: tilty * 2,
        ease: 'power2',
      });
    });
  }, [container]);

  return (
    <div className={cn(styles.grad, 'relative h-screen w-full overflow-hidden')}>
      <div className={'absolute inset-0 z-10 flex h-dvh flex-col items-center justify-center overflow-hidden'}>
        <main
          className={cn(
            'mb:pb-5 flex min-h-svh flex-col place-items-center overflow-y-auto px-5 pt-24 md:justify-center md:pt-5 lg:px-8',
            className,
          )}>
          {children}
        </main>
      </div>
      <div ref={container} className={styles.container}>
        <div className={styles.bg}>
          <Image
            src={'/images/course/lessons-bg.webp'}
            alt="lesson"
            width={1792}
            height={1024}
            className={'h-full w-full object-cover object-center'}
          />
        </div>
        <div className={styles.mg}>
          <Image
            src={'/images/course/lessons-mid.webp'}
            alt="lesson"
            width={1792}
            height={1024}
            className={'h-full w-full object-cover object-center'}
          />
        </div>
        <div className={styles.fg}>
          <Image
            src={'/images/course/lessons-fore.webp'}
            alt="lesson"
            width={1792}
            height={1024}
            className={'h-full w-full object-cover object-center'}
          />
        </div>
      </div>
    </div>
  );
}

export default ParallaxScene;
