import React, { useMemo } from "react";
import VehicleCatalog from "./components/VehicleCatalog";
import CurrentBuildCard from "./components/CurrentBuildCard";
import VehicleDetailsCard from "./components/VehicleDetailsCard";
import VehiclePackagingDiagram from "./components/VehiclePackagingDiagram";
import EngineeringAdvisor from "./components/EngineeringAdvisor";
import ConversionPackageGenerator from "./components/ConversionPackageGenerator";
import ConversionCandidateRankings from "./components/ConversionCandidateRankings";
import FleetDashboard from "./components/FleetDashboard";
import ExecutiveSummary from "./components/ExecutiveSummary";
import BuildConfigurator from "./components/BuildConfigurator";
import ProjectManagementPanel from "./components/ProjectManagementPanel";
import useVehicleCatalog from "./hooks/useVehicleCatalog";
import useBuildConfiguration from "./hooks/useBuildConfiguration";
import useProjectManagement from "./hooks/useProjectManagement";
import "./styles.css";

export default function App() {
  const catalog = useVehicleCatalog();
  const projectManagement = useProjectManagement();
  const build = useBuildConfiguration({
    allVehicles: catalog.allVehicles,
    catalogVehicles: catalog.catalogVehicles,
    onSave: projectManagement.saveProject,
  });

  const comparison = useMemo(() => {
    const saved = projectManagement.selectedSavedProject;
    return saved ? {
      rangeDifference: build.currentBuild.range - saved.range,
      costDifference: build.currentBuild.cost - saved.cost,
      powerDifference: build.selectedMotor ? build.selectedMotor.power - saved.power : 0,
      torqueDifference: build.selectedMotor ? build.selectedMotor.torque - saved.torque : 0,
    } : null;
  }, [build.currentBuild, build.selectedMotor, projectManagement.selectedSavedProject]);

  return (
    <div className="container">
      <h1>CEVOS Build Designer</h1>
      <FleetDashboard vehicles={catalog.allVehicles} />
      <ConversionCandidateRankings vehicles={catalog.allVehicles} />
      <VehicleCatalog
        filteredVehicles={catalog.filteredVehicles}
        catalogSource={catalog.catalogSource}
        searchTerm={catalog.searchTerm}
        setSearchTerm={catalog.setSearchTerm}
        setImportedVehicles={catalog.setImportedVehicles}
        onSelectVehicle={build.selectVehicle}
        onLoadDemo={build.loadDemoBuild}
      />
      {build.selectedVehicle && (
        <>
          <hr />
          <CurrentBuildCard build={build.currentBuild} />
          <h2>Vehicle Intelligence</h2>
          <VehicleDetailsCard vehicle={build.selectedVehicle} />
          <EngineeringAdvisor
            assessment={build.compatibilityAssessment}
            estimatedRange={build.estimatedRange}
            estimatedCost={build.estimatedCost}
          />
          <ConversionPackageGenerator
            selectedVehicle={build.selectedVehicle}
            selectedBattery={build.selectedBattery}
            selectedMotor={build.selectedMotor}
            targetCost={15000}
            rangeGoal={build.selectedVehicle.estimatedRangeMiles}
            payloadRequirements={build.selectedVehicle.payloadCapacityLbs}
          />
          <VehiclePackagingDiagram vehicle={build.selectedVehicle} />
          <ExecutiveSummary
            vehicle={build.selectedVehicle}
            assessment={build.compatibilityAssessment}
            estimatedRange={build.estimatedRange}
            selectedBattery={build.selectedBattery}
            selectedMotor={build.selectedMotor}
          />
          <BuildConfigurator
            build={build}
            vehicles={catalog.allVehicles}
            onExport={build.exportPDFReport}
            onSave={build.saveBuild}
            onReset={build.resetProjectForm}
          />
        </>
      )}
      <ProjectManagementPanel
        projects={projectManagement.projects}
        selectedProjectId={projectManagement.selectedSavedProjectId}
        setSelectedProjectId={projectManagement.setSelectedSavedProjectId}
        selectedProject={projectManagement.selectedSavedProject}
        comparison={comparison}
        currentBuild={build.currentBuild}
        onLoad={build.loadBuild}
        onEdit={build.loadBuild}
        onDelete={projectManagement.deleteProject}
        onClear={projectManagement.clearProjects}
      />
    </div>
  );
}
