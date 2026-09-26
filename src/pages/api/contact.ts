import type { APIRoute } from 'astro';
import { insertLead, parseFormType, type FormType } from '@/lib/leads';
import { formResponse } from '@/lib/form-response';

export const prerender = false;

/**
 * Campos obligatorios por formulario. El `required` del HTML solo lo aplica el
 * navegador: un POST sin JavaScript, o fabricado, entra igual. En la reserva de
 * plaza esto deja de ser cosmético — un lead con `dni` a null es un lead que el
 * cliente cree completo y no lo está.
 *
 * Este endpoint no sirve las listas de espera: esas van por /api/waitlist y solo
 * piden el email.
 */
const CAMPOS_OBLIGATORIOS: Record<FormType, string[]> = {
  reserva: ['name', 'email', 'phone', 'dni'],
  contacto: ['name', 'email', 'phone'],
  // El DNI salió de la asesoría el 24/09/2026 a petición del cliente: solo lo
  // necesita para el contrato y el certificado del programa anual, y la
  // asesoría no emite ninguno de los dos. El campo sigue existiendo en la
  // tabla porque la reserva lo usa.
  asesoria: ['name', 'email', 'phone'],
  faq: ['name', 'email', 'message'],
  'waitlist-home': ['email'],
  'waitlist-programa': ['email'],
};

export const POST: APIRoute = async ({ request, url }) => {
  const fd = await request.formData();
  const name     = (fd.get('name')     as string | null)?.trim() ?? '';
  const email    = (fd.get('email')    as string | null)?.trim() ?? '';
  const phone    = (fd.get('phone')    as string | null)?.trim() ?? '';
  const message  = (fd.get('message')  as string | null)?.trim() ?? '';
  const servicio = (fd.get('servicio') as string | null)?.trim() ?? '';
  const finca    = (fd.get('finca')    as string | null)?.trim() ?? '';
  const proyecto = (fd.get('proyecto') as string | null)?.trim() ?? '';
  const lang     = (fd.get('lang')     as string | null)?.trim() ?? '';

  // Solo los manda la reserva de plaza; en los demás formularios llegan vacíos
  // y la fila los deja a null.
  const dni              = (fd.get('dni')               as string | null)?.trim() ?? '';
  const metodoPago       = (fd.get('metodo_pago')       as string | null)?.trim() ?? '';
  const facturaNombre    = (fd.get('factura_nombre')    as string | null)?.trim() ?? '';
  const facturaDireccion = (fd.get('factura_direccion') as string | null)?.trim() ?? '';
  const facturaNif       = (fd.get('factura_nif')       as string | null)?.trim() ?? '';
  const privacy  = fd.get('privacy') !== null;
  const honeypot = (fd.get('_gotcha')  as string | null) ?? '';

  // Este endpoint sirve a la reserva de plaza, al form de contacto, al de
  // asesoría (/servicios) y al de preguntas abiertas de la FAQ.
  const formType = parseFormType(fd.get('tipo') as string | null, 'contacto');

  // Bot: se responde como si todo fuera bien para no darle pistas, pero no se guarda nada.
  if (honeypot) {
    return formResponse(request, url, { ok: true, formType });
  }

  const valores: Record<string, string> = { name, email, phone, message, dni };
  const faltan = CAMPOS_OBLIGATORIOS[formType].filter((campo) => !valores[campo]);

  if (faltan.length > 0) {
    return formResponse(request, url, {
      ok: false, status: 400, error: `Faltan campos obligatorios: ${faltan.join(', ')}`, formType,
    });
  }

  const { error } = await insertLead({
    formType,
    lang,
    name,
    email,
    phone,
    message,
    servicio,
    finca,
    proyecto,
    dni,
    metodoPago,
    facturaNombre,
    facturaDireccion,
    facturaNif,
    privacy,
    userAgent: request.headers.get('user-agent') ?? undefined,
  });

  if (error) {
    console.error('contact endpoint error:', error);
    return formResponse(request, url, { ok: false, status: 500, error: 'Error interno', formType });
  }

  return formResponse(request, url, { ok: true, formType });
};
