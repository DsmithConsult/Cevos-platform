import { useEffect, useMemo, useState } from 'react';

import VehicleSearch from '../components/VehicleSearch';
import VehicleFilters from '../components/VehicleFilters';
import VehicleGrid from '../components/VehicleGrid';
import { searchVehicles } from '../services/vehicleService';

export default function VehicleCatalogPage() {
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      const data = await searchVehicles({ search, vehicleType });
      setVehicles(data);
      setLoading(false);
    };

    loadVehicles();
  }, [search, vehicleType]);

  const summary = useMemo(() => ({
    count: vehicles.length,
    selected: selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'None'
  }), [selectedVehicle, vehicles.length]);

  return (
    <div className="catalog-page">
      <h1>Vehicle Catalog</h1>
      <p className="catalog-summary">Showing {summary.count} vehicles • Selected: {summary.selected}</p>

      <div className="catalog-controls">
        <VehicleSearch value={search} onChange={setSearch} />
        <VehicleFilters value={vehicleType} onChange={setVehicleType} />
      </div>

      {loading ? <p>Loading vehicles…</p> : <VehicleGrid vehicles={vehicles} onSelect={setSelectedVehicle} />}
    </div>
  );
}
