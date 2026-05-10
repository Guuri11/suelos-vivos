# Project Brief — Suelos Vivos

> Rellenado durante la Fase 1 (Análisis) · Mayo 2026

---

## Datos de la empresa

| Campo | Valor |
|-------|-------|
| Nombre de la empresa | Suelos Vivos |
| Sector / industria | Formación agrícola / Agricultura regenerativa |
| Año de fundación | 2025 (proyecto de Bosque Madre, 15 años en el sector) |
| Ubicación | Costa Alicante (talleres en Tormos) |
| Web actual | Ninguna propia. Prototipo Framer: https://grounded-windows-121960.framer.app/ |
| Dominio objetivo | suelosvivos.com |
| Email de contacto | Pendiente confirmar |
| Persona de contacto | Carles (director técnico) + Camila (social media/marketing) |

## Servicios / productos

1. **Programa Anual Presencial + Online** (producto principal): 3 talleres intensivos de 16h cada uno en Tormos (Alicante) + 12 meses acompañamiento. Precio: 1.900€ único o 200€/mes × 10. Limitado a 20 plazas. Lanzamiento septiembre 2026.
2. **Acceso Online sin consultoría**: Acceso a los 3 módulos online + comunidad. Precio: 600€. Orientado a público internacional / Latinoamérica.
3. **Consultoría agrícola individualizada**: Seguimiento personalizado de finca. Incluida en el programa premium.

## Público objetivo

**Perfil principal del cliente**:
- Edad: 35–60 años
- Perfil: Agricultores profesionales en activo (propietarios de finca, gestores de explotación) con altos costes en insumos
- Ubicación: España (programa presencial) + Latinoamérica (online)
- Necesidades: Reducir costes de fertilizantes y fitosanitarios, mejorar fertilidad, ganar autonomía técnica
- Cómo llegan: Instagram, recomendaciones de Bosque Madre, cooperativas, alianzas (Biocultura, Vorasenda)

**Pain points**:
- Costes de insumos que no paran de subir
- Dependencia total de proveedores externos
- Suelos degradados que pierden fertilidad cada temporada
- Mayor presión de plagas a pesar de gastar más
- Círculo vicioso: más problemas → más insumos → más costes → menos rentabilidad

**Lo que NO vende**: ecología abstracta. Vende **reducción de costes, autonomía y rentabilidad**.

## Branding actual

### Logo
- [x] Tienen logo — archivo: `branding/logo.png`
- [ ] Disponible en vectorial (solo PNG)
- Variantes: horizontal color, horizontal blanco, ícono circular solo

**Color del logo**: Crimson/burgundy `#8B1A1A`

### Paleta de colores (guía visual v1)
- Principal: Crimson `#8B1A1A`
- Complementario: Sage green `~#7A9070`
- Fondo: Off-white cálido
- [x] Mantener colores — branding definido y cohesionado

### Tipografías (guía visual v1)
- Principal: **Cal Sans** (geométrica, archivo .ttf disponible en google-drive/DISEÑO GRAFICO/PSD/)
- Complementaria: **Poiret One** (elegante, .ttf disponible)
- [x] Mantener tipografías

### Tono de voz
- Técnico pero traducido a lenguaje práctico de campo
- Cercano y directo ("no enseñar desde arriba, sino desde al lado")
- Sin lenguaje ecologista militante ni ideológico
- Mensajes clave: "No necesitas más productos. Necesitas entender el sistema que ya tienes."

### Materiales gráficos disponibles
- [x] 15+ fotos profesionales de taller en campo (google-drive/foto cartel/)
- [ ] Foto de Carles (pendiente)
- [x] Logo PNG (branding/logo.png)
- [ ] Vídeo presentación (en producción, mayo 2026)

## Webs de referencia

| Web | Por qué |
|-----|---------|
| themarketgardener.com | Diseño simple y limpio, content-first, earth tones, legible en móvil — REFERENCIA DE DISEÑO |
| theregenacademy.com | Estructura SEO de referencia para agricultura regenerativa — REFERENCIA SEO |

## Requisitos de la web

### Páginas
- [x] `/` — Landing page / sales page larga (conversión al programa)
- [x] `/el-programa` — Detalle de los 3 talleres, temario completo, fechas
- [x] `/quienes-somos` — Carles + Bosque Madre (15 años experiencia)
- [x] `/contacto` — Formulario de inscripción (Formspree → futuro Holded)
- [x] `/aviso-legal` y `/politica-privacidad`

