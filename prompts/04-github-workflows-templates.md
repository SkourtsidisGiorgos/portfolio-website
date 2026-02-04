# PROMPT 4: GitHub Workflows & Templates Setup

## Task
Configure GitHub Actions CI/CD and repository templates

## Files to Create

### 1. .github/workflows/ci.yml
- Trigger: push/PR to main, develop
- Jobs: lint, unit-tests, e2e-tests, build
- Node.js 20.x
- Upload coverage to Codecov

### 2. .github/workflows/security.yml
- Dependency audit (npm audit)
- Secret scanning (gitleaks)
- CodeQL analysis
- Weekly schedule

### 3. .github/workflows/deploy.yml
- Deploy to Vercel on main push
- Production environment

### 4. .github/ISSUE_TEMPLATE/bug_report.md
- Description, steps to reproduce, expected/actual behavior
- Environment info

### 5. .github/ISSUE_TEMPLATE/feature_request.md
- Description, motivation, proposed solution

### 6. .github/ISSUE_TEMPLATE/task.md
- General task template

### 7. .github/pull_request_template.md
- Summary, type of change, related issues
- Changes made, testing checklist

### 8. .github/CODEOWNERS
- Set owner for all files

## Commit
```
ci: add github actions workflows and templates
```

## Requirements
- Update CHANGELOG.md

## Output
Complete GitHub repository configuration
