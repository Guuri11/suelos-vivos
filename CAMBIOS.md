# CAMBIOS — Suelos Vivos

Log de modificaciones ↔ horas imputadas. El histórico anterior a este fichero sigue en
`Modificaciones web/Modificacionesweb.html`, en el formato antiguo; migrarlo es parte
de W6 y no se ha hecho todavía.

## 2026-10-08 — Píxel de Meta, con aviso de cookies

Dani por WhatsApp el 08/10: que se meta el código del píxel de Meta (id
`1547305324098425`) «entre head y head».

Pegarlo tal cual habría cargado una cookie publicitaria (`_fbp`) sin consentimiento,
contra la LSSI art. 22.2, y contra la propia política de privacidad, que decía «no
utilizamos cookies de seguimiento ni publicidad de terceros». Se le explicó y se hizo
completo.

- [x] C-36 · evolutivo · Aviso de cookies propio (`CookieConsent.astro`, desde
      `BaseLayout`), en los tres idiomas. Aceptar y rechazar con el mismo estilo, sin
      muro ni casillas premarcadas. La elección se guarda 12 meses en `localStorage`
      (`sv-cookie-consent`). Estimado en 2–3 h
- [x] C-37 · evolutivo · El píxel se inyecta desde `src/lib/consent.ts` **solo** con
      consentimiento; el id vive en `site.ts` (`tracking.metaPixelId`). Sin el
      `<noscript>` del snippet: dispararía la visita sin haber podido preguntar
- [x] C-38 · evolutivo · Evento `Lead` al enviar con éxito cualquiera de los seis
      formularios (`trackLead()`), con `content_name` para distinguirlos. Solo sale si
      el píxel está cargado; nunca lleva el contenido del formulario
- [x] C-39 · contenido · Página nueva `/politica-cookies` (es/en/fr, traducida: es a la
      que enlaza el aviso). Fuera del sitemap, como las demás legales
- [x] C-40 · contenido · Política de privacidad: finalidad de medición publicitaria con
      base en el consentimiento (ap. 3), Meta como destinatario y la transferencia a
      EE. UU. por el Data Privacy Framework (ap. 6), y el apartado 7 remite a la
      política de cookies. Sigue solo en español, como antes
- [x] C-41 · contenido · En el pie, «Política de Cookies» y «Configurar cookies», que
      reabre el aviso. Retirar el consentimiento borra `_fbp`/`_fbc` y recarga

### Decisiones tomadas sin el cliente

- **`autoConfig` desactivado.** El píxel no recoge por su cuenta textos de botones ni
  metadatos de página. La web pide DNI y facturación; preferimos que Meta reciba
  solo lo que se le manda a propósito (`PageView` y `Lead`).
- **Banner propio, no una CMP de terceros** (Cookiebot, etc.): hay una sola categoría
  no técnica, y una CMP sería otro script externo y otra cuota.

### Pendiente del cliente

- **En el Administrador de eventos de Meta, desactivar la «coincidencia avanzada
  automática».** Si está activa, el píxel intenta leer email y teléfono de los campos
  de los formularios. Se configura en su cuenta, no en la web.

### Verificación

- `pnpm build` limpio. Playwright **136/136 en verde** (chromium y Mobile Chrome), con
  `cookie-consent.spec.ts` nuevo: sin elegir no sale ninguna petición a Meta, rechazar
  se recuerda, aceptar carga `fbevents.js` y persiste, los dos botones tienen la misma
  clase, retirar desde el pie borra `_fbp`, y el aviso y la política en los tres
  idiomas. Las peticiones a Meta se interceptan: el test no le manda nada.
- Capturas en escritorio y móvil sobre dev: el aviso no tapa la cabecera ni el CTA.
- **Desplegado el 08/10/2026** (`7f2b016`, push a main). Comprobado en producción con
  las peticiones a Meta bloqueadas: aviso visible, cero peticiones a Meta antes de
  aceptar, `fbevents.js` justo después, consola sin errores.

## 2026-10-06 — Formularios caídos, fuera PayPal y borrar leads

Dani por WhatsApp el 06/10: «esto no funciona», que no tienen PayPal y que el panel no
les deja borrar los leads que ya han pasado a su CRM.

