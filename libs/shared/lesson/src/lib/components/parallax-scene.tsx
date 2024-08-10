import { ReactNode } from 'react';
import Image from 'next/image';
import Bg from '../assets/bg-scene.png';

interface ParallaxSceneProps {
  children: ReactNode;
}

export function ParallaxScene({ children }: ParallaxSceneProps) {
  return (
    <div className={'h-svh max-h-svh w-full'}>
      <div className={'absolute inset-0 isolate flex h-svh flex-col place-items-center justify-center'}>
        <div>{children}</div>
      </div>
      <Image src={Bg} alt="lesson" className={'h-full w-full object-cover object-center'} />
    </div>
  );
}

export default ParallaxScene;
