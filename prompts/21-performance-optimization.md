# PROMPT 21: Performance Optimization (SOLID/DRY/TDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/performance-optimization

# Create GitHub issue
gh issue create --title "perf: Optimize performance for production" \
  --body "Implement lazy loading, 3D optimization, bundle optimization, and performance monitoring"
```

## Task

Optimize performance for production following best practices and clean code principles.

## Architecture Overview

```
src/
├── presentation/
│   ├── hooks/
│   │   ├── usePerformanceMode.ts     # Device capability detection
│   │   ├── useLazySection.ts         # Lazy loading hook
│   │   └── useWebGLSupport.ts        # WebGL detection
│   └── three/
│       ├── utils/
│       │   ├── performanceUtils.ts   # 3D optimization utilities
│       │   └── resourceManager.ts    # Resource cleanup
│       └── components/
│           └── PerformanceMonitor.tsx # Dev FPS counter
├── shared/
│   ├── config/
│   │   └── performance.config.ts     # Performance settings
│   └── utils/
│       └── deviceDetection.ts        # Device capability utils
└── app/
    └── analytics/                    # Web Vitals tracking
```

## Files to Create

### Phase 1: Device Detection & Performance Mode

#### 1. src/shared/utils/deviceDetection.ts

Device capability detection utilities (DRY).

```typescript
// Requirements:
// - Detect GPU tier (navigator.gpu or fallback heuristics)
// - Detect mobile/tablet/desktop
// - Detect low power mode (Battery API)
// - Detect memory constraints
// - Pure functions, easily testable
// - Single Responsibility: only device detection
```

#### 2. src/presentation/hooks/usePerformanceMode.ts (update from prompt 13)

Enhanced performance mode hook.

```typescript
// Requirements:
// - Uses deviceDetection utilities (DRY)
// - Returns: { quality: 'high' | 'medium' | 'low', settings }
// - Settings include: particleCount, enableEffects, enableShadows, textureQuality
// - Memoized for performance
// - Respects user preference (localStorage)
// - Single Responsibility: orchestrates performance settings
```

#### 3. src/shared/config/performance.config.ts

Centralized performance settings (DRY).

```typescript
// Requirements:
// - Quality level definitions
// - Particle counts per level
// - Effect enable/disable per level
// - LOD distances
// - Single source of truth
```

### Phase 2: Lazy Loading

#### 4. src/presentation/hooks/useLazySection.ts

Intersection Observer based lazy loading.

```typescript
// Requirements:
// - Uses Intersection Observer with threshold
// - Returns: { ref, isVisible, hasLoaded }
// - Configurable rootMargin for preloading
// - Once loaded, stays loaded (no unload)
// - Single Responsibility: visibility detection
```

#### 5. src/presentation/components/layout/LazySection.tsx

Lazy loading wrapper component.

```typescript
// Requirements:
// - Wraps section with Suspense boundary
// - Shows skeleton while loading (uses Skeleton from prompt 11 - DRY)
// - Uses useLazySection hook
// - Props: fallback, rootMargin
// - Single Responsibility: lazy loading container
```

#### 6. Update section imports in page.tsx

```typescript
// Requirements:
// - Use dynamic imports for 3D-heavy sections
// - Wrap with LazySection
// - Keep Hero eager (above fold)
// - Example: const Skills = dynamic(() => import('./Skills'), { ssr: false })
```

### Phase 3: 3D Optimization

#### 7. src/presentation/three/utils/performanceUtils.ts

3D performance utilities.

```typescript
// Requirements:
// - createInstancedMesh helper (for particles)
// - mergeGeometries helper (reduce draw calls)
// - LOD helper functions
// - Frustum culling utilities
// - Pure functions, testable
// - DRY: used by all 3D components
```

#### 8. src/presentation/three/utils/resourceManager.ts

Resource cleanup utilities.

```typescript
// Requirements:
// - dispose(object) - recursive disposal
// - disposeGeometry, disposeMaterial, disposeTexture
// - Pool for reusable objects
// - Memory leak prevention
// - Single Responsibility: resource lifecycle
```

#### 9. src/presentation/three/components/LODWrapper.tsx

Level of Detail wrapper.

```typescript
// Requirements:
// - Props: distances: number[], children: ReactElement[]
// - Renders appropriate child based on camera distance
// - Integrates with usePerformanceMode
// - Single Responsibility: LOD management
```

### Phase 4: WebGL Support & Fallbacks

#### 10. src/presentation/hooks/useWebGLSupport.ts

WebGL detection hook.

```typescript
// Requirements:
// - Detect WebGL 1.0 and 2.0 support
// - Returns: { supported, version, contextLost }
// - Handles context loss gracefully
// - Single Responsibility: WebGL detection
```

#### 11. src/presentation/three/components/WebGLFallback.tsx

Fallback for non-WebGL browsers.

```typescript
// Requirements:
// - Shows static image or CSS-only alternative
// - Graceful messaging
// - Uses Card from prompt 11 (DRY)
// - Single Responsibility: fallback display
```

### Phase 5: Bundle Optimization

#### 12. next.config.ts optimizations

```typescript
// Requirements:
// - Image optimization config
// - Bundle analyzer (conditional)
// - Webpack optimizations
// - Tree shaking verification
// - Code splitting settings
```

#### 13. src/shared/utils/dynamicImport.ts

Dynamic import helpers (DRY).

```typescript
// Requirements:
// - Helper for consistent dynamic imports
// - SSR toggle option
// - Loading component standardization
// - Single source of truth for import patterns
```

### Phase 6: Image Optimization

#### 14. src/shared/utils/imageOptimization.ts

Image utilities.

```typescript
// Requirements:
// - Blur placeholder generation
// - Responsive srcSet helpers
// - WebP/AVIF format detection
// - Integration with next/image
// - Pure functions, testable
```

### Phase 7: Performance Monitoring

#### 15. src/app/analytics/webVitals.ts

Web Vitals tracking.

```typescript
// Requirements:
// - Track CLS, FID, FCP, LCP, TTFB
// - Report to analytics (optional)
// - Console logging in dev
// - Single Responsibility: metrics collection
```

#### 16. src/presentation/three/components/PerformanceMonitor.tsx

Dev-only FPS counter.

```typescript
// Requirements:
// - Shows FPS, draw calls, triangles
// - Only renders in development
// - Toggle visibility with keyboard shortcut
// - Uses useFrame from R3F
// - Single Responsibility: performance display
```

### Phase 8: Tests

#### 17. src/shared/utils/**tests**/deviceDetection.test.ts

```typescript
// Test cases:
// - Detects mobile correctly
// - Detects GPU tier
// - Returns defaults for missing APIs
// - Pure function behavior
```

#### 18. src/presentation/hooks/**tests**/usePerformanceMode.test.ts

```typescript
// Test cases:
// - Returns high quality for capable devices
// - Returns low quality for constrained devices
// - Respects user preference
// - Memoization works
```

### Phase 9: Lighthouse Audit & Git

#### 19. Run Lighthouse audit

```bash
# Build and run Lighthouse
npm run build
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Target scores:
# - Performance: 90+
# - Accessibility: 100
# - Best Practices: 100
# - SEO: 100
```

#### 20. Git workflow

```bash
# Commit
git add .
git commit -m "perf: optimize performance for production

