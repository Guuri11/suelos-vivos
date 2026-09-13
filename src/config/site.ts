export const siteConfig = {
  name: 'Suelos Vivos',
  tagline: 'La agricultura del futuro',
  description: 'Programa anual de formación en agricultura regenerativa para agricultores profesionales. Reduce costes 30–50%, recupera la fertilidad de tu suelo y gana autonomía técnica.',
  url: 'https://www.suelosvivos.com',

  contact: {
    email: 'info@suelosvivos.com',
    phone: '',
    address: 'Tormos, Alicante',
  },

  social: {
    instagram: 'https://www.instagram.com/suelosvivos_com',
    telegram: 'https://t.me/bosquemadre',
    youtube: '',
  },

  program: {
    spots: 20,
    spotsLeft: 20,
    price: 2299,
    priceMonthly: 200,
    // months = duración del acompañamiento; installments = cuotas del pago
    // fraccionado. Son números distintos: 12 meses de programa, 10 cuotas.
    months: 12,
    installments: 10,
    deposit: 500,
    startDate: 'Diciembre 2026',
    location: 'Tormos, Alicante',
  },

  logo: {
    src: '/images/logo.png',
    // El fichero es 512x165 (ratio 3,10). Aqui decia 160x44 (ratio 3,64), y como en
    // el header se pinta con `h-9 w-auto` el navegador reservaba el hueco con el ratio
    // declarado y lo corregia al cargar la imagen: un salto horizontal de ~19px en la
    // cabecera de todas las paginas. 137x44 mantiene el tamano nominal con el ratio real.
    alt: 'Suelos Vivos — Agricultura Regenerativa',
    width: 137,
    height: 44,
  },

  bosqueMadre: {
    url: 'https://bosquemadre.com',
    name: 'Bosque Madre',
  },
} as const;
