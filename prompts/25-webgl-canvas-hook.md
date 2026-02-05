# PROMPT 25: Extract WebGL Canvas Hook (DRY Refactoring)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b refactor/webgl-canvas-hook

# Create GitHub issue
gh issue create --title "refactor: Extract duplicated WebGL Canvas boilerplate into reusable hook" \
  --body "Extract duplicated WebGL support detection, context loss handling, and fallback patterns into a shared hook."
```

## Task

Extract duplicated WebGL Canvas boilerplate code from multiple canvas components into a single reusable hook following DRY principles.

## Problem Analysis

The following code is duplicated across 4+ canvas components:

- `checkWebGLSupport()` function with caching
- `subscribeToWebGLSupport()` function for useSyncExternalStore
- `getWebGLSupportSnapshot()` / `getWebGLSupportServerSnapshot()` functions
- `webGLSupportCache` module variable
- WebGL context loss/restore event handling
- `LoadingFallback` component pattern
- `ErrorFallback` component pattern

**Affected Files:**

- `src/presentation/components/sections/Hero/HeroCanvas.tsx`
- `src/presentation/components/sections/Skills/SkillsCanvas.tsx`
- `src/presentation/components/sections/Experience/ExperienceCanvas.tsx`
- `src/presentation/components/sections/Projects/ProjectsCanvas.tsx`

## Files to Create/Modify

### Phase 1: Create Shared Hook

#### 1. src/presentation/three/hooks/useWebGLCanvas.ts

Create the shared hook that encapsulates all WebGL support detection logic.

```typescript
// Requirements:
// - Export useWebGLSupport() hook that returns:
//   { isSupported: boolean, hasError: boolean, contextLost: boolean }
// - Use useSyncExternalStore for SSR-safe WebGL detection
// - Cache WebGL support result at module level
// - Handle webglcontextlost and webglcontextrestored events
// - Pure functions for checkWebGLSupport, getSnapshot, getServerSnapshot
// - Clean up event listeners on unmount
// - Single Responsibility: WebGL state management only

// Interface:
export interface WebGLSupportState {
  isSupported: boolean;
  hasError: boolean;
  contextLost: boolean;
}

export function useWebGLSupport(): WebGLSupportState;
```

#### 2. src/presentation/three/components/CanvasFallback.tsx

Create shared fallback components for loading and error states.

```typescript
// Requirements:
// - LoadingFallback component with customizable message
// - ErrorFallback component with customizable message
// - Accept className for styling flexibility
// - Use consistent styling with existing theme
// - Accessible (aria-labels, color contrast)

// Interface:
export interface FallbackProps {
  message?: string;
  className?: string;
}

export function LoadingFallback(props: FallbackProps): JSX.Element;
export function ErrorFallback(props: FallbackProps): JSX.Element;
```

#### 3. src/presentation/three/hooks/index.ts

Update barrel export to include new hook.

```typescript
export { useWebGLSupport } from './useWebGLCanvas';
// ... existing exports
```

### Phase 2: Refactor Canvas Components

#### 4. Refactor HeroCanvas.tsx

```typescript
// Remove:
// - webGLSupportCache variable
// - checkWebGLSupport function
// - subscribeToWebGLSupport function
// - getWebGLSupportSnapshot function
// - getWebGLSupportServerSnapshot function
// - LoadingFallback component (or import from shared)
// - ErrorFallback component (or import from shared)
// - WebGL context loss useEffect

// Replace with:
import { useWebGLSupport } from '@/presentation/three/hooks';
import {
  LoadingFallback,
  ErrorFallback,
} from '@/presentation/three/components/CanvasFallback';

