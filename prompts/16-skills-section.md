# PROMPT 16: Skills Section - 3D Technology Globe (SOLID/DRY/TDD/DDD)

## GitHub Workflow

Before starting this prompt:

```bash
# Create feature branch from main
git checkout main && git pull
git checkout -b feature/skills-section

# Create GitHub issue (if not exists)
gh issue create --title "feat: Skills section with 3D globe" \
  --body "Implement skills section with interactive 3D technology globe visualization"
```

## Task

Create skills section with interactive 3D globe visualization following clean architecture principles.

## Architecture Overview

```
src/presentation/
├── three/scenes/SkillsGlobe/
│   ├── domain/                 # Scene-specific domain
│   │   ├── SkillNode.ts        # Value object for skill nodes
│   │   ├── SkillConnection.ts  # Value object for connections
│   │   └── GlobeConfig.ts      # Configuration value object
│   ├── SkillsGlobe.tsx         # Main scene composition
│   ├── SkillNode3D.tsx         # Individual skill node
│   └── SkillConnections.tsx    # Connection lines
└── components/sections/Skills/
    ├── Skills.tsx              # Container (composition root)
    ├── SkillCategory.tsx       # Category filter
    ├── SkillDetail.tsx         # Detail panel
    └── SkillsList.tsx          # Mobile fallback list
```

## Files to Create

### Phase 1: Domain Layer (TDD - Write Tests First)

#### 1. src/presentation/three/scenes/SkillsGlobe/domain/SkillNode.ts

Value object for skill positioning on globe.

```typescript
// Requirements:
// - Immutable value object
// - Properties: skill (from domain), position (spherical coords), size
// - Factory: SkillNode.fromSkill(skill: Skill)
// - Factory: SkillNode.positioned(skill, theta, phi)
// - Size based on proficiency level
// - Integration with domain Skill entity
```

#### 2. src/presentation/three/scenes/SkillsGlobe/domain/SkillConnection.ts

Value object for skill relationships.

```typescript
// Requirements:
// - Properties: from: SkillNode, to: SkillNode, strength
// - Factory: SkillConnection.create(from, to, strength?)
// - Method: getPath() returns interpolated points
// - Validation: from and to must be different
```

#### 3. src/presentation/three/scenes/SkillsGlobe/domain/GlobeConfig.ts

Configuration for the globe visualization.

```typescript
// Requirements:
// - Defines radius, rotation speed, node sizes
// - Factory: GlobeConfig.default()
// - Factory: GlobeConfig.minimal() for low-end devices
// - Integration with usePerformanceMode
```

#### 4. Tests for domain layer

```typescript
// src/presentation/three/scenes/SkillsGlobe/__tests__/SkillNode.test.ts
// Test cases:
// - fromSkill() calculates correct position
// - Size scales with proficiency
// - Position is valid spherical coordinates
// - Immutability preserved
```

### Phase 2: 3D Components (SOLID)

#### 5. src/presentation/three/scenes/SkillsGlobe/SkillNode3D.tsx

Individual 3D skill node.

```typescript
// Requirements:
// - Props accept SkillNode value object (Dependency Inversion)
// - Size based on proficiency (GlowingSphere from prompt 13 - DRY)
// - Color based on category (Color3D.fromTheme() - DRY)
// - Hover state with tooltip
// - Click handler for selection
// - Single Responsibility: only renders node
```

#### 6. src/presentation/three/scenes/SkillsGlobe/SkillConnections.tsx

Lines connecting related skills.

```typescript
// Requirements:
// - Props: connections: SkillConnection[]
// - Uses ConnectionLine from prompt 13 (DRY)
// - Animated highlight on hover
// - Visibility toggle by category
// - Single Responsibility: only renders connections
```

#### 7. src/presentation/three/scenes/SkillsGlobe/GlobeSurface.tsx

Visual globe surface (optional wireframe sphere).

```typescript
// Requirements:
// - Wireframe or dotted sphere
// - Uses GridFloor concept (DRY pattern)
// - Subtle rotation animation
// - Color from theme
```

#### 8. src/presentation/three/scenes/SkillsGlobe/SkillsGlobe.tsx

Main scene composition (Composition Root).

```typescript
// Requirements:
// - Composes SkillNode3D[], SkillConnections, GlobeSurface
// - OrbitControls for user interaction (drag to rotate)
// - Auto-rotation when idle
// - Uses PostProcessing with subtle preset (DRY)
// - Camera setup based on performance mode
// - Props: skills: Skill[], selectedCategory?: string
```

### Phase 3: UI Components

#### 9. src/presentation/components/sections/Skills/SkillCategory.tsx

Category filter buttons.

```typescript
// Requirements:
// - Props: categories: string[], selected, onSelect
// - Uses Button component from prompt 11 (DRY)
// - Animated selection state
// - Accessible: radio group pattern
// - Single Responsibility: only handles filtering
```

#### 10. src/presentation/components/sections/Skills/SkillDetail.tsx

Detailed view on skill selection.

