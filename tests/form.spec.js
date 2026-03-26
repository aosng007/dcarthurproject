// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation links', () => {
  test('home page loads and nav links are present', async ({ page }) => {
    await page.goto('/');

    // Logo / home link
    await expect(page.locator('nav .nav-logo')).toBeVisible();

    // Primary nav links
    await expect(page.locator('nav a[href="about.html"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="services.html"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="contact.html"]').first()).toBeVisible();
  });

  test('About page loads', async ({ page }) => {
    await page.goto('/about.html');
    await expect(page).toHaveTitle(/DC Arthur/i);
  });

  test('Services page loads', async ({ page }) => {
    await page.goto('/services.html');
    await expect(page).toHaveTitle(/DC Arthur/i);
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contact.html');
    await expect(page).toHaveTitle(/DC Arthur/i);
  });
});

test.describe('Contact form (Formspree)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html');
  });

  test('contact form is visible with required fields', async ({ page }) => {
    const form = page.locator('form#contact-form');
    await expect(form).toBeVisible();

    await expect(page.locator('input#firstname')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('button#form-submit-btn')).toBeVisible();
  });

  test('form points to Formspree endpoint', async ({ page }) => {
    const action = await page.locator('form#contact-form').getAttribute('action');
    expect(action).toBe('https://formspree.io/f/mnjgewba');
  });

  test('form has honeypot spam-guard field hidden from users', async ({ page }) => {
    const honeypot = page.locator('input[name="_gotcha"]');
    await expect(honeypot).toHaveCount(1);
    // The field must not be visible to real users
    await expect(honeypot).toBeHidden();
  });

  test('required fields show validation when form submitted empty', async ({ page }) => {
    await page.locator('button#form-submit-btn').click();
    // Browser native validation keeps the page on the contact form
    await expect(page.locator('form#contact-form')).toBeVisible();
  });

  test('can fill in contact form fields', async ({ page }) => {
    await page.fill('input#firstname', 'Jane');
    await page.fill('input#email', 'jane@example.com');
    await page.fill('input#phone', '0400000000');
    await page.selectOption('select#project_type', 'Residential — new build');
    await page.fill('textarea#message', 'Test enquiry from Playwright E2E.');

    await expect(page.locator('input#firstname')).toHaveValue('Jane');
    await expect(page.locator('input#email')).toHaveValue('jane@example.com');
  });
});
