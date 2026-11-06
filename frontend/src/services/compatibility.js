const NOT_ASSESSED = [
  "Physical component fitment and clearances",
  "Voltage, current, and inverter compatibility",
  "Axle loads and weight distribution",
  "Thermal capacity and sustained-load derating",
  "Structural mounting and crashworthiness",
  "Wiring, controls, and safety-system integration",
];

export const getProjectWorkflowStatus = (assessment, manualStatus = "") => {
  if (manualStatus) return manualStatus;
  return assessment.status === "incomplete" ? "Incomplete" : "Draft - Needs Review";
};

const getPreliminaryFindings = (vehicle, battery, motor) => {
  const vehicleType = String(vehicle.vehicleType || "");
  const normalizedVehicleType = vehicleType.toLowerCase();
  const drivetrain = String(vehicle.drivetrain || vehicle.driveType || "");
  const normalizedDrivetrain = drivetrain.toUpperCase();
  const batteryCapacity = Number(battery.capacity);
  const motorPower = Number(motor.power);

  if (!Number.isFinite(batteryCapacity) || !Number.isFinite(motorPower)) {
    return ["Battery capacity and motor power are required for preliminary screening."];
  }

  const recommendedBattery = normalizedVehicleType === "van"
    ? 120
    : normalizedVehicleType === "suv"
      ? 95
      : normalizedVehicleType === "sedan"
        ? 75
        : 95;
  const recommendedPower = normalizedDrivetrain === "AWD" ? 250 : 180;
  const findings = [];

  if (batteryCapacity > recommendedBattery + 20) {
    findings.push(`Battery capacity is high for a ${normalizedVehicleType || "vehicle"} build.`);
  } else if (batteryCapacity < recommendedBattery - 20) {
    findings.push("Battery may be undersized for the selected vehicle.");
  }

  if (motorPower < recommendedPower - 30) {
    findings.push(`Motor is underpowered for ${drivetrain || "the selected"} drivetrain requirements.`);
  } else if (motorPower > recommendedPower + 50) {
    findings.push("Motor may be oversized relative to the vehicle package.");
  }

  if (normalizedVehicleType === "suv" && batteryCapacity > 120) {
    findings.push("Large battery pack may reduce cargo capacity and package clearance.");
  }

  if (normalizedVehicleType === "sedan" && batteryCapacity > 90) {
    findings.push("Battery sizing should be reviewed for passenger/cargo space in a sedan.");
  }

  if (normalizedVehicleType === "van" && batteryCapacity < 95) {
    findings.push("Van conversion should generally pair with a larger pack for range and payload support.");
  }

  if (normalizedDrivetrain === "AWD" && motorPower < 180) {
    findings.push("AWD vehicles typically need more power for launch and gradeability.");
  }

  return findings;
};

export const getCompatibilityAssessment = (vehicle, battery, motor) => {
  const notAssessed = [...NOT_ASSESSED];
  const disclaimer = "Preliminary screening only. This is not engineering validation or approval.";

  if (!vehicle || !battery || !motor) {
    return {
      status: "incomplete",
      label: "Incomplete configuration",
      disclaimer,
      findings: ["Select a vehicle, battery, and motor to run preliminary screening."],
      notAssessed,
    };
  }

  const findings = getPreliminaryFindings(vehicle, battery, motor);

  return {
    status: "preliminary",
    label: "Preliminary screening",
    disclaimer,
    findings: findings.length
      ? findings
      : ["No preliminary rule-based warnings were triggered by the available inputs."],
    notAssessed,
  };
};
