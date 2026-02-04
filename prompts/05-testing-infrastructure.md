# PROMPT 5: Testing Infrastructure Setup

## Task
Configure Vitest and Playwright testing frameworks

## Steps

### 1. Install dependencies
```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npm install -D @vitest/coverage-v8
```

### 2. Create vitest.config.ts
- jsdom environment
- React plugin
- Coverage thresholds (80%)
- Setup file reference

### 3. Create tests/setup.ts
- Import testing-library/jest-dom
- Global test setup

### 4. Create playwright.config.ts
- Chromium, Firefox, WebKit
- Mobile Chrome
- Local dev server

### 5. Update package.json scripts
- test, test:unit, test:unit:watch, test:coverage
- test:e2e, test:e2e:ui

### 6. Create sample tests to verify setup
- tests/unit/sample.test.ts
- tests/e2e/sample.spec.ts

### 7. Run tests to verify configuration

### 8. Commit
```
test: configure vitest and playwright testing infrastructure
```

## Requirements
- All tests must pass
- Update CHANGELOG.md

## Output
Working test infrastructure with sample tests