- Add device detection and performance mode
- Implement lazy loading with Intersection Observer
- Add 3D optimization utilities (instancing, LOD, disposal)
- Configure bundle optimization
- Add Web Vitals tracking
- Add dev-only performance monitor
- Add comprehensive tests

Lighthouse: Performance 90+, all others 100
Closes #<issue-number>"

# Create PR
git push -u origin feature/performance-optimization
gh pr create --title "perf: Optimize performance for production" \
  --body "## Summary
- Device-aware performance modes
- Lazy loading for sections
- 3D optimization (instancing, LOD, disposal)
- Bundle optimization
- Web Vitals tracking

## Lighthouse Scores
- Performance: XX
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Test plan
- [ ] Low-end device shows reduced effects
- [ ] Lazy sections load on scroll
- [ ] 60fps on target devices
- [ ] Bundle size within budget
- [ ] All tests pass

Closes #<issue-number>"
```

## SOLID Principles Applied

| Principle                 | Application                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| **S**ingle Responsibility | deviceDetection detects, performanceUtils optimizes, resourceManager cleans |
| **O**pen/Closed           | Performance levels configurable without code changes                        |
| **L**iskov Substitution   | Any quality level works with the system                                     |
| **I**nterface Segregation | Separate hooks for lazy, WebGL, performance                                 |
| **D**ependency Inversion  | Components depend on performance config, not hardcoded values               |

## DRY Achievements

| Repeated Pattern     | Centralized Solution         |
| -------------------- | ---------------------------- |
| Device detection     | deviceDetection.ts utilities |
| Performance settings | performance.config.ts        |
| Dynamic imports      | dynamicImport.ts helpers     |
| Resource disposal    | resourceManager.ts           |
| Lazy loading         | useLazySection hook          |

## Requirements

- [ ] Core Web Vitals green
- [ ] 60fps animations on target devices
- [ ] Graceful degradation on low-end
- [ ] Bundle size optimized
- [ ] 80%+ test coverage
- [ ] Lighthouse 90+ performance

## Output

Optimized, production-ready website that:

- Performs well on all devices
- Degrades gracefully
- Is properly monitored
- Passes Lighthouse audit
