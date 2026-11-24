import { services } from './services';
import { serviceAreas } from './serviceAreas';

export const mainNav = [
  {
    label: 'Services',
    href: '#',
    dropdown: [
      ...services.map((s) => ({
        label: s.shortName,
        href: `/${s.slug}/`,
        description: s.description,
      })),
      {
        label: 'Increase Call Plan',
        href: '/increase-call-plan/',
        description: 'More calls from your Google profile: fixes, listings, posts, reviews.',
      },
    ],
  },
  {
    label: 'Service Areas',
    href: '/service-areas/',
    dropdown: serviceAreas.map((a) => ({
      label: a.name,
      href: `/service-areas/${a.slug}/`,
      description: `${a.county} County`,
    })),
  },
  {
    label: 'Pricing',
    href: '/pricing/',
    dropdown: null,
  },
  {
    label: 'Blog',
    href: '/blog/',
    dropdown: null,
  },
  {
    label: 'About',
    href: '/about/',
    dropdown: null,
  },
  {
    label: 'Contact',
    href: '/contact/',
    dropdown: null,
  },
];
