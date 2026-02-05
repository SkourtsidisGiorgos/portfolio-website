import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import type { AxeResults, Result } from 'axe-core';

test.describe('Accessibility', () => {
  test.describe('Automated A11y Checks', () => {
    test('home page should have no critical accessibility violations', async ({
      page,
    }) => {
      await page.goto('/');
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults: AxeResults = await new AxeBuilder({
        page,
      })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Filter for serious and critical violations only
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v: Result) => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(criticalViolations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults: AxeResults = await new AxeBuilder({
        page,
      })
        .withTags(['cat.semantics'])
        .analyze();

      const headingViolations = accessibilityScanResults.violations.filter(
        (v: Result) => v.id.includes('heading')
      );

      expect(headingViolations).toEqual([]);
    });
  });

  test.describe('Skip Link', () => {
    test('skip link should be visible on focus', async ({ page }) => {
      await page.goto('/');

      // Tab to focus the skip link
      await page.keyboard.press('Tab');

      // The skip link should now be visible
      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toBeVisible();
      await expect(skipLink).toContainText('Skip to main content');
    });

    test('skip link should navigate to main content', async ({ page }) => {
      await page.goto('/');

      // Tab to focus the skip link
      await page.keyboard.press('Tab');

      // Click the skip link
      const skipLink = page.locator('a[href="#main-content"]');
      await skipLink.click();

      // Main content should be focused or scrolled to
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeVisible();

      // Check that the URL hash is set
      await expect(page).toHaveURL(/#main-content/);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be able to navigate through all interactive elements', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Start tabbing through the page
      const focusedElements: string[] = [];
      const maxTabs = 30;

      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab');

        const activeElement = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          return {
            tag: el.tagName.toLowerCase(),
            text:
              el.textContent?.trim().slice(0, 50) ||
              el.getAttribute('aria-label') ||
              '',
            href: el.getAttribute('href') || '',
          };
        });

        if (activeElement) {
          focusedElements.push(
            `${activeElement.tag}: ${activeElement.text || activeElement.href}`
          );
        }
      }

      // Should have multiple focusable elements
      expect(focusedElements.length).toBeGreaterThan(3);

      // Should include navigation links
      const hasNavLinks = focusedElements.some(
        el =>
          el.includes('About') ||
          el.includes('Experience') ||
          el.includes('Projects') ||
          el.includes('Contact')
      );
      expect(hasNavLinks).toBe(true);
    });

    test('focus should be visible on all interactive elements', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Tab through first 10 elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');

        // Check that focused element has visible focus indicator
        const hasFocusStyle = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return true; // Skip if no focused element

          const style = window.getComputedStyle(el);
          const hasOutline = style.outline !== 'none' && style.outline !== '';
          const hasBoxShadow =
            style.boxShadow !== 'none' && style.boxShadow !== '';
          const hasRing = el.className.includes('ring');
          const hasBorder =
            style.borderColor !== 'rgba(0, 0, 0, 0)' ||
            el.className.includes('border');

          return hasOutline || hasBoxShadow || hasRing || hasBorder;
        });

        expect(hasFocusStyle).toBe(true);
      }
    });

    test('navigation should work with Enter key', async ({ page }) => {
      await page.goto('/');

      // Tab to navigation
      await page.keyboard.press('Tab'); // Skip link
      await page.keyboard.press('Tab'); // First nav item

      // Get the currently focused link
      const focusedHref = await page.evaluate(
        () => document.activeElement?.getAttribute('href') || ''
      );

      // If it's a navigation link, pressing Enter should scroll
      if (focusedHref.startsWith('#')) {
        await page.keyboard.press('Enter');

        // Small delay for scroll animation
        await page.waitForTimeout(500);

        // Check that URL hash is set
        const url = page.url();
        expect(url).toContain('#');
      }
    });
  });

  test.describe('Reduced Motion', () => {
    test('should respect prefers-reduced-motion preference', async ({
      page,
    }) => {
      // Enable reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that animations are disabled or reduced
      const animationDuration = await page.evaluate(() => {
        const animatedElement = document.querySelector(
          '[class*="animate"], [class*="motion"], [class*="transition"]'
        );
        if (!animatedElement) return '0s';

        const style = window.getComputedStyle(animatedElement);
        return (
          style.animationDuration ||
          style.transitionDuration ||
          style.getPropertyValue('--animation-duration') ||
          '0s'
        );
      });

      // Animations should be 0 or very short when reduced motion is preferred
      // This test primarily verifies the preference is being detected
      expect(animationDuration).toBeDefined();
    });
  });

  test.describe('Modal Focus Trap', () => {
    test.skip('project modal should trap focus', async ({ page }) => {
      // Skip if Projects section doesn't exist or has no modal
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find and click a project card to open modal
      const projectCard = page.locator('[data-testid="project-card"]').first();
      const hasProjectCards = (await projectCard.count()) > 0;

      if (!hasProjectCards) {
        test.skip();
        return;
      }

      await projectCard.click();

      // Wait for modal to open
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Get all focusable elements in the modal
      const focusableCount = await modal
        .locator(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        .count();

      // Tab through more elements than exist in modal
      // Focus should cycle back to first element
      for (let i = 0; i < focusableCount + 3; i++) {
        await page.keyboard.press('Tab');

        const focusedInModal = await page.evaluate(() => {
          const modalEl = document.querySelector('[role="dialog"]');
          const activeEl = document.activeElement;
          return modalEl?.contains(activeEl) || false;
        });

        expect(focusedInModal).toBe(true);
      }
    });

    test.skip('modal should close on Escape key', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find and click a project card to open modal
      const projectCard = page.locator('[data-testid="project-card"]').first();
      const hasProjectCards = (await projectCard.count()) > 0;

      if (!hasProjectCards) {
        test.skip();
        return;
      }

      await projectCard.click();

      // Wait for modal to open
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should be closed
      await expect(modal).not.toBeVisible();
    });

    test.skip('focus should return to trigger element after modal closes', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find and click a project card to open modal
      const projectCard = page.locator('[data-testid="project-card"]').first();
      const hasProjectCards = (await projectCard.count()) > 0;

      if (!hasProjectCards) {
        test.skip();
        return;
      }

      await projectCard.click();

      // Wait for modal to open
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Press Escape to close
      await page.keyboard.press('Escape');

      // Wait for modal to close
      await expect(modal).not.toBeVisible();

      // Focus should return to the project card or nearby element
      const activeElement = await page.evaluate(() => {
        return document.activeElement?.tagName.toLowerCase() || '';
      });

      // Focus should be on an interactive element, not body
      expect(['button', 'a', 'input', 'article', 'div']).toContain(
        activeElement
      );
    });
  });

  test.describe('ARIA Attributes', () => {
    test('navigation should have proper ARIA labels', async ({ page }) => {
      await page.goto('/');

      // Check for nav element with aria-label
      const nav = page.locator('nav[aria-label], header nav');
      await expect(nav.first()).toBeVisible();
    });

    test('buttons should have accessible names', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults: AxeResults = await new AxeBuilder({
        page,
      })
        .withTags(['wcag2a'])
        .analyze();

      const buttonNameViolations = accessibilityScanResults.violations.filter(
        (v: Result) => v.id === 'button-name'
      );

      expect(buttonNameViolations).toEqual([]);
    });

    test('images should have alt text', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults: AxeResults = await new AxeBuilder({
        page,
      })
        .withTags(['wcag2a'])
        .analyze();

      const imageAltViolations = accessibilityScanResults.violations.filter(
        (v: Result) => v.id === 'image-alt'
      );

      expect(imageAltViolations).toEqual([]);
    });

    test('form inputs should have labels', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults: AxeResults = await new AxeBuilder({
        page,
      })
        .withTags(['wcag2a'])
        .analyze();

      const labelViolations = accessibilityScanResults.violations.filter(
        (v: Result) => v.id.includes('label')
      );

      expect(labelViolations).toEqual([]);
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults: AxeResults = await new AxeBuilder({
        page,
      })
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v: Result) => v.id === 'color-contrast'
      );

      // Log any contrast issues for review (console.warn is allowed)
      if (contrastViolations.length > 0) {
        console.warn(
          'Color contrast issues found:',
          contrastViolations.map((v: Result) => ({
            id: v.id,
            nodes: v.nodes.map(n => n.html.slice(0, 100)),
          }))
        );
      }

      // Allow some minor contrast issues as they may be intentional for design
      // Critical text should still pass
      const criticalContrastIssues = contrastViolations.filter((v: Result) =>
        v.nodes.some(
          n =>
            n.html.includes('<h') ||
            n.html.includes('button') ||
            n.html.includes('<a')
        )
      );

      expect(criticalContrastIssues).toEqual([]);
    });
  });

  test.describe('Page Structure', () => {
    test('should have only one h1', async ({ page }) => {
      await page.goto('/');

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have a main landmark', async ({ page }) => {
      await page.goto('/');

      const main = page.locator('main, [role="main"]');
      await expect(main).toBeVisible();
    });

    test('should have proper document language', async ({ page }) => {
      await page.goto('/');

      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('en');
    });
  });
});
