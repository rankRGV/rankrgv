export interface Service {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  icon: string; // SVG path data
  primaryKeyword: string;
  titleTag: string;
  metaDescription: string;
}

export const services: Service[] = [
  {
    slug: 'local-seo',
    name: 'Local SEO & Google Maps',
    shortName: 'Local SEO',
    headline: 'Get Found on Google Maps — Before Your Competitors',
    description:
      'We optimize your Google Business Profile and build a website that ranks for every "near me" and city-specific search your customers make.',
    icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    primaryKeyword: 'local seo mcallen tx',
    titleTag: 'Local SEO McAllen TX | Get to the Top 3 Map Pack | RankRGV',
    metaDescription:
      'Rank in the top 3 Google Maps results for McAllen searches. RankRGV builds local SEO strategies that drive real calls and customers — not just rankings.',
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    shortName: 'Web Design',
    headline: 'A Website That Works as Hard as You Do',
    description:
      'Fast-loading, mobile-first websites built to convert visitors into leads. Every page is designed to rank and built to close.',
    icon: 'M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14zM6 7h2v2H6zm0 4h2v2H6zm0 4h2v2H6zm4-8h8v2h-8zm0 4h8v2h-8zm0 4h5v2h-5z',
    primaryKeyword: 'web design mcallen tx',
    titleTag: 'Web Design McAllen TX | 99+ PageSpeed, Built to Convert | RankRGV',
    metaDescription:
      'Professional web design in McAllen TX built for speed, SEO, and conversions. RankRGV sites score 99+ on Lighthouse and are built to rank from day one.',
  },
  {
    slug: 'business-automation',
    name: 'Business Automation',
    shortName: 'Automation',
    headline: 'Never Miss a Lead Again — Automate Your Follow-Up',
    description:
      'From missed call text-back to automated review requests, we set up the systems that follow up with every lead automatically — so you close more without working more.',
    icon: 'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
    primaryKeyword: 'business automation mcallen tx',
    titleTag: 'Business Automation McAllen TX | Never Miss a Lead Again | RankRGV',
    metaDescription:
      'Automate follow-up, review requests, and lead response for your McAllen business. RankRGV sets up the systems that work while you sleep.',
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
