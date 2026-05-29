'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { AUTO } from '@/lib/branding';

const TRANSMISSIONS = ['Automatic', 'Manual'];
const SEATS = [
  { label: '2+', value: '2' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
  { label: '7+', value: '7' },
];
const PRICE_CAPS = [
  { label: '≤ $100', value: '100' },
  { label: '≤ $200', value: '200' },
  { label: '≤ $350', value: '350' },
  { label: '≤ $600', value: '600' },
];

export function FilterRail() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = (key: string) => params.get(key) ?? '';

  const toggle = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (next.get(key) === value) next.delete(key);
      else next.set(key, value);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const clearAll = () => router.push(pathname, { scroll: false });

  const hasFilters = ['type', 'transmission', 'seats', 'maxDaily', 'delivery'].some((k) =>
    params.has(k),
  );

  return (
    <aside className="filter-panel">
      <div className="filter-group">
        <h5>Vehicle Type</h5>
        <div className="filter-chip-row">
          {AUTO.categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-chip ${current('type') === c ? 'active' : ''}`}
              onClick={() => toggle('type', c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h5>Transmission</h5>
        <div className="filter-chip-row">
          {TRANSMISSIONS.map((t) => (
            <button
              key={t}
              type="button"
              className={`filter-chip ${current('transmission') === t ? 'active' : ''}`}
              onClick={() => toggle('transmission', t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h5>Seats</h5>
        <div className="filter-chip-row">
          {SEATS.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`filter-chip ${current('seats') === s.value ? 'active' : ''}`}
              onClick={() => toggle('seats', s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h5>Price / Day</h5>
        <div className="filter-chip-row">
          {PRICE_CAPS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`filter-chip ${current('maxDaily') === p.value ? 'active' : ''}`}
              onClick={() => toggle('maxDaily', p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h5>Delivery</h5>
        <div className="filter-chip-row">
          <button
            type="button"
            className={`filter-chip ${current('delivery') === '1' ? 'active' : ''}`}
            onClick={() => toggle('delivery', '1')}
          >
            Delivery available
          </button>
        </div>
      </div>

      {hasFilters && (
        <div className="filter-actions">
          <button type="button" className="btn-ghost btn-sm btn-block" onClick={clearAll}>
            Clear filters
          </button>
        </div>
      )}
    </aside>
  );
}
