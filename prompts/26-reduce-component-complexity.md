# PROMPT 26: Reduce Component Complexity (Issue #25)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b refactor/reduce-component-complexity

# Create GitHub issue
gh issue create --title "refactor: Reduce cyclomatic complexity in components" \
  --body "Break down complex components and functions to under 10 cyclomatic complexity for improved maintainability."
```

## Task

Refactor complex components and functions to reduce cyclomatic complexity to ≤10, improving readability and testability.

## Problem Analysis

The following files have cyclomatic complexity exceeding 10:

| File                                                             | Current | Target |
| ---------------------------------------------------------------- | ------- | ------ |
| `src/presentation/three/effects/PostProcessing.tsx`              | 13      | ≤10    |
| `src/presentation/three/primitives/ConnectionLine.tsx`           | 13      | ≤10    |
| `src/presentation/three/primitives/FloatingText.tsx`             | 13      | ≤10    |
| `src/shared/utils/validation.ts` validateField()                 | 19      | ≤10    |
| `src/presentation/components/sections/Hero/Hero.tsx`             | 14      | ≤10    |
| `src/presentation/components/ui/ProfileImage.tsx`                | 13      | ≤10    |
| `src/presentation/components/sections/Projects/ProjectModal.tsx` | 11      | ≤10    |
| `src/presentation/components/sections/Projects/ProjectCard.tsx`  | 12      | ≤10    |

## Files to Modify

### 1. src/shared/utils/validation.ts (Priority: High)

Current complexity: 19 → Target: ≤10

**Strategy:** Extract individual validation checks into separate functions.

```typescript
// Before: Single function with 8+ branches
export function validateField(
  rule: ValidationRule,
  options?: ValidationOptions
): void {
  // Required check
  // Empty check
  // Min length check
  // Max length check
  // Pattern check
  // Custom validator
  // ... all in one function
}

// After: Compose small, focused validators
function validateRequired(
  value: string,
  field: string,
  ErrorClass: ErrorConstructor
): void;
function validateMinLength(
  value: string,
  field: string,
  min: number,
  ErrorClass: ErrorConstructor
): void;
function validateMaxLength(
  value: string,
  field: string,
  max: number,
  ErrorClass: ErrorConstructor
): void;
function validatePattern(
  value: string,
  field: string,
  pattern: RegExp,
  message?: string,
  ErrorClass: ErrorConstructor
): void;
function validateCustom(
  value: unknown,
  field: string,
  validator: (v: unknown) => boolean,
  message?: string,
  ErrorClass: ErrorConstructor
): void;

// Main function orchestrates validators (low complexity)
export function validateField(
  rule: ValidationRule,
  options?: ValidationOptions
): void {
  const validators = buildValidatorChain(rule);
  validators.forEach(v => v());
}
```

### 2. src/presentation/three/effects/PostProcessing.tsx

Current complexity: 13 → Target: ≤10

**Strategy:** Extract effect configuration into separate functions or a configuration map.

```typescript
// Before: Large component with many conditional effects
function PostProcessing({ quality, effects }) {
  // Many if/else for different effects
}

// After: Effect factory pattern
const effectFactories: Record<EffectType, (config: EffectConfig) => Effect> = {
  bloom: createBloomEffect,
  vignette: createVignetteEffect,
  chromaticAberration: createChromaticAberrationEffect,
  // ...
};

function PostProcessing({ quality, effects }) {
  const activeEffects = effects.filter(e => shouldEnableEffect(e, quality));
  return <EffectComposer>{activeEffects.map(e => effectFactories[e.type](e.config))}</EffectComposer>;
}
```

### 3. src/presentation/three/primitives/ConnectionLine.tsx

Current complexity: 13 → Target: ≤10

**Strategy:** Extract path calculation and styling logic into helper functions.

```typescript
// Before: Complex component with embedded calculations
function ConnectionLine({ start, end, style, animated }) {
  // Path calculation logic
  // Animation logic
  // Style determination
  // Rendering logic
}

// After: Separated concerns
function calculatePath(
  start: Vector3,
  end: Vector3,
  curveType: CurveType
): Vector3[];
function getLineStyle(style: LineStyle, animated: boolean): LineStyleConfig;
function useLineAnimation(animated: boolean, duration: number): AnimationState;

function ConnectionLine({ start, end, style, animated }) {
  const path = useMemo(
    () => calculatePath(start, end, style.curve),
    [start, end, style.curve]
  );
  const lineStyle = useMemo(
    () => getLineStyle(style, animated),
    [style, animated]
  );
  // Simple render logic
}
```

### 4. src/presentation/three/primitives/FloatingText.tsx

Current complexity: 13 → Target: ≤10

**Strategy:** Extract font loading, positioning, and animation logic.

```typescript
// Before: Complex component
function FloatingText({ text, position, style, animate }) {
  // Font loading logic
  // Position calculation
  // Animation setup
  // Style application
}

