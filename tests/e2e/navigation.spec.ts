import { test, expect } from '@playwright/test';

/**
 * En móvil la nav de la cabecera es `hidden md:flex`: sus enlaces existen pero están
 * ocultos a propósito. Los equivalentes viven en #mobile-menu, tras el hamburger.
 */
async function openNavIfMobile(page: import('@playwright/test').Page) {
  const desktopNav = page.locator('header nav > ul').first();
  if (!(await desktopNav.isVisible())) {
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
  }
}

test.describe('Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Suelos Vivos/);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main .hero-actions a[href="/el-programa"]')).toBeVisible();
    await expect(page.locator('main .hero-actions a[href="/servicios"]')).toBeVisible();
  });

  test('el-programa page loads', async ({ page }) => {
    await page.goto('/el-programa');
    await expect(page).toHaveTitle(/El Programa/);
    await expect(page.locator('main h1')).toBeVisible();
  });

  test('quienes-somos page loads', async ({ page }) => {
    await page.goto('/quienes-somos');
    await expect(page).toHaveTitle(/Quiénes Somos/);
    await expect(page.locator('main h1')).toBeVisible();
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
    await openNavIfMobile(page);
    await expect(page.locator('header a[href="/el-programa"]:visible').first()).toBeVisible();
    await expect(page.locator('header a[href="/quienes-somos"]:visible').first()).toBeVisible();
    await expect(page.locator('header a[href="/contacto"]:visible').first()).toBeVisible();
  });

  // /en/ y /fr/ sirvieron 200 durante meses sin un solo enlace que llevara a ellas.
  // Estos dos tests son la red que impide que vuelva a pasar.
  test('language switcher links to /en and /fr from the home', async ({ page }) => {
    await page.goto('/');
    await openNavIfMobile(page);
    await expect(page.locator('header a[hreflang="en"]:visible').first()).toHaveAttribute('href', '/en');
    await expect(page.locator('header a[hreflang="fr"]:visible').first()).toHaveAttribute('href', '/fr');
  });

  test('language switcher keeps the current page', async ({ page }) => {
    await page.goto('/el-programa');
    await openNavIfMobile(page);
    await page.locator('header a[hreflang="en"]:visible').first().click();
    await expect(page).toHaveURL(/\/en\/el-programa$/);
    await expect(page.locator('main h1')).toBeVisible();
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

  // La ficha del formador y el CTA doble entraron con el copy de septiembre de 2026.
  // El nombre no se traduce, asi que sirve de sonda en los tres idiomas.
  test('quienes-somos shows the trainer profile', async ({ page }) => {
    await page.goto('/quienes-somos');
    await expect(page.locator('main .trainer-section')).toContainText('Carles Pons');
    await expect(page.locator('main .trainer-section li')).toHaveCount(8);
  });

  // El logo dentro del hero lo pide el documento de copy del cliente, entre la mision y
  // el relato. Es decorativo a proposito (alt vacio, la marca ya esta en el h1), asi que
  // la sonda es la clase y no el texto alternativo.
  test('quienes-somos shows the brand mark inside the hero', async ({ page }) => {
    await page.goto('/quienes-somos');
    const logo = page.locator('main .page-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('alt', '');
    await expect(logo).toHaveAttribute('src', '/images/logo.png');
  });

  // Los dos botones del cierre llevan al programa y a la asesoria, y en /en/ y /fr/
  // tienen que quedarse dentro de su idioma en vez de tirar a la rama espanola.
  for (const prefix of ['', '/en', '/fr']) {
    test(`quienes-somos CTA targets stay in ${prefix || '/es'}`, async ({ page }) => {
      await page.goto(`${prefix}/quienes-somos`);
      await expect(page.locator('main .trainer-section')).toContainText('Carles Pons');
      await expect(page.locator(`main .page-cta a[href="${prefix}/el-programa"]`)).toBeVisible();
      await expect(page.locator(`main .page-cta a[href="${prefix}/servicios"]`)).toBeVisible();
    });
  }

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
