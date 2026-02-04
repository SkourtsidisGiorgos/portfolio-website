# PROMPT 9: Infrastructure Layer - Static Repositories

## Task
Implement static data repositories

## Steps

### 1. Create static data files
- src/data/experiences.json (from CV)
- src/data/projects.json (commandeft, JobRunr contributions, thesis)
- src/data/skills.json (categorized skills)
- src/data/personal.json (contact info, social links)

### 2. Implement repositories
- src/infrastructure/repositories/StaticExperienceRepository.ts
- src/infrastructure/repositories/StaticProjectRepository.ts
- src/infrastructure/repositories/StaticSkillRepository.ts

### 3. Each repository should:
- Implement domain interface
- Load data from JSON
- Map to domain entities
- Handle errors gracefully

### 4. Write integration tests
- Test data loading
- Test mapping to entities

### 5. Commit
```
feat: implement static data repositories
```

## Data to Include

### SWIFT (Nov 2023 - Present)
- ETL, NiFi, Kubernetes, Spark

### MindWave (Feb 2024 - May 2024)
- JobRunr carbon-aware scheduling

### Intracom (May 2021 - Oct 2023)
- Belgrade Smart City, Water Management, ETL library

### Open Source
- commandeft, JobRunr

### Skills
- Organized by category from CV

## Requirements
- Accurate CV data mapping
- Update CHANGELOG.md

## Output
Working repositories with real portfolio data
