# PROMPT 15: About Section - Bento Grid Layout (SOLID/DRY/TDD/DDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/about-section

# Create GitHub issue
gh issue create --title "feat: About section with bento grid" \
  --body "Implement about section with bento grid layout displaying metrics and highlights"
```

## Task

Create about section with bento grid and subtle 3D elements following clean architecture principles.

## Architecture Overview

```
src/presentation/
├── components/sections/About/
│   ├── domain/                 # Section-specific domain
│   │   ├── AboutMetric.ts      # Value object for metrics
│   │   └── AboutConfig.ts      # Configuration value object
│   ├── About.tsx               # Container (composition root)
│   ├── BentoGrid.tsx           # Grid layout component
│   ├── AboutCard.tsx           # Individual card component
│   └── ProfileImage.tsx        # Animated profile image
└── hooks/
    └── useAboutData.ts         # Data fetching hook
```

## Files to Create

### Phase 1: Domain Layer (TDD - Write Tests First)

#### 1. src/presentation/components/sections/About/domain/AboutMetric.ts

Value object for metric cards.

```typescript
// Requirements:
// - Immutable value object
// - Properties: value (string|number), label, icon, description?
// - Factory: AboutMetric.create({ value, label, icon })
// - Factory: AboutMetric.yearsExperience(years)
// - Factory: AboutMetric.projectCount(count)
// - Validation: value and label required
```

#### 2. src/presentation/components/sections/About/domain/AboutConfig.ts

Configuration for the about section layout.

```typescript
// Requirements:
// - Defines grid layout, metrics, profile info
// - Factory: AboutConfig.default()
// - Methods: getMetrics(), getProfileInfo()
// - Integration with usePersonalInfo from domain layer
```

#### 3. src/presentation/components/sections/About/**tests**/AboutMetric.test.ts

```typescript
// Test cases:
// - create() with valid data returns metric
// - create() throws for missing value or label
// - yearsExperience() formats correctly
// - projectCount() formats correctly
// - Immutability preserved
```

### Phase 2: UI Components (Composition Pattern - SOLID)

#### 4. src/presentation/components/sections/About/BentoGrid.tsx

CSS Grid container with varied cell sizes.

```typescript
// Requirements:
// - Props: children, columns?, gap?, className?
// - Implements responsive grid (1 col mobile, 2-3 col desktop)
// - Uses CSS Grid with grid-template-areas for layout flexibility
// - Single Responsibility: only handles grid layout
// - Open for extension: accepts any children via slots
```

#### 5. src/presentation/components/sections/About/BentoCell.tsx

Individual bento cell wrapper.

```typescript
// Requirements:
// - Props: size ('small' | 'medium' | 'large'), children, className?
// - Glassmorphism styling using shared styles (DRY)
// - Hover animation via Framer Motion
// - Single Responsibility: only handles cell styling
```

#### 6. src/presentation/components/sections/About/AboutCard.tsx

Generic about card component (Open/Closed Principle).

```typescript
// Requirements:
// - Props implement IAboutCardProps interface
// - Variants: 'metric' | 'profile' | 'highlight' | 'custom'
// - Uses Card component from prompt 11 (DRY)
// - Open for extension: renderContent prop for custom content
// - Composes BentoCell for consistent styling
```

#### 7. src/presentation/components/sections/About/MetricCard.tsx

Specialized card for displaying metrics.

```typescript
// Requirements:
// - Props accept AboutMetric value object (Dependency Inversion)
// - Animated counter for numeric values (Framer Motion)
// - Icon rendering using shared icon system
// - Single Responsibility: only renders metric data
```

#### 8. src/presentation/components/sections/About/ProfileImage.tsx

Animated profile image with 3D effect.

```typescript
// Requirements:
// - 3D rotation on hover (CSS perspective transform)
// - Uses next/image for optimization
// - Glassmorphism border effect
// - Accessible: decorative image with empty alt or meaningful alt
// - Single Responsibility: only handles image display
```

#### 9. src/presentation/components/sections/About/HighlightCard.tsx

Card for key highlights (current focus, location).

```typescript
// Requirements:
// - Props: title, content, icon?, link?
// - Uses Typography from prompt 11 (DRY)
// - Supports markdown content
// - Single Responsibility: only renders highlight
```

#### 10. src/presentation/components/sections/About/About.tsx

Container component (Composition Root).

```typescript
// Requirements:
// - Composes BentoGrid with AboutCard variants
// - Uses Section component from prompt 12 (DRY)
// - Scroll-triggered entrance animations (Intersection Observer)
// - Uses useAboutData hook for data (Dependency Inversion)
// - Accessible: proper ARIA landmarks
```

### Phase 3: Data Layer (Dependency Inversion)

#### 11. src/presentation/hooks/useAboutData.ts

Custom hook for about section data.

```typescript
// Requirements:
// - Returns AboutConfig or individual metrics
// - Integrates with application layer use cases (DRY)
// - Memoized for performance
// - Single Responsibility: only handles data fetching
```

### Phase 4: Content Configuration

#### 12. src/data/about.json (or update existing)

```json
// Content cards configuration:
// - Years of experience: 4+
// - Projects delivered: 15+
// - Technologies mastered: 25+
// - Open source contributions: active
// - Current focus: MSc Big Data @ NTUA
// - Location: Athens, Greece (Remote available)
// - Bio: Brief professional summary
```

### Phase 5: Tests (TDD)

#### 13. src/presentation/components/sections/About/**tests**/About.test.tsx

```typescript
// Test cases:
// - Renders all metric cards
// - Profile image displays
// - Scroll animations trigger
// - Responsive layout works
// - Accessibility: landmarks present
```

#### 14. src/presentation/components/sections/About/**tests**/BentoGrid.test.tsx

```typescript
// Test cases:
// - Renders children in grid
// - Responsive columns work
// - Custom gap applies
// - Accepts className
```

#### 15. src/presentation/components/sections/About/**tests**/MetricCard.test.tsx

```typescript
// Test cases:
// - Displays value and label
// - Animated counter works
// - Icon renders correctly
// - Accepts AboutMetric value object
```

### Phase 6: Barrel Exports & Commit

#### 16. src/presentation/components/sections/About/index.ts

```typescript
export { About } from './About';
export { BentoGrid } from './BentoGrid';
export { AboutCard } from './AboutCard';
export type { AboutMetric } from './domain/AboutMetric';
```

#### 17. Update CHANGELOG.md

```markdown
### Added

