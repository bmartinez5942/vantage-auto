'use client';

// Protection, Mileage & Rental Details + the booking request flow.
//
// One client component owns the whole selection state so the plan cards in
// the main column and the price summary in the booking rail stay in sync.
// Every dollar figure comes from admin data (lib/rentalTerms.ts) — nothing
// here is hardcoded pricing. The server action re-quotes from the DB and
// never trusts these numbers.
//
// Language rules (compliance): damage plans are contractual damage waivers,
// never "insurance"; no "fully insured" / "zero liability"; the liability
// sentence renders only when the admin toggle says State Farm has confirmed
// coverage for paying renters in writing.

import { useMemo, useState, type ReactNode } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitRentalCheckout, type FormResult } from '@/app/actions';
import {
  planViews, quoteRental, mileageAllowance, excessMileageRate,
  type DeliveryLocation, type ProtectionPlanId, type ResolvedTerms,
} from '@/lib/rentalTerms';
import { formatCurrency } from '@/lib/format';

const initial: FormResult = { ok: false };

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string): number {
  const ms = new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime();
  return Math.round(ms / 86_400_000);
}
const fmt = (n: number) => formatCurrency(n, { cents: true });

const ACKS: { key: string; label: string }[] = [
  { key: 'ack_mileage', label: 'I understand the mileage allowance and excess-mileage rate.' },
  { key: 'ack_drivers', label: 'I understand that only approved drivers named in the rental agreement may operate the vehicle.' },
  { key: 'ack_protection', label: 'I understand the protection option I selected and its exclusions.' },
  { key: 'ack_hold_limit', label: 'I understand that the authorization hold is not my maximum financial responsibility.' },
  { key: 'ack_hold_authorize', label: 'I authorize Arrivo to place the disclosed temporary authorization on my card at vehicle delivery.' },
  { key: 'ack_agreement', label: 'I agree to the rental agreement, cancellation policy and prohibited-use rules.' },
];

function SubmitBtn({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary btn-block" disabled={pending || disabled}>
      {pending ? 'Sending…' : 'Request to Book'}
    </button>
  );
}

