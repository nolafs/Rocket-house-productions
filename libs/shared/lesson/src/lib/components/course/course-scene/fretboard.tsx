import { Plane, useTexture } from '@react-three/drei';
import React, { useRef } from 'react';

import * as THREE from 'three';

interface FredBoardProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  pathLength?: number;
  lessonNumber: number;
  lessonSpacing: number;
}

export const FretBoard = ({ rotation, position, pathLength, lessonSpacing, lessonNumber, ...rest }: FredBoardProps) => {
  const ref = useRef<any>();
  const fred = useTexture('/images/course/fret.png');

  const planeHeight = 13; // Height of each plane
  const sectionNum = pathLength ? pathLength / 13 : lessonNumber / (planeHeight / lessonSpacing); // Number of sections

  const offsetY = planeHeight;

  console.log('calculated sectionNum:', lessonNumber);

  return (
    <group ref={ref} rotation={rotation} position={position} {...rest}>
      {Array.from({ length: sectionNum }).map((_, index) => (
        <Plane
          args={[6.85, planeHeight, 10, 10]}
          receiveShadow
          key={index}
          position={[0, 20 + offsetY * index, -25]}
          scale={1}
          rotation={[0, 0, 0]}>
          <meshPhongMaterial map={fred} color={0xffffff} alphaTest={0.1} />
        </Plane>
      ))}
    </group>
  );
};
