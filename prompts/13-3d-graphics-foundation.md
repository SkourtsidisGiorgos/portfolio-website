# PROMPT 13: 3D Graphics Foundation

## Task
Set up React Three Fiber foundation

## Install
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

## Files to Create

### 1. src/presentation/three/primitives/DataParticle.tsx
- Single glowing particle
- Customizable color and size

### 2. src/presentation/three/primitives/GlowingSphere.tsx
- Sphere with bloom effect
- Animated pulse

### 3. src/presentation/three/primitives/FloatingText.tsx
- 3D text using drei Text
- Hover effects

### 4. src/presentation/three/primitives/ConnectionLine.tsx
- Animated line between points
- Data flow effect

### 5. src/presentation/three/primitives/GridFloor.tsx
- Infinite grid with fade
- Cyberpunk aesthetic

### 6. src/presentation/three/effects/PostProcessing.tsx
- Bloom effect
- Vignette
- Chromatic aberration (subtle)

### 7. src/presentation/three/hooks/useMousePosition.ts
- Track mouse for parallax

### 8. src/presentation/three/hooks/useScrollProgress.ts
- Track scroll for animations

### 9. src/presentation/three/utils/geometryHelpers.ts
- Helper functions for 3D math

### 10. Commit
```
feat: add react three fiber foundation
```

## Requirements
- Performance optimized
- Responsive to window size
- Update CHANGELOG.md

## Output
3D graphics foundation ready for scenes
