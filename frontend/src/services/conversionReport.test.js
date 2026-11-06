import assert from "node:assert/strict";
import test from "node:test";
import { getConversionReportSections, renderConversionReport } from "./conversionReport.js";

const makeReport = (overrides = {}) => ({
  projectName: "QX60 Example",
  projectStatus: "Draft - Needs Review",
  selectedVehicle: { year: 2017, make: "Infiniti", model: "QX60" },
  selectedBattery: { name: "95 kWh NMC Pack", capacity: 95 },
  selectedMotor: { name: "HyperDrive 250", power: 250, torque: 450 },
  estimatedRange: 285,
  estimatedCost: 16300,
  assessment: {
    label: "Preliminary screening",
    disclaimer: "Not engineering validation.",
    basis: ["Coarse rule-of-thumb inputs."],
    findings: ["Review battery sizing."],
    notAssessed: ["Physical fitment."],
    nextSteps: ["Collect supplier datasheets."],
  },
  weightBalanceInputs: {
    vehicleWeightLb: "4000",
    frontAxleWeightLb: "2400",
    wheelbaseIn: "120",
    removedDrivetrainWeightLb: "500",
    removedDrivetrainPositionIn: "20",
    batteryWeightLb: "900",
    batteryWeightSourceUrl: "https://battery.example/spec.pdf",
    batteryPositionIn: "60",
    motorWeightLb: "200",
    motorWeightSourceUrl: "http://motor.example/spec",
    motorPositionIn: "20",
  },
  weightBalanceEstimate: {
    status: "calculated",
    frontAxleLoadLb: 2600,
    frontAxlePercent: 56.52,
    rearAxleLoadLb: 2000,
    rearAxlePercent: 43.48,
    estimatedVehicleWeightLb: 4600,
  },
  bom: ["95 kWh NMC Pack", "HyperDrive 250"],
  ...overrides,
});

test("report sections disclose planning inputs, estimates, assumptions, and limitations", () => {
  const sections = getConversionReportSections(makeReport());
  const text = sections.flatMap((section) => [section.title, ...section.lines]).join("\n");

  assert.match(text, /Battery position from front axle: 60 in/);
  assert.match(text, /Battery weight source URL \(user-provided; not independently verified\): https:\/\/battery\.example\/spec\.pdf/);
  assert.match(text, /Motor weight source URL \(HTTPS required; not used as verification\): http:\/\/motor\.example\/spec/);
  assert.match(text, /Estimated front axle load: 2600 lb \(56\.5%\)/);
  assert.match(text, /3 miles per kWh/);
  assert.match(text, /not a safe-load determination/);
  assert.match(text, /Review battery sizing/);
  assert.match(text, /Coarse rule-of-thumb inputs/);
  assert.match(text, /Collect supplier datasheets/);
  assert.match(text, /Physical fitment/);
});

test("incomplete and invalid weight-balance inputs are disclosed", () => {
  const incomplete = getConversionReportSections(makeReport({
    weightBalanceEstimate: { status: "incomplete", missing: ["Battery weight"] },
  }));
  const invalid = getConversionReportSections(makeReport({
    weightBalanceEstimate: { status: "invalid", errors: ["Wheelbase must be greater than zero."] },
  }));

  assert.ok(incomplete[2].lines.some((line) => line.includes("Battery weight")));
  assert.ok(invalid[2].lines.some((line) => line.includes("Wheelbase must be greater than zero.")));
});

test("weight source URLs are included in reports and blank sources are explicit", () => {
  const inputs = { ...makeReport().weightBalanceInputs, batteryWeightSourceUrl: "", motorWeightSourceUrl: "" };
  const sections = getConversionReportSections(makeReport({ weightBalanceInputs: inputs }));
  const reportInputs = sections[2].lines.join("\n");

  assert.match(reportInputs, /Battery weight source URL: Not provided/);
  assert.match(reportInputs, /Motor weight source URL: Not provided/);
});

test("report lists additional component changes, positions, and user-provided sources", () => {
  const sections = getConversionReportSections(makeReport({
    weightBalanceInputs: {
      ...makeReport().weightBalanceInputs,
      additionalComponents: [{
        name: "Inverter",
        direction: "added",
        weightLb: "100",
        positionIn: "100",
        sourceUrl: "https://supplier.example/inverter.pdf",
      }],
    },
  }));
  const reportInputs = sections[2].lines.join("\n");

  assert.match(reportInputs, /1\. Inverter - added, 100 lb at 100 in/);
  assert.match(reportInputs, /Inverter weight source URL \(user-provided; not independently verified\): https:\/\/supplier\.example\/inverter\.pdf/);
  assert.match(reportInputs, /includes only the entered removed drivetrain, battery, motor, and additional component masses/);
});

test("PDF rendering splits long reports across pages and adds page numbers", () => {
  const output = [];
  let currentPage = 1;
  const doc = {
    internal: { pageSize: { getHeight: () => 120 } },
    setFontSize() {},
    splitTextToSize(text) {
      const words = text.split(" ");
      const lines = [];
      let line = "";
      for (const word of words) {
        if (`${line} ${word}`.trim().length > 32) {
          lines.push(line);
          line = word;
        } else {
          line = `${line} ${word}`.trim();
        }
      }
      if (line) lines.push(line);
      return lines;
    },
    text(lines, x, y) { output.push({ page: currentPage, lines, x, y }); },
    addPage() { currentPage += 1; },
    getNumberOfPages() { return currentPage; },
    setPage(page) { currentPage = page; },
  };
  const sections = getConversionReportSections(makeReport());

  renderConversionReport(doc, sections);

  assert.ok(currentPage > 1);
  const renderedText = output
    .map(({ lines }) => Array.isArray(lines) ? lines.join(" ") : lines)
    .join(" ")
    .replace(/\s+/g, " ");
  assert.ok(renderedText.includes("Battery position from front axle"), renderedText);
  assert.ok(output.some(({ lines }) => (Array.isArray(lines) ? lines.join(" ") : lines)
    .includes(`page ${currentPage} of ${currentPage}`)));
});
