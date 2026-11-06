const FIELD_LABELS = {
  vehicleWeightLb: "Vehicle curb weight",
  frontAxleWeightLb: "Front axle scale weight",
  wheelbaseIn: "Wheelbase",
  removedDrivetrainWeightLb: "Removed drivetrain weight",
  removedDrivetrainPositionIn: "Removed drivetrain position",
  batteryWeightLb: "Battery weight",
  batteryPositionIn: "Battery position",
  motorWeightLb: "Motor weight",
  motorPositionIn: "Motor position",
};

const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getWeightBalanceEstimate = (inputs) => {
  const values = Object.fromEntries(
    Object.keys(FIELD_LABELS).map((field) => [field, parseNumber(inputs?.[field])])
  );
  const missing = Object.entries(FIELD_LABELS)
    .filter(([field]) => values[field] === null
      && !(field === "removedDrivetrainPositionIn" && values.removedDrivetrainWeightLb === 0))
    .map(([, label]) => label);

  const errors = [];
  if (values.vehicleWeightLb <= 0) errors.push("Vehicle curb weight must be greater than zero.");
  if (values.frontAxleWeightLb <= 0 || values.frontAxleWeightLb >= values.vehicleWeightLb) {
    errors.push("Front axle scale weight must be greater than zero and less than vehicle curb weight.");
  }
  if (values.wheelbaseIn <= 0) errors.push("Wheelbase must be greater than zero.");
  if (values.removedDrivetrainWeightLb < 0) errors.push("Removed drivetrain weight cannot be negative.");
  if (values.batteryWeightLb <= 0) errors.push("Battery weight must be greater than zero.");
  if (values.motorWeightLb <= 0) errors.push("Motor weight must be greater than zero.");

  for (const [field, label] of [
    ["batteryPositionIn", "Battery position"],
    ["motorPositionIn", "Motor position"],
  ]) {
    if (values[field] < 0 || values[field] > values.wheelbaseIn) {
      errors.push(`${label} must be between 0 and the wheelbase.`);
    }
  }
  if (values.removedDrivetrainWeightLb > 0
      && (values.removedDrivetrainPositionIn < 0 || values.removedDrivetrainPositionIn > values.wheelbaseIn)) {
    errors.push("Removed drivetrain position must be between 0 and the wheelbase.");
  }
  const additionalComponents = Array.isArray(inputs?.additionalComponents) ? inputs.additionalComponents : [];
  additionalComponents.forEach((component, index) => {
    const componentLabel = `Additional component ${index + 1}`;
    const name = String(component?.name || "").trim();
    const weightLb = parseNumber(component?.weightLb);
    const positionIn = parseNumber(component?.positionIn);

    if (!name) missing.push(`${componentLabel} name`);
    if (weightLb === null) missing.push(`${componentLabel} weight`);
    else if (weightLb <= 0) errors.push(`${componentLabel} weight must be greater than zero.`);
    if (positionIn === null) missing.push(`${componentLabel} position`);
    else if (positionIn < 0 || positionIn > values.wheelbaseIn) {
      errors.push(`${componentLabel} position must be between 0 and the wheelbase.`);
    }
    if (component?.direction !== "added" && component?.direction !== "removed") {
      errors.push(`${componentLabel} direction must be added or removed.`);
    }
  });
  if (missing.length) return { status: "incomplete", missing };
  if (errors.length) return { status: "invalid", errors };

  let frontAxleLoadLb = values.frontAxleWeightLb;
  let rearAxleLoadLb = values.vehicleWeightLb - values.frontAxleWeightLb;
  const applyLoad = (weightLb, positionIn) => {
    frontAxleLoadLb += weightLb * (values.wheelbaseIn - positionIn) / values.wheelbaseIn;
    rearAxleLoadLb += weightLb * positionIn / values.wheelbaseIn;
  };

  applyLoad(-values.removedDrivetrainWeightLb, values.removedDrivetrainPositionIn ?? 0);
  applyLoad(values.batteryWeightLb, values.batteryPositionIn);
  applyLoad(values.motorWeightLb, values.motorPositionIn);
  additionalComponents.forEach((component) => {
    const sign = component.direction === "removed" ? -1 : 1;
    applyLoad(sign * Number(component.weightLb), Number(component.positionIn));
  });

  if (frontAxleLoadLb < 0 || rearAxleLoadLb < 0) {
    return { status: "invalid", errors: ["The inputs produce a negative estimated axle load; review the measurements."] };
  }

  const estimatedVehicleWeightLb = frontAxleLoadLb + rearAxleLoadLb;
  return {
    status: "calculated",
    frontAxleLoadLb,
    rearAxleLoadLb,
    estimatedVehicleWeightLb,
    frontAxlePercent: frontAxleLoadLb / estimatedVehicleWeightLb * 100,
    rearAxlePercent: rearAxleLoadLb / estimatedVehicleWeightLb * 100,
  };
};

export const EMPTY_WEIGHT_BALANCE_INPUTS = Object.freeze({
  vehicleWeightLb: "",
  frontAxleWeightLb: "",
  wheelbaseIn: "",
  removedDrivetrainWeightLb: "",
  removedDrivetrainPositionIn: "",
  batteryWeightLb: "",
  batteryWeightSourceUrl: "",
  batteryPositionIn: "",
  motorWeightLb: "",
  motorWeightSourceUrl: "",
  motorPositionIn: "",
  additionalComponents: [],
});
