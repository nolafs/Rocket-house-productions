import { useGLTF, Svg, useCursor, Html, Billboard, RoundedBox, Text, useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { useLessonProgressionStore } from '@rocket-house-productions/providers';

interface ButtonProps {
  rotation?: [number, number, number];
  position: [number, number, number];
  lessonId: string;
  lessonNum: number;
  lessonName: string;
  lessonUrl: string;
  lessonType: string;
  moduleColor: string;
}

export const Button3d = ({
  rotation,
  position,
  lessonNum,
  lessonId,
  lessonName,
  lessonUrl,
  lessonType,
  moduleColor,
  ...rest
}: ButtonProps) => {
  const [hovered, hover] = useState(false);

  useCursor(hovered);

  const router = useRouter();
  const { nodes } = useGLTF('/images/course/button.gltf');
  const lessonProgress = useLessonProgressionStore(store => store.getLessonCompleted(lessonId));

  let lessonTypeSize = 1;
  let lessonTypeColor = '#c17e0c';
  let toolTipY = 2.3;

  switch (lessonType) {
    case 'Lesson':
      lessonTypeSize = 1;
      lessonTypeColor = moduleColor;
      toolTipY = 2.3;
      break;
    case 'Dr Rhythm':
      lessonTypeSize = 0.7;
      lessonTypeColor = '#DE0BF5';
      toolTipY = 1.9;
      break;
    case 'Practice':
      lessonTypeSize = 0.5;
      lessonTypeColor = moduleColor;
      toolTipY = 1.6;
      break;
    default:
      lessonTypeSize = 1;
      lessonTypeColor = '#c17e0c';
      toolTipY = 2.3;
  }

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
      <Tooltip position={[0, toolTipY, 0]} isVisible={hovered} rotation={[0, 0, 0]} scale={0.5}>
        {lessonNum}. {lessonName}
      </Tooltip>
      <group rotation={[Math.PI / 2, 0, 0]} scale={lessonTypeSize}>
        {lessonProgress && <CompleteLessonIcon />}
        {lessonType === 'Dr Rhythm' && <DocIcon />}
        <Svg
          src={'/images/course/arrow.svg'}
          position={[-0.45, 0.5, 0.65]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.04}></Svg>
        <mesh geometry={(nodes['button'] as THREE.Mesh).geometry} scale={0.009} castShadow={true}>
          <meshStandardMaterial color={!hovered ? lessonTypeColor : '#bd1368'} metalness={0} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

const CompleteLessonIcon = () => {
  const { nodes } = useGLTF('/images/course/button.gltf');
  return (
    <group>
      <Svg
        src={'/images/course/complete.svg'}
        scale={0.04}
        position={[0.6, 1.2, -1.4]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh geometry={(nodes['button'] as THREE.Mesh).geometry} scale={0.003} position={[1, 1, -1]} castShadow={true}>
        <meshStandardMaterial color={'white'} metalness={0} roughness={0.4} />
      </mesh>
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

interface TooltipProps {
  children: any;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  isVisible?: boolean;
}

export const Tooltip = ({ children, position, rotation, scale, isVisible = true }: TooltipProps) => {
  const textRef = useRef<THREE.Mesh>(null);
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

  const fontProps = {
    font: '/images/course/font.ttf',
    fontSize: 1,
    letterSpacing: -0.05,
    lineHeight: 1,
    'material-toneMapped': false,
  };

  return (
    <group position={position} rotation={rotation} scale={scale} visible={isVisible}>
      <Text
        ref={textRef}
        {...fontProps}
        color="black"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 1]}
        castShadow={true}>
        {children}
      </Text>
      {size && (
        <RoundedBox
          receiveShadow={true}
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
