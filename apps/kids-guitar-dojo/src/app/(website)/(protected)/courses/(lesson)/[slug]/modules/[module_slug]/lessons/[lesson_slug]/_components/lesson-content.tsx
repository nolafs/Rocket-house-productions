'use client';

import { Child, Lesson } from '@prisma/client';

import playerjs from 'player.js';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { ArrowBigLeftIcon } from 'lucide-react';
import { LessonProgressBar } from '@rocket-house-productions/lesson';
import { Section } from '../page';

interface LessonContentProps {
  lesson: Lesson | null | undefined;
  module: Section | null | undefined;
  child: Child | null | undefined;
}

export function LessonContent({ lesson, module, child }: LessonContentProps) {
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
        setCurrentProgress((progress.seconds / progress.duration) * 100);
      });

      video.on('ended', () => {
        setCompleted(true);
      });
    }
  }, [video]);

  const currentLessonNum = lesson?.position || 0;
  const nextLesson =
    (module?.lessons?.length !== currentLessonNum + 1 && module?.lessons?.[currentLessonNum + 1]) || null;

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

      <h1 className={'heading flex flex-col pt-10 font-bold'}>
        <small className={'text-pink-500 lg:text-xl'}>Lesson {currentLessonNum + 1}</small>
        <span className={'text-2xl lg:text-4xl'}>{lesson?.title}</span>
      </h1>
      <div className={'prose prose-sm md:prose-md lg:prose-lg max-w-5xl'}>
        {lesson?.description && <div dangerouslySetInnerHTML={{ __html: lesson?.description }}></div>}
      </div>
      {nextLesson && (
        <div
          id={'continue'}
          className="relative flex w-full items-center justify-between rounded-md border border-pink-500 p-10">
          <div className={'font-bold'}>
            <span className={'text-pink-500'}>Next Lesson:</span> <span>{nextLesson.title}</span>
          </div>
          <div>
            <Button variant={'lesson'} size={'lg'}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default LessonContent;
