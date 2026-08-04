export default function BatterySelector({
  batteries,
  selected,
  onChange
}) {
  return (
    <section>
      <h2>Select Battery</h2>
      <select
        value={selected}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="">Select Battery</option>

        {batteries.map((b) => (
          <option key={b.id} value={b.id}>
            {b.capacity} kWh
          </option>
        ))}
      </select>
    </section>
  );
}
