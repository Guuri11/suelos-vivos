import { test, expect } from '@playwright/test';

/**
 * `/contacto` era la página de reserva: su title decía «Reservar plaza» y era el
 * destino de todos los CTA. El lote del 12/09/2026 la parte en dos. Estos tests
 * cubren lo que puede volver a fundirse sin que nadie se entere.
 */

const LANGS = [
  { prefix: '', titulo: /Reservar plaza/ },
  { prefix: '/en', titulo: /Reserve your spot/ },
  { prefix: '/fr', titulo: /Réserver une place/ },
];

test.describe('Reserva de plaza', () => {
  for (const { prefix, titulo } of LANGS) {
    test(`la página existe y se titula en ${prefix || '/es'}`, async ({ page }) => {
      await page.goto(`${prefix}/reserva-plaza`);
      await expect(page).toHaveTitle(titulo);
      await expect(page.locator('main form#reserva-form')).toBeVisible();
    });

    // El CTA llevaba href escrito a mano: desde /en y /fr sacaba al visitante
    // a la página en español.
    test(`el CTA de /el-programa se queda en ${prefix || '/es'}`, async ({ page }) => {
      await page.goto(`${prefix}/el-programa`);
      await expect(page.locator(`main a[href="${prefix}/reserva-plaza"]`).first()).toBeVisible();
      await expect(page.locator(`main a[href="${prefix}/servicios"]`).first()).toBeVisible();
    });
  }

  test('lleva los campos que pidió el cliente, y los obligatorios como tales', async ({ page }) => {
    await page.goto('/reserva-plaza');

    for (const name of ['name', 'email', 'phone', 'dni']) {
      await expect(page.locator(`#reserva-form [name="${name}"]`)).toHaveAttribute('required', '');
    }
    for (const name of ['finca', 'proyecto', 'metodo_pago', 'factura_nombre', 'factura_direccion', 'factura_nif']) {
      await expect(page.locator(`#reserva-form [name="${name}"]`)).toBeVisible();
    }

    // El `tipo` es lo único que separa este lead de los otros cinco en el panel.
    await expect(page.locator('#reserva-form input[name="tipo"]')).toHaveValue('reserva');
  });

  test('el método de pago manda el slug, no la etiqueta traducida', async ({ page }) => {
    await page.goto('/en/reserva-plaza');
    const values = await page.locator('#reserva-form select[name="metodo_pago"] option').evaluateAll(
      (opts) => opts.map((o) => (o as HTMLOptionElement).value)
    );
    expect(values).toEqual(['', 'tarjeta', 'transferencia']);
  });

  test('los campos se rellenan', async ({ page }) => {
    await page.goto('/reserva-plaza');

    await page.fill('input[name="name"]', 'Juan García');
    await page.fill('input[name="email"]', 'juan@ejemplo.com');
    await page.fill('input[name="phone"]', '+34 600 000 000');
    await page.fill('input[name="dni"]', '12345678A');
    await page.selectOption('select[name="metodo_pago"]', 'transferencia');

    await expect(page.locator('input[name="dni"]')).toHaveValue('12345678A');
    await expect(page.locator('select[name="metodo_pago"]')).toHaveValue('transferencia');
  });
});

