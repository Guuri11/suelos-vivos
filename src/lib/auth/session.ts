import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE_NAME = 'suelos_panel_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function digest(input: string) {
  return createHash('sha256').update(input, 'utf8').digest();
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/** Compara dos strings en tiempo constante sin filtrar la longitud (hashea antes de comparar). */
export function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

export function createSessionCookieValue(secret: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionCookieValue(value: string | undefined, secret: string): boolean {
  if (!value) return false;

  const [payload, signature] = value.split('.');
  if (!payload || !signature) return false;
  if (!safeEqual(sign(payload, secret), signature)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
