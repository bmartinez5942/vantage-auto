// Acceptance test — 7-day Pacifica reservation (2026-09-19 spec).
// Run: npx tsx scripts/test-rental-quote.ts
import { DEFAULT_SETTINGS, resolveTerms, quoteRental, mileageAllowance, weeklyCapped } from '../lib/rentalTerms';

let failures = 0;
function eq(label: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${label}: got ${JSON.stringify(got)}${ok ? '' : ` — want ${JSON.stringify(want)}`}`);
}

// Pacifica per spec: $549/week base, 2,000 mi/week, $0.45/mi excess.
const pacifica = resolveTerms(
  {
    daily_rate: 75, weekly_rate: 549,
    included_miles_per_day: 200, included_miles_per_week: 2000,
    extra_mileage_fee: 0.45, unlimited_mileage: false,
    rental_overrides: null, protection_disabled_plans: null,
  },
  DEFAULT_SETTINGS,
);

const days = 7;

const none = quoteRental({ days, terms: pacifica, plan: 'none', additionalDriver: false, deliveryFee: 0 });
eq('Base vehicle rental (7d)', none.base, 549);
eq('No-protection price', none.protection, 0);
eq('No-protection hold', none.hold, 700);

const std = quoteRental({ days, terms: pacifica, plan: 'standard', additionalDriver: false, deliveryFee: 0 });
eq('Standard protection (7d)', std.protection, 175);
eq('Standard subtotal before taxes', std.taxable, 724);
eq('Standard due today (0% tax)', std.dueToday, 724);
eq('Standard hold', std.hold, 250);

const prm = quoteRental({ days, terms: pacifica, plan: 'premium', additionalDriver: false, deliveryFee: 0 });
eq('Premium protection (7d)', prm.protection, 245);
eq('Premium subtotal before taxes', prm.taxable, 794);
eq('Premium hold', prm.hold, 150);

eq('Included mileage (7d)', mileageAllowance(7, pacifica), 2000);
eq('Excess mileage rate', std.excessRate, 0.45);

const driver = quoteRental({ days, terms: pacifica, plan: 'standard', additionalDriver: true, deliveryFee: 0 });
eq('Additional driver (7d cap)', driver.additionalDriver, 49);
eq('MIA delivery fee', std.delivery, 0);

// Edge shapes
eq('3-day base uses daily rate', weeklyCapped(3, 75, 549), 225);
eq('8-day base = week + 1 day', weeklyCapped(8, 75, 549), 549 + 75);
eq('10-day daily remainder never exceeds a week', weeklyCapped(14, 75, 549), 1098);
eq('3-day mileage pro-rates the weekly allowance', mileageAllowance(3, pacifica), Math.round((2000 * 3) / 7));
const d3 = quoteRental({ days: 3, terms: pacifica, plan: 'standard', additionalDriver: true, deliveryFee: 0 });
eq('3-day standard protection', d3.protection, 75);
eq('3-day additional driver', d3.additionalDriver, 21);

// Hold is never part of the charge
eq('Hold excluded from due today', std.dueToday === 724 && std.hold === 250, true);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
