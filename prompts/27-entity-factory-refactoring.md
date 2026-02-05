# PROMPT 27: Entity Factory Refactoring (Issue #23)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b refactor/entity-factory-validation

# Create GitHub issue
gh issue create --title "refactor: Simplify entity create() methods using validation helpers" \
  --body "Refactor entity factory methods to use shared validation utilities, reducing complexity and duplication."
```

## Task

Refactor entity `create()` methods to use the validation helpers from `src/shared/utils/validation.ts`, reducing cyclomatic complexity and improving maintainability.

## Problem Analysis

The following entity files have complex `create()` methods with repetitive validation patterns:

| File                                            | Current Complexity | Target |
| ----------------------------------------------- | ------------------ | ------ |
| `src/domain/contact/entities/ContactMessage.ts` | 16                 | ≤10    |
| `src/domain/portfolio/entities/Experience.ts`   | 12                 | ≤10    |
| `src/domain/portfolio/entities/Project.ts`      | 12                 | ≤10    |

Each entity has inline validation with patterns like:

```typescript
if (!props.name || props.name.trim() === '') {
  throw new Error('Name is required');
}
if (name.length < 2) {
  throw new Error('Name must be at least 2 characters');
}
if (name.length > 100) {
  throw new Error('Name must be less than 100 characters');
}
```

## Files to Modify

### Phase 1: Enhance Validation Utilities

#### 1. src/shared/utils/validation.ts

Add domain-specific validation presets and improve the API.

```typescript
// Add new exports:

/**
 * Validation presets for common entity fields
 */
export const validationPresets = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  subject: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
  },
  title: {
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 10000,
  },
  id: {
    required: true,
    minLength: 1,
  },
  url: {
    required: false,
    pattern: /^https?:\/\/.+/,
    customMessage: 'Must be a valid URL',
  },
} as const;

/**
 * Helper to validate and trim a string field
 * Returns the trimmed value if valid, throws if invalid
 */
export function validateAndTrim(
  value: unknown,
  field: string,
  preset: keyof typeof validationPresets
): string;

/**
 * Helper to validate optional fields
 * Returns trimmed value or undefined
 */
export function validateOptional(
  value: unknown,
  field: string,
  rules: Partial<ValidationRule>
): string | undefined;
```

### Phase 2: Refactor Entities

#### 2. src/domain/contact/entities/ContactMessage.ts

Current complexity: 16 → Target: ≤10

```typescript
// Before: Inline validation (16 complexity)
static create(props: CreateContactMessageProps): ContactMessage {
  if (!props.id || props.id.trim() === '') {
    throw new Error('Message ID is required');
  }
  if (!props.name || props.name.trim() === '') {
    throw new Error('Name is required');
  }
  // ... 14 more validation checks
}

// After: Using validation helpers (≤10 complexity)
import { validateFields, validationPresets } from '@/shared/utils/validation';

static create(props: CreateContactMessageProps): ContactMessage {
  // Validate all fields with presets
  const id = validateAndTrim(props.id, 'id', 'id');
  const name = validateAndTrim(props.name, 'name', 'name');
  const subject = validateAndTrim(props.subject, 'subject', 'subject');
  const message = validateAndTrim(props.message, 'message', 'message');

  return new ContactMessage({
    id,
    name,
    email: Email.create(props.email),
    subject,
    message,
    createdAt: props.createdAt ?? new Date(),
  });
}
```

#### 3. src/domain/portfolio/entities/Experience.ts

Current complexity: 12 → Target: ≤10

```typescript
// Before: Multiple inline validations
static create(props: CreateExperienceProps): Experience {
  if (!props.id) throw new Error('...');
  if (!props.company) throw new Error('...');
  if (!props.role) throw new Error('...');
  // ... more checks
}

// After: Declarative validation
import { validateFields, validateAndTrim } from '@/shared/utils/validation';

