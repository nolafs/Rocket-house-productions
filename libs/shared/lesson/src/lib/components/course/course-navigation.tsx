'use client';
import * as THREE from 'three';
import React, { Suspense, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Preload, ScrollControls, Scroll, useScroll, Sky, StatsGl } from '@react-three/drei';
import { GridPlane } from './course-scene/grid-plane';
import { Landscape } from './course-scene/landscape';
import { CameraController } from './course-scene/camera-control';

interface CourseNavigationProps {
  course: any;
}

export function CourseNavigation({ course }: CourseNavigationProps) {
  return (
    <Canvas camera={{ position: [0, 0, 130], fov: 15 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <directionalLight position={[0, 100, 100]} intensity={4} />
        <Sky distance={80} sunPosition={[-50, 20, -100]} inclination={0.25} azimuth={0.45} rayleigh={1} />

        <ScrollControls damping={0.2} pages={5}>
          <Landscape postion={[0, 0, 0]} />
        </ScrollControls>

        <StatsGl />

        <Preload />
      </Suspense>
    </Canvas>
  );
}

export default CourseNavigation;
