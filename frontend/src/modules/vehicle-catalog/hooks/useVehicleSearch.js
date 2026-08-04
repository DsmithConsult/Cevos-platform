import { useEffect, useState } from 'react';
import { searchVehicles } from '../services/vehicleService';

export default function useVehicleSearch(search = '', vehicleType = '') {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setLoading(true);
      const data = await searchVehicles({ search, vehicleType });
      if (isActive) {
        setVehicles(data);
        setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [search, vehicleType]);

  return { vehicles, loading };
}
