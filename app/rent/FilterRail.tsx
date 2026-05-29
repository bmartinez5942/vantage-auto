'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { CATEGORY_OPTIONS, BODY_STYLE_OPTIONS } from '@/lib/autoCatalog';

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
  const hasFilters = ['cat', 'body'].some((k) => params.has(k));

  return (
    <aside className="filter-panel">
      <div className="filter-group">
        <h5>Category</h5>
        <div className="filter-chip-row">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`filter-chip ${current('cat') === c.value ? 'active' : ''}`}
              onClick={() => toggle('cat', c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h5>Body Style</h5>
        <div className="filter-chip-row">
          {BODY_STYLE_OPTIONS.map((b) => (
            <button
              key={b.value}
              type="button"
              className={`filter-chip ${current('body') === b.value ? 'active' : ''}`}
              onClick={() => toggle('body', b.value)}
            >
              {b.label}
            </button>
          ))}
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
