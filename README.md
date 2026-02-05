# Giorgos Skourtsidis - 3D Portfolio

An interactive 3D portfolio website showcasing data engineering expertise through stunning Three.js visualizations representing ETL pipelines, distributed systems, and data flows.

## Features

- **Interactive 3D Scenes** - React Three Fiber powered visualizations
  - Hero: Animated ETL pipeline with data particles
  - Skills: 3D technology globe with interactive nodes
  - Experience: Horizontal timeline with company nodes
  - Projects: Floating 3D card showcase

- **Performance Optimized**
  - Device-adaptive quality levels (high/medium/low)
  - Lazy loading with Intersection Observer
  - WebGL fallbacks for unsupported browsers
  - Respects `prefers-reduced-motion` accessibility preference

- **Accessible** - WCAG 2.1 AA compliant
  - Skip links and proper heading hierarchy
  - Keyboard navigable
  - Screen reader friendly
  - Focus management

- **Domain-Driven Design** - Clean architecture with proper separation of concerns

## Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Framework   | Next.js 15+ (App Router)              |
| Language    | TypeScript 5.x                        |
| 3D Graphics | React Three Fiber + @react-three/drei |
| Animation   | Framer Motion + GSAP                  |
| Styling     | Tailwind CSS 4.x                      |
| State       | Zustand                               |
| Forms       | React Hook Form + Zod                 |
| Testing     | Vitest (unit), Playwright (E2E)       |
| Pre-commit  | Husky + lint-staged + commitlint      |
| CI/CD       | GitHub Actions                        |
| Hosting     | Vercel                                |

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/gskourts/viterby-site.git
cd viterby-site

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

Create a `.env.local` file for local development:

```env
# Contact form email service (optional for dev)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your@email.com
```

See `.env.example` for all available options.

## Scripts

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run start`         | Start production server        |
| `npm run lint`          | Run ESLint                     |
| `npm run lint:fix`      | Fix ESLint errors              |
| `npm run format`        | Format with Prettier           |
| `npm run type-check`    | TypeScript type checking       |
| `npm run test`          | Run unit tests                 |
| `npm run test:unit`     | Run unit tests (same as test)  |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e`      | Run Playwright E2E tests       |

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── domain/                 # Business entities, value objects
├── infrastructure/         # Repository implementations
├── application/            # Use cases, DTOs, mappers
├── presentation/           # UI components, 3D graphics
│   ├── components/         # React components
│   └── three/              # 3D scenes and primitives
├── shared/                 # Utilities, config, types
└── data/                   # Static JSON data
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Testing

The project maintains **80% minimum coverage** across all metrics.

```bash
# Run unit tests
npm run test:unit

# Run with coverage report
npm run test:coverage

# Run E2E tests (requires dev server running)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test Structure

- **Unit Tests** (`tests/unit/`, `**/__tests__/`) - Vitest + Testing Library
- **Integration Tests** (`tests/integration/`) - Repository and service tests
- **E2E Tests** (`tests/e2e/`) - Playwright with Page Object Models

## Deployment

### Vercel (Recommended)

The project is configured for automatic deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Pushes to `main` trigger production deployments
4. Pull requests create preview deployments

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Contributing

1. Create a feature branch from `main`
2. Write tests first (TDD)
3. Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
4. Ensure all tests pass and coverage is maintained
5. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Contact

**Giorgos Skourtsidis**

- Email: gskourts@gmail.com
- LinkedIn: [linkedin.com/in/gskourtsidis](https://linkedin.com/in/gskourtsidis)
- GitHub: [github.com/gskourts](https://github.com/gskourts)

---

Built with React Three Fiber, Next.js, and TypeScript.
