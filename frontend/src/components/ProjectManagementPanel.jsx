import SavedProjects from "./SavedProjects";
import BuildComparison from "./BuildComparison";

export default function ProjectManagementPanel({ projects, selectedProjectId, setSelectedProjectId, selectedProject, comparison, onLoad, onEdit, onDelete, onClear, currentBuild }) {
  return (
    <>
      {projects.length > 0 && <>
        <hr /><h2>Review Current Build</h2>
        <label htmlFor="saved-project-select">Compare against saved build</label>
        <select id="saved-project-select" value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)}>
          {projects.map((project) => <option key={project.id} value={String(project.id)}>{project.name}</option>)}
        </select>
        {selectedProject && comparison && <div className="results"><p><strong>Current:</strong> {currentBuild.name} ({currentBuild.status})</p><p><strong>Saved:</strong> {selectedProject.name} ({selectedProject.status || "Draft"})</p><p>Range delta: {comparison.rangeDifference} mi</p><p>Cost delta: ${Math.abs(comparison.costDifference).toLocaleString()}</p><p>Power delta: {comparison.powerDifference} kW</p><p>Torque delta: {comparison.torqueDifference} Nm</p></div>}
        <SavedProjects projects={projects} clearProjects={onClear} onLoadProject={onLoad} onDeleteProject={onDelete} onEditProject={onEdit} />
      </>}
      <BuildComparison projects={projects} />
    </>
  );
}
