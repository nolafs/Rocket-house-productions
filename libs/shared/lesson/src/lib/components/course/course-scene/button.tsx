'use client';

import {
  useGLTF,
  Svg,
  useCursor,
  RoundedBox,
  Text,
  useTexture,
  Center,
  Ring,
  Text3D,
  useIntersect,
} from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLessonProgressionStore } from '@rocket-house-productions/providers';
import { useFrame } from '@react-three/fiber';
import { LessonButton } from './course.types';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ButtonProps {
  rotation?: [number, number, number];
  position: [number, number, number];
  active?: boolean;
  next?: boolean;
  isScrolling?: boolean;
  lesson: LessonButton;
  courseCompleted?: boolean;
  purchaseType?: string | null;
  onOpenLesson: (lesson: LessonButton) => void;
  onBackToCurrentLesson?: () => void;
}

interface TooltipProps {
  children: React.ReactNode;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  isVisible?: boolean;
}

interface ScrollToButtonProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  isVisible?: boolean;
  onScrollToCurrentLesson: () => void;
}

const fontProps = {
  font: '/images/course/font.ttf',
  fontSize: 1,
  letterSpacing: -0.05,
  lineHeight: 1,
  'material-toneMapped': false,
};

// Preload all GLTF models at module level
useGLTF.preload('/images/course/button.gltf');
useGLTF.preload('/images/course/bookmark.gltf');

