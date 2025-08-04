'use client';
/* eslint-disable-next-line */
import dynamic from 'next/dynamic';
import { NotificationBlock } from '@rocket-house-productions/ui';

export interface ContentVideoProps {
  id: string;
  provider_name: 'YouTube' | 'Vimeo';
  embed_url: string;
  provider_url?: any;
  title?: string;
  thumbnail_url?: any;
  loading?: 'lazy' | 'eager';
  image?: any;
  html: string;
  mode?: 'light' | 'dark';
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
}

// ✅ Move dynamic imports OUTSIDE the component
const Youtube = dynamic(() => import('./video-players/youtube'), { ssr: false });
const Vimeo = dynamic(() => import('./video-players/vimeo'), { ssr: false });

export function VideoPlayer({
  provider_name,
  loading,
  embed_url,
  title,
  image,
  id,
  width = 944,
  height = 531,
}: ContentVideoProps) {
  if (!embed_url) {
    return <NotificationBlock body={'No video source found'} type={'error'} />;
  }

  if (!provider_name) {
    return <NotificationBlock body={'No video type found'} type={'error'} />;
  }

  if (provider_name === 'YouTube') {
    return (
      <Youtube
        id={id}
        title={title || id}
        poster={image}
        src={embed_url}
        width={width}
        loading={loading}
        height={height}
      />
    );
  }

  if (provider_name === 'Vimeo') {
    return <Vimeo id={id} title={title || id} poster={image} loading={loading} src={embed_url} />;
  }

  return <div className={'block w-full p-5'}>Type is undefined</div>;
}

export default VideoPlayer;
