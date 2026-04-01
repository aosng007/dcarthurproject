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

test.describe('Our Experience section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about.html');
  });

  test('Our Experience section is present on about page', async ({ page }) => {
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.locator('#experience h2')).toHaveText('Our Experience.');
  });

  test('Our Experience section has four cards', async ({ page }) => {
    await expect(page.locator('#experience .about-card')).toHaveCount(4);
  });

  test('Our Experience cards contain correct content', async ({ page }) => {
    const cards = page.locator('#experience .about-card');
    await expect(cards.nth(0).locator('h3')).toHaveText('House Flipping');
    await expect(cards.nth(1).locator('h3')).toHaveText('Townhouse');
    await expect(cards.nth(2).locator('h3')).toHaveText('Residential Apartment');
    await expect(cards.nth(3).locator('h3')).toHaveText('Land Subdivision');
  });
});

test.describe('Hampton theme — locked as default', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('default theme is Hampton (style-hampton.css)', async ({ page }) => {
    const href = await page.locator('#theme-stylesheet').getAttribute('href');
    expect(href).toContain('hampton');
  });

  test('theme switcher button is not present in the DOM', async ({ page }) => {
    await expect(page.locator('#style-switcher-btn')).toHaveCount(0);
  });

  test('Hampton theme is active after page reload regardless of any prior localStorage value', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('dcap-theme', 'style-minimal.css'));
    await page.reload();
    const href = await page.locator('#theme-stylesheet').getAttribute('href');
    expect(href).toContain('hampton');
  });

  test('localStorage dcap-theme key is cleared by app.js on load', async ({ page }) => {
    const stored = await page.evaluate(() => localStorage.getItem('dcap-theme'));
    expect(stored).toBeNull();
  });

  test('style-hampton.css file is served and contains Hampton custom properties', async ({ page }) => {
    const response = await page.goto('/style-hampton.css');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('--bg: #F7F5F0');
    expect(body).toContain('--text: #3D6A7E');
    expect(body).toContain('--border: #D9CDC1');
  });
});
