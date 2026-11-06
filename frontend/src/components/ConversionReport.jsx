export default function ConversionReport({
  selectedVehicle,
  selectedBattery,
  selectedMotor,
  estimatedRange,
  estimatedCost,
  assessment,
}) {
  const currentAssessment = assessment || {
    label: "Incomplete configuration",
    disclaimer: "Preliminary screening only. This is not engineering validation or approval.",
    findings: [],
    notAssessed: [],
  };

  return (
    <>
      <h2>Conversion Report</h2>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h3>CEVOS Conversion Report</h3>

        <p>
          <strong>Vehicle:</strong>{" "}
          {selectedVehicle.year} {selectedVehicle.make}{" "}
          {selectedVehicle.model}
        </p>

        <p>
          <strong>Battery:</strong>{" "}
          {selectedBattery.name}
        </p>

        <p>
          <strong>Motor:</strong>{" "}
          {selectedMotor.name}
        </p>

        <hr />

        <h4>Performance</h4>

        <p>Range: {estimatedRange} miles</p>

        <p>Power: {selectedMotor.power} kW</p>

        <p>Torque: {selectedMotor.torque} Nm</p>

        <hr />

        <h4>Preliminary Review: {currentAssessment.label}</h4>

        <p>{currentAssessment.disclaimer}</p>
        <ul>
          {[...currentAssessment.findings, ...currentAssessment.notAssessed.map((item) => `Not assessed: ${item}`)].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <hr />

        <h4>Estimated Cost</h4>

        <p>
          ${estimatedCost.toLocaleString()}
        </p>
      </div>
    </>
  );
}