'use client';
import * as THREE from 'three';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, ScrollControls, Sky, StatsGl } from '@react-three/drei';
import { GridPlane } from './course-scene/grid-plane';
import { Landscape } from './course-scene/landscape';
import { CameraController } from './course-scene/camera-control';
import { Course } from '@prisma/client';

interface CourseNavigationProps {
  course: Course & { modules: any[] };
}

const LESSON_SPACING = 7;

export function CourseNavigation({ course }: CourseNavigationProps) {
  const [pages, setPages] = useState(1); // Default to 1 page
  const containerRef = useRef<HTMLCanvasElement>(null);
  const [landscapeHeight, setLandscapeHeight] = useState(0);

  // Calculate number of pages when viewportHeight or totalHeight changes
  useEffect(() => {
    if (landscapeHeight > 0) {
      console.log('landscapeHeight:', landscapeHeight);
      setPages(landscapeHeight);
    }
  }, [landscapeHeight]);

  return (
    <Canvas ref={containerRef} shadows={true} camera={{ position: [0, 0, 130], fov: 15 }}>
      <Suspense fallback={null}>
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
          />
        </ScrollControls>

        <StatsGl />

        <Preload />
      </Suspense>
    </Canvas>
  );
}

export default CourseNavigation;