export function RentalBooking({
  vehicleId, terms, locations, minDays, maxDays, children,
}: {
  vehicleId: string;
  terms: ResolvedTerms;
  locations: DeliveryLocation[];
  minDays: number;
  maxDays: number | null;
  children: ReactNode;
}) {
  const [pickup, setPickup] = useState(isoOffset(2));
  const [ret, setRet] = useState(isoOffset(2 + Math.max(minDays, 1)));
  const [plan, setPlan] = useState<ProtectionPlanId | null>(null); // must be an active choice
  const [addlDriver, setAddlDriver] = useState(false);
  const [deliveryId, setDeliveryId] = useState<string>('');
  const [acks, setAcks] = useState<Record<string, boolean>>({});
  const [state, formAction] = useFormState(submitRentalCheckout, initial);

  const days = Math.max(daysBetween(pickup, ret), 0);
  const validDays = days >= Math.max(minDays, 1) && (maxDays == null || days <= maxDays);

  const plans = useMemo(() => planViews(Math.max(days, 1), terms), [days, terms]);
  const eligibleLocations = useMemo(
    () => locations.filter((l) => l.min_rental_days == null || days >= l.min_rental_days),
    [locations, days],
  );
  const selectedDelivery = eligibleLocations.find((l) => l.id === deliveryId) ?? null;

  const quote = useMemo(
    () =>
      plan
        ? quoteRental({
            days: Math.max(days, 1),
            terms,
            plan,
            additionalDriver: addlDriver,
            deliveryFee: selectedDelivery?.fee ?? 0,
          })
        : null,
    [days, terms, plan, addlDriver, selectedDelivery],
  );

  const includedMiles = mileageAllowance(Math.max(days, 1), terms);
  const excessRate = excessMileageRate(terms);
  const allAcked = ACKS.every((a) => acks[a.key]);
  const freeAirport = locations.find((l) => l.kind === 'airport' && l.fee === 0);

  if (state.ok) {
    return (
      <div className="detail-layout">
        <div>{children}</div>
        <aside className="booking-box">
          <div className="form-success">
            <strong style={{ display: 'block', marginBottom: 8 }}>Request received</strong>
            {state.message}
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="detail-layout">
      <div>
        {children}

        {/* ── Protection, Mileage & Rental Details ─────────────────── */}
        <section id="rental-details" style={{ marginTop: 28 }}>
          <h2 className="section-title" style={{ fontSize: 24, margin: '8px 0 10px' }}>
            Protection, Mileage &amp; Rental Details
          </h2>
          <p className="muted rd-intro">
            {terms.show_liability_statement && (
              <>Applicable third-party liability protection is included for every approved driver named in the
              rental agreement, subject to policy limits and rental terms.{' '}</>
            )}
            Optional damage-protection plans are available to reduce your financial responsibility for covered
            damage to the rental vehicle.
          </p>

          {/* Plan cards */}
          <div className="plan-grid" role="radiogroup" aria-label="Damage protection options">
            {plans.map((p) => {
              const active = plan === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  role="radio"
                  aria-checked={active}
                  className={`plan-card${active ? ' is-selected' : ''}`}
                  onClick={() => setPlan(p.id)}
                >
                  {p.badge && <span className="plan-badge">{p.badge}</span>}
                  <span className="plan-title">{p.title}</span>
                  <span className="plan-price">
                    {p.id === 'none' ? '$0 additional' : (
                      <>
                        {fmt(p.pricePerDay)} <span className="plan-per">/ rental day</span>
                        {days >= 1 && <span className="plan-total"> · {fmt(p.totalForDays)} for {days} day{days === 1 ? '' : 's'}</span>}
                      </>
                    )}
                  </span>
                  <span className="plan-copy">
                    {p.id === 'none' &&
                      'You may decline optional damage protection. You will remain financially responsible for damage to or loss of the vehicle according to the rental agreement.'}
                    {p.id === 'standard' &&
                      `Reduces your responsibility for covered vehicle damage to a maximum of ${fmt(p.maxResponsibility!)}, subject to the rental agreement's terms and exclusions.`}
                    {p.id === 'premium' &&
                      `Reduces your responsibility for covered vehicle damage to a maximum of ${fmt(p.maxResponsibility!)}${p.includesRoadside ? ' and includes roadside assistance' : ''}, subject to the rental agreement's terms and exclusions.`}
                  </span>
                  <span className="plan-meta">
                    <span>
                      Vehicle-damage responsibility:{' '}
                      <strong>{p.maxResponsibility != null ? `up to ${fmt(p.maxResponsibility)}` : 'full contractual responsibility'}</strong>
                    </span>
                    <span>Temporary authorization hold: <strong>{fmt(p.hold)}</strong></span>
                  </span>
                </button>
              );
            })}
          </div>
          {plan === 'none' && (
            <div className="plan-warning" role="alert">
              By declining damage protection, you acknowledge that you may be responsible for repair costs, theft,
              loss of use and other charges permitted under the rental agreement.
            </div>
          )}

          {/* Authorization hold explainer */}
          <div className="rd-block">
            <h3 className="rd-h">What is an authorization hold?</h3>
            <p className="muted">
              A temporary authorization is placed on the primary renter&apos;s credit card at vehicle delivery to
              cover potential incidental charges. This is not an additional rental charge. Arrivo initiates the
              release after the vehicle is returned and inspected. The renter&apos;s bank determines when the funds
              become available again.
            </p>
          </div>

          {/* Mileage */}
          <div className="rd-block">
            <h3 className="rd-h">Mileage</h3>
            <p className="muted">
              {includedMiles != null ? (
                <>
                  This rental includes up to <strong>{includedMiles.toLocaleString()} miles</strong> during a{' '}
                  {days >= 1 ? `${days}-day` : ''} rental period. Additional mileage is charged at{' '}
                  <strong>{fmt(excessRate)} per mile</strong>. Vehicle mileage is documented at delivery and return.
                </>
              ) : terms.unlimited_mileage ? (
                <>This rental includes unlimited mileage. Vehicle mileage is documented at delivery and return.</>
              ) : (
                <>Mileage allowance is confirmed with your reservation. Additional mileage is charged at{' '}
                <strong>{fmt(excessRate)} per mile</strong>.</>
              )}
            </p>
          </div>

          {/* Additional driver */}
          <div className="rd-block">
            <h3 className="rd-h">Additional driver</h3>
            <p className="muted">
              {fmt(terms.additional_driver_daily)} per day (maximum {fmt(terms.additional_driver_weekly_cap)} per
              seven-day period). Additional drivers must provide a valid driver&apos;s license and identification
              and must be approved and named in the rental agreement before operating the vehicle.
              {terms.show_liability_statement &&
                ' Applicable liability protection is subject to the same policy limits and rental terms.'}
            </p>
          </div>

          {/* Airport delivery */}
          {freeAirport && (
            <div className="rd-block rd-highlight">
              <h3 className="rd-h">Complimentary Miami Airport Delivery &amp; Collection</h3>
              <p className="muted">
                Enjoy complimentary vehicle delivery and collection at {freeAirport.name.replace(/\s*\(MIA\)$/, '')}{' '}
                or the designated airport-area handoff location
                {freeAirport.min_rental_days ? ` on rentals of ${freeAirport.min_rental_days}+ days` : ''}. Flight
                information and advance scheduling are required.
              </p>
            </div>
          )}

          {/* International drivers */}
          {terms.international_licenses_allowed && (
            <div className="rd-block">
              <h3 className="rd-h">International drivers</h3>
              <p className="muted">
                International visitors are welcome. The primary renter and every additional driver must provide a
                valid driver&apos;s license and passport. An International Driving Permit or official translation
                may be required when the license is not written using the Roman alphabet. Final driver eligibility
                is subject to verification.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ── Booking rail ─────────────────────────────────────────── */}
      <aside className="booking-box">
        <div className="booking-price-head">
          <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>From</span>
          <strong>{formatCurrency(terms.daily_rate)}</strong>
          <span className="per">/ day</span>
        </div>
        <div className="badge-pending">Request to Book · Pending Verification</div>

        <form action={formAction} style={{ marginTop: 16 }}>
          <input type="hidden" name="vehicleId" value={vehicleId} />
          <input type="hidden" name="plan" value={plan ?? ''} />
          <input type="hidden" name="deliveryId" value={deliveryId} />

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="bk-pickup">Pick-up</label>
              <input id="bk-pickup" name="pickup" type="date" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="bk-return">Return</label>
              <input id="bk-return" name="ret" type="date" value={ret} onChange={(e) => setRet(e.target.value)} required />
            </div>
          </div>
          {days >= 1 && !validDays && (
            <div className="form-error">
              {maxDays != null && days > maxDays
                ? `Maximum rental is ${maxDays} days.`
                : `Minimum rental is ${Math.max(minDays, 1)} day${Math.max(minDays, 1) > 1 ? 's' : ''}.`}
            </div>
          )}
          {days >= 1 && includedMiles != null && (
            <p className="form-finep" style={{ marginTop: 2 }}>
              Includes up to {includedMiles.toLocaleString()} miles · {fmt(excessRate)}/mi after.
            </p>
          )}

          {/* Protection choice (must be active) */}
          <div className="form-field">
            <label>Damage protection</label>
            {plan ? (
              <div className="rail-choice">
                {plans.find((p) => p.id === plan)?.title}
                {quote && quote.protection > 0 && <> · {fmt(quote.protection)}</>}
                <button type="button" className="rail-change" onClick={() => setPlan(null)}>change</button>
              </div>
            ) : (
              <div className="rail-unchosen">
                Select Standard, Premium or Decline in{' '}
                <a href="#rental-details">Protection, Mileage &amp; Rental Details</a> — protection is never added
                automatically.
              </div>
            )}
          </div>

          {/* Additional driver */}
          <div className="form-field">
            <label className="check-line" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                name="additionalDriver"
                checked={addlDriver}
                onChange={(e) => setAddlDriver(e.target.checked)}
              />
              <span>
                Add an additional driver — {fmt(terms.additional_driver_daily)}/day, max{' '}
                {fmt(terms.additional_driver_weekly_cap)}/week
              </span>
            </label>
          </div>
          {addlDriver && (
            <div className="addl-driver">
              <div className="form-field">
                <label htmlFor="ad-name">Additional driver — full legal name</label>
                <input id="ad-name" name="adName" type="text" required />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="ad-dob">Date of birth</label>
                  <input id="ad-dob" name="adDob" type="date" required />
                </div>
                <div className="form-field">
                  <label htmlFor="ad-country">License country</label>
                  <input id="ad-country" name="adLicenseCountry" type="text" placeholder="United States" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="ad-license">License number</label>
                  <input id="ad-license" name="adLicenseNumber" type="text" required />
                </div>
                <div className="form-field">
                  <label htmlFor="ad-exp">License expiration</label>
                  <input id="ad-exp" name="adLicenseExpiry" type="date" required />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="ad-passport">Passport number (international licenses)</label>
                <input id="ad-passport" name="adPassport" type="text" />
              </div>
              <p className="form-finep">
                A secure link to upload the additional driver&apos;s license and identification follows by email
                after you submit.
              </p>
            </div>
          )}

          {/* Delivery / pickup */}
          <div className="form-field">
            <label htmlFor="bk-delivery">Delivery or pickup</label>
            <select id="bk-delivery" value={deliveryId} onChange={(e) => setDeliveryId(e.target.value)}>
              <option value="">Pickup at Arrivo handoff location — free</option>
              {eligibleLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.fee === 0 ? 'complimentary' : fmt(l.fee)}
                </option>
              ))}
            </select>
            {selectedDelivery?.pickup_instructions && (
              <p className="form-finep" style={{ marginTop: 4 }}>{selectedDelivery.pickup_instructions}</p>
            )}
          </div>

          {/* Contact */}
          <div className="form-field">
            <label htmlFor="bk-name">Full name</label>
            <input id="bk-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="bk-email">Email</label>
            <input id="bk-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="bk-phone">Phone</label>
            <input id="bk-phone" name="phone" type="tel" autoComplete="tel" required />
          </div>
          <div className="form-field">
            <label htmlFor="bk-notes">Notes (optional)</label>
            <textarea id="bk-notes" name="notes" rows={2} />
          </div>

          {/* Price summary */}
          {quote && validDays && (
            <div className="price-summary">
              <div className="ps-row"><span>Base vehicle rental · {days} day{days === 1 ? '' : 's'}</span><span>{fmt(quote.base)}</span></div>
              <div className="ps-row">
                <span>{plan === 'none' ? 'Damage protection — declined' : plans.find((p) => p.id === plan)?.title}</span>
                <span>{fmt(quote.protection)}</span>
              </div>
              {quote.additionalDriver > 0 && (
                <div className="ps-row"><span>Additional driver</span><span>{fmt(quote.additionalDriver)}</span></div>
              )}
              <div className="ps-row">
                <span>Delivery — {selectedDelivery ? selectedDelivery.name : 'Arrivo handoff location'}</span>
                <span>{quote.delivery === 0 ? 'Free' : fmt(quote.delivery)}</span>
              </div>
              {(quote.tax > 0 || quote.surchargeLines.length > 0) && (
                <div className="ps-row"><span>Taxes &amp; required government charges</span><span>{fmt(quote.tax)}</span></div>
              )}
              <div className="ps-row ps-total"><span>Amount due today</span><span>{fmt(quote.dueToday)}</span></div>
              <div className="ps-hold">
                <span>Temporary authorization at delivery</span>
                <strong>{fmt(quote.hold)}</strong>
                <em>Not a charge — placed on your card at delivery and released after return and inspection.</em>
              </div>
            </div>
          )}

          {/* Required acknowledgments */}
          <div className="ack-list">
            {ACKS.map((a) => (
              <label key={a.key} className="check-line">
                <input
                  type="checkbox"
                  name={a.key}
                  checked={!!acks[a.key]}
                  onChange={(e) => setAcks((prev) => ({ ...prev, [a.key]: e.target.checked }))}
                />
                <span>{a.label}</span>
              </label>
            ))}
          </div>

          {/* honeypot */}
          <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {state.error && <div className="form-error">{state.error}</div>}
          <SubmitBtn disabled={!plan || !allAcked || !validDays} />
          <p className="form-finep">
            No charge is collected now. Every booking is request-to-book — we verify availability, your license and
            eligibility, then send secure payment and document-upload links by email to finalize. The amount due
            today is charged only after your reservation is verified.
          </p>
        </form>
      </aside>
    </div>
  );
}
