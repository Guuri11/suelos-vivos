import type { APIRoute } from 'astro';
import { supabaseServer } from '@/lib/supabase-server';

export const prerender = false;

/**
 * Lo llama el cron de Vercel una vez al día (`vercel.json`). El plan gratuito de
 * Supabase pausa el proyecto tras 7 días sin actividad, y pausado los seis
 * formularios fallan y el panel no carga: pasó en octubre de 2026 y el cliente se
 * enteró antes que nosotros. Una consulta diaria basta para que nunca cuente
 * una semana quieta.
 *
 * Vercel firma la llamada con `Authorization: Bearer $CRON_SECRET`. Sin esa
 * variable el endpoint no responde a nadie: no es para visitantes.
 */
export const GET: APIRoute = async ({ request }) => {
  const secret = import.meta.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('No autorizado', { status: 401 });
  }

  if (!supabaseServer) {
    return new Response('Supabase sin configurar', { status: 503 });
  }

  // `head: true` no trae filas: cuenta como actividad sin mover datos de leads.
  const { error } = await supabaseServer
    .from('leads')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('[keepalive] supabase:', error.message);
    return new Response(`Supabase no responde: ${error.message}`, { status: 502 });
  }

  return new Response('ok', { status: 200 });
};
