import type { APIRoute } from 'astro';

const HOLDED_BASE = 'https://api.holded.com/api';

function holdedHeaders() {
  return {
    key: import.meta.env.HOLDED_API_KEY,
    'Content-Type': 'application/json',
  };
}

export const POST: APIRoute = async ({ request }) => {
  const fd = await request.formData();
  const email = (fd.get('email') as string | null)?.trim() ?? '';
  const honeypot = (fd.get('_gotcha') as string | null) ?? '';

  if (honeypot) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  if (!email) {
    return new Response(JSON.stringify({ error: 'Falta el email' }), { status: 400 });
  }

  try {
    const contactRes = await fetch(`${HOLDED_BASE}/invoicing/v1/contacts`, {
      method: 'POST',
      headers: holdedHeaders(),
      body: JSON.stringify({
        name: email,
        email,
        type: 'lead',
        isperson: true,
        tags: ['waitlist-online-fibe'],
      }),
    });

    if (!contactRes.ok) {
      const err = await contactRes.text();
      console.error('Holded contact error:', err);
      throw new Error('Error creando contacto en Holded');
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('waitlist endpoint error:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
  }
};
