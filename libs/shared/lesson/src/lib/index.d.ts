declare module 'player.js';
declare module 'three.meshline';
declare module '*.png';
declare module '@madzadev/audio-player';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}