static create(props: CreateExperienceProps): Experience {
  const id = validateAndTrim(props.id, 'id', 'id');
  const company = validateAndTrim(props.company, 'company', 'name');
  const role = validateAndTrim(props.role, 'role', 'title');
  const location = validateAndTrim(props.location, 'location', 'name');

  // Validate descriptions array
  const descriptions = props.descriptions.map((d, i) =>
    validateAndTrim(d, `description[${i}]`, 'description')
  );

  return new Experience({
    id,
    company,
    role,
    location,
    remote: props.remote ?? false,
    dateRange: DateRange.create(props.startDate, props.endDate),
    descriptions,
    technologies: TechStack.create(props.technologies),
  });
}
```

#### 4. src/domain/portfolio/entities/Project.ts

Current complexity: 12 → Target: ≤10

```typescript
// Before: Scattered validation
static create(props: CreateProjectProps): Project {
  if (!props.id) throw new Error('...');
  if (!props.title) throw new Error('...');
  // URL validation inline
  // Technology validation inline
}

// After: Composed validation
import { validateAndTrim, validateOptional } from '@/shared/utils/validation';

static create(props: CreateProjectProps): Project {
  const id = validateAndTrim(props.id, 'id', 'id');
  const title = validateAndTrim(props.title, 'title', 'title');
  const description = validateAndTrim(props.description, 'description', 'description');

  // Optional URL fields
  const githubUrl = validateOptional(props.githubUrl, 'githubUrl', { pattern: /^https:\/\/github\.com\/.+/ });
  const liveUrl = validateOptional(props.liveUrl, 'liveUrl', { pattern: /^https?:\/\/.+/ });

  return new Project({
    id,
    title,
    description,
    technologies: TechStack.create(props.technologies),
    githubUrl,
    liveUrl,
    image: props.image,
    featured: props.featured ?? false,
  });
}
```

### Phase 3: Create Domain Validation Helpers

#### 5. src/domain/shared/validation.ts (Optional)

Create domain-specific validation helpers if needed.

```typescript
/**
 * Domain-layer validation helpers.
 * These wrap the shared validation utilities with domain-specific error types.
 */
import { validateField, ValidationRule } from '@/shared/utils/validation';
import { DomainValidationError } from '@/domain/shared/errors';

/**
 * Validate a domain entity field.
 * Throws DomainValidationError instead of generic ValidationError.
 */
export function validateEntityField(rule: ValidationRule): void {
  validateField(rule, { ErrorClass: DomainValidationError });
}

/**
 * Validate and return trimmed string, or throw DomainValidationError.
 */
export function requireString(
  value: unknown,
  field: string,
  options?: {
    minLength?: number;
    maxLength?: number;
  }
): string {
  const stringValue = typeof value === 'string' ? value.trim() : '';

  validateEntityField({
    field,
    value: stringValue,
    required: true,
    ...options,
  });

  return stringValue;
}
```

### Phase 4: Update Tests

#### 6. Update entity tests

Ensure existing tests still pass and add new test cases for edge cases.

```typescript
// tests/unit/domain/contact/entities/ContactMessage.test.ts

