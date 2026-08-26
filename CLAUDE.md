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

Ojo al leerlo: su Internacionalización marca 100/100 y eso significaba «no medido», no
«bien». El crawler encontró 9 páginas, las 9 en español, y nunca llegó a `/en/` ni `/fr/`
porque no había enlaces. Con el selector de idioma ya montado, la próxima auditoría verá
las tres ramas y **esa cifra debería bajar**: sería una medición nueva, no una regresión.

## Host canónico: www

`https://www.suelosvivos.com`. El apex responde 308 hacia www, así que la decisión ya
estaba tomada por la infraestructura; el 26/08/2026 se alineó el código con ella.

Está declarado en `src/config/site.ts`, y de ahí salen `canonical`, los cuatro `hreflang`
y el `og:url` (todos en `BaseLayout.astro`), más `site` y las `customPages` del sitemap en
`astro.config.mjs`. **No se declara el host en ningún otro sitio**: si hace falta cambiarlo,
se cambia en `site.ts` y en `astro.config.mjs`, y nada más.

## Selector de idioma

`Header.astro` lo monta en desktop y en el menú móvil, a partir de `SUPPORTED_LANGS` y
`stripLangPrefix(Astro.url.pathname)`, así que lleva a **la página equivalente**, no a la
home. Son enlaces `<a href>` reales, con `hreflang` y `lang`.

**No se sustituye por un `<select>` con JavaScript ni por redirección según IP o idioma
del navegador.** Si el rastreador no puede seguir los enlaces, `/en/` y `/fr/` vuelven a
ser huérfanas, que es exactamente el estado del que se sale.

Dos tests de `tests/e2e/navigation.spec.ts` lo cubren: que enlace a `/en` y `/fr` desde la
home, y que conserve la página al cambiar de idioma.

## Lo que sigue roto y está medido, no arreglado

### Dos formas de URL compitiendo

`astro.config.mjs` no declara `trailingSlash`, así que vale `'ignore'`: `/el-programa` y
`/el-programa/` sirven las dos 200 y **cada una emite un canonical hacia sí misma**, porque
`canonical` se construye con `Astro.url.pathname`. El sitemap lista las dos formas de cada
página —19 duplicados de 39 URLs— así que le pide a Google que indexe ambas.

El arreglo es el mismo que ya lleva Orcars: `trailingSlash: 'always'` en `astro.config.mjs`,
`"trailingSlash": true` en un `vercel.json` (que este proyecto todavía no tiene) y barra
final en las `customPages`. **Cambia todas las URLs del sitio**, así que no entra sin
decidirlo aparte.
→ `internal-docs/adr/` 0001, y `.claude/rules/astro.md`

### No hay robots.txt

`/robots.txt` devuelve 404, y con él no se declara el sitemap.

### El sitemap no lista todo

Faltan `/aviso-legal` y `/politica-privacidad`. Puede ser deliberado —`rules/astro.md`
admite filtrar avisos legales— pero no está escrito en ninguna parte, así que hoy no se
puede distinguir de un olvido.

## Modificaciones

El histórico está en `Modificaciones web/Modificacionesweb.html`, en formato antiguo.
Migrarlo a `CAMBIOS.md` es parte de W6.
