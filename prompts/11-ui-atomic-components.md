# PROMPT 11: UI Components - Atomic Design Base

## Task

Create base UI components following atomic design

## Install

```bash
npm install framer-motion
```

## Components to Create

### 1. src/presentation/components/ui/Button/

- Button.tsx: variants (primary, secondary, ghost, outline), sizes, loading state
- Button.test.tsx: comprehensive tests
- index.ts: barrel export

### 2. src/presentation/components/ui/Typography/

- Typography.tsx: h1-h6, p, span with variants
- Tests

### 3. src/presentation/components/ui/Card/

- Card.tsx: glass morphism style, hover effects
- CardHeader, CardContent, CardFooter
- Tests

### 4. src/presentation/components/ui/Input/

- Input.tsx: text input with label, error state
- Textarea.tsx
- Tests

### 5. src/presentation/components/ui/Badge/

- Badge.tsx: for skills/technologies
- Tests

### 6. src/presentation/components/ui/Loader/

- Loader.tsx: animated loading spinner
- Tests

### 7. src/presentation/components/ui/index.ts

- Barrel exports

### 8. Commit

```
feat: add base UI components
```

## Styling Guidelines

- Tailwind CSS with custom theme
- Framer Motion for animations
- Glass morphism effects
- Responsive design

## Requirements

- Each component fully tested
- Accessible (ARIA labels)
- Update CHANGELOG.md

## Output

Reusable UI component library
