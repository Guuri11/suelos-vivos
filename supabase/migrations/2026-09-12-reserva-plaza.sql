-- Formulario de reserva de plaza (form_type = 'reserva')
-- Ejecutar en Supabase → SQL Editor, una sola vez, sobre la base ya viva.
--
-- No se puede reejecutar `schema.sql` en su lugar: su `create table if not
-- exists` no haría nada sobre una tabla que ya existe con leads dentro.
--
-- `form_type` es `text` sin CHECK, así que el valor nuevo 'reserva' no necesita
-- migración. Los `grant` de `schema.sql` son a nivel de tabla, no de columna:
-- service_role alcanza estas columnas nuevas sin volver a concederle nada.

alter table leads add column if not exists dni              text; -- reserva y asesoría
alter table leads add column if not exists metodo_pago      text; -- preferencia declarada, no cobro
alter table leads add column if not exists factura_nombre   text;
alter table leads add column if not exists factura_direccion text;
alter table leads add column if not exists factura_nif      text;
