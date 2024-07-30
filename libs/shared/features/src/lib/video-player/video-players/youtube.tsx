/* eslint-disable-next-line */
'use client';
import cn from 'classnames';
import { useReducer, useRef, useState } from 'react';
import ReactPlayer, { Config } from 'react-player/lazy';

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
  frame?: boolean;
}

export function Youtube({
  id,
  src,
  title,
  poster,
  autoplay,
  frame,
  controls = true,
  loop = false,
  width = 1920,
  height = 1200,
}: YoutubeProps) {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const ref = useRef<any>(null);

  if (!width) {
    width = 1920;
  }

  if (!height) {
    height = 1200;
  }

  const opts: Config = {
    youtube: {
      playerVars: {
        mute: autoplay ? 0 : 1,
        autoplay: autoplay ? 1 : 0,
        controls: controls ? 1 : 0,
        loop: loop ? 1 : 0,
        playsinline: 1,
      },
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
      <div className={cn('aspect-w-16 aspect-h-9 relative z-20 overflow-hidden')}>
        <VideoFrame active={frame}>
          {showPlayer && (
            <ReactPlayer
              width="100%"
              height="100%"
              playing={showPlayer}
              ref={ref}
              id={id}
              url={src}
              config={opts}
              onPlay={handlePlay}
              className={'absolute z-10 min-h-full w-auto min-w-full max-w-none'}
            />
          )}
          {!autoplay && (
            <VideoControl
              handlePlay={play}
              title={title}
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

export default Youtube;
