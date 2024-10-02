import { Module } from '@prisma/client';
import { Center, PivotControls, RoundedBox, Text3D } from '@react-three/drei';

interface ModuleLabelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  module: Module;
}

export const ModuleLabel = ({ position, rotation, module, ...rest }: ModuleLabelProps) => {
  return (
    <group position={position} rotation={rotation} {...rest}>
      <Center rotation={[0, 0, 0]}>
        <RoundedBox
          args={[8, 2, 1]}
          position={[0, 0, 1.5]}
          bevelSegments={4}
          radius={0.3}
          castShadow={true}
          receiveShadow>
          <Center rotation={[0, 0, 0]} position={[0, 0, 0.4]}>
            <Text3D
              castShadow={true}
              font={'/images/course/font.json'}
              curveSegments={32}
              bevelEnabled
              bevelSize={0.04}
              bevelThickness={0.1}
              height={0.5}
              lineHeight={0.5}
              letterSpacing={0.01}
              size={0.5}>
              {module.title}
              <meshStandardMaterial color="white" />
            </Text3D>
          </Center>

          <meshStandardMaterial color={module.color || '#FFFFFF'} />
        </RoundedBox>
      </Center>
    </group>
  );
};
