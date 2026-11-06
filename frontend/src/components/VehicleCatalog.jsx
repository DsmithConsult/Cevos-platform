import VehicleImporter from "./VehicleImporter";

export default function VehicleCatalog({ filteredVehicles, catalogSource, searchTerm, setSearchTerm, setImportedVehicles, onSelectVehicle, onLoadDemo }) {
  return (
    <>
      <button onClick={onLoadDemo}>Load QX60 Demo Build</button>
      <VehicleImporter onImport={setImportedVehicles} />
      <h2>Vehicle Search</h2>
      <input type="text" placeholder="Search by make, model, or year..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
      <p>Showing {filteredVehicles.length} vehicles ({catalogSource})</p>
      <h2>Vehicle Library</h2>
      {filteredVehicles.map((vehicle) => (
        <div className="vehicle-card" key={`${vehicle.make}-${vehicle.model}-${vehicle.id || vehicle.year}`}>
          <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
          <button onClick={() => onSelectVehicle(vehicle)}>Select Vehicle</button>
        </div>
      ))}
    </>
  );
}
