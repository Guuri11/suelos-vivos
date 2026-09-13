import { test, expect } from '@playwright/test';

/**
 * Las preguntas frecuentes viven en dos sitios: las 21 completas en
 * /preguntas-frecuentes y un extracto de tres en /el-programa. Ambos salen de
 * `src/i18n/{es,en,fr}.json`, así que una clave a medias se publica en los tres
 * idiomas a la vez: eso es exactamente lo que pasó con «TODO: TBF», que estuvo
 * vivo en /el-programa hasta el 13/09/2026.
 */

const LANGS = [
  { lang: 'es', prefix: '' },
  { lang: 'en', prefix: '/en' },
  { lang: 'fr', prefix: '/fr' },
];

/**
 * Marcadores de «esto lo relleno luego» que no pueden llegar a producción.
 * Distingue mayúsculas a propósito: «todo» es una palabra corriente en español
 * («saberlo todo», «toda la información») y con /i la mitad de las respuestas
 * dan un falso positivo.
 */
const PLACEHOLDER = /\b(TODO|TBD|TBF|FIXME|XXX)\b/;
const LOREM = /lorem ipsum/i;

test.describe('Preguntas frecuentes', () => {
  for (const { lang, prefix } of LANGS) {
    test(`[${lang}] la página lista las 21 preguntas`, async ({ page }) => {
      await page.goto(`${prefix}/preguntas-frecuentes`);

      await expect(page.locator('.faq-item')).toHaveCount(21);
      await expect(page.locator('[data-group]')).toHaveCount(5);
    });

    test(`[${lang}] las 21 preguntas van al JSON-LD de FAQPage`, async ({ page }) => {
      await page.goto(`${prefix}/preguntas-frecuentes`);

      const raw = await page.locator('script[type="application/ld+json"]').last().textContent();
      const schema = JSON.parse(raw ?? '{}');

      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(21);
      for (const entry of schema.mainEntity) {
        expect(entry.name.trim()).not.toBe('');
        expect(entry.acceptedAnswer.text.trim()).not.toBe('');
      }
    });

    test(`[${lang}] ninguna respuesta se ha quedado a medias`, async ({ page }) => {
      for (const path of [`${prefix}/preguntas-frecuentes`, `${prefix}/el-programa`]) {
        await page.goto(path);
        const texto = await page.locator('main').innerText();
        expect(texto, `marcador de relleno en ${path}`).not.toMatch(PLACEHOLDER);
        expect(texto, `texto de relleno en ${path}`).not.toMatch(LOREM);
      }
    });

    test(`[${lang}] el extracto de /el-programa enlaza a la página completa`, async ({ page }) => {
      await page.goto(`${prefix}/el-programa`);

      await expect(page.locator('.faq-item')).toHaveCount(3);
      await expect(
        page.locator(`main a[href="${prefix}/preguntas-frecuentes"]`).first(),
      ).toBeVisible();
    });
  }

  test('[es] el buscador filtra y deja una sola pregunta', async ({ page }) => {
    await page.goto('/preguntas-frecuentes');

    await page.locator('#faq-search').fill('biofabrica');

    await expect(page.locator('.faq-item:not(.hidden)')).toHaveCount(1);
    await expect(page.locator('.faq-item:not(.hidden)')).toContainText('biofábrica');
    await expect(page.locator('#faq-count')).toBeVisible();
  });

  test('[es] una búsqueda sin resultados ofrece el formulario', async ({ page }) => {
    await page.goto('/preguntas-frecuentes');

    await page.locator('#faq-search').fill('tractores de vapor');

    await expect(page.locator('#faq-empty')).toBeVisible();
    await expect(page.locator('#faq-list')).toBeHidden();
    await expect(page.locator('#faq-message')).toHaveValue('tractores de vapor');
  });
});
