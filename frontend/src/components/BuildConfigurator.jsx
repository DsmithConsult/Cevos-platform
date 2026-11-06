import BuildSummary from "./BuildSummary";
import EngineeringValidation from "./EngineeringValidation";
import EngineeringRecommendations from "./EngineeringRecommendations";
import ConversionReport from "./ConversionReport";
import BillofMaterials from "./BillofMaterials";
import ConversionCostEstimator from "./ConversionCostEstimator";
import CostOptimizationEngine from "./CostOptimizationEngine";
import WeightBalanceAnalysis from "./WeightBalanceAnalysis";

export default function BuildConfigurator({ build, vehicles, onExport, onSave, onReset }) {
  if (!build.selectedVehicle) return null;
  return (
    <>
      <h2>Select Battery</h2>
      {build.batteries.map((battery) => <button key={battery.id} onClick={() => build.setSelectedBattery(battery)} style={{ display: "block", backgroundColor: build.selectedBattery?.id === battery.id ? "#dbeafe" : "#fff" }}>{battery.name}</button>)}
      <h2>Select Motor</h2>
      {build.motors.map((motor) => <button key={motor.id} onClick={() => build.setSelectedMotor(motor)} style={{ display: "block", backgroundColor: build.selectedMotor?.id === motor.id ? "#dbeafe" : "#fff" }}>{motor.name}</button>)}
      {build.selectedBattery && build.selectedMotor && <>
        <hr />
        <label htmlFor="project-name">Project Name</label>
        <input id="project-name" value={build.projectName} onChange={(event) => build.setProjectName(event.target.value)} placeholder="Enter project name" />
        <div><button onClick={() => build.setManualStatus("Ready for Review")}>Mark Ready for Review</button><button onClick={() => build.setManualStatus("Draft - Needs Review")}>Set Draft Review</button><button onClick={() => build.setManualStatus("")}>Clear Status Override</button></div>
        <BuildSummary selectedVehicle={build.selectedVehicle} selectedBattery={build.selectedBattery} selectedMotor={build.selectedMotor} estimatedRange={build.estimatedRange} estimatedCost={build.estimatedCost} compatibility={build.compatibility} />
        <ConversionCostEstimator battery={build.selectedBattery} motor={build.selectedMotor} estimatedRange={build.estimatedRange} />
        <CostOptimizationEngine selectedVehicle={build.selectedVehicle} selectedBattery={build.selectedBattery} selectedMotor={build.selectedMotor} estimatedCost={build.estimatedCost} estimatedRange={build.estimatedRange} vehicles={vehicles} />
        <hr /><EngineeringValidation assessment={build.compatibilityAssessment} />
        <hr /><WeightBalanceAnalysis inputs={build.weightBalanceInputs} onChange={build.updateWeightBalanceInput} estimate={build.weightBalanceEstimate} battery={build.selectedBattery} motor={build.selectedMotor} />
        <hr /><EngineeringRecommendations recommendations={build.recommendations} />
        <hr /><ConversionReport projectName={build.currentBuild.name} projectStatus={build.buildStatus} selectedVehicle={build.selectedVehicle} selectedBattery={build.selectedBattery} selectedMotor={build.selectedMotor} estimatedRange={build.estimatedRange} estimatedCost={build.estimatedCost} assessment={build.compatibilityAssessment} weightBalanceInputs={build.weightBalanceInputs} weightBalanceEstimate={build.weightBalanceEstimate} bom={build.bom} />
        <hr /><BillofMaterials bom={build.bom} />
        <button onClick={onExport}>Export PDF Report</button><button onClick={onSave}>{build.editingProjectId ? "Update Project" : "Save Project"}</button><button onClick={onReset}>New Project</button>
      </>}
    </>
  );
}
