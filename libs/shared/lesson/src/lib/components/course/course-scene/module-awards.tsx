import * as THREE from 'three';
import { Plane, Text, useCursor, useTexture } from '@react-three/drei';
import { ModulePosition } from './course.types';
import { useModuleProgressStore } from '@rocket-house-productions/providers';
import { useMemo, useRef, useState } from 'react';
import { AvailableAward } from '@rocket-house-productions/store';
import { ModuleAttachmemtType } from '@prisma/client';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface ModuleAwardsProps {
  modulePosition: ModulePosition[];
  pathLength?: THREE.Vector3;
}

const AwardPlane = ({ image }: { image: string }) => {
  const texture = useTexture(image);

  if (texture) {
    return (
      <Plane args={[7, 7]} position={[-9, -2, 0]}>
        <meshStandardMaterial map={texture} transparent={true} />
      </Plane>
    );
  }
};

const DownloadPlane = ({ filename, url, imageUrl }: { filename: string; url: string; imageUrl: string[] }) => {
  const texture1 = useTexture(imageUrl[0]);
  const texture2 = useTexture(imageUrl[1]);
  const [hovered, hover] = useState(false);
  const buttonRef = useRef<THREE.Group>(null);
  const labelRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [downloading, setDownloading] = useState(false);
  useCursor(hovered);

  useGSAP(
    () => {
      if (!groupRef.current) return;
      if (!labelRef.current) return;
      gsap.to(labelRef.current?.rotation, { duration: 2, z: Math.PI, repeat: -1, ease: 'none' });
    },
    { scope: labelRef },
  );

  useGSAP(
    () => {
      if (!buttonRef.current || !labelRef.current) return;
      if (!hovered) {
        gsap.to(buttonRef.current?.position, { duration: 0.2, z: 0, ease: 'Bounce.in(3)' });
        gsap.to(labelRef.current?.position, { duration: 0.2, z: 0, ease: 'Bounce.in(3)' });
      } else {
        gsap.to(buttonRef.current?.position, { duration: 0.5, z: 2, ease: 'back.inOut(3)' });
        gsap.to(labelRef.current?.position, { duration: 0.5, z: 2, ease: 'back.inOut(3)' });
      }
    },
    { scope: buttonRef, dependencies: [hovered] },
  );

  const onHandleClick = async () => {
    if (downloading) return;

    setDownloading(true);

    if (buttonRef.current) {
      gsap.to(buttonRef.current?.position, { duration: 0.5, z: -1, repeat: 1, yoyo: true, ease: 'back.in(3)' });
    }

    const response = await axios.post(
      `/api/download`,
      {
        url: url,
        filename: filename,
      },
      {
        responseType: 'blob',
      },
    );

    filename = encodeURIComponent(filename.trim().replace(/\s+/g, '-'));

    setDownloading(false);

    saveAs(response.data, `${filename}.pdf`);
  };

  if (texture1 && texture2) {
    return (
      <group ref={groupRef} position={[9, -4, 0]}>
        <group ref={buttonRef}>
          <Plane
            args={[3, 3]}
            onPointerOver={e => hover(true)}
            onPointerLeave={e => hover(false)}
            onClick={e => onHandleClick()}>
            <meshStandardMaterial map={texture1} transparent={true} />
          </Plane>
        </group>
        <group ref={labelRef}>
          <Plane
            args={[4, 4]}
            position={[0, 0, 0.1]}
            onPointerOver={e => hover(true)}
            onPointerLeave={e => hover(false)}
            onClick={e => onHandleClick()}>
            <meshStandardMaterial map={texture2} transparent={true} />
          </Plane>
        </group>
      </group>
    );
  }
};

type ModuleAttachment = {
  id: string;
  name: string;
  url: string;
  attachmentType: ModuleAttachmemtType;
};

type AwardCollection = AvailableAward & {
  position: THREE.Vector3;
  certificates: ModuleAttachment[] | [];
  downloads: ModuleAttachment[] | [];
};

export function ModuleAwards({ modulePosition, pathLength }: ModuleAwardsProps) {
  const { getAwards, getAttachment } = useModuleProgressStore(store => store);

  const awardCollection = useMemo(() => {
    const awards = getAwards();

    if (!awards) return;
    if (awards.length !== 0) {
      const awardsList: AwardCollection[] = modulePosition.reduce((acc: AwardCollection[], item) => {
        const award = awards.find(award => award.moduleId === item.id);
        const attachment = getAttachment(item.id);
        const certificates: ModuleAttachment[] = attachment?.filter(att => att.attachmentType.name === 'Certificate');
        const downloads: ModuleAttachment[] | null = attachment?.filter(
          att => att.attachmentType.name === 'Wall Chart',
        );
        if (award) {
          acc.push({
            ...award,
            certificates: certificates,
            downloads: downloads,
            position: item.position,
          });
        }
        return acc;
      }, []);

      return awardsList;
    }
    return [];
  }, [getAwards, getAttachment]);

  if (!awardCollection) return null;
  if (!awardCollection?.length) return null;

  return (
    <group position={[0, 14, -20]}>
      {awardCollection.map(
        (item, idx) =>
          item?.awardType.badgeUrl && (
            <group key={item.id} position={awardCollection[idx + 1]?.position || awardCollection[idx]?.position}>
              <AwardPlane image={item.awardType.badgeUrl} />;
            </group>
          ),
      )}

      {awardCollection.map(
        (item, idx) =>
          item?.certificates?.length && (
            <group key={item.id} position={awardCollection[idx + 1]?.position || awardCollection[idx]?.position}>
              {item.certificates.map((attachment, idx) => (
                <DownloadPlane
                  url={attachment.url}
                  filename={attachment.name}
                  imageUrl={['/images/course/button_cert_1.png', '/images/course/button_cert_2.png']}
                />
              ))}
            </group>
          ),
      )}

      {awardCollection.map(
        (item, idx) =>
          item?.downloads?.length && (
            <group key={item.id} position={awardCollection[idx]?.position}>
              {item.downloads.map((attachment, idx) => (
                <DownloadPlane
                  url={attachment.url}
                  filename={attachment.name}
                  imageUrl={['/images/course/button_chart_1.png', '/images/course/button_chart_2.png']}
                />
              ))}
            </group>
          ),
      )}
    </group>
  );
}

export default ModuleAwards;
