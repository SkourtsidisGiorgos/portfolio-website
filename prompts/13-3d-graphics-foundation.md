# PROMPT 13: 3D Graphics Foundation (SOLID/DRY/TDD/DDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/3d-graphics-foundation

# Create GitHub issue
gh issue create --title "feat: Add React Three Fiber foundation" \
  --body "Set up 3D graphics foundation with clean architecture, value objects, and primitives"
```

## Task

Set up React Three Fiber foundation with clean architecture following SOLID, DRY, TDD, and DDD principles.

## Install

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

## Architecture Overview

```
src/presentation/three/
├── domain/                    # 3D Domain Layer (DDD)
│   ├── value-objects/         # Position, Color, AnimationConfig
│   ├── interfaces/            # Contracts for 3D components
│   └── factories/             # Factory methods for 3D objects
├── primitives/                # Atomic 3D components
├── composites/                # Composite 3D components
├── effects/                   # Post-processing effects
├── hooks/                     # 3D-specific hooks
├── utils/                     # Pure utility functions
└── __tests__/                 # Unit tests (TDD)
```

## Files to Create

### Phase 1: Domain Layer (Write Tests First - TDD)

#### 1. src/presentation/three/domain/value-objects/Position3D.ts

Value object for 3D positions with validation and operations.

```typescript
// Requirements:
// - Immutable tuple [x, y, z]
// - Factory method: Position3D.create(x, y, z)
// - Factory method: Position3D.origin() -> [0, 0, 0]
// - Methods: add(other), scale(factor), distanceTo(other), toArray()
// - Validation: All values must be finite numbers
```

#### 2. src/presentation/three/domain/value-objects/Color3D.ts

Value object for colors with theme integration.

```typescript
// Requirements:
// - Accepts hex string or RGB values
// - Factory: Color3D.fromTheme('primary' | 'accent' | 'success')
// - Factory: Color3D.fromHex(hex)
// - Methods: withOpacity(opacity), toHex(), toRGB()
// - Integration with src/shared/constants/colors.ts
```

#### 3. src/presentation/three/domain/value-objects/AnimationConfig.ts

Value object for animation parameters.

```typescript
// Requirements:
// - Properties: speed, intensity, easing, enabled
// - Factory: AnimationConfig.pulse(speed?)
// - Factory: AnimationConfig.rotation(speed?)
// - Factory: AnimationConfig.disabled()
// - Immutable with .with() method for updates
```

#### 4. src/presentation/three/domain/interfaces/IPrimitive3D.ts

Interface Segregation - small, focused interfaces (SOLID - I).

```typescript
// Requirements:
// - IPositionable: position: Position3D
// - IColorable: color: Color3D
// - IAnimatable: animation: AnimationConfig
// - IScalable: scale: number | [number, number, number]
// - IPrimitive3D extends IPositionable (minimal base)
```

#### 5. src/presentation/three/domain/interfaces/IEffectComposer.ts

Interface for post-processing effects.

```typescript
// Requirements:
// - IBloomConfig: intensity, threshold, smoothing
// - IVignetteConfig: darkness, offset
// - IChromaticConfig: offset: [number, number]
// - IEffectPreset: name, bloom?, vignette?, chromatic?
```

#### 6. src/presentation/three/domain/factories/PrimitiveFactory.ts

Factory pattern for creating 3D primitives (SOLID - D, DRY).

```typescript
// Requirements:
// - createParticle(config: ParticleConfig): DataParticleProps
// - createSphere(config: SphereConfig): GlowingSphereProps
// - createFromPreset(preset: 'data' | 'node' | 'highlight'): props
// - Centralizes default values (DRY)
// - Depends on abstractions, not concretions (SOLID - D)
```

### Phase 2: Utility Layer (Pure Functions - Testable)

#### 7. src/presentation/three/utils/geometryHelpers.ts

Keep existing but ensure all functions are pure and tested.

```typescript
// Additional requirements:
// - All functions must be pure (no side effects)
// - Export individual functions for tree-shaking
// - Add JSDoc with @param and @returns
// - Test edge cases: negative values, zero, infinity
```

#### 8. src/presentation/three/utils/animationHelpers.ts

Animation-specific utilities (DRY - extract repeated animation logic).

```typescript
// Requirements:
// - pulseValue(time, speed, min, max): number
// - oscillateScale(time, speed, intensity): number
// - fadeOpacity(time, speed, base): number
// - These are currently duplicated across components
```

### Phase 3: Hooks Layer (Single Responsibility - SOLID S)

#### 9. src/presentation/three/hooks/useMousePosition.ts

Keep existing - well structured.

#### 10. src/presentation/three/hooks/useScrollProgress.ts

```typescript
// Requirements:
// - Returns: { progress: number, direction: 'up' | 'down' | null }
// - Smoothing option
// - Section-based progress (not just page)
// - Debounced updates for performance
```

#### 11. src/presentation/three/hooks/useAnimationFrame.ts (NEW)

Extract common animation frame logic (DRY).

```typescript
// Requirements:
// - Wraps useFrame with common patterns
// - Auto-pause when not visible (performance)
// - Provides elapsed time, delta, and clock
// - Single Responsibility: only handles animation frame
```

#### 12. src/presentation/three/hooks/usePerformanceMode.ts (NEW)

Detect device capabilities for graceful degradation.

```typescript
// Requirements:
// - Detects: GPU tier, mobile, low power mode
// - Returns: { quality: 'high' | 'medium' | 'low', particleCount, enableEffects }
// - Components depend on this abstraction (SOLID - D)
```

### Phase 4: Primitive Components (Open/Closed - SOLID O)

#### 13. src/presentation/three/primitives/DataParticle.tsx

Refactor to use domain objects and be open for extension.

```typescript
// Requirements:
// - Props extend IPositionable, IColorable, IAnimatable
// - Accept Position3D, Color3D, AnimationConfig value objects
// - Use useAnimationFrame hook (DRY)
// - Configurable via PrimitiveFactory presets
// - Open for extension: accept custom geometry/material
```

#### 14. src/presentation/three/primitives/GlowingSphere.tsx

Refactor for consistency and extensibility.

```typescript
// Requirements:
// - Same interface patterns as DataParticle
// - Extract glow layers to separate component (Single Responsibility)
// - Use animationHelpers utilities (DRY)
// - Support wireframe and solid modes via composition
```

#### 15. src/presentation/three/primitives/GlowLayer.tsx (NEW - extracted)

Single responsibility - just renders glow effect.

```typescript
// Requirements:
// - Props: radius, color, opacity, scale
// - Used by GlowingSphere and other glowing components
// - Single Responsibility: only handles glow rendering
```

#### 16. src/presentation/three/primitives/FloatingText.tsx

```typescript
// Requirements:
// - Uses drei Text component
// - Integrates with Color3D for theme consistency
// - Animation via AnimationConfig value object
// - Accessibility: aria-label prop for screen readers
```

#### 17. src/presentation/three/primitives/ConnectionLine.tsx

```typescript
// Requirements:
// - Props: start: Position3D, end: Position3D
// - Animated flow effect using animationHelpers
// - Configurable dash pattern and flow speed
// - DataFlow as composition, not separate component (DRY)
```

#### 18. src/presentation/three/primitives/GridFloor.tsx

```typescript
// Requirements:
// - Configurable grid size, divisions, colors
// - Uses Color3D for theme integration
// - Fade at edges using shader or distance calc
// - Performance: static geometry, no per-frame updates
```

### Phase 5: Effects Layer

#### 19. src/presentation/three/effects/PostProcessing.tsx

Refactor to use interface-based configuration.

```typescript
// Requirements:
// - Props implement IEffectComposer interfaces
// - Presets defined as IEffectPreset objects
// - Accept custom effect configurations
// - Performance mode integration via usePerformanceMode
```

#### 20. src/presentation/three/effects/presets.ts (NEW)

Centralize effect presets (DRY).

```typescript
// Requirements:
// - Export typed preset objects: hero, subtle, minimal, performance
// - Each preset implements IEffectPreset
// - Single source of truth for effect configurations
```

### Phase 6: Barrel Exports

#### 21. src/presentation/three/domain/index.ts

```typescript
// Export all value objects, interfaces, and factories
```

#### 22. src/presentation/three/primitives/index.ts

```typescript
// Export all primitive components and their prop types
```

#### 23. src/presentation/three/index.ts (NEW)

```typescript
// Main barrel export for the 3D module
// Organized by: domain, primitives, effects, hooks, utils
```

### Phase 7: Tests (TDD - Write First!)

#### 24. src/presentation/three/**tests**/value-objects/Position3D.test.ts

```typescript
// Test cases:
// - create() with valid values
// - create() throws for invalid values (NaN, Infinity)
// - origin() returns [0, 0, 0]
// - add() combines two positions
// - scale() multiplies by factor
// - distanceTo() calculates euclidean distance
// - toArray() returns tuple
```

#### 25. src/presentation/three/**tests**/value-objects/Color3D.test.ts

```typescript
// Test cases:
// - fromTheme() returns correct colors
// - fromHex() parses hex correctly
// - withOpacity() returns new instance
// - toHex() formats correctly
// - Invalid hex throws
```

#### 26. src/presentation/three/**tests**/value-objects/AnimationConfig.test.ts

```typescript
// Test cases:
// - pulse() creates correct config
// - rotation() creates correct config
// - disabled() sets enabled to false
// - with() returns new instance with updates
// - Immutability is preserved
```

#### 27. src/presentation/three/**tests**/utils/geometryHelpers.test.ts

```typescript
// Test cases:
// - All pure functions return expected values
// - Edge cases: zero, negative, very large numbers
// - lerp() interpolates correctly
// - clamp() bounds values
// - distance3D() calculates correctly
```

#### 28. src/presentation/three/**tests**/utils/animationHelpers.test.ts

```typescript
// Test cases:
// - pulseValue() oscillates between min/max
// - oscillateScale() returns correct scale
// - Functions are pure (same input = same output)
```

#### 29. src/presentation/three/**tests**/factories/PrimitiveFactory.test.ts

```typescript
// Test cases:
// - createParticle() returns valid props
// - createSphere() returns valid props
// - createFromPreset() returns preset-specific props
// - Default values are applied correctly
```

#### 30. src/presentation/three/**tests**/hooks/usePerformanceMode.test.ts

```typescript
// Test cases:
// - Returns correct quality levels
// - Mobile detection works
// - Particle count scales with quality
// - Effects disabled on low quality
```

### Phase 8: Documentation & Commit

#### 31. Update CHANGELOG.md

```markdown
### Added

