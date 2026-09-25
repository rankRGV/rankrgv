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
  billingDay: string;
  billingNote?: string;
  /** One-time setup already paid, shown as a "Paid" line on the billing card. */
  setupPaid?: string;
  cancelNote: string;
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
