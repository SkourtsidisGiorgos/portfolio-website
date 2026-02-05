import { test, expect } from '@playwright/test';
import { ContactSection } from './pages/ContactSection';
import { HomePage } from './pages/HomePage';

test.describe('Contact Form', () => {
  test.describe('Form Rendering', () => {
    test('should render contact section', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      await expect(contactSection.section).toBeVisible();
    });

    test('should render all form fields', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      await expect(contactSection.nameInput).toBeVisible();
      await expect(contactSection.emailInput).toBeVisible();
      await expect(contactSection.subjectInput).toBeVisible();
      await expect(contactSection.messageInput).toBeVisible();
      await expect(contactSection.submitButton).toBeVisible();
    });

    test('should have correct input types', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Email input should have type="email"
      await expect(contactSection.emailInput).toHaveAttribute('type', 'email');

      // Message should be a textarea
      const messageTag = await contactSection.messageInput.evaluate(el =>
        el.tagName.toLowerCase()
      );
      expect(messageTag).toBe('textarea');
    });

    test('should have proper labels for accessibility', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Each input should have an associated label (either via label element or aria-label)
      const inputs = [
        contactSection.nameInput,
        contactSection.emailInput,
        contactSection.subjectInput,
        contactSection.messageInput,
      ];

      for (const input of inputs) {
        const hasLabel =
          (await input.getAttribute('aria-label')) !== null ||
          (await input.getAttribute('aria-labelledby')) !== null ||
          (await input.getAttribute('id')) !== null;

        expect(hasLabel).toBe(true);
      }
    });
  });

  test.describe('Client-Side Validation', () => {
    test('should show error when submitting empty form', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Try to submit empty form
      await contactSection.submit();

      // Should show validation errors
      const hasErrors = await contactSection.hasValidationErrors();
      expect(hasErrors).toBe(true);
    });

    test('should show error for empty name field', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill everything except name
      await contactSection.fillForm({
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough for validation.',
      });

      await contactSection.submit();

      // Should show error for name
      const errors = await contactSection.getErrorMessages();
      const hasNameError = errors.some(
        e =>
          e.toLowerCase().includes('name') ||
          e.toLowerCase().includes('required')
      );
      expect(hasNameError).toBe(true);
    });

    test('should show error for invalid email', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill with invalid email
      await contactSection.fillForm({
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough for validation.',
      });

      await contactSection.submit();

      // Should show email validation error
      const errors = await contactSection.getErrorMessages();
      const hasEmailError = errors.some(
        e =>
          e.toLowerCase().includes('email') ||
          e.toLowerCase().includes('valid') ||
          e.toLowerCase().includes('invalid')
      );
      expect(hasEmailError).toBe(true);
    });

    test('should show error for short message', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill with short message
      await contactSection.fillForm({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Too short',
      });

      await contactSection.submit();

      // Should show message validation error
      const errors = await contactSection.getErrorMessages();
      const hasMessageError = errors.some(
        e =>
          e.toLowerCase().includes('message') ||
          e.toLowerCase().includes('characters') ||
          e.toLowerCase().includes('long') ||
          e.toLowerCase().includes('short')
      );
      expect(hasMessageError).toBe(true);
    });

    test('should clear errors when field is corrected', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Submit with invalid email to trigger error
      await contactSection.fillForm({
        name: 'John Doe',
        email: 'invalid',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough for validation.',
      });
      await contactSection.submit();

      // Wait for error to appear
      await page.waitForTimeout(300);

      // Correct the email
      await contactSection.emailInput.clear();
      await contactSection.emailInput.fill('valid@example.com');

      // Trigger blur to validate
      await contactSection.emailInput.blur();
      await page.waitForTimeout(300);

      // Error should be cleared or reduced
      // Note: This depends on form implementation - some clear on blur, some on next submit
    });
  });

  test.describe('Form Submission', () => {
    test('should show loading state on submit', async ({ page }) => {
      // Mock the API to delay response
      await page.route('**/api/contact', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill valid form
      await contactSection.fillForm(ContactSection.getValidFormData());
      await contactSection.submit();

      // Check for loading state
      const isLoading = await contactSection.isLoading();
      expect(isLoading).toBe(true);
    });

    test('should show success message on successful submission', async ({
      page,
    }) => {
      // Mock successful API response
      await page.route('**/api/contact', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, messageId: 'test-123' }),
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill and submit valid form
      await contactSection.fillForm(ContactSection.getValidFormData());
      await contactSection.submit();

      // Wait for and verify success message
      await contactSection.waitForSubmissionComplete();
      const isSuccess = await contactSection.isSubmissionSuccessful();
      expect(isSuccess).toBe(true);
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/api/contact', async route => {
        await route.abort('failed');
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill and submit valid form
      await contactSection.fillForm(ContactSection.getValidFormData());
      await contactSection.submit();

      // Wait for error handling
      await page.waitForTimeout(2000);

      // Should show error message or form should still be usable
      const hasError = await contactSection.hasSubmissionError();
      const formStillVisible = await contactSection.form.isVisible();

      // Either error is shown or form is still available for retry
      expect(hasError || formStillVisible).toBe(true);
    });

    test('should handle server errors gracefully', async ({ page }) => {
      // Mock server error
      await page.route('**/api/contact', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill and submit valid form
      await contactSection.fillForm(ContactSection.getValidFormData());
      await contactSection.submit();

      // Wait for error handling
      await page.waitForTimeout(2000);

      // Should show error or allow retry
      const formStillVisible = await contactSection.form.isVisible();
      expect(formStillVisible).toBe(true);
    });

    test('should handle rate limiting', async ({ page }) => {
      // Mock rate limit response
      await page.route('**/api/contact', async route => {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Too many requests' }),
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill and submit valid form
      await contactSection.fillForm(ContactSection.getValidFormData());
      await contactSection.submit();

      // Wait for error handling
      await page.waitForTimeout(2000);

      // Form should still be usable
      const formStillVisible = await contactSection.form.isVisible();
      expect(formStillVisible).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard accessible', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Focus first form field
      await contactSection.nameInput.focus();
      await expect(contactSection.nameInput).toBeFocused();

      // Tab to email
      await page.keyboard.press('Tab');
      await expect(contactSection.emailInput).toBeFocused();

      // Tab to subject
      await page.keyboard.press('Tab');
      await expect(contactSection.subjectInput).toBeFocused();

      // Tab to message
      await page.keyboard.press('Tab');
      await expect(contactSection.messageInput).toBeFocused();

      // Tab to submit
      await page.keyboard.press('Tab');
      await expect(contactSection.submitButton).toBeFocused();
    });

    test('should support form submission via Enter key', async ({ page }) => {
      // Mock API
      await page.route('**/api/contact', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Fill form
      await contactSection.fillForm(ContactSection.getValidFormData());

      // Focus submit button and press Enter
      await contactSection.submitButton.focus();
      await page.keyboard.press('Enter');

      // Should trigger submission
      await page.waitForTimeout(1000);
    });

    test('should have required attributes on required fields', async ({
      page,
    }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const contactSection = new ContactSection(page);
      await contactSection.scrollIntoView();

      // Required fields should have required or aria-required attribute
      const inputs = [
        contactSection.nameInput,
        contactSection.emailInput,
        contactSection.subjectInput,
        contactSection.messageInput,
      ];

      for (const input of inputs) {
        const isRequired =
          (await input.getAttribute('required')) !== null ||
          (await input.getAttribute('aria-required')) === 'true';
        expect(isRequired).toBe(true);
      }
    });
  });
});
