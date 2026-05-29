// Small inline icon set (stroke = currentColor) used across the site.
type P = { className?: string };
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const IconSeats = (p: P) => (
  <svg {...base} {...p}><path d="M16 11V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6" /><path d="M5 11h14a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2z" /><path d="M5 17v3M19 17v3" /></svg>
);
export const IconGear = (p: P) => (
  <svg {...base} {...p}><path d="M4 6h10M4 6a2 2 0 1 1 0-.01M14 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM7 6v12a2 2 0 0 0 2 2h2M11 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" /></svg>
);
export const IconFuel = (p: P) => (
  <svg {...base} {...p}><path d="M3 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18M3 10h10" /><path d="M13 7h3l2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9l-3-3" /></svg>
);
export const IconCar = (p: P) => (
  <svg {...base} {...p}><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14v4H5zM5 17v2M19 17v2" /><circle cx="8" cy="15" r="0.5" /><circle cx="16" cy="15" r="0.5" /></svg>
);
export const IconHeart = (p: P) => (
  <svg {...base} {...p}><path d="M19 8.5c0 4-7 8.5-7 8.5s-7-4.5-7-8.5A3.5 3.5 0 0 1 12 6a3.5 3.5 0 0 1 7 2.5z" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>
);
export const IconSearch = (p: P) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const IconPin = (p: P) => (
  <svg {...base} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const IconKey = (p: P) => (
  <svg {...base} {...p}><circle cx="8" cy="8" r="4" /><path d="m11 11 7 7M16 16l2-2M19 19l1.5-1.5" /></svg>
);
export const IconStar = (p: P) => (
  <svg {...base} {...p}><path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.2l1-5.8L3.5 9.2l5.9-.9L12 3z" /></svg>
);
export const IconCalendar = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>
);
export const IconShield = (p: P) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>
);
export const IconArrow = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconRoad = (p: P) => (
  <svg {...base} {...p}><path d="M6 21 9 3M18 21 15 3M12 5v2M12 11v2M12 17v2" /></svg>
);
export const IconPlus = (p: P) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
