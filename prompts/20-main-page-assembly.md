# PROMPT 20: Main Page Assembly (SOLID/DRY/TDD/DDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/main-page-assembly

# Create GitHub issue
gh issue create --title "feat: Assemble main page with all sections" \
  --body "Integrate all sections into the main page with proper navigation and SEO"
```

## Task

Assemble all sections into the main page following clean architecture principles.

## Architecture Overview

```
src/app/
├── page.tsx                    # Main page composition
├── layout.tsx                  # Root layout with metadata
├── globals.css                 # Global styles
├── loading.tsx                 # Loading skeleton
├── error.tsx                   # Error boundary
├── not-found.tsx               # 404 page
├── sitemap.ts                  # Dynamic sitemap
└── robots.ts                   # Robots configuration
```

## Files to Create/Update

### Phase 1: Root Layout (Single Responsibility)

#### 1. src/app/layout.tsx

Root layout with metadata.

```typescript
// Requirements:
// - SEO metadata (title, description, keywords)
// - Open Graph tags for social sharing
// - Twitter cards
// - Structured data (JSON-LD) for Person schema
// - Font optimization (next/font)
// - Theme provider if using (for future dark mode)
// - Analytics script (optional)
// - Single Responsibility: only handles document setup
```

#### 2. src/app/metadata.ts

Centralized metadata configuration (DRY).

```typescript
// Requirements:
// - Export base metadata object
// - Export generateMetadata helper
// - Structured data helpers
// - Single source of truth for SEO config
```

### Phase 2: Main Page (Composition Root)

#### 3. src/app/page.tsx

Main page composition.

```typescript
// Requirements:
// - Imports all section components
// - Lazy loads 3D sections (React.lazy + Suspense)
// - Proper section ordering:
//   1. Hero
//   2. About
//   3. Skills
//   4. Experience
//   5. Projects
//   6. Contact
// - Section IDs for navigation (#about, #skills, etc.)
// - Uses composition pattern (not inheritance)
// - Single Responsibility: only composes sections
```

#### 4. src/presentation/components/layout/PageContainer.tsx

Page wrapper with common functionality.

```typescript
// Requirements:
// - Smooth scroll behavior
// - Section observer for active state
// - Performance mode context
// - Skip link for accessibility
// - Single Responsibility: page-level concerns
```

### Phase 3: Global Styles

#### 5. src/app/globals.css

Global styles and CSS variables.

```typescript
// Requirements:
// - CSS custom properties for theme colors
// - Custom scrollbar styling (webkit)
// - Selection colors matching theme
// - Smooth scroll behavior
// - 3D canvas container styles
// - Reduced motion media query support
// - Base typography resets
// - Keep DRY: use Tailwind utilities where possible
```

### Phase 4: Loading & Error States

#### 6. src/app/loading.tsx

Loading skeleton.

```typescript
// Requirements:
// - Skeleton that matches page layout
// - Animated pulse effect
// - Uses Skeleton component from prompt 11 (DRY)
// - Fast initial paint
```

#### 7. src/app/error.tsx

Error boundary.

```typescript
// Requirements:
// - Client component ('use client')
// - Error display with stack (dev only)
// - Retry functionality
// - Log to error service (optional)
// - Uses Button from prompt 11 (DRY)
// - Accessible error messaging
```

#### 8. src/app/not-found.tsx

Custom 404 page.

```typescript
// Requirements:
// - Friendly message
// - Navigation back to home
// - Optional: 3D element (simple, not heavy)
// - Uses Typography from prompt 11 (DRY)
// - Uses Button from prompt 11 (DRY)
```

### Phase 5: SEO Files

#### 9. src/app/sitemap.ts

Dynamic sitemap generation.

```typescript
// Requirements:
// - Export sitemap function
// - Include all pages
// - Set appropriate lastmod dates
// - Priority settings (home = 1.0)
// - Single Responsibility: sitemap generation
```

#### 10. src/app/robots.ts

Robots configuration.

```typescript
// Requirements:
// - Allow all crawlers
// - Reference sitemap
// - Disallow any private routes (if any)
```

### Phase 6: Navigation Integration

#### 11. src/presentation/hooks/useActiveSection.ts

Track active section for navigation.

```typescript
// Requirements:
// - Uses Intersection Observer
// - Returns currently visible section ID
// - Debounced for performance
// - Integrates with Header component from prompt 12
// - Single Responsibility: section tracking
```

#### 12. src/presentation/hooks/useSmoothScroll.ts

Smooth scroll to sections.

```typescript
// Requirements:
// - Handles hash navigation (#about)
// - Smooth scroll with offset for fixed header
// - Accessible: updates focus
// - Single Responsibility: scroll handling
```

### Phase 7: Tests (TDD)

#### 13. src/app/**tests**/page.test.tsx

```typescript
// Test cases:
// - Renders all sections
// - Section IDs are present
// - Lazy loading works
// - Skip link works
// - Navigation to sections works
```

#### 14. tests/e2e/navigation.spec.ts

E2E navigation tests.

```typescript
// Test cases:
// - Page loads successfully
// - All sections visible on scroll
// - Nav links scroll to correct sections
// - Mobile menu works
// - 404 page displays for invalid routes
```

### Phase 8: Git Workflow

```bash
# Commit
git add .
git commit -m "feat: assemble main page with all sections

- Configure root layout with SEO metadata
- Implement main page with lazy-loaded sections
- Add loading skeleton and error boundary
- Create custom 404 page
- Add sitemap and robots configuration
- Integrate navigation with section tracking
- Add E2E tests for navigation

Implements: Composition pattern, lazy loading, SEO best practices
Closes #<issue-number>"

# Create PR
git push -u origin feature/main-page-assembly
gh pr create --title "feat: Assemble main page with all sections" \
  --body "## Summary
- All sections integrated into main page
- SEO metadata and structured data
- Loading and error states
- Navigation with section tracking

## Test plan
- [ ] All sections render
- [ ] Navigation scrolls correctly
- [ ] Loading state shows skeleton
- [ ] Error boundary catches errors
- [ ] 404 page works
- [ ] SEO metadata correct
- [ ] E2E tests pass

Closes #<issue-number>"
```

## SOLID Principles Applied

| Principle                 | Application                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| **S**ingle Responsibility | page.tsx composes, layout.tsx configures, loading.tsx shows skeleton |
| **O**pen/Closed           | Sections are self-contained, easy to add/remove                      |
| **L**iskov Substitution   | Any section component works in the composition                       |
| **I**nterface Segregation | Hooks have focused interfaces                                        |
| **D**ependency Inversion  | Page depends on section interfaces, not implementations              |

## DRY Achievements

| Repeated Pattern  | Centralized Solution                       |
| ----------------- | ------------------------------------------ |
| Metadata          | Centralized in metadata.ts                 |
| Section wrapper   | All sections use Section from prompt 12    |
| Loading skeletons | Shared Skeleton component                  |
| Error UI          | Shared error components                    |
| Navigation hooks  | Reusable useActiveSection, useSmoothScroll |

## Requirements

- [ ] All sections render correctly
- [ ] Lazy loading for 3D sections
- [ ] SEO metadata complete
- [ ] Structured data (JSON-LD)
- [ ] Loading/error states
- [ ] 404 page
- [ ] E2E tests pass

## Output

Complete portfolio page that:

- Integrates all sections seamlessly
- Has excellent SEO
- Handles loading and errors gracefully
- Is fully navigable and accessible
