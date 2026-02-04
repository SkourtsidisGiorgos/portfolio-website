# PROMPT 17: Experience Section - 3D Timeline (SOLID/DRY/TDD/DDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/experience-section

# Create GitHub issue
gh issue create --title "feat: Experience section with 3D timeline" \
  --body "Implement experience timeline with 3D visualization showing career progression"
```

## Task

Create experience timeline with 3D visualization following clean architecture principles.

## Architecture Overview

```
src/presentation/
├── three/scenes/ExperienceTimeline/
│   ├── domain/
│   │   ├── TimelineNode.ts     # Value object for timeline nodes
│   │   ├── TimelineConfig.ts   # Configuration value object
│   │   └── ConnectionPath.ts   # Value object for path between nodes
│   ├── TimelineScene.tsx       # Main scene composition
│   ├── CompanyNode.tsx         # Individual company node
│   └── TimelineConnection.tsx  # Animated connection
└── components/sections/Experience/
    ├── Experience.tsx          # Container (composition root)
    ├── ExperienceCard.tsx      # Detail card
    ├── TimelineNav.tsx         # Navigation component
    └── ExperienceList.tsx      # Mobile fallback
```

## Files to Create

### Phase 1: Domain Layer (TDD)

#### 1. src/presentation/three/scenes/ExperienceTimeline/domain/TimelineNode.ts

Value object for timeline positioning.

```typescript
// Requirements:
// - Immutable value object
// - Properties: experience (from domain), position, scale, isActive
// - Factory: TimelineNode.fromExperience(exp: Experience, index, total)
// - Calculates Z-depth based on chronological position
// - Size based on duration
// - Integration with domain Experience entity
```

#### 2. src/presentation/three/scenes/ExperienceTimeline/domain/TimelineConfig.ts

Configuration for timeline visualization.

```typescript
// Requirements:
// - Defines depth, spacing, animation speeds
// - Factory: TimelineConfig.default()
// - Factory: TimelineConfig.minimal()
// - Integration with usePerformanceMode
```

#### 3. Tests for domain layer

```typescript
// src/presentation/three/scenes/ExperienceTimeline/__tests__/TimelineNode.test.ts
// Test cases:
// - fromExperience() calculates correct position
// - Chronological ordering works
// - Size scales with duration
// - Current job is highlighted
```

### Phase 2: 3D Components (SOLID)

#### 4. src/presentation/three/scenes/ExperienceTimeline/CompanyNode.tsx

3D node for each company.

```typescript
// Requirements:
// - Props accept TimelineNode value object (Dependency Inversion)
// - Uses GlowingSphere from prompt 13 (DRY)
// - Company logo texture (optional)
// - Orbiting project satellites for key achievements
// - Technology icons arranged around node
// - Hover expands node with details
// - Single Responsibility: only renders company node
```

#### 5. src/presentation/three/scenes/ExperienceTimeline/ProjectSatellite.tsx

Small orbiting sphere representing key projects.

```typescript
// Requirements:
// - Uses DataParticle from prompt 13 (DRY)
// - Orbits around CompanyNode
// - Click shows project detail
// - Animation via AnimationConfig
// - Single Responsibility: only renders satellite
```

#### 6. src/presentation/three/scenes/ExperienceTimeline/TimelineConnection.tsx

Animated lines between nodes.

```typescript
// Requirements:
// - Uses ConnectionLine from prompt 13 (DRY)
// - Animated flow showing career progression
// - Color gradient primary → accent
// - Single Responsibility: only renders connection
```

#### 7. src/presentation/three/scenes/ExperienceTimeline/TimelineScene.tsx

Main scene composition (Composition Root).

```typescript
// Requirements:
// - Composes CompanyNode[], TimelineConnection[]
// - Camera follows scroll (uses useScrollProgress from prompt 13)
// - Depth-based reveal animation
// - Uses PostProcessing with subtle preset (DRY)
// - Props: experiences: Experience[]
```

### Phase 3: UI Components

#### 8. src/presentation/components/sections/Experience/ExperienceCard.tsx

Detail card for each experience.

```typescript
// Requirements:
// - Props accept Experience entity (from domain)
// - Uses Card component from prompt 11 (DRY)
// - Displays: company, role, dates (from DateRange value object)
// - Description bullet points
// - Technology badges (uses Badge from prompt 11)
// - Expand/collapse animation
// - Single Responsibility: only displays experience
```

#### 9. src/presentation/components/sections/Experience/TimelineNav.tsx

Year markers for navigation.

```typescript
// Requirements:
// - Props: years: number[], currentYear: number
// - Quick jump to year
// - Syncs with scroll position
// - Uses Button from prompt 11 (DRY)
// - Single Responsibility: only handles navigation
```

#### 10. src/presentation/components/sections/Experience/ExperienceList.tsx

Mobile fallback view.

```typescript
// Requirements:
// - Renders when 3D disabled
// - Reuses ExperienceCard (DRY)
// - Chronological list
// - Accessible: proper list semantics
```

#### 11. src/presentation/components/sections/Experience/ExperienceCanvas.tsx

3D Canvas wrapper.

```typescript
// Requirements:
// - WebGL detection with fallback
// - Error boundary
// - Scroll sync
// - Performance mode integration
```

#### 12. src/presentation/components/sections/Experience/Experience.tsx

Container component (Composition Root).

```typescript
// Requirements:
// - Composes ExperienceCanvas, ExperienceCard[], TimelineNav
// - Uses Section component from prompt 12 (DRY)
// - Uses useExperiences from application layer
// - Scroll-driven reveal
// - Accessible: timeline semantics
```

### Phase 4: Data Integration

#### 13. src/presentation/hooks/useExperienceTimeline.ts

Custom hook for timeline logic.

```typescript
// Requirements:
// - Returns: experiences, years, scrollToYear
// - Integrates with GetExperiencesUseCase
// - Memoized transformations
// - Single Responsibility: orchestrates data flow
```

#### 14. Experience data from CV

```typescript
// Experiences:
// 1. SWIFT (Nov 2023 - Present) - Big Data Engineer, Brussels (Remote)
//    - Kafka Connect pipelines
//    - PySpark data validation
//    - Airflow orchestration
//
// 2. MindWave AI (Feb 2024 - May 2024) - Software Engineer, Athens
//    - Spring Boot microservices
//    - Kubernetes deployment
//    - AI model serving
//
// 3. Intracom Telecom (May 2021 - Oct 2023) - Big Data Engineer, Athens
//    - Real-time analytics
//    - Grafana dashboards
//    - InfluxDB time series
```

### Phase 5: Tests (TDD)

#### 15. src/presentation/three/scenes/ExperienceTimeline/**tests**/TimelineScene.test.tsx

```typescript
// Test cases:
// - Renders correct number of nodes
// - Nodes are in chronological order
// - Scroll updates visible nodes
// - Current job is highlighted
```

#### 16. src/presentation/components/sections/Experience/**tests**/Experience.test.tsx

```typescript
// Test cases:
// - Renders all experience cards
// - Year navigation works
// - Card expand/collapse works
// - Mobile fallback shows list
// - Accessibility: timeline role
```

### Phase 6: Git Workflow

```bash
# Commit
git add .
git commit -m "feat: implement experience section with 3d timeline

