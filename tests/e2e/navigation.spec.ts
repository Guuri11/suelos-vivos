import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Suelos Vivos/);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="/contacto"]').first()).toBeVisible();
  });

  test('el-programa page loads', async ({ page }) => {
    await page.goto('/el-programa');
    await expect(page).toHaveTitle(/El Programa/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('quienes-somos page loads', async ({ page }) => {
    await page.goto('/quienes-somos');
    await expect(page).toHaveTitle(/Quiénes Somos/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contacto page loads with form', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page).toHaveTitle(/Reservar plaza/);
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('aviso-legal page loads', async ({ page }) => {
    await page.goto('/aviso-legal');
    await expect(page).toHaveTitle(/Aviso Legal/);
  });

  test('politica-privacidad page loads', async ({ page }) => {
    await page.goto('/politica-privacidad');
    await expect(page).toHaveTitle(/Política de Privacidad/);
  });

  test('header navigation links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/el-programa"]')).toBeVisible();
    await expect(page.locator('nav a[href="/quienes-somos"]')).toBeVisible();
    await expect(page.locator('nav a[href="/contacto"]').first()).toBeVisible();
  });

  test('footer is present with links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer a[href="/aviso-legal"]')).toBeVisible();
    await expect(page.locator('footer a[href="/politica-privacidad"]')).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const toggle = page.locator('#menu-toggle');
    const mobileMenu = page.locator('#mobile-menu');

    await expect(mobileMenu).toBeHidden();
    await toggle.click();
    await expect(mobileMenu).toBeVisible();
    await toggle.click();
    await expect(mobileMenu).toBeHidden();
  });

  test('contact form fields are interactive', async ({ page }) => {
    await page.goto('/contacto');

    await page.fill('input[name="name"]', 'Juan García');
    await page.fill('input[name="email"]', 'juan@ejemplo.com');
    await page.fill('input[name="phone"]', '+34 600 000 000');
    await page.fill('textarea[name="message"]', 'Olivar 20ha Alicante, buscamos reducir insumos.');

    await expect(page.locator('input[name="name"]')).toHaveValue('Juan García');
    await expect(page.locator('input[name="email"]')).toHaveValue('juan@ejemplo.com');
  });
});
