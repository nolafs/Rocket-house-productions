'use client';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

export const CloudCover = ({ ...props }) => {
  const clouds = useGLTF('/images/course/cloud.glb');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const object: THREE.BufferGeometry = clouds.nodes.cloud.geometry as THREE.BufferGeometry;

  return (
    <group {...props}>
      <mesh geometry={object} position={[25, 0, 0]} scale={0.1}>
        <meshStandardMaterial color={'#ffffff'} metalness={0} roughness={0.4} transparent={true} opacity={0.7} />
      </mesh>
      <mesh geometry={object} scale={0.1} position={[-25, 0, 0]} rotation={[0, -90, -20]}>
        <meshStandardMaterial color={'#ffffff'} metalness={0} roughness={0.4} transparent={true} opacity={0.7} />
      </mesh>

      <mesh geometry={object} scale={0.1} position={[0, -7, 0]} rotation={[0, -90, -20]}>
        <meshStandardMaterial color={'#ffffff'} metalness={0} roughness={0.4} transparent={true} opacity={0.4} />
      </mesh>
    </group>
  );
};
