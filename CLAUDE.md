# Suelos Vivos — Instrucciones del proyecto

## Datos del cliente

- **Empresa**: Suelos Vivos
- **Sector**: Formación en agricultura regenerativa para agricultores profesionales
- **Producto**: programa anual de 12 meses, 20 plazas, 2.299 € (o 10 cuotas de 200 € con
  500 € de reserva). Arranque en diciembre de 2026, en Tormos (Alicante)
- **Web**: https://www.suelosvivos.com
- **Contacto**: info@suelosvivos.com
- **Redes**: Instagram `@suelosvivos_com`, Telegram `t.me/suelosvivos`
- **Vinculado a**: Bosque Madre (bosquemadre.com)

Los datos vivos están en `src/config/site.ts`, que es la única fuente de verdad. Lo de
arriba es un resumen para orientarse, no una copia que mantener en paralelo.

## Instrucciones del workspace

Se cargan solas: Claude Code lee el `CLAUDE.md` de cada directorio por encima de este.
No hace falta importarlas.

Los procedimientos viven en skills: `/mantenimiento`, `/sprint-seo`, `/rediseno`,
`/design-system`, `/prelanzamiento`.

## Estado

**En producción.** Carril activo: **C — mantenimiento**.

Sin encargos pendientes a 26/08/2026 (P-1 de `internal-docs/plan/ESTADO.md`).

## Cómo está montado

- **Astro** con `output: 'server'` y adaptador de Vercel
- **Tres idiomas por duplicación de páginas**: `src/pages/`, `src/pages/en/` y
  `src/pages/fr/` son árboles paralelos, no un sistema de traducción. Tocar una página
  significa tocarla tres veces, y es fácil que se desincronicen
- **Sanity** como CMS del blog
- **Supabase** para leads (`supabase/schema.sql`)
- **Panel privado** en `/panel-suelos`
- **React** como isla, solo donde hace falta interactividad

## Baseline de auditoría

**26/08/2026 · `d2bcd508` · 9 páginas · 41/100 (F)**

Fichero: `internal-docs/baselines/suelos-vivos-2026-08-26.md`
Lectura: `internal-docs/baselines/README.md`

Es el primer baseline del cliente. **Nada se migra ni se rediseña sin compararlo contra
él**: `squirrel report --regressionSince d2bcd508`.

## Lo que hay roto y está medido, no arreglado

Todo esto es W6. Está aquí para que nadie lo redescubra desde cero.

### La causa raíz: el host

`src/config/site.ts` y `astro.config.mjs` declaran `https://suelosvivos.com`, **sin www**.
El sitio sirve en **www** y responde 308 desde no-www. De ahí salen, en cascada:

- `canonical` apuntando a una URL que redirige, así que no es autorreferencial
- los cuatro `hreflang` (es, en, fr, x-default) apuntando a URLs que redirigen
- las 30 URLs del sitemap en no-www: **las 30 son redirecciones**

Google descarta el conjunto entero de anotaciones hreflang cuando pasa esto. No lo corrige.

Es un arreglo de una línea en dos ficheros, pero **hay que decidir antes cuál es el host
canónico** —www o no-www— y alinear Vercel, el sitemap y el contenido con esa decisión de
una vez. No se cambia a medias.

### Los idiomas son huérfanos

`/en/` y `/fr/` sirven 200 con contenido real, pero **no hay un solo enlace a ellos desde
la home**: no existe selector de idioma navegable. Solo se llega por sitemap.

Cuando se monte el selector: enlaces reales, nunca JavaScript que redirige, nunca
redirección automática por IP, y que lleve a la página equivalente y no a la home.

### Y dos cosas sueltas

- **No hay `robots.txt`**: devuelve 404, y con él no se declara el sitemap
- Cada página está **dos veces en el sitemap**, con y sin barra final

## Modificaciones

El histórico está en `Modificaciones web/Modificacionesweb.html`, en formato antiguo.
Migrarlo a `CAMBIOS.md` es parte de W6.
