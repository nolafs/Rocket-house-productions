import { Plane, useTexture } from '@react-three/drei';
import React, { useMemo, useRef } from 'react';

import * as THREE from 'three';

interface FredBoardProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  pathLength?: number;
  lessonNumber: number;
  lessonSpacing: number;
}

const PLANE_HEIGHT = 12.8;

export const FretBoard = ({ rotation, position, pathLength, lessonSpacing, lessonNumber, ...rest }: FredBoardProps) => {
  const ref = useRef<any>();
  const fred = useTexture('/images/course/fret.webp');

  const sectionNum = useMemo(
    () => (pathLength ? pathLength / 13 : lessonNumber / (PLANE_HEIGHT / lessonSpacing)),
    [pathLength, lessonNumber],
  ); // Number of sections

  return (
    <group ref={ref} rotation={rotation} position={position} {...rest}>
      {Array.from({ length: sectionNum }).map((_, index) => (
        <mesh receiveShadow key={index} position={[0, PLANE_HEIGHT * index, -25]} scale={1} rotation={[0, 0, 0]}>
          <planeGeometry args={[9.2, PLANE_HEIGHT, 100, 100]} />
          <meshStandardMaterial depthTest={true} map={fred} transparent={true} />
        </mesh>
      ))}
    </group>
  );
};
