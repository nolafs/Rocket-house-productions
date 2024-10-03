import * as THREE from 'three';
import React, { MutableRefObject, useMemo, useRef, useState } from 'react';
import { Center, Plane, Text3D, useTexture } from '@react-three/drei';

import { useFrame } from '@react-three/fiber';
import { FretBoard } from './fretboard';
import { Lesson, Module } from '@prisma/client';
import { FinalScene } from './finish-scene';
import ModulePath, { ModuleButtonDisplay } from './module-path';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { LessonButton, ModulePosition } from './course.types';

gsap.registerPlugin(ScrollTrigger);
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
gsap.registerPlugin(useGSAP);

gsap.registerPlugin(ScrollToPlugin);

type LessonType = Lesson & { category: { name: string } };
type ModuleSection = Module & { lessons: LessonType[] };

interface LandscapeProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  modules: ModuleSection[];
  courseCompleted?: boolean;
  lessonSpacing: number;
  purchaseType?: string | null;
  onOpenLesson?: (lesson: LessonButton) => void;
  onModulePosition?: (position: ModulePosition[]) => void;
  onPathLength?: (length: number) => void;
  onReady?: (ready: boolean) => void;
  container?: MutableRefObject<HTMLElement | null>;
}

const SCROLL_FACTOR = 50;
const FINAL_SCENE = 30;

