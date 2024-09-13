/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactThreeFiber } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module 'server-only';

declare module 'player.js';

declare module 'three.meshline';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      MeshLineGeometry: ReactThreeFiber.Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
      MeshLineMaterial: ReactThreeFiber.Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
    }
  }
}
