import type { APIRoute } from 'astro';
import { FORM_TYPES, FORM_TYPE_LABELS, listLeads, type FormType, type LeadRow } from '@/lib/leads';

export const prerender = false;

const HEADERS = [
  'Fecha',
  'Tipo de formulario',
  'Nombre',
  'Email',
  'Teléfono',
  'Mensaje',
  'Servicio',
  'Finca',
  'Proyecto',
  'Idioma',
  'Acepta privacidad',
];

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Madrid',
});

/**
 * Escapa un campo para CSV. Además antepone una comilla simple a lo que Excel
 * interpretaría como fórmula (=, +, -, @): un lead puede escribir cualquier
 * cosa en el mensaje y no queremos que se ejecute al abrir el fichero.
 */
function cell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** `24/08/2026 18:49` — sin la coma que mete Intl, para que Excel lo lea como fecha. */
function formatDate(value: string): string {
  return dateFormatter.format(new Date(value)).replace(',', '');
}

function toRow(row: LeadRow): string {
  return [
    formatDate(row.created_at),
    FORM_TYPE_LABELS[row.form_type as FormType] ?? row.form_type,
    row.name,
    row.email,
    row.phone,
    row.message,
    row.servicio,
    row.finca,
    row.proyecto,
    row.lang,
    row.privacy ? 'Sí' : 'No',
  ]
    .map(cell)
    .join(';');
}

export const GET: APIRoute = async ({ url }) => {
  const tipo = url.searchParams.get('tipo');
  const formType = FORM_TYPES.includes(tipo as FormType) ? (tipo as FormType) : undefined;

  const { rows } = await listLeads(formType);

  // Separador ';' y BOM UTF-8: es lo que hace que el Excel en español abra el
  // fichero en columnas y respete las tildes al hacer doble clic.
  const csv = [HEADERS.map(cell).join(';'), ...rows.map(toRow)].join('\r\n');
  const body = `﻿${csv}\r\n`;

  const today = new Date().toISOString().slice(0, 10);
  const filename = `leads-suelos-vivos${formType ? `-${formType}` : ''}-${today}.csv`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
};
