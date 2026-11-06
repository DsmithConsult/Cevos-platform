const displayValue = (value, suffix = "") =>
  value === undefined || value === null || value === "" ? "Not provided" : `${value}${suffix}`;

function MetadataRow({ label, value }) {
  return (
    <div className="vehicle-metadata-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function VehicleDetailsCard({ vehicle }) {
  return (
    <section className="vehicle-details">
      <div className="vehicle-details-heading">
        <div>
          <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
        </div>
      </div>

      <div className="vehicle-details-grid">
        <article className="vehicle-metadata-card">
          <h3>Vehicle Overview</h3>
          <MetadataRow label="Year" value={displayValue(vehicle.year)} />
          <MetadataRow label="Make" value={displayValue(vehicle.make)} />
          <MetadataRow label="Model" value={displayValue(vehicle.model)} />
          <MetadataRow label="Trim" value={displayValue(vehicle.trim)} />
          <MetadataRow label="Vehicle type" value={displayValue(vehicle.vehicleType)} />
          <MetadataRow label="Body style" value={displayValue(vehicle.bodyStyle)} />
          <MetadataRow label="Drive type" value={displayValue(vehicle.driveType || vehicle.drivetrain)} />
        </article>

        <article className="vehicle-metadata-card">
          <h3>Dimensions</h3>
          <MetadataRow label="Wheelbase" value={displayValue(vehicle.wheelbaseIn, " in")} />
          <MetadataRow label="Length" value={displayValue(vehicle.lengthIn, " in")} />
          <MetadataRow label="Width" value={displayValue(vehicle.widthIn, " in")} />
          <MetadataRow label="Height" value={displayValue(vehicle.heightIn, " in")} />
        </article>

        <article className="vehicle-metadata-card">
          <h3>Weight &amp; Capacity</h3>
          <MetadataRow label="Curb weight" value={displayValue(vehicle.curbWeightLbs, " lbs")} />
          <MetadataRow label="GVWR" value={displayValue(vehicle.gvwrLbs, " lbs")} />
          <MetadataRow label="Seating capacity" value={displayValue(vehicle.seatingCapacity, " seats")} />
          <MetadataRow label="Door count" value={displayValue(vehicle.doorCount)} />
          <MetadataRow label="Cargo volume" value={displayValue(vehicle.cargoVolumeFt3, " ft³")} />
        </article>

        <article className="vehicle-metadata-card">
          <h3>Recommended Conversion</h3>
          <MetadataRow label="Battery" value={displayValue(vehicle.recommendedBatteryKWh, " kWh")} />
          <MetadataRow label="Motor" value={displayValue(vehicle.recommendedMotorKW, " kW")} />
          <MetadataRow label="Estimated range" value={displayValue(vehicle.estimatedRangeMiles, " miles")} />
          <MetadataRow label="Catalog index (unverified)" value={displayValue(vehicle.confidenceScore, "/100")} />
        </article>

        <article className="vehicle-metadata-card">
          <h3>Component Packaging</h3>
          <MetadataRow label="Battery" value={displayValue(vehicle.batteryLocation)} />
          <MetadataRow label="Motor" value={displayValue(vehicle.motorLocation)} />
          <MetadataRow label="Electronics" value={displayValue(vehicle.electronicsLocation)} />
          <MetadataRow label="Thermal system" value={displayValue(vehicle.thermalSystemLocation)} />
        </article>
      </div>
    </section>
  );
}
