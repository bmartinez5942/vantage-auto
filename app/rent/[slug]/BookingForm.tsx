'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useMemo, useState } from 'react';
import { submitBooking, type FormResult } from '@/app/actions';
import { quoteRental, type Vehicle } from '@/lib/vehicles';
import { formatCurrency, formatNumber, rentalDays } from '@/lib/format';
import { IconCheck, IconShield } from '@/components/icons';

const initial: FormResult = { ok: false };

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary btn-block" disabled={pending}>
      {pending ? 'Submitting…' : 'Request to Book'}
    </button>
  );
}

export function BookingForm({
  vehicle,
  defaults,
}: {
  vehicle: Vehicle;
  defaults?: { pickup?: string; ret?: string };
}) {
  const [state, formAction] = useFormState(submitBooking, initial);
  const [pickup, setPickup] = useState(defaults?.pickup ?? isoOffset(1));
  const [ret, setRet] = useState(defaults?.ret ?? isoOffset(3));
  const [delivery, setDelivery] = useState(false);

  const canDeliver = Boolean(vehicle.delivery_available);
  const days = rentalDays(pickup, ret);
  const quote = useMemo(
    () => quoteRental(vehicle, pickup, ret, { delivery: delivery && canDeliver }),
    [vehicle, pickup, ret, delivery, canDeliver],
  );

  if (state.ok) {
    return (
      <div className="booking-box">
        <div className="form-success">
          <strong style={{ display: 'block', marginBottom: 8 }}>Request received</strong>
          {state.message}
        </div>
      </div>
    );
  }

  return (
    <div className="booking-box">
      <div className="booking-price-head">
        <strong>{formatCurrency(vehicle.daily_rate)}</strong>
        <span className="per">/ day</span>
      </div>
      <div className="badge-pending">
        <IconShield /> Every booking is reviewed before it’s confirmed
      </div>

      <form action={formAction} style={{ marginTop: 18 }}>
        <input type="hidden" name="vehicleId" value={vehicle.id} />
        <input type="hidden" name="pickup" value={pickup} />
        <input type="hidden" name="ret" value={ret} />

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="bf-pickup">Pick-up</label>
            <input
              id="bf-pickup"
              type="date"
              value={pickup}
              min={isoOffset(0)}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="bf-return">Return</label>
            <input
              id="bf-return"
              type="date"
              value={ret}
              min={pickup}
              onChange={(e) => setRet(e.target.value)}
            />
          </div>
        </div>

        {canDeliver && (
          <label className="form-check" style={{ marginBottom: 14 }}>
            <input
              type="checkbox"
              name="delivery"
              checked={delivery}
              onChange={(e) => setDelivery(e.target.checked)}
            />
            Deliver to me{vehicle.delivery_fee ? ` (+${formatCurrency(vehicle.delivery_fee)})` : ''}
          </label>
        )}

        <div className="price-lines">
          <div className="price-line">
            <span>
              {formatCurrency(quote.dailyRate)} × {days} {days === 1 ? 'day' : 'days'}
            </span>
            <span>{formatCurrency(quote.rentalSubtotal)}</span>
          </div>
          {quote.cleaningFee > 0 && (
            <div className="price-line">
              <span>Cleaning fee</span>
              <span>{formatCurrency(quote.cleaningFee)}</span>
            </div>
          )}
          {quote.deliveryFee > 0 && (
            <div className="price-line">
              <span>Delivery</span>
              <span>{formatCurrency(quote.deliveryFee)}</span>
            </div>
          )}
          <div className="price-line">
            <span>Mileage included</span>
            <span>
              {vehicle.unlimited_mileage
                ? 'Unlimited'
                : `${formatNumber(quote.includedMiles)} mi`}
            </span>
          </div>
          <div className="price-line total">
            <span>Due at booking request</span>
            <span>{formatCurrency(quote.dueNow)}</span>
          </div>
          {quote.deposit > 0 && (
            <div className="price-line">
              <span>Refundable deposit (at pickup)</span>
              <span>{formatCurrency(quote.deposit)}</span>
            </div>
          )}
        </div>

        <div className="form-section-label">Your details</div>
        <div className="form-field">
          <label htmlFor="bf-name">Full name</label>
          <input id="bf-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="bf-email">Email</label>
            <input id="bf-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="bf-phone">Phone</label>
            <input id="bf-phone" name="phone" type="tel" autoComplete="tel" required />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="bf-notes">Anything we should know? (optional)</label>
          <textarea id="bf-notes" name="notes" rows={3} />
        </div>

        {/* honeypot */}
        <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        {state.error && <div className="form-error">{state.error}</div>}

        <SubmitButton />
        <p className="form-finep">
          <IconCheck /> No charge is made now. We verify license, insurance, and availability before
          confirming. You’ll receive an email to finalize.
        </p>
      </form>
    </div>
  );
}
