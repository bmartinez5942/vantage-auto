import Link from 'next/link';
import { VehicleImage } from './VehicleImage';
import { IconSeats, IconGear, IconFuel, IconHeart } from './icons';
import { vehicleName, vehicleHref, type Vehicle } from '@/lib/vehicles';
import { formatCurrency } from '@/lib/format';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const name = vehicleName(vehicle);
  const photo = (vehicle.photos ?? [])[0];
  return (
    <li>
      <Link href={vehicleHref(vehicle)} className="vehicle-card" aria-label={`View ${name}`}>
        <div className="vehicle-photo">
          <VehicleImage src={photo} alt={name} label={`${vehicle.make ?? 'Vantage'} ${vehicle.model ?? ''}`} />
          {vehicle.category && <span className="vehicle-cat-chip">{vehicle.category}</span>}
          <span className="vehicle-fav" aria-hidden="true"><IconHeart /></span>
        </div>
        <div className="vehicle-body">
          <div className="vehicle-name">{name}</div>
          <div className="vehicle-meta">
            {vehicle.seats != null && (
              <span className="vehicle-meta-item"><IconSeats /> {vehicle.seats} Seats</span>
            )}
            {vehicle.transmission && (
              <span className="vehicle-meta-item"><IconGear /> {vehicle.transmission}</span>
            )}
            {vehicle.fuel_type && (
              <span className="vehicle-meta-item"><IconFuel /> {vehicle.fuel_type}</span>
            )}
          </div>
          <div className="vehicle-price-row">
            <span className="vehicle-price">
              From <strong>{formatCurrency(vehicle.daily_rate)}</strong> <span className="per">/ day</span>
            </span>
            <span className="vehicle-view">View Details →</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