export const Landscape = ({
  modules,
  lessonSpacing,
  courseCompleted,
  rotation,
  position,
  purchaseType = null,
  onReady,
  container,
  onOpenLesson,
  onModulePosition,
  ...rest
}: LandscapeProps) => {
  const [pathLength, setPathLength] = useState<number | null>(null);
  const [currentLesson, setCurrentLesson] = useState<number>(0);

  const guitar = useTexture('/images/course/guitar.webp');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');
  const ref = React.useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const lessonNumber = useMemo(() => {
    return modules.reduce((acc, item) => acc + item.lessons.length, 0);
  }, [modules]);

  const { contextSafe } = useGSAP(
    () => {
      if (!container?.current) {
        return;
      }

      if (pathLength === null) {
        return;
      }

      if (!camera.current) {
        return;
      }

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      const tl = gsap.timeline();

      tl.to(camera.current.position, {
        z: 90,
        y: 20,
        duration: 0.1,
        ease: 'none',
      });

      if (!courseCompleted) {
        tl.to(camera.current.position, {
          y: pathLength,
          duration: 1,
          ease: 'none',
        });

        scrollTriggerRef.current = ScrollTrigger.create({
          animation: tl,
          trigger: container.current,
          pin: true,
          scrub: 1,
          end: `+=${pathLength * SCROLL_FACTOR} `,
        });

        if (typeof window !== 'undefined') {
          gsap.to(window, {
            duration: 3,
            scrollTo: { y: (currentLesson + window.innerHeight / 2 / SCROLL_FACTOR) * SCROLL_FACTOR },
            delay: 3,
            ease: 'Power2.inOut',
          });
        }
      } else {
        tl.to(camera.current.position, {
          y: pathLength + FINAL_SCENE,
          duration: 1,
          ease: 'none',
        });

        scrollTriggerRef.current = ScrollTrigger.create({
          animation: tl,
          trigger: container.current,
          pin: true,
          scrub: 1,
          end: `+=${(pathLength + FINAL_SCENE) * SCROLL_FACTOR} `,
        });

        if (typeof window !== 'undefined') {
          gsap.to(window, {
            duration: 5,
            scrollTo: { y: (pathLength + FINAL_SCENE) * SCROLL_FACTOR },
            delay: 0.5,
            ease: 'Power2.inOut',
          });
        }
      }

      onReady && onReady(true);

      return () => {
        ScrollTrigger.killAll();
      };
    },
    { scope: container, dependencies: [pathLength, currentLesson, camera] },
  );

  const handleUpdate = (data: ModuleButtonDisplay) => {
    if (!data.pathLength) {
      return;
    }

    if (!pathLength) {
      console.log('LANDSCAPE MODULES: handleUpdate', data);
      setPathLength(data?.pathLength);
      setCurrentLesson(data.buttons[data.next || 0].position.y);
      onModulePosition && onModulePosition(data.modulePosition);
    }
  };

  const handleOnLesson = contextSafe((lesson: LessonButton) => {
    if (!camera.current) {
      return;
    }

    console.log('LANDSCAPE MODULES: handleOnLesson');
    gsap.to(camera.current?.position, { z: 100, duration: 1, ease: 'power2.in' });
    onOpenLesson && onOpenLesson(lesson);
  });

  const handleOnBackToCurrentLesson = contextSafe(() => {
    console.log('LANDSCAPE MODULES: handleOnBackToCurrentLesson', currentLesson, window.innerHeight);
    if (typeof window !== 'undefined') {
      gsap.to(window, {
        duration: 3,
        scrollTo: { y: (currentLesson + window.innerHeight / 2 / SCROLL_FACTOR) * SCROLL_FACTOR },
        ease: 'Power2.inOut',
      });
    }
  });

  useFrame((state, delta) => {
    const { pointer } = state;
    // Rotate the camera around its own center based on pointer movement
    const rotationSpeed = 0.01; // Adjust this for sensitivity
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, pointer.x * rotationSpeed, 0.1); // Left/right rotation
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, pointer.y * rotationSpeed, 0.1); // Up/down rotation

    // Ensure you don't rotate too far (optional, to avoid flipping the camera)
    state.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, state.camera.rotation.x)); // Clamp x-axis rotation to avoid flipping

    if (!camera.current) {
      console.log('LANDSCAPE MODULES: CAMERA NOT SET');
      camera.current = state.camera as THREE.PerspectiveCamera;
    }
  });

  console.log('[awards]  LANDSCAPE MODULES: RENDER - COMPLETE', courseCompleted);

  return (
    <>
      <group ref={ref} position={position} rotation={rotation} {...rest}>
        <Plane args={[22, 19]} position={[0, 3, -25.1]} scale={2} rotation={[0, 0, 0]} receiveShadow={true}>
          <meshPhongMaterial map={guitar} transparent={true} />
        </Plane>
        <Plane args={[17, 10]} position={[0, 0, 0]} scale={4} rotation={[0, 0, 0]}>
          <meshStandardMaterial map={midGround} transparent={true} metalness={0.4} />
        </Plane>
        <Plane args={[17, 10]} position={[0, 2, 10]} scale={4} rotation={[0, 0, 0]}>
          <meshStandardMaterial map={foreGround} transparent={true} metalness={0.4} />
        </Plane>

        <group position={[0, 13, -23]} scale={0.6}>
          <Center>
            <Text3D
              castShadow={false}
              font={'/images/course/font.json'}
              curveSegments={32}
              bevelEnabled
              bevelSize={0.04}
              bevelThickness={1.5}
              height={0.5}
              lineHeight={0.5}
              letterSpacing={-0.06}
              size={2}>
              LET'S ROCK AND ROLL
              <meshStandardMaterial color="#EC4899" />
            </Text3D>
          </Center>
          <Center position={[0, -2.5, 0]}>
            <Text3D
              castShadow={false}
              font={'/images/course/font.json'}
              curveSegments={32}
              bevelEnabled
              bevelSize={0.05}
              bevelThickness={1.5}
              height={0.5}
              lineHeight={0.5}
              letterSpacing={-0.06}
              size={2}>
              NINJA STYLE!
              <meshStandardMaterial color="#DE0BF5" />
            </Text3D>
          </Center>
        </group>

        {pathLength && (
          <>
            <FretBoard
              position={[0, 27.9, 0]}
              lessonSpacing={lessonSpacing}
              lessonNumber={lessonNumber}
              pathLength={pathLength}
            />

            {<FinalScene pathLength={pathLength} courseCompleted={courseCompleted} />}
          </>
        )}

        <ModulePath
          modulesSection={modules}
          lessonSpacing={lessonSpacing}
          courseCompleted={courseCompleted}
          purchaseType={purchaseType}
          onBackToCurrentLesson={handleOnBackToCurrentLesson}
          onOpenLesson={(lesson: LessonButton) => handleOnLesson(lesson)}
          onUpdated={data => handleUpdate(data)}
        />
      </group>
    </>
  );
};
