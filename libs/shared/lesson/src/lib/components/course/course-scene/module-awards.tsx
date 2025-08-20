'use client';
import * as THREE from 'three';
import { Plane, useCursor } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useCourseProgressionStore, useModuleProgressStore } from '@rocket-house-productions/providers';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AvailableAward } from '@rocket-house-productions/store';
import { ModuleAttachmemtType } from '@prisma/client';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ModuleButtonDisplay } from './module-path';

// Preload textures at module level using THREE.TextureLoader
const textureLoader = new THREE.TextureLoader();

// Preload common textures
const COMMON_TEXTURES = [
  '/images/course/button_cert_1.png',
  '/images/course/button_cert_2.png',
  '/images/course/button_chart_1.png',
  '/images/course/button_chart_2.png',
];

// Manual preloading function
const preloadTexture = (url: string) => {
  textureLoader.load(url);
};

// Preload common textures on module load
COMMON_TEXTURES.forEach(preloadTexture);

interface ModuleAwardsProps {
  display: ModuleButtonDisplay | null;
}

// Solution 1: Using useLoader with THREE.TextureLoader
const AwardPlane = ({ image }: { image: string }) => {
  // useLoader still uses Suspense internally, but it's more direct
  const texture = useLoader(THREE.TextureLoader, image);

  return (
    <Plane args={[7, 7]} position={[-9, -2, 0]}>
      <meshStandardMaterial map={texture} transparent={true} />
    </Plane>
  );
};

// Solution 2: Manual texture loading without Suspense
const AwardPlaneManual = ({ image }: { image: string }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // Load texture manually without triggering Suspense
    const loader = new THREE.TextureLoader();
    loader.load(
      image,
      loadedTexture => {
        setTexture(loadedTexture);
      },
      undefined,
      error => {
        console.error('Error loading texture:', error);
      },
    );

    // Cleanup
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [image]);

  if (!texture) {
    return null; // Or a loading placeholder
  }

  return (
    <Plane args={[7, 7]} position={[-9, -2, 0]}>
      <meshStandardMaterial map={texture} transparent={true} />
    </Plane>
  );
};

// Solution 3: Using useLoader with preload
const DownloadPlane = ({ filename, url, imageUrl }: { filename: string; url: string; imageUrl: string[] }) => {
  // Preload the textures
  useLoader.preload(THREE.TextureLoader, imageUrl[0]);
  useLoader.preload(THREE.TextureLoader, imageUrl[1]);

  // Then use them (this won't cause issues if preloaded)
  const [texture1, texture2] = useLoader(THREE.TextureLoader, imageUrl);

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
};

// Solution 4: Manual loading for DownloadPlane (no Suspense)
const DownloadPlaneManual = ({ filename, url, imageUrl }: { filename: string; url: string; imageUrl: string[] }) => {
  const [textures, setTextures] = useState<[THREE.Texture | null, THREE.Texture | null]>([null, null]);
  const [hovered, hover] = useState(false);
  const buttonRef = useRef<THREE.Group>(null);
  const labelRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [downloading, setDownloading] = useState(false);
  useCursor(hovered);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let texture1: THREE.Texture | null = null;
    let texture2: THREE.Texture | null = null;

    // Load both textures
    loader.load(imageUrl[0], t => {
      texture1 = t;
      if (texture2) setTextures([texture1, texture2]);
    });

    loader.load(imageUrl[1], t => {
      texture2 = t;
      if (texture1) setTextures([texture1, texture2]);
    });

    // Cleanup
    return () => {
      texture1?.dispose();
      texture2?.dispose();
    };
  }, [imageUrl]);

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

  // Don't render until textures are loaded
  if (!textures[0] || !textures[1]) {
    return null;
  }

  return (
    <group ref={groupRef} position={[9, 0, 0]}>
      <group ref={buttonRef}>
        <Plane
          args={[3, 3]}
          onPointerOver={e => hover(true)}
          onPointerLeave={e => hover(false)}
          onClick={e => onHandleClick()}>
          <meshStandardMaterial map={textures[0]} transparent={true} />
        </Plane>
      </group>
      <group ref={labelRef}>
        <Plane
          args={[4, 4]}
          position={[0, 0, 0.1]}
          onPointerOver={e => hover(true)}
          onPointerLeave={e => hover(false)}
          onClick={e => onHandleClick()}>
          <meshStandardMaterial map={textures[1]} transparent={true} />
        </Plane>
      </group>
    </group>
  );
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

