# PROMPT 8: Domain Layer - Repositories & Services

## Task

Define repository interfaces and domain services

## Files to Create

### 1. src/domain/portfolio/repositories/IExperienceRepository.ts

- findAll(): Promise<Experience[]>
- findById(id: string): Promise<Experience | null>
- findCurrent(): Promise<Experience | null>

### 2. src/domain/portfolio/repositories/IProjectRepository.ts

- findAll(): Promise<Project[]>
- findById(id: string): Promise<Project | null>
- findFeatured(): Promise<Project[]>

### 3. src/domain/portfolio/repositories/ISkillRepository.ts

- findAll(): Promise<Skill[]>
- findByCategory(category: string): Promise<Skill[]>

### 4. src/domain/portfolio/services/PortfolioService.ts

- Aggregate portfolio data operations
- Business logic coordination

### 5. src/domain/contact/services/IEmailService.ts

- sendContactMessage(message: ContactMessage): Promise<void>

### 6. src/domain/contact/services/ContactService.ts

- validateAndSend(message: ContactMessage): Promise<Result>

### 7. Barrel exports for all domain modules

### 8. Write unit tests with mocks

### 9. Commit

```
feat: add repository interfaces and domain services
```

## Requirements

- Interface segregation principle
- Dependency inversion ready
- Update CHANGELOG.md

## Output

Domain layer interfaces and services
