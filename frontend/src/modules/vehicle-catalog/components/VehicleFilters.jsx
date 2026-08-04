export default function VehicleFilters({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">All Types</option>
      <option value="SUV">SUV</option>
      <option value="Sedan">Sedan</option>
      <option value="Truck">Truck</option>
      <option value="Van">Van</option>
    </select>
  );
}
