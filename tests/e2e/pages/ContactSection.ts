import type { Page, Locator } from '@playwright/test';

/**
 * Contact form data interface.
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Page Object Model for the Contact Section.
 * Encapsulates selectors and actions for the contact form.
 */
export class ContactSection {
  readonly page: Page;

  // Section
  readonly section: Locator;

  // Form elements
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  // Error messages
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly subjectError: Locator;
  readonly messageError: Locator;

  // Status messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;

    // Section
    this.section = page.locator('#contact');

    // Form
    this.form = page.locator('#contact form, form[data-testid="contact-form"]');

    // Input fields - use multiple selectors for flexibility
    this.nameInput = page.locator(
      'input[name="name"], input[id="name"], #contact input[type="text"]:first-of-type'
    );
    this.emailInput = page.locator(
      'input[name="email"], input[id="email"], input[type="email"]'
    );
    this.subjectInput = page.locator(
      'input[name="subject"], input[id="subject"]'
    );
    this.messageInput = page.locator(
      'textarea[name="message"], textarea[id="message"], textarea'
    );
    this.submitButton = page.locator(
      '#contact button[type="submit"], form button[type="submit"]'
    );

    // Error messages (commonly shown below inputs)
    this.nameError = page.locator(
      '[id*="name"][id*="error"], [data-error="name"]'
    );
    this.emailError = page.locator(
      '[id*="email"][id*="error"], [data-error="email"]'
    );
    this.subjectError = page.locator(
      '[id*="subject"][id*="error"], [data-error="subject"]'
    );
    this.messageError = page.locator(
      '[id*="message"][id*="error"], [data-error="message"]'
    );

    // Status messages
    this.successMessage = page.locator(
      '[role="alert"]:has-text("success"), [data-testid="success-message"], .success-message'
    );
    this.errorMessage = page.locator(
      '[role="alert"]:has-text("error"), [data-testid="error-message"], .error-message'
    );
    this.loadingIndicator = page.locator(
      'button[type="submit"][disabled], [data-loading="true"], .loading'
    );
  }

  /**
   * Scroll the contact section into view.
   */
  async scrollIntoView() {
    await this.section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
  }

  /**
   * Fill the contact form with provided data.
   */
  async fillForm(data: Partial<ContactFormData>) {
    if (data.name !== undefined) {
      await this.nameInput.fill(data.name);
    }
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.subject !== undefined) {
      await this.subjectInput.fill(data.subject);
    }
    if (data.message !== undefined) {
      await this.messageInput.fill(data.message);
    }
  }

  /**
   * Submit the contact form.
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Fill and submit the form in one action.
   */
  async submitForm(data: ContactFormData) {
    await this.fillForm(data);
    await this.submit();
  }

  /**
   * Clear all form fields.
   */
  async clearForm() {
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.subjectInput.clear();
    await this.messageInput.clear();
  }

  /**
   * Check if form has validation errors visible.
   */
  async hasValidationErrors(): Promise<boolean> {
    const errors = this.page.locator(
      '[role="alert"], [class*="error"], [id*="error"]'
    );
    return (await errors.count()) > 0;
  }

  /**
   * Get all visible error messages.
   */
  async getErrorMessages(): Promise<string[]> {
    const errors = this.page.locator(
      '#contact [role="alert"], #contact [class*="error"]:not(input):not(textarea)'
    );
    return errors.allTextContents();
  }

  /**
   * Wait for form submission to complete (loading state to end).
   */
  async waitForSubmissionComplete(timeout = 10000) {
    // Wait for either success or error message
    await this.page.waitForSelector(
      '[role="alert"], [data-testid="success-message"], [data-testid="error-message"]',
      { timeout }
    );
  }

  /**
   * Check if the form is in loading state.
   */
  async isLoading(): Promise<boolean> {
    const button = this.submitButton;
    const isDisabled = await button.isDisabled();
    const hasLoadingText = (await button.textContent())?.includes('Sending');
    return isDisabled || !!hasLoadingText;
  }

  /**
   * Check if submission was successful.
   */
  async isSubmissionSuccessful(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if there's a submission error.
   */
  async hasSubmissionError(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get a valid form data object for testing.
   */
  static getValidFormData(): ContactFormData {
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Test Inquiry',
      message:
        'This is a test message that is long enough to pass validation. It contains multiple sentences to ensure the message length requirement is met.',
    };
  }

  /**
   * Get form data with an invalid email for testing.
   */
  static getInvalidEmailFormData(): ContactFormData {
    return {
      name: 'John Doe',
      email: 'invalid-email',
      subject: 'Test Subject',
      message:
        'This is a test message that should be long enough for validation.',
    };
  }
}
