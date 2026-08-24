import type { APIRoute } from 'astro';
import { insertLead, parseFormType } from '@/lib/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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

  // Bot: se responde 200 para no darle pistas, pero no se guarda nada.
  if (honeypot) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  if (!name || !email) {
    return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
  }

  // Este endpoint sirve al form de contacto y al de asesoría (/servicios).
  const formType = parseFormType(fd.get('tipo') as string | null, 'contacto');

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
    return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
