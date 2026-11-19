// Client onboarding wizard data (pages at /start/<slug>/).
// Each slug needs a passcode in the ONBOARDING_CODES env var on Vercel (see middleware.js).
// The recap PDF sent afterwards is built from proposals/_templates/welcome-packet/.

export interface OnboardingClient {
  slug: string;
  clientName: string;
  contactName: string;
  contactFirst: string;
  letter: string[];
  exclusivity: { title: string; text: string };
  planName: string;
  planSub: string;
  monthly: string;
  /** Omit to say "same day each month as your first payment" without naming a date. */
  billingDay?: string;
  billingNote?: string;
  /** One-time setup already paid, shown as a "Paid" line on the billing card. */
  setupPaid?: string;
  /** Label before setupPaid on the billing card. Defaults to "Setup". */
  setupLabel?: string;
  /** Ad spend note shown on the billing step, for clients with ads management. */
  adBudgetNote?: string;
  cancelNote: string;
  /** What the biweekly update covers, matched to the client's plan. */
  updateCovers?: string;
  /** 'es' clients get the Spanish wizard (src/pages/start/<slug>.astro) and a Spanish passcode screen. */
  lang?: 'es';
}

export const onboardingClients: OnboardingClient[] = [
  {
    slug: 'collision-masters',
    clientName: 'Collision Masters',
    contactName: 'Cruz Garcia',
    contactFirst: 'Cruz',
    letter: [
      "Thank you for trusting us with Collision Masters. Your family has spent thirty years building two shops people in Mission and Edinburg rely on after the worst day of their week. I don't take it lightly that you're letting someone else handle how new customers find you.",
      "You told me the last marketing company left a bad taste. I'd rather earn your trust with results you can see than with promises, so every two weeks you'll see exactly what I did and what changed.",
    ],
    exclusivity: {
      title: 'One collision shop per city.',
      text: "While you're a client, I won't take on another collision or auto body shop in Mission or Edinburg.",
    },
    planName: 'Local SEO · Market Leader',
    planSub: 'Both locations, Mission and Edinburg',
    monthly: '$1,200',
    billingDay: '10th',
    cancelNote: "Month-to-month. Give 30 days' notice by text or email to cancel, no penalty.",
  },
  {
    slug: 'vaultx',
    clientName: 'VaultX',
    contactName: 'Carlton Martin',
    contactFirst: 'Carlton',
    letter: [
      "Welcome to the RankRGV family. You built a product that solves a real problem for anyone hauling cargo, and right now the internet doesn't know it exists yet. The audit showed AI assistants already describing a concealed internal lock almost word for word, without naming anyone. That's the opening we're going after.",
      "You also have an investor to answer to, so I'll keep the reporting simple enough to forward: the same three numbers every time, with a plain explanation of what changed.",
    ],
    exclusivity: {
      title: 'One cargo-security brand at a time.',
      text: "While you're a client, I won't take on another cargo lock or cargo-security product brand.",
    },
    planName: 'Custom · SEO + AI Search',
    planSub: 'Ongoing content, technical work and reporting',
    monthly: '$2,325',
    billingDay: '23rd',
    setupPaid: '$975 foundation sprint',
    cancelNote: "Month-to-month to start. Either side can end it with 30 days' notice, no penalty.",
  },
  {
    slug: 'yoga-house',
    clientName: 'Yoga House RGV',
    contactName: 'Mahima Samtani',
    contactFirst: 'Mahima',
    letter: [
      "Thank you for trusting me with Yoga House RGV.",
    ],
    exclusivity: {
      title: "I won't work with your competitors.",
      text: "While you're a client, I won't take on another yoga or Pilates studio in McAllen, Mission, or Edinburg.",
    },
    updateCovers: 'your Google and Meta ad results (spend, leads, and cost per lead), your rankings in all three cities, what we did, and what\'s next',
    planName: 'Ads Management + Local SEO',
    planSub: 'Google + Meta ads, all three locations',
    monthly: '$1,875',
    billingDay: '9th',
    cancelNote: "Month-to-month, no long-term commitment. Give 2 weeks' notice by text or email to wind down either service, no penalty.",
  },
  {
    slug: 'bellissimo',
    clientName: 'Bellissimo Builders',
    contactName: 'Clemente Gonzalez',
    contactFirst: 'Clemente',
    letter: [
      "Thank you for trusting me with Bellissimo Builders. You already rank at the top around your office in Mission. The work now is getting you found in McAllen and Edinburg, and getting Google Ads to put real custom home leads on the phone.",
      "The holidays are slow, so we'll use them to fix the basics: your listings, your website and the ad setup, working with Isaiah where it touches the site. That way everything is ready when people start calling again in January and February. When the Cameron County side is ready, we'll talk about stretching the ads to cover it.",
    ],
    exclusivity: {
      title: 'One custom home builder in Mission.',
      text: "While you're a client, I won't take on another custom home builder in Mission.",
    },
    updateCovers: "your map rankings, your Google Ads results (spend, calls and leads), what we did, and what's next",
    planName: 'Local SEO + Google Ads',
    planSub: '$975 Local SEO + $420 Google Ads management',
    monthly: '$1,395',
    billingNote: 'The $500 setup fee is a one time charge, paid with your first payment. It is never charged again.',
    setupLabel: 'One time setup fee (charged once)',
    setupPaid: '$500',
    adBudgetNote: 'We start your Google Ads at up to $1,000 a month and adjust from there with you. That budget is paid straight to Google on your own card and is separate from the $420 management fee.',
    cancelNote: "Month to month for the first three months. If you're not happy, you stop with no penalty. After that we move to three month agreements.",
  },
  {
    slug: 'reliableac',
    lang: 'es',
    clientName: 'Reliable AC Services',
    contactName: 'Juan Carlos Reyes',
    contactFirst: 'Juan Carlos',
    letter: [
      'Gracias por confiar en nosotros con Reliable AC Services. Su perfil de Google ya está activo y la competencia en La Feria es débil: la compañía que más sale en el pueblo tiene solo 5 reseñas.',
      'Empezamos por lo que más pesa: arreglar su perfil, conseguir sus primeras reseñas y ponerle un sitio web en inglés y español. Cada dos semanas va a ver qué hicimos y qué se movió en el mapa.',
    ],
    exclusivity: {
      title: 'Una sola compañía de aire acondicionado en La Feria.',
      text: 'Mientras trabajemos juntos, no tomo a otra compañía de aire acondicionado en La Feria.',
    },
    updateCovers: 'su posición en el mapa de Google, sus reseñas, lo que hicimos y lo que sigue',
    planName: 'SEO local',
    planSub: 'Perfil de Google, reseñas, sitio web y directorios',
    monthly: '$975',
    billingNote: 'Los $500 de arranque se cobran una sola vez, con su primer pago. No se vuelven a cobrar.',
    setupLabel: 'Arranque (una sola vez)',
    setupPaid: '$500',
    cancelNote: 'Mes a mes los primeros tres meses. Si no está contento, para cuando quiera, sin penalidad. Después pasamos a acuerdos de tres meses.',
  },
  {
    // Made-up client for testing the flow end to end. Safe to remove.
    slug: 'demo',
    clientName: 'Valley Demo Auto Body',
    contactName: 'Maria Gonzalez',
    contactFirst: 'Maria',
    letter: [
      "Thank you for trusting us with Valley Demo Auto Body. This is a sample welcome so you can see exactly what a new client sees on day one.",
      "Every two weeks you'll see what I did and what changed, in plain language, with the numbers to back it up.",
    ],
    exclusivity: {
      title: 'One auto body shop per city.',
      text: "While you're a client, I won't take on another auto body shop in Pharr.",
    },
    planName: 'Local SEO · Domination',
    planSub: 'One location, Pharr',
    monthly: '$975',
    billingDay: '1st',
    cancelNote: "Month-to-month. Give 30 days' notice by text or email to cancel, no penalty.",
  },
];
