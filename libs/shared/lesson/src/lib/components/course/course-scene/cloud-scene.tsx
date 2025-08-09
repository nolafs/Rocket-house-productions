'use client';
import { Plane, useTexture } from '@react-three/drei';
import React, { useEffect, useState } from 'react';

interface CloudProps {
  textureUrl: string;
  position: [number, number, number];
}

const CloudImages = ['/images/course/cloud-1.png', '/images/course/cloud-2.png', '/images/course/cloud-3.png'];

const generateRandomPosition = (width: number, height: number, depth: number): [number, number, number] => [
  (Math.random() - 0.5) * width * 2,
  (Math.random() - 0.5) * height * 2,
  (Math.random() - 0.5) * depth * 2,
];

const NUM_CLOUDS = 10;

interface CloudsProps {
  width: number;
  height: number;
  depth: number;
  numClouds: number;
}

export const Clouds = ({ width, height, depth, numClouds }: CloudsProps) => {
  const clouds = [];

  for (let i = 0; i < numClouds; i++) {
    const textureUrl = CloudImages[i % CloudImages.length];
    const position = generateRandomPosition(width, height, depth);
    clouds.push(<Cloud key={i} textureUrl={textureUrl} position={position} />);
  }

  return <>{clouds}</>;
};

const Cloud = ({ textureUrl, position }: CloudProps) => {
  const [texture] = useTexture([textureUrl]);

  const [size, setSize] = useState([1, 1]);

  useEffect(() => {
    if (texture) {
      // Ensure texture is loaded before calculating size
      const aspect = texture.image.width / texture.image.height;
      setSize([aspect * 5, 5]); // Adjust size as needed
    }
  }, [texture]);

  return (
    <Plane args={size as [number, number]} position={position}>
      <meshStandardMaterial attach="material" map={texture} transparent={true} />
    </Plane>
  );
};

export default Clouds;
