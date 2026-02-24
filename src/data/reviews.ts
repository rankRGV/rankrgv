export interface Review {
  name: string;
  business: string;
  industry: string;
  city: string;
  quote: string;
  result: string;
  stars: number;
  initials: string; // For avatar fallback
  avatarColor: string; // Tailwind bg class
}

export const reviews: Review[] = [
  {
    name: 'Dr. Maria Gonzalez',
    business: 'Rio Grande Family Clinic',
    industry: 'Healthcare',
    city: 'McAllen',
    quote:
      "We were invisible on Google. Within 90 days of working with RankRGV, we went from nowhere to showing up in the map pack for 'family doctor McAllen.' Our new patient calls tripled.",
    result: '3× increase in new patient calls',
    stars: 5,
    initials: 'MG',
    avatarColor: 'bg-blue-600',
  },
  {
    name: 'Carlos Reyes',
    business: 'Reyes & Associates Law',
    industry: 'Legal',
    city: 'Edinburg',
    quote:
      "I was skeptical about digital marketing — but RankRGV showed me exactly which searches my clients were using and built pages targeting every single one. We now rank #1 for 'personal injury attorney Edinburg.' Worth every dollar.",
    result: 'Ranking #1 for primary keyword',
    stars: 5,
    initials: 'CR',
    avatarColor: 'bg-indigo-600',
  },
  {
    name: 'Roberto Salinas',
    business: 'Salinas Auto Repair',
    industry: 'Automotive',
    city: 'Brownsville',
    quote:
      "The website they built loads in under a second and looks better than anything in our industry. But more importantly — it actually shows up when people search for car repair in Brownsville. Our Google traffic doubled in the first month.",
    result: '2× Google traffic in first month',
    stars: 5,
    initials: 'RS',
    avatarColor: 'bg-violet-600',
  },
  {
    name: 'Sandra Mireles',
    business: 'Mireles Insurance Group',
    industry: 'Insurance',
    city: 'McAllen',
    quote:
      "I had a website but nobody could find it. RankRGV built out our McAllen and Edinburg pages, cleaned up our Google Business Profile, and within 60 days we were getting calls from Google Maps. First time ever.",
    result: 'First Google Maps calls in 60 days',
    stars: 5,
    initials: 'SM',
    avatarColor: 'bg-blue-700',
  },
  {
    name: 'Jorge Treviño',
    business: 'Treviño HVAC Services',
    industry: 'Home Services',
    city: 'Mission',
    quote:
      "Summer is our busiest season and we were losing jobs to competitors who showed up on Google and we didn't. RankRGV fixed that. We're now in the top 3 for 'AC repair Mission TX' heading into this summer. Game changer.",
    result: 'Top 3 Map Pack for AC repair Mission TX',
    stars: 5,
    initials: 'JT',
    avatarColor: 'bg-sky-600',
  },
  {
    name: 'Ana Castillo',
    business: 'Castillo Dental Studio',
    industry: 'Dental',
    city: 'Harlingen',
    quote:
      "We switched from a national marketing company that never understood the RGV market. RankRGV is local — they knew exactly what Harlingen patients search for. Our new patient inquiries from Google went up 4× in three months.",
    result: '4× new patient inquiries from Google',
    stars: 5,
    initials: 'AC',
    avatarColor: 'bg-indigo-700',
  },
];
