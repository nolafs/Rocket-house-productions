'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { debounce } from 'lodash';
import * as THREE from 'three';

interface CameraMovementTrackerProps {
  camera: THREE.Camera | null;
  onCameraMove: (isMoving: boolean) => void;
}

const CameraMovementTracker = ({ camera, onCameraMove }: CameraMovementTrackerProps) => {
  const [isMoving, setIsMoving] = useState(false);
  const previousY = useRef(camera?.position.y || 0);

  // Debounce function to avoid rapid state changes
  const debouncedSetIsMoving = useCallback(
    debounce(moving => setIsMoving(moving), 200), // Adjust debounce time as needed
    [],
  );

  useFrame(() => {
    if (!camera) return;
    const currentY = camera.position.y;

    // Determine if the camera is moving
    const moving = Math.abs(currentY - previousY.current) > 0.01;
    debouncedSetIsMoving(moving);
    onCameraMove(moving);

    previousY.current = currentY;
  });

  useEffect(() => {
    if (onCameraMove) {
      onCameraMove(isMoving);
    }

    return () => {
      debouncedSetIsMoving.cancel();
    };
  }, [isMoving, onCameraMove, debouncedSetIsMoving]);

  return null; // This component doesn't render anything
};

export default CameraMovementTracker;
