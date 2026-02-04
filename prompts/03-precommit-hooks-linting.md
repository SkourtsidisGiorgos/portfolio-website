# PROMPT 3: Pre-commit Hooks & Linting Setup

## Task
Configure pre-commit hooks, linting, formatting, and security scanning

## Steps

### 1. Install dependencies
```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
npm install -D prettier eslint-plugin-prettier eslint-config-prettier prettier-plugin-tailwindcss
npm install -D gitleaks
```

### 2. Initialize Husky
```bash
npx husky init
```

### 3. Create .husky/pre-commit
- Run lint-staged

### 4. Create .husky/commit-msg
- Run commitlint

### 5. Create .husky/pre-push
- Run tests and type-check

### 6. Create eslint.config.js (flat config)
- TypeScript support
- React and React Hooks rules
- JSX accessibility rules
- Prettier integration

### 7. Create .prettierrc
- Semi, single quotes, 80 width
- Tailwind plugin

### 8. Create .lintstagedrc.js
- TypeScript files: tsc, eslint, prettier
- Other files: prettier
- All files: gitleaks

### 9. Create commitlint.config.js
- Conventional commits
- Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert

### 10. Update package.json scripts
- lint, lint:fix, format, format:check, type-check, prepare

### 11. Commit
```
chore: configure pre-commit hooks and linting
```

## Requirements
- Test that hooks work correctly
- Update CHANGELOG.md

## Output
Fully configured pre-commit pipeline
