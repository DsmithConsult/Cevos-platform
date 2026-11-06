import assert from "node:assert/strict";
import test from "node:test";
import { getWeightBalanceEstimate } from "./weightBalance.js";

const completeInputs = {
  vehicleWeightLb: "4000",
  frontAxleWeightLb: "2400",
  wheelbaseIn: "120",
  removedDrivetrainWeightLb: "500",
  removedDrivetrainPositionIn: "20",
  batteryWeightLb: "900",
  batteryPositionIn: "60",
  motorWeightLb: "200",
  motorPositionIn: "20",
};

test("calculates static axle loads from removed and added component positions", () => {
  const result = getWeightBalanceEstimate(completeInputs);

  assert.equal(result.status, "calculated");
  assert.ok(Math.abs(result.frontAxleLoadLb - 2600) < 1e-9);
  assert.ok(Math.abs(result.rearAxleLoadLb - 2000) < 1e-9);
  assert.equal(result.estimatedVehicleWeightLb, 4600);
  assert.ok(Math.abs(result.frontAxlePercent - 2600 / 4600 * 100) < 1e-9);
});

test("allows a zero removed mass without requiring a position", () => {
  const inputs = {
    ...completeInputs,
    removedDrivetrainWeightLb: "0",
    removedDrivetrainPositionIn: "",
  };
  const result = getWeightBalanceEstimate(inputs);

  assert.equal(result.status, "calculated");
  assert.equal(result.estimatedVehicleWeightLb, 5100);
});

test("reports missing inputs without treating blank fields as zero", () => {
  const result = getWeightBalanceEstimate({ ...completeInputs, batteryWeightLb: "" });

  assert.equal(result.status, "incomplete");
  assert.deepEqual(result.missing, ["Battery weight"]);
});

test("rejects axle positions outside the wheelbase", () => {
  const result = getWeightBalanceEstimate({ ...completeInputs, motorPositionIn: "121" });

  assert.equal(result.status, "invalid");
  assert.ok(result.errors.includes("Motor position must be between 0 and the wheelbase."));
});

test("rejects invalid baseline axle weights", () => {
  const result = getWeightBalanceEstimate({ ...completeInputs, frontAxleWeightLb: "4000" });

  assert.equal(result.status, "invalid");
  assert.ok(result.errors.includes(
    "Front axle scale weight must be greater than zero and less than vehicle curb weight."
  ));
});

test("includes added components at their entered longitudinal positions", () => {
  const result = getWeightBalanceEstimate({
    ...completeInputs,
    additionalComponents: [{
      name: "Inverter",
      direction: "added",
      weightLb: "100",
      positionIn: "100",
    }],
  });

  assert.equal(result.status, "calculated");
  assert.ok(Math.abs(result.frontAxleLoadLb - (2600 + 100 * 20 / 120)) < 1e-9);
  assert.ok(Math.abs(result.rearAxleLoadLb - (2000 + 100 * 100 / 120)) < 1e-9);
  assert.equal(result.estimatedVehicleWeightLb, 4700);
});

test("subtracts removed components and rejects invalid component input", () => {
  const removed = getWeightBalanceEstimate({
    ...completeInputs,
    additionalComponents: [{
      name: "Fuel tank",
      direction: "removed",
      weightLb: "40",
      positionIn: "20",
    }],
  });
  const invalid = getWeightBalanceEstimate({
    ...completeInputs,
    additionalComponents: [{
      name: "Inverter",
      direction: "added",
      weightLb: "100",
      positionIn: "121",
    }],
  });
  const incomplete = getWeightBalanceEstimate({
    ...completeInputs,
    additionalComponents: [{
      name: "",
      direction: "added",
      weightLb: "",
      positionIn: "",
    }],
  });

  assert.equal(removed.status, "calculated");
  assert.ok(Math.abs(removed.estimatedVehicleWeightLb - 4560) < 1e-9);
  assert.equal(invalid.status, "invalid");
  assert.ok(invalid.errors.includes("Additional component 1 position must be between 0 and the wheelbase."));
  assert.equal(incomplete.status, "incomplete");
  assert.deepEqual(incomplete.missing, [
    "Additional component 1 name",
    "Additional component 1 weight",
    "Additional component 1 position",
  ]);
});
