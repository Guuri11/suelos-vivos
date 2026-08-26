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
    telegram: 'https://t.me/suelosvivos',
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
    alt: 'Suelos Vivos — Agricultura Regenerativa',
    width: 160,
    height: 44,
  },

  bosqueMadre: {
    url: 'https://bosquemadre.com',
    name: 'Bosque Madre',
  },
} as const;
