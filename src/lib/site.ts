/** Who Orina is and how to reach them (as on orina.in), and the site's pages. */
export const SITE = {
  name: 'Orina Grid',
  /** Where this site lives (orina.in is Orina LLP's own site): set NEXT_PUBLIC_SITE_URL at deploy. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100',
  tagline: 'Rooftop solar through one trusted partner in each district, and the software they run on.',
  phone: '+91 94289 65666',
  phoneHref: 'tel:+919428965666',
  whatsappHref: 'https://wa.me/919428965666',
  email: 'contact@orina.in',
  offices: [
    {
      name: 'Main office',
      lines: ['B-5, First Floor, KK Mart', 'Near TR Cross Road Garden', 'Talod 383215, Gujarat'],
      map: 'https://www.google.com/maps/search/?api=1&query=KK+Mart+Talod+Gujarat+383215',
    },
    {
      name: 'Gandhinagar office',
      lines: ['A-305, Super Mall 1', 'Infocity', 'Gandhinagar 382007, Gujarat'],
      map: 'https://www.google.com/maps/search/?api=1&query=Super+Mall+1+Infocity+Gandhinagar+382007',
    },
  ],
} as const;

export interface NavItem {
  href: string;
  label: string;
}

export const NAV: NavItem[] = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/find-a-partner', label: 'Find a partner' },
  { href: '/subsidy', label: 'Subsidy' },
  { href: '/partners', label: 'For partners' },
  { href: '/about', label: 'About' },
];