- [x] C-32 · bug · **Los formularios fallaban porque Supabase había pausado el
      proyecto** tras 7 días sin actividad (plan gratuito). Restaurado a mano desde el
      dashboard el 06/10; estado *Healthy*, y la tabla `leads` tiene las 18 columnas, así
      que la migración del 12/09 está aplicada
- [x] C-33 · bug · Para que no vuelva a pasar: `/api/keepalive` hace una consulta mínima
      (`count`, sin traer filas) y `vercel.json` la programa a diario a las 07:00 UTC.
      **Necesita `CRON_SECRET` en las variables de Vercel**: sin ella el endpoint responde
      401 a todo, también al cron, y el proyecto se volvería a pausar
- [x] C-34 · contenido · Fuera PayPal del método de pago de `/reserva-plaza` (los tres
      idiomas), sin dejar ninguna referencia: no había ningún lead que lo
      hubiera elegido (revisado en la tabla de Supabase el 06/10)
- [x] C-35 · evolutivo · Borrar leads desde el panel: casilla por fila, «seleccionar
      todo», botón «Borrar seleccionados» con confirmación. Borrado real, sin papelera.
      Estimado en 1–1,5 h

### Decisiones tomadas sin el cliente

- **Borrar, no marcar.** Se planteó marcar como «pasado al CRM» y archivar; se eligió
  borrar porque es lo que pide y porque no deja una segunda copia del DNI y de los datos
  de facturación una vez están en su CRM. Marcar exigía además una migración.

### Lo que no es cambio de web

- Upgrade a Supabase Pro (25 $/mes) quita la pausa sin cron. No se ha propuesto: el cron
  lo resuelve gratis.

### Verificación

- `pnpm build` limpio. Playwright **122/122 en verde** (chromium y Mobile Chrome), con
  tres tests nuevos en `panel.spec.ts` que no llegan a la base: borrar sin sesión manda
  al login, el keepalive sin secreto da 401 y `vercel.json` lo programa.
- **No se ha enviado un formulario de verdad** contra producción: metería un lead real en
  su panel. Pendiente de hacerlo sobre el preview y borrarlo después con el botón nuevo,
  que de paso queda probado.

## 2026-09-26 — Cobrar desde la web

Encargo del cliente por WhatsApp. El 16/09 mandó un enlace de pago de Stripe sin decir
dónde ponerlo; la propuesta se le mandó el 18/09 y la aprobó el 24/09, junto con dos
peticiones nuevas.

- [x] C-26 · evolutivo · El mensaje de «solicitud recibida» de `/reserva-plaza` ofrece
      pagar la plaza. El enlace vive en `site.ts` (`program.paymentLink`), como el resto
      de datos del cliente
- [x] C-27 · contenido · Los dos textos que prometían lo contrario: el subtítulo del hero
      («cerrar contigo la forma de pago») y `reserva.form.pagoIntro` («desde la web no se
      cobra nada»)
- [ ] C-28 · contenido · **No entra.** Se llegó a cambiar la pregunta 21 de la FAQ («Sí.
      Está previsto ofrecer pago fraccionado…») por «escríbenos y lo estudiamos contigo»,
      y se revirtió al texto de producción. El cambio se anunció a Dani el 18/09 con un
      «si no es así, dímelo» y **él no contestó a ese párrafo**: su «propuesta aprobada»
      iba pegada al del botón de pago. Silencio no es aprobación, y menos para cambiar lo
      que el cliente ofrece comercialmente
- [x] C-29 · contenido · `/terminos-y-condiciones`, apartado 3: el pago con tarjeta por
      la pasarela de Stripe queda escrito. `/politica-privacidad` nombra a Stripe como
      proveedor de pago
- [x] C-30 · contenido · Fuera el documento de identidad del formulario de asesoría de
      `/servicios`: el campo, su validación en el endpoint y la frase de la política de
      privacidad que lo declaraba
- [x] C-31 · contenido · Los inscritos en el programa anual tendrán acceso a la edición
      online cuando se lance. Va en la lista de «qué incluye» de `/el-programa` y en los
      dos banners de lista de espera (home y programa)

