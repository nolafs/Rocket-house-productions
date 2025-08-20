'use client';
import { useTexture } from '@react-three/drei';
import React, { useEffect, useMemo, useRef } from 'react';

import * as THREE from 'three';
import { Vector3 } from 'three';

interface FredBoardProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  pathLength?: number | null;
  lessonNumber: number;
  lessonSpacing: number;
}

export const FretBoard = ({ rotation, position, pathLength, lessonSpacing, lessonNumber, ...rest }: FredBoardProps) => {
  const ref = useRef<THREE.Group | null>(null);
  const fred = useTexture('/images/course/fret.webp');

  const { sectionNum, planeHeight } = useMemo(() => {
    if (pathLength) {
      // When pathLength is provided, calculate sections and height dynamically

      const sections = Math.floor(pathLength / 12); // or whatever your desired section length is
      const height = pathLength / sections;
      return { sectionNum: sections, planeHeight: height };
    } else {
      // Fallback to lesson-based calculation
      const sections = Math.ceil(lessonNumber / (12.8 / lessonSpacing));
      return { sectionNum: sections, planeHeight: 12.8 };
    }
  }, [pathLength, lessonNumber, lessonSpacing]);

  return (
    <group ref={ref} rotation={rotation} position={position} {...rest}>
      <group position={[0, 10, 0]}>
        {Array.from({ length: sectionNum }).map((_, index) => (
          <mesh receiveShadow key={index} position={[0, planeHeight * index, -25]} scale={1} rotation={[0, 0, 0]}>
            <planeGeometry args={[9.2, planeHeight, 100, 100]} />
            <meshStandardMaterial depthTest={true} map={fred} transparent={true} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
