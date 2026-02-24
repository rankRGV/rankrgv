import { services } from './services';
import { serviceAreas } from './serviceAreas';

export const mainNav = [
  {
    label: 'Services',
    href: '#',
    dropdown: services.map((s) => ({
      label: s.shortName,
      href: `/${s.slug}/`,
      description: s.description,
    })),
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
