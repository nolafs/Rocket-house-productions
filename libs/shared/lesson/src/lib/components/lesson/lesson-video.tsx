'use client';
import { Child, Lesson } from '@prisma/client';
import { useEffect, useRef } from 'react';
import { SectionModule } from '@rocket-house-productions/types';
import { useLessonProgressionStore, useModuleProgressStore, usePointsStore } from '@rocket-house-productions/providers';
import useIsMounted from 'ismounted';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { RotateCcw } from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
  module: SectionModule;
  child: Child | null | undefined;
}

export function LessonVideo({ lesson, module }: LessonContentProps) {
  const isMounted = useIsMounted();
  const { setLessonProgress, setLessonComplete, getLessonProgress, getLessonDuration } = useLessonProgressionStore(
    store => store,
  );
  const { addPoints } = usePointsStore(store => store);
  const { calculateModuleProgress } = useModuleProgressStore(store => store);
  const videoId = lesson?.videoId;
  const videoLibId = lesson?.videoLibId;
  const ref = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any | null>(null);

  useEffect(() => {
    let playerMod: any;
    if (!ref.current && !isMounted.current) return;
    (async () => {
      const m = await import('player.js'); // loaded only in browser
      if (!ref.current && !isMounted.current) return;
      playerMod = m.default || m;
      const player = new playerMod.Player(ref.current);

      player.on('ready', () => {
        playerRef.current = player;

        if (getLessonProgress(lesson.id) > 0 && getLessonProgress(lesson.id) < 100) {
          const resumeTime = getLessonDuration(lesson.id).progressSeconds;
          setTimeout(() => {
            if (resumeTime) {
              player.setCurrentTime(resumeTime);
              player.play();
            }
          }, 1000);
          player.setCurrentTime(resumeTime);
        } else {
          player.play();
        }

        player.on('timeupdate', (progress: { seconds: number; duration: number }) => {
          const currentTime = Math.round((progress.seconds / progress.duration) * 100);
          if (lesson?.id) {
            setLessonProgress(lesson.id, currentTime, progress.seconds, progress.duration);
          }
        });

        player.on('ended', () => {
          setLessonComplete(lesson.id);
          addPoints(100);
          calculateModuleProgress(module?.id || '');
        });
      });
    })();
  }, [ref]);

  const handleReplay = () => {
    if (!playerRef.current) return;
    playerRef.current?.setCurrentTime(0);
    playerRef.current?.play();
  };

  return (
    <div>
      {videoId && (
        <div className={'video aspect-w-16 aspect-h-9 bg-lesson-background relative bg-slate-300'}>
          {getLessonProgress(lesson.id) === 100 && (
            <div className={'bg-secondary/80 absolute z-10 flex h-full w-full flex-col items-center justify-center'}>
              <div>
                <Button variant={'default'} size={'lg'} onClick={handleReplay}>
                  <RotateCcw className={'mr-2 h-5 w-5'} />
                  Replay
                </Button>
              </div>
            </div>
          )}

          <iframe
            title={'lesson-video'}
            ref={ref}
            src={`https://iframe.mediadelivery.net/embed/${videoLibId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
            loading="lazy"
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
            allowFullScreen={true}
          />
        </div>
      )}
    </div>
  );
}

export default LessonVideo;
