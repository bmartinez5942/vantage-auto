'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Calendar, MapPin, Car, ChevronDown } from 'lucide-react';
import { AUTO } from '@/lib/branding';
import { CATEGORY_OPTIONS } from '@/lib/autoCatalog';

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const fieldInput: React.CSSProperties = {
  background: 'transparent',
  border: 0,
  outline: 'none',
  color: 'inherit',
  font: 'inherit',
  fontWeight: 650,
  width: '100%',
};

const fieldSelect: React.CSSProperties = {
  ...fieldInput,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  cursor: 'pointer',
};

export function SearchBar({ defaults }: { defaults?: { pickup?: string; ret?: string; location?: string; cat?: string } }) {
  const router = useRouter();
  const [pickup, setPickup] = useState(defaults?.pickup ?? isoOffset(0));
  const [ret, setRet] = useState(defaults?.ret ?? isoOffset(1));
  const [location, setLocation] = useState(defaults?.location ?? 'Miami, FL');
  const [cat, setCat] = useState(defaults?.cat ?? '');

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickup) params.set('pickup', pickup);
    if (ret) params.set('return', ret);
    if (location) params.set('location', location);
    if (cat) params.set('cat', cat);
    router.push(`/rent?${params.toString()}`);
  }

  return (
    <section className="va-search-wrap">
      <form className="va-search-panel" onSubmit={search}>
        <div className="va-search-field">
          <label htmlFor="sb-pickup">Pickup Date</label>
          <div>
            <Calendar size={17} />
            <input id="sb-pickup" type="date" value={pickup} onChange={(e) => setPickup(e.target.value)} style={fieldInput} />
          </div>
        </div>

        <div className="va-search-field">
          <label htmlFor="sb-return">Return Date</label>
          <div>
            <Calendar size={17} />
            <input id="sb-return" type="date" value={ret} min={pickup} onChange={(e) => setRet(e.target.value)} style={fieldInput} />
          </div>
        </div>

        <div className="va-search-field">
          <label htmlFor="sb-loc">Location</label>
          <div>
            <MapPin size={17} />
            <select id="sb-loc" value={location} onChange={(e) => setLocation(e.target.value)} style={fieldSelect}>
              {AUTO.cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </div>
        </div>

        <div className="va-search-field">
          <label htmlFor="sb-type">Vehicle Type</label>
          <div>
            <Car size={17} />
            <select id="sb-type" value={cat} onChange={(e) => setCat(e.target.value)} style={fieldSelect}>
              <option value="">All Types</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </div>
        </div>

        <button type="submit" className="va-search-button">
          Search Vehicles <span>→</span>
        </button>
      </form>
    </section>
  );
}
