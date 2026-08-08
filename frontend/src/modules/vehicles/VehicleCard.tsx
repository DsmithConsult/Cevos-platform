type Props = {
  make: string;
  model: string;
  year: number;
  drivetrain: string;
};

export default function VehicleCard({
  make,
  model,
  year,
  drivetrain,
}: Props) {
  return (
    <div className="vehicle-card">
      <h3>
        {year} {make} {model}
      </h3>

      <p>{drivetrain}</p>

      <button>Select Vehicle</button>
    </div>
  );
}