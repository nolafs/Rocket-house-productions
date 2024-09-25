'use client';
import * as THREE from 'three';
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  CameraControls,
  Html,
  PerformanceMonitor,
  Preload,
  Sky,
  SoftShadows,
  StatsGl,
  useProgress,
} from '@react-three/drei';
import { Landscape } from './course-scene/landscape';
import { CameraController } from './course-scene/camera-control';
import { Course } from '@prisma/client';
import Clouds from './course-scene/cloud-scene';
import { Loader2 } from 'lucide-react';
import { CloudCover } from './course-scene/cloud-cover';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { LessonButton } from './course-scene/course.types';
import { useCourseProgressionStore } from '@rocket-house-productions/providers';

gsap.registerPlugin(SplitText);

interface CourseNavigationProps {
  course: Course & { modules: any[] };
  purchaseType?: string | null;
  onLoaded?: (loaded: boolean) => void;
}

const LESSON_SPACING = 7;

export function CourseNavigation({ course, onLoaded, purchaseType = null }: CourseNavigationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const courseProgression = useCourseProgressionStore(store => store.getCourseProgress(course.id));
  const [lesson, setLesson] = React.useState<LessonButton | null>(null);
  const router = useRouter();

  useGSAP(
    () => {
      gsap.set('.lesson-load', { autoAlpha: 0 });

      if (lesson !== null) {
        const lessonName = new SplitText('.lesson-name', { type: 'chars' });
        const chars = lessonName.chars;

        const tl = gsap.timeline({
          onComplete: () => {
            router.push(`/courses/${course.slug}/modules/${lesson.moduleSlug}/lessons/${lesson.slug}`);
          },
        });
        tl.fromTo('.lesson-load', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

        tl.from(chars, {
          duration: 0.8,
          opacity: 0,
          scale: 0,
          y: 80,
          rotationX: 180,
          transformOrigin: '0% 50% -50',
          ease: 'back',
          stagger: 0.01,
        });

        tl.fromTo('.lesson-num', { autoAlpha: 0, y: -100 }, { autoAlpha: 1, y: 0, duration: 0.2 });
        tl.fromTo('.lesson-loader', { autoAlpha: 0, y: 100 }, { autoAlpha: 1, y: 0, duration: 0.2 }, '-=0.2');
      }
    },
    { scope: containerRef, dependencies: [lesson] },
  );

  const handleLoaded = (load: boolean) => {
    onLoaded && onLoaded(load);
  };

  const handleOpenLesson = (lesson: LessonButton) => {
    setLesson(lesson);
  };

  return (
    <div ref={containerRef} className={'relative h-screen w-full'}>
      <div
        className={
          'lesson-load pointer-events-none fixed z-20 flex h-screen w-full flex-col items-center justify-center bg-amber-600 p-5 opacity-0'
        }
        style={{ backgroundColor: lesson?.color }}>
        <div className={'lesson-num font-lesson-body text-xl font-bold text-white'}>Lesson {lesson?.num}</div>
        <div className={'lesson-name font-lesson-heading text-2xl text-white lg:text-4xl'}>{lesson?.name}</div>
        <div className={'lesson-loader mt-3'}>
          <Loader2 className={'mb-5 h-12 w-12 animate-spin text-white'} />
        </div>
      </div>

      <Canvas className={'fixed h-screen w-full'} shadows={true} camera={{ position: [0, 0, 130], fov: 15 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 10, 8]} intensity={4} castShadow></directionalLight>

          <Sky
            distance={900}
            sunPosition={[100, 0, -100]}
            mieDirectionalG={0.022}
            inclination={0.25}
            azimuth={0.45}
            turbidity={10}
            rayleigh={1}
          />

          {containerRef && (
            <Landscape
              lessonSpacing={LESSON_SPACING}
              courseCompleted={courseProgression === 100}
              position={[0, 0, 0]}
              container={containerRef}
              purchaseType={purchaseType}
              onOpenLesson={handleOpenLesson}
              modules={course.modules}
              onReady={load => handleLoaded(load)}
            />
          )}

          <group position={[0, 300, -300]}>
            <Clouds width={80} height={300} depth={300} numClouds={100} />
          </group>

          <CloudCover position={[0, 5, -30]} />

          <Preload />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress();

  return (
    <Html fullscreen>
      <div className={'z-50 flex h-screen w-full flex-col items-center justify-center'}>
        <div className={'flex flex-col items-center justify-center'}>
          <Loader2 className={'mb-5 h-12 w-12 animate-spin text-white'} />
          <div className={'font-lesson-heading w-full text-center text-white'}>{Math.round(progress)} %</div>
          <div className={'w-full text-center text-sm text-white'}>
            Item: {loaded} / {total}
          </div>
        </div>
      </div>
    </Html>
  );
}

export default CourseNavigation;
