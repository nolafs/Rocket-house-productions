import { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { Group, PlaneGeometry } from 'three';

interface FinalSceneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  pathLength?: number;
}

export const FinalScene = ({ position, rotation, pathLength = 0, ...rest }: FinalSceneProps) => {
  const ref = useRef<Group | null>(null);
  const fred = useTexture('/images/course/guitar-head.png');

  return (
    <group ref={ref}>
      <mesh geometry={new PlaneGeometry(15, 18)} position={[0, pathLength + 15.8, -25]} scale={1} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={fred} color={0xffffff} transparent={true} metalness={0.4} />
      </mesh>
    </group>
  );
};
