import * as THREE from 'three';
import { Plane, Text, useTexture } from '@react-three/drei';
import { ModulePosition } from './course.types';
import { useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect, useMemo, useState } from 'react';
import { AvailableAward } from '@rocket-house-productions/store';

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

type AwardCollection = AvailableAward & { position: THREE.Vector3 };

export function ModuleAwards({ modulePosition, pathLength }: ModuleAwardsProps) {
  const awards = useModuleProgressStore(store => store.getAwards());

  const awardCollection = useMemo(() => {
    if (!awards) return;
    if (awards.length !== 0) {
      const awardsList: AwardCollection[] = modulePosition.reduce((acc: AwardCollection[], item) => {
        const award = awards.find(award => award.moduleId === item.id);
        if (award) {
          acc.push({
            ...award,
            position: item.position,
          });
        }
        return acc;
      }, []);

      return awardsList;
    }
    return [];
  }, [awards]);

  if (!awardCollection) return null;
  if (!awardCollection?.length) return null;

  console.log('AWARDS LIST:', awardCollection);

  return awardCollection.map(
    (item, idx) =>
      item?.awardType.badgeUrl && (
        <group key={item.id} position={awardCollection[idx + 1]?.position || pathLength}>
          <AwardPlane image={item.awardType.badgeUrl} />;
        </group>
      ),
  );
}

export default ModuleAwards;
