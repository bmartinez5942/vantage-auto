// Admin-approved pricing for public catalog cards.
//
// A card shows a price ONLY when an admin vehicle is (a) listing_status='live'
// AND (b) linked to that card via vehicles.public_card_id. Anything else shows
// no price. Fails safe: any error (incl. the column not existing yet) returns an
// empty map, so the cards simply render without pricing.
import { publicReadClient } from './supabase';

export type ApprovedPricing = Record<string, { dailyRate: number }>;

export async function fetchApprovedPricing(): Promise<ApprovedPricing> {
  try {
    const sb = publicReadClient();
    const { data, error } = await sb
      .from('vehicles')
      .select('public_card_id, daily_rate')
      .eq('listing_status', 'live')
      .not('public_card_id', 'is', null);
    if (error || !data) return {};

    const map: ApprovedPricing = {};
    for (const row of data as { public_card_id: string | null; daily_rate: number | null }[]) {
      const id = row.public_card_id;
      const rate = Number(row.daily_rate);
      if (!id || !Number.isFinite(rate) || rate <= 0) continue;
      // If several live vehicles map to one card, advertise the lowest "from" rate.
      if (!map[id] || rate < map[id].dailyRate) map[id] = { dailyRate: rate };
    }
    return map;
  } catch {
    return {};
  }
}
