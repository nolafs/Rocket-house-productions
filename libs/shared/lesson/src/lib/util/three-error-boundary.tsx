'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Html, Preload, useProgress, useTexture } from '@react-three/drei';

import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
import ModuleAwards from '../components/course/course-scene/module-awards';

// Error Boundary Component
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; onContinue?: () => void },
  { hasError: boolean; errorType?: string; userWantsToContinue: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, userWantsToContinue: false };
  }

  static getDerivedStateFromError(error: Error) {
    let errorType = 'unknown';
    const errorMessage = error.message?.toLowerCase() || '';

    // Prioritize texture/loading errors over WebGL context lost
    if (
      errorMessage.includes('load') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('403') ||
      errorMessage.includes('404')
    ) {
      errorType = 'network';
    } else if (errorMessage.includes('texture') || errorMessage.includes('image')) {
      errorType = 'texture';
    } else if (errorMessage.includes('webgl') || errorMessage.includes('context lost')) {
      errorType = 'webgl';
    }

    return { hasError: true, errorType, userWantsToContinue: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Error:', error, errorInfo);

    // Log specific error types for debugging
    if (error.message?.includes('WebGL context lost')) {
      console.warn('WebGL context was lost - likely due to GPU issues or browser tab switching');
    }
    if (error.message?.includes('403') || error.message?.includes('404')) {
      console.warn('Resource loading failed - check CDN/image URLs');
    }
  }

  getErrorMessage() {
    const { errorType } = this.state;

    switch (errorType) {
      case 'webgl':
        return {
          title: 'Graphics Issue',
          message: 'Your browser is having trouble with 3D graphics.',
          canSkip: false,
          icon: '⚡',
        };
      case 'network':
        return {
          title: 'Loading Issue',
          message: 'Some course content failed to load.',
          canSkip: true,
          icon: '🌐',
        };
      case 'texture':
        return {
          title: 'Image Loading Issue',
          message: 'Some images failed to load.',
          canSkip: true,
          icon: '🖼️',
        };
      default:
        return {
          title: 'Loading Issue',
          message: 'Some visual content failed to load.',
          canSkip: true,
          icon: '🎮',
        };
    }
  }

  handleContinue = () => {
    this.setState({ userWantsToContinue: true });
    if (this.props.onContinue) {
      this.props.onContinue();
    }
  };

  render() {
    if (this.state.hasError && !this.state.userWantsToContinue) {
      const errorInfo = this.getErrorMessage();

      return (
        this.props.fallback || (
          <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
            <div className="mx-4 max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-6xl">{errorInfo.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">{errorInfo.title}</h3>
              <p className="mb-6 text-gray-600">{errorInfo.message}</p>
              <div className="space-y-2">
                <button
                  onClick={() => this.setState({ hasError: false, userWantsToContinue: false })}
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
                  Try Again
                </button>
                {errorInfo.canSkip && (
                  <button
                    onClick={this.handleContinue}
                    className="w-full rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600">
                    Skip and Continue Learning
                  </button>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="w-full rounded bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600">
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Safe Texture Loading Component
export function SafeSkyBox() {
  const [fallback, setFallback] = React.useState(false);

  if (fallback) {
    return (
      <Box args={[1000, 1350, 1000]} position={[0, -100, 0]}>
        <meshStandardMaterial color="#87CEEB" side={THREE.BackSide} />
      </Box>
    );
  }

  return (
    <Suspense
      fallback={
        <Box args={[1000, 1350, 1000]} position={[0, -100, 0]}>
          <meshStandardMaterial color="#87CEEB" side={THREE.BackSide} />
        </Box>
      }>
      <SkyBoxWithTexture onError={() => setFallback(true)} />
    </Suspense>
  );
}

function SkyBoxWithTexture({ onError }: { onError: () => void }) {
  try {
    const texture = useTexture('/images/course/sky.webp');
    return (
      <Box args={[1000, 1350, 1000]} position={[0, -100, 0]}>
        <meshStandardMaterial map={texture} side={THREE.BackSide} />
      </Box>
    );
  } catch (error) {
    console.warn('Sky texture failed to load:', error);
    React.useEffect(() => {
      onError();
    }, [onError]);
    throw error; // Let Suspense handle it
  }
}

// Enhanced Loader with Error Handling
export function SafeLoader() {
  const { progress, loaded, total, errors } = useProgress();

  // Check if there are loading errors
  const hasErrors = errors && errors.length > 0;

  return (
    <Html fullscreen zIndexRange={[100, 100]}>
      <div className="z-50 flex h-screen w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          {hasErrors ? (
            <div className="text-center">
              <div className="mb-4 text-4xl text-red-400">⚠️</div>
              <div className="mb-2 text-white">Some content failed to load</div>
              <div className="mb-4 text-sm text-gray-300">Continuing with available content...</div>
            </div>
          ) : (
            <>
              <Loader2 className="mb-5 h-12 w-12 animate-spin text-white" />
              <div className="font-lesson-heading mt-5 w-full text-center text-white">{Math.round(progress)} %</div>
            </>
          )}
          <div className="w-full text-center text-sm text-white">
            Item: {loaded} / {total}
          </div>
        </div>
      </div>
    </Html>
  );
}

// Safe wrapper for ModuleAwards
export function SafeModuleAwards({ display }: { display: any }) {
  try {
    return <ModuleAwards display={display} />;
  } catch (error) {
    console.warn('ModuleAwards failed, skipping:', error);
    return null;
  }
}

// Main Safe Canvas Wrapper
export function SafeCourseNavigation({
  children,
  moduleAwardsDisplay,
  ...canvasProps
}: {
  children: React.ReactNode;
  moduleAwardsDisplay?: any;
} & any) {
  const [skipAwards, setSkipAwards] = React.useState(false);

  return (
    <ThreeErrorBoundary
      onContinue={() => {
        console.log('User chose to continue without full graphics');
        setSkipAwards(true); // Disable awards when user skips
      }}>
      <Canvas {...canvasProps}>
        <SafeLoader />
        {children}
        {/* Only render ModuleAwards if user hasn't skipped and we have display data */}
        {moduleAwardsDisplay && !skipAwards && <SafeModuleAwards display={moduleAwardsDisplay} />}
        <Preload all />
      </Canvas>
    </ThreeErrorBoundary>
  );
}
