export default function ResultsPanel({
  range,
  power,
  cost
}) {
  return (
    <section className="results">
      <h2>Results</h2>

      <p>
        <strong>Estimated Range:</strong> {range} miles
      </p>

      <p>
        <strong>Power:</strong> {power} kW
      </p>

      <p>
        <strong>Estimated Cost:</strong> ${cost.toLocaleString()}
      </p>
    </section>
  );
}
