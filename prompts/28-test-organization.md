# PROMPT 28: Test Organization (Issue #26)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b refactor/test-organization

# Create GitHub issue
gh issue create --title "refactor: Improve test structure and reduce duplication" \
  --body "Flatten nested describe blocks, create shared fixtures, and extract test factory functions."
```

## Task

Improve test organization by flattening deeply nested structures, creating shared fixtures, extracting test factory functions, and removing duplicate string literals.

## Problem Analysis

Current test issues:

1. **Deep nesting**: Some test files have >3 levels of `describe`/`it` blocks
2. **Duplicated fixtures**: Same test data created in multiple files
3. **Repeated string literals**: Magic strings duplicated across tests
4. **No factory functions**: Complex object creation repeated inline

## Files to Create/Modify

### Phase 1: Create Test Infrastructure

#### 1. tests/fixtures/index.ts

Create a central export for all test fixtures.

```typescript
// Central fixture exports
export * from './entities';
export * from './value-objects';
export * from './api-responses';
export * from './dom';
```

#### 2. tests/fixtures/entities.ts

Create factory functions for domain entities.

```typescript
import { Experience } from '@/domain/portfolio/entities/Experience';
import { Project } from '@/domain/portfolio/entities/Project';
import { Skill } from '@/domain/portfolio/entities/Skill';
import { ContactMessage } from '@/domain/contact/entities/ContactMessage';

/**
 * Factory for creating test Experience entities.
 * Override any property with partial props.
 */
export function createTestExperience(
  overrides: Partial<CreateExperienceProps> = {}
): Experience {
  return Experience.create({
    id: 'exp-1',
    company: 'Test Company',
    role: 'Senior Engineer',
    location: 'Remote',
    remote: true,
    startDate: new Date('2022-01-01'),
    endDate: null,
    descriptions: ['Built things', 'Led teams'],
    technologies: ['TypeScript', 'React', 'Node.js'],
    ...overrides,
  });
}

/**
 * Factory for creating test Project entities.
 */
export function createTestProject(
  overrides: Partial<CreateProjectProps> = {}
): Project {
  return Project.create({
    id: 'proj-1',
    title: 'Test Project',
    description: 'A test project for unit testing purposes.',
    technologies: ['React', 'TypeScript'],
    githubUrl: 'https://github.com/test/project',
    liveUrl: 'https://example.com',
    image: '/images/test-project.jpg',
    featured: false,
    ...overrides,
  });
}

/**
 * Factory for creating test Skill entities.
 */
export function createTestSkill(
  overrides: Partial<CreateSkillProps> = {}
): Skill {
  return Skill.create({
    id: 'skill-1',
    name: 'TypeScript',
    category: 'Languages',
    proficiency: 90,
    icon: 'typescript',
    ...overrides,
  });
}

/**
 * Factory for creating test ContactMessage entities.
 */
export function createTestContactMessage(
  overrides: Partial<CreateContactMessageProps> = {}
): ContactMessage {
  return ContactMessage.create({
    id: 'msg-1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message for unit testing purposes.',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  });
}
```

#### 3. tests/fixtures/value-objects.ts

Create factory functions for value objects.

```typescript
import { DateRange } from '@/domain/portfolio/value-objects/DateRange';
import { TechStack } from '@/domain/portfolio/value-objects/TechStack';
import { Email } from '@/domain/contact/value-objects/Email';
import { ContactInfo } from '@/domain/portfolio/value-objects/ContactInfo';

/**
 * Factory for DateRange value objects.
 */
export function createTestDateRange(
  overrides: { start?: Date; end?: Date | null } = {}
): DateRange {
  return DateRange.create(
    overrides.start ?? new Date('2022-01-01'),
    overrides.end ?? null
  );
}

/**
 * Factory for TechStack value objects.
 */
export function createTestTechStack(
  technologies: string[] = ['TypeScript', 'React']
): TechStack {
  return TechStack.create(technologies);
}

/**
 * Factory for Email value objects.
 */
export function createTestEmail(email: string = 'test@example.com'): Email {
  return Email.create(email);
}

/**
 * Factory for ContactInfo value objects.
 */
export function createTestContactInfo(
  overrides: Partial<ContactInfoProps> = {}
): ContactInfo {
  return ContactInfo.create({
    email: 'contact@example.com',
    phone: '+1234567890',
    location: 'San Francisco, CA',
    ...overrides,
  });
}
```

#### 4. tests/fixtures/api-responses.ts

Create mock API response factories.

```typescript
/**
 * Factory for mock API responses.
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
  };
}

export function createErrorResponse(
  message: string,
  code: string = 'ERROR'
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: { message, code },
  };
}

/**
 * Mock email send response.
 */
