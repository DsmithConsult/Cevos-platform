const projects = [
  {
    name: "Infiniti QX60 EV Conversion",
    range: "285 mi",
    cost: "$22,650",
    status: "Draft",
  },
];

const vehicles = ["Infiniti QX60", "Ford Explorer", "Honda Accord"];

const components = [
  { label: "Motor", value: "HyperDrive 250" },
  { label: "Battery", value: "95 kWh" },
  { label: "Inverter", value: "400V" },
];

const summary = [
  { label: "Range", value: "285 Miles" },
  { label: "Power", value: "250 kW" },
  { label: "Vehicle Weight", value: "5,150 lbs" },
  { label: "Conversion Cost", value: "$22,650" },
];

function App() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>CEVOS Dashboard</h1>

      <h2>Choose Vehicle</h2>

      {vehicles.map((vehicle) => (
        <button
          key={vehicle}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "10px",
            padding: "12px",
          }}
        >
          {vehicle}
        </button>
      ))}

      <h2>Selected Components</h2>

      {components.map((component) => (
        <div key={component.label}>
          <strong>{component.label}:</strong> {component.value}
        </div>
      ))}

      <h2>Conversion Summary</h2>

      {summary.map((item) => (
        <div key={item.label}>
          <strong>{item.label}:</strong> {item.value}
        </div>
      ))}

      <h2>Projects</h2>

      {projects.map((project) => (
        <div key={project.name}>
          <h3>{project.name}</h3>
          <p>Range: {project.range}</p>
          <p>Cost: {project.cost}</p>
          <p>Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;