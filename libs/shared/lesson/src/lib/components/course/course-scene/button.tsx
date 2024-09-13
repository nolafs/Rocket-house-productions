import { useGLTF, Svg, useCursor, Html, Billboard, RoundedBox, Text } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { depth } from 'three/src/nodes/display/ViewportDepthNode';

interface ButtonProps {
  rotation?: [number, number, number];
  position: [number, number, number];
  lessonName: string;
  lessonUrl: string;
}

export const Button3d = ({ rotation, position, lessonName, lessonUrl, ...rest }: ButtonProps) => {
  const [hovered, hover] = useState(false);

  useCursor(hovered);

  const router = useRouter();
  const { nodes } = useGLTF('/images/course/button.gltf');

  return (
    <group
      position={position}
      rotation={rotation || [0, 0, 0]}
      {...rest}
      onClick={e => {
        router.push(lessonUrl);
      }}
      onPointerOver={e => hover(true)}
      onPointerLeave={e => hover(false)}>
      <Tooltip position={[0, 2.3, 0]} isVisible={hovered} rotation={[0, 0, 0]} scale={0.5}>
        {lessonName}
      </Tooltip>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Svg
          src={'/images/course/arrow.svg'}
          position={[-0.45, 0.5, 0.65]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.04}></Svg>
        <mesh geometry={(nodes['button'] as THREE.Mesh).geometry} scale={0.009}>
          <meshStandardMaterial color={!hovered ? '#c17e0c' : '#bd1368'} metalness={0} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

interface TooltipProps {
  children: any;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  isVisible?: boolean;
}

export const Tooltip = ({ children, position, rotation, scale, isVisible = true }: TooltipProps) => {
  const textRef = useRef();
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (textRef.current) {
      const box = new THREE.Box3().setFromObject(textRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      //console.log(size);
      setSize({ width: size.x * 2 + 1.5, height: size.y * 2 + 1.5 });
    }
  }, [children, isVisible]);

  return (
    <group position={position} rotation={rotation} scale={scale} visible={isVisible}>
      <Text ref={textRef} color="black" anchorX="center" anchorY="middle" position={[0, 0, 1]} castShadow={true}>
        {children}
      </Text>
      {size && (
        <RoundedBox
          position={[0, 0, 0.5]}
          args={[size.width, size.height, 0.5]}
          radius={0.5}
          bevelSegments={4}
          castShadow={true}>
          <meshStandardMaterial color="white" transparent />
        </RoundedBox>
      )}
    </group>
  );
};