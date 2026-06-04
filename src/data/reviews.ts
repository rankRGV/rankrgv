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
// Source of truth: https://maps.google.com/?cid=... (RankRGV GBP)
export const reviews: Review[] = [
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
