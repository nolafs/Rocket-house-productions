import { useGLTF, Svg, useCursor, Html } from '@react-three/drei';
import { useState } from 'react';
import { easing, geometry } from 'maath';
import { extend } from '@react-three/fiber';

extend(geometry);

export const Button3d = ({ ...props }) => {
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  const button = useGLTF('/images/course/button.gltf');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const object = button.nodes.button.geometry;

  return (
    <group {...props} onPointerOver={e => hover(true)} onPointerLeave={e => hover(false)}>
      <Svg src={'/images/course/arrow.svg'} position={[-0.3, 0.4, 0.15]} scale={0.023} />
      <mesh geometry={object} scale={0.005} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color={!hovered ? '#c17e0c' : '#bd1368'} metalness={0} roughness={0.4} />
      </mesh>
    </group>
  );
};

export const Tooltip = ({ children }: any) => {
  return (
    <Html position={[0, 1.3, 0]} rotation={[0, 0, 0]} transform>
      <div className={'justify-center rounded-sm bg-gray-100 p-2 text-center text-black'}>{children}</div>
    </Html>
  );
};
