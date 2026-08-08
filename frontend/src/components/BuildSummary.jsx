export default function BuildSummary({
  selectedVehicle,
  selectedBattery,
  selectedMotor,
  estimatedRange,
  estimatedCost,
  compatibility,
}) {
  return (
    <>
      <h2>Conversion Summary</h2>

      <p>
        <strong>Vehicle:</strong>{" "}
        {selectedVehicle.make} {selectedVehicle.model}
      </p>

      <p>
        <strong>Battery:</strong>{" "}
        {selectedBattery.name}
      </p>

      <p>
        <strong>Motor:</strong>{" "}
        {selectedMotor.name}
      </p>

      <p>
        <strong>Power:</strong>{" "}
        {selectedMotor.power} kW
      </p>

      <p>
        <strong>Torque:</strong>{" "}
        {selectedMotor.torque} Nm
      </p>

      <p>
        <strong>Estimated Range:</strong>{" "}
        {estimatedRange} miles
      </p>

      <p>
        <strong>Estimated Cost:</strong>{" "}
        ${estimatedCost.toLocaleString()}
      </p>

      <p>
        <strong>Compatibility:</strong>{" "}
        {compatibility}
      </p>
    </>
  );
}