const { isSupported, hasError } = useWebGLSupport();
```

#### 5. Refactor SkillsCanvas.tsx

Apply same refactoring pattern as HeroCanvas.

#### 6. Refactor ExperienceCanvas.tsx

Apply same refactoring pattern as HeroCanvas.

#### 7. Refactor ProjectsCanvas.tsx

Apply same refactoring pattern as HeroCanvas.

### Phase 3: Tests

#### 8. tests/unit/presentation/three/hooks/useWebGLCanvas.test.ts

```typescript
// Test cases:
// - Returns isSupported: true when WebGL is available
// - Returns isSupported: false when WebGL is not available
// - Returns true for server snapshot (SSR)
// - Caches WebGL support check result
// - Sets hasError to true on context lost event
// - Sets hasError to false on context restored event
// - Cleans up event listeners on unmount
// - Works with React.StrictMode double mounting
```

#### 9. tests/unit/presentation/three/components/CanvasFallback.test.tsx

```typescript
// Test cases:
// - LoadingFallback renders with default message
// - LoadingFallback renders with custom message
// - ErrorFallback renders with default message
// - ErrorFallback renders with custom message
// - Components accept custom className
// - Components are accessible (aria, semantic HTML)
```

## Implementation Details

### WebGL Support Detection

```typescript
// Cached at module level for performance
let webGLSupportCache: boolean | null = null;

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true; // SSR

  if (webGLSupportCache !== null) return webGLSupportCache;

  try {
    const canvas = document.createElement('canvas');
    webGLSupportCache = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    webGLSupportCache = false;
  }

  return webGLSupportCache;
}
```

### Context Loss Handling

```typescript
// Inside useWebGLSupport hook
useEffect(() => {
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    console.warn('WebGL context lost');
    setHasError(true);
  };

  const handleContextRestored = () => {
    setHasError(false);
  };

  window.addEventListener('webglcontextlost', handleContextLost);
  window.addEventListener('webglcontextrestored', handleContextRestored);

  return () => {
    window.removeEventListener('webglcontextlost', handleContextLost);
    window.removeEventListener('webglcontextrestored', handleContextRestored);
  };
}, []);
```

## SOLID Principles Applied

| Principle                 | Application                                                    |
| ------------------------- | -------------------------------------------------------------- |
| **S**ingle Responsibility | Hook handles WebGL state only, fallbacks handle UI only        |
| **O**pen/Closed           | Fallback components accept props for customization             |
| **L**iskov Substitution   | All canvas components use the same hook interface              |
| **I**nterface Segregation | Separate hook for WebGL, separate components for fallbacks     |
| **D**ependency Inversion  | Canvas components depend on abstraction (hook), not concretion |

## DRY Achievements

| Repeated Pattern      | Centralized Solution        |
| --------------------- | --------------------------- |
| WebGL detection logic | `useWebGLSupport` hook      |
| Cache management      | Module-level cache in hook  |
| Context loss handling | Event handlers in hook      |
| Loading spinner UI    | `LoadingFallback` component |
| Error message UI      | `ErrorFallback` component   |

## Requirements

- [ ] All WebGL detection logic in single hook
- [ ] All canvas components use shared hook
- [ ] Fallback components are reusable
- [ ] No duplicate code across canvas files
- [ ] All existing tests pass
- [ ] New tests for hook and fallbacks
- [ ] 80%+ test coverage for new code

## Verification

```bash
# Run type check
npm run type-check

# Run tests
npm run test:unit

# Verify no duplicate WebGL logic
grep -r "checkWebGLSupport" src/presentation/components/sections/

# Build verification
npm run build
```

## Commit Message

```
refactor: extract duplicated WebGL Canvas boilerplate into shared hook

- Create useWebGLSupport hook for WebGL detection and context handling
- Create LoadingFallback and ErrorFallback shared components
- Refactor HeroCanvas, SkillsCanvas, ExperienceCanvas, ProjectsCanvas
- Remove ~200 lines of duplicated code across 4 files
- Add comprehensive tests for new shared code

DRY: Centralizes WebGL support detection logic
SOLID: Single Responsibility for hook and fallback components

Closes #<issue-number>
```

## Git Workflow

```bash
# After implementation
git add .
git commit -m "refactor: extract duplicated WebGL Canvas boilerplate into shared hook

- Create useWebGLSupport hook for WebGL detection and context handling
- Create LoadingFallback and ErrorFallback shared components
- Refactor HeroCanvas, SkillsCanvas, ExperienceCanvas, ProjectsCanvas
- Remove ~200 lines of duplicated code across 4 files
- Add comprehensive tests for new shared code

DRY: Centralizes WebGL support detection logic
SOLID: Single Responsibility for hook and fallback components

Closes #<issue-number>"

# Create PR
git push -u origin refactor/webgl-canvas-hook
gh pr create --title "refactor: Extract WebGL Canvas hook (DRY)" \
  --body "## Summary
- Extracts duplicated WebGL support detection into \`useWebGLSupport\` hook
- Creates shared \`LoadingFallback\` and \`ErrorFallback\` components
- Refactors 4 canvas components to use shared code
- Removes ~200 lines of duplicate code

## Test plan
- [ ] All canvas sections render correctly
- [ ] WebGL fallback shows on unsupported browsers
- [ ] Context loss recovery works
- [ ] All tests pass
- [ ] No regressions in 3D visualizations

Closes #<issue-number>"
```

## Output

Clean, DRY codebase with:

- Single source of truth for WebGL support detection
- Consistent loading and error fallback UI
- Reduced code duplication across canvas components
- Improved maintainability
