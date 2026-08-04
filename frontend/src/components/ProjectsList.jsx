export default function ProjectsList({ projects }) {
  if (!projects.length) {
    return null;
  }

  return (
    <section className="results">
      <h2>Projects</h2>

      {projects.map((project) => (
        <div key={project.id} style={{ marginBottom: "1rem" }}>
          <strong>#{project.id} {project.name}</strong>
          <div>Range: {project.estimatedRangeMiles} mi</div>
          <div>Cost: ${Number(project.estimatedCost || 0).toLocaleString()}</div>
        </div>
      ))}
    </section>
  );
}
