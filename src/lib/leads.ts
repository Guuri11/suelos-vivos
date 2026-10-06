import { supabaseServer } from '@/lib/supabase-server';

/** Los formularios del sitio. El valor viaja en el hidden `tipo` de cada form. */
export const FORM_TYPES = ['reserva', 'contacto', 'asesoria', 'faq', 'waitlist-home', 'waitlist-programa'] as const;
export type FormType = (typeof FORM_TYPES)[number];

export const FORM_TYPE_LABELS: Record<FormType, string> = {
  reserva: 'Reserva de plaza',
  contacto: 'Contacto',
  asesoria: 'Asesoría',
  faq: 'Pregunta desde FAQ',
  // Los dos banners de "¿No puedes desplazarte?" son el mismo flujo: la
  // Escuela Online. Se mantienen como dos tipos para saber desde qué página
  // llegó el lead, pero al cliente se le presentan bajo el mismo nombre.
  'waitlist-home': 'Escuela Online (home)',
  'waitlist-programa': 'Escuela Online (programa)',
};

/**
 * Método de pago que declara el visitante en la reserva de plaza. **No se cobra
 * nada en la web**: es una preferencia, y el cobro se cierra fuera (decisión del
 * 12/09/2026). El `value` que viaja en el form es el slug, no la etiqueta, para
 * que el panel y el CSV se lean igual venga el lead de /es, /en o /fr.
 */
export const PAYMENT_METHODS = ['tarjeta', 'transferencia'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  tarjeta: 'Tarjeta de crédito',
  transferencia: 'Transferencia bancaria',
};

/** Etiqueta legible de un método de pago; devuelve '' si no es uno de los nuestros. */
export function paymentMethodLabel(value: string | null | undefined): string {
  if (!value) return '';
  return PAYMENT_METHOD_LABELS[value as PaymentMethod] ?? value;
}

export interface LeadInput {
  formType: FormType;
  lang?: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  servicio?: string;
  finca?: string;
  proyecto?: string;
  dni?: string;
  metodoPago?: string;
  facturaNombre?: string;
  facturaDireccion?: string;
  facturaNif?: string;
  privacy?: boolean;
  userAgent?: string;
}

export interface LeadRow {
  id: number;
  created_at: string;
  form_type: string;
  lang: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  servicio: string | null;
  finca: string | null;
  proyecto: string | null;
  dni: string | null;
  metodo_pago: string | null;
  factura_nombre: string | null;
  factura_direccion: string | null;
  factura_nif: string | null;
  privacy: boolean;
  user_agent: string | null;
}

/** Valida el hidden `tipo` que llega del formulario; cae a `fallback` si no es uno de los nuestros. */
export function parseFormType(value: string | null | undefined, fallback: FormType): FormType {
  return FORM_TYPES.includes(value as FormType) ? (value as FormType) : fallback;
}

export function isConfigured() {
  return supabaseServer !== null;
}

/** Trunca cada campo antes de insertar: el body lo controla quien envía el formulario. */
export async function insertLead(input: LeadInput): Promise<{ error: string | null }> {
  if (!supabaseServer) return { error: null };

  const { error } = await supabaseServer.from('leads').insert({
    form_type: input.formType,
    lang: input.lang?.slice(0, 8) || null,
    name: input.name?.slice(0, 160) || null,
    email: input.email.slice(0, 254),
    phone: input.phone?.slice(0, 40) || null,
    message: input.message?.slice(0, 5000) || null,
    servicio: input.servicio?.slice(0, 80) || null,
    finca: input.finca?.slice(0, 300) || null,
    proyecto: input.proyecto?.slice(0, 5000) || null,
    dni: input.dni?.slice(0, 40) || null,
    metodo_pago: input.metodoPago?.slice(0, 40) || null,
    factura_nombre: input.facturaNombre?.slice(0, 160) || null,
    factura_direccion: input.facturaDireccion?.slice(0, 300) || null,
    factura_nif: input.facturaNif?.slice(0, 40) || null,
    privacy: input.privacy ?? false,
    user_agent: input.userAgent?.slice(0, 400) || null,
  });

  return { error: error?.message ?? null };
}

const MAX_ROWS = 5_000;

export async function listLeads(
  formType?: FormType
): Promise<{ rows: LeadRow[]; error: string | null }> {
  if (!supabaseServer) return { rows: [], error: null };

  let query = supabaseServer
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(MAX_ROWS);

  if (formType) query = query.eq('form_type', formType);

  const { data, error } = await query;

  if (error) {
    console.error('[panel] leads:', error.message);
    return { rows: [], error: error.message };
  }

  return { rows: (data as LeadRow[] | null) ?? [], error: null };
}

/** Totales por tipo para las pestañas del panel. */
export function countByType(rows: LeadRow[]) {
  const counts = {} as Record<string, number>;
  for (const row of rows) counts[row.form_type] = (counts[row.form_type] ?? 0) + 1;
  return counts;
}

/**
 * Borra leads por id. Lo pidió el cliente el 06/10/2026: los que ya han pasado a
 * su CRM le sobran en el panel. Es borrado de verdad, sin papelera; además así no
 * quedan dos copias del DNI y de los datos de facturación.
 */
export async function deleteLeads(ids: number[]): Promise<{ deleted: number; error: string | null }> {
  if (!supabaseServer || ids.length === 0) return { deleted: 0, error: null };

  const { error, count } = await supabaseServer
    .from('leads')
    .delete({ count: 'exact' })
    .in('id', ids);

  if (error) {
    console.error('[panel] borrar leads:', error.message);
    return { deleted: 0, error: error.message };
  }

  return { deleted: count ?? 0, error: null };
}
