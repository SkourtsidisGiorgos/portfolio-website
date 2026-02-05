import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Home Page.
 * Encapsulates selectors and actions for the main portfolio page.
 */
export class HomePage {
  readonly page: Page;

  // Header selectors
  readonly header: Locator;
  readonly logo: Locator;
  readonly navLinks: Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;

  // Section selectors
  readonly heroSection: Locator;
  readonly aboutSection: Locator;
  readonly skillsSection: Locator;
  readonly experienceSection: Locator;
  readonly projectsSection: Locator;
  readonly contactSection: Locator;

  // Skip link
  readonly skipLink: Locator;

  // Main content
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.header = page.locator('header').first();
    this.logo = page.locator('header a[href="/"]').first();
    this.navLinks = page.locator('nav a');
    this.mobileMenuButton = page.locator(
      'button[aria-label*="menu"], button[aria-expanded]'
    );
    this.mobileMenu = page.locator('[role="menu"], nav[aria-label*="mobile"]');

    // Sections
    this.heroSection = page.locator('#hero, section:has(h1)').first();
    this.aboutSection = page.locator('#about');
    this.skillsSection = page.locator('#skills');
    this.experienceSection = page.locator('#experience');
    this.projectsSection = page.locator('#projects');
    this.contactSection = page.locator('#contact');

    // Accessibility
    this.skipLink = page.locator('a[href="#main-content"]');
    this.mainContent = page.locator('#main-content, main').first();
  }

  /**
   * Navigate to the home page.
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to a specific section by clicking its nav link.
   */
  async navigateTo(
    section: 'about' | 'skills' | 'experience' | 'projects' | 'contact'
  ) {
    const navLink = this.page.locator(`nav a[href="#${section}"]`).first();
    await navLink.click();
    await this.page.waitForTimeout(500); // Allow scroll animation
  }

  /**
   * Wait for a section to be visible in the viewport.
   */
  async waitForSectionVisible(
    section: 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'contact'
  ) {
    const sectionLocator = this.getSectionLocator(section);
    await sectionLocator.waitFor({ state: 'visible' });
  }

  /**
   * Scroll to a specific section.
   */
  async scrollToSection(
    section: 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'contact'
  ) {
    const sectionLocator = this.getSectionLocator(section);
    await sectionLocator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300); // Allow scroll to settle
  }

  /**
   * Get the nav link for a specific section.
   */
  getNavLink(
    section: 'about' | 'skills' | 'experience' | 'projects' | 'contact'
  ): Locator {
    return this.page.locator(`nav a[href="#${section}"]`).first();
  }

  /**
   * Get the locator for a specific section.
   */
  private getSectionLocator(
    section: 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'contact'
  ): Locator {
    switch (section) {
      case 'hero':
        return this.heroSection;
      case 'about':
        return this.aboutSection;
      case 'skills':
        return this.skillsSection;
      case 'experience':
        return this.experienceSection;
      case 'projects':
        return this.projectsSection;
      case 'contact':
        return this.contactSection;
    }
  }

  /**
   * Open mobile menu (on mobile viewport).
   */
  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await this.page.waitForTimeout(300); // Allow animation
  }

  /**
   * Close mobile menu.
   */
  async closeMobileMenu() {
    // Click outside or press Escape
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if the page has loaded correctly.
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.mainContent.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all visible section IDs.
   */
  async getVisibleSections(): Promise<string[]> {
    const sections = [
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'contact',
    ];
    const visible: string[] = [];

    for (const section of sections) {
      const locator = this.getSectionLocator(
        section as
          | 'hero'
          | 'about'
          | 'skills'
          | 'experience'
          | 'projects'
          | 'contact'
      );
      if (await locator.isVisible()) {
        visible.push(section);
      }
    }

    return visible;
  }

  /**
   * Use skip link to navigate to main content.
   */
  async useSkipLink() {
    await this.skipLink.focus();
    await this.skipLink.click();
  }
}
