import * as THREE from 'three';
import { Plane, useCursor, useTexture } from '@react-three/drei';
import { ModulePosition } from './course.types';
import { useCourseProgressionStore, useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AvailableAward } from '@rocket-house-productions/store';
import { ModuleAttachmemtType } from '@prisma/client';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface ModuleAwardsProps {
  modulePosition?: ModulePosition[];
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
      <group ref={groupRef} position={[9, 0, 0]}>
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
};

type DownloadCollection = {
  position: THREE.Vector3;
  downloads: ModuleAttachment[] | [];
};

export function ModuleAwards({ modulePosition }: ModuleAwardsProps) {
  const { getAwards, modules, getAttachment } = useModuleProgressStore(store => store);
  const { courses, getCurrentCourse } = useCourseProgressionStore(store => store);
  const [awardCollection, setAwardCollection] = useState<AwardCollection[] | null>(null);

  useEffect(() => {
    const awards = getAwards();

    if (!awards) return;

    if (awards.length !== 0 && modulePosition?.length !== 0 && modulePosition !== undefined) {
      const awardsData: AwardCollection[] = modulePosition.reduce((acc: AwardCollection[], item) => {
        const award = awards.find((awardItem: AvailableAward) => awardItem.moduleId === item.id);
        const attachment = getAttachment(item.id);

        const certificates: ModuleAttachment[] = attachment?.filter(att => att.attachmentType.name === 'Certificate');

        if (award) {
          acc.push({
            ...award,
            certificates: certificates,
            position: item.position,
          });
        }
        return acc;
      }, []);

      setAwardCollection(prevState => awardsData);
    }
  }, [modulePosition, modules]);

  const downloadCollection = useMemo(() => {
    const course = getCurrentCourse();
    if (!course) return null;
    if (modulePosition?.length !== 0 && modulePosition !== undefined) {
      return modulePosition.map(item => {
        const module = course.modules.find(module => module.id === item.id) as any;
        const downloads: ModuleAttachment[] | null = module?.attachments?.filter(
          (att: any) => att.attachmentType.name === 'Wall Chart',
        );

        return {
          position: item.position,
          downloads: downloads,
        };
      }) as DownloadCollection[];
    }
    return [];
  }, [modulePosition, modules, courses]);

  return (
    <group position={[0, 14, -20]}>
      {awardCollection?.map((item, idx) => {
        if (item?.awardType.badgeUrl) {
          return (
            <group key={item.id} position={awardCollection[idx + 1]?.position || awardCollection[idx]?.position}>
              <AwardPlane image={item.awardType.badgeUrl} />
            </group>
          );
        } else {
          return null;
        }
      })}

      {awardCollection?.map((item, idx) => {
        if (item?.certificates?.length) {
          return (
            <group key={item.id} position={awardCollection[idx + 1]?.position || awardCollection[idx]?.position}>
              {item.certificates.map((attachment, idx) => (
                <DownloadPlane
                  key={attachment.id}
                  url={attachment.url}
                  filename={attachment.name}
                  imageUrl={['/images/course/button_cert_1.png', '/images/course/button_cert_2.png']}
                />
              ))}
            </group>
          );
        } else {
          return null;
        }
      })}

      {downloadCollection?.map((item, idx) => {
        if (item?.downloads?.length) {
          return (
            <group key={'download-' + idx} position={downloadCollection[idx]?.position}>
              {item.downloads.map((attachment, idx) => (
                <DownloadPlane
                  key={attachment.id}
                  url={attachment.url}
                  filename={attachment.name}
                  imageUrl={['/images/course/button_chart_1.png', '/images/course/button_chart_2.png']}
                />
              ))}
            </group>
          );
        } else {
          return null;
        }
      })}
    </group>
  );
}

export default ModuleAwards;
