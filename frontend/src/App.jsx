import { useEffect, useState } from "react";

import { getBatteries, getMotors, getVehicles, saveProject } from "./services/api";

import VehicleSelector from "./components/VehicleSelector";
import BatterySelector from "./components/BatterySelector";
import MotorSelector from "./components/MotorSelector";
import ResultsPanel from "./components/ResultsPanel";
import ProjectsList from "./components/ProjectsList";
import VehicleCatalogPage from "./modules/vehicle-catalog/pages/VehicleCatalogPage";
import VehicleImportModule from "./modules/vehicle-import/VehicleImportModule";

import "./styles.css";

export default function App() {
  const [vehicleId, setVehicleId] = useState("");
  const [batteryId, setBatteryId] = useState("");
  const [motorId, setMotorId] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [motors, setMotors] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getVehicles().then(setVehicles);
    getBatteries().then(setBatteries);
    getMotors().then(setMotors);
  }, []);

  const battery = batteries.find((b) => b.id === batteryId);
  const motor = motors.find((m) => m.id === motorId);

  const range = battery ? Math.round(battery.capacity * 3) : 0;
  const power = motor ? motor.power : 0;
  const cost = (battery?.cost || 0) + (motor?.cost || 0);

  return (
    <div className="container">
      <h1>CEVOS</h1>
      <h3>Community EV Operating System</h3>

      <VehicleSelector
        vehicles={vehicles}
        selected={vehicleId}
        onChange={setVehicleId}
      />

      <BatterySelector
        batteries={batteries}
        selected={batteryId}
        onChange={setBatteryId}
      />

      <MotorSelector
        motors={motors}
        selected={motorId}
        onChange={setMotorId}
      />

      <ResultsPanel range={range} power={power} cost={cost} />
      <ProjectsList projects={projects} />

      <VehicleCatalogPage />
      <VehicleImportModule />
    </div>
  );
}
