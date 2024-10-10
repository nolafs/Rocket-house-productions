import * as THREE from 'three';
import React, { MutableRefObject, useRef, useState } from 'react';
import { Center, Plane, Text3D, useCamera, useTexture } from '@react-three/drei';

import { useFrame, useThree } from '@react-three/fiber';
import { FretBoard } from './fretboard';
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

interface LandscapeProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  display: ModuleButtonDisplay;
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
  display,
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
  const guitar = useTexture('/images/course/guitar.webp');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');
  const ref = React.useRef<THREE.Group>(null);
  const { camera } = useThree();

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      console.log('[Landscape] useGSAP');
      console.log('[Landscape] useGSAP', !container?.current);
      console.log('[Landscape] useGSAP', !display?.pathLength);
      console.log('[Landscape] useGSAP', !camera);

      if (!container?.current) {
        return;
      }

      if (!display?.pathLength) {
        return;
      }

      if (!camera) {
        return;
      }

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      const currentLesson = display.buttons[display.next || 0].position.y;

      const tl = gsap.timeline({ paused: false });

      const mm = gsap.matchMedia();

      console.log('[Landscape] useGSAP - setup scroll');

      mm.add('(max-width: 767px)', () => {
        if (!camera) {
          return;
        }
        tl.set(camera.position, { z: 400, y: 35 });
        tl.to(camera.position, {
          z: 120,
          y: 25,
          duration: 0.09,
          ease: 'none',
        });
      });

      mm.add('(min-width: 767px)', () => {
        if (!camera) {
          return;
        }
        tl.to(camera.position, {
          z: 90,
          y: 20,
          duration: 0.1,
          ease: 'none',
        });
      });

      if (!courseCompleted) {
        tl.to(camera.position, {
          y: display.pathLength,
          duration: 1,
          ease: 'none',
        });

        scrollTriggerRef.current = ScrollTrigger.create({
          animation: tl,
          trigger: container.current,
          pin: true,
          scrub: 1,
          end: `+=${display.pathLength * SCROLL_FACTOR} `,
        });

        handleOnBackToCurrentLesson();
      } else {
        tl.to(camera.position, {
          y: display.pathLength + FINAL_SCENE,
          duration: 1,
          ease: 'none',
        });

        scrollTriggerRef.current = ScrollTrigger.create({
          animation: tl,
          trigger: container.current,
          pin: true,
          scrub: 1,
          end: `+=${(display.pathLength + FINAL_SCENE) * SCROLL_FACTOR} `,
        });

        if (typeof window !== 'undefined') {
          gsap.to(window, {
            duration: 5,
            scrollTo: { y: (display.pathLength + FINAL_SCENE) * SCROLL_FACTOR },
            delay: 0.5,
            ease: 'Power2.inOut',
          });
        }
      }

      console.log('[Landscape] useGSAP - setup scroll done');

      onReady && onReady(true);

      return () => {
        ScrollTrigger.killAll();
        scrollTriggerRef.current = null;
      };
    },
    { scope: container, dependencies: [display, camera] },
  );

  const handleOnLesson = contextSafe((lesson: LessonButton) => {
    if (!camera) {
      return;
    }

    gsap.to(camera.position, { z: 100, duration: 1, ease: 'power2.in' });
    onOpenLesson && onOpenLesson(lesson);
  });

  const handleOnBackToCurrentLesson = contextSafe(() => {
    if (!display.pathLength) {
      return;
    }

    if (typeof window !== 'undefined') {
      const currentLesson = (display.buttons[display.next || 0].position.y + 10) * SCROLL_FACTOR;
      const scrollLength = display.pathLength * SCROLL_FACTOR;
      const percentage = (currentLesson / scrollLength) * 100;

      const positionFromPercent = (percentage / 100) * scrollLength;
      const offset = window.innerHeight * 0.35;

      gsap.to(window, {
        duration: 3,
        scrollTo: { y: positionFromPercent + offset },
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
  });

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

        <group position={[0, 10, 5]} scale={1}>
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

        <FretBoard
          position={[0, 27.9, 0]}
          lessonSpacing={lessonSpacing}
          lessonNumber={display.buttons.length}
          pathLength={display.pathLength}
        />

        <FinalScene pathLength={display.pathLength} courseCompleted={courseCompleted} />

        <ModulePath
          display={display}
          lessonSpacing={lessonSpacing}
          courseCompleted={courseCompleted}
          purchaseType={purchaseType}
          onBackToCurrentLesson={handleOnBackToCurrentLesson}
          onOpenLesson={(lesson: LessonButton) => handleOnLesson(lesson)}
        />
      </group>
    </>
  );
};
