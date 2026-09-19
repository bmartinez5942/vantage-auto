// Arrivo rental terms — protection plans, authorization holds, mileage,
// additional driver, delivery — resolved from admin data (migration 148).
//
// Resolution order for every knob:
//   vehicles.rental_overrides[key]  →  arrivo_rental_settings[key]  →  DEFAULTS
// so the site keeps quoting sanely even before the settings row exists.
//
// The damage plans are contractual damage waivers, NOT insurance policies —
// copy elsewhere must never say "fully insured" / "complete insurance" /
// "zero liability". The liability sentence is gated by
// show_liability_statement (off until State Farm confirms in writing that
// the policy covers paying renters).
//
// quoteRental() is pure and deterministic — the server action recomputes the
// quote from DB config and never trusts client-side numbers.

import { publicReadClient } from './supabase';
import type { LiveVehicle } from './liveVehicles';

export type ProtectionPlanId = 'none' | 'standard' | 'premium';

export type Surcharge = { label: string; amount: number; per?: 'day' | 'rental' };

export type RentalSettings = {
  standard_daily_price: number;
  standard_weekly_price: number | null;
  standard_max_responsibility: number;
  standard_hold: number;
  premium_daily_price: number;
  premium_weekly_price: number | null;
  premium_max_responsibility: number;
  premium_hold: number;
  premium_includes_roadside: boolean;
  no_protection_hold: number;
  additional_driver_daily: number;
  additional_driver_weekly_cap: number;
  included_miles_per_day: number | null;
  included_miles_per_week: number | null;
  excess_mileage_rate: number;
  min_renter_age: number;
  international_licenses_allowed: boolean;
  show_liability_statement: boolean;
  tax_rate_pct: number;
  surcharges: Surcharge[];
};

// Fail-safe defaults = the launch spec. Used when the settings row is
// missing or unreadable; admin values always win once present.
export const DEFAULT_SETTINGS: RentalSettings = {
  standard_daily_price: 25,
  standard_weekly_price: null,
  standard_max_responsibility: 1000,
  standard_hold: 250,
  premium_daily_price: 35,
  premium_weekly_price: null,
  premium_max_responsibility: 500,
  premium_hold: 150,
  premium_includes_roadside: true,
  no_protection_hold: 700,
  additional_driver_daily: 7,
  additional_driver_weekly_cap: 49,
  included_miles_per_day: null,
  included_miles_per_week: null,
  excess_mileage_rate: 0.45,
  min_renter_age: 21,
  international_licenses_allowed: true,
  show_liability_statement: false,
  tax_rate_pct: 0,
  surcharges: [],
};

const NUM_KEYS: (keyof RentalSettings)[] = [
  'standard_daily_price', 'standard_weekly_price', 'standard_max_responsibility', 'standard_hold',
  'premium_daily_price', 'premium_weekly_price', 'premium_max_responsibility', 'premium_hold',
  'no_protection_hold', 'additional_driver_daily', 'additional_driver_weekly_cap',
  'included_miles_per_day', 'included_miles_per_week', 'excess_mileage_rate',
  'min_renter_age', 'tax_rate_pct',
];
const BOOL_KEYS: (keyof RentalSettings)[] = [
  'premium_includes_roadside', 'international_licenses_allowed', 'show_liability_statement',
];
const NULLABLE: Set<string> = new Set([
  'standard_weekly_price', 'premium_weekly_price', 'included_miles_per_day', 'included_miles_per_week',
]);

/** Merge a raw row / override bag onto a base, keeping only sane values. */
function mergeSettings(base: RentalSettings, raw: Record<string, unknown> | null | undefined): RentalSettings {
  if (!raw) return base;
  const out: RentalSettings = { ...base };
  for (const k of NUM_KEYS) {
    const v = raw[k];
    if (v === null && NULLABLE.has(k)) (out as Record<string, unknown>)[k] = null;
    else if (v != null && Number.isFinite(Number(v)) && Number(v) >= 0) (out as Record<string, unknown>)[k] = Number(v);
  }
  for (const k of BOOL_KEYS) {
    const v = raw[k];
    if (typeof v === 'boolean') (out as Record<string, unknown>)[k] = v;
  }
  const s = raw.surcharges;
  if (Array.isArray(s)) {
    out.surcharges = s
      .filter((x): x is Surcharge => !!x && typeof x === 'object' && typeof (x as Surcharge).label === 'string' && Number.isFinite(Number((x as Surcharge).amount)))
      .map((x) => ({ label: x.label, amount: Number(x.amount), per: x.per === 'day' ? 'day' : 'rental' }));
  }
  return out;
}

