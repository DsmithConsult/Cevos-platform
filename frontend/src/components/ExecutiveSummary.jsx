const LABOR_COST = 125 * 80;
const ENGINEERING_REVIEW_COST = 1500;
const MISCELLANEOUS_COMPONENTS_COST = 2500;

const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;

export default function ExecutiveSummary({ vehicle, assessment, estimatedRange, selectedBattery, selectedMotor }) {
  if (!vehicle) return null;

  const totalCost = (Number(selectedBattery?.cost) || 0) + (Number(selectedMotor?.cost) || 0) + LABOR_COST + ENGINEERING_REVIEW_COST + MISCELLANEOUS_COMPONENTS_COST;
  const review = assessment || {
    label: "Incomplete configuration",
    findings: ["Select a vehicle, battery, and motor to run preliminary screening."],
    notAssessed: [],
  };
  const risks = [...review.findings, ...review.notAssessed];
  const nextSteps = [
    "Review component specifications and vehicle measurements with a qualified engineer.",
    "Complete cooling, high-voltage wiring, and safety disconnect design reviews.",
    "Validate the estimate with vehicle-specific measurements and supplier quotes.",
  ];

  return (
    <section className="executive-summary printable-executive-summary">
      <div className="executive-summary-header">
        <div>
          <p className="vehicle-details-eyebrow">Decision Brief</p>
          <h2>Executive Conversion Summary</h2>
          <p className="executive-summary-vehicle">{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim || ""}</p>
        </div>
        <button className="print-summary-button" onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      <div className="executive-summary-grid">
        <article className="executive-summary-card executive-summary-wide">
          <h3>Vehicle Overview</h3>
          <p>{vehicle.bodyStyle || vehicle.vehicleType || "Vehicle"} with {vehicle.driveType || vehicle.drivetrain || "unknown drivetrain"} configuration.</p>
        </article>
        <article className="executive-summary-card">
          <h3>Recommended Conversion Package</h3>
          <p><strong>{selectedBattery?.name || vehicle.recommendedBattery || "Battery not selected"}</strong></p>
          <p><strong>{selectedMotor?.name || vehicle.recommendedMotor || "Motor not selected"}</strong></p>
        </article>
        <article className="executive-summary-card">
          <h3>Preliminary Compatibility Review</h3>
          <p className="executive-status status-yellow"><span className="status-dot" />{review.label}</p>
          <p>Not an engineering approval.</p>
        </article>
        <article className="executive-summary-card">
          <h3>Total Cost</h3>
          <strong className="executive-metric">{formatCurrency(totalCost)}</strong>
          <p>Includes labor, engineering review, and components.</p>
        </article>
        <article className="executive-summary-card">
          <h3>Estimated Range</h3>
          <strong className="executive-metric">{estimatedRange || "Not available"} miles</strong>
        </article>
        <article className="executive-summary-card executive-summary-wide">
          <h3>Engineering Risks</h3>
          <ul>{risks.map((risk) => <li key={risk}><span className="status-dot status-dot-yellow" />{risk}</li>)}</ul>
        </article>
        <article className="executive-summary-card executive-summary-wide">
          <h3>Recommended Next Steps</h3>
          <ol>{nextSteps.map((step) => <li key={step}>{step}</li>)}</ol>
        </article>
      </div>
    </section>
  );
}
