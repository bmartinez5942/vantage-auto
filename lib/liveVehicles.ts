// Public read of admin-approved, live vehicles from the shared DB.
// RLS already limits anon to listing_status='live'; we additionally require
// approved_by_admin so nothing shows publicly until an operator signs off.
// Fails safe: any error returns empty, so the homepage/rent fall back to the
// controlled static catalog.
import { publicReadClient } from './supabase';

export type LiveVehicle = {
  id: string;
  slug: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  trim: string | null;
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
  daily_rate: number | null;
  weekly_rate: number | null;
  monthly_rate: number | null;
  deposit_amount: number | null;
  delivery_available: boolean | null;
  delivery_fee: number | null;
  min_rental_days: number | null;
  max_rental_days: number | null;
  included_miles_per_day: number | null;
  extra_mileage_fee: number | null;
  unlimited_mileage: boolean | null;
  is_featured: boolean | null;
};

const FIELDS =
  'id, slug, make, model, year, trim, category, seats, doors, transmission, fuel_type, headline, ' +
  'description, features, photos, city, daily_rate, weekly_rate, monthly_rate, deposit_amount, ' +
  'delivery_available, delivery_fee, min_rental_days, max_rental_days, included_miles_per_day, ' +
  'extra_mileage_fee, unlimited_mileage, is_featured';

export function vehicleName(v: Pick<LiveVehicle, 'year' | 'make' | 'model'>): string {
  return [v.year, v.make, v.model].filter(Boolean).join(' ').trim() || 'Vehicle';
}
export function vehicleHref(v: Pick<LiveVehicle, 'slug' | 'id'>): string {
  return `/rent/${v.slug ?? v.id}`;
}

export async function fetchLiveVehicles(limit?: number): Promise<LiveVehicle[]> {
  try {
    const sb = publicReadClient();
    let q = sb
      .from('vehicles')
      .select(FIELDS)
      .eq('listing_status', 'live')
      .eq('approved_by_admin', true)
      .order('is_featured', { ascending: false })
      .order('daily_rate', { ascending: true });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as unknown as LiveVehicle[];
  } catch {
    return [];
  }
}

export async function fetchLiveVehicleBySlug(slugOrId: string): Promise<LiveVehicle | null> {
  try {
    const sb = publicReadClient();
    const bySlug = await sb
      .from('vehicles')
      .select(FIELDS)
      .eq('slug', slugOrId)
      .eq('listing_status', 'live')
      .eq('approved_by_admin', true)
      .maybeSingle();
    if (bySlug.data) return bySlug.data as unknown as LiveVehicle;
    // fall back to id (uuid) for direct links
    if (!/^[0-9a-f-]{36}$/i.test(slugOrId)) return null;
    const byId = await sb
      .from('vehicles')
      .select(FIELDS)
      .eq('id', slugOrId)
      .eq('listing_status', 'live')
      .eq('approved_by_admin', true)
      .maybeSingle();
    return (byId.data as unknown as LiveVehicle) ?? null;
  } catch {
    return null;
  }
}

/** Unavailable date ranges (booked/blocked). Public-safe: ranges only, no reason. */
export async function fetchUnavailableRanges(vehicleId: string): Promise<{ start: string; end: string }[]> {
  try {
    const sb = publicReadClient();
    const { data, error } = await sb
      .from('vehicle_calendar_blocks')
      .select('start_date, end_date')
      .eq('vehicle_id', vehicleId)
      .gte('end_date', new Date().toISOString().slice(0, 10));
    if (error || !data) return [];
    return data.map((r) => ({ start: r.start_date as string, end: r.end_date as string }));
  } catch {
    return [];
  }
}