### Por qué el botón va ahí y no en la tarjeta de precio

Fue la pregunta del cliente y la respuesta está en dos sitios del propio código. El
formulario pide **DNI** —lo necesita para el contrato y el certificado oficial— y los
datos de facturación; el enlace de Stripe no pide ninguna de las dos cosas. Un botón de
pagar antes del formulario deja un cobro sin los datos que lo acompañan.

Y son **20 plazas**: un payment link cobra tantas veces como se pulse. Limitarlo a 20
pagos es un interruptor del panel de Stripe y **lo tiene que hacer el cliente**. Está
pedido el 18/09 y **sin confirmar**.

### Decisiones tomadas sin el cliente

- **El enlace abre en pestaña nueva** (`target="_blank" rel="noopener"`). El visitante
  acaba de enviar la solicitud: si el pago se lleva la pestaña y luego se arrepiente, se
  pierde el mensaje de confirmación y no sabe si la solicitud llegó.
- **El bloque de éxito pasa de `<p>` a `<div>`**, porque ahora tiene tres hijos. El
  script sigue funcionando sin tocarlo: solo quita la clase `hidden` por `id`, y el `id`
  no cambia. El camino sin JavaScript (`?enviado=reserva`) tampoco.
- **El precio del botón sale de `site.ts`**, no escrito a mano, y con el mismo formato
  que la ficha de «Inversión» de esa misma página (`2299€`).
- **`metodo_pago` se queda con sus tres opciones.** Ahora que hay pago con tarjeta en el
  sitio, el desplegable podría sobrar, pero sigue sirviendo para quien elige
  transferencia o PayPal, que se cierran por teléfono como hasta hoy.
- **«Acceso a la edición online cuando se lance» entra en la lista de lo que incluye el
  precio.** El cliente dijo «tendrán acceso» sin decir si va incluido; puesto en esa
  lista se lee como incluido. **Si no lo está, esa línea tiene que salir de ahí**: es la
  única de las seis que promete algo que no se ha confirmado.
- **La política de privacidad nombra a Stripe.** No estaba en el encargo, pero la página
  enumera qué datos se tratan y quién los recibe, y ahora hay un proveedor de pago que
  antes no existía. La frase «esta web no procesa pagos ni recoge datos de tarjeta»
  sigue siendo cierta y se queda.
- **Las claves de i18n del DNI de asesoría no se borran** (`servicios.form.dniLabel`,
  `dniPlaceholder`, `dniHelp`, en los tres idiomas), por lo mismo que las del
  fraccionado en el lote del 13/09: borrarlas convierte un cambio reversible en uno que
  hay que traducir otra vez.

### Lo que hay que preguntarle

- **El fraccionado, de una vez.** `/preguntas-frecuentes` sigue siendo **la única página
  del sitio que lo ofrece** («Sí. Está previsto ofrecer pago fraccionado…») y contradice
  a `/el-programa`, a `/terminos-y-condiciones` y a `/reserva-plaza`, que lo perdieron el
  13/09/2026. Lleva abierto desde entonces. Ahora además choca con un botón de pago que
  cobra los 2.299 € de una vez.
- **El límite de 20 pagos en Stripe sigue sin confirmar.** Es lo único del lote que no
  depende de nosotros.
- **«Edición 2027».** El producto de Stripe se llama así y el cliente confirmó el 24/09
  que el nombre está bien, pero **la web no lo usa en ninguna parte**: `site.ts` dice
  «Diciembre 2026» y la tarjeta de precio, «Programa completo 2026–2027». No se ha
  tocado nada: renombrar la edición es un encargo aparte.

### Verificación

- Playwright: **116/116 en verde** en chromium y Mobile Chrome. Son 10 más que el
  13/09: el botón de pago en los tres idiomas, que sin enviar la solicitud no hay botón
  visible, y que el endpoint ya no exige DNI en la asesoría.
- El botón se comprueba sobre `?enviado=reserva`, que es el camino sin JavaScript: **no
  se envía ningún formulario**, así que la suite sigue sin escribir en Supabase.
