export default function VehicleDetailModal({ vehicle, onClose }) {
  if (!vehicle) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
        <p>{vehicle.vehicleType || 'Vehicle'}</p>
        <p>Weight: {vehicle.curbWeightLbs ?? 0} lbs</p>
        <p>Seating: {vehicle.seatingCapacity ?? 0}</p>
        <p>Recommended battery: {vehicle.recommendedBatteryKWh ?? 95} kWh</p>
        <p>Recommended motor: {vehicle.recommendedMotorKW ?? 250} kW</p>
        <p>Estimated range: {vehicle.estimatedRangeMiles ?? 285} miles</p>
        <p>Confidence: {vehicle.confidenceScore ?? 92}%</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
