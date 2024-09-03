'use client';
import * as THREE from 'three';
import React, { Suspense, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Preload, ScrollControls, Scroll, useScroll, Image, useTexture, Plane, Sky } from '@react-three/drei';
import { CameraController } from './course-scene/camera-control';
import { GridPlane } from './course-scene/grid-plane';
import { Landscape } from './course-scene/landscape';

interface CourseNavigationProps {
  course: any;
}

export function CourseNavigation({ course }: CourseNavigationProps) {
  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Sky distance={150} sunPosition={[-50, 10, -100]} inclination={0.25} azimuth={0.45} rayleigh={1} />
        <CameraController />
        <GridPlane />
        <Landscape />
      </Suspense>
    </Canvas>
  );
}

export default CourseNavigation;
