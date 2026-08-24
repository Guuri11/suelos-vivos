import type { APIRoute } from 'astro';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionCookieValue,
  safeEqual,
} from '@/lib/auth/session';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  const redirectTo = String(form.get('redirect') ?? '/panel-suelos');
  const safeRedirect = redirectTo.startsWith('/panel-suelos') ? redirectTo : '/panel-suelos';

  const expectedPassword = import.meta.env.ADMIN_PANEL_PASSWORD;
  const secret = import.meta.env.SESSION_SECRET;

  if (!expectedPassword || !secret || !password || !safeEqual(password, expectedPassword)) {
    const loginUrl = new URL('/panel-suelos/login', request.url);
    loginUrl.searchParams.set('error', '1');
    if (redirectTo !== '/panel-suelos') loginUrl.searchParams.set('redirect', redirectTo);
    return redirect(loginUrl.pathname + loginUrl.search);
  }

  cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(secret), {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return redirect(safeRedirect);
};
