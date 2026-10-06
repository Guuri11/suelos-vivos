import type { APIRoute } from 'astro';
import { FORM_TYPES, deleteLeads, type FormType } from '@/lib/leads';

export const prerender = false;

const MAX_IDS = 1_000;

/** Lo protege el middleware, como todo lo que cuelga de /panel-suelos. */
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  const ids = [...new Set(form.getAll('id').map((v) => Number(v)))]
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, MAX_IDS);

  const tipo = String(form.get('tipo') ?? '');
  const params = new URLSearchParams();
  if (FORM_TYPES.includes(tipo as FormType)) params.set('tipo', tipo);

  const { deleted, error } = await deleteLeads(ids);
  if (error) params.set('error', 'borrar');
  else params.set('borrados', String(deleted));

  return redirect(`/panel-suelos?${params}`, 303);
};
