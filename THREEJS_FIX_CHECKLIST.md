# Three.js Shader Fix - Action Checklist

## ✅ Completed Changes

1. **Fixed Material Type** in `landscape.tsx`
   - Changed `meshPhongMaterial` → `meshStandardMaterial`
   
2. **Aligned Three.js Versions**
   - Updated `kids-guitar-dojo/package.json`: `three@0.179.1` → `three@^0.182.0`
   
3. **Updated React-Three Packages**
   - Root `package.json`: drei `10.7.7` → `^9.114.3`, fiber `^9.4.2` → `^8.17.10`
   - App `package.json`: drei `10.7.3` → `^9.114.3`, fiber `9.3.0` → `^8.17.10`

4. **Temporarily Disabled SoftShadows**
   - Commented out in `course-navigation.tsx` until packages update

## 🔄 Next Steps (Do These Now)

### 1. Install Updated Packages
```bash
cd /Users/olafsiebert/html/rocket_house_productions
rm -rf node_modules/.cache
rm -rf apps/kids-guitar-dojo/.next
yarn install
```

### 2. Restart Dev Server
```bash
yarn nx run kids-guitar-dojo:dev
```

### 3. Verify No Shader Errors
- Open http://localhost:3000/courses
- Check browser console
- Should see NO `unpackRGBAToDepth` errors

### 4. Re-enable SoftShadows (After Verification)

Once you confirm no errors:

**File**: `libs/shared/lesson/src/lib/components/course/course-navigation.tsx`

Uncomment:
```tsx
// import { SoftShadows } from '@react-three/drei'; // ← Remove this line
import { SoftShadows } from '@react-three/drei';   // ← Keep this

// In the render:
// {/* <SoftShadows size={5} samples={20} focus={40} /> */}  // ← Remove
<SoftShadows size={5} samples={20} focus={40} />              // ← Keep
```

Then restart the dev server again.

## 🎯 Expected Results

- ✅ No shader compilation errors
- ✅ Shadows work (hard shadows initially, soft after re-enabling)
- ✅ Materials render correctly
- ✅ Performance is good

## 🐛 If You Still See Errors

1. **Check package versions:**
   ```bash
   yarn why three
   yarn why @react-three/drei
   yarn why @react-three/fiber
   ```

2. **Ensure all use same versions:**
   - three: `^0.182.0`
   - @react-three/drei: `^9.114.3`
   - @react-three/fiber: `^8.17.10`

3. **Clear all caches:**
   ```bash
   rm -rf node_modules
   rm -rf .yarn/cache
   rm -rf apps/kids-guitar-dojo/.next
   yarn install
   ```

## 📝 Why This Fixes It

- **meshStandardMaterial**: Uses PBR shaders compatible with Three.js v0.182+
- **Version alignment**: All packages use same Three.js internals
- **Drei v9.114**: Fixed SoftShadows shader to work with new Three.js shadow mapping
- **Fiber v8.17**: Supports both React 19 and Three.js v0.182

## 📚 Reference

See `THREE_JS_SHADER_FIX.md` for detailed technical explanation.

