import { useState } from "react";
import batteries from "../data/batteries";
import motors from "../data/motors";
import {
  getCompatibilityAssessment,
  getProjectWorkflowStatus,
} from "../services/compatibility";

export default function useBuildConfiguration({ allVehicles, catalogVehicles, onSave }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [manualStatus, setManualStatus] = useState("");

  const estimatedRange = selectedVehicle && selectedBattery
    ? Math.max(0, Math.round(selectedBattery.capacity * 3)) : 0;
  const estimatedCost = selectedBattery && selectedMotor
    ? selectedBattery.cost + selectedMotor.cost : 0;
  const compatibilityAssessment = getCompatibilityAssessment(selectedVehicle, selectedBattery, selectedMotor);
  const compatibility = compatibilityAssessment.status === "preliminary"
    ? "Preliminary screening only - engineering review required"
    : "Incomplete Configuration";
  const buildStatus = getProjectWorkflowStatus(compatibilityAssessment, manualStatus);
  const currentBuild = {
    name: projectName.trim() || (selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} Build` : "New Build"),
    vehicle: selectedVehicle ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}` : "Not selected",
    battery: selectedBattery?.name || "Not selected",
    motor: selectedMotor?.name || "Not selected",
    range: estimatedRange,
    cost: estimatedCost,
    status: buildStatus,
  };
  const recommendations = compatibilityAssessment.findings;

  const bom = selectedVehicle && selectedBattery && selectedMotor ? [
    `${selectedVehicle.make} ${selectedVehicle.model}`, selectedBattery.name, selectedMotor.name,
    "Battery Management System (BMS)", "Main Contactor", "DC/DC Converter", "Onboard Charger",
    "Cooling System", "HV Wiring Kit", "Safety Disconnect",
  ] : [];

  const selectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedBattery(null);
    setSelectedMotor(null);
    setProjectName(vehicle ? `${vehicle.make} ${vehicle.model} Build` : "");
  };
  const setPowertrain = (battery, motor) => {
    setSelectedBattery(battery);
    setSelectedMotor(motor);
  };
  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectName("");
    setManualStatus("");
  };
  const loadBuild = (project) => {
    const vehicle = allVehicles.find((item) => item.id === project.vehicleId || `${item.make}-${item.model}` === project.vehicleId) || null;
    const battery = batteries.find((item) => item.id === project.batteryId) || null;
    const motor = motors.find((item) => item.id === project.motorId) || null;
    setSelectedVehicle(vehicle);
    setSelectedBattery(battery);
    setSelectedMotor(motor);
    setManualStatus(project.status || "");
    setProjectName(project.name || "");
    setEditingProjectId(project.id);
    return { vehicle, battery, motor };
  };
  const loadDemoBuild = () => {
    const vehicle = catalogVehicles.find((item) => item.id === "qx60" || item.id === 1);
    const battery = batteries.find((item) => item.id === "95kwh");
    const motor = motors.find((item) => item.id === "hyperdrive250");
    selectVehicle(vehicle);
    setSelectedBattery(battery);
    setSelectedMotor(motor);
    setProjectName(`${vehicle.make} ${vehicle.model} Build`);
    setEditingProjectId(null);
  };
  const saveBuild = () => {
    if (!selectedVehicle || !selectedBattery || !selectedMotor) return;
    onSave({ id: editingProjectId, name: projectName.trim() || `${selectedVehicle.make} ${selectedVehicle.model} Build`, status: manualStatus || buildStatus, vehicleId: String(selectedVehicle.id || `${selectedVehicle.make}-${selectedVehicle.model}`), batteryId: selectedBattery.id, motorId: selectedMotor.id, range: estimatedRange, cost: estimatedCost, battery: selectedBattery.name, motor: selectedMotor.name, power: selectedMotor.power, torque: selectedMotor.torque });
    setEditingProjectId(null);
  };
  const exportPDFReport = async () => {
    if (!selectedVehicle || !selectedBattery || !selectedMotor) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("CEVOS Conversion Report", 20, 20); doc.setFontSize(12);
    doc.text(`Vehicle: ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`, 20, 40);
    doc.text(`Battery: ${selectedBattery.name}`, 20, 50); doc.text(`Motor: ${selectedMotor.name}`, 20, 60);
    doc.text(`Power: ${selectedMotor.power} kW`, 20, 80); doc.text(`Torque: ${selectedMotor.torque} Nm`, 20, 90);
    doc.text(`Range: ${estimatedRange} miles`, 20, 100); doc.text(`Estimated Cost: $${estimatedCost.toLocaleString()}`, 20, 110);
    doc.text("Preliminary Review", 20, 120);
    doc.text(compatibilityAssessment.disclaimer, 20, 130);
    doc.text("Findings", 20, 145);
    let reportY = 155;
    [...compatibilityAssessment.findings, ...compatibilityAssessment.notAssessed.map((item) => `Not assessed: ${item}`)].forEach((item) => {
      const lines = doc.splitTextToSize(`- ${item}`, 170);
      if (reportY + lines.length * 6 > 275) {
        doc.addPage();
        reportY = 20;
      }
      doc.text(lines, 25, reportY);
      reportY += lines.length * 6;
    });
    doc.save("CEVOS-Conversion-Report.pdf");
  };

  return { selectedVehicle, selectedBattery, selectedMotor, projectName, setProjectName, editingProjectId, manualStatus, setManualStatus, batteries, motors, estimatedRange, estimatedCost, compatibility, compatibilityAssessment, buildStatus, currentBuild, recommendations, bom, selectVehicle, setSelectedBattery, setSelectedMotor, setPowertrain, resetProjectForm, loadBuild, loadDemoBuild, saveBuild, exportPDFReport };
}
