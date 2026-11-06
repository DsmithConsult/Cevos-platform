import { getWeightBalanceEstimate } from "../services/weightBalance";
import { getVerifiedComponentWeightLb } from "../services/componentData";

const FIELDS = [
  { key: "vehicleWeightLb", label: "Vehicle curb weight (lb)", help: "Measured before conversion, with the old drivetrain installed." },
  { key: "frontAxleWeightLb", label: "Front axle scale weight (lb)", help: "Scale the vehicle in the same condition as its curb weight." },
  { key: "wheelbaseIn", label: "Wheelbase (in)", help: "Measure between the front and rear axle centers." },
  { key: "removedDrivetrainWeightLb", label: "Removed drivetrain weight (lb)", help: "Combined mass removed from the vehicle, such as engine, transmission, and fuel." },
  { key: "removedDrivetrainPositionIn", label: "Removed drivetrain center from front axle (in)", help: "Longitudinal center of the removed mass, measured rearward from the front axle." },
  { key: "batteryWeightLb", label: "Battery weight (lb)", help: "Use the selected pack's verified mass, including its enclosure." },
  { key: "batteryPositionIn", label: "Battery center from front axle (in)", help: "Longitudinal center of the battery, measured rearward from the front axle." },
  { key: "motorWeightLb", label: "Motor weight (lb)", help: "Use the selected motor's verified mass." },
  { key: "motorPositionIn", label: "Motor center from front axle (in)", help: "Longitudinal center of the motor, measured rearward from the front axle." },
];

const formatLoad = (value) => `${Math.round(value).toLocaleString()} lb`;