export function createEmailSendResponse(
  success: boolean = true
): EmailSendResult {
  return {
    success,
    messageId: success ? 'msg-123' : undefined,
    error: success ? undefined : 'Failed to send email',
  };
}
```

#### 5. tests/fixtures/dom.ts

Create DOM-related test utilities.

```typescript
import { vi } from 'vitest';

/**
 * Mock IntersectionObserver for lazy loading tests.
 */
export function mockIntersectionObserver(): void {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.IntersectionObserver =
    mockIntersectionObserver as unknown as typeof IntersectionObserver;
}

/**
 * Mock ResizeObserver for responsive tests.
 */
export function mockResizeObserver(): void {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.ResizeObserver =
    mockResizeObserver as unknown as typeof ResizeObserver;
}

/**
 * Mock matchMedia for responsive tests.
 */
export function mockMatchMedia(matches: boolean = false): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/**
 * Mock WebGL context for 3D tests.
 */
export function mockWebGLContext(supported: boolean = true): void {
  const mockGetContext = vi.fn().mockReturnValue(supported ? {} : null);
  HTMLCanvasElement.prototype.getContext = mockGetContext;
}
```

#### 6. tests/fixtures/constants.ts

Create shared test constants.

```typescript
/**
 * Common test IDs.
 */
export const TEST_IDS = {
  EXPERIENCE: 'exp-test-1',
  PROJECT: 'proj-test-1',
  SKILL: 'skill-test-1',
  MESSAGE: 'msg-test-1',
} as const;

/**
 * Common test emails.
 */
export const TEST_EMAILS = {
  VALID: 'test@example.com',
  INVALID: 'not-an-email',
  WITH_SUBDOMAIN: 'test@sub.example.com',
} as const;

/**
 * Common error messages.
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) =>
    `${field} must be at most ${max} characters`,
  INVALID_EMAIL: 'Invalid email format',
} as const;

/**
 * Test dates.
 */
export const TEST_DATES = {
  PAST: new Date('2020-01-01'),
  RECENT: new Date('2023-06-15'),
  FUTURE: new Date('2025-12-31'),
} as const;
```

### Phase 2: Refactor Test Files

#### 7. Flatten tests/unit/domain/\*.test.ts

```typescript
// Before: Deeply nested
describe('Experience', () => {
  describe('create', () => {
    describe('validation', () => {
      describe('id field', () => {
        it('throws when id is empty', () => { ... });
        it('throws when id is whitespace', () => { ... });
      });
      describe('company field', () => {
        it('throws when company is empty', () => { ... });
      });
    });
  });
});

// After: Flattened with descriptive names
describe('Experience', () => {
  describe('create', () => {
    it('creates valid experience with all fields', () => { ... });
    it('throws ValidationError when id is empty', () => { ... });
    it('throws ValidationError when id is whitespace only', () => { ... });
    it('throws ValidationError when company is empty', () => { ... });
    it('creates experience with default remote=false', () => { ... });
  });

  describe('computed properties', () => {
    it('isCurrent returns true when endDate is null', () => { ... });
    it('duration returns correct string for ongoing role', () => { ... });
  });
});
```

#### 8. Refactor tests/integration/repositories.test.ts

```typescript
// Before: Inline test data
describe('ExperienceRepository', () => {
  it('returns all experiences', () => {
    const repo = new StaticExperienceRepository();
    const experiences = repo.findAll();
    expect(experiences[0].company).toBe('Company A');
    // More inline assertions...
  });
});

// After: Using fixtures
import { createTestExperience, TEST_IDS } from '../fixtures';

describe('ExperienceRepository', () => {
  const repository = new StaticExperienceRepository();

  it('returns all experiences', () => {
    const experiences = repository.findAll();
    expect(experiences).toHaveLength(expect.any(Number));
    expect(experiences[0]).toBeInstanceOf(Experience);
  });

  it('finds experience by id', () => {
    const experience = repository.findById(TEST_IDS.EXPERIENCE);
    expect(experience).toBeDefined();
  });
});
```

#### 9. Refactor tests/unit/presentation/three/\*_/_.test.ts

```typescript
// Before: Repeated mock setup
describe('HeroScene', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  // Tests...
});

// After: Using fixtures
import { mockIntersectionObserver, mockWebGLContext } from '../../../fixtures';

