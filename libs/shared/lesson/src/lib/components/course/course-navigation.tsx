'use client';
import * as THREE from 'three';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Preload, ScrollControls, Scroll, useScroll, Sky, StatsGl } from '@react-three/drei';
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
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const containerRef = useRef<HTMLCanvasElement>(null);
  const lessonHeight = 243 * LESSON_SPACING; // Height of each lesson

  // Calculate the total height of all lessons
  const numberOfLessons = course.modules.length;
  const totalHeight = numberOfLessons * lessonHeight;

  useEffect(() => {
    if (containerRef.current) {
      // Measure the height of the container
      setViewportHeight(containerRef.current.clientHeight);
    }

    // Set up a resize observer to update viewportHeight on window resize
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Clean up the resize observer on component unmount
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate number of pages when viewportHeight or totalHeight changes
  useEffect(() => {
    if (viewportHeight > 0) {
      const calculatedPages = Math.ceil(totalHeight / viewportHeight);
      setPages(calculatedPages);
      console.log('Calculated pages:', calculatedPages, totalHeight, viewportHeight);
    }
  }, [viewportHeight, totalHeight]);

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

        <ScrollControls damping={0.2} pages={pages + 1}>
          <Landscape lessonSpacing={LESSON_SPACING} position={[0, 0, 0]} modules={course.modules} />
        </ScrollControls>

        <StatsGl />

        <Preload />
      </Suspense>
    </Canvas>
  );
}

export default CourseNavigation;
