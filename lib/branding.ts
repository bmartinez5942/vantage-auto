// Single source of truth for Vantage Auto's public-facing identity.
// Mirrors the division entry in auren-command/lib/branding.ts.
export const AUTO = {
  name: 'Vantage Auto',
  // Public-facing brand is always "Vantage Auto" — no "Group"/"Rentals"/etc.
  legalName: 'Vantage Auto',
  tagline: 'Your Stay, Now in Motion.',
  domain: 'vantageautogroup.us',
  email: 'auto@aurengroup.us',
  // No public phone number until a real business line is provisioned.
  parent: 'Auren',
  cities: ['Miami, FL'],
  categories: ['Economy', 'Sedan', 'SUV', 'Premium', 'Electric', 'Specialty'] as const,
} as const;

export const NAV_LINKS = [
  { href: '/rent', label: 'Rent' },
  { href: '/host', label: 'Host Your Vehicle' },
  { href: '/source', label: 'Source a Vehicle' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
