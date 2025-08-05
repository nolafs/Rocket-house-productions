import { Module } from '@prisma/client';
import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { ModuleLabel } from './module-label';
import { Button3d } from './button';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { extend } from '@react-three/fiber';
import { LessonButton, ModulePosition } from './course.types';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

interface Point {
  x: number;
  y: number;
  z: number;
}

export type ModuleButtonPosition = {
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
  isFree?: boolean;
  position: Point;
  worldPosition?: THREE.Vector3;
};

export type ModuleButtonDisplay = {
  buttons: ModuleButtonPosition[];
  modulePosition: ModulePosition[];
  total: number | null;
  current: number | null;
  next: number | null;
  pathLength?: number | null;
};

export const ModulePath: React.FC<{
  display: ModuleButtonDisplay;
  lessonSpacing?: number;
  onBackToCurrentLesson: () => void;
  courseCompleted?: boolean;
  purchaseType?: string | null;
  onOpenLesson?: (lesson: LessonButton) => void;
}> = ({ display, lessonSpacing = 7, courseCompleted, onBackToCurrentLesson, onOpenLesson, purchaseType = null }) => {
  if (!display) {
    return null;
  }

  const lessonCurrent = display?.current || 0;

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
              onBackToCurrentLesson={onBackToCurrentLesson}
              onOpenLesson={lesson => onOpenLesson && onOpenLesson(lesson)}
              lesson={{
                id: button.id,
                num: button.count,
                name: button.name,
                type: button.type,
                slug: button.slug,
                moduleSlug: button.moduleSlug,
                color: button.color,
                isFree: button.isFree,
              }}
              purchaseType={purchaseType}
              courseCompleted={courseCompleted}
              active={button.active}
              next={button.next}
              position={[button.position.x, button.position.y, button.position.z]}
            />
          </group>
        ))}
      </group>

      {courseCompleted ? (
        <group position={[0, 15, -24.6]}>{fullPath.length > 0 && <Path points={fullPath} opacity={1} />}</group>
      ) : (
        <>
          <group position={[0, 15, -24.2]}>{completePath.length > 0 && <Path points={completePath} />}</group>

          <group position={[0, 15, -24.5]}>
            {unCompletePath.length > 0 && <Path points={unCompletePath} color={'#8896AB'} />}
          </group>
        </>
      )}
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

  const curvePath: CurvePath | null = useMemo(() => {
    if (points.length < 2) return null;

    const threePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(threePoints);

    // Generate points along the curve
    const curvePoints = curve.getPoints(300); // 300 segments for smoothness

    return {
      curvePoints,
      length: curve.getLength(),
    };
  }, [points]);

  return (
    <group frustumCulled={false}>
      {curvePath && (
        <mesh>
          <meshLineGeometry isMeshLine={true} frustumCulled={false} points={curvePath.curvePoints} />

          <meshLineMaterial
            lineWidth={2}
            transparent={true}
            color={new THREE.Color(color)}
            depthWrite={true}
            dashArray={1 / curvePath.length}
            dashRatio={0.4}
            sizeAttenuation={1}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
};

export default ModulePath;
