# CAMBIOS — Suelos Vivos

Log de modificaciones ↔ horas imputadas. El histórico anterior a este fichero sigue en
`Modificaciones web/Modificacionesweb.html`, en el formato antiguo; migrarlo es parte
de W6 y no se ha hecho todavía.

## 2026-09-13 — Encabezado de «Quiénes somos»

Encargo del cliente sobre el hero de `/quienes-somos`: cambiar el par
antetítulo/titular.

- [x] C-17 · contenido · El antetítulo pasa de «Quiénes somos» a **«Sobre nosotros»**
      y el titular, de «Nacimos del campo. / No del despacho.» a **«Quiénes somos»**
- [x] C-18 · contenido · Lo mismo en inglés y francés

### Decisiones tomadas sin el cliente

- **En inglés el titular es «Who we are», no «About us».** El antetítulo ya es
  «About us» y repetirlo dos líneas seguidas se lee como un error de copia. En
  francés pasa igual: antetítulo «À propos», titular «Qui sommes-nous».
- El maquetado no se toca: el antetítulo sigue siendo el mismo `<p class="page-eyebrow">`
  con su entrada en la línea de tiempo de GSAP. Solo cambia el texto, que vive
  en `src/i18n/{es,en,fr}.json`.

### Verificación

- `pnpm build` limpio.
- Ningún test de la suite afirma nada sobre este titular, así que no había nada
  que actualizar.

No se ha desplegado: sigue por delante la migración del lote de formularios.

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

## 12/09/2026 — Los formularios, según el documento del cliente

El cliente mandó un documento con cinco formularios, sus campos y desde dónde se
accede a cada uno. Cuatro de los cinco ya existían y coincidían campo por campo:
el documento está escrito mirando la web. Lo único nuevo era la **reserva de
plaza**, que hasta hoy no tenía formulario propio.

**Decisión del cliente: desde la web no se cobra nada.** El documento ponía
«(STRIPE)» en el bloque de pago pero luego pedía «tarjeta, PayPal o
transferencia», que es un desplegable y no una pasarela. Se recoge la preferencia
y el cobro se cierra fuera. No hay Stripe en el proyecto.

- [x] R-01 · contenido · `/reserva-plaza` nueva: datos personales, documento de
      identidad, finca y cultivo, proyecto y expectativas, método de pago
      preferido y datos de facturación
- [x] R-02 · contenido · `/contacto` deja de ser la página de reserva. Se titulaba
      «Reservar plaza — Suelos Vivos» y su eyebrow lo decía. Ahora es contacto a
      secas, conserva su formulario corto y deriva a la reserva con una tarjeta
- [x] R-03 · datos · Columnas nuevas en `leads`: `dni`, `metodo_pago`,
      `factura_nombre`, `factura_direccion`, `factura_nif`. Tipo `reserva` nuevo
- [x] R-04 · datos · Panel y CSV muestran los campos nuevos. El método de pago se
      guarda como slug y se traduce al pintarlo, para que el CSV se lea igual
      venga el lead de `/es`, `/en` o `/fr`
- [x] R-05 · bug · Los CTA «Reservar plaza» de `/el-programa` llevaban el `href`
      **escrito a mano**, sin `localePath()`: desde `/en/` y `/fr/` sacaban al
      visitante a la página en español
- [x] R-06 · bug · El botón «Solicitar asesoría» de `/el-programa` iba a
      `/contacto`, y ese formulario está en `/servicios`
- [x] R-07 · bug · El `seo.description` de los tres idiomas decía que el programa
      empieza en «septiembre 2026». Empieza en **diciembre** (`site.ts:29`)
- [x] R-08 · contenido · El footer enlazaba a la reserva pero no a contacto ni a
      servicios. Ahora da acceso a los tres formularios largos, que es lo que
      pedía el documento
- [x] R-09 · contenido · Traducción de todo lo anterior a inglés y francés

### 13/09/2026 — Respuesta del cliente sobre el DNI

**«El DNI hace falta; el contrato y el certificado se encarga Suelos Vivos por su
cuenta.»** Se planteó la objeción —en `/servicios` todavía no hay contrato ni
certificado que emitir, así que pedir el documento de identidad para responder a
una consulta es minimización de datos— y el cliente la resolvió: lo gestionan
ellos fuera de la web. Se implementa como pedía su documento.

- [x] R-10 · contenido · Documento de identidad, obligatorio, en `/servicios`
- [x] R-11 · contenido · Teléfono obligatorio en `/contacto` y en `/servicios`.
      Su documento lo marcaba con asterisco en los dos y estaba opcional: en la
      primera lectura se dijo que `/contacto` no tenía delta y era falso
- [x] R-12 · seguridad · `CAMPOS_OBLIGATORIOS` en el endpoint. El `required` del
      HTML solo lo aplica el navegador; un POST fabricado entraba con el DNI
      vacío y el lead parecía completo
- [x] R-13 · legal · La política de privacidad enumera los datos que se recogen y
      no mencionaba ni el documento de identidad ni los datos de facturación.
      Añadidos, con su finalidad y base legal, y dicho explícitamente que la web
      no procesa pagos ni recoge datos de tarjeta
- [x] R-14 · traducción de R-10 y R-11 a inglés y francés

### Lo que sigue avisado al cliente

- **El documento de identidad queda detrás de la contraseña única del panel.**
  Para nombres y emails da; para un DNI es flojo. Avisado, no bloqueante.
- **«TIENE QUE HABER 3 DIFERENTES» contradice su propia lista de cinco.** Se ha
  interpretado que cuenta los tres largos y no cuenta la pregunta de la FAQ ni el
  email de la Escuela Online. No se ha borrado ningún formulario.

### La suite no puede escribir en la base del cliente

`.env` lleva las credenciales de la Supabase de producción y Playwright levanta
el dev server con ese fichero: **cualquier test que envíe un formulario escribe
un lead en el panel del cliente**. Había dos que lo hacían y se han quitado. El
que comprueba que el endpoint rechaza una reserva sin DNI se queda, porque falla
la validación antes de llegar a la base.

No entró ningún lead falso: todos aquellos POST devolvieron 403 o 500, nunca 200.
Nos salvó justamente que el esquema esté desalineado.

### Verificación

- `pnpm build` limpio con todos los cambios de los dos días.
- Playwright: **74/74 en verde** tras el lote del 12/09. La tanda del 13/09
  cambió la suite (tests del DNI en `/servicios` y de la validación del
  endpoint, menos los dos que escribían en la base) y **está pendiente de
  pasarla entera**.
- Un test de `navigation.spec.ts` afirmaba que `/contacto` se titula «Reservar
  plaza». Se ha actualizado: era justo lo que este lote cambia.

### Antes de desplegar, en este orden

1. **Aplicar `supabase/migrations/2026-09-12-reserva-plaza.sql`.** Va primero, no
   después: `insertLead()` manda las cinco columnas nuevas en **todos** los
   inserts, así que desplegar el código sobre el esquema viejo **rompe los seis
   formularios**, no solo el de reserva, y el visitante ve el mensaje de error.
2. Repaso visual sobre el preview de Vercel.
3. `squirrel audit --regressionSince d2bcd508`.

No se ha desplegado.
