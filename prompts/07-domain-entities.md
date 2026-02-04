# PROMPT 7: Domain Layer - Entities & Value Objects

## Task

Implement DDD domain layer with entities and value objects

## Files to Create

### 1. src/domain/portfolio/value-objects/DateRange.ts

- Properties: start, end (null = present)
- Methods: isCurrent, formatDuration
- Validation: end >= start

### 2. src/domain/portfolio/value-objects/TechStack.ts

- Properties: items (string array)
- Methods: contains, toString

### 3. src/domain/portfolio/value-objects/ContactInfo.ts

- Properties: email, phone, location
- Validation: email format

### 4. src/domain/portfolio/entities/Experience.ts

- Properties: id, company, role, dateRange, location, remote, description[], technologies
- Factory method: create() with validation
- Computed: duration, isCurrent

### 5. src/domain/portfolio/entities/Project.ts

- Properties: id, title, description, technologies, githubUrl, liveUrl, image, featured
- Factory method with validation

### 6. src/domain/portfolio/entities/Skill.ts

- Properties: id, name, category, proficiency, icon
- Categories: Languages, BigData, DevOps, AI/ML, Databases

### 7. src/domain/contact/value-objects/Email.ts

- Validation: RFC 5322 email format
- Methods: getValue, getDomain

### 8. src/domain/contact/entities/ContactMessage.ts

- Properties: id, name, email, subject, message, createdAt

### 9. Write comprehensive unit tests (TDD)

- Test all validation rules
- Test factory methods
- Test computed properties

### 10. Commit

```
feat: implement domain entities and value objects
```

## Requirements

- Follow TDD - write tests first
- Immutable entities
- Rich domain model
- Update CHANGELOG.md

## Output

Complete domain layer with 90%+ test coverage
