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
        .map((row) => {
          const values =
            row.split(",");

          const vehicle = {};

          headers.forEach(
            (header, index) => {
              vehicle[header] =
                values[index];
            }
          );

          return vehicle;
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