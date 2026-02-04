# PROMPT 19: Contact Section & Form

## Task

Create contact section with working form

## Install

```bash
npm install react-hook-form @hookform/resolvers zod
npm install resend
```

## Files to Create

### 1. src/presentation/components/sections/Contact/Contact.tsx

- Contact form
- Social links
- Email address

### 2. src/presentation/components/sections/Contact/ContactForm.tsx

- Name, email, subject, message fields
- Validation with Zod
- Submit handling
- Success/error states

### 3. src/presentation/components/sections/Contact/SocialLinks.tsx

- GitHub, LinkedIn, Email
- Animated icons

### 4. src/app/api/contact/route.ts

- POST endpoint
- Input validation
- Email sending (Resend or similar)
- Rate limiting

### 5. src/infrastructure/email/ResendEmailService.ts

- Implements IEmailService
- Sends via Resend API

### 6. Environment variables

- RESEND_API_KEY
- CONTACT_EMAIL

### 7. Tests

- Form validation
- API endpoint
- Email service (mocked)

### 8. Commit

```
feat: implement contact section with form
```

## Requirements

- Client and server validation
- Accessible form
- Update CHANGELOG.md

## Output

Working contact form with email delivery
