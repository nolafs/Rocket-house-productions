import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { Object3DNode, MaterialNode } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

// Fallback (in case module augmentation isn’t picked up)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry?: any;
      meshLineMaterial?: any;
    }
  }
}

export {};
