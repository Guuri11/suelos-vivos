# CAMBIOS — Suelos Vivos

Log de modificaciones ↔ horas imputadas. El histórico anterior a este fichero sigue en
`Modificaciones web/Modificacionesweb.html`, en el formato antiguo; migrarlo es parte
de W6 y no se ha hecho todavía.

## 2026-09-12 — Lote 3: sexto servicio

Encargo del cliente sobre `/servicios`: «añadir un 6 elemento — Formación Personalizada».
Llegó solo el título, sin descripción ni etiquetas.

- [x] C-13 · contenido · Sexto servicio **Formación personalizada** en `/servicios`:
      ficha completa con número `06`, icono propio (birrete) y tres etiquetas
- [x] C-14 · contenido · El mismo servicio en la rejilla de la home, en versión corta
- [x] C-15 · contenido · Nueva opción «Formación personalizada» en el desplegable del
      formulario de asesoría (valor `formacion-personalizada`), antes de «Otros»
- [x] C-16 · contenido · Todo lo anterior en inglés y francés

### Decisiones tomadas sin el cliente

- **El texto se ha escrito a partir de lo que ya vende.** «Formación personalizada» ya
  existía en el sitio como el tercer bloque del programa anual («atención
  individualizada, mentoría adaptada a tu caso específico»), y el brief recoge la
  consultoría individualizada como servicio 3. La ficha nueva insiste en lo mismo:
  contenidos del programa adaptados al cultivo y al manejo reales, impartidos sobre el
  terreno, con atención individual. **Pendiente de que el cliente valide el texto**: él
  solo dio el título.
- **Público: equipos, cooperativas y explotaciones.** Es el que ya nombra la propia
  página de servicios («agricultores, cooperativas, empresas agrícolas y gestores de
  territorios rurales») y el que persigue la estrategia de lanzamiento con las charlas
  en cooperativas. Sirve además para separarlo del bloque homónimo del programa anual,
  que es mentoría para los 20 alumnos: sin esa distinción, el mismo nombre significaba
  dos cosas distintas en la misma web.
- **También va a la home, aunque el encargo decía «página de servicios».** Las dos listas
  son la misma oferta y dejarlas descuadradas se nota. De paso, la rejilla de la home es
  de tres columnas: con seis tarjetas cierra las dos filas y desaparece el hueco que
  dejaba la quinta.
- **Los títulos en inglés y francés no son calcos.** En inglés es *Tailored training*
  («personalised» ya se usa en esa misma página para otra cosa); en francés, *Formation
  personnalisée*.

### Lo que queda pendiente

- **La meta description de `/servicios` sigue enumerando solo cinco servicios.** Ya son
  185 caracteres: meter el sexto la alarga más y es una decisión de SEO, no de copy. Se
  deja como está hasta el próximo sprint.

### Verificación

- `pnpm build` limpio.
- Playwright: **46/46 en verde** (los que ya había; ninguno contaba tarjetas de servicio).
- Comprobado sobre el HTML servido en los tres idiomas: seis fichas en `/servicios` con
  el `06` y el icono, seis tarjetas en la home, y ocho opciones en el desplegable con el
  valor `formacion-personalizada` en su sitio.
- **Pendiente**: repaso visual en el preview de Vercel. No se ha desplegado.

## 2026-09-12 — Lote 2: eslogan y edición online

Encargo del cliente sobre la home. Dos peticiones de copy, más un fallo que apareció al
tocar el hero en los tres idiomas.

- [x] C-08 · visual · El eslogan del hero deja de ser una sola línea a un solo tamaño:
      «Regeneremos la vida del suelo.» queda como eslogan y «El verdadero motor de la
      agricultura.» baja a un segundo nivel dentro del mismo `h1`
- [x] C-09 · bug · `home.hero` de `en.json` y `fr.json` traía copia literal de
      `servicios.hero`: las homes en inglés y francés llevaban meses abriendo con
      «¿Tienes un proyecto y quieres que te acompañemos?» en vez del eslogan. Traducido
      de verdad (eyebrow, título y primer párrafo)
- [x] C-10 · contenido · Copy nuevo de la lista de espera: «una **próxima** edición
      **100%** online». Es el texto anterior más esas dos palabras
- [x] C-11 · visual · «edición 100% online de Suelos Vivos» destacada en negrita y en el
      granate de marca (`#8B1A1A`), en la home y en `/el-programa`
- [x] C-12 · contenido · Todo lo anterior en inglés y francés

### Decisiones tomadas sin el cliente

- **La segunda línea del eslogan conserva el artículo.** El documento escribía
  «Verdadero motor de la agricultura»; se publica «El verdadero motor de la
  agricultura.», que es lo correcto en castellano. Es un cambio de forma, no de mensaje.
- **`/el-programa` se alinea con la home.** El encargo solo hablaba de la home, pero el
  banner de esa página decía «Programa 100% online próximamente» — el mismo mensaje con
  otras palabras y sin destacado. Dejarlo suelto era publicar dos versiones de lo mismo.
  Se adapta el texto de la home al tamaño de esa tarjeta, que es más pequeña.
- **El destacado usa el acento que ya tiene la página** (`#8B1A1A`), no un color nuevo:
  sobre el verde del banner contrasta y no abre un cuarto color en la home.

### Lo que no es cambio de web

- **Reenvío de `info@suelosvivos.com` a `media@bosquemadre.org`.** Es configuración del
  buzón en el proveedor de correo del dominio, no del sitio. La dirección pública del
  footer no cambia: cambia a dónde llega. Pendiente de hacer en el panel del proveedor.

### Verificación

- `pnpm build` limpio.
- Playwright: **46/46 en verde**, doce de ellos nuevos
  (`tests/e2e/copy-eslogan-waitlist.spec.ts`). La prueba del eslogan compara `font-size`
  computados, no clases: si alguien vuelve a igualar los tamaños, falla.
- **Pendiente**: repaso visual en el preview de Vercel y `squirrel audit
  --regressionSince d2bcd508`. No se ha desplegado.

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
