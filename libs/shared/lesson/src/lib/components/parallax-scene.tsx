'use client';
import { ReactNode, useRef } from 'react';
import Image from 'next/image';
import Bg from '../assets/lessons-bg.webp';
import Mg from '../assets/lessons-mid.webp';
import Fg from '../assets/lessons-fore.webp';
import styles from './parallax-scene.module.scss';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@rocket-house-productions/util';

gsap.registerPlugin(useGSAP);

interface ParallaxSceneProps {
  children: ReactNode;
}

export function ParallaxScene({ children }: ParallaxSceneProps) {
  const container = useRef<any>();

  useGSAP(() => {
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
    <div className={cn(styles.grad, 'relative isolate h-svh max-h-svh w-full')}>
      <div className={'absolute inset-0 z-10 flex h-svh flex-col place-items-center justify-center'}>
        <div>{children}</div>
      </div>
      <div ref={container} className={styles.container}>
        <div className={styles.bg}>
          <Image src={Bg} alt="lesson" className={'h-full w-full object-cover object-center'} />
        </div>
        <div className={styles.mg}>
          <Image src={Mg} alt="lesson" className={'h-full w-full object-cover object-center'} />
        </div>
        <div className={styles.fg}>
          <Image src={Fg} alt="lesson" className={'h-full w-full object-cover object-center'} />
        </div>
      </div>
    </div>
  );
}

export default ParallaxScene;
