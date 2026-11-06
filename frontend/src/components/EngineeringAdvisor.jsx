export default function EngineeringAdvisor({
  assessment,
  estimatedRange = 0,
  estimatedCost = 0,
}) {
  const currentAssessment = assessment || {
    label: "Incomplete configuration",
    disclaimer: "Preliminary screening only. This is not engineering validation or approval.",
    findings: ["Select a vehicle, battery, and motor to run preliminary screening."],
    basis: [],
    notAssessed: [],
    nextSteps: [],
  };

  return (
    <section className="engineering-advisor">
      <div className="engineering-advisor-header">
        <div>
          <p className="vehicle-details-eyebrow">Preliminary Review</p>
          <h2>Compatibility Screening</h2>
        </div>
        <strong>{currentAssessment.label}</strong>
      </div>

      <div className="advisor-recommendations">
        <p>{currentAssessment.disclaimer}</p>
        <h3>Preliminary Findings</h3>
        <ul>{currentAssessment.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
        <h3>Screening Basis</h3>
        <ul>{currentAssessment.basis.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3>Recommended Next Steps</h3>
        <ol>{currentAssessment.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol>
        <h3>Not Assessed</h3>
        <ul>{currentAssessment.notAssessed.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="advisor-context">Build context: {estimatedRange || 0} miles estimated range and ${(Number(estimatedCost) || 0).toLocaleString()} component estimate.</p>
      </div>
    </section>
  );
}
