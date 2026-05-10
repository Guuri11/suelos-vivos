export const siteConfig = {
  name: 'Suelos Vivos',
  tagline: 'La agricultura del futuro',
  description: 'Programa anual de formación en agricultura regenerativa para agricultores profesionales. Reduce costes 30–50%, recupera la fertilidad de tu suelo y gana autonomía técnica.',
  url: 'https://suelosvivos.com',

  contact: {
    email: 'info@suelosvivos.com',
    phone: '',
    address: 'Tormos, Alicante',
    formspree: 'https://formspree.io/f/XXXXXXXX',
  },

  social: {
    instagram: 'https://instagram.com/suelosvivos',
    telegram: 'https://t.me/suelosvivos',
    youtube: '',
  },

  program: {
    spots: 20,
    spotsLeft: 20,
    price: 1900,
    priceMonthly: 200,
    months: 10,
    deposit: 500,
    startDate: 'Septiembre 2026',
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
