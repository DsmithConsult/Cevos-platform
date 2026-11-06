import { useState } from "react";
import batteries from "../data/batteries";
import motors from "../data/motors";
import {
  getCompatibilityAssessment,
  getProjectWorkflowStatus,
} from "../services/compatibility";
import {
  EMPTY_WEIGHT_BALANCE_INPUTS,
  getWeightBalanceEstimate,
} from "../services/weightBalance";
import { getVerifiedComponentWeightLb } from "../services/componentData";
import {
  getConversionReportSections,
  renderConversionReport,
} from "../services/conversionReport";

export default function useBuildConfiguration({ allVehicles, catalogVehicles, onSave }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [manualStatus, setManualStatus] = useState("");
  const [weightBalanceInputs, setWeightBalanceInputs] = useState({ ...EMPTY_WEIGHT_BALANCE_INPUTS });
  const weightBalanceEstimate = getWeightBalanceEstimate(weightBalanceInputs);

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
    setWeightBalanceInputs({ ...EMPTY_WEIGHT_BALANCE_INPUTS });
  };
  const updateWeightBalanceInput = (field, value) => {
    setWeightBalanceInputs((current) => ({ ...current, [field]: value }));
  };
  const setPowertrain = (battery, motor) => {
    setSelectedBattery(battery);
    setSelectedMotor(motor);
  };
  const selectBattery = (battery) => {
    setSelectedBattery(battery);
    if (selectedBattery === battery) return;
    setWeightBalanceInputs((current) => ({
      ...current,
      batteryWeightLb: battery ? String(getVerifiedComponentWeightLb(battery) ?? "") : "",
      batteryWeightSourceUrl: battery?.weightSourceUrl || "",
    }));
  };
  const selectMotor = (motor) => {
    setSelectedMotor(motor);
    if (selectedMotor === motor) return;
    setWeightBalanceInputs((current) => ({
      ...current,
      motorWeightLb: motor ? String(getVerifiedComponentWeightLb(motor) ?? "") : "",
      motorWeightSourceUrl: motor?.weightSourceUrl || "",
    }));
  };
  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectName("");
    setManualStatus("");
    setWeightBalanceInputs({ ...EMPTY_WEIGHT_BALANCE_INPUTS });
  };
  const loadBuild = (project) => {
    const vehicle = allVehicles.find((item) => item.id === project.vehicleId || `${item.make}-${item.model}` === project.vehicleId) || null;
    const battery = batteries.find((item) => item.id === project.batteryId) || null;
    const motor = motors.find((item) => item.id === project.motorId) || null;
    setSelectedVehicle(vehicle);
    setSelectedBattery(battery);
    setSelectedMotor(motor);
    setWeightBalanceInputs({ ...EMPTY_WEIGHT_BALANCE_INPUTS, ...(project.weightBalanceInputs || {}) });
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
    onSave({ id: editingProjectId, name: projectName.trim() || `${selectedVehicle.make} ${selectedVehicle.model} Build`, status: manualStatus || buildStatus, vehicleId: String(selectedVehicle.id || `${selectedVehicle.make}-${selectedVehicle.model}`), batteryId: selectedBattery.id, motorId: selectedMotor.id, range: estimatedRange, cost: estimatedCost, battery: selectedBattery.name, motor: selectedMotor.name, power: selectedMotor.power, torque: selectedMotor.torque, weightBalanceInputs });
    setEditingProjectId(null);
  };
  const exportPDFReport = async () => {
    if (!selectedVehicle || !selectedBattery || !selectedMotor) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const sections = getConversionReportSections({
      projectName,
      projectStatus: buildStatus,
      selectedVehicle,
      selectedBattery,
      selectedMotor,
      estimatedRange,
      estimatedCost,
      assessment: compatibilityAssessment,
      weightBalanceInputs,
      weightBalanceEstimate,
      bom,
    });
    renderConversionReport(doc, sections);
    doc.save("CEVOS-Conversion-Report.pdf");
  };

  return { selectedVehicle, selectedBattery, selectedMotor, projectName, setProjectName, editingProjectId, manualStatus, setManualStatus, batteries, motors, estimatedRange, estimatedCost, compatibility, compatibilityAssessment, buildStatus, currentBuild, recommendations, bom, weightBalanceInputs, updateWeightBalanceInput, weightBalanceEstimate, selectVehicle, setSelectedBattery: selectBattery, setSelectedMotor: selectMotor, setPowertrain, resetProjectForm, loadBuild, loadDemoBuild, saveBuild, exportPDFReport };
}
