/* eslint-disable-next-line */
'use client';
import cn from 'classnames';
import { ComponentRef, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { type Config } from 'react-player/types';

import VideoControl from './video-control';
import VideoFrame from './video-frame';
import VideoPlayerWrapper from '../video-player-wrapper';

export interface YoutubeProps {
  id: string;
  src?: string;
  title: string;
  poster?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  loading?: 'lazy' | 'eager';
  frame?: boolean;
}

type ReactPlayerRef = ComponentRef<typeof ReactPlayer>;

export function Youtube({
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
}: YoutubeProps) {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const ref = useRef<ReactPlayerRef | null>(null);

  if (!width) {
    width = 944;
  }

  if (!height) {
    height = 531;
  }

  const opts: Config = {
    youtube: {
      color: 'white',
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

  //debugger;

  return (
    <VideoPlayerWrapper handlePlay={handlePlay} handlePause={handlePause} handleReplay={handleReplay}>
      <div className={cn('aspect-w-16 aspect-h-9 relative z-20 overflow-hidden')}>
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
              onPlay={handlePlay}
              controls={controls}
              className={'absolute z-10 min-h-full w-auto min-w-full max-w-none'}
            />
          )}
          {!autoplay && (
            <VideoControl
              handlePlay={play}
              title={title}
              poster={poster}
              loading={loading}
              width={width}
              height={height}
            />
          )}
        </VideoFrame>
      </div>
    </VideoPlayerWrapper>
  );
}

export default Youtube;
