# Suelos Vivos — Instrucciones del proyecto

## Datos del cliente

- **Empresa**: Suelos Vivos
- **Sector**: Formación en agricultura regenerativa para agricultores profesionales
- **Producto**: programa anual de 12 meses, 20 plazas, **2.299 € de pago único**.
  Arranque en diciembre de 2026, en Tormos (Alicante). El fraccionado que figuraba aquí
  (10 cuotas de 200 € con 500 € de reserva) salió de `/el-programa`, de términos y de
  `/reserva-plaza` el 13/09/2026, pero **`/preguntas-frecuentes` lo sigue ofreciendo** y
  el cliente no ha dicho cuál de las dos versiones vale. `priceMonthly`, `installments` y
  `deposit` siguen en `site.ts` sin ningún llamante
- **Web**: https://www.suelosvivos.com
- **Contacto**: info@suelosvivos.com
- **Redes**: Instagram `@suelosvivos_com`, Telegram `t.me/bosquemadre` (canal de Bosque Madre: es el que está activo)
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

Dos lotes construidos y **sin desplegar**: el de formularios del 12–13/09/2026 y el de
cobro por web del 26/09/2026, que se apila encima. La suite pasa entera: **116 en verde**
(chromium y Mobile Chrome) el 26/09/2026. Ningún test envía formularios, así que correrla
no mete leads en el panel del cliente.

**Supabase es plan gratuito y se pausa tras 7 días sin actividad.** Pasó el 06/10/2026
y se cayeron los seis formularios; el cliente avisó antes que nosotros. Desde entonces un
cron diario de Vercel llama a `/api/keepalive` (`vercel.json`). **Sin `CRON_SECRET` en
Vercel ese endpoint responde 401 al propio cron** y la protección no existe.

**Desde el 26/09 la web ofrece pagar.** Al enviar la solicitud de `/reserva-plaza`
aparece el enlace de pago de Stripe que mandó el cliente, que cobra los 2.299 € de una
vez. Nunca antes del formulario: es ahí donde se recogen el DNI y la facturación, que el
pago por sí solo no trae. El enlace está en `site.ts` (`program.paymentLink`).
**Limitarlo a 20 pagos es cosa del cliente y sigue sin confirmar**: un payment link cobra
tantas veces como se pulse y las plazas son 20.

**La migración va antes del deploy, no después.** `insertLead()` manda las cinco
columnas nuevas en todos los inserts, así que este código sobre el esquema viejo
**rompe los seis formularios**. Aplicar
`supabase/migrations/2026-09-12-reserva-plaza.sql` primero. Detalle en `CAMBIOS.md`.

**Desde el 08/10 hay píxel de Meta, pero solo con consentimiento.** Lo carga
`src/lib/consent.ts` cuando el visitante acepta en `CookieConsent.astro`; el id está
en `site.ts`. **No se pega el snippet de Meta en el `<head>`** aunque lo pidan así: se
cargaría sin permiso. Cualquier script de medición o publicidad nuevo entra por el
mismo sitio, y se añade a la tabla de `/politica-cookies`.

**Los tests no pueden escribir en la base del cliente.** `.env` lleva las
credenciales de producción y Playwright levanta el dev server con ese fichero:
un test que envíe un formulario mete un lead en el panel del cliente.

## Cómo está montado

- **Astro** con `output: 'server'` y adaptador de Vercel
- **Tres idiomas, pero no por duplicación.** Lo dijo este fichero durante meses y es
  falso: **las 22 páginas de `src/pages/en/` y `src/pages/fr/` son reexportaciones de
  cuatro líneas** (`import Page from '../x.astro'`) y todo el texto sale de
  `src/i18n/{es,en,fr}.json`. Tocar una página **no** significa tocarla tres veces: se
  toca el `.astro` una vez y se traduce la clave en tres JSON. Comprobado el 04/09/2026
  con `grep -L "^import Page from" src/pages/{en,fr}/*.astro`, que no devuelve ninguna
- **Sanity** como CMS del blog
- **Supabase** para leads. `supabase/schema.sql` es la instalación desde cero;
  sobre la base viva mandan los ficheros de `supabase/migrations/`
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
