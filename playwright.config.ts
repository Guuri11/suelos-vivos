import { defineConfig, devices } from '@playwright/test';

/**
 * La suite nunca habla con Supabase (03/11/2026).
 *
 * `.env` lleva las credenciales de la base de producción y el dev server lo carga.
 * Hasta hoy lo único que impedía meter leads falsos en el panel del cliente era que
 * ningún test enviara un formulario válido: una costumbre, no una barrera. Ahora:
 *
 * - `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` van vacías. Vite deja que las
 *   variables del proceso pisen las del `.env` aunque estén vacías, así que
 *   `supabaseServer` queda en `null` e `insertLead()` no hace nada.
 * - `reuseExistingServer: false`. Si ya hay un `pnpm dev` abierto en el 4321, ese
 *   servidor sí está conectado a producción; reutilizarlo saltaría todo lo anterior.
 *   Mejor que la suite falle por puerto ocupado.
 * - `CRON_SECRET` de prueba, para que `panel.spec.ts` pueda preguntarle al keepalive
 *   si hay base conectada. Si alguien quita esto, ese test se pone en rojo.
 */
const E2E_CRON_SECRET = 'e2e-sin-base'; // el mismo literal en panel.spec.ts

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    env: {
      E2E: '1',
      SUPABASE_URL: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      CRON_SECRET: E2E_CRON_SECRET,
    },
    url: 'http://localhost:4321',
    reuseExistingServer: false,
  },
});
