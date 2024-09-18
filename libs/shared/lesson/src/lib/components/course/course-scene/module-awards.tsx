import * as THREE from 'three';
import { Plane, Text } from '@react-three/drei';
import { ModulePosition } from './course.types';

interface ModuleAwardsProps {
  modulePosition: ModulePosition[];
  pathLength?: THREE.Vector3;
}

export function ModuleAwards({ modulePosition, pathLength }: ModuleAwardsProps) {
  return modulePosition.map((item, idx) => (
    <group position={modulePosition[idx + 1]?.position || pathLength}>
      <Plane args={[2, 2]} position={[-10, 0, 0]} />
      <Text color="black" scale={0.3} anchorX="center" anchorY="middle" position={[-5, 0, 0.3]} castShadow={true}>
        Award: {item.name}
      </Text>
    </group>
  ));
}

export default ModuleAwards;
