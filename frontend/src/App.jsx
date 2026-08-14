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
const [searchTerm, setSearchTerm] = useState("");
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
const compatibilityScore =
  selectedVehicle &&
  selectedBattery &&
  selectedMotor
    ? Math.min(
        100,
        Number(selectedVehicle.suitabilityScore || 50) +
          (selectedMotor.power >= 250 ? 10 : 0)
      )
    : 0;

const compatibilityRating =
  compatibilityScore >= 90
    ? "🟢 Excellent Match"
    : compatibilityScore >= 75
    ? "🟡 Good Match"
    : compatibilityScore >= 50
    ? "🟠 Moderate Match"
    : "🔴 Poor Match";
  
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
const filteredVehicles = allVehicles.filter(
  (vehicle) =>
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);
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


<h2>Vehicle Search</h2>

<input
  type="text"
  placeholder="Search by make, model, or year..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
  }}
/><p>
  Showing {filteredVehicles.length} vehicles
</p>
      <h2>Vehicle Library</h2>

      {filteredVehicles.map((vehicle) => (
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




          <button onClick={() => setSelectedVehicle(vehicle)}>
            Select Vehicle
          </button>
        </div>
      ))}

      {selectedVehicle && (
  <>
    <hr />

    <h2>Vehicle Intelligence</h2>

    <p>
      {selectedVehicle.year} {selectedVehicle.make}{" "}
      {selectedVehicle.model}
    </p>

    <div
      style={{
        border: "2px solid #4CAF50",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <h3>Vehicle Intelligence</h3>
<p>
  Drivetrain: {selectedVehicle.drivetrain}
</p>
      <p>
        Battery Packaging Score:{" "}
        {selectedVehicle.batteryPackagingScore}/10
      </p>

      <p>
        Motor Packaging Score:{" "}
        {selectedVehicle.motorPackagingScore}/10
      </p>

      <p>
        Conversion Difficulty:{" "}
        {selectedVehicle.conversionDifficulty}
      </p>

      <p>
        Recommended Battery:{" "}
        {selectedVehicle.recommendedBattery}
      </p>

      <p>
        Recommended Motor:{" "}
        {selectedVehicle.recommendedMotor}
      </p>

      <p>
        Estimated Range:{" "}
        {selectedVehicle.estimatedRange}
      </p>

      <p>
        Suitability Score:{" "}
        {selectedVehicle.suitabilityScore}/100
      </p>
    </div>

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
<div
  style={{
    backgroundColor:
      compatibilityScore >= 90
        ? "#16a34a"
        : compatibilityScore >= 75
        ? "#eab308"
        : "#dc2626",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "bold",
    marginBottom: "1rem",
  }}
>
  Compatibility Score: {compatibilityScore}/100

  <br />

  {compatibilityRating}
</div>
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