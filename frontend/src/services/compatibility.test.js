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
  assert.ok(assessment.notAssessed.includes("Physical component fitment and clearances"));
  assert.equal("score" in assessment, false);
  assert.equal("score" in getCompatibilityAssessment(vehicle, battery, motor), false);
});

test("returns existing heuristic warnings as preliminary findings", () => {
  const undersizedBattery = { capacity: 50 };
  const underpoweredMotor = { power: 100 };
  const assessment = getCompatibilityAssessment(vehicle, undersizedBattery, underpoweredMotor);

  assert.equal(assessment.status, "preliminary");
  assert.equal(assessment.label, "Preliminary screening");
  assert.ok(assessment.findings.includes("Battery may be undersized for the selected vehicle."));
  assert.ok(assessment.findings.includes("Motor is underpowered for AWD drivetrain requirements."));
  assert.match(assessment.disclaimer, /not engineering validation/i);
  assert.equal("score" in assessment, false);
});

test("does not imply validation when no heuristic warning is triggered", () => {
  const assessment = getCompatibilityAssessment(vehicle, battery, motor);

  assert.equal(assessment.status, "preliminary");
  assert.deepEqual(assessment.findings, [
    "No preliminary rule-based warnings were triggered by the available inputs."
  ]);
  assert.match(assessment.disclaimer, /not engineering validation/i);
  assert.equal(assessment.notAssessed.length, 6);
  assert.equal(getProjectWorkflowStatus(assessment), "Draft - Needs Review");
  assert.equal(getProjectWorkflowStatus(assessment, "Ready for Review"), "Ready for Review");
});

test("incomplete assessments remain incomplete unless manually overridden", () => {
  const assessment = getCompatibilityAssessment(vehicle, null, motor);

  assert.equal(getProjectWorkflowStatus(assessment), "Incomplete");
  assert.equal(getProjectWorkflowStatus(assessment, "Draft"), "Draft");
});