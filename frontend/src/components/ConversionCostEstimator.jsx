import { useState } from "react";

const ENGINEERING_REVIEW_COST = 2500;
const MISCELLANEOUS_COMPONENTS_COST = 3000;
const DEFAULT_LABOR_RATE = 125;
const DEFAULT_LABOR_HOURS = 80;

const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;

export default function ConversionCostEstimator({ battery, motor, estimatedRange = 0 }) {
  const [laborRate, setLaborRate] = useState(DEFAULT_LABOR_RATE);
  const [laborHours, setLaborHours] = useState(DEFAULT_LABOR_HOURS);

  const batteryCost = Number(battery?.cost) || 0;
  const motorCost = Number(motor?.cost) || 0;
  const laborCost = (Number(laborRate) || 0) * (Number(laborHours) || 0);
  const totalCost = batteryCost + motorCost + laborCost + ENGINEERING_REVIEW_COST + MISCELLANEOUS_COMPONENTS_COST;
  const range = Number(estimatedRange) || 0;
  const costPerMile = range > 0 ? totalCost / range : 0;

  return (
    <section className="conversion-cost-estimator">
      <div className="conversion-cost-header">
        <div>
          <p className="conversion-cost-eyebrow">Build Economics</p>
          <h2>Conversion Cost Estimate</h2>
        </div>
        <span className="conversion-cost-total">{formatCurrency(totalCost)}</span>
      </div>

      <div className="cost-assumptions">
        <h3>Configurable Assumptions</h3>
        <label>
          Labor Rate
          <span className="cost-input-wrap">
            <span>$</span>
            <input type="number" min="0" step="5" value={laborRate} onChange={(event) => setLaborRate(event.target.value)} />
            <span>/hr</span>
          </span>
        </label>
        <label>
          Estimated Labor Hours
          <input type="number" min="0" step="1" value={laborHours} onChange={(event) => setLaborHours(event.target.value)} />
        </label>
      </div>

      <div className="conversion-cost-grid">
        <article className="conversion-cost-card"><span>Battery Cost</span><strong>{formatCurrency(batteryCost)}</strong></article>
        <article className="conversion-cost-card"><span>Motor Cost</span><strong>{formatCurrency(motorCost)}</strong></article>
        <article className="conversion-cost-card"><span>Estimated Labor Hours</span><strong>{Number(laborHours) || 0} hrs</strong></article>
        <article className="conversion-cost-card"><span>Labor Rate</span><strong>{formatCurrency(Number(laborRate) || 0)}/hr</strong></article>
        <article className="conversion-cost-card"><span>Labor Cost</span><strong>{formatCurrency(laborCost)}</strong></article>
        <article className="conversion-cost-card"><span>Engineering Review Fee</span><strong>{formatCurrency(ENGINEERING_REVIEW_COST)}</strong></article>
        <article className="conversion-cost-card"><span>Misc Components Fee</span><strong>{formatCurrency(MISCELLANEOUS_COMPONENTS_COST)}</strong></article>
      </div>

      <div className="conversion-cost-summary">
        <div><span>Total Conversion Cost</span><strong>{formatCurrency(totalCost)}</strong></div>
        <div><span>Estimated Range</span><strong>{range ? `${range} miles` : "Not available"}</strong></div>
        <div><span>Cost Per Mile of Range</span><strong>{range ? formatCurrency(costPerMile) : "Not available"}</strong></div>
      </div>
    </section>
  );
}
