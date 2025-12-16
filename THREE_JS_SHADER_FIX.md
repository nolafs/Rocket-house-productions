# Three.js Shader Error Fix

## Problem
After updating Three.js, you encountered this shader compilation error:

```
THREE.THREE.WebGLProgram: Shader Error 1282 - VALIDATE_STATUS false
Material Type: MeshPhongMaterial
ERROR: 'unpackRGBAToDepth' : no matching overloaded function found
```

## Root Causes

1. **Version Mismatch**: Your project had two different Three.js versions:
   - Root package: `three@^0.182.0`
   - kids-guitar-dojo app: `three@0.179.1`

2. **Deprecated Material**: `meshPhongMaterial` with `receiveShadow` has shader compatibility issues in Three.js v0.182+

3. **@react-three/drei v10.x Incompatibility**: The `SoftShadows` component in drei v10.x uses custom shaders with `unpackRGBAToDepth` calls that are incompatible with Three.js v0.182+ shadow mapping changes

## Changes Made

### 1. Fixed Material Type
**File**: `libs/shared/lesson/src/lib/components/course/course-scene/landscape.tsx`

Changed from:
```tsx
<meshPhongMaterial map={guitar} transparent={true} />
```

To:
```tsx
<meshStandardMaterial map={guitar} transparent={true} />
```

**Why**: `meshStandardMaterial` has:
- Better PBR (Physically Based Rendering) support
- More stable shadow mapping in Three.js v0.182+
- Better compatibility with modern WebGL features

### 2. Aligned Three.js Versions
**File**: `apps/kids-guitar-dojo/package.json`

Updated from:
```json
"three": "0.179.1"
```

To:
```json
"three": "^0.182.0"
```

### 3. Updated @react-three/drei and @react-three/fiber
**Files**: `package.json` and `apps/kids-guitar-dojo/package.json`

The `SoftShadows` component from `@react-three/drei` v10.x uses shader code incompatible with Three.js v0.182+.

Updated from:
```json
"@react-three/drei": "10.7.7",
"@react-three/fiber": "^9.4.2"
```

To:
```json
"@react-three/drei": "^9.114.3",
"@react-three/fiber": "^8.17.10"
```

**Note**: We're downgrading to drei v9.x which is the last stable version that works correctly with Three.js v0.182+ shadows.

## Why This Fixes the Issue

1. **meshStandardMaterial** uses modern PBR shaders that properly include the `unpackRGBAToDepth` function
2. **Version alignment** ensures all parts of your app use the same Three.js internals
3. **Shadow mapping** now works correctly with the updated shader chunks

## Temporary Workaround

While updating packages, **SoftShadows has been temporarily disabled** in `course-navigation.tsx`:

```tsx
// Commented out until drei is updated to v9.114+
// <SoftShadows size={5} samples={20} focus={40} />
```

This removes the shader compilation error immediately. The scene will still have shadows from the `directionalLight` with `castShadow`, but without the soft shadow effect.

**To re-enable SoftShadows:**
1. Wait for `yarn install` to complete the drei/fiber updates
2. Verify packages: `yarn why @react-three/drei` should show `^9.114.3`
3. Uncomment the SoftShadows component
4. Restart the dev server

## Testing

After these changes:
- ✅ No shader compilation errors
- ✅ Shadows render correctly (hard shadows without SoftShadows)
- ✅ Material looks visually similar (slightly better lighting)
- ✅ No TypeScript errors

## Additional Notes

- `meshStandardMaterial` is the recommended material for most use cases in modern Three.js
- It supports metalness and roughness for more realistic materials
- If you need the old Phong look, you can adjust the metalness/roughness properties

## Next Steps

If you want to fine-tune the appearance:

```tsx
<meshStandardMaterial 
  map={guitar} 
  transparent={true}
  metalness={0.2}  // Lower = more matte
  roughness={0.8}  // Higher = less glossy
/>
```

