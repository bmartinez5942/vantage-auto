'use server';

// Public form writes. All inserts go through the service-role serverClient
// (RLS grants anon SELECT only, never INSERT). Every booking is created as
// 'pending_verification' — nothing auto-confirms. Pricing is recomputed on the
// server from the APPROVED vehicle columns so the client can't tamper with it.
import { z } from 'zod';
import { serverClient } from '@/lib/supabase';
import { quoteRental, type Vehicle } from '@/lib/vehicles';

export type FormResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

const emailRule = z.string().trim().email('Enter a valid email.');
const nameRule = z.string().trim().min(2, 'Name is required.').max(120);
const phoneRule = z.string().trim().min(7, 'Enter a valid phone number.').max(40);

function trapped(formData: FormData): boolean {
  // Honeypot — real users never fill the hidden "company" field.
  return Boolean((formData.get('company') as string)?.trim());
}

const PRICED_FIELDS =
  'id, slug, make, model, year, daily_rate, weekly_rate, monthly_rate, cleaning_fee, ' +
  'delivery_fee, deposit_amount, delivery_available, min_rental_days, max_rental_days, ' +
  'included_miles_per_day, extra_mileage_fee, unlimited_mileage, listing_status, owner_id';

// ============================ BOOKING REQUEST ============================
const bookingSchema = z.object({
  vehicleId: z.string().uuid('Missing vehicle.'),
  pickup: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a pick-up date.'),
  ret: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a return date.'),
  delivery: z.boolean(),
  name: nameRule,
  email: emailRule,
  phone: phoneRule,
  notes: z.string().trim().max(2000).optional(),
});