test.describe('Documento de identidad', () => {
  // Astro protege los POST con `checkOrigin`: sin cabecera `Origin` del propio
  // sitio responde 403 y no llega a mirar los campos. El navegador la manda
  // sola; `request.post` no.
  const POST = {
    Accept: 'application/json',
    Origin: 'http://localhost:4321',
  };

  // El 13/09/2026 el cliente lo pidió en los dos formularios largos; el
  // 24/09/2026 lo retiró de la asesoría. El motivo de pedirlo —contrato y
  // certificado oficial— solo aplica al programa anual, y la asesoría no emite
  // ninguno de los dos. Queda solo en la reserva de plaza.
  test('la solicitud de asesoría ya no lo pide', async ({ page }) => {
    await page.goto('/servicios');
    await expect(page.locator('#advisory-form [name="dni"]')).toHaveCount(0);
    await expect(page.locator('#advisory-form [name="phone"]')).toHaveAttribute('required', '');
  });

  // Quitarlo del HTML no basta: si sigue en la lista del endpoint, la asesoría
  // deja de poder enviarse y nadie se entera hasta que el cliente pregunta por
  // qué no le llegan leads. Se comprueba sobre un POST incompleto, que se
  // rechaza antes de tocar Supabase.
  test('el endpoint ya no exige DNI en la asesoría', async ({ request }) => {
    const res = await request.post('/api/contact', {
      form: { tipo: 'asesoria', email: 'juan@ejemplo.com' },
      headers: POST,
    });
    expect(res.status()).toBe(400);
    expect(await res.text()).not.toContain('dni');
  });

  // El `required` del HTML no lo aplica nadie en un POST fabricado: si el
  // endpoint no valida, entra un lead sin DNI que el cliente cree completo.
  test('el endpoint rechaza una reserva sin DNI', async ({ request }) => {
    const res = await request.post('/api/contact', {
      form: { tipo: 'reserva', name: 'Juan García', email: 'juan@ejemplo.com', phone: '600000000' },
      headers: POST,
    });
    expect(res.status()).toBe(400);
    expect(await res.text()).toContain('dni');
  });

  // No hay test del camino feliz a propósito. El `.env` de desarrollo apunta a
  // la Supabase real, así que un POST válido insertaría un lead inventado en el
  // panel del cliente en cada pasada de la suite. El rechazo se puede comprobar
  // porque nunca llega a la base; la aceptación, no, y no vale el precio.
});

test.describe('Pago de la plaza', () => {
  // El bloque de éxito lo pinta el servidor cuando vuelve `?enviado=reserva`,
  // que es justo el camino sin JavaScript. Se puede comprobar sin enviar el
  // formulario, así que la suite no mete un lead en el panel del cliente.
  const LANGS = ['', '/en', '/fr'];

  for (const prefix of LANGS) {
    test(`el mensaje de éxito ofrece pagar en ${prefix || '/es'}`, async ({ page }) => {
      await page.goto(`${prefix}/reserva-plaza?enviado=reserva`);
      const exito = page.locator('#reserva-success');
      await expect(exito).toBeVisible();
      const boton = exito.locator('a[href^="https://buy.stripe.com/"]');
      await expect(boton).toBeVisible();
      await expect(boton).toHaveAttribute('rel', /noopener/);
    });
  }

  // Sin enviar nada, la página no puede ofrecer pagar: el botón vive dentro del
  // bloque de éxito y ese bloque nace oculto.
  test('sin enviar la solicitud no hay botón de pago visible', async ({ page }) => {
    await page.goto('/reserva-plaza');
    await expect(page.locator('#reserva-success')).toBeHidden();
    await expect(page.locator('a[href^="https://buy.stripe.com/"]:visible')).toHaveCount(0);
  });
});

test.describe('Contacto ya no es la página de reserva', () => {
  test('se titula Contacto y conserva su formulario corto', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page).toHaveTitle(/Contacto/);
    await expect(page).not.toHaveTitle(/Reservar plaza/);
    await expect(page.locator('#contact-form input[name="tipo"]')).toHaveValue('contacto');
    // Desde el 24/09/2026 el DNI es solo de la reserva; el de contacto sigue corto.
    await expect(page.locator('#contact-form [name="dni"]')).toHaveCount(0);
    await expect(page.locator('#contact-form [name="phone"]')).toHaveAttribute('required', '');
  });

  test('deriva a la reserva en vez de quedársela', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.locator('main a[href="/reserva-plaza"]')).toBeVisible();
  });

  test('el CTA de la cabecera apunta a la reserva, no a contacto', async ({ page }) => {
    await page.goto('/');
    const desktopNav = page.locator('header nav > ul').first();
    if (!(await desktopNav.isVisible())) {
      await page.locator('#menu-toggle').click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
    }
    await expect(page.locator('header a[href="/reserva-plaza"]:visible').first()).toBeVisible();
  });

  test('el footer da acceso a los tres formularios largos', async ({ page }) => {
    await page.goto('/');
    for (const href of ['/reserva-plaza', '/contacto', '/servicios']) {
      await expect(page.locator(`footer a[href="${href}"]`)).toBeVisible();
    }
  });
});
