import { createHmac } from 'node:crypto';
import { safeEqual } from '@/lib/auth/session';

/**
 * Filtro de bots de los formularios públicos (13/10/2026).
 *
 * Entre el 22/09 y el 12/10 entraron 13 leads de bots: misma dirección en la
 * lista de espera y en contacto con un segundo de diferencia, teléfonos 555,
 * mensajes genéricos en inglés. El honeypot `_gotcha` no los paró: el nombre
 * es el de Formspree y los bots lo conocen.
 *
 * Cada formulario lleva la hora a la que se sirvió la página, firmada. Un envío
 * sin firma válida no ha cargado la página (POST directo al endpoint) y uno que
 * llega antes de `MIN_FILL_MS` no lo ha rellenado una persona. Se firma en el
 * servidor y no en el navegador para que funcione también sin JavaScript.
 *
 * No caduca a propósito: una pestaña abierta desde ayer es una persona, y
 * perderle el envío en silencio es peor que dejar pasar un bot paciente.
 */
export const MIN_FILL_MS = 3000;

/** El secreto es el del panel; el prefijo evita que una firma valga en el otro sitio. */
function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(`form-token:${payload}`).digest('hex');
}

export function issueFormToken(secret: string | undefined, now = Date.now()): string {
  if (!secret) return '';
  const payload = String(now);
  return `${payload}.${sign(payload, secret)}`;
}

export type FormTokenVerdict = 'ok' | 'missing' | 'forged' | 'too-fast';

export function checkFormToken(
  token: string | null | undefined,
  secret: string | undefined,
  now = Date.now(),
): FormTokenVerdict {
  // Sin secreto no hay nada que comprobar. Se deja pasar: bloquear a todo el
  // mundo por un fallo de configuración es peor que el spam.
  if (!secret) return 'ok';
  if (!token) return 'missing';

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(sign(payload, secret), signature)) return 'forged';

  const issuedAt = Number(payload);
  if (!Number.isFinite(issuedAt)) return 'forged';
  return now - issuedAt < MIN_FILL_MS ? 'too-fast' : 'ok';
}
