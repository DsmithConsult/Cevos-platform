import { useMemo, useState } from "react";

const getNumber = (value) => Number(value) || 0;

const getRange = (vehicle) => {
  if (vehicle.estimatedRangeMiles) return getNumber(vehicle.estimatedRangeMiles);
  const match = String(vehicle.estimatedRange || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getConfidence = (vehicle) => getNumber(vehicle.suitabilityScore || vehicle.confidenceScore);

const getCandidateTier = (catalogIndex) => {
  if (catalogIndex >= 90) return { label: "90+ unverified index", className: "candidate-excellent" };
  if (catalogIndex >= 75) return { label: "75-89 unverified index", className: "candidate-good" };
  if (catalogIndex >= 50) return { label: "50-74 unverified index", className: "candidate-moderate" };
  return { label: "Below 50 unverified index", className: "candidate-high-risk" };
};

const formatRange = (vehicle, range) => vehicle.estimatedRange || (range ? `${range} miles` : "Not provided");

export default function ConversionCandidateRankings({ vehicles = [] }) {
  const [sortBy, setSortBy] = useState("catalogIndex");

  const rankings = useMemo(() => {
    return vehicles
      .map((vehicle) => {
        const catalogIndex = getConfidence(vehicle);
        const range = getRange(vehicle);
        return { vehicle, catalogIndex, range, tier: getCandidateTier(catalogIndex) };
      })
      .sort((left, right) => {
        if (sortBy === "catalogIndex") return right.catalogIndex - left.catalogIndex;
        if (sortBy === "range") return right.range - left.range;
        if (sortBy === "vehicleType") return String(left.vehicle.vehicleType || "").localeCompare(String(right.vehicle.vehicleType || ""));
        return right.catalogIndex - left.catalogIndex;
      })
      .slice(0, 10);
  }, [sortBy, vehicles]);

  return (
    <section className="candidate-rankings">
      <div className="candidate-rankings-header">
        <div>
          <p className="vehicle-details-eyebrow">Catalog Analysis</p>
          <h2>Top 10 EV Conversion Candidates</h2>
          <p>Catalog indices are unverified and are not engineering compatibility ratings.</p>
        </div>
        <label className="candidate-sort-control">
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="catalogIndex">Catalog index (unverified)</option>
            <option value="range">Estimated Range</option>
            <option value="vehicleType">Vehicle Type</option>
          </select>
        </label>
      </div>

      <div className="candidate-tier-legend" aria-label="Unverified catalog index bands">
        <span className="candidate-tier candidate-excellent">90+ index</span>
        <span className="candidate-tier candidate-good">75-89 index</span>
        <span className="candidate-tier candidate-moderate">50-74 index</span>
        <span className="candidate-tier candidate-high-risk">Below 50 index</span>
      </div>

      <div className="candidate-table-wrap">
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Vehicle</th>
              <th>Catalog index (unverified)</th>
              <th>Recommended Battery</th>
              <th>Recommended Motor</th>
              <th>Estimated Range</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((candidate, index) => {
              const { vehicle } = candidate;
              return (
                <tr className={candidate.tier.className} key={`${vehicle.id}-${vehicle.make}-${vehicle.model}`}>
                  <td><strong>{index + 1}</strong></td>
                  <td>
                    <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                    <span className="candidate-tier-label">{candidate.tier.label}</span>
                  </td>
                  <td>{Math.round(candidate.catalogIndex)}/100</td>
                  <td>{vehicle.recommendedBattery || `${vehicle.recommendedBatteryKWh || "Not provided"} kWh`}</td>
                  <td>{vehicle.recommendedMotor || `${vehicle.recommendedMotorKW || "Not provided"} kW`}</td>
                  <td>{formatRange(vehicle, candidate.range)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!rankings.length && <p className="candidate-empty-state">No vehicles are available to rank.</p>}
    </section>
  );
}
