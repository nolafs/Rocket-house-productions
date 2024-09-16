import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plane, useScroll, useTexture } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useFrame, useThree, extend, ReactThreeFiber } from '@react-three/fiber';
import { CloudCover } from './cloud-cover';
import { Button3d } from './button';
import { FretBoard } from './fretboard';
import { Lesson, Module } from '@prisma/client';
import Clouds from './cloud-scene';
import { FinalScene } from './finish-scene';
import { ModuleLabel } from './module-label';
import CameraMovementTracker from './camerMoveTracker';
import { useLessonProgressionStore } from '@rocket-house-productions/providers';

extend({ MeshLineGeometry, MeshLineMaterial });

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

const calculateCameraHeight = (camera: any, aspectRatio: any) => {
  const frustumHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
  return frustumHeight * aspectRatio;
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
  const [pathLength, setPathLength] = useState<number | null>(null);
  const [completedPath, setCompletedPath] = useState<Point[]>([]);
  const [currentLessonNumber, setCurrentLessonNumber] = useState(10);
  const scroll = useScroll();
  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');
  const ref = React.useRef<THREE.Group>(null);
  const camera = useRef<THREE.Camera | null>(null);
  const [cameraMove, setCameraMove] = useState(false);
  const [ready, setReady] = useState(false);

  console.log('LANDSCAPE MODULES: RENDER');

  const lessonNumber = useMemo(() => {
    return modules.reduce((acc, item) => acc + item.lessons.length, 0);
  }, modules);

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
      camera.current = state.camera;
    }

    if (!ready) {
      setReady(true);
    }
  });

  useEffect(() => {
    if (ready) {
      onReady && onReady(ready);
    }
  }, [ready]);

  useEffect(() => {
    if (ref.current) {
      if (camera.current) {
        const cameraHeight = calculateCameraHeight(camera.current, width / height);

        const box = new THREE.Box3();
        box.setFromObject(ref.current);
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log('camera height:', Math.ceil(size.y / cameraHeight));
        onLandscapeHeightChange && onLandscapeHeightChange(Math.ceil(size.y / cameraHeight));
      } else {
        onLandscapeHeightChange && onLandscapeHeightChange(12);
      }
    }
  }, [camera]);

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

        <ModuleButtons
          modulesSection={modules}
          lessonSpacing={lessonSpacing}
          onPathLength={length => setPathLength(length)}
        />
      </group>
    </>
  );
};

type ModuleButtonPosition = {
  id: string;
  title: string;
  count: number;
  active?: boolean;
  module: Module | null;
  color: string;
  type: string;
  url: string;
  position: Point;
};

type ModuleButtonDisplay = {
  buttons: ModuleButtonPosition[];
  total: number | null;
  current: number | null;
  next: number | null;
};

const ModuleButtons: React.FC<{
  modulesSection: ModuleSection[];
  lessonSpacing?: number;
  onPathLength: (length: number) => void;
}> = ({ modulesSection, lessonSpacing = 7, onPathLength }) => {
  const { getLessonCompleted, getLessonProgress } = useLessonProgressionStore(store => store);

  const currentModule = useRef<Module | null>(null);

  const display = useMemo<ModuleButtonDisplay>(() => {
    let current: number | null = null;
    let next: number | null = null;

    const buttonList: ModuleButtonPosition[] = modulesSection.reduce(
      (acc: ModuleButtonPosition[], item, moduleIndex) => {
        return [
          ...acc,
          ...item.lessons.map((lesson: LessonType, lessonIndex) => {
            const count = acc.length + lessonIndex + 1;
            const complete = getLessonCompleted(lesson.id);
            const progress = getLessonProgress(lesson.id);
            let moduleSection = null;

            if (currentModule.current?.id !== item.id) {
              currentModule.current = item;
              moduleSection = item;
            }

            if (!complete) {
              if (!current) {
                current = count - 1;
              }
              if (!next) {
                next = count;
              }
            }

            return {
              id: lesson.id,
              title: lesson.title,
              count,
              active: complete || next === count,
              module: moduleSection,
              color: item.color || 'white',
              type: lesson.category.name,
              url: `/courses/kgd-book-1/modules/${item.slug}/lessons/${lesson.slug}`,
              position: {
                x: lessonIndex % 2 ? -1 : 1,
                y: lessonSpacing * count,
                z: 0,
              },
            };
          }),
        ];
      },
      [],
    );

    //console.log('MODULE BUTTONS POSITION:', buttonList);
    return {
      buttons: buttonList,
      total: buttonList.length,
      current,
      next,
    };
  }, [modulesSection]);

  if (display && display.buttons?.length === 0) {
    return null;
  }

  const fullPath: Point[] = display.buttons?.map(p => p.position);
  const completePath = fullPath.slice(0, display.current || 0);

  return (
    <>
      <group position={[0, 15, -23.4]}>
        {display.buttons?.map((button, index) => (
          <group key={button.id}>
            {button.module && (
              <ModuleLabel
                key={button.module.slug}
                position={[0, lessonSpacing * button.count - 3.5, 0]}
                rotation={[0, 0, 0]}
                module={button.module}
              />
            )}
            <Button3d
              lessonId={button.id}
              lessonNum={button.count}
              active={button.active}
              moduleColor={button.color || 'white'}
              lessonName={button.title}
              lessonType={button.type}
              lessonUrl={button.url}
              position={[button.position.x, button.position.y, button.position.x]}
            />
          </group>
        ))}
      </group>

      <group position={[0, 15, -24.4]}>
        {fullPath.length > 0 && <Path points={fullPath} opacity={0.5} onPathLength={length => onPathLength(length)} />}
        {completePath.length > 0 && <Path points={completePath} />}
      </group>
    </>
  );
};

const Path: React.FC<{ points: Point[]; opacity?: number; onPathLength?: (length: number) => void }> = ({
  points,
  opacity = 1,
  onPathLength,
}) => {
  // Ensure there are enough points to create a line
  if (points.length < 2) return null;

  // Convert points to Vector3 and create a curve
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y, p.z)));

  // Generate points along the curve
  const curvePoints = curve.getPoints(300); // 300 segments for smoothness

  const pathLength = curve.getLength();
  const dashArray = 1 / pathLength;

  if (onPathLength) {
    onPathLength(pathLength);
  }

  return (
    <>
      <mesh>
        {/* @ts-expect-error type not register */}
        <meshLineGeometry points={curvePoints} castShadow={true} />
        {/* @ts-expect-error type not register */}
        <meshLineMaterial
          transparent
          lineWidth={2}
          color={new THREE.Color('white')}
          depthWrite={false}
          dashArray={dashArray}
          dashRatio={0.5}
          opacity={opacity}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};
