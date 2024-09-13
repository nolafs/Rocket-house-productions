import React, { useMemo, useRef } from 'react';
import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CloudCover } from './cloud-cover';
import { Button3d } from './button';
import { FredBoard } from './course-section';
import { Lesson, Module } from '@prisma/client';
import Clouds from './cloud-scene';

type ModuleSection = Module & { lessons: Lesson[] };

interface LandscapeProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  modules: ModuleSection[];
  ref?: any;
  lessonSpacing: number;
}

export const Landscape = ({ modules, lessonSpacing, rotation, position, ref, ...rest }: LandscapeProps) => {
  const { width, height } = useThree(state => state.viewport);
  const scroll = useScroll();
  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');

  // get number of lessons

  const lessonNumber = useMemo(() => {
    return modules.reduce((acc, item) => acc + item.lessons.length, 0);
  }, modules);

  useFrame((state, delta) => {
    //ref.current.position.y = -(scroll.offset * (height * scroll.pages));
    state.camera.position.z = 130 - scroll.range(0, 1 / scroll.pages) * 60;
    state.camera.position.y = scroll.offset * (height * scroll.pages);
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

      <ModuleButtons modulesSection={modules} lessonSpacing={lessonSpacing} />
    </group>
  );
};

export const ModuleButtons = ({
  modulesSection,
  lessonSpacing = 7,
  position,
  rotation,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  lessonSpacing?: number;
  modulesSection?: ModuleSection[];
}) => {
  if (!modulesSection) return null;

  console.log(modulesSection);
  const lessonCount = 0;

  return (
    <group position={[0, 15, -25]}>
      {modulesSection.reduce((acc: JSX.Element[], item, moduleIndex) => {
        return [
          ...acc,
          ...item.lessons.map((lesson: Lesson, lessonIndex) => {
            const count = acc.length + lessonIndex + 1;
            return (
              <Button3d
                key={lesson.slug}
                lessonName={lesson.title}
                lessonUrl={`/courses/kgd-book-1/modules/${item.slug}/lessons/${lesson.slug}`}
                position={[0, lessonSpacing * count, 0]}
              />
            );
          }),
        ];
      }, [])}
    </group>
  );
};