export async function submitBooking(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (trapped(formData)) return { ok: true, message: 'Request received.' };

  const parsed = bookingSchema.safeParse({
    vehicleId: formData.get('vehicleId'),
    pickup: formData.get('pickup'),
    ret: formData.get('ret'),
    delivery: formData.get('delivery') === 'on',
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    notes: formData.get('notes') ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }
  const v = parsed.data;
  if (v.ret <= v.pickup) return { ok: false, error: 'Return date must be after pick-up.' };

  const sb = serverClient();
  const { data: vehicle, error: vErr } = await sb
    .from('vehicles')
    .select(PRICED_FIELDS)
    .eq('id', v.vehicleId)
    .eq('listing_status', 'live')
    .maybeSingle();
  if (vErr || !vehicle) {
    return { ok: false, error: 'This vehicle is no longer available to book.' };
  }
  const veh = vehicle as unknown as Vehicle;

  const q = quoteRental(veh, v.pickup, v.ret, {
    delivery: v.delivery && Boolean(veh.delivery_available),
  });

  const min = veh.min_rental_days ?? 1;
  const max = veh.max_rental_days ?? null;
  if (q.days < min) return { ok: false, error: `Minimum rental is ${min} day${min > 1 ? 's' : ''}.` };
  if (max && q.days > max) return { ok: false, error: `Maximum rental is ${max} days.` };

  const { error: insErr } = await sb.from('vehicle_bookings').insert({
    vehicle_id: veh.id,
    customer_name: v.name,
    customer_email: v.email,
    customer_phone: v.phone,
    start_date: v.pickup,
    end_date: v.ret,
    pickup_location: null,
    return_location: null,
    daily_rate: q.dailyRate,
    delivery_fee: q.deliveryFee,
    mileage_allowance: Number.isFinite(q.includedMiles) ? q.includedMiles : null,
    extra_mileage_rate: veh.extra_mileage_fee ?? null,
    gross_amount: q.dueNow,
    total_amount: q.total,
    deposit_amount: q.deposit,
    amount_paid: 0,
    balance_due: q.dueNow,
    booking_status: 'pending_verification',
    payment_status: 'unpaid',
    booking_source: 'website',
    internal_notes: v.notes || null,
  });
  if (insErr) {
    console.error('submitBooking insert:', insErr.message);
    return { ok: false, error: 'Something went wrong submitting your request. Please try again.' };
  }
  return {
    ok: true,
    message:
      'Request received. Your booking is pending verification — our team will confirm availability, ' +
      'review your details, and follow up by email to finalize. No charge has been made.',
  };
}

// ============================ HOST SUBMISSION ============================
const num = (v: FormDataEntryValue | null) => {
  const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
};
const int = (v: FormDataEntryValue | null) => {
  const n = parseInt(String(v ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
};

const hostSchema = z.object({
  ownerName: nameRule,
  email: emailRule,
  phone: phoneRule,
  city: z.string().trim().max(120).optional(),
  year: z.string().trim().optional(),
  make: z.string().trim().min(1, 'Make is required.').max(60),
  model: z.string().trim().min(1, 'Model is required.').max(60),
});

export async function submitHostListing(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (trapped(formData)) return { ok: true, message: 'Submission received.' };

  const parsed = hostSchema.safeParse({
    ownerName: formData.get('ownerName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    city: formData.get('city') ?? undefined,
    year: formData.get('year') ?? undefined,
    make: formData.get('make'),
    model: formData.get('model'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }
  const d = parsed.data;

  const sb = serverClient();
  const { error } = await sb.from('vehicle_host_submissions').insert({
    owner_name: d.ownerName,
    email: d.email,
    phone: d.phone,
    city: d.city || null,
    vehicle_year: int(formData.get('year')),
    make: d.make,
    model: d.model,
    trim: (formData.get('trim') as string)?.trim() || null,
    mileage: int(formData.get('mileage')),
    availability_pref: (formData.get('availability') as string)?.trim() || null,
    delivery_pref: (formData.get('deliveryPref') as string)?.trim() || null,
    notes: (formData.get('notes') as string)?.trim() || null,
    requested_daily_rate: num(formData.get('reqDaily')),
    requested_weekly_rate: num(formData.get('reqWeekly')),
    requested_monthly_rate: num(formData.get('reqMonthly')),
    requested_mileage_limit: int(formData.get('reqMileage')),
    requested_security_deposit: num(formData.get('reqDeposit')),
    status: 'new',
  });
  if (error) {
    console.error('submitHostListing insert:', error.message);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
  return {
    ok: true,
    message:
      'Thank you — your vehicle has been submitted for review. Our team personally vets every vehicle ' +
      'and will reach out to discuss next steps, pricing, and onboarding. Nothing is listed automatically.',
  };
}

// ============================ SOURCE REQUEST ============================
const sourceSchema = z.object({
  fullName: nameRule,
  email: emailRule,
  phone: phoneRule,
  desired: z.string().trim().min(2, 'Tell us what you are looking for.').max(200),
});

export async function submitSourceRequest(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (trapped(formData)) return { ok: true, message: 'Request received.' };

  const parsed = sourceSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    desired: formData.get('desired'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }
  const d = parsed.data;

  const sb = serverClient();
  const { error } = await sb.from('vehicle_source_requests').insert({
    full_name: d.fullName,
    email: d.email,
    phone: d.phone,
    desired_make_model: d.desired,
    year_min: int(formData.get('yearMin')),
    year_max: int(formData.get('yearMax')),
    budget: num(formData.get('budget')),
    color_pref: (formData.get('color') as string)?.trim() || null,
    financing_needed: formData.get('financing') === 'on',
    trade_in: formData.get('tradeIn') === 'on',
    timeline: (formData.get('timeline') as string)?.trim() || null,
    notes: (formData.get('notes') as string)?.trim() || null,
    status: 'new',
  });
  if (error) {
    console.error('submitSourceRequest insert:', error.message);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
  return {
    ok: true,
    message:
      'Request received. Our sourcing team will begin the search and reach out with options that match ' +
      'your criteria, timeline, and budget.',
  };
}
