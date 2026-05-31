import Link from 'next/link';
import { Heart } from 'lucide-react';
import { vehicleName, vehicleHref, type LiveVehicle } from '@/lib/liveVehicles';
import { formatCurrency } from '@/lib/format';

/** Card for an admin-approved live DB vehicle. The whole card links to the
 *  dynamic detail page (image, name, and "View Details" all navigate there). */
export function LiveVehicleCard({ vehicle }: { vehicle: LiveVehicle }) {
  const name = vehicleName(vehicle);
  const photo = (vehicle.photos ?? [])[0];
  const specs: string[] = [];
  if (vehicle.seats != null) specs.push(`${vehicle.seats} Seats`);
  if (vehicle.transmission) specs.push(vehicle.transmission);

  return (
    <Link href={vehicleHref(vehicle)} className="va-vehicle-card" aria-label={`View ${name}`}>
      <div
        className="va-vehicle-image"
        style={photo ? { backgroundImage: `url(${photo})` } : undefined}
      >
        {vehicle.category && <span className="va-category-pill">{vehicle.category}</span>}
        <span className="va-heart-button" aria-hidden="true"><Heart size={18} /></span>
      </div>
      <div className="va-vehicle-body">
        <h3>{name}</h3>
        {specs.length > 0 && (
          <div className="va-vehicle-specs">
            {specs.map((s) => <span key={s}>{s}</span>)}
          </div>
        )}
        {vehicle.daily_rate != null && (
          <p className="va-price">From <strong>{formatCurrency(vehicle.daily_rate)}</strong> / day</p>
        )}
        <span className="va-details-button">View Details</span>
      </div>
    </Link>
  );
}
