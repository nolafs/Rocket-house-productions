import { extend } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

if (!(globalThis as any).__MESHLINE_EXTENDED__) {
  extend({ MeshLineGeometry, MeshLineMaterial });
  (globalThis as any).__MESHLINE_EXTENDED__ = true;
}