- Add TimelineNode and TimelineConfig value objects
- Implement CompanyNode with orbiting project satellites
- Add animated TimelineConnection
- Create scroll-driven reveal animation
- Add comprehensive tests

Implements: DDD domain layer, SOLID composition
Closes #<issue-number>"

# Create PR
git push -u origin feature/experience-section
gh pr create --title "feat: Experience section with 3D timeline" \
  --body "## Summary
- Interactive 3D timeline showing career progression
- Scroll-driven reveal animation
- Mobile fallback list view

## Test plan
- [ ] Timeline renders all experiences
- [ ] Scroll reveals nodes progressively
- [ ] Navigation jumps to year
- [ ] Mobile shows list
- [ ] All tests pass

Closes #<issue-number>"
```

## SOLID Principles Applied

| Principle                 | Application                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| **S**ingle Responsibility | CompanyNode renders, ExperienceCard displays, TimelineNav navigates |
| **O**pen/Closed           | Node accepts custom satellite renderer                              |
| **L**iskov Substitution   | Any Experience entity works with TimelineNode.fromExperience()      |
| **I**nterface Segregation | Separate interfaces for node, connection, config                    |
| **D**ependency Inversion  | Components depend on domain Experience entity                       |

## DRY Achievements

| Repeated Pattern  | Centralized Solution                    |
| ----------------- | --------------------------------------- |
| Node spheres      | Reuses GlowingSphere from prompt 13     |
| Connection lines  | Reuses ConnectionLine from prompt 13    |
| Scroll tracking   | Reuses useScrollProgress from prompt 13 |
| Card styling      | Reuses Card from prompt 11              |
| Technology badges | Reuses Badge from prompt 11             |

## Requirements

- [ ] Scroll-driven 3D animation
- [ ] Year navigation
- [ ] Mobile fallback
- [ ] 80%+ test coverage
- [ ] 60fps performance
- [ ] Accessible (timeline semantics)

## Output

Immersive experience timeline that:

- Shows career progression visually
- Responds to scroll
- Works on all devices
- Is fully accessible and testable
