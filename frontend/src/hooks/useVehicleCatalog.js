import { useEffect, useMemo, useState } from "react";
import vehicles from "../data/vehicles";
import { getVehicles } from "../services/api";

export default function useVehicleCatalog() {
  const [catalogVehicles, setCatalogVehicles] = useState(vehicles);
  const [importedVehicles, setImportedVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [catalogSource, setCatalogSource] = useState("Local catalog");

  useEffect(() => {
    let isActive = true;

    getVehicles()
      .then((apiVehicles) => {
        if (isActive && apiVehicles.length) {
          setCatalogVehicles(apiVehicles);
          setCatalogSource("Backend API");
        }
      })
      .catch(() => {
        if (isActive) setCatalogSource("Local catalog (API unavailable)");
      });

    return () => {
      isActive = false;
    };
  }, []);

  const allVehicles = [...catalogVehicles, ...importedVehicles];
  const filteredVehicles = useMemo(
    () =>
      allVehicles.filter((vehicle) =>
        `${vehicle.year} ${vehicle.make} ${vehicle.model}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [catalogVehicles, importedVehicles, searchTerm]
  );

  return {
    catalogVehicles,
    importedVehicles,
    setImportedVehicles,
    searchTerm,
    setSearchTerm,
    catalogSource,
    filteredVehicles,
    allVehicles,
  };
}