export default function WeightBalanceAnalysis({ inputs, onChange, estimate, battery, motor }) {
  const currentEstimate = estimate || getWeightBalanceEstimate(inputs);
  const batteryWeight = getVerifiedComponentWeightLb(battery);
  const motorWeight = getVerifiedComponentWeightLb(motor);
  const batteryWeightHelp = batteryWeight === null
    ? "No sourced catalog weight for the selected pack; enter its verified mass, including the enclosure."
    : `Sourced catalog mass: ${batteryWeight.toLocaleString()} lb (${battery.weightSourceUrl}).`;
  const motorWeightHelp = motorWeight === null
    ? "No sourced catalog weight for the selected motor; enter its verified mass."
    : `Sourced catalog mass: ${motorWeight.toLocaleString()} lb (${motor.weightSourceUrl}).`;
  const fieldHelp = {
    batteryWeightLb: batteryWeightHelp,
    motorWeightLb: motorWeightHelp,
  };
  const additionalComponents = Array.isArray(inputs.additionalComponents) ? inputs.additionalComponents : [];
  const updateComponent = (index, field, value) => {
    onChange("additionalComponents", additionalComponents.map((component, componentIndex) => (
      componentIndex === index ? { ...component, [field]: value } : component
    )));
  };
  const addComponent = () => {
    onChange("additionalComponents", [
      ...additionalComponents,
      { name: "", direction: "added", weightLb: "", positionIn: "", sourceUrl: "" },
    ]);
  };
  const removeComponent = (index) => {
    onChange("additionalComponents", additionalComponents.filter((_, componentIndex) => componentIndex !== index));
  };

  return (
    <section className="weight-balance-analysis" aria-labelledby="weight-balance-heading">
      <p className="vehicle-details-eyebrow">Input-based estimate</p>
      <h2 id="weight-balance-heading">Weight-Balance Planning</h2>
      <p>
        Enter measured vehicle data and verified component weights. Axle loads use a
        static, two-axle moment calculation and do not assess axle ratings, suspension,
        occupants, other conversion parts, or dynamic loads.
      </p>
      <div className="weight-balance-fields">
        {FIELDS.map(({ key, label, help }) => (
          <label key={key} htmlFor={`weight-balance-${key}`}>
            {label}
            <input
              id={`weight-balance-${key}`}
              type="number"
              min="0"
              step="any"
              value={inputs[key]}
              onChange={(event) => onChange(key, event.target.value)}
              aria-describedby={`weight-balance-help-${key}`}
            />
            <span id={`weight-balance-help-${key}`}>{fieldHelp[key] || help}</span>
          </label>
        ))}
        <label htmlFor="weight-balance-battery-source">
          Battery weight source URL (optional)
          <input
            id="weight-balance-battery-source"
            type="url"
            inputMode="url"
            placeholder="https://..."
            value={inputs.batteryWeightSourceUrl || ""}
            onChange={(event) => onChange("batteryWeightSourceUrl", event.target.value)}
            aria-describedby="weight-balance-battery-source-help"
          />
          <span id="weight-balance-battery-source-help">
            Link the manufacturer datasheet or other source for the entered pack weight.
            The link is recorded, not independently verified.
          </span>
        </label>
        <label htmlFor="weight-balance-motor-source">
          Motor weight source URL (optional)
          <input
            id="weight-balance-motor-source"
            type="url"
            inputMode="url"
            placeholder="https://..."
            value={inputs.motorWeightSourceUrl || ""}
            onChange={(event) => onChange("motorWeightSourceUrl", event.target.value)}
            aria-describedby="weight-balance-motor-source-help"
          />
          <span id="weight-balance-motor-source-help">
            Link the manufacturer datasheet or other source for the entered motor weight.
            The link is recorded, not independently verified.
          </span>
        </label>
      </div>
      <div className="weight-balance-components">
        <h3>Other conversion components</h3>
        <p>Enter each additional part once, including its mass and center position from the front axle.</p>
        {additionalComponents.map((component, index) => (
          <fieldset className="weight-balance-component" key={index}>
            <legend>Additional component {index + 1}</legend>
            <label htmlFor={`weight-balance-component-name-${index}`}>
              Component name
              <input
                id={`weight-balance-component-name-${index}`}
                value={component.name}
                onChange={(event) => updateComponent(index, "name", event.target.value)}
                placeholder="e.g. inverter"
              />
            </label>
            <label htmlFor={`weight-balance-component-direction-${index}`}>
              Change
              <select
                id={`weight-balance-component-direction-${index}`}
                value={component.direction}
                onChange={(event) => updateComponent(index, "direction", event.target.value)}
              >
                <option value="added">Added</option>
                <option value="removed">Removed</option>
              </select>
            </label>
            <label htmlFor={`weight-balance-component-weight-${index}`}>
              Weight (lb)
              <input
                id={`weight-balance-component-weight-${index}`}
                type="number"
                min="0"
                step="any"
                value={component.weightLb}
                onChange={(event) => updateComponent(index, "weightLb", event.target.value)}
              />
            </label>
            <label htmlFor={`weight-balance-component-position-${index}`}>
              Center from front axle (in)
              <input
                id={`weight-balance-component-position-${index}`}
                type="number"
                min="0"
                step="any"
                value={component.positionIn}
                onChange={(event) => updateComponent(index, "positionIn", event.target.value)}
              />
            </label>
            <label htmlFor={`weight-balance-component-source-${index}`}>
              Weight source URL (optional)
              <input
                id={`weight-balance-component-source-${index}`}
                type="url"
                inputMode="url"
                placeholder="https://..."
                value={component.sourceUrl}
                onChange={(event) => updateComponent(index, "sourceUrl", event.target.value)}
              />
              <span>User-provided link; it is recorded, not independently verified.</span>
            </label>
            <button type="button" onClick={() => removeComponent(index)}>Remove component</button>
          </fieldset>
        ))}
        <button type="button" onClick={addComponent}>Add component</button>
      </div>
      <p className="weight-balance-disclaimer">
        Preliminary planning only—not engineering validation or a safe-load determination.
        The estimate assumes level ground and includes only the entered removed drivetrain,
        battery, motor, and additional component masses.
      </p>
      {currentEstimate.status === "incomplete" && (
        <p role="status">Complete all inputs to calculate estimated axle loads.</p>
      )}
      {currentEstimate.status === "invalid" && (
        <ul role="alert">{currentEstimate.errors.map((error) => <li key={error}>{error}</li>)}</ul>
      )}
      {currentEstimate.status === "calculated" && (
        <div className="weight-balance-results" aria-live="polite">
          <h3>Estimated axle loads</h3>
          <p>Front: {formatLoad(currentEstimate.frontAxleLoadLb)} ({currentEstimate.frontAxlePercent.toFixed(1)}%)</p>
          <p>Rear: {formatLoad(currentEstimate.rearAxleLoadLb)} ({currentEstimate.rearAxlePercent.toFixed(1)}%)</p>
          <p>Estimated total vehicle weight: {formatLoad(currentEstimate.estimatedVehicleWeightLb)}</p>
        </div>
      )}
    </section>
  );
}