describe('ContactMessage.create', () => {
  // Existing tests should still pass

  // Add edge case tests
  it('trims whitespace from all fields', () => {
    const message = ContactMessage.create({
      id: '  123  ',
      name: '  John Doe  ',
      email: 'john@example.com',
      subject: '  Hello  ',
      message: '  This is a test message.  ',
    });

    expect(message.id).toBe('123');
    expect(message.name).toBe('John Doe');
    expect(message.subject).toBe('Hello');
    expect(message.message).toBe('This is a test message.');
  });

  it('validates all fields in single pass', () => {
    expect(() =>
      ContactMessage.create({
        id: '',
        name: '',
        email: 'invalid',
        subject: '',
        message: '',
      })
    ).toThrow(); // Should throw for first invalid field
  });
});
```

## Implementation Details

### validateAndTrim Implementation

```typescript
export function validateAndTrim(
  value: unknown,
  field: string,
  preset: keyof typeof validationPresets
): string {
  const rules = validationPresets[preset];
  const stringValue = typeof value === 'string' ? value.trim() : '';

  validateField({
    field,
    value: stringValue,
    ...rules,
  });

  return stringValue;
}
```

### validateOptional Implementation

```typescript
export function validateOptional(
  value: unknown,
  field: string,
  rules: Partial<ValidationRule>
): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const stringValue = typeof value === 'string' ? value.trim() : '';

  if (stringValue === '') {
    return undefined;
  }

  validateField({
    field,
    value: stringValue,
    required: false,
    ...rules,
  });

  return stringValue;
}
```

## SOLID Principles Applied

| Principle                 | Application                                                  |
| ------------------------- | ------------------------------------------------------------ |
| **S**ingle Responsibility | Validation logic in utilities, entity logic in entities      |
| **O**pen/Closed           | Presets extensible without modifying validation core         |
| **L**iskov Substitution   | All entities use same validation interface                   |
| **I**nterface Segregation | Simple helpers (validateAndTrim) vs complex (validateFields) |
| **D**ependency Inversion  | Entities depend on validation abstraction, not inline logic  |

## DRY Achievements

| Repeated Pattern               | Centralized Solution           |
| ------------------------------ | ------------------------------ |
| Required field check           | `validateAndTrim` with preset  |
| Min/max length validation      | `validationPresets`            |
| Trim + validate pattern        | `validateAndTrim` function     |
| Optional field with validation | `validateOptional` function    |
| Error message formatting       | Shared in validation utilities |

## Requirements

- [ ] All entity `create()` methods have complexity ≤10
- [ ] Use shared validation utilities (DRY)
- [ ] All existing entity tests pass
- [ ] Add edge case tests
- [ ] Consistent error messages
- [ ] Domain validation errors are specific

## Verification

```bash
# Run entity tests
npm run test:unit -- --grep "entities"

# Check complexity
npx eslint src/domain/ --rule 'complexity: ["error", 10]'

# Type check
npm run type-check

# Full test suite
npm run test
```

## Commit Message

```
refactor: simplify entity create() methods using validation helpers

- Add validateAndTrim and validateOptional to validation utilities
- Add validationPresets for common field types
- Refactor ContactMessage.create (16 → 8 complexity)
- Refactor Experience.create (12 → 7 complexity)
- Refactor Project.create (12 → 7 complexity)
- Add edge case tests for trimming and validation

DRY: All entities use shared validation presets
SOLID: Single Responsibility - validation logic centralized

Closes #<issue-number>
```

## Git Workflow

```bash
# After implementation
git add .
git commit -m "refactor: simplify entity create() methods using validation helpers

- Add validateAndTrim and validateOptional to validation utilities
- Add validationPresets for common field types
- Refactor ContactMessage.create (16 → 8 complexity)
- Refactor Experience.create (12 → 7 complexity)
- Refactor Project.create (12 → 7 complexity)
- Add edge case tests for trimming and validation

DRY: All entities use shared validation presets
SOLID: Single Responsibility - validation logic centralized

Closes #<issue-number>"

# Create PR
git push -u origin refactor/entity-factory-validation
gh pr create --title "refactor: Entity factory refactoring (Issue #23)" \
  --body "## Summary
Refactors entity \`create()\` methods to use shared validation utilities.

## Changes
- Enhanced \`validation.ts\` with \`validateAndTrim\` and \`validateOptional\`
- Added \`validationPresets\` for common field types
- Refactored 3 entity factories to use shared validation

## Complexity Reduction
| Entity | Before | After |
|--------|--------|-------|
| ContactMessage | 16 | 8 |
| Experience | 12 | 7 |
| Project | 12 | 7 |

## Test plan
- [ ] All entity tests pass
- [ ] New edge case tests added
- [ ] Validation errors are consistent
- [ ] No behavior changes

Closes #<issue-number>"
```

## Output

Clean entity layer with:

- Simplified `create()` methods
- Centralized validation logic
- Consistent error handling
- Improved testability
