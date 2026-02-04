# PROMPT 18: Projects Section - 3D Showcase (SOLID/DRY/TDD/DDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/projects-section

# Create GitHub issue
gh issue create --title "feat: Projects section with 3D showcase" \
  --body "Implement projects section with floating 3D cards and interactive showcase"
```

## Task

Create projects section with floating 3D cards following clean architecture principles.

## Architecture Overview

```
src/presentation/
├── three/scenes/ProjectShowcase/
│   ├── domain/
│   │   ├── ProjectCard3DConfig.ts  # Value object for card config
│   │   └── ShowcaseLayout.ts       # Layout calculator
│   ├── ProjectScene.tsx            # Main scene
│   └── ProjectCard3D.tsx           # 3D card component
└── components/sections/Projects/
    ├── Projects.tsx                # Container
    ├── ProjectCard.tsx             # 2D card overlay
    ├── ProjectModal.tsx            # Detail modal
    ├── ProjectFilter.tsx           # Filter controls
    └── ProjectGrid.tsx             # Grid/list view
```

## Files to Create

### Phase 1: Domain Layer (TDD)

#### 1. src/presentation/three/scenes/ProjectShowcase/domain/ProjectCard3DConfig.ts

Value object for 3D card positioning.

```typescript
// Requirements:
// - Immutable value object
// - Properties: project (from domain), position, rotation, scale
// - Factory: ProjectCard3DConfig.fromProject(project, index)
// - Factory: ProjectCard3DConfig.featured(project) - larger, centered
// - Calculates floating animation parameters
```

#### 2. src/presentation/three/scenes/ProjectShowcase/domain/ShowcaseLayout.ts

Layout calculator for project arrangement.

```typescript
// Requirements:
// - Strategy pattern for different layouts
// - Layouts: 'grid' | 'spiral' | 'featured'
// - Factory: ShowcaseLayout.grid(count, columns)
// - Factory: ShowcaseLayout.spiral(count, radius)
// - Method: getPositions() returns Position3D[]
```

#### 3. Tests

```typescript
// __tests__/ProjectCard3DConfig.test.ts
// Test cases:
// - fromProject() returns valid config
// - featured() has larger scale
// - Position is valid Position3D
// - Rotation is within bounds
```

### Phase 2: 3D Components (SOLID)

#### 4. src/presentation/three/scenes/ProjectShowcase/ProjectCard3D.tsx

3D floating card.

```typescript
// Requirements:
// - Props accept ProjectCard3DConfig value object
// - Floating animation (subtle Y oscillation)
// - Hover: flip to show back with details
// - Click: triggers selection callback
// - Uses AnimationConfig from prompt 13 (DRY)
// - Single Responsibility: only renders 3D card
```

#### 5. src/presentation/three/scenes/ProjectShowcase/CardFace.tsx

Card face component (front/back).

```typescript
// Requirements:
// - Props: side ('front' | 'back'), content
// - Front: project image/preview
// - Back: title, description, tech badges
// - Rounded corners with shader
// - Single Responsibility: only renders card face
```

#### 6. src/presentation/three/scenes/ProjectShowcase/ProjectScene.tsx

Main scene composition.

```typescript
// Requirements:
// - Composes ProjectCard3D[] with ShowcaseLayout
// - Parallax on scroll (uses useScrollProgress)
// - Depth effect with fog
// - Uses PostProcessing minimal preset
// - Props: projects: Project[], layout: LayoutType
```

### Phase 3: UI Components

#### 7. src/presentation/components/sections/Projects/ProjectCard.tsx

2D project card for grid view.

```typescript
// Requirements:
// - Props accept Project entity (from domain)
// - Uses Card from prompt 11 (DRY)
// - Project image with next/image optimization
// - Title, description (truncated)
// - Technology badges (Badge from prompt 11)
// - Links: GitHub, Live demo
// - Hover animation
// - Single Responsibility: only displays project card
```

#### 8. src/presentation/components/sections/Projects/ProjectModal.tsx

Detailed project view modal.

```typescript
// Requirements:
// - Props accept Project entity
// - Full description with markdown support
// - Image gallery/screenshots
// - Technology stack detailed
// - Links prominent
// - Accessible: focus trap, escape to close
// - Single Responsibility: only displays modal
```

#### 9. src/presentation/components/sections/Projects/ProjectFilter.tsx

Filter by technology/type.

```typescript
// Requirements:
// - Props: filters, selectedFilters, onChange
// - Filter by technology (multi-select)
// - Filter by type: 'all' | 'oss' | 'professional'
// - Uses Button from prompt 11 (DRY)
// - Accessible: checkbox group pattern
```

#### 10. src/presentation/components/sections/Projects/ProjectGrid.tsx

Grid/list view for projects.

```typescript
// Requirements:
// - Props: projects, view ('grid' | 'list'), onSelect
// - Responsive grid (1-3 columns)
// - Composes ProjectCard (DRY)
// - Animated transitions with Framer Motion
// - Single Responsibility: only handles layout
```

#### 11. src/presentation/components/sections/Projects/Projects.tsx

Container component (Composition Root).

```typescript
// Requirements:
// - Composes ProjectScene (optional), ProjectGrid, ProjectFilter, ProjectModal
// - Uses Section from prompt 12 (DRY)
// - Uses useProjects from application layer
// - State: selectedProject, filters, view
// - Toggle between 3D showcase and grid view
// - Accessible: proper ARIA
```

### Phase 4: Data Integration

#### 12. src/presentation/hooks/useProjectShowcase.ts

Custom hook for projects logic.

```typescript
// Requirements:
// - Returns: projects, filteredProjects, filters, setFilters
// - Integrates with GetProjectsUseCase
// - Memoized filtering
// - Single Responsibility: data orchestration
```

#### 13. Project data from CV

```typescript
// Featured Projects:
// 1. commandeft - CLI LLM wrapper (OSS)
//    - Python, Click, OpenAI API
//    - GitHub: link
//
// 2. JobRunr Carbon-aware scheduling (OSS contribution)
//    - Java, Spring Boot
//    - GitHub: link
//
// Professional Projects:
// 3. Belgrade Smart City - Air quality forecasting
//    - Spark MLlib, TensorFlow, Docker
//
// 4. IIoT Thesis - Distributed data processing
//    - Apache Kafka, Spark Streaming, Kubernetes
//
// 5. Cosmote ETL - Self-healing pipelines
//    - Airflow, Spark, NiFi
//
// 6. Water Management - Real-time metrics
//    - InfluxDB, Grafana, Kubernetes
```

### Phase 5: Tests (TDD)

#### 14. src/presentation/three/scenes/ProjectShowcase/**tests**/ProjectScene.test.tsx

```typescript
// Test cases:
// - Renders correct number of cards
// - Layout applies correctly
// - Featured project is highlighted
// - Click selects project
```

#### 15. src/presentation/components/sections/Projects/**tests**/Projects.test.tsx

```typescript
// Test cases:
// - Renders all projects
// - Filter reduces visible projects
// - Modal opens on selection
// - Toggle between views works
// - Accessibility: modal focus trap
```

### Phase 6: Git Workflow

```bash
# Commit
git add .
git commit -m "feat: implement projects section with 3d showcase

