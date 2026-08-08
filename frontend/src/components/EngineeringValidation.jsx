export default function EngineeringValidation({
  batteryWarning,
  powerToWeight,
  readinessScore,
}) {
  return (
    <>
      <h2>Engineering Validation</h2>

      <p>{batteryWarning}</p>

      <p>
        <strong>Estimated Vehicle Weight:</strong> 5,150 lbs
      </p>

      <p>
        <strong>Power-to-Weight Ratio:</strong>{" "}
        {powerToWeight} kW/lb
      </p>

      <p>
        <strong>Build Readiness Score:</strong>{" "}
        {readinessScore}/100
      </p>
    </>
  );
}