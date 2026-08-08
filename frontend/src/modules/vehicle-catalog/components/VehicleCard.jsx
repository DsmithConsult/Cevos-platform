import "./VehicleCard.css";

import "./VehicleCard.css";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <h3>
        {vehicle.year} {vehicle.make}
      </h3>

      <h4>{vehicle.model}</h4>

      <p>
        <strong>Type:</strong> {vehicle.vehicleType}
      </p>

      <p>
        <strong>Weight:</strong> {vehicle.curbWeightLbs} lbs
      </p>

      <p>
        <strong>Seats:</strong> {vehicle.seatingCapacity}
      </p>

      <p>
        <strong>Range:</strong> {vehicle.estimatedRangeMiles} miles
      </p>

      <button>View Details</button>
    </div>
  );
}
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