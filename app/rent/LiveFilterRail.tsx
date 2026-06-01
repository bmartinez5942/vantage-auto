'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/** Filter chips for the live collection. Categories are derived from the
 *  vehicles actually in inventory (passed in), so we never show an empty
 *  filter. Toggles ?cat= in the URL. */
export function LiveFilterRail({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get('cat') ?? '';

  const toggle = useCallback(
    (value: string) => {
      const next = new URLSearchParams(params.toString());
      if (next.get('cat') === value) next.delete('cat');
      else next.set('cat', value);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  if (categories.length <= 1) return null;

  return (
    <aside className="filter-panel">
      <div className="filter-group">
        <h5>Category</h5>
        <div className="filter-chip-row">
          <button type="button" className={`filter-chip ${current === '' ? 'active' : ''}`} onClick={() => toggle('')}>
            All
          </button>
          {categories.map((c) => (
            <button key={c} type="button" className={`filter-chip ${current === c ? 'active' : ''}`} onClick={() => toggle(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
