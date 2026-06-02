// Single source of truth for Arrivo's public-facing identity.
// (Phase 4 rebrand: "Vantage Auto" → "Arrivo". Public stay brand is "Vantage
// Stays". "Auren Group" appears publicly only as the operator.)
export const AUTO = {
  name: 'Arrivo',
  legalName: 'Arrivo',
  // Shown wherever we disclose the operating company.
  operatedBy: 'Auren Group',
  // Homepage headline.
  tagline: 'Your Stay, Now in Motion.',
  // Brand line / SEO tagline.
  motto: 'The right vehicle, ready when you arrive.',
  // New primary domain (DNS cutover handled separately in Vercel — Phase 4).
  domain: 'bearrivo.com',
  email: 'auto@aurengroup.us',
  // No public phone number until a real business line is provisioned.
  parent: 'Auren Group',
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
