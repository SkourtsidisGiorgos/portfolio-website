# PROMPT 10: Application Layer - Use Cases & DTOs

## Task

Implement application layer with use cases and DTOs

## Files to Create

### 1. src/application/dto/ExperienceDTO.ts

- Flat structure for UI consumption
- Formatted dates

### 2. src/application/dto/ProjectDTO.ts

- UI-ready project data

### 3. src/application/dto/SkillDTO.ts

- Skill with category and proficiency

### 4. src/application/dto/ContactFormDTO.ts

- Form input data structure

### 5. src/application/mappers/ExperienceMapper.ts

- toDTO(entity): ExperienceDTO
- toDTOList(entities): ExperienceDTO[]

### 6. src/application/mappers/ProjectMapper.ts

### 7. src/application/mappers/SkillMapper.ts

### 8. src/application/use-cases/GetPortfolioData.ts

- Aggregates all portfolio data
- Returns experiences, projects, skills

### 9. src/application/use-cases/GetExperienceTimeline.ts

- Returns sorted experience timeline

### 10. src/application/use-cases/SendContactMessage.ts

- Validates input
- Creates entity
- Sends via email service

### 11. Write unit tests for mappers and use cases

### 12. Commit

```
feat: implement application layer use cases
```

## Requirements

- Clean separation from domain
- Update CHANGELOG.md

## Output

Application layer ready for UI integration
