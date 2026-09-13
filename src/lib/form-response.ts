import { FORM_TYPES, type FormType } from '@/lib/leads';

/**
 * Anclas a las que se vuelve tras un envío sin JavaScript, para que el visitante
 * aterrice en el mensaje y no en lo alto de la página. Son los `id` de los dos
 * párrafos de resultado que ya tiene cada formulario.
 */
const FORM_ANCHORS: Record<FormType, { ok: string; error: string }> = {
  reserva: { ok: 'reserva-success', error: 'reserva-error' },
  contacto: { ok: 'form-success', error: 'form-error' },
  asesoria: { ok: 'advisory-success', error: 'advisory-error' },
  faq: { ok: 'faq-form-success', error: 'faq-form-error' },
  'waitlist-home': { ok: 'waitlist-success', error: 'waitlist-error' },
  'waitlist-programa': { ok: 'programa-waitlist-success', error: 'programa-waitlist-error' },
};

/** El fetch de los formularios manda `Accept: application/json`; el POST nativo del navegador, no. */
function wantsJson(request: Request) {
  return (request.headers.get('accept') ?? '').includes('application/json');
}

/** Página desde la que se envió el formulario, siempre que sea de este mismo sitio. */
function originPath(request: Request, url: URL): string {
  const referer = request.headers.get('referer');
  if (!referer) return '/';
  try {
    const parsed = new URL(referer);
    return parsed.origin === url.origin ? parsed.pathname : '/';
  } catch {
    return '/';
  }
}

/**
 * Responde al envío de un formulario.
 *
 * Con JavaScript el navegador espera JSON y el script pinta el mensaje en la
 * propia página. Sin JavaScript —módulo que no carga, error previo, o clic
 * antes de que hidrate— el POST es nativo y sin esto el visitante acabaría
 * viendo `{"ok":true}` en pantalla; en ese caso se le devuelve a la página con
 * el resultado en la query, que es lo que leen las páginas para mostrar el
 * mensaje ya renderizado desde el servidor.
 */
export function formResponse(
  request: Request,
  url: URL,
  result: { ok: true; formType: FormType } | { ok: false; status: number; error: string; formType?: FormType },
): Response {
  if (wantsJson(request)) {
    return result.ok
      ? new Response(JSON.stringify({ ok: true }), { status: 200 })
      : new Response(JSON.stringify({ error: result.error }), { status: result.status });
  }

  const formType = result.formType;
  const back = new URL(originPath(request, url), url.origin);
  back.searchParams.set(result.ok ? 'enviado' : 'error', formType ?? 'contacto');
  if (formType && FORM_TYPES.includes(formType)) {
    back.hash = result.ok ? FORM_ANCHORS[formType].ok : FORM_ANCHORS[formType].error;
  }

  return new Response(null, {
    status: 303,
    headers: { Location: back.pathname + back.search + back.hash },
  });
}
