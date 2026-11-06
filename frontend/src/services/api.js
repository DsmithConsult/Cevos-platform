const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getVehicles() {
  const response = await fetch(`${API_URL}/vehicles`);

  if (!response.ok) {
    throw new Error(`Vehicle catalog request failed with ${response.status}`);
  }

  const vehicles = await response.json();

  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    drivetrain: vehicle.driveType,
    bodyStyle: vehicle.bodyStyle,
    vehicleType: vehicle.vehicleType,
    wheelbaseIn: vehicle.wheelbaseIn,
    lengthIn: vehicle.lengthIn,
    widthIn: vehicle.widthIn,
    heightIn: vehicle.heightIn,
    gvwrLbs: vehicle.gvwrLbs,
    cargoVolumeFt3: vehicle.cargoVolumeFt3,
    doorCount: vehicle.doorCount,
    seatingCapacity: vehicle.seatingCapacity,
    batteryLocation: vehicle.batteryLocation,
    motorLocation: vehicle.motorLocation,
    electronicsLocation: vehicle.electronicsLocation,
    thermalSystemLocation: vehicle.thermalSystemLocation,
    batteryPackagingScore: 7,
    motorPackagingScore: 7,
    conversionDifficulty: vehicle.vehicleType === "Van" ? "Complex" : "Moderate",
    recommendedBattery: `${vehicle.recommendedBatteryKWh} kWh NMC Pack`,
    recommendedMotor: `Phoenix HyperDrive ${vehicle.recommendedMotorKW}`,
    estimatedRange: `${vehicle.estimatedRangeMiles} miles`,
    suitabilityScore: vehicle.confidenceScore,
  }));
}

export async function getBatteries() {
  const response = await fetch(`${API_URL}/batteries`);

  return await response.json();
}

export async function getMotors() {
  const response = await fetch(`${API_URL}/motors`);

  return await response.json();
}

export async function saveProject(project) {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  });

  return await response.json();
}