- `pnpm build` limpio.
- **Ojo con el puerto**: la suite se corrió contra un `astro dev` de otro proyecto que
  llevaba desde el 21/09 ocupando el 4321, y daba 404 en todo. `reuseExistingServer` no
  comprueba qué hay al otro lado. Si la suite falla entera, mirar eso antes que el código.
- **Pendiente**: el repaso en el preview de Vercel. Sigue sin poder hacerse, por lo
  mismo que el 13/09: el despliegue está bloqueado por
  `supabase/migrations/2026-09-12-reserva-plaza.sql`.

No se ha desplegado.

## 2026-09-13 — Favicon propio

- [x] C-25 · visual · El sitio deja de usar el logotipo horizontal como icono de
      pestaña. El cliente mandó su emblema suelto (`png flavicon.png`, 515x515) y
      pasa a ser `public/favicon.png`. Cambiado en los dos layouts, el público y el
      del panel

### Decisiones tomadas sin el cliente

- **El fichero venía en blanco puro sobre transparencia**: todos sus píxeles opacos
  son `#FFFFFF`. Así montado desaparece en la pestaña clara de Chrome, que es la que
  ve la mayoría. Se ha compuesto sobre una teja redondeada del granate de marca
  (`--color-primary`, `#8B1A1A`), que es el color del propio logotipo. **El dibujo
  del cliente no se ha recoloreado**: solo se le ha puesto fondo. Se ha comprobado
  que es legible a 16 y a 32 px sobre pestaña clara y oscura.
- Se añade también `public/apple-touch-icon.png` (180x180, a sangre y opaco, porque
  iOS aplica su propia máscara). Sin él, al añadir la web a la pantalla de inicio,
  iOS usaba una captura de la página.
- `/images/logo.png` **no se toca**: sigue siendo el logotipo del header y lo que
  declara `site.ts`. Lo que cambia es solo qué fichero hace de icono.

### Verificación

- Playwright: **106/106 en verde**. Con esta pasada queda hecha la suite completa que
  el lote del 13/09 dejó pendiente.
- `pnpm build` limpio. `/favicon.png` y `/apple-touch-icon.png` devuelven 200 y
  llegan a `.vercel/output/static/`. No envía formularios: no escribe en Supabase.
- Falta el repaso sobre el preview de Vercel, que no puede hacerse todavía: el
  despliegue sigue bloqueado por la migración `2026-09-12-reserva-plaza.sql`.

## 2026-09-13 — El retrato de Carles Pons

- [x] C-24 · contenido · `/quienes-somos`, ficha del formador: el cliente mandó por fin
      el retrato. `trainerPhoto` deja de ser `null` y la ficha vuelve a dos columnas,
      que es exactamente para lo que estaba preparada desde el 03/09/2026. Los tres
      idiomas lo heredan: `/en/` y `/fr/` reexportan la misma página, y el `alt` ya
      estaba traducido en los tres JSON

### Decisiones tomadas sin el cliente

- El original viene en 2:3 (1066x1600) y el hueco de la ficha es 4:5. Se recortó
  arrastrando el encuadre hacia arriba, no al centro, para dejar aire sobre la cabeza:
  el recorte centrado que habría hecho `object-cover` se la comía por poco. Guardado a
  800x1000, 130 KB, en `public/images/carles-pons.jpg`.

### Verificación

- `tests/e2e/navigation.spec.ts` «quienes-somos shows the trainer profile» en verde.
  Build completa sin avisos nuevos. No envía formularios: no escribe en Supabase.

## 2026-09-13 — El «TODO: TBF» que estaba en producción

- [x] C-23 · contenido · `/el-programa`, extracto de preguntas frecuentes: la tercera
      («¿Incluye alojamiento y comida?») respondía literalmente **`TODO: TBF`**, y lo
      hacía en los tres idiomas. Ahora responde que no están incluidos, en la línea de
      la respuesta larga de `/preguntas-frecuentes`

Las 21 preguntas de `/preguntas-frecuentes` ya coincidían con el texto que mandó el
cliente, agrupadas en cinco bloques. El repaso solo encontró este hueco.

### Decisiones tomadas sin el cliente

