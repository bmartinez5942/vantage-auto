'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { vehicleName, vehicleHref, type LiveVehicle } from '@/lib/liveVehicles';
import { formatCurrency } from '@/lib/format';

/** Dedicated pre-sharpened 1200x900 baseline-JPEG card thumbnail stored next
 *  to the gallery photos ({folder}/card.jpg). Falls back to the full-size
 *  first photo if the thumb doesn't exist for a vehicle.
 *  The ?v tag busts the long-lived browser/CDN cache when a thumb is
 *  re-encoded — bump it whenever card.jpg files are regenerated. */
const CARD_THUMB_VERSION = '2';
function cardThumbUrl(photo: string): string {
  return photo.replace(/\/[^/]+$/, `/card.jpg?v=${CARD_THUMB_VERSION}`);
}

/** Card for an admin-approved live DB vehicle. The whole card links to the
 *  dynamic detail page (image, name, and "View Details" all navigate there). */
export function LiveVehicleCard({ vehicle }: { vehicle: LiveVehicle }) {
  const name = vehicleName(vehicle);
  const photo = (vehicle.photos ?? [])[0];
  const [thumbFailed, setThumbFailed] = useState(false);
  const src = photo ? (thumbFailed ? photo : cardThumbUrl(photo)) : null;
  const specs: string[] = [];
  if (vehicle.seats != null) specs.push(`${vehicle.seats} Seats`);
  if (vehicle.transmission) specs.push(vehicle.transmission);

  return (
    <Link href={vehicleHref(vehicle)} className="va-vehicle-card" aria-label={`View ${name}`}>
      <div className="va-vehicle-image">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="va-img"
            src={src}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={() => { if (!thumbFailed) setThumbFailed(true); }}
          />
        )}
        {vehicle.category && <span className="va-category-pill">{vehicle.category}</span>}
        <span className="va-heart-button" aria-hidden="true"><Heart size={18} /></span>
      </div>
      <div className="va-vehicle-body">
        <h3>{name}</h3>
        {specs.length > 0 && (
          <div className="va-vehicle-specs">
            {specs.map((s) => <span key={s}>{s}</span>)}
          </div>
        )}
        {vehicle.daily_rate != null && (
          <p className="va-price">From <strong>{formatCurrency(vehicle.daily_rate)}</strong> / day</p>
        )}
        <span className="va-details-button">View Details</span>
      </div>
    </Link>
  );
}
