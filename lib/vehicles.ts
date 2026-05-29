// Public data access for Vantage Auto. Reads only.
// RLS guarantees the anon key only ever returns listing_status='live' rows,
// but we also filter explicitly so intent is obvious and the queries stay
// correct if RLS is ever relaxed.
import { browserClient } from './supabase';
import { rentalDays } from './format';

export type Vehicle = {
  id: string;
  slug: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  trim: string | null;
  color: string | null;
  category: string | null;
  seats: number | null;
  doors: number | null;
  transmission: string | null;
  fuel_type: string | null;
  headline: string | null;
  description: string | null;
  features: string[] | null;
  photos: string[] | null;
  city: string | null;
  pickup_location: string | null;
  daily_rate: number | null;
  weekly_rate: number | null;
  monthly_rate: number | null;
  weekend_rate: number | null;
  deposit_amount: number | null;
  delivery_available: boolean | null;
  delivery_fee: number | null;
  airport_delivery_fee: number | null;
  cleaning_fee: number | null;
  min_rental_days: number | null;
  max_rental_days: number | null;
  included_miles_per_day: number | null;
  included_miles_per_week: number | null;
  included_miles_per_month: number | null;
  extra_mileage_fee: number | null;
  unlimited_mileage: boolean | null;
  is_featured: boolean | null;
  listing_status: string | null;
};

const PUBLIC_FIELDS =
  'id, slug, make, model, year, trim, color, category, seats, doors, transmission, fuel_type, ' +
  'headline, description, features, photos, city, pickup_location, daily_rate, weekly_rate, monthly_rate, ' +
  'weekend_rate, deposit_amount, delivery_available, delivery_fee, airport_delivery_fee, cleaning_fee, ' +
  'min_rental_days, max_rental_days, included_miles_per_day, included_miles_per_week, included_miles_per_month, ' +
  'extra_mileage_fee, unlimited_mileage, is_featured, listing_status';

export type VehicleFilters = {
  category?: string;
  transmission?: string;
  seats?: number;
  maxDaily?: number;
  delivery?: boolean;
};

export function vehicleName(v: Pick<Vehicle, 'year' | 'make' | 'model'>): string {
  return [v.year, v.make, v.model].filter(Boolean).join(' ').trim() || 'Vantage Auto vehicle';
}

export function vehicleHref(v: Pick<Vehicle, 'slug' | 'id'>): string {
  return `/rent/${v.slug ?? v.id}`;
}

export async function fetchLiveVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  const sb = browserClient();
  let q = sb.from('vehicles').select(PUBLIC_FIELDS).eq('listing_status', 'live');
  if (filters.category) q = q.eq('category', filters.category);
  if (filters.transmission) q = q.eq('transmission', filters.transmission);
  if (filters.seats) q = q.gte('seats', filters.seats);
  if (filters.maxDaily) q = q.lte('daily_rate', filters.maxDaily);
  if (filters.delivery) q = q.eq('delivery_available', true);
  const { data, error } = await q.order('is_featured', { ascending: false }).order('daily_rate');
  if (error) {
    console.error('fetchLiveVehicles:', error.message);
    return [];
  }
  return (data ?? []) as unknown as Vehicle[];
}

export async function fetchFeaturedVehicles(limit = 4): Promise<Vehicle[]> {
  const sb = browserClient();
  const { data, error } = await sb
    .from('vehicles')
    .select(PUBLIC_FIELDS)
    .eq('listing_status', 'live')
    .eq('is_featured', true)
    .order('daily_rate')
    .limit(limit);
  if (error) {
    console.error('fetchFeaturedVehicles:', error.message);
    return [];
  }
  return (data ?? []) as unknown as Vehicle[];
}

export async function fetchVehicleBySlug(slugOrId: string): Promise<Vehicle | null> {
  const sb = browserClient();
  const bySlug = await sb
    .from('vehicles')
    .select(PUBLIC_FIELDS)
    .eq('slug', slugOrId)
    .eq('listing_status', 'live')
    .maybeSingle();
  if (bySlug.data) return bySlug.data as unknown as Vehicle;
  const byId = await sb
    .from('vehicles')
    .select(PUBLIC_FIELDS)
    .eq('id', slugOrId)
    .eq('listing_status', 'live')
    .maybeSingle();
  return (byId.data ?? null) as unknown as Vehicle | null;
}

/** Unavailable date ranges for a vehicle (booked / pending / held / maintenance).
 *  Public-safe: returns ranges only, never the internal reason. */
export async function fetchUnavailableRanges(
  vehicleId: string,
): Promise<{ start: string; end: string }[]> {
  const sb = browserClient();
  const { data, error } = await sb
    .from('vehicle_calendar_blocks')
    .select('start_date, end_date')
    .eq('vehicle_id', vehicleId)
    .gte('end_date', new Date().toISOString().slice(0, 10));
  if (error) {
    console.error('fetchUnavailableRanges:', error.message);
    return [];
  }
  return (data ?? []).map((r) => ({ start: r.start_date as string, end: r.end_date as string }));
}

export type PriceBreakdown = {
  days: number;
  dailyRate: number;
  rentalSubtotal: number;
  cleaningFee: number;
  deliveryFee: number;
  includedMiles: number;
  deposit: number;
  dueNow: number; // rental + fees (deposit collected separately at pickup)
  total: number;
};

/** Quote a rental using the APPROVED pricing on the vehicle. Applies the
 *  weekly/monthly rate when the term qualifies (cheaper of the applicable
 *  tiers), else daily. Mirrors the breakdown shown on the detail page. */
export function quoteRental(
  v: Vehicle,
  startIso: string,
  endIso: string,
  opts: { delivery?: boolean } = {},
): PriceBreakdown {
  const days = rentalDays(startIso, endIso);
  const daily = Number(v.daily_rate ?? 0);
  const weekly = v.weekly_rate ? Number(v.weekly_rate) : null;
  const monthly = v.monthly_rate ? Number(v.monthly_rate) : null;

  let rentalSubtotal: number;
  if (monthly && days >= 28) {
    const months = Math.floor(days / 28);
    const rem = days - months * 28;
    rentalSubtotal = months * monthly + rem * daily;
  } else if (weekly && days >= 7) {
    const weeks = Math.floor(days / 7);
    const rem = days - weeks * 7;
    rentalSubtotal = weeks * weekly + rem * daily;
  } else {
    rentalSubtotal = days * daily;
  }

  const cleaningFee = Number(v.cleaning_fee ?? 0);
  const deliveryFee = opts.delivery ? Number(v.delivery_fee ?? 0) : 0;
  const deposit = Number(v.deposit_amount ?? 0);
  const includedMiles = v.unlimited_mileage
    ? Infinity
    : Number(v.included_miles_per_day ?? 0) * days;

  const dueNow = rentalSubtotal + cleaningFee + deliveryFee;
  return {
    days,
    dailyRate: daily,
    rentalSubtotal,
    cleaningFee,
    deliveryFee,
    includedMiles,
    deposit,
    dueNow,
    total: dueNow + deposit,
  };
}
