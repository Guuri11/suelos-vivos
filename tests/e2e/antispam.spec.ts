import { test, expect } from '@playwright/test';
import { checkFormToken, issueFormToken, MIN_FILL_MS } from '../../src/lib/antispam';

/**
 * Filtro de bots del 13/10/2026: hora firmada en cada formulario y casilla de
 * privacidad comprobada en el servidor. El porqué, en `src/lib/antispam.ts`.
 */

test.describe('Firma de los formularios', () => {
  const SECRET = 'secreto-de-prueba';
  const T0 = 1_760_000_000_000;

  test('acepta un envío firmado que tarda lo que tarda una persona', () => {
    const token = issueFormToken(SECRET, T0);
    expect(checkFormToken(token, SECRET, T0 + MIN_FILL_MS)).toBe('ok');
    expect(checkFormToken(token, SECRET, T0 + 3 * 24 * 60 * 60 * 1000)).toBe('ok');
  });

  test('descarta el que llega antes de poder haberlo rellenado', () => {
    const token = issueFormToken(SECRET, T0);
    expect(checkFormToken(token, SECRET, T0 + 900)).toBe('too-fast');
  });

  test('descarta el POST que no ha pasado por la página', () => {
    expect(checkFormToken(null, SECRET, T0)).toBe('missing');
    expect(checkFormToken('', SECRET, T0)).toBe('missing');
  });

  test('descarta una firma inventada o adelantada a mano', () => {
    const token = issueFormToken(SECRET, T0);
    const [, firma] = token.split('.');
    expect(checkFormToken(`${T0 - 60_000}.${firma}`, SECRET, T0)).toBe('forged');
    expect(checkFormToken(issueFormToken('otro-secreto', T0), SECRET, T0 + MIN_FILL_MS)).toBe('forged');
    expect(checkFormToken('basura', SECRET, T0)).toBe('forged');
  });

  test('sin secreto configurado no bloquea a nadie', () => {
    expect(issueFormToken(undefined, T0)).toBe('');
    expect(checkFormToken('', undefined, T0)).toBe('ok');
  });
});

test.describe('Cada formulario lleva su firma', () => {
  const PAGES = ['/', '/el-programa', '/contacto', '/servicios', '/reserva-plaza', '/preguntas-frecuentes'];

  for (const path of PAGES) {
    test(`${path} firma todos sus formularios`, async ({ page }) => {
      await page.goto(path);
      const forms = page.locator('form:has([name="_gotcha"])');
      const total = await forms.count();
      expect(total).toBeGreaterThan(0);
      for (let i = 0; i < total; i++) {
        await expect(forms.nth(i).locator('[name="_ts"]')).toHaveValue(/^\d+\.[0-9a-f]{64}$/);
      }
    });
  }
});

// Solo rechazos: cualquiera de estos POST que pasara el filtro escribiría en la
// Supabase de producción (ver reserva-plaza.spec.ts). Sin `_ts`, si la
// comprobación de privacidad fallara, el filtro de bots lo pararía igual.
test.describe('La casilla de privacidad se comprueba en el servidor', () => {
  const POST = { Accept: 'application/json', Origin: 'http://localhost:4321' };

  test('la lista de espera rechaza un email sin consentimiento', async ({ request }) => {
    const res = await request.post('/api/waitlist', {
      form: { tipo: 'waitlist-home', email: 'juan@ejemplo.com' },
      headers: POST,
    });
    expect(res.status()).toBe(400);
    expect(await res.text()).toContain('privacidad');
  });

  test('contacto rechaza un envío completo sin consentimiento', async ({ request }) => {
    const res = await request.post('/api/contact', {
      form: { tipo: 'contacto', name: 'Juan García', email: 'juan@ejemplo.com', phone: '600000000' },
      headers: POST,
    });
    expect(res.status()).toBe(400);
    expect(await res.text()).toContain('privacidad');
  });
});