- Add ProjectCard3DConfig and ShowcaseLayout value objects
- Implement floating 3D cards with flip animation
- Add ProjectGrid for 2D fallback
- Create ProjectModal for detailed view
- Add filtering by technology/type
- Add comprehensive tests

Implements: DDD domain layer, SOLID composition
Closes #<issue-number>"

# Create PR
git push -u origin feature/projects-section
gh pr create --title "feat: Projects section with 3D showcase" \
  --body "## Summary
- Floating 3D project cards
- Flip animation on hover
- Filter by technology/type
- Detail modal

## Test plan
- [ ] 3D cards render and animate
- [ ] Filter works correctly
- [ ] Modal displays full details
- [ ] Grid fallback works
- [ ] All tests pass

Closes #<issue-number>"
```

## SOLID Principles Applied

| Principle                 | Application                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| **S**ingle Responsibility | ProjectCard3D renders, ProjectModal displays detail, ProjectFilter filters |
| **O**pen/Closed           | ShowcaseLayout uses strategy pattern for new layouts                       |
| **L**iskov Substitution   | Any Project entity works with ProjectCard3DConfig                          |
| **I**nterface Segregation | Separate props interfaces for each component                               |
| **D**ependency Inversion  | Components depend on domain Project entity                                 |

## DRY Achievements

| Repeated Pattern  | Centralized Solution                    |
| ----------------- | --------------------------------------- |
| Card styling      | Reuses Card from prompt 11              |
| Technology badges | Reuses Badge from prompt 11             |
| Button styling    | Reuses Button from prompt 11            |
| Animation config  | Reuses AnimationConfig from prompt 13   |
| Scroll tracking   | Reuses useScrollProgress from prompt 13 |

## Requirements

- [ ] Floating 3D cards with flip
- [ ] Filter by technology/type
- [ ] Detail modal
- [ ] Grid fallback
- [ ] 80%+ test coverage
- [ ] Accessible modal

## Output

Impressive project showcase that:

- Highlights work portfolio
- Interactive 3D experience
- Detailed project information
- Works on all devices