- 3D domain layer with value objects (Position3D, Color3D, AnimationConfig)
- Interface contracts for 3D components (IPrimitive3D, IEffectComposer)
- PrimitiveFactory for consistent component creation
- Animation helpers to eliminate duplication
- Performance mode detection for graceful degradation
- Comprehensive unit tests for 3D utilities
```

#### 32. Commit

```
feat: add react three fiber foundation with clean architecture

- Add domain value objects: Position3D, Color3D, AnimationConfig
- Add interface contracts following Interface Segregation
- Add PrimitiveFactory following Factory pattern
- Extract animation helpers (DRY)
- Add usePerformanceMode for graceful degradation
- Add comprehensive unit tests (TDD)
- Refactor primitives to use domain objects

BREAKING CHANGE: Primitive components now accept value objects
```

## SOLID Principles Applied

| Principle                 | Application                                              |
| ------------------------- | -------------------------------------------------------- |
| **S**ingle Responsibility | GlowLayer extracted, hooks do one thing                  |
| **O**pen/Closed           | Primitives accept custom geometry/materials              |
| **L**iskov Substitution   | All IPrimitive3D implementations are interchangeable     |
| **I**nterface Segregation | Small interfaces: IPositionable, IColorable, IAnimatable |
| **D**ependency Inversion  | Components depend on interfaces, not concretions         |

## DRY Achievements

| Before                                    | After                              |
| ----------------------------------------- | ---------------------------------- |
| Animation math duplicated in 5 components | Centralized in animationHelpers.ts |
| Color hex strings hardcoded               | Color3D.fromTheme()                |
| Default values repeated                   | PrimitiveFactory presets           |
| useFrame boilerplate repeated             | useAnimationFrame hook             |

## TDD Approach

1. **Write test first** for each value object
2. **Run test** - see it fail (red)
3. **Implement** minimal code to pass
4. **Refactor** while tests pass (green)
5. **Repeat** for all components

## Requirements

- [ ] 80%+ test coverage for utils and domain layer
- [ ] All tests pass before commit
- [ ] Performance: 60fps with 10,000 particles
- [ ] Graceful degradation on mobile devices
- [ ] TypeScript strict mode compliance
- [ ] No hardcoded colors - use Color3D.fromTheme()

## Output

Clean, maintainable 3D graphics foundation with:

- Testable value objects
- Interface-based design
- Factory pattern for creation
- DRY utility functions
- Performance-aware rendering
