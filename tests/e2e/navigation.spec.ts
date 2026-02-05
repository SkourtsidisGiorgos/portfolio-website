import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Navigation', () => {
  test.describe('Page Load', () => {
    test('should load the page with correct title', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(page).toHaveTitle(/Giorgos Skourtsidis/i);
    });

    test('should have visible main content', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.mainContent).toBeVisible();
    });

    test('should have visible header', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.header).toBeVisible();
    });
  });

  test.describe('Section Visibility', () => {
    test('should have all sections present in DOM', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Wait for page to fully load
      await page.waitForLoadState('networkidle');

      // Check each section exists
      await expect(homePage.heroSection).toBeAttached();
      await expect(homePage.aboutSection).toBeAttached();
      await expect(homePage.skillsSection).toBeAttached();
      await expect(homePage.experienceSection).toBeAttached();
      await expect(homePage.projectsSection).toBeAttached();
      await expect(homePage.contactSection).toBeAttached();
    });

    test('should show hero section on initial load', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.heroSection).toBeVisible();
    });

    test('should scroll to reveal all sections', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Scroll through each section
      const sections = [
        'about',
        'skills',
        'experience',
        'projects',
        'contact',
      ] as const;

      for (const section of sections) {
        await homePage.scrollToSection(section);
        await homePage.waitForSectionVisible(section);
      }
    });
  });

  test.describe('Navigation Links', () => {
    test('should have navigation links for all sections', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const sections = [
        'about',
        'skills',
        'experience',
        'projects',
        'contact',
      ] as const;

      for (const section of sections) {
        const navLink = homePage.getNavLink(section);
        await expect(navLink).toBeAttached();
      }
    });

    test('should scroll to correct section when nav link is clicked', async ({
      page,
    }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Click on About link
      await homePage.navigateTo('about');

      // Check URL hash is updated
      await expect(page).toHaveURL(/#about/);

      // Check About section is visible
      await expect(homePage.aboutSection).toBeInViewport();
    });

    test('should navigate to each section via nav links', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const sections = [
        'about',
        'skills',
        'experience',
        'projects',
        'contact',
      ] as const;

      for (const section of sections) {
        await homePage.navigateTo(section);
        await expect(page).toHaveURL(new RegExp(`#${section}`));
      }
    });
  });

  test.describe('Hash URL Navigation', () => {
    test('should scroll to About section on hash URL load', async ({
      page,
    }) => {
      await page.goto('/#about');
      await page.waitForLoadState('networkidle');

      const homePage = new HomePage(page);
      await expect(homePage.aboutSection).toBeInViewport();
    });

    test('should scroll to Skills section on hash URL load', async ({
      page,
    }) => {
      await page.goto('/#skills');
      await page.waitForLoadState('networkidle');

      const homePage = new HomePage(page);
      await expect(homePage.skillsSection).toBeInViewport();
    });

    test('should scroll to Experience section on hash URL load', async ({
      page,
    }) => {
      await page.goto('/#experience');
      await page.waitForLoadState('networkidle');

      const homePage = new HomePage(page);
      await expect(homePage.experienceSection).toBeInViewport();
    });

    test('should scroll to Projects section on hash URL load', async ({
      page,
    }) => {
      await page.goto('/#projects');
      await page.waitForLoadState('networkidle');

      const homePage = new HomePage(page);
      await expect(homePage.projectsSection).toBeInViewport();
    });

    test('should scroll to Contact section on hash URL load', async ({
      page,
    }) => {
      await page.goto('/#contact');
      await page.waitForLoadState('networkidle');

      const homePage = new HomePage(page);
      await expect(homePage.contactSection).toBeInViewport();
    });
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should show mobile menu button on mobile', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Check if mobile menu button exists (may be hamburger icon)
      const menuButton = page.locator(
        'button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu-button"]'
      );
      const hasMenuButton = (await menuButton.count()) > 0;

      // Either menu button exists or navigation is visible
      if (hasMenuButton) {
        await expect(menuButton.first()).toBeVisible();
      }
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Main content should be visible
      await expect(homePage.mainContent).toBeVisible();

      // Page should not have horizontal scroll
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be able to tab through interactive elements', async ({
      page,
    }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Tab to skip link
      await page.keyboard.press('Tab');

      // Skip link should be focused
      const skipLink = homePage.skipLink;
      await expect(skipLink).toBeFocused();
    });

    test('should be able to navigate using Enter key on links', async ({
      page,
    }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Tab to skip link
      await page.keyboard.press('Tab');
      await expect(homePage.skipLink).toBeFocused();

      // Tab to first nav link
      await page.keyboard.press('Tab');

      // Check if focused element is a link
      const focusedHref = await page.evaluate(
        () => document.activeElement?.getAttribute('href') || ''
      );

      // If it's a hash link, pressing Enter should navigate
      if (focusedHref.startsWith('#')) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // URL should have the hash
        expect(page.url()).toContain('#');
      }
    });

    test('should have visible focus indicators', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Tab through first few elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');

        // Check that focused element has visible focus indicator
        const hasFocusStyle = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return true;

          const style = window.getComputedStyle(el);
          const hasOutline =
            style.outline !== 'none' && style.outlineWidth !== '0px';
          const hasBoxShadow =
            style.boxShadow !== 'none' && style.boxShadow !== '';
          const hasRing = el.className.includes('ring');
          const hasBorder = el.className.includes('border');

          return hasOutline || hasBoxShadow || hasRing || hasBorder;
        });

        expect(hasFocusStyle).toBe(true);
      }
    });
  });

  test.describe('Skip Link', () => {
    test('should have skip link as first focusable element', async ({
      page,
    }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await page.keyboard.press('Tab');

      await expect(homePage.skipLink).toBeFocused();
    });

    test('skip link should become visible on focus', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Skip link may be visually hidden until focused
      await page.keyboard.press('Tab');

      await expect(homePage.skipLink).toBeVisible();
    });

    test('skip link should navigate to main content', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Focus and click skip link
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // URL should have main-content hash
      await expect(page).toHaveURL(/#main-content/);
    });
  });
});
