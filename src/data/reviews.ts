export interface Review {
  name: string;
  business: string;
  industry: string;
  city: string;
  quote: string;
  result: string;
  stars: number;
  initials: string;
  avatarColor: string;
}

// Real Google reviews only. Add new entries as real reviews come in via the GBP.
// Source of truth: https://maps.google.com/?cid=10460121872296412471 (RankRGV GBP)
// Copied word for word from the GBP, checked 2026-10-17 (4 reviews, all 5 stars).
export const reviews: Review[] = [
  {
    name: 'Monica Castillo',
    business: 'Cool Aid Air Conditioning',
    industry: 'HVAC',
    city: 'Edinburg',
    quote:
      'Eddie has gone above and beyond in restructuring, fixing and optimizing both our website and SEO. He has greatly improved our ranking and online presence. He is honest, knowledgeable and communicative in regards to our concerns. He has gained our trust and we hope to continue working and seeing results. Thank you for our peace of mind!',
    result: 'Verified Google Review · October 2026',
    stars: 5,
    initials: 'MC',
    avatarColor: 'bg-sky-600',
  },
  {
    name: 'Cool Aid AC / Refrigeration',
    business: 'Cool Aid Air Conditioning',
    industry: 'HVAC',
    city: 'Edinburg',
    quote:
      'Mr Urbano has shown great results on our seo for our website. He has taken the time to correct main issues and has increased calls going to my phone. Highly recommend rankrgv.com you will not be disappointed.',
    result: 'Verified Google Review · October 2026',
    stars: 5,
    initials: 'CA',
    avatarColor: 'bg-cyan-700',
  },
  {
    name: 'Samantha Reynoso',
    business: 'Luxoria Realty',
    industry: 'Real Estate',
    city: 'McAllen',
    quote:
      'Just got my website done with RangRGV and I love it! The attention to detail, response time and customer service was amazing! Super recommend! He is super knowledgeable!!',
    result: 'Verified Google Review · June 2026',
    stars: 5,
    initials: 'SR',
    avatarColor: 'bg-amber-600',
  },
  {
    name: 'Delfino Cervantes',
    business: 'Delfino Cervantes Real Estate Group',
    industry: 'Real Estate',
    city: 'McAllen',
    quote:
      'I highly recommend RankRGV! Eddie is extremely knowledgeable and has provided great insights on how to grow my business and stand out amongst others. His tools, resources, and customer service alongside his genuine passion for what he does is unmatched. Thank you for all your help.',
    result: 'Verified Google Review · April 2026',
    stars: 5,
    initials: 'DC',
    avatarColor: 'bg-blue-600',
  },
];
