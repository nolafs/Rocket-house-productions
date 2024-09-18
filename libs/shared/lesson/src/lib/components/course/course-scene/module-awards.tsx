import * as THREE from 'three';
import { Plane, Text, useTexture } from '@react-three/drei';
import { ModulePosition } from './course.types';
import { useModuleProgressStore } from '@rocket-house-productions/providers';

interface ModuleAwardsProps {
  modulePosition: ModulePosition[];
  pathLength?: THREE.Vector3;
}

const AwardPlane = ({ image }: { image: string }) => {
  const texture = useTexture(image);

  if (texture) {
    return (
      <Plane args={[3, 3]} position={[-6, 0, 0]}>
        <meshStandardMaterial map={texture} transparent={true} />
      </Plane>
    );
  }
};

export function ModuleAwards({ modulePosition, pathLength }: ModuleAwardsProps) {
  const awards = useModuleProgressStore(store => store.getAwards());

  const getAwardImage = (moduleId: string) => {
    const award = awards.find(award => award.moduleId === moduleId);
    console.log('AWARD:', award?.awardType.badgeUrl);
    console.log('AWARD: RENDER', awards);
    try {
      if (award?.awardType.badgeUrl) {
        return <AwardPlane image={award.awardType.badgeUrl} />;
      }
    } catch (e) {
      console.log('ERROR:', e);
    }
    return null;
  };

  return modulePosition.map((item, idx) => (
    <group position={modulePosition[idx + 1]?.position || pathLength}>{getAwardImage(item.id)}</group>
  ));
}

export default ModuleAwards;
