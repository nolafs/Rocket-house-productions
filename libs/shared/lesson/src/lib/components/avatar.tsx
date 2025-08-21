'use client';
import Image from 'next/image';
import bonsai from '../assets/bonsai.png';
import carpFish from '../assets/carp-fish.png';
import daruma from '../assets/daruma.png';
import samurai from '../assets/samurai_1.png';
import temple_1 from '../assets/temple_1.png';
import yukata from '../assets/yukata.png';
import kimono from '../assets/kimono_1.png';
import { cn } from '@rocket-house-productions/util';

const avatarOptions = [
  {
    name: 'kimono',
    image: kimono,
  },
  {
    name: 'bonsai',
    image: bonsai,
  },
  {
    name: 'carpFish',
    image: carpFish,
  },
  {
    name: 'daruma',
    image: daruma,
  },
  {
    name: 'samurai',
    image: samurai,
  },
  {
    name: 'temple_1',
    image: temple_1,
  },
  {
    name: 'yukata',
    image: yukata,
  },
];

interface AvatarProps {
  avatar: 'kimono' | 'bonsai' | 'carpFish' | 'daruma' | 'samurai' | 'temple_1' | 'yukata' | string | null | undefined;
  width?: number;
  height?: number;
  classNames?: string;
}

export function Avatar({ avatar, width = 64, height = 64, classNames = '' }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative isolate flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white',
        classNames,
      )}>
      <Image
        src={avatarOptions.find(option => option.name === avatar)?.image || kimono}
        alt={avatar || 'kimono'}
        width={60}
        height={60}
        quality={90}
        sizes={'(max-width: 600px) 220px, 100vw'}
        className={'h-[60px] w-[60px] rounded-full object-cover object-center'}
        loading={'lazy'}
      />
    </div>
  );
}

export default Avatar;
