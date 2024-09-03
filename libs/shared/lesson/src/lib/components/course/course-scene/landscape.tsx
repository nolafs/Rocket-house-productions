import React, { useRef } from 'react';
import { Plane, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export const Landscape = ({ ...props }) => {
  const ref = useRef<any>();
  //const { width, height } = useThree(state => state.viewport);
  // const scroll = useScroll();
  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');

  //texture.encoding = THREE.sRGBEncoding;
  //texture.anisotropy = 16;

  useFrame((state, delta) => {
    //ref.current.position.y = -scroll.offset * 100; // Rotate contents
    // state.events.update(); // Raycasts every frame rather than on pointer-move
    //easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta); // Move camera
    // state.camera.lookAt(0, 0, 0); // Look at center
  });

  return (
    <group ref={ref} {...props}>
      <Plane args={[20, 17]} position={[0, 0, -15]} scale={2} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={guitar} color={0xffffff} transparent={true} metalness={0.3} />
      </Plane>
      <Plane args={[17, 10]} position={[0, 0, 0]} scale={4} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={midGround} transparent={true} metalness={0.3} />
      </Plane>
      <Plane args={[17, 10]} position={[0, 2, 10]} scale={4} rotation={[0, 0, 0]}>
        <meshStandardMaterial map={foreGround} transparent={true} metalness={0.3} />
      </Plane>
    </group>
  );
};
