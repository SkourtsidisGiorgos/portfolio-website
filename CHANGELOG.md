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

---

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - AI agent instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [prompts/README.md](./prompts/README.md) - Implementation prompts
