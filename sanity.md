 Siguiente paso obligatorio — crear el proyecto Sanity:

  # Desde projects/suelos-vivos/
  pnpm dlx sanity@latest login
  pnpm dlx sanity@latest projects create --dataset production
  # → te dará un projectId (ej: abc123xy)

  Luego reemplaza REPLACE_ME en .env y en astro.config.mjs con ese ID. El studio estará disponible en /studio una vez deployado en
  Vercel.

