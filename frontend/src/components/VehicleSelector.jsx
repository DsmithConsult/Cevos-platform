export default function VehicleSelector({
  vehicles,
  selected,
  onChange
}) {
  return (
    <section>
      <h2>Select Vehicle</h2>
      <select
        value={selected}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="">Select Vehicle</option>

        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </section>
  );
}
