import { Plane, useTexture } from '@react-three/drei';
import React, { useRef } from 'react';

export const CourseSection = ({ props }: any) => {
  const ref = useRef<any>();
  const fred = useTexture('/images/course/fret.png');

  const sectionNum = 10; // Number of sections
  const planeHeight = 13; // Height of each plane
  const offsetY = planeHeight;

  return (
    <group ref={ref} {...props}>
      {Array.from({ length: sectionNum }).map((_, index) => (
        <Plane
          key={index}
          args={[6.85, planeHeight]}
          position={[0, 20 + offsetY * index, -25]}
          scale={1}
          rotation={[0, 0, 0]}>
          <meshStandardMaterial map={fred} color={0xffffff} transparent={true} metalness={0.4} />
        </Plane>
      ))}
    </group>
  );
};
