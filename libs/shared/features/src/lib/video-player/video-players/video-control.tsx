'use client';
import Image from 'next/image';

import placeholder_white from '../assets/placeholder-white.png';
import placeholder from '../assets/placeholder.png';
import { useState } from 'react';
import cn from 'classnames';
import { PrismicNextImage } from '@prismicio/next';

/* eslint-disable-next-line */
export interface VideoControlProps {
  handlePlay: () => void;
  poster?: any;
  width?: number;
  height?: number;
  title: string;
  mode?: 'light' | 'dark';
}

export function VideoControl({ poster, handlePlay, width, height, title, mode }: VideoControlProps) {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  const play = () => {
    setShowPlayer(true);
    handlePlay();
  };

  return (
    <button onClick={play} className={cn(showPlayer ? 'hidden' : 'block')}>
      <div className={'fill-secondary absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center'}>
        <div className={'flex h-16 w-16 items-center justify-center rounded-full bg-white shadow'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.5 11.13L5.50001 3.04999C5.34799 2.96222 5.17554 2.91602 5.00001 2.91602C4.82447 2.91602 4.65203 2.96222 4.50001 3.04999C4.3474 3.13809 4.22079 3.26496 4.13299 3.41774C4.04518 3.57051 3.99931 3.74378 4.00001 3.91999V20.08C3.99931 20.2562 4.04518 20.4295 4.13299 20.5822C4.22079 20.735 4.3474 20.8619 4.50001 20.95C4.65203 21.0378 4.82447 21.084 5.00001 21.084C5.17554 21.084 5.34799 21.0378 5.50001 20.95L19.5 12.87C19.6539 12.7828 19.7819 12.6563 19.871 12.5035C19.96 12.3506 20.007 12.1769 20.007 12C20.007 11.8231 19.96 11.6494 19.871 11.4965C19.7819 11.3437 19.6539 11.2172 19.5 11.13ZM6.00001 18.35V5.64999L17 12L6.00001 18.35Z"
              fill="#2C67DC"
            />
          </svg>
        </div>
      </div>
      {poster ? (
        <PrismicNextImage
          field={poster}
          width={944}
          height={531}
          alt=""
          className={'z-10 h-auto w-full object-fill'}
          imgixParams={{ fit: 'fill' }}
        />
      ) : (
        <Image width={width} height={height} loading={'lazy'} src={placeholder} quality={80} alt={title} />
      )}
    </button>
  );
}

export default VideoControl;
