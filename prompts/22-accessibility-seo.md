# PROMPT 22: Accessibility & SEO (SOLID/DRY/TDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/accessibility-seo

# Create GitHub issue
gh issue create --title "feat: Enhance accessibility and SEO" \
  --body "Implement WCAG 2.1 AA compliance, screen reader support, and SEO optimization"
```

## Task

Ensure accessibility and SEO best practices following WCAG 2.1 AA standards.

## Architecture Overview

```
src/
├── presentation/
│   ├── components/
│   │   └── a11y/                    # Accessibility components
│   │       ├── SkipLink.tsx         # Skip to content
│   │       ├── VisuallyHidden.tsx   # Screen reader only
│   │       ├── FocusTrap.tsx        # Modal focus trap
│   │       └── LiveRegion.tsx       # ARIA live announcements
│   └── hooks/
│       ├── useFocusManagement.ts    # Focus utilities
│       ├── useReducedMotion.ts      # Motion preference
│       └── useAnnounce.ts           # Screen reader announcements
├── shared/
│   └── utils/
│       └── a11y.ts                  # Accessibility utilities
└── tests/
    └── e2e/
        └── accessibility.spec.ts    # A11y E2E tests
```

## Files to Create

### Phase 1: Core Accessibility Components (SOLID)

#### 1. src/presentation/components/a11y/SkipLink.tsx

Skip to main content link.

```typescript
// Requirements:
// - Hidden until focused
// - Links to main content (#main-content)
// - Proper styling when visible
// - Uses VisuallyHidden pattern (DRY)
// - Single Responsibility: skip navigation
```

#### 2. src/presentation/components/a11y/VisuallyHidden.tsx

Screen reader only content.

```typescript
// Requirements:
// - Visually hidden but accessible
// - Props: as (element type), children
// - Uses standard sr-only CSS
// - Reusable across app (DRY)
// - Single Responsibility: visual hiding
```

#### 3. src/presentation/components/a11y/FocusTrap.tsx

Focus trap for modals.

```typescript
// Requirements:
// - Traps focus within container
// - Returns focus on unmount
// - Escape key support
// - Props: active, onEscape, children
// - Single Responsibility: focus trapping
```

#### 4. src/presentation/components/a11y/LiveRegion.tsx

ARIA live region for announcements.

```typescript
// Requirements:
// - Implements aria-live regions
// - Props: politeness ('polite' | 'assertive')
// - Context provider pattern
// - Single Responsibility: live announcements
```

### Phase 2: Accessibility Hooks (DRY)

#### 5. src/presentation/hooks/useFocusManagement.ts

Focus management utilities.

```typescript
// Requirements:
// - trapFocus(container) function
// - returnFocus() function
// - focusFirst(container) function
// - Uses refs for focus restoration
// - Single Responsibility: focus utilities
```

#### 6. src/presentation/hooks/useReducedMotion.ts

Reduced motion preference hook.

```typescript
// Requirements:
// - Detects prefers-reduced-motion
// - Returns: boolean
// - Updates on preference change
// - Used by all animation components (DRY)
// - Single Responsibility: motion detection
```

#### 7. src/presentation/hooks/useAnnounce.ts

Screen reader announcement hook.

```typescript
// Requirements:
// - Returns: announce(message, politeness?)
// - Integrates with LiveRegion
// - Used for dynamic content updates
// - Single Responsibility: announcements
```

### Phase 3: Accessibility Utilities

#### 8. src/shared/utils/a11y.ts

Common accessibility utilities.

```typescript
// Requirements:
// - generateId() for form associations
// - isInteractive(element) check
// - getAriaLabel(element) helper
// - keyboardNavigation handlers
// - Pure functions, testable
```

### Phase 4: Component Accessibility Updates

#### 9. Update all interactive components

Ensure all UI components are accessible.

```typescript
// Requirements per component:
// - Button: aria-label when icon-only, disabled state
// - Input: label association, error announcements
// - Card: proper role if interactive
// - Modal: focus trap, escape, aria-modal
// - 3D scenes: aria-hidden (decorative)
// - Forms: fieldset/legend for groups
```

#### 10. Update navigation components

```typescript
// Requirements:
// - Header: nav landmark, aria-label
// - Mobile menu: aria-expanded, focus management
// - Links: descriptive text (not "click here")
// - Current page: aria-current="page"
```

### Phase 5: Color Contrast & Visual

#### 11. Verify WCAG AA color contrast

```typescript
// Requirements:
// - Normal text: 4.5:1 ratio minimum
// - Large text: 3:1 ratio minimum
// - UI components: 3:1 ratio minimum
// - Use contrast checker tool
// - Document color decisions
```

#### 12. High contrast mode support

```typescript
// Requirements:
// - Respect forced-colors media query
// - Ensure content visible in high contrast
// - Test with Windows High Contrast
```

### Phase 6: SEO Enhancement

#### 13. Update metadata (from prompt 20)

```typescript
// Requirements:
// - Title: page-specific, max 60 chars
// - Description: compelling, max 160 chars
// - Keywords: relevant, not stuffed
// - Canonical URL
// - Language declaration
```

#### 14. Structured data enhancement

```typescript
// Requirements:
// - Person schema (JSON-LD)
// - WebSite schema
// - BreadcrumbList if applicable
// - Validate with Google Rich Results Test
```

#### 15. Open Graph & Twitter Cards

```typescript
// Requirements:
// - og:title, og:description, og:image
// - twitter:card, twitter:title, twitter:description
// - Image dimensions: 1200x630 for OG
// - Test with social media debuggers
```

### Phase 7: Tests

#### 16. src/shared/utils/**tests**/a11y.test.ts

```typescript
// Test cases:
// - generateId() returns unique IDs
// - isInteractive() identifies interactive elements
// - Pure functions work correctly
```

#### 17. src/presentation/hooks/**tests**/useReducedMotion.test.ts

```typescript
// Test cases:
// - Returns false when no preference
// - Returns true when reduced motion preferred
// - Updates on change
```

#### 18. tests/e2e/accessibility.spec.ts

E2E accessibility tests.

```typescript
// Test cases using axe-core:
// - No accessibility violations on home page
// - All sections pass audit
// - Keyboard navigation works
// - Focus order is logical
// - Skip link works
// - Modals trap focus
// - Forms are accessible
```

### Phase 8: Audit & Git

#### 19. Run accessibility audit

```bash
# Install axe CLI
npm install -g @axe-core/cli

