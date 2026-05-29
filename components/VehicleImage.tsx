'use client';

import { useState } from 'react';

/** Plain <img> with a graceful branded fallback if the photo 404s or is
 *  missing. We avoid next/image here so a broken external URL degrades to the
 *  gradient placeholder instead of a broken-image icon. */
export function VehicleImage({
  src,
  alt,
  label,
}: {
  src?: string | null;
  alt: string;
  label: string;
}) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  return (
    <>
      {show && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src!} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
      {!show && (
        <div className="vehicle-photo-fallback" aria-hidden="true">
          <span>{label}</span>
        </div>
      )}
    </>
  );
}
