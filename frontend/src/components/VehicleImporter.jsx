import { useState } from "react";

export default function VehicleImporter({
  onImport,
}) {
  const handleFile = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const csv = e.target.result;

      const rows = csv
        .split("\n")
        .map((row) => row.trim());

      const headers =
        rows[0].split(",");

      const vehicles = rows
  .slice(1)
  .filter((row) => row.trim() !== "")
  .map((row) => {
          const values =
            row.split(",");

         const vehicle = {};

headers.forEach((header, index) => {
  vehicle[header.trim()] = values[index]?.trim();
});

const makeModel =
  vehicle["Make/Model"] || "";

const parts =
  makeModel.split(" ");

return {
  id: makeModel
    .toLowerCase()
    .replace(/\s+/g, "-"),

  year: vehicle["Year"],

  make: parts[0] || "",

  model: parts.slice(1).join(" ") || "",

  drivetrain: vehicle["Drivetrain"],

  batteryPackagingScore:
    vehicle["Battery Packaging Score"],

  motorPackagingScore:
    vehicle["Motor Packaging Score"],

  conversionDifficulty:
    vehicle["Conversion Difficulty"],

  recommendedBattery:
    vehicle["Recommended Battery"],

  recommendedMotor:
    vehicle["Recommended Motor"],

  estimatedRange:
    vehicle["Estimated Range"],

  suitabilityScore:
    vehicle["Suitability Score"]
};
        });

      onImport(vehicles);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <h2>Import Vehicles</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
      />
    </>
  );
}