import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plane, useScroll, useTexture } from '@react-three/drei';

import { useFrame, useThree, extend } from '@react-three/fiber';
import { FretBoard } from './fretboard';
import { Lesson, Module } from '@prisma/client';
import { FinalScene } from './finish-scene';
import ModulePath from './module-path';

type LessonType = Lesson & { category: { name: string } };

type ModuleSection = Module & { lessons: LessonType[] };

interface LandscapeProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  modules: ModuleSection[];
  lessonSpacing: number;
  onLandscapeHeightChange?: (height: number) => void;
  onReady?: (ready: boolean) => void;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

const calculateCameraHeight = (camera: THREE.PerspectiveCamera) => {
  const frustumHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
  return frustumHeight;
};

export const Landscape = ({
  modules,
  lessonSpacing,
  rotation,
  position,
  onLandscapeHeightChange,
  onReady,
  ...rest
}: LandscapeProps) => {
  const { width, height } = useThree(state => state.viewport);
  const [cameraHeight, setCameraHeight] = useState<number | null>(null);
  const [pathLength, setPathLength] = useState<number | null>(null);

  const scroll = useScroll();
  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');
  const ref = React.useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const [ready, setReady] = useState(false);

  console.log('LANDSCAPE MODULES: RENDER');

  const lessonNumber = useMemo(() => {
    return modules.reduce((acc, item) => acc + item.lessons.length, 0);
  }, modules);

  useEffect(() => {
    if (ready) {
      onReady && onReady(ready);
    }
  }, [ready]);

  useFrame((state, delta) => {
    //ref.current.position.y = -(scroll.offset * (height * scroll.pages));
    state.camera.position.z = 130 - scroll.range(0, 1 / scroll.pages) * 60;
    state.camera.position.y = scroll.offset * (height * scroll.pages);

    /*
    state.camera.position.x = state.mouse.x * 0.02;
    state.camera.rotation.y = state.mouse.x * 0.02;
    state.camera.rotation.x = state.mouse.y * 0.02;

     */

    if (!camera.current) {
      camera.current = state.camera as THREE.PerspectiveCamera;
    }

    if (!ready) {
      setReady(true);
    }
  });

  useEffect(() => {
    if (!camera.current) return; // Ensure camera exists before adding listener

    const handleResize = () => {
      if (camera.current) {
        if (camera.current) {
          camera.current.aspect = width / height;
          camera.current.updateProjectionMatrix(); // Always update projection matrix
          const cameraHeight = calculateCameraHeight(camera.current);
          setCameraHeight(cameraHeight);
        }
      }
    };

    // Initial call
    handleResize();

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [camera.current, width, height]); // Ensure camera, width, and height are stable dependencies

  const pageHeight = useMemo(() => {
    if (pathLength !== null && cameraHeight && ref.current && camera.current) {
      const box = new THREE.Box3();
      box.setFromObject(ref.current);
      const size = new THREE.Vector3();
      box.getSize(size);

      console.log('CALCULATING PAGE HEIGHT:', cameraHeight, pathLength, size.y, size.y / cameraHeight);

      return Math.ceil(size.y / cameraHeight);
    }
    return null; // Return null if conditions are not met
  }, [cameraHeight, ref.current, camera.current, pathLength]);

  // Trigger callback if pageHeight exists
  useEffect(() => {
    if (pageHeight) {
      onLandscapeHeightChange && onLandscapeHeightChange(pageHeight);
    }
  }, [pageHeight, onLandscapeHeightChange]);

  return (
    <>
      <group ref={ref} position={position} rotation={rotation} {...rest}>
        <Plane args={[20, 17]} position={[0, 3, -25.2]} scale={2} rotation={[0, 0, 0]}>
          <meshStandardMaterial map={guitar} color={0xffffff} transparent={true} metalness={0.4} />
        </Plane>
        <Plane args={[17, 10]} position={[0, 0, 0]} scale={4} rotation={[0, 0, 0]}>
          <meshStandardMaterial map={midGround} transparent={true} metalness={0.4} />
        </Plane>
        <Plane args={[17, 10]} position={[0, 2, 10]} scale={4} rotation={[0, 0, 0]}>
          <meshStandardMaterial map={foreGround} transparent={true} metalness={0.4} />
        </Plane>

        {pathLength && (
          <>
            <FretBoard
              position={[0, 0, 0]}
              lessonSpacing={lessonSpacing}
              lessonNumber={lessonNumber}
              pathLength={pathLength}
            />

            <FinalScene pathLength={pathLength} />
          </>
        )}

        <ModulePath
          modulesSection={modules}
          lessonSpacing={lessonSpacing}
          onPathLength={length => setPathLength(length)}
        />
      </group>
    </>
  );
};
