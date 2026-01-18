'use client';
import * as THREE from 'three';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { SoftShadows } from '@react-three/drei';
import { type Course, type BookScene, type Module } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { useCourseProgressionStore, useLessonProgressionStore } from '@rocket-house-productions/providers';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { ModuleButtonDisplay, ModuleButtonPosition } from './course-scene/module-path';
import { useClientMediaQuery } from '@rocket-house-productions/hooks';
import { LessonButton, LessonType, ModulePosition } from './course-scene/course.types';
import dynamic from 'next/dynamic';
import { logger } from '@rocket-house-productions/util';

const Landscape = dynamic(() => import('./course-scene/landscape').then(mod => mod.Landscape), {
  ssr: false,
});

const CloudCover = dynamic(() => import('./course-scene/cloud-cover').then(mod => mod.CloudCover), {
  ssr: false,
});

const Clouds = dynamic(() => import('./course-scene/cloud-scene').then(mod => mod.Clouds), {
  ssr: false,
});

const SafeCourseNavigation = dynamic(
  () => import('../../util/three-error-boundary').then(mod => mod.SafeCourseNavigation),
  {
    ssr: false,
  },
);

const SafeSkyBox = dynamic(() => import('../../util/three-error-boundary').then(mod => mod.SafeSkyBox), {
  ssr: false,
});

