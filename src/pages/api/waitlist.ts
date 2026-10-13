import type { APIRoute } from 'astro';
import { insertLead, parseFormType } from '@/lib/leads';
import { formResponse } from '@/lib/form-response';
import { checkFormToken } from '@/lib/antispam';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const fd = await request.formData();
  const email = (fd.get('email') as string | null)?.trim() ?? '';
  const lang  = (fd.get('lang')  as string | null)?.trim() ?? '';
  const privacy = fd.get('privacy') !== null;
  const honeypot = (fd.get('_gotcha') as string | null) ?? '';

  // Dos formularios de lista de espera: home y /el-programa.
  const formType = parseFormType(fd.get('tipo') as string | null, 'waitlist-home');

  if (honeypot) {
    return formResponse(request, url, { ok: true, formType });
  }

  if (!email) {
    return formResponse(request, url, { ok: false, status: 400, error: 'Falta el email', formType });
  }

  // La casilla es `required` en el HTML, pero eso solo lo aplica el navegador.
  if (!privacy) {
    return formResponse(request, url, {
      ok: false, status: 400, error: 'Falta aceptar la política de privacidad', formType,
    });
  }

  // Al bot se le responde como al honeypot. El porqué, en `lib/antispam.ts`.
  const verdict = checkFormToken(fd.get('_ts') as string | null, import.meta.env.SESSION_SECRET);
  if (verdict !== 'ok') {
    console.warn(`waitlist: descartado por antispam (${verdict}, ${formType})`);
    return formResponse(request, url, { ok: true, formType });
  }

  const { error } = await insertLead({
    formType,
    lang,
    email,
    privacy,
    userAgent: request.headers.get('user-agent') ?? undefined,
  });

  if (error) {
    console.error('waitlist endpoint error:', error);
    return formResponse(request, url, { ok: false, status: 500, error: 'Error interno', formType });
  }

  return formResponse(request, url, { ok: true, formType });
};