### Funcionalidades
- [x] Formulario de inscripción/contacto (Formspree)
- [x] Sección lead magnet (PDF "El biofertilizante más barato del mundo")
- [x] Sección testimonios
- [x] Sección precios con CTA
- [x] Vinculación a Bosque Madre
- [ ] Blog (fase 2 — clave para SEO)
- [ ] Multiidioma EN (futuro)

### SEO — Palabras clave objetivo
- "agricultura regenerativa programa formación"
- "reducir costes fertilizantes agricultura"
- "biofertilizantes caseros"
- "microbiología del suelo agricultura"
- "curso agricultura regenerativa españa"
- "cómo mejorar fertilidad del suelo"
- Schema.org: `Course` markup (como theregenacademy.com)

---

## Decisiones de branding (Fase 1 completada)

### Paleta de color definitiva

| Token | Hex | Uso |
|-------|-----|-----|
| --color-primary | #8B1A1A | Marca (crimson logo), CTAs, links activos |
| --color-primary-dark | #6B1212 | Hover del primary |
| --color-secondary | #6B8F71 | Sage green — badges, highlights, iconos |
| --color-accent | #C4622D | Terracota — urgencia, escasez de plazas |
| --color-bg | #FAFAF7 | Fondo principal — off-white cálido |
| --color-bg-alt | #F0F2EE | Fondo alternativo — sage tint suave |
| --color-bg-dark | #1E1A15 | Fondo oscuro (hero, secciones de contraste) |
| --color-text | #1E1A15 | Texto principal — earth dark |
| --color-text-muted | #6B6355 | Texto secundario |
| --color-text-inverse | #FAFAF7 | Texto sobre fondos oscuros |
| --color-border | #DDD8CE | Bordes sutiles |

### Tipografía definitiva

| Token | Fuente | Uso |
|-------|--------|-----|
| --font-display | Cal Sans (local .ttf) | H1/H2, títulos de sección |
| --font-body | DM Sans (Google Fonts) | Cuerpo, UI, navegación |
| --font-accent | Poiret One (local .ttf) | Eyebrows, labels, subtítulos elegantes |

### Estilo visual general

**Editorial · Nature-Forward · Trustworthy**

Referencia directa: themarketgardener.com. Mucho espacio blanco, tipografía grande y bold, fotografía protagonista, earth tones cálidos. Sin glassmorphism, sin gradientes complejos. El contenido manda. La estructura es clara y directa — el agricultor confía en la claridad, no en los efectos visuales.

---

## Plan de animación

### Nivel: 2 — Startup / Servicio

Scroll reveals en la landing (hero + cards talleres + testimonios). El público es práctico — las animaciones refuerzan el flujo de lectura, no distraen.

### Mapa de animación

| Qué | Decisión | Notas |
|-----|----------|-------|
| Hero entrance | Animar | Cascade: eyebrow → title → subtitle → CTA |
| Pain points (lista) | Animar | Stagger suave en items |
| Cards de talleres (3) | Animar | Scroll reveal con stagger |
| Beneficios | Animar | Scroll reveal, icons fade-in |
| Estadísticas (15 años, etc.) | Animar | Counter al entrar en viewport |
| Testimonios | Animar | Scroll reveal stagger |
| Sección precios | No animar | Claridad sobre efecto |
| Formulario | Nunca | Regla fija |
| Header hide/show | Sí (vanilla JS) | rAF + CSS transition |
| Footer | Nunca | Regla fija |

### Valores

| Propiedad | Valor |
|-----------|-------|
| Duration base | 0.8s |
| Ease | power3.out |
| Stagger | 0.12s |
| Y offset | 40px |

### Plugins GSAP

- [x] ScrollTrigger
- [x] ScrollToPlugin (CTAs internos)

---

## Plazos

| Hito | Fecha |
|------|-------|
| Brief + branding + mockups | 10 mayo 2026 |
| Desarrollo Fase 2 | 11–12 mayo 2026 |
| Deploy Vercel preview | 12 mayo 2026 |
| Web activa (deadline auditoría) | 22 mayo 2026 |

---

## Notas clave

- **CRM**: Holded (Formspree de momento, conectar a Holded después)
- **Lead magnet**: PDF "El biofertilizante más barato del mundo" — formulario en web + ManyChat Instagram
- **Video**: placeholder en home hasta que el cliente lo grabe
- **Testimonios**: sección lista con placeholders reales (en recopilación)
- **Bosque Madre**: vincular desde footer y "Quiénes Somos"
- **Telegram**: mencionar canal abierto + grupo privado alumnos como beneficio
- **Pago reserva**: 500€ de reserva al inscribirse, resto al finalizar taller 1

---

*Brief creado el 10 mayo 2026 · Proyecto Suelos Vivos*
