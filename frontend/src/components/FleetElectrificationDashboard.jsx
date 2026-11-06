import { useMemo } from "react";

const ANNUAL_MILES = 12000;
const FUEL_PRICE = 3.5;
const ICE_MPG = 25;
const EV_KWH_PER_MILE = 0.3;
const ELECTRICITY_PRICE = 0.16;
const GAS_CO2_KG_PER_GALLON = 8.89;
const BATTERY_COST_PER_KWH = 121;
const MOTOR_COST_PER_KW = 20;
const LABOR_COST = 125 * 80;
const ENGINEERING_COST = 1500;
const COMPONENTS_COST = 2500;

const numberValue = (value) => Number(value) || 0;

const getCatalogIndex = (vehicle) => numberValue(vehicle.suitabilityScore || vehicle.confidenceScore);

const getRange = (vehicle) => {
  if (vehicle.estimatedRangeMiles) return numberValue(vehicle.estimatedRangeMiles);
  const match = String(vehicle.estimatedRange || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getBattery = (vehicle) => {
  if (vehicle.recommendedBatteryKWh) return numberValue(vehicle.recommendedBatteryKWh);
  const match = String(vehicle.recommendedBattery || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getMotor = (vehicle) => {
  if (vehicle.recommendedMotorKW) return numberValue(vehicle.recommendedMotorKW);
  const match = String(vehicle.recommendedMotor || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;
const formatNumber = (value, suffix = "") => `${Math.round(value).toLocaleString()}${suffix}`;

const buildDistribution = (values) => Object.entries(values).sort((left, right) => right[1] - left[1]);

export default function FleetElectrificationDashboard({ vehicles = [] }) {
  const dashboard = useMemo(() => {
    const total = vehicles.length || 1;
    const totalRange = vehicles.reduce((sum, vehicle) => sum + getRange(vehicle), 0);
    const totalCatalogIndex = vehicles.reduce((sum, vehicle) => sum + getCatalogIndex(vehicle), 0);
    const totalCost = vehicles.reduce((sum, vehicle) => {
      const battery = getBattery(vehicle) * BATTERY_COST_PER_KWH;
      const motor = getMotor(vehicle) * MOTOR_COST_PER_KW;
      return sum + battery + motor + LABOR_COST + ENGINEERING_COST + COMPONENTS_COST;
    }, 0);
    const annualGasGallons = ANNUAL_MILES / ICE_MPG;
    const annualEvKwh = ANNUAL_MILES * EV_KWH_PER_MILE;
    const annualCo2Reduction = (annualGasGallons * GAS_CO2_KG_PER_GALLON - annualEvKwh * 0.35) * vehicles.length;
    const annualFuelSavings = (annualGasGallons * FUEL_PRICE - annualEvKwh * ELECTRICITY_PRICE) * vehicles.length;
    const types = {};
    const catalogIndexBands = { "90+": 0, "75-89": 0, "50-74": 0, "Below 50": 0 };
    const batteries = {};

    vehicles.forEach((vehicle) => {
      const type = vehicle.vehicleType || vehicle.bodyStyle || "Unknown";
      types[type] = (types[type] || 0) + 1;
      const catalogIndex = getCatalogIndex(vehicle);
      if (catalogIndex >= 90) catalogIndexBands["90+"] += 1;
      else if (catalogIndex >= 75) catalogIndexBands["75-89"] += 1;
      else if (catalogIndex >= 50) catalogIndexBands["50-74"] += 1;
      else catalogIndexBands["Below 50"] += 1;
      const battery = getBattery(vehicle);
      const batteryLabel = battery ? `${battery} kWh` : "Unknown";
      batteries[batteryLabel] = (batteries[batteryLabel] || 0) + 1;
    });

    return {
      totalVehicles: vehicles.length,
      averageCatalogIndex: totalCatalogIndex / total,
      averageRange: totalRange / total,
      averageCost: totalCost / total,
      co2Reduction: annualCo2Reduction,
      fuelSavings: annualFuelSavings,
      typeBreakdown: buildDistribution(types),
      catalogIndexDistribution: buildDistribution(catalogIndexBands),
      batteryDistribution: buildDistribution(batteries),
    };
  }, [vehicles]);

  return (
    <section className="fleet-dashboard">
      <div className="fleet-dashboard-heading">
        <div>
          <p className="vehicle-details-eyebrow">Fleet Intelligence</p>
          <h2>Fleet Electrification Dashboard</h2>
        </div>
        <span className="fleet-dashboard-note">Planning estimates</span>
      </div>

      <div className="fleet-kpi-grid">
        <article className="fleet-kpi-card"><span>Total Vehicles</span><strong>{dashboard.totalVehicles}</strong></article>
        <article className="fleet-kpi-card"><span>Average catalog index (unverified)</span><strong>{formatNumber(dashboard.averageCatalogIndex, "/100")}</strong></article>
        <article className="fleet-kpi-card"><span>Average Range</span><strong>{formatNumber(dashboard.averageRange, " mi")}</strong></article>
        <article className="fleet-kpi-card"><span>Average Conversion Cost</span><strong>{formatCurrency(dashboard.averageCost)}</strong></article>
        <article className="fleet-kpi-card fleet-impact-card"><span>Estimated CO2 Reduction</span><strong>{formatNumber(dashboard.co2Reduction / 1000, " t/yr")}</strong></article>
        <article className="fleet-kpi-card fleet-impact-card"><span>Estimated Fuel Savings</span><strong>{formatCurrency(dashboard.fuelSavings)}/yr</strong></article>
      </div>

      <div className="fleet-chart-grid">
        <DistributionChart title="Vehicle Type Breakdown" entries={dashboard.typeBreakdown} color="blue" />
        <DistributionChart title="Catalog index bands (unverified)" entries={dashboard.catalogIndexDistribution} color="green" />
        <DistributionChart title="Recommended Battery Distribution" entries={dashboard.batteryDistribution} color="orange" />
      </div>
    </section>
  );
}

function DistributionChart({ title, entries, color }) {
  const maximum = Math.max(...entries.map((entry) => entry[1]), 1);
  return (
    <article className="fleet-chart-card">
      <h3>{title}</h3>
      {entries.length ? entries.map(([label, value]) => (
        <div className="fleet-chart-row" key={label}>
          <div className="fleet-chart-label"><span>{label}</span><strong>{value}</strong></div>
          <div className="fleet-chart-track"><span className={`fleet-chart-bar fleet-chart-${color}`} style={{ width: `${(value / maximum) * 100}%` }} /></div>
        </div>
      )) : <p className="candidate-empty-state">No data available.</p>}
    </article>
  );
}
