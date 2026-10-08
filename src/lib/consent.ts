// Consentimiento de cookies y píxel de Meta. Lo usa CookieConsent.astro, y los
// formularios llaman a trackLead() al enviarse bien.

export type ConsentStatus = 'granted' | 'denied';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

// Guardar la elección no necesita consentimiento: es almacenamiento técnico.
const STORAGE_KEY = 'sv-cookie-consent';
// Pasado un año se vuelve a preguntar (la AEPD admite hasta 24 meses).
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function readConsent(): ConsentStatus | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { status, at } = JSON.parse(raw) as { status?: string; at?: number };
    if (status !== 'granted' && status !== 'denied') return null;
    if (typeof at !== 'number' || Date.now() - at > MAX_AGE_MS) return null;
    return status;
  } catch {
    return null;
  }
}

export function saveConsent(status: ConsentStatus): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, at: Date.now() }));
  } catch {
    // Sin almacenamiento (modo privado estricto) la elección vale solo para esta página.
  }
}

/** El snippet oficial de Meta, sin el <noscript> y solo tras el consentimiento. */
export function loadMetaPixel(pixelId: string): void {
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  // Sin la configuración automática el píxel no recoge por su cuenta textos de
  // botones ni metadatos de la página: la web pide DNI y datos de facturación.
  fbq('set', 'autoConfig', false, pixelId);
  fbq('init', pixelId);
  fbq('track', 'PageView');
}

/** Un formulario enviado con éxito. No hace nada si no hay consentimiento. */
export function trackLead(form: string): void {
  window.fbq?.('track', 'Lead', { content_name: form });
}

/** Borra _fbp y _fbc, en el host y en el dominio padre, que es donde las pone Meta. */
export function clearMetaCookies(): void {
  const host = location.hostname;
  const domains = ['', host, `.${host.replace(/^www\./, '')}`];
  for (const name of ['_fbp', '_fbc']) {
    for (const domain of domains) {
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` + (domain ? `; domain=${domain}` : '');
    }
  }
}