/** Raw settings row (or override bag) → validated RentalSettings. */
export function settingsFromRow(raw: Record<string, unknown> | null | undefined): RentalSettings {
  return mergeSettings(DEFAULT_SETTINGS, raw);
}

export async function fetchRentalSettings(): Promise<RentalSettings> {
  try {
    const sb = publicReadClient();
    const { data, error } = await sb.from('arrivo_rental_settings').select('*').eq('id', true).maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return settingsFromRow(data as Record<string, unknown>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export type DeliveryLocation = {
  id: string;
  name: string;
  kind: string;
  fee: number;
  min_rental_days: number | null;
  pickup_instructions: string | null;
};

/** Active delivery locations offered for this vehicle (global rows + vehicle rows). */
export async function fetchDeliveryLocations(vehicleId: string): Promise<DeliveryLocation[]> {
  try {
    const sb = publicReadClient();
    const { data, error } = await sb
      .from('arrivo_delivery_locations')
      .select('id, vehicle_id, name, kind, fee, min_rental_days, pickup_instructions, sort')
      .eq('active', true)
      .order('sort');
    if (error || !data) return [];
    return (data as (DeliveryLocation & { vehicle_id: string | null; sort: number })[])
      .filter((l) => !l.vehicle_id || l.vehicle_id === vehicleId)
      .map(({ id, name, kind, fee, min_rental_days, pickup_instructions }) => ({
        id, name, kind, fee: Number(fee) || 0, min_rental_days, pickup_instructions,
      }));
  } catch {
    return [];
  }
}

export type VehicleTermsSource = Pick<
  LiveVehicle,
  'daily_rate' | 'weekly_rate' | 'included_miles_per_day' | 'extra_mileage_fee' | 'unlimited_mileage'
> & {
  included_miles_per_week?: number | null;
  rental_overrides?: Record<string, unknown> | null;
  protection_disabled_plans?: string[] | null;
};

/** Global settings + this vehicle's overrides, flattened. */
export type ResolvedTerms = RentalSettings & {
  daily_rate: number;
  weekly_rate: number | null;
  vehicle_included_miles_per_day: number | null;
  vehicle_included_miles_per_week: number | null;
  vehicle_excess_rate: number | null;
  unlimited_mileage: boolean;
  disabled_plans: ProtectionPlanId[];
};

export function resolveTerms(vehicle: VehicleTermsSource, settings: RentalSettings): ResolvedTerms {
  const merged = mergeSettings(settings, vehicle.rental_overrides ?? null);
  const disabled = (vehicle.protection_disabled_plans ?? []).filter(
    (p): p is ProtectionPlanId => p === 'none' || p === 'standard' || p === 'premium',
  );
  return {
    ...merged,
    daily_rate: Number(vehicle.daily_rate ?? 0),
    weekly_rate: vehicle.weekly_rate != null ? Number(vehicle.weekly_rate) : null,
    vehicle_included_miles_per_day: vehicle.included_miles_per_day ?? null,
    vehicle_included_miles_per_week: vehicle.included_miles_per_week ?? null,
    vehicle_excess_rate: vehicle.extra_mileage_fee != null ? Number(vehicle.extra_mileage_fee) : null,
    unlimited_mileage: vehicle.unlimited_mileage === true,
    disabled_plans: disabled,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Weekly-capped pricing: whole weeks at the weekly price, the remainder at
 * the daily price but never more than another week. weekly=null → daily × 7.
 * 7 days on the Pacifica ($549/wk) = $549, not 7 × daily.
 */
export function weeklyCapped(days: number, daily: number, weekly: number | null): number {
  if (days <= 0 || daily < 0) return 0;
  const wk = weekly != null && weekly > 0 ? weekly : daily * 7;
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  return round2(weeks * wk + Math.min(rem * daily, wk));
}

/** Included mileage for a rental length. null = unlimited. */
export function mileageAllowance(days: number, t: ResolvedTerms): number | null {
  if (t.unlimited_mileage) return null;
  const perWeek = t.vehicle_included_miles_per_week ?? t.included_miles_per_week;
  const perDay = t.vehicle_included_miles_per_day ?? t.included_miles_per_day;
  if (perWeek != null && perWeek > 0) {
    // Pro-rate the weekly allowance: 2,000 mi/wk → 2,000 for 7 days.
    return Math.round((perWeek * days) / 7);
  }
  if (perDay != null && perDay > 0) return perDay * days;
  return null; // no allowance configured — treated as "ask us" upstream
}

export function excessMileageRate(t: ResolvedTerms): number {
  return t.vehicle_excess_rate != null && t.vehicle_excess_rate > 0 ? t.vehicle_excess_rate : t.excess_mileage_rate;
}

export type PlanView = {
  id: ProtectionPlanId;
  title: string;
  badge: string | null;
  pricePerDay: number;
  totalForDays: number;
  maxResponsibility: number | null; // null = full contractual responsibility
  hold: number;
  includesRoadside: boolean;
};

export function planViews(days: number, t: ResolvedTerms): PlanView[] {
  const plans: PlanView[] = [
    {
      id: 'none',
      title: 'Rental without damage protection',
      badge: null,
      pricePerDay: 0,
      totalForDays: 0,
      maxResponsibility: null,
      hold: t.no_protection_hold,
      includesRoadside: false,
    },
    {
      id: 'standard',
      title: 'Standard Protection',
      badge: 'Most Popular',
      pricePerDay: t.standard_daily_price,
      totalForDays: weeklyCapped(days, t.standard_daily_price, t.standard_weekly_price),
      maxResponsibility: t.standard_max_responsibility,
      hold: t.standard_hold,
      includesRoadside: false,
    },
    {
      id: 'premium',
      title: 'Premium Protection',
      badge: 'Lowest Hold',
      pricePerDay: t.premium_daily_price,
      totalForDays: weeklyCapped(days, t.premium_daily_price, t.premium_weekly_price),
      maxResponsibility: t.premium_max_responsibility,
      hold: t.premium_hold,
      includesRoadside: t.premium_includes_roadside,
    },
  ];
  return plans.filter((p) => !t.disabled_plans.includes(p.id));
}

export type RentalQuote = {
  days: number;
  base: number;
  protection: number;
  additionalDriver: number;
  delivery: number;
  taxable: number;
  tax: number;
  surchargeLines: { label: string; amount: number }[];
  dueToday: number;
  hold: number;
  includedMiles: number | null;
  excessRate: number;
};

export function quoteRental(opts: {
  days: number;
  terms: ResolvedTerms;
  plan: ProtectionPlanId;
  additionalDriver: boolean;
  deliveryFee: number;
}): RentalQuote {
  const { days, terms: t, plan } = opts;
  const base = weeklyCapped(days, t.daily_rate, t.weekly_rate);
  const protection =
    plan === 'standard' ? weeklyCapped(days, t.standard_daily_price, t.standard_weekly_price)
    : plan === 'premium' ? weeklyCapped(days, t.premium_daily_price, t.premium_weekly_price)
    : 0;
  const additionalDriver = opts.additionalDriver
    ? weeklyCapped(days, t.additional_driver_daily, t.additional_driver_weekly_cap)
    : 0;
  const delivery = round2(Math.max(0, opts.deliveryFee));
  const taxable = round2(base + protection + additionalDriver + delivery);
  const surchargeLines = t.surcharges.map((s) => ({
    label: s.label,
    amount: round2(s.per === 'day' ? s.amount * days : s.amount),
  }));
  const tax = round2((taxable * t.tax_rate_pct) / 100 + surchargeLines.reduce((a, s) => a + s.amount, 0));
  const hold =
    plan === 'standard' ? t.standard_hold : plan === 'premium' ? t.premium_hold : t.no_protection_hold;
  return {
    days,
    base,
    protection,
    additionalDriver,
    delivery,
    taxable,
    tax,
    surchargeLines,
    dueToday: round2(taxable + tax),
    hold,
    includedMiles: mileageAllowance(days, t),
    excessRate: excessMileageRate(t),
  };
}