const SafeModuleAwards = dynamic(() => import('../../util/three-error-boundary').then(mod => mod.SafeModuleAwards), {
  ssr: false,
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

interface CourseNavigationProps {
  course: Course & { modules: any[]; bookScene?: BookScene };
  purchaseType?: string | null;
  onLoaded?: (loaded: boolean) => void;
}

const LESSON_SPACING = 7;

export function CourseNavigation({ course, onLoaded, purchaseType = null }: CourseNavigationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const courseState = useCourseProgressionStore(store => store);
  const lessonState = useLessonProgressionStore(store => store);
  const repairAttemptedRef = useRef(false);

  const [lesson, setLesson] = useState<LessonButton | null>(null);

  const router = useRouter();
  const zoomControlRef = useRef<{ handleZoom: (dir: number) => void; handleReset: () => void } | null>(null);
  const isMobile = useClientMediaQuery('(max-width: 600px)');

  const courseProgression = useMemo(() => courseState.getCourseProgress(course.id) ?? 0, [courseState, course.id]);

  const display = useMemo<ModuleButtonDisplay>(() => {
    if (lessonState.getLessonCompleted === undefined) {
      return { buttons: [], modulePosition: [], total: 0, current: null, next: null, pathLength: 15 };
    }

    let current: number | null = null;
    let next: number | null = null;

    const modulePosition: ModulePosition[] = [];
    const buttonList: ModuleButtonPosition[] = [];
    let lessonCount = 0;

    course.modules?.forEach(item => {
      if (item.lessons && item.lessons.length > 0) {
        item.lessons.forEach((lesson: LessonType, lessonIndex: number) => {
          const count = lessonCount + 1;
          const complete = lessonState.getLessonCompleted(lesson.id);
          let moduleSection: Module | null = null;

          logger.info('[COURSE NAVIGATION] Processing lesson', count, complete);

          // Only assign the module to the first lesson of that module
          if (lessonIndex === 0) {
            moduleSection = item as Module;
            modulePosition.push({
              id: item.id,
              name: item.title,
              position: new THREE.Vector3(0, LESSON_SPACING * count - 3.5, 0),
            });
          }

          if (!complete) {
            if (current === null) {
              current = count - 1;
            }
            if (next === null) {
              next = count;
            }
          }

          lessonCount++;

          buttonList.push({
            id: lesson.id,
            name: lesson.title,
            count,
            active: complete || next === count,
            next: next === count,
            module: moduleSection,
            color: item.color || 'white',
            type: lesson.category.name,
            slug: lesson.slug || '',
            isFree: lesson.isFree || false,
            moduleSlug: item.slug || '',
            position: {
              x: (count - 1) % 2 ? -1 : 1,
              y: LESSON_SPACING * count,
              z: 0,
            },
          });
        });
      }
    });

    const lastY = buttonList.length > 0 ? buttonList[buttonList.length - 1].position.y : 0;

    logger.debug('[COURSE NAVIGATION] Module button display generated', {
      buttons: buttonList,
      total: buttonList.length,
      modulePosition: modulePosition,
      pathLength: lastY + 15,
      current: current,
      next: next,
    });

    return {
      buttons: buttonList,
      total: buttonList.length,
      modulePosition: modulePosition,
      pathLength: lastY + 15,
      current,
      next,
    };
  }, [lessonState, course.modules]);

  // Auto-repair: Fix lessons that are incomplete but have subsequent completed lessons
  useEffect(() => {
    if (repairAttemptedRef.current) return;
    if (!lessonState.getLessonCompleted || !lessonState.setLessonComplete) return;
    if (!course.modules || course.modules.length === 0) return;

    // Collect all lessons in order with their completion status
    const allLessons: { id: string; completed: boolean }[] = [];
    course.modules.forEach(item => {
      if (item.lessons && item.lessons.length > 0) {
        item.lessons.forEach((lesson: LessonType) => {
          allLessons.push({
            id: lesson.id,
            completed: lessonState.getLessonCompleted(lesson.id),
          });
        });
      }
    });

    // Find the last completed lesson index
    let lastCompletedIndex = -1;
    for (let i = allLessons.length - 1; i >= 0; i--) {
      if (allLessons[i].completed) {
        lastCompletedIndex = i;
        break;
      }
    }

    // If there's a completed lesson, ensure all lessons before it are also completed
    if (lastCompletedIndex > 0) {
      const lessonsToRepair: string[] = [];
      for (let i = 0; i < lastCompletedIndex; i++) {
        if (!allLessons[i].completed) {
          lessonsToRepair.push(allLessons[i].id);
        }
      }

      if (lessonsToRepair.length > 0) {
        logger.info('[COURSE NAVIGATION] Auto-repairing incomplete lessons', {
          lessonsToRepair,
          lastCompletedIndex,
        });
        lessonsToRepair.forEach(lessonId => {
          lessonState.setLessonComplete(lessonId);
        });
      }
    }

    repairAttemptedRef.current = true;
  }, [course.modules, lessonState]);

  useGSAP(
    () => {
      if (containerRef.current === null) return;

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
    { scope: containerRef, dependencies: [lesson, course.slug, router] },
  );

  const handleOpenLesson = (lesson: LessonButton) => {
    setLesson(lesson);
    onLoaded?.(false);
  };

  const handleZoom = (dir: number) => {
    zoomControlRef.current?.handleZoom(dir);
  };

  return (
    <div ref={containerRef} className={'relative h-screen w-full'}>
      <div className={'fixed right-2 top-1/2 z-20 flex flex-col space-y-2 rounded-lg bg-white p-1 md:hidden'}>
        <Button onClick={() => handleZoom(-1)} className={'h-10 w-10 rounded-full text-lg'}>
          +
        </Button>
        <Button onClick={() => handleZoom(1)} className={'h-10 w-10 rounded-full text-lg'}>
          -
        </Button>
      </div>

      <div
        className={
          'lesson-load pointer-events-none fixed z-20 flex h-screen w-full flex-col items-center justify-center bg-amber-600 p-5 opacity-0'
        }
        style={{ backgroundColor: lesson?.color }}>
        <div className={'lesson-num font-lesson-body text-xl font-bold text-white'}>Lesson {lesson?.num}</div>
        <div className={'lesson-name font-lesson-heading text-center text-2xl text-white lg:text-4xl'}>
          {lesson?.name}
        </div>
        <div className={'lesson-loader mt-3'}>
          <Loader2 className={'mb-5 h-12 w-12 animate-spin text-white'} />
        </div>
      </div>

      <SafeCourseNavigation
        className={'fixed h-screen w-full'}
        shadows={true}
        moduleAwardsDisplay={display}
        camera={{ position: [0, 0, 130], fov: 15 }}>
        <ambientLight intensity={0.6} />

        <SafeSkyBox skyUrl={course?.bookScene?.skyUrl} />

        <SoftShadows size={5} samples={20} focus={40} />

        {/* rest of your 3D content */}
        <directionalLight
          shadow-mapSize-width={1024 * (isMobile ? 2 : 4)}
          shadow-mapSize-height={1024 * (isMobile ? 2 : 4)}
          shadow-camera-far={500}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={500}
          shadow-camera-bottom={-100}
          position={[-40, 100, 250]}
          rotation={[0, Math.PI, 0]}
          intensity={2}
          castShadow
        />

        <Landscape
          lessonSpacing={LESSON_SPACING}
          courseCompleted={courseProgression === 100}
          position={[0, 0, 0]}
          container={containerRef}
          purchaseType={purchaseType}
          onOpenLesson={handleOpenLesson}
          display={display}
          onReady={onLoaded}
          bookScene={course.bookScene}
        />

        <group position={[0, 300, -300]}>
          <Clouds width={80} height={300} depth={300} numClouds={100} />
        </group>

        <CloudCover position={[0, 5, -30]} />
        <ZoomControl ref={zoomControlRef} />

        <SafeModuleAwards display={display} />
      </SafeCourseNavigation>
    </div>
  );
}

const ZoomControl = forwardRef((_, ref) => {
  const baseZoom = 120;
  const { camera } = useThree();
  const [zoom, setZoom] = useState<number>(baseZoom);
  const [active, setActive] = useState<boolean>(false);

  const maxZoom = 200;
  const minZoom = 90;

  // Expose handleZoom and handleReset to parent using useImperativeHandle
  useImperativeHandle(ref, () => ({
    handleZoom(dir: number) {
      if (dir === 0) {
        return;
      }

      setActive(true);

      setZoom(prevZoom => {
        const newZoom = prevZoom + dir * -20; // Simplified zoom logic
        return Math.max(minZoom, Math.min(maxZoom, newZoom));
      });
    },
    handleReset: () => {
      setZoom(baseZoom);
    },
  }));

  // Animate camera position when zoom changes
  useEffect(() => {
    if (!camera) return;

    if (!active) {
      return;
    }

    gsap.to(camera.position, {
      z: zoom,
      duration: 1,
      ease: 'power2.inOut',
    });
  }, [camera, zoom, active]);

  return null;
});
