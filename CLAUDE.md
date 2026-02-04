# CLAUDE.md - AI Agent Instructions

## Project Overview

This is an interactive 3D portfolio website for **Giorgos Skourtsidis**, a Big Data & Software Engineer with 4+ years of experience in telecommunications and fintech. The website showcases data engineering expertise through stunning Three.js visualizations representing ETL pipelines, distributed systems, and data flows.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript 5.x |
| 3D Graphics | React Three Fiber + @react-three/drei |
| Animation | Framer Motion + GSAP |
| Styling | Tailwind CSS 4.x |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Testing | Vitest (unit), Playwright (E2E) |
| Pre-commit | Husky + lint-staged + commitlint |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

## Development Principles

### DDD (Domain-Driven Design)
- **Domain Layer** (`src/domain/`): Business entities, value objects, repository interfaces
- **Application Layer** (`src/application/`): Use cases, DTOs, mappers
- **Infrastructure Layer** (`src/infrastructure/`): Repository implementations, external services
- **Presentation Layer** (`src/presentation/`): UI components, 3D graphics, hooks

### TDD (Test-Driven Development)
- Write tests before implementation
- Maintain 80%+ code coverage
- Unit tests with Vitest, E2E tests with Playwright

### SOLID Principles
- **S**ingle Responsibility: One reason to change per module
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable
- **I**nterface Segregation: Many specific interfaces over one general
- **D**ependency Inversion: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- Extract reusable components and utilities
- Use barrel exports for clean imports

## Key Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run all tests
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── domain/                 # DDD Domain Layer
│   ├── portfolio/          # Portfolio bounded context
│   │   ├── entities/       # Experience, Project, Skill
│   │   ├── value-objects/  # DateRange, TechStack
│   │   ├── repositories/   # Repository interfaces
│   │   └── services/       # Domain services
│   └── contact/            # Contact bounded context
├── infrastructure/         # DDD Infrastructure Layer
│   ├── repositories/       # Static data repositories
│   ├── email/              # Email service implementation
│   └── analytics/          # Analytics integration
├── application/            # DDD Application Layer
│   ├── use-cases/          # Application use cases
│   ├── dto/                # Data Transfer Objects
│   └── mappers/            # Entity to DTO mappers
├── presentation/           # UI Layer
│   ├── components/         # React components
│   │   ├── ui/             # Atomic UI components
│   │   ├── layout/         # Layout components
│   │   └── sections/       # Page sections
│   ├── three/              # 3D Graphics
│   │   ├── scenes/         # Complete 3D scenes
│   │   ├── primitives/     # Basic 3D components
│   │   ├── effects/        # Post-processing effects
│   │   ├── shaders/        # Custom GLSL shaders
│   │   ├── hooks/          # 3D-specific hooks
│   │   └── utils/          # 3D utility functions
│   └── hooks/              # UI hooks
├── shared/                 # Cross-cutting concerns
│   ├── config/             # App configuration
│   ├── constants/          # Constants and enums
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Utility functions
└── data/                   # Static JSON data
```

## AI Agent Guidelines

When working on this project:

1. **Follow the architecture**: Respect DDD layer boundaries
2. **Write tests first**: Follow TDD principles
3. **Use conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
4. **Update CHANGELOG.md**: Document all changes
5. **Check existing code**: Understand patterns before implementing
6. **Performance matters**: 3D scenes must run at 60fps
7. **Accessibility**: Maintain WCAG 2.1 AA compliance

## Visual Theme

- **Primary**: Cyber Blue (#00bcd4) - data streams
- **Accent**: Electric Purple (#7c3aed) - AI/ML
- **Background**: Deep Space (#0a0a0f)
- **Success**: Matrix Green (#10b981)

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture details
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [prompts/README.md](./prompts/README.md) - Implementation prompts
