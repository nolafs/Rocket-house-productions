import { Lesson, Module } from '@prisma/client';
import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLessonProgressionStore } from '@rocket-house-productions/providers';
import { ModuleLabel } from './module-label';
import { Button3d } from './button';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { extend, Object3DNode, MaterialNode } from '@react-three/fiber';
import { LessonButton, LessonType, ModuleSection } from './course.types';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

interface Point {
  x: number;
  y: number;
  z: number;
}

type ModuleButtonPosition = {
  id: string;
  name: string;
  count: number;
  active?: boolean;
  next?: boolean;
  module: Module | null;
  moduleSlug: string;
  color: string;
  type: string;
  slug: string;
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
  onOpenLesson?: (lesson: LessonButton) => void;
}> = ({ modulesSection, lessonSpacing = 7, onUpdated, onOpenLesson }) => {
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
              name: lesson.title,
              count,
              active: complete || next === count,
              next: next === count,
              module: moduleSection,
              color: item.color || 'white',
              type: lesson.category.name,
              slug: lesson.slug || '',
              moduleSlug: item.slug || '',
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

  const lessonCurrent = display.current || 0;

  const fullPath: Point[] = display.buttons?.map(p => p.position);
  const unCompletePath = fullPath.slice(lessonCurrent - 1 || 0);
  const completePath = fullPath.slice(0, lessonCurrent);

  return (
    <>
      <group position={[0, 15, -24]}>
        {display.buttons?.map((button, index) => (
          <group key={button.id}>
            {button.module && (
              <ModuleLabel
                key={button.module.slug}
                position={[0, lessonSpacing * button.count - 3.5, -0.7]}
                rotation={[0, 0, 0]}
                module={button.module}
              />
            )}
            <Button3d
              onOpenLesson={lesson => onOpenLesson && onOpenLesson(lesson)}
              lesson={{
                id: button.id,
                num: button.count,
                name: button.name,
                type: button.type,
                slug: button.slug,
                moduleSlug: button.moduleSlug,
                color: button.color,
              }}
              active={button.active}
              next={button.next}
              position={[button.position.x, button.position.y, button.position.z]}
            />
          </group>
        ))}
      </group>

      <group position={[0, 15, -24.6]}>
        {fullPath.length > 0 && (
          <Path points={fullPath} opacity={0.0} color={'#8896AB'} onPathLength={length => setPathLength(length)} />
        )}
      </group>
      <group position={[0, 15, -24.5]}>{completePath.length > 0 && <Path points={completePath} />}</group>
      <group position={[0, 15, -24.5]}>
        {unCompletePath.length > 0 && <Path points={unCompletePath} color={'#8896AB'} />}
      </group>
    </>
  );
};

type CurvePath = {
  curvePoints: THREE.Vector3[];
  length: number;
};

const Path: React.FC<{
  points: Point[];
  opacity?: number;
  color?: string;
  onPathLength?: (length: number) => void;
}> = ({ points, opacity = 1, color = 'white', onPathLength }) => {
  // Ensure there are enough points to create a line

  const [pathLength, setPathLength] = React.useState<number | null>(null);

  const curvePath: CurvePath | null = useMemo(() => {
    if (points.length < 2) return null;

    const threePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(threePoints);

    // Generate points along the curve
    const curvePoints = curve.getPoints(300); // 300 segments for smoothness

    console.log('CURVE POINTS:', curvePoints.length);
    console.log('curve:', curve.getLength());

    return {
      curvePoints,
      length: curve.getLength(),
    };
  }, [points]);

  useEffect(() => {
    if (!curvePath) return;
    setPathLength(curvePath.length);
    onPathLength && onPathLength(curvePath.length);
  }, [curvePath]);

  return (
    <>
      {pathLength && (
        <mesh>
          {/* @ts-expect-error type not register */}
          <meshLineGeometry points={curvePath.curvePoints} castShadow={true} />

          <meshLineMaterial
            transparent
            lineWidth={1.5}
            color={new THREE.Color(color)}
            depthWrite={false}
            dashArray={1 / pathLength}
            dashRatio={0.4}
            opacity={opacity}
            sizeAttenuation={1}
            toneMapped={false}
          />
        </mesh>
      )}
    </>
  );
};

export default ModulePath;