```typescript
// Requirements:
// - Props accept Skill entity (from domain)
// - Displays: name, proficiency bar, description, projects
// - Uses Card component from prompt 11 (DRY)
// - Animated slide-in
// - Single Responsibility: only displays detail
```

#### 11. src/presentation/components/sections/Skills/SkillsList.tsx

Mobile fallback list view.

```typescript
// Requirements:
// - Renders when 3D globe disabled
// - Groups by category
// - Reuses SkillDetail for item display (DRY)
// - Accessible: proper list semantics
```

#### 12. src/presentation/components/sections/Skills/SkillsCanvas.tsx

3D Canvas wrapper with fallback.

```typescript
// Requirements:
// - WebGL detection with fallback to SkillsList
// - Error boundary for 3D crashes
// - Loading state with skeleton
// - Performance mode integration
```

#### 13. src/presentation/components/sections/Skills/Skills.tsx

Container component (Composition Root).

```typescript
// Requirements:
// - Composes SkillsCanvas, SkillCategory, SkillDetail
// - Uses Section component from prompt 12 (DRY)
// - Uses useSkills hook from application layer (Dependency Inversion)
// - State management for selection
// - Accessible: proper ARIA for interactive elements
```

### Phase 4: Data Integration

#### 14. src/presentation/hooks/useSkillsGlobe.ts

Custom hook for skills globe logic.

```typescript
// Requirements:
// - Returns: skills, categories, selectedSkill, selectSkill
// - Integrates with application layer GetSkillsUseCase
// - Memoized transformations
// - Single Responsibility: orchestrates data flow
```

#### 15. Skill data from CV

```typescript
// Categories with colors (use Color3D.fromTheme):
// - Languages (primary): Python, Java, Bash, JavaScript, TypeScript
// - Big Data (accent): Apache Spark, Kafka, HDFS, Hive, NiFi
// - DevOps (success): Kubernetes, Docker, Airflow, CI/CD, Terraform
// - AI/ML (accent.light): TensorFlow, Keras, Scikit-learn, Spark MLlib
// - Databases (primary.dark): PostgreSQL, MongoDB, Redis, InfluxDB
// - Backend (secondary): Spring Boot, Flask, FastAPI, Node.js
```

### Phase 5: Tests (TDD)

#### 16. src/presentation/three/scenes/SkillsGlobe/**tests**/SkillsGlobe.test.tsx

```typescript
// Test cases:
// - Renders correct number of nodes
// - Nodes have correct colors by category
// - Click selects skill
// - Category filter works
// - Performance mode reduces complexity
```

#### 17. src/presentation/components/sections/Skills/**tests**/Skills.test.tsx

```typescript
// Test cases:
// - Renders category filters
// - Selection updates detail panel
// - Mobile fallback renders list
// - Accessibility: keyboard navigation
```

### Phase 6: Barrel Exports & Git

#### 18. Barrel exports

```typescript
// src/presentation/three/scenes/SkillsGlobe/index.ts
// src/presentation/components/sections/Skills/index.ts
```

#### 19. Update CHANGELOG.md

#### 20. Git workflow

```bash
# Commit with conventional message
git add .
git commit -m "feat: implement skills section with 3d globe

- Add SkillNode and GlobeConfig value objects
- Implement SkillsGlobe with interactive nodes
- Add SkillCategory filter and SkillDetail panel
- Create SkillsList mobile fallback
- Add comprehensive tests

Implements: DDD domain layer, SOLID composition
Closes #<issue-number>"

# Push and create PR
git push -u origin feature/skills-section
gh pr create --title "feat: Skills section with 3D globe" \
  --body "## Summary
- Add interactive 3D skills globe
- Category filtering
- Mobile fallback list

## Test plan
- [ ] Globe renders with all skills
- [ ] Filtering by category works
- [ ] Mobile shows list fallback
- [ ] All tests pass

Closes #<issue-number>"
```

## SOLID Principles Applied

| Principle                 | Application                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| **S**ingle Responsibility | SkillNode3D renders, SkillDetail displays, SkillCategory filters |
| **O**pen/Closed           | Globe accepts custom node renderer via render prop               |
| **L**iskov Substitution   | Any Skill entity works with SkillNode.fromSkill()                |
| **I**nterface Segregation | Separate interfaces for node, connection, config                 |
| **D**ependency Inversion  | Components depend on domain Skill entity, not raw data           |

## DRY Achievements

| Repeated Pattern | Centralized Solution                 |
| ---------------- | ------------------------------------ |
| Node rendering   | Reuses GlowingSphere from prompt 13  |
| Connection lines | Reuses ConnectionLine from prompt 13 |
| Colors           | Uses Color3D.fromTheme()             |
| Category buttons | Reuses Button from prompt 11         |
| Detail cards     | Reuses Card from prompt 11           |

## Requirements

- [ ] Interactive 3D globe with drag rotation
- [ ] Category filtering
- [ ] Mobile fallback (list view)
- [ ] 80%+ test coverage
- [ ] 60fps performance
- [ ] Accessible (keyboard, screen reader)

## Output

Interactive skills visualization that:

- Showcases technical expertise impressively
- Works on all devices
- Is fully accessible
- Is maintainable and testable
