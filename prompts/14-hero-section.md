# PROMPT 14: Hero Section - 3D Data Pipeline Visualization

## Task
Create the hero section with 3D ETL pipeline visualization

## Files to Create

### 1. src/presentation/three/scenes/HeroScene/DataParticleSystem.tsx
- 10,000+ particles using InstancedMesh
- Flowing data stream animation
- Color gradient (blue to purple)

### 2. src/presentation/three/scenes/HeroScene/ETLPipelineVisualization.tsx
- 3D nodes: Source, Transform, Load, Analytics
- Animated connections between nodes
- Glowing orbs representing data packets

### 3. src/presentation/three/scenes/HeroScene/HeroScene.tsx
- Combine particle system and pipeline
- Camera controls (subtle auto-rotation)
- Mouse interaction (parallax)

### 4. src/presentation/three/shaders/dataFlow.vert

### 5. src/presentation/three/shaders/dataFlow.frag
- Custom shader for flowing data effect

### 6. src/presentation/components/sections/Hero/Hero.tsx
- Canvas with HeroScene
- Overlay with name and title
- Animated text entrance
- Scroll indicator

### 7. src/presentation/components/sections/Hero/HeroContent.tsx
- Typography for name/title
- CTA buttons

### 8. Tests for Hero component

### 9. Commit
```
feat: implement hero section with 3d pipeline visualization
```

## Requirements
- Smooth 60fps animation
- Graceful degradation for low-end devices
- Update CHANGELOG.md

## Output
Stunning hero section showcasing data engineering
