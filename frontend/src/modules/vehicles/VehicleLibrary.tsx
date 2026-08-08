import VehicleCard from "./VehicleCard";
import vehicles from "../../data/vehicles.json";

export default function VehicleLibrary() {
  return (
    <div>
      <h1>Vehicle Library</h1>

      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          make={vehicle.make}
          model={vehicle.model}
          year={vehicle.year}
          drivetrain={vehicle.drivetrain}
        />
      ))}
    </div>
  );
}