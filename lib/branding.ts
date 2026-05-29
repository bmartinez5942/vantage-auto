// Single source of truth for Vantage Auto's public-facing identity.
// Mirrors the division entry in auren-command/lib/branding.ts.
export const AUTO = {
  name: 'Vantage Auto',
  legalName: 'Vantage Auto Group',
  tagline: 'Your Stay, Now in Motion.',
  domain: 'vantageautogroup.us',
  email: 'auto@aurengroup.us',
  phone: '(305) 555-0182',
  parent: 'Auren',
  // Wordmark letters separated by ornaments → V·A·N·T·A·G·E
  wordmark: ['V', 'A', 'N', 'T', 'A', 'G', 'E'],
  cities: ['Miami, FL'],
  categories: ['Economy', 'Sedan', 'SUV', 'Luxury', 'Electric', 'Specialty'] as const,
} as const;

export const NAV_LINKS = [
  { href: '/rent', label: 'Rent' },
  { href: '/host', label: 'Host Your Vehicle' },
  { href: '/source', label: 'Source a Vehicle' },
] as const;
