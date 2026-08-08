import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import SavedProjects from "./components/SavedProjects";
import VehicleImporter from "./components/VehicleImporter";
import vehicles from "./data/vehicles";
import batteries from "./data/batteries";
import motors from "./data/motors";
import EngineeringRecommendations from "./components/EngineeringRecommendations";
import BillofMaterials from "./components/BillofMaterials";
import EngineeringValidation from "./components/EngineeringValidation";
import BuildSummary from "./components/BuildSummary";
import ConversionReport from "./components/ConversionReport";
import BuildComparison from "./components/BuildComparison";
import "./styles.css";

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [selectedMotor, setSelectedMotor] = useState(null);


const [importedVehicles, setImportedVehicles] = useState([]);
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("cevos-projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "cevos-projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  const estimatedRange = selectedBattery
    ? Math.round(selectedBattery.capacity * 3)
    : 0;

  const estimatedCost =
    selectedBattery && selectedMotor
      ? selectedBattery.cost + selectedMotor.cost
      : 0;

  const compatibility =
    selectedBattery && selectedMotor
      ? "✅ PASS"
      : "⚠ Incomplete Configuration";

  const batteryWarning =
    selectedBattery?.capacity > 100
      ? "⚠ Large battery pack may impact cargo space."
      : "✅ Battery size within normal range.";

  const powerToWeight =
    selectedVehicle && selectedMotor
      ? (selectedMotor.power / 5150).toFixed(3)
      : 0;

  const readinessScore =
    selectedVehicle && selectedBattery && selectedMotor
      ? 85
      : 0;

  const recommendations = [];

  if (selectedBattery?.capacity <= 100) {
    recommendations.push(
      "✅ Battery sizing is appropriate for this vehicle."
    );
  } else {
    recommendations.push(
      "⚠ Large battery pack may reduce cargo space and require packaging review."
    );
  }

  if (selectedMotor?.power >= 250) {
    recommendations.push(
      "✅ Motor selection should provide strong SUV performance."
    );
  } else {
    recommendations.push(
      "⚠ Motor power may be limited for a vehicle of this size."
    );
  }

  recommendations.push(
    "⚠ Cooling system design review is recommended."
  );

  recommendations.push(
    "⚠ Wiring layout has not been created."
  );

  const bom =
    selectedVehicle && selectedBattery && selectedMotor
      ? [
          `${selectedVehicle.make} ${selectedVehicle.model}`,
          selectedBattery.name,
          selectedMotor.name,
          "Battery Management System (BMS)",
          "Main Contactor",
          "DC/DC Converter",
          "Onboard Charger",
          "Cooling System",
          "HV Wiring Kit",
          "Safety Disconnect",
        ]
      : [];

  const saveProject = () => {
    const project = {
  id: Date.now(),
  name: `${selectedVehicle.make} ${selectedVehicle.model} Build`,
  range: estimatedRange,
  cost: estimatedCost,
  battery: selectedBattery.name,
  motor: selectedMotor.name,
  power: selectedMotor.power,
  torque: selectedMotor.torque,
  readinessScore,
};

    setProjects([...projects, project]);
  };

  const clearProjects = () => {
    localStorage.removeItem("cevos-projects");
    setProjects([]);
  };
const loadDemoBuild = () => {
  alert("Demo build clicked");

  const demoVehicle = vehicles.find(
    (vehicle) => vehicle.id === "qx60"
  );

  const demoBattery = batteries.find(
    (battery) => battery.id === "95kwh"
  );

  const demoMotor = motors.find(
    (motor) => motor.id === "hyperdrive250"
  );

  setSelectedVehicle(demoVehicle);
  setSelectedBattery(demoBattery);
  setSelectedMotor(demoMotor);
};
const exportPDFReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("CEVOS Conversion Report", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Vehicle: ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
    20,
    40
  );

  doc.text(
    `Battery: ${selectedBattery.name}`,
    20,
    50
  );

  doc.text(
    `Motor: ${selectedMotor.name}`,
    20,
    60
  );

  doc.text(
    `Power: ${selectedMotor.power} kW`,
    20,
    80
  );

  doc.text(
    `Torque: ${selectedMotor.torque} Nm`,
    20,
    90
  );

  doc.text(
    `Range: ${estimatedRange} miles`,
    20,
    100
  );

  doc.text(
    `Estimated Cost: $${estimatedCost.toLocaleString()}`,
    20,
    110
  );

  doc.text(
  `Compatibility: PASS`,
  20,
  120
);

  doc.text(
    `Readiness Score: ${readinessScore}/100`,
    20,
    130
  );

  doc.text("Recommendations", 20, 150);

 recommendations.forEach((item, index) => {
  const cleanItem = item
    .replace("✅", "")
    .replace("⚠", "")
    .trim();

  doc.text(
    `- ${cleanItem}`,
    25,
    160 + index * 10
  );
});

  doc.save("CEVOS-Conversion-Report.pdf");
};
const allVehicles = [
  ...vehicles,
  ...importedVehicles,
];
  return (
    <div className="container">
      <h1>CEVOS Build Designer</h1>
<button
  onClick={loadDemoBuild}
  style={{
    marginBottom: "20px",
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Load QX60 Demo Build
</button>
<VehicleImporter
  onImport={setImportedVehicles}
/>
{importedVehicles.length > 0 && (
  <>
    <h2>Imported Vehicles</h2>

    {importedVehicles.map((vehicle, index) => (
      <div key={index}>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </div>
    ))}
  </>
)}
{importedVehicles.length > 0 && (
  <>
    <h2>Imported Vehicles</h2>

    {importedVehicles.map((vehicle, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #333",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {vehicle.year} {vehicle.make} {vehicle.model}
      </div>
    ))}
  </>
)}
      <h2>Select Vehicle</h2>

      {allVehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          style={{
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>

          <p>Drivetrain: {vehicle.drivetrain}</p>

          <button onClick={() => setSelectedVehicle(vehicle)}>
            Select Vehicle
          </button>
        </div>
      ))}

      {selectedVehicle && (
        <>
          <hr />

          <h2>Selected Vehicle</h2>

          <p>
            {selectedVehicle.year} {selectedVehicle.make}{" "}
            {selectedVehicle.model}
          </p>

          <h2>Select Battery</h2>

          {batteries.map((battery) => (
            <button
              key={battery.id}
              onClick={() => setSelectedBattery(battery)}
              style={{
                display: "block",
                marginBottom: "10px",
              }}
            >
              {battery.name}
            </button>
          ))}

          <h2>Select Motor</h2>

          {motors.map((motor) => (
            <button
              key={motor.id}
              onClick={() => setSelectedMotor(motor)}
              style={{
                display: "block",
                marginBottom: "10px",
              }}
            >
              {motor.name}
            </button>
          ))}
        </>
      )}

      {selectedVehicle && selectedBattery && selectedMotor && (
        <>
          <hr />

          <BuildSummary
  selectedVehicle={selectedVehicle}
  selectedBattery={selectedBattery}
  selectedMotor={selectedMotor}
  estimatedRange={estimatedRange}
  estimatedCost={estimatedCost}
  compatibility={compatibility}
/>


          <hr />

      <EngineeringValidation
  batteryWarning={batteryWarning}
  powerToWeight={powerToWeight}
  readinessScore={readinessScore}
/>

<hr />

<EngineeringRecommendations
  recommendations={recommendations}
/>

<hr />

<ConversionReport
  selectedVehicle={selectedVehicle}
  selectedBattery={selectedBattery}
  selectedMotor={selectedMotor}
  estimatedRange={estimatedRange}
  estimatedCost={estimatedCost}
  readinessScore={readinessScore}
  compatibility={compatibility}
/>

<hr />

<BillofMaterials bom={bom} />

<button
  onClick={exportPDFReport}
  style={{
    marginTop: "20px",
    marginRight: "10px",
    padding: "10px 16px",
  }}
>
  Export PDF Report
</button>


<button
  onClick={saveProject}
  style={{
    marginTop: "20px",
    padding: "10px 16px",
  }}
>
  Save Project
</button>
           
        </>
      )}

  {projects.length > 0 && (
  <SavedProjects
    projects={projects}
    clearProjects={clearProjects}
  
  />
  
)}
<BuildComparison
  projects={projects}
 />
    </div>
  );
}