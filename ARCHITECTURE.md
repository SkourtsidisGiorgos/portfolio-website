# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   React Three   │  │   UI Components │  │      Next.js App Router     │  │
│  │     Fiber       │  │  (Atomic Design)│  │     (Pages & API Routes)    │  │
│  └────────┬────────┘  └────────┬────────┘  └──────────────┬──────────────┘  │
└───────────┼─────────────────────┼───────────────────────────┼───────────────┘
            │                     │                           │
            └─────────────────────┼───────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│                        APPLICATION LAYER                                     │
│  ┌─────────────────┐  ┌────────┴────────┐  ┌─────────────────────────────┐  │
│  │    Use Cases    │  │      DTOs       │  │          Mappers            │  │
│  │  (Orchestrate)  │  │ (Data Transfer) │  │   (Entity <-> DTO)          │  │
│  └────────┬────────┘  └─────────────────┘  └─────────────────────────────┘  │
└───────────┼─────────────────────────────────────────────────────────────────┘
            │
┌───────────┼─────────────────────────────────────────────────────────────────┐
│           │                    DOMAIN LAYER                                  │
│  ┌────────┴────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │    Entities     │  │  Value Objects  │  │    Repository Interfaces    │  │
│  │ (Business Core) │  │   (Immutable)   │  │       (Abstractions)        │  │
│  └─────────────────┘  └─────────────────┘  └──────────────┬──────────────┘  │
└───────────────────────────────────────────────────────────┼─────────────────┘
                                                            │
