'use client';

import { Child, Lesson } from '@prisma/client';

import playerjs from 'player.js';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { ArrowBigLeftIcon } from 'lucide-react';
import { LessonProgressBar } from '@rocket-house-productions/lesson';
import { SectionModule } from '@rocket-house-productions/types';
import { useLessonProgressionStore, useModuleProgressStore, usePointsStore } from '@rocket-house-productions/providers';

interface LessonContentProps {
  lesson: Lesson | null | undefined;
  module: SectionModule | null | undefined;
  child: Child | null | undefined;
}

export function LessonVideo({ lesson, module }: LessonContentProps) {
  const { setLessonProgress } = useLessonProgressionStore(store => store);
  const { addPoints } = usePointsStore(store => store);
  const { calculateModuleProgress } = useModuleProgressStore(store => store);
  const videoId = lesson?.videoId;
  const videoLibId = lesson?.videoLibId;
  const ref = useRef<HTMLIFrameElement>(null);
  const [video, setVideo] = useState<any>(null);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const player = new playerjs.Player(ref.current);

    player.on('ready', (video: any) => {
      player.play();
      setVideo(player);
      setTotalTime(player.getDuration());
    });

    player.on('play', () => console.log('play'));
    player.on('pause', () => console.log('pause'));
  }, [ref]);

  useEffect(() => {
    if (video !== null) {
      video.on('timeupdate', (progress: any) => {
        const currentTime = Math.round((progress.seconds / progress.duration) * 100);
        setCurrentProgress(currentTime);
        if (lesson?.id) {
          setLessonProgress(lesson.id, currentTime);
        }
      });

      video.on('ended', () => {
        setCompleted(true);
        // set score via CMS
        addPoints(100 || 0);
        calculateModuleProgress(module?.id || '');
      });
    }
  }, [video]);

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <Link href={'/courses'} className={cn(buttonVariants({ variant: 'lesson' }))}>
          <i>
            <ArrowBigLeftIcon className={'h-4 w-4'} />{' '}
          </i>{' '}
          Back
        </Link>

        <LessonProgressBar currentProgress={currentProgress} />
      </div>

      <div>
        {videoId && (
          <div className={'video aspect-w-16 aspect-h-9 bg-lesson-background relative'}>
            <iframe
              ref={ref}
              src={`https://iframe.mediadelivery.net/embed/${videoLibId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
              loading="lazy"
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
              allowFullScreen={true}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default LessonVideo;
