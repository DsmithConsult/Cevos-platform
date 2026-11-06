const NOT_ASSESSED = [
  "Physical component fitment and clearances",
  "Voltage, current, and inverter compatibility",
  "Axle loads and weight distribution",
  "Thermal capacity and sustained-load derating",
  "Structural mounting and crashworthiness",
  "Wiring, controls, and safety-system integration",
];

const BASE_NEXT_STEPS = [
  "Confirm the donor vehicle year, trim, drivetrain, and measured condition.",
  "Collect manufacturer datasheets for the battery, motor, inverter, and battery-management system; compare voltage, current, continuous/peak limits, dimensions, mass, and cooling requirements.",
  "Measure the vehicle and proposed component locations; use scale measurements for axle loads instead of catalog estimates.",
  "Have a qualified engineer review vehicle-specific measurements, component specifications, and unresolved findings before purchase or fabrication.",
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
  const findings = [];
  const basis = [];
  const supportedVehicleTypes = ["van", "suv", "sedan"];
  const supportedDrivetrains = ["AWD", "4WD", "FWD", "RWD"];

  if (!Number.isFinite(batteryCapacity) || batteryCapacity <= 0) {
    findings.push("Battery capacity must be a positive number of kWh before capacity screening can be applied.");
  }
  if (!Number.isFinite(motorPower) || motorPower <= 0) {
    findings.push("Motor power must be a positive number of kW before power screening can be applied.");
  }

  if (Number.isFinite(batteryCapacity) && batteryCapacity > 0) {
    if (supportedVehicleTypes.includes(normalizedVehicleType)) {
      const recommendedBattery = normalizedVehicleType === "van"
        ? 120
        : normalizedVehicleType === "suv"
          ? 95
          : 75;
      basis.push(`Battery capacity rule-of-thumb reference: ${recommendedBattery} kWh for ${normalizedVehicleType} vehicles.`);

      if (batteryCapacity > recommendedBattery + 20) {
        findings.push(`Review the ${batteryCapacity} kWh pack against the ${recommendedBattery} kWh ${normalizedVehicleType} rule-of-thumb reference; packaging and usable energy are not assessed.`);
      } else if (batteryCapacity < recommendedBattery - 20) {
        findings.push(`Review whether the ${batteryCapacity} kWh pack meets the project's range and duty-cycle requirements; it is below the ${recommendedBattery} kWh ${normalizedVehicleType} rule-of-thumb reference.`);
      }

      if (normalizedVehicleType === "suv" && batteryCapacity > 120) {
        findings.push("Review cargo-space and clearance tradeoffs for this large pack using vehicle-specific dimensions.");
      }

      if (normalizedVehicleType === "sedan" && batteryCapacity > 90) {
        findings.push("Review passenger-space and cargo-space tradeoffs for this pack using vehicle-specific dimensions.");
      }

      if (normalizedVehicleType === "van" && batteryCapacity < 95) {
        findings.push("Review whether the selected pack supports the van's range and payload duty cycle.");
      }
    } else {
      findings.push(`No battery-capacity rule is defined for vehicle type "${vehicleType || "not provided"}"; confirm range and duty-cycle requirements directly.`);
    }
  } else {
    basis.push("Battery capacity screening unavailable: provide a positive battery capacity in kWh.");
  }

  if (Number.isFinite(motorPower) && motorPower > 0) {
    if (supportedDrivetrains.includes(normalizedDrivetrain)) {
      const recommendedPower = normalizedDrivetrain === "AWD" || normalizedDrivetrain === "4WD" ? 250 : 180;
      basis.push(`Motor power rule-of-thumb reference: ${recommendedPower} kW for ${normalizedDrivetrain}.`);

      if (motorPower < recommendedPower - 30) {
        findings.push(`Review whether the ${motorPower} kW motor meets the vehicle's performance and gradeability targets; it is below the ${recommendedPower} kW ${normalizedDrivetrain} rule-of-thumb reference.`);
      } else if (motorPower > recommendedPower + 50) {
        findings.push(`Review the ${motorPower} kW motor against performance targets, gearing, thermal limits, and component mass; it is above the ${recommendedPower} kW ${normalizedDrivetrain} rule-of-thumb reference.`);
      }
    } else {
      findings.push(`No motor-power rule is defined for drivetrain "${drivetrain || "not provided"}"; compare the motor with measured vehicle requirements.`);
    }
  } else {
    basis.push("Motor power screening unavailable: provide a positive motor power in kW.");
  }

  return { findings, basis };
};

export const getCompatibilityAssessment = (vehicle, battery, motor) => {
  const notAssessed = [...NOT_ASSESSED];
  const disclaimer = "Preliminary screening only. This is not engineering validation or approval.";
  const nextSteps = [...BASE_NEXT_STEPS];

  if (!vehicle || !battery || !motor) {
    return {
      status: "incomplete",
      label: "Incomplete configuration",
      disclaimer,
      findings: ["Select a vehicle, battery, and motor to run preliminary screening."],
      basis: ["Screening requires a selected vehicle, battery, and motor."],
      notAssessed,
      nextSteps,
    };
  }

  const { findings, basis } = getPreliminaryFindings(vehicle, battery, motor);

  return {
    status: "preliminary",
    label: findings.length ? "Preliminary review required" : "Preliminary screening",
    disclaimer,
    findings: findings.length
      ? findings
      : ["No warnings were triggered by the limited rule-of-thumb checks; this does not establish compatibility."],
    basis: [
      ...basis,
      "Rules are coarse project screening references, not manufacturer specifications or validated engineering limits.",
    ],
    notAssessed,
    nextSteps,
  };
};