describe('HeroScene', () => {
  beforeEach(() => {
    mockIntersectionObserver();
    mockWebGLContext();
  });

  // Tests...
});
```

### Phase 3: Add Test Utilities

#### 10. tests/utils/index.ts

Create test utility functions.

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render with common providers.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
) {
  return render(ui, {
    wrapper: ({ children }) => (
      // Add any providers here
      <>{children}</>
    ),
    ...options,
  });
}

/**
 * Wait for async effects to settle.
 */
export async function waitForEffects(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Create a mock function that tracks calls.
 */
export function createSpyFn<T extends (...args: unknown[]) => unknown>(): T & {
  calls: Parameters<T>[];
  reset: () => void;
} {
  const calls: Parameters<T>[] = [];
  const fn = ((...args: Parameters<T>) => {
    calls.push(args);
    return undefined;
  }) as T & { calls: Parameters<T>[]; reset: () => void };
  fn.calls = calls;
  fn.reset = () => { calls.length = 0; };
  return fn;
}
```

## Refactoring Patterns

### Pattern 1: Replace Magic Strings

```typescript
// Before
expect(error.message).toBe('Name is required');

// After
import { ERROR_MESSAGES } from '../fixtures';
expect(error.message).toBe(ERROR_MESSAGES.REQUIRED_FIELD('Name'));
```

### Pattern 2: Use Factory Functions

```typescript
// Before
const experience = Experience.create({
  id: 'exp-1',
  company: 'Test Co',
  role: 'Engineer',
  location: 'Remote',
  remote: true,
  startDate: new Date('2022-01-01'),
  endDate: null,
  descriptions: ['Did stuff'],
  technologies: ['TypeScript'],
});

// After
import { createTestExperience } from '../fixtures';
const experience = createTestExperience();

// Or with overrides
const experience = createTestExperience({ company: 'Custom Co' });
```

### Pattern 3: Flatten Nesting

```typescript
// Before: 4 levels deep
describe('Module', () => {
  describe('Class', () => {
    describe('method', () => {
      describe('when condition', () => {
        it('does something', () => { ... });
      });
    });
  });
});

// After: 2 levels max, descriptive names
describe('Module.Class', () => {
  describe('method', () => {
    it('does something when condition is met', () => { ... });
    it('does other thing when condition is not met', () => { ... });
  });
});
```

## Requirements

- [ ] Maximum 3 levels of describe/it nesting
- [ ] All test fixtures in `tests/fixtures/`
- [ ] Factory functions for all entities
- [ ] No duplicate magic strings
- [ ] Shared DOM mocks
- [ ] All tests pass after refactoring
- [ ] Improved test readability

## Verification

```bash
# Run all tests
npm run test

# Check test coverage
npm run test:coverage

# Verify no deep nesting (manual review)
grep -r "describe(" tests/ | wc -l

# Verify fixtures are used
grep -r "createTest" tests/ | wc -l
```

## Commit Message

```
refactor: improve test organization and reduce duplication

- Create shared fixtures in tests/fixtures/
- Add factory functions for all entities and value objects
- Add DOM mock utilities (IntersectionObserver, WebGL, etc.)
- Flatten deeply nested describe blocks (max 3 levels)
- Replace magic strings with constants
- Extract common test utilities

Tests are now more maintainable and DRY

Closes #<issue-number>
```

## Git Workflow

```bash
# After implementation
git add .
git commit -m "refactor: improve test organization and reduce duplication

- Create shared fixtures in tests/fixtures/
- Add factory functions for all entities and value objects
- Add DOM mock utilities (IntersectionObserver, WebGL, etc.)
- Flatten deeply nested describe blocks (max 3 levels)
- Replace magic strings with constants
- Extract common test utilities

Tests are now more maintainable and DRY

Closes #<issue-number>"

# Create PR
git push -u origin refactor/test-organization
gh pr create --title "refactor: Test organization (Issue #26)" \
  --body "## Summary
Improves test structure and reduces duplication across test files.

## Changes
- Created \`tests/fixtures/\` with entity and value object factories
- Added DOM mock utilities (IntersectionObserver, WebGL, matchMedia)
- Flattened deeply nested test blocks
- Replaced magic strings with constants
- Added shared test utilities

## Files Added
- \`tests/fixtures/index.ts\`
- \`tests/fixtures/entities.ts\`
- \`tests/fixtures/value-objects.ts\`
- \`tests/fixtures/api-responses.ts\`
- \`tests/fixtures/dom.ts\`
- \`tests/fixtures/constants.ts\`
- \`tests/utils/index.ts\`

## Test plan
- [ ] All tests pass
- [ ] Coverage unchanged or improved
- [ ] Tests more readable
- [ ] Fixtures properly typed

Closes #<issue-number>"
```

## Output

Well-organized test suite with:

- Shared, typed fixtures
- Factory functions for test data
- Flattened, readable test structure
- No duplicate code
- Consistent DOM mocks
