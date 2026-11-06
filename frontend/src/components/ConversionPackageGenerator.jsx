import { useMemo } from "react";

const TARGET_COST = 15000;

const packageProfiles = {
  economy: { label: "Economy Package", battery: "75 kWh NMC Pack", motor: "Phoenix HyperDrive 180", range: 225, cost: 14500 },
  standard: { label: "Standard Package", battery: "95 kWh NMC Pack", motor: "Phoenix HyperDrive 250", range: 285, cost: 18500 },
  longRange: { label: "Long Range Package", battery: "120 kWh NMC Pack", motor: "Phoenix HyperDrive 300", range: 310, cost: 23500 },
  commercial: { label: "Commercial Fleet Package", battery: "120 kWh NMC Pack", motor: "Phoenix HyperDrive 300", range: 300, cost: 21500 },
};

const getRange = (vehicle) => {
  if (vehicle?.estimatedRangeMiles) return Number(vehicle.estimatedRangeMiles) || 0;
  return Number(String(vehicle?.estimatedRange || "").match(/\d+/)?.[0]) || 0;
};

const getPayload = (vehicle) => {
  if (vehicle?.payloadCapacityLbs) return Number(vehicle.payloadCapacityLbs) || 0;
  const gvwr = Number(vehicle?.gvwrLbs) || 0;
  const curbWeight = Number(vehicle?.curbWeightLbs) || 0;
  return Math.max(0, gvwr - curbWeight);
};

const getPackageKey = (vehicle, targetCost, rangeGoal, payloadRequirements) => {
  const type = String(vehicle?.vehicleType || "").toLowerCase();
  if (type === "van" || type === "truck" || payloadRequirements >= 1500) return "commercial";
  if (rangeGoal >= 290 || (targetCost > 20000 && rangeGoal >= 260)) return "longRange";
  if (targetCost <= TARGET_COST || rangeGoal <= 225) return "economy";
  return "standard";
};

export default function ConversionPackageGenerator({
  selectedVehicle,
  selectedBattery,
  selectedMotor,
  targetCost = TARGET_COST,
  rangeGoal,
  payloadRequirements = 0,
}) {
  const packageResult = useMemo(() => {
    const resolvedRangeGoal = Number(rangeGoal) || getRange(selectedVehicle) || 250;
    const packageKey = getPackageKey(selectedVehicle, Number(targetCost) || TARGET_COST, resolvedRangeGoal, Number(payloadRequirements) || 0);
    const profile = packageProfiles[packageKey];
    return {
      ...profile,
      meetsTarget: profile.cost <= (Number(targetCost) || TARGET_COST),
      payload: getPayload(selectedVehicle),
      rangeGoal: resolvedRangeGoal,
    };
  }, [payloadRequirements, rangeGoal, selectedVehicle, targetCost]);

  return (
    <section className="conversion-package-generator">
      <div className="conversion-package-header">
        <div>
          <p className="vehicle-details-eyebrow">Illustrative Template</p>
          <h2>Conversion Package Suggestion</h2>
        </div>
        <span className={`package-target-status ${packageResult.meetsTarget ? "package-target-good" : "package-target-review"}`}>
          {packageResult.meetsTarget ? "Meets $15,000 Target" : "Above $15,000 Target"}
        </span>
      </div>

      <p className="conversion-package-context">
        Generated from {selectedVehicle?.vehicleType || "vehicle"} requirements, a {packageResult.rangeGoal}-mile range goal, and {packageResult.payload || "unknown"} lbs available payload.
      </p>

      <div className="conversion-package-card">
        <div className="conversion-package-title">
          <h3>{packageResult.label}</h3>
          <strong>Not validated for fitment or engineering compatibility</strong>
        </div>
        <div className="conversion-package-grid">
          <div><span>Battery</span><strong>{packageResult.battery}</strong></div>
          <div><span>Motor</span><strong>{packageResult.motor}</strong></div>
          <div><span>Expected Range</span><strong>{packageResult.range} miles</strong></div>
          <div><span>Estimated Cost</span><strong>${packageResult.cost.toLocaleString()}</strong></div>
          <div><span>Current Selection</span><strong>{selectedBattery?.name || "Package default"}</strong></div>
          <div><span>Motor Selection</span><strong>{selectedMotor?.name || "Package default"}</strong></div>
        </div>
      </div>

      <p className="conversion-package-note">
        {packageResult.meetsTarget ? "Illustrative profile is below the entered cost target." : "Illustrative profile is above the entered cost target."} Verify all component specifications, fitment, and prices independently.
      </p>
    </section>
  );
}
