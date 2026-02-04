# PROMPT 24: Deployment (Production)

## GitHub Workflow

```bash
# Create feature branch
git checkout main && git pull
git checkout -b feature/deployment

# Create GitHub issue
gh issue create --title "chore: Configure production deployment" \
  --body "Set up Vercel deployment, environment variables, and monitoring"
```

## Task

Deploy to production with proper configuration, monitoring, and CI/CD.

## Deployment Architecture

```
GitHub Repository
    │
    ├── Push to main ──────► GitHub Actions
    │                              │
    │                              ├── Lint & Type Check
    │                              ├── Unit Tests
    │                              ├── Build
    │                              └── Deploy to Vercel
    │
    └── Preview (PR) ──────► Vercel Preview Deployment
                                   │
                                   └── E2E Tests (optional)
```

## Steps

### Phase 1: Vercel Setup

#### 1. Connect repository

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# This creates .vercel/project.json (gitignored)
```

#### 2. Configure vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Phase 2: Environment Variables

#### 3. Set production environment variables

```bash
# Using Vercel CLI
vercel env add RESEND_API_KEY production
vercel env add CONTACT_EMAIL production
vercel env add NEXT_PUBLIC_SITE_URL production

# Or via Vercel Dashboard:
# Project Settings → Environment Variables
```

#### 4. Create .env.example

```bash
# .env.example (commit this)
# Required for contact form
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com

# Optional
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Phase 3: GitHub Actions CI/CD

#### 5. Update .github/workflows/ci.yml

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          CONTACT_EMAIL: ${{ secrets.CONTACT_EMAIL }}

  # Vercel handles deployment automatically
  # This job is for awareness/status
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deployment status
        run: echo "Deployment triggered via Vercel GitHub integration"
```

### Phase 4: Domain Configuration (if applicable)

#### 6. Custom domain setup

```bash
# Add domain in Vercel Dashboard
# Project Settings → Domains → Add

# Configure DNS:
# - A record: 76.76.21.21
# - CNAME: cname.vercel-dns.com (for www)

# SSL is automatic via Let's Encrypt
```

### Phase 5: Monitoring & Analytics

#### 7. Enable Vercel Analytics

```bash
# In Vercel Dashboard:
# Project → Analytics → Enable

# Or programmatically:
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### 8. Enable Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### 9. Error tracking (optional)

```bash
# If using Sentry
npm install @sentry/nextjs

# Run setup wizard
npx @sentry/wizard@latest -i nextjs
```

### Phase 6: Post-Deployment Verification

#### 10. Verification checklist

```markdown
## Post-Deployment Verification

### Functionality

- [ ] Home page loads
- [ ] All sections render
- [ ] Navigation works
- [ ] Contact form submits
- [ ] Email is received
- [ ] 3D scenes render
- [ ] Mobile responsive

### Performance

- [ ] Lighthouse Performance: 90+
- [ ] Core Web Vitals green
- [ ] Images optimized
- [ ] 3D performs well

### SEO

- [ ] Meta tags correct
- [ ] Open Graph works (test with social debuggers)
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] Robots.txt accessible (/robots.txt)

### Security

- [ ] HTTPS working
- [ ] Security headers present
- [ ] No sensitive data exposed
```

#### 11. Run production tests

```bash
# Test against production URL
PLAYWRIGHT_BASE_URL=https://your-domain.com npm run test:e2e
```

### Phase 7: Git Workflow

#### 12. Commit deployment configuration

```bash
git add .
git commit -m "chore: configure production deployment

- Add vercel.json with security headers
- Update GitHub Actions for CI/CD
- Add Vercel Analytics and Speed Insights
- Add environment variable documentation
- Add post-deployment verification checklist

Deployment: Vercel with GitHub integration
Closes #<issue-number>"
```

#### 13. Create PR

```bash
git push -u origin feature/deployment
gh pr create --title "chore: Configure production deployment" \
  --body "## Summary
- Vercel deployment configuration
- GitHub Actions CI/CD pipeline
- Analytics and monitoring
- Environment variable setup

## Deployment Checklist
- [ ] Vercel project linked
- [ ] Environment variables set
- [ ] Domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Post-deployment verified

## Production URL
https://your-domain.com (or Vercel URL)

Closes #<issue-number>"
```

### Phase 8: Final Deployment

#### 14. Merge and deploy

```bash
# After PR approval
# Merge via GitHub UI or:
gh pr merge --squash

# Verify deployment
# Check Vercel dashboard for deployment status
```

#### 15. Verify production

```bash
# Check all systems
curl -I https://your-domain.com
# Should return 200

# Run Lighthouse on production
npx lighthouse https://your-domain.com --output html

# Check security headers
curl -I https://your-domain.com | grep -E "^(X-|Content-Security)"
```

### Phase 9: Documentation Update

#### 16. Update README with production link

```markdown
## 🌐 Live Demo

[View Live Site](https://your-domain.com)
```

#### 17. Create deployment documentation

````markdown
# DEPLOYMENT.md

## Production Deployment

### Platform

- Vercel (automatic via GitHub integration)

### Environment Variables

| Variable             | Description                    | Required |
| -------------------- | ------------------------------ | -------- |
| RESEND_API_KEY       | Resend API key for emails      | Yes      |
| CONTACT_EMAIL        | Email to receive contact forms | Yes      |
| NEXT_PUBLIC_SITE_URL | Production URL                 | No       |

### CI/CD

- Push to main triggers deployment
- PRs create preview deployments

### Monitoring

- Vercel Analytics
- Vercel Speed Insights

### Rollback

```bash
vercel rollback
```
````

```

## Requirements

- [ ] Vercel project configured
- [ ] Environment variables set
- [ ] CI/CD pipeline working
- [ ] Analytics enabled
- [ ] Custom domain (optional)
- [ ] SSL working
- [ ] Security headers present
- [ ] All verification checks passed

## Output

Live portfolio website that:
- Deploys automatically on push to main
- Has preview deployments for PRs
- Is properly monitored
- Has zero downtime deployments
```