# Run audit
axe http://localhost:3000 --save accessibility-report.json

# Also run Lighthouse accessibility audit
npx lighthouse http://localhost:3000 --only-categories=accessibility
```

#### 20. Git workflow

```bash
# Commit
git add .
git commit -m "feat: enhance accessibility and seo

- Add core a11y components (SkipLink, FocusTrap, LiveRegion)
- Add a11y hooks (useFocusManagement, useReducedMotion, useAnnounce)
- Update all interactive components for WCAG 2.1 AA
- Verify color contrast ratios
- Enhance SEO metadata and structured data
- Add E2E accessibility tests with axe-core

WCAG 2.1 AA compliant, Lighthouse accessibility: 100
Closes #<issue-number>"

# Create PR
git push -u origin feature/accessibility-seo
gh pr create --title "feat: Enhance accessibility and SEO" \
  --body "## Summary
- Core accessibility components
- Focus management and announcements
- WCAG 2.1 AA compliance
- SEO metadata and structured data

## Accessibility Audit
- axe-core: 0 violations
- Lighthouse: 100

## Test plan
- [ ] Skip link works
- [ ] Keyboard navigation complete
- [ ] Screen reader announces correctly
- [ ] Color contrast passes
- [ ] Focus trap works in modals
- [ ] SEO metadata correct
- [ ] Structured data validates
- [ ] E2E tests pass

Closes #<issue-number>"
```

## SOLID Principles Applied

| Principle                 | Application                                           |
| ------------------------- | ----------------------------------------------------- |
| **S**ingle Responsibility | SkipLink skips, FocusTrap traps, LiveRegion announces |
| **O**pen/Closed           | A11y components configurable via props                |
| **L**iskov Substitution   | All form inputs work with a11y utilities              |
| **I**nterface Segregation | Separate hooks for focus, motion, announce            |
| **D**ependency Inversion  | Components use hooks, not direct DOM                  |

## DRY Achievements

| Repeated Pattern | Centralized Solution     |
| ---------------- | ------------------------ |
| Visually hidden  | VisuallyHidden component |
| Focus management | useFocusManagement hook  |
| Motion detection | useReducedMotion hook    |
| Announcements    | useAnnounce + LiveRegion |
| ID generation    | a11y.generateId()        |

## Requirements

- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard fully navigable
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Lighthouse accessibility 100
- [ ] E2E tests pass
- [ ] SEO metadata complete
- [ ] Structured data validates

## Output

Accessible, SEO-optimized website that:

- Works for all users
- Passes automated audits
- Has excellent search engine visibility
- Is thoroughly tested
