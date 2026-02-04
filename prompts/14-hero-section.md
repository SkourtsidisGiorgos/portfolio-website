# PROMPT 14: Hero Section - 3D Data Pipeline Visualization (SOLID/DRY/TDD/DDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/hero-section

# Create GitHub issue
gh issue create --title "feat: Hero section with 3D ETL pipeline" \
  --body "Implement hero section with 3D data pipeline visualization showcasing ETL expertise"
```

## Task

Create the hero section with 3D ETL pipeline visualization following clean architecture principles.

## Architecture Overview

```
src/presentation/
├── three/scenes/HeroScene/     # 3D Scene Components
│   ├── domain/                 # Scene-specific domain
│   │   ├── ETLNode.ts          # Value object for pipeline nodes
│   │   └── PipelineConfig.ts   # Configuration value object
│   ├── HeroScene.tsx           # Main scene composition
│   ├── DataParticleSystem.tsx  # Particle system
│   └── ETLPipelineVisualization.tsx
└── components/sections/Hero/   # UI Components
    ├── Hero.tsx                # Container (composition root)
    ├── HeroContent.tsx         # Typography/CTAs
    └── HeroCanvas.tsx          # 3D Canvas wrapper
```

## Files to Create

### Phase 1: Domain Layer (TDD - Write Tests First)

#### 1. src/presentation/three/scenes/HeroScene/domain/ETLNode.ts

Value object representing a pipeline node.

```typescript
// Requirements:
// - Immutable value object
// - Types: 'source' | 'transform' | 'load' | 'analytics'
// - Factory: ETLNode.create({ type, label, position, color })
// - Integration with Position3D and Color3D from prompt 13
// - Validation: type must be valid, position must be valid
```

#### 2. src/presentation/three/scenes/HeroScene/domain/PipelineConfig.ts

Configuration for the entire pipeline visualization.

```typescript
// Requirements:
// - Defines node positions, connections, particle settings
// - Factory: PipelineConfig.default()
// - Factory: PipelineConfig.minimal() for low-end devices
// - Integrates with usePerformanceMode from prompt 13
```

#### 3. src/presentation/three/scenes/HeroScene/**tests**/ETLNode.test.ts

```typescript
// Test cases:
// - create() with valid type returns node
// - create() throws for invalid type
// - Position is immutable
// - Color integrates with theme
```

### Phase 2: 3D Components (Interface-Based Design - SOLID D)

#### 4. src/presentation/three/scenes/HeroScene/DataParticleSystem.tsx

Instanced particle system for performance.

```typescript
// Requirements:
// - Uses InstancedMesh for 10,000+ particles (DRY - no manual loops)
// - Props implement IAnimatable interface from prompt 13
// - Configurable via PipelineConfig value object
// - usePerformanceMode to adjust particle count
// - Color gradient using Color3D.fromTheme()
// - Single Responsibility: only handles particle rendering
```

#### 5. src/presentation/three/scenes/HeroScene/ETLNode3D.tsx

Individual 3D node component.

```typescript
// Requirements:
// - Props accept ETLNode value object (Dependency Inversion)
// - Composes GlowingSphere from prompt 13 (DRY)
// - Composes FloatingText from prompt 13 (DRY)
// - Animation via AnimationConfig value object
// - Open for extension: accept custom mesh/material
```

#### 6. src/presentation/three/scenes/HeroScene/ETLPipelineVisualization.tsx

Pipeline visualization using composition.

```typescript
// Requirements:
// - Accepts PipelineConfig value object
// - Maps config to ETLNode3D components (Single Responsibility)
// - Uses ConnectionLine from prompt 13 for connections (DRY)
// - Animates data packets along connections
// - Open for extension: custom node types via render prop
```

#### 7. src/presentation/three/scenes/HeroScene/DataPacket.tsx

Animated data packet traveling along connections.

```typescript
// Requirements:
// - Uses DataParticle from prompt 13 (DRY)
// - Follows path defined by ConnectionLine
// - Animation speed configurable via AnimationConfig
// - Single Responsibility: only handles packet animation
```

#### 8. src/presentation/three/scenes/HeroScene/HeroScene.tsx

Main scene composition (Composition Root).

```typescript
// Requirements:
// - Composes DataParticleSystem, ETLPipelineVisualization
// - Uses PostProcessing from prompt 13 with hero preset (DRY)
// - Camera setup with parallax (uses useMousePosition from prompt 13)
// - Subtle auto-rotation animation
// - Depends on abstractions (interfaces) not concretions
```

### Phase 3: Shaders (Single Responsibility)

#### 9. src/presentation/three/shaders/dataFlow.vert

```glsl
// Requirements:
// - Vertex displacement for flowing effect
// - Time-based animation uniforms
// - Position offset based on particle index
```

#### 10. src/presentation/three/shaders/dataFlow.frag

```glsl
// Requirements:
// - Color gradient from blue to purple (theme colors)
// - Glow/bloom-friendly output
// - Opacity fade at edges
// - Uniforms: u_time, u_colorStart, u_colorEnd, u_opacity
```

#### 11. src/presentation/three/shaders/index.ts

```typescript
// Requirements:
// - Export shader strings as constants
// - Helper to create ShaderMaterial with defaults
// - Type definitions for uniforms
```

### Phase 4: UI Components (Separation of Concerns)

#### 12. src/presentation/components/sections/Hero/HeroCanvas.tsx

3D Canvas wrapper with error boundary.

```typescript
// Requirements:
// - Wraps R3F Canvas with suspense/error boundary
// - Handles WebGL context loss gracefully
// - Shows fallback for non-WebGL browsers
// - Performance mode integration
// - Single Responsibility: only handles canvas setup
```

#### 13. src/presentation/components/sections/Hero/HeroContent.tsx

Typography and CTAs.

```typescript
// Requirements:
// - Uses Typography components from prompt 11 (DRY)
// - Uses Button component from prompt 11 (DRY)
// - Animated entrance with Framer Motion
// - Accessible: proper heading hierarchy
// - Props: title, subtitle, ctaButtons[]
```

#### 14. src/presentation/components/sections/Hero/Hero.tsx

Container component (Composition Root).

```typescript
// Requirements:
// - Composes HeroCanvas and HeroContent
// - Uses Section component from prompt 12 (DRY)
// - Scroll indicator at bottom
// - Responsive: stacks on mobile
// - Accessible: skip link, reduced motion support
```

#### 15. src/presentation/components/sections/Hero/ScrollIndicator.tsx

Animated scroll indicator.

```typescript
// Requirements:
// - Bouncing arrow animation
// - Fades out on scroll (uses useScrollProgress from prompt 13)
// - Accessible: hidden from screen readers (decorative)
// - Single Responsibility: only handles scroll indicator
```

### Phase 5: Integration Layer (Dependency Injection)

#### 16. src/presentation/three/scenes/HeroScene/useHeroScene.ts

Custom hook for scene state and configuration.

```typescript
// Requirements:
// - Returns memoized PipelineConfig based on performance mode
// - Handles scene initialization
// - Manages animation state
// - Single Responsibility: scene orchestration only
```

### Phase 6: Tests (TDD)

#### 17. src/presentation/three/scenes/HeroScene/**tests**/PipelineConfig.test.ts

```typescript
// Test cases:
// - default() returns valid configuration
// - minimal() has reduced settings
// - Node positions are valid Position3D
// - Colors use theme integration
```

#### 18. src/presentation/components/sections/Hero/**tests**/Hero.test.tsx

```typescript
// Test cases:
// - Renders HeroContent
// - Shows fallback when WebGL unavailable
// - Scroll indicator visible initially
// - Accessibility: has skip link
// - Reduced motion: animations disabled when preferred
```

#### 19. src/presentation/components/sections/Hero/**tests**/HeroContent.test.tsx

```typescript
// Test cases:
// - Renders title and subtitle
// - CTA buttons are clickable
// - Heading hierarchy is correct
// - Responsive layout works
```

### Phase 7: Barrel Exports & Commit

#### 20. src/presentation/three/scenes/HeroScene/index.ts

```typescript
export { HeroScene } from './HeroScene';
export { useHeroScene } from './useHeroScene';
export type { PipelineConfig } from './domain/PipelineConfig';
```

#### 21. src/presentation/components/sections/Hero/index.ts

```typescript
export { Hero } from './Hero';
export { HeroContent } from './HeroContent';
```

#### 22. Update CHANGELOG.md

```markdown
### Added

