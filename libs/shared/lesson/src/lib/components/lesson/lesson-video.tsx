'use client';
import { Child, Lesson } from '@prisma/client';
import playerjs from 'player.js';
import { useEffect, useRef, useState } from 'react';
import { SectionModule } from '@rocket-house-productions/types';
import {
  useLessonProgressionStore,
  useModuleProgressStore,
  usePointsStore,
  useScrollTo,
} from '@rocket-house-productions/providers';
import useIsMounted from 'ismounted';

interface LessonContentProps {
  lesson: Lesson;
  module: SectionModule;
  child: Child | null | undefined;
}

export function LessonVideo({ lesson, module }: LessonContentProps) {
  const isMounted = useIsMounted();
  const { scrollTo } = useScrollTo();
  const { setLessonProgress, setLessonComplete } = useLessonProgressionStore(store => store);
  const { addPoints } = usePointsStore(store => store);
  const { calculateModuleProgress } = useModuleProgressStore(store => store);
  const videoId = lesson?.videoId;
  const videoLibId = lesson?.videoLibId;
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!ref.current && !isMounted.current) return;

    let player = new playerjs.Player(ref.current);

    player.on('ready', () => {
      player.play();
    });

    player.on('timeupdate', (progress: { seconds: number; duration: number }) => {
      const currentTime = Math.round((progress.seconds / progress.duration) * 100);
      if (lesson?.id) {
        setLessonProgress(lesson.id, currentTime);
      }
    });

    player.on('ended', () => {
      setLessonComplete(lesson.id);
      addPoints(100 || 0);
      calculateModuleProgress(module?.id || '');
      if (!isMounted.current) return;
      scrollTo('continue');
    });

    return () => {
      player.off('ready');
      player = null;
    };
  }, [ref]);

  return (
    <>
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