// After: Composed hooks and helpers
function useFontLoader(fontPath: string): Font | null;
function useFloatAnimation(enabled: boolean): AnimationConfig;
function calculateTextPosition(
  position: Vector3,
  alignment: Alignment
): Vector3;

function FloatingText({ text, position, style, animate }) {
  const font = useFontLoader(style.font);
  const animation = useFloatAnimation(animate);
  const adjustedPosition = useMemo(
    () => calculateTextPosition(position, style.align),
    [position, style.align]
  );
  // Simple render
}
```

### 5. src/presentation/components/sections/Hero/Hero.tsx

Current complexity: 14 → Target: ≤10

**Strategy:** Extract content rendering and responsive logic into sub-components.

```typescript
// Before: Large hero with inline conditionals
function Hero() {
  // Responsive logic
  // Animation setup
  // Content rendering with many conditions
}

// After: Composition of focused components
function HeroContent({ profile }: { profile: Profile }): JSX.Element;
function HeroBackground(): JSX.Element;
function HeroCTA(): JSX.Element;

function Hero() {
  const profile = useProfile();
  return (
    <section>
      <HeroBackground />
      <HeroContent profile={profile} />
      <HeroCTA />
    </section>
  );
}
```

### 6. src/presentation/components/ui/ProfileImage.tsx

Current complexity: 13 → Target: ≤10

**Strategy:** Extract image source determination and fallback logic.

```typescript
// Before: Complex image component
function ProfileImage({ src, fallback, size, rounded }) {
  // Source validation
  // Fallback logic
  // Size calculations
  // Responsive handling
}

// After: Focused helpers
function useImageSource(
  src: string,
  fallback: string
): { src: string; isLoaded: boolean; error: boolean };
function getImageStyles(size: ImageSize, rounded: boolean): CSSProperties;

function ProfileImage({ src, fallback, size, rounded }) {
  const { src: imageSrc, error } = useImageSource(src, fallback);
  const styles = getImageStyles(size, rounded);
  // Simple render
}
```

### 7. src/presentation/components/sections/Projects/ProjectModal.tsx

Current complexity: 11 → Target: ≤10

**Strategy:** Extract modal sections into sub-components.

```typescript
// Before: Single large modal component
function ProjectModal({ project, isOpen, onClose }) {
  // Header logic
  // Gallery logic
  // Details logic
  // Actions logic
}

// After: Composed sections
function ModalHeader({ project, onClose }: ModalHeaderProps): JSX.Element;
function ModalGallery({ images }: { images: string[] }): JSX.Element;
function ModalDetails({ project }: { project: Project }): JSX.Element;
function ModalActions({ project }: { project: Project }): JSX.Element;

function ProjectModal({ project, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <Dialog onClose={onClose}>
      <ModalHeader project={project} onClose={onClose} />
      <ModalGallery images={project.images} />
      <ModalDetails project={project} />
      <ModalActions project={project} />
    </Dialog>
  );
}
```

### 8. src/presentation/components/sections/Projects/ProjectCard.tsx

Current complexity: 12 → Target: ≤10

**Strategy:** Extract card sections and interaction logic.

```typescript
// Before: Complex card with inline logic
function ProjectCard({ project, onClick }) {
  // Image handling
  // Tech stack rendering
  // Hover states
  // Click handling
}

// After: Composed elements
function CardImage({ src, alt }: { src: string; alt: string }): JSX.Element;
function CardTechStack({ technologies }: { technologies: string[] }): JSX.Element;
function useCardInteraction(): { isHovered: boolean; handlers: CardHandlers };

function ProjectCard({ project, onClick }) {
  const { isHovered, handlers } = useCardInteraction();
  return (
    <article {...handlers} onClick={onClick}>
      <CardImage src={project.image} alt={project.title} />
      <h3>{project.title}</h3>
      <CardTechStack technologies={project.technologies} />
    </article>
  );
}
```

## Refactoring Patterns

### Pattern 1: Extract Validators (for validation.ts)

```typescript
// Create a validation pipeline
type Validator = () => void;

function createValidatorChain(
  rule: ValidationRule,
  ErrorClass: ErrorConstructor
): Validator[] {
  const validators: Validator[] = [];
  const value = typeof rule.value === 'string' ? rule.value.trim() : '';

  if (rule.required) {
    validators.push(() => validateRequired(value, rule.field, ErrorClass));
  }

  if (rule.minLength !== undefined) {
    validators.push(() =>
      validateMinLength(value, rule.field, rule.minLength, ErrorClass)
    );
  }

  // ... add more validators

  return validators;
}
```

### Pattern 2: Configuration Objects (for PostProcessing)

```typescript
// Replace conditionals with configuration lookup
const qualitySettings: Record<QualityLevel, EffectSettings> = {
  high: { bloom: true, vignette: true, chromatic: true },
  medium: { bloom: true, vignette: true, chromatic: false },
  low: { bloom: false, vignette: true, chromatic: false },
};

