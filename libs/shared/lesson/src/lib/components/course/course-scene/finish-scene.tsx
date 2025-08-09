'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useTexture, Html, Plane } from '@react-three/drei';
import { Group, PlaneGeometry } from 'three';
import Image from 'next/image';
import * as THREE from 'three';
import kidDojo from '../../../assets/kgd-circle.png';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useFrame, extend } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

interface FinalSceneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  pathLength?: number | null;
  courseCompleted?: boolean;
}

export const FinalScene = ({ courseCompleted, position, rotation, pathLength = 0, ...rest }: FinalSceneProps) => {
  const ref = useRef<Group | null>(null);
  const confettiRef = useRef<Group | null>(null);
  const ninjaRef = useRef<Group | null>(null);
  const ninjaRef2 = useRef<Group | null>(null);
  const guitarHead = useTexture('/images/course/guitar-head.webp');
  const sun = useTexture('/images/course/finish.png');
  const ninja = useTexture('/images/course/ninja.png');

  useEffect(() => {
    extend({ MeshLineGeometry, MeshLineMaterial });
  }, []);

  const dash = 0.98;
  const count = 100;
  const radius = 25;

  useGSAP(
    () => {
      if (courseCompleted) {
        gsap.to(confettiRef.current!.rotation, {
          y: `+=${Math.PI * 2}`,
          duration: 8,
          repeat: -1,
          ease: 'none',
        });

        gsap.to(ninjaRef.current!.rotation, {
          y: `+=${Math.PI * 2}`,
          duration: 5,
          repeat: -1,
          ease: 'none',
        });

        gsap.to(ninjaRef2.current!.rotation, {
          y: `+=${Math.PI * 2}`,
          duration: 5,
          repeat: -1,
          ease: 'none',
          delay: 2,
        });
      }
    },
    { scope: ref },
  );

  if (!pathLength) return null;

  return (
    <group ref={ref}>
      {courseCompleted && (
        <group position={[0, pathLength + 30, -35]}>
          <group ref={confettiRef}>
            <Lines dash={dash} count={count} radius={radius} colors={['#0fc463', '#efef12', '#ec4d3f', '#0b6c94']} />
          </group>

          <group ref={ninjaRef} rotation={[Math.PI / 8, 0, 0]}>
            <Plane args={[5, 5]} position={[0, 0, 20]} rotation={[0, 0, 0]}>
              <meshStandardMaterial side={THREE.DoubleSide} map={ninja} transparent={true} metalness={0} />
            </Plane>
          </group>

          <group ref={ninjaRef2} rotation={[-Math.PI / 8, -Math.PI / 4, 0]}>
            <Plane args={[5, 5]} position={[0, 0, 20]} rotation={[0, 0, 0]}>
              <meshStandardMaterial side={THREE.DoubleSide} map={ninja} transparent={true} metalness={0} />
            </Plane>
          </group>

          <mesh geometry={new PlaneGeometry(50, 44)} scale={1} rotation={[0, 0, 0]}>
            <meshStandardMaterial map={sun} color={0xffffff} transparent={true} metalness={0.4} />

            <Html transform={true} center={true} sprite={true}>
              <div className="flex h-full w-full items-center justify-center">
                <div className="mb-20 flex max-w-[492px] flex-col items-center justify-center space-y-10 text-center">
                  <div>
                    <Image src={kidDojo} priority={true} alt={'kiddojo'} />
                  </div>
                  <h1 className="text-4xl font-bold text-pink-500">Completed the Course!</h1>
                  <h2 className="text-2xl text-gray-600">You’re now officially a Guitar Ninja! 🤘</h2>
                  <p className="text-lg text-gray-600">
                    You've completed the course! But the fun doesn't stop here! 🚀 Go back to any lesson and practice to
                    crank up your high score! 🎯 Keep rocking, and show those strings who's boss! 🤘
                  </p>
                </div>
              </div>
            </Html>
          </mesh>
        </group>
      )}

      <mesh
        receiveShadow={true}
        geometry={new PlaneGeometry(18, 19)}
        position={[0, pathLength + 11.5, -24.5]}
        scale={1}
        rotation={[0, 0, 0]}>
        <meshStandardMaterial map={guitarHead} color={0xffffff} transparent={true} metalness={0.4} />
      </mesh>
    </group>
  );
};

type Line = {
  color: string;
  width: number;
  speed: number;
  curve: number[];
};

function Lines({
  dash,
  count,
  colors,
  radius = 50,
  rand = THREE.MathUtils.randFloatSpread,
}: {
  dash: number;
  count: number;
  colors: string[];
  radius?: number;
  rand?: (a: number) => number;
}) {
  const lines: Line[] = useMemo(() => {
    return Array.from({ length: count }, () => {
      const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius));
      const points = Array.from({ length: 10 }, () =>
        pos.add(new THREE.Vector3(rand(radius), rand(radius), rand(radius))).clone(),
      );
      const curve = new THREE.CatmullRomCurve3(points).getPoints(300);
      return {
        color: colors[Math.round(colors.length * Math.random())],
        width: Math.max(radius / 100, (radius / 20) * Math.random()),
        speed: Math.max(0.1, 1 * Math.random()),
        curve: curve.flatMap(point => point.toArray()),
      };
    });
  }, [colors, count, radius]);
  return lines.map((props: Line, index) => (
    <Fatline key={index} dash={dash} color={props.color} width={props.width} speed={props.speed} curve={props.curve} />
  ));
}

function Fatline({
  curve,
  width,
  color,
  speed,
  dash,
}: {
  curve: number[];
  width: number;
  color: string;
  speed: number;
  dash: number;
}) {
  const ref = useRef<any | null>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;

    return (ref.current.material.dashOffset -= (delta * speed) / 10);
  });
  return (
    <mesh ref={ref}>
      <meshLineGeometry points={curve} />
      <meshLineMaterial
        transparent
        lineWidth={width}
        color={color}
        depthWrite={false}
        dashArray={0.25}
        dashRatio={dash}
        toneMapped={false}
      />
    </mesh>
  );
}
