# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initialized Next.js 15+ project with TypeScript and Tailwind CSS 4
- Created DDD folder structure:
  - `src/domain/` - Domain layer (entities, value-objects, repositories, services)
  - `src/infrastructure/` - Infrastructure layer (repositories, email, analytics)
  - `src/application/` - Application layer (use-cases, dto, mappers)
  - `src/presentation/` - Presentation layer (components, three, hooks)
  - `src/shared/` - Cross-cutting concerns (config, constants, types, utils)
  - `src/data/` - Static JSON data
- Created project documentation:
  - `CLAUDE.md` - AI agent instructions and project overview
  - `ARCHITECTURE.md` - Technical architecture documentation
  - `CHANGELOG.md` - Version history (this file)
- Created implementation prompts in `prompts/` folder (24 sequential prompts)
- Set up public asset directories (models, textures, images, fonts)
- Set up test directories (unit, integration, e2e)
- Configured pre-commit hooks with Husky:
  - `pre-commit`: Runs lint-staged for code quality
  - `commit-msg`: Runs commitlint for conventional commits
  - `pre-push`: Runs type-check and lint
- Added ESLint configuration with:
  - TypeScript support
  - React and React Hooks rules
  - JSX accessibility rules (eslint-plugin-jsx-a11y)
  - Prettier integration
- Added Prettier configuration with Tailwind CSS plugin
- Added lint-staged configuration for staged file checks
- Added commitlint with conventional commits enforcement
- Added GitHub Actions workflows:
  - `ci.yml`: Lint, unit tests, E2E tests, build on push/PR
  - `security.yml`: Dependency audit, secret scanning, CodeQL analysis
  - `deploy.yml`: Vercel deployment on main push
- Added GitHub repository templates:
  - Bug report issue template
  - Feature request issue template
  - Task issue template
  - Pull request template
- Added CODEOWNERS file
- Configured testing infrastructure:
  - Vitest for unit testing with jsdom environment
  - Playwright for E2E testing (Chromium, Firefox, WebKit, Mobile)
  - Testing Library for React component testing
  - Code coverage with v8 provider (80% threshold)
- Added test scripts: test, test:unit, test:unit:watch, test:coverage, test:e2e
- Added shared utilities and configuration:
  - Site configuration (metadata, social links)
  - Navigation configuration
  - Color palette constants (primary, accent, success)
  - Breakpoint constants and media queries
  - Common TypeScript types (Result, AsyncState, etc.)
  - `cn()` utility for class name merging (clsx + tailwind-merge)
  - Formatters (formatDate, formatDateRange, truncate, slugify, etc.)
- Implemented DDD domain layer entities and value objects:
  - `DateRange` - Date range with duration calculation
  - `TechStack` - Collection of technologies
  - `ContactInfo` - Contact information with validation
  - `Experience` - Work experience entity
  - `Project` - Project entity with type support (OSS, professional)
  - `Skill` - Technical skill with proficiency levels
  - `Email` - Validated email address value object
  - `ContactMessage` - Contact form message entity
- Added repository interfaces for domain entities:
  - `IExperienceRepository` - Experience data access
  - `IProjectRepository` - Project data access
  - `ISkillRepository` - Skill data access
- Added domain services:
  - `PortfolioService` - Aggregates portfolio data operations
  - `ContactService` - Handles contact form submissions
  - `IEmailService` - Email service interface
- Added barrel exports for domain modules
- Implemented static data repositories (infrastructure layer):
  - `StaticExperienceRepository` - Loads experience data from JSON
  - `StaticProjectRepository` - Loads project data from JSON
  - `StaticSkillRepository` - Loads skill data from JSON
- Added static JSON data files:
  - `experiences.json` - Work experience (SWIFT, MindWave, Intracom)
  - `projects.json` - Portfolio projects (6 projects)
  - `skills.json` - Technical skills (21 skills across 6 categories)
  - `personal.json` - Personal information
- Added infrastructure barrel exports
- Added integration tests for repositories (17 tests)
- Updated vitest config to include integration tests
- Implemented application layer:
  - DTOs: ExperienceDTO, ProjectDTO, SkillDTO, ContactFormDTO
  - Mappers: ExperienceMapper, ProjectMapper, SkillMapper
  - Use Cases: GetPortfolioData, GetExperienceTimeline, SendContactMessage
- Added unit tests for application layer (37 tests)
- Added Framer Motion for animations
- Implemented atomic UI components:
  - Button: variants (primary, secondary, ghost, outline), sizes, loading state
  - Typography: h1-h6, body variants, gradient and muted styles
  - Card: glass morphism, solid, outline variants with hover effects
  - Input/Textarea: with label, error state, hint text
  - Badge: for skills/technologies display
  - Loader: animated loading spinner
- Added comprehensive tests for UI components (112 tests)
- Implemented layout components:
  - Header: fixed navigation with scroll spy and mobile menu
  - Footer: social links and copyright
  - Section: consistent section wrapper with animated titles
  - Container: responsive max-width wrapper
- Added presentation hooks:
  - useScrollSpy: track active section on scroll
  - useScrollTo: smooth scroll navigation
  - useMediaQuery, useBreakpoint, useIsMobile: responsive breakpoints
- Updated layout.tsx with Inter and JetBrains Mono fonts, SEO metadata
- Added layout component tests (31 tests)

---

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - AI agent instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [prompts/README.md](./prompts/README.md) - Implementation prompts
