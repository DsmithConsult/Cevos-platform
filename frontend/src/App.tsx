const projects = [
  {
    name: 'Infiniti QX60 EV Conversion',
    range: '285 mi',
    cost: '$22,650',
    status: 'Draft',
  },
];

const vehicles = ['Infiniti QX60', 'Ford Explorer', 'Honda Accord'];
const components = [
  { label: 'Motor', value: 'HyperDrive 250' },
  { label: 'Battery', value: '95 kWh' },
  { label: 'Inverter', value: '400V' },
];
const summary = [
  { label: 'Range', value: '285 Miles' },
  { label: 'Power', value: '250 kW' },
  { label: 'Vehicle Weight', value: '5,150 lbs' },
  { label: 'Conversion Cost', value: '$22,650' },
];

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>CEVOS Dashboard</h1>
      <h2 style={{ marginTop: 0, color: '#4b5563' }}>Choose Vehicle</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {vehicles.map((vehicle) => (
          <button
            key={vehicle}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1rem',
            }}
          >
            {vehicle}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, color: '#4b5563' }}>Selected Components</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {components.map((component) => (
            <div key={component.label} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.8rem 1rem', backgroundColor: '#f9fafb' }}>
              <strong>{component.label}:</strong> {component.value}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, color: '#4b5563' }}>Conversion Summary</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {summary.map((item) => (
            <div key={item.label} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.8rem 1rem', backgroundColor: '#f9fafb' }}>
              <strong>{item.label}:</strong> {item.value}
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ marginTop: 0, color: '#4b5563' }}>Projects</h2>

      <button style={{ marginBottom: '1.5rem', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' }}>
        New Project
      </button>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.map((project) => (
          <div key={project.name} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0 }}>{project.name}</h3>
            <p><strong>Range:</strong> {project.range}</p>
            <p><strong>Cost:</strong> {project.cost}</p>
            <p><strong>Status:</strong> {project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
