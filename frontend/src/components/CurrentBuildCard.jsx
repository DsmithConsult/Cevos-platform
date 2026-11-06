export default function CurrentBuildCard({ build }) {
  return (
    <div className="results">
      <h2>Current Build</h2>
      <p><strong>Name:</strong> {build.name}</p>
      <p><strong>Status:</strong> {build.status}</p>
      <p><strong>Vehicle:</strong> {build.vehicle}</p>
      <p><strong>Battery:</strong> {build.battery}</p>
      <p><strong>Motor:</strong> {build.motor}</p>
      <p><strong>Projected Range:</strong> {build.range} miles</p>
      <p><strong>Estimated Cost:</strong> ${build.cost.toLocaleString()}</p>
    </div>
  );
}
