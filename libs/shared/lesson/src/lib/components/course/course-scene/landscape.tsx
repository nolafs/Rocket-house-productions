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

extend({ MeshLineGeometry, MeshLineMaterial });

type LessonType = Lesson & { category: { name: string } };

type ModuleSection = Module & { lessons: LessonType[] };

interface LandscapeProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  modules: ModuleSection[];
  lessonSpacing: number;
  onLandscapeHeightChange?: (height: number) => void;
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
  ...rest
}: LandscapeProps) => {
  const { width, height } = useThree(state => state.viewport);
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [pathLength, setPathLength] = useState<number>(0);
  const [completedPath, setCompletedPath] = useState<Point[]>([]);
  const [currentLessonNumber, setCurrentLessonNumber] = useState(10);
  const scroll = useScroll();
  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');
  const ref = React.useRef<THREE.Group>(null);
  const camera = useRef<THREE.Camera | null>(null);

  // get number of lessons

  console.log('modules:', modules);

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

    //state.camera.rotation.x = 0.1;
  });

  useEffect(() => {
    if (pathPoints.length) {
      const completedPath = pathPoints.slice(0, currentLessonNumber);
      setCompletedPath(completedPath);
    }
  }, [pathPoints, currentLessonNumber]);

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
    <group ref={ref} position={position} rotation={rotation} {...rest}>
      <CloudCover position={[0, 5, -30]} />

      <Plane args={[20, 17]} position={[0, 3, -25.2]} scale={2} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={guitar} color={0xffffff} transparent={true} metalness={0.4} />
      </Plane>
      <Plane args={[17, 10]} position={[0, 0, 0]} scale={4} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={midGround} transparent={true} metalness={0.4} />
      </Plane>
      <Plane args={[17, 10]} position={[0, 2, 10]} scale={4} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={foreGround} transparent={true} metalness={0.4} />
      </Plane>

      <group position={[0, 0, -300]}>
        <Clouds width={80} height={300} depth={300} numClouds={100} />
      </group>

      <FretBoard
        position={[0, 0, 0]}
        lessonSpacing={lessonSpacing}
        lessonNumber={lessonNumber}
        pathLength={pathLength}
      />

      <FinalScene pathLength={pathLength} />

      <ModuleButtons modulesSection={modules} lessonSpacing={lessonSpacing} onButtonPositionsChange={setPathPoints} />

      <group position={[0, 15, -24]}>
        {/* Render the path based on button positions */}
        {pathPoints.length > 0 && <Path points={pathPoints} opacity={0.5} onPathLength={setPathLength} />}
        {completedPath.length > 0 && <Path points={completedPath} />}
      </group>
    </group>
  );
};

const ModuleButtons: React.FC<{
  modulesSection: ModuleSection[];
  lessonSpacing?: number;
  onButtonPositionsChange: (positions: Point[]) => void;
}> = ({ modulesSection, lessonSpacing = 7, onButtonPositionsChange }) => {
  const [buttonPositions, setButtonPositions] = useState<Point[]>([]);

  let currentModule: Module | null = null;

  useEffect(() => {
    // Update button positions when the modulesSection changes
    const positions = modulesSection.reduce((acc: Point[], item, moduleIndex) => {
      return [
        ...acc,
        ...item.lessons.map((lesson: Lesson, lessonIndex) => {
          const count = acc.length + lessonIndex + 1;
          return {
            x: lessonIndex % 2 ? -1 : 1,
            y: lessonSpacing * count,
            z: 0,
          };
        }),
      ];
    }, []);
    setButtonPositions(positions);
    onButtonPositionsChange(positions);
  }, [modulesSection, lessonSpacing, onButtonPositionsChange]);

  return (
    <group position={[0, 15, -23.4]}>
      {modulesSection.reduce((acc: JSX.Element[], item, moduleIndex) => {
        return [
          ...acc,
          ...item.lessons.map((lesson: LessonType, lessonIndex) => {
            const count = acc.length + lessonIndex + 1;

            if (currentModule?.id !== item.id) {
              currentModule = item;
              console.log('currentModule:', currentModule);

              return (
                <>
                  <ModuleLabel
                    key={item.slug}
                    position={[0, lessonSpacing * count - 3.5, 0]}
                    rotation={[0, 0, 0]}
                    module={item}
                  />
                  <Button3d
                    key={lesson.slug}
                    lessonId={lesson.id}
                    moduleColor={item.color || 'white'}
                    lessonName={lesson.title}
                    lessonType={lesson.category.name}
                    lessonUrl={`/courses/kgd-book-1/modules/${item.slug}/lessons/${lesson.slug}`}
                    position={[lessonIndex % 2 ? -1 : 1, lessonSpacing * count, 0]}
                  />
                </>
              );
            }

            return (
              <Button3d
                key={lesson.slug}
                moduleColor={item.color || 'white'}
                lessonId={lesson.id}
                lessonName={lesson.title}
                lessonType={lesson.category.name}
                lessonUrl={`/courses/kgd-book-1/modules/${item.slug}/lessons/${lesson.slug}`}
                position={[lessonIndex % 2 ? -1 : 1, lessonSpacing * count, 0]}
              />
            );
          }),
        ];
      }, [])}
    </group>
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
  );
};
