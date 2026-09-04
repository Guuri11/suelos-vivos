# CAMBIOS — Suelos Vivos

Log de modificaciones ↔ horas imputadas. El histórico anterior a este fichero sigue en
`Modificaciones web/Modificacionesweb.html`, en el formato antiguo; migrarlo es parte
de W6 y no se ha hecho todavía.

## 2026-09-04 — Lote 1: «Sobre nosotros»

Encargo de Dani Galiano por WhatsApp (03/09/2026) sobre el copy que el cliente dejó en
su documento. Falta la foto de grupo definitiva y el retrato de Carles: se entrega con
lo que hay y se sustituye cuando lleguen.

- [x] C-01 · contenido · Bloque de apertura de `/quienes-somos` (misión + tres párrafos)
- [x] C-02 · contenido · Reescritura de historia, valores y «el lugar» con el copy nuevo
- [x] C-03 · contenido · Ficha del formador principal: Carles Pons, CV y áreas de trabajo
- [x] C-04 · contenido · Cierre a dos botones: «Ver el programa» y «Solicitar asesoría»
- [x] C-05 · bug · El `alt` de la foto de equipo de la home decía «Carles Casanova —
      Fundador», y ni es un retrato ni ese es el nombre. Corregido en los tres idiomas
- [x] C-06 · contenido · Traducción de todo lo anterior a inglés y francés
- [x] C-07 · interno · `public/images/driver-prueba/` → `public/images/finca/`

### Decisiones que tomó el cliente

- **El nombre es Carles Pons.** El documento traía «[Nombre Apellido] Carlos Pons» y la
  web viva tenía dos variantes en paralelo. Queda una sola en todo el sitio.
- **La finca cambia de relato.** El copy anterior decía «no es un espacio experimental
  creado para el programa, es una explotación agrícola en activo». El nuevo dice justo
  lo contrario: espacio experimental, en desarrollo desde 2026. Se publica el nuevo por
  decisión del cliente. Los «más de 15 años» pasan a ser de la experiencia de Carles,
  no de esa parcela.

### Lo que queda pendiente de material del cliente

- **Foto de grupo definitiva.** Mientras tanto se usa la que ya salía en la home
  (`/images/finca/11-05-26_53.jpg`), que es una foto real del equipo en el campo.
- **Retrato de Carles Pons.** No hay ninguno. La ficha se pinta a una columna: no hay
  hueco gris en producción. Cuando llegue la foto, se pone su ruta en `trainerPhoto`
  (`src/pages/quienes-somos.astro`) y la ficha vuelve sola a dos columnas.
- Para «el lugar» no hacía falta hueco: esa sección ya tiene cuatro fotos de Tormos.

### Verificación

- `pnpm build` limpio.
- Playwright: **34/34 en verde**, seis de ellos nuevos (ficha del formador y destino de
  los dos botones en `/`, `/en/` y `/fr/`).
- HTML servido comprobado en los tres idiomas: título, `h1`, secciones y canonical
  autorreferencial correctos.
- **Pendiente**: repaso visual en navegador sobre el preview de Vercel, y
  `squirrel audit --regressionSince`. No se ha desplegado.
