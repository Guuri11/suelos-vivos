import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL;
const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// null hasta que se configuren las env vars — los endpoints de formularios y el
// panel hacen no-op / avisan en vez de romper si Supabase aún no está conectado.
export const supabaseServer = url && serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null;
