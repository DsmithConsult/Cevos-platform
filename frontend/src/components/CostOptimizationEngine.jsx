import { useMemo } from "react";

const TARGET_COST = 15000;
const LABOR_COST = 125 * 80;
const ENGINEERING_COST = 2500;
const COMPONENT_COST = 3000;

const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getStatus = (cost) => {
  if (cost <= 15000) return { label: "On Target", className: "cost-status-green" };
  if (cost <= 20000) return { label: "Manageable Gap", className: "cost-status-yellow" };
  if (cost <= 25000) return { label: "Optimization Required", className: "cost-status-orange" };
  return { label: "High Cost Risk", className: "cost-status-red" };
};

export default function CostOptimizationEngine({
  selectedVehicle,
  selectedBattery,
  selectedMotor,
  estimatedCost = 0,
  estimatedRange = 0,
  vehicles = [],
}) {
  const analysis = useMemo(() => {
    const batteryCost = Number(selectedBattery?.cost) || 0;
    const motorCost = Number(selectedMotor?.cost) || 0;
    const currentCost = batteryCost + motorCost + LABOR_COST + ENGINEERING_COST + COMPONENT_COST || Number(estimatedCost) || 0;
    const costGap = currentCost - TARGET_COST;
    const percentFromTarget = TARGET_COST ? (Math.abs(costGap) / TARGET_COST) * 100 : 0;
    const drivers = [
      { label: "Battery Cost", amount: batteryCost },
      { label: "Motor Cost", amount: motorCost },
      { label: "Labor Cost", amount: LABOR_COST },
      { label: "Engineering Cost", amount: ENGINEERING_COST },
      { label: "Miscellaneous Component Cost", amount: COMPONENT_COST },
    ];
    const largestDriver = drivers.reduce((largest, driver) => driver.amount > largest.amount ? driver : largest, drivers[0]);
    const batteryReduction = selectedVehicle && selectedBattery?.capacity > 100 ? Math.min(1500, batteryCost * 0.1) : batteryCost * 0.05;
    const laborReduction = LABOR_COST * 0.15;
    const engineeringReduction = ENGINEERING_COST * 0.2;
    const componentReduction = COMPONENT_COST * 0.15;
    const potentialSavings = Math.min(currentCost, batteryReduction + laborReduction + engineeringReduction + componentReduction);
    const optimizedCost = Math.max(0, currentCost - potentialSavings);
    const fleetCosts = vehicles.map((vehicle) => {
      const battery = Number(vehicle.recommendedBatteryKWh) || Number(String(vehicle.recommendedBattery || "").match(/\d+/)?.[0]) || 0;
      const motor = Number(vehicle.recommendedMotorKW) || Number(String(vehicle.recommendedMotor || "").match(/\d+/)?.[0]) || 0;
      return battery * 121 + motor * 20 + LABOR_COST + ENGINEERING_COST + COMPONENT_COST;
    });

    return {
      currentCost,
      costGap,
      percentFromTarget,
      drivers: drivers.map((driver) => ({ ...driver, percentage: currentCost ? (driver.amount / currentCost) * 100 : 0 })),
      largestDriver,
      potentialSavings,
      optimizedCost,
      remainingGap: optimizedCost - TARGET_COST,
      status: getStatus(currentCost),
      fleet: {
        total: vehicles.length,
        averageCost: fleetCosts.length ? fleetCosts.reduce((sum, cost) => sum + cost, 0) / fleetCosts.length : 0,
        atOrBelowTarget: fleetCosts.filter((cost) => cost <= TARGET_COST).length,
      },
    };
  }, [estimatedCost, selectedBattery, selectedMotor, selectedVehicle, vehicles]);

  const recommendations = [
    selectedVehicle && selectedBattery?.capacity > 100
      ? "Reduce battery size or use a standardized modular battery platform where range targets permit."
      : "Use a standardized battery platform and modular packaging to control integration cost.",
    "Compare supplier motor quotes only after independently confirming component compatibility.",
    "Reduce custom fabrication with pre-engineered mounting kits and increase parts commonality.",
    "Reuse validated conversion packages, cooling systems, electrical architecture, and standard wiring.",
  ];

  return (
    <section className="cost-optimization-engine">
      <div className="cost-optimization-header">
        <div>
          <p className="vehicle-details-eyebrow">Illustrative Cost Scenario</p>
          <h2>Cost Estimate</h2>
        </div>
        <span className={`cost-target-status ${analysis.status.className}`}><span className="status-dot" />{analysis.status.label}</span>
      </div>

      <div className="cost-optimization-kpis">
        <article><span>Current Cost</span><strong>{formatCurrency(analysis.currentCost)}</strong></article>
        <article><span>Target Cost</span><strong>{formatCurrency(TARGET_COST)}</strong></article>
        <article><span>Cost Gap</span><strong className={analysis.costGap > 0 ? "cost-status-red" : "cost-status-green"}>{formatCurrency(Math.abs(analysis.costGap))}</strong><small>{analysis.costGap > 0 ? `${Math.round(analysis.percentFromTarget)}% above target` : `${Math.round(analysis.percentFromTarget)}% below target`}</small></article>
      </div>

      <div className="cost-optimization-grid">
        <div className="cost-driver-panel">
          <h3>Cost Driver Analysis</h3>
          {analysis.drivers.map((driver) => (
            <div className={`cost-driver-row ${driver.label === analysis.largestDriver.label ? "cost-driver-largest" : ""}`} key={driver.label}>
              <div><span>{driver.label}</span><strong>{formatCurrency(driver.amount)}</strong></div>
              <div className="cost-driver-track"><span style={{ width: `${clamp(driver.percentage, 0, 100)}%` }} /></div>
              <small>{Math.round(driver.percentage)}% of total{driver.label === analysis.largestDriver.label ? " • Largest contributor" : ""}</small>
            </div>
          ))}
        </div>

        <div className="cost-projection-panel">
          <h3>Optimized Cost Projection</h3>
          <div><span>Current Cost</span><strong>{formatCurrency(analysis.currentCost)}</strong></div>
          <div><span>Projected Optimized Cost</span><strong>{formatCurrency(analysis.optimizedCost)}</strong></div>
          <div><span>Target Cost</span><strong>{formatCurrency(TARGET_COST)}</strong></div>
          <div><span>Remaining Gap</span><strong>{formatCurrency(Math.abs(analysis.remainingGap))}</strong></div>
          <div className="cost-savings-callout"><span>Potential Savings</span><strong>{formatCurrency(analysis.potentialSavings)}</strong></div>
          <p>Estimated range: {Number(estimatedRange) || 0} miles</p>
        </div>
      </div>

      <div className="cost-recommendations">
        <h3>Actionable Recommendations</h3>
        <p>Planning estimate only. Labor, engineering, component, and savings assumptions require shop and supplier review.</p>
        <ul>{recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}</ul>
      </div>

      <div className="cost-fleet-summary">
        <strong>Fleet Metrics</strong>
        <span>{analysis.fleet.total} vehicles analyzed</span>
        <span>Average cost: {formatCurrency(analysis.fleet.averageCost)}</span>
        <span>{analysis.fleet.atOrBelowTarget} at or below target</span>
      </div>
    </section>
  );
}
