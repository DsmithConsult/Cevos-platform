const normalizeLocation = (location) => String(location || "").toLowerCase();

const getSectionForLocation = (component, location) => {
  const normalized = normalizeLocation(location);
  if (normalized.includes("rear")) return "rear";
  if (normalized.includes("front") || normalized.includes("radiator") || normalized.includes("engine")) return "front";
  if (component === "battery") return "center";
  if (component === "electronics") return "rear";
  return "center";
};

const displayLocation = (location) => location || "Not provided";

export default function VehiclePackagingDiagram({ vehicle }) {
  const markers = [
    { key: "motor", label: "Motor", location: vehicle.motorLocation, color: "#38bdf8" },
    { key: "thermal", label: "Thermal System", location: vehicle.thermalSystemLocation, color: "#f97316" },
    { key: "battery", label: "Battery", location: vehicle.batteryLocation, color: "#22c55e" },
    { key: "electronics", label: "Electronics", location: vehicle.electronicsLocation, color: "#a78bfa" },
  ].map((marker) => ({
    ...marker,
    section: getSectionForLocation(marker.key, marker.location),
  }));

  return (
    <section className="vehicle-packaging-diagram">
      <div className="vehicle-packaging-heading">
        <div>
          <p className="vehicle-details-eyebrow">Engineering Layout</p>
          <h2>Vehicle Packaging Diagram</h2>
        </div>
        <span className="vehicle-packaging-caption">Top-down view</span>
      </div>

      <div className="vehicle-packaging-layout">
        <svg className="vehicle-packaging-svg" viewBox="0 0 760 300" role="img" aria-label="Top-down vehicle packaging diagram">
          <rect className="packaging-vehicle-shell" x="24" y="28" width="712" height="244" rx="82" />
          <rect className="packaging-zone packaging-front" x="48" y="52" width="214" height="196" rx="52" />
          <rect className="packaging-zone packaging-center" x="273" y="52" width="214" height="196" rx="20" />
          <rect className="packaging-zone packaging-rear" x="498" y="52" width="214" height="196" rx="52" />
          <line className="packaging-divider" x1="273" y1="52" x2="273" y2="248" />
          <line className="packaging-divider" x1="487" y1="52" x2="487" y2="248" />
          <text className="packaging-zone-label" x="155" y="82">FRONT</text>
          <text className="packaging-zone-label" x="380" y="82">CENTER</text>
          <text className="packaging-zone-label" x="605" y="82">REAR</text>
          <g className="packaging-wheel" transform="translate(80 20)"><rect width="48" height="24" rx="8" /></g>
          <g className="packaging-wheel" transform="translate(632 20)"><rect width="48" height="24" rx="8" /></g>
          <g className="packaging-wheel" transform="translate(80 256)"><rect width="48" height="24" rx="8" /></g>
          <g className="packaging-wheel" transform="translate(632 256)"><rect width="48" height="24" rx="8" /></g>
          {markers.map((marker, index) => {
            const sectionIndex = { front: 0, center: 1, rear: 2 }[marker.section];
            const x = 155 + sectionIndex * 225;
            const y = 118 + index * 28;
            return (
              <g key={marker.key} transform={`translate(${x} ${y})`}>
                <circle className="packaging-marker" cx="0" cy="0" r="9" fill={marker.color} />
                <text className="packaging-marker-label" x="16" y="5">{marker.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="vehicle-packaging-legend">
        {markers.map((marker) => (
          <div className="packaging-legend-item" key={marker.key}>
            <span className="packaging-legend-dot" style={{ backgroundColor: marker.color }} />
            <span><strong>{marker.label}</strong> {displayLocation(marker.location)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
