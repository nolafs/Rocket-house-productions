import { useRef } from 'react';
import { useTexture, Html } from '@react-three/drei';
import { Group, PlaneGeometry } from 'three';

interface FinalSceneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  pathLength?: number;
  courseCompleted?: boolean;
}

export const FinalScene = ({ courseCompleted, position, rotation, pathLength = 0, ...rest }: FinalSceneProps) => {
  const ref = useRef<Group | null>(null);
  const fred = useTexture('/images/course/guitar-head.png');
  const sun = useTexture('/images/course/finish.png');

  return (
    <group ref={ref}>
      {courseCompleted && (
        <group>
          <mesh
            geometry={new PlaneGeometry(50, 44)}
            position={[0, pathLength + 30, -35]}
            scale={1}
            rotation={[0, 0, 0]}>
            <meshStandardMaterial map={sun} color={0xffffff} transparent={true} metalness={0.4} />

            <Html transform={true}>
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold text-white">Congratulations!</h1>
                  <p className="text-white">You have completed the course.</p>
                </div>
              </div>
            </Html>
          </mesh>
        </group>
      )}

      <mesh geometry={new PlaneGeometry(15, 18)} position={[0, pathLength + 15, -24.5]} scale={1} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={fred} color={0xffffff} transparent={true} metalness={0.4} />
      </mesh>
    </group>
  );
};
