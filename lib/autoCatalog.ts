// ============================================================
// Arrivo — controlled featured-vehicle catalog.
//
// These cards are the SINGLE SOURCE OF TRUTH for what appears in the
// "Featured Vehicles" section. They are intentionally NOT pulled from the
// live DB / image guesses, because that caused mislabeled cards (a Panamera
// showing under "911", a 5 Series under "X5").
//
// RULES (do not break):
//  - The image at `imageUrl` MUST be the exact make/model/trim on the card.
//  - If a verified image is not available, leave the file absent and the card
//    renders a clean "Image coming soon" placeholder — never a wrong vehicle.
//  - `make/model/trim/minYear` are the structured filter metadata that define
//    what the card represents (not the image, not a generic label).
// ============================================================

export type AutoVehicleCard = {
  id: string;
  make: string;
  model: string;
  trim?: string;
  minYear: number;
  displayName: string;
  category: 'luxury' | 'exotic' | 'premium_daily' | 'economy' | 'family';
  bodyStyle: 'sedan' | 'suv' | 'coupe' | 'minivan';
  imageUrl: string;
  altText: string;
  status: 'active' | 'coming_soon' | 'hidden';
  priorityOrder: number;
};

export const featuredAutoCards: AutoVehicleCard[] = [
  {
    id: 'mercedes-g63-2020',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    trim: 'G63 AMG',
    minYear: 2020,
    displayName: '2020+ Mercedes-Benz G63',
    category: 'luxury',
    bodyStyle: 'suv',
    imageUrl: '/images/auto/mercedes-g63.jpg',
    altText: 'Mercedes-Benz G63 SUV',
    status: 'active',
    priorityOrder: 1,
  },
  {
    id: 'mercedes-s580-s63-2022',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    trim: 'S580 / S63',
    minYear: 2022,
    displayName: '2022+ Mercedes-Benz S580 or S63',
    category: 'luxury',
    bodyStyle: 'sedan',
    imageUrl: '/images/auto/mercedes-s-class.jpg',
    altText: 'Mercedes-Benz S-Class luxury sedan',
    status: 'active',
    priorityOrder: 2,
  },
  {
    id: 'porsche-911-2020',
    make: 'Porsche',
    model: '911',
    minYear: 2020,
    displayName: '2020+ Porsche 911',
    category: 'exotic',
    bodyStyle: 'coupe',
    imageUrl: '/images/auto/porsche-911.jpg',
    altText: 'Porsche 911 coupe',
    status: 'active',
    priorityOrder: 3,
  },
  {
    id: 'toyota-corolla-s-2020',
    make: 'Toyota',
    model: 'Corolla',
    trim: 'S / SE',
    minYear: 2020,
    displayName: '2020+ Toyota Corolla S',
    category: 'economy',
    bodyStyle: 'sedan',
    imageUrl: '/images/auto/toyota-corolla.jpg',
    altText: 'Toyota Corolla sedan',
    status: 'active',
    priorityOrder: 4,
  },
  {
    id: 'chrysler-pacifica-touring-2020',
    make: 'Chrysler',
    model: 'Pacifica',
    trim: 'Touring',
    minYear: 2020,
    displayName: '2020+ Chrysler Pacifica Touring',
    category: 'family',
    bodyStyle: 'minivan',
    imageUrl: '/images/auto/chrysler-pacifica.jpg',
    altText: 'Chrysler Pacifica Touring minivan',
    status: 'active',
    priorityOrder: 5,
  },
  {
    id: 'bmw-3-series-2023',
    make: 'BMW',
    model: '3 Series',
    minYear: 2023,
    displayName: '2023+ BMW 3 Series',
    category: 'premium_daily',
    bodyStyle: 'sedan',
    imageUrl: '/images/auto/bmw-3-series.jpg',
    altText: 'BMW 3 Series sedan',
    status: 'active',
    priorityOrder: 6,
  },
  {
    id: 'mercedes-c300-2023',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    trim: 'C300',
    minYear: 2023,
    displayName: '2023+ Mercedes-Benz C300',
    category: 'premium_daily',
    bodyStyle: 'sedan',
    imageUrl: '/images/auto/mercedes-c300.jpg',
    altText: 'Mercedes-Benz C300 sedan',
    status: 'active',
    priorityOrder: 7,
  },
  {
    id: 'bmw-5-series-2023',
    make: 'BMW',
    model: '5 Series',
    minYear: 2023,
    displayName: '2023+ BMW 5 Series',
    category: 'premium_daily',
    bodyStyle: 'sedan',
    imageUrl: '/images/auto/bmw-5-series.jpg',
    altText: 'BMW 5 Series sedan',
    status: 'active',
    priorityOrder: 8,
  },
  {
    id: 'bmw-x5-2023',
    make: 'BMW',
    model: 'X5',
    minYear: 2023,
    displayName: '2023+ BMW X5',
    category: 'premium_daily',
    bodyStyle: 'suv',
    imageUrl: '/images/auto/bmw-x5.jpg',
    altText: 'BMW X5 SUV',
    status: 'active',
    priorityOrder: 9,
  },
  {
    id: 'bmw-x3-2020',
    make: 'BMW',
    model: 'X3',
    trim: 'xDrive30i',
    minYear: 2020,
    displayName: '2020+ BMW X3',
    category: 'premium_daily',
    bodyStyle: 'suv',
    imageUrl: '/images/auto/bmw-x3.jpg',
    altText: 'BMW X3 SUV',
    status: 'active',
    priorityOrder: 10,
  },
];

