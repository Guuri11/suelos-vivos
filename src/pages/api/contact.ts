import type { APIRoute } from 'astro';
import { insertLead, parseFormType } from '@/lib/leads';
import { formResponse } from '@/lib/form-response';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const fd = await request.formData();
  const name     = (fd.get('name')     as string | null)?.trim() ?? '';
  const email    = (fd.get('email')    as string | null)?.trim() ?? '';
  const phone    = (fd.get('phone')    as string | null)?.trim() ?? '';
  const message  = (fd.get('message')  as string | null)?.trim() ?? '';
  const servicio = (fd.get('servicio') as string | null)?.trim() ?? '';
  const finca    = (fd.get('finca')    as string | null)?.trim() ?? '';
  const proyecto = (fd.get('proyecto') as string | null)?.trim() ?? '';
  const lang     = (fd.get('lang')     as string | null)?.trim() ?? '';
  const privacy  = fd.get('privacy') !== null;
  const honeypot = (fd.get('_gotcha')  as string | null) ?? '';

  // Este endpoint sirve al form de contacto, al de asesoría (/servicios) y al
  // de preguntas abiertas de la FAQ.
  const formType = parseFormType(fd.get('tipo') as string | null, 'contacto');

  // Bot: se responde como si todo fuera bien para no darle pistas, pero no se guarda nada.
  if (honeypot) {
    return formResponse(request, url, { ok: true, formType });
  }

  if (!name || !email) {
    return formResponse(request, url, {
      ok: false, status: 400, error: 'Faltan campos obligatorios', formType,
    });
  }

  const { error } = await insertLead({
    formType,
    lang,
    name,
    email,
    phone,
    message,
    servicio,
    finca,
    proyecto,
    privacy,
    userAgent: request.headers.get('user-agent') ?? undefined,
  });

  if (error) {
    console.error('contact endpoint error:', error);
    return formResponse(request, url, { ok: false, status: 500, error: 'Error interno', formType });
  }

  return formResponse(request, url, { ok: true, formType });
};
