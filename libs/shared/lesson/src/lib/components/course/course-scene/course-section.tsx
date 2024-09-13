import { Plane, useTexture } from '@react-three/drei';
import React, { useRef } from 'react';

interface FredBoardProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  lessonNumber: number;
  lessonSpacing: number;
}

const calculateFactor = (totalLessons: number, baseSpacing: number, lessonSpacing: number) =>
  totalLessons / (baseSpacing * (lessonSpacing / baseSpacing));

export const FredBoard = ({ rotation, position, lessonSpacing, lessonNumber, ...rest }: FredBoardProps) => {
  const ref = useRef<any>();
  const fred = useTexture('/images/course/fret.png');
  const baseSpacing = 7; // The original spacing value
  const factor = calculateFactor(lessonNumber, baseSpacing, lessonSpacing);

  const sectionNum = lessonNumber / 1.8; // Number of sections
  const planeHeight = 13; // Height of each plane
  const offsetY = planeHeight;

  console.log('calculated sectionNum:', lessonNumber);

  return (
    <group ref={ref} rotation={rotation} position={position} {...rest}>
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
