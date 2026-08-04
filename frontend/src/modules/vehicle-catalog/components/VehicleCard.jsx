export default function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <h3>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h3>

      <p>Type: {vehicle.vehicleType}</p>
      <p>Weight: {vehicle.curbWeightLbs} lbs</p>
      <p>Seats: {vehicle.seatingCapacity}</p>

      {vehicle.estimatedRangeMiles && (
        <p>Range: {vehicle.estimatedRangeMiles} miles</p>
      )}

      <button>View Details</button>
    </div>
  );
}