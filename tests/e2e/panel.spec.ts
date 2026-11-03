import { test, expect } from '@playwright/test';

/**
 * El borrado de leads (06/10/2026) y el keepalive de Supabase. Ninguno de estos
 * tests llega a la base: el `.env` apunta a la de producción, y un test que
 * borrara de verdad se llevaría leads del cliente.
 */

test.describe('Panel de leads', () => {
  test('borrar sin sesión no borra: el middleware manda al login', async ({ request }) => {
    const res = await request.post('/panel-suelos/api/delete', {
      form: { id: '1' },
      headers: { Origin: 'http://localhost:4321' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(302);
    expect(res.headers()['location']).toContain('/panel-suelos/login');
  });
});

test.describe('Keepalive de Supabase', () => {
  test('sin el secreto del cron no responde', async ({ request }) => {
    const res = await request.get('/api/keepalive');
    expect(res.status()).toBe(401);
  });

  // El testigo de que la suite no tiene base. `playwright.config.ts` arranca el dev
  // server con las credenciales de Supabase vacías y este secreto: si responde 503
  // es que no hay cliente. Si un día responde 200, la suite está conectada a
  // producción y hay que pararlo todo. Ese 200 solo habría costado un conteo sin
  // filas, que no lee ni escribe leads.
  test('la suite corre sin Supabase conectada', async ({ request }) => {
    const res = await request.get('/api/keepalive', {
      headers: { Authorization: 'Bearer e2e-sin-base' },
    });
    expect(await res.text()).toBe('Supabase sin configurar');
    expect(res.status()).toBe(503);
  });

  test('vercel.json lo programa a diario', async () => {
    const { default: config } = await import('../../vercel.json', { with: { type: 'json' } });
    expect(config.crons).toContainEqual(expect.objectContaining({ path: '/api/keepalive' }));
  });
});