// Human-readable body-style label used on cards.
export const BODY_STYLE_LABEL: Record<AutoVehicleCard['bodyStyle'], string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  coupe: 'Coupe',
  minivan: 'Minivan',
};

// Display groups, in render order. Each group pulls cards by category so the
// catalog categories stay the source of truth.
export type CatalogGroup = {
  key: string;
  title: string;
  categories: AutoVehicleCard['category'][];
};

export const AUTO_CARD_GROUPS: CatalogGroup[] = [
  { key: 'luxury-exotic', title: 'Luxury / Exotic', categories: ['luxury', 'exotic'] },
  { key: 'premium-daily', title: 'Premium Daily', categories: ['premium_daily'] },
  { key: 'practical-family', title: 'Practical / Family', categories: ['economy', 'family'] },
];

/** Visible cards for a group, sorted by priorityOrder. Hidden cards excluded. */
export function cardsForGroup(group: CatalogGroup): AutoVehicleCard[] {
  return featuredAutoCards
    .filter((c) => c.status !== 'hidden' && group.categories.includes(c.category))
    .sort((a, b) => a.priorityOrder - b.priorityOrder);
}

// Filter vocabularies — derived from the catalog's structured metadata, so the
// filter UI can never offer (or guess) anything outside the controlled list.
export const CATEGORY_OPTIONS: { value: AutoVehicleCard['category']; label: string }[] = [
  { value: 'luxury', label: 'Luxury' },
  { value: 'exotic', label: 'Exotic' },
  { value: 'premium_daily', label: 'Premium Daily' },
  { value: 'economy', label: 'Economy' },
  { value: 'family', label: 'Family' },
];

export const BODY_STYLE_OPTIONS: { value: AutoVehicleCard['bodyStyle']; label: string }[] = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'minivan', label: 'Minivan' },
];

export type CatalogFilter = { cat?: string; body?: string };

function matches(c: AutoVehicleCard, f: CatalogFilter): boolean {
  if (c.status === 'hidden') return false;
  if (f.cat && c.category !== f.cat) return false;
  if (f.body && c.bodyStyle !== f.body) return false;
  return true;
}

/** Display groups with their cards narrowed by the active filter; empty groups omitted. */
export function groupedCatalog(f: CatalogFilter = {}): { group: CatalogGroup; cards: AutoVehicleCard[] }[] {
  return AUTO_CARD_GROUPS.map((group) => ({
    group,
    cards: cardsForGroup(group).filter((c) => matches(c, f)),
  })).filter((g) => g.cards.length > 0);
}

/** Total visible cards for a filter (for the result count). */
export function countCatalog(f: CatalogFilter = {}): number {
  return featuredAutoCards.filter((c) => matches(c, f)).length;
}