export const Button3d = ({
  rotation,
  position,
  active,
  next,
  lesson,
  courseCompleted,
  purchaseType = null,
  onOpenLesson,
  onBackToCurrentLesson,
  ...rest
}: ButtonProps) => {
  const [hovered, hover] = useState(false);
  const [mouseControl, setMouseControl] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [visible, setVisible] = useState(false);
  const buttonRef = useIntersect<THREE.Mesh>(visible => {
    setVisible(visible);
  });

  useCursor(hovered);

  const button = useRef<THREE.Group>(null);
  const gltf = useGLTF('/images/course/button.gltf') as unknown as {
    nodes: {
      button: THREE.Mesh;
    };
  };

  const { nodes } = gltf;
  const lessonProgress = useLessonProgressionStore(store => store.getLessonCompleted(lesson.id));

  let lessonTypeSize = 1;
  let lessonTypeColor = '#c17e0c';
  let toolTipY = 3;

  useGSAP(
    () => {
      // Ensure running on client and ScrollTrigger exists
      if (typeof window === 'undefined') return;
      if (typeof ScrollTrigger === 'undefined') return;
      ScrollTrigger.addEventListener('scrollEnd', () => setIsScrolling(false));
      ScrollTrigger.addEventListener('scrollStart', () => setIsScrolling(true));

      return () => {
        ScrollTrigger.removeEventListener('scrollEnd', () => setIsScrolling(false));
        ScrollTrigger.removeEventListener('scrollStart', () => setIsScrolling(true));
      };
    },
    { scope: button },
  );

  switch (lesson.type) {
    case 'Lesson':
      lessonTypeSize = 1;
      lessonTypeColor = lesson.color;
      toolTipY = 2.6;
      break;
    case 'Dr Rhythm':
      lessonTypeSize = 0.7;
      lessonTypeColor = '#DE0BF5';
      toolTipY = 2.1;
      break;
    case 'Practice':
      lessonTypeSize = 0.5;
      lessonTypeColor = lesson.color;
      toolTipY = 1.9;
      break;
    default:
      lessonTypeSize = 1;
      lessonTypeColor = '#c17e0c';
      toolTipY = 2.5;
  }

  if (!active) {
    lessonTypeColor = '#7182a1';
  }

  useFrame(state => {
    if (!visible) return;
    if (!button.current) return;
    if (mouseControl) return;
    if (isScrolling) {
      setShowTooltip(false);
      return;
    }

    const threshold = 1.1;
    const thresholdSquared = threshold * threshold;
    const positionScreenSpace = button.current.position.clone().project(state.camera);

    const screenCenterY = 0;
    const thresholdSize = 0.5;

    /*
    const isCloseToCenter =
      Math.abs(positionScreenSpace.y) > threshold - 0.2 && Math.abs(positionScreenSpace.y) < threshold + 0.2;
     */
    const distanceSquaredY = Math.pow(positionScreenSpace.y - screenCenterY, 2); // Using lengthSq() for squared length

    // Check if the squared distance is less than or equal to the threshold squared
    const isCloseToCenter =
      distanceSquaredY > thresholdSquared - thresholdSize && distanceSquaredY < thresholdSquared + thresholdSize;

    if (isCloseToCenter) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  });

  const handleScrollToCurrentLesson = () => {
    onBackToCurrentLesson && onBackToCurrentLesson();
  };

  return (
    <group ref={button} position={[0, position[1], 0]}>
      {!courseCompleted && !next && showTooltip && (
        <ScrollToCurrentLesson
          position={[0, -0.5, -2]}
          rotation={[0, 0, 0]}
          onScrollToCurrentLesson={handleScrollToCurrentLesson}
          isVisible={!isScrolling}
        />
      )}
      {lesson.num !== 1 && next && (
        <Svg src={'/images/course/next-msg-lesson.svg'} position={[5, 10, 0.6]} scale={0.04}></Svg>
      )}
      <group
        position={[position[0], 0, position[2]]}
        rotation={rotation || [0, 0, 0]}
        {...rest}
        onClick={() => {
          if (active) {
            onOpenLesson(lesson);
          }
        }}
        onPointerOver={() => {
          setMouseControl(true);
          hover(true);
          setShowTooltip(true);
        }}
        onPointerLeave={() => {
          setMouseControl(false);
          hover(false);
          setShowTooltip(false);
        }}>
        <Tooltip position={[0.2, toolTipY, 1]} isVisible={showTooltip} rotation={[0, 0, 0]} scale={0.5}>
          {lesson.num}. {lesson.name}
        </Tooltip>

        {next && (
          <>
            <CurrentIndicatorRings delay={0} />
            <CurrentIndicatorRings delay={0.5} />
          </>
        )}

        <group rotation={[Math.PI / 2, 0, 0]} scale={lessonTypeSize}>
          {lessonProgress && <CompleteLessonIcon />}
          {lesson.type === 'Dr Rhythm' && <DocIcon />}
          {!lesson.isFree && purchaseType === 'free' && <PremiumIcon />}
          <Svg
            src={'/images/course/arrow.svg'}
            position={[-0.45, 0.2, 0.65]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.04}>
            <meshStandardMaterial color={'white'} metalness={0} roughness={0.4} opacity={!active ? 0.5 : 1} />
          </Svg>
          <mesh
            ref={buttonRef}
            geometry={(nodes['button'] as THREE.Mesh).geometry}
            scale={0.009}
            castShadow
            receiveShadow>
            <meshStandardMaterial color={!hovered ? lessonTypeColor : '#bd1368'} metalness={0} roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const CurrentIndicatorRings = ({ delay = 0 }: { delay: number }) => {
  const ringRef = useRef<THREE.Group>(null);
  const ringMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useGSAP(() => {
    if (!ringRef.current) return;
    if (!ringMaterialRef.current) return;

    const tl = gsap.timeline({ repeat: -1, delay: delay });
    tl.timeScale(0.8);

    tl.fromTo(
      ringMaterialRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      },
      0,
    );

    tl.to(
      ringMaterialRef.current,
      {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
        ease: 'none',
      },
      '-=0.5',
    );

    tl.to(
      ringRef.current.position,
      {
        z: 1,
        duration: 1,
        ease: 'none',
      },
      0,
    );

    tl.to(
      ringRef.current.scale,
      {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 1,
        ease: 'none',
      },
      0,
    );
  });

  return (
    <group ref={ringRef}>
      <Center>
        <Ring args={[1.6, 1.8, 40, 8, 0, 7]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial
            ref={ringMaterialRef}
            color={'white'}
            opacity={1}
            transparent={true}
            metalness={0}
            roughness={0.4}
          />
        </Ring>
      </Center>
    </group>
  );
};

const CompleteLessonIcon = () => {
  const gltf = useGLTF('/images/course/button.gltf') as unknown as {
    nodes: {
      button: THREE.Mesh;
    };
  };

  const { nodes } = gltf;
  return (
    <group position={[1, 0.5, -1]}>
      <Center>
        <Svg
          src={'/images/course/complete.svg'}
          scale={0.038}
          position={[-0.35, 0.05, -0.35]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh geometry={(nodes['button'] as THREE.Mesh).geometry} scale={0.003} castShadow>
          <meshStandardMaterial color={'white'} metalness={0} opacity={1} roughness={0.4} />
        </mesh>
      </Center>
    </group>
  );
};

const PremiumIcon = () => {
  return (
    <group position={[2, 1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.45}>
      <Center>
        <RoundedBox
          args={[5, 2, 0.5]}
          radius={0.2}
          bevelSegments={2}
          rotation={[0, 0, 0]}
          position={[0, 0, -0.019]}
          castShadow={true}>
          <meshStandardMaterial color="red" />
        </RoundedBox>
        <Text {...fontProps} color="white" anchorX="center" anchorY="middle" position={[0, 0, 0.3]} castShadow={true}>
          Premium
        </Text>
      </Center>
    </group>
  );
};

const DocIcon = () => {
  const [docTexture] = useTexture(['/images/course/doc.png']);

  return (
    <mesh position={[-0.4, 1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.45}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial map={docTexture} transparent={true} />
    </mesh>
  );
};

const ScrollToCurrentLesson = ({
  position,
  rotation,
  scale,
  isVisible,
  onScrollToCurrentLesson,
}: ScrollToButtonProps) => {
  const gltf = useGLTF('/images/course/bookmark.gltf') as unknown as {
    nodes: {
      bookmark: THREE.Mesh;
    };
  };

  const { nodes } = gltf;
  const [hovered, hover] = useState(false);
  const button = useRef<THREE.Group>(null);

  useCursor(hovered);

  useGSAP(
    () => {
      if (!button?.current) return;

      if (isVisible) {
        gsap.fromTo(
          button.current?.position,
          { x: 0 },
          {
            x: -5.5,
            duration: 1,
            ease: 'power2.inOut',
            delay: 1,
          },
        );
      } else {
        gsap.to(button.current?.position, { x: 0, duration: 0.5, ease: 'power2.inOut' });
      }
    },
    { scope: button, dependencies: [isVisible] },
  );

  return (
    <group
      ref={button}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={() => hover(true)}
      onPointerLeave={() => hover(false)}
      onClick={() => onScrollToCurrentLesson()}>
      <Text3D
        castShadow={true}
        font={'/images/course/font.json'}
        curveSegments={32}
        position={[-1.5, 0.7, 0.3]}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.08}
        height={0.05}
        lineHeight={0.5}
        letterSpacing={0.01}
        size={0.35}>
        Next lesson
        <meshStandardMaterial color="white" />
      </Text3D>

      <mesh
        geometry={(nodes['bookmark'] as THREE.Mesh).geometry}
        position={[2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={0.015}>
        <meshStandardMaterial color={!hovered ? '#bd1368' : 'green'} />
      </mesh>
    </group>
  );
};

const Tooltip = ({ children, position, rotation, scale, isVisible = true }: TooltipProps) => {
  const textRef = useRef<THREE.Mesh>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (textRef.current) {
      const box = new THREE.Box3().setFromObject(textRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);

      setSize({ width: size.x * 2 + 1.5, height: size.y * 2 + 1.5 });
    }
  }, [children, isVisible]);

  return (
    <group position={position} rotation={rotation} scale={scale} visible={isVisible}>
      <Center>
        <Text
          ref={textRef}
          {...fontProps}
          color="black"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.3]}
          castShadow={true}>
          {children}
        </Text>
        {size && (
          <group position={[0, 0, 0]}>
            <RoundedBox args={[size.width, size.height, 0.5]} radius={0.3} bevelSegments={2} castShadow={true}>
              <meshStandardMaterial color="white" />
            </RoundedBox>
            <RoundedBox
              args={[1, 1, 0.5]}
              radius={0.2}
              bevelSegments={2}
              rotation={[0, 0, Math.PI / 4]}
              position={[0, -0.9, -0.019]}>
              <meshStandardMaterial color="white" />
            </RoundedBox>
          </group>
        )}
      </Center>
    </group>
  );
};
