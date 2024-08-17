'use client';

import ReactPlayer from 'react-player';
import { Lesson } from '@prisma/client';

interface LessonContentProps {
  lesson: Lesson | null | undefined;
}

export function LessonContent({ lesson }: LessonContentProps) {
  const videoId = lesson?.videoId;

  return (
    videoId && (
      <div className={'video aspect-w-16 aspect-h-9 relative mb-5'}>
        <ReactPlayer
          url={`https://${process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_HOSTNAME}/${lesson.videoId}/playlist.m3u8`}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    )
  );
}

export default LessonContent;
