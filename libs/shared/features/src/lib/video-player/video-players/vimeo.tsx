/* eslint-disable-next-line */
'use client';
import cn from 'classnames';
import { useRef, useState } from 'react';
import ReactPlayer, { Config, ReactPlayerProps } from 'react-player/lazy';
import VideoControl from './video-control';
import VideoFrame from './video-frame';
import VideoPlayerWrapper from '../video-player-wrapper';

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
  const ref = useRef<ReactPlayer>(null);

  const opts: Config = {
    vimeo: {
      title: title,
      playerOptions: {
        controls: controls,
        autoplay: autoplay,
        muted: autoplay ? true : false,
        loop: loop,
        playsinline: true,
        byline: false,
        vimeo_logo: false,
        dnt: true,
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
              ref={ref}
              id={id}
              url={src}
              config={opts}
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
