-- Tabla de leads de suelosvivos.com
-- Ejecutar en Supabase → SQL Editor (una sola vez)
--
-- RLS queda activado sin policies: nadie puede leer/escribir desde el cliente
-- (anon key). Solo el backend, usando la service_role key, puede insertar y
-- leer (la service_role key salta RLS por diseño).
--
-- Una sola tabla para los cuatro formularios del sitio, segmentados por
-- form_type. Las columnas que un formulario no usa quedan a null: así el panel
-- y la exportación a CSV son una única consulta con un filtro opcional.

create table if not exists leads (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  form_type   text not null,   -- contacto | asesoria | waitlist-home | waitlist-programa
  lang        text,            -- es | en | fr
  name        text,
  email       text not null,
  phone       text,
  message     text,
  servicio    text,            -- solo formulario de asesoría
  finca       text,            -- solo formulario de asesoría
  proyecto    text,            -- solo formulario de asesoría
  privacy     boolean not null default false,
  user_agent  text
);

alter table leads enable row level security;

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_form_type_idx  on leads (form_type, created_at desc);

-- El backend entra siempre como service_role. En los proyectos Supabase
-- recientes las tablas nuevas de `public` ya no reciben permisos de forma
-- automática, así que se conceden aquí explícitamente. Solo a service_role:
-- anon y authenticated se quedan fuera a propósito, para que la tabla siga
-- siendo inaccesible desde el navegador.
grant select, insert on table leads to service_role;