┌───────────────────────────────────────────────────────────┼─────────────────┐
│                      INFRASTRUCTURE LAYER                 │                  │
│  ┌─────────────────┐  ┌────────────────┐  ┌───────────────┴───────────────┐ │
│  │  Static Data    │  │ Email Service  │  │    Repository Implementations │ │
│  │  (JSON Files)   │  │   (Resend)     │  │        (Concrete)             │ │
│  └─────────────────┘  └────────────────┘  └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
viterby-site/
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   │   ├── ci.yml              # Lint, test, build
│   │   ├── security.yml        # Security scanning
│   │   └── deploy.yml          # Vercel deployment
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── pull_request_template.md
├── .husky/                     # Git hooks
│   ├── pre-commit              # Lint-staged
│   ├── commit-msg              # Commitlint
│   └── pre-push                # Tests
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── loading.tsx         # Loading UI
│   │   ├── error.tsx           # Error boundary
│   │   ├── not-found.tsx       # 404 page
│   │   └── api/                # API routes
│   │       └── contact/        # Contact form API
│   ├── domain/                 # Domain Layer
│   │   ├── portfolio/
│   │   │   ├── entities/
│   │   │   │   ├── Experience.ts
│   │   │   │   ├── Project.ts
│   │   │   │   └── Skill.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── DateRange.ts
│   │   │   │   ├── TechStack.ts
│   │   │   │   └── ContactInfo.ts
│   │   │   ├── repositories/
│   │   │   │   ├── IExperienceRepository.ts
│   │   │   │   ├── IProjectRepository.ts
│   │   │   │   └── ISkillRepository.ts
│   │   │   └── services/
│   │   │       └── PortfolioService.ts
│   │   └── contact/
│   │       ├── entities/
│   │       │   └── ContactMessage.ts
│   │       ├── value-objects/
│   │       │   └── Email.ts
│   │       └── services/
│   │           ├── IEmailService.ts
│   │           └── ContactService.ts
│   ├── infrastructure/         # Infrastructure Layer
│   │   ├── repositories/
│   │   │   ├── StaticExperienceRepository.ts
│   │   │   ├── StaticProjectRepository.ts
│   │   │   └── StaticSkillRepository.ts
│   │   ├── email/
│   │   │   └── ResendEmailService.ts
│   │   └── analytics/
│   │       └── VercelAnalytics.ts
│   ├── application/            # Application Layer
│   │   ├── use-cases/
│   │   │   ├── GetPortfolioData.ts
│   │   │   ├── GetExperienceTimeline.ts
│   │   │   └── SendContactMessage.ts
│   │   ├── dto/
│   │   │   ├── ExperienceDTO.ts
│   │   │   ├── ProjectDTO.ts
│   │   │   ├── SkillDTO.ts
│   │   │   └── ContactFormDTO.ts
│   │   └── mappers/
│   │       ├── ExperienceMapper.ts
│   │       ├── ProjectMapper.ts
│   │       └── SkillMapper.ts
│   ├── presentation/           # Presentation Layer
│   │   ├── components/
│   │   │   ├── ui/             # Atomic components
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   ├── Input/
│   │   │   │   ├── Typography/
│   │   │   │   ├── Badge/
│   │   │   │   └── Loader/
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Header/
│   │   │   │   ├── Footer/
│   │   │   │   ├── Section/
│   │   │   │   └── Container/
│   │   │   └── sections/       # Page sections
│   │   │       ├── Hero/
│   │   │       ├── About/
│   │   │       ├── Skills/
│   │   │       ├── Experience/
│   │   │       ├── Projects/
│   │   │       └── Contact/
│   │   ├── three/              # 3D Graphics
│   │   │   ├── scenes/
│   │   │   │   ├── HeroScene/
│   │   │   │   ├── SkillsGlobe/
│   │   │   │   ├── ExperienceTimeline/
│   │   │   │   └── ProjectShowcase/
│   │   │   ├── primitives/
│   │   │   │   ├── DataParticle.tsx
│   │   │   │   ├── GlowingSphere.tsx
│   │   │   │   ├── FloatingText.tsx
│   │   │   │   ├── ConnectionLine.tsx
│   │   │   │   └── GridFloor.tsx
│   │   │   ├── effects/
│   │   │   │   └── PostProcessing.tsx
│   │   │   ├── shaders/
│   │   │   │   ├── dataFlow.vert
│   │   │   │   └── dataFlow.frag
│   │   │   ├── hooks/
│   │   │   │   ├── useMousePosition.ts
│   │   │   │   └── useScrollProgress.ts
│   │   │   └── utils/
│   │   │       └── geometryHelpers.ts
│   │   └── hooks/
│   │       ├── useScrollSpy.ts
│   │       └── useMediaQuery.ts
│   ├── shared/                 # Cross-cutting
│   │   ├── config/
│   │   │   ├── site.config.ts
│   │   │   └── navigation.config.ts
│   │   ├── constants/
│   │   │   ├── colors.ts
│   │   │   └── breakpoints.ts
│   │   ├── types/
│   │   │   └── common.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       └── formatters.ts
│   └── data/                   # Static data
│       ├── experiences.json
│       ├── projects.json
│       ├── skills.json
│       └── personal.json
├── public/
│   ├── models/                 # 3D models (.glb, .gltf)
│   ├── textures/               # Texture files
│   ├── images/                 # Static images
│   └── fonts/                  # Custom fonts
├── tests/
│   ├── unit/                   # Vitest unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # Playwright E2E tests
├── CLAUDE.md                   # AI instructions
├── ARCHITECTURE.md             # This file
└── CHANGELOG.md                # Version history
```

## Component Architecture

### Atomic Design Pattern

```
ATOMS (ui/)          MOLECULES (ui/)       ORGANISMS (sections/)
┌──────────┐         ┌──────────────┐      ┌─────────────────┐
│  Button  │    ─>   │   CardGroup  │  ─>  │   HeroSection   │
│  Input   │         │   FormField  │      │   AboutSection  │
│  Badge   │         │   NavItem    │      │   SkillsSection │
│  Icon    │         │              │      │                 │
└──────────┘         └──────────────┘      └─────────────────┘
```

### 3D Graphics Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Canvas (R3F)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Scene Graph                        │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │  │
│  │  │ Camera  │  │ Lights  │  │  Meshes │  │ Effects │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │  │
│  │       │            │            │            │        │  │
│  │       └────────────┴────────────┴────────────┘        │  │
│  │                         │                             │  │
│  │              ┌──────────┴──────────┐                  │  │
│  │              │   Post-Processing   │                  │  │
│  │              │  (Bloom, Vignette)  │                  │  │
│  │              └─────────────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  JSON Data   │ ──> │  Repository  │ ──> │   Entity     │
│  (Static)    │     │ (Load/Parse) │     │  (Domain)    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  v
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Component   │ <── │     DTO      │ <── │   Mapper     │
│    (UI)      │     │  (Flat Data) │     │ (Transform)  │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Testing Strategy

| Layer          | Test Type          | Tool         | Coverage Target |
| -------------- | ------------------ | ------------ | --------------- |
| Domain         | Unit               | Vitest       | 90%             |
| Application    | Unit               | Vitest       | 90%             |
| Infrastructure | Integration        | Vitest       | 80%             |
| Presentation   | Unit + Integration | Vitest + RTL | 80%             |
| E2E            | End-to-End         | Playwright   | Critical paths  |

## CI/CD Pipeline

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Push   │ ──> │  Lint   │ ──> │  Test   │ ──> │  Build  │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                     │
                    ┌────────────────────────────────┘
                    │
                    v
              ┌─────────┐     ┌─────────┐
              │ Preview │ ──> │ Deploy  │
              │ (PR)    │     │ (main)  │
              └─────────┘     └─────────┘
```

## Performance Considerations

### 3D Optimization

- Use `InstancedMesh` for particles (10k+ instances)
- Implement LOD (Level of Detail) for complex meshes
- Dispose unused geometries and materials
- Use object pooling for frequently created objects

### Bundle Optimization

- Dynamic imports for 3D scenes (code splitting)
- Tree shaking for Three.js imports
- Image optimization with Next.js Image component

### Runtime Performance

- Target 60fps for all animations
- Progressive enhancement for low-end devices
- Respect `prefers-reduced-motion` media query

---

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - AI agent instructions
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [prompts/README.md](./prompts/README.md) - Implementation prompts
