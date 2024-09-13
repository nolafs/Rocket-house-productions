import * as THREE from 'three';
import React, { useEffect, useMemo, useState } from 'react';
import { Plane, useScroll, useTexture } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useFrame, useThree, extend, ReactThreeFiber } from '@react-three/fiber';
import { CloudCover } from './cloud-cover';
import { Button3d } from './button';
import { FredBoard } from './course-section';
import { Lesson, Module } from '@prisma/client';
import Clouds from './cloud-scene';

extend({ MeshLineGeometry, MeshLineMaterial });

type LessonType = Lesson & { category: { name: string } };

type ModuleSection = Module & { lessons: LessonType[] };

interface LandscapeProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  modules: ModuleSection[];
  ref?: any;
  lessonSpacing: number;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

export const Landscape = ({ modules, lessonSpacing, rotation, position, ref, ...rest }: LandscapeProps) => {
  const { width, height } = useThree(state => state.viewport);
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const scroll = useScroll();
  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');

  // get number of lessons

  console.log('modules:', modules);

  const lessonNumber = useMemo(() => {
    return modules.reduce((acc, item) => acc + item.lessons.length, 0);
  }, modules);

  useFrame((state, delta) => {
    //ref.current.position.y = -(scroll.offset * (height * scroll.pages));
    state.camera.position.z = 130 - scroll.range(0, 1 / scroll.pages) * 60;
    state.camera.position.y = scroll.offset * (height * scroll.pages);
    //state.camera.rotation.x = 0.1;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} {...rest}>
      <CloudCover position={[0, 5, -30]} />

      <Plane args={[20, 17]} position={[0, 3, -25]} scale={2} rotation={[0, 0, 0]}>
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

      <FredBoard position={[0, 0, 0]} lessonSpacing={lessonSpacing} lessonNumber={lessonNumber} />

      <ModuleButtons modulesSection={modules} lessonSpacing={lessonSpacing} onButtonPositionsChange={setPathPoints} />
      <group position={[0, 15, -24]}>
        {/* Render the path based on button positions */}
        {pathPoints.length > 0 && <Path points={pathPoints} />}
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
            return (
              <Button3d
                key={lesson.slug}
                moduleColor={item.color || 'white'}
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

const Path: React.FC<{ points: Point[] }> = ({ points }) => {
  // Ensure there are enough points to create a line
  if (points.length < 2) return null;

  // Convert points to Vector3 and create a curve
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y, p.z)));

  // Generate points along the curve
  const curvePoints = curve.getPoints(300); // 300 segments for smoothness

  // Convert curve points to flat array format
  const flatPoints = curvePoints.flatMap(point => [point.x, point.y, point.z]);

  console.log('curvePoints:', curvePoints);

  return (
    <mesh>
      <meshLineGeometry points={curvePoints} />
      <meshLineMaterial
        transparent
        lineWidth={2}
        color={new THREE.Color('white')}
        depthWrite={false}
        dashArray={0.0025}
        dashRatio={0.4}
        toneMapped={false}
      />
    </mesh>
  );
};
