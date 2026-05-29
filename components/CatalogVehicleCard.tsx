'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BODY_STYLE_LABEL, type AutoVehicleCard } from '@/lib/autoCatalog';

const CATEGORY_LABEL: Record<AutoVehicleCard['category'], string> = {
  luxury: 'Luxury',
  exotic: 'Exotic',
  premium_daily: 'Premium',
  economy: 'Economy',
  family: 'Family',
};

/**
 * Renders a controlled catalog card. The image is only shown when it loads
 * successfully AND the card is `active`; otherwise a clean "Image coming soon"
 * placeholder is shown. We never substitute a different vehicle's photo.
 */
export function CatalogVehicleCard({
  vehicle,
  href = '/contact',
}: {
  vehicle: AutoVehicleCard;
  href?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = vehicle.status === 'active' && Boolean(vehicle.imageUrl) && !failed;

  return (
    <li>
      <Link href={href} className="vehicle-card" aria-label={`Request to book ${vehicle.displayName}`}>
        <div className="vehicle-photo">
          {/* Placeholder is always the base layer, so a missing/404 image never
              flashes a broken icon or a wrong vehicle — the verified photo (once
              added at the exact path) simply covers it. */}
          <div className="vehicle-photo-soon" aria-hidden="true">
            <span className="vehicle-photo-soon-body">{BODY_STYLE_LABEL[vehicle.bodyStyle]}</span>
            <span className="vehicle-photo-soon-label">Image coming soon</span>
          </div>
          {showImage && (
            // alt="" is intentional: the card's Link already carries the
            // accessible name, and an empty alt avoids a broken-text flash.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="vehicle-photo-img"
              src={vehicle.imageUrl}
              alt=""
              loading="lazy"
              onError={() => setFailed(true)}
            />
          )}
          <span className="vehicle-cat-chip">{CATEGORY_LABEL[vehicle.category]}</span>
        </div>
        <div className="vehicle-body">
          <div className="vehicle-name">{vehicle.displayName}</div>
          <div className="vehicle-meta">
            <span className="vehicle-meta-item">{BODY_STYLE_LABEL[vehicle.bodyStyle]}</span>
            <span className="vehicle-meta-item">{vehicle.minYear}+</span>
          </div>
          <span className="vehicle-details-btn" style={{ marginTop: 'auto' }}>Request to Book</span>
        </div>
      </Link>
    </li>
  );
}
