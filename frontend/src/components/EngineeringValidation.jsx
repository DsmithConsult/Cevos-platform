export default function EngineeringValidation({ assessment }) {
  const notAssessed = assessment?.notAssessed || [];

  return (
    <>
      <h2>Engineering Checks Not Assessed</h2>
      <p>{assessment?.disclaimer || "Preliminary screening only. This is not engineering validation or approval."}</p>
      <ul>{notAssessed.map((item) => <li key={item}>{item}</li>)}</ul>
    </>
  );
}