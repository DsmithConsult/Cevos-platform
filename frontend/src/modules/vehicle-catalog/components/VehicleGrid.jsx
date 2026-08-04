import VehicleCard from './VehicleCard';

export default function VehicleGrid({ vehicles, onSelect }) {
  return (
    <div className="vehicle-grid">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onSelect={onSelect} />
      ))}
    </div>
  );
}