function getActiveEffects(quality: QualityLevel): EffectSettings {
  return qualitySettings[quality];
}
```

### Pattern 3: Component Composition (for Hero, ProjectModal)

```typescript
// Split large components into focused sub-components
// Each sub-component handles ONE responsibility
// Parent orchestrates composition
```

## Tests to Add/Update

### For validation.ts refactoring

```typescript
// tests/unit/shared/utils/validation.test.ts
describe('validateField', () => {
  describe('validateRequired', () => {
    it('throws for empty required field');
    it('passes for non-empty required field');
  });

  describe('validateMinLength', () => {
    it('throws when below minimum');
    it('passes when at minimum');
    it('passes when above minimum');
  });

  // Test each extracted validator independently
});
```

### For component refactoring

```typescript
// Test sub-components independently
describe('HeroContent', () => {
  it('renders profile information');
});

describe('HeroBackground', () => {
  it('renders background elements');
});
```

## SOLID Principles Applied

| Principle                 | Application                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| **S**ingle Responsibility | Each extracted function/component does ONE thing                    |
| **O**pen/Closed           | Configuration objects allow extension without modification          |
| **L**iskov Substitution   | Sub-components are interchangeable within their contracts           |
| **I**nterface Segregation | Small, focused interfaces for each helper                           |
| **D**ependency Inversion  | Components depend on abstractions (hooks, helpers), not concretions |

## Requirements

- [ ] All files have cyclomatic complexity ≤10
- [ ] No change in functionality (pure refactoring)
- [ ] All existing tests pass
- [ ] New tests for extracted functions/components
- [ ] Improved code readability
- [ ] Maintain 60fps for 3D components

## Verification

```bash
# Run complexity check (requires eslint-plugin-complexity or similar)
npx eslint src/ --rule 'complexity: ["error", 10]'

# Run all tests
npm run test

# Type check
npm run type-check

# Build
npm run build
```

## Commit Message

```
refactor: reduce cyclomatic complexity in components

- Extract validation helpers in validation.ts (19 → 8)
- Refactor PostProcessing with effect factories (13 → 8)
- Simplify ConnectionLine with path helpers (13 → 9)
- Extract FloatingText composition hooks (13 → 8)
- Split Hero into focused sub-components (14 → 7)
- Simplify ProfileImage with custom hooks (13 → 8)
- Compose ProjectModal from sections (11 → 6)
- Extract ProjectCard sub-components (12 → 7)

All components now have complexity ≤10
No functionality changes

Closes #<issue-number>
```

## Git Workflow

```bash
# After implementation
git add .
git commit -m "refactor: reduce cyclomatic complexity in components

- Extract validation helpers in validation.ts (19 → 8)
- Refactor PostProcessing with effect factories (13 → 8)
- Simplify ConnectionLine with path helpers (13 → 9)
- Extract FloatingText composition hooks (13 → 8)
- Split Hero into focused sub-components (14 → 7)
- Simplify ProfileImage with custom hooks (13 → 8)
- Compose ProjectModal from sections (11 → 6)
- Extract ProjectCard sub-components (12 → 7)

All components now have complexity ≤10
No functionality changes

Closes #<issue-number>"

# Create PR
git push -u origin refactor/reduce-component-complexity
gh pr create --title "refactor: Reduce component complexity (Issue #25)" \
  --body "## Summary
Reduces cyclomatic complexity across 8 files from 11-19 down to ≤10.

## Changes
- validation.ts: Extract individual validators (19 → 8)
- PostProcessing.tsx: Effect factory pattern (13 → 8)
- ConnectionLine.tsx: Path calculation helpers (13 → 9)
- FloatingText.tsx: Composition hooks (13 → 8)
- Hero.tsx: Sub-component composition (14 → 7)
- ProfileImage.tsx: Image source hook (13 → 8)
- ProjectModal.tsx: Modal sections (11 → 6)
- ProjectCard.tsx: Card sub-components (12 → 7)

## Test plan
- [ ] All existing tests pass
- [ ] New tests for extracted functions
- [ ] Visual verification of all affected components
- [ ] 60fps maintained for 3D components
- [ ] No functionality changes

Closes #<issue-number>"
```

## Output

Maintainable codebase with:

- All components/functions at ≤10 cyclomatic complexity
- Improved testability through smaller units
- Better code readability
- Easier future modifications
