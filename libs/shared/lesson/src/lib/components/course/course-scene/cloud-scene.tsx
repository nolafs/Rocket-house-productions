'use client';
import { Plane, useTexture } from '@react-three/drei';
import React, { useEffect, useMemo, useState } from 'react';

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

interface CloudsProps {
  width: number;
  height: number;
  depth: number;
  numClouds: number;
}

export const Clouds = ({ width, height, depth, numClouds }: CloudsProps) => {
  const clouds = useMemo(() => {
    return Array.from({ length: numClouds }, (_, i) => {
      const textureUrl = CloudImages[i % CloudImages.length];
      const position = generateRandomPosition(width, height, depth);
      // Prefer a stable key that doesn’t change order-based if possible
      const key = `${textureUrl}-${i}-${width}x${height}x${depth}`;
      return <Cloud key={key} textureUrl={textureUrl} position={position} />;
    });
  }, [width, height, depth, numClouds]);

  return <>{clouds}</>;
};

const Cloud = ({ textureUrl, position }: CloudProps) => {
  const [texture] = useTexture([textureUrl]);

  const [size, setSize] = useState([1, 1]);

  useEffect(() => {
    if (texture && texture.image) {
      // Type guard: check if image has width and height properties
      const image = texture.image as { width?: number; height?: number };
      if (image.width && image.height) {
        const aspect = image.width / image.height;
        setSize([aspect * 5, 5]); // Adjust size as needed
      }
    }
  }, [texture]);

  return (
    <Plane args={size as [number, number]} position={position}>
      <meshStandardMaterial attach="material" map={texture} transparent={true} />
    </Plane>
  );
};

export default Clouds;
