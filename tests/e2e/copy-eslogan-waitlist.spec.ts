import { test, expect } from '@playwright/test';

/**
 * Lote de cambios del cliente sobre el eslogan y la lista de espera online.
 *
 * El eslogan es solo la primera línea del h1: la segunda va dentro del mismo
 * encabezado pero a un tamaño menor, así que la prueba compara font-size
 * computados en vez de fiarse de las clases.
 */

const HOMES = [
  { lang: 'es', path: '/', slogan: 'Regeneremos la vida del suelo' },
  { lang: 'en', path: '/en', slogan: 'bring soil back to life' },
  { lang: 'fr', path: '/fr', slogan: 'Régénérons la vie du sol' },
];

const fontSize = (locator: import('@playwright/test').Locator) =>
  locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

test.describe('Eslogan del hero', () => {
  for (const { lang, path, slogan } of HOMES) {
    test(`[${lang}] la segunda línea es más pequeña que el eslogan`, async ({ page }) => {
      await page.goto(path);

      const h1 = page.locator('main h1.hero-title');
      const sub = h1.locator('span');

      await expect(h1).toContainText(slogan);
      await expect(sub).toBeVisible();

      const [sizeH1, sizeSub] = await Promise.all([fontSize(h1), fontSize(sub)]);
      expect(sizeSub).toBeLessThan(sizeH1);
    });
  }
});

test.describe('Lista de espera de la edición online', () => {
  test('[es] la home destaca «edición 100% online de Suelos Vivos»', async ({ page }) => {
    await page.goto('/');

    const desc = page.locator('.waitlist-banner p').first();
    await expect(desc).toContainText('próxima');

    const destacado = desc.locator('strong');
    await expect(destacado).toHaveText('edición 100% online de Suelos Vivos');
  });

  test('[es] /el-programa destaca la misma frase', async ({ page }) => {
    await page.goto('/el-programa');

    const destacado = page.locator('.program-banner strong').first();
    await expect(destacado).toHaveText('edición 100% online de Suelos Vivos');
  });

  test('[en] y [fr] también lo destacan', async ({ page }) => {
    for (const path of ['/en', '/fr']) {
      await page.goto(path);
      await expect(page.locator('.waitlist-banner p strong').first()).toBeVisible();
    }
  });
});
