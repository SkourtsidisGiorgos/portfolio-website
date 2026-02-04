# PROMPT 1: Project Initialization & Git Setup

## Task
Initialize Next.js 15 project with TypeScript and configure Git repository

## Context
- Repository: git@github.com:SkourtsidisGiorgos/portfolio-website.git
- Working directory: /home/gskourts/opt/projects/websites/viterby-site

## Steps

1. Initialize git repository and connect to remote

2. Create .gitignore for Next.js project

3. Initialize Next.js 15 with App Router and TypeScript:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```

4. Create initial folder structure:
   - src/domain/portfolio/{entities,value-objects,repositories,services}
   - src/domain/contact/{entities,value-objects,services}
   - src/infrastructure/{repositories,email,analytics}
   - src/application/{use-cases,dto,mappers}
   - src/presentation/{components/{ui,layout,sections},three/{scenes,primitives,effects,shaders,hooks,utils},hooks}
   - src/shared/{config,constants,types,utils}
   - src/data/
   - public/{models,textures,images,fonts}
   - tests/{unit,integration,e2e}

5. Create CLAUDE.md, ARCHITECTURE.md, CHANGELOG.md with initial content

6. Commit: "chore: initialize next.js 15 project with typescript"

## Requirements
- Follow conventional commits
- Update CHANGELOG.md with actions taken

## Output
Initialized project with folder structure ready for development
