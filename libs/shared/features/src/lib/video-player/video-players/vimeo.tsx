/* eslint-disable-next-line */
'use client';
import cn from 'classnames';
import { ComponentRef, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import { type Config } from 'react-player/types';
import VideoControl from './video-control';
import VideoFrame from './video-frame';
import VideoPlayerWrapper from '../video-player-wrapper';

type ReactPlayerRef = ComponentRef<typeof ReactPlayer>;

export interface VimeoProps {
  id: string;
  src?: string;
  title: string;
  poster?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loading?: 'lazy' | 'eager';
  loop?: boolean;
  frame?: boolean;
  standard?: boolean;
}

export function Vimeo({
  id,
  src,
  title,
  poster,
  autoplay,
  frame,
  controls = true,
  loop = false,
  loading = 'lazy',
  width = 1920,
  height = 1200,
  standard = true,
}: VimeoProps) {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const ref = useRef<ReactPlayerRef | null>(null);

  const opts: Config = {
    vimeo: {
      vimeo_logo: false,
      byline: false,
      dnt: true,
    },
  };

  const handlePlay = () => {
    if (autoplay) {
      setShowPlayer(true);
    }
  };

  const handlePause = () => {
    setShowPlayer(false);
  };

  const handleReplay = () => {
    if (autoplay) {
      setShowPlayer(true);
    }
  };

  const play = () => {
    setShowPlayer(true);
  };

  return (
    <VideoPlayerWrapper handlePlay={handlePlay} handlePause={handlePause} handleReplay={handleReplay}>
      <div
        className={cn(
          'bg-neutral aspect-w-16 aspect-h-9 relative z-20 h-full w-full overflow-hidden',
          showPlayer ? 'display opacity-100' : 'hidden opacity-0',
        )}>
        <VideoFrame active={frame}>
          {showPlayer && (
            <ReactPlayer
              width="100%"
              height="100%"
              playing={showPlayer}
              muted={autoplay}
              ref={ref}
              light={poster}
              id={id}
              src={src}
              loop={loop}
              config={opts}
              playsInline={true}
              controls={controls}
              className={'h-full w-full object-cover object-center'}
              onPlay={handlePlay}></ReactPlayer>
          )}

          {!autoplay && (
            <VideoControl
              handlePlay={play}
              title={title}
              loading={loading}
              poster={poster && `${poster}?fm=webp&w=${width}&h=${height}&fit=fill`}
              width={width}
              height={height}
            />
          )}
        </VideoFrame>
      </div>
    </VideoPlayerWrapper>
  );
}

export default Vimeo;
