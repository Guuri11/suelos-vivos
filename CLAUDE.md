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
- **Tres idiomas, pero no por duplicación.** Lo dijo este fichero durante meses y es
  falso: **las 22 páginas de `src/pages/en/` y `src/pages/fr/` son reexportaciones de
  cuatro líneas** (`import Page from '../x.astro'`) y todo el texto sale de
  `src/i18n/{es,en,fr}.json`. Tocar una página **no** significa tocarla tres veces: se
  toca el `.astro` una vez y se traduce la clave en tres JSON. Comprobado el 04/09/2026
  con `grep -L "^import Page from" src/pages/{en,fr}/*.astro`, que no devuelve ninguna
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

**Cuánto cuesta, ya medido** (auditoría `b52dfa3f`, 26/08 tras desplegar W6, 56 páginas):
esto no es orden cosmético. De los avisos nuevos que salieron al hacerse visibles `/en/` y
`/fr/`, **40 los causa esta ambigüedad y nada más**:

- **18 × `hreflang-self`** — las páginas afectadas son todas la forma **con** barra
  (`/el-programa/`, `/en/`, `/en/blog/`…). El HTML que sirven declara los `hreflang` hacia
  la forma **sin** barra, así que para esa URL no hay autorreferencia. El clúster de
  idiomas está bien escrito; lo rompe que la URL tenga dos formas.
- **22 × `duplicate-title`** — «el programa — suelos vivos» en 2 páginas, «blog — suelos
  vivos» en 6. No son títulos repetidos: es la misma página contada dos veces.

Los `hreflang` en sí son correctos y el host ya es el bueno. Lo único que queda entre esto
y un clúster de tres idiomas sin un solo aviso es elegir una forma de URL.

### No hay robots.txt

`/robots.txt` devuelve 404, y con él no se declara el sitemap.

### El sitemap no lista todo

Faltan `/aviso-legal` y `/politica-privacidad`. Puede ser deliberado —`rules/astro.md`
admite filtrar avisos legales— pero no está escrito en ninguna parte, así que hoy no se
puede distinguir de un olvido.

Con `/en/` y `/fr/` ya visibles son **9 páginas** fuera del sitemap: las legales en los tres
idiomas y **`/blog/prunus-avium-cerezo-silvestre-o-cerezo-de-los-pajaros`, también en los
tres**. Ese último no encaja con la explicación de «filtramos las legales»: es un post de
blog, y en el baseline anterior ya salía además como página huérfana. Las legales pueden
ser una decisión; esa no lo parece.

## Modificaciones

El histórico antiguo está en `Modificaciones web/Modificacionesweb.html`. Migrarlo es
parte de W6 y sigue sin hacerse. Lo nuevo se anota en `CAMBIOS.md`, que existe desde el
lote del 04/09/2026.
