import { Lesson, Module } from '@prisma/client';
import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLessonProgressionStore } from '@rocket-house-productions/providers';
import { ModuleLabel } from './module-label';
import { Button3d } from './button';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { extend } from '@react-three/fiber';

extend({ MeshLineGeometry, MeshLineMaterial });

type LessonType = Lesson & { category: { name: string } };
type ModuleSection = Module & { lessons: LessonType[] };

interface Point {
  x: number;
  y: number;
  z: number;
}

type ModuleButtonPosition = {
  id: string;
  title: string;
  count: number;
  active?: boolean;
  next?: boolean;
  module: Module | null;
  color: string;
  type: string;
  url: string;
  position: Point;
};

export type ModuleButtonDisplay = {
  buttons: ModuleButtonPosition[];
  total: number | null;
  current: number | null;
  next: number | null;
  pathLength?: number | null;
};

export const ModulePath: React.FC<{
  modulesSection: ModuleSection[];
  lessonSpacing?: number;
  onUpdated?: (data: ModuleButtonDisplay) => void;
}> = ({ modulesSection, lessonSpacing = 7, onUpdated }) => {
  const { getLessonCompleted, getLessonProgress } = useLessonProgressionStore(store => store);
  const [pathLength, setPathLength] = React.useState<number | null>(null);

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
              next: next === count,
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

  useEffect(() => {
    if (!display) return;
    if (pathLength === null) return;

    console.log('MODULE BUTTONS DISPLAY:', display, pathLength);

    onUpdated && onUpdated({ ...display, pathLength });
  }, [display, pathLength]);

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
              next={button.next}
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
        {fullPath.length > 0 && (
          <Path points={fullPath} opacity={0.8} color={'0x8896AB'} onPathLength={length => setPathLength(length)} />
        )}
        {completePath.length > 0 && <Path points={completePath} />}
      </group>
    </>
  );
};

const Path: React.FC<{
  points: Point[];
  opacity?: number;
  color?: string;
  onPathLength?: (length: number) => void;
}> = ({ points, opacity = 1, color = 'white', onPathLength }) => {
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
          color={new THREE.Color(color)}
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

export default ModulePath;
