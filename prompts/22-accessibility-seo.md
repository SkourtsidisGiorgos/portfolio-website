# PROMPT 22: Accessibility & SEO

## Task

Ensure accessibility and SEO best practices

## Steps

### 1. Accessibility audit

- Run axe-core tests
- Fix all violations
- Add skip links
- Keyboard navigation
- Focus management
- ARIA labels for 3D elements

### 2. Screen reader support

- Alt text for images
- Descriptive link text
- Proper heading hierarchy
- Form labels

### 3. Color contrast

- Verify WCAG AA compliance
- High contrast mode support

### 4. SEO optimization

- Meta descriptions
- Open Graph tags
- Twitter cards
- Canonical URLs
- Structured data (Person, WebSite)

### 5. Create robots.txt and sitemap.xml

### 6. Add Google Analytics (optional)

### 7. E2E accessibility tests

- tests/e2e/accessibility.spec.ts

### 8. Commit

```
feat: enhance accessibility and seo
```

## Requirements

- WCAG 2.1 AA compliant
- All E2E tests pass
- Update CHANGELOG.md

## Output

Accessible, SEO-optimized website
