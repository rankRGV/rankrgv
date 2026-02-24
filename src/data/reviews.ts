export interface Review {
  name: string;
  business: string;
  industry: string;
  city: string;
  quote: string;
  result: string; // The specific, measurable outcome
  stars: number;
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
  },
  {
    name: 'Roberto Salinas',
    business: "Salinas Auto Repair",
    industry: 'Automotive',
    city: 'Brownsville',
    quote:
      "The website they built loads in under a second and looks better than anything in our industry. But more importantly — it actually shows up when people search for car repair in Brownsville. Our Google traffic doubled in the first month.",
    result: '2× Google traffic in first month',
    stars: 5,
  },
];
