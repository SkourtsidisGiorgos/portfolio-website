# PROMPT 19: Contact Section & Form (SOLID/DRY/TDD/DDD)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/contact-section

# Create GitHub issue
gh issue create --title "feat: Contact section with working form" \
  --body "Implement contact section with validated form and email integration"
```

## Task

Create contact section with working form following clean architecture principles.

## Install

```bash
npm install react-hook-form @hookform/resolvers zod resend
```

## Architecture Overview

```
src/
├── domain/contact/
│   ├── entities/ContactMessage.ts    # Already exists
│   ├── value-objects/Email.ts        # Already exists
│   └── services/IEmailService.ts     # Already exists
├── infrastructure/email/
│   └── ResendEmailService.ts         # Implements IEmailService
├── application/use-cases/
│   └── SendContactMessageUseCase.ts  # Orchestrates sending
├── app/api/contact/
│   └── route.ts                      # API endpoint
└── presentation/components/sections/Contact/
    ├── Contact.tsx                   # Container
    ├── ContactForm.tsx               # Form component
    └── SocialLinks.tsx               # Social media links
```

## Files to Create

### Phase 1: Infrastructure Layer (Dependency Inversion)

#### 1. src/infrastructure/email/ResendEmailService.ts

Email service implementation.

```typescript
// Requirements:
// - Implements IEmailService interface (from domain)
// - Uses Resend SDK for email delivery
// - Dependency Inversion: domain doesn't know about Resend
// - Error handling with custom exceptions
// - Single Responsibility: only handles email sending
```

#### 2. src/infrastructure/email/**tests**/ResendEmailService.test.ts

```typescript
// Test cases (with mocked Resend):
// - send() calls Resend API with correct params
// - Handles API errors gracefully
// - Validates email format before sending
// - Rate limiting works
```

### Phase 2: Application Layer (Use Cases)

#### 3. src/application/use-cases/SendContactMessageUseCase.ts

Contact form orchestration.

```typescript
// Requirements:
// - Accepts: IEmailService (injected - Dependency Inversion)
// - Validates input using domain value objects
// - Creates ContactMessage entity
// - Sends via IEmailService
// - Returns: Result<void, ContactError>
// - Single Responsibility: orchestrates contact flow
```

#### 4. src/application/use-cases/**tests**/SendContactMessageUseCase.test.ts

```typescript
// Test cases:
// - Valid input sends email
// - Invalid email throws validation error
// - Email service error is handled
// - ContactMessage entity is created correctly
```

### Phase 3: API Layer

#### 5. src/app/api/contact/route.ts

POST endpoint for contact form.

```typescript
// Requirements:
// - POST handler
// - Input validation with Zod schema
// - Rate limiting (by IP or fingerprint)
// - Uses SendContactMessageUseCase (Dependency Inversion)
// - Returns appropriate HTTP status codes
// - CORS headers if needed
// - Single Responsibility: HTTP handling only
```

#### 6. src/app/api/contact/**tests**/route.test.ts

```typescript
// Test cases:
// - Valid request returns 200
// - Invalid email returns 400
// - Missing fields return 400
// - Rate limit returns 429
// - Server error returns 500
```

### Phase 4: Presentation Layer

#### 7. src/presentation/components/sections/Contact/ContactForm.tsx

Form with validation.

```typescript
// Requirements:
// - Uses react-hook-form for form state
// - Zod schema for client validation
// - Fields: name, email, subject, message
// - Uses Input component from prompt 11 (DRY)
// - Uses Button component from prompt 11 (DRY)
// - Loading, success, error states
// - Accessible: labels, error messages, focus management
// - Single Responsibility: only handles form UI
```

#### 8. src/presentation/components/sections/Contact/ContactFormSchema.ts

Zod validation schema.

```typescript
// Requirements:
// - Name: required, min 2 chars
// - Email: required, valid format (uses Email value object validation)
// - Subject: required, min 5 chars
// - Message: required, min 20 chars, max 5000 chars
// - Exported for both client and server (DRY)
```

#### 9. src/presentation/components/sections/Contact/SocialLinks.tsx

Social media links.

```typescript
// Requirements:
// - Props: links: SocialLink[] (type-safe)
// - Displays: GitHub, LinkedIn, Email
// - Animated icons (hover effect)
// - Uses shared icon system
// - Accessible: proper link text
// - Single Responsibility: only renders links
```

#### 10. src/presentation/components/sections/Contact/ContactInfo.tsx

Contact information display.

```typescript
// Requirements:
// - Email address (clickable mailto:)
// - Location display
// - Availability status
// - Uses Typography from prompt 11 (DRY)
```

#### 11. src/presentation/components/sections/Contact/Contact.tsx

Container component (Composition Root).

```typescript
// Requirements:
// - Composes ContactForm, SocialLinks, ContactInfo
// - Uses Section component from prompt 12 (DRY)
// - Optional: subtle 3D background animation
// - Accessible: form landmark, proper headings
```

### Phase 5: Environment Configuration

#### 12. Environment variables

```bash
# .env.local (add to .gitignore)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=your.email@example.com