- About section with bento grid layout
- AboutMetric value object for type-safe metrics
- Animated MetricCard with counter animation
- ProfileImage with 3D hover effect
- Scroll-triggered entrance animations
- Comprehensive tests for About components
```

#### 18. Commit

```
feat: implement about section with bento grid

- Add AboutMetric and AboutConfig value objects
- Implement BentoGrid with responsive layout
- Add animated MetricCard with counter
- Create ProfileImage with 3D hover effect
- Integrate scroll-triggered animations
- Add comprehensive unit tests

Implements: DDD value objects, SOLID composition, DRY reuse
```

## SOLID Principles Applied

| Principle                 | Application                                                     |
| ------------------------- | --------------------------------------------------------------- |
| **S**ingle Responsibility | MetricCard only displays metrics, BentoGrid only handles layout |
| **O**pen/Closed           | AboutCard accepts renderContent for extension                   |
| **L**iskov Substitution   | Any card variant works in BentoGrid                             |
| **I**nterface Segregation | IAboutCardProps, IMetricProps, IBentoGridProps                  |
| **D**ependency Inversion  | Components accept value objects, not raw data                   |

## DRY Achievements

| Repeated Pattern  | Centralized Solution                |
| ----------------- | ----------------------------------- |
| Card styling      | Reuses Card from prompt 11          |
| Typography        | Reuses Typography from prompt 11    |
| Section wrapper   | Reuses Section from prompt 12       |
| Glassmorphism     | Shared CSS utility                  |
| Scroll animations | Reusable Intersection Observer hook |

## Requirements

- [ ] Responsive grid (1→2→3 columns)
- [ ] Scroll-triggered animations
- [ ] Glassmorphism card styling
- [ ] 80%+ test coverage
- [ ] TypeScript strict mode
- [ ] Accessible (WCAG 2.1 AA)

## Output

Engaging about section with:

- Visually appealing bento grid layout
- Animated metric cards
- Type-safe value objects
- Testable, maintainable code
