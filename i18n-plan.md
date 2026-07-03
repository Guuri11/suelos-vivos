# Plan de i18n — Suelos Vivos (ES / EN / FR)

## Estado actual

| Qué | Estado |
|-----|--------|
| `astro.config.mjs` — routing i18n | ✅ configurado (`es` sin prefijo, `/en/`, `/fr/`) |
| `src/i18n/utils.ts` — `t()`, `getLang()`, `localePath()` | ✅ existe |
| `src/i18n/es.json` / `en.json` / `fr.json` | ✅ completos — nav + footer + blog + home + elPrograma + quienesSomos + SEO stubs contacto/servicios/legal |
| Stubs EN/FR (`/en/*.astro`, `/fr/*.astro`) | ✅ re-exportan la página ES (patrón válido: `Astro.currentLocale` se pasa por contexto) |
| `Header.astro` / `Footer.astro` | ✅ 100% i18n |
| `index.astro` | ✅ 100% i18n — hero, problem, workshops, audience, gallery, benefits, about, services, pricing |
| `el-programa.astro` | ✅ 100% i18n — hero, overview, workshops×3, mentoring, cta |
| `quienes-somos.astro` | ✅ 100% i18n |
| `contacto.astro` | ✅ 100% i18n |
| `servicios.astro` | ✅ 100% i18n |
| `blog/index.astro` | ✅ 100% i18n — Sanity query con coalesce + todas las UI strings |
| `blog/[slug].astro` | ✅ 100% i18n — Sanity body/title/excerpt/seo con coalesce[$lang] |
| `aviso-legal.astro` / `politica-privacidad.astro` | ✅ SEO meta i18n — cuerpo en ES (decisión: mantener en español) |

## Patrón a seguir (mismo que orcars)

Cada página ES:
```astro
---
import { getLang, t } from '@/i18n/utils';
const lang = getLang(Astro.currentLocale);
---
<h1>{t(lang, 'home.hero.title')}</h1>
```

Los stubs EN/FR quedan tal cual — `Astro.currentLocale` dentro del componente refleja la ruta (`/en/` → `'en'`).

Para arrays/objetos en JSON, `t()` devuelve `any`:
```astro
{(t(lang, 'home.painPoints.items') as PainPoint[]).map(item => (...))}
```

---

## Fase 1 — Header + Footer ✅ COMPLETADO

**Archivos:** `src/components/Header.astro`, `src/components/Footer.astro`

Claves: `nav.*`, `footer.*` (tagline, links, copyright, ubicacion)

---

## Fase 2 — `index.astro` ✅ COMPLETADO

Secciones: `home.hero`, `home.problem`, `home.workshops`, `home.audience`, `home.gallery`, `home.benefits`, `home.about`, `home.services`, `home.pricing`

---

## Fase 3 — `el-programa.astro` ✅ COMPLETADO

### Claves implementadas

#### `elPrograma.hero`
- `eyebrow`, `title` (con `<br />` → `set:html`), `subtitle`

#### `elPrograma.overview`
- `items` — array de 3 objetos `{ value, label, desc }`

#### `elPrograma.workshops`
- `topicsLabel` — "Contenidos" / "Topics" / "Contenu"
- `items` — array de 3 talleres `{ number, date, title, desc, imgAlt, topics[] }`

#### `elPrograma.mentoring`
- `title`
- `items` — array de 3 objetos `{ title, desc }`

#### `elPrograma.cta`
- `title`
- `startPrefix`, `spotsPrefix`, `spotsPostfix` — partes del subtítulo dinámico con `siteConfig`
- `btn`, `btnSuffix` — partes del botón con precio de `siteConfig`
- `fractionedPrefix`, `fractionedMid`, `fractionedSuffix` — texto del fraccionado

---

## Fase 4 — `quienes-somos.astro` ✅ COMPLETADO

### Claves implementadas

#### `quienesSomos.hero`
- `eyebrow`, `title` (con `<br />` → `set:html`), `subtitle`

#### `quienesSomos.story`
- `title`
- `paragraphs[]` — array de strings con HTML (`<strong>`) → `set:html` por ítem

#### `quienesSomos.values`
- `title`
- `items[]` — array de `{ title, desc }`

#### `quienesSomos.location`
- `eyebrow`, `title`, `desc1`, `desc2`, `place`

