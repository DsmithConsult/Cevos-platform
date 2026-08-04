export default function MotorSelector({
  motors,
  selected,
  onChange
}) {
  return (
    <section>
      <h2>Select Motor</h2>
      <select
        value={selected}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="">Select Motor</option>

        {motors.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </section>
  );
}
