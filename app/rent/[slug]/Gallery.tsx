'use client';

import { useState } from 'react';
import { VehicleImage } from '@/components/VehicleImage';

export function Gallery({ photos, label }: { photos: string[]; label: string }) {
  const [active, setActive] = useState(0);
  const main = photos[active];

  return (
    <div>
      <div className="gallery-main">
        <VehicleImage src={main} alt={label} label={label} />
      </div>
      {photos.length > 1 && (
        <div className="gallery-thumbs">
          {photos.map((p, i) => (
            <button
              key={p + i}
              type="button"
              className="gallery-thumb"
              aria-label={`View photo ${i + 1}`}
              onClick={() => setActive(i)}
              style={i === active ? { borderColor: 'var(--gold)' } : undefined}
            >
              <VehicleImage src={p} alt="" label={label} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