- Donde su texto dice «contratar una **consultoría**», la web sigue diciendo
  «**asesoría** personalizada» (respuesta 14). Es el nombre del servicio en
  `/servicios` y en el menú; cambiar la palabra solo en la FAQ rompería la pista que
  lleva de la pregunta a la página que la resuelve.
- Su respuesta 21 se contradice a sí misma («Podrá contemplarse… Si está previsto…»).
  Queda en la forma afirmativa, que es la que repite dos veces.

### Lo que hay que preguntarle

**El pago fraccionado vuelve o no vuelve.** Hoy mismo, en el lote C-19/C-20/C-21, se
quitó de la tarjeta de `/el-programa`, de `/terminos-y-condiciones` y de la ficha de
`/reserva-plaza`. La respuesta 21 de este texto dice que sí se ofrece. Ahora mismo es
la **única** mención al fraccionado que queda en toda la web, y contradice a las tres
páginas que acaban de perderlo. No se toca hasta que él diga cuál de las dos vale.

### Verificación

- `tests/e2e/preguntas-frecuentes.spec.ts` (nuevo): 28 en verde en chromium y
  Mobile Chrome. Cubre las 21 preguntas y sus cinco grupos en los tres idiomas, que
  el JSON-LD de `FAQPage` las lleve todas y sin respuestas vacías, el buscador con
  y sin resultados, y que no quede ningún marcador de relleno en `/preguntas-frecuentes`
  ni en `/el-programa`. Ninguno envía formularios: no escriben en Supabase.

## 2026-09-13 — Los grupos de la FAQ, en granate

- [x] C-22 · diseño · Los cinco títulos de categoría de `/preguntas-frecuentes`
      («Para quién es», «Cómo funciona el programa», «Resultados», «Asistencia y
      formato», «Inscripción y condiciones») pasan de tinta a **granate primario**
      (`#8B1A1A`, el `--color-primary` de `global.css`)

Es un solo `h2` en el marcado: los títulos salen de `faq.groups[].title`, así que
el cambio vale para los tres idiomas sin tocar traducciones.

### Verificación

- `pnpm build` limpio.

## 2026-09-13 — Fuera el pago fraccionado

- [x] C-19 · contenido · La tarjeta de precio de `/el-programa` pierde la columna
      del fraccionado (200 €/mes × 10 y «Reserva con 500 €») y el «o» que la
      separaba. Queda solo el pago único de 2.299 €
- [x] C-20 · contenido · `/terminos-y-condiciones`, apartado «3. Precio y forma de
      pago»: desaparece el punto «Pago fraccionado». La lista de dos se queda en un
      párrafo, porque una lista de un solo elemento no es una lista
- [x] C-21 · contenido · `/reserva-plaza`, ficha «Inversión»: de «2.299 € o 200 €/mes
      × 10» a «2.299 €»

### Decisiones tomadas sin el cliente

- La etiqueta «Pago único» se queda en las dos páginas: sigue siendo cierta y, si
  el fraccionado vuelve, la tarjeta de `/el-programa` está montada para dos columnas.
- **Las claves de i18n del fraccionado no se borran** (`home.pricing.payMonthly`,
  `or`, `perMonth`, `monthsLabel`, `reservaWith`, en los tres idiomas). Ahora no
  las llama nadie, pero borrarlas convierte un cambio reversible en uno que hay
  que traducir otra vez. Igual que `elPrograma.cta.fractioned*`, que ya estaban
  muertas antes de este lote.
  Lo mismo con `reserva.info.inversionSep` e `inversionMesSuffix`, que se quedan
  huérfanas en `/reserva-plaza`.

### Lo único que sigue anunciándolo

**`/preguntas-frecuentes`**: «¿Hay posibilidad de pago fraccionado o financiación?»
→ «Sí. Está previsto ofrecer pago fraccionado…». No estaba en el encargo y no se ha
tocado, pero ahora es la única página del sitio que lo ofrece.

`priceMonthly`, `installments` y `deposit` siguen en `site.ts` sin ningún llamante:
se quedan por lo mismo que las claves de i18n. Si el fraccionado no vuelve, salen
juntos en una limpieza.

### Verificación

- `pnpm build` limpio.
- Ningún test afirma nada sobre la tarjeta de precio.

No se ha desplegado.

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
