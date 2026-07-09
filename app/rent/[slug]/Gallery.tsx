'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Interactive vehicle gallery. Clicking any thumbnail swaps the main image;
 * clicking the main image opens a full-screen lightbox with prev/next + keyboard
 * nav. Fixes the prior static gallery where only the first photo was viewable.
 */
export function Gallery({ photos, name }: { photos: string[]; name: string }) {
  const imgs = photos.filter(Boolean);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const safe = imgs.length ? active % imgs.length : 0;

  const go = useCallback(
    (dir: number) => setActive((i) => (imgs.length ? (i + dir + imgs.length) % imgs.length : 0)),
    [imgs.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, go]);

  if (imgs.length === 0) {
    return (
      <div className="gallery-main">
        <div className="vehicle-photo-fallback" aria-hidden="true">
          <span>{name}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="gallery-main"
        role="button"
        tabIndex={0}
        aria-label={`Open ${name} photo ${safe + 1} of ${imgs.length}`}
        onClick={() => setLightbox(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setLightbox(true);
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgs[safe]} alt={`${name} available for rent in Miami through Arrivo — photo ${safe + 1} of ${imgs.length}`} />
      </div>

      {imgs.length > 1 && (
        <div className="gallery-thumbs">
          {imgs.map((p, i) => (
            <button
              type="button"
              className={`gallery-thumb ${i === safe ? 'is-active' : ''}`}
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === safe}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="va-lightbox" role="dialog" aria-modal="true" aria-label={`${name} photos`} onClick={() => setLightbox(false)}>
          <button type="button" className="va-lightbox-close" aria-label="Close" onClick={() => setLightbox(false)}>
            ✕
          </button>
          {imgs.length > 1 && (
            <button
              type="button"
              className="va-lightbox-nav prev"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              ‹
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgs[safe]} alt={`${name} — photo ${safe + 1}`} onClick={(e) => e.stopPropagation()} />
          {imgs.length > 1 && (
            <button
              type="button"
              className="va-lightbox-nav next"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              ›
            </button>
          )}
          <div className="va-lightbox-count">
            {safe + 1} / {imgs.length}
          </div>
        </div>
      )}
    </>
  );
}
