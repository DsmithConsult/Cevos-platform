export default function SavedProjects({
  projects,
  clearProjects,
  onLoadProject,
  onDeleteProject,
  onEditProject,
}) {
  return (
    <>
      <hr />

      <h2>Saved Projects</h2>

      <button
        onClick={clearProjects}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          marginRight: "10px",
        }}
      >
        Clear Projects
      </button>

      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3>{project.name}</h3>

          <p>
            <strong>Status:</strong> {project.status || "Draft"}
          </p>

          <p>
            <strong>Battery:</strong> {project.battery}
          </p>

          <p>
            <strong>Motor:</strong> {project.motor}
          </p>

          <p>
            <strong>Range:</strong> {project.range} miles
          </p>

          <p>
            <strong>Cost:</strong> ${project.cost.toLocaleString()}
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => onLoadProject(project)}>Load</button>
            <button onClick={() => onEditProject(project)}>Edit</button>
            <button onClick={() => onDeleteProject(project.id)}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}