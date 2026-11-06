import { getConversionReportSections } from "../services/conversionReport";

export default function ConversionReport({
  projectName,
  projectStatus,
  selectedVehicle,
  selectedBattery,
  selectedMotor,
  estimatedRange,
  estimatedCost,
  assessment,
  weightBalanceInputs,
  weightBalanceEstimate,
  bom,
}) {
  const sections = getConversionReportSections({
    projectName,
    projectStatus,
    selectedVehicle,
    selectedBattery,
    selectedMotor,
    estimatedRange,
    estimatedCost,
    assessment,
    weightBalanceInputs,
    weightBalanceEstimate,
    bom,
  });

  return (
    <section aria-labelledby="conversion-report-heading">
      <h2 id="conversion-report-heading">Conversion Report</h2>
      {sections.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          <ul>{section.lines.map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}</ul>
        </section>
      ))}
    </section>
  );
}