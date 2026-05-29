'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { BODY_STYLE_LABEL, type AutoVehicleCard } from '@/lib/autoCatalog';

const CATEGORY_LABEL: Record<AutoVehicleCard['category'], string> = {
  luxury: 'Luxury',
  exotic: 'Exotic',
  premium_daily: 'Premium',
  economy: 'Economy',
  family: 'Family',
};

/**
 * Controlled catalog card (.va- design). The verified image covers the
 * "Image coming soon" placeholder once it loads; a missing/404 image never
 * shows a broken icon or a wrong vehicle. No price is shown — pricing is
 * admin-approved only — and the CTA is request-to-book (no instant booking).
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
  const body = BODY_STYLE_LABEL[vehicle.bodyStyle];

  return (
    <article className="va-vehicle-card">
      <div className="va-vehicle-image">
        <div className="va-soon" aria-hidden="true">
          <span className="va-soon-body">{body}</span>
          <span className="va-soon-label">Image coming soon</span>
        </div>
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="va-img" src={vehicle.imageUrl} alt="" loading="lazy" onError={() => setFailed(true)} />
        )}
        <div className="va-category-pill">{CATEGORY_LABEL[vehicle.category]}</div>
        <button className="va-heart-button" type="button" aria-label={`Save ${vehicle.displayName}`}>
          <Heart size={18} />
        </button>
      </div>
      <div className="va-vehicle-body">
        <h3>{vehicle.displayName}</h3>
        <div className="va-vehicle-specs">
          <span>{body}</span>
          <span>{vehicle.minYear}+</span>
        </div>
        <a className="va-details-button" href={href} aria-label={`Request to book ${vehicle.displayName}`}>
          Request to Book
        </a>
      </div>
    </article>
  );
}