# .env.example (commit this)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_contact_email
```

#### 13. src/shared/config/env.ts

Environment validation.

```typescript
// Requirements:
// - Type-safe environment variable access
// - Validation at startup
// - Throws clear error if missing required vars
// - Single source of truth (DRY)
```

### Phase 6: Tests (TDD)

#### 14. src/presentation/components/sections/Contact/**tests**/ContactForm.test.tsx

```typescript
// Test cases:
// - Renders all form fields
// - Shows validation errors
// - Submits valid form
// - Shows loading state
// - Shows success message
// - Shows error message on failure
// - Accessibility: labels linked to inputs
```

#### 15. src/presentation/components/sections/Contact/**tests**/Contact.test.tsx

```typescript
// Test cases:
// - Renders form and social links
// - Section has proper heading
// - Accessibility: form landmark
```

### Phase 7: Git Workflow

```bash
# Commit
git add .
git commit -m "feat: implement contact section with form

- Add ResendEmailService implementing IEmailService
- Create SendContactMessageUseCase for orchestration
- Add API endpoint with validation and rate limiting
- Implement ContactForm with react-hook-form and Zod
- Add SocialLinks component
- Add comprehensive tests

Implements: DDD layers, SOLID principles, Dependency Inversion
Closes #<issue-number>"

# Create PR
git push -u origin feature/contact-section
gh pr create --title "feat: Contact section with working form" \
  --body "## Summary
- Contact form with client/server validation
- Email delivery via Resend
- Rate limiting protection
- Social media links

## Test plan
- [ ] Form validation works
- [ ] Successful submission shows message
- [ ] Email is delivered
- [ ] Rate limiting prevents spam
- [ ] All tests pass

## Environment
Requires RESEND_API_KEY and CONTACT_EMAIL env vars

Closes #<issue-number>"
```

## SOLID Principles Applied

| Principle                 | Application                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| **S**ingle Responsibility | ContactForm handles UI, UseCase handles orchestration, Service handles email |
| **O**pen/Closed           | IEmailService allows different providers                                     |
| **L**iskov Substitution   | Any IEmailService implementation works                                       |
| **I**nterface Segregation | Separate interfaces for form, validation, service                            |
| **D**ependency Inversion  | UseCase depends on IEmailService interface, not Resend directly              |

## DRY Achievements

| Repeated Pattern  | Centralized Solution           |
| ----------------- | ------------------------------ |
| Form inputs       | Reuses Input from prompt 11    |
| Buttons           | Reuses Button from prompt 11   |
| Validation schema | Shared between client/server   |
| Email validation  | Uses domain Email value object |
| Section wrapper   | Reuses Section from prompt 12  |

## Requirements

- [ ] Client and server validation
- [ ] Email delivery works
- [ ] Rate limiting prevents abuse
- [ ] 80%+ test coverage
- [ ] Accessible form
- [ ] Loading/success/error states

## Output

Working contact form that:

- Validates input on client and server
- Delivers emails reliably
- Protects against spam
- Is fully accessible and testable
