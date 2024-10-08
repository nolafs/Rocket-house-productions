'use client';
import * as THREE from 'three';
import React, { forwardRef, Suspense, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Box, Html, Preload, useProgress, useTexture } from '@react-three/drei';
import { Landscape } from './course-scene/landscape';
import { Course } from '@prisma/client';
import Clouds from './course-scene/cloud-scene';
import { Loader2 } from 'lucide-react';
import { CloudCover } from './course-scene/cloud-cover';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { LessonButton, ModulePosition } from './course-scene/course.types';
import {
  useCourseProgressionStore,
  useModuleProgressStore,
  useLessonProgressionStore,
} from '@rocket-house-productions/providers';
import ModuleAwards from './course-scene/module-awards';
import { CameraController } from './course-scene/camera-control';
import { Button } from '@rocket-house-productions/shadcn-ui';
import CourseNavigationPage from '@/app/(website)/(protected)/courses/(lesson)/[slug]/(course)/_components/courseNavigationPage';

gsap.registerPlugin(SplitText);

interface CourseNavigationProps {
  course: Course & { modules: any[] };
  purchaseType?: string | null;
  onLoaded?: (loaded: boolean) => void;
}

const LESSON_SPACING = 7;

export function CourseNavigation({ course, onLoaded, purchaseType = null }: CourseNavigationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const courseState = useCourseProgressionStore(store => store);
  const moduleState = useModuleProgressStore(store => store);
  const lessonState = useLessonProgressionStore(store => store);
  const [modulePosition, setModulePosition] = useState<ModulePosition[] | null>(null);
  const [lesson, setLesson] = React.useState<LessonButton | null>(null);
  const [courseProgression, setCourseProgression] = useState<number | null>(null);

  const router = useRouter();
  const zoomDirectionRef = useRef<number>(0); // To store zoom direction
  const zoomControlRef = useRef<{ handleZoom: (dir: number) => void; handleReset: () => void } | null>(null); // Ref to call child functions

  console.log('[CourseNavigation] RENDER 1');

  useEffect(() => {
    courseState.calculateCourseProgress(course.id);
    console.log('[CourseNavigation] EFFECT 1');
  }, [moduleState]);

  useEffect(() => {
    setCourseProgression(courseState.getCourseProgress(course.id));
    console.log('[CourseNavigation] EFFECT 2');
  }, [courseState, lessonState]);

  useGSAP(
    () => {
      console.log('[CourseNavigation] useGSAP 1');
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
    { scope: containerRef, dependencies: [lesson] },
  );

  const handleLoaded = (load: boolean) => {
    onLoaded && onLoaded(load);
  };

  const handleOpenLesson = (lesson: LessonButton) => {
    setLesson(lesson);
    onLoaded && onLoaded(false);
  };

  const handleModulePosition = (position: any) => {
    if (!modulePosition?.length) {
      setModulePosition(prevState => position);
    }
  };

  const handleZoom = (dir: number) => {
    zoomDirectionRef.current = dir; // Update zoom direction
    if (zoomControlRef.current) {
      zoomControlRef.current.handleZoom(dir); // Call the child's handleZoom directly
    }
  };

  //console.log('[CourseNavigation] RENDER 2');

  if (courseProgression === null) {
    return (
      <div className={'flex h-screen w-full items-center justify-center'}>
        <Loader2 className={'mb-5 h-12 w-12 animate-spin text-white'} />
      </div>
    );
  }

  //console.log('[CourseNavigation] RENDER 3');

  return (
    <div ref={containerRef} className={'relative h-screen w-full'}>
      <div className={'fixed right-2 top-1/2 z-20 flex flex-col space-y-2 md:hidden'}>
        <Button onClick={() => handleZoom(-1)} className={'text-lg'}>
          +
        </Button>
        <Button onClick={() => handleZoom(1)} className={'text-lg'}>
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

      <Canvas className={'fixed h-screen w-full'} shadows={true} camera={{ position: [0, 0, 130], fov: 15 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.6} />

          <SkyBox />

          <directionalLight
            shadow-mapSize-width={1024 * 8}
            shadow-mapSize-height={1024 * 8}
            shadow-camera-far={500}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={500}
            shadow-camera-bottom={-100}
            position={[-40, 100, 250]}
            intensity={2.5}
            castShadow></directionalLight>

          <Landscape
            lessonSpacing={LESSON_SPACING}
            courseCompleted={courseProgression === 100}
            position={[0, 0, 0]}
            container={containerRef}
            purchaseType={purchaseType}
            onOpenLesson={handleOpenLesson}
            modules={course.modules}
            onReady={load => handleLoaded(load)}
            onModulePosition={handleModulePosition}
          />

          <group position={[0, 300, -300]}>
            <Clouds width={80} height={300} depth={300} numClouds={100} />
          </group>

          <CloudCover position={[0, 5, -30]} />

          <ZoomControl ref={zoomControlRef} />
          <Preload all />
        </Suspense>

        <ModuleAwards modulePosition={modulePosition} />
      </Canvas>
    </div>
  );
}

function Loader() {
  const { progress, loaded, total, item, active } = useProgress();

  useEffect(() => {
    console.log('[Loader] PROGRESS', progress, loaded, total, item, active);
  }, [active, item, progress, active]);

  return (
    <Html fullscreen zIndexRange={[100, 100]}>
      <div className={'z-50 flex h-screen w-full flex-col items-center justify-center'}>
        <div className={'flex flex-col items-center justify-center'}>
          <Loader2 className={'mb-5 h-12 w-12 animate-spin text-white'} />
          <div className={'font-lesson-heading mt-5 w-full text-center text-white'}>{Math.round(progress)} %</div>
          <div className={'w-full text-center text-sm text-white'}>
            Item: {loaded} / {total}
          </div>
        </div>
      </div>
    </Html>
  );
}

function Ready({ ready }: { ready: boolean }) {
  if (!ready) {
    return (
      <div className={'z-50 flex h-screen w-full flex-col items-center justify-center bg-[#e8c996]'}>
        <div className={'flex flex-col items-center justify-center'}>
          <Loader2 className={'mb-5 h-12 w-12 animate-spin text-white'} />
        </div>
      </div>
    );
  }
}

function SkyBox() {
  // highlight-start
  const texture = useTexture('/images/course/sky.webp');

  return (
    <Box args={[1000, 1350, 1000]} position={[0, -100, 0]}>
      <meshStandardMaterial map={texture} side={THREE.BackSide} />
    </Box>
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
        let newZoom = prevZoom;
        if (dir === 1 && prevZoom < maxZoom) {
          newZoom = 200;
        } else if (dir === -1 && prevZoom > minZoom) {
          newZoom = 100;
        }

        return newZoom;
      });
    },
    handleReset() {
      setZoom(baseZoom); // Reset to baseZoom
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
  }, [camera, zoom]);

  return null;
});

export default CourseNavigation;
