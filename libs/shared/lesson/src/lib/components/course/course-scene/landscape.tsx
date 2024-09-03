import React, { useRef } from 'react';
import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CloudCover } from './cloud-cover';
import { Button3d } from './button';
import { CourseSection } from './course-section';

export const Landscape = ({ ...props }) => {
  const ref = useRef<any>();
  const { width, height } = useThree(state => state.viewport);
  const scroll = useScroll();
  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');
  const bgGround = useTexture('/images/course/lessons-bg.webp');

  //texture.encoding = THREE.sRGBEncoding;
  //texture.anisotropy = 16;

  useFrame((state, delta) => {
    ref.current.position.y = -(scroll.offset * (height * scroll.pages));
    state.camera.position.z = 130 - scroll.range(0, 1 / (scroll.pages + 1)) * 60;
    //state.camera.rotation.x = 0 + scroll.range(0, 1 / scroll.pages) * 0.3;
  });

  return (
    <group ref={ref} {...props}>
      <CloudCover position={[0, 5, -30]} />

      <Plane args={[20, 17]} position={[0, 0, -25]} scale={2} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={guitar} color={0xffffff} transparent={true} metalness={0.4} />
      </Plane>
      <Plane args={[17, 10]} position={[0, 0, 0]} scale={4} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={midGround} transparent={true} metalness={0.4} />
      </Plane>
      <Plane args={[17, 10]} position={[0, 2, 10]} scale={4} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={foreGround} transparent={true} metalness={0.4} />
      </Plane>

      <CourseSection position={[0, 0, -200]} />

      <Button3d position={[0, 20, -24]} />
    </group>
  );
};
