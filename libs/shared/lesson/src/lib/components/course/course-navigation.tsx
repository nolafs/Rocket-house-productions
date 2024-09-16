'use client';
import * as THREE from 'three';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html, Preload, ScrollControls, Sky, StatsGl, useProgress } from '@react-three/drei';
import { GridPlane } from './course-scene/grid-plane';
import { Landscape } from './course-scene/landscape';
import { CameraController } from './course-scene/camera-control';
import { Course } from '@prisma/client';
import Clouds from './course-scene/cloud-scene';
import { Loader2 } from 'lucide-react';
import { CloudCover } from './course-scene/cloud-cover';

interface CourseNavigationProps {
  course: Course & { modules: any[] };
  onLoaded?: (loaded: boolean) => void;
}

const LESSON_SPACING = 7;

export function CourseNavigation({ course, onLoaded }: CourseNavigationProps) {
  const [pages, setPages] = useState(1); // Default to 1 page
  const containerRef = useRef<HTMLCanvasElement>(null);
  const [landscapeHeight, setLandscapeHeight] = useState(0);
  const { active } = useProgress();

  // Calculate number of pages when viewportHeight or totalHeight changes
  useEffect(() => {
    if (landscapeHeight > 0) {
      //console.log('landscapeHeight:', landscapeHeight);
      setPages(landscapeHeight);
    }
  }, [landscapeHeight]);

  const handleLoaded = (load: boolean) => {
    onLoaded && onLoaded(load);
  };

  return (
    <>
      <Canvas ref={containerRef} shadows={true} camera={{ position: [0, 0, 130], fov: 15 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={1} />
          <directionalLight position={[100, 200, 200]} intensity={4} castShadow />
          <Sky
            distance={3000}
            sunPosition={[0, 0, -100]}
            mieDirectionalG={0.022}
            inclination={0.25}
            azimuth={0.45}
            turbidity={10}
            rayleigh={4}
          />

          <ScrollControls damping={0.2} pages={pages}>
            <Landscape
              onLandscapeHeightChange={setLandscapeHeight}
              lessonSpacing={LESSON_SPACING}
              position={[0, 0, 0]}
              modules={course.modules}
              onReady={load => handleLoaded(load)}
            />
          </ScrollControls>

          <group position={[0, 0, -300]}>
            <Clouds width={80} height={300} depth={300} numClouds={100} />
          </group>

          <CloudCover position={[0, 5, -30]} />

          <StatsGl />

          <Preload />
        </Suspense>
      </Canvas>
    </>
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
