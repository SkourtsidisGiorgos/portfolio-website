# Portfolio Website Implementation Prompts

This folder contains 24 sequential prompts for building the portfolio website for Giorgos Skourtsidis.

## Prompt Order

| # | File | Description |
|---|------|-------------|
| 01 | [project-initialization.md](./01-project-initialization.md) | Initialize Next.js 15 project and Git setup |
| 02 | [documentation-files.md](./02-documentation-files.md) | Create CLAUDE.md, ARCHITECTURE.md, CHANGELOG.md |
| 03 | [precommit-hooks-linting.md](./03-precommit-hooks-linting.md) | Configure Husky, ESLint, Prettier |
| 04 | [github-workflows-templates.md](./04-github-workflows-templates.md) | GitHub Actions CI/CD and templates |
| 05 | [testing-infrastructure.md](./05-testing-infrastructure.md) | Configure Vitest and Playwright |
| 06 | [shared-utilities.md](./06-shared-utilities.md) | Shared utilities and configuration |
| 07 | [domain-entities.md](./07-domain-entities.md) | DDD entities and value objects |
| 08 | [domain-repositories.md](./08-domain-repositories.md) | Repository interfaces and domain services |
| 09 | [static-repositories.md](./09-static-repositories.md) | Static data repositories implementation |
| 10 | [application-layer.md](./10-application-layer.md) | Use cases and DTOs |
| 11 | [ui-atomic-components.md](./11-ui-atomic-components.md) | Base UI components (Button, Card, etc.) |
| 12 | [layout-components.md](./12-layout-components.md) | Header, Footer, Section components |
| 13 | [3d-graphics-foundation.md](./13-3d-graphics-foundation.md) | React Three Fiber setup |
| 14 | [hero-section.md](./14-hero-section.md) | Hero with 3D ETL pipeline visualization |
| 15 | [about-section.md](./15-about-section.md) | About section with bento grid |
| 16 | [skills-section.md](./16-skills-section.md) | Skills with 3D technology globe |
| 17 | [experience-section.md](./17-experience-section.md) | Experience with 3D timeline |
| 18 | [projects-section.md](./18-projects-section.md) | Projects with 3D showcase |
| 19 | [contact-section.md](./19-contact-section.md) | Contact form with email integration |
| 20 | [main-page-assembly.md](./20-main-page-assembly.md) | Assemble all sections |
| 21 | [performance-optimization.md](./21-performance-optimization.md) | Performance optimization |
| 22 | [accessibility-seo.md](./22-accessibility-seo.md) | Accessibility and SEO |
| 23 | [final-testing-documentation.md](./23-final-testing-documentation.md) | Final testing and documentation |
| 24 | [deployment.md](./24-deployment.md) | Production deployment |

## Usage

Execute each prompt in order. Each prompt builds upon the previous one.

```bash
# Example: Copy prompt content and use with AI assistant
cat prompts/01-project-initialization.md
```

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x
- **3D Graphics:** React Three Fiber + drei
- **Animation:** Framer Motion + GSAP
- **Styling:** Tailwind CSS 4.x
- **Testing:** Vitest + Playwright

## Architecture

- **DDD:** Domain-Driven Design with clear layer separation
- **TDD:** Test-Driven Development approach
- **SOLID:** Clean code principles
- **Atomic Design:** Component organization

---

Related Documentation:
- [CLAUDE.md](../CLAUDE.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [CHANGELOG.md](../CHANGELOG.md)
