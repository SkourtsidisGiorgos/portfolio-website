# PROMPT 6: Shared Utilities & Configuration

## Task

Create shared utilities, constants, and configuration

## Files to Create

### 1. src/shared/config/site.config.ts

- Site metadata (title, description, author)
- Social links (GitHub, LinkedIn, email)
- Navigation items

### 2. src/shared/config/navigation.config.ts

- Section definitions with IDs and labels

### 3. src/shared/constants/colors.ts

- Color palette (primary, accent, success, background, text)

### 4. src/shared/constants/breakpoints.ts

- Responsive breakpoints

### 5. src/shared/types/common.ts

- Common TypeScript types and interfaces

### 6. src/shared/utils/cn.ts

- classNames utility using clsx + tailwind-merge

```bash
npm install clsx tailwind-merge
```

### 7. src/shared/utils/formatters.ts

- Date formatting utilities
- Text formatting utilities

### 8. src/shared/index.ts

- Barrel exports

### 9. Write unit tests for utilities

### 10. Commit

```
feat: add shared utilities and configuration
```

## Requirements

- 100% test coverage for utilities
- Update CHANGELOG.md

## Output

Shared module with tested utilities
