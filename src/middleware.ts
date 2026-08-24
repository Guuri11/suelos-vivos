import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from '@/lib/auth/session';

const PANEL_PREFIX = '/panel-suelos';
const PANEL_PUBLIC_PATHS = new Set([
  '/panel-suelos/login',
  '/panel-suelos/login/',
  '/panel-suelos/api/login',
  '/panel-suelos/api/login/',
]);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith(PANEL_PREFIX) || PANEL_PUBLIC_PATHS.has(pathname)) {
    return next();
  }

  const secret = import.meta.env.SESSION_SECRET;
  const cookieValue = context.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!secret || !verifySessionCookieValue(cookieValue, secret)) {
    const redirectTo = encodeURIComponent(pathname + context.url.search);
    return context.redirect(`/panel-suelos/login?redirect=${redirectTo}`);
  }

  return next();
});
