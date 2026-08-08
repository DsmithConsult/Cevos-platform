export default function BuildComparison({ projects }) {
  if (projects.length < 2) {
    return (
      <>
        <hr />
        <h2>Build Comparison</h2>
        <p>Save at least two projects to compare builds.</p>
      </>
    );
  }

  const build1 = projects[projects.length - 2];
  const build2 = projects[projects.length - 1];
const higherRange =
  build1.range > build2.range ? 1 : 2;

const lowerCost =
  build1.cost < build2.cost ? 1 : 2;

const higherPower =
  build1.power > build2.power ? 1 : 2;

const higherTorque =
  build1.torque > build2.torque ? 1 : 2;
  let score1 = 0;
let score2 = 0;

if (higherRange === 1) score1++;
else score2++;

if (lowerCost === 1) score1++;
else score2++;

if (higherPower === 1) score1++;
else score2++;

if (higherTorque === 1) score1++;
else score2++;

if (
  build1.readinessScore >
  build2.readinessScore
) {
  score1++;
} else if (
  build2.readinessScore >
  build1.readinessScore
) {
  score2++;
}
const winner =
  score1 > score2
    ? build1
    : score2 > score1
    ? build2
    : null;
 
  return (
    <>
      <hr />

      <h2>Build Comparison</h2>
<div
  style={{
    backgroundColor: "#1e3a1e",
    border: "1px solid #4caf50",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "20px",
  }}
>
  {winner ? (
    <>
      <strong>
        🏆 Recommended Build:
      </strong>{" "}
      {winner.name}
      <br />
Score: {score1} - {score2}
    </>
  ) : (
    <>
      <strong>🤝 Result:</strong>{" "}
      Builds are evenly matched.
    </>
  )}
</div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Metric</th>
            <th style={{ textAlign: "left" }}>
              {build1.name}
            </th>
            <th style={{ textAlign: "left" }}>
              {build2.name}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Battery</td>
            <td>{build1.battery}</td>
            <td>{build2.battery}</td>
          </tr>

          <tr>
            <td>Motor</td>
            <td>{build1.motor}</td>
            <td>{build2.motor}</td>
          </tr>
<tr>
  <td>Power</td>

  <td
    style={{
      color:
        higherPower === 1
          ? "limegreen"
          : "inherit",
      fontWeight:
        higherPower === 1
          ? "bold"
          : "normal",
    }}
  >
    {build1.power} kW
  </td>

  <td
    style={{
      color:
        higherPower === 2
          ? "limegreen"
          : "inherit",
      fontWeight:
        higherPower === 2
          ? "bold"
          : "normal",
    }}
  >
    {build2.power} kW
  </td>
</tr>

<tr>
  <td>Torque</td>

  <td
    style={{
      color:
        higherTorque === 1
          ? "limegreen"
          : "inherit",
      fontWeight:
        higherTorque === 1
          ? "bold"
          : "normal",
    }}
  >
    {build1.torque} Nm
  </td>

  <td
    style={{
      color:
        higherTorque === 2
          ? "limegreen"
          : "inherit",
      fontWeight:
        higherTorque === 2
          ? "bold"
          : "normal",
    }}
  >
    {build2.torque} Nm
  </td>
</tr>
         <tr>
  <td>Range</td>

  <td
    style={{
      color:
        higherRange === 1
          ? "limegreen"
          : "inherit",
      fontWeight:
        higherRange === 1
          ? "bold"
          : "normal",
    }}
  >
    {build1.range} mi
  </td>

  <td
    style={{
      color:
        higherRange === 2
          ? "limegreen"
          : "inherit",
      fontWeight:
        higherRange === 2
          ? "bold"
          : "normal",
    }}
  >
    {build2.range} mi
  </td>
</tr>

         <tr>
  <td>Cost</td>

  <td
    style={{
      color:
        lowerCost === 1
          ? "limegreen"
          : "inherit",
      fontWeight:
        lowerCost === 1
          ? "bold"
          : "normal",
    }}
  >
    ${build1.cost.toLocaleString()}
  </td>

  <td
    style={{
      color:
        lowerCost === 2
          ? "limegreen"
          : "inherit",
      fontWeight:
        lowerCost === 2
          ? "bold"
          : "normal",
    }}
  >
    ${build2.cost.toLocaleString()}
  </td>
</tr>
          <tr>
  <td>Readiness</td>
  <td>{build1.readinessScore}/100</td>
  <td>{build2.readinessScore}/100</td>
</tr>
        </tbody>
      </table>
    </>
  );
}