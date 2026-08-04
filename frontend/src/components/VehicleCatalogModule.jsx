import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 4;

export default function VehicleCatalogModule() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost:5000/api/vehicles')
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data);
        if (data.length > 0) {
          setSelectedVehicleId(data[0].id);
        }
      })
      .catch(() => setVehicles([]));
  }, []);

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) {
      return vehicles;
    }

    const term = search.toLowerCase();
    return vehicles.filter((vehicle) =>
      `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase().includes(term)
    );
  }, [vehicles, search]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageVehicles = filteredVehicles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) || null;

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <section className="catalog-panel">
      <div className="catalog-header">
        <div>
          <p className="eyebrow">Vehicle Catalog</p>
          <h2>Browse conversion-ready vehicles</h2>
        </div>
        <div className="status-pill">Database-backed data</div>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by make, model, or year"
        className="catalog-search"
      />

      <div className="catalog-grid">
        <div className="catalog-list">
          {pageVehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              className={`catalog-card ${selectedVehicleId === vehicle.id ? 'selected' : ''}`}
              onClick={() => setSelectedVehicleId(vehicle.id)}
            >
              <strong>{vehicle.make} {vehicle.model}</strong>
              <span>{vehicle.year} • {vehicle.vehicleType || 'Vehicle'}</span>
              <small>Range: {vehicle.estimatedRangeMiles ?? 0} mi</small>
            </button>
          ))}
        </div>

        <div className="catalog-detail">
          {selectedVehicle ? (
            <>
              <h3>{selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year}</h3>
              <p>{selectedVehicle.trim || 'AWD'} • {selectedVehicle.bodyStyle || 'Crossover'}</p>
              <ul>
                <li>Recommended battery: {selectedVehicle.recommendedBatteryKWh ?? 0} kWh</li>
                <li>Recommended motor: {selectedVehicle.recommendedMotorKW ?? 0} kW</li>
                <li>Estimated range: {selectedVehicle.estimatedRangeMiles ?? 0} mi</li>
                <li>Confidence: {selectedVehicle.confidenceScore ?? 0}%</li>
              </ul>
              <div className="catalog-thermal">
                <p><strong>Thermal overview</strong></p>
                <div>Performance: {selectedVehicle.thermalSummary?.thermalPerformancePct ?? 92}%</div>
                <div>Motor cooling: {selectedVehicle.thermalSummary?.motorCoolingPct ?? 98}%</div>
                <div>Battery cooling: {selectedVehicle.thermalSummary?.batteryCoolingPct ?? 85}%</div>
              </div>
            </>
          ) : (
            <p>No vehicles available.</p>
          )}
        </div>
      </div>

      <div className="catalog-pagination">
        <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1}>
          Previous
        </button>
        <span>Page {safePage} of {totalPages}</span>
        <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage === totalPages}>
          Next
        </button>
      </div>
    </section>
  );
}