- Hero section with 3D ETL pipeline visualization
- DataParticleSystem with 10,000+ instanced particles
- ETL pipeline nodes with animated connections
- Custom data flow shaders
- Performance-aware rendering with fallbacks
- Comprehensive tests for Hero components
```

#### 23. Commit

```
feat: implement hero section with 3d pipeline visualization

- Add ETLNode and PipelineConfig value objects
- Implement DataParticleSystem with InstancedMesh
- Add ETL pipeline visualization with animated connections
- Create custom data flow shaders
- Integrate performance mode for graceful degradation
- Add comprehensive unit tests

Implements: DDD domain layer, SOLID interfaces, DRY composition
```

## SOLID Principles Applied

| Principle                 | Application                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| **S**ingle Responsibility | DataPacket only animates, ETLNode3D only renders node            |
| **O**pen/Closed           | ETLPipelineVisualization accepts custom node renderers           |
| **L**iskov Substitution   | Any IAnimatable component works with AnimationConfig             |
| **I**nterface Segregation | Components accept specific value objects, not giant config       |
| **D**ependency Inversion  | HeroScene depends on interfaces, PipelineConfig abstracts config |

## DRY Achievements

| Repeated Pattern   | Centralized Solution                 |
| ------------------ | ------------------------------------ |
| Particle rendering | Reuses DataParticle from prompt 13   |
| Glow effects       | Reuses GlowingSphere from prompt 13  |
| Connection lines   | Reuses ConnectionLine from prompt 13 |
| Post-processing    | Uses PostProcessingPresets.hero      |
| Mouse parallax     | Uses useMousePosition hook           |

## Performance Requirements

- [ ] 60fps with 10,000 particles
- [ ] Fallback for WebGL-unsupported browsers
- [ ] Reduced particle count on mobile (usePerformanceMode)
- [ ] Lazy load 3D scene with Suspense
- [ ] Dispose resources on unmount

## Accessibility Requirements

- [ ] Skip link to main content
- [ ] Respects prefers-reduced-motion
- [ ] Heading hierarchy (h1 for name)
- [ ] CTA buttons are keyboard accessible
- [ ] 3D scene has aria-hidden (decorative)

## Output

Stunning hero section that:

- Showcases data engineering expertise visually
- Performs well on all devices
- Is fully accessible
- Is maintainable and testable
