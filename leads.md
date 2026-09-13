# Leads de los formularios

Los seis formularios del sitio guardan cada envío en **Supabase** (tabla `leads`).
Se consultan y se exportan desde el panel privado `/panel-suelos`.

Sustituye a la antigua integración con Holded, que ya no está activa.

## Formularios y su etiqueta

Cada formulario manda un campo oculto `tipo` que es lo que permite segmentarlos
en el panel. También manda `lang`, así se sabe si el lead llegó desde la versión
en español, inglés o francés.

| `tipo` | Formulario | Página |
|---|---|---|
| `reserva` | Reserva de plaza | `/reserva-plaza` |
| `contacto` | Contacto | `/contacto` |
| `asesoria` | Solicitud de asesoría | `/servicios` |
| `faq` | Pregunta abierta desde las preguntas frecuentes | `/preguntas-frecuentes` |
| `waitlist-home` | Escuela Online — banner «¿No puedes desplazarte?» | `/` |
| `waitlist-programa` | Escuela Online — banner «¿No puedes desplazarte?» | `/el-programa` |

## Los obligatorios los valida el servidor

`CAMPOS_OBLIGATORIOS` en `src/pages/api/contact.ts` dice qué campos exige cada
formulario. El `required` del HTML solo lo aplica el navegador: un POST sin
JavaScript, o fabricado, entra igual. Con el documento de identidad como campo
obligatorio eso deja de ser cosmético — un lead con `dni` a null es un lead que
el cliente cree completo y no lo está.

## Reserva de plaza: no se cobra aquí

El formulario de `/reserva-plaza` recoge el documento de identidad, el método de
pago **preferido** y los datos de facturación. El de `/servicios` recoge también
el documento de identidad: lo confirmó el cliente el 13/09/2026, y el contrato y
el certificado oficial los emite Suelos Vivos por su cuenta, fuera de la web. **Desde la web no se cobra nada**
(decisión del cliente, 12/09/2026): `metodo_pago` es una declaración de
preferencia, el cobro se cierra fuera y no hay ninguna pasarela conectada. En la
tabla no hay —ni debe haber— un solo dato de tarjeta.

`metodo_pago` guarda el slug (`tarjeta`, `paypal`, `transferencia`), no la
etiqueta traducida: así el panel y el CSV se leen igual venga el lead de `/es`,
`/en` o `/fr`. La traducción a texto la hace `paymentMethodLabel()` en
`src/lib/leads.ts`.

Si algún día se cobra de verdad, esto no se amplía: una reserva pagada tiene
estado (pendiente, pagada, fallida) y un lead no, así que va en su propia tabla.

## Panel

`https://suelosvivos.com/panel-suelos` — contraseña única (`ADMIN_PANEL_PASSWORD`).
La sesión dura 7 días.

- Pestañas para filtrar por tipo de formulario, con el total de cada uno.
- Botón **Descargar CSV**, que respeta el filtro activo.
- El CSV lleva separador `;` y BOM UTF-8: se abre directamente en Excel en
  español (columnas separadas y tildes correctas) y se puede subir a Google
  Sheets con *Archivo → Importar*.

El panel está excluido del sitemap y marcado `noindex`.

## Puesta en marcha

1. Crear el proyecto en [supabase.com](https://supabase.com) y ejecutar
   `supabase/schema.sql` en el **SQL Editor** (una sola vez).
2. En *Project Settings → API*, copiar la URL y la **secret key**
   (`sb_secret_…`, no la publishable — el insert va server-side saltándose RLS).
3. Rellenar en `.env` y en las variables de entorno de Vercel:

   | Variable | Qué es |
   |---|---|
   | `SUPABASE_URL` | URL del proyecto |
   | `SUPABASE_SERVICE_ROLE_KEY` | secret key |
   | `SESSION_SECRET` | clave HMAC de la cookie (`openssl rand -hex 32`) |
   | `ADMIN_PANEL_PASSWORD` | contraseña del panel para el cliente |

Si faltan las dos primeras, la web no rompe: los formularios responden bien pero
no guardan nada, y el panel avisa de que Supabase no está configurado.

## Seguridad

- RLS activado en `leads` **sin ninguna policy**: nadie puede leer la tabla desde
  el navegador. Solo el backend, con la service_role key, entra.
- Ninguna variable lleva prefijo `PUBLIC_`, así que nada de Supabase llega al
  cliente.
- Los formularios conservan el honeypot `_gotcha`: si viene relleno se responde
  `200` para no dar pistas al bot, pero no se guarda el registro.
- **El documento de identidad vive detrás de una contraseña compartida.** El
  panel entra con una sola clave y sesión de siete días. Para nombres y emails
  da; para DNI/NIE/pasaporte es flojo, y está avisado al cliente. Si alguna vez
  se endurece el acceso al panel, este es el motivo.
- El campo `privacy` guarda el consentimiento RGPD. Los seis formularios llevan
  la casilla obligatoria del componente `src/components/ConsentCheckbox.astro`,
  que enlaza a la política de privacidad y a los términos y condiciones.
- En el CSV, los valores que empiezan por `=`, `+`, `-` o `@` se escapan para que
  Excel no los interprete como fórmulas.
