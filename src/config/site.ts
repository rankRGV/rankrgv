export const site = {
  name: 'RankRGV',
  tagline: 'Local SEO & Digital Marketing for the Rio Grande Valley',
  url: 'https://rankrgv.com',
  phone: '956-391-5991',
  phoneHref: 'tel:9563915991',
  email: 'hello@rankrgv.com',
  formsparkId: 'CTzJGJckq',
  ga4Id: 'G-ZLFQ1WH6MN',
  graderUrl: 'https://grader.rankrgv.com',
  primaryCity: 'McAllen',
  primaryState: 'TX',
  primaryRegion: 'Rio Grande Valley',
  defaultOgImage: '/images/og-default.png',
  twitterHandle: '@rankrgv',
  // SAB — no physical address
  areaServed: ['McAllen', 'Brownsville', 'Edinburg', 'Harlingen', 'Mission', 'Pharr'],
  social: {
    facebook:  'https://www.facebook.com/rankrgv',
    instagram: 'https://www.instagram.com/rankrgv',
    twitter:   'https://x.com/RankRGV',
    linkedin:  'https://www.linkedin.com/company/rankrgv',
    youtube:   'https://www.youtube.com/@RankRGV',
    gbp:       'https://share.google/iUQjPkarhCgqbYHuE',
  },
};

export function graderHref(content: string, lang: 'en' | 'es' = 'en') {
  const params = new URLSearchParams({
    utm_source: 'rankrgv.com',
    utm_medium: 'website',
    utm_campaign: 'business-grader',
    utm_content: content,
  });

  if (lang === 'es') params.set('lang', 'es');

  return `${site.graderUrl}/?${params.toString()}`;
}
