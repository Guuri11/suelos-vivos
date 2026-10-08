import { test, expect, type Page } from '@playwright/test';

/**
 * El píxel de Meta solo puede cargarse con consentimiento (LSSI art. 22.2).
 * Ninguna petición sale de verdad hacia Meta: todas se interceptan y se
 * contestan con un script vacío, y aquí solo se cuentan.
 */
async function interceptMeta(page: Page) {
  const requests: string[] = [];
  await page.route(/facebook\.(net|com)/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return requests;
}

const banner = (page: Page) => page.getByRole('region', { name: 'Aviso de cookies' });

test.describe('Aviso de cookies', () => {
  test('sin elegir, se ve el aviso y no se carga nada de Meta', async ({ page }) => {
    const requests = await interceptMeta(page);
    await page.goto('/');
    await expect(banner(page)).toBeVisible();
    await page.goto('/el-programa');
    await expect(banner(page)).toBeVisible();
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => 'fbq' in window)).toBe(false);
  });

  test('rechazar oculta el aviso, no carga el píxel y se recuerda', async ({ page }) => {
    const requests = await interceptMeta(page);
    await page.goto('/');
    await banner(page).getByRole('button', { name: 'Rechazar' }).click();
    await expect(banner(page)).toBeHidden();
    await page.goto('/contacto');
    await expect(banner(page)).toBeHidden();
    expect(requests).toEqual([]);
  });

  test('aceptar carga el píxel y lo mantiene en la siguiente página', async ({ page }) => {
    const requests = await interceptMeta(page);
    await page.goto('/');
    await banner(page).getByRole('button', { name: 'Aceptar' }).click();
    await expect(banner(page)).toBeHidden();
    await expect.poll(() => requests.some((u) => u.includes('fbevents.js'))).toBe(true);

    requests.length = 0;
    await page.goto('/el-programa');
    await expect(banner(page)).toBeHidden();
    await expect.poll(() => requests.some((u) => u.includes('fbevents.js'))).toBe(true);
  });

  test('los dos botones pesan lo mismo', async ({ page }) => {
    await page.goto('/');
    const reject = banner(page).getByRole('button', { name: 'Rechazar' });
    const accept = banner(page).getByRole('button', { name: 'Aceptar' });
    expect(await reject.getAttribute('class')).toBe(await accept.getAttribute('class'));
  });

  test('desde el pie se reabre y se puede retirar el consentimiento', async ({ page }) => {
    const requests = await interceptMeta(page);
    await page.goto('/');
    await banner(page).getByRole('button', { name: 'Aceptar' }).click();
    await page.context().addCookies([{ name: '_fbp', value: 'fb.1.test', url: page.url() }]);

    await page.getByRole('contentinfo').getByRole('button', { name: 'Configurar cookies' }).click();
    await expect(banner(page)).toBeVisible();
    await Promise.all([
      page.waitForEvent('load'),
      banner(page).getByRole('button', { name: 'Rechazar' }).click(),
    ]);

    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === '_fbp')).toBeUndefined();
    requests.length = 0;
    await page.goto('/contacto');
    expect(requests).toEqual([]);
  });

  test('sale en el idioma de la página y enlaza a su política de cookies', async ({ page }) => {
    await page.goto('/en/');
    const en = page.getByRole('region', { name: 'Cookie notice' });
    await expect(en.getByRole('button', { name: 'Accept' })).toBeVisible();
    await expect(en.getByRole('link')).toHaveAttribute('href', '/en/politica-cookies');

    await page.goto('/fr/');
    await expect(page.getByRole('region', { name: 'Avis sur les cookies' })).toBeVisible();
  });

  test('la política de cookies carga en los tres idiomas', async ({ page }) => {
    for (const [path, title] of [
      ['/politica-cookies', 'Política de Cookies'],
      ['/en/politica-cookies', 'Cookie Policy'],
      ['/fr/politica-cookies', 'Politique de cookies'],
    ]) {
      await page.goto(path);
      await expect(page.locator('main h1')).toHaveText(title);
      await expect(page.locator('main table')).toContainText('_fbp');
    }
  });
});
