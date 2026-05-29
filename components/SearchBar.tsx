'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconArrow } from './icons';
import { AUTO } from '@/lib/branding';

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function SearchBar({ defaults }: { defaults?: { pickup?: string; ret?: string; location?: string; type?: string } }) {
  const router = useRouter();
  const [pickup, setPickup] = useState(defaults?.pickup ?? isoOffset(0));
  const [ret, setRet] = useState(defaults?.ret ?? isoOffset(1));
  const [location, setLocation] = useState(defaults?.location ?? 'Miami, FL');
  const [type, setType] = useState(defaults?.type ?? '');

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickup) params.set('pickup', pickup);
    if (ret) params.set('return', ret);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    router.push(`/rent?${params.toString()}`);
  }

  return (
    <form className="searchbar" onSubmit={search}>
      <div className="search-field">
        <label htmlFor="sb-pickup">Pick-up Date</label>
        <input id="sb-pickup" type="date" value={pickup} onChange={(e) => setPickup(e.target.value)} />
      </div>
      <div className="search-field">
        <label htmlFor="sb-return">Return Date</label>
        <input id="sb-return" type="date" value={ret} min={pickup} onChange={(e) => setRet(e.target.value)} />
      </div>
      <div className="search-field">
        <label htmlFor="sb-loc">Location</label>
        <select id="sb-loc" value={location} onChange={(e) => setLocation(e.target.value)}>
          {AUTO.cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="sb-type">Vehicle Type</label>
        <select id="sb-type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          {AUTO.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary">
        Search Vehicles <IconArrow />
      </button>
    </form>
  );
}
