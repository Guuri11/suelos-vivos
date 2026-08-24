import type { APIRoute } from 'astro';
import { insertLead, parseFormType } from '@/lib/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const fd = await request.formData();
  const email = (fd.get('email') as string | null)?.trim() ?? '';
  const lang  = (fd.get('lang')  as string | null)?.trim() ?? '';
  const honeypot = (fd.get('_gotcha') as string | null) ?? '';

  if (honeypot) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  if (!email) {
    return new Response(JSON.stringify({ error: 'Falta el email' }), { status: 400 });
  }

  // Dos formularios de lista de espera: home y /el-programa.
  const formType = parseFormType(fd.get('tipo') as string | null, 'waitlist-home');

  const { error } = await insertLead({
    formType,
    lang,
    email,
    userAgent: request.headers.get('user-agent') ?? undefined,
  });

  if (error) {
    console.error('waitlist endpoint error:', error);
    return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