#### `quienesSomos.bosqueMadre`
- `eyebrow`, `title`, `desc`, `linkText`

#### `quienesSomos.cta`
- `title`
- `startPrefix`, `spotsPrefix`, `spotsPostfix` — partes del subtítulo dinámico con `siteConfig`
- `btn`

---

## Fase 5 — `contacto.astro`

### `contacto.hero`
- `eyebrow`, `title`, `subtitle`

### `contacto.info`
- `emailLabel`, `email`
- `whatsappLabel`, `whatsapp`
- `locationLabel`, `location`

### `contacto.form`
- Labels: `nombre`, `email`, `telefono`, `explotacion`, `hectareas`, `tipoProductor`, `cultivos`, `mensaje`, `privacidad`
- Placeholders de cada campo
- `submit`, `sending`, `successTitle`, `successDesc`, `errorMsg`

### `contacto.faq`
- `title`
- `items[]` — `{ question, answer }`

---

## Fase 6 — `servicios.astro`

### `servicios.hero`
- `eyebrow`, `title`, `subtitle`

### `servicios.services`
- `items[]` — array de servicios `{ title, desc, features[], price, cta }`

### `servicios.process`
- `eyebrow`, `title`
- `steps[]` — `{ number, title, desc }`

### `servicios.cta`
- `title`, `subtitle`, `btn`

---

## Fase 7 — `blog/index.astro`

Las claves `blog.*` ya existen en los JSONs. Verificar que la página las usa todas (algunas pueden estar hardcodeadas todavía).

Claves que ya existen: `blog.header.*`, `blog.readMore`, `blog.noArticles`, `blog.empty1/2`, `blog.contactCta`, `blog.topicsTitle`, `blog.topic1-5`

---

## Fase 8 — `blog/[slug].astro`

El contenido de los artículos viene de Sanity CMS. Dos opciones:
- **Opción A (recomendada):** Añadir campos `titleEn`, `titleFr`, `bodyEn`, `bodyFr` en el schema de Sanity → el slug page renderiza según `lang`
- **Opción B (simple):** Solo ES por ahora, añadir banner "Este artículo solo está disponible en español" en EN/FR

Las claves `blog.detail.*` ya están en los JSONs (autor, CTA, botón volver).

---

## Fase 9 — `aviso-legal.astro` + `politica-privacidad.astro`

Texto legal — **baja prioridad**. Opciones:
- Traducir completo (mucho volumen)
- Solo ES para todos los idiomas (lo más habitual en webs pequeñas)

Recomendación: dejar en ES y añadir una nota discreta "Legal notice (Spanish)" en EN/FR.

---

## Orden de ejecución sugerido

1. ~~**Fase 1** — verificar Header + Footer~~ ✅
2. ~~**Fase 2** — index.astro (impacto mayor, es la home)~~ ✅
3. ~~**Fase 3** — el-programa.astro (página clave de venta)~~ ✅
4. ~~**Fase 4** — quienes-somos.astro~~ ✅
5. ~~**Fase 5** — contacto.astro (formulario — importante para conversión)~~ ✅
6. ~~**Fase 6** — servicios.astro~~ ✅
7. ~~**Fase 7** — verificar blog/index.astro~~ ✅
8. ~~**Fase 8** — blog/[slug].astro (Sanity coalesce[$lang])~~ ✅
9. ~~**Fase 9** — aviso-legal + privacidad (SEO meta i18n, cuerpo en ES)~~ ✅

## ✅ i18n COMPLETO — pnpm build limpio

## Notas técnicas

- Arrays en JSON → tipar inline en el .astro: `(t(lang, 'home.problem.items') as Array<{title: string; desc: string}>)`
- HTML en traducciones (p.ej. `<br/>` en títulos) → usar `set:html={t(lang, 'key')}` en lugar de `{t(lang, 'key')}`
- HTML en arrays (p.ej. `<strong>` en párrafos) → iterar y usar `set:html` por ítem: `{(t(lang, 'key.paragraphs') as string[]).map(p => <p set:html={p} />)}`
- Datos dinámicos de `siteConfig` (precio, plazas, fecha) → intercalar con claves i18n partidas: `{t(lang, 'key.prefix')} {siteConfig.value} {t(lang, 'key.suffix')}`
- Después de cada fase: `pnpm build` para verificar que no hay errores de TypeScript