export function ModuleAwards({ display = null }: ModuleAwardsProps) {
  const { getAwards, modules, getAttachment } = useModuleProgressStore(store => store);
  const { courses, getCurrentCourse } = useCourseProgressionStore(store => store);
  const [awardCollection, setAwardCollection] = useState<AwardCollection[] | null>(null);

  useEffect(() => {
    if (!display) return;

    const awards = getAwards();
    if (!awards) return;

    if (awards.length !== 0) {
      const awardsData: AwardCollection[] = display.modulePosition.reduce((acc: AwardCollection[], item) => {
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

      // Preload award textures when collection changes
      awardsData.forEach(item => {
        if (item?.awardType.badgeUrl) {
          useLoader.preload(THREE.TextureLoader, item.awardType.badgeUrl);
        }
      });
    }
  }, [display, modules]);

  const downloadCollection = useMemo(() => {
    if (!display) return;
    const course = getCurrentCourse();
    if (!course) return null;

    if (
      display.modulePosition?.length !== 0 &&
      display.modulePosition !== undefined &&
      display.modulePosition !== null
    ) {
      return display.modulePosition.map(item => {
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
  }, [display, modules, courses]);

  // Use manual loading version to avoid Suspense issues
  const shouldUseManualLoading = true; // Toggle this based on your preference

  return (
    <group position={[0, 14, -20]}>
      {/* Wrap in Suspense if using useLoader, or use manual loading */}
      {shouldUseManualLoading ? (
        <>
          {/* Manual loading version - no Suspense needed */}
          {awardCollection?.map((item, idx) => {
            if (item?.awardType.badgeUrl) {
              return (
                <group key={item.id} position={awardCollection[idx + 1]?.position || [0, display?.pathLength, 0]}>
                  <AwardPlaneManual image={item.awardType.badgeUrl} />
                </group>
              );
            }
            return null;
          })}

          {awardCollection?.map((item, idx) => {
            if (item?.certificates?.length) {
              return (
                <group
                  key={`cert-${item.id}`}
                  position={awardCollection[idx + 1]?.position || [0, display?.pathLength, 0]}>
                  {item.certificates.map(attachment => (
                    <DownloadPlaneManual
                      key={attachment.id}
                      url={attachment.url}
                      filename={attachment.name}
                      imageUrl={['/images/course/button_cert_1.png', '/images/course/button_cert_2.png']}
                    />
                  ))}
                </group>
              );
            }
            return null;
          })}

          {downloadCollection?.map((item, idx) => {
            if (item?.downloads?.length) {
              return (
                <group key={'download-' + idx} position={[2, downloadCollection[idx]?.position.y + 7, 0]}>
                  {item.downloads.map(attachment => (
                    <DownloadPlaneManual
                      key={attachment.id}
                      url={attachment.url}
                      filename={attachment.name}
                      imageUrl={['/images/course/button_chart_1.png', '/images/course/button_chart_2.png']}
                    />
                  ))}
                </group>
              );
            }
            return null;
          })}
        </>
      ) : (
        <>
          {/* useLoader version - needs Suspense */}
          <Suspense fallback={null}>
            {awardCollection?.map((item, idx) => {
              if (item?.awardType.badgeUrl) {
                return (
                  <group key={item.id} position={awardCollection[idx + 1]?.position || [0, display?.pathLength, 0]}>
                    <AwardPlane image={item.awardType.badgeUrl} />
                  </group>
                );
              }
              return null;
            })}
          </Suspense>

          <Suspense fallback={null}>
            {awardCollection?.map((item, idx) => {
              if (item?.certificates?.length) {
                return (
                  <group
                    key={`cert-${item.id}`}
                    position={awardCollection[idx + 1]?.position || [0, display?.pathLength, 0]}>
                    {item.certificates.map(attachment => (
                      <DownloadPlane
                        key={attachment.id}
                        url={attachment.url}
                        filename={attachment.name}
                        imageUrl={['/images/course/button_cert_1.png', '/images/course/button_cert_2.png']}
                      />
                    ))}
                  </group>
                );
              }
              return null;
            })}
          </Suspense>

          <Suspense fallback={null}>
            {downloadCollection?.map((item, idx) => {
              if (item?.downloads?.length) {
                return (
                  <group key={'download-' + idx} position={[2, downloadCollection[idx]?.position.y + 7, 0]}>
                    {item.downloads.map(attachment => (
                      <DownloadPlane
                        key={attachment.id}
                        url={attachment.url}
                        filename={attachment.name}
                        imageUrl={['/images/course/button_chart_1.png', '/images/course/button_chart_2.png']}
                      />
                    ))}
                  </group>
                );
              }
              return null;
            })}
          </Suspense>
        </>
      )}
    </group>
  );
}

export default ModuleAwards;
