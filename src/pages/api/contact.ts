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
  const name    = (fd.get('name')    as string | null)?.trim() ?? '';
  const email   = (fd.get('email')   as string | null)?.trim() ?? '';
  const phone   = (fd.get('phone')   as string | null)?.trim() ?? '';
  const message = (fd.get('message') as string | null)?.trim() ?? '';

  if (!name || !email) {
    return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
  }

  try {
    // 1. Crear contacto en Holded
    const contactRes = await fetch(`${HOLDED_BASE}/invoicing/v1/contacts`, {
      method: 'POST',
      headers: holdedHeaders(),
      body: JSON.stringify({
        name,
        email,
        phone,
        type: 'lead',
        isperson: true,
        tags: ['websuelos'],
      }),
    });

    if (!contactRes.ok) {
      const err = await contactRes.text();
      console.error('Holded contact error:', err);
      throw new Error('Error creando contacto en Holded');
    }

    const contact = await contactRes.json();
    const contactId: string = contact.id;

    // 2. Crear lead en el CRM
    const leadBody: Record<string, unknown> = {
      name: `Solicitud Suelos Vivos — ${name}`,
      contactId,
      desc: message,
    };

    if (import.meta.env.HOLDED_FUNNEL_ID) leadBody.funnelId = import.meta.env.HOLDED_FUNNEL_ID;
    if (import.meta.env.HOLDED_STAGE_ID)  leadBody.stageId  = import.meta.env.HOLDED_STAGE_ID;

    const leadRes = await fetch(`${HOLDED_BASE}/crm/v1/leads`, {
      method: 'POST',
      headers: holdedHeaders(),
      body: JSON.stringify(leadBody),
    });

    if (!leadRes.ok) {
      const err = await leadRes.text();
      console.error('Holded lead error:', err);
      throw new Error('Error creando lead en Holded');
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('contact endpoint error:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
  }
};
