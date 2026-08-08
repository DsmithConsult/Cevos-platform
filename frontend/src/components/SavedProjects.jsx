export default function SavedProjects({
  projects,
  clearProjects,
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
            <strong>Battery:</strong>{" "}
            {project.battery}
          </p>

          <p>
            <strong>Motor:</strong>{" "}
            {project.motor}
          </p>

          <p>
            <strong>Range:</strong>{" "}
            {project.range} miles
          </p>

          <p>
            <strong>Cost:</strong> $
            {project.cost.toLocaleString()}
          </p>
        </div>
      ))}
    </>
  );
}