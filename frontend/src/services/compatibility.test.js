import assert from "node:assert/strict";
import test from "node:test";
import {
  getCompatibilityAssessment,
  getProjectWorkflowStatus,
} from "./compatibility.js";

const vehicle = {
  vehicleType: "SUV",
  drivetrain: "AWD",
  suitabilityScore: 92,
};

const battery = {
  capacity: 95,
};

const motor = {
  power: 250,
};

test("returns incomplete status when a required selection is missing", () => {
  const assessment = getCompatibilityAssessment(vehicle, battery, null);

  assert.equal(assessment.status, "incomplete");
  assert.equal(assessment.label, "Incomplete configuration");
  assert.ok(assessment.findings.includes(
    "Select a vehicle, battery, and motor to run preliminary screening."
  ));
  assert.ok(assessment.basis.some((item) => /requires a selected vehicle/.test(item)));
  assert.ok(assessment.notAssessed.includes("Physical component fitment and clearances"));
  assert.ok(assessment.nextSteps.some((step) => /manufacturer datasheets/.test(step)));
  assert.equal("score" in assessment, false);
  assert.equal("score" in getCompatibilityAssessment(vehicle, battery, motor), false);
});

test("returns existing heuristic warnings as preliminary findings", () => {
  const undersizedBattery = { capacity: 50 };
  const underpoweredMotor = { power: 100 };
  const assessment = getCompatibilityAssessment(vehicle, undersizedBattery, underpoweredMotor);

  assert.equal(assessment.status, "preliminary");
  assert.equal(assessment.label, "Preliminary review required");
  assert.ok(assessment.findings.some((finding) => /below the 95 kWh suv rule-of-thumb reference/.test(finding)));
  assert.ok(assessment.findings.some((finding) => /below the 250 kW AWD rule-of-thumb reference/.test(finding)));
  assert.ok(assessment.basis.some((item) => /not manufacturer specifications/.test(item)));
  assert.ok(assessment.nextSteps.length > 0);
  assert.match(assessment.disclaimer, /not engineering validation/i);
  assert.equal("score" in assessment, false);
});

test("does not imply validation when no heuristic warning is triggered", () => {
  const assessment = getCompatibilityAssessment(vehicle, battery, motor);

  assert.equal(assessment.status, "preliminary");
  assert.deepEqual(assessment.findings, [
    "No warnings were triggered by the limited rule-of-thumb checks; this does not establish compatibility."
  ]);
  assert.equal(assessment.basis.length, 3);
  assert.match(assessment.disclaimer, /not engineering validation/i);
  assert.equal(assessment.notAssessed.length, 6);
  assert.equal(getProjectWorkflowStatus(assessment), "Draft - Needs Review");
  assert.equal(getProjectWorkflowStatus(assessment, "Ready for Review"), "Ready for Review");
});

test("unknown vehicle types do not receive a fallback battery sizing rule", () => {
  const assessment = getCompatibilityAssessment(
    { vehicleType: "Coupe", drivetrain: "RWD" },
    battery,
    motor,
  );

  assert.ok(assessment.findings.some((finding) => /No battery-capacity rule/.test(finding)));
  assert.ok(assessment.basis.some((item) => /Motor power rule-of-thumb reference/.test(item)));
});

test("invalid specification values are called out instead of receiving fallback scores", () => {
  const assessment = getCompatibilityAssessment(vehicle, { capacity: 0 }, { power: NaN });

  assert.ok(assessment.findings.some((finding) => /positive number of kWh/.test(finding)));
  assert.ok(assessment.findings.some((finding) => /positive number of kW/.test(finding)));
  assert.ok(assessment.basis.some((item) => /screening unavailable/.test(item)));
});

test("incomplete assessments remain incomplete unless manually overridden", () => {
  const assessment = getCompatibilityAssessment(vehicle, null, motor);

  assert.equal(getProjectWorkflowStatus(assessment), "Incomplete");
  assert.equal(getProjectWorkflowStatus(assessment, "Draft"), "Draft");
});